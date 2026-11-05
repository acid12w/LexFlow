import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models /user.js";
import bcrypt from "bcryptjs";
import {
  getUsersProfile,
  updateUserProfile,
  deleteUserProfile,
  inviteUser,
  createUser,
  getUserService,
} from "../services/userService.js";
import { createFirm, getFirmById } from "../services/firmService.js";
import { ProtectedRequest } from "../types/express.js";
import crypto from "crypto";
import FirmInvitation from "../models /FirmInvitation.js";
import Firm from "#models /firm.js";

// In production the client and API are usually on different sites (e.g. Vercel
// + Render), and browsers only send the cookie on those requests when it is
// SameSite=None; Secure. Locally (localhost:3000 -> localhost:8080) Lax is enough.
const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  maxAge: 60 * 60 * 1000,
};

// Fields a user may never set on themselves through the profile update
const PROTECTED_USER_FIELDS = [
  "_id",
  "password",
  "role",
  "firmId",
  "status",
  "emailVerified",
  "verificationToken",
  "verificationTokenExpires",
];

const signToken = (
  userId: string,
  firmId: string | null | undefined,
  userName: string
) =>
  jwt.sign(
    {
      userId,
      ...(firmId ? { firmId } : {}),
      userName,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

const formatUserResponse = (user: InstanceType<typeof User>) => {
  const {
    password: _password,
    verificationToken: _verificationToken,
    verificationTokenExpires: _verificationTokenExpires,
    ...userObj
  } = user.toObject();
  return {
    ...userObj,
    firmId: user.firmId?.toString(),
  };
};

export const createFirmAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body?.data ?? req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, practiceAreas, workspace, country } = body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Firm name is required" });
    }

    const existingFirm = await Firm.findOne({
      name,
    });

    if (existingFirm) {
      return res.status(400).json({
        error: "A firm with that name already exists.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.firmId) {
      return res.status(400).json({
        error: "You already belong to a firm.",
      });
    }

    const firm = await createFirm({
      name,
      // logo,
      practiceAreas,
      workspace,
      country,
    });

    user.firmId = firm._id;
    await user.save();

    const token = signToken(
      user._id.toString(),
      user.firmId.toString(),
      user.userName.toString()
    );

    res.cookie("token", token, authCookieOptions);

    res.status(201).json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const createUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body?.data ?? req.body;

    const { userName, password, profile } = body;

    if (
      typeof userName !== "string" ||
      typeof password !== "string" ||
      typeof profile?.email !== "string"
    ) {
      return res.status(400).json({ error: "Missing required sign-up fields" });
    }

    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({
      "profile.email": profile.email.toLowerCase(),
    });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const newUser = await createUser({
      userName,
      password,
      role: "Admin",
      firmId: null,
      profile: {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    });

    const token = signToken(newUser._id.toString(), null, newUser.userName);

    res.cookie("token", token, authCookieOptions);

    res.status(201).json({
      token,
      user: formatUserResponse(newUser),
    });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body?.data ?? req.body;
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const { userName, password, role, profile } = body;
    const firmId = req.user?.firmId;
    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (
      typeof userName !== "string" ||
      typeof password !== "string" ||
      typeof profile?.email !== "string"
    ) {
      return res.status(400).json({ error: "Missing required sign-up fields" });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({
      "profile.email": profile.email.toLowerCase(),
    });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const existingFrim = await Firm.findOne({ _id: firmId });

    if (!existingFrim) {
      return res.status(400).json({ error: "Firm does not exist" });
    }

    const newUser = new User({
      userName,
      password,
      role: role,
      firmId,
      profile: {
        email: profile.email,
      },
      // billing: billing ?? { defaultHourlyRate: 0 },
      verificationToken,
    });

    // Save the user first so a failed save doesn't leave an orphaned invitation
    const savedUser = await newUser.save();

    await FirmInvitation.create({
      firmName: existingFrim.name,
      firmId: firmId,
      email: profile.email,
      role,
      token: verificationToken,
      invitedBy: req.user?.id
        ? new mongoose.Types.ObjectId(req.user.id)
        : undefined,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // No token/cookie here: the admin adding the user must stay signed in as
    // themselves. The new user signs in via the invitation.
    res.status(201).json({
      user: formatUserResponse(savedUser),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName, password } = req.body ?? {};

    if (typeof userName !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ userName }).select("+password");

    // Same response for unknown user and wrong password, so usernames
    // can't be enumerated
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = signToken(
      user._id.toString(),
      user?.firmId?.toString() ?? "",
      user?.userName?.toString() ?? ""
    );

    if (!token) {
      return res.status(401).json({ error: "Failed to sign token" });
    }

    res.cookie("token", token, authCookieOptions);

    res.status(200).json({
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Must use the same attributes the cookie was set with, or it won't clear
  const { maxAge: _maxAge, ...clearOptions } = authCookieOptions;
  res.clearCookie("token", clearOptions);
  res.status(200).json({
    message: "Logged out successfully",
  });
};

export const getFirmMembers = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const firmId = req.user?.firmId;

    if (!firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const response = await User.find({ firmId }).select(
      "userName profile profileImg role firmId _id"
    );

    res.status(200).json({
      message: "Successful",
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const getFirmInvitation = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: invitationId } = req.params;
    const response = await FirmInvitation.findOne({
      token: String(invitationId),
    });
    if (!response) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    res.status(200).json({
      message: "Successful",
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.user?.id;
  if (!id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const response = await getUserService(id);

    res.status(200).json({
      message: "Successful",
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  const id = String(req.params.id);
  const requesterId = req.user?.id;
  const firmId = req.user?.firmId;
  if (!requesterId || !firmId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const requester = await User.findById(requesterId).select("role firmId");
    if (!requester || String(requester.firmId) !== firmId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (requester.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only admins can remove team members" });
    }
    if (id === requesterId) {
      return res.status(400).json({ message: "You cannot remove yourself" });
    }

    const target = mongoose.Types.ObjectId.isValid(id)
      ? await User.findOne({ _id: id, firmId }).select("_id")
      : null;
    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUserProfile(id);

    res.status(200).json({
      message: "successful",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.user?.id;
  if (!id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "No update data provided" });
  }

  const data = { ...req.body };
  for (const field of PROTECTED_USER_FIELDS) {
    delete data[field];
  }

  try {
    const response = await updateUserProfile(data, id);
    res.status(200).json({
      data: response,
      message: "successful",
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data } = req.body;

  try {
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    const result = await getUsersProfile(data);

    res.status(200).json({
      message: "successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body ?? {};

  if (typeof token !== "string" || !token) {
    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.emailVerified = true;

    user.verificationToken = undefined;

    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const joinFirm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { userName, password } = req.body;

    if (!token || typeof userName !== "string" || typeof password !== "string") {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const invitation = await FirmInvitation.findOne({
      token,
      status: "PENDING",
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return res.status(400).json({
        error: "Invitation is invalid or has expired.",
      });
    }

    const user = await User.findOne({
      "profile.email": invitation.email,
      firmId: invitation.firmId,
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    // Prevent duplicate usernames
    const existingUser = await User.findOne({
      userName,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Username is already taken.",
      });
    }

    user.userName = userName;
    user.password = password;

    // Optional if these were already assigned by the admin
    user.role = invitation.role;

    user.emailVerified = true;
    user.status = "ACTIVE";

    await user.save();

    invitation.status = "ACCEPTED";
    invitation.acceptedAt = new Date();

    await invitation.save();

    const authToken = signToken(
      user._id.toString(),
      user.firmId.toString(),
      user.userName
    );

    res.cookie("token", authToken, authCookieOptions);

    return res.status(200).json({
      user: formatUserResponse(user),
    });
  } catch (err) {
    next(err);
  }
};

// export const createUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const body = req.body.data ?? req.body;

//     const result = await inviteUser({
//       firmId: req.user.firmId,

//       invitedBy: req.user.id,

//       email: body.profile.email,

//       role: body.role,
//     });

//     // Send email here

//     res.status(201).json({
//       message: "Invitation sent successfully.",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const getTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firmId = req.user?.firmId;
  if (!firmId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const members = await User.find({
      firmId,
      // _id: { $ne: req.user?.id },
    })
      .select("-password -verificationToken -verificationTokenExpires")
      .lean();

    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};
