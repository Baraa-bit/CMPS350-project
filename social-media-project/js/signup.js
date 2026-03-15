import { getUsers } from "./auth";

const users = await getUsers();

function validatePassword(password) {
  if (!password) {
    return false;
  }
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false;
  }
  return true;
}

function validateEmail(email) {
  if (!email) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
}

function checkDublicateEmail(email) {
  if (!users.include(email)) {
    return true;
  }
  return false;
}

document.addEventListener("DOMContentLoaded", (_) => {
  const nameInput = document.querySelector("#name-input");
  const birthDateInput = document.querySelector("#date-input");
  const genderInput = document.querySelector("#gender-form");
  const emailInput = document.querySelector("#email-input");
  const passwordInput = document.querySelector("#password-input");
  const submitButton = document.querySelector("#signup-button");

  submitButton.addEventListener("click", (_) => {
    const name = nameInput.value.trim();
    const birthDate = birthDateInput.value;
    const gender = genderInput.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !birthDate || !gender || !email || !password) {
      const incompleteSignup = document.querySelector("#incomplete-signup");
      incompleteSignup.style.display = "block";
      return;
    }
  });
});
