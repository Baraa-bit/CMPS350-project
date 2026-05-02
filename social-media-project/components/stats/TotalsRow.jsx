import MetricCard from "./MetricCard";

function TotalsRow({ totals }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: 10,
        marginBottom: "1.5rem",
      }}
    >
      <MetricCard label="Users" value={totals?.users ?? "0"} />
      <MetricCard label="Posts" value={totals?.posts ?? "0"} />
      <MetricCard label="Comments" value={totals?.comments ?? "0"} />
      <MetricCard label="Likes" value={totals?.likes ?? "0"} />
      <MetricCard label="Follows" value={totals?.follows ?? "0"} />
    </div>
  );
}

export default TotalsRow;
