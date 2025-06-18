const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000; // ← Render用にPORT環境変数を使う

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("ball-control", (data) => {
    socket.broadcast.emit("ball-control", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
