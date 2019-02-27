/**
 * Created by gbehrend on 11/26/2018.
 */
(function() {
	"use strict";
	window.globalUtils = {
		logLimit : 100,
		getRequestGuid: function() {
			var requestGuidElement = document.querySelector("meta[name=requestGuid]");
			var requestGuid;
			if (typeof requestGuidElement === 'undefined' || !requestGuidElement) {
				requestGuidElement = document.getElementById("requestGuid");
				requestGuid = requestGuidElement ? requestGuidElement.value : "";
			}
			else {
				requestGuid = requestGuidElement.getAttribute("content");
			}
			return requestGuid;
		},
		generateGuid: function() {
			Date.now = Date.now || function() {
				 return +new Date();
			 };
			var d = Date.now();
			return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
			});
		},
		//these are used in the script tags below
		requireConfigError: function(event) {
			var exception = {};
			exception.message = "error loading require config file";
			exception.sourceJavascript = '<remilon:versionify resourceLocation="${jsHost}" path="/js/requireConfig.js" />';
			exception.lineNumber = 0 + ':' + 0;
			globalUtils.logError(exception, "fileload");
		},
		requireError: function(event) {
			var exception = {};
			exception.message = "require.js failed to load";
			exception.sourceJavascript = "//cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.min.js";
			exception.lineNumber = 0 + ':' + 0;
			window.globalUtils.logError(exception, "require");
		},
		logRequireOnError: function(error) {
			var exception = {};
			exception.name = error.requireType;
			exception.message = error.message;
			exception.stack = error.stack;
			window.globalUtils.logError(exception, "requireOnError");
		},
		onError: function(message, url, lineNumber) {
			var exception = {};
			exception.message = message;
			exception.sourceJavascript = url;
			exception.lineNumber = lineNumber;
			exception.type = 'preEventTracking';
			window.globalUtils.logError(exception, "javascriptError")
		},
		logError: function(exception, type) {
			var loggableEvent = {};
			try {
				var urlCapture = /\((.+?):(\d+):(\d+)/g;
				var matchUrl = urlCapture.exec(exception.stack);
				if (matchUrl && matchUrl.length == 4) {
					var url = matchUrl[1];
					var line = matchUrl[2];
					var col = matchUrl[3];
					loggableEvent.sourceJavascript = url;
					loggableEvent.lineNumber = line + ':' + col;
				}
			}
			catch (e) {
				loggableEvent.sourceJavascript = exception.sourceJavascript;
				loggableEvent.lineNumber = exception.lineNumber;
			}

			function truncateLog(text) {
				return (text && text.length > 4000) ? text.substring(0, 4000) + "....[truncated]" : text;
			}

			loggableEvent.eventType = "javascriptError";
			loggableEvent.message = truncateLog(exception.message);
			loggableEvent.url = window.location.href;
			loggableEvent.name = exception.name;
			loggableEvent.stacktrace = truncateLog(exception.stack);
			loggableEvent.javascriptUUID = window.globalUtils.generateGuid();
			loggableEvent.pageRequestGuid = window.globalUtils.getRequestGuid();
			loggableEvent.type = type;
			loggableEvent.javascriptTimestamp = new Date().getTime();
			if(window.globalUtils.logLimit > 0){
				window.globalUtils.logLimit--;
				var request = new XMLHttpRequest();
				request.open("POST", "/eventLogger/eventLog.ajax");
				request.setRequestHeader("Content-Type", "application/json");
				request.send(JSON.stringify([loggableEvent]));
			}

		}
	};
	window.onerror = window.globalUtils.onError;
})();