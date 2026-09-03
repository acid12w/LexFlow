import { ActivityLog } from "../models /activeyLog.js";

/**
 * Creates an activity log and truncates the collection history to exactly 5 items.
 */
export async function createLog({
  userId,
  firmId,
  userName,
  category,
  description,
  metadata = {},
}) {
  try {
    // 1. Save the new structural action log entry

    await ActivityLog.create({
      userId,
      firmId,
      userName,
      category,
      description,
      metadata,
    });

    // 2. Query the 5 newest log IDs currently stored
    const activeLogs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id")
      .lean();

    const activeIds = activeLogs.map((log) => log._id);

    // 3. Delete any log in the database that isn't among those 5 newest IDs
    await ActivityLog.deleteMany({ _id: { $nin: activeIds } });
  } catch (error) {
    console.error("Strict Logger Queue Interruption:", error);
  }
}
