import { thermalPrinter } from "./printer";
import dayjs from "dayjs";

export async function printReceipt(sale: {
  _id: string;
  products: {
    tag: string;
    name: string;
    price: number;
    total: number;
    unit: "UN" | "KG";
  }[];
}) {
  let isConnected = await thermalPrinter.isPrinterConnected();

  if (!isConnected) {
    throw "Printer is not connected";
  }

  console.log("Printer is connected!");

  thermalPrinter.setTypeFontB();
  thermalPrinter.alignCenter();
  thermalPrinter.setTextSize(0, 0);

  thermalPrinter.print("CNPJ: 06.062.873/0001-05 ");
  thermalPrinter.bold(true);
  thermalPrinter.println("COELLI E CIA LTDA - ME");
  thermalPrinter.bold(false);
  thermalPrinter.println(
    "RUA ANTONIO CARNEIRO NETO, 501, ALVORADA, FRANCISCO BELTRAO, PR"
  );

  thermalPrinter.bold(true);
  thermalPrinter.println("Documento para retirada de encomenda");
  thermalPrinter.bold(false);

  await thermalPrinter.printImage("./static/LogotipoCoelli.png");

  thermalPrinter.newLine();

  thermalPrinter.tableCustom([
    { text: "Etiqueta", bold: true, align: "LEFT" },
    { text: "Descrição", bold: true, align: "LEFT" },
    { text: "Qtde", bold: true, align: "CENTER" },
    { text: "Vl Unit", bold: true, align: "CENTER" },
    { text: "Vl Total", bold: true, align: "RIGHT" },
  ]);

  let totalCompra = 0;

  sale.products.forEach((product) => {
    totalCompra += product.total;

    thermalPrinter.tableCustom([
      { text: product.tag, align: "LEFT" },
      { text: product.name, align: "LEFT" },
      {
        text: (product.total / product.price).toFixed(2) + product.unit,
        align: "CENTER",
      },
      { text: product.price.toFixed(2), align: "CENTER" },
      { text: product.total.toFixed(2), align: "RIGHT" },
    ]);
  });

  thermalPrinter.newLine();

  thermalPrinter.tableCustom([
    // Prints table with custom settings (text, align, width, cols, bold)
    { text: "Valor total R$", align: "LEFT", bold: true },
    { text: totalCompra.toFixed(2), align: "RIGHT", bold: true },
  ]);

  thermalPrinter.drawLine();

  thermalPrinter.println(
    `Data de emissão: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}`
  );

  thermalPrinter.println(sale._id);

  thermalPrinter.cut();

  console.log("Printing...");
  let execute = await thermalPrinter.execute();

  thermalPrinter.clear();
  console.log("Print complete!");

  return execute;
}
