// Redirect immediately if not logged in
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
}

async function seedIfNeeded() {
  if (!localStorage.getItem("posts")) {
    const res = await fetch("../json/post.json");
    localStorage.setItem("posts", JSON.stringify(await res.json()));
  }
  if (!localStorage.getItem("users")) {
    const res = await fetch("../json/users.json");
    localStorage.setItem("users", JSON.stringify(await res.json()));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await seedIfNeeded();

  const allPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const userPosts = allPosts.filter((post) => post.authorId === currentUser.id);

  const followersCount = currentUser.followers?.length || 0;
  const followingCount = currentUser.following?.length || 0;

  const statusParagraphs = document.querySelectorAll("#StatusProfile p");
  statusParagraphs[0].innerHTML = `<strong>${userPosts.length}</strong> posts`;
  statusParagraphs[1].innerHTML = `<strong>${followersCount}</strong> followers`;
  statusParagraphs[2].innerHTML = `<strong>${followingCount}</strong> following`;

  const profileName = document.querySelector("#username-profile");
  const profileEmail = document.querySelector("#profile-email");
  const profilePicture = document.querySelector("#imageProfile");
  const profileBirthdate = document.querySelector("#profile-birthdate");
  const profileGender = document.querySelector("#profile-gender");
  const profileBio = document.querySelector("#profile-bio");

  profileName.textContent =
    currentUser.name || currentUser.username || "Unknown";
  profileEmail.textContent = currentUser.email;
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
    document.querySelector("#edit-bio").value = currentUser.bio || "";
  });

  const editForm = document.querySelector("#Edit-Profile-Form");
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newUsername = document.querySelector("#edit-username").value.trim();
    const newBio = document.querySelector("#edit-bio").value.trim();

    if (newUsername) {
      currentUser.name = newUsername;
      profileName.textContent = newUsername;
    }
    currentUser.bio = newBio;
    profileBio.textContent = newBio || "No bio available";

    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

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

    const updatedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const updatedUserPosts = updatedPosts.filter(
      (p) => p.authorId === currentUser.id,
    );
    statusParagraphs[0].innerHTML = `<strong>${updatedUserPosts.length}</strong> posts`;

    document.querySelector("#EditProfile-Form-Section").classList.add("hidden");
  });
});
