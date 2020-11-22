// const _note_key = Symbol('key');
// const _note_title = Symbol('title');
// const _note_body = Symbol('body');

class Note {
    constructor(key, title, body) {
        // this[_note_key] = key;
        // this[_note_title] = title;
        // this[_note_body] = body;
        this.key = key;
        this.title = title;
        this.body = body;
    }
}

class AbstractNotesStore {
    async close() {}
    async update(key, title, body) {}
    async create(key, title, body) {}
    async read(key) {}
    async destroy(key) {}
    async keylist() {}
    async count() {}
}

module.exports = {
    Note,
    AbstractNotesStore
}