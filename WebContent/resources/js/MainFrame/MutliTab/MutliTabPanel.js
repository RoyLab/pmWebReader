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
 * 目的：创建center区域多页签面板类
 * @return  Ext.TabPanel对象，
 */
MainFrame.PanelMutliTab= function(config){
        MainFrame.PanelMutliTab.superclass.constructor.call(this, {
            m_centerPanelMutliTabHandler:null,
            id:'doc-body',
            region:config.region,
            deferredRender: false,
            enableTabScroll: true,
            activeTab:'main'
        });
    };
    
    
    Ext.extend(MainFrame.PanelMutliTab, Ext.TabPanel, {
       
        initComponent : function ()
        {
                this.m_centerPanelMutliTabHandler=new MainFrame.PanelMutliTabHandler(this);
                MainFrame.PanelMutliTab.superclass.initComponent.call(this);
                this.addEvents({"tabDocumentloaded":true,"tabDocumentBeforeload":true});
            
                //初始化加载主页
                var p = this.add(new MainFrame.FramePanel({Cls:'main',iconCls:'iconHome',title:'主页',closable:false}));
                var curry=this;
                p.on("documentloaded",function (frame, ex) {
                    this.m_frameHandler.FramePage_onload(frame, ex);
                     curry.fireEvent("tabDocumentloaded",this,frame, ex);
                     //当页面标题改变时，也改变enableTabScroll bug2451
                      MainFrame.PanelMutliTab.superclass.delegateUpdates.call(curry);  
                });
                
                
                //全文检索
                var fullTextSearchPanel=new Search.FullTextSearchPanel({id : 'fullTextSearch', Cls:'fullTextSearch'});
                this.loadPanelTab(fullTextSearchPanel);
                
                
        },
        initEvents : function(){
            MainFrame.PanelMutliTab.superclass.initEvents.call(this);
            //this.body.on('click', this.onClick, this);this.dom.onreadystatechange
        },
         /**
         * 目的：重写remove页签的方法，变为隐藏。
         */
        remove : function(comp, autoDestroy) { 
                             //MainFrame.PanelMutliTab.superclass.remove.call(this,comp, autoDestroy);
                             var c = this.getComponent(comp);
                             this.hideTabStripItem(c);
                             this.setActiveTab('main');
         },
         /**
         * 目的：在主页签中打开一个新的HTML页面。
         * @param href  要打开的HTML页面的URL
         * @param xrefId 打开页面后要定位的ID
         * @param panelConfig 要打开的页面所在面板的配置
         */
        loadMainHTMLTab : function(dmid,href,xrefId){

            var tab =  this.getComponent('main');
            tab.cclass=xrefId;
            tab.dmID=dmid;
            if(tab){
                if(tab.IETM!=undefined && tab.IETM.Common.DMinfo.Src==href)
                   this.setActiveTab(tab);
                else{
                    this.fireEvent("tabDocumentBeforeload",tab);
                    tab.IETM=null;
                    this.setActiveTab(tab);
                    tab.setSrc(href);
                    //关闭副页签
//                    var items=this.items.items; 
//                    for(var i=1;i<items.length;i++)
//                    {
//                        if (items[i].id == "fullTextSearch" || items[i].id == "m_pnlScheduleQuery" || items[i].id == "m_pnlAdvancedSearch") 
//                            continue;
//                        this.remove(items[i]);
//                    }
                }
            }
        },
        
        refreshMainHTMLTab : function(){

            var tab =  this.getComponent('main');
            if(tab == null || tab.iframe == null)
                return false;
            
            var dmid = tab.dmID;
            var href = tab.iframe.src;
            var xrefId = null;
            try
            {
                xrefId = tab.cclass;
            }
            catch(e){}
            
            if(tab){
                this.fireEvent("tabDocumentBeforeload",tab);
                tab.IETM = null;
                this.setActiveTab(tab);
                tab.setSrc(href);
                
            }
            
            return true;
        },
        
         /**
         * 目的：在多页签中打开一个新的HTML页面。
         * @param href  要打开的HTML页面的URL
         * @param xrefId 打开页面后要定位的ID
         * @param panelConfig 要打开的页面所在面板的配置
         */
        loadNewHTMLTab : function(dmc,href,xrefId){
            var id=dmc;
            var tab = this.getComponent(id);
            if(tab){
                //tab.IETM=null;   注释这个的原因是：第二次进入副页签中获取不到Dm信息
                if(tab.hidden)
                {
                    this.unhideTabStripItem(tab);
                }
                this.setActiveTab(tab);
                if(xrefId!=undefined && xrefId!='')
                    tab.scrollToMember(xrefId);
            }else{
                var p = this.add(new MainFrame.FramePanel({Cls:dmc}));
                var curry=this;
                p.on("documentloaded",function (frame, ex) {
                    this.m_frameHandler.FramePage_onload(frame, ex);
                    curry.fireEvent("tabDocumentloaded",this,frame, ex);
                     if(xrefId!=undefined && xrefId!='')
                        p.scrollToMember(xrefId);
                });
                
                this.fireEvent("tabDocumentBeforeload",tab);
                
                this.setActiveTab(p);
                p.setSrc(href);
            }
        },
         /**
         * 目的：在多页签中打开一个新panel。
         * @param apanel  要打开的panel，如果是Object是一个面板，是新加入页签面板。
         *                               如果是ID，是将隐藏的面板显示。
         */
        loadPanelTab : function(apanel,href){
            var tab=null;
            if(typeof(apanel)=="object")
            {
                 tab = this.getComponent(apanel.id);
                 if(tab!=undefined && tab!=null && tab.hidden)
                 {
                    //关闭时是隐藏的页签，这里关闭。
                    MainFrame.PanelMutliTab.superclass.remove.call(this,apanel.id, true);
                    tab=null;
                 }
                 
                 if(tab){
                        this.setActiveTab(tab);
                    }else{
                        tab = this.add(apanel);
                        this.setActiveTab(tab);
                        
                        if(tab.getEl()!=undefined)
                            Service.ForbidOperation(tab.getEl().dom);
                    }
            }
            else{//
                tab = this.getComponent(apanel);
                if(tab.hidden)
                {
                    this.unhideTabStripItem(tab);
                }
                this.setActiveTab(tab);
            }
           
            if(href!=undefined)
            {
                tab.setSrc(href);
                if(tab.getFrameDocument()!=undefined)
                   Service.ForbidOperation(tab.getFrameDocument());
            }
        },
        
        /**
         * purpose:在全文检页面中打开网页.
         * @href {String} 网页地址
         */
        LoadFullTextSearchPage : function (href) 
        {
            var tab =  this.getComponent('fullTextSearch');
            if(tab){
                tab.setSrc(href);
                if(tab.getFrameDocument()!=undefined)
                   Service.ForbidOperation(tab.getFrameDocument());
            }
        }
    });



