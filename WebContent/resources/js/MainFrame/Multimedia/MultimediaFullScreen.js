///////////////////////////////////////////////////////////////////////////////
//功能描述：定义面板用于全屏展示多媒
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
Service.RegNameSpace('window.MainFrame');


         /**
         * 目的：用于全屏展示多媒
         * @return  Ext.Panel对象，
         */
         MainFrame.MultimediaFullScreen = function (config) {
             MainFrame.MultimediaFullScreen.superclass.constructor.call(this, {
                MultimediaConfig:config,
                id : 'FullMultimediaViewer',
                title:config.Title,
                closable : true,
                resizable: true,
                maximizable:config.Maximizable,
                width    : 720,
                height   : 580,
                plain    : true,
                buttonAlign:'center',
                layout   : 'fit',
                modal:true,
                shadow : false,
                iconCls: 'iconMultimediaViewer',
                 keys : [{
                             key : Ext.EventObject.ESC,
                             fn :  function(){
                                this.close();
                                this.destroy();
                             }, 
                             scope : this
                        }]
            });
        };
        
        Ext.extend(MainFrame.MultimediaFullScreen,Ext.Window,
            {
                initComponent : function ()
                {
                    var MultimediaFullScreenHandler=new MainFrame.MultimediaFullScreenHandler(this);
                    MainFrame.MultimediaFullScreen.superclass.initComponent.call(this);
                    
                    this.m_btnShowMagnifier = new Ext.Toolbar.Button({ id: 'm_btnShowMagnifier', icon: 'resources/images/16x16/Magnifier.png', cls: 'x-btn-icon', tooltip: '<b>放大镜</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnZoomIn = new Ext.Toolbar.Button({ id: 'm_btnZoomIn', icon: 'resources/images/16x16/ZoomIn.png', cls: 'x-btn-icon', tooltip: '<b>放大</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnZoomOut = new Ext.Toolbar.Button({ id: 'm_btnZoomOut', icon: 'resources/images/16x16/ZoomOut.png', cls: 'x-btn-icon', tooltip: '<b>缩小</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnBestFit = new Ext.Toolbar.Button({ id: 'm_btnBestFit', icon: 'resources/images/16x16/BestFit.png', cls: 'x-btn-icon', tooltip: '<b>适合大小</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnShowOverview = new Ext.Toolbar.Button({ id: 'm_btnShowOverview', icon: 'resources/images/16x16/Eye.png', cls: 'x-btn-icon', tooltip: '<b>鹰眼</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnRotateLeft = new Ext.Toolbar.Button({ id: 'm_btnRotateLeft', icon: 'resources/images/16x16/RotateLeft.png', cls: 'x-btn-icon', tooltip: '<b>左旋转</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnRotateRight = new Ext.Toolbar.Button({ id: 'm_btnRotateRight', icon: 'resources/images/16x16/RotateRight.png', cls: 'x-btn-icon', tooltip: '<b>右旋转</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnFullScreen = new Ext.Toolbar.Button({ id: 'm_btnFullScreen', icon: 'resources/images/16x16/FullScreen.png', cls: 'x-btn-icon', tooltip: '<b>分离</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnSetPanMode = new Ext.Toolbar.Button({ id: 'm_btnSetPanMode', icon: 'resources/images/16x16/Hand.png', cls: 'x-btn-icon', tooltip: '<b>移动</b><br/>', enableToggle: true, toggleHandler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnDisplayHotSpot = new Ext.Toolbar.Button({ id: 'm_btnDisplayHotSpot', icon: 'resources/images/16x16/HotSpot.png', cls: 'x-btn-icon', tooltip: '<b>显示热点</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    //var m_btnPrintCGM = new Ext.Toolbar.Button({ id: 'm_btnPrintCGM', icon: 'resources/images/16x16/Print.png', cls: 'x-btn-icon', tooltip: '<b>打印</b><br/>', handler: OnToolbarItemClicked });
                    //var m_btnDrawLine = new Ext.Toolbar.Button({ id: 'm_btnDrawLine', icon: 'resources/images/16x16/Line.gif', cls: 'x-btn-icon', tooltip: '<b></b><br/>', handler: OnToolbarItemClicked });
                    this.m_ShowHideToolbar = new Ext.Toolbar.Button({ id: 'm_ShowHideToolbar', icon: 'resources/images/16x16/Note.gif', cls: 'x-btn-icon', tooltip: '<b>显示/隐藏工具栏</b><br/>', enableToggle: true, pressed: false, toggleHandler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnSaveFile = new Ext.Toolbar.Button({ id: 'm_btnSaveFile', icon: 'resources/images/16x16/Save.png', cls: 'x-btn-icon', tooltip: '<b>保存备注</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnUploadFile = new Ext.Toolbar.Button({ id: 'm_btnUploadFile', icon: 'resources/images/16x16/Save.png', cls: 'x-btn-icon', tooltip: '<b>上传备注</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnDownloadFile = new Ext.Toolbar.Button({ id: 'm_btnDownloadFile', icon: 'resources/images/DownNextPart.gif', cls: 'x-btn-icon', tooltip: '<b>下载备注</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });
                    this.m_btnFullScreen = new Ext.Toolbar.Button({ id: 'm_btnFullScreen', icon: 'resources/images/16x16/FullScreen.png', cls: 'x-btn-icon', tooltip: '<b>全屏</b><br/>', handler: MultimediaFullScreenHandler.OnToolbarClicked });


                     var  pnlContent = new Ext.Panel
                        (
                            {
                                id: 'm_pnlContent',
                                html: '<iframe width="100%" height="100%" frameborder="0"  src="mviewerfullScreen.html"  id="fullMultimediaViewer" allowTransparency="true"></iframe>',
                                border: false,
                                style: 'border-left:0 solid; border-bottom:0 solid;',
                                tbar: [this.GetButtons()]
                            }
                        );
                    this.add(pnlContent);
                            
                            
                },
                onRender : function(ct, position){
//                    this.modal=false;
                    MainFrame.MultimediaFullScreen.superclass.onRender.call(this,ct, position);
                     this.el.shadowDisabled=true;
//                    this.mask = this.container.createChild({cls:"ext-el-mask",tag:"iframe"}, this.el.dom);
//                    this.mask.enableDisplayMode("block");
//                    this.mask.hide();
//                    this.modal=true;
                },
                afterRender : function(container){
                    MainFrame.MultimediaFullScreen.superclass.afterRender.call(this);
                    top.ApplicationContext.Reziser=this.resizer;
                },
                close : function(container)
                {
                    MainFrame.MultimediaFullScreen.superclass.close.call(this);
                    top.ApplicationContext.Reziser=null;
                },
                show : function(container)
                {
                    MainFrame.MultimediaFullScreen.superclass.show.call(this);
              
                   // top.fullMultimediaViewer.window.SetSrc(this.MultimediaConfig.SRC, this.MultimediaConfig.TYPE);
                },
                GetButtons : function () {
                
                     var  Buttons ;
                     if(top.ifmMultimediaViewer.objectType!="0")
                        return [];
         
                     if(ApplicationContext.UserInfo.GraphicType=='0')
                     {
                         Buttons= new Array
                                (
                                    new Ext.Toolbar.Separator(), this.m_btnZoomIn, this.m_btnZoomOut, this.m_btnBestFit, new Ext.Toolbar.Separator(),
                                    //m_btnRotateLeft, m_btnRotateRight, new Ext.Toolbar.Separator(),
                                    this.m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                                    this.m_btnSetPanMode
                                );
                     }
                     else if(ApplicationContext.UserInfo.GraphicType=='1'){
                              if(!ApplicationContext.ICommonService().Isnet())
                              {
                                     Buttons= new Array
                                    (
                                        new Ext.Toolbar.Separator(), this.m_btnZoomIn, this.m_btnZoomOut, this.m_btnBestFit, new Ext.Toolbar.Separator(),
                                        //m_btnRotateLeft, m_btnRotateRight, new Ext.Toolbar.Separator(),
                                        this.m_btnSaveFile,this.m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                                        this.m_btnSetPanMode
                                        , new Ext.Toolbar.Separator(),
                                        this.m_btnShowOverview, this.m_btnShowMagnifier
                                    );
                               }
                               else{
                                  Buttons= new Array
                                    (
                                        new Ext.Toolbar.Separator(), this.m_btnZoomIn, this.m_btnZoomOut, this.m_btnBestFit, new Ext.Toolbar.Separator(),
                                        //m_btnRotateLeft, m_btnRotateRight, new Ext.Toolbar.Separator(),
                                        this.m_btnUploadFile,this.m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                                        this.m_btnSetPanMode
                                        , new Ext.Toolbar.Separator(),
                                        this.m_btnShowOverview, this.m_btnShowMagnifier
                                     );
                               }
                        }
                        else{
                            Buttons=[];
                        }
                        
                        return Buttons;
                }
                
            }
        );