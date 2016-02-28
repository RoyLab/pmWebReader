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
        MainFrame.MultimediaFullScreenHandler =function (sender) {
            var m_Multimedia = sender;
            
               this.OnToolbarClicked=function (item, pressed)
                {    
                    var viewer =top.fullMultimediaViewer.fullmultiframe;

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
                           var zoom=top.fullMultimediaViewer.window.zoom;
                        if(zoom!=undefined && zoom>=viewer.axCGM.ZoomFactor)
                            m_Multimedia.m_btnSetPanMode.setDisabled(true);
                        else
                            m_Multimedia.m_btnSetPanMode.setDisabled(false);
                    }
                    else if (item.id == 'm_btnZoomOut')             //缩小
                    {
                        viewer.ZoomOut();
                          var zoom=top.fullMultimediaViewer.window.zoom;
                        if(zoom!=undefined && zoom>=viewer.axCGM.ZoomFactor)
                            m_Multimedia.m_btnSetPanMode.setDisabled(true);
                        else
                            m_Multimedia.m_btnSetPanMode.setDisabled(false);
                    }
                    else if (item.id == 'm_btnBestFit')             //适合大小
                    {
                        viewer.BestFit();
                         var zoom=top.fullMultimediaViewer.window.zoom;
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
                             top.ifmMultimediaViewer.window.SetSrc(null,0,null,true);
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
                            top.ifmMultimediaViewer.window.SetSrc(null,0,null,true);
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
                            
                    }
                    
                    else if (item.id == 'm_btnSetPanMode')                         //放大镜
                    {
                        var panmode = (pressed ? 1 : 0);
                        
                        viewer.window.PanMode = panmode;
                        viewer.SetPanMode(panmode);                
                    }
                     else if (item.id == 'm_btnFullScreen')                         //放大镜
                    {
                       
                    }
                    
                }
        }