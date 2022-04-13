import "./controllers/saleController";
import "./controllers/productController";
import "./controllers/customerController";
import "./controllers/salesGroupController";
import "./controllers/subproductController";

import { io } from "./config/socket";
import Mongodb from "./config/mongodb";

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASS}@mongo:27017`;

export const db = Mongodb(MONGO_URL);

io.on("connection", () => {
  console.log("[socket] connection stablished");
});
