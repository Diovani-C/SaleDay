import mongoose from "mongoose";
import { phoneRegx, emailRegx } from "../helpers/regex";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cellphone: {
    type: String,
    match: [phoneRegx, "Numero de celular invalido"],
  },
  phone: {
    type: String,
    match: [phoneRegx, "Numero de telefone invalido"],
  },
  email: {
    type: String,
    match: [emailRegx, "Email invalido"],
  },
});

export default mongoose.model("Customer", customerSchema);
