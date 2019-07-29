'use strict';

const indexRouter = require('./routes/index');
const users = require('./routes/users');
const qiniu = require('./routes/qiniu');
const oauth = require('./routes/oauth');

module.exports = app => {
    app.use('/', indexRouter);
    app.use('/users', users);
    app.use('/qiniu', qiniu);
    app.use('/oauth', oauth);
};