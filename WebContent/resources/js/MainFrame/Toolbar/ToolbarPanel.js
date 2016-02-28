///////////////////////////////////////////////////////////////////////////////
//功能描述：定义主框架视图north区域的菜单的工具栏面板，该面板用于展示菜单的工具栏
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');


         /**
         * 目的：创建north区域的菜单的工具栏面板类
         * @return  Ext.Panel对象，
         */
            MainFrame.PanelToolbar=function(config)
            {
                MainFrame.PanelToolbar.superclass.constructor.call(this, 
                {
                    region: config.region,
                    layout: 'anchor',
                    border: false,
                    height: 63,
                    cls: 'header'
                });
            }
         
            Ext.extend(MainFrame.PanelToolbar,Ext.Panel,
            {
                initComponent : function ()
                {
                           MainFrame.PanelToolbar.superclass.initComponent.call(this);
                            this.addEvents({"MainToolbar_Click": true});
                             var curry=this;
                             this.holdEvent=function(button,e)
                             {
                                curry.fireEvent("MainToolbar_Click",button,e);
                             }
                            //初始化主工具栏
                            m_btnHomepage = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnHomepage', icon: 'resources/images/28x28/Home.png', cls: 'x-custombtn-icon', tooltip: '<b>首页</b><br/>快速回到手册首页', handler: this.holdEvent});
                            this.m_btnBack = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnBack', disabled: true, icon: 'resources/images/28x28/Back.png', cls: 'x-custombtn-icon', tooltip: '<b>后退</b><br/>导航到上一页', handler: this.holdEvent });
                            this.m_btnNext = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnNext', disabled: true, icon: 'resources/images/28x28/Next.png', cls: 'x-custombtn-icon', tooltip: '<b>前进</b><br/>导航到下一页', handler: this.holdEvent });
                            this.m_btnExit = new Ext.Toolbar.CustomSizeButton({ id: 'm_actExit', icon: 'resources/images/28x28/Logout.png', cls: 'x-custombtn-icon', tooltip: '<b>注销</b><br/>重新登录', handler: this.holdEvent });
                            m_btnClose = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnClose', icon: 'resources/images/28x28/Exit.png', cls: 'x-custombtn-icon', tooltip: '<b>关闭</b><br/>关闭系统', handler: this.holdEvent });
                            this.m_btnLock = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnLock', icon: 'resources/images/28x28/Lock.png', cls: 'x-custombtn-icon', tooltip: '<b>锁定</b><br/>锁定页面', handler: this.holdEvent });
                            this.m_btnCollapseOrExpand= new Ext.Toolbar.CustomSizeButton({ id: 'm_btnCollapseOrExpand', icon: 'resources/images/28x28/NavPane.png', cls: 'x-custombtn-icon', tooltip: '<b>显示/隐藏导航区</b><br/>显示/隐藏导航区', enableToggle: true,toggleHandler: this.holdEvent});
                            m_btnDownloasDMFile = new Ext.Toolbar.CustomSizeButton({id: 'm_btnDownloasDMFile',icon: 'resources/images/28x28/ExportDM.png',cls: 'x-custombtn-icon',tooltip: '<b>导出DM文件</b><br/>导出指定DMC的DM文件',handler: this.holdEvent});
                            m_btnApplic = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnApplic', icon: 'resources/images/28x28/Applic.png', cls: 'x-custombtn-icon', tooltip: '<b>适用性</b><br/>选择适用性过滤', handler: this.holdEvent });
                            this.m_btnMultimediaViewerToggle = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnMultimediaViewerToggle', icon: 'resources/images/28x28/Preview.png', cls: 'x-custombtn-icon', tooltip: '<b>多媒体</b><br/>显示或隐藏多媒体预览区域', enableToggle: true, toggleHandler: this.holdEvent });
                            this.m_btnRemarkEditorToggle = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnRemarkEditorToggle', icon: 'resources/images/28x28/Remark.png', cls: 'x-custombtn-icon', tooltip: '<b>备注</b><br/>显示或隐藏备注区域', enableToggle: true, toggleHandler: this.holdEvent });
                            var m_btnExportRemark = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnExportRemark', tabIndex: -1, icon: 'resources/images/28x28/ExportRemark.png', cls: 'x-custombtn-icon', tooltip: '<b>导出备注</b><br/>导出备注',handler: this.holdEvent});
                            this.m_btnAddComment = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnAddComment', icon: 'resources/images/28x28/AddComments.png', cls: 'x-custombtn-icon', tooltip: '<b>添加意见</b><br/>添加意见', handler: this.holdEvent });   
                            this.m_btnViewComment = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnViewComment', icon: 'resources/images/28x28/Comments.png', cls: 'x-custombtn-icon', tooltip: '<b>查看意见</b><br/>查看意见', handler: this.holdEvent });                                             
                            m_btnPDFPrint = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnPDFPrint', icon: 'resources/images/28x28/Print.png', cls: 'x-custombtn-icon', tooltip: '<b>打印</b><br/>打印当前数据模块页面', handler: this.holdEvent });
                            m_btnPlanReport = new Ext.Toolbar.CustomSizeButton({ id: 'm_btnPlanReport', icon: 'resources/images/28x28/PlanReport.png', cls: 'x-custombtn-icon', tooltip: '<b>维护任务</b><br/>定期维护任务', handler: this.holdEvent });
                            m_lblUser = new Ext.form.Label({ id: 'm_lblUser', text: ApplicationContext.UserInfo.UserId });
							
                            this.tbrMain = null;
							if(ApplicationContext.UserInfo.PDFPrintVisable){
							 this.tbrMain = new Ext.Toolbar
                            (
                                   {
                                    id: 'tbrMain',
                                    renderTo: 'divToolbar',
                                    style: 'border:0 none; background:transparent;border-top:1px solid #d0d0d0;',
                                    items:
                                    [
                                        this.m_btnCollapseOrExpand,'--',
                                        m_btnHomepage, this.m_btnBack, this.m_btnNext, '--',
                                        this.m_btnMultimediaViewerToggle, 
                                        this.m_btnRemarkEditorToggle, m_btnExportRemark, this.m_btnAddComment, this.m_btnViewComment,'--',
                                         m_btnDownloasDMFile,m_btnPDFPrint, 
                                        m_btnApplic,m_btnPlanReport
                                    ]
                                }
                            );
							}//'<table><tr><td>&nbsp;&nbsp;</td><td><label style=\"text-decoration:underline; cursor:pointer;\" onclick=\"LoginOut()\"><font color=\"#0000FF\">注销</font></label></td></tr></table>',
							else {
							 this.tbrMain = new Ext.Toolbar
                            (
                                   {
                                    id: 'tbrMain',
                                    renderTo: 'divToolbar',
                                    style: 'border:0 none; background:transparent;border-top:1px solid #d0d0d0;',
                                    items:
                                    [
                                        this.m_btnCollapseOrExpand,'--',
                                        m_btnHomepage, this.m_btnBack, this.m_btnNext, '--',
                                        this.m_btnMultimediaViewerToggle, 
                                        this.m_btnRemarkEditorToggle, m_btnExportRemark, this.m_btnAddComment, this.m_btnViewComment,'--',
                                         m_btnDownloasDMFile, 
                                        m_btnApplic,m_btnPlanReport                                        
                                    ]
                                }
                            );
							}
							//pma使用屏蔽工具栏上的锁屏，关闭，注销及显示登录用户信息的label
							if(ApplicationContext.IUserInfo().PMAUser)
							{
							    this.tbrMain.add('->',
							    '<table><tr><td>&nbsp;&nbsp;</td><td><img align="absmiddle"  src="resources/images/logo-ibv.png"></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td></tr></table> ');
							}
							else
							{
							    this.tbrMain.add('--',
                                        this.m_btnLock,
                                         m_btnClose, '->',
							    '<img align="absmiddle" width="16" height="16" src="resources/images/16x16/User.png"> ',
							    m_lblUser,
							    '<table><tr><td>&nbsp;&nbsp;</td><td><label style=\"text-decoration:underline; cursor:pointer;\" onclick=\"LoginOut()\"><font color=\"#0000FF\">注销</font></label></td></tr></table>',
							    '<table><tr><td>&nbsp;&nbsp;</td><td><img align="absmiddle"  src="resources/images/logo-ibv.png"></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td></tr></table> ');
							}
							

                            //初始化主菜单栏
                                m_actAddComment = new Ext.Action({ id: 'm_actAddComment', text: '意见管理', icon: 'resources/images/16x16/Comments.png', cls: 'x-btn-text-icon', tooltip: '<b>意见管理</b><br/>', handler: this.holdEvent });
                                m_actAddUserManager = new Ext.Action({ id: 'm_actAddUserManager', text: '用户管理', icon: 'resources/images/16x16/Users.png', cls: 'x-btn-text-icon', tooltip: '<b>用户管理</b><br/>', handler: this.holdEvent });
                                m_actAddUserRoleManager = new Ext.Action({ id: 'm_actAddUserRoleManager', text: '角色维护', icon: 'resources/images/16x16/User.png', cls: 'x-btn-text-icon', tooltip: '<b>角色维护</b><br/>', handler: this.holdEvent });
                                m_actPasswordComplexity = new Ext.Action({ id: 'm_actPasswordComplexity', text: '口令安全设置', icon: 'resources/images/16x16/StartPage.png', cls: 'x-btn-text-icon', tooltip: '<b>口令安全设置</b><br/>', handler: this.holdEvent });
                                m_actUserProfile = new Ext.Action({ id: 'm_actUserProfile', text: '用户配置', icon: 'resources/images/16x16/PageAdd.png', cls: 'x-btn-text-icon', tooltip: '<b>用户配置</b><br/>', handler: this.holdEvent });
                                m_actUploadComment = new Ext.Action({ id: 'm_actUploadComment', text: '打包意见', icon: '', cls: 'x-btn-text-icon', tooltip: '<b>打包意见</b><br/>', handler: this.holdEvent });
                                m_actIEPrint = new Ext.Action({ id: 'm_actIEPrint', text: 'IE打印', icon: 'resources/images/16x16/Print.png', cls: 'x-btn-text-icon', tooltip: '<b>IE打印</b><br/>', handler: this.holdEvent });
                                m_actPDFPrint = new Ext.Action({ id: 'm_actPDFPrint', text: '打印', icon: 'resources/images/16x16/Print.png', cls: 'x-btn-text-icon', tooltip: '<b>打印</b><br/>', handler: this.holdEvent });
                                m_actChangePassword = new Ext.Action({ id: 'm_actChangePassword', text: '修改用户密码', icon: 'resources/images/16x16/Users.png', cls: 'x-btn-text-icon', tooltip: '<b>修改用户密码</b><br/>', handler: this.holdEvent });
                                m_schecduleTime = new Ext.Action({ id: 'm_schecduleTime', text: '定期维护任务', icon: 'resources/images/16x16/Help.png', cls: 'x-btn-text-icon', tooltip: '<b>定期维护任务</b><br/>', handler: this.holdEvent });
                                m_actHelp = new Ext.Action({ id: 'm_actHelp', text: '帮助', icon: 'resources/images/16x16/Help.png', cls: 'x-btn-text-icon', tooltip: '<b>帮助</b><br/>', handler: this.holdEvent });
                                m_actAbout = new Ext.Action({ id: 'm_actAbout', text: '关于', icon: 'resources/images/16x16/About.png', cls: 'x-btn-text-icon', tooltip: '<b>关于</b><br/>', handler: this.holdEvent });
                                this.m_actExit = new Ext.Action({ id: 'm_actExit', text: '注销', icon: 'resources/images/16x16/roolback.gif', cls: 'x-btn-text-icon', tooltip: '<b>注销</b><br/>', handler: this.holdEvent });
                                this.m_actClose = new Ext.Action({ id: 'm_actClose', text: '关闭', icon: 'resources/images/16x16/Exit.png', cls: 'x-btn-text-icon', tooltip: '<b>关闭</b><br/>', handler: this.holdEvent });
                                m_actHomePage = new Ext.Action({ id: 'm_actHomePage', text: '首页', icon: 'resources/images/16x16/Home.png', cls: 'x-btn-text-icon', tooltip: '<b>首页</b><br/>', handler: this.holdEvent });
                                this.m_actBack = new Ext.Action({ id: 'm_actBack', text: '后退',disabled: true, icon: 'resources/images/16x16/Back.png', cls: 'x-btn-text-icon', tooltip: '<b>后退</b><br/>', handler: this.holdEvent });
                                this.m_actNext = new Ext.Action({ id: 'm_actNext', text: '前进',disabled: true, icon: 'resources/images/16x16/Next.png', cls: 'x-btn-text-icon', tooltip: '<b>前进</b><br/>', handler: this.holdEvent });
                                m_actEditRemark = new Ext.Action({ id: 'm_actEditRemark',icon: 'resources/images/16x16/Remark.png',  text: '编辑备注',cls: 'x-btn-text-icon', tooltip: '<b>显示或隐藏备注区域</b><br/>', handler: this.holdEvent });
                                m_actExportRemark = new Ext.Action({ id: 'm_actExportRemark',icon: 'resources/images/16x16/ExportRemark.png', text: '导出备注',cls: 'x-btn-text-icon', tooltip: '<b>导出备注</b><br/>', handler: this.holdEvent});
                                m_actApplic = new Ext.Action({ id: 'm_actApplic', text: '适用性',icon: 'resources/images/16x16/Applic.png',cls: 'x-btn-text-icon', tooltip: '<b>适用性</b><br/>', handler: this.holdEvent });
                                m_viewProfile = new Ext.Action({ id: 'm_viewProfile', text: '界面配置', icon: 'resources/images/16x16/View.png', cls: 'x-btn-text-icon', tooltip: '<b>界面配置</b><br/>', handler: this.holdEvent });
                                
                               m_navmenu=new Ext.menu.Menu({
                               id:'m_navmenu',
                               items:[m_actHomePage,this.m_actBack,this.m_actNext]
                               });
                               
                               m_remarkmenu=new Ext.menu.Menu({
                               id:'m_remarkmenu',
                               items:[m_actEditRemark,m_actExportRemark]
                               });
                               
                               if (!ApplicationContext.UserInfo.UserIsHaveRight(2))
                               {   //非管理员用户登录过滤菜单
                                   m_managemenu=new Ext.menu.Menu({
                                   id:'m_managemenu',
                                   items:[m_actAddUserManager,m_actAddComment]
                                   });
                               }
                               else
                               {
                                   m_managemenu=new Ext.menu.Menu({
                                   id:'m_managemenu',
                                   items:[m_actAddUserManager,m_actAddUserRoleManager,'-',m_actPasswordComplexity,m_actAddComment]
                                   });  
                               }
                               
							   if(ApplicationContext.UserInfo.PDFPrintVisable){
								   m_systemmenu=new Ext.menu.Menu({ 
								   id:'m_systemmenu',
								   items:[m_actUserProfile,m_actApplic,m_viewProfile,m_actPDFPrint]
								   });
								}
								else{
								   m_systemmenu=new Ext.menu.Menu({ 
								   id:'m_systemmenu',
								   items:[m_actUserProfile,m_actApplic,m_viewProfile]
								   });
                               }
                               
                               //pma使用屏蔽菜单栏下的注销，退出
                               if(!ApplicationContext.UserInfo.PMAUser)
                               {
                                    m_systemmenu.add('-',this.m_actExit,this.m_actClose);
                               }

                               m_helpmenu=new Ext.menu.Menu({
                               id:'m_helpmenu',
                               items:[m_actHelp,m_actAbout]
                               });
                               
                               m_schecdulemenu=new Ext.menu.Menu({
                               id:'m_schecdulemenu',
                               items:[m_schecduleTime]
                               });
                               
                               
                               m_navbtMenu=new Ext.Toolbar.Button({ id: 'm_navmenu',text:'导航',cls:'x-btn-text',menu: m_navmenu });
                               m_remarkbmenu=new Ext.Toolbar.Button({ id: 'm_remarkbmenu',text:'备注',cls:'x-btn-text',menu: m_remarkmenu });
                               m_managebmenu=new Ext.Toolbar.Button({ id: 'm_managebmenu',text:'管理',cls:'x-btn-text',menu: m_managemenu });
                               m_systembmenu=new Ext.Toolbar.Button({ id: 'm_systembmenu',text:'系统',cls:'x-btn-text',menu: m_systemmenu });
                               m_helpbmenu=new Ext.Toolbar.Button({ id: 'm_helpbmenu',text:'帮助',cls:'x-btn-text',menu: m_helpmenu });
                               m_schecdulebmenu=new Ext.Toolbar.Button({ id: 'm_schecdulebmenu',text:'维护任务',cls:'x-btn-text',menu: m_schecdulemenu });

                                m_menuMain = new Ext.menu.Menu
                                (
                                    {
                                        id: 'm_menuMain',
                                        items:
                                        [
                                        m_actAddUserManager, m_actAddUserRoleManager, '-',m_actUserProfile,
                                            m_actAddComment, '-',
                                            m_actHelp, m_actAbout, '-',
                                            this.m_actExit, this.m_actClose
                                        ]
                                    }
                                );
                       var tbrmenu=new Ext.Toolbar({
                            id:tbrmenu,
                            renderTo:'divmenu',
                           // style: 'border:0 none; background:transparent;border-top:1px solid #d0d0d0;',
                            items:['&nbsp;',m_navbtMenu,'&nbsp;&nbsp;&nbsp;&nbsp;',m_remarkbmenu,'&nbsp;&nbsp;&nbsp;&nbsp;',m_managebmenu,'&nbsp;&nbsp;&nbsp;&nbsp;',m_systembmenu,'&nbsp;&nbsp;&nbsp;&nbsp;',m_helpbmenu]
                        });
                        this.tbrBox={
                                    xtype: 'box',
                                    el: 'divToolbar',
                                    border: false,
                                    items: [this.tbrMain]
                                };
//                        if(!ApplicationContext.UserInfo.ToolMenu && !ApplicationContext.UserInfo.ToolBar)
//                        {
//                            this.hide();
//                        }
//                        else
//                        {
//                            if(ApplicationContext.UserInfo.ToolMenu)
//                            {
                                this.add({
                                    xtype:'box',
                                    el:'divmenu',
                                    border:true,
                                    item:[tbrmenu]
                                });
//                            }
//                            else
//                            {
//                                tbrmenu.hide();
//                                this.setHeight(42);
//                            }
                            
                            if(ApplicationContext.UserInfo.ToolBar)
                            {
                                this.add(this.tbrBox);                                
                            }
                            else
                            {
                                this.tbrMain.hide();
                                this.setHeight(22);
                            }
//                        }
                        
                },
                BtnMultimediaViewerToggle : function (pressed) {
                    this.m_btnMultimediaViewerToggle.toggle(pressed);
                },
                BtnRemarkEditorToggle : function (pressed) {
                    this.m_btnRemarkEditorToggle.toggle(pressed);
                },
                BtnCollapseOrExpandToggle : function (pressed) {
                    this.m_btnCollapseOrExpand.toggle(pressed);
                },
                btnBackDisabled : function (disabled) {
                    this.m_btnBack.setDisabled(disabled);
                    this.m_actBack.setDisabled(disabled);
                },
                btnNextDisabled : function (disabled) {
                    this.m_btnNext.setDisabled(disabled);
                    this.m_actNext.setDisabled(disabled);
                },
                SetToolbarVisible : function(enable){
                    if(enable)
                    {
                        this.setHeight(63);
                        this.tbrMain.show();
                        this.items.add(this.tbrBox);
                    }
                    else
                    {
                    //todo:先不处理了，即时变化不了
                        var Div=$("#divToolbar");
                        Div.css({ display: "none"});
                        
                        this.items.removeAt(1);
                        
                        this.setHeight(22);
                        this.tbrMain.hide();
                    }
                }
                     
            });