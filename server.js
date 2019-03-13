const app = require('express')();
const http = require('http').Server(app);

const fs = require('fs');
const bodyParser = require('body-parser');
const urlExists = require('url-exists');

const download = require('./download');

app.set('view engine', 'pug')

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({ extended: true })); 

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/** Serving pages */
app.get('/', function(req, res){
  res.sendFile(__dirname + '/html/aboutpage.html');
});

app.get('/html/*', function(req, res) {
  // serving all regular pages
  res.sendFile(__dirname + req.url);  
})

/** Serving CSS */
app.get('/css/*', function(req, res) {
  res.sendFile(__dirname + req.url);
})

/** Serving JS */
app.get('/JS_Libraries/*', function(req, res) {
  res.sendFile(__dirname + req.url);
})

/** Serving Display page */
app.get('/list/*', function(req, res) {
  // Serving download display page
  fs.readFile("JSON/files.json", (err, data) => {
    if ( err ) {
      console.error("ERROR ACCESSING FILES (JSON/files.json):"+ err)
      res.send("ERROR ACCESSING FILES (JSON/files.json):"+ err);
      return;
    }

    let grade = req.query.grade.substring(6);

    switch(grade) {
      case '1':
        grade = "First";
        break;
      case '2':
        grade = "Second";
        break;
      case '3':
        grade = "Third";
        break;
      case '4':
        grade = "Fourth";
        break;
      case '5':
        grade = "Fifth";
        break;
      case '6':
        grade = "Sixth";
        break;
    }

    let math = [];
    let reading = [];
    let science = [];

    let siteList = JSON.parse(data);

    Object.keys(siteList).forEach((key) => {
      if ( (siteList[key].grades).includes(req.query.grade) ) {
        if ( siteList[key].subjects.includes("math") ) {
          math.push({
            link: key,
            description: siteList[key].description,
            dueDate: siteList[key].dueDate
          });
        }
        else if ( siteList[key].subjects.includes("reading") ) {
          reading.push({
            link: key,
            description: siteList[key].description,
            dueDate: siteList[key].dueDate
          });
        }
        else if ( siteList[key].subjects.includes("science") ) {
          science.push({
            link: key,
            description: siteList[key].description,
            dueDate: siteList[key].dueDate
          });
        }
      }
    })
    
    if ( req.query.subject === 'math' ) {
      res.render('displayPage', {
        title: grade + " Grade Links",
        subject: "Math",
        links: math
      })
    }
    else if ( req.query.subject === 'science' ) {
      res.render('displayPage', {
        title: grade + " Grade Links",
        subject: "Science",
        links: science
      })
    }
    else if ( req.query.subject === 'reading' ) {
      res.render('displayPage', {
        title: grade + " Grade Links",
        subject: "Reading",
        links: reading
      })
    }
  })
})

/** Serving downloaded sites */
app.get('/SITES/*', function(req, res) {
  let parsed = req.url.replace( /%20/g, ' ');

  let index = parsed.indexOf('?');
  let url = ( index === -1 ) ? parsed : parsed.substring(0, parsed.indexOf('?'));

  console.log("SERVING: ", parsed);
  res.sendFile(__dirname + url);
})


//------------------------------- HANDLES QUERIES ----------------------------//

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
        
        fs.writeFileSync("JSON/downloadQueue.json", JSON.stringify(queue,null, 4));

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
}, 2000);

const updateAvailable = () => {
  console.log("Download Complete:", available.name);
  available = {
    avail: true,
    name: ''
  };
}