///////////////////////////////////////////////////////////////////////////////
//功能描述：定义主框架工具和菜单栏需要跨模块调用的事件。
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
 
         /**
         * 目的：创建主框架工具和菜单栏需要跨模块调用处理类。
         */
        MainFrame.MainFrameToolbarHandler =function (sender) {
              var viewer = sender;
              
              //不能多次实例化，否则会出现内存泄露
              var detailWindow=null;
              
             /**
             * 目的：点击工具栏或者菜单是的处理方法。
             * @param  item   点击的对象，通过ID确认要进行什么处理工作
             * @param  pressed  如果有的话，表示按钮的pressed状态，
             */
            this.MainToolbar_Click= function(item,pressed){
                if (item.id == 'm_btnHomepage'||item.id=='m_actHomePage'){ //打开主页
                    var HomeDM='';
                    var homePage = TOC.homePage['HomePage'];
                    
                    viewer.MutliTab.setActiveTab(0);
                    viewer.MutliTab.activeTab.setIconClass("iconHome");
                    viewer.MutliTab.activeTab.setTitle('首页');
                    
                    ApplicationContext.MainFrame.ReLoadTree();
                    
                    if(homePage==undefined || homePage=='')
                    {
                       viewer.MutliTab.loadMainHTMLTab(undefined,'about:blank');
                       if (top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.multiframe!=undefined) 
                       {
                            ApplicationContext.MainFrame.SetMultimediaViewerDisabled(true);
                            ApplicationContext.MainFrame.SetMultimediaVieSwerCollapsed(true);
                       }
                    }
                    else
                    {
                        index=homePage.lastIndexOf('\\');
                        if(index==-1)
                            index=homePage.lastIndexOf('/');
                            
                        HomeDM=homePage.substring(index+1);
                        index=HomeDM.lastIndexOf('.');
                        HomeDM=HomeDM.substring(0,index);
                        
                         if(HomeDM!='HomePage')
                         {
                            ApplicationContext.MainFrame.LoadMainHTMLTab(HomeDM,homePage);
                         }
                         else
                         {
                           viewer.MutliTab.loadMainHTMLTab(undefined,homePage);
                           if (top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.multiframe!=undefined) 
                           {
                                ApplicationContext.MainFrame.SetMultimediaViewerDisabled(true);
                                ApplicationContext.MainFrame.SetMultimediaVieSwerCollapsed(true);
                           }

                         }
                    }   
                }
                else if (item.id == 'm_actAddComment'){//意见管理
                    if(viewer.MutliTab.findById("m_pnlComment")==null)
                    {
                        if(detailWindow==null)
                        {
                            detailWindow = new Comment.CommentDetailWindow({
                                WindowType: Comment.CommentWindowType.NewCommentWindow
                            });
                        }
                        viewer.MutliTab.loadPanelTab(new Comment.CommentMgrPanel({DetailWindow:detailWindow}));
                        //viewer.MutliTab.loadPanelTab(new Comment.CommentMgrPanel());
                    }
                    else
                    {
                        viewer.MutliTab.loadPanelTab("m_pnlComment");
//                        viewer.MutliTab.activate("m_pnlComment");
                    }
                }
                 else if (item.id == 'm_btnViewComment'){//查看意见
                    var player;
                    if(top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.multiframe!=undefined)
                        player=top.ifmMultimediaViewer.multiframe.axCGM;
                    if(player!=undefined)
                    {
                        if(player.controls!=undefined)
                        {
                            player.style.display='none';
                        }
                    }
                    player=null;
                    delete player;
                       
                    var  viewWindow=Ext.WindowMgr.get("CommentViewWindow");   
                             
                    if(viewWindow==null)
                    {
                        viewWindow = new Comment.CommentViewWindow();
                    }
                    
//                     //解决Media player显示在层上面的问题。
                    viewWindow.on("CommentHide",function()
                    {
                        try{
                              var player;
                            if(top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.multiframe!=undefined)
                                player=top.ifmMultimediaViewer.multiframe.axCGM;
                            if(player!=undefined)
                            {
                                if(player.controls!=undefined)
                                {
                                    player.style.display='block';
                                }
                            }
                             player=null;
                             delete player;
                        }
                        catch(e)
                        {
                        
                        }
                    });
                    viewWindow.show();
               }
                else if (item.id == 'm_btnAddComment'){// 添加意见
                    var player;
                    if(top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.multiframe!=undefined)
                        player=top.ifmMultimediaViewer.multiframe.axCGM;
                    if(player!=undefined)
                    {
                        if(player.controls!=undefined)
                        {
                            player.style.display='none';
                        }
                    }
                    player=null;
                    delete player;
                                        
                    if(detailWindow==null)
                    {
                        detailWindow = new Comment.CommentDetailWindow({
                            WindowType: Comment.CommentWindowType.NewCommentWindow
                        });
                    }
                    detailWindow.HasParentCommentPanel=false;
                    detailWindow.WindowType = Comment.CommentWindowType.NewCommentWindow;
                    
                     //解决Media player显示在层上面的问题。
                    detailWindow.on("CommentHide",function()
                    {
                        try{
                              var player;
                            if(top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.multiframe!=undefined)
                                player=top.ifmMultimediaViewer.multiframe.axCGM;
                            if(player!=undefined)
                            {
                                if(player.controls!=undefined)
                                {
                                    player.style.display='block';
                                }
                            }
                             player=null;
                             delete player;
                        }
                        catch(e)
                        {
                        
                        }
                    });
                    detailWindow.show();
                    detailWindow.ParentComment = null;
                    detailWindow.CurrentComment = null;
                    detailWindow.ResetWindow(); //重置对象
                    detailWindow.BindObjUIData(Comment.Biz.GetDefaultRefObjData()); //绑定对象列表
                    detailWindow.SetUIState(); //设置控件状态                                
                }
                else if (item.id == 'm_actAddUserManager'){//用户管理
                       viewer.MutliTab.loadPanelTab(UserManager.CreateUserManagerPanel());                           
                }
                else if (item.id == 'm_actAddUserRoleManager'){//角色维护
                       viewer.MutliTab.loadPanelTab(UserManager.CreateRoleManagerPanel());
                }
                else if (item.id == 'm_actPasswordComplexity'){//口令安全设置
                        UserManager.PasswordComplexityEventHandler();
                }
                else if (item.id == 'm_actUserProfile'){//用户配置
                         System.UserProfileEventHandler();
                }
                else if (item.id == 'm_btnBack'||item.id=='m_actBack'){//上一个页
                    var historyEntry=ViewHistory.ViewHistoryService.Back();
                    if(historyEntry!=undefined)
                    {
                        viewer.Navigation.navigationTreePanel.m_pnlNavTree.setActiveTab(historyEntry.TreeType);
                        ViewHistory.ViewHistoryService.backorforward=true;
                        ApplicationContext.MainFrame.LoadMainHTMLTab(historyEntry.EntryID,historyEntry.Href,undefined,"Back");
                    }                      
                }
                else if (item.id == 'm_btnNext'||item.id=='m_actNext'){//下一页
                    var historyEntry=ViewHistory.ViewHistoryService.Next();
                    if(historyEntry!=undefined)
                    {
                        viewer.Navigation.navigationTreePanel.m_pnlNavTree.setActiveTab(historyEntry.TreeType);
                        ViewHistory.ViewHistoryService.backorforward=true;
                        ApplicationContext.MainFrame.LoadMainHTMLTab(historyEntry.EntryID,historyEntry.Href,undefined,"Next");

                    }
                }   
                else if(item.id=='m_btnCollapseOrExpand') {    //导航树展开或者收起
                    var collapsed=viewer.Navigation.collapsed;
                    if(!pressed)
                    {
                         if(!collapsed)
                            viewer.Navigation.collapse();
                    }
                    else
                    { 
                         if(collapsed)
                            viewer.Navigation.expand();
                    }
                }     
                else if (item.id == 'm_btnDownloasDMFile') //下载DM文件
                {                
                    var dmInfo = ApplicationContext.MainFrame.GetActiveTabDMinfo();

                    if(dmInfo == null || dmInfo == undefined || dmInfo.DmType=="DMlist")
                    {
                        alert('当前的DM不存在，不能导出！');
                        return;
                    }
                    var em = new System.ExportDMManager(); 
                    //隐藏多媒体
                    var iscollapsed=viewer.MultimediaViewer.collapsed;
                    if (!iscollapsed) 
                        viewer.MultimediaViewer.collapse();
                                                   
                    em.Export(dmInfo.Dmc);                      
                }
                else if (item.id == 'm_btnApplic' || item.id == 'm_actApplic') //适用性过滤 
                {                
//                                ApplicFilterEventHandler();
                    //解决Media player显示在层上面的问题。
                     var player;
                    if(top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.multiframe!=undefined)
                        player=top.ifmMultimediaViewer.multiframe.axCGM;
                    if(player!=undefined)
                    {
                        if(player.controls!=undefined)
                        {
                            player.style.display='none';
                        }
                    }
                    
                    var applicFilter = new ApplicFilter.ApplicFilterEventHandler();
                    applicFilter.on("close",function()
                    {
                         if(player!=undefined)
                        {
                            if(player.controls!=undefined)
                            {
                                player.style.display='block';
                            }
                        }
                    });
                    applicFilter.ShowApplicFilter();
                    
                    
                }
                else if(item.id=='m_viewProfile')
                {
                    System.ViewProfileEventHandler();
                }
                 else if (item.id == 'm_btnMultimediaViewerToggle'||item.id=='m_actGraphicAndMuti')
                {//多媒体展开或者收起,不要包含处理图片的代码。
                        var collapsed=viewer.MultimediaViewer.collapsed;
                        var ietm = viewer.MutliTab.activeTab.IETM;
                        if(!pressed)
                        {
                             if(!collapsed)
                             {
                                viewer.MultimediaViewer.collapse();
                           
                             }
                            if(ietm!=null)
                            {
                                //111221,ietm.Graphic没有判断是否为空，在IE高级设置里面设置“显示每个脚本错误的通知”或者在webbrowser里设置为ScriptErrorsSuppressed = false;时会弹出错误。
                                if(ietm.Graphic!=undefined)
                                    ietm.Graphic.UnShowImage();
                            }
                        }
                        else
                        { 
                             if(collapsed)
                             {
                                viewer.MultimediaViewer.expand();
                             }
                            if(ietm!=null)
                            {
                                if(ietm.Graphic!=undefined && ietm.Graphic.GraphicCurrent!=undefined)
                                    ietm.Graphic.GraphicCurrent();
                            }
                           
                        }
                }
                else if (item.id == 'm_btnRemarkEditorToggle'||item.id=='m_actEditRemark')
                {//备注展开或者收起
                    var collapsed=viewer.RemarkEditor.collapsed;
                    if(!pressed)
                    {
                        if(!collapsed)
                            viewer.RemarkEditor.collapse();
                    }
                    else
                    { 
                        if(collapsed)
                        {
                            viewer.RemarkEditor.RemarkManager.LoadRemark();

                            viewer.RemarkEditor.focus();
                            viewer.RemarkEditor.expand();
                        }
                    }
                }
                else if (item.id == 'm_btnExportRemark'||item.id=='m_actExportRemark')
                {//导出备注
//                            ExportRemarkEventHandler(Ext.get('m_btnExportBookmark'));
                    viewer.RemarkEditor.RemarkManager.ExportRemark();                           
                }
                else if (item.id == 'm_btnPlanReport')
                {//维护计划(好像没有该功能sunlunjun)
                    try{
                    viewer.showBusy();
                    var m_pnlHelp = new Ext.ux.ManagedIframePanel
                    ({
                        id: 'm_pnlScheduleQuery',
                        IETM:null,
                        title: '定期维护任务',
                        closable: true,
                        iconCls: 'iconPlanReport',
                        autoScroll: true,
                        defaultSrc: 'manual/schedule_taskgroups.htm',
                        listeners:
                            {
                                documentloaded: function(frame, ex) 
                                {
                                   m_pnlHelp.IETM=frame.getWindow().IETM;
                                   Service.ForbidOperation(frame.getWindow().document);
                                    viewer.showReady();
                                   frame.getBody().onkeydown=function(){
                                        var event=frame.getWindow().event;
                                        if(event.keyCode==8 && (event.srcElement.nodeName!="INPUT" && event.srcElement.nodeName!="TEXTAREA"))
                                            event.returnValue=false;
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
                            }
                    });
                    viewer.MutliTab.loadPanelTab(m_pnlHelp);
                    }
                    catch(e)
                    {
                        viewer.showReady();
                    }

                }
                else if (item.id == 'm_btnPDFPrint'||item.id=='m_actPDFPrint') //PDF打印
                {                
                    System.PrintPDFContent();
                    //Print(0);
                }
                else if (item.id == 'm_actHelp'){             //IE帮助       
                    blogged=window.open('NetHelp/default.htm','_blank','top=150,left=200,height=400,width=600,scrolbars=no,toolbar=no,lacation=no,status=no,menubar=no,resizable=yes',false);
                 }
                else if (item.id == 'm_btnPlanReport')             //用户配
                {        
                    MainFrame.ShowHelp();
                }
                else if (item.id == 'm_actAbout'){              //关于m_actUserProfile
                    try 
                    {
                        $.ajaxSetup({ async: false });
                        result = Service.WebService.Post('IsExistAbout', null);
                        if(result.text=='true') //有用户自定义关于，取用户自定义的关于
                        {
                            var panel=new Ext.Panel({
                            html: '<iframe width="100%" height="100%" frameborder="0"  src="About/About.html"></iframe>'
                            });
                            
                            var panel = new Ext.ux.ManagedIframePanel
                            ({
                                defaultSrc: 'About/About.html',
                                listeners:
                                    {
                                        documentloaded: function(frame, ex) 
                                        {
                                           Service.ForbidOperation(frame.getWindow().document);
                                            viewer.showReady();
                                           frame.getBody().onkeydown=function(){
                                                var event=frame.getWindow().event;
                                                if(event.keyCode==8 && (event.srcElement.nodeName!="INPUT" && event.srcElement.nodeName!="TEXTAREA"))
                                                    event.returnValue=false;
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
                                    }
                            });
                            var win = new Ext.Window({
                            title    : '关于',
                            closable : true,
                            width    : 400,
                            height   : 280,
                            plain    : true,
                            buttonAlign:'center',
                            layout   : 'fit',
                            modal:true,
                            items    : [panel],
                            buttons : [new Ext.Button({text:'确定',handler:function(){
                                        win.close();
                                        win.destroy();
                                        }})]
                            });
                            win.show();
                        }
                        else
                        {
                            Ext.MessageBox.buttonText.ok = '确定';
                            var msgItem={
                                title: '关于',
                                msg: '<b>IETM<sup>S1000D</sup>-IBV  阅读管理系统</b><br><br>版本：V1.0<br>本软件是基于WEB的IETM阅读工具，支持S1000D标准2.3版<br>和3.0版。<br>版权所有 (C) 2006—2009 广州赛宝腾睿信息科技有限公司。',
                                width: 400,
                                buttons: Ext.MessageBox.OK,
                                animEl: 'actAbout'
                            };
                          
                            Ext.MessageBox.show(msgItem);
                        }

                    }
                    catch (e) 
                    {
                    }
                    finally {
                        $.ajaxSetup({ async: true });
                    }
                }
                else if(item.id == 'm_actExit'){     
                
                     this.BeforeUnLoadSystem();
                     //注销
                     if(window.confirm("真的要注销系统吗？")==false)
                        return ;

					try {
                        $.ajaxSetup({ async: false });
                        result = Service.WebService.Post('LogOut', null);
                    }
                    catch (e) {
                    }
                    finally {
                        $.ajaxSetup({ async: true });
                    }

                    UserManager.Cookies.SetCookiesName('');
                    window.location.href = 'login.html';
                }
                 else if(item.id == 'm_actClose'||item.id == 'm_btnClose'){           //退出
                     this.BeforeUnLoadSystem();
                     
                     //111110,这个系统退出已经有提示了，这里就不需要了。
//                     if(confirm("真的要退出系统吗？")==false)
//                        return ;
                     window.close();
                }
                else if(item.id == 'm_btnLock'){           //退出
                    //隐藏多媒体
                     var iscollapsed=viewer.MultimediaViewer.collapsed;
                     if (!iscollapsed) 
                        viewer.MultimediaViewer.collapse();
                     System.LockPage();
                     //重新打开多媒体
                     if(!iscollapsed)
                        viewer.MultimediaViewer.expand();
                }
            };
              
            /*
             * 目的：注销或关闭系统前需要处理的事情
             */
              this.BeforeUnLoadSystem=function()
              {
                    //如果备注修改过,需要提示用户是否保存备注
                    if(viewer.RemarkEditor.RemarkHandler.IsEditorHasChanged())
                    {
                         if (confirm("备注已经更改，是否保存？")) {
                            viewer.RemarkEditor.RemarkHandler.SaveRemark();
                         }
                    }
              };
        }
        
 