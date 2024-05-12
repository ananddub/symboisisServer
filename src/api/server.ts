import { PORT } from "../services/variables";

const express = require("express");
const { Server } = require("socket.io");
const Cors = require("cors");
const { createServer } = require("http");
export const app = express();
app.use(
  Cors({
    Credential: true,
    origin: ["*"],
  })
);
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));
httpServer.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
