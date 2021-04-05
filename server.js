// Node server
const con = require('./calevents/src/db');
var express = require('express');
var app = express();
const pwd = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
var nodemailer = require('nodemailer');

// Configure Mailer for email notification
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'calevents3100@gmail.com',
      pass: 'csci3100'
    }
});

// Call this functon and customize it for different notifications
// Sample: send_email('calevents3100@gmail.com', 'Welcome', '<h1>Welcome to Calevents</h1> We are Calevents admin');
function send_email(receiver, subject, content){
    // The content is set to html format for better appearance
    // If there is no need to change the appearance, we can change html into text instead

    var mailOptions = {
        from: 'calevents3100@gmail.com',
        to: receiver,
        subject: subject,
        html: content
    };


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent to ' + mailOptions.receiver + "with response " + info.response);
        }
    });
}


// insert user
// password hashing, img_loc and type to be implement
app.post('/create_user', function(req, res) {
    // variables from the request
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
    // variables from the request
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


// Join Event
app.post('/join_event', function(req, res){
    // variables from the request
    var user_id = req.body['user_id'];
    var event_id = req.body['event_id'];

    // store intermediate query attributes
    var usr_bal;
    var cost;
    var old_capacity;    
    var org_id;
    var org_bal;

    // check if user exit
    var sql = `SELECT account_balance FROM csci3100.User where user_id = `+ user_id +`;`;
    con.query(sql, function (err, result){
        if (err) throw err;

        // check if the event exist and obtain event and organizer data 
        if(result.length > 0){
            usr_bal = result[0].account_balance;
            sql = `SELECT ticket, capacity, organizer FROM csci3100.Event where event_id = `+ event_id +`;`;
            con.query(sql, function (err, result){
                if (err) throw err;

                // obtain organizer account_balance
                if(result.length > 0){
                    cost = result[0].ticket;
                    old_capacity = result[0].capacity;
                    org_id = result[0].organizer;
                    sql = `SELECT account_balance FROM csci3100.User where user_id = `+ org_id +`;`;
                    con.query(sql, function (err, result){
                        if (err) throw err;

                        // check if the user had already enrolled in the event before
                        if(result.length > 0){
                            org_bal = result[0].account_balance;

                            sql = `SELECT * FROM csci3100.Event_Join WHERE user_id = `+ user_id +` AND event_id = `+ event_id +`;`;

                            con.query(sql, function (err, result){
                                if (err) throw err;

                                // check if the user has already enrolled in the same event
                                if(result.length == 0){


                                    // if the user has enough money and the event is not full yet
                                    // transfer money from user to organizer and reduce the capacity of event by 1
                                    // Add enrollment record
                                    if(usr_bal >= cost && old_capacity > 0){
                                        sql = `UPDATE csci3100.Event SET capacity = `+ (old_capacity - 1) +` WHERE event_id = `+ event_id +`;
                                        UPDATE csci3100.User SET account_balance = `+ (usr_bal - cost) +` WHERE user_id = `+ user_id +`;
                                        UPDATE csci3100.User SET account_balance = `+ (org_bal + cost) +` WHERE user_id = `+ org_id +`;
                                        INSERT INTO csci3100.Event_Join (user_id, event_id) VALUES(`+ user_id +`, `+ event_id +`);`;
                                        con.query(sql, function (err, result){
                                            if (err) throw err;
                                            res.send("Joined Activity, transaction done");
                                            console.log("Joined Activity, transaction done");
                                        });
                                    }
                                    else{
                                        res.send("Cannot join activity");
                                        console.log("Cannot join activity");                        
                                    }
                                }
                                else{
                                    res.send("You have already enrolled in this event");
                                    console.log("Cannot join You have already enrolled in this event"); 
                                }
                            });
                        }
                        else{
                            res.send("Invalid organizer");
                            console.log("Invalid organizer");
                        }
                    });
                }
                else{
                    res.send("No such event");
                    console.log("No such event");
                } 
            });
        }
        else{
            res.send("Invalid User");
            console.log("Invalid User");
        }
    });    
})


// Changes needed
// Compromise with frontend
// Only update capacity is OK
app.post('/edit_event', function(req, res) {
    // variables from the request
    var field = req.body['field'];
    var user_id = req.body['user_id'];
    var new_val = req.body['new_val'];
    var event_id = req.body['event_id'];

    // store intermediate query attributes
    var org_id;
    var old_capacity;

    if(field == 'ticket' || field == 'organizer'){
        res.send("You cannot change this information");
        console.log("You cannot change this information");
    }

    if(field == 'capacity'){
        
    }
    else{
        var sql = `SELECT user_id FROM csci3100.User where user_id = `+ user_id +`;`;
        con.query(sql, function (err, result) {
            if (err) throw err;

            // if the user is valid
            if(result.length > 0){
                sql = `SELECT organizer, capacity FROM csci3100.Event where event_id = `+ event_id +`;`;
                con.query(sql, function (err, result){
                    if (err) throw err;
                    
                    if(result.length > 0){
                        org_id = result[0].organizer;
                        old_capacity = result[0].capacity;
                        if(org_id == user_id){
                            // May need to handle different data type here and not OK after here
                            sql = `UPDATE csci3100.Event SET `+ field +` = '`+ new_val +`' WHERE event_id = `+ event_id + `;`;
                            console.log(sql);
                            if (err) throw err;
                            res.send(result);
                            console.log(result);
                        }
                        else{
                            res.send("You are not allowed to edit this event");
                            console.log("You are not allowed to edit this event");                            
                        }
                    }
                    else{
                        res.send("This event does not exist");
                        console.log("This event does not exist");
                    }
                });
            }
            else{
                res.send("The user id is invalid");
            }
        });
    }
});

// Retrieve all public events
app.get('/search_events', function(req, res){
    var sql = `SELECT * FROM csci3100.Event WHERE visible = 1;`;
    con.query(sql, function (err, result) {
        if (err) throw err;

        res.send(result);
        console.log(result);
    });
});

// Retrieve event with given ID
app.get('/event/:eID',function(req, res){
    var eID = req.params['eID'];
    var sql = `SELECT * FROM csci3100.Event WHERE event_id = ?;`;
    con.query(sql, [eID],function (err, result) {
        if (err) throw err;

        res.send(result);
        console.log(result);
    });
});

// Add value to user balance
app.post('/add_value', function(req, res) {
    // variables from the request
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
        else{
            res.send("Invalid User");
            console.log("Invalid User");
        }
    });
});



app.get('/', function(req, res) {
    res.sendFile(pwd.join(__dirname + "/calevents/src/index.js"));
});

var server = app.listen(3000);

module.exports = app