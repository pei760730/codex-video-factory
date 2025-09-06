"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.env = {
    GSHEET_ID: process.env.GSHEET_ID || "",
    GSA_JSON: process.env.GSA_JSON || "",
    SHEET_SOURCE: process.env.SHEET_SOURCE || "暫存區",
    SHEET_TASKS: process.env.SHEET_TASKS || "總表",
    SHEET_COMPLETED: process.env.SHEET_COMPLETED || "完成總表",
};
if (!exports.env.GSHEET_ID)
    throw new Error("Missing GSHEET_ID");
if (!exports.env.GSA_JSON)
    throw new Error("Missing GSA_JSON");
