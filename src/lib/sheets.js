"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSheet = readSheet;
exports.updateRows = updateRows;
// src/lib/sheets.ts
var googleapis_1 = require("googleapis");
var env_js_1 = require("../env.js");
/** 支援直接貼 JSON 或貼 Base64（.env 裡的 GSA_JSON 兩種都可） */
function parseServiceAccount(jsonOrB64) {
    try {
        return JSON.parse(jsonOrB64);
    }
    catch (_a) {
        var decoded = Buffer.from(jsonOrB64.replace(/^'+|'+$/g, ""), "base64").toString("utf8");
        return JSON.parse(decoded);
    }
}
var creds = parseServiceAccount(env_js_1.env.GSA_JSON);
var auth = new googleapis_1.google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
var sheets = googleapis_1.google.sheets({ version: "v4", auth: auth });
function readSheet(sheetName) {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a, header, rows;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sheets.spreadsheets.values.get({
                        spreadsheetId: env_js_1.env.GSHEET_ID,
                        range: "".concat(sheetName, "!A:Z"),
                    })];
                case 1:
                    res = _b.sent();
                    _a = (res.data.values || []), header = _a[0], rows = _a.slice(1);
                    if (!header)
                        return [2 /*return*/, []];
                    return [2 /*return*/, rows.map(function (r) {
                            return Object.fromEntries(header.map(function (h, i) { var _a; return [h.trim(), (_a = r[i]) !== null && _a !== void 0 ? _a : ""]; }));
                        })];
            }
        });
    });
}
function updateRows(sheetName, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, headerRes, header, byId, _i, updates_1, u, id, all, values;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!updates.length)
                        return [2 /*return*/];
                    return [4 /*yield*/, readSheet(sheetName)];
                case 1:
                    existing = _b.sent();
                    return [4 /*yield*/, sheets.spreadsheets.values.get({
                            spreadsheetId: env_js_1.env.GSHEET_ID,
                            range: "".concat(sheetName, "!1:1"),
                        })];
                case 2:
                    headerRes = _b.sent();
                    header = (((_a = headerRes.data.values) === null || _a === void 0 ? void 0 : _a[0]) || []);
                    if (!header.length)
                        throw new Error("Sheet \"".concat(sheetName, "\" has no header."));
                    byId = new Map(existing.map(function (x) { return [String(x["row_id"]), x]; }));
                    for (_i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
                        u = updates_1[_i];
                        id = String(u["row_id"]);
                        if (byId.has(id))
                            byId.set(id, __assign(__assign({}, byId.get(id)), u));
                    }
                    all = Array.from(byId.values()).sort(function (a, b) { return Number(a.row_id) - Number(b.row_id); });
                    values = all.map(function (row) { return header.map(function (h) { var _a; return (_a = row[h]) !== null && _a !== void 0 ? _a : ""; }); });
                    return [4 /*yield*/, sheets.spreadsheets.values.update({
                            spreadsheetId: env_js_1.env.GSHEET_ID,
                            range: "".concat(sheetName, "!A2"),
                            valueInputOption: "RAW",
                            requestBody: { values: values },
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
