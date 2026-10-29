import DashboardCard from "./DashboardCard";
import { RefreshButton, TodaySelect } from "./DashboardActions";

const Leaderboard = () => {
  return (
    <DashboardCard
      title="Leaderboard"
      icon="mdi:trophy"
      iconBg="#e67e22"
      actions={
        <>
          <RefreshButton />
          <TodaySelect />
        </>
      }
    >
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Name</th>
              <th>No. of Sales</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody />
        </table>
      </div>
    </DashboardCard>
  );
};

export default Leaderboard;
