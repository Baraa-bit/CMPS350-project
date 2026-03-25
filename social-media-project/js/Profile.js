const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

document.addEventListener("DOMContentLoaded", () => {
  const profileName = document.querySelector("#username-profile");
  const profileEmail = document.querySelector("#profile-email");
  const profilePicture = document.querySelector("#profile-picture");
  const profileBirthdate = document.querySelector("#profile-birthdate");
  const profileGender = document.querySelector("#profile-gender");
  const profileBio = document.querySelector("#profile-bio");

  profileName.textContent = currentUser.username;
  profileEmail.textContent = currentUser.email;
  profilePicture.src = currentUser.picture || "default-profile.png";
  profileBirthdate.textContent = currentUser.birthdate || "Not specified";
  profileGender.textContent = currentUser.gender || "Not specified";
  profileBio.textContent = currentUser.bio || "No bio available";

  const editProfileButton = document.querySelector("#Edit-Profile-button");
  editProfileButton.addEventListener("click", () => {
    document
      .querySelector("#EditProfile-Form-Section")
      .classList.remove("hidden");
  });
});
