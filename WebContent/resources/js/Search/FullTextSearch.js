/************************************************************************
*功能描述：全文检索
*作者：wanghai
*日期：2008-11-24      
*修改：
*2010-01-20  hyb  新增FullTextSearch文件
************************************************************************/
Service.RegNameSpace('window.Search');
/**
 * purpose:全文搜索输入框
 * @class 
 * @constructor
 * @param {type} name1
 */
Search.FullTextSearchField = Ext.extend(Ext.form.TwinTriggerField, {

        validationEvent:false,
        validateOnBlur:false,
        trigger1Class:'x-form-clear-trigger',
        trigger2Class:'x-form-search-trigger',
        hideTrigger1:true,
        width:180,
        hasSearch : false,
        paramName : 'query',
        
        initComponent : function()
        {
		    Ext.app.SearchField.superclass.initComponent.call(this);
		    this.on
		    (
		        'specialkey', function(f, e)
		        {
                    if(e.getKey() == e.ENTER)
                    {
                       this.onTrigger2Click();
                    }
                }, 
                this
            );
        },



        onTrigger1Click : function()
        {
            if(this.hasSearch)
            {
			    this.el.dom.value = '';
                this.triggers[0].hide();
                this.hasSearch = false;
			    this.focus();
            }
        },

        onTrigger2Click : function()
        {
            var v = this.getRawValue();
            
            if(v.length < 1)
            {
                this.onTrigger1Click();
                return;
            }
            
            var userID = ApplicationContext.IUserInfo().ID;
            try{
             ApplicationContext.MainFrame.ShowBusy();
            ApplicationContext.MainFrame.LoadFullTextSearchPage('ftsearch?pageIndex=1&searchCondition='+encodeURIComponent(v.replace(/<([A-Za-z\/])/g,"$1"))+'&user=' + userID +'&time='+new Date().getMinutes().toString()+new Date().getMilliseconds().toString());
            }
            catch(e)
            {
                ApplicationContext.MainFrame.ShowReady();
            }
          

            this.hasSearch = true;
            this.triggers[0].show();
		    this.focus();
        }
});

/**
 * purpose:全文检索面板
 * @class FullTextSearchPanel
 */
Search.FullTextSearchPanel = Ext.extend(Ext.ux.ManagedIframePanel,{

        id: 'm_pnlFullTextSearch',
        title: '全文搜索',
        iconCls: 'iconFullTextSearch',
        autoScroll: true,
        closable : false,
       // html: '<br><br><center><p style="font:bold 16px 微软雅黑;color:gray">还没有执行过搜索操作</p></center>',

        
        initComponent : function()
        {
		    this.tbar =   [
                                ' ', '搜索内容: ', ' ',
                                new Search.FullTextSearchField
                                ({
                                        width: 400,
                                        paramName: 'q'
                                })
                          ];
                          
            Search.FullTextSearchPanel.superclass.initComponent.call(this);
        },
       listeners:
        {
            documentloaded: function(frame, ex) 
            {
               Service.ForbidOperation(frame.getWindow().document);
               ApplicationContext.MainFrame.ShowReady();
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
