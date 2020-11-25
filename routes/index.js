const express = require('express');
const router = express.Router();
const { notesStore } = require('../models/notes-memory');
const debug = require('debug')('notes:debug');
const debugError = require('debug')('notes:error');


/* GET home page. */
router.get('/', async (req, res, next) => {

  try {
    const keylist = await notesStore.keylist();
    // 返回多个Promises
    const keyPromises = keylist.map(key => {
      return notesStore.read(key);
    })
    // 调用Promise.all来创建一个总的Promise。当全部promise都resolve时它才resolve；任何一个reject了它就会reject
    const notelist = await Promise.all(keyPromises);
    res.render('index', {
      title: 'Notes',
      notelist: notelist,
      // 如果通过了passport验证的，则额外传递user信息给view
      user: req.user ? req.user : undefined
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
