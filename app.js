const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
const AIMLInterpreter = require('aiml-high');
const mongoose = require('mongoose');
const History = require('./models/History'); 

const app = express();
const port = process.env.PORT || 3000;

// Configura body-parser per gestire i dati del form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static('public'));

// Connetti a MongoDB
mongoose.connect('mongodb://localhost:27017/novagraph', {}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Definisci la route per la pagina iniziale
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

let number = 1;
// Definisci la route per gestire la richiesta del form
app.post("/", async (req, res) => {
  let query = req.body.query;
  console.log('Received query:', query);

  try {
    const aimlInterpreter = new AIMLInterpreter({ name: 'NovagraphV1' });
    await aimlInterpreter.loadFiles(['public/novagraphABCv2.0.aiml.xml']);

    let untranslatedAnswer = await new Promise((resolve, reject) => {
      aimlInterpreter.findAnswer(query, (answer, wildCardArray, input) => {
        resolve(answer || "I'm sorry, I don't know the answer");
      });
    });

    const response = await axios.post('https://aa0f-35-240-195-161.ngrok-free.app/submit', { input: query });
    const flaskResponse = response.data;

    let translatedAnswer = await new Promise((resolve, reject) => {
      aimlInterpreter.findAnswer(flaskResponse.input_received, (answer, wildCardArray, input) => {
        resolve(answer || "I'm sorry, I don't know the answer");
      });
    });

    const historyEntry = new History({
      questionNumber: number++,
      query: query,
      untranslatedAnswer: untranslatedAnswer,
      translatedAnswer: translatedAnswer
    });

    console.log('UntranslatedAnswer:', untranslatedAnswer, '\nTranslatedAnswer:', translatedAnswer);

    const savedEntry = await historyEntry.save();

    res.json({
      id: savedEntry._id, // Include the ID of the new entry
      questionNumber: number,
      query: query,
      untranslatedAnswer: untranslatedAnswer,
      translatedAnswer: translatedAnswer
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send("Error processing request");
  }
});

// Route per salvare i voti
app.post("/save-vote", async (req, res) => {
  const { id, responseType, vote } = req.body;

  try {
    const entry = await History.findById(id);
    if (entry) {
      if (responseType === 'untranslated') {
        entry.voteUntranslated = vote;
      } else if (responseType === 'translated') {
        entry.voteTranslated = vote;
      } else if (responseType === 'expert-untranslated') {
        entry.expertVoteUntranslated = vote;
      } else if (responseType === 'expert-translated') {
        entry.expertVoteTranslated = vote;
      }

      await entry.save();
      res.json({ success: true });
      console.log('Vote saved:', entry.voteUntranslated, entry.voteTranslated, entry.expertVoteUntranslated, entry.expertVoteTranslated);
    } else {
      res.status(404).send('Entry not found');
    }
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).send('Error saving vote');
  }
});

// Middleware per gestire gli errori
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).send("Error processing your request");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
