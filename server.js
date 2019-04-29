const app = require('express')();
const http = require('http').Server(app);
const fs = require('fs');

app.set('view engine', 'pug')

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

