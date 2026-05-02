function SectionTitle({ children }) {
  return (
    <h3
      style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--color-text-secondary)",
        margin: "0 0 14px",
      }}
    >
      {children}
    </h3>
  );
}

export default SectionTitle;
