// Node server
var mysql = require('./calevents/node_modules/mysql');

// Credentials
var host = "csci3100-proj.cobhjw2xjj8l.us-east-1.rds.amazonaws.com";
var user = "root";
var pw = "csci3100";
var db = "csci3100";

var con = mysql.createConnection({
  host: host,
  user: user,
  password: pw,
  database: db
});

con.connect(function(err) {
  if (err){
      console.log(err);
  }
  console.log("Connected!");
});