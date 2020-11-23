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

    get JSON() {
        return JSON.stringify({
            key: this.key,
            title: this.title,
            body: this.body
        })
    };

    static fromJSON(json) {
        const data = JSON.parse(json);
        if (typeof data !== 'object'
            || !data.hasOwnProperty('key')
            || !data.hasOwnProperty('title')
            || !data.hasOwnProperty('body')
            || typeof data.key !== 'string'
            || typeof data.title !== 'string'
            || typeof data.body !== 'string') {
            throw new Error(`Not a Note: ${json}`);
        }
        const note = new Note(data.key, data.title, data.body);
        return note;
    }
}

class AbstractNotesStore {
    async close() { }
    async update(key, title, body) { }
    async create(key, title, body) { }
    async read(key) { }
    async destroy(key) { }
    async keylist() { }
    async count() { }
}

module.exports = {
    Note,
    AbstractNotesStore
}