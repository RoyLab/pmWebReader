var xml_http,ado_stream;
var SendBlockCount,SendCount;
var lastSendTime,maxFileLimit;
var breaked = false;
var _filename ;
var blockSize = 1024 * 128;
var isUploaded = false;

maxFileLimit = 1024 * 1024 * 50;     //上传文件的大小


///开始上传文件
function SendFile(sendFileName)
{ 
    breaked = false;
    try
    {
        ado_stream = new ActiveXObject("ADODB.Stream");
        ado_stream.Type = 1;
        ado_stream.Open();
    }
    catch(ex)
    {
        throw new Error("创建数据流对象失败，原因："+ex.description);
    }

    try
    {
        ado_stream.LoadFromFile(sendFileName);
    }
    catch(ex)
    {
        OverSend();        
        throw new Error("无法打开文件 "+document.getElementById("UpFileControl").value+",传输将终止，原因"+ex.description);   
       
        return;
    }

    ado_stream.position = 0;
    if(ado_stream.size == 0)
    {
        OverSend();
        throw new Error("选择的文件为大小为0的空文件，传输将终止");         
        return;
    }

    if(ado_stream.size > maxFileLimit)
    {
        OverSend();
        throw new Error("您选择上传的文件已超过服务器允许上传文件的最大值");       
        return;
    }

    SendCount = Math.ceil(ado_stream.size / blockSize); 
    var UpFile = sendFileName;

    SendBlockCount = 0;
    lastSendTime = new Date();


    xml_http = CreateXmlHttpObj();

    if(xml_http == null)
    {
        OverSend();
        throw new Error("创建XmlHttp对象失败,请先下载安装MsXMl组件"); 
          
        return;    
    } 
    try
    {
        SendData();
    }
    catch(ex)
    {
        OverSend();
        throw new Error(ex.description);       
        return;
    }
}

///异步发送文件上传请求到后台程序
function SendData()
{
    if(!breaked)
    { 
        xml_http.open("POST","../upload.aspx?ps="+SendBlockCount + "&userName=" + param+"&fileType=" + extendName,true);//添加一个文件类型//不能含有中文//接收上传的页面
        xml_http.send(ado_stream.Read(blockSize));
    }
}

///取消正在上传的文件
function CancelSend()
{
    if(typeof(xml_http) !='undefined' && xml_http != null)
    {
        breaked = true;
        xml_http.abort();
        DeleteSingleFile();
        OverSend();
    }
}

///结束文件上传
function OverSend()
{
    if(typeof(ado_stream)!="undefined")
    {
        ado_stream.Close();
    }
    breaked = false;
}

///删除指定文件
function DeleteSingleFile()
{
    var xml_http2 = CreateXmlHttpObj();
    if(xml_http2 == null)
    {
        throw new Error("创建XmlHttp对象失败,请先下载安装MsXMl组件");
        return;
    }
    xml_http2.open("POST","../upload.aspx?ps=-1",true);
    xml_http2.setRequestHeader("content-type","application/x-www-form-urlencoded"); 
    xml_http2.setRequestHeader("Content-Length",param.length);
    xml_http2.send(null);
}

///创建XMLhttp对象
function CreateXmlHttpObj()
{   
try
{ return new ActiveXObject('MSXML2.XMLHTTP.4.0');}
catch(e)
{
  try
  {return new ActiveXObject('MSXML2.XMLHTTP.3.0');}
  catch(e)
  {
     try{return new ActiveXObject('MSXML2.XMLHTTP.2.6');}
     catch(e)
     {
       try{return new ActiveXObject('MSXML2.XMLHTTP');}
       catch(e)
       {
          try{return new ActiveXObject('Microsoft.XMLHTTP');}
          catch(e)
          {
             try{return new XMLHttpRequest();}
             catch(e)
             {
               return null;
              }
           }
        }        
      }
   }
 }
} 
