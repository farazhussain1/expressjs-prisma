const token = prompt("Enter auth token");
const from = prompt("Enter User name");

const socket = io("http://localhost:4003", {
  query: `token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImljZTFAZ21haWwuY29tIiwiaWQiOjEzLCJpYXQiOjE2ODQ0MjQwNTMsImV4cCI6MTY4NDUxMDQ1M30.7Ka6QZ93oAQ0mZsHPWo6vK8VR0ho-UkXZxIgO0SyhFU`,
});

const form = document.getElementById("send-container");
const title = document.getElementById("main-title");
const heading = document.getElementById("heading");
const messageInput = document.getElementById("messageInp");
const recieverInut = document.getElementById("recieverInp");
const messageContainer = document.querySelector(".container");

//Appending all new messages to the container.
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const to = recieverInut.value;
  
  append(`You : ${message}`, "right");
  console.log(message, to, from);
  socket.emit("message", { message, to });
  messageInput.value = "";
  recieverInut.value = "";
});

socket.on("message", (data) => {
  append(`${data.from} : ${data.message}`, "left");
});

socket.on("alert", (data) => {
  console.log(data);
});
