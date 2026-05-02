function Header() {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 500,
          margin: 0,
          color: "var(--color-text-primary)",
        }}
      >
        Community overview
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-text-secondary)",
          margin: "4px 0 0",
        }}
      >
        Platform analytics snapshot
      </p>
    </div>
  );
}

export default Header;
