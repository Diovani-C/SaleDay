import SalesGroupModel from "../../models/salesGroupModel";
import { updateProdInfo } from "./common";

export async function remove(request: SaleRequest["data"]) {
  const mongooseDocument = await SalesGroupModel.findById(
    request.salesGroupId
  ).exec();

  if (mongooseDocument == undefined)
    throw {
      errors: { salesGroup: { message: "Grupo de vendas não encontrado!" } },
    };

  const currentSale = mongooseDocument.sales.find(
    (sale: any) => sale._id.toString() === request.sale._id
  );

  mongooseDocument.sales = mongooseDocument.sales.filter((sale: Sale) => {
    return sale._id.toString() !== request.sale._id;
  });

  mongooseDocument.productsInfo = updateProdInfo(
    { add: [], remove: currentSale.products },
    mongooseDocument.productsInfo
  );

  return mongooseDocument.save();
}
