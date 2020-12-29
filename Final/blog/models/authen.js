var url = 'mongodb://localhost:27017/final';
var opt = {useUnifiedTopology: true};
var mongodb = require('mongodb');
var crypto = require('crypto');

exports.createNewUser = async (usr, pwd) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var newUsers = {usr: usr, pwd: crypto.createHash('md5').update(pwd + usr + "jh34/.,").digest('hex')};
    var result = await db.collection('Users').insertOne(newUsers);
    client.close();
    return result.ops[0]._id;
}
exports.changePassword = async (uid, usr, npwd) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var pwd = crypto.createHash('md5').update(npwd + usr + "jh34/.,").digest('hex');
    var cond = {_id: uid};
    var update = {$set: {pwd: pwd}};
    console.log(`sdsdsdsd: ${cond}, ${update}`);
    // var result = await db.collection('Users').updateOne(cond, update);
    var result = await db.collection('Users').updateOne({_id: mongodb.ObjectId(uid)}, {$set: {'pwd': pwd}});
    console.log(result.result);
    client.close();
}
exports.existUsername = async (usr) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var existUsername = await db.collection('Users').findOne({usr: usr});
    client.close();
    if (existUsername == null){
        return false;
    } else {
        return true;
    }
}
exports.getUserById = async (uid) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var user = await db.collection('Users').findOne({_id: mongodb.ObjectId(uid)});
    return user;
}
exports.createSession = async (cookie) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    await db.collection('Session').insertOne(cookie);
    client.close();
    console.log("Successfully created session");
}
exports.deleteSession = async (uid) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    await db.collection('Session').deleteOne({cookievalue: uid});
    client.close();
}
exports.getSessionByCookie = async (randomCookie) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    var session = await db.collection('Session').findOne({cookievalue: randomCookie});
    return session;
}
exports.authenticate = async (usr, pwd) => {
    var client = mongodb.MongoClient(url, opt);
    await client.connect();
    var db = client.db('final');
    pwd = crypto.createHash('md5').update(pwd + usr + "jh34/.,").digest('hex');
    var user = await db.collection('Users').findOne({'usr': usr, 'pwd': pwd});
    client.close();
    return user;
}
exports.passwordCompare = (usr, pwd, pwd_crypted) => {
    console.log(crypto.createHash('md5').update(pwd + usr + "jh34/.,").digest('hex'));
    if (crypto.createHash('md5').update(pwd + usr + "jh34/.,").digest('hex') == pwd_crypted){
        return true;
    } else {
        return false;
    }
}



