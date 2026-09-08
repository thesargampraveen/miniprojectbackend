const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    completedLessons: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], default: [] },
    quizResults: { type: [quizResultSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
