import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import { Cart, Collection, Product } from 'shopify-buy';
import Client from '../services/shopifyConnection';

interface ProductWithHandle extends Product {
  handle?: string;
}

interface SCData {
  product: Product | undefined;
  products: ProductWithHandle[] | undefined;
  checkout: Cart | undefined;
  collections: Collection[] | undefined;
  isCartOpen: boolean;
  isMenuOpen: boolean;
  createCheckout(): void;
  fetchCheckout(checkoutId: string): void;
  addItemToCheckout(variantId: string | number, quantity: number): void;
  removeLineItem(lineItemIdsToRemove: string | string[]): void;
  fetchAllProducts(): void;
  fetchProductWithHandle(handle: string): void;
  fetchCollections(): void;
  toggleCart(): void;
  toggleMenu(): void;
}

const ShopifyContext = createContext<SCData | undefined>(undefined);

const ShopifyProvider: React.FC = ({ children }) => {
  const [product, setProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>();
  const [collections, setCollections] = useState<Collection[]>();
  const [checkout, setCheckout] = useState<Cart>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  async function fetchCollections() {
    const allCollections = await Client.collection.fetchAll();
    setCollections(allCollections);
  }

  async function fetchCheckout(checkoutId: string) {
    await Client.checkout
      .fetch(checkoutId)
      .then((res) => setCheckout(res))
      .catch((error) => console.log(error));
  }

  async function createCheckout() {
    const newCheckout = await Client.checkout.create();
    localStorage.setItem('checkout_id', JSON.stringify(checkout?.id));
    setCheckout(newCheckout);
  }

  async function removeLineItem(lineItemIdsToRemove: string[]) {
    if (checkout)
      await Client.checkout
        .removeLineItems(checkout.id, lineItemIdsToRemove)
        .then((newCheckout) => setCheckout(newCheckout));
  }

  async function fetchAllProducts() {
    const allProducts = await Client.product.fetchAll();
    setProducts(allProducts);
  }

  async function addItemToCheckout(variantId: string, quantity: number) {
    if (checkout) {
      const lineItemsToAdd = [
        {
          variantId,
          // quantity: parseInt(quantity, 10),
          quantity: quantity,
        },
      ];
      const newCheckout = await Client.checkout.addLineItems(
        checkout.id,
        lineItemsToAdd
      );
      setCheckout(newCheckout);
    }
  }

  async function fetchProductWithHandle(handle: string) {
    const getProduct = await Client.product.fetchByHandle(handle);
    setProduct(getProduct);

    return getProduct;
  }

  useEffect(() => {
    const storageCheckoutId = localStorage.getItem('checkout_id');
    const storageProducts = localStorage.getItem('products');
    const storageCollections = localStorage.getItem('collections');

    if (storageCheckoutId !== 'undefined' && storageCheckoutId !== null) {
      fetchCheckout(storageCheckoutId);
    } else {
      createCheckout();
    }

    if (storageProducts && storageProducts !== 'undefined') {
      setProducts(JSON.parse(storageProducts));
    } else {
      fetchAllProducts();
    }

    if (storageCollections && storageCollections !== 'undefined') {
      setCollections(JSON.parse(storageCollections));
    } else {
      fetchCollections();
    }
  }, [createCheckout, fetchCheckout, fetchAllProducts, fetchCollections]);

  return (
    <ShopifyContext.Provider
      value={{
        product,
        products,
        checkout,
        collections,
        isCartOpen,
        isMenuOpen,
        fetchCheckout,
        removeLineItem,
        createCheckout,
        fetchAllProducts,
        addItemToCheckout,
        fetchProductWithHandle,
        fetchCollections,
        toggleCart,
        toggleMenu,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
};

const ShopifyConsumer = ShopifyContext.Consumer;

export { ShopifyConsumer, ShopifyContext };

export const useShopify = () => {
  const ctx = useContext(ShopifyContext);
  if (!ctx)
    throw new Error('`useShopify` must be used within a ShopifyProvider');
  return ctx;
};

export default ShopifyProvider;
