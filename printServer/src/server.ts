import express from "express";
import bodyParser from "body-parser";
import { printReceipt } from "./printController";

// docker run -p 8083:8083 --device=/dev/usb/lp1 diovani-c/sale-app-print:0.1

const PORT = process.env.PORT || 8083;

const app = express();

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  try {
    const sale = await req.body;

    const response = await printReceipt(sale);

    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);

    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server working on http://localhost:${PORT}`);
});
