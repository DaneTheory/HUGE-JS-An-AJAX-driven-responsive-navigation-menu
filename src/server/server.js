var express = require('express');
var logger = require('morgan');
var path = require('path');
var api = require('./api/api');
var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/api', api);

module.exports = app;
