async function loadJsonToStorage() {
  try {
    const response = await fetch("../json/user.json");

    const data = await response.json();

    localStorage.setItem("users", JSON.stringify(data));

    console.log("Data successfully moved from JSON file to LocalStorage!");
  } catch (error) {
    console.error("Could not load the JSON file:", error);
  }
}

async function getUsers() {
  await loadJsonToStorage();
  const data = JSON.parse(localStorage.getItem("users"));
  return data;
}

function validateLogin(email, password) {
  const users = JSON.parse(localStorage.getItem("users"));
  if (!users) {
    console.error("no users data found");
    return null;
  }
  const user = users.find((i) => i.email === email && i.password === password);

  if (user) {
    console.log("Login successful!", user);
    return user;
  } else {
    console.log("Invalid email or password");
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.querySelector("#email-login-input");
  const passwordInput = document.querySelector("#password-login-input");
  const loginButton = document.querySelector("#login-button");

  loginButton.addEventListener("click", (_) => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    const loggedInUser = validateLogin(email, password);

    if (loggedInUser) {
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      alert(`Welcome, ${loggedInUser.name}!`);
    } else {
      alert("Invalid email or password");
      passwordInput.value = "";
    }
  });
});
