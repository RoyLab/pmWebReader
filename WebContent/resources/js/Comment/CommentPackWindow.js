

Service.RegNameSpace('window.Comment');

/*
 *	扩展CheckBox列
 */
Ext.grid.CheckColumn = function (config) {
    this.onRowCheckedChanged=null;
    
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
    
    
};

Ext.grid.CheckColumn.prototype = {
    init: function (grid) {
        this.grid = grid;
        this.grid.on('render', function () {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        },
        this);
    },

    onMouseDown: function (e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();;
            SelectCheckExtendMethod.call(this, t);
        }

        function SelectCheckExtendMethod(t) {
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            var newValue = !record.data[this.dataIndex];
            record.set(this.dataIndex, newValue);
            if(this.onRowCheckedChanged!=null)
                this.onRowCheckedChanged(newValue);
        }
    },

    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};

/**
 * @功能:意见打包窗体 
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.CommentPackWindow = Ext.extend(Ext.Window, {
    title: '打包意见 ',
    layout: 'fit',
    width: 650,
    height: 500,
    modal: true,
    closable: false,
    plain: true,

    m_GridViewReader: null,
    m_GridViewColModel: null,
    m_EventHandler: null,
    m_selectAllCheckBox:null,

    //意见列表
    CommentListGrid: null,

    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        this.m_EventHandler = new Comment.CommentPackWindowEventHandler(this);
        Comment.CommentPackWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {

        m_GridViewReader = new Ext.data.ArrayReader({},
        [{
            name: 'ID'
        },
        {
            name: 'Title'
        },
        {
            name: 'Code'
        },
        {
            name: 'IsChosed',
            type: 'bool'
        }]);

        var store = new Ext.data.Store({
            reader: m_GridViewReader,
            data: new Array()
        });

        var checkColumn = new Ext.grid.CheckColumn({
            header: "选择",
            width: 50,
            sortable: true,
            dataIndex: 'IsChosed',
            onRowCheckedChanged:this.m_EventHandler.onrGridRowCheckedChanged
        });
        

        m_GridViewColModel = new Ext.grid.ColumnModel([{
            header: "标题",
            width: 200,
            sortable: true,
            dataIndex: 'Title'
        },
        {
            header: "编码",
            width: 300,
            sortable: true,
            dataIndex: 'Code'
        },
        checkColumn]);

        this.CommentListGrid = new Ext.grid.GridPanel({
            id: 'CommentsView',
            split: true,
            title: '意见列表',
            height: 450,
            store: store,
            cm: m_GridViewColModel,
            viewConfig: {
                forceFit: true
            },
            plugins: checkColumn,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            })

        });

        m_selectAllCheckBox = new Ext.form.Checkbox({
            boxLabel: '全选',
            name: 'cb-auto-1',
            checked: true,
            listeners: {
                'check': this.m_EventHandler.onCheckedChange
            }
        });

        this.items = [{
            xtype: 'checkboxgroup',
            fieldLabel: '意见列表',
            columns: 1,
            items: [this.CommentListGrid]
        }];
        this.buttons = [
        m_selectAllCheckBox, {
            text: '打包所选意见',
            handler: this.m_EventHandler.Confirm
        },
        {
            text: '取消',
            handler: this.m_EventHandler.Cancel
        }];

        Comment.CommentPackWindow.superclass.initComponent.call(this);
        this.on("resize", this.ResizeGirdSize);
    },

    /*
     *	绑定列表数据
     */
    BindCommentListUIData: function (commentArray) {
        var store = new Ext.data.Store({
            reader: m_GridViewReader,
            data: commentArray
        });
        this.CommentListGrid.reconfigure(store, m_GridViewColModel);
    },

    /*
     *	从CommentList转换显示列表需要的数据源
     */
    BuidListViewData: function (commentList) {
        var resultArray = new Array();
        for (var i = 0; i < commentList.length; i++) {
            var itemArray = new Array();
            itemArray[0] = commentList[i][0];
            itemArray[1] = commentList[i][7];
            itemArray[2] = commentList[i][17];
            itemArray[3] = 1;
            resultArray[i] = itemArray;
        }
        return resultArray;
    },

    /*
     *	获取选中的意见ID列表
     */
    GetCheckedCommentIDList: function () {
        var gridData = this.CommentListGrid.store.data;
        var idArray = new Array();
        var count = 0;
        for (var i = 0; i < gridData.items.length; i++) {
            if (gridData.items[i].data.IsChosed) {
                idArray[count] = gridData.items[i].data.ID;
                count++
            }
        }
        return idArray;
    },

    /*
     *	自适应表格高度
     */
    ResizeGirdSize: function (win, width, height) {
        try {
            if (this.CommentListGrid != null && this.CommentListGrid != undefined) this.CommentListGrid.setHeight(height - 72);
        }
        catch(e) {}
    },
    
    /*
     *	设置全选按钮是否被选中
     */
    SetAllCheckBoxChcckState:function (isChecked) {
        m_selectAllCheckBox.un('check',this.m_EventHandler.onCheckedChange)
        m_selectAllCheckBox.setValue(isChecked);
        m_selectAllCheckBox.on('check',this.m_EventHandler.onCheckedChange)
    }
});

/**
 * @功能:意见打包窗体事件处理类 
 * @作者: LuCan
 * @日期: 2010/01/08
 */
Comment.CommentPackWindowEventHandler = function (sender) {

    //持有UI窗体
    var packWindow = sender;

    /*
     *	全选CheckBox选中状态改变
     */
    this.onCheckedChange = function (checkBox, checked) {
        var gridData = packWindow.CommentListGrid.store.data;
        var newDataArray = new Array();
        for (var i = 0; i < gridData.items.length; i++) {
            var itemArray = new Array();
            itemArray[0] = gridData.items[i].data.ID;
            itemArray[1] = gridData.items[i].data.Title;
            itemArray[2] = gridData.items[i].data.Code;
            itemArray[3] = checked;

            newDataArray[i] = itemArray;
        }
        packWindow.BindCommentListUIData(newDataArray);
    };
    
    /*
     *	单击数据行
     */
    this.onrGridRowCheckedChanged=function (checkedValue) {
        
        //同步全选按钮
        if(checkedValue){
            var allCheck=true;
             var gridData = packWindow.CommentListGrid.store.data;
            for (var i = 0; i < gridData.items.length; i++) {
                if(!gridData.items[i].data.IsChosed)
                {
                    allCheck=false;
                    break;
                }
            }
             packWindow.SetAllCheckBoxChcckState(allCheck);
        }
        else
            packWindow.SetAllCheckBoxChcckState(false);
    };

    /*
     *	确认
     */
    this.Confirm = function () {
        var idArray = packWindow.GetCheckedCommentIDList();
        var idStr = '';
        var detailWindow;
        if (idArray.length == 0) {
            Service.ShowMessageBox('信息', '未选择任何意见进行打包！', Ext.MessageBox.OK, Ext.MessageBox.INFO, null);
            return;
        }
        idStr = BuidIDString(idArray);
        detailWindow = new Comment.CommentPackDetailWindow();
        detailWindow.CommentsIDStr = idStr;
        detailWindow.show();
        packWindow.close();
    };

    /*
     *	取消
     */
    this.Cancel = function () {
        packWindow.close();
    };

    /**************************辅助方法******************************************************
    /*
     *	通过ID数组构造ID字符串参数
     */
    function BuidIDString(idArray) {
        var str = '';
        for (var i = 0; i < idArray.length; i++) {
            str += idArray[i];
            str += '&&';
        }
        return str;
    };
};