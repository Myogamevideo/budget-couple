import { strFromU8, unzipSync } from "fflate";
import "./style.css";

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const monthShort = [
  "jan", "fév", "mar", "avr", "mai", "jun",
  "jul", "aoû", "sep", "oct", "nov", "déc",
];
const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const numberFormat = new Intl.NumberFormat("fr-FR");
const accountDashboards = [
  { id: "tr", label: "Trade Republic (TR)", aliases: ["trade republic", "traderepublic", "tr"], categoryAliases: [], types: ["income", "expense"] },
  { id: "summeria", label: "Summeria", aliases: ["summeria"], categoryAliases: [], types: ["income", "expense"] },
  { id: "cacf", label: "CACF", aliases: ["cacf"], categoryAliases: [], types: ["income", "expense"] },
  {
    id: "cperso",
    label: "C Perso",
    aliases: ["c perso"],
    categoryAliases: ["alexandre peage", "alexandre c perso", "kelly c perso", "kelly carte restaurant"],
    types: ["expense"],
  },
  { id: "issues", label: "À vérifier", aliases: [], categoryAliases: [], types: ["income", "expense"] },
  { id: "works", label: "Travaux", aliases: [], categoryAliases: [], types: ["expense"] },
  { id: "daily", label: "Dépenses du quotidien", aliases: [], categoryAliases: [], types: ["expense"] },
];
const personalPotCategories = {
  alexandre: ["alexandre tr", "alexandre cacf", "alexandre summeria", "alexandre peage", "alexandre c perso"],
  kelly: ["kelly tr", "kelly cacf", "kelly summeria", "kelly c perso", "kelly carte restaurant"],
};
const personalExpenseCategories = {
  alexandre: ["alexandre tr", "alexandre cacf", "alexandre summeria"],
  kelly: ["kelly tr", "kelly cacf", "kelly summeria"],
};
const sharedCategories = [
  "remboursement", "saveback", "interets", "dividende", "cto",
  "50/50 couple tr", "50/50 couple cacf", "50/50 couple summeria",
  "alexandre peage", "alexandre c perso", "kelly c perso", "kelly carte restaurant",
];
const openingBalancesStorageKey = "clair.opening-balances.v1";
const currentBalancesStorageKey = "clair.current-balances.v1";

function loadOpeningBalances() {
  try {
    const stored = JSON.parse(localStorage.getItem(openingBalancesStorageKey) || "{}");
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
    return stored;
  } catch {
    return {};
  }
}

function loadCurrentBalances() {
  try {
    const stored = JSON.parse(localStorage.getItem(currentBalancesStorageKey) || "{}");
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
    return stored;
  } catch {
    return {};
  }
}

const state = {
  transactions: [],
  fileName: "",
  dashboard: "overview",
  year: "all",
  category: "all",
  account: "all",
  type: "all",
  search: "",
  page: 1,
  pageSize: 10,
  openingBalances: loadOpeningBalances(),
  currentBalances: loadCurrentBalances(),
};

const app = document.querySelector("#app");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatMoney(value, precise = false) {
  return currency.format(value);
}

function parseAmount(value) {
  if (typeof value === "number") return value;
  let text = String(value ?? "").trim();
  if (!text) return Number.NaN;
  const isParenthesized = /^\(.*\)$/.test(text);
  text = text.replace(/[^\d,.-]/g, "");
  const commaIndex = text.lastIndexOf(",");
  const periodIndex = text.lastIndexOf(".");
  if (commaIndex >= 0 && periodIndex > commaIndex) {
    text = text.replace(/,/g, "");
  } else if (commaIndex >= 0) {
    text = `${text.slice(0, commaIndex).replace(/[.,]/g, "")}.${text.slice(commaIndex + 1)}`;
  } else if ((text.match(/\./g) || []).length > 1) {
    const decimalIndex = text.lastIndexOf(".");
    text = `${text.slice(0, decimalIndex).replace(/\./g, "")}.${text.slice(decimalIndex + 1)}`;
  }
  const amount = Number(text);
  return isParenthesized ? -Math.abs(amount) : amount;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function parseDate(value, date1904 = false) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    const epoch = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, 30);
    return new Date(epoch + Math.floor(value) * 86_400_000);
  }
  if (typeof value === "string" && value.trim()) {
    const text = value.trim();
    const frenchDate = text.match(/^(\d{1,2})[/. -](\d{1,2})[/. -](\d{2,4})$/);
    if (frenchDate) {
      const year = Number(frenchDate[3]) + (frenchDate[3].length === 2 ? 2000 : 0);
      const date = new Date(Date.UTC(year, Number(frenchDate[2]) - 1, Number(frenchDate[1])));
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const date = new Date(text);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

function cleanText(value) {
  return value == null ? "" : String(value).trim();
}

function normalizedKey(value) {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function findHeader(headers, names) {
  const normalized = headers.map(normalizedKey);
  return names.map(normalizedKey).map((name) => normalized.indexOf(name)).find((index) => index >= 0) ?? -1;
}

function accountFromSheet(sheetName) {
  if (normalizedKey(sheetName).includes("c perso")) return "C Perso";
  return cleanText(sheetName.replace(/^(Revenus|Depenses)\s+/i, ""));
}

function matchesDashboard(transaction, dashboard) {
  if (dashboard.id === "issues") return Boolean(transactionIssue(transaction));
  if (!dashboard.types.includes(transaction.type)) return false;
  const account = normalizedKey(transaction.account);
  const source = normalizedKey(transaction.source);
  const category = normalizedKey(transaction.category);
  return dashboard.categoryAliases.some((alias) => category.includes(alias) || account.includes(alias))
    || dashboard.aliases.some((alias) => {
      if (alias === "tr") {
        return [account, source].some((value) => value.split(/[^a-z0-9]+/).includes(alias));
      }
      return account.includes(alias) || source.includes(alias);
    });
}

function dashboardTransactions() {
  const dashboard = accountDashboards.find((item) => item.id === state.dashboard);
  if (dashboard?.id === "works") {
    return state.transactions.filter((transaction) =>
      isAnalyzableExpense(transaction)
      && [transaction.category, transaction.project].some((value) => normalizedKey(value).includes("travaux")));
  }
  if (dashboard?.id === "daily") {
    return state.transactions.filter((transaction) =>
      isAnalyzableExpense(transaction)
      && ![transaction.category, transaction.project].some((value) => normalizedKey(value).includes("travaux")));
  }
  return dashboard
    ? state.transactions.filter((transaction) => matchesDashboard(transaction, dashboard))
    : state.transactions;
}

function elementsByLocalName(element, localName) {
  return [...element.getElementsByTagNameNS("*", localName)];
}

function parseXml(bytes, path) {
  if (!bytes) throw new Error(`Le fichier Excel est incomplet : ${path} est absent.`);
  const document = new DOMParser().parseFromString(strFromU8(bytes), "application/xml");
  if (document.getElementsByTagName("parsererror").length) {
    throw new Error(`Le fichier Excel contient un XML invalide (${path}).`);
  }
  return document;
}

function resolveWorkbookPath(target) {
  const path = target.startsWith("/") ? target.slice(1) : `xl/${target}`;
  const parts = [];
  for (const part of path.split("/")) {
    if (part === "..") parts.pop();
    else if (part && part !== ".") parts.push(part);
  }
  return parts.join("/");
}

function columnIndex(reference) {
  const letters = reference.match(/^[A-Z]+/i)?.[0]?.toUpperCase() ?? "";
  let index = 0;
  for (const character of letters) index = index * 26 + character.charCodeAt(0) - 64;
  return index - 1;
}

function parseWorkbook(buffer) {
  let archive;
  try {
    archive = unzipSync(buffer);
  } catch {
    throw new Error("Ce fichier Excel est endommagé ou n’est pas lisible.");
  }
  const workbookDocument = parseXml(archive["xl/workbook.xml"], "xl/workbook.xml");
  const relsDocument = parseXml(
    archive["xl/_rels/workbook.xml.rels"],
    "xl/_rels/workbook.xml.rels",
  );
  const relationshipNamespace = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const relationships = new Map(
    elementsByLocalName(relsDocument, "Relationship")
      .map((relationship) => [relationship.getAttribute("Id"), relationship.getAttribute("Target")]),
  );
  const sharedStringsDocument = archive["xl/sharedStrings.xml"]
    ? parseXml(archive["xl/sharedStrings.xml"], "xl/sharedStrings.xml")
    : null;
  const sharedStrings = sharedStringsDocument
    ? elementsByLocalName(sharedStringsDocument, "si")
      .map((item) => elementsByLocalName(item, "t").map((text) => text.textContent).join(""))
    : [];
  const workbookProperties = elementsByLocalName(workbookDocument, "workbookPr")[0];
  const date1904 = ["1", "true"].includes(
    (workbookProperties?.getAttribute("date1904") ?? "").toLowerCase(),
  );
  const sheets = new Map();
  for (const sheet of elementsByLocalName(workbookDocument, "sheet")) {
    const sheetName = sheet.getAttribute("name");
    const relationshipId = sheet.getAttributeNS(relationshipNamespace, "id");
    const path = resolveWorkbookPath(relationships.get(relationshipId) ?? "");
    const sheetDocument = parseXml(archive[path], path);
    const rows = elementsByLocalName(sheetDocument, "row").map((rowElement) => {
      const row = [];
      for (const cell of elementsByLocalName(rowElement, "c")) {
        const index = columnIndex(cell.getAttribute("r"));
        const valueElement = elementsByLocalName(cell, "v")[0];
        const cellType = cell.getAttribute("t");
        let value = valueElement?.textContent ?? null;
        if (cellType === "s" && value !== null) value = sharedStrings[Number(value)] ?? "";
        else if (cellType === "inlineStr") {
          value = elementsByLocalName(cell, "t").map((text) => text.textContent).join("");
        } else if (cellType === "b" && value !== null) value = value === "1";
        else if (!cellType && value !== null && value !== "") value = Number(value);
        row[index] = value;
      }
      return row;
    });
    sheets.set(sheetName, rows);
  }
  return { sheets, date1904 };
}

function sheetRecords(workbook, sheetName) {
  const sheet = workbook.sheets.get(sheetName);
  if (!sheet) return [];
  const [headerRow = [], ...rows] = sheet;
  const headers = headerRow.map(cleanText);
  const dateIndex = findHeader(headers, ["Date"]);
  const amountIndex = findHeader(headers, ["Montant", "Amount"]);
  if (dateIndex < 0 || amountIndex < 0) return [];

  const indices = {
    date: dateIndex,
    amount: amountIndex,
    category: findHeader(headers, ["Category", "Catégorie", "Categorie"]),
    account: findHeader(headers, ["Account", "Compte"]),
    project: findHeader(headers, ["Projet", "Project"]),
    shop: findHeader(headers, ["Shop", "Marchand", "Magasin"]),
    memo: findHeader(headers, ["Memo", "Note", "Libellé", "Libelle"]),
    reimbursed: findHeader(headers, ["Dejà remboursée", "Déjà remboursée", "Deja remboursee"]),
  };
  return rows.flatMap((row, index) => {
    const date = parseDate(row[indices.date], workbook.date1904);
    const rawAmount = parseAmount(row[indices.amount]);
    const rawReimbursed = indices.reimbursed < 0 ? Number.NaN : parseAmount(row[indices.reimbursed]);
    if (!date || (!Number.isFinite(rawAmount) && !Number.isFinite(rawReimbursed))) return [];
    const reimbursementOnly = !Number.isFinite(rawAmount) && Number.isFinite(rawReimbursed);
    const amount = Number.isFinite(rawAmount) ? rawAmount : 0;
    const reimbursed = Number.isFinite(rawReimbursed) ? Math.abs(rawReimbursed) : 0;
    if (amount === 0 && reimbursed === 0) return [];
    return [{
      id: `${sheetName}-${index}`,
      date,
      amount,
      category: indices.category < 0 ? "" : cleanText(row[indices.category]),
      account: (indices.account < 0 ? "" : cleanText(row[indices.account])) || accountFromSheet(sheetName),
      project: indices.project < 0 ? "" : cleanText(row[indices.project]),
      shop: indices.shop < 0 ? "" : cleanText(row[indices.shop]),
      memo: indices.memo < 0 ? "" : cleanText(row[indices.memo]),
      reimbursed: Number.isFinite(reimbursed) ? Math.abs(reimbursed) : 0,
      reimbursementOnly,
      source: sheetName,
      type: sheetName.startsWith("Revenus") ? "income" : "expense",
      isTransfer: /transfert/i.test(row[indices.category] == null ? "" : String(row[indices.category])),
    }];
  });
}

function transactionKey(transaction) {
  return [
    transaction.date.toISOString().slice(0, 10),
    Math.round(Math.abs(transaction.amount) * 100),
    normalizedKey(transaction.category),
    normalizedKey(transaction.account),
    normalizedKey(transaction.project),
    normalizedKey(transaction.shop),
    normalizedKey(transaction.memo),
  ].join("|");
}

function loadWorkbook(file) {
  return file.arrayBuffer().then((buffer) => {
    const workbook = parseWorkbook(new Uint8Array(buffer));
    const sheetNames = [...workbook.sheets.keys()];
    const primaryNames = sheetNames.filter((name) =>
      /^(Revenus|Depenses)\s+/i.test(name),
    );
    const income = primaryNames
      .filter((name) => /^Revenus\s+/i.test(name))
      .flatMap((name) => sheetRecords(workbook, name));
    const expenses = primaryNames
      .filter((name) => /^Depenses\s+/i.test(name))
      .flatMap((name) => sheetRecords(workbook, name));
    const personalExpenses = sheetRecords(workbook, "Depense C Perso");

    if (!primaryNames.length) {
      throw new Error("Aucune feuille « Revenus… » ou « Depenses… » n’a été trouvée.");
    }
    if (!income.length && !expenses.length && !personalExpenses.length) {
      throw new Error("Aucune transaction avec une date et un montant valides n’a été trouvée.");
    }

    const seenKeys = new Map();
    const countTransactions = (transactions) => {
      for (const transaction of transactions) {
        const key = transactionKey(transaction);
        seenKeys.set(key, (seenKeys.get(key) || 0) + 1);
      }
    };
    const addUniqueAnnex = (transactions) => {
      const unique = [];
      const matched = new Map();
      for (const transaction of transactions) {
        const key = transactionKey(transaction);
        const alreadyMatched = matched.get(key) || 0;
        if (alreadyMatched < (seenKeys.get(key) || 0)) {
          matched.set(key, alreadyMatched + 1);
        } else {
          unique.push(transaction);
        }
      }
      countTransactions(unique);
      return unique;
    };
    countTransactions(expenses);
    const uniquePersonalExpenses = addUniqueAnnex(personalExpenses);

    return {
      transactions: [...income, ...expenses, ...uniquePersonalExpenses]
        .sort((a, b) => b.date - a.date || a.id.localeCompare(b.id)),
      duplicateCount: personalExpenses.length - uniquePersonalExpenses.length,
    };
  });
}

function isExternalTransferExpense(transaction) {
  return transaction.type === "expense"
    && transaction.isTransfer
    && normalizedKey(transaction.category).includes("transfert externe")
    && !transaction.reimbursementOnly;
}

function externalTransferAccountId(transaction) {
  const account = normalizedKey(transaction.account);
  return ["tr", "summeria"].find((accountId) =>
    account.includes(`50/50 couple ${accountId}`)
      || account.includes(`alexandre ${accountId}`)
      || account.includes(`kelly ${accountId}`)) ?? null;
}

function isCountedExpense(transaction) {
  return transaction.type === "expense"
    && (!transaction.isTransfer || isExternalTransferExpense(transaction))
    && !transaction.reimbursementOnly;
}

function isInvestmentExpense(transaction) {
  return isCountedExpense(transaction)
    && normalizedKey(transaction.source).includes("traderepublic")
    && normalizedKey(transaction.category).includes("plans d'epargne");
}

function isSavebackExpense(transaction) {
  return isCountedExpense(transaction)
    && normalizedKey(transaction.source).includes("traderepublic")
    && normalizedKey([transaction.category, transaction.account].join(" ")).includes("saveback");
}

function isSavebackIncome(transaction) {
  return transaction.type === "income"
    && normalizedKey([transaction.category, transaction.account].join(" ")).includes("saveback");
}

function isAnalyzableExpense(transaction) {
  return isCountedExpense(transaction)
    && !transaction.isTransfer
    && !transaction.reimbursementOnly
    && !isInvestmentExpense(transaction)
    && !isSavebackExpense(transaction);
}

function visibleTransactions() {
  return dashboardTransactions().filter((transaction) => {
    const matchesYear = state.year === "all" || transaction.date.getUTCFullYear() === Number(state.year);
    const matchesCategory = state.category === "all" || transaction.category === state.category;
    const matchesAccount = state.account === "all" || transaction.account === state.account;
    const matchesType = state.type === "all" || transaction.type === state.type;
    const query = normalizedKey(state.search);
    const matchesSearch = !query || normalizedKey([
      transaction.category,
      transaction.account,
      transaction.project,
      transaction.shop,
      transaction.memo,
      transaction.source,
    ].join(" ")).includes(query);
    return matchesYear && matchesCategory && matchesAccount && matchesType && matchesSearch;
  });
}

function summarize(transactions) {
  const income = transactions
    .filter((transaction) => transaction.type === "income" && !isSavebackIncome(transaction))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = transactions
    .filter(isCountedExpense)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const transfers = transactions
    .filter((transaction) => transaction.type === "expense" && transaction.isTransfer && !isExternalTransferExpense(transaction))
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const investments = transactions.filter(isInvestmentExpense)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const savebackExpenses = transactions.filter(isSavebackExpense)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const monthly = Array.from({ length: 12 }, (_, month) => ({
    month,
    income: 0,
    expenses: 0,
    investments: 0,
    savebackExpenses: 0,
    investmentByPot: { alexandre: 0, kelly: 0, shared: 0 },
  }));
  for (const transaction of transactions) {
    const item = monthly[transaction.date.getUTCMonth()];
    if (transaction.type === "income" && !isSavebackIncome(transaction)) item.income += transaction.amount;
    if (isCountedExpense(transaction)) {
      item.expenses += Math.abs(transaction.amount);
      if (isInvestmentExpense(transaction)) {
        const amount = Math.abs(transaction.amount);
        item.investments += amount;
        const allocation = allocationFor(transaction);
        if (allocation) item.investmentByPot[allocation.kind] += amount;
      }
      if (isSavebackExpense(transaction)) item.savebackExpenses += Math.abs(transaction.amount);
    }
  }
  return {
    income,
    expenses,
    transfers,
    balance: income - expenses,
    investments,
    savebackExpenses,
    expensesWithoutSaveback: expenses - savebackExpenses,
    finalExpenses: expenses - investments,
    monthly,
  };
}

function allocationFor(transaction) {
  if (isSavebackIncome(transaction)) return null;
  if (transaction.isTransfer && !isExternalTransferExpense(transaction)) return null;
  const category = normalizedKey([
    transaction.category,
    transaction.account,
    transaction.memo,
  ].join(" "));
  if (!category.trim()) return null;
  const isIncome = transaction.type === "income";
  const amount = isIncome ? transaction.amount : Math.abs(transaction.amount);
  const memo = normalizedKey(transaction.memo);
  if (isExternalTransferExpense(transaction)) {
    const account = normalizedKey(transaction.account);
    const accountId = externalTransferAccountId(transaction);
    if (accountId && account.includes(`50/50 couple ${accountId}`)) {
      return { kind: "shared", income: 0, expenses: amount };
    }
    if (accountId && account.includes(`alexandre ${accountId}`)) {
      return { kind: "alexandre", income: 0, expenses: amount };
    }
    if (accountId && account.includes(`kelly ${accountId}`)) {
      return { kind: "kelly", income: 0, expenses: amount };
    }
    return null;
  }
  if (memo.includes("cagnotte alexandre")) {
    return { kind: "alexandre", income: isIncome ? amount : 0, expenses: isIncome ? 0 : amount };
  }
  if (memo.includes("cagnotte kelly")) {
    return { kind: "kelly", income: isIncome ? amount : 0, expenses: isIncome ? 0 : amount };
  }
  if (memo.includes("cagnotte couple")) {
    return { kind: "shared", income: isIncome ? amount : 0, expenses: isIncome ? 0 : amount };
  }
  const findPerson = (categories) => {
    const match = Object.entries(categories)
      .find(([, labels]) => labels.some((label) => category.includes(label)));
    return match ? match[0] : null;
  };
  if (isIncome) {
    const person = findPerson(personalPotCategories);
    if (person) return { kind: person, income: amount, expenses: 0 };
  } else {
    const person = findPerson(personalExpenseCategories);
    if (person) return { kind: person, income: 0, expenses: amount };
  }
  if (sharedCategories.some((label) => category.includes(label))) {
    return { kind: "shared", income: isIncome ? amount : 0, expenses: isIncome ? 0 : amount };
  }
  return null;
}

function transactionIssue(transaction) {
  if ((transaction.isTransfer && !isExternalTransferExpense(transaction)) || transaction.reimbursementOnly) return null;
  if (allocationFor(transaction)) return null;
  if (!transaction.account && !transaction.category && !transaction.memo) {
    return "Compte, catégorie et mémo manquants : impossible de déterminer la cagnotte.";
  }
  return "Aucune règle de répartition reconnue pour ce compte, cette catégorie ou ce mémo.";
}

function summarizeAllocations(transactions) {
  const totals = {
    alexandre: { income: 0, expenses: 0 },
    kelly: { income: 0, expenses: 0 },
    shared: { income: 0, expenses: 0 },
  };
  let unclassifiedCount = 0;
  let unclassifiedIncome = 0;
  let unclassifiedExpenses = 0;
  for (const transaction of transactions) {
    if ((transaction.isTransfer && !isExternalTransferExpense(transaction)) || isSavebackIncome(transaction)) continue;
    const allocation = allocationFor(transaction);
    if (!allocation) {
      unclassifiedCount += 1;
      if (transaction.type === "income") unclassifiedIncome += transaction.amount;
      else unclassifiedExpenses += Math.abs(transaction.amount);
      continue;
    }
    totals[allocation.kind].income += allocation.income;
    totals[allocation.kind].expenses += allocation.expenses;
  }
  const sharedBalance = totals.shared.income - totals.shared.expenses;
  return {
    alexandre: totals.alexandre.income - totals.alexandre.expenses + sharedBalance / 2,
    kelly: totals.kelly.income - totals.kelly.expenses + sharedBalance / 2,
    alexandrePersonal: totals.alexandre.income - totals.alexandre.expenses,
    kellyPersonal: totals.kelly.income - totals.kelly.expenses,
    sharedBalance,
    sharedIncome: totals.shared.income,
    sharedExpenses: totals.shared.expenses,
    unclassifiedCount,
    unclassifiedIncome,
    unclassifiedExpenses,
  };
}

function monthlyPotSummary(transactions, year, openingBalancesByYear = {}) {
  const datedTransactions = transactions.filter((transaction) =>
    (!transaction.isTransfer || isExternalTransferExpense(transaction)) && !transaction.reimbursementOnly);
  if (!datedTransactions.length) return { months: [], unclassifiedCount: 0 };
  const firstDate = datedTransactions.reduce((earliest, transaction) =>
    transaction.date < earliest ? transaction.date : earliest, datedTransactions[0].date);
  const lastDate = datedTransactions.reduce((latest, transaction) =>
    transaction.date > latest ? transaction.date : latest, datedTransactions[0].date);
  const firstMonth = firstDate.getUTCFullYear() * 12 + firstDate.getUTCMonth();
  const startMonth = year === "all" ? firstMonth : Number(year) * 12;
  const endMonth = year === "all" ? lastDate.getUTCFullYear() * 12 + lastDate.getUTCMonth() : Number(year) * 12 + 11;
  const calculationStartMonth = Math.min(firstMonth, startMonth);
  const balances = { alexandre: 0, kelly: 0, shared: 0 };
  let bankBalance = 0;
  const months = [];
  let unclassifiedCount = 0;
  const transactionsByMonth = new Map();
  for (const transaction of datedTransactions) {
    const monthKey = transaction.date.getUTCFullYear() * 12 + transaction.date.getUTCMonth();
    const monthTransactions = transactionsByMonth.get(monthKey) || [];
    monthTransactions.push(transaction);
    transactionsByMonth.set(monthKey, monthTransactions);
  }

  for (let monthKey = calculationStartMonth; monthKey <= endMonth; monthKey += 1) {
    const yearNumber = Math.floor(monthKey / 12);
    const openingBalance = monthKey % 12 === 0 ? openingBalancesByYear[yearNumber] : null;
    if (openingBalance) {
      balances.alexandre = openingBalance.alexandre;
      balances.kelly = openingBalance.kelly;
      balances.shared = openingBalance.bank - openingBalance.alexandre - openingBalance.kelly;
      bankBalance = openingBalance.bank;
    }
    const movement = {
      alexandre: { income: 0, expenses: 0 },
      kelly: { income: 0, expenses: 0 },
      shared: { income: 0, expenses: 0 },
      bankIncome: 0,
      bankExpenses: 0,
    };

    for (const transaction of transactionsByMonth.get(monthKey) || []) {
      if (transaction.type === "income") movement.bankIncome += transaction.amount;
      if (isCountedExpense(transaction)) movement.bankExpenses += Math.abs(transaction.amount);
      if (isSavebackIncome(transaction)) continue;
      const allocation = allocationFor(transaction);
      if (!allocation) {
        if (monthKey >= startMonth) unclassifiedCount += 1;
        continue;
      }
      movement[allocation.kind].income += allocation.income;
      movement[allocation.kind].expenses += allocation.expenses;
    }

    for (const pot of Object.keys(balances)) {
      balances[pot] += movement[pot].income - movement[pot].expenses;
    }
    bankBalance += movement.bankIncome - movement.bankExpenses;
    if (monthKey >= startMonth) {
      const month = monthKey % 12;
      months.push({
        year: yearNumber,
        month,
        movement,
        balances: { ...balances },
        bankBalance,
      });
    }
  }
  return { months, unclassifiedCount };
}

function openingBalancesFor(accountId) {
  const accountBalances = state.openingBalances[accountId];
  if (!accountBalances || typeof accountBalances !== "object" || Array.isArray(accountBalances)) return {};
  return accountBalances;
}

function openingBalanceFor(accountId, year) {
  const entry = openingBalancesFor(accountId)[year];
  if (!entry || typeof entry !== "object") return { bank: 0, alexandre: 0, kelly: 0 };
  const amountOrZero = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  return {
    bank: amountOrZero(entry.bank),
    alexandre: amountOrZero(entry.alexandre),
    kelly: amountOrZero(entry.kelly),
  };
}

function saveOpeningBalance(accountId, year, field, value) {
  const number = value.trim() === "" ? 0 : Number(value);
  if (!Number.isFinite(number)) return false;
  const accountBalances = openingBalancesFor(accountId);
  const existing = openingBalanceFor(accountId, year);
  const updatedBalances = {
    ...state.openingBalances,
    [accountId]: {
      ...accountBalances,
      [year]: { ...existing, [field]: number },
    },
  };
  localStorage.setItem(openingBalancesStorageKey, JSON.stringify(updatedBalances));
  state.openingBalances = updatedBalances;
  return true;
}

function currentBalanceFor(accountId) {
  const value = state.currentBalances[accountId];
  return Number.isFinite(Number(value)) && value !== "" && value !== null ? Number(value) : null;
}

function saveCurrentBalance(accountId, value) {
  const trimmed = value.trim();
  const updatedBalances = { ...state.currentBalances };
  if (!trimmed) {
    delete updatedBalances[accountId];
  } else {
    const number = Number(trimmed);
    if (!Number.isFinite(number)) return false;
    updatedBalances[accountId] = number;
  }
  localStorage.setItem(currentBalancesStorageKey, JSON.stringify(updatedBalances));
  state.currentBalances = updatedBalances;
  return true;
}

function transactionSharing(transaction) {
  const account = normalizedKey(transaction.account);
  const classification = normalizedKey([
    transaction.category,
    transaction.account,
    transaction.memo,
  ].join(" "));
  const amount = Math.abs(transaction.amount);
  const people = { alexandre: 0, kelly: 0 };
  const person = account.includes("alexandre") ? "alexandre"
    : account.includes("kelly") ? "kelly"
      : null;
  const personLabel = (name) => name === "alexandre" ? "Alexandre" : "Kelly";

  if (transaction.isTransfer && !isExternalTransferExpense(transaction)) {
    return { linked: "Transfert interne · hors partage", alexandre: null, kelly: null, settlement: "Non réparti" };
  }
  if (isExternalTransferExpense(transaction)) {
    const allocation = allocationFor(transaction);
    const accountId = externalTransferAccountId(transaction);
    const accountLabel = accountId === "summeria" ? "Summeria" : "TR";
    if (!allocation) {
      return { linked: "Transfert externe · compte payeur à vérifier", alexandre: null, kelly: null, settlement: "Aucune cagnotte reconnue" };
    }
    const share = amount / 2;
    if (allocation.kind === "shared") {
      return {
        linked: `Transfert externe · payé par le couple (${accountLabel})`,
        alexandre: share,
        kelly: share,
        settlement: `Réglé à 50/50 · ${personLabel("alexandre")} : ${formatMoney(share, true)} · ${personLabel("kelly")} : ${formatMoney(share, true)}`,
      };
    }
    return {
      linked: `Transfert externe · cagnotte ${personLabel(allocation.kind)} (${accountLabel})`,
      alexandre: allocation.kind === "alexandre" ? amount : 0,
      kelly: allocation.kind === "kelly" ? amount : 0,
      settlement: `Retiré de la cagnotte ${personLabel(allocation.kind)}`,
    };
  }
  if (isSavebackIncome(transaction)) {
    return { linked: "Saveback bancaire · exclu des revenus", alexandre: null, kelly: null, settlement: "Compense le débit Saveback, sans alimenter une cagnotte" };
  }
  if (transaction.reimbursementOnly) {
    const share = transaction.reimbursed / 2;
    return {
      linked: "Dépense déjà réglée · 50/50",
      alexandre: share,
      kelly: share,
      settlement: `Déjà partagé · ${personLabel("alexandre")} : ${formatMoney(share, true)} · ${personLabel("kelly")} : ${formatMoney(share, true)}`,
    };
  }

  if (transaction.type === "expense" && person && (
    account.includes("c perso") || account.includes("peage") || account.includes("carte restaurant")
  )) {
    people.alexandre = amount / 2;
    people.kelly = amount / 2;
    const other = person === "alexandre" ? "kelly" : "alexandre";
    const balance = Math.max(0, amount - (transaction.reimbursed || 0)) / 2;
    return {
      linked: `Dépense partagée · payée par ${personLabel(person)}`,
      alexandre: people.alexandre,
      kelly: people.kelly,
      settlement: balance > 0
        ? `${personLabel(other)} doit ${formatMoney(balance, true)} à ${personLabel(person)}`
        : "Part déjà considérée comme réglée à 50/50",
    };
  }

  const personalPerson = Object.entries(personalPotCategories)
    .find(([, labels]) => labels.some((label) => account.includes(label)));
  if (personalPerson && !account.includes("c perso") && transaction.type === "expense") {
    const [owner] = personalPerson;
    people[owner] = amount;
    return {
      linked: `Cagnotte ${personLabel(owner)}`,
      alexandre: people.alexandre,
      kelly: people.kelly,
      settlement: "Déduit de sa cagnotte personnelle",
    };
  }
  if (transaction.type === "income" && personalPerson) {
    const [owner] = personalPerson;
    people[owner] = amount;
    return {
      linked: `Cagnotte ${personLabel(owner)}`,
      alexandre: people.alexandre,
      kelly: people.kelly,
      settlement: "Ajouté à sa cagnotte personnelle",
    };
  }

  if (sharedCategories.some((label) => classification.includes(label))) {
    const share = amount / 2;
    people.alexandre = share;
    people.kelly = share;
    return {
      linked: "Commun · 50/50",
      alexandre: share,
      kelly: share,
      settlement: `${personLabel("alexandre")} : ${formatMoney(share, true)} · ${personLabel("kelly")} : ${formatMoney(share, true)}`,
    };
  }
  return { linked: "À vérifier", alexandre: null, kelly: null, settlement: "Aucune règle reconnue" };
}

function cPersoSettlement(transactions) {
  const payerAliases = {
    alexandre: ["alexandre c perso", "alexandre peage"],
    kelly: ["kelly c perso", "kelly carte restaurant"],
  };
  const paid = { alexandre: 0, kelly: 0 };
  const alreadyShared = { alexandre: 0, kelly: 0 };
  const eligiblePaid = { alexandre: 0, kelly: 0 };
  for (const transaction of transactions) {
    if (transaction.type !== "expense") continue;
    const account = normalizedKey(transaction.account);
    const person = Object.entries(payerAliases)
      .find(([, aliases]) => aliases.some((alias) => account.includes(alias)))?.[0];
    if (!person) continue;
    const grossAmount = Math.abs(transaction.amount);
    if (transaction.reimbursementOnly) {
      alreadyShared[person] += transaction.reimbursed || 0;
      continue;
    }
    paid[person] += grossAmount;
    const settledAmount = Math.min(grossAmount, transaction.reimbursed || 0);
    eligiblePaid[person] += grossAmount - settledAmount;
  }
  for (const person of Object.keys(eligiblePaid)) {
    eligiblePaid[person] = Math.max(0, eligiblePaid[person] - alreadyShared[person]);
  }
  const difference = (eligiblePaid.alexandre - eligiblePaid.kelly) / 2;
  const owes = difference > 0 ? "kelly" : "alexandre";
  const owedTo = difference > 0 ? "alexandre" : "kelly";
  return {
    paid,
    total: paid.alexandre + paid.kelly,
    owes,
    owedTo,
    amount: Math.abs(difference),
    alreadyShared,
  };
}

function sharedAccountSettlement(transactions, accountId) {
  const accountLabel = accountId === "tr" ? "TR" : accountId === "summeria" ? "Summeria" : "CACF";
  const sharedAccount = `50/50 couple ${accountId}`;
  const sourceAlias = accountId === "tr" ? "traderepublic" : accountId;
  const contributions = { alexandre: 0, kelly: 0 };
  let sharedExpenses = 0;
  let sharedIncome = 0;
  for (const transaction of transactions) {
    const account = normalizedKey(transaction.account);
    const source = normalizedKey(transaction.source);
    if (transaction.type === "income") {
      if (account.includes(`alexandre ${accountId}`)) contributions.alexandre += transaction.amount;
      if (account.includes(`kelly ${accountId}`)) contributions.kelly += transaction.amount;
      if (!isSavebackIncome(transaction) && source.includes(sourceAlias) && allocationFor(transaction)?.kind === "shared") {
        sharedIncome += transaction.amount;
      }
    }
    if (transaction.type === "expense"
      && (!transaction.isTransfer || isExternalTransferExpense(transaction))
      && !transaction.reimbursementOnly
      && account.includes(sharedAccount)) {
      sharedExpenses += Math.abs(transaction.amount);
    }
  }
  const difference = contributions.alexandre - contributions.kelly;
  return {
    accountId,
    accountLabel,
    contributions,
    sharedIncome,
    sharedExpenses,
    owedTo: difference > 0 ? "alexandre" : "kelly",
    owes: difference > 0 ? "kelly" : "alexandre",
    amount: Math.abs(difference) / 2,
  };
}

function allSettlements(transactions) {
  const privateSettlement = cPersoSettlement(transactions);
  return [
    { ...privateSettlement, id: "cperso", accountLabel: "C Perso", destination: "privately", kind: "private" },
    ...["tr", "summeria", "cacf"].map((accountId) => ({
      ...sharedAccountSettlement(transactions, accountId),
      id: accountId,
      destination: "shared",
      kind: "shared",
    })),
  ];
}

function aggregateBy(transactions, getKey) {
  const values = new Map();
  for (const transaction of transactions) {
    if (!isCountedExpense(transaction)) continue;
    const key = getKey(transaction) || "Non renseigné";
    values.set(key, (values.get(key) || 0) + Math.abs(transaction.amount));
  }
  return [...values.entries()]
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total);
}

function aggregateExpenseDetails(transactions, getKey) {
  const values = new Map();
  for (const transaction of transactions) {
    if (!isCountedExpense(transaction)) continue;
    const key = getKey(transaction) || "Non renseigné";
    const current = values.get(key) || { total: 0, count: 0 };
    current.total += Math.abs(transaction.amount);
    current.count += 1;
    values.set(key, current);
  }
  return [...values.entries()]
    .map(([label, details]) => ({ label, ...details }))
    .sort((a, b) => b.count - a.count || b.total - a.total);
}

function summarizeExpenseDashboard(transactions, year) {
  const monthly = new Map();
  for (const transaction of transactions) {
    const monthKey = transaction.date.getUTCFullYear() * 12 + transaction.date.getUTCMonth();
    if (!monthly.has(monthKey)) {
      monthly.set(monthKey, {
        key: monthKey,
        year: transaction.date.getUTCFullYear(),
        month: transaction.date.getUTCMonth(),
        total: 0,
        alexandre: 0,
        kelly: 0,
        unallocated: 0,
        count: 0,
      });
    }
    const item = monthly.get(monthKey);
    const amount = Math.abs(transaction.amount);
    item.total += amount;
    item.count += 1;
    const allocation = allocationFor(transaction);
    if (allocation?.kind === "shared") {
      item.alexandre += amount / 2;
      item.kelly += amount / 2;
    } else if (allocation?.kind === "alexandre") {
      item.alexandre += amount;
    } else if (allocation?.kind === "kelly") {
      item.kelly += amount;
    } else {
      item.unallocated += amount;
    }
  }

  const observedMonths = [...monthly.values()].sort((a, b) => a.key - b.key);
  if (year !== "all") {
    for (let month = 0; month < 12; month += 1) {
      const key = Number(year) * 12 + month;
      if (!monthly.has(key)) {
        monthly.set(key, {
          key,
          year: Number(year),
          month,
          total: 0,
          alexandre: 0,
          kelly: 0,
          unallocated: 0,
          count: 0,
        });
      }
    }
  }
  const months = [...monthly.values()].sort((a, b) => a.key - b.key);
  const total = observedMonths.reduce((sum, month) => sum + month.total, 0);
  const alexandre = observedMonths.reduce((sum, month) => sum + month.alexandre, 0);
  const kelly = observedMonths.reduce((sum, month) => sum + month.kelly, 0);
  const unallocated = observedMonths.reduce((sum, month) => sum + month.unallocated, 0);
  const activeMonthCount = observedMonths.filter((month) => month.count > 0).length;
  return {
    total,
    alexandre,
    kelly,
    unallocated,
    average: activeMonthCount ? total / activeMonthCount : 0,
    activeMonthCount,
    months,
  };
}

function optionList(values, selected, allLabel) {
  return [
    `<option value="all"${selected === "all" ? " selected" : ""}>${escapeHtml(allLabel)}</option>`,
    ...values.map((value) =>
      `<option value="${escapeHtml(value)}"${selected === value ? " selected" : ""}>${escapeHtml(value)}</option>`,
    ),
  ].join("");
}

function renderEmpty() {
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" href="#" aria-label="Clair, accueil">
          <span class="brand-mark">c.</span>
          <span class="brand-name">clair<span>.</span></span>
        </a>
        <div class="side-label">VOTRE ESPACE</div>
        <nav class="sidebar-navigation" aria-label="Tableaux de bord">
          <button class="nav-link active" type="button" aria-current="page">
            <span class="nav-icon">◫</span> Vue d’ensemble
          </button>
        </nav>
        <div class="sidebar-bottom">
          <span class="privacy-icon">◉</span>
          <p>Vos données restent privées.<br />Le fichier est lu sur cet appareil.</p>
        </div>
      </aside>
      <main class="main-content">
        <header class="topbar">
          <div class="breadcrumb">Votre foyer <span>/</span> Vue d’ensemble</div>
          <span class="local-badge"><i></i> 100 % local</span>
        </header>
        <section class="welcome">
          <div class="eyebrow">LE BUDGET, EN CLAIR</div>
          <h1>Bonjour, votre budget<br />prend forme ici.</h1>
          <p class="welcome-copy">Importez votre fichier Excel mensuel pour comprendre vos dépenses, suivre vos revenus et voir les tendances de votre foyer.</p>
          <div class="dropzone" id="dropzone">
            <div class="upload-icon">↑</div>
            <h2>Déposez votre fichier ici</h2>
            <p>Votre fichier Excel est analysé directement dans votre navigateur.</p>
            <label class="button button-primary" for="file-input">Choisir un fichier Excel</label>
            <input id="file-input" type="file" accept=".xlsx,.xlsm" hidden />
            <div class="file-hint">Formats acceptés : .xlsx, .xlsm (convertissez les fichiers .xls en .xlsx)</div>
          </div>
          <div class="how-it-works">
            <div><span class="step-number">01</span><strong>Importez</strong><small>Votre classeur habituel</small></div>
            <div><span class="step-number">02</span><strong>Explorez</strong><small>Les tendances en un clin d’œil</small></div>
            <div><span class="step-number">03</span><strong>Gardez la main</strong><small>Aucune donnée envoyée en ligne</small></div>
          </div>
        </section>
        <div class="toast-slot" id="toast-slot" aria-live="polite"></div>
      </main>
    </div>`;
  bindUpload();
}

function renderDashboard() {
  const selectedDashboard = accountDashboards.find((item) => item.id === state.dashboard);
  const isIssuesDashboard = selectedDashboard?.id === "issues";
  const isTradeRepublicDashboard = selectedDashboard?.id === "tr";
  const isWorkDashboard = selectedDashboard?.id === "works";
  const isDailyDashboard = selectedDashboard?.id === "daily";
  const isExpenseDashboard = isWorkDashboard || isDailyDashboard;
  const dashboardLabel = selectedDashboard?.label ?? "Vue d’ensemble";
  const allYears = [...new Set(dashboardTransactions().map((transaction) => transaction.date.getUTCFullYear()))]
    .sort((a, b) => b - a);
  if (state.year !== "all" && !allYears.includes(Number(state.year))) state.year = "all";
  const rows = visibleTransactions();
  const totals = summarize(rows);
  const allocations = summarizeAllocations(rows);
  const accountOpeningBalances = selectedDashboard && ["tr", "summeria", "cacf"].includes(selectedDashboard.id)
    ? Object.fromEntries(Object.keys(openingBalancesFor(selectedDashboard.id))
      .map(Number)
      .filter(Number.isInteger)
      .map((year) => [year, openingBalanceFor(selectedDashboard.id, String(year))]))
    : {};
  const monthlyPots = selectedDashboard && !isIssuesDashboard
    && !isExpenseDashboard
    ? monthlyPotSummary(
      dashboardTransactions(),
      state.year,
      accountOpeningBalances,
    )
    : null;
  const allTimeMonthlyPots = selectedDashboard && !isIssuesDashboard
    && !isExpenseDashboard
    ? state.year === "all" ? monthlyPots : monthlyPotSummary(dashboardTransactions(), "all", accountOpeningBalances)
    : null;
  const allTimeMonths = allTimeMonthlyPots?.months ?? [];
  const estimatedBankBalance = allTimeMonths.length ? allTimeMonths[allTimeMonths.length - 1].bankBalance : null;
  const recordedCurrentBalance = selectedDashboard ? currentBalanceFor(selectedDashboard.id) : null;
  const availableBalance = recordedCurrentBalance ?? (selectedDashboard?.id === "cperso" ? null : estimatedBankBalance);
  const periodRows = state.transactions.filter((transaction) =>
    state.year === "all" || transaction.date.getUTCFullYear() === Number(state.year));
  const settlements = allSettlements(periodRows);
  const issuesCount = isIssuesDashboard ? rows.length : 0;
  const categories = aggregateBy(rows, (transaction) => transaction.category);
  const accounts = aggregateBy(rows, (transaction) => transaction.account);
  const expenseAnalysis = isExpenseDashboard ? summarizeExpenseDashboard(rows, state.year) : null;
  const shops = isExpenseDashboard
    ? aggregateExpenseDetails(rows, (transaction) => transaction.shop || transaction.memo)
    : [];
  const accountBreakdown = isWorkDashboard
    ? accounts.map((account) => ({
      ...account,
      ...summarizeExpenseDashboard(
        rows.filter((transaction) => transaction.account === account.label),
        state.year,
      ),
    }))
    : [];
  const largestExpenses = isExpenseDashboard
    ? [...rows].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)).slice(0, 5)
    : [];
  const categoryOptions = [...new Set(dashboardTransactions().map((transaction) => transaction.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "fr"));
  const accountOptions = [...new Set(dashboardTransactions().map((transaction) => transaction.account).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "fr"));
  const transactionCount = dashboardTransactions().length;
  const pageCount = Math.max(1, Math.ceil(rows.length / state.pageSize));
  state.page = Math.min(state.page, pageCount);
  const pageRows = rows.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
  const hasFilters = state.category !== "all" || state.account !== "all" || state.type !== "all" || state.search;
  const periodLabel = state.year === "all" ? "Toutes les années" : String(state.year);
  const openingYear = state.year === "all"
    ? String(allYears[0] ?? new Date().getFullYear())
    : state.year;
  const openingBalance = selectedDashboard
    ? openingBalanceFor(selectedDashboard.id, openingYear)
    : null;
  const personName = (person) => person === "alexandre" ? "Alexandre" : "Kelly";
  const privateSettlement = settlements.find((settlement) => settlement.id === "cperso");
  const sharedSettlements = settlements.filter((settlement) => settlement.kind === "shared");
  const sharedPayments = sharedSettlements.reduce((result, settlement) => {
    if (settlement.amount > 0) result[settlement.owes] += settlement.amount;
    return result;
  }, { alexandre: 0, kelly: 0 });
  const settlementCards = (isIssuesDashboard ? [] : (selectedDashboard
    ? settlements.filter((settlement) => settlement.id === selectedDashboard.id)
    : settlements)).map((settlement) => {
    const isPrivate = settlement.kind === "private";
    const amount = settlement.amount;
    const destination = isPrivate
      ? personName(settlement.owedTo)
      : `le compte commun ${settlement.accountLabel}`;
    const result = amount > 0
      ? `${personName(settlement.owes)} doit verser ${formatMoney(amount, true)} à ${destination}${isPrivate ? " (règlement privé)" : ""}`
      : "Aucun remboursement à effectuer sur cette période.";
    const detail = isPrivate
      ? `Alexandre a payé ${formatMoney(settlement.paid.alexandre, true)} · Kelly a payé ${formatMoney(settlement.paid.kelly, true)}${settlement.alreadyShared.alexandre + settlement.alreadyShared.kelly > 0 ? ` · déjà partagé à 50/50 : ${formatMoney(settlement.alreadyShared.alexandre + settlement.alreadyShared.kelly, true)}` : ""}`
      : `Contributions personnelles : Alexandre ${formatMoney(settlement.contributions.alexandre, true)} · Kelly ${formatMoney(settlement.contributions.kelly, true)} · revenus communs ${formatMoney(settlement.sharedIncome, true)} · dépenses communes ${formatMoney(settlement.sharedExpenses, true)}`;
    return `<article class="settlement-card">
      <span class="settlement-title">${isPrivate ? "Dépenses personnelles partagées · C Perso" : `Contribution au compte commun · ${escapeHtml(settlement.accountLabel)}`}</span>
      ${isPrivate ? `<div class="settlement-people"><span>🤵‍♂️ Alexandre a payé <strong>${formatMoney(settlement.paid.alexandre, true)}</strong></span><span>👰‍♀️ Kelly a payé <strong>${formatMoney(settlement.paid.kelly, true)}</strong></span></div>` : ""}
      <p class="settlement-result">${result}</p>
      <small>${detail}${isPrivate ? "" : " · Le versement est destiné au compte commun."}</small>
    </article>`;
  }).join("");
  const expenseDashboardMarkup = expenseAnalysis ? `
    <section class="expense-analysis" aria-label="${isWorkDashboard ? "Analyse des dépenses de travaux" : "Analyse des dépenses du quotidien"}">
      <div class="expense-monthly-panel panel">
        <div class="panel-heading"><div><h2>Suivi des dépenses mois par mois</h2><p>Total dépensé et parts calculées selon les règles de répartition existantes</p></div></div>
        <div class="expense-monthly-chart">
          ${expenseAnalysis.months.map((month) => {
            const max = Math.max(1, ...expenseAnalysis.months.map((item) => item.total));
            const height = month.total ? Math.max(2, (month.total / max) * 100) : 0;
            const label = state.year === "all" ? `${monthShort[month.month]} ${month.year}` : monthShort[month.month];
            return `<div class="expense-month-column">
              <span class="expense-month-total">${month.total ? escapeHtml(formatMoney(month.total)) : ""}</span>
              <div class="expense-month-track"><span class="expense-month-bar" title="${escapeHtml(`${monthNames[month.month]} ${month.year} · Total : ${formatMoney(month.total, true)} · Alexandre : ${formatMoney(month.alexandre, true)} · Kelly : ${formatMoney(month.kelly, true)}${month.unallocated ? ` · Non attribué : ${formatMoney(month.unallocated, true)}` : ""}`)}" aria-label="${escapeHtml(`${monthNames[month.month]} ${month.year} : ${formatMoney(month.total, true)}`)}" style="height:${height}%"></span></div>
              <span class="expense-month-label">${escapeHtml(label)}</span>
            </div>`;
          }).join("")}
        </div>
        <div class="table-wrap expense-monthly-table-wrap">
          <table class="expense-monthly-table">
            <thead><tr><th>Mois</th><th>Dépenses</th><th>Part Alexandre</th><th>Part Kelly</th>${expenseAnalysis.unallocated ? "<th>Non attribué</th>" : ""}<th>Opérations</th></tr></thead>
            <tbody>${expenseAnalysis.months.map((month) => `<tr>
              <th scope="row">${escapeHtml(state.year === "all" ? `${monthNames[month.month]} ${month.year}` : monthNames[month.month])}</th>
              <td>${formatMoney(month.total, true)}</td>
              <td>${formatMoney(month.alexandre, true)}</td>
              <td>${formatMoney(month.kelly, true)}</td>
              ${expenseAnalysis.unallocated ? `<td>${formatMoney(month.unallocated, true)}</td>` : ""}
              <td>${numberFormat.format(month.count)}</td>
            </tr>`).join("")}</tbody>
            <tfoot><tr><th scope="row">Total</th><td>${formatMoney(expenseAnalysis.total, true)}</td><td>${formatMoney(expenseAnalysis.alexandre, true)}</td><td>${formatMoney(expenseAnalysis.kelly, true)}</td>${expenseAnalysis.unallocated ? `<td>${formatMoney(expenseAnalysis.unallocated, true)}</td>` : ""}<td>${numberFormat.format(rows.length)}</td></tr></tfoot>
          </table>
        </div>
        ${expenseAnalysis.unallocated ? `<p class="allocation-note">La part « Non attribué » n’est pas incluse dans les parts individuelles. ${numberFormat.format(rows.filter((transaction) => !allocationFor(transaction)).length)} opération(s) n’ont pas de règle de répartition reconnue.</p>` : ""}
      </div>
      <div class="expense-analysis-grid">
        <article class="panel expense-ranking-panel">
          <div class="panel-heading"><div><h2>Plus grosses dépenses</h2><p>Les opérations les plus élevées de la période</p></div></div>
          ${largestExpenses.length ? `<div class="expense-ranking-list">${largestExpenses.map((transaction, index) => {
            const sharing = transactionSharing(transaction);
            return `<div class="expense-ranking-item">
              <span class="account-rank">${String(index + 1).padStart(2, "0")}</span>
              <div class="expense-ranking-copy"><strong>${escapeHtml(transaction.shop || transaction.memo || transaction.category || "Dépense")}</strong><small>${escapeHtml(formatDate(transaction.date))} · ${escapeHtml(transaction.account || "Compte non renseigné")} · ${escapeHtml(transaction.category || "Sans catégorie")}</small></div>
              <strong class="expense-ranking-amount">${formatMoney(Math.abs(transaction.amount), true)}</strong>
              <small class="expense-ranking-share">${sharing.alexandre === null ? "Parts à vérifier" : `A. ${formatMoney(sharing.alexandre, true)} · K. ${formatMoney(sharing.kelly, true)}`}</small>
            </div>`;
          }).join("")}</div>` : `<div class="chart-empty">Aucune dépense sur cette période.</div>`}
        </article>
        <article class="panel expense-ranking-panel">
          <div class="panel-heading"><div><h2>${isWorkDashboard ? "Magasins les plus utilisés" : "Marchands les plus fréquents"}</h2><p>Tri par nombre d’achats · montant total à droite</p></div></div>
          ${shops.length ? `<div class="expense-merchant-list">${shops.slice(0, 8).map((shop, index) => `
            <div class="expense-merchant-item">
              <span class="account-rank">${String(index + 1).padStart(2, "0")}</span>
              <div class="expense-ranking-copy"><strong>${escapeHtml(shop.label)}</strong><small>${numberFormat.format(shop.count)} achat${shop.count > 1 ? "s" : ""}</small><span class="bar-track"><span class="category-bar bar-${index % 6}" style="width:${Math.max(3, (shop.count / shops[0].count) * 100)}%"></span></span></div>
              <strong class="expense-ranking-amount">${formatMoney(shop.total, true)}</strong>
            </div>`).join("")}</div>` : `<div class="chart-empty">Aucun marchand renseigné sur cette période.</div>`}
        </article>
        <article class="panel expense-ranking-panel">
          <div class="panel-heading"><div><h2>Répartition par catégorie</h2><p>Pour repérer les principaux postes de dépenses</p></div></div>
          ${categories.length ? `<div class="expense-merchant-list">${categories.slice(0, 8).map((category, index) => `
            <div class="expense-merchant-item">
              <span class="account-rank">${String(index + 1).padStart(2, "0")}</span>
              <div class="expense-ranking-copy"><strong>${escapeHtml(category.label)}</strong><span class="bar-track"><span class="category-bar bar-${index % 6}" style="width:${Math.max(3, (category.total / categories[0].total) * 100)}%"></span></span></div>
              <strong class="expense-ranking-amount">${formatMoney(category.total, true)}</strong>
            </div>`).join("")}</div>` : `<div class="chart-empty">Aucune catégorie sur cette période.</div>`}
        </article>
        ${isWorkDashboard ? `<article class="panel expense-ranking-panel">
          <div class="panel-heading"><div><h2>Dépenses par compte</h2><p>Comptes utilisés pour ces achats</p></div></div>
          ${accountBreakdown.length ? `<div class="expense-merchant-list">${accountBreakdown.slice(0, 8).map((account, index) => `
            <div class="expense-merchant-item">
              <span class="account-rank">${String(index + 1).padStart(2, "0")}</span>
              <div class="expense-ranking-copy"><strong>${escapeHtml(account.label)}</strong><small>Alexandre ${formatMoney(account.alexandre, true)} · Kelly ${formatMoney(account.kelly, true)}</small><span class="bar-track"><span class="category-bar bar-${index % 6}" style="width:${Math.max(3, (account.total / accounts[0].total) * 100)}%"></span></span></div>
              <strong class="expense-ranking-amount">${formatMoney(account.total, true)}</strong>
            </div>`).join("")}</div>` : `<div class="chart-empty">Aucun compte renseigné sur cette période.</div>`}
        </article>` : ""}
      </div>
      <p class="allocation-note expense-budget-note">La moyenne mensuelle (${numberFormat.format(expenseAnalysis.activeMonthCount)} mois avec dépenses) est un repère de budget basé sur vos données, pas une limite budgétaire personnalisée. Comparez les catégories et les marchands pour choisir où réduire vos dépenses.</p>
    </section>` : "";
  const settlementSummaryMarkup = !selectedDashboard && !isIssuesDashboard ? `
    <div class="settlement-summary-grid">
      <article class="settlement-card">
        <span class="settlement-title">Règlements privés · C Perso</span>
        <p class="settlement-result">${privateSettlement.amount > 0
          ? `${personName(privateSettlement.owes)} doit ${formatMoney(privateSettlement.amount, true)} à ${personName(privateSettlement.owedTo)}`
          : "Aucune dette privée à régler."}</p>
        <small>Ce règlement se fait entre les personnes, en dehors des comptes communs.</small>
      </article>
      <article class="settlement-card">
        <span class="settlement-title">Versements à faire sur les comptes communs</span>
        <p class="settlement-result">${sharedPayments.alexandre || sharedPayments.kelly
          ? `Alexandre : ${formatMoney(sharedPayments.alexandre, true)} · Kelly : ${formatMoney(sharedPayments.kelly, true)}`
          : "Aucun rééquilibrage à verser."}</p>
        <small>Montants à verser sur les comptes communs concernés ; ils ne sont pas des paiements privés entre vous.</small>
      </article>
    </div>` : "";
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" href="#" aria-label="Clair, accueil">
          <span class="brand-mark">c.</span><span class="brand-name">clair<span>.</span></span>
        </a>
        <div class="side-label">VOTRE ESPACE</div>
        <nav class="sidebar-navigation" aria-label="Tableaux de bord">
          <button class="nav-link${state.dashboard === "overview" ? " active" : ""}" type="button" data-dashboard="overview"${state.dashboard === "overview" ? ' aria-current="page"' : ""}>
            <span class="nav-icon">◫</span> Vue d’ensemble
          </button>
          ${accountDashboards.map((item) => `
            <button class="nav-link${state.dashboard === item.id ? " active" : ""}" type="button" data-dashboard="${item.id}"${state.dashboard === item.id ? ' aria-current="page"' : ""}>
              <span class="nav-icon">${item.id === "tr" ? "↗" : item.id === "summeria" ? "◌" : item.id === "cacf" ? "▤" : item.id === "issues" ? "!" : item.id === "works" ? "⌂" : item.id === "daily" ? "◷" : "○"}</span> ${escapeHtml(item.label)}
            </button>`).join("")}
        </nav>
        <div class="side-label side-label-period">PÉRIODE</div>
        <label class="side-select-label" for="year-filter">Année</label>
        <select id="year-filter" class="side-select">
          ${optionList(allYears.map(String), state.year, "Toutes les années")}
        </select>
        <div class="sidebar-bottom">
          <span class="privacy-icon">◉</span>
          <p>Données privées, traitées<br />uniquement sur cet appareil.</p>
          <button class="text-button" id="change-file" type="button">Changer de fichier</button>
        </div>
      </aside>
      <main class="main-content dashboard">
        <header class="topbar">
          <div class="breadcrumb">Votre foyer <span>/</span> ${escapeHtml(dashboardLabel)} <span>/</span> ${escapeHtml(periodLabel)}</div>
          <div class="topbar-actions"><span class="local-badge"><i></i> 100 % local</span>
          <label class="button button-small" for="file-input">Importer un fichier</label>
          <input id="file-input" type="file" accept=".xlsx,.xlsm" hidden /></div>
        </header>
        <div class="dashboard-heading">
          <div>
            <div class="eyebrow">${escapeHtml(dashboardLabel.toUpperCase())} · ${escapeHtml(periodLabel.toUpperCase())}</div>
            <h1>${escapeHtml(dashboardLabel)}</h1>
            <p class="subtitle">${isIssuesDashboard ? "Transactions dont la répartition automatique reste à contrôler." : isWorkDashboard ? "Suivez le coût des travaux, les parts de chacun et les comptes utilisés." : isDailyDashboard ? "Comprenez vos habitudes de dépenses et trouvez des pistes pour mieux budgétiser." : selectedDashboard ? "Revenus et dépenses de ce compte." : "Vos finances, sans détour."}</p>
          </div>
          <div class="file-chip"><span class="file-chip-icon">▤</span><span><strong>${escapeHtml(state.fileName)}</strong><small>${numberFormat.format(transactionCount)} ${isIssuesDashboard ? "opérations à vérifier" : "transactions chargées"}</small></span></div>
        </div>
        <section class="kpi-grid" aria-label="Indicateurs clés">
          <article class="kpi-card">
            <div class="kpi-label">${isExpenseDashboard ? "Dépenses suivies" : isIssuesDashboard ? "Revenus à vérifier" : "Revenus"}</div><div class="kpi-value">${formatMoney(isExpenseDashboard ? expenseAnalysis.total : totals.income)}</div>
            <div class="kpi-foot"><span class="tiny-dot dot-green"></span> ${isExpenseDashboard ? "Dépenses de la période" : isIssuesDashboard ? "Sans règle de répartition" : selectedDashboard ? "Revenus de ce compte" : "Toutes sources confondues"}</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">${isExpenseDashboard ? "Part d’Alexandre" : isIssuesDashboard ? "Dépenses à vérifier" : "Dépenses courantes"}</div><div class="kpi-value">${formatMoney(isExpenseDashboard ? expenseAnalysis.alexandre : totals.expenses)}</div>
            <div class="kpi-foot"><span class="tiny-dot dot-orange"></span> ${isExpenseDashboard ? "Selon la répartition définie" : isIssuesDashboard ? "Sans règle de répartition" : selectedDashboard?.id === "cperso" ? "Dépenses personnelles" : "Hors transferts entre comptes"}</div>
          </article>
          <article class="kpi-card kpi-highlight">
            <div class="kpi-label">${isExpenseDashboard ? "Part de Kelly" : isIssuesDashboard ? "Opérations à vérifier" : "Solde net"}</div><div class="kpi-value">${isExpenseDashboard ? formatMoney(expenseAnalysis.kelly) : isIssuesDashboard ? numberFormat.format(issuesCount) : formatMoney(totals.balance)}</div>
            <div class="kpi-foot"><span class="tiny-dot ${isExpenseDashboard ? "dot-green" : isIssuesDashboard ? "dot-orange" : totals.balance >= 0 ? "dot-green" : "dot-red"}"></span> ${isExpenseDashboard ? "Selon la répartition définie" : isIssuesDashboard ? "Sur la période sélectionnée" : "Revenus moins dépenses courantes"}</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">${isExpenseDashboard ? "Moyenne mensuelle" : isIssuesDashboard ? "Montant concerné" : "Épargne estimée"}</div><div class="kpi-value">${isExpenseDashboard ? formatMoney(expenseAnalysis.average) : isIssuesDashboard ? formatMoney(totals.expenses) : totals.income > 0 ? `${Math.round((totals.balance / totals.income) * 100)} %` : "—"}</div>
            <div class="kpi-foot">${isExpenseDashboard ? `Sur ${numberFormat.format(expenseAnalysis.activeMonthCount)} mois avec dépenses` : isIssuesDashboard ? "Dépenses non classées" : "Solde net rapporté aux revenus"}</div>
          </article>
        </section>
        ${expenseDashboardMarkup}
        ${selectedDashboard && !isIssuesDashboard && !isExpenseDashboard ? `
          <section class="panel current-balance-panel" aria-label="Argent disponible sur le compte">
            <div class="current-balance-copy">
              <span class="allocation-label">Argent disponible actuellement · ${escapeHtml(dashboardLabel)}</span>
              <strong>${availableBalance === null ? "À renseigner" : formatMoney(availableBalance, true)}</strong>
              <small>${recordedCurrentBalance !== null
                ? "Solde réel saisi par vous"
                : selectedDashboard.id === "cperso"
                  ? "Renseignez le solde de vos comptes C Perso ; les dépenses seules ne permettent pas de le calculer."
                  : "Estimation calculée depuis les soldes d’ouverture et les mouvements importés. Vous pouvez saisir le solde réel pour remplacer l’estimation."}</small>
            </div>
            <label class="current-balance-input">Solde réel du compte
              <span><input type="number" step="0.01" inputmode="decimal" data-current-balance value="${recordedCurrentBalance === null ? "" : recordedCurrentBalance.toFixed(2)}" placeholder="${availableBalance === null ? "Montant" : availableBalance.toFixed(2)}" aria-label="Solde réel disponible actuellement" /> €</span>
            </label>
          </section>` : ""}
        ${isTradeRepublicDashboard ? `
          <section class="panel tr-expense-summary" aria-label="Détail des dépenses Trade Republic">
            <div class="panel-heading"><div><h2>Placements et dépenses réelles</h2><p>Sur la période sélectionnée et les filtres actifs</p></div></div>
            <div class="tr-expense-breakdown">
              <div><span>Total des débits</span><strong>${formatMoney(totals.expenses, true)}</strong></div>
              <div><span>Saveback offert par la banque</span><strong>${formatMoney(totals.savebackExpenses, true)}</strong></div>
              <div><span>Dépenses sans Saveback</span><strong>${formatMoney(totals.expensesWithoutSaveback, true)}</strong></div>
              <div><span>⁉️ Plans d’épargne investis</span><strong>${formatMoney(totals.investments, true)}</strong></div>
              <div class="tr-final-expenses"><span>Dépenses finales · hors placements</span><strong>${formatMoney(totals.finalExpenses, true)}</strong></div>
            </div>
            <p class="allocation-note">Le Saveback est affiché dans les débits mais compensé par le revenu Saveback du même mois. Les plans d’épargne sont des investissements, pas des dépenses de consommation ; leur total est ventilé par mois et par cagnotte ci-dessous.</p>
          </section>` : ""}
        <section class="allocation-section" aria-label="Répartition des cagnottes"${isIssuesDashboard || isExpenseDashboard ? " hidden" : ""}>
          <div class="allocation-heading">
            <div><h2>Cagnottes estimées</h2><p>Répartition par catégorie sur la période sélectionnée</p></div>
          </div>
          <div class="allocation-grid">
            <article class="allocation-card">
              <span class="allocation-label">🤵‍♂️ Alexandre · total estimé</span>
              <strong>${formatMoney(allocations.alexandre)}</strong>
              <small>Personnel : ${formatMoney(allocations.alexandrePersonal)} · part du commun : ${formatMoney(allocations.sharedBalance / 2)}</small>
            </article>
            <article class="allocation-card">
              <span class="allocation-label">👰‍♀️ Kelly · total estimé</span>
              <strong>${formatMoney(allocations.kelly)}</strong>
              <small>Personnel : ${formatMoney(allocations.kellyPersonal)} · part du commun : ${formatMoney(allocations.sharedBalance / 2)}</small>
            </article>
            <article class="allocation-card allocation-shared">
              <span class="allocation-label">💑 Pot commun · total</span>
              <strong>${formatMoney(allocations.sharedBalance)}</strong>
              <small>Revenus : ${formatMoney(allocations.sharedIncome)} · dépenses : ${formatMoney(allocations.sharedExpenses)}</small>
            </article>
          </div>
          <p class="allocation-note">La part commune est répartie à 50/50. ${numberFormat.format(allocations.unclassifiedCount)} opération${allocations.unclassifiedCount > 1 ? "s" : ""} sans catégorie reconnue ne sont pas incluses (revenus : ${formatMoney(allocations.unclassifiedIncome)} · dépenses : ${formatMoney(allocations.unclassifiedExpenses)}).</p>
        </section>
        ${monthlyPots ? `
          <section class="panel pot-ledger-panel" aria-label="Suivi mensuel des cagnottes">
            <div class="panel-heading">
              <div><h2>Suivi mensuel des cagnottes</h2><p>Flux du mois et solde reporté au mois suivant${state.year === "all" ? " · toutes les périodes" : ` · ${escapeHtml(periodLabel)}`}</p></div>
            </div>
            ${["tr", "summeria", "cacf"].includes(selectedDashboard.id) ? `
              <div class="opening-balance-editor">
                <div class="opening-balance-heading">
                  <div><strong>Solde d’ouverture au 1er janvier ${Number(openingYear)}</strong><small>Reprise des soldes bancaires au 31 décembre ${Number(openingYear) - 1}</small></div>
                  <span>Enregistré sur cet appareil</span>
                </div>
                <div class="opening-balance-fields">
                  <label>Argent réellement sur le compte
                    <span><input type="number" step="0.01" inputmode="decimal" data-opening-balance="bank" value="${openingBalance.bank.toFixed(2)}" aria-label="Solde bancaire au début de l’année" /> €</span>
                  </label>
                  <label>Part d’Alexandre
                    <span><input type="number" step="0.01" inputmode="decimal" data-opening-balance="alexandre" value="${openingBalance.alexandre.toFixed(2)}" aria-label="Solde d’ouverture d’Alexandre" /> €</span>
                  </label>
                  <label>Part de Kelly
                    <span><input type="number" step="0.01" inputmode="decimal" data-opening-balance="kelly" value="${openingBalance.kelly.toFixed(2)}" aria-label="Solde d’ouverture de Kelly" /> €</span>
                  </label>
                  <div class="opening-balance-shared"><span>Part commune calculée</span><strong>${formatMoney(openingBalance.bank - openingBalance.alexandre - openingBalance.kelly, true)}</strong></div>
                </div>
                <p>Les soldes d’Alexandre, Kelly et la part commune calculée servent de point de départ aux soldes mensuels de cette année. Vos valeurs restent enregistrées dans ce navigateur.</p>
              </div>` : ""}
            ${monthlyPots.months.length ? `
              <div class="table-wrap pot-ledger-wrap">
                <table class="pot-ledger-table">
                  <thead>
                    <tr><th rowspan="2">Mois</th><th colspan="3">🤵‍♂️ Alexandre</th><th colspan="3">👰‍♀️ Kelly</th><th colspan="3">💑 50/50</th></tr>
                    <tr><th>Revenus</th><th>Dépenses</th><th>Reste fin de mois</th><th>Revenus</th><th>Dépenses</th><th>Reste fin de mois</th><th>Revenus</th><th>Dépenses</th><th>Reste fin de mois</th></tr>
                  </thead>
                  <tbody>${monthlyPots.months.map((month) => {
                    const displayMonth = state.year === "all"
                      ? `${monthNames[month.month]} ${month.year}`
                      : monthNames[month.month];
                    const flow = (value) => value ? formatMoney(value, true) : "—";
                    return `<tr>
                      <th scope="row">${escapeHtml(displayMonth)}</th>
                      <td class="amount-col positive">${flow(month.movement.alexandre.income)}</td>
                      <td class="amount-col">${flow(month.movement.alexandre.expenses)}</td>
                      <td class="amount-col pot-balance">${formatMoney(month.balances.alexandre, true)}</td>
                      <td class="amount-col positive">${flow(month.movement.kelly.income)}</td>
                      <td class="amount-col">${flow(month.movement.kelly.expenses)}</td>
                      <td class="amount-col pot-balance">${formatMoney(month.balances.kelly, true)}</td>
                      <td class="amount-col positive">${flow(month.movement.shared.income)}</td>
                      <td class="amount-col">${flow(month.movement.shared.expenses)}</td>
                      <td class="amount-col pot-balance">${formatMoney(month.balances.shared, true)}</td>
                    </tr>`;
                  }).join("")}</tbody>
                </table>
              </div>
              <p class="allocation-note">Soldes cumulés depuis la première opération du compte dans le fichier (départ à 0 €) ; les mois précédant l’année sélectionnée sont inclus dans le report. Les opérations non classées ne sont pas comptées${monthlyPots.unclassifiedCount ? ` (${numberFormat.format(monthlyPots.unclassifiedCount)} sur la période affichée)` : ""}.${selectedDashboard.id === "cperso" ? " Sur C Perso, le solde 50/50 est un cumul comptable des dépenses partagées, pas le solde d’un compte bancaire." : ""}</p>
            ` : `<div class="chart-empty">Aucune opération classée pour calculer les cagnottes de ce compte.</div>`}
          </section>` : ""}
        ${isIssuesDashboard ? `
          <section class="panel issue-summary-panel" aria-label="Opérations à vérifier">
            <div class="panel-heading"><div><h2>Pourquoi ces opérations apparaissent-elles ici ?</h2><p>${numberFormat.format(issuesCount)} opération${issuesCount > 1 ? "s" : ""} sans règle connue pour l’attribuer à une cagnotte.</p></div></div>
            <p>Vérifiez le compte, la catégorie et le mémo dans le tableau ci-dessous. Les ajustements « Déjà remboursée » et les transferts internes sont volontairement exclus.</p>
          </section>` : ""}
        <section class="settlement-section" aria-label="Équilibre des dépenses"${isIssuesDashboard || isExpenseDashboard ? " hidden" : ""}>
          <div class="allocation-heading">
            <div><h2>${selectedDashboard ? "Remboursement du compte" : "Récapitulatif des remboursements"}</h2><p>Calculs sur ${escapeHtml(periodLabel.toLowerCase())}, selon le compte payeur</p></div>
          </div>
          ${settlementSummaryMarkup}
          <div class="settlement-grid">${settlementCards}</div>
        </section>
        <section class="primary-grid"${isIssuesDashboard || isExpenseDashboard ? " hidden" : ""}>
          <article class="panel trend-panel">
            <div class="panel-heading">
              <div><h2>Revenus & dépenses</h2><p>${state.year === "all" ? "Cumul par mois · toutes périodes" : `Évolution mensuelle · ${escapeHtml(periodLabel)}`}</p></div>
              <div class="legend"><span><i class="legend-income"></i> Revenus</span><span><i class="legend-expense"></i> ${isTradeRepublicDashboard ? "Dépenses finales" : "Dépenses"}</span>${isTradeRepublicDashboard ? '<span><i class="legend-investment"></i> Placements</span>' : ""}</div>
            </div>
            <div class="chart-wrap"><canvas id="trend-chart" role="img" aria-label="Graphique mensuel des revenus et dépenses"></canvas><div class="chart-tooltip" id="chart-tooltip" role="status" hidden></div></div>
          </article>
          <article class="panel category-panel">
            <div class="panel-heading"><div><h2>Où va votre argent ?</h2><p>Répartition par catégorie</p></div></div>
            <div class="category-list">
              ${categories.length ? categories.slice(0, 6).map((item, index) => `
                <div class="category-item">
                  <div class="category-row"><span class="category-name">${escapeHtml(item.label)}</span><strong>${formatMoney(item.total)}</strong></div>
                  <div class="bar-track"><span class="category-bar bar-${index % 6}" title="${escapeHtml(item.label)} : ${escapeHtml(formatMoney(item.total, true))}" aria-label="${escapeHtml(item.label)} : ${escapeHtml(formatMoney(item.total, true))}" style="width:${Math.max(3, (item.total / categories[0].total) * 100)}%"></span></div>
                </div>`).join("") : `<div class="chart-empty">Aucune dépense sur cette période.</div>`}
            </div>
            ${categories.length > 6 ? `<div class="chart-footnote">+ ${categories.length - 6} autres catégories</div>` : ""}
          </article>
        </section>
        <section class="secondary-grid"${isIssuesDashboard || isExpenseDashboard ? " hidden" : ""}>
          <article class="panel monthly-panel">
            <div class="panel-heading"><div><h2>Votre rythme sur l’année</h2><p>${isTradeRepublicDashboard ? "Revenus, dépenses finales et placements par mois" : state.year === "all" ? "Cumul par mois · toutes périodes" : "Solde mensuel · revenus moins dépenses courantes"}</p></div></div>
            <div class="monthly-bars">
              ${totals.monthly.map((month) => {
                const displayExpenses = isTradeRepublicDashboard ? month.expenses - month.investments : month.expenses;
                const max = Math.max(1, ...totals.monthly.map((item) => Math.max(
                  item.income,
                  isTradeRepublicDashboard ? item.expenses - item.investments : item.expenses,
                  isTradeRepublicDashboard ? item.investments : 0,
                )));
                const incomeHeight = Math.max(month.income > 0 ? 2 : 0, (month.income / max) * 100);
                const expenseHeight = Math.max(displayExpenses > 0 ? 2 : 0, (displayExpenses / max) * 100);
                const investmentHeight = Math.max(month.investments > 0 ? 2 : 0, (month.investments / max) * 100);
                return `<div class="month-col" title="${monthNames[month.month]} : ${formatMoney(month.income - month.expenses, true)}">
                  <div class="month-bar-area"><span class="month-bar income-bar" title="${monthNames[month.month]} · Revenus : ${escapeHtml(formatMoney(month.income, true))}" aria-label="${monthNames[month.month]} · Revenus : ${escapeHtml(formatMoney(month.income, true))}" style="height:${incomeHeight}%"></span><span class="month-bar expense-bar" title="${monthNames[month.month]} · ${isTradeRepublicDashboard ? "Dépenses finales" : "Dépenses"} : ${escapeHtml(formatMoney(displayExpenses, true))}" aria-label="${monthNames[month.month]} · ${isTradeRepublicDashboard ? "Dépenses finales" : "Dépenses"} : ${escapeHtml(formatMoney(displayExpenses, true))}" style="height:${expenseHeight}%"></span>${isTradeRepublicDashboard ? `<span class="month-bar investment-bar" title="${monthNames[month.month]} · Plans d’épargne : ${escapeHtml(formatMoney(month.investments, true))}" aria-label="${monthNames[month.month]} · Plans d’épargne : ${escapeHtml(formatMoney(month.investments, true))}" style="height:${investmentHeight}%"></span>` : ""}</div>
                  <span class="month-label">${monthShort[month.month]}</span>
                </div>`;
              }).join("")}
            </div>
            ${isTradeRepublicDashboard ? `
              <div class="table-wrap monthly-investments-wrap">
                <table class="monthly-investments-table">
                  <thead><tr><th>Mois</th><th>💑 Couple</th><th>🤵‍♂️ Alexandre</th><th>👰‍♀️ Kelly</th><th>Total investi</th></tr></thead>
                  <tbody>${totals.monthly.map((month) => `<tr>
                    <th scope="row">${monthNames[month.month]}</th>
                    <td>${formatMoney(month.investmentByPot.shared, true)}</td>
                    <td>${formatMoney(month.investmentByPot.alexandre, true)}</td>
                    <td>${formatMoney(month.investmentByPot.kelly, true)}</td>
                    <td><strong>${formatMoney(month.investments, true)}</strong></td>
                  </tr>`).join("")}</tbody>
                  <tfoot><tr><th>Total</th><td>${formatMoney(totals.monthly.reduce((sum, month) => sum + month.investmentByPot.shared, 0), true)}</td><td>${formatMoney(totals.monthly.reduce((sum, month) => sum + month.investmentByPot.alexandre, 0), true)}</td><td>${formatMoney(totals.monthly.reduce((sum, month) => sum + month.investmentByPot.kelly, 0), true)}</td><td><strong>${formatMoney(totals.investments, true)}</strong></td></tr></tfoot>
                </table>
              </div>` : ""}
          </article>
          <article class="panel accounts-panel">
            <div class="panel-heading"><div><h2>Dépenses par compte</h2><p>Les comptes qui contribuent le plus</p></div></div>
            <div class="account-list">
              ${accounts.length ? accounts.slice(0, 5).map((item, index) => `
                <div class="account-item"><span class="account-rank">${String(index + 1).padStart(2, "0")}</span>
                  <span class="account-name">${escapeHtml(item.label)}</span><strong>${formatMoney(item.total)}</strong></div>`).join("") : `<div class="chart-empty">Aucune dépense sur cette période.</div>`}
            </div>
          </article>
        </section>
        <section class="panel transactions-panel">
          <div class="panel-heading transactions-heading">
            <div><h2>Transactions</h2><p>${numberFormat.format(rows.length)} opérations${hasFilters ? " · filtres actifs" : ""}</p></div>
            <button class="text-button clear-filters" id="clear-filters" type="button"${hasFilters ? "" : " hidden"}>Effacer les filtres</button>
          </div>
          <div class="filters">
            <label class="search-wrap"><span aria-hidden="true">⌕</span><input id="search-filter" type="search" placeholder="Rechercher un marchand, un mémo…" value="${escapeHtml(state.search)}" /></label>
            <select id="type-filter" aria-label="Filtrer par type">
              <option value="all"${state.type === "all" ? " selected" : ""}>Tous les types</option>
              <option value="income"${state.type === "income" ? " selected" : ""}>Revenus</option>
              <option value="expense"${state.type === "expense" ? " selected" : ""}>Dépenses</option>
            </select>
            <select id="category-filter" aria-label="Filtrer par catégorie">${optionList(categoryOptions, state.category, "Toutes les catégories")}</select>
            <select id="account-filter" aria-label="Filtrer par compte">${optionList(accountOptions, state.account, "Tous les comptes")}</select>
          </div>
          ${rows.length ? `
            <div class="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Type</th>${isIssuesDashboard ? "<th>Problème détecté</th>" : ""}<th>Catégorie</th><th>Libellé</th><th>Compte</th><th>Projet</th><th>Liée à</th><th class="amount-col">Part Alexandre</th><th class="amount-col">Part Kelly</th><th>Règlement estimé</th><th class="amount-col">Déjà remboursée</th><th class="amount-col">Montant</th></tr></thead>
                <tbody>${pageRows.map((transaction) => {
                  const sharing = transactionSharing(transaction);
                  return `
                  <tr class="${transaction.reimbursementOnly ? "reimbursement-row" : ""}">
                    <td class="date-cell">${formatDate(transaction.date)}</td>
                    <td><span class="type-pill ${transaction.reimbursementOnly ? "type-reimbursement" : transaction.type === "income" ? "type-income" : "type-expense"}">${transaction.reimbursementOnly ? "Déjà remboursée" : transaction.type === "income" ? "Revenu" : "Dépense"}</span></td>
                    ${isIssuesDashboard ? `<td class="issue-reason">${escapeHtml(transactionIssue(transaction))}</td>` : ""}
                    <td><span class="category-pill">${escapeHtml(transaction.category || (transaction.type === "income" ? "Revenu" : "Dépense"))}</span></td>
                    <td><strong class="transaction-title">${escapeHtml(transaction.shop || transaction.memo || "—")}</strong>${transaction.shop && transaction.memo ? `<small class="transaction-memo">${escapeHtml(transaction.memo)}</small>` : ""}</td>
                    <td class="muted-cell">${escapeHtml(transaction.account || "—")}</td>
                    <td class="muted-cell">${escapeHtml(transaction.project || "—")}</td>
                    <td>${escapeHtml(sharing.linked)}</td>
                    <td class="amount-col">${sharing.alexandre === null ? "—" : formatMoney(sharing.alexandre, true)}</td>
                    <td class="amount-col">${sharing.kelly === null ? "—" : formatMoney(sharing.kelly, true)}</td>
                    <td>${escapeHtml(sharing.settlement)}</td>
                    <td class="amount-col">${transaction.reimbursed ? formatMoney(-transaction.reimbursed, true) : "—"}</td>
                    <td class="amount-col ${transaction.type === "income" ? "positive" : ""}">${transaction.reimbursementOnly ? "—" : formatMoney(transaction.amount, true)}</td>
                  </tr>`;
                }).join("")}</tbody>
              </table>
            </div>
            <div class="pagination"><span>Affichage de ${(state.page - 1) * state.pageSize + 1}–${Math.min(state.page * state.pageSize, rows.length)} sur ${numberFormat.format(rows.length)}</span>
              <div><label for="page-size">Lignes</label><select id="page-size" aria-label="Transactions par page">${[10, 25, 50].map((size) => `<option value="${size}"${state.pageSize === size ? " selected" : ""}>${size}</option>`).join("")}</select><button id="previous-page" type="button" aria-label="Page précédente" ${state.page <= 1 ? "disabled" : ""}>←</button><span>${state.page} / ${pageCount}</span><button id="next-page" type="button" aria-label="Page suivante" ${state.page >= pageCount ? "disabled" : ""}>→</button></div></div>
          ` : `<div class="no-results"><span>⌕</span><strong>Aucune transaction trouvée</strong><p>Essayez un autre mot-clé ou modifiez vos filtres.</p></div>`}
        </section>
        <footer class="dashboard-footer">
          <span>Analyse locale · ${numberFormat.format(transactionCount)} transactions · ${numberFormat.format(state.duplicateCount)} doublons de feuilles annexes écartés</span>
          ${totals.transfers > 0 ? `<span>${formatMoney(totals.transfers)} de transferts exclus des dépenses courantes</span>` : ""}
        </footer>
        <div class="toast-slot" id="toast-slot" aria-live="polite"></div>
      </main>
    </div>`;

  drawTrendChart(totals.monthly, isTradeRepublicDashboard);
  bindUpload();
  document.querySelectorAll("[data-dashboard]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dashboard = button.dataset.dashboard;
      state.account = "all";
      state.category = "all";
      state.type = "all";
      state.search = "";
      state.page = 1;
      renderDashboard();
    });
  });
  document.querySelector("#year-filter").addEventListener("change", (event) => {
    state.year = event.target.value;
    state.page = 1;
    renderDashboard();
  });
  document.querySelectorAll("[data-opening-balance]").forEach((input) => {
    input.addEventListener("change", (event) => {
      try {
        const saved = saveOpeningBalance(
          selectedDashboard.id,
          openingYear,
          event.target.dataset.openingBalance,
          event.target.value,
        );
        if (!saved) {
          showToast("Saisissez un montant valide pour le solde d’ouverture.");
          return;
        }
        renderDashboard();
      } catch {
        showToast("Les soldes d’ouverture n’ont pas pu être enregistrés dans ce navigateur.");
      }
    });
  });
  document.querySelector("[data-current-balance]")?.addEventListener("change", (event) => {
    try {
      const saved = saveCurrentBalance(selectedDashboard.id, event.target.value);
      if (!saved) {
        showToast("Saisissez un montant valide pour le solde actuel.");
        return;
      }
      renderDashboard();
    } catch {
      showToast("Le solde actuel n’a pas pu être enregistré dans ce navigateur.");
    }
  });
  document.querySelector("#type-filter").addEventListener("change", (event) => {
    state.type = event.target.value;
    state.page = 1;
    renderDashboard();
  });
  document.querySelector("#category-filter").addEventListener("change", (event) => {
    state.category = event.target.value;
    state.page = 1;
    renderDashboard();
  });
  document.querySelector("#account-filter").addEventListener("change", (event) => {
    state.account = event.target.value;
    state.page = 1;
    renderDashboard();
  });
  document.querySelector("#search-filter").addEventListener("input", (event) => {
    const cursor = event.target.selectionStart;
    state.search = event.target.value;
    state.page = 1;
    renderDashboard();
    const input = document.querySelector("#search-filter");
    input.focus();
    input.setSelectionRange(cursor, cursor);
  });
  document.querySelector("#clear-filters")?.addEventListener("click", () => {
    state.category = "all";
    state.account = "all";
    state.type = "all";
    state.search = "";
    state.page = 1;
    renderDashboard();
  });
  document.querySelector("#previous-page")?.addEventListener("click", () => {
    state.page -= 1;
    renderDashboard();
  });
  document.querySelector("#next-page")?.addEventListener("click", () => {
    state.page += 1;
    renderDashboard();
  });
  document.querySelector("#page-size")?.addEventListener("change", (event) => {
    state.pageSize = Number(event.target.value);
    state.page = 1;
    renderDashboard();
  });
  document.querySelector("#change-file").addEventListener("click", resetApp);
}

function drawTrendChart(monthly, includeInvestments = false) {
  const canvas = document.querySelector("#trend-chart");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scale = window.devicePixelRatio || 1;
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  context.clearRect(0, 0, width, height);

  const chartWidth = width - 18;
  const chartHeight = height - 31;
  const chartTop = 8;
  const chartLeft = 8;
  const max = Math.max(1, ...monthly.map((month) => Math.max(
    month.income,
    includeInvestments ? month.expenses - month.investments : month.expenses,
    includeInvestments ? month.investments : 0,
  )));
  const step = chartWidth / 12;
  const barWidth = Math.min(includeInvestments ? 8 : 12, step * (includeInvestments ? 0.19 : 0.26));
  const tooltip = document.querySelector("#chart-tooltip");
  context.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
  context.textBaseline = "middle";

  for (let line = 0; line < 4; line += 1) {
    const y = chartTop + (chartHeight / 3) * line;
    context.beginPath();
    context.strokeStyle = "#eceee8";
    context.lineWidth = 1;
    context.moveTo(chartLeft, y);
    context.lineTo(chartLeft + chartWidth, y);
    context.stroke();
  }

  monthly.forEach((month, index) => {
    const x = chartLeft + step * index + step / 2;
    const incomeHeight = (month.income / max) * (chartHeight - 4);
    const displayedExpenses = includeInvestments ? month.expenses - month.investments : month.expenses;
    const expenseHeight = (displayedExpenses / max) * (chartHeight - 4);
    const investmentHeight = (month.investments / max) * (chartHeight - 4);
    context.fillStyle = "#2c8563";
    context.beginPath();
    context.roundRect(x - barWidth * (includeInvestments ? 1.5 : 1) - 1, chartTop + chartHeight - incomeHeight, barWidth, incomeHeight, 4);
    context.fill();
    context.fillStyle = "#f3a56e";
    context.beginPath();
    context.roundRect(x + 1, chartTop + chartHeight - expenseHeight, barWidth, expenseHeight, 4);
    context.fill();
    if (includeInvestments) {
      context.fillStyle = "#8e83bd";
      context.beginPath();
      context.roundRect(x + barWidth + 2, chartTop + chartHeight - investmentHeight, barWidth, investmentHeight, 4);
      context.fill();
    }
    context.fillStyle = "#878e86";
    context.textAlign = "center";
    context.fillText(monthShort[index], x, chartTop + chartHeight + 17);
  });

  canvas.onpointermove = (event) => {
    if (!tooltip) return;
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const monthIndex = Math.floor((x - chartLeft) / step);
    if (monthIndex < 0 || monthIndex >= monthly.length) {
      tooltip.hidden = true;
      return;
    }
    const month = monthly[monthIndex];
    tooltip.textContent = includeInvestments
      ? `${monthNames[monthIndex]} · Revenus : ${formatMoney(month.income, true)} · Dépenses finales : ${formatMoney(month.expenses - month.investments, true)} · Plans d’épargne : ${formatMoney(month.investments, true)} · Saveback : ${formatMoney(month.savebackExpenses, true)}`
      : `${monthNames[monthIndex]} · Revenus : ${formatMoney(month.income, true)} · Dépenses : ${formatMoney(month.expenses, true)}`;
    tooltip.style.left = `${Math.max(4, Math.min(bounds.width - tooltip.offsetWidth - 4, x + 12))}px`;
    tooltip.style.top = "8px";
    tooltip.hidden = false;
  };
  canvas.onpointerleave = () => {
    if (tooltip) tooltip.hidden = true;
  };
}

function showToast(message, type = "error") {
  const slot = document.querySelector("#toast-slot");
  if (!slot) return;
  slot.innerHTML = `<div class="toast toast-${type}" role="alert">${escapeHtml(message)}<button type="button" aria-label="Fermer">×</button></div>`;
  slot.querySelector("button").addEventListener("click", () => slot.replaceChildren());
}

async function handleFile(file) {
  if (!file) return;
  if (!/\.(xlsx|xlsm)$/i.test(file.name)) {
    showToast("Choisissez un fichier .xlsx ou .xlsm. Les fichiers .xls doivent d’abord être convertis au format .xlsx.");
    return;
  }
  try {
    const result = await loadWorkbook(file);
    state.transactions = result.transactions;
    state.fileName = file.name;
    state.duplicateCount = result.duplicateCount;
    state.dashboard = "overview";
    state.year = String(Math.max(...result.transactions.map((transaction) => transaction.date.getUTCFullYear())));
    state.category = "all";
    state.account = "all";
    state.type = "all";
    state.search = "";
    state.page = 1;
    renderDashboard();
    if (result.duplicateCount > 0) {
      showToast(`${numberFormat.format(result.duplicateCount)} doublons entre feuilles annexes et comptes ont été écartés des totaux.`, "info");
    }
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Le fichier n’a pas pu être lu.");
  }
}

function bindUpload() {
  document.querySelector("#file-input")?.addEventListener("change", (event) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  });
  const dropzone = document.querySelector("#dropzone");
  if (!dropzone) return;
  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("dragging");
  });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragging"));
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragging");
    handleFile(event.dataTransfer?.files?.[0]);
  });
}

function resetApp() {
  state.transactions = [];
  state.fileName = "";
  state.dashboard = "overview";
  state.year = "all";
  state.category = "all";
  state.account = "all";
  state.type = "all";
  state.search = "";
  state.page = 1;
  renderEmpty();
}

window.addEventListener("resize", () => {
  if (state.transactions.length) {
    drawTrendChart(summarize(visibleTransactions()).monthly, state.dashboard === "tr");
  }
});

renderEmpty();
