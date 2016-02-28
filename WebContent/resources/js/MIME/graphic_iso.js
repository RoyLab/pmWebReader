///////////////////////////////////////////////////////////////////////////////
//功能描述：ISO控件
//作者：wanghai
//日期：2009-7-2
///////////////////////////////////////////////////////////////////////////////
 var angle = 0;
 var currentImageSrc;
 var theImageFile;
 var ImageFile;
 var IsShowPot=true;
 var currentICN='';
 
 function init()
{

}	

function ShowHideToolbar(isShow)
{
 //axCGM.ShowHideToolbar();
}
 
 function getToolbarMode()
 {
 //return axCGM.ToolbarMode;
 }

//保存备注，用于单机版
function SaveFile(userPath,userid)
{
      var imageName;
      if(document.all.axCGM==undefined)
        return;
        
      var imageFile=document.all.axCGM.firstChild.value;
      var index=imageFile.lastIndexOf('\\');
      if(index!=-1)
         imageFile=imageFile.substring(index+1);
      index=imageFile.lastIndexOf('?');
      if(index!=-1)
         imageFile=imageFile.substring(0,index);
      index=imageFile.indexOf('.');
      if(index!=-1)
         imageName=imageFile.substring(0,index);
         
     if(userPath==undefined)
        userPath=top.ApplicationContext.UserInfo.path();
        
     if(userid==undefined)
        userid=top.ApplicationContext.UserInfo.ID;
        
     savefilepath = userPath+"\\IsoView_rl\\"+userid+"\\";
      try {
            result = top.Service.WebService.Post('DeleteRedlining', { fileName: savefilepath+imageName+"_rl.iso"});
        }
        catch (e) {
        }
        finally {
        }

     if(axCGM.Iso4ExportRedlining(savefilepath+imageFile,savefilepath+imageName+"_rl.iso"))
     {
        return true;
        //alert('保存备注成功！');
     }
     else
     {
         return false;
         //alert('保存备注失败！');
     }
}

function DownloadFile(userid) {
    try {
    
        if(userid==undefined)
            userid=top.ApplicationContext.UserInfo.ID;
        
          if(document.all.axCGM==undefined)
                return;
        var redLiningDirectory = ResetRedlineDirectory();
        var xmlhttp = GetXMLHttpRequest();
          var imageName;
          var imageFile=document.all.axCGM.firstChild.value;
          var index=imageFile.lastIndexOf('\\');
          if(index!=-1)
             imageFile=imageFile.substring(index+1);
          index=imageFile.lastIndexOf('?');
          if(index!=-1)
             imageFile=imageFile.substring(0,index);
          index=imageFile.indexOf('.');
          if(index!=-1)
             imageName=imageFile.substring(0,index);

        var href = document.location.href;
        var root = href.substring(0, href.lastIndexOf('/') + 1);
        xmlhttp.Open("Get", root + "IsoView_rl\\" + userid + "\\" + imageName + '_rl.iso?time=' + new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getMilliseconds().toString(), false);
        xmlhttp.send();
        if (xmlhttp.status == 200) {
            var objStream = new ActiveXObject("ADODB.Stream");
            objStream.Mode = 3;
            objStream.Open();
            objStream.Type = 1;
            objStream.Write(xmlhttp.responseBody);
            objStream.SaveToFile(redLiningDirectory + imageName + "_rl.iso", 2);

            axCGM.Iso5ImportRedlining(redLiningDirectory + imageName + "_rl.iso");
        }
    }
    catch(e) {

    }
}

function ResetRedlineDirectory() {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var tempIeDirectory=fso.GetSpecialFolder(2);
    var diretoryPath=tempIeDirectory.Path;
    diretoryPath=diretoryPath.substring(0,diretoryPath.lastIndexOf('\\')+1);
    diretoryPath=diretoryPath+"Temporary Internet Files\\";
    return diretoryPath;
}



function GetXMLHttpRequest() {
    var xmlhttp ;
    if(window.XMLHttpRequest)
    {
        xmlhttp=new ActiveXObject("MSXML2.XMLHTTP.3.0");

    }
    else if(window.ActiveXObject)
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    return xmlhttp;
}

function UploadFile(userid) {

    try
    {
        if(userid==undefined)
            userid=top.ApplicationContext.UserInfo.ID;
            
        if(document.all.axCGM==undefined)
        return;
        
        var redLiningDirectory = ResetRedlineDirectory();
          var imageName;
          var imageFile=document.all.axCGM.firstChild.value;
          var index=imageFile.lastIndexOf('\\');
          if(index!=-1)
             imageFile=imageFile.substring(index+1);
          index=imageFile.lastIndexOf('?');
          if(index!=-1)
             imageFile=imageFile.substring(0,index);
          index=imageFile.indexOf('.');
          if(index!=-1)
             imageName=imageFile.substring(0,index);
             
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        if (fso.FileExists(redLiningDirectory + imageName + "_rl.iso")) {
            fso.DeleteFile(redLiningDirectory + imageName + "_rl.iso");
        }

        axCGM.Iso4ExportRedlining(redLiningDirectory + imageFile, redLiningDirectory + imageName + "_rl.iso");
        if (fso.FileExists(redLiningDirectory + imageName + "_rl.iso")) {
            hasRedLining = 'true';
            var objStream = new ActiveXObject("ADODB.Stream");
            objStream.Mode = 3;
            objStream.Type = 1;
            objStream.Open();
            objStream.LoadFromFile(redLiningDirectory + imageName + "_rl.iso");
            var xmlhttp = GetXMLHttpRequest();

            var href = document.location.href;
            var root = href.substring(0, href.lastIndexOf('/') + 1);
            var url = root + 'SaveReadlining.aspx?un=' + userid + '&icn=' + imageName + '&hasRedLining=' + hasRedLining;
            xmlhttp.open("POST", url, false);
            xmlhttp.setRequestHeader("Content-Length", objStream.Size);
            xmlhttp.send(objStream.Read(objStream.Size));
        }
        else {
            hasRedLining = 'false';
            var xmlhttp = GetXMLHttpRequest();
            var href = document.location.href;
            var root = href.substring(0, href.lastIndexOf('/') + 1);
            var url = root + 'SaveReadlining.aspx?un=' + userid + '&icn=' + imageName + '&hasRedLining=' + hasRedLining;
            xmlhttp.open("POST", url, false);
            xmlhttp.send();
        }
        if(xmlhttp.status == 200)
        {
            return true;
            //alert('保存备注成功！');
        }
//        else
//            alert('保存备注失败！原因:'+xmlhttp.responseText);
    }
    catch(e)
    {
        //alert('保存备注失败！原因:'+e.description);
    }
    return false;
    
}

 //导入备注
 function ImportRedlining(userid,userPath)
 {
   var index;
   
   //导入备注
      var imageName;
      
       if(document.all.axCGM==undefined)
        return;
      var imageFile=document.all.axCGM.firstChild.value;
      var index=imageFile.lastIndexOf('\\');
      if(index!=-1)
         imageFile=imageFile.substring(index+1);
      index=imageFile.lastIndexOf('?');
      if(index!=-1)
         imageFile=imageFile.substring(0,index);
      index=imageFile.indexOf('.');
      if(index!=-1)
         imageName=imageFile.substring(0,index);
     
     
  if(userPath==undefined)
        userPath=top.ApplicationContext.UserInfo.path();
        
   if(userid==undefined)
        userid=top.ApplicationContext.UserInfo.ID;
  
  savefilepath =userPath+"\\IsoView_rl\\"+userid+"\\";
  
   try{
           axCGM.Iso5ImportRedlining(savefilepath+imageName+"_rl.iso");
      }
    catch(e)
    {
      //alert(e.description);
    }
 }


function SetPanMode(mode) //移动
{
 axCGM.setActiveTool(1);
}

function ZoomIn()
{
 axCGM.setActiveTool(2);
}
function ZoomOut()
{
  axCGM.setActiveTool(4);
}



//画曲线
function Element()
{
    axCGM.setActiveTool(512);
}

//画圈
function Circle()
{
    axCGM.setActiveTool(4096);
}

 //画方框
function Rectange()
{
    axCGM.setActiveTool(8192);
}

//画直线
function   Line()
{
axCGM.setActiveTool(16384);
}

//备注
function  AddAnnotation()
{
    axCGM.setActiveTool(1024);
}

//橡皮檫
 function DeleteAnnotation()
 {
    axCGM.setActiveTool(2048);
 }
 
 //导出备注
 function Export()
 {
    axCGM.setActiveTool(4096);
 }
 
 //导入备注
 function Import()
 {
    axCGM.setActiveTool(8192);
 }



function BestFit()
{
    ReOpenFile();
  //axCGM.Mapping = 0;    //0:缩放到窗口大小；1:适合宽；2:适合高；3:100%
}

function ReOpenFile()
{
    var index=0;
    var href='';
    var requestString='';
    
    index=ImageFile.indexOf('?');
    if (index!=-1) {
        href=ImageFile.substring(0,index);
        requestString=ImageFile.substring(index);
    }
    else
        href=ImageFile;
        
//    var extpos = href.lastIndexOf('.') + 1;
//    var ext = href.substr(extpos).toLowerCase();
//	if (ext == 'bmp' || ext == 'jpg'||ext == 'gif') {
//		 href = href.substr(0, extpos) + 'tif';
//	}
	
	href=top.ApplicationContext.UserInfo.GetICNTrueViewFile(href);
	
	ImageFile=href+requestString;
		 
   axCGM.CloseFile();
   try{
           axCGM.OpenFile(ImageFile,"home");
//           if(!top.MainFrame.Getnet()&&!top.ApplicationContext.UserInfo.RcmUser)
//            {
//                ImportRedlining();
//            }
           
      }
    catch(e)
    {
      //alert(e.description);
    }
}

function Refresh()
{
    axCGM.Refresh();
}

function DisplayHotSpot()
{
  var ObjID = new Array();
  var ObjName = new Array();
  
//  for ( n = 0; n < document.axCGM.GetLayerCount();
//n++ )
//{
//ObjName[n] =
//document.axCGM.GetLayerName(n);
//}
//LayerHasObjects();

    for ( n = 0; n < axCGM.GetObjectCount();n++ )
    {
        ObjName[n] =axCGM.GetObjectName(n);
        ObjID[n] = axCGM.GetObjectID(n);
        if(axCGM.GetObjectName(n)!="Standard layer")
        {
            if(IsShowPot)
            {
                axCGM.iso3HighlightObject("name(" +axCGM.GetObjectName(n)+ ",all)", 2, RGB(255,0,0) );
                axCGM.iso3HighlightObject("id(" +axCGM.GetObjectID(n)+ ",all)", 2, RGB(255,0,0));
                
            }
            else{
                axCGM.iso3HighlightObject("name(" +axCGM.GetObjectName(n)+ ",all)", 2, RGB(255,255,255) );
                axCGM.iso3HighlightObject("id(" +axCGM.GetObjectID(n)+ ",all)", 2, RGB(255,255,255));
            }
        }
    }
    IsShowPot=!IsShowPot;
    
    axCGM.DisposeObjectList();
}

function ShowOverview()
{
   axCGM.setActiveTool(128);
}

function ShowMagnifier()
{
    //鹰眼。可自己通过js来制作。使用缩略图，获取缩略图上的位置。然后根据比例计算使用ScrollTo方法
    axCGM.setActiveTool(64);
}

function RotateLeft()
{
    try
	{
	    angle += 90;
		axCGM.Iso3SetRotAngle(angle);
		ReOpenFile();
		
	}
	catch(e)
	{
		//alert(e.description);
	}
}
function RotateRight()
{
   try
	{
	    angle -= 90;
		axCGM.Iso3SetRotAngle(angle);
		ReOpenFile();
		
	}
	catch(e)
	{
		//alert(e.description);
	}
}


function PrintDialog()
{
    axCGM.Print();
}

function HighlightHotspot(aspids)
{
   if(aspids!=undefined)
   {
        clearAllCgmHotspot();
        for(j = 0;j<aspids.length;j++)
        {
            showHotSpotWithApsID(aspids[j]);  //红色高亮显示 
        }
    }
}

var selectedHotspots = new Array();

function showHotSpotWithApsID(strApsID)
{		
	try
	{
		highLightCgmHotspot(strApsID);	 
	}
 	catch(e)
 	{
 		//logErrorWithAjax("showHotSpotWithApsID", "Error with showHotSpotWithApsID(")	
 	}
}

function highLightCgmHotspot(hotspot){
	
	try
	{			
 	 	axCGM.iso3HighlightObject("name(" + hotspot + ",all)", 2, RGB(255,0,0));
 	 	axCGM.iso3HighlightObject("id(" + hotspot + ",all)", 2, RGB(255,0,0));
 	 	
 	 	selectedHotspots[selectedHotspots.length] = hotspot; 
	}
	catch(e)
 	{
 		//logErrorWithAjax("highLightCgmHotspot", "Error with highLightCgmHotspot")	
 	}
}

function clearAllCgmHotspot(){
	
	try
	{		
		for (i=0;i<selectedHotspots.length;i++){			
					
 			axCGM.iso3HighlightObject("id(" + selectedHotspots[i] + ",all)", 2, RGB(255,255,255) );
 			axCGM.iso3HighlightObject("name(" + selectedHotspots[i] + ",all)", 2, RGB(255,255,255));
		}	
		selectedHotspots = new Array();
	}
	catch(e)
 	{
 		//alert(e.message); 	
 	}	
}




function inInit()
{
// Need to set this up so that the buttonbar can access the tools.
    try
	{	    
		axCGM.ConfigEvents(1+2+4+8+16+32+1024+2048+4096);
		
		 //axCGM.ConfigTools2(1,1+2+4+32+64+128+256+512+1024+2048+4096+8192+16384+65535,1,false,false);
		 //axCGM.ConfigTools2(2,65536+131072+262144+524288+1048576+2097152+4194304+8388608+16777216+33554432+67108864+134217728+268435456+536870912,1,false,false);
		//axCGM.ConfigPrinting( 1, 0, -1, 100.0 );
		//axCGM.Iso4StartRedlining();
		
		axCGM.setActiveTool(256);
		
		axCGM.ResizeToFit = true;
        //axCGM.ViewSize = 50;
		
	}
	catch(e)
	{
		throw e;
	}
}


function RGB(r,g,b) //将颜色用Uint来表示。
{
  return (r+g*256+b*65536);
}



var previousObj = null;
var prehsname=null;
var prehsindex=0;
var hot = "red";
var notHot = "white";


function returnISOViewEmbedObject(queryString){

	return "<object id ='axCGM'  classid='CLSID:865B2280-2B71-11D1-BC01-006097AC382A' width ='100%' height='100%' border ='0'>" +
	                      "<param name='src' value='" + queryString + "'/>" +
	                      "<param name='border' value='0'/>" +
                        "<param name='tools' value='1'/>" +
	                      "<param name='view' value ='home'/>" +
                      "</object>" ;
}

function returnImageObjectQueryString(queryString , isoViewInstalled){

	var imageObject ="";		
	
	if(isoViewInstalled=="yes")
	{
	    //先去除文件名后面附带的一些参数。
	    var pos = queryString.lastIndexOf('?');
	    var strLast="";
	    if(pos>=0)
	    {
	        strLast=queryString.substr(pos);
	        queryString = queryString.substr(0, pos);
	    }
	    //重新拼凑全路径。
	    queryString=top.ApplicationContext.UserInfo.GetICNTrueViewFile(queryString)+strLast;
		imageObject = returnISOViewEmbedObject(queryString);     
	}
	else
	{
    	imageObject = "<img id=\"axCGM\" src='" + queryString  + "' width='90%' id='imgSrc'/>";    
	}
		
//	if((queryString.indexOf(".cgm") > -1 || queryString.indexOf(".iso") > -1) && (isoViewInstalled=="yes") ){
//						
//		imageObject = returnISOViewEmbedObject(queryString);                   
//    }
//    else{    
//    
//        if(queryString.indexOf(".bmp") > -1 || queryString.indexOf(".tif") > -1 || queryString.indexOf(".png") > -1 || queryString.indexOf(".jpg") > -1|| queryString.indexOf(".jpeg") > -1|| queryString.indexOf(".gif") > -1|| queryString.indexOf(".tiff") > -1|| queryString.indexOf(".gif") > -1)
//        {
//						
//	         var extpos = queryString.lastIndexOf('.') + 1;
//	         queryString = queryString.substr(0, extpos) + 'tif'+queryString.substr(extpos+3);
//	         imageObject = returnISOViewEmbedObject(queryString);                      
//         }
//		else  		 
//    	imageObject = "<img id=\"axCGM\" src='" + queryString  + "' width='90%' id='imgSrc'/>";    	
//    }
           
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
    									
		        inInit();
		    }
		    return true;
		}
		catch(e)
		{
		    throw e;
		}
	//}	
}

