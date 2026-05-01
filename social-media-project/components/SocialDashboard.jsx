"use client";

import { useEffect, useState } from "react";

function Card({ children }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "14px",
        padding: "20px",
        backgroundColor: "#fff",
        minHeight: "180px",
      }}
    >
      {children}
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <Card>
      <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>{title}</h2>
      <p style={{ fontSize: "28px", fontWeight: "bold" }}>{value}</p>
    </Card>
  );
}

function PostCard({ title, post }) {
  return (
    <Card>
      <h2 style={{ fontSize: "22px", marginBottom: "15px" }}>{title}</h2>

      {post ? (
        <>
          <p>
            <strong>Content:</strong> {post.content}
          </p>
          <p>
            <strong>Likes:</strong> {post._count?.likes ?? 0}
          </p>
          <p>
            <strong>Comments:</strong> {post._count?.comments ?? 0}
          </p>
        </>
      ) : (
        <p>No post found</p>
      )}
    </Card>
  );
}

function WordsCard({ words }) {
  return (
    <Card>
      <h2 style={{ fontSize: "22px", marginBottom: "15px" }}>
        Top Frequent Words
      </h2>

      {words && words.length > 0 ? (
        <ul>
          {words.map((item, index) => (
            <li key={index}>
              {item.word}: {item.count}
            </li>
          ))}
        </ul>
      ) : (
        <p>No words found</p>
      )}
    </Card>
  );
}

function TopFollowedCard({ users }) {
  return (
    <Card>
      <h2 style={{ fontSize: "22px", marginBottom: "15px" }}>
        Users With Most Followers
      </h2>

      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name}: {user._count?.followers ?? 0} followers
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </Card>
  );
}

export default function SocialDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  if (!data) {
    return <p style={{ padding: "30px" }}>Loading dashboard...</p>;
  }

  return (
    <main
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "25px" }}>Social Media Dashboard</h1>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <MetricCard
          title="Average Followers Per User"
          value={data.avgFollowers ?? 0}
        />

        <MetricCard
          title="Average Posts Per User"
          value={data.avgPosts ?? 0}
        />

        <PostCard
          title="Most Liked Post"
          post={data.mostLikedPost}
        />

        <PostCard
          title="Most Commented Post"
          post={data.mostCommentedPost}
        />

        <WordsCard words={data.topWords ?? []} />

        <TopFollowedCard users={data.topFollowed ?? []} />
      </section>
    </main>
  );
}
