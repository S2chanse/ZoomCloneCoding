const socket = io(); //자동으로 서버를 찾아서 연결해준다.

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
