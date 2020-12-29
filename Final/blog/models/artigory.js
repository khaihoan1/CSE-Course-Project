var url = 'mongodb://localhost:27017/final';
var opt = {useUnifiedTopology: true};
var mongodb = require('mongodb');

exports.createArticle = async (article) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var article = await db.collection('Articles').insertOne(article);
    client.close();
    return article.ops[0]._id;
}
exports.getArticlesByArticle_Id = async (article_id) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var article = await db.collection('Articles').findOne({_id: mongodb.ObjectId(article_id)});
    client.close();
    return article;
}
exports.getArticlesByCategory = async (n, skipNumber, category) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var articles = await db.collection('Articles').find({category: category}).sort({time: -1}).skip(skipNumber*n).limit(n).toArray();
    client.close();
    return articles;
}
exports.getArticlesByTime = async (n, skipNumber) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    console.log(`skip In getArt: ${skipNumber}`);
    var articles = await db.collection('Articles').find().sort({time: -1}).skip(skipNumber*n).limit(n).toArray();
    client.close();
    return articles;
}
exports.getArticleRandomly = async () => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var article = await db.collection('Articles').aggregate([{$sample: {size: 1}}]).toArray();
    client.close();
    return article[0];
}
exports.getArticlesByUser = async (uid) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var articles = await db.collection('Articles').find({uid: mongodb.ObjectId(uid)}).sort({time: -1}).toArray();
    client.close();
    return articles;
} 


