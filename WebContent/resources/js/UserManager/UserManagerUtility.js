
/************************************************************************
*功能描述：用户管理辅助功能
*作者：hyb
*日期：2010-01-19      
*修改：
*
************************************************************************/
Service.RegNameSpace('window.UserManager');

UserManager.USERCONST =
{
   ADMINISTRATOR : 'admin' 
};

UserManager.ROLECONST = 
{
    ADMINISTRATOR : '1',
    READER : '3'
};

/**
 * purpose:窗体编辑类型
 */
UserManager.EditType = {
    New: 1,
    Edit: 2
};

/**
 * purpose:用户是否为管理员
 * @class 
 */
UserManager.IsAdministrator = function (admin) 
{
    if( admin == UserManager.USERCONST.ADMINISTRATOR)
    {
         return true;
    }
    else
    {
        return false;
    }
};

/**
 * purpose:判断指定ID是为阅读者ID
 * @class 
 */
UserManager.IsReaderRoleID = function (roleID) 
{
    if( roleID == UserManager.ROLECONST.READER )
    {
        return true;
    }
    else
    {
        return false;
    }  
};

/**
 * purpose:获取阅读者角色ID
 * @class 
 */
UserManager.GetReaderRoleID = function () 
{
    return UserManager.ROLECONST.READER;
};

/**
 * purpose:从字符串中根据指定键提取对应的值。
 * @keyValueString {String} 格式如下:manual=undefined&user=1&right=
 * @spliterChar {String} 键值对键的分隔符，如&
 * @spliterChar {keyValueSpliterChar} 键和值的分隔符，如=
 * @spliterChar {keyName} 键名称，如manul,user
 * @Return {String} 键对应的值，如undefined
 */
UserManager.GetKeyValue = function(keyValueString,spliterChar,keyValueSpliterChar,keyName)
{
       var parameterSet = keyValueString;
       
       //wanghai 去掉最前面的问号。
       var index=parameterSet.indexOf('?');
       if(index==0)
            parameterSet=parameterSet.substring(1);
       
       if( parameterSet == "")
            return "";
       
       var parameterPairs = parameterSet.split(spliterChar);
       for(i=0;i<parameterPairs.length;i++)
       {
            var pair = parameterPairs[i].split(keyValueSpliterChar);
            if( keyName == unescape(pair[0]))
            {
                if(window.decodeURIComponent)
                    return decodeURIComponent(pair[1]);
                else 
                    return unescape(pair[1]);
            }
       }
       return "";
}

/**
 * purpose:用户管理相关公共方法
 */
UserManager.UserHelper = {
    
    /**
     * purpose:
     * @class 
     * @constructor
     * @param {type} name1
     */
    GetAllUserInfo : function (userInfo) {
    
        var myArray = new Array();
        var userScurity;
        var useScurity = false;
        var result;
        if (userInfo.IsSupperUser()) {
            Service.WebService.Call('UserInfoList', null, UserInfoCallBack, null);
        }
        else {
            var itemArray = new Array();
            itemArray[0] = userInfo.UserId;
            itemArray[1] = userInfo.UserName;
            itemArray[2] = userInfo.UserRole;
            userScurity = userInfo.UserScurity;
            for (var j = 0; Scurity.Class[j] != undefined; j++) {
                if (Scurity.Class[j][0] == userScurity) {
                    itemArray[3] = Scurity.Class[j][1];
                    userScurity = false;
                    break;
                }
            }

            if (userScurity) {
                itemArray[3] = userScurity;
                useScurity = true;
            }
            itemArray[4] = userInfo.UserRightId;
            itemArray[5] = userInfo.GetUserDMindex();
            itemArray[6] = '1';
            myArray[0] = itemArray;
        }

        return myArray;

        /**
         * purpose:
         * @GetAllUserInfo
         * @result {Objecy} WebService回调返回值
         */
        function UserInfoCallBack(result) {
            var nodes = Ext.DomQuery.select("/JsonUserInfo", result.documentElement);
            for (var i = 0; i < nodes.length; i++) {
                var itemArray = new Array();
                itemArray[0] = Ext.DomQuery.selectNode("/id", nodes[i]).text;
                itemArray[1] = Ext.DomQuery.selectNode("/userName", nodes[i]).text;
                itemArray[2] = Ext.DomQuery.selectNode("/userlevel", nodes[i]).text;

                userScurity = Ext.DomQuery.selectNode("/userScurity", nodes[i]).text;
                for (var j = 0; Scurity.Class[j] != undefined; j++) {
                    if (Scurity.Class[j][0] == userScurity) {
                        itemArray[3] = Scurity.Class[j][1];
                        userScurity = false;
                        break;
                    }
                }

                if (userScurity) {
                    itemArray[3] = userScurity;
                    useScurity = true;
                }
                itemArray[4] = Ext.DomQuery.selectNode("/RightId", nodes[i]).text;
                itemArray[5] = Ext.DomQuery.selectNode("/DMindex", nodes[i]).text;

                if (Ext.DomQuery.selectNode("/Online", nodes[i]).text == '0') {
                    itemArray[6] = '离线';
                }
                else {
                    itemArray[6] = '在线';
                }
                myArray[i] = itemArray;
            }
        }
    }
}

/**
 * purpose:获取所有角色信息
 * @class 
 * @Retruen {Array} 角色信息列表
 */
UserManager.RoleHelper = {
    
    /**
     * purpose:
     * @class 
     * @constructor
     * @param {Array} 角色信息集合
     */
    GetAllRoleInfo : function () {
        var myArray = new Array();

        Service.WebService.Call('RoleInfoList', null, RoleListCallBack, null);

        return myArray;

        /**
         * purpose: 构造角色信息
         * @class GetAllRoleInfo
         */
        function RoleListCallBack(result) {
            var nodes = Ext.DomQuery.select("/JsonRoleInfo", result.documentElement);

            var ItemArray = new Array();
            ItemArray[0] = '';
            ItemArray[1] = '无';
            myArray[0] = ItemArray;

            for (var i = 0; i < nodes.length; i++) {
                var ItemArray = new Array();
                ItemArray[0] = Ext.DomQuery.selectNode("/id", nodes[i]).text;
                ItemArray[1] = Ext.DomQuery.selectNode("/RoleName", nodes[i]).text;

                myArray[i + 1] = ItemArray;
            }
        }
    },
    
    /**
     * purpose:获取角色权限信息
     * @class 
     * @Retruen {Array} 角色信息列表,比GetAllRoleInfo多了角色脚本列.
     */
    GetAllRoleRightInfo : function ()  {
        var myArray = new Array();
        Service.WebService.Call('RightInfoList', null, function (result) {
            var nodes = Ext.DomQuery.select("/JsonRightInfo", result.documentElement);
            for (var i = 0; i < nodes.length; i++) {
                var ItemArray = new Array();
                ItemArray[0] = Ext.DomQuery.selectNode("/id", nodes[i]).text;
                ItemArray[1] = Ext.DomQuery.selectNode("/RightName", nodes[i]).text;
                ItemArray[2] = Ext.DomQuery.selectNode("/RightScript", nodes[i]).text;
                myArray[i] = ItemArray;
            }
        },
        null);

        return myArray;
    },
    
    /**
     * purpose:获取角色信息，包括权限信息
     * @class 
     * @constructor
     * @param {Array} 角色角色信息数组
     */
    GetAllRoleInfoEx : function () 
    {
        var myArray = new Array();
        Service.WebService.Call('RoleInfoList', null, function (result) {

                var nodes=Ext.DomQuery.select("/JsonRoleInfo",result.documentElement);
                for(var i = 0; i < nodes.length; i++)
                {
                        var ItemArray=new Array();
                        ItemArray[0]=Ext.DomQuery.selectNode("/id",nodes[i]).text;
                        ItemArray[1]=Ext.DomQuery.selectNode("/RoleName",nodes[i]).text;
                        if(Ext.DomQuery.selectNode("/RoleScript",nodes[i])==undefined)
                            ItemArray[2]='';
                        else
                            ItemArray[2]=Ext.DomQuery.selectNode("/RoleScript",nodes[i]).text;
                            
                        ItemArray[3]=Ext.DomQuery.selectNode("/RightId",nodes[i]).text;
                        ItemArray[4]=Ext.DomQuery.selectNode("/DMindex",nodes[i]).text;
                        myArray[i]=ItemArray;
                 }
        },
        null);

        return myArray;
    }
};
