var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var sceneRelease = require('parse-torrent-name');
var sceneReleaseBackup = require('scene-release');


var Q            = require('q');
var Subtitle     = require('./app/OpenSubtitles');
var subtitleApi  = new Subtitle();
var downloadSubtitle = require('./app/SubtitleDownloader');

/*
Q.fcall(subtitleApi.connect())
    .then(subtitleApi.logIn('CommanderSub', 'yY9oSnSYt9', 'OSTestUserAgent'))
    .then(subtitleApi.searchSubtitles('Mr.Robot.S01E01.PROPER.720p.HDTV.X264-DIMENSION', 1, 1, 'hun', 1))
    .then(function passSourceAndOutputParams(response) {
        return {
            source: response.data[0].SubDownloadLink,
            destination: './example_data/example_sub.srt'
        };
    })
    .then(downloadSubtitle)
    .then(function (downloadStatus) {
        var response = {
            writable: downloadStatus.writable,
            path: downloadStatus.path,
            mode: downloadStatus.mode,
            flags: downloadStatus.flags
        };
        console.log(response);
    })
    .catch(function (error) {
        console.log('errors', error);
    })
    .done();
*/

/*
 fs.exists('./example_data/mr.robot.101.720p-dimension.mkv', function (exists) {
 if (!exists) {
 return console.error('Error message:', '"' + err.message + '"');
 }
 console.log('Got it!');
 });
 */

var app = express();

var routes = require('./routes/index');
//var users  = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/* end */

module.exports = app;
