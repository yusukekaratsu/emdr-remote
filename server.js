const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Renderで必要：環境変数 PORT を使う
const PORT = process.env.PORT || 3000;

// 静的ファイル（publicフォルダ）を公開
app.use(express.static(path.join(__dirname, "public")));

// ルートアクセスでクライエント画面にリダイレクト
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "public-client.html"));
});

// Socket.IOの接続処理
io.on("connection", (socket) => {
  console.log("A user connected");

  // セラピストから送られた操作を他のクライエントに中継
  socket.on("ball-control", (data) => {
    socket.broadcast.emit("ball-control", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// サーバー起動
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
