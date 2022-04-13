import SalesGroupModel from "../../models/salesGroupModel";

export async function get(request: SaleRequest["data"]) {
  const mongooseDocument = await SalesGroupModel.findById(
    request.salesGroupId
  ).exec();

  if (mongooseDocument == undefined)
    throw {
      errors: { salesGroup: { message: "Grupo de vendas não encontrado!" } },
    };

  return mongooseDocument;
}
