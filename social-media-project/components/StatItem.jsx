function StatItem({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        width: "200px",
      }}
    >
      <h1>{label}</h1>
      <p>{value}</p>
    </div>
  );
}

export default StatItem;
