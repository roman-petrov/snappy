import { useUserEditState } from "./UserEdit.state";
import { UserEditView } from "./UserEdit.view";

export type UserEditProps = { userId: string };

export const UserEdit = (props: UserEditProps) => <UserEditView {...useUserEditState(props)} />;
