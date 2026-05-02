function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1.25rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
