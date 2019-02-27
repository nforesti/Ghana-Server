(function() {
	"use strict";

	var requireDeps = ['jquery', 'eventLogging', "util/remspect"];

    /*todo: conditionally load remVideo if they are in hlsjs test AND we have a video to load with hlsjs*/
	/*might be better to do this in redesignmain.jsp */


    /**
     * @param $
     * @param eventLogging
     * @param remspect
     */
	function init($, eventLogging, remspect, RemVideo) {

		//wistia queue and fire event when video ready
		window._wq = window._wq || [];
		window._wistiaVideos = window._wistiaVideos || [];

		window._wq.push({
			id: "_all", onReady: function (video) {
				var videoLoadReadyEvent = new eventLogging.LoggableEvent("videoLoad", false);
				eventLogging.queueEvent(videoLoadReadyEvent);
			}
		});

		window._wq.push({
			id: "_all",
			options: {
				plugin: {
					"captions-v1": {
						onByDefault: false,
						language: 'eng' // default to English captions
					}
				}
			}
		});

		if (!remspect.isControl("teacherVideoNotes")) {
			require(["video/teacherNotes/teacher-notes-plugin"], function(TeacherNotesPlugin) {
				window._wq.push({
					id: "_all", onReady: function (video) {
						new TeacherNotesPlugin(video);
					}
				});
			});
		}

		window._wq.push({
			id: "_all", onReady: function (video) {
				window._wistiaVideos.push(video);

				var event = document.createEvent("CustomEvent");
				event.initCustomEvent("wistiaVideoReady", true, false, {video: video});
				document.dispatchEvent(event);
			}
		});

		// Document Ready
		$(document).ready(function () {

			// select wistia embeds
			$('.wistia_embed').each(function () {

				// lookup id and options from data attributes
				var embedElement = $(this);
				// using attr instead of data to ensure wistiaId is a String. rarely, there will be an id that is all numbers (no letters) and will be passed as an int. this causes js error
				var wistiaId = embedElement.attr('data-wistiaid');
				var options = embedElement.data('wistiaoptions');
				var features = embedElement.data();


                if(RemVideo) {
					new RemVideo(wistiaId, options, features, this);
                }

            });
		});
	}
    require(["util/remspect"], function(remspect) {
        if(remspect.isControl("hlsjs") || !document.querySelector("[data-has-hls-video]")){
            requireDeps.push("video/remVideo");
        }

        require(requireDeps, init);
    });
})();
