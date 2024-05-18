import { schedule } from "../models/scheduleModel.js";

export const readSchedule = async (req, res) => {
  try {
    const sch = await schedule.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        sch,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

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

export const updateSchedule = async (req, res) => {
  try {
    const result = await schedule.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ message: "schedule not found" });
    } else {
      return res.status(201).json({
        status: "success in updating",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
