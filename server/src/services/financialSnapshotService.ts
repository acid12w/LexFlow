import Matter from "#models /matter.js";
import FinancialSnapshotSchema from "../models /financialSnapshot.js";

export async function generateFinancialSnapshot(firmId: string) {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  // 1. Total billed (all matters created up to end of month)
  const billedResult = await Matter.aggregate([
    {
      $match: {
        startDate: { $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalBilled: { $sum: "$billAmount" },
      },
    },
  ]);

  const totalBilled = billedResult[0]?.totalBilled || 0;

  console.log(endOfMonth);

  // 2. Total collected (up to end of month)
  const collectedResult = await Matter.aggregate([
    {
      $match: {
        billIsCollected: true,
        billCollectedDate: { $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalCollected: { $sum: "$billAmount" },
      },
    },
  ]);

  const totalCollected = collectedResult[0]?.totalCollected || 0;

  // 3. Outstanding snapshot
  const totalOutstanding = totalBilled - totalCollected;

  // 4. Save snapshot
  await FinancialSnapshotSchema.create({
    firmId: firmId,
    year,
    month: month + 1,
    totalBilled,
    totalCollected,
    totalOutstanding,
    generatedAt: new Date(),
  });

  console.log("Snapshot saved:", { year, month: month + 1 });
}
