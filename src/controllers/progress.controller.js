const Progress = require('../models/progress.model');
require('../models/lesson.model'); // registers the Lesson model so populate() can use it

// GET /api/progress - progress of the logged in user
async function getMyProgress(req, res) {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      progress = await Progress.create({ user: req.user.id });
    }

    // guard against old documents where the arrays are missing
    if (!Array.isArray(progress.completedLessons)) progress.completedLessons = [];
    if (!Array.isArray(progress.quizResults)) progress.quizResults = [];

    await progress.populate('completedLessons', 'title language category');

    res.json({ progress });
  } catch (err) {
    res.status(500).json({ message: 'Could not load progress', error: err.message });
  }
}

// POST /api/progress/lessons/:lessonId/complete
async function completeLesson(req, res) {
  try {
    const { lessonId } = req.params;

    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { completedLessons: lessonId } },
      { new: true, upsert: true }
    );

    res.json({ message: 'Lesson completed! 🎉', progress });
  } catch (err) {
    res.status(500).json({ message: 'Could not save progress', error: err.message });
  }
}

// POST /api/progress/quiz  body: { lessonId, score, total }
async function saveQuizResult(req, res) {
  try {
    const { lessonId, score, total } = req.body;
    if (score == null || total == null || !lessonId) {
      return res.status(400).json({ message: 'lessonId, score and total are required' });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id },
      { $push: { quizResults: { lesson: lessonId, score, total } } },
      { new: true, upsert: true }
    );

    res.json({ message: 'Quiz result saved! 🎯', progress });
  } catch (err) {
    res.status(500).json({ message: 'Could not save quiz result', error: err.message });
  }
}

module.exports = { getMyProgress, completeLesson, saveQuizResult };
