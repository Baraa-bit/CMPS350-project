import Avatar from "./Avatar";

function PostCard({ post, badge }) {
  const date = new Date(post?.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1rem 1.25rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={post?.author.name} size={34} />
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              {post?.author.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
              {date}
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            padding: "3px 10px",
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-background-info)",
            color: "var(--color-text-info)",
          }}
        >
          {badge}
        </span>
      </div>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-text-primary)",
          lineHeight: 1.6,
          margin: "0 0 12px",
        }}
      >
        {post?.content}
      </p>
      <div
        style={{
          display: "flex",
          gap: 16,
          fontSize: 13,
          color: "var(--color-text-secondary)",
        }}
      >
        <span>♥ {post?._count.likes} likes</span>
        <span>💬 {post?._count.comments} comments</span>
      </div>
    </div>
  );
}

export default PostCard;
