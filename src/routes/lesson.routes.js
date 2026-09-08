const express = require('express');
const lessonController = require('../controllers/lesson.controller');

const router = express.Router();
const languageRouter = express.Router();

languageRouter.get('/', lessonController.getLanguages);

router.get('/language/:code', lessonController.getLessonsByLanguage);
router.get('/:id/quiz', lessonController.getQuiz);
router.get('/:id', lessonController.getLesson);

module.exports = { languages: languageRouter, lessons: router };
