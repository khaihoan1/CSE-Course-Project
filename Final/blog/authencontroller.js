var express = require('express');
var router = express.Router();
var authen = require('./models/authen');
var helper = require('./helper');


module.exports = router;

router.post('/signup', async (req, res) => {
    usr = req.body['usr'];
    pwd = req.body.pwd;
    rpwd = req.body.rpwd;
    var existUsername = await authen.existUsername(usr);
    if (existUsername == false){
        if (pwd == rpwd){
            var new_user_id = await authen.createNewUser(usr, pwd);
            var cookievalue = helper.randomString(16)
            var cookie = {
                cookievalue: cookievalue,
                uid: new_user_id,
                username: usr
            };
            authen.createSession(cookie);
            res.cookie("sessionId", cookievalue, {maxAge: 60*60*24*1000*30});
            res.send("1");
        } else {
            res.send("2");
        } 
    } else {
        res.send("0");
    }    
});
router.get('/signout', async (req, res) => {
    uid = req.cookies.sessionId;
    await authen.deleteSession(uid);
    res.clearCookie('uid');
    res.redirect('/');
});
router.post('/login', async (req, res) => {
    var usr = req.body.usr;
    var pwd = req.body.pwd;
    var rmb = parseInt(req.body.rmb);
    var user = await authen.authenticate(usr, pwd);
    if (user){
        cookievalue = helper.randomString(16);
        var cookie = {
            cookievalue: cookievalue,
            uid: user._id,
            username: user.usr
        };
        authen.createSession(cookie);
        if (rmb == 1){
            // res.cookie("sessionId", cookievalue, {expire: 360000 + Date.now()});
            res.cookie("sessionId", cookievalue, {maxAge: 60*60*24*1000*30});
        } else {
            res.cookie("sessionId", cookievalue);
        }
        res.send('OK');
    } else {
        res.send("Wrong");
    }
});

router.get("/change/:uid", async (req, res) => {
    if(req.cookies.sessionId){
        if (req.params.uid){
            var session = await authen.getSessionByCookie(req.cookies.sessionId);
            var urlForUser = helper.addImageUrl(session.uid);
            if (session){
                res.render('user/changepass.njk', {
                    title: 'Change the password',
                    session: session,
                    urlForUser: urlForUser
                });
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

router.post('/change/:uid', async (req, res) => {
    var uid = req.body.uid;
    var npwd = req.body.npwd;
    var rnpwd = req.body.rnpwd;
    if(npwd != rnpwd){
        res.send("not equal");
    } else {
        if (req.cookies.sessionId){
            var session = await authen.getSessionByCookie(req.cookies.sessionId);
            console.log(session && session.uid == uid);
            if (session && session.uid == uid){
                // Check if user, password are correct
                var opwd = req.body.opwd;
                console.log(`opwd: ${opwd}`);
                user = await authen.getUserById(session.uid);
                console.log(user.usr, user.pwd);
                console.log(`sosanh: ${authen.passwordCompare(user.usr, opwd, user.pwd)}`);
                if (authen.passwordCompare(user.usr, opwd, user.pwd)){
                    await authen.changePassword(uid, user.usr, npwd);
                    res.send('Ok');
                } else {
                    res.send('Old pass invalid');
                }
            } else {
                res.send('Not authorized');
            }
        } else {
            res.send('Not authorized');
        }
    }
    

})
