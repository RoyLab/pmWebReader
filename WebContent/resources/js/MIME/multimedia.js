
///////////////////////////////////////////////////////////////////////////////
//功能描述：多媒体
//作者：wanghai
//日期：2009-7-2
///////////////////////////////////////////////////////////////////////////////
function playSound(soundObject)
{
	document.getElementById("WindowsMediaPlayer").controls.stop();
	document.getElementById("WindowsMediaPlayer").URL = soundObject.file;
	document.getElementById("WindowsMediaPlayer").controls.play();
}


function loadMultimedia(mediaObject)
{
	
	var ext = getExt(mediaObject.file);
	ext = ext.toUpperCase();
	var viewType=top.ApplicationContext.UserInfo.GetICNViewType(ext);
	try
	{
        switch (viewType){
            case "windowsmedia":
                playWindowsMedia(mediaObject);
                break;
            case "quicktimemedia":
		        playQuicktimeMedia(mediaObject);
                break;
            case "flash":
                playFlash(mediaObject);
                break;
            case "pdf":
                displayPdf(mediaObject);
                break;
            case "officedocument":
                openOfficeDocument(mediaObject);
                break;
            }
	    }
	    catch(e)
	    {
	        throw e;
	    }
                    
//	try{ 
//	        if(ext == "WMV" || ext == "AVI" || ext == "MPG" || ext == "MPEG"||ext == "MP3" ||ext == "WMA" ){
//		        playWindowsMedia(mediaObject);
//	        }
//	        else if(ext == "MOV"){
//		        playQuicktimeMedia(mediaObject);
//	        }
//	        else if(ext == "SWF"){
//		        playFlash(mediaObject);
//	        }
//	        else if(ext == "PDF"){
//		        displayPdf(mediaObject);
//	        }
//	        else if(ext == "DOC" || ext == "DOCX" || ext == "PPT" || ext == "PPTX" || ext == "XLS" || ext == "XLSX" ){
//		        openOfficeDocument(mediaObject);
//	        }
//	    }
//	    catch(e)
//	    {
//	        throw e;
//	    }
}

function playWindowsMedia(mediaObject)
{
	if (document.getElementById('mainForm:dmImage').style.visibility == "hidden"){
		showFigurePanel();		
	}
	
	var imgDiv = document.getElementById('mainForm:imageDiv');
	var windowsMediaObject;
	if(!mediaObject.fullscreen)
	     windowsMediaObject = "<div><object id ='axCGM' classid='CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6'  width='100%' height='100%' ><param name='autoStart' value='1'/><param name='EnablePositionControls' value='1'/><param name='EnableTracker' value='1'/><param name='url' value='"+mediaObject.file+"'/></object></div>";
	else
	     windowsMediaObject = "<div><object id ='axCGM' classid='CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6'  width='100%' height='100%' ><param name='autoStart' value='1'/><param name='EnablePositionControls' value='1'/><param name='EnableTracker' value='1'/><PARAM NAME='fullScreen' VALUE='1'><param name='displaysize' value='3'/><param name='url' value='"+mediaObject.file+"'/></object></div>";
	imgDiv.innerHTML = windowsMediaObject;
}

function playQuicktimeMedia(mediaObject)
{
	if (document.getElementById('mainForm:dmImage').style.visibility == "hidden"){
		showFigurePanel();		
	}
		
	var quickTimeObject = "<object id ='axCGM' classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' width='100%' height='100%' codebase='http://www.apple.com/qtactivex/qtplugin.cab'>" +
	"<param name='src' value='"+mediaObject.file+"'>" +
	"<param name='autoplay' value='true'>" +
	"<param name='controller' value='false'>" +
	"<embed src='"+mediaObject.file+"' width='320' height='288' autoplay='true' controller='false'" +
	"pluginspage='http://www.apple.com/quicktime/download/'></embed></object>";
	
	
	var imgDiv = document.getElementById('mainForm:imageDiv');
	imgDiv.innerHTML = quickTimeObject;	
}


function playFlash(mediaObject){
	var imgDiv = document.getElementById('mainForm:imageDiv');
    //测试控件是否存在
    try{
           var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
    }
    catch(e)
    {
        imgDiv.innerHTML = '<br><br><center><p style="font:bold 16px 微软雅黑;color:gray">有错误，没有找到flash控件</p></center>';
        return;
    }
    
	if (document.getElementById('mainForm:dmImage').style.visibility == "hidden"){
		showFigurePanel();		
	}

    var flashObject;
    if(!mediaObject.fullscreen)
	    flashObject = "<object id ='axCGM' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0'"+
	"width='100%' height='100%' ><param name=movie value='"+mediaObject.file+"'><param name=quality value=high><param name=bgcolor value=#FFFFFF><embed src='"+mediaObject.file+"' quality=high bgcolor=#FFFFFF width='100%' height='100%'"+
	"name='myMovieName' align='' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer'></embed>"+
	    "<center>" +
            "<p style=\"font:bold 16px 微软雅黑;color:gray\">控件加载失败</p>" +
        "</center>" +
	"</object>"; 
    else
        flashObject = "<object id ='axCGM' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0'"+
	"width='100%' height='100%' ><param name='movie' value='"+mediaObject.file+"'><param name='quality' value='high'><param name='allowFullScreen' value='true'><param name='bgcolor' value='#FFFFFF'><embed src='"+mediaObject.file+"' allowFullScreen='true' quality='high' bgcolor='#FFFFFF' width='100%' height='100%'"+
	"name='myMovieName' align='' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer'></embed>"+
	    "<center>" +
            "<p style=\"font:bold 16px 微软雅黑;color:gray\">控件加载失败</p>" +
        "</center>" +
	"</object>"; 
	
	imgDiv.innerHTML = flashObject;
}


function displayPdf(mediaObject){
	if (document.getElementById('mainForm:dmImage').style.visibility == "hidden"){
		showFigurePanel();		
	}
	
	var pdfObject = "<object id ='axCGM'  classid='clsid:CA8A9780-280D-11CF-A24D-444553540000' width='100%' height='100%'>"+
	"<param name='src' value='"+""+mediaObject.file+"'><embed src='"+mediaObject.url+"' width=100% height=100%></embed></param></object>";
		
	var imgDiv = document.getElementById('mainForm:imageDiv');
	imgDiv.innerHTML = pdfObject;
}



function openOfficeDocument(mediaObject){
	var officeWindow = window.open();
 	officeWindow.location =  mediaObject.file;
}

function getExt(fileName){
	var fileName = new String(fileName);
	var splitFileName = fileName.split('.');
	return splitFileName[splitFileName.length-1];
}

mediaObject=function()
{
    this.pub;
    this.url;
    this.file;
    this.fullscreen;
};