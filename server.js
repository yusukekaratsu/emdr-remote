const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

// ▼▼▼ 追加: 触覚刺激の状態を管理する変数 ▼▼▼
let vibrationInterval = 1000;
let vibrationTimer = null;
let isVibrating = false;
let nextVibrationTarget = 'left';

// 振動を開始または再開する関数
function startVibrationInterval() {
  if (vibrationTimer) clearInterval(vibrationTimer); // 既存のタイマーをクリア
  
  vibrationTimer = setInterval(() => {
    io.emit(`vibrate-${nextVibrationTarget}`);
    console.log(`Vibrate command sent to: ${nextVibrationTarget}`);
    nextVibrationTarget = (nextVibrationTarget === 'left') ? 'right' : 'left';
  }, vibrationInterval);
}

// 振動を停止する関数
function stopVibrationInterval() {
  if (vibrationTimer) clearInterval(vibrationTimer);
  vibrationTimer = null;
}
// ▲▲▲ ここまで追加 ▲▲▲


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('ball-control', (data) => {
    socket.broadcast.emit('ball-control', data);
  });

  socket.on('music-control', (data) => {
    socket.broadcast.emit('music-control', data);
  });

  // ▼▼▼ 追加: 触覚刺激用のイベントリスナー ▼▼▼
  socket.on('vibration-start', (data) => {
    console.log('Vibration started with interval:', data.interval);
    isVibrating = true;
    vibrationInterval = data.interval;
    nextVibrationTarget = 'left'; // 開始時は必ず左から
    startVibrationInterval();
  });

  socket.on('vibration-stop', () => {
    console.log('Vibration stopped');
    isVibrating = false;
    stopVibrationInterval();
  });

  socket.on('vibration-interval', (data) => {
    vibrationInterval = data.interval;
    console.log('Vibration interval updated to:', vibrationInterval);
    if (isVibrating) {
      // 振動中であれば、新しい間隔でタイマーを再設定
      startVibrationInterval();
    }
  });
  // ▲▲▲ ここまで追加 ▲▲▲
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
