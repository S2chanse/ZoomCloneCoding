import express from "express";
import http from "http";
import SocketIO from "socket.io";
const app = express();
//pug설정
app.set("view engine", "pug");
//views로 화면 root set
app.set("views", __dirname + "/views");
//public folder path set
//아래의 경우 해당 파일을 표출할 수 있다.=> 순수하게 파일을 볼 수 있다.
app.use("/public", express.static(__dirname + "/public"));
//default url render home
app.get("/", (req, res) => res.render("home"));
const handleListen = () => console.log(`Listening on http:localhost:3000`);
// app.listen(3000, handleListen);

//express의 application을 통해, http 서버를 만든다.
const httpServer = http.createServer(app);
//websocket과 http서버 동시에  한 서버에서 실행되도록 작업
//const wss = new WebSocket.Server({ server });
//socket io 작업
const wsServer = SocketIO(httpServer);

httpServer.listen(3000, handleListen);

const sockets = [];
wsServer.on("connection", (socket) => {
  socket.on("enter_room", (...args) => {
    console.log(args);
    setTimeout(() => args[args.length - 1](`Hello from Backend`), 15000);
  });
});
//socket 연결
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["ninkName"] = "Anonymouse";
//   console.log("Connected to Browser");
//   socket.on("close", () => {
//     console.log("Server disconnected");
//   });
//   socket.on("message", (message) => {
//     const parsed = JSON.parse(message);
//     switch (parsed.type) {
//       case "message":
//         sockets.forEach((aSocket) => {
//           aSocket.send(`${socket.ninkName} : ${parsed.payload}`);
//         });
//         break;
//       case "nickName":
//         socket["ninkName"] = parsed.payload;
//         break;
//     }
//   });
// });

// wss.on("close", () => {
//   console.log("Closed Socket Connection");
// });
