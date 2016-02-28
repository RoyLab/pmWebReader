/************************************************************************
*功能描述：登陆管理类
*作者：wanghai
*日期：2009-12-01      
*修改：
*2010-01-13   hyb  重构LoginRils.js文件
************************************************************************/

//定义名称空间
Service.RegNameSpace('window.UserManager');

InitLoginRilsPageScript();

/**
 * purpose:初始化脚本文件
 */
function InitLoginRilsPageScript() {
    Ext.QuickTips.init();

    Ext.onReady(
    OnLoginScriptFileLoaded);
};

/**
 * purpose:脚本文件加载完成处理方法
 */
function OnLoginScriptFileLoaded() {
    Logon();

    function Logon() {
        IsOpen = true;
        var result;
        var uId = GetParameterValue("userName");

        if (uId == '') uId = 'admin';

        Service.WebService.Call('UserLogonRils', {
            userid: uId
        },
        function (result) {
            callback(result);
        },
        function (XmlHttpRequest, textStatus, errorThrow) {
            callback(textStatus);
        });

    };

    function callback(result) {
        if (result.text == '') {
            IsOpen = false;;
        }
        else { if (result.text.indexOf('{Authorization') != -1) {
                eval("au=" + result.text);
                if (au != undefined && au.Authorization != undefined) {
                    Service.ShowMessageBox('错误', au.Authorization, Ext.MessageBox.OK, Ext.MessageBox.ERROR, windowClose);
                }
            }
            else {
                UserManager.Cookies.SetCookiesName(result.text);
                goMainPage();
            }
        }
    };

    function windowClose() {
        UserManager.Cookies.SetCookiesName('');
        window.location.href = 'login.html';
    }

    function goMainPage() {
        blogged = window.open('index.html?manual=' + Applic.Text, '_blank', 'top=0,left=0,scrolbars=no,toolbar=no,lacation=no,status=no,menubar=no,resizable=yes', false);
        if (blogged) {
            blogged.resizeTo(window.screen.availWidth, window.screen.availHeight);

            window.open('', '_parent', '');
            window.opener = null;
            window.close();
        }
        else {
            location = 'index.html';
        }
        return false;

    }

    /**
     * purpose:根据参数名称获取参数值
     *         参数集合存储结构:?parameter1=value1&parameter2=value2&.....
     * @class 
     * @constructor
     * @parameterName {String} 参数名称
     */
    function GetParameterValue(parameterName) {
        return UserManager.GetKeyValue(document.location.search, '&', '=', parameterName);
    }

};