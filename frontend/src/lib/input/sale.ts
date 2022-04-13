export function calculateTotal(
  salePrds: Sale["products"],
  prodsInfs: SalesGroup["productsInfo"]
): number {
  let newTotal = 0;

  salePrds.forEach((saleP) => {
    const currentProdInf = prodsInfs.find(
      ({ productId }) => saleP.productId === productId
    );

    saleP.tags.forEach((tag) => {
      newTotal += currentProdInf.subproductTags.find(
        (BAP) => BAP.tag === tag
      )?.price;
    });
  });

  return newTotal;
}

export function fromCustomersToItems(
  customers: Customer[]
): { id: string; text: string }[] {
  return customers.map((customer) => {
    return { id: customer._id, text: customer.name };
  });
}

export function shouldFilterItem(item, value) {
  if (!value) return true;
  return item.text.toLowerCase().includes(value.toLowerCase());
}

export function createSaleProducts(
  saleProd: Sale["products"],
  prodInf: SalesGroup["productsInfo"]
): Sale["products"] {
  let newSaleProds = [];

  prodInf.forEach(({ productId, max }) => {
    const currentSaleProd = saleProd.find(
      (prod) => prod.productId === productId
    );

    if (max === 0) return;

    if (currentSaleProd) {
      newSaleProds.push(currentSaleProd);
    } else {
      newSaleProds.push({ productId, tags: [] });
    }
  });

  return newSaleProds;
}

// Generate the available products ids
export function generateAvailables(
  subprodTags: ProductInfo["subproductTags"],
  productId: string,
  sales: Sale[],
  subproducts: Subproduct[],
  operation: string,
  id: string
): { id: string; text: string }[] {
  let availables = [];

  let selecTags = [];
  if (operation === "edit" || operation === "remove") {
    let saleProducts = sales.find(({ _id }) => _id === id).products;

    selecTags = saleProducts.find(
      (product) => product.productId === productId
    ).tags;
  }

  subprodTags.forEach(({ tag, sold, subproductId, price }) => {
    if (!sold || selecTags.includes(tag)) {
      const currentSubproduct = subproducts.find(
        ({ _id }) => _id === subproductId
      );
      let text = `[${tag}] R$${price}`;

      if (currentSubproduct)
        text = `[${tag}] ${currentSubproduct?.name}, R$${price}, ${(
          price / currentSubproduct?.price
        ).toFixed(2)}Kg `;

      availables.push({
        id: tag.toString(),
        text,
      });
    }
  });

  return availables;
}
