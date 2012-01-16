/*
(C) Copyright MarketLive. 2006. All rights reserved.
MarketLive is a trademark of MarketLive, Inc.
Warning: This computer program is protected by copyright law and international treaties.
Unauthorized reproduction or distribution of this program, or any portion of it, may result
in severe civil and criminal penalties, and will be prosecuted to the maximum extent
possible under the law.
*/

	/**
	 * Sets the current tab to its on state and other other tabs to their off states,
	 * it also displays the tabs associated content. 
	 * @param {String} sTabID This is the string ID of the active tab.
	 * @param {String} sTabName This is the name of the active tab.
	 */
	function setActiveTab(sTabID, sTabName){
		/** A DOM ref to the tab content block element. */
		var oTabContent = document.getElementById("tabContent");
		/** A DOM ref to the tab's assocated content. */
		var oNewContent = document.getElementById(sTabID+"_content");
		/** A DOM ref to the active tab. */
		var oTab = document.getElementById(sTabID);

		
    // set the current tab state to On and the others to Off
    // works for both text and img tabs
    for(var i=0; i<oTab.parentNode.childNodes.length; i++){
        var tempNode = oTab.parentNode.childNodes[i];
        if (tempNode.id && tempNode.id.indexOf("tab_") != -1){
            var oImg = getTabImg(tempNode.id, tempNode);
            if (tempNode.id == sTabID){
                tempNode.className="infoTabOn";
                if (oImg) oImg.src = eval(oImg.id+"_ON.src");
            } else {
                tempNode.className="infoTabOff";
                if (oImg) oImg.src = eval(oImg.id+"_OFF.src");
            }
        }
    }
  
		// call for tab tracking
		tabTracking(sTabID, sTabName);

		// display the content associated wit the active tab
		oTabContent.innerHTML = oNewContent.innerHTML;
	}

	/**
	 * Gets a DOM image object ref for the active tab if one exists.  
	 * @param {String} sTabID This is the string ID of the active tab.
	 * @param {Object} oTab This is a DOM ref to the active tab.
	 * @return A DOM image object ref or null if one could not be found.
	 * @type Object 
	 */
	function getTabImg(sTabID, oTab){
		/** An image object. */
		var oImage = null;

		// Loop through the tab's child nodes checking for an image that matches the active tab's ID.
		for (var i=0; i<oTab.childNodes.length; i++){
			var oTempNode = oTab.childNodes[i];
			if (oTempNode.tagName == "IMG" && oTempNode.id && oTempNode.id == sTabID +"_IMG"){
				oImage = oTempNode;
			}
		}

		return oImage;
	}

	/**
	 * Creates an image object with a give source string.  
	 * @param {String} sImgSrc This is the string to be used as the image's srouce.
	 * @return An image object.
	 * @type Object 
	 */
	function createImg(sImgSrc){
		/** A new image object. */
		var newImg = new Image();

		// update the image's source.
		newImg.src = sImgSrc;

		return newImg;
	}

	/**
	 * Passes along tab view/click data to reporting function(s) if they exist.  
	 * @param {String} sTabID This is the string ID of the active tab.
	 * @param {String} sTabName This is the name of the active tab.
	 */	
	function tabTracking(sTabID, sTabName){
		// only make the call to report the tab view if reportTabViewToOmniture exists 
		// (reportTabViewToOmniture exists only if omniture is enabled) 
		if (typeof(reportTabViewToOmniture) != "undefined") reportTabViewToOmniture(sTabID, sTabName);
	}