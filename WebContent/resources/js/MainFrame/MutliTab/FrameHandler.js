///////////////////////////////////////////////////////////////////////////////
//功能描述：定义主框架视图center区域的多页签面板，该面板用于多页签展示HTML页面和别的Panel.
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
         /**
         * 目的：创建center区域的备注栏事件处理类。
         */
        MainFrame.FrameHandler =function (sender) {
           var FrameViewer = sender;
           this.FrameToolBar_Click=function (item,pressed) {
                       var IETM= FrameViewer.IETM;
                       if (item.id == 'm_btnZoom')
                       {
                            FrameViewer.m_sldZoom.setValue(100);
                            return;
                       } 
                       if (IETM==null ||IETM==undefined) 
                            return;
                            
                        if (item.id == 'm_btnMetaData')
                        {
                              IETM.AssistantInfo.ShowMetaData();
                        }
                         else if (item.id == 'm_btnFindContent')               //查找
                        {
                               IETM.AssistantInfo.FindContent();
                        } 
                        else if (item.id == 'm_btnRefDM')               //DM被引
                        {
                                IETM.AssistantInfo.ShowDMRefedList();
                        } 
                        else if (item.id == 'm_btnRefPM')               //PM被引
                        {
                                IETM.AssistantInfo.ShowPMRefedList();
                        }
                         else if (item.id == 'm_btnPreCondition')
                        {
                               IETM.AssistantInfo.ShowPrelreqs();
                        }
                        else if (item.id == 'm_btnSafeConfition')
                        {
                               IETM.AssistantInfo.ShowSafety(false);
                        }  
                        else if (item.id == 'm_btnStepMode' && item.pressed)
                        {      
                                IETM.Proced.ToggleStepForm();
                        }
                        else if (item.id == 'm_btnUpStep')
                        {
                                IETM.Proced.PreviousStep();
                        }
                        else if (item.id == 'm_btnDownStep')
                        {
                                IETM.Proced.NextStep();
                        }
                        else if (item.id == 'm_btnAfiMode' && item.pressed)
                        {
                               IETM.Fault.OnBenginAfiClick();
                        }
                        else if (item.id == 'm_btnAfiLogicTable')
                        {
                               IETM.Fault.OnAfiLogicTableClick();
                        }
                        else if (item.id == 'm_btnAfiUpStep')
                        {
                                IETM.Fault.OnAfiBackClick();
                        }
                        else if (item.id == 'm_btnAfiDownStep')
                        {
                                IETM.Fault.OnAfiNextClick();
                        }
                        else if (item.id == 'm_btnProcessUpStep')
                        {
                               IETM.Process.ProcessUpStep();
                        }
                        else if (item.id == 'm_btnProcessBackStep')
                        {
                                IETM.Process.ProcessBackStep();
                        }
                        else if (item.id == 'm_btnProcessReturnStep')
                        {
                               IETM.Process.ProcessReturnStep();
                        }
           }
           
           this.FramePage_onload = function (frame,ex) {
                 try
                   {
                            var IETM=FrameViewer.getFrameWindow().IETM;
                            FrameViewer.IETM=IETM; //让页签持有ITEM接口 
                            
                            var zoom = String.format('{0}%', FrameViewer.m_sldZoom.getValue());
                            if (FrameViewer.getFrameDocument())
                            {
                                 if(IETM.Common.HistoryEntry.DialogType==window.ViewHistory.DLGTYPE.NONE)
                                    FrameViewer.getFrameDocument().body.style.zoom = zoom;

                                    
                                 FrameViewer.getFrameDocument().onclick =function(event)
                                    {
                                        var event=FrameViewer.getFrameWindow().event;
                                        var ret= !event.shiftKey||event.srcElement.tagName!='A';
                                        return ret;
                                    };
                                    
                                   
                                    FrameViewer.getFrameBody().onkeydown =function()
                                    {
                                    
                                          var event=FrameViewer.getFrameWindow().event;

                                              if(event.keyCode==8 && (event.srcElement.nodeName!="INPUT" && event.srcElement.nodeName!="TEXTAREA"))
                                              {
                                                    event.returnValue=false;
                                                    //ApplicationContext.MainFrame.SetMainToolbarButtonClick('m_btnBack');
                                              }
                                                
                                              if(event.ctrlKey&&event.keyCode==39)
                                                   event.returnValue=false;
                                                   
                                               if(event.ctrlKey&&event.keyCode==37)
                                                   event.returnValue=false;
                                               
                                                if(event.ctrlKey&&event.keyCode==17)
                                                   event.returnValue=false;
                                               
                                                if(event.ctrlKey&&event.keyCode==72)
                                                   event.returnValue=false;
                                               
                                                if(event.ctrlKey&&event.keyCode==73)
                                                   event.returnValue=false;
                                                   
                                                if(event.ctrlKey&&event.keyCode==78)
                                                   event.returnValue=false;
                                               
                                                if(event.ctrlKey&&event.keyCode==69)
                                                   event.returnValue=false;
                                               
                                                 if(event.ctrlKey&&event.keyCode==83)
                                                   event.returnValue=false;
                                                   
                                    };
                            }
                                
                                
                             //是主页签，删除原来页面导航按钮
                            if (FrameViewer.id=='main') {
                               FrameViewer.m_btnStepMode.setVisible(false);
                               FrameViewer.m_btnUpStep.setVisible(false);
                               FrameViewer.m_btnDownStep.setVisible(false);
                               
                               FrameViewer.m_btnAfiMode.setVisible(false);
                               FrameViewer.m_btnAfiUpStep.setVisible(false);
                               FrameViewer.m_btnAfiLogicTable.setVisible(false);
                               //FrameViewer.m_btnAfiReport.setVisible(false);
                               
                                FrameViewer.m_btnProcessUpStep.setVisible(false);
                                FrameViewer.m_btnProcessBackStep.setVisible(false);
                                FrameViewer.m_btnProcessReturnStep.setVisible(false);
                                
                                
                              FrameViewer.m_lbldmc.el.innerHTML=' ';
                              FrameViewer.m_btnMetaData.setDisabled(true);
                              FrameViewer.m_btnFindContent.setDisabled(true);
                              FrameViewer.m_btnRefDM.setDisabled(true);
                              FrameViewer.m_btnRefPM.setDisabled(true);
                               FrameViewer.m_btnPreCondition.setVisible(false);
                               FrameViewer.m_btnSafeConfition.setVisible(false);
                               
                            }
                              
                            
                                      
                            if(IETM==undefined)
                            {
                                if(FrameViewer.iconCls!="iconHome")
                                {
                                      FrameViewer.setIconClass("iconHome");
                                      FrameViewer.setTitle('首页');
                                }
                                 
                                 //禁止复制、剪贴、屏幕打印、右键菜单等window
                                 Service.ForbidOperation(FrameViewer.getFrameDocument());           
                                return;
                            }
                            else
                            {
                            
                                    if(FrameViewer.id=='main' && FrameViewer.cclass!=undefined && FrameViewer.cclass!='')
                                        IETM.Reference.InsideXref("#"+FrameViewer.cclass);
                                
                                    var dminfo=IETM.Common.DMinfo;
                                    var dmType=dminfo.DmType;  
                                                                        
                                     switch(dminfo.ObjectType) {
                                       case "RefDM":
       	                                    FrameViewer.setIconClass('iconDM'); 
       	                                    break;
                                       case "PMEntry":
       	                                    FrameViewer.setIconClass("iconPMNoChild");
       	                                    break;
                                       default:
                                            FrameViewer.setIconClass("iconManual");
                                       }
                                                              
                                    FrameViewer.setTitle(dminfo.Title ? dminfo.Title : '(无标题)');
                                      
                                    var dmCode=dminfo.Dmc;
                                     if(dmType=="DMlist")
                                     {
                                        dmCode='';
                                        if(window.ifmMultimediaViewer!=undefined)
                                        {
                                            ApplicationContext.MainFrame.SetMultimediaViewerDisabled(true);
                                            ApplicationContext.MainFrame.SetMultimediaVieSwerCollapsed(true);
                                        }
                                     }
                                        
                                    if (dmCode != undefined && dmCode != '') {
                                        var applicText = IETM.Common.GetApplic();
//                                        var showApplic = 'false';
//                                        Service.WebService.Call('GetShow23Applic',
//                                            {},
//                                            function(result){showApplic = result.text;},
//                                            function()
//                                            {});
                                    
                                        //sunjian20120214 之前的2.3版本就不在右上角的dmc信息后面显示适用性的信息，此次修改是182要求将2.3的适用性信息放在dm的标题后面
//                                        if(showApplic == 'true' && TOC.Version['Version']=='2.3' && applicText!='')
//                                        {
//                                            //取frames[0]是为了获取主界面的dm内容，一般为拿到的第一个，如果不是则这里要修改(因为暂时找不到其他标识去取这个frames)
//                                            var title=$(".dmodule_title",window.frames[0].document);
//                                            if(title!=null && title!=undefined)
//                                            {
//                                                title.text(title[0].innerText + "<b>[</b>" + applicText + "<b>]</b>");
//                                            }
//                                            FrameViewer.m_lbldmc.el.innerHTML=dmCode+"&nbsp;&nbsp;&nbsp;"+"&nbsp;&nbsp;&nbsp;"+dminfo.Security;
//                                        }
//                                        else
//                                        {
                                            FrameViewer.m_lbldmc.el.innerHTML=dmCode+"&nbsp;&nbsp;&nbsp;"+applicText+"&nbsp;&nbsp;&nbsp;"+dminfo.Security;
//                                        }
                                        FrameViewer.m_btnMetaData.setDisabled(false);
                                        FrameViewer.m_btnFindContent.setDisabled(false);
                                        FrameViewer.m_btnRefDM.setDisabled(false);
                                        FrameViewer.m_btnRefPM.setDisabled(false);
                                        
                                       FrameViewer.m_btnPreCondition.setVisible(false);
                                       FrameViewer.m_btnSafeConfition.setVisible(false);
                                    }

                                    //插入页面导航按钮
                                    if(dmType == "proced" || dmType == "proced_card")
                                    {
                                       FrameViewer.m_btnStepMode.setVisible(true);
                                       FrameViewer.m_btnStepMode.toggle(false);

                                       FrameViewer.m_btnUpStep.setVisible(true);
                                       FrameViewer.m_btnDownStep.setVisible(true);
                                    
                                       FrameViewer.m_btnPreCondition.setVisible(true);
                                       FrameViewer.m_btnSafeConfition.setVisible(true);
                                    }
                                    else if (dmType=='afi') {
                                       FrameViewer.m_btnAfiMode.setVisible(true);
                                       FrameViewer.m_btnAfiMode.toggle(false);
                                       FrameViewer.m_btnAfiUpStep.setVisible(true);
                                       FrameViewer.m_btnAfiLogicTable.setVisible(true);
                                       //FrameViewer.m_btnAfiReport.setVisible(true);
                                    }
                                    else if (dmType=='process') {
                                        FrameViewer.m_btnProcessUpStep.setVisible(true);
                                        FrameViewer.m_btnProcessBackStep.setVisible(true);
                                        FrameViewer.m_btnProcessReturnStep.setVisible(true);
                                    }
                            }
                            
                         
                            
                    }
                    catch(e)
                    {
                         ApplicationContext.MainFrame.ShowReady();
                    }
                    finally
                    {
                        
                    }
              };
        };
        
        //MainFrame.FrameHandler.prototype.
        
        
       