
import SystemStatusCard from "./SystemStatusCard";
import DatabaseCard from "./DatabaseCard";
import MonitoringCard from "./MonitoringCard";

type SystemTabProps = {
  onAction: (action: string) => void;
};

const SystemTab = ({ onAction }: SystemTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SystemStatusCard onAction={onAction} />
      <DatabaseCard onAction={onAction} />
      <MonitoringCard onAction={onAction} />
    </div>
  );
};

export default SystemTab;
