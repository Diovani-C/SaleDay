import SalesGroupModel from "../../models/salesGroupModel";
import { printReceiptPublisher } from "../../services/printer";
import {
  productsDifference,
  updateProdInfo,
  isSold,
  calculateTotal,
} from "./common";

export async function edit(request: SaleRequest["data"]) {
  const mongooseDocument = await SalesGroupModel.findById(
    request.salesGroupId
  ).exec();

  if (mongooseDocument == undefined)
    throw {
      errors: { salesGroup: { message: "Grupo de vendas não encontrado!" } },
    };

  request.sale.total = calculateTotal(
    request.sale.products,
    mongooseDocument.productsInfo
  );

  const currentSale: any = mongooseDocument.sales.find(
    (sale: any) => sale._id.toString() === request.sale._id
  );

  if (!currentSale)
    throw { errors: { sales: { message: "Venda não encontrada" } } };

  const difference = productsDifference(
    currentSale.products,
    request.sale.products
  );

  if (isSold(difference.add, mongooseDocument.productsInfo))
    throw { errors: { products: { message: "Produto ja vendido!" } } };

  mongooseDocument.sales = mongooseDocument.sales.map((sale: Sale) => {
    if (sale._id.toString() === request.sale._id) return request.sale;

    return sale;
  });

  mongooseDocument.productsInfo = updateProdInfo(
    difference,
    mongooseDocument.productsInfo
  );

  if (currentSale.paid && request.sale.paid)
    printReceiptPublisher.notifyAll(request.sale, mongooseDocument);

  return mongooseDocument.save();
}
