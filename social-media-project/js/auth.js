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

export async function getUsers() {
  await loadJsonToStorage();
  const data = await JSON.parse(localStorage.getItem("users"));
  return data;
}

async function validateLogin(email, password) {
  const users = await getUsers();
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

  loginButton.addEventListener("click", async (_) => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      const incompleteLogin = document.querySelector("#incomplete");
      incompleteLogin.style.display = "block";
      return;
    }
    const loggedInUser = await validateLogin(email, password);

    if (loggedInUser) {
      const failedLogin = document.querySelector("#invalid");
      failedLogin.style.display = "none";
      const incompleteLogin = document.querySelector("#incomplete");
      incompleteLogin.style.display = "none";

      sessionStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      window.location.href = "../html/profile.html";
    } else {
      const failedLogin = document.querySelector("#invalid");
      failedLogin.style.display = "block";
      const incompleteLogin = document.querySelector("#incomplete");
      incompleteLogin.style.display = "none";
      passwordInput.value = "";
    }
  });
});
