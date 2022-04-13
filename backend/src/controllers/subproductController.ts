import { add } from "../services/subproduct/addSubproduct";
import { edit } from "../services/subproduct/editSubproduct";
import { remove } from "../services/subproduct/removeSubproduct";
import { get } from "../services/subproduct/getSubproduct";
import { Socket } from "socket.io";
import { io } from "../config/socket";

const subproductOperations = { add, edit, remove, get };

io.on("connection", (socket: Socket) => {
  socket.on(
    "subproduct",
    async (request: SubproductRequest, callback: Function) => {
      try {
        console.log("[server] subproduct request:");
        console.log(request);

        const operation = request.operation;

        const data = await subproductOperations[operation](request.data);

        const response: { operation: string; data: Object } = {
          operation,
          data,
        };

        callback(data);

        if (operation !== "get") io.emit("subproduct", response);
      } catch (err) {
        console.log("Error:");
        console.log(err);
        callback(err);
      }
    }
  );
});
