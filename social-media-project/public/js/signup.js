function validatePassword(password) {
  if (!password || password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
}

function validateEmail(email) {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hideErrorMessages() {
  document.querySelector("#incomplete-signup").style.display = "none";
  document.querySelector("#wrong-email-Format").style.display = "none";
  document.querySelector("#dublicate-email").style.display = "none";
  document.querySelector("#validate-password").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.querySelector("#name-input");
  const birthDateInput = document.querySelector("#date-input");
  const genderRadio = document.querySelectorAll("input[name='gender']");
  const emailInput = document.querySelector("#email-input");
  const passwordInput = document.querySelector("#password-input");
  const submitButton = document.querySelector("#signup-button");

  submitButton.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const birthDate = birthDateInput.value;
    const gender = Array.from(genderRadio).find((r) => r.checked)?.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !birthDate || !gender || !email || !password) {
      document.querySelector("#incomplete-signup").style.display = "block";
      return;
    }
    if (!validateEmail(email)) {
      hideErrorMessages();
      document.querySelector("#wrong-email-Format").style.display = "block";
      return;
    }
    if (!validatePassword(password)) {
      hideErrorMessages();
      document.querySelector("#validate-password").style.display = "block";
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          birthdate: birthDate,
          gender,
        }),
      });

      if (res.status === 409) {
        hideErrorMessages();
        document.querySelector("#dublicate-email").style.display = "block";
        return;
      }

      if (res.ok) {
        const newUser = await res.json();
        hideErrorMessages();
        sessionStorage.setItem("currentUser", JSON.stringify(newUser));
        window.location.href = "./feed.html";
      } else {
        const err = await res.json();
        alert(err.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  });
});
