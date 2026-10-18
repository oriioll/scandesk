import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { BarcodeScannedRequest } from "./model/BarcodeScannedRequest.js";

dotenv.config();
const app = express();
const server = createServer(app);
//Config socket.io server
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL as string,
      "https://speculative-glynis-trusting.ngrok-free.dev",
    ],
  },
});
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// Errores de handshake/transporte antes de que exista el socket
io.engine.on("connection_error", (err) => {
  console.log("[ENGINE ERROR]", err.code, err.message, err.context);
});

//On connection event
io.on("connection", (socket) => {
  socket.on("join-session", async (sessionToken) => {
    if (!sessionToken || typeof sessionToken !== "string") {
      return;
    }
    //Join the prope session
    await socket.join(sessionToken);
    socket.data.sessionToken = sessionToken;
  });
  socket.on("send-barcode-scanned", ({ barcode }) => {
    //Get token from "middleware of joining sessions"
    const token = socket.data.sessionToken;
    if (!token) {
      return;
    }
    //Emit the receive-barcode-scanned only to the token session
    socket.to(token).emit("receive-barcode-scanned", barcode);
  });
  socket.on("disconnect", (reason) => {});
});
server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
