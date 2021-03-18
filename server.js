// Node server
// import {con} from './calevents/src/db';
var express = require('express');
var app = express();
const pwd = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
var mysql = require('./node_modules/mysql');

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
    multipleStatements: true
});

con.connect(function(err) {
    if (err){
        console.log(err);
    }
    console.log("Connected!");
});




// insert user
// password hashing, img_loc and type to be implement
app.post('/create_user', function(req, res) {
    var username = req.body['username'];
    var password = req.body['password'];
    var email = req.body['email'];
    var type = req.body['type'];
    
  
    var sql = `INSERT INTO csci3100.User (user_id, username, password, email, type, img_loc, account_balance) VALUES
    ( default , '` + username + `', '`+ password + `' , '`+ email +`' , ` + type + `, NULL, ` + 0 + `)`;
    con.query(sql, function (err, result) {
        if (err) throw err;

        console.log("1 record inserted");
        res.send(result);
    });
});


// Create Event
// First check if the user_id is valid
// img_loc, date, time to be implemented
app.post('/create_event', function(req, res) {
    var user_id = req.body['user_id'];
    var event_name = req.body['event_name'];
    var visible = req.body['visible'];
    var repeat = req.body['repeat'];
    var venue = req.body['venue'];
    var capacity = req.body['capacity'];
    var desc = req.body['description'];
    var ticket = req.body['ticket'];
    var refund = req.body['refund'];
    var refund_days = req.body['refund_days'];

    // var email = req.body['email'];
    // var type = req.body['type'];

    var sql = `SELECT * FROM csci3100.User where user_id = `+ user_id +`;`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        // if the user is valid
        if(result.length > 0){
            // insert event
            sql = `INSERT INTO csci3100.Event (event_id, name, start_date, start_time, end_date, end_time, visible, repeat_every_week, venue, capacity, description
                , img_loc, organizer, ticket, allow_refund, days_for_refund) VALUES (default, '`+ event_name +`', '2021-3-19', now(), '2021-3-19', now(),`+ 
                visible +`,`+ repeat +`, '`+ venue +`',`+ capacity +`, '`+ desc + `', 'NULL', `+ user_id +`,`+ ticket +`,`+ refund +`, `+ refund_days +`)`;
            con.query(sql, function (err, result){
                if (err) throw err;
                res.send(result);
            });
        }
        else{
            res.send("The user id is invalid");
        }
    });
});

// Add value to user balance
app.post('/add_value', function(req, res) {
    var user_id = req.body['user_id'];
    var card_id = req.body['card_id'];
    var input_pw = req.body['card_pw'];
    
    // store intermediate query attributes
    var old_bal;
    var actual_pw;
    var card_val;
    // check if the user id is valid
    var sql = `SELECT * FROM csci3100.User where user_id = `+ user_id +`;`;
    con.query(sql, function (err, result) {
        if (err) throw err;

        // if the user is valid
        if(result.length > 0){
            old_bal = result[0].account_balance;
            // check if the card is valid
            sql = `SELECT * FROM csci3100.Prepaid_Card where card_id = `+ card_id +`;`;
            con.query(sql, function (err, result) {
                if (err) throw err;

                // if the user is valid
                if(result.length > 0){

                    // console.log(result[0]);
                    actual_pw = result[0].card_password;
                    card_val = result[0].value;

                    // if the card is used or the password is incorrect
                    if(result[0].user_id == null && actual_pw == input_pw){

                        // Set the card as used and add value to the user's account
                        sql = `UPDATE csci3100.Prepaid_Card SET user_id = `+ user_id +` WHERE card_id = `+ card_id +`;
                        UPDATE csci3100.User SET account_balance = `+ (card_val + old_bal) +` WHERE user_id = `+ user_id +`;`;
                        con.query(sql, function (err, result) {
                            if (err) throw err;
                            res.send("Add value successful, new balance: " + (card_val + old_bal));
                            console.log("Add value successful, new balance: " + (card_val + old_bal));
                        });
                    }
                    else{
                        res.send("Failed to add value")
                        console.log("Failed to add value");
                    }
                }
            });
        }
    });
});


app.get('/', function(req, res) {
    res.sendFile(pwd.join(__dirname + "/calevents/src/index.js"));
});

var server = app.listen(3000);

module.exports = app