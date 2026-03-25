// Redirect immediately if not logged in
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const profileName = document.querySelector("#username-profile");
  const profileEmail = document.querySelector("#profile-email");
  const profilePicture = document.querySelector("#imageProfile"); // Fix: was "#profile-picture"
  const profileBirthdate = document.querySelector("#profile-birthdate");
  const profileGender = document.querySelector("#profile-gender");
  const profileBio = document.querySelector("#profile-bio");

  // Fix: JSON uses "name", not "username"
  profileName.textContent =
    currentUser.name || currentUser.username || "Unknown";
  profileEmail.textContent = currentUser.email;
  // Fix: JSON uses "profilePicture", not "picture"
  profilePicture.src =
    currentUser.profilePicture || "../assets/profiles/default-avatar.jpg";
  profileBirthdate.textContent = currentUser.birthdate || "Not specified";
  profileGender.textContent = currentUser.gender || "Not specified";
  profileBio.textContent = currentUser.bio || "No bio available";

  const editProfileButton = document.querySelector("#Edit-Profile-button");
  editProfileButton.addEventListener("click", () => {
    document
      .querySelector("#EditProfile-Form-Section")
      .classList.remove("hidden");
    document.querySelector("#edit-username").value =
      currentUser.name || currentUser.username || "";
    // Fix: fallback to empty string to avoid "undefined" in textarea
    document.querySelector("#edit-bio").value = currentUser.bio || "";
  });

  const editForm = document.querySelector("#Edit-Profile-Form");
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newUsername = document.querySelector("#edit-username").value.trim();
    const newBio = document.querySelector("#edit-bio").value.trim();

    if (newUsername) {
      // Fix: update "name" to match JSON structure
      currentUser.name = newUsername;
      profileName.textContent = newUsername;
    }
    // Fix: allow clearing bio (removed the "if (newBio)" guard so empty bio can be saved)
    currentUser.bio = newBio;
    profileBio.textContent = newBio || "No bio available";

    // Update sessionStorage
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(
      (user) => user.email === currentUser.email,
    );
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        name: currentUser.name,
        bio: currentUser.bio,
      };
      localStorage.setItem("users", JSON.stringify(users));
    }

    document.querySelector("#EditProfile-Form-Section").classList.add("hidden");
  });
});
