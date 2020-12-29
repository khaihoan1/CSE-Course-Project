const express = require('express');
var router = express.Router();
var artigory = require('./models/artigory');
var authen = require('./models/authen');
var comment = require('./models/comment');
var mongodb = require('mongodb');
var helper = require('./helper');
var nunjucks = require('nunjucks');

module.exports = router;

router.post('/add', async (req, res) => {
    var obj = {
        uid: req.body.uid,
        articleId: req.body.articleId,
        comment: req.body.comment,
        time: Date.now()
    }
    var result = await comment.addComment(obj);
    result = await helper.modifyComment(result);
    result.imageUrl = helper.addImageUrl(obj.uid);
    result = nunjucks.render("article/comment.njk", {comment: result});
    res.send(result);
})