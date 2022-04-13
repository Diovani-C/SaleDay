import { io } from "socket.io-client";
import { getSalesGroupById, getAll } from "$lib/helpers/getter";
import salesStore from "$lib/stores/sales";
import { SOCKET_PORT, SOCKET_URL } from "../../../server_ip.json";

getAll.subscribe((salesGrId) => {
  getSalesGroupById.notifyAll(salesGrId);
});

let currentSalesGroupId = "";
let unsubscribe = () => {};

console.log("server url");
console.log(`http://${SOCKET_URL}:${SOCKET_PORT}`);

const SOCKET_SERVER = `http://${SOCKET_URL}:${SOCKET_PORT}`;

const socket = io(SOCKET_SERVER);

socket.on("connect", () => {
  console.log("[socket] connection stablished: " + socket.id);
  unsubscribe = salesStore.subscribe(({ salesGroupId }) => {
    currentSalesGroupId = salesGroupId || "";
  });

  getAll.notifyAll(currentSalesGroupId);
});

socket.on("disconnect", () => {
  console.log("[socket] connection lost");
  unsubscribe();
});

export default socket;
