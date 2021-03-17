// Node server
var express = require('express');
var app = express();
const pwd = require('path');


app.get('/', function(req, res) {
    res.sendFile(pwd.join(__dirname + "/calevents/src/index.js"));
});

var server = app.listen(8000);

module.exports = app