///////////////////////////////////////////////////////////////////////////////
//功能描述：处理东，西，南，北，中五个部分中需要跨模块调用的事件。
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
 
         /**
         * 目的：处理东，西，南，北，中五个部分中需要跨模块调用处理类。
         */
        MainFrame.MainFrameHandler =function (sender) {
            this.MainToolbarHandler=new MainFrame.MainFrameToolbarHandler(sender);
            var viewer = sender;
             /**
             * 目的：点击树上节点，在主页签中加入一个新的HTML页面。
             * @param Id,Text,IconCls,ObjectType
             */
            this.DMInfo_Changed = function(treePanel,dmInfo){
                try{
                     //书签和访问记录
                     if (dmInfo.Href!=undefined) 
                     {
                            ApplicationContext.FilterService.FilterDMC(dmInfo.Id,function () {
                             viewer.MutliTab.loadMainHTMLTab(dmInfo.Id,dmInfo.Href);
                             if (dmInfo.TreeType!=undefined) {
                                viewer.Navigation.navigationTreePanel.m_pnlNavTree.setActiveTab(dmInfo.TreeType);
                                viewer.Navigation.LocateTreeNode(dmInfo.Id);
                             }
                             return;
                           });
                     }
                     else
                     {
                        ApplicationContext.FilterService.FilterDMC(dmInfo.Id,function () {
                                if (dmInfo.ObjectType=="RefDM") {
                                    var href=dmInfo.Id;
                                    var index=href.indexOf('#');
                                    if (index!=-1) 
                                        href="Manual/"+href.substring(0,index)+".htm";
                                    else
                                        href="Manual/"+href+".htm";
                                    viewer.MutliTab.loadMainHTMLTab(dmInfo.Id,href);
                                    return;
                                }
                                else
                                    viewer.MutliTab.loadMainHTMLTab(dmInfo.Id,"DMlist.html?id="+dmInfo.Id.replace('#','~')+"&text="+dmInfo.Text+"&treeType="+treePanel.id+"&objectType="+dmInfo.ObjectType);
                        });
                        
                     }
                  }
                  catch(e)
                  {
                    viewer.showReady();
                  }
            };
           
            //页签改变前。
            this.MutliTab_beforeTabchange=function()
            {
                viewer.RemarkEditor.RemarkManager.LoadRemark();
            };                

            //页签改变。
            this.MutliTab_Tabchange=function(TabPanel, Panel)
            {
                var ietm=Panel.IETM;
                var treeTab;
                var codeString;
                
                if(Panel.id=="fullTextSearch" || Panel.id=="m_pnlAdvancedSearch")
                {
                     Service.ForbidOperation(Panel.body.dom);
                     Service.ForbidOperation(Panel.getFrameDocument());
                }
                 
                if(ietm!=undefined && ietm.Graphic!=undefined)
                {
                        ietm.Graphic.Init();
                        codeString=ietm.Common.DMinfo.Dmc;
                        viewer.Navigation.LocateTreeNode(codeString);
                }
                else 
                {
                    viewer.Navigation.LocateTreeNode("");
                   if(top.ifmMultimediaViewer!=undefined)
                   {
                        ApplicationContext.MainFrame.SetMultimediaViewerDisabled(true);
                        ApplicationContext.MainFrame.SetMultimediaVieSwerCollapsed(true);
                    }
                }
                //屏蔽前进和后退
                if(Panel.id!='main')
                {
                    viewer.Toolbar.btnBackDisabled(true);
                    viewer.Toolbar.btnNextDisabled(true);
                }
                else{
                   //设置历史记录按钮是否可以用
                    var history=ViewHistory.ViewHistoryService;
                    viewer.Toolbar.btnBackDisabled(!history.IsCanBack());
                    viewer.Toolbar.btnNextDisabled(!history.IsCanNext());
                }
                if(Panel.id=='m_pnlComment')
                {
                    viewer.Toolbar.m_btnAddComment.setDisabled(true);
                }
                else
                {
                    viewer.Toolbar.m_btnAddComment.setDisabled(false);
                }
                viewer.RemarkEditor.RemarkManager.LoadRemark();
            }; 
               
            //加载页签完成
            this.MutliTabDocument_loaded=function(tab,frame, ex)
            {
                viewer.showReady();
                 //加入历史记录
                var ietm = tab.IETM; 
                var dminfo;
                var history=ViewHistory.ViewHistoryService;
                var historyEntry;
                var treeType=viewer.Navigation.navigationTreePanel.m_pnlNavTree.activeTab.id;
                var entryID='';
                if (ietm!=null && ietm.Common!=null && ietm.Common.HistoryEntry!=null) {
                    historyEntry=ietm.Common.HistoryEntry;
                    dminfo=ietm.Common.DMinfo;
                    if(tab.dmID!=undefined)
                        entryID=tab.dmID;
                    else
                        entryID=dminfo.Dmc;
                    //增加访问记录
                    viewer.Navigation.UpdateVisitedHistory(dminfo.Src,dminfo.Title,entryID,treeType);
                    
                    //前进后退只处理主页签，其他的不记录
                    if (tab!=undefined&&tab.id=="main") {
                        if(!history.backorforward)
                        {                            
                            historyEntry.EntryID=entryID;
                            historyEntry.Title=dminfo.Title;
                            historyEntry.Href=dminfo.Src;
                            historyEntry.TreeType=treeType;
                            history.Add(historyEntry);
                        }
                        else
                        {
                           history.RevertHistory(ietm); 
                        }
                    }
                   
                    
                    //设置历史记录按钮是否可以用
                    viewer.Toolbar.btnBackDisabled(!history.IsCanBack());
                    viewer.Toolbar.btnNextDisabled(!history.IsCanNext());
                }
                else//是主页
                {
                    historyEntry=new ViewHistory.HistoryEntry();
                    //前进后退只处理主页签，其他的不记录
                    if (tab!=undefined&&tab.id=="main" && !history.backorforward) {
                            var doc=tab.getFrameDocument();
                            if(doc==null || doc.location==null || doc.location.href==null)
                                return;
                            
                            historyEntry.EntryID=doc.location.href;
                            historyEntry.Title=tab.title;
                            historyEntry.Href=doc.location.href;
                            historyEntry.TreeType=treeType;
                            history.Add(historyEntry);
                    }
                    
                     //设置历史记录按钮是否可以用
                    viewer.Toolbar.btnBackDisabled(!history.IsCanBack());
                    viewer.Toolbar.btnNextDisabled(!history.IsCanNext());
                }
                
                //备注
                viewer.RemarkEditor.RemarkManager.LoadRemark();
            };  

            //页签加载前。
            this.MutliTabDocument_Beforeload=function(tab)
            {
                //更新历史记录
                if(tab!=undefined && tab!=null)
                {   
                    var ietm = tab.IETM; 
                    var historyEntry;
                    if (ietm!=null && ietm.Proced != undefined && ietm.Common.HistoryEntry!=null) {
                        historyEntry=ietm.Common.HistoryEntry;
                        historyEntry.CurrentStep=ietm.Proced.CurrentStep;
                    }
                }
                
                viewer.RemarkEditor.RemarkManager.LoadRemark();
                viewer.showBusy();//tab.IETM.Common.DMinfo.Dmc
            }; 

             /**
             * 展开和折叠后的处理
             */
             viewer.Toolbar.BtnCollapseOrExpandToggle(true);
             
             this.MultimediaViewer_expand=function (p) {
             
                viewer.Toolbar.BtnMultimediaViewerToggle(true);
//                var ietm = viewer.MutliTab.activeTab.IETM;
//                if(ietm!=null)
//                {
//                    ietm.Graphic.GraphicCurrent();
//                }
             };
             this.MultimediaViewer_collapse=function (p) {
                 //收起多媒体栏的时候需要把界面上的toolTip清除掉，否则界面不会刷新 （bug1809）
                  try
                  {
                      var ativeDoc=viewer.MutliTab.activeTab.getFrameDocument();
                      if(ativeDoc!=null||ativeDoc!=undefined)
                      {
                            var toolTip=$("#tooltip",ativeDoc);
                            if(toolTip.length>0)
                                toolTip[0].style.display="none";
                      }
                   }
                  catch(e)
                  {}
                 viewer.Toolbar.BtnMultimediaViewerToggle(false);
                
//                    var ietm = viewer.MutliTab.activeTab.IETM;
//                    if(ietm!=null)
//                    {
//                        ietm.Graphic.UnShowImage();
//                    }
             };
             
              this.RemarkEditor_expand=function (p) {
                 viewer.Toolbar.BtnRemarkEditorToggle(true);
             };
             this.RemarkEditor_collapse=function (p) {
                viewer.Toolbar.BtnRemarkEditorToggle(false);
             };
              this.Navigation_expand=function (p) {
                 viewer.Toolbar.BtnCollapseOrExpandToggle(true);
             };
             this.Navigation_collapse=function (p) {
                viewer.Toolbar.BtnCollapseOrExpandToggle(false);
             };

        }
        
 