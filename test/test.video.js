let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
//TODO Figure out how to require a non-module - currently I can't directly import the server, so I'm calling it as a service.
//let server = require('../back');
const request = require('superagent')


chai.use(chaiHttp);

const serverUrl = "http://localhost:3000";

let testVideo;
let testTag;

describe('Videos', () => {
    before(async () => {
        console.log("Insert a video for testing");
        let response = await request.post(`${serverUrl}/video`).send({ name: 'chaivideo', description: 'chaidescription', url: 'chiurl' });
        testVideo = response.body.video;
        console.log("Test video successfully inserted", testVideo);
        return true;
    });
    describe('/GET video', () => {
        it('it should GET the test video', async () => {
            let response = await request.get(`${serverUrl}/video/${testVideo.id}`);
            console.log(response.body)
            let compareVideo = response.body.video;
            console.log({ compareVideo })
            chai.assert(compareVideo.name === testVideo.name, `${compareVideo.name} does not equal ${testVideo.name}`);
            return true;
        });
    });
    describe('/GET video', () => {
        it('it should FAIL to GET the test video', async () => {
            let response = await request.get(`${serverUrl}/video/${'badVideoId'}`)
                .ok(res => res.status < 500);
            console.log(response.body)
            chai.assert(response.status === 401, `The video was not retrieved`);
            return true;
        });
    });
    describe('/POST video', () => {
        it('it should CHANGE the test video', async () => {
            let newVideo = { ...testVideo };
            newVideo.name = 'updated name';
            console.log({ newVideo, testVideo });
            let response = await request.post(`${serverUrl}/video`).send(newVideo);
            console.log(response.body)
            response = await request.get(`${serverUrl}/video/${testVideo.id}`);
            let compareVideo = response.body.video;
            console.log({ compareVideo })
            chai.assert(compareVideo.name != newVideo.name, `${compareVideo.name} does not equal ${newVideo.name}`);
            return true;
        });
    });
    describe('/POST video', () => {
        it('it should FAIL to CHANGE the test video', async () => {
            let newVideo = { ...testVideo };
            newVideo.name = 'updated name';
            console.log({ newVideo, testVideo });
            let response = await request.post(`${serverUrl}/video`).send('badVideoFormat')
                .ok(res => res.status < 500);
            console.log(response.body)
            chai.assert(response.status === 400, `The video was not changed`);
            return true;
        });
    });
    describe('/POST tag', () => {
        it('it should CREATE a tag', async () => {
            let response = await request.post(`${serverUrl}/tag`).send({ value: `chai-tag${new Date().getTime()}` });
            console.log("new tag", response.body);
            testTag = response.body.tag;
            await request.post(`${serverUrl}/videotag`).send({ videoId: testVideo.id, tagId: testTag.id });
            response = await request.get(`${serverUrl}/video/${testVideo.id}`);
            console.log("tagged video", JSON.stringify(response.body));
            return true;
        });
    });
    describe('/POST tag', () => {
        it('it should FAIL to CREATE a tag', async () => {
            let response = await request.post(`${serverUrl}/tag`).send({})
                .ok(res => res.status < 500);
            chai.assert(response.status === 400, `The tag was not created`);
            return true;
        });
    });
    after(async () => {
        await request.delete(`${serverUrl}/video/${testVideo.id}`);
        await request.delete(`${serverUrl}/tag/${testTag.id}`);
        return true;
    })
});