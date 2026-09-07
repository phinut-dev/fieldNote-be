import { Router } from "express";
import {
  getUserByIdController,
  getUsersController,
  createUserController,
  updateUserController,
  changeMyPasswordController,
  resetUserPasswordController,
  updateUserStatusController,
  getAssignableWorkersController,
} from "../controllers/user.controller.js";
import {
  authenticate,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();
// gET uSERS
router.get("/", authenticate, authorizeRoles("admin"), getUsersController); //done
// CREATE USER
router.post("/", authenticate, authorizeRoles("admin"), createUserController); //done
//  GET ASSIGNABLE WORKERS
router.get(
  "/assignable-workers",
  authenticate,
  authorizeRoles("admin", "supervisor"),
  getAssignableWorkersController,
); //done
// CHANGE MY PASSWORD
router.patch("/me/password", authenticate, changeMyPasswordController); //done
// GET USER BY ID
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  getUserByIdController,
); //done
// UPDATE USER
router.put("/:id", authenticate, authorizeRoles("admin"), updateUserController);
// UPDATE USER STATUS
router.put(
  "/:id/status",
  authenticate,
  authorizeRoles("admin"),
  updateUserStatusController,
);
// RESET USER PASSWORD BY ADMIN
router.post(
  "/:id/password",
  authenticate,
  authorizeRoles("admin"),
  resetUserPasswordController,
);

export default router;
