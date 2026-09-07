import bcrypt from "bcrypt";
import { findUserByEmail } from "../models/user.model.js";
import { genAccessToken } from "../utils/token.js";

export const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Please input email and password");
    error.status = 400;
    throw error;
  }
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error("Email or password incorrect");
    err.status = 401;
    throw err;
  }
  const passMatches = await bcrypt.compare(password, user.password);

  if (!passMatches) {
    const err = new Error("Email or password incorrect");
    err.status = 401;
    throw err;
  }
  if (user.status !== "active") {
    const err = new Error("User is not active");
    err.status = 403;
    throw err;
  }
  const accessToken = genAccessToken(user);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};
