const fs = require('fs');
const express = require('express');
const path = require('path');

const uuid = require('./util/uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//homepage route; takes user back to homepage
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

//note page route; takes user to notes page
app.get('/notes', (req,res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//note page route; reads json data in db.json file
app.get('/api/notes', (req,res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'));
})

// note page route; creates new note object inside db.json file
app.post('/api/notes', (req,res) => {
  // access db.json file
  fs.readFile(path.join(__dirname, '/db/db.json'), utf8, (err,res) => {
    if (err) {
      console.log(err);
    }
    //creates an array of notes; converted from json strings to javascript objects
    const notes = JSON.parse(res);
    //instantiate new object based on user input
    const Note = {
      id: uuid(),
      title: req.body.title,
      text: req.body.text
    };
    notes.push(Note);
    //update db.json file; convert data back to json string
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Note added successfully');
      }
    });
  });
});

//note page route; searches by id for note and deletes from db if it matches user request
app.delete('/api/notes/:id', function(req,res) {

  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err,res) => {
    if (err) {
      console.log(err);
    }
    const notes = JSON.parse(res);
    res.json(notes.splice(req.params.id, 1));
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Note deleted successfully');
      }
    });
  });
});
  
app.listen(PORT, () => console.log(`App listening at ${PORT}`));
