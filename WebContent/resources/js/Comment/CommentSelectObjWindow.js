
Service.RegNameSpace('window.Comment');

/**
 * @功能:意见选择对象窗体 对外公布 confirmSuccess事件
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.CommentSelectObjWindow = Ext.extend(Ext.Window, {
    title: '选择 ',
    closable: true,
    width: 280,
    height: 420,
    plain: true,
    modal: true,
    defaultType: 'textfield',
    autoScroll:true,
    m_EventHandler: null,

    //供选择的树对象
    SelectTree: null,

    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        this.m_EventHandler = new Comment.SelectObjWindowEventHandler(this);
        Comment.CommentSelectObjWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {

        var infoSet = new Ext.form.FieldSet({
            title: ' 说明',
            html: new Ext.Template('<p><b>注意：</b>选择的对象将替换原来所选对象！<br />意见的引用对象可以为DM或者PM，且不允许同时添加</p>'),
            autoHeight: true,
            collapsible: false
        });

        this.InitSelectTree();

        //组装UI界面
        this.items = [this.SelectTree,infoSet];

        this.buttons = [{
            text: '确定',
            handler: this.m_EventHandler.Confirm
        },
        {
            text: '取消',
            handler: this.m_EventHandler.Cancel
        }];

        //增加一个提交成功事件
        this.addEvents({
            "confirmSuccess": true
        });
        Comment.CommentSelectObjWindow.superclass.initComponent.call(this);
    },

    /*
     *	构建选择树
     */
    InitSelectTree: function () {
        this.SelectTree=new MainFrame.Tree.PublicationTreeManager({checked:true,disabled:false,dataType:0,id:'commentSelectTree',
        titlebar:false,header:false});
    },

    /*
     *	同步设置树选中节点
     */
    SetTreeNodesChecked: function (checkObjList) {
        var checkDMCList=new Array();
        for(var i=0;i<checkObjList.length;i++){
            checkDMCList[i]=checkObjList[i].data.DMC;
        }

        this.SelectTree.SetCheckedNodesByDmcs(checkDMCList);
    },

    /*
      *	获取选中的节点的数据对象 
      */
    GetTreeCheckedDatas: function (objType) {
        return this.SelectTree.GetCheckedObjectTypeNodes(objType);
    }
});


/*
 * @功能:意见选择对象窗体事件处理类
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.SelectObjWindowEventHandler = function (sender) {
    var selectObjWindow = sender;

    /*
     *	确定
     */
    this.Confirm = function () {
        var count=0;
        var selectObjList=new Array();
        
        //优先PM
        var pmSelectNodes=selectObjWindow.GetTreeCheckedDatas("PM");
        var refpmSelectNodes=selectObjWindow.GetTreeCheckedDatas("RefPM");
        var dmSelectNodes=selectObjWindow.GetTreeCheckedDatas("RefDM");
        var hastable=new Service.HashTable();
        
        if(pmSelectNodes!=null&&pmSelectNodes.length>0)
        {
            for(var i=0;i<pmSelectNodes.length;i++)
            {
                if(pmSelectNodes[i].codeString!=undefined){
                    var itemArray=new Array();
                    itemArray[0]=pmSelectNodes[i].text;
	                itemArray[1]=pmSelectNodes[i].codeString;
	                itemArray[2]=pmSelectNodes[i].issno;
	                itemArray[3]=pmSelectNodes[i].language;
	                itemArray[4]='PM';
	                if(!hastable.Contains(pmSelectNodes[i].codeString))
	                {
	                    selectObjList[count]=itemArray;
	                    hastable.Add(pmSelectNodes[i].codeString);
	                    count++;
	                }
                }
            }
        }
        
        //其次RefPM
        hastable=new Service.HashTable();
        if(selectObjList.length==0)
        {
            if(refpmSelectNodes.length>0&&dmSelectNodes.length>0)
            {
                Service.ShowMessageBox('提示', '不能同时选择PM和DM对象！', Ext.MessageBox.OK, Ext.MessageBox.INFO,null);
                return;
            }
            count=0;
            for(var i=0;i<refpmSelectNodes.length;i++)
            {
                if(refpmSelectNodes[i].codeString!=undefined){
                    var itemArray=new Array();
                    itemArray[0]=refpmSelectNodes[i].text;
	                itemArray[1]=refpmSelectNodes[i].codeString;
	                itemArray[2]=refpmSelectNodes[i].issno;
	                itemArray[3]=refpmSelectNodes[i].language;
	                itemArray[4]='PM';
	                if(!hastable.Contains(refpmSelectNodes[i].codeString))
	                {
	                    selectObjList[count]=itemArray;
	                    hastable.Add(refpmSelectNodes[i].codeString);
	                    count++;
	                }
	                
                }
            }
        }
        
        //最后RefDM
        hastable=new Service.HashTable();
        if(selectObjList.length==0)
        {
            
             count=0;
             if(dmSelectNodes!=null&&dmSelectNodes.length>0)
             {
                    for(var i=0;i<dmSelectNodes.length;i++){
                        var itemArray=new Array();
                        itemArray[0]=dmSelectNodes[i].text;
	                    itemArray[1]=dmSelectNodes[i].codeString;
	                    itemArray[2]=dmSelectNodes[i].issno;
	                    itemArray[3]=dmSelectNodes[i].language;
	                    itemArray[4]='DM';
	                    if(!hastable.Contains(dmSelectNodes[i].codeString))
	                    {
	                        selectObjList[count]=itemArray;
	                        hastable.Add(dmSelectNodes[i].codeString);
	                        count++;
	                    }
	                   
                    }
             }
        }
        

        if (selectObjList != null && selectObjList != undefined && selectObjList.length > 0) {
            selectObjWindow.fireEvent("confirmSuccess", selectObjList)
        }
        else
        {
            Service.ShowMessageBox('提示', '未选择有效对象！', Ext.MessageBox.OK, Ext.MessageBox.INFO,null);
            return;
        }
        selectObjWindow.close();
    };

    /*
     *	取消
     */
    this.Cancel = function () {
        selectObjWindow.close();
    }
};