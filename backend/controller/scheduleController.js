import { schedule } from "../models/scheduleModel.js";

export const createSchedule = async (req, res) => {
  try {
    console.log(req.body);
    const newschedule = await schedule.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        schedule: newschedule,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
