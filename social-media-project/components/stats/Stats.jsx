import Header from "./Header";
import TotalsRow from "./TotalsRow";
import MetricCard from "./MetricCard";
import MostActiveUser from "./MostActiveUser";
import PostCard from "./PostCard";
import SectionTitle from "./SectionTitle";
import WordBar from "./WordBar";
import Card from "./Card";
import TopFollowedList from "./TopFollowedList";

function Stats({ data }) {
  const wordMax =
    data?.topWords?.length > 0
      ? Math.max(...data.topWords.map((w) => w.count))
      : 0;
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        maxWidth: 760,
        margin: "0 auto",
        padding: "1.5rem 1rem",
      }}
    >
      {/* Header */}
      <Header />

      {/* Totals row */}
      <TotalsRow totals={data?.totals} />

      {/* Averages + Most active user */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        <MetricCard label="Avg followers / user" value={data?.avgFollowers} />
        <MetricCard label="Avg posts / user" value={data?.avgPosts} />
        <MostActiveUser mostActiveUser={data?.mostActiveUser} />
      </div>

      {/* Posts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        <PostCard post={data?.mostLikedPost} badge="Most liked" />
        <PostCard post={data?.mostCommentedPost} badge="Most discussed" />
      </div>

      {/* Word frequency + Top followed */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        <Card>
          <SectionTitle>Top words used</SectionTitle>
          {data?.topWords.map((w) => (
            <WordBar key={w.word} word={w.word} count={w.count} max={wordMax} />
          ))}
        </Card>
        <Card>
          <SectionTitle>Most followed</SectionTitle>
          <TopFollowedList users={data?.topFollowed} />
        </Card>
      </div>
    </div>
  );
}

export default Stats;
