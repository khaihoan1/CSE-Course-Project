const express = require('express');
var router = express.Router();
var authen = require('./models/authen');
var artigory = require('./models/artigory');
var helper = require('./helper');
const { urlencoded } = require('body-parser');



module.exports = router;

router.get('/avatar', async (req, res) => {
    if (req.cookies.sessionId){
        var session = await authen.getSessionByCookie(req.cookies.sessionId);
        if (session){
            var urlForUser = helper.addImageUrl(session.uid);
            res.render('user/uploadavatar.njk', {
                session: session,
                uploadavatar_inform: "Choose a picture",
                urlForUser: urlForUser
            });
        } else {
            res.redirect('/');
        }

    } else {
        res.redirect("/");
    }
})
router.post('/avatar', async (req,res) => {
    if (req.cookies.sessionId){
        if (!req.files){
            res.redirect('/user/avatar', {
                uploadavatar_inform: "You have to choose a picture"
            });
        } else {
            var uid = req.body.uid;
            var session = await authen.getSessionByCookie(req.cookies.sessionId);
            if (session && session.uid == uid){
                var file = req.files.avatarfile;
                file.mv(__dirname + `/static/avatar/${uid}.jpg`, function(err){
                    if(err){
                        res.render('user/uploadavatar.njk', {
                            session: session,
                            uploadavatar_inform: "Failed, try again",
                            urlForUser: uid
                        })
                    } else {
                        res.render('user/uploadavatar.njk', {
                            session: session, 
                            uploadavatar_inform: "Avatar updated",
                            urlForUser: uid
                        })
                    }
                })
            } else {
                res.redirect('/');
            }
        }   
    } else {
        res.redirect('/');
    }

    // if (!req.files){
    //     res.end("no files");
    //     console.log(req.body.avatarfile.data);
    // } else {
    //     // console.log(req.files.avatarfile.tempFilePath);
    //     var file = req.files.avatarfile;
    //     var name = helper.randomString(16);
    //     file.mv(__dirname + `/static/avatar/${name}.jpg`, function(err){
    //         if (err){
    //             console.log(err);
    //             // var old = req.files.avatarfile.tempFilePath;
    //             var newpath = __dirname + '/static/avatar/' + req.files.avatarfile.name;
    //             console.log(newpath);
    //             fs.writeFile(newpath, req.files.avatarfile.data, function(err){
    //                 console.log(err);
    //             } )
    //             // fs.rename(old, newpath, function(){
    //                 console.log('here');
    //             // });
    //             res.end('not ok');
    //         }
    //         res.end('OK');
    //     })
    // }
})
router.get('/articles/:uid', async (req, res) => {
    var uid = req.params.uid;
    console.log(uid);
    var articles = await artigory.getArticlesByUser(uid);
    console.log(articles);
    articles = await helper.modifyArticles(articles);
    var session = await authen.getSessionByCookie(req.cookies.sessionId);
    if (session){
        var urlForUser = helper.addImageUrl(session.uid);
    }
    res.render('article_sorted/sortednolimit.njk', {
        session: session,
        articles: articles,
        urlForUser: urlForUser
    });
})
router.get('/:uid', async (req, res) => {
    var uid = req.params.uid;
    var session = await authen.getSessionByCookie(req.cookies.sessionId);
    if (session){
        var urlForUser = helper.addImageUrl(session.uid);
    }
    var userToShow = await authen.getUserById(uid);
    var userImageURL = helper.addImageUrl(uid);
    console.log(userToShow);
    res.render('user/profile.njk', {
        session: session,
        user: userToShow,
        urlForUser: urlForUser,
        userImageURL: userImageURL
    });
})




