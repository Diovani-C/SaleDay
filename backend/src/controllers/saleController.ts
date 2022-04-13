import { add } from "../services/sale/addSale";
import { edit } from "../services/sale/editSale";
import { remove } from "../services/sale/removeSale";
import { get } from "../services/sale/getSales";
import { Socket } from "socket.io";
import { io } from "../config/socket";

const saleOperations = { add, edit, remove, get };

io.on("connection", (socket: Socket) => {
  socket.on("sale", async (request: SaleRequest, callback: Function) => {
    try {
      console.log("[server] sale request:");
      console.log(request);

      const operation = request.operation;

      const salesGroup: SalesGroup = await saleOperations[operation](
        request.data
      );

      const data = { salesGroupId: salesGroup._id, sales: salesGroup.sales };

      const response: SaleResponse = {
        operation,
        data,
      };

      callback(data);

      if (operation !== "get") {
        io.emit("sale", response);
        io.emit("salesGroup", { operation: "edit", data: salesGroup });
      }
    } catch (err) {
      console.log("Error:");
      console.log(err);
      callback(err);
    }
  });
});
