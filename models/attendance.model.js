const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AttendanceSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      // defaultValue: Date.now()
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
