import SalesGroupModel from "../../models/salesGroupModel";
import { isProductRepeated } from "./common";

export async function edit(data: SalesGroupRequest["data"]) {
  const mongooseDocument = await SalesGroupModel.findById(data._id).exec();

  if (isProductRepeated(data.productsInfo))
    throw { errors: { productsInfo: { message: "Produto repetido" } } };

  mongooseDocument.productsInfo = copySoldProperty(
    mongooseDocument.productsInfo,
    data.productsInfo
  );

  return mongooseDocument.save();
}

// SalesGroup actions should not edit the sold property of subproductTags
function copySoldProperty(
  oldProdInfo: SalesGroupRequest["data"]["productsInfo"],
  newProdInf: SalesGroupRequest["data"]["productsInfo"]
): SalesGroupRequest["data"]["productsInfo"] {
  return newProdInf.map((prodInf) => {
    console.log("copySoldProperty");
    const selectOldProInf = oldProdInfo.find(
      (oldP) => oldP.productId.toString() === prodInf.productId
    );

    prodInf.subproductTags = prodInf.subproductTags.map((subProd) => {
      if (selectOldProInf) {
        const oldSubP = selectOldProInf.subproductTags.find(
          ({ tag }) => tag === subProd.tag
        );
        if (oldSubP) subProd.sold = oldSubP.sold;
      }

      return subProd;
    });

    return prodInf;
  });
}
