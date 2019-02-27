   function newImage(arg) {
   	if (document.images) {
   		rslt = new Image();
   		rslt.src = arg;
   		return rslt;
   	}
   }

   function changeImages() {
   	if (document.images && (preloadFlag == true)) {
   		for (var i=0; i<changeImages.arguments.length; i+=2) {
   			document[changeImages.arguments[i]].src = changeImages.arguments[i+1];
   		}
   	}
   }

   
   function printView()
   {
		var url = location.href;
		if (url.indexOf("?") == -1)
		{
			window.open(url + "?print=yes");
		}
		else
		{
			window.open(url + "&print=yes");
		}
   }

   function doActivateQuickLinks()
   {
	/*
		 Initialize and render the Menu when its elements are ready 
		 to be scripted.
		 
		 onContentReady
		 onAvailable
	*/
	
	YAHOO.util.Event.onAvailable("quicklinks", function () {
	
		/*
			 Instantiate a Menu:  The first argument passed to the 
			 constructor is the id of the element in the page 
			 representing the Menu; the second is an object literal 
			 of configuration properties.
		*/
	
		var oMenu = new YAHOO.widget.Menu("quicklinks", { 
												position: "dynamic", 
												hidedelay:  2000, 
												minscrollheight: 1000,
												lazyload: true });
	
		/*
			 Call the "render" method with no arguments since the 
			 markup for this Menu instance is already exists in the page.
		*/
		
		oMenu.render();            
	
	});
   }
		
		
		

   function doActivateTopNav()
   {
	/* Top Nav Menubar*/
	
	/*
	 Initialize and render the MenuBar when its elements are ready 
	 to be scripted.
	*/
	
	YAHOO.util.Event.onAvailable("NavTopBar", function () {
	
		/*
			 Instantiate a MenuBar:  The first argument passed to the 
			 constructor is the id of the element in the page 
			 representing the MenuBar; the second is an object literal 
			 of configuration properties.
		*/
		
		var oMenuBar = new YAHOO.widget.MenuBar("NavTopBar", { 
													autosubmenudisplay: true, 
													hidedelay: 2000, 
													minscrollheight: 600,
													lazyload: true });
		
		
		/*
			 Call the "render" method with no arguments since the 
			 markup for this MenuBar instance is already exists in 
			 the page.
		*/
		
		oMenuBar.render();
		$('NavTopBarContainer').style.display = 'inline';
	});	
   }