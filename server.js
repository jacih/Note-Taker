const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./util/uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//homepage Routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//notes page Routes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const savedNotes = JSON.parse(data);
      const newNote = req.body;
      newNote.id = uuid();
      savedNotes.push(newNote);
      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(savedNotes), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('New note added successfully');
        }
      });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const savedNotes = JSON.parse(data);
      const noteId = req.params.id;
      const newNotes = savedNotes.filter(note => note.id !== noteId);
      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNotes), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Note deleted successfully');
        }
      });
    }
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
