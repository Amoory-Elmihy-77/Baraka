const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    day: { type: String },
    time: { type: String },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseName: { type: String, required: true },
    schedule: [scheduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);


