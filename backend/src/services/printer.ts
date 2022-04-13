import SubproductModel from "../models/subproductModel";
import ProductModel from "../models/productModel";
import { request } from "http";

const PRINTER_URL = process.env.PRINTER_URL;

const PRINTER_PORT = process.env.PRINTER_PORT;

function createPrintReceiptPublisher() {
  const observers: Function[] = [];

  return {
    subscribe: (obMethod: (sale: Sale, salesGroup: SalesGroup) => void) => {
      observers.push(obMethod);
    },
    notifyAll: (sale: Sale, salesGroup: SalesGroup) => {
      observers.forEach((obMethod) => {
        obMethod(sale, salesGroup);
      });
    },
  };
}

async function printReceipt(sale: Sale, salesGroup: SalesGroup) {
  console.log("Priting receipt!");
  const reqBody: {
    _id: string;
    products: {
      tag: string;
      name: string;
      price: number;
      total: number;
      unit: string;
    }[];
  } = { _id: sale._id, products: [] };

  try {
    for (const prod of sale.products) {
      const currentProd = salesGroup.productsInfo.find(
        ({ productId }) => productId === prod.productId
      );

      for (const t of prod.tags) {
        let printProd = {
          tag: t.toString(),
          name: "",
          price: 0,
          total: 0,
          unit: "UN",
        };

        const subProd = currentProd?.subproductTags.find(
          ({ tag }) => tag === t
        );

        if (
          subProd?.SubproductId === "" ||
          subProd?.SubproductId === undefined
        ) {
          const productDocument: Product = await ProductModel.findById(
            prod.productId
          ).exec();

          printProd.name = productDocument.name;
          printProd.price = productDocument.price || 0;
          printProd.total = productDocument.price || 0;
        } else {
          const subProductDocument: Subproduct = await SubproductModel.findById(
            subProd.SubproductId
          ).exec();

          printProd.name = subProductDocument.name;
          printProd.price = subProductDocument.price;
          printProd.total = subProd.price;
          printProd.unit = "KG";
        }
        reqBody.products.push(printProd);
      }
    }
    console.log("Products array:");
    console.log(reqBody.products);

    const body = JSON.stringify(reqBody);

    const options = {
      hostname: PRINTER_URL,
      port: Number(PRINTER_PORT),
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = request(options, (res) => {
      console.log("Response:");
      console.log(`statusCode: ${res.statusCode}`);
      console.log(res);
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.write(body);

    req.end();
  } catch (err) {
    console.error(err);
  }
}

// {
//   "_id": "string",
//   "products": [{
//     "tag": "11",
//     "name": "Alcatra c/ Osso",
//     "price": 59.9,
//     "total": 91.04,
//     "unit": "KG"},
//     {
//     "tag": "22",
//     "name": "Alcatra c/ Osso",
//     "price": 59.9,
//     "total": 32.34,
//     "unit": "KG"}
//     ]
// }

const printReceiptPublisher = createPrintReceiptPublisher();

printReceiptPublisher.subscribe(printReceipt);

export { printReceiptPublisher };
