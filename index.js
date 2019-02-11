const urlExists = require('url-exists');
const app = require('express')();
const bodyParser = require('body-parser');
const shell = require('shelljs');

//const youtubedl = require('youtube-dl');
const fs = require('fs');

const http = require('http').createServer(app);
const io = require('socket.io').listen(http);


//?????????/
/*
var socket = require('socket.io-client')('http://localhost');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
*/




app.use(bodyParser.urlencoded({ extended: false }));

// YOUTUBE VIDEO CRAWLER
/*
app.get('/youtube*', function(req, res) {

    console.log(req.url);

    let url = req.url.substring(req.url.indexOf('?url=')+5);

    urlExists(url, function(err, exists) {
        if ( exists ) {
            // CHECK URL FOR YOUTUBE.COM/___
            
            var video = youtubedl(url,
                // Optional arguments passed to youtube-dl.
                ['--format=18'],
                // Additional options can be given for calling `child_process.execFile()`.
                { cwd: __dirname }
            );
        
            // Will be called when the download starts.
            video.on('info', function(info) {
                console.log('Download started');
                console.log('filename: ' + info.filename);
                console.log('size: ' + info.size);
            });
            
            video.pipe(fs.createWriteStream('myvideo.mp4'));

            res.send(url);
        }
        else {
            res.send("invalid url");
        }
    });
});
*/

// REGULAR LINK CRAWLER
app.get('/api/reg?*', function(req, res) {
    let url = req.url.substring(req.url.indexOf('?url=')+5);

    console.log("LINK REQUEST DETECTED:", url);

    urlExists(url, function(err, exists) {
        if ( exists) {
            
            //shell.exec('httrack -r1 -%i '+url);
            //-*p3 = save all files
            // Visual for SOME httrack commands/modifiers

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(url);
        }
        else {
            console.error('invalid url');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("invalid url");
        }
    })
})
  
//app.listen(3000);

io.on('connection', function(socket){
    console.log('SOCKET: USER CONNECTED');

    socket.emit('request', /* … */); // emit an event to the socket
    io.emit('broadcast', /* … */); // emit an event to all connected sockets
    socket.on('reply', () => { /* … */ }); // listen to the event
});
  
http.listen(3000, function(){
    console.log('listening on *:3000');
});
  