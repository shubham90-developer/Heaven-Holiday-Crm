import DashboardCard from "./DashboardCard";
import { RefreshButton, TodaySelect } from "./DashboardActions";

const Leads = () => {
  return (
    <DashboardCard
      title="Leads"
      icon="mdi:chart-line"
      iconBg="#28a745"
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
              <th>Lead Source</th>
              <th>Leads</th>
              <th>In Process</th>
              <th>Lost</th>
              <th>Converted</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Total</strong>
              </td>
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

export default Leads;
