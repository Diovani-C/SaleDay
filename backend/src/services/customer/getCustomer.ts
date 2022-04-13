import Customer from "../../models/customerModel";

export async function get() {
  return Customer.find({}).exec();
}
