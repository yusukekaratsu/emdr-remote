// server.js

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// 1. publicフォルダを静的ファイルとして提供する設定
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });

  // EMDRコントロールの通信
  socket.on('ball-control', (data) => {
    socket.broadcast.emit('ball-control', data);
  });
  
  // ▼▼▼ 2. BGMコントロール用の通信を中継する設定を追加 ▼▼▼
  socket.on('music-control', (data) => {
    socket.broadcast.emit('music-control', data);
  });

  // ping/pong (Renderスリープ対策)
  socket.on('ping', () => {
    // console.log(`Ping from ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
