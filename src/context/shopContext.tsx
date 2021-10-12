import React, { Component } from 'react';
import Client, { Cart, Product } from 'shopify-buy';

interface ProductWithHandle extends Product {
  handle?: string;
}

interface SCData {
  product: ProductWithHandle | undefined;
  products: ProductWithHandle[] | undefined;
  checkout: Cart | undefined;
  isCartOpen: boolean;
  isMenuOpen: boolean;
  createCheckout(): void;
  fetchCheckout(checkoutId: string): void;
  addItemToCheckout(variantId: any, quantity: number): void;
  removeLineItem(lineItemIdsToRemove: string | string[]): void;
  fetchAllProducts(): void;
  fetchProductWithHandle(handle: string): void;
  closeCart(): void;
  openCart(): void;
  closeMenu(): void;
  openMenu(): void;
}

const ShopContext = React.createContext<SCData>({} as SCData);

const client = Client.buildClient({
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_TOKEN!,
  domain: process.env.REACT_APP_SHOPIFY_DOMAIN!,
});

class ShopProvider extends Component {
  state = {
    products: [] as Product[],
    product: undefined,
    checkout: {} as Cart,
    isCartOpen: false,
    isMenuOpen: false,
  };

  componentDidMount() {
    if (localStorage.checkout_id) {
      this.fetchCheckout(localStorage.checkout_id);
    } else {
      this.createCheckout();
    }
  }

  createCheckout = async () => {
    const checkout = await client.checkout.create();
    localStorage.setItem('checkout_id', JSON.stringify(checkout.id));
    this.setState({ checkout: checkout });
  };

  fetchCheckout = async (checkoutId: string) => {
    client.checkout
      .fetch(checkoutId)
      .then((checkout) => {
        this.setState({ checkout: checkout });
      })
      .catch((error) => console.log(error));
  };

  addItemToCheckout = async (variantId: string, quantity: number) => {
    const lineItemsToAdd = [
      {
        variantId,
        quantity,
      },
    ];
    const checkout = await client.checkout.addLineItems(
      this.state.checkout.id,
      lineItemsToAdd
    );
    this.setState({ checkout: checkout });

    this.openCart();
  };

  removeLineItem = async (lineItemIdsToRemove: string[]) => {
    const checkoutId = this.state.checkout.id;

    client.checkout
      .removeLineItems(checkoutId, lineItemIdsToRemove)
      .then((checkout) => this.setState({ checkout }));
  };

  fetchAllProducts = async () => {
    const products = await client.product.fetchAll();
    this.setState({ products });
  };

  fetchProductWithHandle = async (handle: string) => {
    const product = await client.product.fetchByHandle(handle);
    this.setState({ product });

    return product;
  };

  closeCart = () => {
    this.setState({ isCartOpen: false });
  };
  openCart = () => {
    this.setState({ isCartOpen: true });
  };

  closeMenu = () => {
    this.setState({ isMenuOpen: false });
  };
  openMenu = () => {
    this.setState({ isMenuOpen: true });
  };

  render() {
    return (
      <ShopContext.Provider
        value={{
          ...this.state,
          fetchCheckout: this.fetchCheckout,
          fetchAllProducts: this.fetchAllProducts,
          fetchProductWithHandle: this.fetchProductWithHandle,
          createCheckout: this.createCheckout,
          closeCart: this.closeCart,
          openCart: this.openCart,
          closeMenu: this.closeMenu,
          openMenu: this.openMenu,
          addItemToCheckout: this.addItemToCheckout,
          removeLineItem: this.removeLineItem,
        }}
      >
        {this.props.children}
      </ShopContext.Provider>
    );
  }
}

const ShopConsumer = ShopContext.Consumer;

export { ShopConsumer, ShopContext };

export default ShopProvider;
