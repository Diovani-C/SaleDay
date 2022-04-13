import SalesGroupModel from "../../models/salesGroupModel";
import { printReceiptPublisher } from "../../services/printer";
import { updateProdInfo, isSold, calculateTotal } from "./common";

export async function add(request: SaleRequest["data"]) {
  const mongooseDocument = await SalesGroupModel.findById(
    request.salesGroupId
  ).exec();

  const { _id, ...newSale } = request.sale;

  newSale.total = calculateTotal(
    newSale.products,
    mongooseDocument.productsInfo
  );

  let isPaid = newSale.paid;

  if (isSold(newSale.products, mongooseDocument.productsInfo))
    throw { errors: { products: { message: "Produto ja vendido!" } } };

  const repeatedCustomerSale: Sale = mongooseDocument.sales.find(
    (s: Sale) => s.customerId.toString() === newSale.customerId
  );

  // Verify if exists a sale with the same customer and if there is join the products instead of creating a new sale
  if (repeatedCustomerSale) {
    isPaid = repeatedCustomerSale.paid && newSale.paid;

    repeatedCustomerSale.products = repeatedCustomerSale.products.map(
      (product) => {
        const currentProduct = newSale.products.find(
          ({ productId }) => productId === product.productId.toString()
        );

        if (currentProduct)
          product.tags = [...product.tags, ...currentProduct.tags];

        return product;
      }
    );
    if (!newSale.paid) repeatedCustomerSale.paid = newSale.paid;

    mongooseDocument.sales = mongooseDocument.sales.map((s: Sale) => {
      if (s._id === repeatedCustomerSale._id) return repeatedCustomerSale;

      return s;
    });
  } else {
    mongooseDocument.sales.push(newSale);
  }

  mongooseDocument.productsInfo = updateProdInfo(
    { add: request.sale.products, remove: [] },
    mongooseDocument.productsInfo
  );

  if (isPaid) printReceiptPublisher.notifyAll(request.sale, mongooseDocument);

  return mongooseDocument.save();
}
