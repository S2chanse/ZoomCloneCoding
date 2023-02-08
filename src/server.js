import express from "express";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
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
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
  mode: "development",
});

httpServer.listen(3000, handleListen);

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) == undefined) publicRooms.push(key);
  });
  return publicRooms;
};

const countRoom = (roomName) => {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
};
wsServer.on("connection", (socket) => {
  socket.onAny((envet) => {
    //console.log(wsServer.sockets.adapter);
    //console.log(`Socket Event : ${envet}`);
  });
  socket.on("enter_room", (room_name, nick_name, done) => {
    socket.join(room_name);
    socket["nick_name"] = nick_name;
    done(countRoom(room_name));
    socket
      .to(room_name)
      .emit("welcome", socket.nick_name, countRoom(room_name));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nick_name, countRoom(room) - 1);
    });
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room_name, done) => {
    socket.to(room_name).emit("new_message", `${socket.nick_name}: ${msg}`);
    done();
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
