var previousObj = null;
var hot = "red";
var notHot = "white";
 var angle = 0;
 var currentImageSrc;
 var theImageFile;
 var IsShowPot=true;
  var ImageFile;
  
  
function inInit()
{
    //IE7中未配置该项最大化最小化出现非正常行为。
//    if(isIE7())
//        axCGM.ConfigToolbar(false);
//      
    try
    {
       if(axCGM.ToolbarMode)
        axCGM.ShowHideToolbar();
        

        //axCGM.PictureRotation = 0;
            //初始化Pan状态
        //SetPanMode(parent.PanMode);
    }  
    catch(e)
    {
        throw e;
    }

}	

function isIE7()
{
    var ua = navigator.userAgent.toLowerCase();
    var isie7 = ua.indexOf("msie 7") > -1;
    return isie7;
}

function ShowHideToolbar(isShow)
{
  axCGM.ShowHideToolbar();
}
 
 function getToolbarMode()
 {
    return axCGM.ToolbarMode;
 }


function SaveFile()
{
 axCGM.FileSaveAs(1,1,-1);
}

function ZoomIn()
{
    axCGM.Zoom("up");

}
function ZoomOut()
{
   axCGM.Zoom("down");

}
function BestFit()
{
  axCGM.Mapping = 0;    //0:缩放到窗口大小；1:适合宽；2:适合高；3:100%

}

function Refresh()
{
    axCGM.Refresh();
}

function DisplayHotSpot()
{
var hasAllHighligth=true;
    if(OldHotspots==null||OldHotspots==undefined)
        hasAllHighligth=false;
    else{
        if(axCGM.NumberObjects==OldHotspots.length){
            for(i=0;i<axCGM.NumberObjects;i++){
                if(!hasAllHighligth) break;
                var hasHighligth=false;
                for(j=0;j<OldHotspots.length;j++){
                    if(axCGM.objectId(i)==OldHotspots[j]){
                        hasHighligth=true;
                    }
                }
                if(!hasHighligth){
                    hasAllHighligth=false;
                    break;
                }
            }      
        }
        else{
            hasAllHighligth=false;
        }
    }
    
   
    clearAllCgmHotspot();
    if(!hasAllHighligth)
        HighligthAllHotSpot();
    
    
    
   
//方法较笨。获取热点数，然后遍历把每个热点高亮。这里获取对象数会多过热点数。
//但不是热点的对象使用HighlightObject方法无效果。所以可以这样使用

    
    

}

function HighligthAllHotSpot()
{
     newHotspots=new Array();
    for(i = 0;i<axCGM.NumberObjects;i++)
    {
        newHotspots[i]=axCGM.ObjectId(i)
     // axCGM.HighlightObject(axCGM.ObjectId(i));   
    }
    HighlightNodes(newHotspots);
    OldHotspots=newHotspots;
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

function RotateLeft()
{  
  if (axCGM.PictureRotation == 270)
    axCGM.PictureRotation = 0;
  else
    axCGM.PictureRotation = axCGM.PictureRotation + 90;
}
function RotateRight()
{   
  if (axCGM.PictureRotation == 0)
    axCGM.PictureRotation = 270;
  else
    axCGM.PictureRotation = axCGM.PictureRotation - 90;
}
function SetPanMode(mode)
{

    if(mode!=null)
      axCGM.ZoomPanMode = mode+1;   //1:zoom;2:pan；所以这里需要加1
}

function PrintDialog()
{
    axCGM.Print();
}

function HighlightNode(aspid)
{
    axCGM.HighlightObject(aspid);     
}

function HighlightNodes(aspids)
{
        if(aspids!=undefined)
        {
            for(i = 0;i<aspids.length;i++)
            {
              axCGM.HighlightObject(aspids[i]);   
            }
        }
}


function ConpareHighlightNodes(aspids,hotspots)
{
     if(aspids!=undefined){
            for(i=0;i<aspids.length;i++){
                axCGM.HighlightObject(aspids[i]);
            }
     }
        
     if(hotspots!=undefined){
        for(i=0;i<hotspots.length;i++){
            axCGM.HighlightObject(hotspots[i]);
        }
    }
  
//   var IsHighligh=true;
//       if(hotspots!=undefined && aspids!=undefined)
//        {
//                for(i = 0;i<aspids.length;i++)
//                {
//                    IsHighligh=true;
//                    for(j = 0;j<hotspots.length;j++)
//                    {
//                       if(aspids[i]==hotspots[j])
//                        {
//                        IsHighligh=false;
//                        break;
//                        }
//                        
//                    }
//                    if(IsHighligh)
//                    {
//                        axCGM.HighlightObject(aspids[i]);   
//                    }
//                 }
//                 
//               for(i = 0;i<hotspots.length;i++)
//                {
//                    IsHighligh=true;
//                    for(j = 0;j<aspids.length;j++)
//                    {
//                       if(aspids[j]==hotspots[i])
//                        {
//                        IsHighligh=false;
//                        break;
//                        }
//                        
//                    }
//                    if(IsHighligh)
//                    {
//                        axCGM.HighlightObject(hotspots[i]);   
//                    }
//                 }
//        }
 
}
    
function clearAllCgmHotspot(){
	
	try
	{		
		if(OldHotspots!=undefined){
            for(i=0;i<OldHotspots.length;i++){
                axCGM.HighlightObject(OldHotspots[i]);
            }
            OldHotspots=null;
        }
	}
	catch(e)
 	{
 		//alert(e.message); 	
 	}	
}


function returnISOViewEmbedObject(queryString){
	return "<object classid=\"clsid:2FA0A680-F4D3-11D2-BD9C-0000B436855E\" id=\"axCGM\"  border=\"0\" width=\"100%\" height=\"100%\">" +
        "<param name=\"src\" value='"+queryString+"'/>" +
        "<param name=\"ShowHideToolbar\" value=\"1\" />" +
        "<PARAM NAME=\"Toolbar\" VALUE=\"2\">"
        "<center>" +
            "<p style=\"font:bold 16px 微软雅黑;color:gray\">控件加载失败</p>" +
//             "<p style=\"font:bold 16px 微软雅黑;color:gray\"><br />控件加载失败，请点击<a href=\"resources/else/CGMReaderInstall.exe\">下载</a>并安装<br />注意 请在弹出界面中点击\"运行\"按钮</p>" +
//            "<p><img src=\"resources/images/ax-download-1.png\" /></p>" +
//            "<p><img src=\"resources/images/ax-download-2.png\" /></p>" +
        "</center>" +
    "</object>" ;
}


function returnImageObjectQueryString(queryString , isoViewInstalled){

	            var imageObject ="";		
	
	            //理论上进到这里的后缀已经是外部处理过的（如bmp已经转换为tif）
	            queryString=top.ApplicationContext.UserInfo.GetICNTrueViewFile(queryString);
	            imageObject = returnISOViewEmbedObject(queryString); 
	            
//	            var extpos = queryString.lastIndexOf('.') + 1;
//                var ext = queryString.substr(extpos).toLowerCase();
//                
//                if (ext == 'tif' || ext == 'cgm' || ext == 'tiff')
//                {
//                    imageObject = returnISOViewEmbedObject(queryString);    
//                }
//                else if(ext == 'bmp' || ext == 'jpg'|| ext == 'jpeg'|| ext == 'gif'|| ext == 'gif'||ext == 'png')
//                {
//                    queryString = queryString.substr(0, extpos) + 'tif';
//                    imageObject = returnISOViewEmbedObject(queryString);      
//                }
//                else
//                {
//                     //document.write('<br><br><center><p style="font:bold 16px 微软雅黑;color:gray">有错误，没有找到控件</p></center>');
//                     //top.MainFrame.SetMultimediaToolbarState(1);
//                     imageObject = "<img id=\"axCGM\"  src='" + queryString  + "' width='90%' id='imgSrc'/>";    	
//                }
		
	return imageObject;
}


function loadImageQueryString(queryString, isoViewInstalled) { 
			
	var imgDiv = document.getElementById('mainForm:imageDiv');
	var imageObject ="";
			
	//if((queryString.indexOf(".cgm") > -1 || queryString.indexOf(".tif") > -1 || queryString.indexOf(".iso") > -1) && (isoViewInstalled=="yes")){
		try
		{
		    	imageObject	= returnImageObjectQueryString(queryString, isoViewInstalled);
				
		        if (currentImageSrc != imageObject){
        			
			        currentImageSrc = imageObject;
			        imgDiv.innerHTML = imageObject;
			        
        			if(axCGM.PictureRotation==undefined)
			            return false;		
			            
			        if(axCGM.PictureSize=="0.000000 0.000000")
			            return false;
			        

			            
			        axCGM.PictureRotation = 0;		
			        axCGM.ZoomPanMode=1;	
			        inInit();
			        return true;
		        }
		}
		catch(e)
		{
		    throw e;
		}	
	//}	
}

