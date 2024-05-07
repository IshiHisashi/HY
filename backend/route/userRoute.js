import express from "express";
import * as userController from "../controller/userController.js";
import * as authController from "../controller/authController.js";
import drugRoute from "../route/drugRoute.js";
import logRoute from "../route/logRoute.js";

const router = express.Router();

// for Auth
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/loggedinuser", authController.user);
router.delete("/revoke_token", authController.revokeToken);

// for nested routes (logs under specific drug)
router.use("/:userId/drugs", drugRoute);
router.use("/:userId/logs", logRoute);

router.post("/", userController.createUser);
router.get("/", userController.readUsers);
router.get("/:id", userController.readUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
export default router;
