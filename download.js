const shell = require('shelljs');
const fs = require('fs');

function httrackWrap(data, updateAvailable) {
    console.log("DATA:", data);
    //shell.exec('httrack -r1 -%i '+url);
    //-*p3 = save all files
  
    //shell.exec('httrack ' + url + '-O ./TESTSITES');
  
    /*** This likes to stall and take forever to download for -rN where N >= 2 ***/
    /* N controls the depth of the mirror (aka recursive depth) */
    shell.exec('httrack ' + data.url + ' -O ./SITES/\"' + data.name + '\" -r2 +*', {silent: true}, (avail = updateAvailable) => {
        updateAvailable();
        

        fs.readFile("JSON/files.json", (err, files) => {
            if ( err ) {
            console.err("ERROR ACCESSING FILES (JSON/files.json):", err);
            return;
            }

            let tmp = {};
            // Object.assign(JSON.parse(data), NEW FILE PATH)
            tmp[data.name] = data;
            // INCLUDE FILE PATH
            fs.writeFileSync("JSON/files.json", 
                                JSON.stringify(Object.assign(tmp, JSON.parse(files)), 
                                null, 4
                            ));
        })
  
    });
}
  

  
//   app.get('/video', function(req, res) {
//     const path = './myvideo.mp4'
//     const stat = fs.statSync(path)
//     const fileSize = stat.size
//     const range = req.headers.range
//     if (range) {
//       const parts = range.replace(/bytes=/, "").split("-")
//       const start = parseInt(parts[0], 10)
//       const end = parts[1] 
//         ? parseInt(parts[1], 10)
//         : fileSize-1
//       const chunksize = (end-start)+1
//       const file = fs.createReadStream(path, {start, end})
//       const head = {
//         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//         'Accept-Ranges': 'bytes',
//         'Content-Length': chunksize,
//         'Content-Type': 'video/mp4',
//       }
//       res.writeHead(206, head);
//       file.pipe(res);
//     } else {
//       const head = {
//         'Content-Length': fileSize,
//         'Content-Type': 'video/mp4',
//       }
//       res.writeHead(200, head)
//       fs.createReadStream(path).pipe(res)
//     }
//   });

const youtubeDownloader = data => {
    console.log("YOUTUBE DOWNLOADER");
}

module.exports = {
    httrack: httrackWrap,
    youtube: youtubeDownloader
}