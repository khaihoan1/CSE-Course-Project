var express = require('express');
var mongodb = require('mongodb');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fileUpload = require ('express-fileupload');
var fs = require('fs');
var path = require('path');

var nunjucks = require('nunjucks');

var views = require('./indexcontroller');
var authen = require('./authencontroller');
var user = require('./usercontroller');
var test = require('./test');
var artigory = require('./artigorycontroller');
var comment = require("./commentcontroller");

var app = express();
// app.engine('html', handlebars({extname: '.html'}));
// app.set('view engine', 'html');
// app.engine('.hbs', handlebars({ defaultLayout: 'main', extname: '.hbs'}))
// app.set('view engine', '.hbs');
// app.engine('handlebars', handlebars());
// app.set('view engine', 'handlebars');
nunjucks.configure(__dirname + '/views', {
    autoescape: true,
    express: app
});


app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb',
}));
app.use(express.static('static'));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/static/tmp'
}));

app.listen(5000);

app.use('/', views);
app.use('/user', user);
app.use('/authen', authen);
app.use('/test', test);
app.use('/article', artigory);
app.use('/comment', comment);



