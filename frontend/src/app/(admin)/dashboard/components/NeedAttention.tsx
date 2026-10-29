import DashboardCard from "./DashboardCard";

const attentionItems = [
  { label: "Today's Holiday Check-ins", borderColor: "#5b9bd5" },
  { label: "Today's Hotel Check-ins", borderColor: "#28a745" },
  { label: "Today's Flight Check-ins", borderColor: "#f58220" },
  { label: "Today Collection", borderColor: "#5b9bd5" },
  { label: "Follow Ups", borderColor: "#28a745" },
  { label: "In Process Queries", borderColor: "#f58220" },
];

const NeedAttention = () => {
  return (
    <DashboardCard
      title="Need Attention"
      icon="mdi:alert-circle-outline"
      iconBg="#e74c3c"
    >
      {attentionItems.map((item) => (
        <div
          key={item.label}
          className="need-attention-item"
          style={{ borderLeftColor: item.borderColor }}
        >
          {item.label}
        </div>
      ))}
    </DashboardCard>
  );
};

export default NeedAttention;
