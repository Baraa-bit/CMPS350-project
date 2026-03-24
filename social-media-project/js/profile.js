let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
if (!currentUser) {
  currentUser = { name: "TestUser" };
}
async function init() {
  try {
    if (!localStorage.getItem("posts")) {
      const res = await fetch("../json/post.json");
      const posts = await res.json();

      posts.forEach(post => {
        if (!post.likes) {
          post.likes = [];
        }
        if (!post.comments) {
          post.comments = [];
        }
      });

      localStorage.setItem("posts", JSON.stringify(posts));
    }

    renderPosts();
  } catch (error) {
    console.log(error);
  }
}

function renderPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    stream.innerHTML = posts.map(post => {
      const postDeleteBtn =
        post.authorId === currentUser.name
          ? `<button class="delete-btn">Delete</button>`
          : "";

      const isLiked = (post.likes || []).includes(currentUser.name);

      const likeBtn = `
        <button class="like-btn">
          ${isLiked ? "Unlike" : "Like"} (${post.likes?.length || 0})
        </button>
      `;

      const commentsHtml = (post.comments || [])
        .map((c, i) => `
          <p>
            <b>${c.authorId}:</b> ${c.content}
            ${c.authorId === currentUser.name
              ? `<button class="delete-comment-btn" data-index="${i}">x</button>`
              : ""}
          </p>
        `)
        .join("");

      return `
        <article class="post" data-id="${post.postId}">
          <div class="post-header">
            <strong>${post.authorId}</strong>
            <span>${post.timestamp}</span>
          </div>

          <p>${post.content}</p>

          <div class="post-actions">
            ${postDeleteBtn}
            ${likeBtn}
            <button class="view-btn">Comments (${post.comments?.length || 0})</button>
          </div>

          <div class="comments hidden">
            <div class="comments-list">
              ${commentsHtml}
            </div>

            <form class="comment-form">
              <input type="text" class="comment-input" placeholder="Write a comment..." />
              <button type="submit" class="add-comment-btn">Comment</button>
            </form>
          </div>
        </article>
      `;
    }).join("");
  } catch (error) {
    console.log(error);
  }
}

postForm.onsubmit = e => {
  try {
    e.preventDefault();

    const input = document.getElementById("post-input");
    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.unshift({
      postId: "p_" + Date.now(),
      authorId: currentUser.name,
      content: input.value,
      timestamp: new Date().toLocaleDateString("en-CA"),
      likes: [],
      comments: []
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    input.value = "";
    renderPosts();
  } catch (error) {
    console.log(error);
  }
};

stream.onclick = e => {
  try {
    const postEl = e.target.closest(".post");
    if (!postEl) return;

    const postId = postEl.dataset.id;

    if (e.target.classList.contains("delete-btn")) {
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      posts = posts.filter(p => p.postId !== postId);
      localStorage.setItem("posts", JSON.stringify(posts));
      renderPosts();
    }

    else if (e.target.classList.contains("like-btn")) {
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      const post = posts.find(p => p.postId === postId);

      if (!post.likes) {
        post.likes = [];
      }

      if (post.likes.includes(currentUser.name)) {
        post.likes = post.likes.filter(name => name !== currentUser.name);
      } else {
        post.likes.push(currentUser.name);
      }

      localStorage.setItem("posts", JSON.stringify(posts));
      renderPosts();
    }

    else if (e.target.classList.contains("delete-comment-btn")) {
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      const post = posts.find(p => p.postId === postId);

      post.comments.splice(e.target.dataset.index, 1);

      localStorage.setItem("posts", JSON.stringify(posts));
      renderPosts();
    }

    else if (e.target.classList.contains("view-btn")) {
      postEl.querySelector(".comments").classList.toggle("hidden");
    }
  } catch (error) {
    console.log(error);
  }
};

stream.onsubmit = e => {
  try {
    if (!e.target.classList.contains("comment-form")) return;

    e.preventDefault();

    const postEl = e.target.closest(".post");
    const postId = postEl.dataset.id;
    const input = e.target.querySelector(".comment-input");
    const commentText = input.value.trim();

    if (!commentText) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find(p => p.postId === postId);

    if (!post.comments) {
      post.comments = [];
    }

    post.comments.push({
      authorId: currentUser.name,
      content: commentText
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();

    const updatedPost = stream.querySelector(`[data-id="${postId}"]`);
    if (updatedPost) {
      updatedPost.querySelector(".comments").classList.remove("hidden");
    }
  } catch (error) {
    console.log(error);
  }
};

init();