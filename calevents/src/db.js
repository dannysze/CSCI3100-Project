var mysql = require('./../../node_modules/mysql');

// Database Credentials
var host = "csci3100-proj.cobhjw2xjj8l.us-east-1.rds.amazonaws.com";
var user = "root";
var pw = "csci3100";
var db = "csci3100";

var con = mysql.createConnection({
    host: host,
    user: user,
    password: pw,
    database: db,
    multipleStatements: true,
    dateStrings: true
});

con.connect(function(err) {
    if (err){
        console.log(err);
    }
    console.log("Connected!");
  });

module.exports = con
  