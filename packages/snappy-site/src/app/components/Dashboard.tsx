import { useDashboardState } from "./Dashboard.state";
import { DashboardView } from "./Dashboard.view";

export const Dashboard = () => <DashboardView {...useDashboardState()} />;
