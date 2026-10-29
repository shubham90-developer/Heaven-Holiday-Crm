import DashboardCard from "./DashboardCard";
import { RefreshButton } from "./DashboardActions";

const CancellationsModifications = () => {
  return (
    <DashboardCard
      title="Cancellations & Modifications"
      icon="mdi:cancel"
      iconBg="#e74c3c"
      actions={<RefreshButton />}
    >
      <p className="dashboard-coming-soon">Coming Soon...</p>
    </DashboardCard>
  );
};

export default CancellationsModifications;
