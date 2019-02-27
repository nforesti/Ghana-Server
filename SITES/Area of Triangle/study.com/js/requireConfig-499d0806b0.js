(function () {
	"use strict";

	//Copied this from remspect so we could make remspect decisions in here.
	var isInControlOfTest = function(factorName) {
		var factorsToVariations = {};

		var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)ssoe_debug\s*=\s*([^;]*).*$)|^.*$/, "$1");
		var ssoeRegex = /([^-]+)-([^\.]+)\.?/g;
		var match = ssoeRegex.exec(cookieValue);
		while (match !== null) {

			var factor = match[1];
			var variation = match[2];

			factorsToVariations[factor] = variation;

			match = ssoeRegex.exec(cookieValue);
		}

		return !factorsToVariations[factorName] || factorsToVariations[factorName] === 'control';
	};
	
	//'abc/def/ghi.controller': 'd646a69d4b' -> 'abc/def/ghi.controller': '/js/abc/def/ghi-d646a69d4b.controller'
	function convertAndAddPathEntries(encodedMap, destinationMap, hostPrefix) {
		if (hostPrefix.indexOf("/js/") > -1) {
			hostPrefix = hostPrefix.substring(0, hostPrefix.indexOf("/js/"));
		}
		
		var keys = Object.keys(encodedMap);
		for (var i=0; i < keys.length; i++) {
			var key = keys[i];
			var hash = encodedMap[key];
			var mappedPath = null;
			var dotIndex = key.indexOf(".");
			if (dotIndex === -1) {
				//util/abc -> /js/util/abc-123123
				mappedPath = hostPrefix + "/js/" + key + "-" + hash;
			}
			else {
				//util/abc.directive -> /js/util/abc-123123.directive
				var firstPartOfLookupKey = key.substring(0, dotIndex);
				var lastPartOfLookupKey = key.substring(dotIndex);
				
				mappedPath = hostPrefix + "/js/" + firstPartOfLookupKey + "-" + hash + lastPartOfLookupKey;
			}
			destinationMap[key] = mappedPath;
		}
	}
	
	//files that do not return the access-control-allow-origin header will freak out if you add crossorigin=anonymous attr
	var libsWithoutAccessControlHeader = [
		"lib/google/api",
		"lib/rejoiner",
		"lib/stripe",
	];
	
	var acceptJSURL = "https://js.authorize.net/v1/Accept";
	var element = document.querySelector("[data-remilon-env]");
	var env = element ? element.getAttribute("data-remilon-env") : "prod";
	var isInAngularControl = isInControlOfTest("ng17");
	var isInHttp2Control = isInControlOfTest("http2");
	
	var prefix = "";

	if (!isInHttp2Control) {
		if (env === "stage-aws") {
			//need ssl cert
			//prefix = "https://static.stage.study.com/js/";
		}
		else if (env === "prod-aws") {
			prefix = "https://static.study.com/js/";
		}
	}

	//default to prod in case some browser decides to be really dumb
	if (env.indexOf("prod") === -1) {
		//noinspection JSUnresolvedFunction,JSUnresolvedVariable
		acceptJSURL = "https://jstest.authorize.net/v1/Accept";
	}
	
	requirejs.onError = function(err) {
		window.globalUtils.logRequireOnError(err);
		throw err;
	};
	
	var paths = {
		"angularDependency": [
			isInAngularControl ?
			 "//ajax.googleapis.com/ajax/libs/angularjs/1.3.20/angular.min" :
			 "//ajax.googleapis.com/ajax/libs/angularjs/1.7.4/angular.min"
		],
		"bootstrap": [
			"//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min"
		],
		"jquery": [
			"//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min"
		],
		"lib/Q": [
			prefix + "lib/Q/q-2.0.2.min"
		],
		"lib/angular-sanitize": [
			isInAngularControl ?
			prefix + "lib/angular/angular-sanitize-1.3.13.min" :
			prefix + "lib/angular/angular-sanitize-1.7.4.min"
		],
		"lib/angular-storage": [
			prefix + "lib/angular/angular-storage-0.0.13.min"
		],
		"lib/angular/animate": [
			isInAngularControl ?
			 "//ajax.googleapis.com/ajax/libs/angularjs/1.3.20/angular-animate.min" :
			 "//ajax.googleapis.com/ajax/libs/angularjs/1.7.4/angular-animate.min"
		],
		"lib/angular/cookie": [
			isInAngularControl ?
			 "//ajax.googleapis.com/ajax/libs/angularjs/1.3.20/angular-cookies.min" :
			 "//ajax.googleapis.com/ajax/libs/angularjs/1.7.4/angular-cookies.min"
		],
		"lib/angular/drag-and-drop-lists": [
			prefix + "lib/angular/angular-drag-and-drop-lists-1.3.0.min"
		],
		"lib/angular/draganddrop": [
			prefix + "lib/angular/draganddrop.min"
		],
		"lib/angular/loading-bar": [
			"//cdnjs.cloudflare.com/ajax/libs/angular-loading-bar/0.7.1/loading-bar.min",
			prefix + "lib/angular/angular-loading-bar-0.7.1.min"
		],
		"lib/angular/resource": [
			"//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.21/angular-resource.min"
		],
		"lib/angular/rzslider": [
			prefix + "lib/angular/rzslider.min"
		],
		"lib/angular/touch": [
			prefix + "lib/angular/angular-touch-1.3.13.min"
		],
		"lib/angular/ui-bootstrap": [
			prefix + "lib/angular/ui-bootstrap-tpls-0.14.3"
		],
		"lib/angular/ui-router": [
			isInAngularControl ?
			 "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min" :
			 "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.20/angular-ui-router.min"
		],
		"lib/angular/ui-utils": [
			"//cdnjs.cloudflare.com/ajax/libs/angular-ui-utils/0.1.1/angular-ui-utils.min"
		],
		"lib/bluebird": [
			"//cdn.jsdelivr.net/bluebird/3.5.0/bluebird.core.min",
			prefix + "lib/bluebird/bluebird.core-3.5.0.min"
		],
		
		"lib/code-prettify": [
			"//cdn.rawgit.com/google/code-prettify/master/loader/prettify",
			prefix + "lib/code-prettify/prettify"
		],
		"lib/freshWidget": [
			"//s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget"
		],
		"lib/google/api": [
			"https://apis.google.com/js/platform" // must be loaded from google over ssl
		],
		"lib/hlsjs": [
			"//cdn.jsdelivr.net/npm/hls.js@latest?noext"
		],
		"lib/humane": [
			prefix + "lib/humane/humane-3.2.0.min"
		],
		"lib/jquery/bootstrap": [
			"//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"
		],
		"lib/jquery/bootstrap/datetimepicker": [
			prefix + "lib/jquery/bootstrap-datetimepicker.min"
		],
		"lib/jquery/bootstrap/jasny": [
			"//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/js/jasny-bootstrap.min"
		],
		"lib/jquery/cookie": [
			"//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min"
		],
		"lib/jquery/jqplot": [
			prefix + "lib/jquery/graphing/jquery.jqplot.min"
		],
		"lib/jquery/jqplot/bars": [
			prefix + "lib/jquery/graphing/jqplot.barRenderer.min"
		],
		"lib/jquery/lazyload": [
			prefix + "lib/jquery/lazyload"
		],
		"lib/jquery/purl": [
			"//cdnjs.cloudflare.com/ajax/libs/purl/2.3.1/purl.min"
		],
		"lib/jstz": [
			prefix + "lib/jstz/jstz.min"
		],
		"lib/modernizr": [
			prefix + "lib/modernizr/modernizr-3.3.1-custom"
		],
		"lib/ngMask": [
			prefix + "lib/angular/ngMask.min"
		],
		"lib/raphael": [
			prefix + "lib/raphael/raphael"
		],
		"lib/rejoiner": [
			"//cdn.rejoiner.com/js/v4/rj2.lib"
		],
		"lib/stripe": [
			"https://js.stripe.com/v2?noext" //stripe's url doesn't end in .js, so we stick a query param on the end.
		],
		"lib/accept": [
			acceptJSURL
		],
		"lib/tinymce": [
			"//cdnjs.cloudflare.com/ajax/libs/tinymce/4.4.3/tinymce.min"
		],
		"lib/tinymceui": [
			prefix + "lib/tinymce/tinymce-ui.min"
		],
		"lib/toastr": [
			prefix + "lib/toastr/toastr-2.1.1.min"
		],
		"lib/usmap": [
			prefix + "lib/usmap/jquery.usmap"
		],
		"lib/wistia": [
			"//fast.wistia.com/assets/external/E-v1"
		],
		"lscache": [
			prefix + "lib/lscache/lscache.min"
		],
		"mathjax": [
			"//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML"
		],
		"moment": [
			prefix + "lib/moment/moment.min"
		],
		"underscore": [
			"//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
			prefix + "lib/underscore/underscore-1.8.3.min"
		],
		"lib/jquery/guid": [
			prefix + "lib/jquery/guid"
		],
		// legacy "jquery tools" used for the leadforms (almost all of this is bootstrap, and you shouldn't use these
		"lib/jquery/legacy/hint": [
			prefix + "lib/jquery/legacy/hint.jquery"
		],
		"lib/jquery/legacy/migrate": [
			"//code.jquery.com/jquery-migrate-1.2.1.min"
		],
		"lib/jquery/legacy/tools": [
			prefix + "lib/jquery/legacy/jquery.tools.min"
		],
		"lib/jquery/legacy/tools/tooltip": [
			prefix + "lib/jquery/legacy/jquery.tools.tooltip.1.2.3"
		],
		"lib/jquery/ui": [
			prefix + "lib/jquery/jquery-ui-1.12.1-custom.min"
		],
		"lib/jquery-mask": [
			prefix + "lib/jquery-mask/jquery.mask.min"
		],
	};
	
	if (window.studyJsMappings) {
		convertAndAddPathEntries(window.studyJsMappings, paths, prefix);
	}
	else if (window.studyJsMappings == null) {
		console.error("js mappings not available. versioned files will not be used");
	}
	
	requirejs.config({
		onNodeCreated: function (node, config, module, path) {
			if ((node.src != null)
			 && !(node.src.indexOf(window.location.origin) === 0) //startsWith
			 && libsWithoutAccessControlHeader.indexOf(module) === -1) {
				node.setAttribute('crossorigin', 'anonymous');
			}
		},
		baseUrl: "/js",
		waitSeconds: 30,
		//BUNDLE_GO_HERE
		paths: paths,
		map: {
			//These modules have common names used by other modules, so we need a mapping from the study.com "lib/" convention to the module's AMD name.
			'*': {
				'lib/underscore': 'underscore',
				'lib/lscache': 'lscache',
				'lib/moment': 'moment',
				'angularDependency': 'angular/util/angularExceptionLogger',
				'util/value-proxy': 'util/value-pro',
				"eventLogging": "logging/eventLogging"
			},
			'lib': {
				'angularDependency': 'angularDependency'
			},
			'angular/util/angularExceptionLogger': {
				'angularDependency': 'angularDependency'
			},
			'angular/util/angularExceptionLoggerWithTemplates': {
				'angularDependency': 'angularDependency'
			},
			'lib/angular/rzslider': {
				'angular': 'angularDependency'
			},
			'lib/angular/ui-router': {
				'angular': 'angularDependency'
			}
		},
		shim: {
			//angular doesn't require jquery, as it has it's own jQLite when jquery is missing. Our code assumes it has access to full jquery, though .
			"angularDependency": {
				deps: ["jquery"],
				exports: "angular"
			},
			"bootstrap": ["jquery"],
			
			"lib/angular-sanitize": ["angularDependency"],
			"lib/angular-storage": ["angularDependency"],
			"lib/angular/animate": ["angularDependency"],
			"lib/angular/cookie": ["angularDependency"],
			"lib/angular/drag-and-drop-lists": ["angularDependency"],
			"lib/angular/draganddrop": ["angularDependency"],
			"lib/angular/loading-bar": ["angularDependency"],
			"lib/angular/resource": ["angularDependency"],
			"lib/angular/touch": ["angularDependency"],
			"lib/angular/ui-bootstrap": ["angularDependency", "lib/angular/animate", "lib/angular/touch", "lib/jquery/bootstrap"],
			"lib/angular/ui-router": ["angularDependency"],
			"lib/angular/ui-utils": ["angularDependency"],
			"lib/code-prettify": {
				exports: "PR"
			},
			"lib/freshWidget": {
				exports: "FreshWidget"
			},
			"lib/google/api": ["google/google-parse-tags-config"],
			"lib/jquery/bootstrap": ["jquery"],
			"lib/jquery/bootstrap/jasny": ["lib/jquery/bootstrap"],
			"lib/jquery/jqplot": ["jquery"],
			"lib/jquery/jqplot/bars": ["lib/jquery/jqplot"],
			"lib/jquery/lazyload": ["jquery"],
			"lib/jquery/mask/jquery.mask": ["jquery"],
			"lib/jquery/legacy/hint": ["jquery"],
			"lib/jquery/legacy/migrate": ["jquery"],
			"lib/jquery/legacy/tools": ["jquery", "lib/jquery/legacy/migrate"],
			"lib/jquery/legacy/tools/tooltip": ["lib/jquery/legacy/tools"],
			"lib/jquery/purl": ["jquery"],
			"lib/jquery/ui": ["jquery"],
			"lib/jquery-mask": ["jquery"],
			"lib/modernizr": {
				exports: "Modernizr"
			},
			"lib/ngMask": ["angularDependency"],
			"lib/Q": {
				exports: "Q"
			},
			"lib/stripe": {
				exports: "Stripe",
				init: function () {
					if (env.indexOf("prod") !== -1) {
						//noinspection JSUnresolvedFunction,JSUnresolvedVariable
						this.Stripe.setPublishableKey("pk_live_iliKBs0kFwP1aXfKSfAYB0JT");
					}
					else {
						//noinspection JSUnresolvedFunction,JSUnresolvedVariable
						this.Stripe.setPublishableKey("pk_test_am41P9owJPqEG8VYW31ifWEY");
					}
				}
			},
			"lib/accept": {
				exports: "Accept",
				init: function() {
					if (env.indexOf("prod") !== -1) {
						//noinspection JSUnresolvedFunction,JSUnresolvedVariable
						Accept.authData = {
							apiLoginID: '5dm2LT7w',
							clientKey: '7KTJUj8Yd3Ukn6VLPxDb39bwbtH7PskHAwNwg64DYCCxf2Aef5cM3UAvS9CqeAHS'
						};
					}
					else {
						//noinspection JSUnresolvedFunction,JSUnresolvedVariable
						Accept.authData = {
							apiLoginID: '4Mj2k2kRbsBg',
							clientKey: '2Z2xH2h4DQYKUTb9x4rD2HXpkm285HL93YT6qfBPxY7xH7z564GyNgwcknQtd7jv'
						};
					}
					return Accept;
				}
			},
			"lib/tinymceui": ["angularDependency", "lib/tinymce"],
			"lib/toastr": ["jquery"],
			"lib/usmap": ["jquery", "lib/raphael"],
			"lib/wistia": {
				deps: ["jquery"],
				exports: "Wistia"
			},
			
			/*importanté: inlineMath and displayMath are the delimiters. they have to match whats being used in the CMS. so if you change here, change in CMS as well*/
			"mathjax": {
				exports: "MathJax",
				init: function () {
					MathJax.Hub.Config(
					 {
						 jax: ["input/TeX", "output/CommonHTML"],
						 extensions: ["tex2jax.js"],
						 TeX: {extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]},
						 asciimath2jax: {
							 delimiters: [["{am}", "{/am}"]]
						 },
						 tex2jax: {
							 displayMath: [["$$", "$$"]],
							 inlineMath: [["{eq}", "{/eq}"]],
							 processEnvironments: false,
							 skipTags: ["script", "noscript", "style", "textarea", "pre", "code"]
						 },
						 messageStyle: "none",
						 showMathMenu: false,
						 showMathMenuMSIE: false
					 }
					);
					MathJax.Hub.Startup.onload();
					return MathJax;
				}
			}
		}
	});
})();
