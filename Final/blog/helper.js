var categories = ["Sci & Tech", "Debate", "Sports", "Games", "Other Topics"];
var authen = require('./models/authen');
var fs = require('fs');
var DomParser = require('dom-parser');
function randonInt(n){
    return Math.floor(Math.random()*n);
}
function strip(html){
    let doc = new DomParser().parseFromString(html, 'text/html');
    return doc;
 }
exports.randomString = function (n){
    var a =[];
    var s = 'asdnKAJK^1234567890!@#$%^&*()/.zcabbnsd,masfNAS B<CMXA:LLKPEOIP;lqwpopl;dfkls';
    for (var i = 0; i < n; i++){
        a.push(s.charAt(randonInt(s.length)));
    }
    return a.join('');
}
exports.modifyArticles = async function (articles){
    var i = 0;
    var n = articles.length;
    for (i; i < n; i++){
    // Modify avatar
        var oldPath = __dirname + '/static/avatar/' + articles[i].uid + '.jpg';
        fs.rename(oldPath, oldPath, function(err){
            if(err){
                articles[i].img = 'default';
            } else {
                articles[i].img = articles[i].uid;
            }
        })
    // Modify time
        var time = articles[i].time;
        var d = new Date();
        d.setTime(time);
        articles[i].time = `${d.toDateString()} - ${d.toTimeString()}`;
    // Add username to show
        var user = await authen.getUserById(articles[i].uid)
        articles[i].username = user.usr;
    // Add text_demo
        // if (articles[i].content.length > 170){
        //     text_demo = articles[i].content.substring(0, 150);
        //     articles[i].text_demo = text_demo + '...';
        // } else {
        //     articles[i].text_demo = articles[i].content;
        // }
    // Add article's category
        articles[i].cate = categories[articles[i].category-1];                                                                  
    }
    return articles;
}
exports.modifyArticle = async function (article){
    // Modify avatar
        var oldPath = __dirname + '/static/avatar/' + article.uid + '.jpg';
        fs.rename(oldPath, oldPath, function(err){
            if(err){
                article.img = 'default';
            } else {
                article.img = article.uid;
            }
        })
    // Modify time
        var time = article.time;
        var d = new Date();
        d.setTime(time);
        article.time = `${d.toDateString()} - ${d.toTimeString()}`;
    // Add username to show
        var user = await authen.getUserById(article.uid)
        article.username = user.usr;
    // Add article's category
        article.cate = categories[article.category-1];                                                                  
    return article;
}
exports.getLimitArticles = async function (args){
    if (Object.keys(args).length == 3) {
        var articles = await args.func(args.n, args.skipNumber);
    } else {
        var articles = await args.func(args.n, args.skipNumber, args.category);
    }
    return articles;
}

exports.addImageUrl = function (uid){
    var oldPath = __dirname + '/static/avatar/' + uid + '.jpg';
    try {
        fs.renameSync(oldPath, oldPath);
    }
    catch (err){
        return 'default';
    }
    return uid;
}
exports.modifyComment = async function (obj){
    var user = await authen.getUserById(obj.uid);
    obj.user = user.usr;
    var time = obj.time;
    var d = new Date();
    d.setTime(time);
    obj.time = `${d.toDateString()} - ${d.toTimeString()}`;
    return obj;
}
exports.modifyComments = async function (comments){
    var i = 0;
    var n = comments.length;
    for (i; i < n; i++){
        // Modify avatar
        var oldPath = __dirname + '/static/avatar/' + comments[i].uid + '.jpg';
        fs.rename(oldPath, oldPath, function(err){
            if(err){
                comments[i].img = 'default';
            } else {
                comments[i].img = comments[i].uid;
            }
        })                                               
        var user = await authen.getUserById(comments[i].uid);
        comments[i].user = user.usr;
        var time = comments[i].time;
        var d = new Date();
        d.setTime(time);
        comments[i].time = `${d.toDateString()} - ${d.toTimeString()}`;
    }
    return comments;
}

    


