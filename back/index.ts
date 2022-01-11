import { Op, Sequelize } from "sequelize";
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
import { sequelize } from "./models/index.js";
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
            })
        })
    })
});

// VIDEO CRUD

app.post('/video', async (req: { body: any; }, res: any) => {
    console.log("request body", req.body);
    try {
        let newVideo
        if (req.body.id) {
            await Video.update(req.body,
                {
                    where: {
                        id: req.body.id
                    }
                });
            newVideo = await Video.findAll({
                where: {
                    id: req.body.id
                }
            })
        } else {
            req.body.id = uuid()
            newVideo = await Video.create(req.body);
        }
        res.json({ video: newVideo }); // Returns the new video that is created in the database
    } catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    };
});

app.get('/video/:videoId', async (req: { params: { videoId: any; }; }, res: any) => {
    const videoId = req.params.videoId;
    try {
        if (cache.get(videoId)) {
            res.json({ video: cache.get(videoId) });
        } else {
            const video = await Video.findOne({
                where: {
                    id: videoId
                },
                include: [{ model: Tag, as: "tags" }]
            });
            if (video.tags) {
                let dTags = video.tags;
                video.tags = [];
                dTags.forEach((t: { dataValues: any; }) => {
                    delete t.dataValues.VideoTag;
                    video.tags.push(t.dataValues);
                });
            }
            cache.put(videoId, video, 300000);
            res.json({ video });
        }
    } catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    };
});

app.delete('/video/:videoId', async (req: { params: { videoId: any; }; }, res: any) => {
    const videoId = req.params.videoId;
    try {
        const video = await Video.destroy({
            where: {
                id: videoId
            }
        });
        res.json({ video });
    } catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    };
});

// TAG CRUD

app.post('/tag', async (req: { body: any; }, res: any) => {
    try {
        let newTag
        if (req.body.value) {
            if (req.body.id) {
                await Tag.update(req.body,
                    {
                        where: {
                            id: req.body.id
                        }
                    });
                newTag = await Tag.findAll({
                    where: {
                        id: req.body.id
                    }
                })
            } else {
                req.body.id = uuid();
                newTag = await Tag.create(req.body);
            }
            res.json({ tag: newTag }); // Returns the new tag that is created in the database
        } else {
        res.status(400);
        res.json({ error: 'incomplete request, missing value' });
        }
    } catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    };
});

app.get('/tag/:tagId', async (req: { params: { tagId: any; }; }, res: any) => {
    const tagId = req.params.tagId;
    try {
        const tag = await Tag.findOne({
            where: {
                id: tagId
            }
        });
        res.json({ tag });
    } catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    };
});

app.delete('/tag/:tagId', async (req: { params: { tagId: any; }; }, res: any) => {
    const tagId = req.params.tagId;
    try {
        const tag = await Tag.destroy({
            where: {
                id: tagId
            }
        });
        res.json({ tag });
    } catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    };
});

// VIDEO/TAG MANAGEMENT

app.post('/videotag', async (req: { body: any; }, res: any) => {
    try {
        let result: { tags: {}[]; };
        if (req.body.videoId && req.body.tagId) {
            let updateTag = await Tag.findByPk(req.body.tagId);
            await VideoTag.create({ videoId: req.body.videoId, tagId: req.body.tagId });
            await Video.findOne({ where: { id: req.body.videoId }, include: [{ model: Tag, as: "tags" }] }).then(video => {
                result = video.dataValues;
                let dTags = video.dataValues.tags;
                result.tags = [];
                dTags.forEach((t: { dataValues: any; }) => {
                    //for some reason there's a VideoTag object in the tag
                    delete t.dataValues.VideoTag;
                    result.tags.push(t.dataValues);
                });
                res.json(result);
            });
        } else throw ({ error: 'incomplete request body' })
    } catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    };
});

app.delete('/videotag/:videoId/:tagId', async (req: { params: any; }, res: any) => {
    try {
        if (req.params.tagId && req.params.videoId) {
            await VideoTag.destroy({
                where: {
                    videoId: req.params.videoId,
                    tagId: req.params.tagId
                }
            });
            res.json({ success: 'yes' }); // Returns the new tag that is created in the database

        } else throw ({ error: 'incomplete request body' })
    } catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    };
});

app.get('/videotag/:tagId', async (req: any, res: any) => {
    const tagId = req.params.tagId;
    try {
        let videos: any[] = []
        let tag
        try {
            tag = await Tag.findAll({
                where: {
                    id: tagId
                }
            });
        } catch (err) {
            console.log(`tag ${tagId} doesn't exist. Trying it again as the value`);
            tag = await Tag.findAll({
                where: {
                    value: tagId
                }
            });
        }
        for (var i in tag) {
            let newTag = tag[i]
            let newVideoTags = await VideoTag.findAll({
                where: {
                    tagId: newTag.id
                }
            });
            for (var j in newVideoTags) {
                let newVideoTag = newVideoTags[j]
                let offset = 0
                let limit = 10
                if (req.query.offset) {
                    offset = req.params.offset
                }
                if (req.query.limi) {
                    limit = req.params.limit
                }
                let newVideo = await Video.findOne({
                    where: {
                        id: newVideoTag.dataValues.videoId
                    },
                    offset: offset,
                    limit: limit
                })
                if (!videos.includes(newVideo)) {
                    videos.push(newVideo);
                }
            }
        }
        res.json({ videos })
    } catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    };
});

// USER MANAGEMENT

app.post('/user', async (req: { body: any; }, res: any) => {
    try {
        if (req.body.id && req.body.password) {
            req.body.password = hashAPass(req.body.password);
            await User.create(req.body);
            let tokens = generateNewPair(req.body.id);
            res.json(tokens); // Returns the new user that is created in the database
        } else throw ({ error: 'incomplete request body' })
    } catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    };
});

app.delete('/user', async (req: any, res: any) => {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.replace('Bearer ', '');
            token = validateToken({ authorizationToken: token })
            if (token) {
                const user = await User.destroy({
                    where: {
                        id: token.sub
                    }
                });
                res.json({ user })
            } else throw ({ error: 'invalid token' });
        }
    } catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    };
});

// AUTHENTICATION

app.post('/login', async (req: { body: any; }, res: any) => {
    try {
        if (req.body.id && req.body.password) {
            req.body.password = hashAPass(req.body.password)
            let user = await User.findOne({
                where: {
                    id: req.body.id,
                    password: req.body.password
                }
            });
            if (user) {
                console.log("User found", user);
                let tokens = generateNewPair(req.body.id)
                res.json(tokens);
            } else {
                res.status(401)
                res.json({ error: 'No such user or password' })
            }
        } else throw ({ error: 'incomplete request body' })
    } catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    };
});

// FAVOURITES

app.post('/favourite', async (req: any, res: any) => {
    try {
        if (req.headers.authorization && req.body.videoId) {
            let token = req.headers.authorization.replace('Bearer ', '');
            console.log('token', token)
            token = validateToken({ authorizationToken: token })
            if (token) {
                await Favourite.create({ videoId: req.body.videoId, userId: token.sub })
                res.json({ success: true });
            } else throw ({ error: 'invalid token, or video does not exist' });
        } else throw ({ error: 'incomplete request body' });
    } catch (error) {
        console.error(error);
        res.status(400);
        res.json({ error: error });
    };
});

app.get('/favourite', async (req: any, res: any) => {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.replace('Bearer ', '');
            token = validateToken({ authorizationToken: token });
            let videos: any[] = [];
            if (token) {
                let favourites: any = await Favourite.findAll({
                    where: {
                        userId: token.sub
                    }
                })
                //videos = await sequelize.query('SELECT * FROM "Video" AS v INNER JOIN "Favourite" AS f ON "v.id" = "f.videoId" WHERE "f.userId" = '+token.sub)
                for (var i in favourites) {
                    let favourite = favourites[i]
                    let offset = 0
                    let limit = 10
                    if (req.query.offset) {
                        offset = req.query.offset
                    }
                    if (req.query.limit) {
                        limit = req.query.limit
                    }
                    let newVideo = await Video.findOne({
                        where: {
                            id: favourite.videoId
                        },
                        offset: offset,
                        limit: limit
                    })
                    if (!videos.includes(newVideo)) {
                        videos.push(newVideo);
                    }
                }
                res.json({ videos });
            } else throw ({ error: 'invalid token' });
        }
    } catch (error) {
        console.error(error);
        res.status(401);
        res.json({ error: error });
    };
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));