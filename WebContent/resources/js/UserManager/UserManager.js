/************************************************************************
*功能描述：用户管理
*作者：wanghai
*日期：2009-03-12      
*修改：
*2010-01-11   hyb  重构
************************************************************************/

//TODO : 该文件需要进一步完善

//定义名称空间
Service.RegNameSpace('window.UserManager');

/**
 * purpose:获取当前用户所能看到的用户
 * @class 
 * @return {Array} 用户列表
 */
function GetUserInfos() {
    var userInfo = ApplicationContext.IUserInfo();
    return UserManager.UserHelper.GetAllUserInfo(userInfo);
};

/**
 * purpose:创建用户管理Panel
 * @class 
 */
UserManager.CreateUserManagerPanel = function() {

    var userManagerPanel = new UserManager.UserManagerPanel({
        AddUserHandler: AddUser,
        ModifyUserHandler: ModifyUser,
        ModifyPasswordHandler: ModifyPassword,
        UpdateUserRightHandler: UpdateUserRight,
        UpdateUserDataRightHandler: UpdateUserDataRight,
        RemoveUserHandler: RemoveUser,
        UnlockUserHandler: LogoutUser,
        UserInfo : ApplicationContext.IUserInfo()
    });

    return userManagerPanel;

    /**
     * purpose:更新数据权限
     * @userid {String} 用户ID
     * @UserDMIds {String} 用户DMID列表
     * @RoleDMIds {String} 角色DMID列表
     */
    function UpdateUserDataRight(userDMIds, roleDMIds)//为用户设置数据权限
    {
        var record = this.GetSelectedRecord();
        if (!record) {
            Service.ShowMessageBox('错误', '请先选择要编辑的用户！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            return;
        }

        var m = this.GetSelections();
        var userid = m[0].get('id');
        var dmindex = m[0].get('DMindex');       
        var index = dmindex.indexOf(';');
        
        var userDMIds = dmindex.substring(0, index).split(',');
        var roleDMIds = dmindex.substring(index + 1).split(',');
        
                
        if (UserManager.IsAdministrator(userid)) {
            Service.ShowMessageBox('提示', '不能更改系统内置用户admin的数据权限！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
            return;
        }

        dataRightEditWindow = new UserManager.DataRightEditWindow({
            UpdateUserDataRightHandler: UpdateDataRight,
            UserDMIDs: userDMIds,
            RoleDMIDs: roleDMIds
        });

        dataRightEditWindow.show();

        /**
            * purpose:更新数据权限
            */
        function UpdateDataRight() {
            var record = dataRightEditWindow.GetSelectedDMIDs();
            var arr = new Array();
            if (userid != undefined && userid != '') {
                jsonData = record.join(',');

                Service.WebService.Call('UserDMlistUpdate', {
                    userid: userid,
                    DMindex: jsonData
                },
                function (result) {
                    UpdateDataRightCallback(result);
                },
                function (XmlHttpRequest, textStatus, errorThrow) {
                    UpdateDataRightCallback(XmlHttpRequest);
                });
            }
            else {
                Service.ShowMessageBox('错误', '请先选择要新增的用户！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }
        };

        function UpdateDataRightCallback(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败!', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text != "true") {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            dataRightEditWindow.close();

            userManagerPanel.ResetBinding();
        };

    }

    /**
    * purpose:编辑用户功能权限
    * @class 
    */
    function UpdateUserRight( ) {
    
        var record = userManagerPanel.GetSelectedRecord();
        if (!record) {
            Service.ShowMessageBox('错误', '请先选择要编辑的用户！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            return;
        }

        var m = userManagerPanel.GetSelections();
        var userid = m[0].get('id');
        var rightId = m[0].get('RightId');
        var index = rightId.indexOf(';');
        
        var userRightIDs = rightId.substring(0, index).split(',');
        var roleRightIDs = rightId.substring(index + 1).split(',');


        if (UserManager.IsAdministrator(userid)) {
            Service.ShowMessageBox('提示', '不能更改系统内置用户admin的功能权限！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
            return;
        }

        var userRightEditWindow = new UserManager.UserRightEditWindow({
            UpdateRightHandler: UpdateRight,
            RolesData: GetRoleInfos(),
            RoleDescriptInfos: GetRoleRightDescriptInfo(roleRightIDs),
            listeners: {
                show: function () {
                    Initialize(userRightEditWindow);
                }
            }
        });

        userRightEditWindow.show();
        /**
        * purpose:获取
        * @class UpdateUserRight
        */
        function GetRoleInfos() {
            return UserManager.RoleHelper.GetAllRoleRightInfo();
        };

        /**
        * purpose:获取角色权限描述信息
        * @class UpdateUserRight
        */
        function GetRoleRightDescriptInfo(roleIDArray) {
            var myArray = new Array();

            var roleInfos = GetRoleInfos();
            var index = 0;

            for (var i = 0; i < roleInfos.length; i++) {
                var rid = roleInfos[i][0];
                for (var j = 0; j < roleIDArray.length; j++) {
                    if (rid == roleIDArray[j]) {
                        myArray[index] = roleInfos[i];
                        index++;

                        break;
                    }
                }
            }

            return myArray;
        };

        /**
        * purpose:更新用户权限
        * @class UpdateUserRight
        */
        function UpdateRight() {
            var record = userRightEditWindow.GetSelectedRoleRecord();
            if (!record) return;

            var m = userRightEditWindow.GetSelectedRoles();
            var jsonData = "";

            for (var i = 0, len = m.length; i < len; i++) {
                var ss = m[i].get('id');
                if (i == 0) {
                    jsonData = jsonData + ss;
                }
                else {
                    jsonData = jsonData + ',' + ss;
                }
            }

            Service.WebService.Call('UserRightUpdate', {
                userid: userid,
                RightId: jsonData
            },
            function (result) {
                UpdateRightCallback(result);
            },
            null);

        };

        function UpdateRightCallback(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败!', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text != "true") {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else {
                userRightEditWindow.close();
                userManagerPanel.ResetBinding();
            }
        };

        /**
         * purpose:初始化窗体，设置选择角色
         * @class UpdateUserRight
         */
        function Initialize(editWindow) {
            var roleIDArrary = new Array();

            var i = 0;
            for (; i < userRightIDs.length; i++) {
                roleIDArrary[i] = userRightIDs[i];
            }

            roleIDArrary[i] = UserManager.GetReaderRoleID();

            editWindow.SelectRole(roleIDArrary);
        }

    }

    /**
     * purpose:删除用户
     * @class 
     */
    function RemoveUser() {
        var record = userManagerPanel.GetSelectedRecord();
        if (!record) {
            Service.ShowMessageBox('错误', '请先选择要删除的用户！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            return;
        }

        var m = userManagerPanel.GetSelections();
        if (m.length == 1) {
            if (UserManager.IsAdministrator(m[0].get('id'))) {
                Service.ShowMessageBox('提示', '不能删除系统内置用户admin！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
                return;
            }
        }

        Service.ShowMessageBox('确认', '您确认要删除用户吗？', Ext.MessageBox.YESNO, Ext.MessageBox.QUESTION, function (btn) {
            if (btn == 'yes') {
                DeleteSelectedUsers();
            }
        });

        /**
          * purpose:删除选择的用户
          * @class RemoveUser
          */
        function DeleteSelectedUsers() {
        
            for (var i = 0, len = m.length; i < len; i++) {
                var ss = m[i].get('id');
                if (UserManager.IsAdministrator(ss)) {
                    continue;
                }

                DeleteUserInfo(ss);
            }

            userManagerPanel.ResetBinding();
        }

        function DeleteUserInfo(userId) {
            Service.WebService.Call('UserDel', {
                userid: userId
            },
            function (result) {
                DeleteUserInfoCallBack(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                alert(XmlHttpRequest.responseText);
            });
        };

        function DeleteUserInfoCallBack(result) {
            if (result.text == 'false') {
                Service.ShowMessageBox('错误', '删除失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }
            else {}
        };
    };

    /**
     * purpose:强制离线用户
     * @class 
     */
    function LogoutUser() {
        var logoutUserWindow = null;

        var record = userManagerPanel.GetSelectedRecord();
        if (!record) {
            Service.ShowMessageBox('错误', '请先选择要强制离线的用户！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        else {
            var m = userManagerPanel.GetSelections();
            var userID = m[0].get('id');

            logoutUserWindow = new UserManager.LogoutUserWindow({
                LogoutUserHandler: Logout
            });
            logoutUserWindow.SetUserID(userID);

            logoutUserWindow.show();
        }

        function Logout() {
            var result;
            var m = userManagerPanel.GetSelections();
            var uid = m[0].get('id');

            Service.WebService.Call('SetUserOnline', {
                userid: uid
            },
            function (result) {
                LogoutUserCallBack(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                LogoutUserCallBack(XmlHttpRequest);
            });
        };

        function LogoutUserCallBack(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('信息', '强制离线成功！', Ext.MessageBox.OK, Ext.MessageBox.INFO, null);
                logoutUserWindow.close();
                userManagerPanel.ResetBinding();

            }
            else if (result.text == "true") {
                Service.ShowMessageBox('信息', '强制离线成功！', Ext.MessageBox.OK, Ext.MessageBox.INFO, null);
                logoutUserWindow.close();
                userManagerPanel.ResetBinding();
            }
            else {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
        };
    };

    /**
     * purpose:修改密码
     * @class 
     */
    function ModifyPassword() {

        var record = userManagerPanel.GetSelectedRecord();

        var newpasswordWindow = null;

        if (!record) {
            Service.ShowMessageBox('错误', '请先选择要修改的用户！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        else {
            var newpasswordWindow = new UserManager.PasswordEditWindow({
                UpdatePasswordHandler: UpdatePassword
            });

            newpasswordWindow.show();
        }

        /**
         * purpose:更新密码业务方法
         * @class 
         */
        function UpdatePassword() {
            var result;
            var m = userManagerPanel.GetSelections();
            var uid = m[0].get('id');

            upassword = newpasswordWindow.GetPasswordValue();
            unewpassword = newpasswordWindow.GetNewPasswordValue();
            uconfirmpassword = newpasswordWindow.GetConfirmPasswordValue();

            Service.WebService.Call('UserUpdatePassword', {
                userid: uid,
                password: upassword,
                newpassword: unewpassword,
                confirmpassword: uconfirmpassword
            },
            function (result) {
                UpdatePasswordCallback(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                UpdatePasswordCallback(XmlHttpRequest);
            })

        };

        function UpdatePasswordCallback(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text == "true") {
                Service.ShowMessageBox('信息', '密码修改成功！', Ext.MessageBox.OK, Ext.MessageBox.INFO, null);

                newpasswordWindow.close();

            }
            else {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }

        };
    };
    //end modifypassWord

    /**
    * purpose: 修改用户
    */
    function ModifyUser() {
        var userEditWindow = null;

        var _record = userManagerPanel.GetSelectedRecord();

        if (!_record) {
            Service.ShowMessageBox('错误', '请先选择要编辑的用户！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        else {
            userEditWindow = new UserManager.UserEditWindow({
                SaveHandler: UpdateUser,
                EditType: UserManager.EditType.Edit
            });

            var m = userManagerPanel.GetSelections();
            userEditWindow.SetUserID(m[0].get('id'));
            userEditWindow.SetSecurity(getSelectValueFromText(m[0].get('userScurity'), Scurity.Class));
            userEditWindow.SetUserName(m[0].get('userName'));
            userEditWindow.SetRoleID(getSelectValueFromText(m[0].get('userlevel'), UserManager.RoleHelper.GetAllRoleInfo()));

            if (m[0].get('id') == "admin") {
                userEditWindow.DisableRole();
            }

            userEditWindow.show();
        }

        function UpdateUser() {
            var result;
            var m = userManagerPanel.GetSelections();
            var uid = m[0].get('id');

            var newuid = userEditWindow.GetUserID();
            var uName = userEditWindow.GetUserName();
            var roleId = userEditWindow.GetRoleID();
            var scurity = userEditWindow.GetSecurity();

            if (scurity == undefined) {
                if (window.confirm("如果不设置密级可能导致全部的DM都无法浏览！") == false) {
                    return;
                }
                else {
                    scurity = '0';
                }
            }

            Service.WebService.Call('UserUpdate', {
                userid: uid,
                newuid: newuid,
                username: uName,
                userRole: roleId,
                userscurity: scurity
            },
            function (result) {
                UpdateCallback(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                UpdateCallback(XmlHttpRequest);
            });
        };

        function UpdateCallback(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text == "true") {
                userManagerPanel.ResetBinding();
                userEditWindow.close();
            }
            else {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
        };

        function getSelectValueFromText(text, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][1] == text) {
                    return arr[i][0];
                }
            }
        };

    };

    /**
     * purpose:新增用户
     */
    function AddUser() {
        var userEditWindow = new UserManager.UserEditWindow({
            SaveHandler: SaveUser,
            EditType: UserManager.EditType.New
        });

        userEditWindow.show();

        function SaveUser() {
            var result;

            var uId = userEditWindow.GetUserID();
            var uName = userEditWindow.GetUserName();
            var passwd = userEditWindow.GetPassword();
            var scurity = userEditWindow.GetSecurity();
            var roleId = userEditWindow.GetRoleID();

            if (scurity == undefined) {
                if (window.confirm("如果不设置密级可能导致全部的DM都无法浏览！") == false) {
                    return;
                }
                else {
                    scurity = '0';
                }
            }

            Service.WebService.Call('UserAdd', {
                userid: uId,
                username: uName,
                userpass: passwd,
                userRole: roleId,
                userscurity: scurity
            },
            function (result) {
                AddUserCallback(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                AddUserCallback(XmlHttpRequest);
            });

        };

        function AddUserCallback(result) {
            if (result.text == "false") {
                Service.ShowMessageBox('错误', '保存失败!', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
            else if (result.text == "true") {
                userManagerPanel.ResetBinding();
                userEditWindow.close();
            }
            else {
                Service.ShowMessageBox('错误', result.text, Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
        };
    };

};

