const express = require('express');
var router = express.Router();
var artigory = require('./models/artigory');
var authen = require('./models/authen');
var comment = require('./models/comment');
var mongodb = require('mongodb');
var helper = require('./helper');

module.exports = router;
// Create a new article
router.get('/create/', async (req, res) => {
    res.redirect('/');
})
router.get('/create/:uid', async (req, res) => {
    if (req.cookies.sessionId){
        if (req.params.uid){
            var session = await authen.getSessionByCookie(req.cookies.sessionId);
            if (session){
                var urlForUser = helper.addImageUrl(session.uid);
            }
            // res.render('article/create_article.njk', {
            res.render('article/article_create.njk', {
                title: 'Create new article',
                session: session,
                urlForUser: urlForUser
            });
        } else {
            res.redirect('/', {
                title: "BLOG"
            });
        }
    } else {
        res.redirect('/', {
            title: "BLOG"
        });
    }
})
router.post('/create/:uid', async (req, res) => {
    // SECURE??
    if (req.cookies.sessionId){
        var uid = req.params.uid;
        var session = await authen.getSessionByCookie(req.cookies.sessionId);
        if (session && session.uid == uid){
            var article = {
                title: req.body.title,
                content: req.body.content,
                category: parseInt(req.body.categ),
                uid: mongodb.ObjectId(uid),
                time: Date.now()
            };
        var article_id = await artigory.createArticle(article);
        res.redirect(`/article/detail/${article_id}`);
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
})
router.get("/detail/:article_id", async (req, res) => {
    article = await artigory.getArticlesByArticle_Id(req.params.article_id);
    article = await helper.modifyArticle(article);
    comments = await comment.getCommentByArticleId(req.params.article_id);
    console.log(comments);
    comments = await helper.modifyComments(comments);
    console.log(comments[0]);
    if (req.cookies.sessionId){
        var session = await authen.getSessionByCookie(req.cookies.sessionId);
        if(session){
            var urlForUser = helper.addImageUrl(session.uid);
        }
        res.render('article/article_detail.njk', {
            article: article,
            session: session,
            urlForUser: urlForUser,
            comments: comments
        });
    } else {
        res.render('article/article_detail.njk', {
            article: article,
            comments: comments
        });
    }  
});
