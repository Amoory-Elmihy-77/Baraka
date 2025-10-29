const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    prayerTime: {
      type: String,
      enum: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'important_urgent',
        'important_not_urgent',
        'not_important_urgent',
        'not_important_not_urgent',
      ],
      required: true,
    },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailyTask', dailyTaskSchema);


