var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import Video from './models/video.js';
import Tag from './models/tag';
import { v4 as uuid } from 'uuid';
import User from "./models/user.js";
import VideoTag from "./models/videottag.js";
import { generateNewPair, hashAPass, validateToken } from "./tokenUtility.js";
import Favourite from "./models/favourite.js";
import cors from 'cors';
import cache from 'memory-cache';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('../front/build'));
app.use(express.json());
app.use(cors());
process.env.SIGNING_SECRET = 'ADummySigningSecret';
process.env.HASHING_SECRET = 'ADummyHashingSecret';
/*const sequelize = new Sequelize('postgres://postgres:verona123@localhost:5432/postgres');
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err: any) => {
        console.error('Unable to connect to the database:', err);
    });
*/
// Note: using `force: true` will drop the table if it already exists
Video.sync({ force: true }).then(() => {
    Tag.sync({ force: true }).then(() => {
        User.sync({ force: true }).then(() => {
            Favourite.sync({ force: true }).then(() => {
                VideoTag.sync({ force: true });
            });
        });
    });
});
// VIDEO CRUD
app.post('/video', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request body", req.body);
    try {
        let newVideo;
        if (req.body.id) {
            yield Video.update(req.body, {
                where: {
                    id: req.body.id
                }
            });
            newVideo = yield Video.findAll({
                where: {
                    id: req.body.id
                }
            });
        }
        else {
            req.body.id = uuid();
            newVideo = yield Video.create(req.body);
        }
        res.json({ video: newVideo }); // Returns the new video that is created in the database
    }
    catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    }
    ;
}));
app.get('/video/:videoId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoId = req.params.videoId;
    try {
        if (cache.get(videoId)) {
            res.json({ video: cache.get(videoId) });
        }
        else {
            const video = yield Video.findOne({
                where: {
                    id: videoId
                },
                include: [{ model: Tag, as: "tags" }]
            });
            if (video.tags) {
                let dTags = video.tags;
                video.tags = [];
                dTags.forEach((t) => {
                    delete t.dataValues.VideoTag;
                    video.tags.push(t.dataValues);
                });
            }
            cache.put(videoId, video, 300000);
            res.json({ video });
        }
    }
    catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    }
    ;
}));
app.delete('/video/:videoId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoId = req.params.videoId;
    try {
        const video = yield Video.destroy({
            where: {
                id: videoId
            }
        });
        res.json({ video });
    }
    catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    }
    ;
}));
// TAG CRUD
app.post('/tag', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newTag;
        if (req.body.value) {
            if (req.body.id) {
                yield Tag.update(req.body, {
                    where: {
                        id: req.body.id
                    }
                });
                newTag = yield Tag.findAll({
                    where: {
                        id: req.body.id
                    }
                });
            }
            else {
                req.body.id = uuid();
                newTag = yield Tag.create(req.body);
            }
            res.json({ tag: newTag }); // Returns the new tag that is created in the database
        }
        else {
            res.status(400);
            res.json({ error: 'incomplete request, missing value' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    }
    ;
}));
app.get('/tag/:tagId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = req.params.tagId;
    try {
        const tag = yield Tag.findOne({
            where: {
                id: tagId
            }
        });
        res.json({ tag });
    }
    catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    }
    ;
}));
app.delete('/tag/:tagId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = req.params.tagId;
    try {
        const tag = yield Tag.destroy({
            where: {
                id: tagId
            }
        });
        res.json({ tag });
    }
    catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    }
    ;
}));
// VIDEO/TAG MANAGEMENT
app.post('/videotag', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result;
        if (req.body.videoId && req.body.tagId) {
            let updateTag = yield Tag.findByPk(req.body.tagId);
            yield VideoTag.create({ videoId: req.body.videoId, tagId: req.body.tagId });
            yield Video.findOne({ where: { id: req.body.videoId }, include: [{ model: Tag, as: "tags" }] }).then(video => {
                result = video.dataValues;
                let dTags = video.dataValues.tags;
                result.tags = [];
                dTags.forEach((t) => {
                    //for some reason there's a VideoTag object in the tag
                    delete t.dataValues.VideoTag;
                    result.tags.push(t.dataValues);
                });
                res.json(result);
            });
        }
        else
            throw ({ error: 'incomplete request body' });
    }
    catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    }
    ;
}));
app.delete('/videotag/:videoId/:tagId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params.tagId && req.params.videoId) {
            yield VideoTag.destroy({
                where: {
                    videoId: req.params.videoId,
                    tagId: req.params.tagId
                }
            });
            res.json({ success: 'yes' }); // Returns the new tag that is created in the database
        }
        else
            throw ({ error: 'incomplete request body' });
    }
    catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    }
    ;
}));
app.get('/videotag/:tagId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = req.params.tagId;
    try {
        let videos = [];
        let tag;
        try {
            tag = yield Tag.findAll({
                where: {
                    id: tagId
                }
            });
        }
        catch (err) {
            console.log(`tag ${tagId} doesn't exist. Trying it again as the value`);
            tag = yield Tag.findAll({
                where: {
                    value: tagId
                }
            });
        }
        for (var i in tag) {
            let newTag = tag[i];
            let newVideoTags = yield VideoTag.findAll({
                where: {
                    tagId: newTag.id
                }
            });
            for (var j in newVideoTags) {
                let newVideoTag = newVideoTags[j];
                let offset = 0;
                let limit = 10;
                if (req.query.offset) {
                    offset = req.params.offset;
                }
                if (req.query.limi) {
                    limit = req.params.limit;
                }
                let newVideo = yield Video.findOne({
                    where: {
                        id: newVideoTag.dataValues.videoId
                    },
                    offset: offset,
                    limit: limit
                });
                if (!videos.includes(newVideo)) {
                    videos.push(newVideo);
                }
            }
        }
        res.json({ videos });
    }
    catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    }
    ;
}));
// USER MANAGEMENT
app.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.id && req.body.password) {
            req.body.password = hashAPass(req.body.password);
            yield User.create(req.body);
            let tokens = generateNewPair(req.body.id);
            res.json(tokens); // Returns the new user that is created in the database
        }
        else
            throw ({ error: 'incomplete request body' });
    }
    catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    }
    ;
}));
app.delete('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.replace('Bearer ', '');
            token = validateToken({ authorizationToken: token });
            if (token) {
                const user = yield User.destroy({
                    where: {
                        id: token.sub
                    }
                });
                res.json({ user });
            }
            else
                throw ({ error: 'invalid token' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    }
    ;
}));
// AUTHENTICATION
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.id && req.body.password) {
            req.body.password = hashAPass(req.body.password);
            let user = yield User.findOne({
                where: {
                    id: req.body.id,
                    password: req.body.password
                }
            });
            if (user) {
                console.log("User found", user);
                let tokens = generateNewPair(req.body.id);
                res.json(tokens);
            }
            else {
                res.status(401);
                res.json({ error: 'No such user or password' });
            }
        }
        else
            throw ({ error: 'incomplete request body' });
    }
    catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    }
    ;
}));
// FAVOURITES
app.post('/favourite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization && req.body.videoId) {
            let token = req.headers.authorization.replace('Bearer ', '');
            console.log('token', token);
            token = validateToken({ authorizationToken: token });
            if (token) {
                yield Favourite.create({ videoId: req.body.videoId, userId: token.sub });
                res.json({ success: true });
            }
            else
                throw ({ error: 'invalid token, or video does not exist' });
        }
        else
            throw ({ error: 'incomplete request body' });
    }
    catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    }
    ;
}));
app.get('/favourite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.replace('Bearer ', '');
            token = validateToken({ authorizationToken: token });
            let videos = [];
            if (token) {
                let favourites = yield Favourite.findAll({
                    where: {
                        userId: token.sub
                    }
                });
                //videos = await sequelize.query('SELECT * FROM "Video" AS v INNER JOIN "Favourite" AS f ON "v.id" = "f.videoId" WHERE "f.userId" = '+token.sub)
                for (var i in favourites) {
                    let favourite = favourites[i];
                    let offset = 0;
                    let limit = 10;
                    if (req.query.offset) {
                        offset = req.query.offset;
                    }
                    if (req.query.limit) {
                        limit = req.query.limit;
                    }
                    let newVideo = yield Video.findOne({
                        where: {
                            id: favourite.videoId
                        },
                        offset: offset,
                        limit: limit
                    });
                    if (!videos.includes(newVideo)) {
                        videos.push(newVideo);
                    }
                }
                res.json({ videos });
            }
            else
                throw ({ error: 'invalid token' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    }
    ;
}));
app.listen(port, () => console.log(`Server listening on port ${port}!`));
