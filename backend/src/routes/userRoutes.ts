import express from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/preferences", authMiddleware, userController.updatePreferences);
router.get("/profile", authMiddleware, userController.getProfile);
router.get("/getallalerts", authMiddleware, userController.getallAlerts);

export default router;
