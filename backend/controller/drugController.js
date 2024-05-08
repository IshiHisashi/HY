import { drug } from "../models/drugModel.js";

export const createDrug = async (req, res) => {
  try {
    const authToken = req.headers["f26d98afbae288b56f0511851b6d3c9757399067"];
    console.log("Authorization Token:", authToken);
    const newDrug = await drug.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        drug: newDrug,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const readDrugs = async (req, res) => {
  try {
    console.log(req.params);
    let filter = {};
    if (req.params.userId) {
      filter = { userId: req.params.userId };
    }
    const drugs = await drug.find(filter);
    res.status(201).json({
      status: "success",
      numDrugs: drugs.length,
      data: {
        drugs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const readDrug = async (req, res) => {
  try {
    const aDrug = await drug.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        aDrug,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

export const updateDrug = async (req, res) => {
  try {
    const result = await drug.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ message: "drug not found" });
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

export const deleteDrug = async (req, res) => {
  try {
    const result = await drug.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Drug not found" });
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

export const readShortageDrugs = async (req, res) => {
  try {
    let filter = {};
    if (req.params.userId) {
      // console.log(req.params.userId);
      filter = {
        userId: req.params.userId,
        $expr: { $lt: ["$remaining", "$shortageLimit"] },
      };
    }
    const shortageDrugs = await drug.find(filter);
    res.status(201).json({
      status: "success",
      numDrugs: shortageDrugs.length,
      data: {
        shortageDrugs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
