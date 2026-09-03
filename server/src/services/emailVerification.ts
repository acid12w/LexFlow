import crypto from "crypto";

const verificationToken = crypto.randomBytes(32).toString("hex");
