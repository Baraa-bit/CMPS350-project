const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
const userName = currentUser["name"];

const element = document.createElement("div");
element.textContent = `hello ${userName}`;

document.body.appendChild(element);
