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

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// 🔽 静的ファイルを公開するフォルダ（public）を指定
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("ball-control", (data) => {
    socket.broadcast.emit("ball-control", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// 🔽 任意: / にアクセスされたら public-client.html にリダイレクトする
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public-client.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
