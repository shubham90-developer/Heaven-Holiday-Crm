import DashboardCard from "./DashboardCard";

const GameOn = () => {
  return (
    <DashboardCard title="Game On" icon="mdi:gamepad-variant" iconBg="#9b59b6">
      <p className="dashboard-coming-soon">Coming Soon...</p>
    </DashboardCard>
  );
};

export default GameOn;
