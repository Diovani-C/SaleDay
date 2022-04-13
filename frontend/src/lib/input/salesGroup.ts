// updates the prodInfo every time the max value is updated
export function updateProdInf(
  oldProdInf: SalesGroup["productsInfo"],
  prodInf: SalesGroup["productsInfo"],
  products: Product[]
): SalesGroup["productsInfo"] {
  return products.map((prod) => {
    let subTags = [];

    let selectedProdInf = prodInf.find(
      ({ productId }) => prod._id === productId
    );

    let selectedOldProdInf = oldProdInf.find(
      ({ productId }) => prod._id === productId
    );

    if (!selectedProdInf)
      selectedProdInf = { productId: prod._id, max: 0, subproductTags: [] };

    // If the max value is bigger than the length of the array add a new item
    if (selectedProdInf.subproductTags.length < selectedProdInf.max) {
      for (let i = 0; i < selectedProdInf.max; i++) {
        if (selectedProdInf.subproductTags[i]) {
          subTags.push({ ...selectedProdInf.subproductTags[i] });
        } else if (selectedOldProdInf?.subproductTags[i]) {
          subTags.push({ ...selectedOldProdInf.subproductTags[i] });
        } else {
          subTags.push({
            tag: i + 1,
            price: prod?.price || 0,
            barcode: "",
            subproductId: "",
            sold: false,
          });
        }
      }
    }

    if (subTags.length <= 0) {
      const subproductTagsCopy = selectedProdInf.subproductTags.map(
        (subProd) => {
          return { ...subProd };
        }
      );
      subTags = subproductTagsCopy.filter(
        ({ tag }) => tag <= selectedProdInf.max
      );
    }

    return {
      productId: selectedProdInf.productId,
      max: selectedProdInf.max,
      subproductTags: subTags,
    };
  });
}

export function extractPriceFromBarcode(barcode: string): number {
  const newPrice = Number(barcode.slice(7)) / 1000;
  return Number.parseFloat(newPrice.toFixed(2));
}

export function extractSubproductIdFromBarcode(barcode: string) {
  return barcode.slice(1, 5);
}
