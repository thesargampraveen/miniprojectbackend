const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    term: { type: String, required: true }, // the word/letter in the target language
    translit: { type: String, required: true }, // pronunciation in Roman script
    meaning: { type: String, required: true }, // meaning (English for hi/mr, Hindi for en)
    example: { type: String, default: '' }, // example sentence / usage
  },
  { _id: false }
);

const lessonSchema = new mongoose.Schema(
  {
    language: { type: String, required: true, enum: ['hi', 'mr', 'en'], index: true },
    category: { type: String, required: true, enum: ['alphabet', 'words', 'phrases'] },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    items: { type: [itemSchema], default: [] },
  },
  { timestamps: true }
);

lessonSchema.virtual('itemCount').get(function () {
  return Array.isArray(this.items) ? this.items.length : 0;
});

lessonSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Lesson', lessonSchema);
