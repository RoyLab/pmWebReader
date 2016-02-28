
Service.RegNameSpace('window.Comment');

/**
 * @功能:意见打包历史记录窗体 
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.CommentPackHistoryWindow = Ext.extend(Ext.Window, {
    title: '打包意见历史 ',
    closable: false,
    width: 600,
    height: 403,
    plain: true,
    modal: true,
    resizable: false,

    m_ViewHistoryReader: null,
    m_ViewHistoryColModel: null,

    m_EventHandler: null,

    ViewHistoryGrid: null,

    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        this.m_EventHandler = new Comment.CommentPackHistoryWindowEventHandler(this);
        Comment.CommentPackHistoryWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {

        m_ViewHistoryReader = new Ext.data.ArrayReader({},
        [{
            name: 'id'
        },
        {
            name: 'outputcode'
        },
        {
            name: 'outputfrom'
        },
        {
            name: 'outputto'
        },
        {
            name: 'outputthourt'
        },
        {
            name: 'outputtime'
        },
        {
            name: 'path'
        }]);

        m_ViewHistoryColModel = new Ext.grid.ColumnModel([{
            header: "编码",
            width: 160,
            sortable: true,
            dataIndex: 'outputcode'
        },
        {
            header: "发送方",
            width: 80,
            sortable: true,
            dataIndex: 'outputfrom'
        },
        {
            header: "接收方",
            width: 80,
            sortable: true,
            dataIndex: 'outputto'
        },
        {
            header: "打包者",
            width: 80,
            sortable: true,
            dataIndex: 'outputthourt'
        },
        {
            header: "打包时间",
            width: 160,
            sortable: true,
            dataIndex: 'outputtime'
        }]);

        this.ViewHistoryGrid = new Ext.grid.GridPanel({
            id: 'CommentOutputHistoryGrid',
            region: 'center',
            collapsible: false,
            header: false,
            title: '打包意见历史',
            width: 583,
            height: 335,
            store: new Ext.data.Store({
                reader: m_ViewHistoryReader,
                data: new Array()
            }),
            cm: m_ViewHistoryColModel
        });

        //拼装UI界面
        this.items = [this.ViewHistoryGrid],
        this.buttons = [{
            text: '查看',
            handler: this.m_EventHandler.ViewHistoryDetail
        },
        {
            text: '删除',
            handler: this.m_EventHandler.DeleteHistoryDetail
        },
        {
            text: '关闭',
            handler: this.m_EventHandler.Close
        }];

        Comment.CommentPackHistoryWindow.superclass.initComponent.call(this);
    },

    /*
     *	绑定列表数据
     */
    BindPackHistoryListUIData: function (historyList) {
        var store = new Ext.data.Store({
            reader: m_ViewHistoryReader,
            data: historyList
        });
        this.ViewHistoryGrid.reconfigure(store, m_ViewHistoryColModel);
    },

    /*
     *	获取当前选中行的数据
     */
    GetCurrentHistoryItem: function () {
        var currentRow = this.ViewHistoryGrid.getSelectionModel();
        if (currentRow.selections.items.length > 0) return currentRow.selections.items[0].data;
        else return null;
    }
});


/**
 * @功能:意见打包历史记录窗体事件处理类 
 * @作者: LuCan
 * @日期: 2010/01/08
 */

Comment.CommentPackHistoryWindowEventHandler = function (sender) {

    //持有UI窗体
    var CommentPackHistoryWindow = sender;

    /*
     *	查看
     */
    this.ViewHistoryDetail = function () {
        var currentHistoryItem = CommentPackHistoryWindow.GetCurrentHistoryItem();
        if (currentHistoryItem != null) {
            var result;
            try {
                result = Service.WebService.Post('ViewCommentOutputHistoryHtml', {
                    path: currentHistoryItem.path
                },
                null);
            }
            catch(e) {
                Service.ShowMessageBox('错误', '浏览意见导出历史失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }

            if (result != null && result != undefined) {
                if (result.text == 'true') 
                    window.open('Comment\\ViswHistory.htm', '_blank', 'height=400, width=600,top=50, left=50, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
                else 
                    Service.ShowMessageBox('错误', '浏览意见导出历史失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }
            else 
                Service.ShowMessageBox('错误', '浏览意见导出历史失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        else {
            Service.ShowMessageBox('信息', '当前没有选中意见导出历史，不允许进行查看操作！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
        }
    };

    /*
     *	删除
     */
    this.DeleteHistoryDetail = function () {
        var currentHistoryItem = CommentPackHistoryWindow.GetCurrentHistoryItem();
        if (currentHistoryItem != null) {
            Service.ShowMessageBox('确认', '您确认要删除所选中的意见导出历史吗？', Ext.MessageBox.YESNO, Ext.MessageBox.QUESTION, DeltetCommentOutputHistory);

            function DeltetCommentOutputHistory(button, text) {
                if (button == 'yes') {
                    try {
                        var result = Service.WebService.Post('DeleteCommentOutputHistoryItem', {
                            id: currentHistoryItem.id
                        });
                        if (result != null) CommentPackHistoryWindow.BindPackHistoryListUIData(Comment.Biz.GetAllCommentHistoryData());
                        else Service.ShowMessageBox('错误', '删除意见导出历史失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                    }
                    catch(e) {
                        Service.ShowMessageBox('错误', '删除意见导出历史失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                    }
                }
            }
        }
        else Service.ShowMessageBox('信息', '当前没有选中意见导出历史，不允许进行删除操作！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
    };

    /*
     *	关闭
     */
    this.Close = function () {
        CommentPackHistoryWindow.close();
    }
};