import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL;

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
  auth: {
    token: sessionStorage.getItem("userData"),
  },
});

socket.on("connect", () => {
  console.log(`Connected to WebSocket server: ${socket.id}`);
});
socket.on("disconnect", (reason) => {
  console.log("Disconnected from WebSocket server:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

export const updateSocketAuthToken = (newToken: string) => {
  console.log("Updating socket auth token and reconnecting...");
  socket.auth = { token: newToken };
  socket.disconnect();
  socket.connect();
}

export default socket;
