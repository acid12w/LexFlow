import express from "express";
import {
  login,
  createUsers,
  logout,
  getFirmInvitation,
  getAssignees,
  updateUser,
  verifyEmail,
  getTeamMember,
  deleteUser,
  joinFirm,
  createFirmAccount,
  getUser,
  getFirmMembers,
} from "#controllers/userController.js";
import { protect } from "#middlewares /authMiddleware.js";

const router = express.Router();

router.post("/sign-in", login);
router.post("/logout", protect, logout);
router.post("/sign-up", createUsers);
router.get("/currentUser", protect, getUser);
router.get("/teamMember", protect, getTeamMember);
router.get("/firmInvitation/:id", getFirmInvitation);
router.get("/firmMembers", protect, getFirmMembers);
// router.post("/assignees", protect, getAssignees);
router.post("/verify-email", verifyEmail);
router.delete("/removeTeamMember/:id", protect, deleteUser);
router.patch("/update-user", protect, updateUser);
router.patch("/join-firm/:token", joinFirm);
router.post("/create-firm", protect, createFirmAccount);

export default router;
