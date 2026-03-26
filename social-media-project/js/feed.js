let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
if (!currentUser) {
  currentUser = { id: "test_id", name: "TestUser", following: [] };
}
const stream = document.getElementById("posts-stream");
const postForm = document.getElementById("create-post-form");

document.getElementById("logout-btn").onclick = () => {
  sessionStorage.removeItem("currentUser");
  window.location.href = "index.html";
};
async function init() {
  try {
    if (!localStorage.getItem("posts")) {
      const res = await fetch("../json/post.json");
      localStorage.setItem("posts", JSON.stringify(await res.json()));
    }
    renderPosts();
  } catch (error) {
    console.log(error);
  }
}
function renderPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Helper to find name by ID
    const getUserName = (id) => {
      const user = users.find((u) => u.id === id);
      return user ? user.name : id;
    };

    // Filter posts: show only my posts and posts from people I follow
    const visiblePosts = posts.filter(
      (post) =>
        post.authorId === currentUser.id ||
        currentUser.following?.includes(post.authorId),
    );

    stream.innerHTML = visiblePosts
      .map((post) => {
        const postDeleteBtn =
          post.authorId === currentUser.id
            ? `<button class="delete-btn">Delete</button>`
            : "";
        const postLikes = post.likes || 0;
        const isPostLiked = post.likedBy?.includes(currentUser.id);

        const commentsHtml = (post.comments || [])
          .map(
            (c, i) => `
        <p><b>${getUserName(c.authorId)}:</b> ${c.content} 
        ${c.authorId === currentUser.id ? `<button class="delete-comment-btn" data-index="${i}">x</button>` : ""}
        <button class="like-comment-btn" data-index="${i}" style="color: ${c.likedBy?.includes(currentUser.id) ? "red" : "gray"}">
          ♥ ${c.likes || 0}
        </button>
        <span class="like-details">${c.likedBy?.length > 0 ? `(${c.likedBy.map((id) => getUserName(id)).join(", ")})` : ""}</span>
        </p>
      `,
          )
          .join("");

        return `
        <article class="post" data-id="${post.postId}">
          <div class="post-header">
            <strong><a href="profile.html?userId=${post.authorId}" style="cursor:pointer; text-decoration:none;">${getUserName(post.authorId)}</a></strong>
            <span>${post.timestamp}</span>
          </div>
          <p>${post.content}</p>
          ${postDeleteBtn}
          <button class="like-post-btn" style="color: ${isPostLiked ? "red" : "gray"}">♥ ${postLikes}</button>
          <span class="like-details">${post.likedBy?.length > 0 ? `(${post.likedBy.map((id) => getUserName(id)).join(", ")})` : ""}</span>
          <button class="view-btn">Comments (${post.comments?.length || 0})</button>
          <div class="comments hidden">
            <input type="text" class="comment-input" placeholder="Add a comment...">
            <button class="add-comment-btn">Post</button>
            ${commentsHtml}
          </div>
        </article>
      `;
      })
      .join("");
  } catch (error) {
    console.log(error);
  }
}

stream.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-comment-btn")) {
    const postEl = e.target.closest(".post");
    const postId = postEl.dataset.id;
    const commentInput = postEl.querySelector(".comment-input");
    const commentText = commentInput.value.trim();

    if (commentText) {
      let posts = JSON.parse(localStorage.getItem("posts"));
      const post = posts.find((p) => p.postId === postId);
      post.comments.push({
        commentId: "c_" + Date.now(),
        authorId: currentUser.id,
        content: commentText,
        likes: 0,
        likedBy: [],
      });
      localStorage.setItem("posts", JSON.stringify(posts));
      commentInput.value = "";
      renderPosts();
    }
  } else if (e.target.classList.contains("like-post-btn")) {
    const postEl = e.target.closest(".post");
    const postId = postEl.dataset.id;
    let posts = JSON.parse(localStorage.getItem("posts"));
    const post = posts.find((p) => p.postId === postId);
    post.likedBy = post.likedBy || [];

    const userIndex = post.likedBy.indexOf(currentUser.id);
    if (userIndex > -1) {
      post.likedBy.splice(userIndex, 1);
    } else {
      post.likedBy.push(currentUser.id);
    }
    post.likes = post.likedBy.length;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  } else if (e.target.classList.contains("like-comment-btn")) {
    const postEl = e.target.closest(".post");
    const postId = postEl.dataset.id;
    const commentIndex = e.target.dataset.index;
    let posts = JSON.parse(localStorage.getItem("posts"));
    const post = posts.find((p) => p.postId === postId);
    const comment = post.comments[commentIndex];
    comment.likedBy = comment.likedBy || [];

    const userIndex = comment.likedBy.indexOf(currentUser.id);
    if (userIndex > -1) {
      comment.likedBy.splice(userIndex, 1);
    } else {
      comment.likedBy.push(currentUser.id);
    }
    comment.likes = comment.likedBy.length;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
});
postForm.onsubmit = (e) => {
  try {
    e.preventDefault();
    const input = document.getElementById("post-input");
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift({
      postId: "p_" + Date.now(),
      authorId: currentUser.id,
      content: input.value,
      timestamp: new Date().toLocaleDateString("en-CA"),
      comments: [],
    });
    localStorage.setItem("posts", JSON.stringify(posts));
    input.value = "";
    renderPosts();
  } catch (error) {
    console.log(error);
  }
};
stream.onclick = (e) => {
  try {
    const postEl = e.target.closest(".post");
    if (!postEl) return;
    const postId = postEl.dataset.id;
    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this post?")) {
        let posts = JSON.parse(localStorage.getItem("posts"));
        posts = posts.filter((p) => p.postId !== postId);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
      }
    } else if (e.target.classList.contains("delete-comment-btn")) {
      if (confirm("Are you sure you want to delete this comment?")) {
        let posts = JSON.parse(localStorage.getItem("posts"));
        const post = posts.find((p) => p.postId === postId);
        post.comments.splice(e.target.dataset.index, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
      }
    } else if (e.target.classList.contains("view-btn")) {
      postEl.querySelector(".comments").classList.toggle("hidden");
    }
  } catch (error) {
    console.log(error);
  }
};
init();
