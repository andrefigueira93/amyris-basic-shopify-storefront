import { buildClient } from 'shopify-buy';

const Client = buildClient({
  domain: process.env.REACT_APP_SHOPIFY_DOMAIN
    ? process.env.REACT_APP_SHOPIFY_DOMAIN
    : '',
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_TOKEN
    ? process.env.REACT_APP_SHOPIFY_TOKEN
    : '',
});

export default Client;
