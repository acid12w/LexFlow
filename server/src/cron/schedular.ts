import cron from "node-cron";
import { runMonthlySnapshot } from "../job/monthlyFinancialSnapshot.job.js";

export const initializeCronJobs = () => {
  cron.schedule("0 0 1 * *", async () => {
    await runMonthlySnapshot();
  });
};
