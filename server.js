// Node server
const con = require('./calevents/src/db');
var express = require('express');
var app = express();
const pwd = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var nodemailer = require('nodemailer');

//for salting password
const saltedRounds = 10;

const jwt = require('jsonwebtoken');
//secret key for jwt.sign
const config = {
    secret:'somerandomstuff',
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Mailbox config
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'calevents3100@gmail.com',
      pass: 'CaleventsInfo'
    }
});

// Email notification;
function send_email(receiver, subject, content){
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

//middleware for checking authentication
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

// app.get('/test', function(req, res){
//     var u_ID = 13;
//     var sql = `SELECT user_id,username,img_loc, email,type,account_balance FROM csci3100.User where user_id = ?;`;
//     con.query(sql, [u_ID], function(err, result){
//         if(err) throw err;
//         //check if user with the user exists
//         if(result.length > 0){
//             var result = result[0];
//             //send base64 url for the image
//             try{
//                 var imageAsBase64 = 'data:image/' + pwd.extname(result.img_loc).substr(1) + ';base64,' + fs.readFileSync(result.img_loc, 'base64');
//                 result.img_loc = imageAsBase64;
//             }catch{
//                 result.img_loc = "";
//             }
//             res.status(200).send(result);
//         }else{
//             res.status(400).send({error: 'User does not exist'});
//         }
//     });
// });

//for login.return jwt token with payload being userid after successful login.
// tested
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
                        expiresIn: 60*60*24
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
// tested
app.post('/signup', function(req, res) {
    // variables from the request
    var username = req.body['username'];
    var email = req.body['email'];
    var type = req.body['type'];
    
    //hashedPassword = bcrypt.hashSync(req.body.password, 8);
    //password = hashPassword

    var sql1 = `SELECT * FROM csci3100.User where username = '`+ username +`';`;
    var sql2 = `SELECT * FROM csci3100.User where email = '`+ email +`';`;
 
    con.query(sql1, function (err, result1) {
        if (err) throw err;
        con.query(sql2, function (err, result2){
            if (err) throw err;
            if(result1.length > 0){
                res.status(400).send({'error':'username has been used'});
            }else if (result2.length > 0){
                res.status(400).send({'error':'email has been used'});    
            }else{
                bcrypt.hash(req.body['password'], saltedRounds, function(err, hash){
                    sql = `INSERT INTO csci3100.User (user_id, username, password, email, type, img_loc, account_balance) VALUES
                    ( default , '` + username + `', '`+ hash + `' , '`+ email +`' , ` + type + `, NULL, ` + 0 + `)`;
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        var subject = "Welcome to CalEvents";
                        var content = `<p>Welcome, ` + username + `</p>
                                        <br>
                                        <p>Great to have you with us. CalEvents is here to make a difference 
                                        in the way you join events and manage your time schedule.</p>
                                        <p>Now let's get <a href="http://localhost:3000/login">started</a>.</p>
                                        <br>
                                        <p>Yours Sincerely,<br>CalEvents Admins</p>`
                        send_email(email, subject, content);            
                        //return jwt token
                        var token = jwt.sign({user_id:result.insertId}, config.secret, {
                            expiresIn: 60*60*24
                        });
                        res.status(200).send({token: token});
                    });
                })
            }
        });
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
const { DATE } = require('mysql/lib/protocol/constants/types');
const { event } = require('jquery');
const { start } = require('repl');
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
app.post('/create_event', checkAuth ,upload.single('img'), function(req, res) {
    // variables from the request
    // var user_id = req.body['user_id'];
    var token = req.headers['auth'];
    jwt.verify(token, config.secret, function(err, decoded){
        var user_id = decoded.user_id;
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
        var img_loc = (req.file!=undefined)?req.file.filename:"";
        var ticket = req.body['ticket'];
        var refund = req.body['refund'];
        var refund_days = req.body['refund_days'];
        var category = req.body['category'];
        var event_id;
        
        var sql = `SELECT * FROM csci3100.User where user_id = `+ user_id +`;`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(err);
            // if the user is valid
            if(result.length > 0){

                var sql = `SELECT MAX(event_id) AS new_id FROM csci3100.Event;`;
                con.query(sql, function(err, result){
                    if (err) throw err;

                    if(result.length > 0){
                        console.log(result[0].new_id + 1);
                        event_id = result[0].new_id + 1;

                        // insert event
                        sql = `INSERT INTO csci3100.Event (event_id, name, start_date, start_time, end_date, end_time, visible, repeat_every_week, venue, capacity, description
                            , img_loc, organizer, ticket, allow_refund, days_for_refund, category) VALUES (`+ event_id +`, '`+ event_name +`', '`+ start_date +`', '`+ start_time +`', '`+ end_date +`', '`+ end_time +`',`+ 
                            visible +`,`+ repeat +`, '`+ venue +`',`+ capacity +`, '`+ desc + `', '`+ img_loc +`', `+ user_id +`,`+ ticket +`,`+ refund +`, `+ refund_days +`,'`+ category +`');
                            INSERT INTO csci3100.Event_Join (user_id, event_id) VALUES(`+ user_id +`, `+ event_id +`);`;
                        // console.log(sql);
                        con.query(sql, function (err, result){
                            if (err) throw err;
                            //res.send(result);
                            
                            res.status(200).send("ok");
                        });
                    }
                });
            }
            else{
                res.status(400).send("The user id is invalid");
            }
        });
    })
});


// Retrieve joined events
// tested
app.get('/joined_events/:uID', function(req, res){
    var u_ID = req.params['uID'];
    var sql = `SELECT event_id, name, start_date, start_time, end_date, end_time, description, venue, category, ticket, TEMP.img_loc as img_loc, U.username as organizer, U.user_id as organizer_id FROM csci3100.User U, (SELECT * FROM csci3100.Event E NATURAL JOIN csci3100.Event_Join J WHERE J.user_id = ?) TEMP WHERE U.user_id = TEMP.organizer;`
    con.query(sql, [u_ID], function(err, result){
        if (err) throw err;
        
        if(result.length > 0){
            res.status(200).send(result);
            // console.log(result);
        }
        else{
            res.status(400).send("No events Found");
            // console.log(result);
        }

    });
});


// Join Event
// tested
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

    // check if user exist
    var sql = `SELECT account_balance FROM csci3100.User where user_id = `+ user_id +`;`;
    con.query(sql, function (err, result){
        if (err) throw err;

        // check if the event exist and obtain event and organizer data 
        if(result.length > 0){
            usr_bal = result[0].account_balance;
            sql = `SELECT ticket, capacity, organizer FROM csci3100.Event where event_id = `+ event_id +` AND visible = 1;`;
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
                                            res.status(200).send({success:"Joined Activity, transaction done"});
                                            // console.log("Joined Activity, transaction done");
                                        });
                                    }
                                    else{
                                        if(usr_bal<cost) res.status(400).send({error:"Not enough account balance.You may redeem gift cards to top up."});
                                        if(old_capacity<=0) res.status(400).send({error:"The event is full"});
                                        // console.log("Cannot join activity");                        
                                    }
                                }
                                else{
                                    res.status(400).send({error:"You have already enrolled in this event"});
                                    // console.log("Cannot join You have already enrolled in this event"); 
                                }
                            });
                        }
                        else{
                            res.status(400).send({error:"Invalid organizer"});
                            console.log("Invalid organizer");
                        }
                    });
                }
                else{
                    res.status(400).send({error:"No such event or the event is not public"});
                    // console.log("No such event or the event is not public");
                } 
            });
        }
        else{
            res.status(400).send({error:"Invalid User"});
            console.log("Invalid User");
        }
    });    
})




// Editing all information of an event except ticket and organizer
// Change image location will be handled separately.
var textOnly = multer();
app.post('/edit_event', textOnly.none(), function(req, res) {
// app.post('/edit_event', textOnly.none(), function(req, res) {
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
    var refund = req.body['refund'];
    var refund_days = req.body['refund_days'];
    var category = req.body['category'];
    var event_id = req.body['event_id'];

    var parti_no;
    var old_capacity;

    var sql = `SELECT user_id FROM csci3100.User where user_id = `+ user_id +`;`;
    con.query(sql, function (err, result) {
        if (err) throw err;

        // if the user is valid
        if(result.length > 0){
            sql = `SELECT * FROM csci3100.Event where event_id = `+ event_id +`;`;
            // console.log(sql);
            con.query(sql, function (err, result){
                if (err) throw err;
                
                if(result.length > 0){
                    org_id = result[0].organizer;
                    old_capacity = result[0].capacity;

                    
                        // find the number of participants
                    sql = `SELECT COUNT(user_id) AS count FROM csci3100.Event_Join WHERE event_id = ?`;

                    con.query(sql, [event_id], function(err, result){
                        if (err) throw err;

                        if(result.length > 0){
                            parti_no = result[0].count;
                            // console.log(parti_no);
                            if(org_id == user_id){
                                if(capacity >= parti_no){
                                    sql = `UPDATE csci3100.Event SET name = ?, start_date = ?,start_time = ?, end_date = ?, end_time = ?, visible = ?, repeat_every_week = ?, venue = ?, capacity = ?, description = ?, allow_refund = ?, days_for_refund = ?, category = ? WHERE event_id = ?`;
                                    
                                    // console.log(sql);
                                    // console.log(capacity - parti_no);
                                    con.query(sql, [event_name, start_date, start_time, end_date, end_time, visible, repeat, venue, capacity - parti_no, desc, refund, refund_days, category, event_id], function (err, result){
                                        if (err) throw err;
        
                                        res.status(200).send("ok");
                                        // console.log(result);
                                    });
                                }
                                else{
                                    res.status(400).send("The new capacity should be larger than the number of participants now");    
                                }
                            }
                            else{
                                res.status(403).send("You are not allowed to edit this event");
                                // console.log("You are not allowed to edit this event");                            
                            }
                        }
                        else{
                            res.status(404).send("This event does not exist");
                        }                    
                    });
                    
                }
                else{
                    res.status(404).send("This event does not exist");
                    // console.log("This event does not exist");
                }
            });
        }
        else{
            res.status(402).send("The user id is invalid");
        }
    });
    
});

// change event picture
app.post('/event_pic', upload.single('img'),function(req, res){
    var event_id = req.body['event_id'];
    var oldpath;
    // console.log(event_id);
    sql = `SELECT img_loc from csci3100.Event WHERE event_id = ?;`;
    con.query(sql, [req.body['event_id']], function(err, result){
        if (err) throw err;
        
        if(result.length > 0){
            oldpath = result[0].img_loc;
            sql = `UPDATE csci3100.Event SET img_loc = ? WHERE event_id = ?;`;
            // console.log(req.file.filename);
            con.query(sql, [req.file.filename, event_id], function(err, result){
                if (err) throw err;
                // console.log(oldpath);
                //remove old file
                if(oldpath){
                    fs.unlink('uploads/' + oldpath, (err) => {
                        if (err){
                            console.log(err);
                        }
                    });
                }
                res.status(200).send("ok");
            });
        }
        else{
            res.status(400).send("Invalid Event");
            console.log("Invalid Event");
        }
    });
})

// Add value to user balance
// tested
app.post('/add_value', function(req, res) {
//app.post('/add_value', checkAuth, function(req, res) {
    
    //var token = req.headers['token'];
    //jwt.verify(token, config.secret, function(err, decoded){
        // variables from the request
        //var user_id = decoded.user_id;
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
                sql = `SELECT * FROM csci3100.Prepaid_Card where card_id = '`+ card_id +`';`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    
                    //Check if card number exists
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
                                res.status(200).send({success:"Add value successful, new balance: " + (card_val + old_bal)});
                                console.log("Add value successful, new balance: " + (card_val + old_bal));
                            });
                        }
                        else{
                            console.log("fail");

                            
                            if(result[0].user_id != null){
                                res.status(400).send({error:"The card has been used"})
                                console.log("The card has been used");
                            }else if(actual_pw != input_pw){
                                res.status(400).send({error:"The password is incorrect"});
                                console.log("The password of the card is incorrect")
                            }
                            //res.status(400).send("Failed to add value")
                            console.log("Failed to add value");
                        }
                    }else{
                        res.status(400).send({error:"Card number does not exist"});
                        // console.log("Card number does not exist");
                    }
                });
            }
            else{      
                res.status(400).send("Invalid User");
                // console.log("Invalid User");
            }
        });
    //});
});

// Retrieve all public events
// tested
app.get('/search_events', function(req, res){
    var sql = `SELECT * FROM csci3100.Event INNER JOIN (SELECT user_id, username FROM csci3100.User) AS User ON Event.organizer = User.user_id WHERE visible = 1 ORDER BY start_date ASC;`;
    con.query(sql, function (err, result) {
        if (err) throw err;

        if(result.length > 0){
            for(let i in result){
                try{
                    var imageAsBase64 = 'data:image/' + pwd.extname("uploads/" + result[i].img_loc).substr(1) + ';base64,' + fs.readFileSync('uploads/'+result[i].img_loc, 'base64');
                    result[i].img_loc = imageAsBase64;
                }catch{
                    result[i].img_loc = 'data:image/' + pwd.extname('uploads/empty.png').substr(1) + ';base64,' + fs.readFileSync('uploads/empty.png', 'base64');
                }
                // console.log(result[i])
                // console.log("______________________________________________________________-");
            }
            // console.log(result);
            
            
            res.status(200).send(result);
        }
        else{
            res.status(404).send("No events");
        }

    });
});

// getting events with given search criteria
// tested
app.get('/filter_events', function(req, res){
    var min_cost = req.query['min'];
    var max_cost = req.query['max'];
    var start_date = req.query['start_date'];
    var end_date = req.query['end_date'];
    var name = req.query['name'];

    // console.log(category);
    var arr = JSON.parse(req.query.category);
    console.log(arr);
    var str = '('
    if(arr.length > 0){
        for(let i in arr){
            str += '\'' + arr[i] + '\',';
        }
        str = str.substring(0, str.length - 1);
        str += ')'; 
        // console.log(str);
        var sql = `SELECT * FROM csci3100.Event INNER JOIN (SELECT user_id, username FROM csci3100.User) AS User ON Event.organizer = User.user_id WHERE ticket >= ? AND ticket <= ? AND start_date >= ? AND end_date <= ? AND name LIKE '%`+ name +`%' AND category IN `+str+` AND visible = 1 ORDER BY start_date ASC;`;
        // console.log(sql);
        con.query(sql, [min_cost, max_cost, start_date, end_date, str], function (err, result) {
            if (err) throw err;
    
            if(result.length > 0){
                for(let i in result){
                    try{
                        var imageAsBase64 = 'data:image/' + pwd.extname("uploads/" + result[i].img_loc).substr(1) + ';base64,' + fs.readFileSync('uploads/'+result[i].img_loc, 'base64');
                        result[i].img_loc = imageAsBase64;
                    }catch{
                        result[i].img_loc = 'data:image/' + pwd.extname('uploads/empty.png').substr(1) + ';base64,' + fs.readFileSync('uploads/empty.png', 'base64');
                    }
                    // console.log(result[i])
                    // console.log("______________________________________________________________-");
                }
                res.status(200).send(result);
                // console.log(result);
            }
            else{
                res.status(404).send("No events");
            }
    
        });
    }
    // No category chosen
    else{
        res.status(404).send("No events");
    }

});

// Retrieve event with given ID
// tested
app.get('/event/:eID',function(req, res){
    var eID = req.params['eID'];
    var sql = `SELECT * FROM csci3100.Event INNER JOIN (SELECT user_id, username FROM csci3100.User) AS User ON Event.organizer = User.user_id WHERE event_id = ?;`;
    con.query(sql, [eID], function (err, result) {
        if (err) throw err;

        if(result.length > 0){
            //send base64 url for the image
            try{
                var imageAsBase64 = 'data:image/' + pwd.extname("uploads/" + result[0].img_loc).substr(1) + ';base64,' + fs.readFileSync('uploads/'+result[0].img_loc, 'base64');
                result[0].img_loc = imageAsBase64;
            }catch{
                result[0].img_loc = 'data:image/' + pwd.extname('uploads/empty.png').substr(1) + ';base64,' + fs.readFileSync('uploads/empty.png', 'base64');
            }
            res.status(200).send(result);
        }
        else{
            res.status(401).send("Invalid event id");
        }
        // console.log(result);
    });
});

// Retrieve user private events and public events
// tested
app.get('/user_events/:uID', function(req, res){
    var u_ID = req.params['uID'];
    var sql = `SELECT * FROM csci3100.Event INNER JOIN (SELECT user_id, username FROM csci3100.User) AS User ON Event.organizer = User.user_id WHERE organizer = ? ORDER BY start_date ASC;`;
    con.query(sql, [u_ID], function(err, result){
        if (err) throw err;

        if(result.length > 0){
            //send base64 url for the image
            try{
                var imageAsBase64 = 'data:image/' + pwd.extname("uploads/"+result[0].img_loc).substr(1) + ';base64,' + fs.readFileSync('uploads/'+result[0].img_loc, 'base64');
                result[0].img_loc = imageAsBase64;
            }catch{
                result[0].img_loc = 'data:image/' + pwd.extname('uploads/empty.png').substr(1) + ';base64,' + fs.readFileSync('uploads/empty.png', 'base64');
            }
            res.status(200).send(result);
        }
        else{
            res.status(400).send("No events or the user does not exist");
        }
    });
});

// Retrieve user information
// tested
app.get('/user_info/:uID', function(req, res){
    var u_ID = req.params['uID'];
    var sql = `SELECT username, email, type, account_balance FROM csci3100.User WHERE user_id = ?;`;
    con.query(sql, [u_ID], function(err, result){
        if (err) throw err;

        if(result.length > 0){
            res.status(200).send(result);
            // console.log(result);
        }
        else{
            res.status(400).send("User does not exist");
        }
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
                    result.img_loc = 'data:image/' + pwd.extname('uploads/empty.png').substr(1) + ';base64,' + fs.readFileSync('uploads/empty.png', 'base64');
                }
                res.status(200).send(result);
            }else{
                res.status(400).send({error: 'User does not exist'});
            }
        });
    });
});

//update profile pic
app.post('/updatepfp', checkAuth, upload.single('pfp'),function(req, res){
    // console.log(req.body);
    // console.log(req.file.path);
    var token = req.headers['auth'];
    jwt.verify(token, config.secret, function(err, decoded){
        var u_ID = decoded.user_id;
        sql = `SELECT img_loc from csci3100.User WHERE user_id = ?;`;
        con.query(sql, [u_ID], function(err, result){
            if (err) throw err;
            var oldpath = result[0].img_loc;
            if(result.length > 0){
                sql = `UPDATE csci3100.User SET img_loc = ? WHERE user_id = ?;`;
                con.query(sql, [req.file.path, u_ID], function(err, result){
                    if (err) throw err;
                    res.status(200).send("ok");
                    //remove old file
                    if(oldpath){
                        fs.unlink(oldpath, (err) => {
                        console.log(err);
                        });
                    }
    
                });
            }
            else{
                res.status(400).send("Invalid User");
            }
        });
    })
});

// Refund
app.post('/refund/:eID', function(req, res){
    var sql1 = `SELECT * FROM csci3100.Event_Join WHERE user_id = ? AND event_id = ?;`;
    var sql2 = `SELECT * FROM csci3100.Event WHERE event_id = ?;`;
    con.query(sql1, [req.body['user_id'], req.params['eID']], function(err, result1){
        if (err) throw err;
		//check whether the user has joined this event
        if (result1.length > 0)
            con.query(sql2, [req.params['eID']], function(err, result2){
                if (err) throw err;
                if (result2.length > 0){
                    let current_datetime = new Date();
                    let start_datetime = new Date(result2[0].start_date + ' ' + result2[0].start_time);
                    // check whether the event allows refund and the deadline of refund is not passed
					if (result2[0].allow_refund && (result2[0].days_for_refund > 0) && (current_datetime <= start_datetime)){
                        var sql3 = `DELETE FROM csci3100.Event_Join WHERE user_id = ? AND event_id = ?`;
                        con.query(sql3, [req.body['user_id'], req.params['eID']], function(err, result3){
                            if (err) throw err;
							// update event capacity
                            var sql4 = `UPDATE csci3100.Event SET capacity = ? WHERE event_id = ?`;
                            con.query(sql4, [(result2[0].capacity + 1), req.params['eID']], function(err, result4){
                                if (err) throw err;
                                // refund to user account
								var sql5 = `UPDATE csci3100.User SET account_balance = account_balance + ? WHERE user_id = ?`;
                                con.query(sql5, [result2[0].ticket, req.body['user_id']], function(err, result5){
                                    if (err) throw err;
                                    // deduct refunded amount from organizer account
									var sql6 = `UPDATE csci3100.User SET account_balance = account_balance - ? WHERE user_id = ?`;
                                    con.query(sql6, [result2[0].ticket, result2[0].organizer], function(err, result6){
                                        if (err) throw err;
                                        res.status(200).send('Refunded. Your account balance has been updated.');
                                    })
                                })
                            })
                        })
                    }else
                        res.status(400).send({error: 'The event is not refundable.'});
                }
            })
        else
            res.status(400).send({error: 'You have not joined this event.'});
    });
});

// Reset password request
app.post('/reset_password', function(req, res){
    var sql1 = `SELECT user_id, username FROM csci3100.User WHERE email = ?;`;
    var sql2 = `SELECT * FROM csci3100.Password_Recovery WHERE user_id = ?;`;
    var sql3 = `DELETE FROM csci3100.Password_Recovery WHERE user_id = ?`;
    con.query(sql1, [req.body['email']] , function(err, result1){
        if(err) throw err;
        if(result1.length > 0){
            con.query(sql2, [result1[0].user_id], function(err, result2){
                if (err) throw err;
                // delete token if it exists
                if (result2.length > 0 )
                    con.query(sql3, [result2[0].user_id], function(err, result){if (err) throw err;});
                // generate reset password token/link which expires in 10 mins
				let resetToken = crypto.randomBytes(32).toString("hex");
                const hash = bcrypt.hashSync(resetToken, saltedRounds);
                var sql4 = `INSERT INTO csci3100.Password_Recovery (user_id, token, expires_at) VALUES(?, ?, ?);`;
                let current_datetime = new Date();
                let expire_datetime = new Date();
                expire_datetime.setTime(current_datetime.getTime() + 10 * 60000);
                con.query(sql4, [result1[0].user_id, hash, expire_datetime], function(err, result2){
                    if (err) throw err;
                    // send email with password reset link
                    const link = 'localhost:3000/reset_password?token=' + resetToken + '&user_id=' + result1[0].user_id;
                    var subject = "CalEvents Password Reset";
                    var content = `<p>Dear ` + result1[0].username + `,</p>
                                    <br>
                                    <p>You requested to reset your password.</p>
                                    <p>Click the link below to reset your password.</p>
                                    <a href="http://`+ link + `">Reset Password</a>
                                    <p>Your reset link is only valid once and will be expired in 10 minutes.</p>
                                    <br>
                                    <p>Yours Sincerely,<br>CalEvents Admins</p>`;
                    send_email(req.body['email'], subject, content);
                });
            })
        }else{
            res.status(400).send({error: 'No users are related to this email address'});
        }
    });
});

// Reset password
app.put('/reset_password', function(req, res){
    let current_datetime = new Date();
    sql1 = `SELECT * FROM csci3100.Password_Recovery WHERE user_id = `+ req.query['user_id'] + `;`;
    con.query(sql1, function(err, result1){
        if (err) throw err;
		// check whether the token is valid
        if (result1.length > 0){
            let expire_time = new Date(result1[0].expires_at);
            if ((bcrypt.compareSync(req.query['token'], result1[0].token)) && (current_datetime <= expire_time)){
                    bcrypt.hash(req.body['password'], saltedRounds, function(err, hash){
                        // reset new password
						var sql2 = `UPDATE csci3100.User SET password = '` + hash + `' WHERE user_id = ` + req.query['user_id'] +`;`;
                        con.query(sql2, function (err, result2) {
                            if (err) throw err;
                            else{
                                var sql3 = `SELECT username, email FROM csci3100.User WHERE user_id = ?`;
                                con.query(sql3, [req.query['user_id']], function(err, result3){
                                    if (err) throw err;
                                    res.status(200).send('Password reset successfully.');
									// email notification for succesful password change
                                    var subject = "CalEvents Password Changed";
                                    var content = `<p>Dear ` + result3[0].username + `,</p>
                                                    <br>
                                                    <p>Your password has been successfully reset.</p>
                                                    <p>If you did not make this request, please immediately contact us.</p>
                                                    <br>
                                                    <p>Yours Sincerely,<br>CalEvents Admins</p>`
                                    send_email(result3[0].email, subject, content);
                                    var sql4 = `DELETE FROM csci3100.Password_Recovery WHERE user_id = ` + req.query['user_id'] + `;`;
                                    con.query(sql4, function (err, result4) {if (err) throw err;})
                                })
                            }
                        });
                    });
            }else res.status(400).send({error: 'Invalid or expired password reset token'});
        }else res.status(400).send({error:'No recovery request record'});
    })
});
 
// Delete event
app.delete('/user_events/:eID', function(req, res){
    var parti = '(';
    var ori_ticket;
    var no_of_parti;
    var organizer;
    var oldpath;
    var sql = `SELECT event_id , ticket, organizer, img_loc FROM csci3100.Event WHERE event_id = ?;`;
    con.query(sql, [req.params['eID']], function (err, result) {
        if (err) throw err;

        if(result.length > 0){
            ori_ticket = result[0].ticket;
            organizer = result[0].organizer;
            oldpath = result[0].img_loc;
            var sql = `SELECT user_id FROM csci3100.Event_Join WHERE event_id = ? AND NOT(user_id = ?) ;`;
            con.query(sql, [req.params['eID'], organizer], function (err, result) {
                if (err) throw err;
                
                // construct the list of participant user_id
                no_of_parti = result.length
                for(let i in result){
                    parti += result[i].user_id + ',';
                }

                // remove organizer enrollment record
                sql = `DELETE FROM csci3100.Event_Join WHERE event_id = ? AND user_id = ?`;
                con.query(sql, [req.params['eID'], organizer], function(err, result){
                    if (err) throw err;
                    // if there are participants
                    if(result.length > 0){
                        parti = parti.substring(0, parti.length - 1);
                        parti += ')'; 
                        
                        
                        // refund to user's account
                        // delete join record
                        // delete event
                        var sql = `UPDATE csci3100.User SET account_balance = account_balance - ? WHERE user_id = `+ organizer +`;
                                UPDATE csci3100.User SET account_balance = account_balance + ? WHERE user_id IN `+ parti +`;
                                DELETE FROM csci3100.Event_Join WHERE event_id = ?;
                                DELETE FROM csci3100.Event WHERE event_id = ?;`
                        con.query(sql, [ori_ticket * no_of_parti, ori_ticket, req.params['eID'], req.params['eID']], function (err, result) {
                            if (err) throw err;

                            // delete event image
                            if(oldpath){
                                fs.unlink('uploads/' + oldpath, (err) => {
                                    if (err){
                                        console.log(err);
                                    }
                                });
                            }
                            // send an email notification to affected participants
                            var sql = `SELECT email FROM csci3100.User WHERE user_id IN `+ parti +`;`;

                            con.query(sql, function (err, result){
                                var subject = "Refund for Cancellation of Event with id " + req.params['eID'];
                                var content = `<p>Dear participant,</p>
                                                <br>
                                                <p>We are sorry to inform you that the event with id `+ req.params['eID'] +` is 
                                                cancelled and a refund has been made. Please check your new account balance. If 
                                                you have any enquiries, please don't hesitate to contact us.</p>
                                                <br>
                                                <p>Yours Sincerely,<br>CalEvents Admins</p>`
                                for(let i in result){
                                    send_email(result[i].email, subject, content);
                                }
                                res.status(200).send({error:"Event deleted, refund is done, email is sent to participants"});
                            });
                        });
                    }
                    // if there are no participants
                    else{
                        var sql = `DELETE FROM csci3100.Event WHERE event_id = ?;`
                        con.query(sql, [req.params['eID']], function (err, result) {
                            if (err) throw err;

                            // delete event image
                            if(oldpath){
                                fs.unlink('uploads/' + oldpath, (err) => {
                                    if (err){
                                        console.log(err);
                                    }
                                });
                            }
                            res.status(200).send({success:"Event deleted"});
                        });
                    }

                });
            });
        }
        else{
            res.status(400).send({error:"Invalid event ID"});
        }
    });
});

// app.get('/', function(req, res) {
//     res.sendFile(pwd.join(__dirname + "/calevents/src/index.js"));
// });

// listen to port 5000
var server = app.listen(5000);

module.exports = server;