import DashboardCard from "./DashboardCard";
import { RefreshButton, TodaySelect } from "./DashboardActions";

const Queries = () => {
  return (
    <DashboardCard
      title="Queries"
      icon="mdi:help-circle-outline"
      iconBg="#e74c3c"
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
              <th>Service</th>
              <th>Queries</th>
              <th>WIP</th>
              <th>Hot</th>
              <th>Lost</th>
              <th>Won</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NA</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export default Queries;
