import subproduct from "../../models/subproductModel";

export async function get() {
  return await subproduct.find({}).exec();
}
