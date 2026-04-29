import { useLocation } from "react-router-dom";

import { Routes } from "../../Routes";
import { Dashboard } from "../dashboard";
import { Feed } from "../feed";

export const ChatWorkspace = () => {
  const { pathname } = useLocation();
  const feed = pathname === Routes.feed || pathname.endsWith(Routes.feed);

  return (
    <>
      <div hidden={feed}>
        <Dashboard />
      </div>
      <div hidden={!feed}>
        <Feed />
      </div>
    </>
  );
};
