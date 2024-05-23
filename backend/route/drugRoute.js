import express from "express";
import * as drugController from "../controller/drugController.js";
import logRoute from "../route/logRoute.js";
import * as logController from "../controller/logController.js";
import * as authController from "../controller/authController.js";

const router = express.Router({ mergeParams: true });

// for nested routes (logs under specific drug)
router.use("/:drugId/logs", logRoute);

router.post("/", drugController.createDrug);
router.get("/", drugController.readDrugs);
router.get(
  "/shortage",
  //
  drugController.readShortageDrugs
);
router.get("/:id", drugController.readDrug);
router.patch("/:id", drugController.updateDrug);
router.delete("/:id", drugController.deleteDrug);

export default router;
