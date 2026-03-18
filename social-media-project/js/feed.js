let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
if (!currentUser) {
  currentUser = { name: "TestUser" }; 
}
document.getElementById("logout-btn").onclick = () => {
  sessionStorage.removeItem("currentUser");
  window.location.href = "index.html";
};
async function init() {
  if (!localStorage.getItem("posts")) {
    const res = await fetch("../json/post.json");
    localStorage.setItem("posts", JSON.stringify(await res.json()));
  }
  renderPosts();
}
function renderPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const stream = document.getElementById("posts-stream");
  stream.innerHTML = ""; 
  posts.forEach(post => {
    const postDeleteBtn = post.authorId === currentUser.name ? `<button class="delete-btn">Delete</button>` : "";
    const commentsHtml = (post.comments || []).map((c, i) => `
      <p><b>${c.authorId}:</b> ${c.content} 
      ${c.authorId === currentUser.name ? `<button class="delete-comment-btn" data-index="${i}">x</button>` : ""}</p>
    `).join("");
    stream.innerHTML += `
      <article class="post" data-id="${post.postId}">
        <div class="post-header">
          <strong>${post.authorId}</strong> <span>${post.timestamp}</span>
        </div>
        <p>${post.content}</p>
        ${postDeleteBtn}
        <button class="view-btn">Comments (${post.comments?.length || 0})</button>
        <div class="comments" style="display:none;">
          ${commentsHtml}
        </div>
      </article>
    `;
  });
}
document.getElementById("create-post-form").onsubmit = (e) => {
  e.preventDefault();
  // tmp
  const input = document.getElementById("post-input");
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.unshift({ 
    postId: "p_" + Date.now(),
    authorId: currentUser.name, 
    content: input.value,
    timestamp: new Date().toISOString().split("T")[0],
    comments: []
  });
  localStorage.setItem("posts", JSON.stringify(posts));
  input.value = ""; 
  renderPosts();
};
document.getElementById("posts-stream").onclick = (e) => {
  const postEl = e.target.closest(".post");
  if (!postEl) return;
  const postId = postEl.dataset.id;
  if (e.target.className === "delete-btn") {
    let posts = JSON.parse(localStorage.getItem("posts"));
    posts = posts.filter(p => p.postId !== postId);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  } 
  else if (e.target.className === "delete-comment-btn") {
    let posts = JSON.parse(localStorage.getItem("posts"));
    const post = posts.find(p => p.postId === postId);
    post.comments.splice(e.target.dataset.index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
  else if (e.target.className === "view-btn") {
    const commentsDiv = postEl.querySelector(".comments");
    commentsDiv.style.display = commentsDiv.style.display === "none" ? "block" : "none";
  }
};
init();
