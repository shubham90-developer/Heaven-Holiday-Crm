import DashboardCard from "./DashboardCard";

const NoticeBoard = () => {
  return (
    <DashboardCard title="Notice Board" icon="mdi:clipboard-text" iconBg="#17a2b8">
      <p className="dashboard-coming-soon">Coming Soon...</p>
    </DashboardCard>
  );
};

export default NoticeBoard;
