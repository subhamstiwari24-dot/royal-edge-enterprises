import type { PublicProduct } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';

export const getProductPricing = (product: PublicProduct) => {
  // Use exact prices from initialData without modifying or inventing
  const match = INITIAL_PRODUCTS.find((p) => p.id === product.id || p.sku === product.sku);
  if (match) {
    return {
      retailPrice: match.retailPrice,
      wholesalePrice: match.wholesalePrice,
      moq: match.minimumOrderQuantity || product.minimumOrderQuantity || 100,
    };
  }
  return {
    retailPrice: 50,
    wholesalePrice: 35,
    moq: product.minimumOrderQuantity || 100,
  };
};
