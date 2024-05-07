import { Log } from "../models/logModel.js";

export const createLog = async (req, res) => {
  try {
    console.log(req.body);
    const newLog = await Log.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        log: newLog,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const readLogs = async (req, res) => {
  try {
    let filter = {};
    if (req.params.drugId) {
      console.log(req.params.drugId);
      filter = { drugId: req.params.drugId };
    }
    const logs = await Log.find(filter).populate("drugId");
    res.status(201).json({
      status: "success",
      numLogs: logs.length,
      data: {
        logs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const readLogsUser = async (req, res) => {
  try {
    let filter = {};
    if (req.params.userId) {
      console.log(req.params.userId);
      filter = { userId: req.params.userId };
    }
    const logs = await Log.find(filter).populate("drugId");
    res.status(201).json({
      status: "success",
      numLogs: logs.length,
      data: {
        logs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const readLogsUntaken = async (req, res) => {
  try {
    let filter = {};
    if (req.params.drugId) {
      console.log(req.params.drugId);
      filter = { drugId: req.params.drugId, takenDateTime: null };
    }
    const logs = await Log.find(filter).populate("drugId");
    res.status(201).json({
      status: "success",
      numLogs: logs.length,
      data: {
        logs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const readLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        log,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const updateLog = async (req, res) => {
  try {
    const result = await Log.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Log not found" });
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

export const deleteLog = async (req, res) => {
  try {
    const result = await Log.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Log not found" });
    } else {
      return res.status(201).json({
        status: "success in deleting",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteLogsUntaken = async (req, res) => {
  try {
    let filter = {};
    if (req.params.drugId) {
      console.log(req.params.drugId);
      filter = { drugId: req.params.drugId, takenDateTime: null };
    }
    const result = await Log.DeleteMany(filter);
    if (!result) {
      return res.status(404).json({ message: "Log not found" });
    } else {
      return res.status(201).json({
        status: "success in deleting",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
