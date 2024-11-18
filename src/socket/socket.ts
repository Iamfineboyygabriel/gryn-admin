import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log(`Connected to WebSocket server: ${socket.id}, ${socket.auth}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

export default socket;
