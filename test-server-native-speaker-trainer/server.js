const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");

// Ниже настраиваем корсы для того чтобы не возникало проблем при отправке запроса на сервер
// Такая ошибка возникала у нас на хакатоне

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Пытаемся соедениться с пользователем

io.on("connection", (socket) => {

  // Соединяемся с пользователем

  console.log("User connected");

  socket.on("audio", (audioData) => {

    // Для отправки ответа используем код ниже

    io.emit("audioResponse", audioData); // Для теста отправляем тоже голосовое сообщение что и мы отправили

    console.log("Audio track sent back to client");
  });
});

// Запускаем сервер

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
