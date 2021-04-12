const { expect } = require("chai");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

chai.should();

chai.use(chaiHttp);

// response.body.length,should.be.eq(1)
describe('get event', ()=>{

    describe('get public events /search_events', ()=>{
        it('It should get all the public events', (done) => {
            chai.request(server).get('/search_events').end((err, response) => {
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
});