import IconifyIcon from "@/components/wrappers/IconifyIcon";
import DashboardCard from "./DashboardCard";
import { RefreshButton } from "./DashboardActions";

const TasksList = () => {
  return (
    <DashboardCard
      title="Tasks List"
      icon="mdi:format-list-checks"
      iconBg="#3498db"
      actions={
        <div className="tasks-header-actions">
          <RefreshButton />
          <button type="button" className="dashboard-action-btn" aria-label="Filter">
            <IconifyIcon icon="mdi:filter-variant" />
          </button>
          <button type="button" className="dashboard-action-btn" aria-label="Calendar">
            <IconifyIcon icon="mdi:calendar" />
          </button>
        </div>
      }
    >
      <div className="task-item">
        <div>
          <div className="task-title">Call | Santosh Vetal (+91-9850948751)</div>
          <p className="task-meta">
            In-Complete On Apr 20, 2027 11:00 AM - Shreya Mohan Tupe
          </p>
        </div>
        <button type="button" className="task-phone-btn" aria-label="Call">
          <IconifyIcon icon="mdi:phone" />
        </button>
      </div>
    </DashboardCard>
  );
};

export default TasksList;
