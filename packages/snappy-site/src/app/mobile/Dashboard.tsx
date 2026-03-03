import { Dashboard as DashboardContent, Protect } from "../components";

export const Dashboard = () => (
  <Protect>
    <DashboardContent />
  </Protect>
);
