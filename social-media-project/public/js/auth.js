document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.querySelector("#email-login-input");
  const passwordInput = document.querySelector("#password-login-input");
  const loginButton = document.querySelector("#login-button");

  loginButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      document.querySelector("#incomplete").style.display = "block";
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const user = await res.json();
        document.querySelector("#invalid").style.display = "none";
        document.querySelector("#incomplete").style.display = "none";
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "./feed.html";
      } else {
        document.querySelector("#invalid").style.display = "block";
        document.querySelector("#incomplete").style.display = "none";
        passwordInput.value = "";
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  });
});
