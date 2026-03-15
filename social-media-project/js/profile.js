const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userName = currentUser["name"];

const element = document.createElement("div");
element.append(`hello ${userName}`);

document.body.appendChild(element);
