const socket = io(); //자동으로 서버를 찾아서 연결해준다.
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const callDiv = document.getElementById("call");

callDiv.hidden = true;

let myStream;
let muted = true;
let cameraOff = false;
let room_name = "";
let myPeerConnection;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label == camera.label) option.selected = true;
      cameraSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
};
const getMedia = async (deviceId) => {
  const initialConstrains = {
    audio: false,
    video: { facingMode: "user" },
  };
  const camearConstrains = {
    audio: false,
    video: {
      deviceId: deviceId,
    },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? camearConstrains : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) await getCameras();
  } catch (err) {
    console.log(err);
  }
};

const handleMuteClick = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  muted = !muted;
  muteBtn.innerText = muted ? "Mute" : "Unmute";
};
const handleCameraClick = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  cameraOff = !cameraOff;
  cameraBtn.innerText = cameraOff ? "Off" : "On";
};

const handleCameraChange = async () => {
  await getMedia(cameraSelect.value);
  if (myPeerConnection) {
    const videoTrak = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrak);
  }
};
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

//WelcomeForm
const welcomeDiv = document.getElementById("welcome");
const welcomeForm = welcomeDiv.querySelector("form");
const initCall = async () => {
  welcomeForm.hidden = true;
  callDiv.hidden = false;
  await getMedia();
  makeConnection();
};
welcomeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const room_name_input = welcomeForm.querySelector("#room_name");
  room_name = room_name_input.value;
  await initCall();
  socket.emit("enter_room", room_name);
  room_name.value = "";
});

//Socket Code
socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("send Offer");
  socket.emit("offer", offer, room_name);
});

socket.on("offer", async (offer) => {
  console.log("recived offer");
  await myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, room_name);
  console.log("send answer");
});
socket.on("answer", async (answer) => {
  console.log("recived answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});
//RTC Code
const makeConnection = () => {
  myPeerConnection = new RTCPeerConnection();
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStrem);
  if (myStream) {
    myStream
      .getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, myStream));
  }
};

const handleIce = (data) => {
  console.log("send candidate");
  socket.emit("ice", data.candidate, room_name);
};

const handleAddStrem = (data) => {
  const peerstream = document.getElementById("peerStream");
  peerstream.srcObject = data.stream;
};
//socket io chat js
// const welcomeDiv = document.querySelector("#welcome");
// const form = welcomeDiv.querySelector("form");
// const roomDiv = document.querySelector("#room");

// roomDiv.hidden = true;

// let room_name = "";
// let nick_name = "";

// const addMessage = (message) => {
//   const ul = roomDiv.querySelector("ul");
//   const li = document.createElement("li");
//   li.innerText = message;
//   ul.append(li);
// };

// const handleMessageSubmit = (e) => {
//   e.preventDefault();
//   const input = room.querySelector("#message>input");
//   let sendMsg = input.value;
//   socket.emit("new_message", input.value, room_name, () => {
//     addMessage(`Me : ${sendMsg}`);
//   });
//   input.value = "";
// };

// const showRoom = (new_cnt) => {
//   welcomeDiv.hidden = true;
//   roomDiv.hidden = false;
//   const h3 = roomDiv.querySelector("h3");
//   h3.innerText = `Room: ${room_name} (${new_cnt})`;
//   const room_form = roomDiv.querySelector("#message");
//   room_form.addEventListener("submit", handleMessageSubmit);
// };

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const room_name_input = form.querySelector("#room_name");
//   const nick_name_input = form.querySelector("#nick");
//   room_name = room_name_input.value;
//   nick_name = nick_name_input.value;
//   socket.emit("enter_room", room_name, nick_name, showRoom);
//   room_name.value = "";
//   nick_name.value = "";
// });

// socket.on("welcome", (user, new_cnt) => {
//   const h3 = roomDiv.querySelector("h3");
//   h3.innerText = `Room: ${room_name} (${new_cnt})`;
//   addMessage(`${user} arrived!`);
// });

// socket.on("new_message", (msg) => {
//   addMessage(msg);
// });
// socket.on("bye", (left, new_cnt) => {
//   const h3 = roomDiv.querySelector("h3");
//   h3.innerText = `Room: ${room_name} (${new_cnt})`;
//   addMessage(`${left} Left!`);
// });
// socket.on("room_change", (rooms) => {
//   const room_list = welcomeDiv.querySelector("ul");
//   room_list.innerHTML = "";
//   rooms.forEach((room) => {
//     const li = document.createElement("li");
//     li.innerHTML = room;
//     room_list.append(li);
//   });
// });
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
