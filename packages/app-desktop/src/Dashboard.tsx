import { Dashboard as DashboardContent, Protect } from "@snappy/app";

export const Dashboard = () => (
  <Protect>
    <DashboardContent />
  </Protect>
);
