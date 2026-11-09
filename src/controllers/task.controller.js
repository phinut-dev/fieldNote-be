import {
  createTask,
  getAllTasks,
  getTaskById,
  getTasksAssignedToUser,
  updateStatusTask,
} from "../services/task.service.js";
import { sendResponse } from "../utils/response.js";

export const createTaskController = async (req, res, next) => {
  try {
    const task = await createTask({
      ...req.body,
      created_by: req.user.id,
    });

    return sendResponse(res, 201, "Task created successfully", task);
  } catch (err) {
    next(err);
  }
};
export const getAllTasksController = async (req, res, next) => {
  try {
    const tasks = await getAllTasks();
    return sendResponse(res, 200, "Tasks retrieved successfully", tasks);
  } catch (err) {
    next(err);
  }
};
export const getTasksByUserController = async (req, res, next) => {
  try {
    const tasks = await getTasksAssignedToUser(req.user.id);
    return sendResponse(res, 200, "Tasks retrieved successfully", tasks);
  } catch (err) {
    next(err);
  }
};
export const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await getTaskById(
      req.params.id,
      req.user.id,
      req.user.role,
    );
    return sendResponse(res, 200, "Task retrieved successfully", task);
  } catch (err) {
    next(err);
  }
};
export const updateStatusTaskController = async (req, res, next) => {
  try {
    const task = await updateStatusTask(
      req.body.status,
      req.params.id,
      req.user.id,
      req.user.role,
    );
    return sendResponse(res, 200, "Task status updated successfully", task);
  } catch (err) {
    next(err);
  }
};
export const updateTaskController = (req, res) => {
  return sendResponse(res, 501, "Task update is not implemented yet");
};
