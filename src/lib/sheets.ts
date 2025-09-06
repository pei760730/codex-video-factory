// src/lib/sheets.ts
import { google } from "googleapis";
import { env } from "../env.js";

export type Row = Record<string, any>;

/** 支援直接貼 JSON 或貼 Base64（.env 裡的 GSA_JSON 兩種都可） */
function parseServiceAccount(jsonOrB64: string) {
  try {
    return JSON.parse(jsonOrB64);
  } catch {
    const decoded = Buffer.from(jsonOrB64.replace(/^'+|'+$/g, ""), "base64").toString("utf8");
    return JSON.parse(decoded);
  }
}

const creds = parseServiceAccount(env.GSA_JSON);
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

export async function readSheet(sheetName: string): Promise<Row[]> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: env.GSHEET_ID,
    range: `${sheetName}!A:Z`,
  });

  const [header, ...rows] = (res.data.values || []) as string[][];
  if (!header) return [];

  return rows.map(r =>
    Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ""]))
  );
}

export async function updateRows(sheetName: string, updates: Row[]) {
  if (!updates.length) return;

  // 讀現有資料與表頭
  const existing = await readSheet(sheetName);
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: env.GSHEET_ID,
    range: `${sheetName}!1:1`,
  });
  const header = (headerRes.data.values?.[0] || []) as string[];
  if (!header.length) throw new Error(`Sheet "${sheetName}" has no header.`);

  // 依 row_id 合併更新
  const byId = new Map(existing.map(x => [String(x["row_id"]), x]));
  for (const u of updates) {
    const id = String(u["row_id"]);
    if (byId.has(id)) byId.set(id, { ...byId.get(id), ...u });
  }

  // 按 row_id 排序並回寫
  const all = Array.from(byId.values()).sort(
    (a, b) => Number(a.row_id) - Number(b.row_id)
  );
  const values = all.map(row => header.map(h => row[h] ?? ""));

  await sheets.spreadsheets.values.update({
    spreadsheetId: env.GSHEET_ID,
    range: `${sheetName}!A2`,
    valueInputOption: "RAW",
    requestBody: { values },
  });
}
