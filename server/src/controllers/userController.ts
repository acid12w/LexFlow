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
import { Resend } from "resend";
import FirmInvitation from "../models /FirmInvitation.js";
import Firm from "#models /firm.js";

const resend = new Resend("re_Xi4vGP3M_P7wciGkbS7MxNdwaguzR7vsk");

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
    process.env.JWT_SECRET || "privatekey",
    { expiresIn: "1h" }
  );

const formatUserResponse = (user: InstanceType<typeof User>) => {
  const userObj = user.toObject();
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

    const { name, practiceAreas, workspace, country } = body;

    const existingFirm = await Firm.findOne({
      name,
    });
    console.log(req.user);

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
    user.save();

    const token = signToken(
      user._id.toString(),
      user.firmId.toString(),
      user.userName.toString()
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

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

    if (!userName || !password || !profile?.email) {
      return res.status(400).json({ error: "Missing required sign-up fields" });
    }

    const existingUser = await User.findOne({ userName });

    console.log(existingUser);

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

    const token = signToken(
      newUser._id.toString(),
      (newUser.firmId = undefined),
      newUser.userName.toString()
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(201).json({
      token,
      user: newUser.toObject(),
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

    if (!userName || !password || !profile?.email) {
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

    const firmId = req.user?.firmId;

    const existingFrim = await Firm.findOne({ _id: firmId });

    console.log(existingFrim);

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

    const savedUser = await newUser.save();
    const token = signToken(
      savedUser._id.toString(),
      savedUser.firmId.toString(),
      savedUser.userName.toString()
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(201).json({
      token,
      user: savedUser.toObject(),
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
    const { userName, password } = req.body;

    const user = await User.findOne({ userName }).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = signToken(
      user._id.toString(),
      user?.firmId?.toString() ?? "",
      user?.userName?.toString() ?? ""
    );

    if (!token) {
      return res.status(401).json({ error: "Failed to sign token" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

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
  res.clearCookie("token");
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
    const response = await FirmInvitation.findOne({ token: invitationId });

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
  const { id } = req.user;

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
  const { id } = req.params;

  try {
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
  const data = req.body;
  const { id } = req.user;

  console.log(data);

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

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

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
};

export const joinFirm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { userName, password } = req.body;

    if (!token || !userName || !password) {
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
    user.workspaceIds = invitation.workspaceIds;

    user.emailVerified = true;
    user.status = "ACTIVE";

    await user.save();

    invitation.status = "ACCEPTED";
    invitation.acceptedAt = new Date();

    await invitation.save();

    const jwt = signToken(
      user._id.toString(),
      user.firmId.toString(),
      user.userName
    );

    res.cookie("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });

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
  try {
    const members = await User.find({
      firmId: req.user?.firmId,
      // _id: { $ne: req.user?.id },
    })
      .select("-password -verificationToken")
      .lean();

    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};
