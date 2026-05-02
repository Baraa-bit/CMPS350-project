function WordBar({ word, count, max }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          width: 90,
          fontSize: 13,
          color: "var(--color-text-primary)",
          fontWeight: 500,
        }}
      >
        {word}
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          borderRadius: 4,
          background: "var(--color-background-secondary)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 4,
            background: "#4f46e5",
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <span
        style={{
          width: 20,
          fontSize: 12,
          color: "var(--color-text-tertiary)",
          textAlign: "right",
        }}
      >
        {count}
      </span>
    </div>
  );
}

export default WordBar;
