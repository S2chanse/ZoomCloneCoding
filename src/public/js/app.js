var aWebSocket = new WebSocket(`ws://${window.location.host}`);
aWebSocket.addEventListener("open", () => {
  console.log("connected");
});

aWebSocket.addEventListener("message", (message) => {
  console.log(message.data);
});

aWebSocket.addEventListener("close", () => {
  console.log("closed ");
});

setTimeout(() => {
  aWebSocket.send("Hello from the browser");
}, 10000);
