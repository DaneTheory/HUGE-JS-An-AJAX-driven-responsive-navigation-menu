var express = require('express');
var logger = require('morgan');
var path = require('path');
var app = express();
var router = express.Router();
var jsonServer = require('json-server');
var server = jsonServer.create();
var middlewares = jsonServer.defaults();
var apiRouter = jsonServer.router('nav.json');
var port = process.env.PORT || 3001;


app.use(express.static(path.join(__dirname, '..', 'client'), {index: 'index.html'}));

app.use(function(req, res, next) {
  res.status(404).send('404 Page Not Found');
});

app.use(function(err, req, res, next) {
  res.sendStatus(err.status || 500);
});

server.use(middlewares);
app.use(logger('dev'));

server.use(apiRouter);
app.use(router);

server.listen(port);
console.log('HUGE API Server is running on localhost:' + port);

module.exports = app;
