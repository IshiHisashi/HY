import express from "express";
import * as scheduleController from "../controller/scheduleController.js";

const router = express.Router();
router.post("/", scheduleController.createSchedule);

export default router;
