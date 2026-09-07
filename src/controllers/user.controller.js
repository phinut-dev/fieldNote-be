import {
  createUser,
  getAssignableWorkers,
  getUserById,
  getUsers,
  updatePass,
} from "../services/user.service.js";
import { sendResponse } from "../utils/response.js";
export const getUsersController = async (req, res, next) => {
  try {
    const users = await getUsers();
    return sendResponse(res, 200, "Users retrieved successfully", users);
  } catch (err) {
    next(err);
  }
};
export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }
    return sendResponse(res, 200, "User retrieved successfully", user);
  } catch (err) {
    next(err);
  }
};
export const getAssignableWorkersController = async (req, res, next) => {
  try {
    const workers = await getAssignableWorkers();
    return sendResponse(
      res,
      200,
      "Assignable workers retrieved successfully",
      workers,
    );
  } catch (err) {
    next(err);
  }
};
export const createUserController = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await createUser(req.body);
    return sendResponse(res, 201, "User created successfully", user);
  } catch (err) {
    next(err);
  }
};
export const changeMyPasswordController = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { currentPass, newPass } = req.body;
    const updatedUser = await updatePass(id, currentPass, newPass);
    return sendResponse(res, 200, "Password updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};
export const updateUserStatusController = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const updateUserController = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const resetUserPasswordController = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
