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
                jsonData = selectedIDs.join(',');

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
                Service.ShowMessageBox('错误', '该角色已经被使用，不允许删除！', Ext.MessageBox.OK, Ext.MessageBox.WARNING);
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
