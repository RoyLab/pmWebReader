///////////////////////////////////////////////////////////////////////////////
//功能描述：AutoView控件
//作者：wanghai
//日期：2009-7-2
///////////////////////////////////////////////////////////////////////////////
var previousObj = null;
var hot = "red";
var notHot = "white";
 var angle = 0;
 var currentImageSrc;
 var theImageFile;
 var IsShowPot=true;
 
 function inInit()
{

}	
 
 
function ShowHideToolbar(isShow)
{
 axCGM.ShowMainToolBar=isShow;
}

 function getToolbarMode()
 {
    return '3D';
 }
 


function ZoomIn()
{
 axCGM.ZoomPrevious();
}
function ZoomOut()
{
  axCGM.ZoomByFactor(2);
  
}
function BestFit()
{
  axCGM.ZoomFit();    //0:缩放到窗口大小；1:适合宽；2:适合高；3:100%
}

function Refresh()
{
  
}

function ShowOverview()
{
    alert("暂时不支持3");
}

function ShowMagnifier()
{
    //鹰眼。可自己通过js来制作。使用缩略图，获取缩略图上的位置。然后根据比例计算使用ScrollTo方法
   alert("暂时不支持4");
}

function RotateLeft()//旋转
{
  
}

function RotateRight()//旋转
{
 
}

function SetPanMode(mode)//放大镜
{
    axCGM.ZoomSelected();
}


function PrintDialog()
{
    axCGM.PrintIt(0);
}

function SaveFile()
{
}

function returnISOViewEmbedObject(queryString){
     //1A197F14-7F02-11D2-AABC-00E02909A45C
	return "<object classid=\"clsid:B6FCC215-D303-11D1-BC6C-0000C078797F\" id=\"axCGM\"  border=\"0\" width=\"100%\" height=\"100%\">" +
        "<param name=\"src\" value='"+queryString+"'/>" +
       "<param name=\"ShowMainToolBar\" value=\"1\" />" +
        "<param name=\"ShowAuxiToolBar\" value=\"0\" />" +
        "<param name=\"ShowStatusBar\" value=\"0\" />" +
        "<param name=\"ShowScrollBars\" value=\"1\" />" +
        "<param name=\"EnablePopupMenu\" value=\"1\" />" +
        "<center>" +
            "<p style=\"font:bold 16px 微软雅黑;color:gray\"><br />请安装3D控件</p>" +
        "</center>" +
    "</object>" ;
}


function returnImageObjectQueryString(queryString , isoViewInstalled){

	            var imageObject ="";		
	
                imageObject = returnISOViewEmbedObject(queryString);    
		
	            return imageObject;
}


function loadImageQueryString(queryString, isoViewInstalled) { 
			
	var imgDiv = document.getElementById('mainForm:imageDiv');
	var imageObject ="";
			
	//if((queryString.indexOf(".cgm") > -1 || queryString.indexOf(".tif") > -1 || queryString.indexOf(".iso") > -1) && (isoViewInstalled=="yes")){
			
		imageObject	= returnImageObjectQueryString(queryString, isoViewInstalled);
				
		if (currentImageSrc != imageObject){
			
			currentImageSrc = imageObject;
			imgDiv.innerHTML = imageObject;	
									
			inInit();
		}
	//}	
}






