import Avatar from "./Avatar";
import { avatarColor } from "../../util";
function TopFollowedList({ users }) {
  const max =
    users?.length > 0
      ? Math.max(...users?.map((u) => u._count.followers), 1)
      : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {users?.map((u, i) => (
        <div
          key={u.id}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <span
            style={{
              width: 18,
              fontSize: 12,
              color: "var(--color-text-tertiary)",
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
          <Avatar name={u.name} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--color-text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {u.name}
            </div>
            <div
              style={{
                marginTop: 3,
                height: 5,
                borderRadius: 3,
                background: "var(--color-background-secondary)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round((u._count.followers / max) * 100)}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: avatarColor(u.name),
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
          <span
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              flexShrink: 0,
            }}
          >
            {u._count.followers}{" "}
            {u._count.followers === 1 ? "follower" : "followers"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default TopFollowedList;
