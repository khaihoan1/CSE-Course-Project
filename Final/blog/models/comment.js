var url = 'mongodb://localhost:27017/final';
var opt = {useUnifiedTopology: true};
var mongodb = require('mongodb');

exports.getCommentByArticleId = async function(articleId){
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var cmt = await db.collection('Comment').find({articleId: articleId}).sort({time: -1}).toArray();
    return cmt;
}
exports.addComment = async function (comment){
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var rs = await db.collection('Comment').insertOne(comment);
    return rs.ops[0];
}