const ul = document.querySelector("ul");
const messgeForm = document.querySelector("form");
var aWebSocket = new WebSocket(`ws://${window.location.host}`);
aWebSocket.binaryType = "blob";
aWebSocket.addEventListener("open", () => {
  console.log("connected");
});

aWebSocket.addEventListener("message", (event) => {
  if (event.data instanceof Blob) {
    reader = new FileReader();

    reader.onload = () => {
      console.log("Result: " + reader.result);
    };

    reader.readAsText(event.data);
  } else {
    console.log("Result: " + event.data);
  }
});

aWebSocket.addEventListener("close", () => {
  console.log("closed ");
});

// setTimeout(() => {
//   aWebSocket.send("Hello from the browser");
// }, 10000);

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messgeForm.querySelector("input");
  aWebSocket.send(input.value);
};

messgeForm.addEventListener("submit", handleSubmit);
