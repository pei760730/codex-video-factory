"use strict";
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
exports.default = sourceProcess;
var ora_1 = require("ora");
var chalk_1 = require("chalk");
var env_js_1 = require("../env.js");
var sheets_js_1 = require("../lib/sheets.js");
var videoParser_js_1 = require("../lib/videoParser.js");
function sourceProcess() {
    return __awaiter(this, void 0, void 0, function () {
        var spinner, rows, updates, _i, rows_1, r, parsed, dist_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spinner = (0, ora_1.default)("處理暫存區連結...").start();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, sheets_js_1.readSheet)(env_js_1.env.SHEET_SOURCE)];
                case 2:
                    rows = _a.sent();
                    updates = [];
                    for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                        r = rows_1[_i];
                        if (r["CLEAN_URL"] || !r["row_id"])
                            continue;
                        parsed = (0, videoParser_js_1.parseVideoLink)(r["VIDEO_REF"]);
                        if (!parsed)
                            continue;
                        updates.push({
                            row_id: r["row_id"],
                            PLATFORM: parsed.platform,
                            CLEAN_URL: parsed.cleanUrl,
                            VIDEO_ID: parsed.videoId || r["VIDEO_ID"],
                            NOTE: "".concat((r["NOTE"] || "").replace("[processed]", "").trim(), " [processed]").trim(),
                        });
                    }
                    if (!updates.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, sheets_js_1.updateRows)(env_js_1.env.SHEET_SOURCE, updates)];
                case 3:
                    _a.sent();
                    spinner.succeed("\u5DF2\u8655\u7406 ".concat(updates.length, " \u7B46\u9023\u7D50"));
                    dist_1 = {};
                    updates.forEach(function (u) { return (dist_1[u.PLATFORM] = (dist_1[u.PLATFORM] || 0) + 1); });
                    console.log(chalk_1.default.cyan("平台分布："), dist_1);
                    return [3 /*break*/, 5];
                case 4:
                    spinner.info("沒有新連結需要處理");
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    spinner.fail("處理失敗: " + e_1.message);
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
