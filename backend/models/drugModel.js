import mongoose from "mongoose";

const drugSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "drug must belog to a particular user"],
  },
  drugName: {
    type: String,
    required: [true, "Please specify drug name"],
  },
  nickname: {
    type: String,
  },
  companyName: {
    type: String,
  },
  formOfDrsuug: {
    type: String,
  },
  typeOfDrug: {
    type: String,
    eunm: {
      values: ["over-the-counter", "prescription", "suppliment"],
      message: "Type of drug is only from the three options",
    },
  },
  //   This is embedded data
  takein: {
    startDate: {
      type: Date,
      required: [true, "Please specify staDate to take medicine"],
    },
    endDate: {
      type: Date,
      required: [true, "Please specify end date to take medicine"],
    },
    frequencyDay: {
      type: Number,
      required: [
        true,
        "Please specify frequency of taking medicine on daily basis",
      ],
    },
    frequencyWithinADay: {
      type: Number,
    },
    doze_1: {
      type: String,
    },
    doze_2: {
      type: String,
    },
    doze_3: {
      type: String,
    },
  },
  latestTakenDate: {
    type: Date,
  },
  amount: {
    type: Number,
    required: [true, "Please specify amount of drug per take"],
  },
  unit: {
    type: String,
    required: [true, "Please specify unit"],
    enum: {
      values: ["piece", "mg", "ml", "unit", "does", "teaspoon", "pill"],
      message: "Unit is only from the three options",
    },
  },
  strength: {
    type: Number,
  },
  strengthUnit: {
    type: String,
    enum: {
      values: ["mg", "mcg", "IU", "g"],
    },
  },
  remaining: {
    type: Number,
  },
  shortageLimit: {
    type: Number,
  },
  description: {
    type: String,
  },
  token: {
    type: String,
  },
  status: {
    type: String,
    required: [true, "Please provide the current status"],
    enum: {
      values: ["taking", "stop taking", "complete"],
      message: "Status is only from the two options",
    },
  },
});

export const drug = mongoose.model("drug", drugSchema);
