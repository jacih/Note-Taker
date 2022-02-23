// Dependencies
const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const readNote = util.promisify(fs.readFile);
const writeNote = util.promisify(fs.writeFile);

class Save {
  
  write(note) {
    return writeNote('db/db.json', JSON.stringify(note));
  }
  read() {
    return readNote('db/db.json', 'utf8');
  }
  getNotes() {
    return this.read().then(notes => {
      let parsed;
      try {
        parsed = [].concat(JSON.parse(notes));
      } catch (err) {
        parsed = [];
      }
    return parsed;
    });
  }
  addNote(note) {
    const { title, text } = note;
    if (!title || !text) {
      throw new Error('Cannot add a note with no text or title');
    }
  const newNote = { title, text, id: uuidv4() };
  return this.getNotes()
    .then(notes => [...notes, newNote])
    .then(updated => this.write(updated))
    .then(() => newNote);
  }

  deleteNote(id) {
    return this.getNotes()
      .then(notes => notes.filter(note => note.id !== id))
      .then(filtered => this.write(filtered));
  }
}

module.exports = new Save();
