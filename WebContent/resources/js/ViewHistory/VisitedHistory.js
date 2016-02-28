///////////////////////////////////////////////////////////////////////////////
//功能描述：访问记录。
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');


MainFrame.VisitedHistory=function () {
     MainFrame.VisitedHistory.superclass.constructor.call(this, {
                id: 'pnlVisitHistory',
                border: false,
                title: '访问记录',
                autoScroll: true,
                rootVisible: false,
                lines: false,
                singleExpand: true,
                useArrows: true,
                animCollapse: true,
                iconCls: 'iconHistory',
                animate: false,
                tbar: [],
                root: new Ext.tree.TreeNode({ id: 'root', text: '全部', draggable: false })
        });        
};

Ext.extend(MainFrame.VisitedHistory,Ext.tree.TreePanel,{
    initComponent : function ()
    {
        MainFrame.VisitedHistory.superclass.initComponent.call(this); 
        //this.addEvents("dataSourcebeforeLoad",true);
    },
    afterRender : function(container){
            MainFrame.VisitedHistory.superclass.afterRender.call(this);
            var current=this;
            var btnHistoryClear = new Ext.Toolbar.Button({ id: 'btnHistoryClear', icon: 'resources/images/16x16/Delete.png', cls: 'x-btn-icon', tooltip: '<b>清除访问记录</b><br/>', handler: function(){
              current.HistoryClearEventHandler(current)
            }});
            this.topToolbar.add(btnHistoryClear);
    },
    //清除访问记录
    HistoryClearEventHandler:function(current){
         if (confirm('访问记录将全部删除！')==false) {
            return;
         }
         var root = current.root;
         var len=root.childNodes.length;
         for(var i=0;i< len;i++)
         {
           root.childNodes[0].remove();
         }
    }
});