import SalesGroupModel from "../../models/salesGroupModel";

export async function get(data: SalesGroupRequest["data"]) {
  if (!data._id) {
    return SalesGroupModel.findOne().sort("-createdAt").exec();
  }
  return SalesGroupModel.findById(data._id).select("-sales").exec();
}
