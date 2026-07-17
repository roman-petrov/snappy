import { Redirect } from "@snappy/app-router";

import { Routes } from "../../../Routes";

export const RobokassaReturn = () => <Redirect to={Routes.settings.profile.topUp} />;
