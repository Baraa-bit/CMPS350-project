let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const viewedUserId = urlParams.get("userId");

const isOwnProfile = !viewedUserId || viewedUserId === String(currentUser.id);

let profileUser = currentUser;

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

  if (!isOwnProfile) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => String(u.id) === viewedUserId);
    if (foundUser) {
      profileUser = foundUser;
    }
  }

  const allPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const userPosts = allPosts.filter((post) => post.authorId === profileUser.id);

  const followersCount = profileUser.followers?.length || 0;
  const followingCount = profileUser.following?.length || 0;

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
    profileUser.name || profileUser.username || "Unknown";
  profileEmail.textContent = profileUser.email;
  profilePicture.src =
    profileUser.profilePicture || "../assets/profiles/default-avatar.jpg";
  profileBirthdate.textContent = profileUser.birthdate || "Not specified";
  profileGender.textContent = profileUser.gender || "Not specified";
  profileBio.textContent = profileUser.bio || "No bio available";

  const followButton = document.querySelector("#follow-button");
  const editProfileButton = document.querySelector("#Edit-Profile-button");

  if (isOwnProfile) {
    followButton.style.display = "none";
    editProfileButton.style.display = "";
  } else {
    followButton.style.display = "";
    editProfileButton.style.display = "none";
  }

  function updateFollowBtn(button, isFollowing) {
    button.textContent = isFollowing ? "Unfollow" : "Follow";
    button.classList.toggle("following", isFollowing);
  }

  if (!isOwnProfile) {
    const isFollowing = currentUser.following?.includes(profileUser.id);
    updateFollowBtn(followButton, isFollowing);

    followButton.addEventListener("click", () => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const currentUserIndex = users.findIndex(
        (u) => String(u.id) === String(currentUser.id),
      );
      const profileUserIndex = users.findIndex(
        (u) => String(u.id) === String(profileUser.id),
      );
      if (currentUserIndex === -1 || profileUserIndex === -1) return;

      currentUser.following = currentUser.following || [];
      users[profileUserIndex].followers =
        users[profileUserIndex].followers || [];

      const alreadyFollowing = currentUser.following.includes(profileUser.id);

      if (alreadyFollowing) {
        currentUser.following = currentUser.following.filter(
          (id) => id !== profileUser.id,
        );
        users[profileUserIndex].followers = users[
          profileUserIndex
        ].followers.filter((id) => id !== currentUser.id);
      } else {
        currentUser.following.push(profileUser.id);
        users[profileUserIndex].followers.push(currentUser.id);
      }

      users[currentUserIndex] = {
        ...users[currentUserIndex],
        following: currentUser.following,
      };
      localStorage.setItem("users", JSON.stringify(users));
      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

      const updatedFollowers = users[profileUserIndex].followers.length;
      statusParagraphs[1].innerHTML = `<strong>${updatedFollowers}</strong> followers`;

      updateFollowBtn(followButton, !alreadyFollowing);
    });
  }

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
