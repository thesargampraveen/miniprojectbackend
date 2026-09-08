const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const lessonRoutes = require('./routes/lesson.routes');
const progressRoutes = require('./routes/progress.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Bhasha API is running 🎉' });
});

app.use('/api/auth', authRoutes);
app.use('/api/languages', lessonRoutes.languages);
app.use('/api/lessons', lessonRoutes.lessons);
app.use('/api/progress', progressRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
