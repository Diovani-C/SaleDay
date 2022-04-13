import SalesGroupModel from "../../models/salesGroupModel";

export async function remove(data: SalesGroupRequest["data"]) {
  return SalesGroupModel.findByIdAndDelete(data._id);
}
