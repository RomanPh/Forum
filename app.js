var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var fs = require('fs')
var morgan = require('morgan')

require('./server/config/passport.js')(passport);

const MongoStore = require('connect-mongo')(session);
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/server/access.log', {flags: 'a'});
var app = express();
var sessionTime = 15*60*1000; //ms
/*
var mongoStore = new MongoStore({
    url: 'mongodb://localhost/forum',
    ttl: 30
});
mongoStore.on('create', function (session) {
    console.log('session was created ' + session);
    console.dir(session);
    // session was destroyed
});
mongoStore.on('destroy', function (session) {
    console.log('session was destroyed ' + session);
    // session was destroyed
});*/
// Configure Express
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({ secret: 'secret', cookie: { maxAge: sessionTime }, resave: true, saveUninitialized: true }));
/*app.use(session({
    secret: 'foo',
    store: mongoStore,
    resave: true,
    saveUninitialized: true
}));*/

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

require('./server/config/mongoose.js');
require('./server/routers/index')(app, passport);
// Start the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});