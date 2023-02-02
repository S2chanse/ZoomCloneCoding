import express from "express";
import http from "http";
import ws, { WebSocket, WebSocketServer } from "ws";

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
const server = http.createServer(app);
//websocket과 http서버 동시에  한 서버에서 실행되도록 작업
const wss = new WebSocket.Server({ server });

server.listen(3000, handleListen);
//only used WebSocket Server
/**
const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});*/

wss.on("connection", (socket) => {
  console.log("Connected to Browser");
  socket.on("close", () => {
    console.log("Server disconnected");
  });
  socket.on("message", (data) => {
    console.log("received: %s", data);
  });
  socket.send("hello!");
});

wss.on("close", () => {
  console.log("Closed Socket Connection");
});
