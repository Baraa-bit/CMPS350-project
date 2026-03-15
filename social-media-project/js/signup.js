import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

async function loadJsonToStorage() {
  try {
    if (localStorage.getItem("users")) return; // don't overwrite if already loaded

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

function generateUserId() {
  return nanoid(8); // Generates a unique ID with 8 characters
}
function validatePassword(password) {
  if (!password) return false;

  if (password.length < 8) return false;

  if (!/[A-Z]/.test(password)) return false;

  if (!/[a-z]/.test(password)) return false;

  if (!/[0-9]/.test(password)) return false;

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;

  return true;
}

function validateEmail(email) {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  return true;
}

function checkDublicateEmail(email, users) {
  return !users.some((user) => user.email === email);
}

function hideErrorMessages() {
  const incompleteSignup = document.querySelector("#incomplete-signup");
  incompleteSignup.style.display = "none";
  const wrongEmailFormat = document.querySelector("#wrong-email-Format");
  wrongEmailFormat.style.display = "none";
  const dublicatedEmail = document.querySelector("#dublicate-email");
  dublicatedEmail.style.display = "none";
  const invlidPassword = document.querySelector("#validate-password");
  invlidPassword.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async (_) => {
  const users = await getUsers();

  const nameInput = document.querySelector("#name-input");
  const birthDateInput = document.querySelector("#date-input");
  const genderRadio = document.querySelectorAll("input[name='gender']");
  const emailInput = document.querySelector("#email-input");
  const passwordInput = document.querySelector("#password-input");
  const submitButton = document.querySelector("#signup-button");

  submitButton.addEventListener("click", async (_) => {
    const name = nameInput.value.trim();
    const birthDate = birthDateInput.value;
    const gender = Array.from(genderRadio).find(
      (radio) => radio.checked,
    )?.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !birthDate || !gender || !email || !password) {
      const incompleteSignup = document.querySelector("#incomplete-signup");
      incompleteSignup.style.display = "block";
      return;
    }

    const checkEmailFormat = validateEmail(email);
    const dublicateEmail = checkDublicateEmail(email, users);
    const checkPass = validatePassword(password);

    if (!checkEmailFormat) {
      const incompleteSignup = document.querySelector("#incomplete-signup");
      incompleteSignup.style.display = "none";
      const dublicatedEmail = document.querySelector("#dublicate-email");
      dublicatedEmail.style.display = "none";
      const wrongEmailFormat = document.querySelector("#wrong-email-Format");
      wrongEmailFormat.style.display = "block";
      return;
    }

    if (!dublicateEmail) {
      const incompleteSignup = document.querySelector("#incomplete-signup");
      incompleteSignup.style.display = "none";
      const wrongEmailFormat = document.querySelector("#wrong-email-Format");
      wrongEmailFormat.style.display = "none";
      const dublicatedEmail = document.querySelector("#dublicate-email");
      dublicatedEmail.style.display = "block";
      return;
    }

    if (!checkPass) {
      const incompleteSignup = document.querySelector("#incomplete-signup");
      incompleteSignup.style.display = "none";
      const invlidPassword = document.querySelector("#validate-password");
      invlidPassword.style.display = "block";
      if (dublicateEmail && checkEmailFormat) {
        const wrongEmailFormat = document.querySelector("#wrong-email-Format");
        wrongEmailFormat.style.display = "none";
        const dublicatedEmail = document.querySelector("#dublicate-email");
        dublicatedEmail.style.display = "none";
      }
      return;
    }

    const newUser = {
      id: generateUserId(),
      name: name,
      email: email,
      password: password,
      profilePicture: "assets/images/default-avatar.jpg",
      birthdate: birthDate,
      gender: gender,
      bio: "",
      following: [],
      followers: [],
    };
    hideErrorMessages();

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUser", JSON.stringify(newUser));

    window.location.href = "./profile.html";
  });
});
