import { login } from "../services/auth.service.js";
import { sendResponse } from "../utils/response.js";

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = { email, password };
    const result = await login(data);
    return sendResponse(res, 200, "Login successful", result);
  } catch (err) {
    next(err);
  }
};
