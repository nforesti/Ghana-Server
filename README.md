SSH info:
admin@132.239.189.105
globalties

HOW TO RUN:
bash deploy.sh
navigate to localhost:3000 to view

Flow of data:
downloadQueue -> downloadQueue.json -> download.js -> files.json
https://docs.google.com/document/d/13heu4vK2OfDJkcxBbfYzQ-bOZI_pIzu2_mopADX0gTo/edit?usp=sharing
**MUST HAVE VALID downloadQueue.json AND files.json PRESENT**


***Need to implement refresh mechanics, httrack commands, file management, download progress***
Notes on Httrack:
READ THE FAQ: http://www.httrack.com/html/faq
Brief + visual manual: https://www.httrack.com/html/step9_opt2.html
full manual found with "man httrack"
Knwon to be troublesome sites: http://www.httrack.com/html/faq.html#Q0


use Socket.io for live updates on download progress (integration of frontend with backend)
https://stackoverflow.com/questions/9914816/what-is-an-example-of-the-simplest-possible-socket-io-example


NOTES for further development:
starting, stopping, and restarting apache server
sudo /etc/init.d/apache2 <start, stop, restart>

Running RESTful API's with Nodejs servers (useful for paths/urls + file
management)
https://www.youtube.com/watch?v=P4mT5Tbx_KE


*** NOTES ***
URL: http://schoolhouseghana:3000/
