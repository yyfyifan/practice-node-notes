const { Note, AbstractNotesStore } = require('./Notes');

const notes = [];

class InMemoryNotesStore extends AbstractNotesStore {
    async close() {}
    
    async update(key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    }
    
    async create(key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    }
    
    async read(key) {
        if (notes[key]) {
            return notes[key];
        }
        throw new Error(`Note ${key} does not exist`);
    }
    async destroy(key) {
        if (notes[key]) {
            delete notes[key];
            return;
        }
        throw new Error(`Note ${key} does not exist`);
    }
    
    async keylist() {
        return Object.keys(notes);
    }

    async count() {
        return notes.length;
    }
}

module.exports = { 
    notesStore: new InMemoryNotesStore()
};