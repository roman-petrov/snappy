import { DbCoreClient } from "./DbCoreClient";
import { DbCoreUsers } from "./DbCoreUsers";

export const DbCoreAdmin = (connectionString: string) => ({ users: DbCoreUsers(DbCoreClient(connectionString)) });

export type DbCoreAdmin = ReturnType<typeof DbCoreAdmin>;
