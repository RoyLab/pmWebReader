/************************************************************************
*功能描述：用户配置管理类
*作者：wanghai
*日期：2009-7-16     
*修改：
*2010-01-15   hyb  重构UserProfile.js文件
************************************************************************/

Service.RegNameSpace("window.UserManager");

/**
 * purpose:用户配置管理
 * @class UserProfileEventHandler
 */
System.UserProfileEventHandler = function (item) {

    var profileWindow = new System.ProfileWindow({
        SaveProfileHandler: SaveProfile
    });

    profileWindow.show();

    function SaveProfile() {

        var graphicShow = "GraphicAutoShow," + profileWindow.GetAutoShowGraphic();
        var treeShow = "TreeAutoLocate," + profileWindow.GetAutoLocateTree();

        Service.WebService.Call('UserProFile', {
            userName: ApplicationContext.UserInfo.ID,
            ProFile: graphicShow + ";" + treeShow
        },
        function (result) {
            SaveProfileCallBack(result);
        },
        function (XmlHttpRequest, textStatus, errorThrow) {
            SaveProfileCallBack(textStatus);
        });
    };

    function SaveProfileCallBack(result) {
        userInfo = ApplicationContext.IUserInfo();
        
        if (result.text == 'true') {
            if (profileWindow.GetAutoShowGraphic() == true) 
            {
                 userInfo.GraphicAutoShow = true;
            }
            else 
            {
                if (top.ifmMultimediaViewer!=undefined && top.ifmMultimediaViewer.multiframe!=undefined) 
                userInfo.GraphicAutoShow = false;
            }

            if (profileWindow.GetAutoLocateTree() == true) userInfo.TreeAutoLocate = true;
            else userInfo.TreeAutoLocate = false; 
        }
        
        profileWindow.close();
    };
};

/**
 * purpose:用户设置窗体
 * @class ProfileWindow
 */
System.ProfileWindow = Ext.extend(Ext.Window, {
    title: '用户配置管理',
    width: 280,
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
    keys: [{
        key: Ext.EventObject.ENTER,
        fn: this.SaveProfile,
        scope: this
    }],

    cbAutoShowGrpahic: null,
    cbAutoLocateTree: null,

    m_SaveProfileHandler: null,

    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_SaveProfileHandler = config.SaveProfileHandler;
        }

        System.ProfileWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {
        var userId = new Ext.form.TextField({
            fieldLabel: '帐号',
            width: 180,
            allowBlank: false,
            blankText: '帐号不允许为空'
        });

        var graphicAutoShow = new Ext.form.Checkbox({
            layout: 'fit',
            fieldLabel: '自动加载图片',
            boxLabel: '',
            name: 'applic'
        });
        this.cbAutoShowGrpahic = graphicAutoShow;

        var treeAutoLocate = new Ext.form.Checkbox({
            layout: 'fit',
            fieldLabel: '自动定位树节点',
            boxLabel: '',
            name: 'applic'
        });
        this.cbAutoLocateTree = treeAutoLocate;

        var formPanel = new Ext.form.FormPanel({
            bodyStyle: 'padding-top:20px; background:transparent;',
            labelAlign: 'right',
            labelPad: 0,
            frame: false,
            defaults: {
                selectOnFocus: true,
                invalidClass: null,
                msgTarget: 'side'
            },
            items: [graphicAutoShow, treeAutoLocate]
        });

        var saveButton = new Ext.Button({
            text: '设置',
            scope: this,
            handler: function () {
                if (formPanel.getForm().isValid()) {
                    this.SaveProfile();
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

        this.addListener("show", this.Initialize, this);
    },

    Initialize: function () {
        userInfo = ApplicationContext.IUserInfo();

        if (userInfo.GraphicAutoShow == true) {
            this.cbAutoShowGrpahic.setValue(true);
        }
        else {
            this.cbAutoShowGrpahic.setValue(false);
        }

        if (userInfo.TreeAutoLocate == true) {
            this.cbAutoLocateTree.setValue(true);
        }
        else {
            this.cbAutoLocateTree.setValue(false);
        }
    },

    SaveProfile: function () {
        if (!Service.IsFunction(this.m_SaveProfileHandler)) return;

        this.m_SaveProfileHandler();
    },

    /**
     * purpose:是否自动显示图像
     * @Return {Boolean} 
     */
    GetAutoShowGraphic: function () {
        return this.cbAutoShowGrpahic.getValue();
    },

    /**
     * purpose:是否自动定位树
     * @Return {Boolean}
     */
    GetAutoLocateTree: function () {
        return this.cbAutoLocateTree.getValue();
    }

});