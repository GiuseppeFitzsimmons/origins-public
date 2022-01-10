let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
//TODO Figure out how to require a non-module - currently I can't directly import the server, so I'm calling it as a service.
//let server = require('../back');
const request = require('superagent')


chai.use(chaiHttp);

const serverUrl="http://localhost:3000";

let accessToken, testVideo;

describe('Users', () => {
    before(async () => {
        console.log("Insert a user for testing");
        let response = await request.post(`${serverUrl}/user`).send({id:'bob@test.com',password:'password'});
        accessToken=response.body.access_token;
        response = await request.post(`${serverUrl}/video`).send({name:'chaivideo',description:'chaidescription',url:'chiurl'});
        testVideo=response.body.video;
        console.log("Test user successfully inserted", accessToken);
        return true;
    });
    describe('/POST user', () => {
        it('it should FAIL to create a user', async () => {
            let response = await request.post(`${serverUrl}/user`)
                .ok(res => res.status < 500)
                .send({id:'bob@test.com',password:'differentpassword'});
            chai.assert(response.status===401, `The user was updated`);
            return true;
        });
    });
    describe('/POST login', () => {
        it('it should AUTHENTICATE a user', async () => {
            let explodedToken=accessToken.split('.')[1];
            let buff = new Buffer(explodedToken, 'base64');
            explodedToken = JSON.parse(buff.toString('ascii'));
            let expiry=explodedToken.exp;
            let response = await request.post(`${serverUrl}/login`).send({id:'bob@test.com',password:'password'});
            accessToken=response.body.access_token;
            explodedToken=accessToken.split('.')[1];
            buff = new Buffer(explodedToken, 'base64');
            explodedToken = JSON.parse(buff.toString('ascii'));
            chai.assert(expiry!=explodedToken.exp, `The token was not renewed`);
            return true;
        });
    });
    describe('/POST favourite', () => {
        it('it should CREATE a favourite', async () => {
            let response = await request.post(`${serverUrl}/favourite`).set({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken}).send({userId:'bob@test.com',videoId:testVideo.id});
            console.log("favourites ", response.body);
            return true;
        });
    });
    describe('/GET favourite', () => {
        it('it should GET the favourites for a user', async () => {
            let response = await request.get(`${serverUrl}/favourite`).set({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken});
            console.log("favourites nn ", JSON.stringify(response.body));
            return true;
        });
    });
    after(async () => {
        await request.delete(`${serverUrl}/user`).set({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken});
        await request.delete(`${serverUrl}/video/${testVideo.id}`);
        return true;
    })
});