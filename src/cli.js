#!/usr/bin/env node
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
var commander_1 = require("commander");
var chalk_1 = require("chalk");
var ora_1 = require("ora");
var sourceProcess_js_1 = require("./commands/sourceProcess.js");
var sheets_js_1 = require("./lib/sheets.js");
var env_js_1 = require("./env.js");
var program = new commander_1.Command();
program.name("codex").description("影片工廠 CLI (GAS v6.62 相容)").version("3.0.0");
program.command("video:clean").description("清理暫存區影片連結").action(sourceProcess_js_1.default);
program
    .command("status")
    .description("系統狀態總覽")
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, _a, sources, tasks, completed, pending, shooting, editing, readyToMove, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                spinner = (0, ora_1.default)("讀取狀態...").start();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Promise.all([
                        (0, sheets_js_1.readSheet)(env_js_1.env.SHEET_SOURCE),
                        (0, sheets_js_1.readSheet)(env_js_1.env.SHEET_TASKS),
                        (0, sheets_js_1.readSheet)(env_js_1.env.SHEET_COMPLETED),
                    ])];
            case 2:
                _a = _b.sent(), sources = _a[0], tasks = _a[1], completed = _a[2];
                spinner.stop();
                pending = tasks.filter(function (t) { return t["狀態"] === "還沒開始"; }).length;
                shooting = tasks.filter(function (t) { return t["狀態"] === "拍攝中"; }).length;
                editing = tasks.filter(function (t) { return t["狀態"] === "剪輯中"; }).length;
                readyToMove = tasks.filter(function (t) { return t["狀態"] === "完成"; }).length;
                console.log(chalk_1.default.bgBlue.white.bold("\n 📊 系統狀態 (GAS v6.62) "));
                console.log(chalk_1.default.gray("─".repeat(40)));
                console.log("\u66AB\u5B58\u5340: ".concat(chalk_1.default.cyan(sources.length), " \u7B46"));
                console.log("\u7E3D\u8868: ".concat(chalk_1.default.cyan(tasks.length), " \u7B46"));
                console.log("  \u9084\u6C92\u958B\u59CB: ".concat(chalk_1.default.yellow(pending)));
                console.log("  \u62CD\u651D\u4E2D: ".concat(chalk_1.default.blue(shooting)));
                console.log("  \u526A\u8F2F\u4E2D: ".concat(chalk_1.default.blue(editing)));
                if (readyToMove > 0) {
                    console.log("  ".concat(chalk_1.default.bgGreen.black(" 待搬移 "), ": ").concat(chalk_1.default.green(readyToMove), " (\u72C0\u614B=\u5B8C\u6210)"));
                }
                console.log("\u5B8C\u6210\u7E3D\u8868: ".concat(chalk_1.default.green(completed.length), " \u7B46\n"));
                return [3 /*break*/, 4];
            case 3:
                e_1 = _b.sent();
                spinner.fail("讀取失敗");
                console.error(chalk_1.default.red(e_1.message));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
program.parse();
