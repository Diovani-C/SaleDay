import escpos from "escpos";
escpos.USB = require("escpos-usb");

const usbDevice = new escpos.USB("0x04b8", "0x0E27");

const printer = new escpos.Printer(usbDevice, {});

usbDevice.open(function (error) {
  printer.font("B").align("CT").text("Hello World!").cut().close();

  console.log("Error:");
  console.log(error);
});
