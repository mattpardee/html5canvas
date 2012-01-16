//JAVA SCRIPT functions for modal pop up windows
// initializae the the
 var POP_Width=0, POP_Height=0;
 var POP_ScrOfX=0, POP_ScrOfY=0;
 var pageW=960;
 var py=0;
 var dnsp=false; //Popup will remain static on the window when scrolled
 var reloadIt=false;//PArent will not reload
 var t=".png";
 var popVisibleDivID = null;
 var laodingContent="Loading...Please Wait!";

  var browser = navigator.appName;//detecting browser IE 6 and below
    var version = navigator.appVersion;
    if ( browser== "Microsoft Internet Explorer" )
        {
        var version1 = version.substring(22,25);
        var sisop = version.substring(26,41);
		if (parseInt(version1)<7){
			t=".gif";
		}
    }
 function POP_Win_Prop() {
    POP_Width = jQuery(window).width();
    POP_Height = jQuery(window).height();
	POP_ScrOfY = jQuery(document).scrollTop();
    POP_ScrOfX = jQuery(document).scrollLeft();
}

function rLoad(x){
document.getElementById("popLoad").style.display="none";
	x.style.visibility="visible";
}

function rRemove(){
	document.getElementById("popLoad").style.display="block";
}

function openCustomQuickView(url,wwidth,wheight,wresize) {
	ORM_Pop(wheight,wwidth,'','',url,'','','close_on_outside_click','auto');
}

 function POP_Pop_Create(objpop){
	var pPID="";
	py+=1;
	document.getElementById("popdiv").style.display="block";
	if (objpop.pID && typeof(objpop.pID) != "undefined") pPID = objpop.pID;
	var pBG=document.createElement("DIV");
	pBG.className="pBG";
	pBG.style.zIndex=1001+py;
	POP_Win_Prop();
	pBG.style.top=POP_ScrOfY+"px";
	pBG.style.left=POP_ScrOfX+"px";
	pBG.id="ipopbg"+pPID+py;
	popVisibleDivID = pPID+py;
	document.getElementById("popdiv").appendChild(pBG);

	var pP=document.createElement("DIV");
	
	// var dHeight=parseInt(objpop.pHeight)+43, dWidth=parseInt(objpop.pWidth)+20;
	var dHeight=parseInt(objpop.pHeight), dWidth=parseInt(objpop.pWidth);
	
	// var iHeight=parseInt(objpop.pHeight)-2;
	var iHeight=parseInt(objpop.pHeight);
	var ifHeight=parseInt(objpop.pHeight)-30;

	// var iWidth=parseInt(objpop.pWidth)-2;
	var iWidth=parseInt(objpop.pWidth);
	var ifWidth=parseInt(objpop.pWidth)-30;


	if (isNaN(objpop.pTop/objpop.pTop)){
		var dTop=((POP_Height-parseInt(objpop.pHeight))/2)+POP_ScrOfY;
	}
	else {
		var dTop=parseInt(POP_ScrOfY)+parseInt(objpop.pTop);
	}
	if (isNaN(objpop.pLeft/objpop.pLeft)){
		var dLeft=((POP_Width-parseInt(objpop.pWidth))/2)+POP_ScrOfX;
	}
	else {
		var dLeft=((POP_Width-pageW)/2)+parseInt(objpop.pLeft);
	}
	
	pP.style.position="absolute";
	pP.style.zIndex=1001+py;
	pP.style.height=dHeight+"px";
	pP.style.width=dWidth+"px";
	pP.style.top=dTop+"px";
	pP.style.left=dLeft+"px";
	pP.style.overflow="hidden";
	pP.id="ipop"+pPID+py;
	var d=new Date();
	var fID="lPopFrame"+pPID+py;
	var scrl="no";
	if(objpop.pSC)scrl=objpop.pSC;

	pP.innerHTML='' + 
		'<table border="0" cellspacing="0" cellpadding="0">' +
		'<tr>' + 
		// '<div id="popCL" style="width:'+dWidth+'px;">' + 
		// '<a id="cl"><img src="/images/oreilly/en_us/local/localgraphics/popClose.gif" alt="Close" border="0"></a>' +
		// '</div>' + 
		'	<td><img src="/mod/productquickview/includes/themes/pqv/TL_Main.png" /></td>' + 
		'	<td style="background:url(/mod/productquickview/includes/themes/pqv/T_Main.png)"><img src="/mod/productquickview/includes/themes/pqv/T_Main.png" /></td>' + 
		'	<td><img src="/mod/productquickview/includes/themes/pqv/TR_Main.png" /></td>' + 
		'</tr>' + 
		'<tr>' + 
		'	<td style="background:url(/mod/productquickview/includes/themes/pqv/L_Main.png)"><img src="/mod/productquickview/includes/themes/pqv/L_Main.png" /></td>' + 
		'	<td style="background-color:#FFFFFF;padding:' + objpop.tP + " " + objpop.rP + " " + objpop.bP + " " + objpop.lP + ';">'+
		'		<div id="popLoad" style="position:absolute;width:' + ifWidth + 'px;height:' + ifHeight + 'px;z-index:100;">' +
		'			<div>' + laodingContent + '</div>' + 
		'		</div>' +
		'		<iframe scrolling="' + scrl + '" src="" frameborder="0" height="' + ifHeight + '" width="' + ifWidth + '" id="' + fID + '" name="' + fID + '" style="visibility:hidden;background-color: #FFFFFF;" closeP="" onload="javascript:rLoad(this);"></iframe>' +
		'	</td>' + 
		'	<td style="background:url(/mod/productquickview/includes/themes/pqv/R_Main.png)"><img src="/mod/productquickview/includes/themes/pqv/R_Main.png" /></td>' + 
		'</tr>' + 
		'<tr>' + 
		'	<td><img src="/mod/productquickview/includes/themes/pqv/BL_Main.png" /></td>' + 
		'	<td style="background:url(/mod/productquickview/includes/themes/pqv/B_Main.png)"><img src="/mod/productquickview/includes/themes/pqv/B_Main.png" /></td>' + 
		'	<td><img src="/mod/productquickview/includes/themes/pqv/BR_Main.png" /></td>' + 
		'</tr>' + 
		'</table>'; 
	
	pBG.pop=pP;
	
	document.getElementById("popdiv").appendChild(pP);
	document.getElementById(fID).src=objpop.source;
	document.getElementById(fID).contentWindow.pop=pBG;

	objpop.pBG=pBG;
	objpop.pF=document.getElementById(fID);
	objpop.close=function(){
		document.getElementById("popdiv").removeChild(pBG.pop);
		document.getElementById("popdiv").removeChild(pBG);
		py-=1;
		delete objpop;
		if(!py){
		}
		if(reloadIt){document.location.reload(true);reloadIt=false;}
	}
	if(objpop.pTP=="close_on_outside_click"){pBG.onclick=objpop.close;}
	document.getElementById(fID).closeP=objpop.close;
	// document.getElementById("cl").onclick=objpop.close;
	}

function ORM_Pop(pH,pW,pT,pL,pS,pID,pST,pTP,pSC){
	this.pHeight=pH;
	this.pWidth=pW;
	this.pTop=pT;
	this.pLeft=pL;
	this.pType=pTP;
	this.source=pS;
	this.pID=pID;
	this.sourceType=pST;
	this.pSC=pSC; //close_on_outside_click
	this.pTP=pTP; //auto
	POP_Pop_Create(this);
 }
function wf(){
	POP_Win_Prop();
	if(py>0){
		for(i=1;i<=py;i++){
				if(dnsp){
					document.getElementById("ipopbg" + i).style.top=POP_ScrOfY+"px";
					document.getElementById("ipopbg" + i).style.left=POP_ScrOfX+"px";
				}
				else{
					document.getElementById("ipopbg" + i).style.top=POP_ScrOfY+"px";
					document.getElementById("ipopbg" + i).style.left=POP_ScrOfX+"px";
					document.getElementById("ipop"  + i).style.top=((POP_Height-parseInt(document.getElementById("ipop" + i).style.height))/2)+POP_ScrOfY+"px";
					document.getElementById("ipop" + i).style.left=((POP_Width-parseInt(document.getElementById("ipop" + i).style.width))/2)+POP_ScrOfX+"px";
				}
			}
		}
}
window.onscroll=wf;
window.onresize=wf;

