///////////////////////////////////////////////////////////////////////////////
//功能描述：静态类，公开主框架可以被调用的接口。
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
//
//定义命名空间
//
 Service.RegNameSpace('window.MainFrame');
 
 /**
 * 目的：静态类，公开主框架可以被调用的接口。 
 */
 MainFrame.Interface=function(viewer){
     this.m_Wiever=viewer;
 };
 
 /**
 * 目的：获得当前主页签中的DM信息。
 * @return Dmc,Issno,Language,Country,Title,Src
 */
 MainFrame.Interface.prototype.GetMainTabDMinfo=function()
 {
   var dminfo;
   try{
       var tab=this.m_Wiever.MutliTab.findById("main");
        if(tab.IETM!= undefined)
                dminfo=tab.IETM.Common.DMinfo;
       return dminfo;
   }
   catch(e){
        return null;
   }
   
 };
 
 /**
 * 目的：获得当前激活页签中的DM信息。
 * @return Dmc,Issno,Language,Country,Title,Src
 */
 MainFrame.Interface.prototype.GetActiveTabDMinfo=function()
 { 
       var dminfo;
       try{
           var tab=this.m_Wiever.MutliTab.activeTab;
           if(tab.IETM!= undefined)
                dminfo=tab.IETM.Common.DMinfo;
           return dminfo;
       }
       catch(e){
            return null;
       }
 };
 
 /**
 * 目的：获得当前激活页签中的IETM接口。
 * @return IETM接口
 */
 MainFrame.Interface.prototype.GetActiveTabIETM=function()
 { 
       try{
           var tab=this.m_Wiever.MutliTab.activeTab;
           if(tab.IETM!= undefined)
                return tab.IETM;
       }
       catch(e){
            return null;
       }
 };
 
  /**
 * 目的：获得当前激活树的信息。
 * @return IETM接口
 */
 MainFrame.Interface.prototype.GetActiveTreeInfo=function()
 { 
       try{
           var TreeInfo;
           var NavTree=this.m_Wiever.Navigation.navigationTreePanel.m_pnlNavTree;
           if(NavTree.activeTab.id=='m_pnlDirectoryContainer')
            {
                tab=NavTree.items.item(0);
            }
            else{
                tab=NavTree.activeTab;
            }
            
            TreeInfo={TreeType:tab.id,SelNode:tab.selNode()};
            return TreeInfo;
       }
       catch(e){
            return null;
       }
 };
 
 
 /**
 * 目的：获取备注控件
 */
 MainFrame.Interface.prototype.GetReMarkEditor=function()
 { 
       try{
          return this.m_Wiever.RemarkEditor;
       }
       catch(e){
            return null;
       }
 };
 
 
  /**
 * 目的：在主页签中打开一个新的HTML页面。
 * @param href  要打开的HTML页面的URL
 * @param xrefId 打开页面后要定位的ID
 * @param isBackOrForward 是否前进后退加载页签
 * @param panelConfig 要打开的页面所在面板的配置
 */
 MainFrame.Interface.prototype.LoadMainHTMLTab=function(id,href,xrefId,navigateType){
    //过滤
    
     var Wiever=this.m_Wiever;
     if (id!=undefined && id!='') 
     {
           
           ApplicationContext.FilterService.FilterDMC(id,function () {
                 Wiever.MutliTab.loadMainHTMLTab(id,href,xrefId);
                 Wiever.Navigation.LocateTreeNode(id);
           },navigateType);
     }
     else
         this.m_Wiever.MutliTab.loadMainHTMLTab(id,href,xrefId);
 
 };
 
 /**
 * 目的：在主页签中打开一个新的HTML页面。
 * @param href  要打开的HTML页面的URL
 * @param xrefId 打开页面后要定位的ID
 * @param panelConfig 要打开的页面所在面板的配置
 */
 MainFrame.Interface.prototype.GoHome=function(){
    //过滤
     var Wiever=this.m_Wiever;
     Wiever.mainFrameHandler.MainToolbarHandler.MainToolbar_Click({id:"m_btnHomepage"});
 
 };
 
 /**
 * 目的：在多页签中打开一个新的HTML页面。
 * @param href  要打开的HTML页面的URL
 * @param xrefId 打开页面后要定位的ID
 * @param panelConfig 要打开的页面所在面板的配置
 */
MainFrame.Interface.prototype.LoadNewHTMLTab = function(id,href,xrefId){
    //过滤
    var Wiever=this.m_Wiever;
    if (id!=undefined && id!='') {
           ApplicationContext.FilterService.FilterDMC(id,function () {
                 Wiever.MutliTab.loadNewHTMLTab(id,href,xrefId);
                 Wiever.Navigation.LocateTreeNode(id);
           });
    }
    else
    {
         this.m_Wiever.MutliTab.loadNewHTMLTab(id,href,xrefId);
    }
   
};

//刷新页面内容
MainFrame.Interface.prototype.RefreshMainHTMLTab = function(){
    return this.m_Wiever.MutliTab.refreshMainHTMLTab();
};

/**
 * 目的：在导航树中定位。
 * @param id  定位的树节点ID或者dmc.
 */
MainFrame.Interface.prototype.LocateTreeNode = function(id){
    return this.m_Wiever.Navigation.LocateTreeNode(id);
};

/**
 * 目的：重新加载树。
 */
MainFrame.Interface.prototype.ReLoadTree = function(){
    this.m_Wiever.Navigation.ReLoadTree();
};


/**
 * 目的：在多页签中打开一个新panel。
 * @param apanel  要打开的panel
 */
MainFrame.Interface.prototype.loadPanelTab = function(apanel,href){

    this.m_Wiever.MutliTab.loadPanelTab(apanel,href);

};

/**
 * 目的:在全文检索的页面中打开网页
 * @href {String} 全文检索网页地址
 */
MainFrame.Interface.prototype.LoadFullTextSearchPage = function(href){
    this.m_Wiever.MutliTab.LoadFullTextSearchPage(href);
};

 /**
 * 目的：故障隔离中定位故障。
 * @param ProcID  故障ID
 */
MainFrame.Interface.prototype.LocateDirectoryTree = function(){
    var dminfo=this.GetActiveTabDMinfo();
    this.m_Wiever.Navigation.LocateDirectoryTreeNode(dminfo.Dmc);
};

/**
 * 目的：加载多媒体。
 */
MainFrame.Interface.prototype.ViewMultimedia = function(src, type,arr,eventList,reload){  
     top.ifmMultimediaViewer.window.SetSrc(src, type,arr,reload,eventList);
//     var multimediaViewer=this.m_Wiever.MultimediaViewer;
//     multimediaViewer.SetSrc(src, type,arr,reload,eventList);
};


/**
 * 目的：//multimediaType: 0 图像; 1 视频;2全屏按钮也隐藏.
 */
MainFrame.Interface.prototype.SetMultimediaToolbarState =function(multimediaType) {
        var multimediaViewer=this.m_Wiever.MultimediaViewer;
        if(multimediaType==2)
        {
             multimediaViewer.m_btnFullScreen.setDisabled(true);
             for (i = 0; i < multimediaViewer.m_arrGraphicButtons.length; i++) {
                if (multimediaViewer.m_arrGraphicButtons[i].setDisabled)
                    multimediaViewer.m_arrGraphicButtons[i].setDisabled(true);
             }
        }
        else
        {
              multimediaViewer.m_btnFullScreen.setDisabled(false);
              for (i = 0; i < multimediaViewer.m_arrGraphicButtons.length; i++) {
                if (multimediaViewer.m_arrGraphicButtons[i].setDisabled)
                    multimediaViewer.m_arrGraphicButtons[i].setDisabled(false);
                    
                if (multimediaViewer.m_arrGraphicButtons[i].setVisible)
                    multimediaViewer.m_arrGraphicButtons[i].setVisible(multimediaType == 0);
             }
        }
        
        var zoom=top.ifmMultimediaViewer.window.zoom;
        if(zoom!=undefined && zoom<=0)
            multimediaViewer.m_btnSetPanMode.setDisabled(true);
    };
    
     /**
     * 目的：获取手型按钮的状态
     */
    MainFrame.Interface.prototype.GetMultimediaViewerPressState =function() {
        var multimediaViewer=this.m_Wiever.MultimediaViewer;
         for (i = 0; i < multimediaViewer.m_arrGraphicButtons.length; i++) {
            if(multimediaViewer.m_arrGraphicButtons[i].id=="m_btnSetPanMode")
                return multimediaViewer.m_arrGraphicButtons[i].pressed;
         }
         
         return false;
    };
    

 /**
 * 目的：设置多媒体预览区和按钮的Disabled.
 */
 MainFrame.Interface.prototype.SetMultimediaViewerDisabled =function(disabled) {
        var multimediaViewer=this.m_Wiever.MultimediaViewer;
        multimediaViewer.setDisabled(disabled);
        if (top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.window.SetDisabled)
            top.ifmMultimediaViewer.window.SetDisabled(disabled);
            
        var zoom=top.ifmMultimediaViewer.window.zoom;
        if(zoom!=undefined && zoom<=0)
            multimediaViewer.m_btnSetPanMode.setDisabled(true);
    };
    
  /**
 * 目的：获取多媒体框的状态.
 */
 MainFrame.Interface.prototype.GetMultimediaViewerCollapsed =function() {
        var multimediaViewer=this.m_Wiever.MultimediaViewer;
        return multimediaViewer.collapsed;
    };
    
 MainFrame.Interface.prototype.SetMultimediaVieSwerCollapsed = function(collapsed) {
        var multimediaViewer=this.m_Wiever.MultimediaViewer;
        var curryCollapsed=multimediaViewer.collapsed;
        var toolbar=this.m_Wiever.Toolbar;
        if (curryCollapsed == collapsed)
            return;
        //同步多煤体按钮
            toolbar.BtnMultimediaViewerToggle(!collapsed);

        if (collapsed) {
          multimediaViewer.collapse();
          //收起多媒体栏的时候需要把界面上的toolTip清除掉，否则界面不会刷新 （bug1809）
          try
          {
              var ativeDoc=this.m_Wiever.MutliTab.activeTab.getFrameDocument();
              if(ativeDoc!=null||ativeDoc!=undefined)
              {
                    var toolTip=$("#tooltip",ativeDoc);
                    if(toolTip.length>0)
                        toolTip[0].style.display="none";
              }
           }
          catch(e)
          {}
        }
        else {
              multimediaViewer.expand();
        }
        

    };

 /**
 * 目的：设置多媒体预览下一图按钮的Disabled.
 */
 MainFrame.Interface.prototype.SetNextGraphicDisabled =function(disabled) {
        var multimediaViewer=this.m_Wiever.MultimediaViewer;
        multimediaViewer.m_btnNextGraphic.setDisabled(disabled);
    };


 /**
 * 目的：设置多媒体预览区上一图按钮的Disabled.
 */
 MainFrame.Interface.prototype.SetPreGraphicDisabled =function(disabled) {
        var multimediaViewer=this.m_Wiever.MultimediaViewer;
        multimediaViewer.m_btnPreGraphic.setDisabled(disabled);
    };


/**
 * 目的：页面导航按钮类型。
 */
MainFrame.Interface.prototype.PageNavigationButtonType={
        Afi_Report:'m_btnAfiReport',
        Afi_Back:'m_btnAfiUpStep',
        Afi_Begin:'m_btnAfiMode',
        Proced_Next:'m_btnDownStep',
        Proced_Back:'m_btnUpStep',
        Proced_Begin:'m_btnStepMode',
        Process_Next:'m_btnProcessBackStep',
        Process_Back:'m_btnProcessUpStep',
        Process_Begin:'m_btnProcessMode',
        Process_Return:'m_btnProcessReturnStep'
};

/**
 * 目的：设置页面导航按钮状态。
 * @param Buttontype 按钮类型
 * @param disabled 是否可用bool
 */
MainFrame.Interface.prototype.SetPageNavigationButtonVisible = function(Buttontype,visible){
      var toolbarButton;
      var toolbars
      var activeTab=this.m_Wiever.MutliTab.activeTab;
      if(activeTab!=undefined && activeTab.getBottomToolbar!=undefined)
          toolbars = this.m_Wiever.MutliTab.activeTab.getBottomToolbar();
      if(toolbars!=undefined)
          toolbarButton=toolbars.items.item(Buttontype);
       if(toolbarButton!=undefined)
         toolbarButton.setVisible(visible);
};

/**
 * 目的：设置页面导航按钮状态。
 * @param Buttontype 按钮类型
 * @param disabled 是否可用bool
 */
MainFrame.Interface.prototype.SetPageNavigationButtonToggle = function(Buttontype,pressed){
      var toolbarButton;
      var toolbars
      var activeTab=this.m_Wiever.MutliTab.activeTab;
      if(activeTab!=undefined && activeTab.getBottomToolbar!=undefined)
          toolbars = this.m_Wiever.MutliTab.activeTab.getBottomToolbar();
      if(toolbars!=undefined)
          toolbarButton=toolbars.items.item(Buttontype);
       if(toolbarButton!=undefined)
         toolbarButton.toggle(pressed);
};
/**
 * 目的：设置页面导航按钮状态。
 * @param Buttontype 按钮类型
 * @param disabled 是否可用bool
 */
MainFrame.Interface.prototype.SetPageNavigationButtonDisabled = function(Buttontype,disabled){
      var toolbarButton;
      var toolbars
      var activeTab=this.m_Wiever.MutliTab.activeTab;
      if(activeTab!=undefined && activeTab.getBottomToolbar!=undefined)
          toolbars = this.m_Wiever.MutliTab.activeTab.getBottomToolbar();
      if(toolbars!=undefined)
          toolbarButton=toolbars.items.item(Buttontype);
       if(toolbarButton!=undefined)
         toolbarButton.setDisabled(disabled);
};

/**
 * 目的：设置页面工具栏状态。
 * @param Buttontype 按钮类型
 * @param disabled 是否可用bool
 */
MainFrame.Interface.prototype.SetTopToolbarButtonDisabled = function(Buttontype,disabled){
      var toolbarButton;
      var toolbars
      var activeTab=this.m_Wiever.MutliTab.activeTab;
      if(activeTab!=undefined && activeTab.getTopToolbar!=undefined)
          toolbars = this.m_Wiever.MutliTab.activeTab.getTopToolbar();
      if(toolbars!=undefined)
          toolbarButton=toolbars.items.item(Buttontype);
       if(toolbarButton!=undefined)
         toolbarButton.setDisabled(disabled);
};


/**
 * 目的：设置放大栏是否有效。
 * @param disabled 是否可用bool
 */
MainFrame.Interface.prototype.SetSliderDisabled = function(disabled){
    var activeTab=this.m_Wiever.MutliTab.activeTab;
    if(activeTab.m_sldZoom!=undefined)
    {
        //var zoom = activeTab.m_sldZoom.getValue();
        if(!disabled)
        {
            activeTab.m_sldZoom.setValue(100);
        }
        activeTab.m_sldZoom.setDisabled(disabled);
        activeTab.m_btnZoom.setDisabled(disabled);
    }
};

/**
 * 目的：设置页面工具栏状态。
 * @param Buttontype 按钮类型
 * @param disabled 是否可用bool
 */
MainFrame.Interface.prototype.SetMainToolbarButtonClick = function(Buttontid){
      this.m_Wiever.mainFrameHandler.MainToolbarHandler.MainToolbar_Click({id:Buttontid});
};


/**
 * 目的：屏蔽整个框架的功能
 */
MainFrame.Interface.prototype.ShowBusy = function(){
      this.m_Wiever.showBusy();
};


/**
 * 目的：取消屏蔽。
 */
MainFrame.Interface.prototype.ShowReady = function(){
      this.m_Wiever.showReady();
};



 
 
 
 
 
 
 