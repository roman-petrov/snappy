import { ListItemBody } from "../../components/ListItemBody";
import { TableCellBody } from "../../components/TableCellBody";
import { Code, List, Table } from "./components";
import styles from "./Theme.module.scss";

export const Theme = { cn: styles.root, components: { Code, List, ListItemBody, Table, TableCellBody } };
