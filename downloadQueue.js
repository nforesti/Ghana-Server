const app = require('express')();
const http = require('http').Server(app);

const fs = require('fs');
const bodyParser = require('body-parser');
const urlExists = require('url-exists');

const download = require('./download');

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.css', function(req, res) {
  res.sendFile(__dirname + '/index.css');
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/** 
 * HANDLES DOWNLOAD REQUESTS 
 * NEEDS TO BE SECURED BY USERNAME/PASSWORD TO PREVENT STUDENTS FROM ACCESSING
 */
app.post('/api/download', function(req, res) {
  //res.setHeader("Access-Control-Allow-Origin", "*");

  urlExists(req.body[Object.keys(req.body)[0]].url, (err, exists) => {

    var cont = true;
    if ( exists ) {
      fs.readFile("files.json", (error, files) => {
        if ( error ) {
          res.send("ERROR READING DOWNLAODED FILES (files.json):" + error)
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

        fs.readFile("downloadQueue.json", (err, data) => {
          if ( err ) {
            res.send("ERROR ACCESSING DOWNLOAD QUEUE (downloadQueue.json):"+ err);
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
            fs.writeFileSync("downloadQueue.json", 
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

/**
 * Manages current download
 */
var available = {
  avail: true,
  name: '',
};
setInterval(() => {
  if ( available.avail ) {
    fs.readFile("downloadQueue.json", (err, data) => {
      if ( err ) {
        console.error("ERROR ACCESSING DOWNLOAD QUEUE (downloadQueue.json):", err)
        return;
      }

      let queue = JSON.parse(data);
      if ( Object.keys(queue).length !== 0 ) {
        const key = Object.keys(queue)[0];
        const val = queue[key];

        // Determine download type
        if ( queue[key].url.indexOf("youtube") === -1 ) {
          download.httrack(val, updateAvailable);
        }
        else {
          download.youtube(val, updateAvailable);
        }
        delete queue[key];
        
        fs.writeFileSync("downloadQueue.json", JSON.stringify(queue,null, 4));

        available = {
          avail: false,
          name: val.name
        };
      }
    })
  }
  else {
    console.log("Download in progress:", available.name);
  }
}, 5000);

const updateAvailable = () => {
  console.log("Download Complete:", available.name);
  available = {
    avail: true,
    name: ''
  };
}