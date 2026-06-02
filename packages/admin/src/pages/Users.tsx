import { useUsersState } from "./Users.state";
import { UsersView } from "./Users.view";

export const Users = () => <UsersView {...useUsersState()} />;
