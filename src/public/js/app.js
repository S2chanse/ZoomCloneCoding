const socket = io(); //자동으로 서버를 찾아서 연결해준다.
const welcomeDiv = document.querySelector("#welcome");
const form = welcomeDiv.querySelector("form");
const roomDiv = document.querySelector("#room");

roomDiv.hidden = true;

let room_name = "";
let nick_name = "";

const addMessage = (message) => {
  const ul = roomDiv.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
};

const handleMessageSubmit = (e) => {
  e.preventDefault();
  const input = room.querySelector("#message>input");
  let sendMsg = input.value;
  socket.emit("new_message", input.value, room_name, () => {
    addMessage(`Me : ${sendMsg}`);
  });
  input.value = "";
};

const showRoom = () => {
  welcomeDiv.hidden = true;
  roomDiv.hidden = false;
  const h3 = roomDiv.querySelector("h3");
  h3.innerText = room_name;
  const room_form = roomDiv.querySelector("#message");
  room_form.addEventListener("submit", handleMessageSubmit);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const room_name_input = form.querySelector("#room_name");
  const nick_name_input = form.querySelector("#nick");
  room_name = room_name_input.value;
  nick_name = nick_name_input.value;
  socket.emit("enter_room", room_name, nick_name, showRoom);
  room_name.value = "";
  nick_name.value = "";
});

socket.on("welcome", (user) => {
  addMessage(`${user} arrived!`);
});

socket.on("new_message", (msg, user) => {
  addMessage(msg);
});
socket.on("bye", (left) => {
  addMessage(`${left} Left!`);
});
// const messageList = document.querySelector("ul");
// const nickNameForm = document.querySelector("#nickName");
// const messgeForm = document.querySelector("#messge");
// var aWebSocket = new WebSocket(`ws://${window.location.host}`);
// aWebSocket.binaryType = "blob";

// const makeMessage = (type, payload) => {
//   const msg = { type, payload };
//   return JSON.stringify(msg);
// };

// aWebSocket.addEventListener("open", () => {
//   console.log("connected");
// });

// aWebSocket.addEventListener("message", (event) => {
//   let result = "";
//   if (event.data instanceof Blob) {
//     reader = new FileReader();

//     //읽기 동작 완료
//     reader.onload = () => {
//       console.log("Result: " + reader.result);
//       createChatTag(reader.result);
//     };
//     //읽고자 하는 객체 입력
//     reader.readAsText(event.data);
//   } else {
//     console.log("Result: " + event.data);
//     createChatTag(event.data);
//   }
// });

// aWebSocket.addEventListener("close", () => {
//   console.log("closed ");
// });

// messgeForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const input = messgeForm.querySelector("input");
//   aWebSocket.send(makeMessage("message", input.value));
//   createChatTag(`Me : ${input.value}`);
//   input.value = "";
// });

// nickNameForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const input = nickNameForm.querySelector("input");
//   aWebSocket.send(makeMessage("nickName", input.value));
//   input.value = "";
// });
// const createChatTag = (text) => {
//   const li = document.createElement("li");
//   li.innerText = text;
//   messageList.append(li);
// };
