import { Server } from "socket.io";

function createSocketServer(
  SOCKET_PORT: string,
  SERVER_URL: string,
  SERVER_PORT: string
) {
  const io = new Server(Number(SOCKET_PORT), {
    cors: {
      origin: [
        `http://localhost:${SERVER_PORT}`,
        `http://${SERVER_URL}:${SERVER_PORT}`,
      ],
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    },
  });
  return io;
}

const SERVER_PORT = process.env.SERVER_PORT || "3000";
const SOCKET_PORT = process.env.SOCKET_PORT || "3030";
const SERVER_URL = process.env.SERVER_URL || "localhost";

console.log(`http://${SERVER_URL}:${SOCKET_PORT}`);

export const io = createSocketServer(SOCKET_PORT, SERVER_URL, SERVER_PORT);
