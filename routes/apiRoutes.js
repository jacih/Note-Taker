const router = require('express').Router();
const saved = require('../util/helpers');

router.get('/notes', function (req, res) {
  saved.getNotes()
    .then(data => res.json(data))
    .catch(err => res.status(500).json(err));
});

router.post('/notes', (req, res) => {
  saved.saveNote(req.body)
    .then((data) => res.json(data))
    .catch(err => res.status(500).json(err));
});

router.delete('/notes/:id', function (req, res) {
  saved.deleteNote(req.params.id)
    .then(() => res.json({ ok: true }))
    .catch(err => res.status(500).json(err));
});

module.exports = router;