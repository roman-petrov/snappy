import { useUserListState } from "./UserList.state";
import { UserListView } from "./UserList.view";

export const UserList = () => <UserListView {...useUserListState()} />;
