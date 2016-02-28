///////////////////////////////////////////////////////////////////////////////
//功能描述：定义East区域的备注栏事件处理类
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
 
         /**
         * 目的：创建East区域的备注栏事件处理类。
         */
        MainFrame.PanelMultimediaHandler =function (sender) {
            var m_Multimedia = sender;
            
             /**
             * 目的：响应工具或菜单栏事件的方法。
             */       
             this.MultimediaToolBar_Click=function (item,pressed) {
                    var viewer;
                    if (item.id == 'm_btnPreGraphic')
                    {
                       var IETM=top.ApplicationContext.IMainFrame().GetActiveTabIETM();
                       if(IETM!=undefined && IETM!=null)
                            IETM.Graphic.GraphicPre();
                    }
                    else if (item.id == 'm_btnNextGraphic')
                    {
                       var IETM=top.ApplicationContext.IMainFrame().GetActiveTabIETM();
                       if(IETM!=undefined && IETM!=null)
                            IETM.Graphic.GraphicNext();
                    }
                   
                    if (top.ifmMultimediaViewer!=undefined) {
                         viewer = top.ifmMultimediaViewer.multiframe;
                    }
                    if(viewer!=undefined && viewer.axCGM==undefined)
                    {
                        return;
                    }
                    
                    if (item.id == 'm_btnShowMagnifier')       //放大镜
                    {
                        viewer.ShowMagnifier();
                    }
                    else if (item.id == 'm_btnZoomIn')              //放大
                    {
                        viewer.ZoomIn();
                        var zoom=top.ifmMultimediaViewer.window.zoom;
                        if(zoom!=undefined && zoom>=viewer.axCGM.ZoomFactor)
                            m_Multimedia.m_btnSetPanMode.setDisabled(true);
                        else
                            m_Multimedia.m_btnSetPanMode.setDisabled(false);
                    }
                    else if (item.id == 'm_btnZoomOut')             //缩小
                    {
                        viewer.ZoomOut();
                         var zoom=top.ifmMultimediaViewer.window.zoom;
                        if(zoom!=undefined && zoom>=viewer.axCGM.ZoomFactor)
                            m_Multimedia.m_btnSetPanMode.setDisabled(true);
                        else
                            m_Multimedia.m_btnSetPanMode.setDisabled(false);
                    }
                    else if (item.id == 'm_btnBestFit')             //适合大小
                    {
                        try
                        {
                            viewer.BestFit();
                        }catch(e)
                        {
                            alert(e);
                        }
                        var zoom=top.ifmMultimediaViewer.window.zoom;
                        if(zoom!=undefined && zoom>=viewer.axCGM.ZoomFactor)
                            m_Multimedia.m_btnSetPanMode.setDisabled(true);
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
                    else if (item.id == 'm_btnFullScreen')        //全屏
                    {
                //        var win = window.open('mviewer.html', '_blank', 'height:800;width:800;fullscreen=yes,status=yes,scrollbars=no,toolbar=no,menubar=no,location=no', false);

                             OpenFullScreenWindow(i);
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
                        if(viewer.SaveFile())
                        {
                            alert('保存备注成功！');
                        }
                        else{
                            alert('保存备注失败！');
                        }
                    }
                    else if (item.id == 'm_btnUploadFile')            //上传
                    {
                        if(viewer.UploadFile())
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
                    else if (item.id == 'm_btnExport')            //导出备注
                    {
                        viewer.Export();
                    }
                    else if (item.id == 'm_btnImport')            //导入备注
                    {
                        viewer.Import();
                    }
                    else if (item.id == 'm_btnAddAnnotation')            //加入备注
                    {
                        viewer.AddAnnotation();
                    }
                      else if (item.id == 'm_btnCircle')            //画圈
                    {
                        viewer.Circle();
                    }
                      else if (item.id == 'm_btnDeleteAnnotation')            //橡皮檫
                    {
                        viewer.DeleteAnnotation();
                    }
                      else if (item.id == 'm_btnElement')            //画曲线
                    {
                        viewer.Element();
                    }
                      else if (item.id == 'm_btnLine')            //画直线
                    {
                        viewer.Line();
                    }
                      else if (item.id == 'm_btnRectange')            //画方框
                    {
                        viewer.Rectange();
                    }
                    else if(item.id=='m_btnSetPanMode')
                    {
                         var panmode = (item.pressed ? 1 : 0); 
                         viewer.SetPanMode(panmode);
                    }
             };
             
             
             function  OpenFullScreenWindow(i)
                {
                    var objectType=top.ifmMultimediaViewer.objectType;
                    var objectSRC=top.ifmMultimediaViewer.objectSRC;
                    
                    try{
                                if(objectType=="1")
                                {
                                            var player=top.ifmMultimediaViewer.multiframe.axCGM;
                                            if(player!=undefined)
                                            {
                                                if(player.controls!=undefined)
                                                {
                                                    player.controls.play();
                                                    player.fullScreen=1;
                                                    player.displaysize=3;
                                                }
                                                else
                                                {
                                                       //player.StopPlay();
                                                       var FullScreen=new MainFrame.MultimediaFullScreen({"Title":objectSRC,"Maximizable":false});
                                                       FullScreen.show();
                                                       FullScreen.maximize();
                                                }
                                            }
                                }
                                else
                                {
                                    var multiframe =top.ifmMultimediaViewer.multiframe;
                                       //自动保存图片备注
                                    if(top.ApplicationContext.UserInfo.GraphicType==1)
                                    {
                                        if(!top.ApplicationContext.ICommonService().Isnet())
                                        {
                                             if(multiframe.SaveFile!=null)
                                                     multiframe.SaveFile();
                                        }
                                        else if(top.ApplicationContext.ICommonService().Isnet())
                                        {
                                             if(multiframe.UploadFile!=null)
                                                     multiframe.UploadFile();
                                        }
                                    }
                                    
                                    var isSwitchToFullScreen=false;
                                    if(multiframe.SwitchToFullScreen!=null)
                                    {
                                        isSwitchToFullScreen=true;
                                        multiframe.SwitchToFullScreen();
                                    }
                                    
                                    var FullScreen=new MainFrame.MultimediaFullScreen({"Title":objectSRC,"Maximizable":true});
                                    if(objectType!="2")
                                    {
                                        FullScreen.on("close",function(){
                                            if(top.ApplicationContext.UserInfo.GraphicType=='0')
                                            {
                                                 //m_Multimedia.m_btnSetPanMode.setDisabled(true);
                                                 top.ifmMultimediaViewer.window.SetSrc(null,0,null,true);   
                                            }
                                            else if(isSwitchToFullScreen==true)
                                            {
                                                 top.ifmMultimediaViewer.window.SetSrc(null,0,null,true); 
                                            }     
                                        });
                                    }
                                    FullScreen.show();
                                    
                                   if(top.ApplicationContext.UserInfo.GraphicType=='0')
                                        FullScreen.m_btnSetPanMode.setDisabled(true);
			                   }
                        }
                        catch(e)
                        {
                        }
                }


                function reload(objectSRC,objectType)
                {
                    top.ApplicationContext.MainFrame.ViewMultimedia(objectSRC,objectType,null,null,true);
                }
        }
        
       