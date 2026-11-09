import { Router } from "express";
import {
  createTaskController,
  getAllTasksController,
  getTaskByIdController,
  getTasksByUserController,
  updateStatusTaskController,
  updateTaskController,
} from "../controllers/task.controller.js";
import {
  authenticate,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, authorizeRoles("admin"), getAllTasksController);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "supervisor"),
  createTaskController,
);
router.get(
  "/user",
  authenticate,
  getTasksByUserController,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "field_worker"),
  getTaskByIdController,
);
router.put("/:id", authenticate, authorizeRoles("admin"), updateTaskController);
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("admin", "supervisor", "field_worker"),
  updateStatusTaskController,
);

export default router;
