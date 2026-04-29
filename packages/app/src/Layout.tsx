import { Layout as BaseLayout } from "@snappy/ui";
import { Outlet } from "react-router-dom";

import { AuthGuard } from "./AuthGuard";
import { HeaderContent } from "./components";

export const Layout = () => (
  <BaseLayout
    content={
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    }
    header={<HeaderContent />}
  />
);
