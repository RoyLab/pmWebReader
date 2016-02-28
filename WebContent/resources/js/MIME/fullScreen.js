///////////////////////////////////////////////////////////////////////////////
//功能描述：全屏控制工具栏
//作者：wanghai
//日期：2009-6-29
///////////////////////////////////////////////////////////////////////////////
         var objectSRC = "";
         var GraphicContrlType=0;
         var requestString = "";
         var m_arrGButtons;
         var  fullviewport;
         
         var userinfo=null;
         var isNet='';
         var userid='';
         var userPath='';
                  
 Ext.onReady(function(){
        Ext.QuickTips.init();
        
        GraphicContrlType=s135("Type");
        objectSRC=s135("SRC");
        theImageFile=objectSRC;
        requestString=s135("requestString");
        requestString=requestString.replace('~','=');
        
        var t=objectSRC;
        var i=t.lastIndexOf('\\');
        if(i!=-1)
            t=t.substring(i+1);
            
            i=t.lastIndexOf('.');
        if(i!=-1)
            t=t.substring(0,i);
         
        document.title=t;
            
        userinfo=s135("userinfo");
        if(userinfo!=undefined && userinfo!=null && userinfo!='')
        {
            userinfo=userinfo.split('*');
            userid=userinfo[0];
            isNet=userinfo[1];
            userPath=userinfo[2];
        }
        
//        m_btnPreGraphic = new Ext.Toolbar.Button({ id: 'm_btnPreGraphic', icon: 'resources/images/16x16/PreGraphic.png', cls: 'x-btn-icon', tooltip: '<b>前图</b><br/>浏览当前数据模块中当前图像的前一图', handler: OnToolbarClicked });
//        m_btnNextGraphic = new Ext.Toolbar.Button({ id: 'm_btnNextGraphic', icon: 'resources/images/16x16/NextGraphic.png', cls: 'x-btn-icon', tooltip: '<b>后图</b><br/>浏览当前数据模块中当前图像的后一图', handler: OnToolbarClicked });

        var m_btnShowMagnifier = new Ext.Toolbar.Button({ id: 'm_btnShowMagnifier', icon: 'resources/images/16x16/Magnifier.png', cls: 'x-btn-icon', tooltip: '<b>放大镜</b><br/>', handler: OnToolbarClicked });
        var m_btnZoomIn = new Ext.Toolbar.Button({ id: 'm_btnZoomIn', icon: 'resources/images/16x16/ZoomIn.png', cls: 'x-btn-icon', tooltip: '<b>放大</b><br/>', handler: OnToolbarClicked });
        var m_btnZoomOut = new Ext.Toolbar.Button({ id: 'm_btnZoomOut', icon: 'resources/images/16x16/ZoomOut.png', cls: 'x-btn-icon', tooltip: '<b>缩小</b><br/>', handler: OnToolbarClicked });
        var m_btnBestFit = new Ext.Toolbar.Button({ id: 'm_btnBestFit', icon: 'resources/images/16x16/BestFit.png', cls: 'x-btn-icon', tooltip: '<b>适合大小</b><br/>', handler: OnToolbarClicked });
        var m_btnShowOverview = new Ext.Toolbar.Button({ id: 'm_btnShowOverview', icon: 'resources/images/16x16/Eye.png', cls: 'x-btn-icon', tooltip: '<b>鹰眼</b><br/>', handler: OnToolbarClicked });
        var m_btnRotateLeft = new Ext.Toolbar.Button({ id: 'm_btnRotateLeft', icon: 'resources/images/16x16/RotateLeft.png', cls: 'x-btn-icon', tooltip: '<b>左旋转</b><br/>', handler: OnToolbarClicked });
        var m_btnRotateRight = new Ext.Toolbar.Button({ id: 'm_btnRotateRight', icon: 'resources/images/16x16/RotateRight.png', cls: 'x-btn-icon', tooltip: '<b>右旋转</b><br/>', handler: OnToolbarClicked });
        var m_btnFullScreen = new Ext.Toolbar.Button({ id: 'm_btnFullScreen', icon: 'resources/images/16x16/FullScreen.png', cls: 'x-btn-icon', tooltip: '<b>分离</b><br/>', handler: OnToolbarClicked });
        var m_btnSetPanMode = new Ext.Toolbar.Button({ id: 'm_btnSetPanMode', icon: 'resources/images/16x16/Hand.png', cls: 'x-btn-icon', tooltip: '<b>移动</b><br/>', enableToggle: true, toggleHandler: OnToolbarClicked });
        var m_btnDisplayHotSpot = new Ext.Toolbar.Button({ id: 'm_btnDisplayHotSpot', icon: 'resources/images/16x16/HotSpot.png', cls: 'x-btn-icon', tooltip: '<b>显示热点</b><br/>', handler: OnToolbarClicked });
        //var m_btnPrintCGM = new Ext.Toolbar.Button({ id: 'm_btnPrintCGM', icon: 'resources/images/16x16/Print.png', cls: 'x-btn-icon', tooltip: '<b>打印</b><br/>', handler: OnToolbarItemClicked });
        //var m_btnDrawLine = new Ext.Toolbar.Button({ id: 'm_btnDrawLine', icon: 'resources/images/16x16/Line.gif', cls: 'x-btn-icon', tooltip: '<b></b><br/>', handler: OnToolbarItemClicked });
        var m_ShowHideToolbar = new Ext.Toolbar.Button({ id: 'm_ShowHideToolbar', icon: 'resources/images/16x16/Note.gif', cls: 'x-btn-icon', tooltip: '<b>显示/隐藏工具栏</b><br/>', enableToggle: true, pressed: false, toggleHandler: OnToolbarClicked });
        var m_btnSaveFile = new Ext.Toolbar.Button({ id: 'm_btnSaveFile', icon: 'resources/images/16x16/Save.png', cls: 'x-btn-icon', tooltip: '<b>保存备注</b><br/>', handler: OnToolbarClicked });
        var m_btnUploadFile = new Ext.Toolbar.Button({ id: 'm_btnUploadFile', icon: 'resources/images/UpNextPart.gif', cls: 'x-btn-icon', tooltip: '<b>上传备注</b><br/>', handler: OnToolbarClicked });
        var m_btnDownloadFile = new Ext.Toolbar.Button({ id: 'm_btnDownloadFile', icon: 'resources/images/DownNextPart.gif', cls: 'x-btn-icon', tooltip: '<b>下载备注</b><br/>', handler: OnToolbarClicked });
        var m_btnFullScreen = new Ext.Toolbar.Button({ id: 'm_btnFullScreen', icon: 'resources/images/16x16/FullScreen.png', cls: 'x-btn-icon', tooltip: '<b>全屏</b><br/>', handler: OnToolbarClicked });
       
        
     
         
         
     if(GraphicContrlType=='0')
     {
         m_arrGButtons= new Array
                (
                    new Ext.Toolbar.Separator(), m_btnZoomIn, m_btnZoomOut, m_btnBestFit, new Ext.Toolbar.Separator(),
                    //m_btnRotateLeft, m_btnRotateRight, new Ext.Toolbar.Separator(),
                    m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                    m_btnSetPanMode,m_btnFullScreen
                );
     }
     else if(GraphicContrlType=='01'){
              if(isNet=="false")
              {
                     m_arrGButtons= new Array
                    (
                        new Ext.Toolbar.Separator(), m_btnZoomIn, m_btnZoomOut, m_btnBestFit, new Ext.Toolbar.Separator(),
                        //m_btnRotateLeft, m_btnRotateRight, new Ext.Toolbar.Separator(),
                        m_btnSaveFile,m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                        m_btnSetPanMode
                        , new Ext.Toolbar.Separator(),
                        m_btnShowOverview, m_btnShowMagnifier,m_btnFullScreen
                    );
               }
               else{
                  m_arrGButtons= new Array
                    (
                        new Ext.Toolbar.Separator(), m_btnZoomIn, m_btnZoomOut, m_btnBestFit, new Ext.Toolbar.Separator(),
                        //m_btnRotateLeft, m_btnRotateRight, new Ext.Toolbar.Separator(),
                        m_btnUploadFile,m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                        m_btnSetPanMode
                        , new Ext.Toolbar.Separator(),
                        m_btnShowOverview, m_btnShowMagnifier,m_btnFullScreen
                     );
               }
        }
         else if(GraphicContrlType=='1'){
               m_arrGButtons= new Array
                (
                  m_btnFullScreen
                );
        }
          else if(GraphicContrlType=='2'){
               m_arrGButtons= new Array
                (
                  m_btnFullScreen
                );
        }
                    
         
         var tbrMain = new Ext.Toolbar
        (
            {
                id: 'tbrMain',
                //style: 'border:1 none; background:transparent;border-top:1px solid #d0d0d0;',
                frame:true,
                items:
                [
                  m_arrGButtons
                ]
            }
        );
        

       
         var fullMultimediaViewer = new Ext.Panel
        (
            {
                region: 'center',
                html: '<iframe width="100%" height="100%" frameborder="0" onload="loadmedia(this)"   id="fullMultimediaViewer"></iframe>',
                border: false,
                style: 'border-left:1 solid; border-bottom:1 solid;'
            }
        );
        
       pnlContent = new Ext.Panel
        (
            {
                region: 'center',
                id: 'm_pnlContent',
                closable: false,
                layout: 'border',
                iconCls: 'iconManual',
                tbar: [m_arrGButtons],
                items: [fullMultimediaViewer]
            }
        );
        
        fullviewport = new Ext.Viewport
        (
            {
                id: 'fullViewPort',
                layout: 'border',
                items: [pnlContent]
            }
        );
        
        fullviewport.doLayout();
        
       
        this.SetSrc(objectSRC, GraphicContrlType);
        
        
        
        var resize=0;
        window.onresize=function(){ //图片分离bug1929纵向拖拉不重绘图片。
            try
            {
                var axcgm=window.frames['fullMultimediaViewer'].document.getElementById('axCGM');
                if(axcgm!=undefined)
                {
                    var bodyHeight=parseInt(window.document.body.clientHeight)-29;
                    window.frames['fullMultimediaViewer'].document.body.style.height=bodyHeight.toString();
                    axcgm.style.height=bodyHeight.toString();
                    
                } 
            }
            catch(e)
            {}
        };
        
        
        window.onbeforeunload=function()
        {
             var viewer =Ext.get('fullMultimediaViewer').dom.contentWindow;
              //自动保存图片备注
              if(GraphicContrlType=="01")
              {
                    if(isNet=="false")
                    {
                         if(viewer.SaveFile!=null)
                                 viewer.SaveFile(userPath,userid);
                    }
                    else
                    {
                         if(viewer.UploadFile!=null)
                                 viewer.UploadFile(userid);
                    }
               }
        };
        


    });
    
    function settbardisabled(disabled)
    {
        var bar=fullviewport.items.items[0].topToolbar.items.items;
        for(var i=0;i<bar.length;i++)
        {
           bar[i].setDisabled(disabled);
        }
    };
    

   ///设置媒体网址，如果src为空，则什么内容也不显示。type：0图形；type：1多媒体
        function SetSrc(src, type)
        {
            if(src!="")
            {
                 if (top.MainFrame)
                    top.MainFrame.SetMultimediaToolbarState(type);

                
                var href = document.location.href;
                var root = href.substring(0, href.lastIndexOf('/') + 1);
                
                switch (type){
                    case "0":     //图形
                        objectSRC = src;
                        Ext.get('fullMultimediaViewer').dom.src = root + "fullScreenmviewercgml.htm";
                        break;
                     case "01":     //图形
                        objectSRC = src;
                        Ext.get('fullMultimediaViewer').dom.src = root + "fullScreenmvieweriso.htm";
                    break;
                    case "1":     //多媒体
                         objectSRC = src;
                         var extpos = src.lastIndexOf('.') + 1;
                         var ext = src.substr(extpos).toLowerCase();
                         if(ext=='avi'||ext=='mp3'||ext=='wma'||ext=='swf'||ext=='wmv')
                         {
                           if(userinfo!=undefined && userinfo!=null && userinfo!='')  //说明不是RCM调用的。
                                Ext.get('fullMultimediaViewer').dom.src = root + "fullScreenmviewermultimedia.htm";
                            else
                                 Ext.get('fullMultimediaViewer').dom.src = root + "fullScreenmviewermultimediaRcm.htm";
                         }
                        break;
                    case "2":     //多媒体
                       objectSRC = src;
                       Ext.get('fullMultimediaViewer').dom.src = root + "fullScreenmviewer3D.htm";
                    break;
                    default:
                }
             }
            else
            {
                SetDisabled(true);
            }
        }
        
        function SetDisabled(disabled)
        {
            if (disabled)
            {
                multiframe.window.location = "about:blank";
  
            }
        }
        
        
 function s135(s136)
 {
        var s137=document.location.search;
        if(s137=="")
            return "";
        if(s137.charAt(0)=="?")
            s137=s137.substring(1,s137.length);
        var s138=s137.split("&");
        for(i=0;i<s138.length;i++)
        {
            var s138_values=s138[i].split("=");
            if(s136==unescape(s138_values[0]))
            {
                var s140;
                if(window.decodeURIComponent)     
                    s140=decodeURIComponent(s138_values[1]);
                else 
                    s140=unescape(s138_values[1]);  
                    return s140;
             }
         }
         return "";
  }
  
 
 
    
    
function OnToolbarClicked(item, pressed)
{    
    var viewer =Ext.get('fullMultimediaViewer').dom.contentWindow;

    /*===========================================================================================
                                        多媒体预览区工具栏事件
    ===========================================================================================*/
    
    if (item.id == 'm_btnShowMagnifier')       //放大镜
    {
        viewer.ShowMagnifier();
    }
    else if (item.id == 'm_btnZoomIn')              //放大
    {
        viewer.ZoomIn();
    }
    else if (item.id == 'm_btnZoomOut')             //缩小
    {
        viewer.ZoomOut();
    }
    else if (item.id == 'm_btnBestFit')             //适合大小
    {
        viewer.BestFit();
    }
    else if (item.id == 'm_btnShowOverview')        //鹰眼
    {
        viewer.ShowOverview();
    }
    else if (item.id == 'm_btnRotateLeft')          //左旋转
    {
        viewer.RotateLeft();
    }
    else if (item.id == 'm_btnRotateRight')         //右旋转
    {
        viewer.RotateRight();
    }
    else if (item.id == 'm_btnDisplayHotSpot')      //显示热点
    {
        viewer.DisplayHotSpot();
    }
    else if (item.id == 'm_btnPrintCGM')            //打印
    {
        viewer.PrintDialog();
    }
  
    else if (item.id == 'm_btnSaveFile')            //保存m_btnUploadFile
    {
        if(viewer.SaveFile(userPath,userid))
        {
             alert('保存备注成功！');
        }
        else{
             alert('保存备注失败！');
        }
    }
    else if (item.id == 'm_btnUploadFile')            //上传
    {
        if(viewer.UploadFile(userid))
        {
            alert('保存备注成功！');
        }
        else{
            alert('保存备注失败！');
        }
    }
    else if (item.id == 'm_btnDownloadFile')            //下载
    {
        viewer.DownloadFile();
    }
    else if (item.id == 'm_ShowHideToolbar')            //图片隐藏工具栏
    {
             if(viewer.getToolbarMode()=='3D')
             {
                    viewer.ShowHideToolbar(top.m_ShowHideToolbar.pressed); 
             }

    }
    
    else if (item.id == 'm_btnSetPanMode')                         //放大镜
    {
        var panmode = (pressed ? 1 : 0);
        
        viewer.window.PanMode = panmode;
        viewer.SetPanMode(panmode);                
    }
     else if (item.id == 'm_btnFullScreen')                         //放大镜
    {
       window.dialogWidth=window.screen.availWidth;
       window.dialogHeight=window.screen.availHeight;
       //window.moveTo(window.screen.availWidth,window.screen.availHeight);    
       fullviewport.doLayout();
    }
    
}