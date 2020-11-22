const express = require('express');
const router = express.Router();
const { notesStore } = require('../models/notes-memory');



/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const keylist = await notesStore.keylist();
    // 返回多个Promises
    const keyPromises = keylist.map(key => {
      return notesStore.read(key);
    })
    // 调用Promise.all来创建一个总的Promise。当全部promise都resolve时它才resolve；任何一个reject了它就会reject
    console.log(keylist);
    const notelist = await Promise.all(keyPromises);
    res.render('index', {title: 'Notes', notelist: notelist});
  } catch(err) {
    next(err);
  }
});

module.exports = router;
