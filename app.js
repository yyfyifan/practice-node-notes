const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const hbs = require('hbs');

const indexRouter = require('./routes/index');
const notesRouter  = require('./routes/notes');
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));

// 配置log，并且使用了log rotation
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
  stream: process.env.REQUEST_LOG_FILE ? 
    // 让rfs来管理文件流，进行rotation
    rfs.createStream(process.env.REQUEST_LOG_FILE, {
      size: '10M',  // 每10M进行一次rotation
      interval: '1d',  // 每天进行
      compress: 'gzip' 
    }) : process.stdout
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// public files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets/vendor/bootstrap',express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use('/assets/vendor/popper.js',express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd')));
app.use('/assets/vendor/jquery',express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/assets/vendor/feather-icons',express.static(path.join(__dirname, 'node_modules', 'feather-icons', 'dist')));


// routers
app.use('/', indexRouter);
app.use('/notes', notesRouter);


// 修改了处理404的代码。创建一个新的Error对象并且设置status code
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status ?? 500);
  res.render('error');
});

module.exports = app;
