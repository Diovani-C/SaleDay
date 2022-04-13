// Compares products to find which is removed and wich is added
export function productsDifference(
  oldProds: Sale["products"],
  newProds: Sale["products"]
): { add: Sale["products"]; remove: Sale["products"] } {
  const inCommon: Sale["products"] = [];
  const removed: Sale["products"] = [];
  const added: Sale["products"] = [];

  // Compare the old products tags with the new and determines which is removed and wich is in common
  oldProds.forEach((oldP) => {
    const commonTags: number[] = [];
    const removedTags: number[] = [];

    const newP = newProds.find(
      ({ productId }) => productId.toString() === oldP.productId.toString()
    );

    oldP.tags.forEach((t) => {
      if (newP && newP.tags.includes(t)) commonTags.push(t);
      else removedTags.push(t);
    });

    inCommon.push({ productId: oldP.productId.toString(), tags: commonTags });
    removed.push({ productId: oldP.productId.toString(), tags: removedTags });
  });

  // Compare the new products tags with the inCommon and determines which is added and wich is in common
  newProds.forEach((newP) => {
    const addedTags: number[] = [];

    const common = inCommon.find(
      ({ productId }) => productId.toString() === newP.productId.toString()
    );

    newP.tags.forEach((t) => {
      if (!common || !common.tags.includes(t)) addedTags.push(t);
    });

    added.push({ productId: newP.productId.toString(), tags: addedTags });
  });

  return { add: added, remove: removed };
}

export function changeProdSold(
  products: Sale["products"],
  state: boolean,
  prodsInfo: SalesGroup["productsInfo"]
): SalesGroup["productsInfo"] {
  products.forEach((product) => {
    const prodInf = prodsInfo.find(
      ({ productId }) => productId.toString() === product.productId.toString()
    );

    if (!prodInf)
      throw { errors: { salesGroup: { message: "products info not found" } } };

    product.tags.forEach((tag) => {
      const ProdInfIndex = prodInf.subproductTags.findIndex(
        (b) => b.tag === tag
      );

      prodInf.subproductTags[ProdInfIndex].sold = state;
    });
  });

  return prodsInfo;
}

// update the products sold property
export function updateProdInfo(
  difference: { add: Sale["products"]; remove: Sale["products"] },
  prodsInfo: SalesGroup["productsInfo"]
) {
  prodsInfo = changeProdSold(difference.add, true, prodsInfo);
  prodsInfo = changeProdSold(difference.remove, false, prodsInfo);

  return prodsInfo;
}

// verify if the products in the new sale are already sold
export function isSold(
  products: Sale["products"],
  productsInfo: SalesGroup["productsInfo"]
): boolean {
  let isSoldResult = false;

  products.forEach((product) => {
    const prodInfo = productsInfo.find(
      ({ productId }) => productId.toString() === product.productId.toString()
    );

    product.tags.forEach((tag) => {
      if (prodInfo?.subproductTags.find((b) => b.tag === tag)?.sold)
        isSoldResult = true;
    });
  });

  return isSoldResult;
}

export function calculateTotal(
  salePrds: Sale["products"],
  prodsInfs: SalesGroup["productsInfo"]
): number {
  let newTotal = 0;

  salePrds.forEach((saleP) => {
    const currentProdInf = prodsInfs.find(
      ({ productId }) => saleP.productId.toString() === productId.toString()
    );

    saleP.tags.forEach((tag) => {
      newTotal +=
        currentProdInf?.subproductTags.find((prodInf) => prodInf.tag === tag)
          ?.price || 0;
    });
  });

  return newTotal;
}
