import ora from "ora";
import chalk from "chalk";
import { env } from "../env.js";
import { readSheet, updateRows } from "../lib/sheets.js";
import { parseVideoLink } from "../lib/videoParser.js";

export default async function sourceProcess() {
  const spinner = ora("處理暫存區連結...").start();

  try {
    const rows = await readSheet(env.SHEET_SOURCE);
    const updates: any[] = [];

    for (const r of rows) {
      if (r["CLEAN_URL"] || !r["row_id"]) continue;

      const parsed = parseVideoLink(r["VIDEO_REF"]);
      if (!parsed) continue;

      updates.push({
        row_id: r["row_id"],
        PLATFORM: parsed.platform,
        CLEAN_URL: parsed.cleanUrl,
        VIDEO_ID: parsed.videoId || r["VIDEO_ID"],
        NOTE: `${(r["NOTE"] || "").replace("[processed]", "").trim()} [processed]`.trim(),
      });
    }

    if (updates.length) {
      await updateRows(env.SHEET_SOURCE, updates);
      spinner.succeed(`已處理 ${updates.length} 筆連結`);

      const dist: Record<string, number> = {};
      updates.forEach(u => (dist[u.PLATFORM] = (dist[u.PLATFORM] || 0) + 1));
      console.log(chalk.cyan("平台分布："), dist);
    } else {
      spinner.info("沒有新連結需要處理");
    }
  } catch (e: any) {
    spinner.fail("處理失敗: " + e.message);
    process.exit(1);
  }
}
