const { expect } = require("chai");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

chai.should();

chai.use(chaiHttp);

// response.body.length,should.be.eq(1)
describe('test http requests', ()=>{

    describe('get public events /search_events', ()=>{
        it('It should get all the public events', (done) => {
            chai.request(server).get('/search_events').end((err, response) => {
                console.log(response);
                response.should.have.status(200);
                response.body.should.be.a('array');
                done();
            })
        })
    });

    describe('get an event using /event/:eID', ()=>{
        it('It should get the event with id 3', (done) => {
            const event_id = 3;
            chai.request(server).get('/event/' + event_id).end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.be.eq(1);
                // response.body.should.have.property('event_id').eq(3);
                // response.body.should.have.property('name');
                // response.body.should.have.property('start_date');
                // response.body.should.have.property('start_time');
                done();
            });
        });

        it('It should not get any events', (done) => {
            const event_id = 1000;
            chai.request(server).get('/event/' + event_id).end((err, response) => {
                response.should.have.status(401);
                response.text.should.be.eq("Invalid event id");
                done();
            });
        });
    });

    //pending changes
    describe('get events joined by a given user', ()=>{
        it('It should get all the events joined by user with id 11', (done) => {
            const uID = 11;
            chai.request(server).get('/joined_events/' + uID).end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                done();
            });
        });

        it('It should not get any events because the user has not joined any events', (done) => {
            const uID = 100;
            chai.request(server).get('/joined_events/' + uID).end((err, response) => {
                response.should.have.status(400);
                response.text.should.be.eq("No events Found");
                done();
            });
        });
    });
    

    describe('/signup', ()=>{
        it('Should not sign up a new user because of repeated username and email', (done) => {
            const user = {
                username: "testing_acc",
                email: "testing@email.com",
                password: "123456",
                type: 0
            }
            chai.request(server).post('/signup').send(user).end((err, response) => {
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                done();
            });
        });
        it('Should succesfully sign up a new user and return a token', (done) => {
            const user = {
                username: "testing_acc",
                email: "testing@email.com",
                password: "123456",
                type: 0
            }
            chai.request(server).post('/signup').send(user).end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                // console.log(response);
                done();
            });
        });
    });

    describe('test /login for users to login', ()=>{
        it('Should succesfully login the user and return a token', (done) => {
            const user = {
                username: "testing_acc",
                password: "123456"
            }
            chai.request(server).post('/login').send(user).end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                done();
            });
        });

        it('Should not login the user because the user does not exist', (done) => {
            const user = {
                username: "testing_",
                password: "123456"
            }
            chai.request(server).post('/login').send(user).end((err, response) => {
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                done();
            });
        });

        it('Should not login the user because the password is incorrect', (done) => {
            const user = {
                username: "testing_acc",
                password: "1234"
            }
            chai.request(server).post('/login').send(user).end((err, response) => {
                response.should.have.status(400);
                response.body.should.be.a('object');
                response.body.should.have.property('error');
                done();
            });
        });
    });

    // pending changes
    describe('test /join_event for users to join events', ()=>{
        it('Should not enrol the user in the given event because of inadequate account balance', (done) => {
            const form = {
                user_id: 65,
                event_id: 3
            }
            chai.request(server).post('/join_event').send(form).end((err, response) => {
                console.log(response);
                response.should.have.status(400);
                response.text.should.be.eq("Cannot join activity");
                done();
            });
        });

        it('Should not enrol the user in the given event because he had already joined', (done) => {
            const form = {
                user_id: 65,
                event_id: 6
            }
            chai.request(server).post('/join_event').send(form).end((err, response) => {
                // console.log(response);
                response.should.have.status(400);
                response.text.should.be.eq("You have already enrolled in this event");
                done();
            });
        });

        it('Should not enrol the user in the given event because the event is private', (done) => {
            const form = {
                user_id: 65,
                event_id: 12
            }
            chai.request(server).post('/join_event').send(form).end((err, response) => {
                console.log(response);
                response.should.have.status(400);
                response.text.should.be.eq("No such event or the event is not public");
                done();
            });
        });

        it('Should enrol the user in the given event', (done) => {
            const form = {
                user_id: 65,
                event_id: 6
            }
            chai.request(server).post('/join_event').send(form).end((err, response) => {
                // console.log(response);
                response.should.have.status(200);
                response.text.should.be.eq("Joined Activity, transaction done");
                done();
            });
        });
    });

    
    describe('get events organized by a user using /user_events/:uID', ()=>{
        it('It should get events organized by the given user', (done) => {
            const user_id = 11;
            chai.request(server).get('/user_events/' + user_id).end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                done();
            });
        });
    
        it('It should return error because the user_id is invalid', (done) => {
            const user_id = 1000;
            chai.request(server).get('/user_events/' + user_id).end((err, response) => {
                response.should.have.status(400);
                response.text.should.be.eq("No events or the user does not exist");
                done();
            });
        });

        // pending changes
        it('It should return error because the user_id is invalid', (done) => {
            const user_id = 65;
            chai.request(server).get('/user_events/' + user_id).end((err, response) => {
                response.should.have.status(400);
                response.text.should.be.eq("No events or the user does not exist");
                done();
            });
        });
    });

    describe('get user information by /user_info/:uID', ()=>{
        it('It should get information of given user', (done) => {
            const user_id = 11;
            chai.request(server).get('/user_info/' + user_id).end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                done();
            });
        });

        it('It should return error saying that the user does not exist', (done) => {
            const user_id = 1000;
            chai.request(server).get('/user_info/' + user_id).end((err, response) => {
                response.should.have.status(400);
                response.text.should.be.eq("User does not exist");
                done();
            });
        });
    });


    // pending changes
    describe('test /add_value for adding for adding user account balance', ()=>{
        it('Should not add the user account balance because the card does not exist', (done) => {
            const form = {
                user_id: 65,
                card_id: 1000,
                input_pw: "127843193423"
            }
            chai.request(server).post('/add_value').send(form).end((err, response) => {
                // console.log(response);
                response.should.have.status(400);
                response.body.should.have.property('error').eq("Card number does not exist");
                done();
            });
        });
        it('Should not add the user account balance because the password is wrong', (done) => {
            const form = {
                user_id: 65,
                card_id: 1,
                input_pw: "1234567890"
            }
            chai.request(server).post('/add_value').send(form).end((err, response) => {
                // console.log(response);
                response.should.have.status(400);
                response.body.should.have.property('error').eq("The password is incorrect");
                done();
            });
        });

        it('Should not add the user account balance because the card has been used', (done) => {
            const form = {
                user_id: 65,
                card_id: 3,
                input_pw: "876876256256"
            }
            chai.request(server).post('/add_value').send(form).end((err, response) => {
                // console.log(response);
                response.should.have.status(400);
                response.body.should.have.property('error').eq("The card has been used");
                done();
            });
        });

        it('Should not add the user account balance because the user_id is invalid', (done) => {
            const form = {
                user_id: 1000,
                card_id: 3,
                input_pw: "876876256256"
            }
            chai.request(server).post('/add_value').send(form).end((err, response) => {
                // console.log(response);
                response.should.have.status(400);
                response.text.should.be.eq("Invalid User");
                done();
            });
        });

        it('Should add the user account balance', (done) => {
            const form = {
                user_id: 65,
                card_id: 1,
                card_pw: "632926491938"
            }
            chai.request(server).post('/add_value').send(form).end((err, response) => {
                // console.log(response);
                response.should.have.status(200);
                response.body.should.have.property('success');
                done();
            });
        });
    });
    describe('get public events by /filter_events with search criteria', ()=>{
        it('It should get all the events with cost at most 1000 which occur between 2021-04-01 and 2021-04-30 with category "Whole-person Development" with name having "mother as substring"', (done) => {
            chai.request(server).get('/filter_events?min=0&max=1000&start_date=2021-04-01&end_date=2021-04-30&category=["Whole-person Development"]&name=mother').end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                done();
            });
        });
        it('It should get no events because no events meet the search criteria', (done) => {
            chai.request(server).get('/filter_events?min=0&max=1000&start_date=2021-04-01&end_date=2021-04-30&category=["sports"]&name=mother').end((err, response) => {
                response.should.have.status(404);
                response.text.should.be.eq("No events");
                done();
            });
        });
    });      
});