const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  query: { type: String, required: true },
  untranslatedAnswer: { type: String, required: true },
  translatedAnswer: { type: String, required: true },
  voteUntranslated: { type: Number, default: null },
  voteTranslated: { type: Number, default: null },
  expertVoteUntranslated: { type: Number, default: null },
  expertVoteTranslated: { type: Number, default: null }, 
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
