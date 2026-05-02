const hiddenStyle = document.createElement("style");
hiddenStyle.textContent =
  ".hidden { display: none !important; } .author-link { text-decoration: none; color: inherit; cursor: pointer; } .author-link:hover { text-decoration: underline; }";
document.head.appendChild(hiddenStyle);

const openComments = new Set();
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

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function renderPosts(posts) {
  stream.innerHTML = posts
    .map((post) => {
      const postDeleteBtn =
        post.authorId === currentUser.id
          ? `<button class="delete-btn">Delete</button>`
          : "";


      const likeCount = post._count?.likes ?? post.likes?.length ?? 0;
      const isPostLiked = Array.isArray(post.likes)
        ? post.likes.some((l) => l.userId === currentUser.id)
        : false;

      const commentsHtml = (post.comments || [])
        .map(
          (c) => `
          <p>
            <b>${c.author?.name ?? c.authorName ?? c.authorId}:</b> ${c.content}
            ${
              c.authorId === currentUser.id
                ? `<button class="delete-comment-btn" data-comment-id="${c.id ?? c.commentId}">Delete</button>`
                : ""
            }
          </p>`,
        )
        .join("");

      const commentCount = post._count?.comments ?? post.comments?.length ?? 0;

      return `
        <article class="post" data-id="${post.id ?? post.postId}">
          <div class="post-header">
            <a href="profile.html?userId=${post.authorId}" class="author-link">
              <strong>${post.author?.name ?? post.authorName ?? post.authorId}</strong>
            </a>
            <span>${new Date(post.createdAt ?? post.timestamp).toLocaleDateString()}</span>
          </div>
          <p>${post.content}</p>
          ${postDeleteBtn}
          <button class="like-post-btn" style="color:${isPostLiked ? "red" : "gray"}">
            ♥ ${likeCount}
          </button>
          <button class="view-btn">Comments (${commentCount})</button>
          <div class="comments hidden">
            <input type="text" class="comment-input" placeholder="Add a comment...">
            <button class="add-comment-btn">Post</button>
            ${commentsHtml}
          </div>
        </article>`;
    })
    .join("");

  openComments.forEach((postId) => {
    const el = stream.querySelector(`.post[data-id="${postId}"]`);
    if (el) el.querySelector(".comments").classList.remove("hidden");
  });
}

async function init() {
  try {
    const posts = await apiFetch(
      `/api/posts?userId=${currentUser.id}&feed=true`,
    );
    renderPosts(posts);
  } catch (err) {
    console.error("Failed to load feed:", err);
  }
}

stream.addEventListener("click", async (e) => {
  const postEl = e.target.closest(".post");
  if (!postEl) return;
  const postId = postEl.dataset.id;

  try {
    if (e.target.classList.contains("add-comment-btn")) {
      const input = postEl.querySelector(".comment-input");
      const text = input.value.trim();
      if (!text) return;
      await apiFetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ authorId: currentUser.id, content: text }),
      });
      input.value = "";
      const posts = await apiFetch(
        `/api/posts?userId=${currentUser.id}&feed=true`,
      );
      renderPosts(posts);
    } else if (e.target.classList.contains("like-post-btn")) {
      await apiFetch(`/api/posts/${postId}/like`, {
        method: "POST",
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const posts = await apiFetch(
        `/api/posts?userId=${currentUser.id}&feed=true`,
      );
      renderPosts(posts);
    } else if (e.target.classList.contains("delete-btn")) {
      if (!confirm("Delete this post?")) return;
      await apiFetch(`/api/posts/${postId}`, {
        method: "DELETE",
        body: JSON.stringify({ authorId: currentUser.id }),
      });
      const posts = await apiFetch(
        `/api/posts?userId=${currentUser.id}&feed=true`,
      );
      renderPosts(posts);
    } else if (e.target.classList.contains("delete-comment-btn")) {
      if (!confirm("Delete this comment?")) return;
      const commentId = e.target.dataset.commentId;
      await apiFetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        body: JSON.stringify({ authorId: currentUser.id }),
      });
      const posts = await apiFetch(
        `/api/posts?userId=${currentUser.id}&feed=true`,
      );
      renderPosts(posts);
    } else if (e.target.classList.contains("view-btn")) {
      postEl.querySelector(".comments").classList.toggle("hidden");
      openComments.has(postId)
        ? openComments.delete(postId)
        : openComments.add(postId);
    }
  } catch (err) {
    console.error("Action failed:", err);
  }
});

postForm.onsubmit = async (e) => {
  e.preventDefault();
  const input = document.getElementById("post-input");
  const content = input.value.trim();
  if (!content) return;
  try {
    await apiFetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ authorId: currentUser.id, content }),
    });
    input.value = "";
    const posts = await apiFetch(
      `/api/posts?userId=${currentUser.id}&feed=true`,
    );
    renderPosts(posts);
  } catch (err) {
    console.error("Post failed:", err);
  }
};

init();
