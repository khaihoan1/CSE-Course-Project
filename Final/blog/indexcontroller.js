const express = require('express');
var router = express.Router();
const authen = require('./models/authen');
const artigory = require('./models/artigory');
var helper = require('./helper');
var mongodb = require('mongodb');
var fs = require('fs');
var nunjucks = require('nunjucks');
nunjucks.configure(__dirname + '/views', {
    autoescape: true,
});

module.exports = router;

categories = ["Sci & Tech", "Debate", "Sports", "Games", "Others"];

router.get('/', async (req, res) =>{
    if (req.cookies.sessionId){
        var session = await authen.getSessionByCookie(req.cookies.sessionId);
        if (session != null) {
            var urlForUser = helper.addImageUrl(session.uid);
            res.render('index.njk', {
                title: "BLOG",
                session: session,
                urlForUser: urlForUser
            });
        } else {
            res.clearCookie('sessionId');
            res.render('index.njk', {title: "BLOG"});
        }    
    } else {
        res.render('index.njk', {title: "BLOG"});
    }
});
router.get('/category/:cate', async (req, res) => {
    var n = 7;
    var category = parseInt(req.params.cate);
    var session = await authen.getSessionByCookie(req.cookies.sessionId);
    if (session){
        var urlForUser = helper.addImageUrl(session.uid);
    }
    var articles = await artigory.getArticlesByCategory(n, 0, category);
    articles = await helper.modifyArticles(articles);
    res.render('article_sorted/sortedlimit.njk', {
        title: categories[category-1].toUpperCase(),
        articles: articles,
        session: session,
        urlForUser: urlForUser,
        urlForAjax: `/category/${category}/`
    });
})
router.get('/category/:cate/:n', async (req, res) => {
    var n = 7;
    var category = parseInt(req.params.cate);
    var skipNumber = parseInt(req.params.n);
    var args={
        n: n,
        skipNumber: skipNumber,
        func: artigory.getArticlesByCategory,
        category: category
    }
    var articles = await helper.getLimitArticles(args);
    articles = await helper.modifyArticles(articles);
    if(articles){
        var loadmore = nunjucks.render("article_sorted/loadmore.njk", {articles: articles});
        res.send(loadmore);
    } else {
        res.send('No more articles');
    }
})
router.get('/newest', async (req, res) => {
    var n = 7;
    var session = await authen.getSessionByCookie(req.cookies.sessionId);
    // console.log(`UIDDDD: ${session.uid}`);
    if (session){
        var urlForUser = helper.addImageUrl(session.uid);
    }
    if (!req.query.n){
        var articles = await artigory.getArticlesByTime(n, 0);
        articles = await helper.modifyArticles(articles);
        console.log(articles[0]);
        res.render('article_sorted/sortedlimit.njk', {
            title: "Newest articles",
            session: session,
            articles: articles,
            urlForAjax: '/newest?n=',
            urlForUser: urlForUser
        })
    }   
    else {
        var skipNumber = parseInt(req.query.n);
        console.log(`SKIP NUMBER: ${skipNumber}`);
        var args={
            n: n,
            skipNumber: skipNumber,
            func: artigory.getArticlesByTime
        }
        var articles = await helper.getLimitArticles(args);
        articles = await helper.modifyArticles(articles);
        if(articles){
            var loadmore = nunjucks.render("article_sorted/loadmore.njk", {articles: articles});
            res.send(loadmore);
        } else {
            res.send('No more articles');
        }
    }}) 
    
router.get('/random', async (req, res) => {
    var article = await artigory.getArticleRandomly();
    article = await helper.modifyArticle(article);
    var session = await authen.getSessionByCookie(req.cookies.sessionId);
    if(session){
        var urlForUser = helper.addImageUrl(session.uid);
    }
    res.render('article/article_detail.njk', {
        session: session,
        urlForUser: urlForUser,
        article: article
    });
})

