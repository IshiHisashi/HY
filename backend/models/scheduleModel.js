import mongoose from "mongoose";

const scheduleSchema = mongoose.Schema({
  expireAt: {
    type: Date,
    expires: 10,
  },
});

export const schedule = mongoose.model("schedule", scheduleSchema);
