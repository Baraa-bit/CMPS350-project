import SectionTitle from "./SectionTitle";
import Avatar from "./Avatar";
import Card from "./Card";

function MostActiveUser({ mostActiveUser }) {
  return (
    <Card>
      <SectionTitle>Most active user</SectionTitle>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name={mostActiveUser?.name} size={44} />
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            {mostActiveUser?.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              marginTop: 2,
            }}
          >
            Activity score:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>
              {mostActiveUser?.activity}
            </strong>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default MostActiveUser;
