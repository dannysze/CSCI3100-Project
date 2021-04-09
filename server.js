// Node server
// import {con} from './calevents/src/db';
const con = require('./calevents/src/db');
var express = require('express');
var app = express();
const pwd = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltedRounds = 10;
const jwt = require('jsonwebtoken');
//secret key for jwt.sign
const config = {
    secret:'somerandomstuff',
}
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

var nodemailer = require('nodemailer');




// Configure Mailer for email notification
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'calevents3100@gmail.com',
      pass: 'Calevents-csci3100'
    }
});

// send_email('calevents3100@gmail.com', 'Welcome', '<h1>Welcome to Calevents</h1> We are Calevents admin');
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
        console.log('Email sent to ' + receiver + " with response " + info.response);
        }
    });
}


//for login.return jwt token with payload being userid after successful login.
app.post('/login', function(req, res) {
    console.log(req.body);
    var username = req.body['username'];
    var password = req.body['password'];

    var sql = `SELECT user_id,password FROM csci3100.User where username = '`+ username +`';`;
    con.query(sql, function(err, result){
        if(err) throw err;
        //check if user with the username exists
        if(result.length > 0){
            //check if password matches
            //later may check salted password instead
            bcrypt.compare(password, result[0].password, function(err, match){
                if (match){
                    //return jwt token
                    var token = jwt.sign({user_id: result[0].user_id}, config.secret, {
                        //expiresIn:86400
                    });
    
                    res.status(200).send({token: token});
                }else{
                    res.status(400).send({error: 'Incorrect password'});
                }
            })
        }else{
            res.status(400).send({error: 'User does not exist'});
        }
    });
}
);
//for signup. return jwt token with payload being userid after successful signup.
//modify from /createuser
app.post('/signup', function(req, res) {
    // variables from the request
    var username = req.body['username'];
    var email = req.body['email'];
    var type = req.body['type'];
    
    //hashedPassword = bcrypt.hashSync(req.body.password, 8);
    //password = hashPassword

    var sql = `SELECT * FROM csci3100.User where username = '`+ username +`';`;
    con.query(sql, function (err, result) {
        if (err) throw err;

        if(result.length > 0){
            res.status(400).send({'error':'username has been used'});
        }else{
            bcrypt.hash(req.body['password'], saltedRounds, function(err, hash){
                //no email verification for now
                sql = `INSERT INTO csci3100.User (user_id, username, password, email, type, img_loc, account_balance) VALUES
                ( default , '` + username + `', '`+ hash + `' , '`+ email +`' , ` + type + `, NULL, ` + 0 + `)`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    
                    console.log("1 record inserted");
                    //return jwt token
                    var token = jwt.sign({user_id:result.insertId}, config.secret, {
                    //     expiresIn: 86400
                    });
                    res.status(200).send({token: token});
                });
            })
        }
    });
})

// // insert user
// // password hashing, img_loc and type to be implement
// app.post('/create_user', function(req, res) {
//     // variables from the request
//     var username = req.body['username'];
//     var password = req.body['password'];
//     var email = req.body['email'];
//     var type = req.body['type'];
    
  
//     var sql = `INSERT INTO csci3100.User (user_id, username, password, email, type, img_loc, account_balance) VALUES
//     ( default , '` + username + `', '`+ password + `' , '`+ email +`' , ` + type + `, NULL, ` + 0 + `)`;
//     con.query(sql, function (err, result) {
//         if (err) throw err;

//         console.log("1 record inserted");
//         res.send(result);
//     });
// });


// file uploading
// https://www.youtube.com/watch?v=ysS4sL6lLDU
// https://codingstatus.com/how-to-store-image-in-mysql-database-using-node-js/
// middleware 
const multer = require('multer');
// for randomizing file name
const uuid = require('uuid').v4;
// customize file name
const storage = multer.diskStorage({
    // set destination of file upload
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        // get original name of file
        const {originalname} = file;
        // customize file name from original name
        cb(null, `${uuid()}-${originalname}`);
    }
});

// Set destination of file
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb)=>{
        //https://stackoverflow.com/questions/60408575/how-to-validate-file-extension-with-multer-middleware
        // check if the file type is an image
        var ext = (/jpg|jpeg|png/).test(pwd.extname(file.originalname).toLowerCase());
        var mime = (/jpg|jpeg|png/).test(file.mimetype);
        if(ext && mime){
            console.log("Image");
            return cb(null, true);
        }
        else{
            console.log("not image");
            cb('Error: Not an image');
        }
    },
});


// Create Event
// First check if the user_id is valid
// date format: YYYY-MM-DD
// time format: HH:MM:SS
app.post('/create_event', upload.single('img'), function(req, res) {
    // variables from the request
    var user_id = req.body['user_id'];
    var event_name = req.body['event_name'];
    var start_date = req.body['start_date'];
    var start_time = req.body['start_time'];
    var end_date = req.body['end_date'];
    var end_time = req.body['end_time'];
    var visible = req.body['visible'];
    var repeat = req.body['repeat'];
    var venue = req.body['venue'];
    var capacity = req.body['capacity'];
    var desc = req.body['description'];
    var img_loc = req.file.filename;
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
                , img_loc, organizer, ticket, allow_refund, days_for_refund) VALUES (default, '`+ event_name +`', '`+ start_date +`', '`+ start_time +`', '`+ end_date +`', '`+ end_time +`',`+ 
                visible +`,`+ repeat +`, '`+ venue +`',`+ capacity +`, '`+ desc + `', '`+ img_loc +`', `+ user_id +`,`+ ticket +`,`+ refund +`, `+ refund_days +`)`;
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

// Retrieve all public events
app.get('/search_events', function(req, res){
    var sql = `SELECT * FROM csci3100.Event WHERE visible = 1 ORDER BY start_date ASC;`;
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

// Retrieve user private events
app.get('/user_events/:uID', function(req, res){
    var u_ID = req.params['uID'];
    var sql = `SELECT * FROM csci3100.Event WHERE organizer = ? AND visible = 0 ORDER BY start_date ASC;`
    con.query(sql, [u_ID], function(err, result){
        if (err) throw err;

        res.send(result);
        console.log(result);
    });
});

// Retrieve user information
app.get('/user_info/:uID', function(req, res){
    var u_ID = req.params['uID'];
    var sql = `SELECT username, email, type, account_balance FROM csci3100.User WHERE user_id = ?;`;
    con.query(sql, [u_ID], function(err, result){
        if (err) throw err;

        res.send(result);
        console.log(result);
    });
});

//token based version of retrieve user info. no need to replace the uid param ver. they serve different purpose.
app.get('/user', function(req, res) {
    var token = req.headers['auth'];
    if (!token) return res.status(401).send({error: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded){
        if (err) return res.status(500).send({error: 'Failed to authenticate token.' });
        var u_ID = decoded.user_id;
        var sql = `SELECT user_id,username,img_loc, email,type,account_balance FROM csci3100.User where user_id = ?;`;
        con.query(sql, [u_ID], function(err, result){
            if(err) throw err;
            //check if user with the user exists
            if(result.length > 0){
                var result = result[0];
                //send base64 url for the image
                try{
                    var imageAsBase64 = 'data:image/' + pwd.extname(result.img_loc).substr(1) + ';base64,' + fs.readFileSync(result.img_loc, 'base64');
                    result.img_loc = imageAsBase64;
                }catch{
                    result.img_loc = "";
                }
                res.status(200).send(result);
            }else{
                res.status(400).send({error: 'User does not exist'});
            }
        });
    });
});

//middleware for checking auth
const checkAuth = (req, res, next) => {
    var token = req.headers['auth'];
    if (!token) return res.status(401).send({error: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded){
        if (err) return res.status(500).send({error: 'Failed to authenticate token.' });
        var u_ID = decoded.user_id;
        var sql = `SELECT user_id,username,email,type,account_balance FROM csci3100.User where user_id = ?;`;
        con.query(sql, [u_ID], function(err, result){
            if(err) throw err;
            //check if user with the user exists
            if(result.length > 0){
                next();
            }else{
                res.status(400).send({error: 'User does not exist'});
            }
        });
    });
};


//update profile pic
app.post('/updatepfp', checkAuth, upload.single('pfp'),function(req, res){
    // console.log(req.body);
    // console.log(req.file.path);
    var token = req.headers['auth'];
    jwt.verify(token, config.secret, function(err, decoded){
        var u_ID = decoded.user_id;
        var prefix = 'pfp' + u_ID + '-' + Date.now() + '-';
        sql = `SELECT img_loc from csci3100.User WHERE user_id = ?;`;
        con.query(sql, [u_ID], function(err, result){
            if (err) throw err;
            var oldpath = result[0].img_loc;
            sql = `UPDATE csci3100.User SET img_loc = ? WHERE user_id = ?;`;
            con.query(sql, [req.file.path, u_ID], function(err, result){
                if (err) throw err;
                res.status(200).send("ok");
                //remove old file
                fs.unlink(oldpath, (err) => {
                    console.log(err);
                });
            });
        });
    })
});

// Reset password request
app.post('/reset_password', function(req, res){
    // use token
    
    var sql = `SELECT user_id FROM csci3100.User WHERE email = ?;`;
    con.query(sql, req.params['email'], function(err, result){
        if(err) throw err;
        if(result.length > 0){
            // send email with link from generated token 
        }else{
            res.status(400).send({error: 'No users are related to this email address'});
        }
    });
});

// Reset password
app.put('/reset_password', function(req, res){
    bcrypt.hash(req.body['password'], saltedRounds, function(err, hash){
        //use token
        var sql = `UPDATE csci3100.User SET password = ` + hash + ` WHERE usedID = ` + +`;`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            

            res.status(200).send('Password changed.');
        });
    });
});

// Delete event
app.delete('/user_events/:eID', function(req, res){
    var sql = `DELETE FROM csci3100.Event where event_id = `+ req.params['eID'] +`;`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        // send email
        res.send(result);
    });
});

app.get('/', function(req, res) {
    res.sendFile(pwd.join(__dirname + "/calevents/src/index.js"));
});

//var server = app.listen(3000);
var server = app.listen(5000);

module.exports = app
