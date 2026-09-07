import { Router } from "express";
import profileRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import reportRoute from "./report.route.js";
import taskRoute from "./task.route.js";

const router = Router();
router.use("/auth", authRoute);
router.use("/users", profileRoute);
router.use("/report", reportRoute);
router.use("/task", taskRoute);

export default router;
