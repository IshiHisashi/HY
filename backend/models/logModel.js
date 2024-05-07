import mongoose from "mongoose";

const logSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "log must belog to a particular user"],
  },
  drugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "drug",
    required: [true, "log must belog to a particular drug"],
  },
  plannedDateTime: {
    type: Date,
  },
  takenDateTime: {
    type: Date,
  },
});

export const Log = mongoose.model("log", logSchema);
