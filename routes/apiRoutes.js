const router = require('express').Router();
const uuid = require('../util/uuid');
const { readFromFile, readAndAppend, writeToFile } = require('../util/helpers');

router.get('/notes', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

router.post('/', (req, res) => {
  console.log(req.body);
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      id: uuid(),
      title,
      text,
    };

  readAndAppend(newNote, './db/db.json');
  res.json('Note added successfully');
  } else {
    res.error('Error in adding note');
  }
});

router.delete(`/router/:id`, (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);  
      writeToFile('./db/db.json', result)
      res.json(`item ${noteId} has been deleted`);
    });
});

module.exports = router;