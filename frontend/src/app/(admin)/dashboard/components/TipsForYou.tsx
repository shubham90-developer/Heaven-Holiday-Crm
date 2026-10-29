import DashboardCard from "./DashboardCard";
import { NavArrows } from "./DashboardActions";

const TipsForYou = () => {
  return (
    <DashboardCard
      title="Tips For You"
      icon="mdi:lightbulb-on"
      iconBg="#f1c40f"
      actions={<NavArrows />}
    >
      <p className="dashboard-coming-soon">Coming Soon...</p>
    </DashboardCard>
  );
};

export default TipsForYou;
