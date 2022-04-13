import { printer, types } from "node-thermal-printer";

export const thermalPrinter = new printer({
  type: types.EPSON, // Printer type: 'star' or 'epson'
  interface: "printer:auto", // Printer interface
  characterSet: "PC860_PORTUGUESE", // Printer character set - default: SLOVENIA
  removeSpecialCharacters: false, // Removes special characters - default: false
  lineCharacter: "-", // Set character for lines - default: "-"
  options: {
    // Additional options
    timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
  },
});
