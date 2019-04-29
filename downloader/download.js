const shell = require('shelljs');
const fs = require('fs');
const utubedl = require('youtube-dl');

const httrackWrap = (data, updateAvailable) => {
    console.log("Static Page Download:", data);
    //-*p3 = save all files

    /*** This likes to stall and take forever to download for -rN where N >= 2 ***/
    /* N controls the depth of the mirror (aka recursive depth) */
    shell.exec('httrack ' + data.url + ' -O ./CONTENT/\"' + data.name + '\" -r2 +*', {silent: true}, (avail = updateAvailable) => {
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
  
const youtubeDownloader = (data, updateAvailable) => {
    console.log("Youtube Video Download");

    var video = youtubedl(data.url, ['--format=18'], { cwd: __dirname });
 
    // Will be called when the download starts.
    video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
    });
    
    video.pipe(fs.createWriteStream('myvideo.mp4'));
}

module.exports = {
    httrack: httrackWrap,
    youtube: youtubeDownloader
}