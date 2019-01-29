const shell = require('shelljs');

if ( process.argv.length != 3 ) {
    console.log("please specify a URL");
    return;
}
shell.exec('./crawler.sh ' + process.argv[2], (code, output) => {

    console.log(output);
});

