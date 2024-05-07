import express from "express";
import * as logController from "../controller/logController.js";

const router = express.Router({ mergeParams: true });
router.post("/", logController.createLog);
router.get("/", logController.readLogs);
router.get("/underuser", logController.readLogsUser);
router.get("/untaken", logController.readLogsUntaken);
router.get("/:id", logController.readLog);
router.patch("/:id", logController.updateLog);
router.delete("/:id", logController.deleteLog);
router.delete("/untaken", logController.deleteLogsUntaken);
export default router;
