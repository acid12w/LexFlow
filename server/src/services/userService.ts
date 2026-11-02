// src/services/userService.js
import User, { IUser as UserInterface } from "../models /user.js";
import crypto from "crypto";
import mongoose from "mongoose";
import Firm from "../models /firm.js";
import FirmInvitation from "../models /FirmInvitation.js";

interface InviteUserParams {
  firmId: mongoose.Types.ObjectId;
  invitedBy: mongoose.Types.ObjectId;

  email: string;
  role: string;
}

const createUser = async (data: Record<string, unknown>) => {
  return await User.create(data);
};

const getUserByUsername = async (username: string) => {
  return await User.findOne({ userName: username });
};
const getUserByFirmId = async (Id: any) => {
  return await User.find({ firmId: Id });
};

const getUserService = async (id: string) => {
  try {
    return await User.findById({ _id: id });
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
};

const getUsersProfile = async (userIds: Array<string | { _id: string }>) => {
  try {
    // 1. Extract IDs if they are objects, or use directly if strings
    const ids = userIds.map((user) =>
      typeof user === "string" ? user : user._id
    );

    // 2. Use $in to fetch all users in one go
    const users = await User.find({
      _id: { $in: ids },
    })
      .select("userName image _id") // Only fetch what you need for "assignedTo"
      .lean(); // Returns plain JS objects (faster than Mongoose docs)

    return users;
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
};

// Helper utility to convert nested objects into dot notation
const flattenObject = (
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> => {
  return Object.keys(obj).reduce<Record<string, unknown>>((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    const value = obj[k];

    // Check if it's a plain object (and not an Array, Date, or ObjectId)
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value.constructor && value.constructor.name === "ObjectId")
    ) {
      Object.assign(
        acc,
        flattenObject(value as Record<string, unknown>, pre + k)
      );
    } else {
      acc[pre + k] = value;
    }

    return acc;
  }, {});
};

const updateUserProfile = async (data: Record<string, unknown>, id: string) => {
  // 1. Flatten the incoming data so nested fields use dot notation
  const flattenedData = flattenObject(data);

  // 2. Perform the update safely
  const response = await User.findByIdAndUpdate(
    { _id: id },
    { $set: flattenedData }, // Uses the flattened dot-notation object
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
  return response;
};

const deleteUserProfile = async (userId: string) => {
  const response = await User.findOneAndDelete({ _id: userId });
  return response;
};

const inviteUser = async ({
  firmId,
  invitedBy,
  email,
  role,
}: InviteUserParams) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const normalizedEmail = email.toLowerCase().trim();

    const firm = await Firm.findById(firmId).session(session);

    if (!firm) {
      throw new Error("Firm not found.");
    }

    const existingUser = await User.findOne({
      "profile.email": normalizedEmail,
    }).session(session);

    if (existingUser) {
      throw new Error("Email is already registered.");
    }

    const existingInvitation = await FirmInvitation.findOne({
      email: normalizedEmail,
      status: "PENDING",
    }).session(session);

    if (existingInvitation) {
      throw new Error("A pending invitation already exists.");
    }

    const invitationToken = crypto.randomBytes(32).toString("hex");

    const verificationToken = crypto
      .createHash("sha256")
      .update(invitationToken)
      .digest("hex");

    const randomPassword = crypto.randomBytes(24).toString("hex");

    const user = await User.create(
      [
        {
          password: randomPassword,

          role,

          firmId,

          profile: {
            email: normalizedEmail,
          },

          status: "PENDING",

          emailVerified: false,
        },
      ],
      { session }
    );

    await FirmInvitation.create(
      [
        {
          firmId,

          email: normalizedEmail,

          role,

          invitedBy,

          token: verificationToken,

          status: "PENDING",

          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      invitationToken,

      email: normalizedEmail,

      role,
    };
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    session.endSession();
  }
};

export {
  createUser,
  inviteUser,
  getUserByFirmId,
  getUserByUsername,
  getUsersProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserService,
};
