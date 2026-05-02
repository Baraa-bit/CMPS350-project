let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "login.html";

const urlParams = new URLSearchParams(window.location.search);
const viewedUserId = urlParams.get("userId");
const isOwnProfile = !viewedUserId || viewedUserId === String(currentUser.id);

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    document.getElementById("logout-btn").onclick = () => {
      sessionStorage.removeItem("currentUser");
      window.location.href = "index.html";
    };
    const targetId = isOwnProfile ? currentUser.id : viewedUserId;
    const profileUser = await apiFetch(`/api/users/${targetId}`);

    const userPosts = await apiFetch(`/api/posts?userId=${targetId}`);

    const followersCount = profileUser._count?.followers ?? 0;
    const followingCount = profileUser._count?.following ?? 0;

    const statusParagraphs = document.querySelectorAll("#StatusProfile p");
    statusParagraphs[0].innerHTML = `<strong>${userPosts.length}</strong> posts`;
    statusParagraphs[1].innerHTML = `<strong>${followersCount}</strong> followers`;
    statusParagraphs[2].innerHTML = `<strong>${followingCount}</strong> following`;

    document.querySelector("#username-profile").textContent =
      profileUser.name || "Unknown";
    document.querySelector("#profile-email").textContent = profileUser.email;
    document.querySelector("#imageProfile").src =
      profileUser.profilePicture || "../assets/profiles/default-avatar.jpg";
    document.querySelector("#profile-birthdate").textContent =
      profileUser.birthdate
        ? new Date(profileUser.birthdate).toLocaleDateString()
        : "Not specified";
    document.querySelector("#profile-gender").textContent =
      profileUser.gender || "Not specified";
    document.querySelector("#profile-bio").textContent =
      profileUser.bio || "No bio available";

    const followButton = document.querySelector("#follow-button");
    const editProfileButton = document.querySelector("#Edit-Profile-button");

    if (isOwnProfile) {
      followButton.style.display = "none";
      editProfileButton.style.display = "";
    } else {
      followButton.style.display = "";
      editProfileButton.style.display = "none";

      const followingList = await apiFetch(
        `/api/users/${currentUser.id}/follow?type=following`,
      );
      const isFollowing = followingList.some(
        (u) => String(u.id) === String(targetId),
      );

      followButton.textContent = isFollowing ? "Unfollow" : "Follow";
      followButton.classList.toggle("following", isFollowing);

      followButton.addEventListener("click", async () => {
        try {
          const currently = followButton.classList.contains("following");
          if (currently) {
            await apiFetch(`/api/users/${targetId}/follow`, {
              method: "DELETE",
              body: JSON.stringify({ followerId: currentUser.id }),
            });
          } else {
            await apiFetch(`/api/users/${targetId}/follow`, {
              method: "POST",
              body: JSON.stringify({ followerId: currentUser.id }),
            });
          }
          const updated = await apiFetch(`/api/users/${targetId}`);
          statusParagraphs[1].innerHTML = `<strong>${updated._count?.followers ?? 0}</strong> followers`;
          followButton.classList.toggle("following");
          followButton.textContent = followButton.classList.contains(
            "following",
          )
            ? "Unfollow"
            : "Follow";
        } catch (err) {
          console.error("Follow action failed:", err);
        }
      });
    }

    editProfileButton.addEventListener("click", () => {
      document
        .querySelector("#EditProfile-Form-Section")
        .classList.remove("hidden");
      document.querySelector("#edit-username").value = currentUser.name || "";
      document.querySelector("#edit-bio").value = currentUser.bio || "";
    });

    document
      .querySelector("#Edit-Profile-Form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const newName = document.querySelector("#edit-username").value.trim();
        const newBio = document.querySelector("#edit-bio").value.trim();

        try {
          const updated = await apiFetch(`/api/users/${currentUser.id}`, {
            method: "PUT",
            body: JSON.stringify({ name: newName, bio: newBio }),
          });
          currentUser.name = updated.name;
          currentUser.bio = updated.bio;
          sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

          document.querySelector("#username-profile").textContent =
            updated.name;
          document.querySelector("#profile-bio").textContent =
            updated.bio || "No bio available";
          document
            .querySelector("#EditProfile-Form-Section")
            .classList.add("hidden");
        } catch (err) {
          console.error("Profile update failed:", err);
        }
      });
  } catch (err) {
    console.error("Profile load error:", err);
  }
});
