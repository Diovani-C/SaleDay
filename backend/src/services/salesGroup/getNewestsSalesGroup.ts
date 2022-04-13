import SalesGroupModel from "../../models/salesGroupModel";

export async function getNewests({}) {
  return await SalesGroupModel.find({}).sort("-createdAt").limit(10).exec();
}
