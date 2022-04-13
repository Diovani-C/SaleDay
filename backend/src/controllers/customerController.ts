import { Socket } from "socket.io";
import { io } from "../config/socket";
import { add } from "../services/customer/addCustomer";
import { edit } from "../services/customer/editCustomer";
import { remove } from "../services/customer/removeCustomer";
import { get } from "../services/customer/getCustomer";

const customerOperations = {
  add,
  edit,
  remove,
  get,
};

io.on("connection", (socket: Socket) => {
  socket.on(
    "customer",
    async (request: CustomerRequest, callback: Function) => {
      try {
        console.log("[server] customer request:");
        console.log(request);

        const operation = request.operation;

        const data = await customerOperations[operation](request.data);

        const response: { operation: string; data: Object } = {
          operation,
          data,
        };

        callback(data);

        if (operation !== "get") io.emit("customer", response);
      } catch (err) {
        console.log("Error:");
        console.log(err);
        callback(err);
      }
    }
  );
});
