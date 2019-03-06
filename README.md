# SchoolHouse Ghana Web Server

__HOW TO RUN:__  
    bash deploy.sh (Will work on making this an executable)  
    navigate to localhost:3000 to view  


*** GENERAL DEVELOPMENT NOTES ***  
__Flow of data for download queue:__  
downloadQueue -> downloadQueue.json -> download.js -> files.json  
https://docs.google.com/document/d/  13heu4vK2OfDJkcxBbfYzQ-bOZI_pIzu2_mopADX0gTo/edit?usp=sharing  
MUST HAVE VALID downloadQueue.json AND files.json PRESENT  

__How the server is set up:__
* ExpressJS is the core of the backend system. This server.js utilizes ExpressJS to
    communicate through http requests with the webpage loaded on the client's laptop.
    Webpages, css, images, and all other forms of communcation or transfer of 
    data are served by parsing http requests and responding accordingly.
    *    Useful link on ExpressJS:
            https://medium.com/@LindaVivah/the-beginners-guide-understanding-node-js-express-js-fundamentals-e15493462be1
     * Formatting of links:
        *  HTML files: href="/html/<name_of_file.html>"
        *  CSS: href="/css/<name_of_file.css>"
*  PugJS is a template library for creating dynamic HTML pages. By using PugJS, we can 
    create a basic HTML file and populate the page with the necessary texts, links,
    images, etc. 
    *    One use case in this project for PugJS are the display pages of content
            for downloaded sites. Here, the only differences between the various pages
            are grade level, subject, and links.    


__Notes on Httrack:__  
    FAQ: http://www.httrack.com/html/faq  
    Brief + visual manual: https://www.httrack.com/html/step9_opt2.html  
    full manual found with "man httrack"  
    Known to be troublesome sites: http://www.httrack.com/html/faq.html#Q0  


*** LOGISTICAL NOTES ***
URL: http://schoolhouseghana:3000/
