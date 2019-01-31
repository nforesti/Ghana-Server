/*
const scrape = require('website-scraper');
const options = {
  //urls: ['http://nodejs.org/'],
  urls: ['https://www.youtube.com/watch?v=ApXoWvfEYVU&start_radio=1&list=RDApXoWvfEYVU'],
  directory: './test2',
};
 
// with async/await
//const result = scrape(options);
 
// with promise
scrape(options).then((result) => {});
 
// or with callback
//scrape(options, (error, result) => {});
*/
var urlExists = require('url-exists');
var express = require('express');
var bodyParser = require('body-parser');
var youtubedl = require('youtube-dl');
var fs = require('fs');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

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
        
            
            // Access-Control-Allow-Origin: *

            res.send(url);
        }
        else {
            res.send("invalid url");
        }
    });
});
  
app.listen(3000);
  
console.log("listening on port 3000");