import { RemendDocument } from "./RemendDocument";
import { RemendGrapheme } from "./RemendGrapheme";
import { RemendLine } from "./RemendLine";
import { RemendList } from "./RemendList";
import { RemendTable } from "./RemendTable";

const afterScan = (text: string) => text.split(`\n`).map(RemendLine.finish).join(`\n`);
const emphasisIn = (text: string) => /[*_`~]/u.test(text);
const tableIn = (text: string) => text.includes(`|`);
const incompleteListLine = (line: string) => /^\s*[*+-]\s*$/u.test(line) || /^\s*\d+\.\s*$/u.test(line);
const incompleteListIn = (text: string) => text.split(`\n`).some(incompleteListLine);

const apply = (text: string) => {
  const scanned = RemendDocument.scan(text);
  const lined = emphasisIn(scanned) ? afterScan(scanned) : scanned;
  const tabled = tableIn(lined) ? RemendTable.repair(lined) : lined;
  const listed = incompleteListIn(tabled) ? RemendList.complete(tabled) : tabled;

  return RemendGrapheme.needsTrim(listed) ? listed.split(`\n`).map(RemendGrapheme.trim).join(`\n`) : listed;
};

export const Remend = { apply };
