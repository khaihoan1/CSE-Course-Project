var url = 'mongodb://localhost:27017/final';
var opt = {useUnifiedTopology: true};
var mongodb = require('mongodb');
var express = require('express');
var router = express.Router();
var authen = require('./models/authen');
var artigory = require('./models/artigory');
var helper = require('./helper');
var nunjucks = require('nunjucks');
const fs = require('fs');
module.exports = router;
nunjucks.configure(__dirname + '/views', {
    autoescape: true,
});

router.get('/', async (req, res) => {
    // console.log(a);
    if (req.cookies.sessionId){
        // if (Object.keys(req.cookies).length !== 0){
            var session = await authen.getSessionByCookie(req.cookies.sessionId);
            if (session != null) {
                // console.log("FOUND");
                // console.log(session.uid);
                res.render('test.njk', {
                    title: "SIGNed",
                    session: session
                });
            } else {
                // console.log('Cookie found, session not found');
                res.clearCookie('sessionId');
                res.render('test.njk', {title: "BLOG"});
            }    
        } else {
            // res.end('ok');
            res.render('test.njk', {title: "BLOG"});
        }
});
router.get('/notsignin', async (req, res) => {
   res.render('2.njk', {title: "NOT SIGNED"});
})
router.get('/kendo', async (req, res) => {
    if (req.cookies.sessionId){
        var session = await authen.getSessionByCookie(req.cookies.sessionId);
        res.render('test.njk', {
            title: "CREATE A NEW ARTICLE",
            session: session
        });
    }
    
})
router.get('/create/acc', async (req, res) => {
    var i = 0;
    for (i; i < 100; i++){
        var usr = helper.randomString(Math.ceil(Math.random() * 20));
        var pwd = helper.randomString(Math.ceil(Math.random() * 8));
        await authen.createNewUser(usr, pwd);
    }
});
router.get('/create/article', async (req, res) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');

    var i = 0;
    for (i; i < 1000; i++){
        var user = await db.collection('Users').aggregate([{$sample: {size: 1}}]).toArray();

        console.log(user);
        console.log(user[0]._id);
        console.log(user.usr);
        console.log(user.pwd);
        var article = {
            title: helper.randomString(Math.ceil(Math.random() * 10)),
            content: helper.randomString(Math.ceil(Math.random() * 1000)),
            category: Math.ceil(Math.random() * 5),
            uid: mongodb.ObjectId(user[0]._id).valueOf(),
            time: Date.now()
        };
        await db.collection('Articles').insertOne(article);
    }
    client.close();
    res.end('OK');
})
router.get('/nun', async (req, res) => {
    var oldpath =__dirname+ '/static/avatar/5f93a162ceaf713fd80dd22c.jpg';
    console.log(oldpath + 1);
    try {
        fs.renameSync(oldpath, oldpath);
    }
    catch (err) {
        if(err) {
            console.log("default");
        } else {
            console.log('UID');
        }
    }
})