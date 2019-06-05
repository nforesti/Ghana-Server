const app = require('express')();
const http = require('http').Server(app)

const fs = require('fs');
const bodyParser = require('body-parser')
const urlExists = require('url-exists')
const open = require('open')

const download = require('./download')

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({ extended: true })); 

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var queueDownload = {}
var currDownload = {}
var completedDownload = {}

//open('http://localhost:3000', {app: 'firefox'});

open('http://localhost:3000');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/Source/downloadPage.html');
})

app.get('/css', function(req, res) {
  res.sendFile(__dirname + '/Source/downloadPage.css')
})

app.get('/axios', function(req, res) {
  res.sendFile(__dirname + '/axios.js')
})

/** 
 * HANDLES DOWNLOAD REQUESTS 
 * NEEDS TO BE SECURED BY USERNAME/PASSWORD TO PREVENT STUDENTS FROM ACCESSING
 */
app.post('/api/download', function(req, res) {
  //res.setHeader("Access-Control-Allow-Origin", "*");
  urlExists(req.body[Object.keys(req.body)[0]].url, (err, exists) => {

    var cont = true;
    if ( exists ) {
      fs.readFile("JSON/files.json", (error, files) => {
        if ( error ) {
          res.send("ERROR READING DOWNLAODED FILES (JSON/files.json):" + error)
          cont = false;
          return;
        }

        Object.keys(JSON.parse(files)).forEach((key) => {
          if ( key === Object.keys(req.body)[0]) {
            res.send("INVALID NAME - ALREADY IN USE");
            console.error("INVALID NAME - ALREADY IN USE");
            cont = false;
            return;
          }
        })

        fs.readFile("JSON/downloadQueue.json", (err, data) => {
          if ( err ) {
            res.send("ERROR ACCESSING DOWNLOAD QUEUE (JSON/downloadQueue.json):"+ err);
            cont = false;
            return;
          }

          Object.keys(JSON.parse(data)).forEach((key) => {
            if ( key === Object.keys(req.body)[0]) {
              res.send("INVALID NAME - NAME IS ALREADY IN QUEUE");
              console.error("INVALID NAME - NAME IS ALREADY IN QUEUE");
              cont = false;
              return;
            }
          })

          if ( cont ) {
            fs.writeFileSync("JSON/downloadQueue.json", 
                          JSON.stringify(Object.assign(JSON.parse(data), req.body),
                          null, 4)
                        );
          }
        });
      })
    }
    else {
      console.error('invalid url', err);
      res.send("invalid url");
    }
  })
})

app.get("/api/nav/*", function(req, res) {
  res.statusCode = 302;
  res.setHeader("Location", req.url.substring(9, req.url.length));
  res.end();
})

app.get("/api/update", function(req, res) {
  fs.readFile("JSON/files.json", (err, data) => {
    if ( err ) {
      console.error("ERROR ACCESSING FILES.JSON");
      return;
    }

    completedDownload = JSON.parse(data);
    fs.writeFileSync("JSON/files.json", JSON.stringify(completedDownload, null, 4))
  })

  res.statusCode = 200;
  res.send([completedDownload, currDownload, queueDownload]);
  res.end();
})

/**
 * Manages current download
 */
var available = {
  avail: true,
  name: '',
};
setInterval(() => {
  if ( available.avail ) {
    fs.readFile("JSON/downloadQueue.json", (err, data) => {
      if ( err ) {
        console.error("ERROR ACCESSING DOWNLOAD QUEUE (JSON/downloadQueue.json):", err)
        return;
      }

      queueDownload = JSON.parse(data);

      if ( Object.keys(queueDownload).length !== 0 ) {
        const key = Object.keys(queueDownload)[0];
        currDownload = queueDownload[key];

        currDownload["complete"] = "Downloading"

        // Determine download type
        if ( queueDownload[key].url.indexOf("youtube") === -1 ) {
          download.httrack(currDownload, updateAvailable);
        }
        else {
          download.youtube(currDownload, updateAvailable);
        }
        delete queueDownload[key];
        
        fs.writeFileSync("JSON/downloadQueue.json", JSON.stringify(queueDownload,null, 4));

        available = {
          avail: false,
          name: currDownload.name
        };
      }
    })
  }
  else {
    console.log("Download in progress:", available.name);
  }
}, 2000);

const updateAvailable = () => {
  console.log("Download Complete:", available.name);
  available = {
    avail: true,
    name: ''
  };
}