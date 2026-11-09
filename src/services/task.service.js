import {
  changeStatusTask,
  findTaskById,
  findTasks,
  findTasksByAssigneeId,
  insertTask,
} from "../models/task.model.js";
import { findUserById } from "../models/user.model.js";
import { assertTaskStatusUpdateAllowed } from "../utils/taskStatusPolicy.js";
import { validateTaskInput } from "../utils/taskValidation.js";
export const createTask = async ({
  title,
  description,
  location,
  priority,
  assigned_to,
  created_by,
  due_date,
}) => {
  const validatedInput = validateTaskInput({
    title,
    location,
    assigned_to,
    due_date,
    priority,
  });
  const assignee = await findUserById(validatedInput.assigned_to, false);
  if (!assignee || assignee.role !== "field_worker" || assignee.status !== "active") {
    const error = new Error("assigned_to must be an active field worker");
    error.status = 400;
    throw error;
  }

  const taskData = {
    title: validatedInput.title,
    description: description?.trim() || null,
    location: validatedInput.location,
    priority: validatedInput.priority,
    status: "assigned",
    due_date: validatedInput.due_date,
    assigned_to: validatedInput.assigned_to,
    created_by,
  };

  const task = await insertTask(taskData);
  return task;
};
export const getAllTasks = async () => {
  const tasks = await findTasks();
  return tasks;
};
export const getTasksAssignedToUser = async (userId) => {
  const tasks = await findTasksByAssigneeId(userId);
  return tasks;
};
export const getTaskById = async (id, userId, userRole) => {
  const task = await findTaskById(id);

  if (
    !task ||
    (userRole === "field_worker" &&
      Number(task.assigned_to) !== Number(userId))
  ) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }
  return task;
};
export const updateStatusTask = async (status, id, userId, userRole) => {
  const task = await findTaskById(id);

  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  assertTaskStatusUpdateAllowed(task, status, userId, userRole);

  const updatedTask = await changeStatusTask(status, id);
  return updatedTask;
};
