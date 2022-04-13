import SalesGroupModel from "../../models/salesGroupModel";
import { isProductRepeated } from "./common";

export async function add(data: SalesGroupRequest["data"]) {
  const { _id, createdAt, ...newData } = data;

  if (isProductRepeated(data.productsInfo))
    throw { errors: { productsInfo: { message: "Produto repetido" } } };

  newData.productsInfo = removeSold(newData.productsInfo);

  const mongooseDocument = new SalesGroupModel(newData);
  return mongooseDocument.save();
}

// SalesGroup actions should not edit the sold property of subproductTags
function removeSold(
  newProdInf: SalesGroupRequest["data"]["productsInfo"]
): SalesGroupRequest["data"]["productsInfo"] {
  return newProdInf.map((prodInf) => {
    prodInf.subproductTags = prodInf.subproductTags.map((subP) => {
      subP.sold = false;
      return subP;
    });

    return prodInf;
  });
}
