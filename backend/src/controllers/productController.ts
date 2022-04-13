import { add } from "../services/product/addProduct";
import { edit } from "../services/product/editProduct";
import { remove } from "../services/product/removeProduct";
import { get } from "../services/product/getProduct";
import { Socket } from "socket.io";
import { io } from "../config/socket";

const productOperations = { add, edit, remove, get };

io.on("connection", (socket: Socket) => {
  socket.on("product", async (request: ProductRequest, callback: Function) => {
    try {
      console.log("[server] product request:");
      console.log(request);

      const operation = request.operation;

      const data = await productOperations[operation](request.data);

      const response: { operation: string; data: Object } = {
        operation,
        data,
      };

      callback(data);

      if (operation !== "get") io.emit("product", response);
    } catch (err) {
      console.log("Error:");
      console.log(err);
      callback(err);
    }
  });
});
