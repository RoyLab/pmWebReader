/***********************************************************************
*功能描述：书签管理类
*作者：wanghai
*日期：2008-11-24     
*修改：
*2009-3-12   hyb  重构Bookmark.js文件                                                             
***********************************************************************/
//定义名称空间
Service.RegNameSpace('window.Bookmark');

/*
*注释人:huangyanbing
*日期：2009/12/22
*问题类型:类型定义混乱，定义代码和执行代码混在一起。
*错误描述:
*更正方法:分离执行代码和定义代码，执行代码使用InitializeObject
*建议类型布局方式,分为三个区域
*1 执行代码封装在InitializeObject当中，并且在类型的开始调用InitializeObject。
*2 变量定义
*3 方法定义
*/
Bookmark.BookMarkEventHandler = function () {

    /**
     * purpose:获取用户ID
     */
    function GetUserId() {
        return ApplicationContext.IUserInfo().UserId;
    };

    /**
     * purpose:获取当前打开页面的URL地址
     * @return {Object} 包括两个元素：Title {String},URL {String}
     */
    function GetOpenPageInfo() {//该法的需要进一步重构,
        var url = '';
        var bookmarkname = '';

        var dmInfo = ApplicationContext.IMainFrame().GetActiveTabDMinfo();

        if (dmInfo == undefined || dmInfo == null) return null;

        url = dmInfo.Src;

        if (url != undefined && url != null) {
            url = url.substring(url.indexOf('Manual'), url.length);
            bookmarkname = dmInfo.Title;
        }
        else {
            bookmarkname = '首页';
            url = MainFrame.HomepagePath;
        }

        return new PageInfoObject(bookmarkname, url);
    };

    /**
     * purpose:显示标签框
     */
    this.AddBookmark = function (bookmarkTree) {

        var bookMarkWindow = new Bookmark.BookMarkWindow();
        bookMarkWindow.AddSaveHandler(SaveBookmark);

        var pageInfo = GetOpenPageInfo();

        try {
            if (pageInfo == null) {
                alert('当前页面不能设置书签.')
                return;
            }
            else if (pageInfo.IsDMListPage()) {
                alert('列表不能保存为书签.');
                return;
            }
        }
        catch(e) {
            //TODO:log exception
        }

        if (pageInfo.IsNullURL() == false) {
            bookMarkWindow.SetPageInfo(pageInfo);

            bookMarkWindow.show();
        }
        else {
            Service.ShowMessageBox('错误', '页面不存在，不能设置书签.', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
        }

        /**
        * purpose:添加标签
        * @class 
        * @constructor
        * @button {Object}
        */
        function SaveBookmark(button) {

            if (!bookMarkWindow.IsVald()) return;

            var pageInfo = bookMarkWindow.GetPageInfo();

            var codeString = '';
            var objectType = '';

            if (pageInfo.BookmarkName.indexOf('"') != -1) {
                Service.ShowMessageBox('错误', '书签名不能含双引号！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
                return;
            }

            if (pageInfo.IsDMListPage()) {
                codeString = MainFrame.RequestString(pageInfo.URL, "id");
                objectType = "DMlist," + MainFrame.RequestString(pageInfo.URL, "text");
            }
            else
            {
                 var TreeInfo = ApplicationContext.IMainFrame().GetActiveTreeInfo();
                 var dmInfo = ApplicationContext.IMainFrame().GetActiveTabDMinfo();
                 if(TreeInfo!=null && TreeInfo.SelNode!=null)
                 {
                    codeString=TreeInfo.SelNode.codeString;
                    if(codeString!=dmInfo.Dmc)
                        codeString=dmInfo.Dmc;
                     else
                        codeString=TreeInfo.SelNode.id;
                        
                    objectType=TreeInfo.TreeType;
                 }
                 else{
                        codeString=dmInfo.Dmc;
                        objectType=TreeInfo.TreeType;
                 }
                 
                
            }

            var data = {
                URL: pageInfo.URL,
                BookmarkName: pageInfo.BookmarkName,
                CodeString: codeString,
                ObjectType: objectType
            };

            var exists = bookmarkTree.IsBookmarkExists(pageInfo.BookmarkName);
            //书签已经存在
            if (exists) {
                Service.ShowMessageBoxEx('询问', '有同名的书签，是否覆盖？', Ext.MessageBox.YESNO, Ext.MessageBox.QUESTION, UpdateBookmarkCallBack, data);
                return;
            }

            if (pageInfo.IsNullBookmark()) {
                Service.ShowMessageBox('错误', '书签名不能为空！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);

                return;
            }

            Service.WebService.Call('AddBookMark', {
                userid: GetUserId,
                url: pageInfo.URL,
                bookmarkname: pageInfo.BookmarkName,
                codeString: codeString,
                objectType: objectType
            },
            function (result) {
                AddBookmarkCallBack(result, null, data);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                alert(XmlHttpRequest.responseText);
            });
        };

        /**
         * purpose:
         * @class 
         * @constructor
         * @result {Object} WebService调用返回值
         * @type {String} 类型
         * @data {Object} 包含{BookmarkName,URL,CodeString,ObjectType}
         */
        function AddBookmarkCallBack(result, type, data) {
            bookMarkWindow.close();
            if (result.text == 'false') {
                Service.ShowMessageBox('错误', '保存失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }
            else if (type == undefined || type == null) {
                bookmarkTree.AppendNode(data);
            }
        };

        /**
         * purpose:更新书签
         * @class 
         * @constructor
         * @data {Object} 包含{BookmarkName,URL,CodeString,ObjectType}
         */
        function UpdateBookmarkCallBack(buttonId, text, data) {
            if (buttonId != 'yes') return;

            var postData = {
                'userid': GetUserId,
                'url': data.URL,
                'bookmarkname': data.BookmarkName,
                'codeString': data.CodeString,
                'objectType': data.ObjectType
            }

            Service.WebService.Call('UpdateBookMark', postData, function (result) {
                bookMarkWindow.close();

                if (result.text == 'false') {
                    Service.ShowMessageBox('错误', '保存失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                }
                else {
                    bookmarkTree.RemoveNodeByName(data.BookmarkName);
                    bookmarkTree.AppendNode(data);
                }
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                alert(XmlHttpRequest.responseText);
            });
        };
    };

    /**
     * purpose:删除标签
     * @class 
     * @constructor
     */
    this.RemoveBookmark = function (bookmarkTree) {

        var node = bookmarkTree.GetSelectedBookmarkNode();

        if (node != null) {
            Service.ShowMessageBox('确认', '您确认要删除书签：《' + node.text + '》?', Ext.MessageBox.YESNO, Ext.MessageBox.QUESTION, DeleteBookmark);
        }
        else {
            Service.ShowMessageBox('警告', '请先选择书签！', Ext.MessageBox.OK, Ext.MessageBox.WARNING, null);
        }

        function DeleteBookmark(buttonId, text) {
            
            if(buttonId != 'yes')
                return;
                
            var content;
            content = node.attributes.text;

            Service.WebService.Call('DelBookMark', {
                userid: GetUserId,
                bookmarkname: content
            },
            function (result) {
                DeleteBookmarkCallBack(result, node);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {});
        }

        /**
         * purpose:删除书签回调
         * @result {Object} WebService调用返回结果
         * @node {Object} 书签节点
         */
        function DeleteBookmarkCallBack(result, node) {
            if (result.text == 'false') {
                Service.ShowMessageBox('错误', '删除失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }
            else {
                bookmarkTree.RemoveNode(node);
            }
        };
    };
};

/**
 * purpose:书签编辑窗体
 * @class Ext.Window
 * @constructor
 */
Bookmark.BookMarkWindow = Ext.extend(Ext.Window, {
    title: '添加书签',
    modal: true,
    width: 300,
    height: 180,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: {
        border: false
    },
    layout: 'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',

    createFormPanel: function () {
        return new Ext.form.FormPanel({
            bodyStyle: 'padding-top:20px; background:transparent;',
            defaultType: 'textfield',
            labelAlign: 'right',
            labelWidth: 55,
            labelPad: 0,
            frame: false,
            defaults: {
                allowBlank: false,
                selectOnFocus: true,
                invalidClass: null,
                msgTarget: 'side',
                width: 200
            },
            items: [{
                cls: 'name',
                name: 'name',
                fieldLabel: '书签名',
                maxLengthText: '输入的用户名长度不能大于50',
                maxLength: 50,
                xtype: 'textfield',
                blankText: '书签名不允许为空'
            },
            {
                cls: 'url',
                name: 'url',
                fieldLabel: '书签地址',
                disabled: true
            }]
        });
    },

    initComponent: function () {
        Bookmark.BookMarkWindow.superclass.initComponent.call(this);
        this.fp = this.createFormPanel();
        this.add(this.fp);
        this.addButton(new Ext.Button({
            text: '保 存',
            id: 'btnSave'
        }));
        this.addButton(new Ext.Button({
            text: '取 消',
            id: 'btnDelete',
            handler: function () {
                this.ownerCt.close();
            }
        }));

    },

    /**
     * purpose: Returns true if client-side validation on the form is successful.
     */
    IsVald: function () {
        return this.fp.getForm().isValid();
    },

    /**
     * purpose:添加保存按钮单击事件
     * @handler {Function} 保持按钮的处理方法
     */
    AddSaveHandler: function (handler) {
        this.buttons[0].on("Click", handler);
    },

    /**
     * purpose:添加取消按钮单击事件
     * @handler {Function} 保持按钮的处理方法
     */
    AddCancelHandler: function (handler) {
        this.buttons[1].on("Click", handler);
    },

    /**
     * purpose:设置Bookmark窗体的标题和内容信息
     * @param {Object} 包括两个元素：Title {String},URL {String}
     */
    SetPageInfo: function (pageInfo) {
        this.fp.items.items[0].setValue(pageInfo.BookmarkName);
        this.fp.items.items[1].setValue(pageInfo.URL);
    },

    /**
     * purpose:获取窗体对象的页面信息
     * @return {PageInfoObject} 
     */
    GetPageInfo: function () {
        var bookmarkName = this.fp.items.items[0].getValue();
        var url = this.fp.items.items[1].getValue();

        return new PageInfoObject(bookmarkName, url);
    }

});

/**
 * purpose: 页面信息
 */
PageInfoObject = function (bookmarkname, url) {
    /**
     * 标题信息
     * @type String
     */
    this.BookmarkName = bookmarkname;

    /**
     * 页面地址
     * @type String
     */
    this.URL = url;

    /**
     * purpose:URL是否为空或空字符串
     * @class 
     * @constructor
     * @param {type} name1
     */
    this.IsNullURL = function () {
        if (this.URL == undefined || this.URL.length == 0) return true;

        return false;
    };

    /**
     * purpose:Bookmark是否为空或空字符串
     * @class 
     * @constructor
     * @param {type} name1
     */
    this.IsNullBookmark = function () {
        if (this.BookmarkName == undefined || this.BookmarkName.Length == 0) return true;

        return false;
    }

    /**
     * purpose:当前页显示PMEntry的DM列表信息
     * @pageInfo {Object} 包括{BookmarkName,URL}
     */
    this.IsDMListPage = function () {
        if (this.URL.indexOf("DMlist.html") != -1) {
            return true;
        }

        return false;
    };
};

/**
 * purpose:书签树
 * @class BookmarkTree
 */
Bookmark.BookmarkTree = Ext.extend(Ext.tree.TreePanel, {
    id: 'pnlBookmarkTree',
    hideLabel: true,
    cmargins: '0 0 0 0',
    border: false,
    autoScroll: true,
    containerScroll: true,
    rootVisible: false,
    lines: true,
    animate: false,
    animCollapse: true,
    iconCls: 'iconToc',
    collapseFirst: false,
    preloadChildren: true,
    clearOnLoad: true,
    maskDisabled: false,
    autoHeight: false,
    root: new Ext.tree.AsyncTreeNode({
        id: 'root',
        text: '全部',
        iconCls: 'iconManual',
        expanded: true,
        singleClickExpand: true,
        draggable: false
    }),

    initComponent: function () {
        var treeNodeProvider = {
            data: [],
            getNodes: function () {
                return this.data;
            },
            setData: function (data) {
                this.data = data;
            },
            scope: this
        };

        var treeLoader = new Ext.tree.MyTreeLoader({
            treeNodeProvider: treeNodeProvider
        });

        this.loader = treeLoader;

        Bookmark.BookmarkTree.superclass.initComponent.call(this);
        
        this.Initialize();
    },

    Initialize: function () {
        
        userInfo = ApplicationContext.IUserInfo();
        this.ChangeTreeDataSource(GetBookmarks(userInfo));

        /**
           * purpose:获取Bookmark数据
           * @class 
           * @constructor
           * @param {type} name1
           */
        function GetBookmarks(userInfo) {

            var bookmarkArray = new Array();
            Service.WebService.Call('GetBookMarkList',
                                     {node: 'root' + userInfo.UserId},
                                     GetBookmarkCallBack);

            function GetBookmarkCallBack(result) {
                var text;
                var value;
                var leaf;
                var href;
                var codeString;
                var objectType;

                var nodes = Ext.DomQuery.select("/JsonBookMark", result.documentElement);
                if (nodes.length <= 0) return;

                for (var i = 0; i < nodes.length; i++) {
                    try {
                        text = GetText("BookMarkname", nodes[i]);
                        value = GetText("Parentid", nodes[i]);
                        leaf = true;
                        href = GetText("BookMarkurl", nodes[i]);
                        codeString = GetText("codeString", nodes[i]);
                        objectType = GetText("objectType", nodes[i]);
                    }
                    catch(e) {
                        continue;
                    }

                    if (leaf == 'true') {
                        bookmarkArray[i] = {
                            text: text,
                            //id: text,
                            leaf: leaf,
                            href: href,
                            codeString: codeString,
                            objectType: objectType,
                            iconCls: "iconDM",
                            "isClass": true,
                            cls: "cls"
                        };
                    }
                    else {
                        bookmarkArray[i] = {
                            text: text,
                            //id: text,
                            leaf: leaf,
                            href: href,
                            codeString: codeString,
                            objectType: objectType,
                            iconCls: "iconDM",
                            "isClass": true,
                            cls: "cls"
                        };
                    }
                }
            }

            return bookmarkArray;
        }
        
        function GetText(text,node)
        {
            var t;
            if(Ext.DomQuery.selectNode(text,node)!=undefined)
                t=Ext.DomQuery.selectNode(text,node).text;
            return t;
        }
    },

    /**
       * purpose:更改数据源
       * @dataSource {Array} Bookmark数据源
       */
    ChangeTreeDataSource: function (dataSource) {
        var rootNode = this.getRootNode();
        var loader = this.getLoader();
        loader.updateTreeNodeProvider(dataSource);
        loader.load(rootNode);
    },

    /**
       * purpose:增加树节点
       * @class 
       * @constructor
       * @node {TreeNode} 书签数据
       */
    AppendNode: function (data) {
        var newNode = CreateTreeNode(data);

        var rootNode = this.getRootNode();

        rootNode.appendChild(newNode);

        /**
          * purpose:创建新节点
          * @class 
          * @constructor
          * @data {Object} 包含{BookmarkName,URL,CodeString,ObjectType}
          */
        function CreateTreeNode(data) {
            var newNode = new Ext.tree.TreeNode({
                text: data.BookmarkName,
                id: data.BookmarkName,
                leaf: true,
                href: data.URL,
                codeString: data.CodeString,
                objectType: data.ObjectType,
                iconCls: "iconDM",
                isClass: true,
                cls: "cls"
            });

            return newNode;
        };
    },

    RemoveNode: function (node) {
        var rootNode = this.getRootNode();

        rootNode.removeChild(node);
    },

    /**
       * purpose:根据书签名称删除书签节点
       */
    RemoveNodeByName: function (bookmarkName) {
        var node = this.GetBookmarkNodeWithBookmarkName(bookmarkName);

        if (node != null) this.RemoveNode(node);
    },

    /**
     * purpose:书签是否已经存在
     * @class 
     * @constructor
     * @bookmarkName {String} 书签名称
     */
    IsBookmarkExists: function (bookmarkName) {

        var node = this.GetBookmarkNodeWithBookmarkName(bookmarkName);

        if (node == null) return false;

        return true;
    },

    /**
     * purpose: 根据书签名称获取书签节点
     * @class 
     * @constructor
     * @bookmarkName {String} 书签名称
     */
    GetBookmarkNodeWithBookmarkName: function (bookmarkName) {
        var rootNode = this.getRootNode();

        for (var i = 0; i < rootNode.childNodes.length; i++) {
            if (rootNode.childNodes[i].attributes.id == bookmarkName) {
                return rootNode.childNodes[i];
            }
        }
        return null;
    },

    GetSelectedBookmarkNode: function () {
        return this.getSelectionModel().selNode;
    }
});

/**
 * purpose:书签树面板
 * @class 
 */
Bookmark.BookmarkTreePanel = Ext.extend(Ext.Panel, {
    id: 'pnlBookmarkTreeConn',
    layout: 'fit',
    border: false,
    title: '书签',
    iconCls: 'iconBookmark',

    initComponent: function () {

        var bookmarkHandler = new Bookmark.BookMarkEventHandler();

        var bookmarkTree = new Bookmark.BookmarkTree();
        var btnBookmarkDelete = new Ext.Toolbar.Button({
            id: 'btnBookMarkDelete',
            icon: 'resources/images/16x16/Delete.png',
            cls: 'x-btn-icon',
            tooltip: '<b>删除书签</b><br/>',
            handler: function () {
                bookmarkHandler.RemoveBookmark(bookmarkTree);
            }
        });
        var btnBookmarkAdd = new Ext.Toolbar.Button({
            id: 'btnBookMarkAdd',
            icon: 'resources/images/16x16/Add.png',
            cls: 'x-btn-icon',
            tooltip: '<b>添加书签</b><br/>',
            handler: function () {
                bookmarkHandler.AddBookmark(bookmarkTree);
            }
        });

        this.tbar = [btnBookmarkAdd, btnBookmarkDelete];

        Bookmark.BookmarkTreePanel.superclass.initComponent.call(this);
        this.add(bookmarkTree);

        bookmarkTree.on("click", this.TreeNodeClickHanlder, this);

        //定义书签树点击事件.
        this.addEvents({
            'BookmarkSelected': true
        });
    },
    afterRender: function (container) {
        Bookmark.BookmarkTreePanel.superclass.afterRender.call(this);
    },
    TreeNodeClickHanlder: function (node, e) {
        //停止事件继续往下传递(Ext框架会默认为树增加树点击的处理事件)
        e.stopEvent();
        var dminfo={Id:node.attributes.codeString,TreeType:node.attributes.objectType,Href:node.attributes.href};
        this.fireEvent('BookmarkSelected', dminfo);
    }

});