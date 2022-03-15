const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils.js');

const uuid = require('./helpers/uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET ROUTE for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//GET ROUTE for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//notes page Routes
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data)))
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      readAndAppend(newNote, './db/db.json');
      res.json('Note added successfully 🚀`')
    } else {
      console.error(err);
    }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json').then((data) => 
    JSON.parse(data)).then((json) => {
      const newNotes = json.filter((note => note.id !== noteId));
      writeToFile('./db/db.json', newNotes);
      res.json('The note has been deleted');
    })
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
