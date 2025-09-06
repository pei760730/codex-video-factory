#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import sourceProcess from "./commands/sourceProcess.js";
import { readSheet } from "./lib/sheets.js";
import { env } from "./env.js";

const program = new Command();
program.name("codex").description("影片工廠 CLI (GAS v6.62 相容)").version("3.0.0");

program.command("video:clean").description("清理暫存區影片連結").action(sourceProcess);

program
  .command("status")
  .description("系統狀態總覽")
  .action(async () => {
    const spinner = ora("讀取狀態...").start();
    try {
      const [sources, tasks, completed] = await Promise.all([
        readSheet(env.SHEET_SOURCE),
        readSheet(env.SHEET_TASKS),
        readSheet(env.SHEET_COMPLETED),
      ]);
      spinner.stop();

      const pending = tasks.filter(t => t["狀態"] === "還沒開始").length;
      const shooting = tasks.filter(t => t["狀態"] === "拍攝中").length;
      const editing = tasks.filter(t => t["狀態"] === "剪輯中").length;
      const readyToMove = tasks.filter(t => t["狀態"] === "完成").length;

      console.log(chalk.bgBlue.white.bold("\n 📊 系統狀態 (GAS v6.62) "));
      console.log(chalk.gray("─".repeat(40)));
      console.log(`暫存區: ${chalk.cyan(sources.length)} 筆`);
      console.log(`總表: ${chalk.cyan(tasks.length)} 筆`);
      console.log(`  還沒開始: ${chalk.yellow(pending)}`);
      console.log(`  拍攝中: ${chalk.blue(shooting)}`);
      console.log(`  剪輯中: ${chalk.blue(editing)}`);
      if (readyToMove > 0) {
        console.log(`  ${chalk.bgGreen.black(" 待搬移 ")}: ${chalk.green(readyToMove)} (狀態=完成)`);
      }
      console.log(`完成總表: ${chalk.green(completed.length)} 筆\n`);
    } catch (e: any) {
      spinner.fail("讀取失敗");
      console.error(chalk.red(e.message));
    }
  });

program.parse();
