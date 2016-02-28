///////////////////////////////////////////////////////////////////////////////
//功能描述：适用性过滤管理类
//作者：wanghai
//日期：2008-11-24
///////////////////////////////////////////////////////////////////////////////

//
//定义命名空间
//
Service.RegNameSpace('window.ApplicFilter');

ApplicFilter.ApplicFilterEventHandler = Ext.extend(Ext.Window, {

    title: '适用性过滤',
    width: 280,
    height: 200,
    collapsible: false,
    closable: false,
    modal : true,
    resizable: false,
    defaults: {
        border: false
    },
    layout: 'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',
    shadow : false,
    
    globalVersion:'2.3',
      /*
     *	事件处理类
     */
    m_EventHandler: null,
    
    m_Flitordtore:null,
    m_Grid:null,
    m_LoginButton:null,
    m_CancelButton:null,
    
    
     /*
     *	构造函数
     */
    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        this.m_EventHandler = new ApplicFilter.FilterManager(this);
        ApplicFilter.ApplicFilterEventHandler.superclass.constructor.apply(this, arguments);
    },
    show :function () {
         ApplicFilter.ApplicFilterEventHandler.superclass.show.apply(this);
         this.Initialize();
    },
    onRender : function(ct, position){
//                    this.modal=false;
                    ApplicFilter.ApplicFilterEventHandler.superclass.onRender.call(this,ct, position);
                    this.el.shadowDisabled=true;
//                    this.mask = this.container.createChild({cls:"ext-el-mask",tag:"iframe"}, this.el.dom);
//                    this.mask.enableDisplayMode("block");
//                    this.mask.hide();
//                    this.modal=true;
                },
    InitInfoSet: function () {
        var sm = new Ext.grid.CheckboxSelectionModel({});

        m_Flitordtore = new Ext.data.SimpleStore({
            fields: GetDtoreArray(),
            data: Applic.ProductGride
        });
        
        m_Grid = new Ext.grid.GridPanel({
            stripeRows: true,
            height: 350,
            width: 400,
            title: '适用性过滤',
            deferRowRender: false,
            sm: sm,
            enableColLock: false,
            store: m_Flitordtore,
            cm: new Ext.grid.ColumnModel(GetColumnModelArray())
        });
        
        function GetColumnModelArray() {
            var myArray = new Array();
            myArray[0] = sm;
            if (globalVersion == '2.3') {
                myArray[1] = {
                    header: "型号名称",
                    width: 75,
                    sortable: true,
                    renderer: 'id',
                    dataIndex: 'id'
                };
                myArray[2] = {
                    header: "型号描述",
                    width: 75,
                    sortable: true,
                    renderer: 'MedelScript',
                    dataIndex: 'MedelScript'
                };
            }
            else if (globalVersion == '3.0') {
                for (var i = 0; i < Applic.ProductGrideHeader.length; i++) {
                    if (Applic.ProductGrideHeader[i][0] == 'id') {
                        myArray[1] = {
                            width: 0,
                            hidden: true,
                            renderer: 'id',
                            dataIndex: 'id'
                        };
                    }
                    else {
                        myArray[i + 1] = {
                            header: Applic.ProductGrideHeader[i][1],
                            width: 75,
                            sortable: true,
                            renderer: Applic.ProductGrideHeader[i][0],
                            dataIndex: Applic.ProductGrideHeader[i][0]
                        };
                    }
                }

            }

            return myArray;
        };
        
        function GetDtoreArray() {
            var myArray = new Array();
            //myArray[0]={name: 'check', type: 'boolean'};
            if (globalVersion == '2.3') {
                myArray[0] = {
                    name: 'id',
                    type: 'string'
                };
                myArray[1] = {
                    name: 'MedelScript',
                    type: 'string'
                };
            }
            else if (globalVersion == '3.0') {
                for (var i = 0; i < Applic.ProductGrideHeader.length; i++) {
                    myArray[i] = {
                        name: Applic.ProductGrideHeader[i][0],
                        type: 'string'
                    };
                }
            }
            return myArray;
        };      

        m_LoginButton = new Ext.Button({
            text: '确定',
            handler: this.m_EventHandler.OnClickApplicFilter
        });
        m_CancelButton = new Ext.Button({
            text: '取消',
            handler: this.m_EventHandler.CloseApplicFilter
        });   
    },
     //初始化选择的BOX
    Initialize: function () {
        var applicContext = '';
        var begstr = 0;
        var endstr = 0;
        applicContext = ApplicationContext.UserInfo.ApplicContext();
        endstr = applicContext.indexOf(';', 0);
        if (endstr != -1) {
            applicContext = applicContext.substring(begstr, endstr) + ",";
        }

        for (var i = 0; i < m_Flitordtore.getCount(); i++) {
            if (applicContext.indexOf(m_Flitordtore.getAt(i).get('id') + ",") != -1) {
                m_Grid.selModel.selectRow(i, true);
            }
        }
    }, 
    Async: function () {
        var m = m_Grid.getSelections();
        var applicContext = '';

        if (m.length != 0) {
            applicContext = 'model:';
            for (var i = 0, len = m.length; i < len; i++) {
                if (i == 0) {
                    applicContext += m[i].get('id');
                }
                else {
                    applicContext += ',';
                    applicContext += m[i].get('id');
                }
            }
        }
        else {
            applicContext = 'model:all';
            Service.ShowMessageBox('警告', '你没有选择型号，默认为全部！', Ext.MessageBox.OK, Ext.MessageBox.WARNING, null);
        }
        UserManager.Cookies.SetApplicName(applicContext);

        //先过滤整个页面
        ApplicationContext.FilterService.FilterAllDMC();

        //top.tocTreeManager.reLoadTree();
        //top.SNSTreeManager.reLoadTree();
        ApplicationContext.MainFrame.ReLoadTree();

        var dminfo = ApplicationContext.MainFrame.GetMainTabDMinfo();
        if (dminfo != undefined) {
            var codeString = dminfo.Dmc;
            var deny = ApplicationContext.FilterService.IsFilterDMC(codeString);

            if (deny) {
                ApplicationContext.MainFrame.GoHome();
            }
        }
        
        //wuqifeng 2010-12-21 
        //不在此执行页面过滤，只是让他刷新，在刷新时执行过滤；
        //在进行适用性过滤时，假如该DM没有被过滤掉则显示过滤后的DM页面，否则跳转到首页
        if(ApplicationContext.IIETM()!=undefined && ApplicationContext.IIETM()!=null)// && ApplicationContext.IIETM().ApplicRecised.FilterApplic()
        {
            if(dminfo != null)
            {
                var dmc = dminfo.Dmc;
                if(dmc != null && dmc != '')
                {
                    var id = dmc + "#";
                    var selecedNode = ApplicationContext.MainFrame.LocateTreeNode(id);
                    if(selecedNode == null)
                        ApplicationContext.MainFrame.GoHome();
                    else
                        ApplicationContext.MainFrame.RefreshMainHTMLTab();
                }
            }
        }
    },
     /*
     *	初始化控件
     */
    initComponent: function () {

        try {
            globalVersion = TOC.Version['Version'];
        }
        catch(e) {}
        this.InitInfoSet();
        this.items = [m_Grid];
        this.buttons = [m_LoginButton, m_CancelButton];
        this.keys = [{
            key: Ext.EventObject.ENTER,
            fn: this.Async,
            scope: this
        }];        
        ApplicFilter.ApplicFilterEventHandler.superclass.initComponent.call(this);

    },
    ShowApplicFilter: function () {
        this.show();
    }
});

ApplicFilter.FilterManager = function (sender) {
    var windowObject = sender;
    
    ApplicFilter.FilterManager.prototype.ShowApplicFilter = function () {
        windowObject.show();
    }

    ApplicFilter.FilterManager.prototype.OnClickApplicFilter = function () {
        windowObject.Async();
        windowObject.close();    
    }

    ApplicFilter.FilterManager.prototype.CloseApplicFilter = function () {
        windowObject.close();        
    }
}



//ApplicFilter.ApplicFilterEventHandler = function () {

//    var globalVersion = '2.3';
//    try {
//        globalVersion = TOC.Version['Version'];
//    }
//    catch(e) {}

//    var sm = new Ext.grid.CheckboxSelectionModel({});

//    var flitordtore = new Ext.data.SimpleStore({
//        fields: getDtoreArray(),
//        data: Applic.ProductGride
//    });

//    function getColumnModelArray() {
//        var myArray = new Array();
//        myArray[0] = sm;
//        if (globalVersion == '2.3') {
//            myArray[1] = {
//                header: "型号名称",
//                width: 75,
//                sortable: true,
//                renderer: 'id',
//                dataIndex: 'id'
//            };
//            myArray[2] = {
//                header: "型号描述",
//                width: 75,
//                sortable: true,
//                renderer: 'MedelScript',
//                dataIndex: 'MedelScript'
//            };
//        }
//        else if (globalVersion == '3.0') {
//            for (var i = 0; i < Applic.ProductGrideHeader.length; i++) {
//                if (Applic.ProductGrideHeader[i][0] == 'id') {
//                    myArray[1] = {
//                        width: 0,
//                        hidden: true,
//                        renderer: 'id',
//                        dataIndex: 'id'
//                    };
//                }
//                else {
//                    myArray[i + 1] = {
//                        header: Applic.ProductGrideHeader[i][1],
//                        width: 75,
//                        sortable: true,
//                        renderer: Applic.ProductGrideHeader[i][0],
//                        dataIndex: Applic.ProductGrideHeader[i][0]
//                    };
//                }
//            }

//        }

//        return myArray;
//    }

//    function getDtoreArray() {
//        var myArray = new Array();
//        //myArray[0]={name: 'check', type: 'boolean'};
//        if (globalVersion == '2.3') {
//            myArray[0] = {
//                name: 'id',
//                type: 'string'
//            };
//            myArray[1] = {
//                name: 'MedelScript',
//                type: 'string'
//            };
//        }
//        else if (globalVersion == '3.0') {
//            for (var i = 0; i < Applic.ProductGrideHeader.length; i++) {
//                myArray[i] = {
//                    name: Applic.ProductGrideHeader[i][0],
//                    type: 'string'
//                };
//            }
//        }
//        return myArray;
//    }

//    var m_Grid = new Ext.grid.GridPanel({
//        stripeRows: true,
//        height: 350,
//        width: 400,
//        title: '适用性过滤',
//        deferRowRender: false,
//        sm: sm,
//        enableColLock: false,
//        store: flitordtore,
//        cm: new Ext.grid.ColumnModel(getColumnModelArray())
//    });

//    var m_LoginButton = new Ext.Button({
//        text: '确定',
//        handler: function () {
//            Async();
//            m_LoginWindow.close();
//        }
//    });
//    var CancelButton = new Ext.Button({
//        text: '取消',
//        handler: function () {

//            m_LoginWindow.close();
//        }
//    });
//    var m_LoginWindow = new Ext.Window({
//        title: '适用性过滤',
//        width: 280,
//        height: 200,
//        collapsible: false,
//        closable: false,
//        resizable: false,
//        defaults: {
//            border: false
//        },
//        layout: 'fit',
//        buttonAlign: 'center',
//        iconCls: 'iconUsers',
//        items: m_Grid,
//        buttons: [m_LoginButton, CancelButton],
//        keys: [{
//            key: Ext.EventObject.ENTER,
//            fn: Async,
//            scope: this
//        }],
//        listeners: {
//            show: function () {
//                initialize();
//            }
//        }
//    });

//    m_LoginWindow.show();

//    //初始化选择的BOX
//    function initialize() {
//        var applicContext = '';
//        var begstr = 0;
//        var endstr = 0;
//        applicContext = ApplicationContext.UserInfo.ApplicContext();
//        endstr = applicContext.indexOf(';', 0);
//        if (endstr != -1) {
//            applicContext = applicContext.substring(begstr, endstr) + ",";
//        }

//        for (var i = 0; i < flitordtore.getCount(); i++) {
//            if (applicContext.indexOf(flitordtore.getAt(i).get('id') + ",") != -1) {
//                m_Grid.selModel.selectRow(i, true);
//            }
//        }
//    }

//    function Async() {
//        var m = m_Grid.getSelections();
//        var applicContext = '';

//        if (m.length != 0) {
//            applicContext = 'model:';
//            for (var i = 0, len = m.length; i < len; i++) {
//                if (i == 0) {
//                    applicContext += m[i].get('id');
//                }
//                else {
//                    applicContext += ',';
//                    applicContext += m[i].get('id');
//                }
//            }
//        }
//        else {
//            applicContext = 'model:all';
//            Service.ShowMessageBox('警告', '你没有选择型号，默认为全部！', Ext.MessageBox.OK, Ext.MessageBox.WARNING, null);
//        }
//        UserManager.Cookies.SetApplicName(applicContext);

//        //先过滤整个页面
//        ApplicationContext.FilterService.FilterAllDMC();

//        //top.tocTreeManager.reLoadTree();
//        //top.SNSTreeManager.reLoadTree();

//        var dminfo = ApplicationContext.MainFrame.GetMainTabDMinfo();
//        if (dminfo != undefined) {
//            var codeString = dminfo.Dmc;
//            var index = codeString.indexOf('#');
//            if (index != -1) codeString = codeString.substring(0, index);
//            var deny = ApplicationContext.FilterService.IsFilterDMC(codeString);

//            if (deny) {
//                ApplicationContext.MainFrame.LoadMainHTMLTab(undefined, "about:blank");
//            }
//        }
//    };
//}


