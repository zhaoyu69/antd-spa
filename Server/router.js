'use strict';

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const qiniuRouter = require('./routes/qiniu');

module.exports = app => {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/qiniu', qiniuRouter);
};