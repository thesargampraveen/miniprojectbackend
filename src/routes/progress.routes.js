const express = require('express');
const requireAuth = require('../middleware/auth.middleware');
const progressController = require('../controllers/progress.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/', progressController.getMyProgress);
router.post('/lessons/:lessonId/complete', progressController.completeLesson);
router.post('/quiz', progressController.saveQuizResult);

module.exports = router;
