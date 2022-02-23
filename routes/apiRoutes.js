// Dependencies
const router = require('express').Router();
const saved = require('../db/saved');

router.get('/notes', function (req, res) {
  saved.getNotes()
    .then(notes => res.json(notes))
    .catch(err => res.status(500).json(err));
});

router.post('/notes', (req, res) => {
  saved.addNote(req.body)
    .then((note) => res.json(note))
    .catch(err => res.status(500).json(err));
});

router.delete('/notes/:id', function (req, res) {
  saved.deleteNote(req.params.id)
    .then(() => res.json({ ok: true }))
    .catch(err => res.status(500).json(err));
});

module.exports = router;