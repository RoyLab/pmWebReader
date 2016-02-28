///////////////////////////////////////////////////////////////////////////////
//功能描述：主框架 分为东，西，南，北，中五个部分。
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
         /**
         * 目的：创建主框架视图类，
         *       持有东，西，南，北，中五个部分的面板对象。
         */
        MainFrame.Viewer=function () {
            this.Toolbar;
            this.Navigation;
            this.MutliTab;
            this.MultimediaViewer;
            this.RemarkEditor;
            this.myMask;
            this.History;

             ApplicationContext.MainFrame=new MainFrame.Interface(this);
             ApplicationContext.FilterService= new Service.FilterService(ApplicationContext.IUserInfo());
             MainFrame.Viewer.superclass.constructor.call(this, {
                id: 'mainViewPort',
                layout: 'border'
             });
        };
        Ext.extend(MainFrame.Viewer,Ext.Viewport,
        {
            initComponent : function(){
               MainFrame.Viewer.superclass.initComponent.call(this);
               //初始化东，西，南，北，中五个模块。
               this.Toolbar=new MainFrame.PanelToolbar({region:'north'});
               this.Navigation=new MainFrame.PanelNavigation({region:'west'});
               this.MutliTab=new MainFrame.PanelMutliTab({region:'center'});
               this.MultimediaViewer=new MainFrame.PanelMultimediaViewer({region:'east'});
               this.RemarkEditor=new MainFrame.PanelRemarkEditor({region:'south'});
               //视图的历史记录
               this.History=new ViewHistory.ViewHistoryManager();

               //如果是RCM接口隐藏部分模块
               if(ApplicationContext.IUserInfo().FullShow=='0' && ApplicationContext.IUserInfo().RcmUser)
               {
                    this.Toolbar.hidden=true;
                    this.RemarkEditor.hidden=true;
                    this.Navigation.hidden=true;
			   }

               //在视图中加入各个模块。
               this.add(this.Toolbar);
               this.add(this.Navigation);
               this.add(this.MutliTab);
               this.add(this.MultimediaViewer);
               this.add(this.RemarkEditor);

               //

             },
             afterRender : function(){
                   MainFrame.Viewer.superclass.afterRender.call(this);
                     /**
                     * 为各个模块加载公开的事件挂接处理方法，只有需要跨模块调用的事件才会公开。
                     */
                   this.mainFrameHandler=new MainFrame.MainFrameHandler(this);
                   var current=this;

                   //点击导航树上的节点，需要在多页签模块中加入一个新的页面。
                   this.Navigation.on("DMInfoChanged",function(treePanel,dmInfo){
                        current.mainFrameHandler.DMInfo_Changed(treePanel,dmInfo);
                   });

                   //点击菜单或者工具栏时激发的事件，该事件要根据点击的按钮不同响应不同的处理方法。
                   this.Toolbar.on("MainToolbar_Click",function(button,pressed){
                        current.mainFrameHandler.MainToolbarHandler.MainToolbar_Click(button,pressed);
                   });

                   //页签改变前。
                   this.MutliTab.on("beforetabchange",function(){
                        current.mainFrameHandler.MutliTab_beforeTabchange();
                   });

                    //页签改变。
                   this.MutliTab.on("tabchange",function(TabPanel, Panel){
                        current.mainFrameHandler.MutliTab_Tabchange(TabPanel, Panel);
                   });

                    //页签内容加载前。
                   this.MutliTab.on("tabDocumentBeforeload",function(tab){
                        current.mainFrameHandler.MutliTabDocument_Beforeload(tab);
                   });

                   //页签内容加载完成。
                   this.MutliTab.on("tabDocumentloaded",function(tab,frame, ex){
                        current.mainFrameHandler.MutliTabDocument_loaded(tab,frame,ex);
                   });


                   /**
                     * 展开和折叠后的处理
                     */
                   this.MultimediaViewer.on("expand",function (p) {
                        current.mainFrameHandler.MultimediaViewer_expand(p);
                   });
                   this.MultimediaViewer.on("collapse",function (p) {
                        current.mainFrameHandler.MultimediaViewer_collapse(p);
                   });

                   this.RemarkEditor.on("expand",function (p) {
                        current.mainFrameHandler.RemarkEditor_expand(p);
                   });
                   this.RemarkEditor.on("collapse",function (p) {
                        current.mainFrameHandler.RemarkEditor_collapse(p);
                   });

                   this.Navigation.on("expand",function (p) {
                        current.mainFrameHandler.Navigation_expand(p);
                   });
                   this.Navigation.on("collapse",function (p) {
                        current.mainFrameHandler.Navigation_collapse(p);
                   });
             },
             //屏蔽整个框架的功能
             showBusy:function() {
                 if(this.myMask==undefined)
                    this.myMask = new Ext.LoadMask(Ext.getBody(),{msg:"正在加载页面..."});
                 this.myMask.show();
             },
             //取消屏蔽
             showReady:function() {
             if(this.myMask!=undefined)
                   this.myMask.hide();
             }
        })
