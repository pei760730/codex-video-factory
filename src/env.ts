import dotenv from 'dotenv';
dotenv.config();

export const env = {
  GSHEET_ID: process.env.GSHEET_ID || "",
  GSA_JSON: process.env.GSA_JSON || "",
  SHEET_SOURCE: process.env.SHEET_SOURCE || "暫存區",
  SHEET_TASKS: process.env.SHEET_TASKS || "總表",
  SHEET_COMPLETED: process.env.SHEET_COMPLETED || "完成總表",
};

if (!env.GSHEET_ID) throw new Error("Missing GSHEET_ID");
if (!env.GSA_JSON) throw new Error("Missing GSA_JSON");
