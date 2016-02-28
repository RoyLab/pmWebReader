/************************************************************************
*功能描述：用户管理窗体与控件
*作者：hyb
*日期：2010-01-19      
*修改：
*
************************************************************************/

/**
 * purpose:数据权限设置窗体
 * @class DataRightEditWindow
 */
UserManager.DataRightEditWindow = Ext.extend(Ext.Window, {
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
     * 用户数据权限
     * @String
     */
    m_UserDMIDs: null,

    /**
     * 角色数据权限
     * @String
     */
    m_RoleDMIDs: null,

    /**
     * 出版物树管理,对应界面的编辑树
     * @ClickPublicationTreeManager
     */
    m_UserTocTreeManager: null,
    
    m_UserTreePanel : null,

    /**
     * 
     * @ClickPublicationTreeManager
     */
    m_RoleTocTreeManager: null,

    m_UpdateUserDataRightHandler: null,

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_UpdateUserDataRightHandler = config.UpdateUserDataRightHandler;

            this.m_UserDMIDs = config.UserDMIDs;

            this.m_RoleDMIDs = config.RoleDMIDs;
        }

        UserManager.UserRightEditWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        var userTocTreeManager = new MainFrm.Tree.ClickPublicationTreeManager({
            checked: true,
            disabled: false
        });
        this.m_UserTocTreeManager = userTocTreeManager;

        var roleTocTreeManager = new MainFrm.Tree.ClickPublicationTreeManager({
            checked: true,
            disabled: true
        });
        this.m_RoleTocTreeManager = roleTocTreeManager;

        var check_pnlNavTree = new Ext.TabPanel({
            id: 'Check_pnlNavTree',
            border: false,
            deferredRender: false,
            activeTab: 'check_UserTreeContainer',
            items: [CreateUserPanel.call(this), CreateRolePanel()]
        });

        var check_pnlNavContainer = new Ext.Panel({
            id: 'check_pnlNavContainer',
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
                this.UpdateUserDataRight();
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
             * 定义手册数据的类型
             * @Object
             */
        var TOCTREETYPE = {
            SNS: 0,
            TOC: 1
        };

        /**
             * purpose:创建用户数据权限Panel
             * @Return {Ext.Panel}
             */
        function CreateUserPanel() {
            var userSnsTreeContainer = new Ext.Panel({
                id: 'userSnsTreeContainer',
                border: false,
                layout: 'fit',
                title: '结构',
                autoScroll: true,
                iconCls: 'iconSNS'
            });

            var userTocTreeContainer = new Ext.Panel({
                id: 'userTocTreeContainer',
                border: false,
                layout: 'fit',
                title: '手册',
                autoScroll: true,
                iconCls: 'iconManual'
            });

            var userTreepnlNav = new Ext.TabPanel({
                id: 'userTreepnlNav',
                border: false,
                deferredRender: false,
                activeTab: 'userTocTreeContainer',
                items: [userTocTreeContainer, userSnsTreeContainer],
                scope: this,
                listeners: {
                    tabchange: function (tabPanel, tab) {
                        if (tab.id == 'userTocTreeContainer') {
                            LoadTree(tab, userTocTreeManager, TOCTREETYPE.TOC);
                        }
                        else if (tab.id == 'userSnsTreeContainer') {
                            LoadTree(tab, userTocTreeManager, TOCTREETYPE.SNS);
                        }
                    }
                }
            });
            
            this.m_UserTreePanel = userTreepnlNav;

            var check_UserTreeContainer = new Ext.Panel({
                id: 'check_UserTreeContainer',
                border: false,
                layout: 'fit',
                title: '用户数据权限分配',
                items: userTreepnlNav,
                autoScroll: true
            });

            return check_UserTreeContainer;
        };

        /**
             * purpose:创建角色数据权限Panel
             * @Return {Ext.Panel}
             */
        function CreateRolePanel() {
            var roleSnsTreeContainer = new Ext.Panel({
                id: 'roleSnsTreeContainer',
                border: false,
                layout: 'fit',
                title: '结构',
                autoScroll: true,
                iconCls: 'iconSNS'
            });

            var roleTocTreeContainer = new Ext.Panel({
                id: 'roleTocTreeContainer',
                border: false,
                layout: 'fit',
                title: '手册',
                autoScroll: true,
                iconCls: 'iconManual'
            });

            var roleTreepnlNav = new Ext.TabPanel({
                id: 'roleTreepnlNav',
                border: false,
                deferredRender: false,
                activeTab: 'roleTocTreeContainer',
                //tabPosition: 'bottom',
                items: [roleTocTreeContainer, roleSnsTreeContainer],
                scope: this,
                listeners: {
                    tabchange: function (tabPanel, tab) {
                        if (tab.id == 'roleTocTreeContainer') {
                            LoadTree(tab, roleTocTreeManager, TOCTREETYPE.TOC);
                        }
                        else if (tab.id == 'roleSnsTreeContainer') {
                            LoadTree(tab, roleTocTreeManager, TOCTREETYPE.SNS);
                        }
                    }
                }
            });

            var check_RoleTreeContainer = new Ext.Panel({
                id: 'check_RoleTreeContainer',
                border: false,
                layout: 'fit',
                title: '隶属角色数据权限',
                items: roleTreepnlNav,
                autoScroll: true
            });

            return check_RoleTreeContainer;
        };

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

    /**
     * purpose:私有成员不要直接范围
     * @class 
     */
    Initialize: function () {
        this.m_UserTocTreeManager.setDMids(this.m_UserDMIDs);
        this.m_RoleTocTreeManager.setDMids(this.m_RoleDMIDs);
    },

    /**
     * purpose:更新数据权限
     */
    UpdateUserDataRight: function () {
        if (!Service.IsFunction(this.m_UpdateUserDataRightHandler)) return;

        this.m_UpdateUserDataRightHandler();
    },

    /**
     * purpose:获取选择的DMID列表
     * @class 
     */
    GetSelectedDMIDs: function () {
        var treeType = MainFrm.Tree.TreeType.SNS;
        
        if( this.m_UserTreePanel.getActiveTab().id == 'userTocTreeContainer')
        {
            treeType =  MainFrm.Tree.TreeType.TOC;
        }
        
        return this.m_UserTocTreeManager.GetDMids(treeType);
    }

});

/**
 * purpose:用户功能权限编辑窗体
 * @class 
 */
UserManager.UserRightEditWindow = Ext.extend(Ext.Window, {
    title: '功能权限',
     modal:true,
    width: 300,
    height: 250,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: {
        border: false
    },
    layout: 'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',

    gridRole: null,

    /**
     * 角色集合信息
     * @Arrary
     */
    m_RolesData: null,
    m_RolesDataStore: null,

    /**
     * 角色描述信息
     * @Array
     */
    m_RoleDescriptInfos: null,

    m_UpdateRightHandler: null,

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_UpdateRightHandler = config.UpdateRightHandler;
            this.m_RolesData = config.RolesData;
            this.m_RoleDescriptInfos = config.RoleDescriptInfos;
        }

        UserManager.UserRightEditWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {

        var Reader = new Ext.data.ArrayReader({},
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

        var roleDataStore = new Ext.data.Store({
            reader: Reader,
            data: this.m_RolesData
        });
        this.m_RolesDataStore = roleDataStore;

        var roleDescriptDataStore = new Ext.data.Store({
            reader: Reader,
            data: this.m_RoleDescriptInfos
        });

        var Rightsm = new Ext.grid.CheckboxSelectionModel({});

        var roleGrid = new Ext.grid.GridPanel({
            stripeRows: true,
            id: 'UserRightgrid',
            title: '用户权限分配',
            sm: Rightsm,
            deferRowRender: false,
            enableColLock: false,
            store: roleDataStore,
            cm: new Ext.grid.ColumnModel([
            Rightsm, {
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
                width: 150,
                sortable: true,
                renderer: 'RightScript',
                dataIndex: 'RightScript'
            }])
        });
        this.gridRole = roleGrid;

        var roleDescriptInfoGrid = new Ext.grid.GridPanel({
            stripeRows: true,
            title: '隶属角色权限',
            id: 'RoleRightgrid',
            deferRowRender: false,
            enableColLock: false,
            store: roleDescriptDataStore,
            cm: new Ext.grid.ColumnModel([{
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
                width: 150,
                sortable: true,
                renderer: 'RightScript',
                dataIndex: 'RightScript'
            }])
        });

        var pnlNavRight = new Ext.TabPanel({
            id: 'pnlNavRight',
            border: false,
            deferredRender: false,
            activeTab: 'UserRightgrid',
            items: [roleGrid, roleDescriptInfoGrid]
        });

        pnlNavRight.setActiveTab(0);

        var pnlNavContainer = new Ext.Panel({
            id: 'Check_pnlNavContainer',
            layout: 'fit',
            border: false,
            title: '选择列表',
            iconCls: 'iconToc',
            items: [pnlNavRight]
        });

        var saveButton = new Ext.Button({
            text: '确定',
            scope: this,
            handler: function () {
                this.UpdateUserRight();
            }
        });

        var cancelButton = new Ext.Button({
            text: '取消',
            scope: this,
            handler: function () {
                this.close();
            }
        });

        this.add(pnlNavContainer);
        this.addButton(saveButton);
        this.addButton(cancelButton);
    },

    /**
     * purpose:选择角色
     * @class 
     * @constructor
     * @param {type} name1
     */
    SelectRole: function (roleIDs) {
        for (var i = 0; i < this.m_RolesDataStore.getCount(); i++) {
            var rid = this.m_RolesDataStore.getAt(i).get('id');

            for (var j = 0; j < roleIDs.length; j++) {
                if (rid == roleIDs[j]) {
                    this.gridRole.selModel.selectRow(i, true);
                }
            }
        }
    },

    /**
     * purpose:
     * @class 
     * @constructor
     * @param {type} name1
     */
    UpdateUserRight: function () {
        if (!Service.IsFunction(this.m_UpdateRightHandler)) return;

        this.m_UpdateRightHandler();
    },

    /**
     * purpose:获取选择角色记录
     * @class 
     */
    GetSelectedRoleRecord: function () {
        return this.gridRole.getSelectionModel().getSelected();
    },

    /**
     * purpose:获取选择角色记录
     * @class 
     */
    GetSelectedRoles: function () {
        return this.gridRole.getSelections();
    }
});

/**
 * purpose:强制离线窗体
 * @class 
 */
UserManager.LogoutUserWindow = Ext.extend(Ext.Window, {
    title: '强制离线',
     modal:true,
    width: 300,
    height: 150,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: {
        border: false
    },
    layout: 'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',

    txtUserID: null,
    frmPanel: null,

    /**
     * 登录处理方法
     * @type Function
     */
    m_LogoutUserHandler: null,

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_LogoutUserHandler = config.LogoutUserHandler;
        }

        UserManager.LogoutUserWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        var userId = new Ext.form.TextField({
            xtype: 'textfield',
            readOnly: true,
            name: 'userId',
            fieldLabel: '登录名',
            regex: /^[a-zA-Z0-9_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*[a-zA-Z0-9_\u4e00-\u9fa5]$/,
            regexText: '只能含有中文字母或者数字或者下划线且必须超过２位',
            allowBlank: false,
            blankText: '登录名不允许为空',
            maxLengthText: '输入的用户名长度不能大于50',
            maxLength: 50
        });
        this.txtUserID = userId;

        var formPanel = new Ext.form.FormPanel({
            bodyStyle: 'padding-top:20px; background:transparent;',
            labelAlign: 'right',
            labelWidth: 70,
            labelPad: 0,
            frame: false,
            defaults: {
                anchor: '95%',
                selectOnFocus: true,
                invalidClass: null,
                msgTarget: 'side'
            },
            items: [userId]
        });
        this.frmPanel = formPanel;

        var logoutButton = new Ext.Button({
            text: '强制离线',
            scope: this,
            handler: function () {
                if (formPanel.getForm().isValid()) {
                    this.LogoutUser();
                }
            }
        });

        var CancelButton = new Ext.Button({
            text: '取消',
            scope: this,
            handler: function () {
                this.close();
            }
        });

        this.add(formPanel);
        this.addButton(logoutButton);
        this.addButton(CancelButton);
    },

    /**
     * purpose:离线用户
     * @class LogoutUserWindow
     */
    LogoutUser: function () {
        if (!Service.IsFunction(this.m_LogoutUserHandler)) return;

        this.m_LogoutUserHandler();
    },

    SetUserID: function (userID) {
        this.txtUserID.setValue(userID);
    }

});

/**
 * purpose:密码修改窗体
 * @class 
 */
UserManager.PasswordEditWindow = Ext.extend(Ext.Window, {
    title: '修改密码',
    modal : true,
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
    txtPassword: null,
    txtNewPassword: null,
    txtConfirmPassword: null,
    frmPanel: null,

    m_UpdatePasswordHandler: null,

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_UpdatePasswordHandler = config.UpdatePasswordHandler;
        }

        UserManager.PasswordEditWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        var username = new Ext.form.Label({
            cls: 'massege',
            id: 'massege',
            style: '{color: #FF0000;}',
            xtype: 'label',
            name: 'username',
            text: ''
        });

        var password = new Ext.form.TextField({
            xtype: 'textfield',
            cls: 'password',
            name: 'password',
            fieldLabel: '旧密码',
            allowBlank: true,
            inputType: 'password',
            maxLengthText: '输入的密码长度不能大于50',
            maxLength: 50
        });
        this.txtPassword = password;

        var newpassword = new Ext.form.TextField({
            xtype: 'textfield',
            cls: 'password',
            name: 'password',
            fieldLabel: '新密码',
            allowBlank: true,
            inputType: 'password',
            maxLengthText: '输入的密码长度不能大于50',
            maxLength: 50
        });
        this.txtNewPassword = newpassword;

        var compassword = new Ext.form.TextField({
            xtype: 'textfield',
            cls: 'password',
            name: 'compassword',
            fieldLabel: '确认密码',
            allowBlank: true,
            inputType: 'password',
            maxLengthText: '输入的密码长度不能大于50',
            maxLength: 50
        });
        this.txtConfirmPassword = compassword;

        var massege = new Ext.form.Label({
            cls: 'massege',
            id: 'massege',
            style: '{color: #FF0000;}',
            xtype: 'label',
            name: 'massege',
            text: ''
        });

        var formPanel = new Ext.form.FormPanel({
            bodyStyle: 'padding-top:20px; background:transparent;',
            labelAlign: 'right',
            labelWidth: 70,
            labelPad: 0,
            frame: false,
            defaults: {
                anchor: '95%',
                selectOnFocus: true,
                invalidClass: null,
                msgTarget: 'side'
            },
            items: [password, newpassword, compassword, massege]
        });
        this.frmPanel = formPanel;

        var updateButton = new Ext.Button({
            text: '保存',
            scope: this,
            handler: function () {
                if (this.frmPanel.getForm().isValid()) {
                    //complexityRule = ApplicationContext.IComplexity();
                    
                    validate = ApplicationContext.IComplexityValidate();
                    passwordValue = this.txtNewPassword.getValue();
                    message = validate.isPasswordValid(passwordValue);
                    if(this.txtNewPassword.getValue() != compassword.getValue())
                    {
                        message += '输入密码不一致！';
                    }
                    
                    if(message.length > 0)
                        Service.ShowMessageBox('错误', message, Ext.MessageBox.OK, Ext.MessageBox.WARNING, null);
                    else
                        this.UpdatePassword();
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
        this.addButton(updateButton);
        this.addButton(cancelButton);
    },

    UpdatePassword: function () {
        if (!Service.IsFunction(this.m_UpdatePasswordHandler)) return;

        this.m_UpdatePasswordHandler();
    },

    /**
     * purpose:获取密码
     * @class PasswordEditWindow
     */
    GetPasswordValue: function () {
        return this.txtPassword.getValue();
    },

    /**
     * purpose:获取新密码
     * @class PasswordEditWindow
     */
    GetNewPasswordValue: function () {
        return this.txtNewPassword.getValue();
    },

    /**
     * purpose:获取确认
     * @class PasswordEditWindow
     */
    GetConfirmPasswordValue: function () {
        return this.txtConfirmPassword.getValue();
    }
});


/**
 * purpose:用户编辑窗体
 * @class 
 * @constructor
 */
UserManager.UserEditWindow = Ext.extend(Ext.Window, {
    title: '新增用户',
    modal : true,
    width: 300,
    height: 250,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: {
        border: false
    },
    layout: 'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',
    txtUserID: null,
    txtUserName: null,
    txtPassword: null,
    txtComPassword: null,
    cbSecurity: null,
    cbRole: null,
    frmPanel: null,
    btnSave: null,
    btnCancel: null,

    m_SaveHandler: null,
    /**
       * 窗体编辑类型
       * @type UserManager.EditType
       */
    m_EditType: UserManager.EditType.New,

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_SaveHandler = config.SaveHandler;
            this.m_EditType = config.EditType;
        }

        UserManager.UserEditWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        this.txtUserID = new Ext.form.TextField({
            xtype: 'textfield',
            name: 'userId',
            fieldLabel: '登录名',
            regex: /^[a-zA-Z0-9_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*[a-zA-Z0-9_\u4e00-\u9fa5]$/,
            regexText: '只能含有中文字母或者数字或者下划线且必须超过２位',
            allowBlank: false,
            blankText: '登录名不允许为空',
            maxLengthText: '输入的用户名长度不能大于50',
            maxLength: 50
        });

        this.txtUserName = new Ext.form.TextField({
            xtype: 'textfield',
            name: 'userName',
            fieldLabel: '用户名',
            allowBlank: false,
            blankText: '用户名不允许为空',
            maxLengthText: '输入的用户名长度不能大于50',
            maxLength: 50
        });

        this.txtPassword = new Ext.form.TextField({
            xtype: 'textfield',
            cls: 'password',
            name: 'password',
            fieldLabel: '密   码',
            allowBlank: true,
            inputType: 'password',
            maxLengthText: '输入的密码长度不能大于50',
            maxLength: 50
        });

        this.txtComPassword = new Ext.form.TextField({
            xtype: 'textfield',
            cls: 'password',
            name: 'compassword',
            fieldLabel: '确认密码',
            allowBlank: true,
            inputType: 'password',
            maxLengthText: '输入的密码长度不能大于50',
            maxLength: 50
        });

        this.cbSecurity = new Ext.form.ComboBox({
            fieldLabel: '密级度',
            emptyText: '请选择...',
            width: 180,
            mode: 'local',
            displayField: 'ModelText',
            valueField: 'Modelvalue',
            readOnly: true,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
                fields: ['Modelvalue', 'ModelText'],
                data: Scurity.Class
            })
        });

        this.cbRole = new Ext.form.ComboBox({
            fieldLabel: '角色',
            emptyText: '请选择...',
            width: 180,
            mode: 'local',
            displayField: 'RoleName',
            valueField: 'Id',
            readOnly: true,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
                fields: ['Id', 'RoleName'],
                data: []
            })
        });

        this.cbRole.store.loadData(UserManager.RoleHelper.GetAllRoleInfo());

        this.frmPanel = new Ext.form.FormPanel({
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
            items: [this.txtUserID, this.txtUserName, this.cbSecurity, this.cbRole]
        });

        this.btnSave = new Ext.Button({
            text: '保存',
            scope: this,
            handler: this.Save
        });

        this.btnCancel = new Ext.Button({
            text: '取消',
            scope: this,
            handler: function () {
                this.close();
            }
        });

        this.add(this.frmPanel);
        this.addButton(this.btnSave);
        this.addButton(this.btnCancel);

        SetEditType.call(this, this.m_EditType);

        /**
            * purpose:设置编辑类型
            * @type {EditType} 编辑类型
            */
        function SetEditType(type) {
            if (type == UserManager.EditType.New) {
                this.title = '新增用户';
                this.buttons[0].setText('保存');
                this.txtUserID.enable();

                this.frmPanel.add(this.txtPassword);
                this.frmPanel.add(this.txtComPassword);
            }
            else {
                this.title = '编辑用户';
                this.buttons[0].setText('保存');
                this.txtUserID.disable();
            }
        };
    },

    /**
       * purpose:保存事件
       */
    OnSave: function () {
        if (!Service.IsFunction(this.m_SaveHandler)) return;

        this.m_SaveHandler();
    },

    /**
       * purpose:保存
       */
    Save: function () {
        if (this.frmPanel.getForm().isValid()) {
            if (this.txtPassword.getValue() != this.txtComPassword.getValue()) {
                Service.ShowMessageBox('错误', '输入密码不一致！', Ext.MessageBox.OK, Ext.MessageBox.WARNING, null);
            }
            else {
            //182要求管理员设置用户密码时也应用密码复杂度
                passwordValue = this.txtPassword.getValue();
                if( this.m_EditType == UserManager.EditType.New && passwordValue != undefined)
                {
                    validate = ApplicationContext.IComplexityValidate();
                    message = validate.isPasswordValid(passwordValue);
                    if(message.length>0)
                    {
                        Service.ShowMessageBox('错误', message, Ext.MessageBox.OK, Ext.MessageBox.WARNING, null);
                        return;
                    }
                }
                
                this.OnSave();
            }
        }
    },

    /**
       * purpose:无效角色选择控件
       */
    DisableRole: function () {
        this.cbRole.disable();
    },

    /**
       * purpose: 获取用户ID
       */
    GetUserID: function () {
        return this.txtUserID.getValue();
    },

    SetUserID: function (userID) {
        this.txtUserID.setValue(userID);
    },

    /**
       * purpose:获取用户名称
       */
    GetUserName: function () {
        return this.txtUserName.getValue();
    },

    SetUserName: function (userName) {
        this.txtUserName.setValue(userName);
    },

    /**
       * purpose:获取角色ID
       */
    GetRoleID: function () {
        return this.cbRole.getValue();
    },

    SetRoleID: function (roleID) {
        this.cbRole.setValue(roleID);
    },

    /**
       * purpose:获取密级
       */
    GetSecurity: function () {
        return this.cbSecurity.value;
    },

    SetSecurity: function (security) {
        this.cbSecurity.setValue(security);
    },

    /**
       * purpose:获取密码
       */
    GetPassword: function () {
        return this.txtPassword.getValue();
    },

    SetPassword: function (password) {
        this.txtPassword.setValue(password);
    }
});

/**
 * purpose:用户管理控件
 * @class 
 * @constructor
 * @param {type} name1
 */
UserManager.UserManagerPanel = Ext.extend(Ext.Panel, {
    closable: true,
    id : "UserManagerPanel",
    border: false,
    layout: 'fit',
    title: '用户管理',

    /**
     * 用户信息表格
     * @GridPanel
     */
    m_UserInfoGrid: null,
    /**
     *当前用户信息
     * @UserInfo
     */
    m_UserInfo : null,

    m_Datastore: null,
    m_AddUserHanlder: null,
    m_ModifyUserHandler: null,
    m_ModifyPasswordHandler: null,
    m_UpdateUserRightHandler: null,
    m_UpdateUserDataRightHandler: null,
    m_RemoveUserHandler: null,
    m_UnlockUserHandler: null,
    
    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_AddUserHanlder = config.AddUserHandler;
            this.m_ModifyUserHandler = config.ModifyUserHandler;
            this.m_ModifyPasswordHandler = config.ModifyPasswordHandler;
            this.m_UpdateUserRightHandler = config.UpdateUserRightHandler
            this.m_UpdateUserDataRightHandler = config.UpdateUserDataRightHandler;
            this.m_RemoveUserHandler = config.RemoveUserHandler;
            this.m_UnlockUserHandler = config.UnlockUserHandler;
            
            this.m_UserInfo  = config.UserInfo;
        }

        this.Initialize();

        UserManager.UserManagerPanel.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        UserManager.UserManagerPanel.superclass.initComponent.call(this);

        var grid = this.CreateGrid(this.m_UserInfo);

        this.m_UserInfoGrid = grid;

        this.add(grid);
    },
    
    /**
    * purpose:创建表格列
    * @class UserManagerPanel
    * @userInfo {Object} 用户信息
    */
    CreateGrid: function (userInfo) {
        var column0 = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                rowSelect: function (sm, rowIndex, keep, rec) {
                    this.SetEditState(sm);
                },
                selectionchange: function (sm) 
                {
                    this.SetEditState(sm);
                }
            },
            
            /**
             * purpose:设置按钮状态
             */
            SetEditState : function(sm) 
            {
                 var btn = Ext.getCmp('tbar1');
                 if( btn == undefined )
                    return;
                    
                 if (sm.getCount() == 1) {
                     btn.enable();
                 }
                 else {
                     btn.disable();
                 }
            }
        });

        var column1 = {
            id: 'id',
            header: "登录名",
            width: 160,
            sortable: true,
            dataIndex: 'id'
        };
        var column2 = {
            header: "用户名",
            width: 75,
            sortable: true,
            renderer: 'userName',
            dataIndex: 'userName'
        };
        var column3 = {
            header: "角色",
            width: 75,
            sortable: true,
            renderer: 'userlevel',
            dataIndex: 'userlevel'
        };
        var column4 = {
            header: "涉密度",
            width: 75,
            sortable: true,
            renderer: 'userScurity',
            dataIndex: 'userScurity'
        };
        var column5 = {
            header: "",
            width: 75,
            hidden: true,
            renderer: 'RightId',
            dataIndex: 'RightId'
        };
        var column6 = {
            header: "",
            width: 75,
            hidden: true,
            renderer: 'DMindex',
            dataIndex: 'DMindex'
        };

        var columns = null;
        if (userInfo.IsAdministrator()) {
            columns = new Ext.grid.ColumnModel([column0, column1, column2, column3, column4, column5, column6, {
                header: "在线状态",
                width: 75,
                sortable: true,
                renderer: 'Online',
                dataIndex: 'Online'
            }]);
        }
        else {
            columns = new Ext.grid.ColumnModel([column0, column1, column2, column3, column4, column5, column6, {
                header: "",
                width: 75,
                hidden: true,
                renderer: 'Online',
                dataIndex: 'Online'
            }]);
        }

        var grid = new Ext.grid.EditorGridPanel({
            stripeRows: true,
            height: 3000,
            frame: true,
            sm: column0,
            store: this.m_Datastore,
            cm: columns,
            tbar: this.CreateToolBar(userInfo)
        });

        return grid;  
    },

    /**
    * purpose:创建工具条
    * @class UserManagerPanel
    * @userInfo {Object} 用户信息
    */
    CreateToolBar: function (userInfo) {
        if (userInfo == undefined) return;

        var newButton = {
            tooltip: '新增',
            icon: 'resources/images/16x16/Add.png',
            cls: 'x-btn-icon',
            scope: this,
            handler: function () {
                this.AddUser();
            }
        };

        var editButton = {
            id: 'tbar1',
            icon: 'resources/images/16x16/PageAdd.png',
            cls: 'x-btn-icon',
            tooltip: '编辑',
            scope: this,
            handler: function () {
                this.ModifyUser();
            }
        };

        var changePassword = {
            id: 'tbar2',
            icon: 'resources/images/16x16/AddComments.png',
            cls: 'x-btn-icon',
            tooltip: '修改密码',
            scope: this,
            handler: function () {
                this.ModifyPassword();
            }
        };

        var userRight = {
            id: 'tbar3',
            icon: 'resources/images/16x16/User.png',
            cls: 'x-btn-icon',
            tooltip: '为用户设置功能权限',
            scope: this,
            handler: function () {
                    this.UpdateUserRight();
            }
        };

        var userDataRight = {
            id: 'tbar4',
            icon: 'resources/images/16x16/DM.gif',
            cls: 'x-btn-icon',
            tooltip: '为用户设置数据权限',
            scope: this,
            handler: function () {
                    this.UpdateUserDMlist();
            }
        };

        var deleteButton = {
            tooltip: '删除',
            icon: 'resources/images/16x16/Delete.png',
            cls: 'x-btn-icon',
            scope: this,
            handler: function () {
                this.RemoveUser();
            }
        };

        var logout = {
            tooltip: '强制离线',
            icon: 'resources/images/16x16/Export.png',
            cls: 'x-btn-icon',
            scope: this,
            handler: function () {
                this.UnLockuser();
            }
        };

        var toolbar = null;
        if (userInfo.IsAdministrator()) {
            toolbar = [newButton, '-', editButton, '-', changePassword, '-', userRight, '-', userDataRight, '-', deleteButton, '-', logout];
        }
        else if (userInfo.IsSupperUser()) {
            toolbar = [newButton, '-', editButton, '-', changePassword, '-', userRight, '-', userDataRight, '-', deleteButton];
        }
        else {
            toolbar = [changePassword];
        }

        return toolbar;
    },

    /**
     * purpose:新增用户
     * @class UserManagerPanel
     */
    AddUser: function () {
        if (!Service.IsFunction(this.m_AddUserHanlder)) return;

        this.m_AddUserHanlder();
    },

    /**
     * purpose:修改用户
     * @class UserManagerPanel
     */
    ModifyUser: function () {
        if (!Service.IsFunction(this.m_ModifyUserHandler)) return;

        this.m_ModifyUserHandler();
    },

    /**
     * purpose:修改密码
     * @class UserManagerPanel
     */
    ModifyPassword: function () {
        if (!Service.IsFunction(this.m_ModifyPasswordHandler)) return;

        this.m_ModifyPasswordHandler();
    },

    /**
     * purpose:修改用户权限
     * @class UserManagerPanel
     */
    UpdateUserRight: function () {
        if (!Service.IsFunction(this.m_UpdateUserRightHandler)) return;

        this.m_UpdateUserRightHandler();
    },

    /**
     * purpose:
     * @class UserManagerPanel
     */
    UpdateUserDMlist: function () {
        if (!Service.IsFunction(this.m_UpdateUserDataRightHandler)) return;

        this.m_UpdateUserDataRightHandler();
    },
    /**
    * purpose 删除用户
    * @class UserManagerPanel
    */
    RemoveUser: function () {
        if (!Service.IsFunction(this.m_RemoveUserHandler)) return;

        this.m_RemoveUserHandler();
    },

    /**
     * purpose:
     * @class UserManagerPanel
     */
    UnLockuser: function () {
        if (!Service.IsFunction(this.m_UnlockUserHandler)) return;

        this.m_UnlockUserHandler();
    },

    /**
     * purpose:初始化控件
     * @class UserManagerPanel
     */
    Initialize: function () {
        this.m_Datastore = new Ext.data.SimpleStore({
            fields: [{
                name: 'id',
                type: 'string'
            },
            {
                name: 'userName',
                type: 'string'
            },
            {
                name: 'userlevel',
                type: 'string'
            },
            {
                name: 'userScurity',
                type: 'string'
            },
            {
                name: 'RightId',
                type: 'string'
            },
            {
                name: 'DMindex',
                type: 'string'
            },
            {
                name: 'Online',
                type: 'string'
            }]
        });

        this.ResetBinding();
    },

    /**
     * purpose:重新绑定数据
     * @class UserManagerPanel
     */
    ResetBinding: function () {
        if (this.m_Datastore == undefined || this.m_Datastore == null) return;

        this.m_Datastore.loadData(GetUserInfos());
    },

    /**
     * purpose:获取当前选择的记录
     * @class UserManagerPanel
     */
    GetSelectedRecord: function () {
        return this.m_UserInfoGrid.getSelectionModel().getSelected();
    },

    /**
     * purpose:获取选择行
     * @class 
     */
    GetSelections: function () {
        return this.m_UserInfoGrid.getSelections();
    }

});