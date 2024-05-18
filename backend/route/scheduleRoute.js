import express from "express";
import * as scheduleController from "../controller/scheduleController.js";

const router = express.Router();
router.get("/:id", scheduleController.readSchedule);
router.post("/", scheduleController.createSchedule);
router.patch("/:id", scheduleController.updateSchedule);

export default router;
