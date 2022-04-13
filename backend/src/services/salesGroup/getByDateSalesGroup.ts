import SalesGroupModel from "../../models/salesGroupModel";

export async function getByDate(data: { from: string; to: string }) {
  return await SalesGroupModel.find({
    createdAt: { $gte: data.from, $lt: data.to },
  });
}
