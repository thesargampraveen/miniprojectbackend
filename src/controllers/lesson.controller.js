const Lesson = require('../models/lesson.model');
const LANGUAGES = require('../data/languages');

// GET /api/languages
async function getLanguages(req, res) {
  res.json({ languages: LANGUAGES });
}

// GET /api/lessons/language/:code
async function getLessonsByLanguage(req, res) {
  try {
    const { code } = req.params;
    if (!LANGUAGES.some((l) => l.code === code)) {
      return res.status(404).json({ message: 'Language not found' });
    }

    const lessons = await Lesson.find({ language: code }).sort({ order: 1 });
    res.json({ lessons });
  } catch (err) {
    res.status(500).json({ message: 'Could not load lessons', error: err.message });
  }
}

// GET /api/lessons/:id
async function getLesson(req, res) {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json({ lesson });
  } catch (err) {
    res.status(500).json({ message: 'Could not load the lesson', error: err.message });
  }
}

// GET /api/lessons/:id/quiz  -> auto-generates a multiple choice quiz from lesson items
async function getQuiz(req, res) {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    if (lesson.items.length < 4) {
      return res.status(400).json({ message: 'Not enough items in this lesson for a quiz' });
    }

    // Pick up to 8 random items as questions
    const questions = [...lesson.items].sort(() => Math.random() - 0.5).slice(0, 8);

    const quiz = questions.map((item) => {
      // 3 random wrong options taken from the other items of the same lesson
      const wrong = lesson.items
        .filter((i) => i.meaning !== item.meaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((i) => i.meaning);

      const options = [...wrong, item.meaning].sort(() => Math.random() - 0.5);

      return {
        term: item.term,
        translit: item.translit,
        answer: item.meaning,
        options,
      };
    });

    res.json({
      quiz: {
        lesson: lesson._id,
        title: lesson.title,
        language: lesson.language,
        questions: quiz,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Could not create the quiz', error: err.message });
  }
}

module.exports = { getLanguages, getLessonsByLanguage, getLesson, getQuiz };
