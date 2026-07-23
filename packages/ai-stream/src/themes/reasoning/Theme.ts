import { ListItemBody } from "../../components/ListItemBody";
import { TableCellBody } from "../../components/TableCellBody";
import { Code, List, Table } from "../chat/components";
import styles from "./Theme.module.scss";

export const Theme = { cn: styles.root, components: { Code, List, ListItemBody, Table, TableCellBody } };
