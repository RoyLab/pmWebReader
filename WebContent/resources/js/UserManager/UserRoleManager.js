/************************************************************************
*功能描述：角色管理
*作者：wanghai
*日期：2009-03-12      
*修改：
*2010-01-12   hyb  重构
************************************************************************/

//定义名称空间
Service.RegNameSpace('window.UserManager');

UserManager.CreateRoleManagerPanel = function() {

    var roleManagerPanel = new UserManager.RoleManagerPanel({
        AddRoleHandler: AddRole,
        ModifyRoleHandler: ModifyRole,
        RemoveRoleHandler: RemoveRole,
        UpdateRoleRightHandler: UpdateRoleRight,
        UpdateRoleDataRightHandler: UpdateRoleDataRight
    });
    
    return roleManagerPanel;

    function UpdateRoleDataRight(userid, dmIDs)//为角色设置数据权限
    {
        var roleDataRightWindow = new UserManager.RoleDataRightWindow({
            SaveRoleDataRightHandler: SaveDataRight,
            RightIDs: dmIDs
        });

        roleDataRightWindow.show();

        /**
          * purpose:保存数据权限
          */
        function SaveDataRight() {

            var selectedIDs = roleDataRightWindow.GetSelectedIDs();
            var arr = new Array();
            if (userid != undefined && userid != '') {
                for (var s in selectedIDs)
                arr.push(s);
                jsonData = arr.join(',');

                Service.WebService.Call('RoleDMlistUpdate', {
                    RoleName: userid,
                    DMindex: jsonData
                },
                function (result) {
                    SaveDataRightCallBack(result);
                },
                function (XmlHttpRequest, textStatus, errorThrow) {
                    SaveDataRightCallBack(XmlHttpRequest);
                });
            }
            else {
                Service.ShowMessageBox('错误', '请先选择要新增的角色！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }
        };

        function SaveDataRightCallBack(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败!', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text != "true") {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }

            roleDataRightWindow.close();
            roleManagerPanel.ResetBinding();
        };

    }

    /**
      * purpose:修改角色功能权限
      * @class 
      * @constructor
      * @param {roleName} 角色ID
      * @param {rightIds} 功能权限ID
      */
    function UpdateRoleRight(roleName, rightIds)//编辑角色权限
    {

        var roleRightWindow = new UserManager.RoleRightWindow({
            SaveRoleRightHandler: SaveRight,
            RoleRightIDs: rightIds
        });
        roleRightWindow.show();

        function SaveRight() {
            var record = roleRightWindow.GetSelectedRecord();

            if (!record) return;

            var m = roleRightWindow.GetSelections();
            var IDs = "";

            for (var i = 0, len = m.length; i < len; i++) {
                var ss = m[i].get('id');
                if (i == 0) {
                    IDs = IDs + ss;
                }
                else {
                    IDs = IDs + ',' + ss;
                }
            }

            Service.WebService.Call('RoleRightUpdate', {
                RoleName: roleName,
                RightId: IDs
            },
            function (result) {
                SaveRightCallback(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                SaveRightCallback(result);;
            });

        };

        function SaveRightCallback(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败!', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text != "true") {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }

            roleManagerPanel.ResetBinding();
            roleRightWindow.close();
        };
    };
    //end 编辑角色权限

    /**
     * purpose:删除角色
     */
    function RemoveRole() {
        var record = roleManagerPanel.GetSelectedRecord();
        if (record) {
            Service.ShowMessageBox('确认', '您确认要删除角色吗？', Ext.MessageBox.YESNO, Ext.MessageBox.QUESTION, function (btn) {
                if (btn != 'yes') return;

                var m = roleManagerPanel.GetSelections();
                for (var i = 0, len = m.length; i < len; i++) {
                    var ss = m[i].get('id');

                    DeleteRoleInfo(ss);
                }

                roleManagerPanel.ResetBinding();
            });
        }
        else {
            Service.ShowMessageBox('错误', '请先选择要删除的角色！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }

        function DeleteRoleInfo(roleId) {

            //不允许删除已经被使用的角色
            if (HasRoleBeenUsed(roleId)) {
                ShowMessageBox('错误', '该角色已经被使用，不允许删除！', Ext.MessageBox.OK, Ext.MessageBox.WARNING);
                return;
            }

            Service.WebService.Call('RoleDelete', {
                id: roleId
            },
            function (result) {
                DeleteUserInfoCallBack(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                alert(XmlHttpRequest.responseText);
            });
        };

        /**
         * purpose:判断角色是否被使用了
         * @class 
         * @param {roleID} 角色ID
         */
        function HasRoleBeenUsed(roleID) {
            var hasUsed = false;
            Service.WebService.Call('RoleHasUsed', {
                roleid: roleID
            },
            function (result) {
                if (result.text == 'true') hasUsed = true;
            });
            return hasUsed;
        }

        function DeleteUserInfoCallBack(result) {
            if (result.text == 'false') {
                Service.ShowMessageBox('错误', '删除失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }
            else {
                roleManagerPanel.ResetBinding();
            }
        };

    };
    //end remove

    /**
     * purpose:修改角色
     */
    function ModifyRole() {
        var modifyRoleWindow;
        var record = roleManagerPanel.GetSelectedRecord();
        if (!record) {
            Service.ShowMessageBox('错误', '请先选择要编辑的角色！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        else {
            modifyRoleWindow = new UserManager.RoleEditWindow({
                SaveRoleHandler: UpdateRole,
                EditType: UserManager.EditType.Edit
            });

            var m = roleManagerPanel.GetSelections();
            modifyRoleWindow.SetRoleName(m[0].get('RoleName'));
            modifyRoleWindow.SetRoleDescription(m[0].get('RoleScript'));
            modifyRoleWindow.show();
        }

        function UpdateRole() {

            var m = roleManagerPanel.GetSelections();
            var id = m[0].get('id');
            var rName = modifyRoleWindow.GetRoleName();
            var rScript = modifyRoleWindow.GetRoleDescription();

            Service.WebService.Call('RoleUpdate', {
                id: id,
                RoleName: rName,
                RoleScript: rScript
            },
            function (result) {
                UpdateRoleCallBack(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                UpdateRoleCallBack(XmlHttpRequest);
            });
        };

        function UpdateRoleCallBack(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text == "true") {
                roleManagerPanel.ResetBinding();
                modifyRoleWindow.close();
            }
            else {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }

        };
    };
    //end modify                       

    /**
     * purpose:新增角色
     */
    function AddRole() {

        var addRoleWindow = new UserManager.RoleEditWindow({
            SaveRoleHandler: SaveRole,
            EditType: UserManager.EditType.New
        });

        addRoleWindow.show();

        /**
        * purpose:保存角色
        */
        function SaveRole() {

            var rName = addRoleWindow.GetRoleName();
            var rScript = addRoleWindow.GetRoleDescription();

            Service.WebService.Call('RoleAdd', {
                RoleName: rName,
                RoleScript: rScript
            },
            function (result) {
                AddRoleCallBack(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                AddRoleCallBack(XmlHttpRequest);
            });

        };

        function AddRoleCallBack(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败!', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text == "true") {
                UpdateRoleRight(addRoleWindow.GetRoleName(), '3');
                roleManagerPanel.ResetBinding();
                addRoleWindow.close();
            }
            else {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
        };
    };
};

/**
 * purpose:数据权限窗口
 * @class DataRightWindow
 */
UserManager.RoleDataRightWindow = Ext.extend(Ext.Window, {
    title: '设置数据权限',
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

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_SaveRoleDataRightHandler = config.SaveRoleDataRightHandler;
            this.m_RightIDs = config.RightIDs;
        }

        UserManager.RoleDataRightWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        var checkTocTreeManager = new IBV.MainFrm.Tree.ClickPublicationTreeManager({
            checked: true,
            disabled: false
        });
        this.m_TreeManager = checkTocTreeManager;

        var check_pnlTocTree = checkTocTreeManager.PublicationCheckTree;

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

        var check_pnlNavTree = new Ext.TabPanel({
            id: 'Check_pnlNavTree',
            border: false,
            deferredRender: false,
            activeTab: 'Check_pnlTocTreeContainer',
            tabPosition: 'bottom',
            items: [check_pnlTocTreeContainer, check_pnlSnsTreeContainer],

            listeners: {
                tabchange: function (tabPanel, tab) {
                    var _record = check_pnlTocTree.getChecked();
                    var result;
                    tab.add(check_pnlTocTree);
                    tab.doLayout();

                    if (tab.id == 'Check_pnlTocTreeContainer') {
                        checkTocTreeManager.LoadCheckTeachInfoTree();
                    }
                    else if (tab.id == 'Check_pnlSnsTreeContainer') {
                        checkTocTreeManager.LoadCheckSnsTree();
                    }
                }
            }
        });

        var btnExpandAll = new Ext.Toolbar.Button({
            icon: 'resources/images/16x16/ExpandAll.gif',
            cls: 'x-btn-icon',
            tooltip: '<b>展开所有节点</b><br/>',
            handler: function () {
                check_pnlTocTree.root.expand(true);
            }
        });

        var btnCollapseAll = new Ext.Toolbar.Button({
            icon: 'resources/images/16x16/CollapseAll.gif',
            cls: 'x-btn-icon',
            tooltip: '<b>折叠所有节点</b><br/>',
            handler: function () {
                check_pnlTocTree.root.collapse(true);
            }
        });

        var check_pnlNavContainer = new Ext.Panel({
            id: 'Check_pnlNavContainer',
            layout: 'fit',
            border: false,
            title: '选择树',
            iconCls: 'iconToc',
            items: [check_pnlNavTree],
            tbar: [m_btnTOCTrack
            //,'-',btnExpandAll
            , btnCollapseAll]
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
        return this.m_TreeManager.getDMids();
    }
});

/**
 * purpose:角色功能权限编辑窗体
 * @class RoleRightWindow
 */
UserManager.RoleRightWindow = Ext.extend(Ext.Window, {
    title: '设置功能权限',
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
                    ShowMessageBox('错误', '请先选择要编辑的角色！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
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
                    ShowMessageBox('错误', '请先选择要编辑的角色！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
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