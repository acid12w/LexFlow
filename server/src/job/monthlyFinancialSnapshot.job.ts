import Firm from "#models /firm.js";
import { generateFinancialSnapshot } from "../services/financialSnapshotService.js";

export const runMonthlySnapshot = async () => {
  const firms = await Firm.find();

  for (const firm of firms) {
    await generateFinancialSnapshot();
  }
};
