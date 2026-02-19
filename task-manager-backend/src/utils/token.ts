import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "reaction123";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshreaction123";

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};
