import { add } from "../services/salesGroup/addSalesGroup";
import { edit } from "../services/salesGroup/editSalesGroup";
import { remove } from "../services/salesGroup/removeSalesGroup";
import { get } from "../services/salesGroup/getSalesGroup";
import { getByDate } from "../services/salesGroup/getByDateSalesGroup";
import { getNewests } from "../services/salesGroup/getNewestsSalesGroup";
import { Socket } from "socket.io";
import { io } from "../config/socket";

const salesGroupOperations = { add, edit, remove, get };
const salesGroupGetOperations = { getByDate, getNewests };

io.on("connection", (socket: Socket) => {
  socket.on(
    "salesGroup",
    async (request: SalesGroupRequest, callback: Function) => {
      try {
        console.log("[server] salesGroup request:");
        console.log(request);

        const operation = request.operation;

        const data = await salesGroupOperations[operation](request.data);

        const response: { operation: string; data: Object } = {
          operation,
          data,
        };

        callback(data);

        if (operation !== "get") io.emit("salesGroup", response);
      } catch (err) {
        console.log("Error:");
        console.log(err);
        callback(err);
      }
    }
  );

  socket.on(
    "getSalesGroups",
    async (request: GetSalesGroupsRequest, callback: Function) => {
      try {
        const operation = request.operation;

        const response = await salesGroupGetOperations[operation](request.data);

        callback(response);
      } catch (err) {
        console.log("Error:");
        console.log(err);
        callback(err);
      }
    }
  );
});
