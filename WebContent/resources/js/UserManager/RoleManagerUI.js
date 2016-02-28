/************************************************************************
*功能描述：角色管理窗体与控件
*作者：hyb
*日期：2010-01-19      
*修改：
*
************************************************************************/

/**
 * purpose:数据权限窗口
 * @class DataRightWindow
 */
UserManager.RoleDataRightWindow = Ext.extend(Ext.Window, {
    title: '设置数据权限',
     modal:true,
    width: 400,
    height: 600,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: {
        border: false
    },
    layout: 'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',
    listeners: {
        beforeadd: function () {
            this.Initialize();
        }
    },

    /**
     * purpose:权限DMID字符串
     * @param {String} name1
     */
    m_RightIDs: null,
    /**
     *角色数据权限
     * @type Function
     */
    m_SaveRoleDataRightHandler: null,

    m_TreeManager: null,
    
    m_CheckPnlNavTree : null,

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_SaveRoleDataRightHandler = config.SaveRoleDataRightHandler;
            this.m_RightIDs = config.RightIDs;
        }

        UserManager.RoleDataRightWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        var checkTocTreeManager = new MainFrm.Tree.ClickPublicationTreeManager({
            checked: true,
            disabled: false
        });
        this.m_TreeManager = checkTocTreeManager;

        var check_pnlTocTreeContainer = new Ext.Panel({
            id: 'Check_pnlTocTreeContainer',
            border: false,
            layout: 'fit',
            title: '手册结构',
            autoScroll: true,
            iconCls: 'iconManual'
        });

        var check_pnlSnsTreeContainer = new Ext.Panel({
            id: 'Check_pnlSnsTreeContainer',
            border: false,
            layout: 'fit',
            title: '产品结构',
            autoScroll: true,
            iconCls: 'iconSNS'
        });

        /**
             * 定义手册数据的类型
             * @Object
             */
        var TOCTREETYPE = {
            SNS: 0,
            TOC: 1
        };
        
        var check_pnlNavTree = new Ext.TabPanel({
            id: 'Check_pnlNavTree',
            border: false,
            deferredRender: false,
            activeTab: 'Check_pnlTocTreeContainer',
            tabPosition: 'bottom',
            items: [check_pnlTocTreeContainer, check_pnlSnsTreeContainer],

            listeners: {
                tabchange: function (tabPanel, tab) {
                    if (tab.id == 'Check_pnlTocTreeContainer') {
                         LoadTree(tab, checkTocTreeManager, TOCTREETYPE.TOC);
                    }
                    else if (tab.id == 'Check_pnlSnsTreeContainer') {
                         LoadTree(tab, checkTocTreeManager, TOCTREETYPE.SNS);
                    }
                }
            }
        });
        
        this.m_CheckPnlNavTree = check_pnlNavTree;
        

        var check_pnlNavContainer = new Ext.Panel({
            id: 'Check_pnlNavContainer',
            layout: 'fit',
            border: false,
            title: '选择树',
            iconCls: 'iconToc',
            items: [check_pnlNavTree]
        });

        var saveButton = new Ext.Button({
            text: '确定',
            scope: this,
            handler: function () {
                this.SaveDataRight();
            }
        });

        var cancelButton = new Ext.Button({
            text: '取消',
            scope: this,
            handler: function () {
                this.close();
            }
        });

        this.add(check_pnlNavContainer);
        this.addButton(saveButton);
        this.addButton(cancelButton);
        
        /**
             * purpose:加载树
             * @class 
             * @constructor
             * @tab {TabPanel}
             */
        function LoadTree(tab, manager, type) {
            if (type == TOCTREETYPE.SNS) manager.LoadsnsTree(tab.body.dom);
            else manager.LoadtocTree(tab.body.dom);
        };
    },

    Initialize: function () {
        var ids = this.m_RightIDs.split(',');
        var node;
        var result;
        var arr = new Array();

        for (var i = 0; i < ids.length; i++) {
            arr[i] = ids[i];
        }
        this.m_TreeManager.setDMids(arr);
    },

    SaveDataRight: function () {
        if (!Service.IsFunction(this.m_SaveRoleDataRightHandler)) return;

        this.m_SaveRoleDataRightHandler();
    },

    /**
    * purpose:获取选择的DM列表
    * @Return {Array} DMID列表
    */
    GetSelectedIDs: function () {
        var treeType = MainFrm.Tree.TreeType.SNS;
        
        if( this.m_CheckPnlNavTree.getActiveTab().id == 'Check_pnlTocTreeContainer')
        {
            treeType =  MainFrm.Tree.TreeType.TOC;
        }
        
        return this.m_TreeManager.GetDMids(treeType);
    }
});

/**
 * purpose:角色功能权限编辑窗体
 * @class RoleRightWindow
 */
UserManager.RoleRightWindow = Ext.extend(Ext.Window, {
    title: '设置功能权限',
     modal:true,
    width: 300,
    height: 200,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: {
        border: false
    },
    layout: 'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',
    listeners: {
        show: function () {
            this.Initialize();
        }
    },

    gridRoleRight: null,

    m_RoleRightStorge: null,

    /**
     * 角色权限ID集合
     * @type Array
     */
    m_RoleRightIDs: null,

    /**
     * 保存角色权限处理方法
     * @type Function
     */
    m_SaveRoleRightHandler: null,

    constructor: function (config) {

        if (config != undefined && config != null) {
            this.m_SaveRoleRightHandler = config.SaveRoleRightHandler;
            this.m_RoleRightIDs = config.RoleRightIDs;
        }

        UserManager.RoleRightWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        var rightsm = new Ext.grid.CheckboxSelectionModel({});

        var reader = new Ext.data.ArrayReader({},
        [{
            name: 'id',
            type: 'string'
        },
        {
            name: 'RightName',
            type: 'string'
        },
        {
            name: 'RightScript',
            type: 'string'
        }]);

        var rightDatastore = new Ext.data.Store({
            reader: reader,
            data: UserManager.RoleHelper.GetAllRoleRightInfo()
        });
        this.m_RoleRightStorge = rightDatastore;

        var rightGrid = new Ext.grid.GridPanel({
            stripeRows: true,
            sm: rightsm,
            deferRowRender: false,
            enableColLock: false,
            store: rightDatastore,
            cm: new Ext.grid.ColumnModel([
            rightsm, {
                id: 'id',
                width: 160,
                hidden: true,
                dataIndex: 'id'
            },
            {
                header: "权限名",
                width: 75,
                sortable: true,
                renderer: 'RightName',
                dataIndex: 'RightName'
            },
            {
                header: "权限描述",
                width: 75,
                sortable: true,
                renderer: 'RightScript',
                dataIndex: 'RightScript'
            }])
        });
        this.gridRoleRight = rightGrid;

        var saveButton = new Ext.Button({
            text: '确定',
            scope: this,
            handler: function () {
                this.SaveRoleRight();
            }
        });

        var cancelButton = new Ext.Button({
            text: '取消',
            scope: this,
            handler: function () {
                this.close();
            }
        });

        this.add(rightGrid);
        this.addButton(saveButton);
        this.addButton(cancelButton);
    },

    /**
     * purpose:初始化设置当前角色的功能权限
     */
    Initialize: function () {
        for (var i = 0; i < this.m_RoleRightStorge.getCount(); i++) {
            if (this.m_RoleRightIDs.indexOf(this.m_RoleRightStorge.getAt(i).get('id')) != -1) {
                this.SelectRow(i, true);
            }
        }
    },

    /**
     * purpose:保存角色权限
     * @class 
     */
    SaveRoleRight: function () {
        if (!Service.IsFunction(this.m_SaveRoleRightHandler)) return;

        this.m_SaveRoleRightHandler();
    },

    /**
     * purpose:选择行
     * @rowNum {Integer} 行号
     * @select {Boolean} 选择状态
     */
    SelectRow: function (rowNum, select) {
        this.gridRoleRight.selModel.selectRow(rowNum, select);
    },
    
   /**
    * purpose:获取选择的记录
    */
    GetSelectedRecord: function () {
        return this.gridRoleRight.getSelectionModel().getSelected();
    },

    /**
    * purpose:获取选择的角色列表
    * @class 
    * @constructor
    * @param {Array} 角色信息列表
    */
    GetSelections: function () {
        return this.gridRoleRight.getSelections();
    }

});

/**
 * purpose:角色编辑窗体
 * @class RoleEditWindow
 */
UserManager.RoleEditWindow = Ext.extend(Ext.Window, {
    width: 300,
    height: 200,
     modal:true,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: {
        border: false
    },
    layout: 'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',

    /**
     * 保存角色信息
     * @type Function
     */
    m_SaveRoleHandler: null,
    /**
     * 窗体编辑类型
     * @type UserManager.EditType
     */
    m_EditType: null,

    txtRoleName: null,
    txtRoleDescription: null,

    constructor: function (config) {

        if (config != undefined && config != null) {
            this.m_SaveRoleHandler = config.SaveRoleHandler;
            this.m_EditType = config.EditType;
        }

        UserManager.RoleEditWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        var roleName = new Ext.form.TextField({
            xtype: 'textfield',
            cls: 'user',
            name: 'RoleName',
            fieldLabel: '角色名',
            regex: /^[a-zA-Z0-9_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*[a-zA-Z0-9_\u4e00-\u9fa5]$/,
            regexText: '只能含有中文字母或者数字或者下划线且必须超过２位',
            allowBlank: false,
            blankText: '角色名不允许为空',
            maxLengthText: '输入的角色名长度不能大于50',
            maxLength: 50
        });
        this.txtRoleName = roleName;

        var roleScript = new Ext.form.TextArea({
            xtype: 'TextArea',
            cls: 'user',
            name: 'RoleScript',
            fieldLabel: '角色描述',
            allowBlank: true,
            maxLengthText: '输入的角色名长度不能大于225',
            maxLength: 225
        });
        this.txtRoleDescription = roleScript;

        var formPanel = new Ext.form.FormPanel({
            bodyStyle: 'padding-top:20px; background:transparent;',
            labelAlign: 'right',
            labelWidth: 70,
            labelPad: 0,
            frame: false,
            defaults: {
                anchor: '90%',
                selectOnFocus: true,
                invalidClass: null,
                msgTarget: 'side'
            },
            items: [roleName, roleScript]
        });

        var saveButton = new Ext.Button({
            text: '保存',
            scope: this,
            handler: function () {
                if (formPanel.getForm().isValid()) {
                    this.SaveRole();
                }
            }
        });

        var cancelButton = new Ext.Button({
            text: '取消',
            scope: this,
            handler: function () {
                this.close();
            }
        });

        this.add(formPanel);
        this.addButton(saveButton);
        this.addButton(cancelButton);
        
        SetEditType.call(this, this.m_EditType);

        function SetEditType(type) {
            if (type == UserManager.EditType.New) {
                this.setTitle('新增角色')
                this.buttons[0].setText('保存'); 
            }
            else {
                this.setTitle('编辑角色')
                //不能使用saveButton.setText
                this.buttons[0].setText('保存');
            }
        };
    },

    /**
     * purpose:保存角色
     */
    SaveRole: function () {
        if (!Service.IsFunction(this.m_SaveRoleHandler)) return;

        this.m_SaveRoleHandler();
    },

    GetRoleName: function () {
        return this.txtRoleName.getValue();
    },
    
    SetRoleName : function (roleName) 
    {
        this.txtRoleName.setValue(roleName);
    },
    
    SetRoleDescription : function (roleDescription) 
    {
        this.txtRoleDescription.setValue(roleDescription);
    },

    GetRoleDescription: function () {
        return this.txtRoleDescription.getValue();
    }
});

/**
 * purpose:角色管理控件
 * @class RoleManagerPanel
 */
UserManager.RoleManagerPanel = Ext.extend(Ext.Panel, {
    id: 'm_pnlUserRoleManager',
    closable: true,
    border: false,
    layout: 'fit',
    title: '角色维护',

    /**
	 * 角色表
	 * @EditorGridPanel
	 */
    gridRoleInfo: null,

    /**
	 * 角色信息
	 * @type Array
	 */
    m_RoleStorge: null,

    m_AddRoleHandler: null,
    m_ModifyRoleHandler: null,
    m_RemoveRoleHandler: null,
    m_UpdateRoleDataRightHandler: null,
    m_UpdateRoleRightHandler: null,

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_AddRoleHandler = config.AddRoleHandler;
            this.m_ModifyRoleHandler = config.ModifyRoleHandler;
            this.m_RemoveRoleHandler = config.RemoveRoleHandler;
            this.m_UpdateRoleDataRightHandler = config.UpdateRoleDataRightHandler
            this.m_UpdateRoleRightHandler = config.UpdateRoleRightHandler;
        }

        this.Initialize();

        UserManager.RoleManagerPanel.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {

        UserManager.RoleManagerPanel.superclass.initComponent.call(this);

        var toolBar = this.CreateToolBar();

        var sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                rowSelect: function (sm, rowIndex, keep, rec) {
                    SetEditButtonState();
                },
                selectionchange: function (sm) {
                    SetEditButtonState();
                }
            }
        });

        var roleGrid = new Ext.grid.EditorGridPanel({
            stripeRows: true,
            height: 3000,
            frame: true,
            sm: sm,
            store: this.m_RoleStorge,
            cm: new Ext.grid.ColumnModel([
            sm, {
                id: 'id',
                width: 0,
                hidden: true,
                dataIndex: 'id'
            },
            {
                header: "角色名",
                width: 75,
                sortable: true,
                renderer: 'RoleName',
                dataIndex: 'RoleName'
            },
            {
                header: "角色描述",
                width: 150,
                sortable: true,
                renderer: 'RoleScript',
                dataIndex: 'RoleScript'
            },
            {
                header: "",
                width: 0,
                hidden: true,
                renderer: 'RightId',
                dataIndex: 'RightId'
            },
            {
                header: "",
                width: 0,
                hidden: true,
                renderer: 'DMindex',
                dataIndex: 'DMindex'
            }]),
            tbar: toolBar

        });

        this.gridRoleInfo = roleGrid;

        this.add(roleGrid);

        /**
         * purpose:设置编辑节点的状态，如果当前选中了一个角色则编辑按钮可用，否则不可用
         * @class initComponent
         */
        function SetEditButtonState() {
            var btn = Ext.getCmp('tbar1');
            if (sm.getCount() == 1) {
                btn.enable();
            }
            else {
                btn.disable();
            }
        };
    },

    /**
     * purpose:创建工具栏
     * @class 
     */
    CreateToolBar: function () {
        return[{
            tooltip: '新增',
            icon: 'resources/images/16x16/Add.png',
            cls: 'x-btn-icon',
            scope: this,
            handler: function () {
                this.AddRole();
            }
        },
        '-', {
            id: 'tbar1',
            icon: 'resources/images/16x16/PageAdd.png',
            cls: 'x-btn-icon',
            tooltip: '编辑',
            scope: this,
            handler: function () {
                this.ModifyRole();
            }
        },
        '-', {
            id: 'tbar3',
            icon: 'resources/images/16x16/User.png',
            cls: 'x-btn-icon',
            tooltip: '为角色设置功能权限',
            scope: this,
            handler: function () {
                var record = this.GetSelectedRecord();
                if (!record) {
                    Service.ShowMessageBox('错误', '请先选择要编辑的角色！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                }
                else {
                    var m = this.GetSelections();
                    var userid = m[0].get('RoleName');
                    var rightId = m[0].get('RightId');
                    this.UpdateRoleRight(userid, rightId);
                }
            }
        },
        '-', {
            id: 'tbar4',
            icon: 'resources/images/16x16/DM.gif',
            cls: 'x-btn-icon',
            tooltip: '为角色设置数据权限',
            scope: this,
            handler: function () {
                var record = this.GetSelectedRecord();
                if (!record) {
                    Service.ShowMessageBox('错误', '请先选择要编辑的角色！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                }
                else {
                    var m = this.GetSelections();
                    var userid = m[0].get('RoleName');
                    var dmIDs = m[0].get('DMindex');
                    this.UpdateRoleDataRight(userid, dmIDs);
                }
            }
        },
        '-', {
            tooltip: '删除',
            icon: 'resources/images/16x16/Delete.png',
            cls: 'x-btn-icon',
            scope: this,
            handler: function () {
                this.RemoveRole();
            }
        }];
    },

    /**
    * purpose:重新加载数据，刷新界面
    */
    ResetBinding: function () {
        this.m_RoleStorge.loadData(UserManager.RoleHelper.GetAllRoleInfoEx());
    },

    /**
    * purpose:增加用户
    */
    AddRole: function () {
        if (!Service.IsFunction(this.m_AddRoleHandler)) return;

        this.m_AddRoleHandler();
    },

    /**
    * purpose:更改角色
    */
    ModifyRole: function () {
        if (!Service.IsFunction(this.m_ModifyRoleHandler)) return;

        this.m_ModifyRoleHandler();
    },

    /**
    * purpose:移除角色
    */
    RemoveRole: function () {
        if (!Service.IsFunction(this.m_RemoveRoleHandler)) return;

        this.m_RemoveRoleHandler();
    },
    /**
    * purpose:更新角色权限
    */
    UpdateRoleRight: function (userid, rightId) {
        if (!Service.IsFunction(this.m_UpdateRoleRightHandler)) return;

        this.m_UpdateRoleRightHandler(userid, rightId);
    },
    /**
    * purpose:更新角色数据权限
    */
    UpdateRoleDataRight: function (userid, dmIDs) {
        if (!Service.IsFunction(this.m_UpdateRoleDataRightHandler)) return;

        this.m_UpdateRoleDataRightHandler(userid, dmIDs);
    },

    /**
    * purpose:获取选择的记录
    */
    GetSelectedRecord: function () {
        return this.gridRoleInfo.getSelectionModel().getSelected();
    },

    /**
    * purpose:获取选择的角色列表
    * @class 
    * @constructor
    * @param {Array} 角色信息列表
    */
    GetSelections: function () {
        return this.gridRoleInfo.getSelections();
    },

    /**
    * purpose:初始化角色绑定数据
    */
    Initialize: function () {
        var reader = new Ext.data.ArrayReader({},
        [{
            name: 'id',
            type: 'string'
        },
        {
            name: 'RoleName',
            type: 'string'
        },
        {
            name: 'RoleScript',
            type: 'string'
        },
        {
            name: 'RightId',
            type: 'string'
        },
        {
            name: 'DMindex',
            type: 'string'
        }]);

        this.m_RoleStorge = new Ext.data.Store({
            reader: reader,
            data: UserManager.RoleHelper.GetAllRoleInfoEx()
        });
    }
});