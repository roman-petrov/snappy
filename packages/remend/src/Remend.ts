import { RemendDocument } from "./RemendDocument";
import { RemendGrapheme } from "./RemendGrapheme";
import { RemendLine } from "./RemendLine";
import { RemendLink } from "./RemendLink";
import { RemendList } from "./RemendList";
import { RemendTable } from "./RemendTable";

const afterScan = (text: string) => text.split(`\n`).map(RemendLine.finish).join(`\n`);
const emphasisIn = (text: string) => /[*_`~]/u.test(text);
const tableIn = (text: string) => text.includes(`|`);
const linkIn = (text: string) => text.includes(`[`) || /<https?/u.test(text);
const incompleteListLine = (line: string) => /^\s*[*+-]\s*$/u.test(line) || /^\s*\d+\.\s*$/u.test(line);
const incompleteListIn = (text: string) => text.split(`\n`).some(incompleteListLine);

const apply = (text: string) => {
  const scanned = RemendDocument.scan(text);
  const lined = emphasisIn(scanned) ? afterScan(scanned) : scanned;
  const listed = incompleteListIn(lined) ? RemendList.complete(lined) : lined;
  const linked = linkIn(listed) ? RemendLink.repair(listed) : listed;
  const tabled = tableIn(linked) ? RemendTable.repair(linked) : linked;

  return RemendGrapheme.needsTrim(tabled) ? tabled.split(`\n`).map(RemendGrapheme.trim).join(`\n`) : tabled;
};

export const Remend = { apply };
