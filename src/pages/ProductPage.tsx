import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Image,
  Text,
  Button,
  Heading,
  Flex,
  Center,
} from '@chakra-ui/react';

import { useShopify } from '../context/shopContext';
import RichText from '../components/RichText';

interface ProductPageHandle {
  handle: string;
}

const ProductPage: React.FC = () => {
  const { handle } = useParams<ProductPageHandle>();

  const {
    fetchProductWithHandle,
    fetchAllProducts,
    addItemToCheckout,
    product,
    products,
  } = useShopify();

  useEffect(() => {
    fetchProductWithHandle(handle);
  }, [fetchProductWithHandle, handle]);

  useEffect(() => {
    fetchAllProducts();
    return () => {};
  }, [fetchAllProducts]);

  if (!product) return <div>loading...</div>;

  return (
    <>
      <Box p="2rem">
        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} m="auto">
          <Flex justifyContent="center" alignItems="center">
            <Image src={product.images[0].src} />
          </Flex>
          <Box
            px="2rem"
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <Heading pb="2rem">{product.title}</Heading>
            <Text fontWeight="bold" pb="2rem">
              ${product.variants[0].price}
            </Text>
            <Text color="gray.500" pb="2rem">
              {product.description}
            </Text>
            <Button
              w="10rem"
              backgroundColor="#FF38BD"
              color="white"
              _hover={{ opacity: '70%' }}
              onClick={() => addItemToCheckout(product.variants[0].id, 1)}
            >
              Add To Cart
            </Button>
          </Box>
        </Grid>
      </Box>
      <RichText heading="Rated the best Bath Bombs of 2020!" />
      <Center fontWeight="bold" pb="2rem">
        You Might also like
      </Center>
      <Grid templateColumns={['repeat(1fr)', 'repeat(3, 1fr)']} id="products">
        {products &&
          products.map((product) => (
            <Link to={`/products/${product.handle}`} key={product.id}>
              <Box
                _hover={{ opacity: '80%' }}
                textAlign="center"
                position="relative"
              >
                <Image src={product.images[0].src} />
                <Text
                  fontWeight="bold"
                  position="absolute"
                  bottom="15%"
                  w="100%"
                >
                  {product.title}
                </Text>
                <Text position="absolute" bottom="5%" w="100%">
                  ${product.variants[0].price}
                </Text>
              </Box>
            </Link>
          ))}
      </Grid>
    </>
  );
};

export default ProductPage;
