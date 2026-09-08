import bcrypt from "bcrypt";
import {
  addUser,
  changemMyPass,
  changeStatus,
  findAllUsers,
  findUserByEmail,
  findUserById,
  findWorkerAssignable,
} from "../models/user.model.js";

export const getUsers = async () => {
  const users = await findAllUsers();
  return users;
};
export const getUserByEmail = async (email) => {
  const user = await findUserByEmail(email);
  return user;
};
export const getUserById = async (id) => {
  const user = await findUserById(id, false);
  return user;
};
export const getAssignableWorkers = async () => {
  const workers = await findWorkerAssignable();
  return workers;
};
export const createUser = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    const err = new Error("Missing required fields");
    err.status = 400;
    throw err;
  }
  const hashPass = await bcrypt.hash(password, 10);
  const allowedRoles = ["admin", "supervisor", "field_worker"];
  if (!allowedRoles.includes(role)) {
    const err = new Error("Invalid user role");
    err.status = 400;
    throw err;
  }
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const err = new Error("User with this email already exists");
    err.status = 409;
    throw err;
  }
  const user = { name, email, password: hashPass, role };
  console.log(user);
  const newUser = await addUser(user);
  return { id: newUser.insertId, name, email, role };
};
export const updatePass = async (id, currentPass, newPass) => {
  const user = await findUserById(id, true);
  console.log(user, "userl");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  const isMatch = await bcrypt.compare(currentPass, user.password);
  if (!isMatch) {
    const err = new Error("Password is incorrect");
    err.status = 400;
    throw err;
  }
  const isSamePassword = await bcrypt.compare(newPass, user.password);
  if (isSamePassword) {
    const err = new Error(
      "New password cannot be the same as the old password",
    );
    err.status = 400;
    throw err;
  }
  const hashPass = await bcrypt.hash(newPass, 10);
  console.log(hashPass);
  const updatedUser = await changemMyPass(id, hashPass);
  return updatedUser;
};
export const updateUserStatus = async (id, status) => {
  const user = await findUserById(id, false);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  const allowedStatuses = ["active", "inactive"];
  if (!allowedStatuses.includes(status)) {
    const err = new Error("Invalid user status");
    err.status = 400;
    throw err;
  }
  const updatedUser = await changeStatus(id, status);
  return updatedUser;
};
