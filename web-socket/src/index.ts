// import http from "http";
// import { Server } from "ws";
// import express from "express";
// import { sendDataOnChange } from "./wordCountMapHandler/wordCountMapHandler";
// import { redisClient } from "./redisClient/redisClient";

// const app = express();
// const server = http.createServer(app);
// const wss = new Server({ server });

// wss.on("connection", (ws) => {
//   console.log("Client connected");
//   sendDataOnChange(ws);

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

// server.listen(process.env.PORT || 8080, () => {
//   console.log(`Server started`);

//   process.on("SIGINT", () => {
//     console.log("Shutting down server...");
//     redisClient.disconnect();
//     server.close(() => {
//       process.exit(0);
//     });
//   });
// });
import { startServer } from "./server/server";

const port: string | number = process.env.PORT || 8080;
startServer(port as number);
