const router = require('express').Router();
const { notesStore } = require('../models/notes-memory');

router.get('/add', (req, res, next) => {
    res.render('noteedit', {
        title: "Add a Note",
        docreate: true,
        notekey: "",
        note: undefined
    });
});

router.get('/view', async (req, res, next) => {
    try {
        let note = await notesStore.read(req.query.key);
        res.render('noteview', {
            title: note ? note.title : "",
            notekey: req.query.key,
            note: note
        });
    } catch (err) {
        next(err);
    }
});

router.get('/edit', async (req, res, next) => {
    try {
        const note = await notesStore.read(req.query.key);
        res.render('noteedit', {
            title: note ? ("Edit " + note.title) : "Add a Note",
            docreate: false,
            notekey: req.query.key,
            note: note
        });
    } catch (err) {
        next(err);
    }

});

router.post('/save', async (req, res, next) => {
    console.log(req.body);
    try {
        let note;
        if (req.body.docreate === "create") {
            note = await notesStore.create(req.body.notekey, req.body.title, req.body.body);
        } else {
            note = await notesStore.update(req.body.notekey, req.body.title, req.body.body);
        }
        res.redirect('/notes/view?key=' + req.body.notekey);
        // res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.get('/destroy', async (req, res, next) => {
    try {
        const note = await notesStore.read(req.query.key);
        res.render('notedestroy', {
            title: note ? note.title : "",
            notekey: req.query.key,
            note: note
        });
    } catch (err) {
        next(err);
    }
});

router.post('/destroy', async (req, res, next) => {
    try {
        await notesStore.destroy(req.body.notekey);
        res.redirect('/');
    } catch(err) {
        next(err);
    }
});

module.exports = router;