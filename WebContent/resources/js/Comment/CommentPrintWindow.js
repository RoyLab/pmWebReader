

Service.RegNameSpace('window.Comment');

/**
 * @功能:意见打印窗体 
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.CommentPrintWindow = Ext.extend(Ext.Window, {
    title: '选择 ',
    closable: true,
    width: 280,
    height: 400,
    plain: true,
    modal: true,
    defaultType: 'textfield',

    SelectTree: null,
    //是否选择显示所有DM意见
    IsShowAllDMComment: null,
    m_EventHandler: null,

    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        this.m_EventHandler = new Comment.CommentPrintWindowEventHandler(this);
        Comment.CommentPrintWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        this.InitSelectTree();
        var infoSet = new Ext.form.FieldSet({
            title: ' 说明',
            html: new Ext.Template('<p><b>注意：</b>选择打印的意见！</p>'),
            autoHeight: true,
            collapsible: false
        });
        this.items = [this.SelectTree, infoSet],
        this.buttons = [{
            text: '确定',
            handler: this.m_EventHandler.Print
        },
        {
            text: '取消',
            handler: this.m_EventHandler.Cancel
        }];

        Comment.CommentPrintWindow.superclass.initComponent.call(this);
    },

    /*
     *	初始化树控件
     */
    InitSelectTree: function () {
        this.SelectTree = new Ext.tree.TreePanel({
            id: 'm_pnlTocTree',
            title: '意见目录',
            cmargins: '0 0 0 0',
            border: false,
            autoScroll: true,
            height: 271,
            rootVisible: true,
            lines: false,
            header: false,
            useArrows: true,
            animCollapse: true,
            animate: false,
            iconCls: 'iconToc',
            collapseFirst: false,

            loader: new Ext.tree.TreeLoader({
                preloadChildren: true,
                clearOnLoad: false
            }),

            root: new Ext.tree.AsyncTreeNode({
                id: 'root',
                text: '意见列表',
                iconCls: 'iconManual',
                expanded: true,
                singleClickExpand: true,
                children: [] //[{text:"aaa",leaf:true,checked:true},{"text":"bbb","leaf":true,"checked":true}]
            })
        });
    },

    /*
     *	把ccode后面的-Q去掉
     */
    FixTitle: function (title) {
        if (title == null) {
            return title;
        }

        var stitle = new String(title);
        if (stitle == null || stitle.length < 2) {
            return title;
        }
        var len = stitle.length;
        if (stitle.charAt(len - 1) == 'Q'.toUpperCase() && stitle.charAt(len - 2) == '-') {
            return stitle.substr(0, len - 2);
        }
        return title;
    },

    /*
     *	设置树控件的数据源
     */
    BindTreeUIData: function (commentList) {
        for (var i = 0; i < commentList.length; i++) {
            var fileNode = new Ext.tree.AsyncTreeNode({
                text: this.FixTitle(commentList[i][17]),
                id: commentList[i][17],
                leaf: true,
                checked: true,
                draggable: false
            });
            this.SelectTree.root.appendChild(fileNode);
        }
    },

    /*
     *	获取树选中的节点数据
     */
    GetTreeSelectObjList: function () {
        var objLists = new Array();
        var m_SelectRefObjects = this.SelectTree.getChecked();
        if (m_SelectRefObjects.length == 0) 
            return objLists;
        for (var i = 0; i < m_SelectRefObjects.length; i++)
            objLists[i] = m_SelectRefObjects[i].attributes.id;
        return objLists;
    }

});

/**
 * @功能:意见打印窗体事件处理类
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.CommentPrintWindowEventHandler = function (sender) {

    //持有UI窗体
    var commentPrintWindow = sender;

    var HKEY_Root, HKEY_Path, HKEY_Key, oldFooterKey, oldHeaderKey;
    HKEY_Root = "HKEY_CURRENT_USER";
    HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";

    /*
     *	查看
     */
    this.Print = function () {

        var curDMC = '';
        var objList = new Array();
        var result;
        objList = commentPrintWindow.GetTreeSelectObjList();
        if (objList.length == 0) {
            Service.ShowMessageBox('信息', '当前没有选择打印的意见！', Ext.MessageBox.OK, Ext.MessageBox.INFO, null);
            return;
        }

        if (!commentPrintWindow.IsShowAllDMComment) {
            curDMC = curDMC + MainFrame.GetContentPage().GetExtDMC();
        }
        result = Service.WebService.Post('CreatPrintCommentFile', {
            dmc: curDMC,
            cidList: objList
        });
        if (result != null) {
            try {
                    //打印窗体
                    var printWindow = window.open('', '_blank', 'height=1, width=1, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                    printWindow.onerror = function () {
                        return;
                    };

                    var bodyEle = printWindow.document.createElement('body');
                    printWindow.document.appendChild(bodyEle);

                    var newDoc = bodyEle.document;
                    newDoc.open();
                    newDoc.write(result.text);
                    newDoc.close();

                    var objectCommand = newDoc.createElement("div");
                    if (newDoc.all.WebBrowser == null) {
                        objectCommand.innerHTML = '<OBJECT classid= CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 height=0 id=WebBrowser width=0></<OBJECT>';
                        newDoc.body.appendChild(objectCommand);
                    }

                    PageSetup();

                    /*
                     *	关闭打印窗体
                     */
                    setTimeout(function () {
                        if (typeof printWindow != 'undefined') {
                            try {
                                printWindow.print();

                                printWindow.close();

                                PageSetupDefault();
                            }
                            catch(e) {
                                PageSetupDefault();
                            }
                        }
                    },
                    1000);
            }
            catch(e) {
                Service.ShowMessageBox('错误', '打印时发生错误，打印失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
                return;
            }
            finally {
                commentPrintWindow.close();
            }
        }
        else {
            Service.ShowMessageBox('信息', '当前没有选择打印的意见！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            return;
        }
    };

    /*
     *	删除
     */
    this.Cancel = function () {
        commentPrintWindow.close();
    };

    /*
     *	打印设置
     */
    function PageSetup() {
        try {

            var Wsh = new ActiveXObject("WScript.Shell");
            HKEY_Key = "header";
            oldHeaderKey = Wsh.RegRead(HKEY_Root + HKEY_Path + HKEY_Key);
            Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
            HKEY_Key = "footer";
            oldFooterKey = Wsh.RegRead(HKEY_Root + HKEY_Path + HKEY_Key);
            Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "&b页码：&p/&P&b&d");
        }
        catch(e) {}
    }

    /*--———————————-还原页眉页脚的值--————————————-*/
    function PageSetupDefault() {
        try {
            var Wsh = new ActiveXObject("WScript.Shell");
            HKEY_Key = "header";
            Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, oldHeaderKey);
            HKEY_Key = "footer";
            Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, oldFooterKey);
            // Header:&w&b页码,&p/&P   //Footer:&u&b&d

        }
        catch(e) {}
    }
};