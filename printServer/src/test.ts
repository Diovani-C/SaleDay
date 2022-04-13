import { thermalPrinter } from "./printer";
import dayjs from "dayjs";

async function testPrinter() {
  console.log("Testing printer...");

  let isConnected = await thermalPrinter.isPrinterConnected();

  if (!isConnected) {
    console.error("Printer is not connected");
    return;
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
    { text: "Código", bold: true, align: "LEFT" },
    { text: "Descrição", bold: true, align: "LEFT" },
    { text: "Qtde", bold: true, align: "CENTER" },
    { text: "Vl Unit", bold: true, align: "CENTER" },
    { text: "Vl Total", bold: true, align: "RIGHT" },
  ]);

  thermalPrinter.tableCustom([
    { text: "22", align: "CENTER" },
    { text: "Alcatra c/ Osso", align: "LEFT" },
    { text: "1,520KG", align: "CENTER" },
    { text: "59,90", align: "CENTER" },
    { text: "91,04", align: "RIGHT" },
  ]);
  thermalPrinter.tableCustom([
    { text: "12", align: "CENTER" },
    { text: "Alcatra c/ Osso", align: "LEFT" },
    { text: "0,54KG", align: "CENTER" },
    { text: "59,90", align: "CENTER" },
    { text: "32.34", align: "RIGHT" },
  ]);

  thermalPrinter.newLine();

  thermalPrinter.tableCustom([
    // Prints table with custom settings (text, align, width, cols, bold)
    { text: "Valor total R$", align: "LEFT", bold: true },
    { text: "123,38", align: "RIGHT", bold: true },
  ]);

  thermalPrinter.drawLine();

  thermalPrinter.println(
    `Data de emissão: ${dayjs().format("DD/MM/YYYY HH:mm:ss")}`
  );

  thermalPrinter.printQR("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
    cellSize: 6, // 1 - 8
    correction: "Q", // L(7%), M(15%), Q(25%), H(30%)
    model: 2, // 1 - Model 1
    // 2 - Model 2 (standard)
    // 3 - Micro QR
  });

  thermalPrinter.cut();

  console.log("Executing commands!");
  let execute = await thermalPrinter.execute();

  console.log(execute);
  console.log("Test complete!");
}

testPrinter();
