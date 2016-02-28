///////////////////////////////////////////////////////////////////////////////
//功能描述：定义主框架视图east区域的多媒体面板，该面板用于展示多媒
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
Service.RegNameSpace('window.MainFrame');

         /**
         * 目的：创建east区域的多媒体面板类
         * @return  Ext.Panel对象，
         */
         MainFrame.PanelMultimediaViewer = function (config) {
             MainFrame.PanelMultimediaViewer.superclass.constructor.call(this, {
                region: config.region,
                html: '<iframe width="100%"  height="100%" frameborder="0" id="ifmMultimediaViewer" src="mviewer.html"></iframe>',
                title: '多媒体预览',
                split: true,
                animCollapse: false,
                lines:false,       
                collapsible: true,
                collapseMode: 'mini',
                collapsed: true,
                titlebar: false,
                width: 400,
                minSize: 120,
                //maxSize: 1000,
                buttonAlign: 'center',
                iconCls: 'iconMultimediaViewer',
                tbar: []
            });
        };
        
        Ext.extend(MainFrame.PanelMultimediaViewer,Ext.Panel,
            {
                initComponent : function ()
                {
                    var PanelMultimediaHandler=new MainFrame.PanelMultimediaHandler(this);
                    MainFrame.PanelMultimediaViewer.superclass.initComponent.call(this);
                          this.m_btnShowMagnifier = new Ext.Toolbar.Button({ id: 'm_btnShowMagnifier', icon: 'resources/images/16x16/Magnifier.png', cls: 'x-btn-icon', tooltip: '<b>放大镜</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click});
                          this.m_btnZoomIn = new Ext.Toolbar.Button({ id: 'm_btnZoomIn', icon: 'resources/images/16x16/ZoomIn.png', cls: 'x-btn-icon', tooltip: '<b>放大</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnZoomOut = new Ext.Toolbar.Button({ id: 'm_btnZoomOut', icon: 'resources/images/16x16/ZoomOut.png', cls: 'x-btn-icon', tooltip: '<b>缩小</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnBestFit = new Ext.Toolbar.Button({ id: 'm_btnBestFit', icon: 'resources/images/16x16/BestFit.png', cls: 'x-btn-icon', tooltip: '<b>适合大小</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnShowOverview = new Ext.Toolbar.Button({ id: 'm_btnShowOverview', icon: 'resources/images/16x16/Eye.png', cls: 'x-btn-icon', tooltip: '<b>鹰眼</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnRotateLeft = new Ext.Toolbar.Button({ id: 'm_btnRotateLeft', icon: 'resources/images/16x16/RotateLeft.png', cls: 'x-btn-icon', tooltip: '<b>左旋转</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnRotateRight = new Ext.Toolbar.Button({ id: 'm_btnRotateRight', icon: 'resources/images/16x16/RotateRight.png', cls: 'x-btn-icon', tooltip: '<b>右旋转</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnFullScreen = new Ext.Toolbar.Button({ id: 'm_btnFullScreen', icon: 'resources/images/16x16/FullScreen.png', cls: 'x-btn-icon', tooltip: '<b>分离</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnSetPanMode = new Ext.Toolbar.Button({ id: 'm_btnSetPanMode', icon: 'resources/images/16x16/Hand.png', cls: 'x-btn-icon', tooltip: '<b>移动</b><br/>', enableToggle: true, handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnDisplayHotSpot = new Ext.Toolbar.Button({ id: 'm_btnDisplayHotSpot', icon: 'resources/images/16x16/HotSpot.png', cls: 'x-btn-icon', tooltip: '<b>显示热点</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                            //m_btnPrintCGM = new Ext.Toolbar.Button({ id: 'm_btnPrintCGM', icon: 'resources/images/16x16/Print.png', cls: 'x-btn-icon', tooltip: '<b>打印</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                            //m_btnDrawLine = new Ext.Toolbar.Button({ id: 'm_btnDrawLine', icon: 'resources/images/16x16/Line.gif', cls: 'x-btn-icon', tooltip: '<b></b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_ShowHideToolbar = new Ext.Toolbar.Button({ id: 'm_ShowHideToolbar', icon: 'resources/images/16x16/Note.gif', cls: 'x-btn-icon', tooltip: '<b>显示/隐藏工具栏</b><br/>', enableToggle: true, pressed: false, toggleHandler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnSaveFile = new Ext.Toolbar.Button({ id: 'm_btnSaveFile', icon: 'resources/images/16x16/Save.png', cls: 'x-btn-icon', tooltip: '<b>保存备注</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnUploadFile = new Ext.Toolbar.Button({ id: 'm_btnUploadFile', icon:'resources/images/16x16/Save.png', cls: 'x-btn-icon', tooltip: '<b>保存备注</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnDownloadFile = new Ext.Toolbar.Button({ id: 'm_btnDownloadFile', icon: 'resources/images/DownNextPart.gif', cls: 'x-btn-icon', tooltip: '<b>下载备注</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                            
                          this.m_btnExport = new Ext.Toolbar.Button({ id: 'm_btnExport', icon: 'resources/images/UpNextPart.gif', cls: 'x-btn-icon', tooltip: '<b>导出备注</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnImport = new Ext.Toolbar.Button({ id: 'm_btnImport', icon: 'resources/images/DownNextPart.gif', cls: 'x-btn-icon', tooltip: '<b>导入备注</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });

                            
                          this.m_btnAddAnnotation = new Ext.Toolbar.Button({ id: 'm_btnAddAnnotation', icon: 'resources/images/addannotation.png', cls: 'x-btn-icon', tooltip: '<b>加入备注</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnCircle = new Ext.Toolbar.Button({ id: 'm_btnCircle', icon: 'resources/images/circle.png', cls: 'x-btn-icon', tooltip: '<b>画圈</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnDeleteAnnotation = new Ext.Toolbar.Button({ id: 'm_btnDeleteAnnotation', icon: 'resources/images/deleteannotation.png', cls: 'x-btn-icon', tooltip: '<b>橡皮檫</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnElement = new Ext.Toolbar.Button({ id: 'm_btnElement', icon: 'resources/images/element.png', cls: 'x-btn-icon', tooltip: '<b>画曲线</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnLine = new Ext.Toolbar.Button({ id: 'm_btnLine', icon: 'resources/images/line.png', cls: 'x-btn-icon', tooltip: '<b>画直线</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnRectange = new Ext.Toolbar.Button({ id: 'm_btnRectange', icon: 'resources/images/rectange.png', cls: 'x-btn-icon', tooltip: '<b>画方框</b><br/>', handler: PanelMultimediaHandler.MultimediaToolBar_Click });

                          this.m_btnPreGraphic = new Ext.Toolbar.Button({ id: 'm_btnPreGraphic', icon: 'resources/images/16x16/PreGraphic.png', cls: 'x-btn-icon', tooltip: '<b>前图</b><br/>浏览当前数据模块中当前图像的前一图', handler: PanelMultimediaHandler.MultimediaToolBar_Click });
                          this.m_btnNextGraphic = new Ext.Toolbar.Button({ id: 'm_btnNextGraphic', icon: 'resources/images/16x16/NextGraphic.png', cls: 'x-btn-icon', tooltip: '<b>后图</b><br/>浏览当前数据模块中当前图像的后一图', handler: PanelMultimediaHandler.MultimediaToolBar_Click });

                          this.m_arrGraphicButtons = this.GetGraphicButtons();
                            
                            
                },
                afterRender : function(container){
                    MainFrame.PanelMultimediaViewer.superclass.afterRender.call(this);
                    this.topToolbar.add(this.m_btnPreGraphic);
                    this.topToolbar.add(this.m_btnNextGraphic);
                    this.topToolbar.add(this.m_arrGraphicButtons);
                    this.topToolbar.add(new Ext.Toolbar.Separator());
                    this.topToolbar.add(this.m_btnFullScreen);
                
                },
                GetGraphicButtons : function () {
                        if(!ApplicationContext.ICommonService().Isnet())
                        {
                             if(ApplicationContext.UserInfo.GraphicType=='0')
                             {
                                 return new Array
                                        (
                                            new Ext.Toolbar.Separator(),this.m_btnZoomIn,this.m_btnZoomOut,this.m_btnBestFit, new Ext.Toolbar.Separator(),
                                          this.m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                                          this.m_btnSetPanMode
                                        );
                             }
                             else{
                                         return new Array
                                        (
                                            new Ext.Toolbar.Separator(),this.m_btnZoomIn,this.m_btnZoomOut,this.m_btnBestFit, new Ext.Toolbar.Separator(),
                                          this.m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                                          this.m_btnSetPanMode,this.m_btnSaveFile
                                            , new Ext.Toolbar.Separator(),
                                          this.m_btnExport,this.m_btnImport,new Ext.Toolbar.Separator(),
                                          this.m_btnShowOverview,this.m_btnShowMagnifier,this.m_btnAddAnnotation,this.m_btnDeleteAnnotation,this.m_btnElement
                                        );
                                }
                        }
                        else{
                          if(ApplicationContext.UserInfo.GraphicType=='0')
                             {
                                   return new Array
                                    (
                                        new Ext.Toolbar.Separator(),this.m_btnZoomIn,this.m_btnZoomOut,this.m_btnBestFit, new Ext.Toolbar.Separator(),
                                      this.m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                                      this.m_btnSetPanMode
                                    );
                             }
                             else
                             {
                                   return new Array
                                    (
                                        new Ext.Toolbar.Separator(),this.m_btnZoomIn,this.m_btnZoomOut,this.m_btnBestFit, new Ext.Toolbar.Separator(),
                                      this.m_btnDisplayHotSpot, new Ext.Toolbar.Separator(),
                                      this.m_btnSetPanMode,
                                      this.m_btnUploadFile,
                                         new Ext.Toolbar.Separator(),
                                        this.m_btnExport,this.m_btnImport,new Ext.Toolbar.Separator(),
                                      this.m_btnShowOverview,this.m_btnShowMagnifier,this.m_btnAddAnnotation,this.m_btnDeleteAnnotation,this.m_btnElement
                                    );
                                }
                        }
                }
                
            }
        );