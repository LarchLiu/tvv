/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(logger('combined'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/:ver/:action', (req, res, next) => {
  const { ver, action } = req.params;
  const actionPath = `/src/api/${ver}/${action}`;

  const realPath = path.join(__dirname, actionPath);
  fs.access(`${realPath}.js`, fs.constants.R_OK, (err) => {
    if (err) {
      const e = new Error();
      e.code = 'ER_API_PATH_NOT_MATCH';
      res.status(404);
      res.json({ err: e });
      // next(err);
    } else {
      if (req.app.get('env') === 'development') {
        delete require.cache[require.resolve(realPath)];
      }
      const Action = require(realPath);
      Action.execute(req, res, next);
    }
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.code = 'Not Found';
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ err });
  // res.render('error');
});

module.exports = app;
