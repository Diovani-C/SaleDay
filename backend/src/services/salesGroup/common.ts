// Verify if there is a repeated product
export function isProductRepeated(
  products: SalesGroupRequest["data"]["productsInfo"]
) {
  let productsIds: string[] = [];

  products.forEach((product) => {
    if (productsIds.includes(product.productId)) {
      return true;
    } else {
      productsIds.push(product.productId);
    }
  });
  return false;
}

// Verify if a sold product is removed
export function isSoldRemoved() {}
