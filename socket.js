const app = require('express')();
const http = require('http').Server(app);

/*** WILL NEED TO LOCK SCOPE ***/
const io = require('socket.io')(http);
const fs = require('fs');
const bodyParser = require('body-parser');
const urlExists = require('url-exists');
const shell = require('shelljs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/reg?*', function(req, res) {
  let url = req.url.substring(req.url.indexOf('?url=')+5);

  console.log("LINK REQUEST DETECTED:", url);

  urlExists(url, function(err, exists) {
      if ( exists) {
          
          //shell.exec('httrack -r1 -%i '+url);
          //-*p3 = save all files

          //shell.exec('httrack ' + url + '-O ./TESTSITES');

          res.setHeader("Access-Control-Allow-Origin", "*");
          res.send(url);

          /*** This likes to stall and take forever to download for -rN where N >= 2 ***/
          /* N controls the depth of the mirror (aka recursive depth) */
          shell.exec('httrack ' + url + ' -O ' + url + ' --verbose -r1 +*', 
            (error, stdout, stderr) => {

              /* SET UP SOCKET */
              
              console.log("Error: ", error);
              console.log("Stdout:", stdout);
              console.log("Stderr:", stderr);
          })
      }
      else {

        io.sockets.emit('hi', 'everyone');

          console.error('invalid url');
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.send("invalid url");
      }
  })
})

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


app.get('/video', function(req, res) {
  const path = './myvideo.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});