/************************************************************************/
/*功能描述：公用服务类型与方法
/*作者：huangyanbing
/*日期：2009-12-22
/************************************************************************/

//
//定义命名空间
//
(function () {
    if (!window.Service) window.Service = {};
})();

/**
 * purpose:注册命名空间
 * @nSpace {String} 命名空间，如window.Service
 */
Service.RegNameSpace = function (nSpace) {
    var objArray = nSpace.split('.');

    var currentObjNameSpace = '';
    for (var i = 0; i < objArray.length; i++) {
        currentObjNameSpace = currentObjNameSpace + objArray[i];

        RegSimpleNameSpace(currentObjNameSpace);

        currentObjNameSpace += '.';
    }

    function RegSimpleNameSpace(nameSpace) {
        var code = '(function(){';
        code += 'if(!' + nameSpace + ')';
        code += nameSpace + '={}';
        code += '})();'
        eval(code)
    }

}

/**
 * purpose: 显示一个消息框
 * @class
 * @constructor
 * @title {String} 标题
 * @message {String} 消息内容
 * @button {Enum} 按钮
 * @icon {Enum} 错误类型
 * @callBack {Function} 回调函数
 */
Service.ShowMessageBox = function (title, message, button, icon, callBack) {
    Service.ShowMessageBoxEx(title, message, button, icon, callBack, null);
};

/**
 * purpose: 显示一个消息框
 * @class
 * @constructor
 * @title {String} 标题
 * @message {String} 消息内容
 * @button {Enum} 按钮
 * @icon {Enum} 错误类型
 * @callBack {Function} 回调函数
 * @callBackParameter {Object} 回调函数参数
 */
Service.ShowMessageBoxEx = function (title, message, button, icon, callBack, callBackParameter) {

    /**
     * purpose:辅助回调函数
     * @class
     * @constructor
     * @buttonID {String} 按钮ID
     * @text {String} 按钮文本
     */
    this.CallBack = function (buttonID, text) {
        if (callBack == undefined || callBack == null) return;

        callBack(buttonID, text, callBackParameter);
    };

    Ext.MessageBox.buttonText.ok = '确定';
    Ext.MessageBox.buttonText.yes = '是';
    Ext.MessageBox.buttonText.no = '否';
    Ext.MessageBox.buttonText.cancel = '取消';

    Ext.MessageBox.show({
        title: title,
        msg: message,
        buttons: button,
        fn: this.CallBack,
        icon: icon
    });
};

/**
 * purpose:判断参数是否是函数类型
 * @class Service
 * @handler {Function}
 */
Service.IsFunction = function (handler) {
    if (handler == undefined || handler == null || typeof handler != 'function') {
        return false;
    }

    return true;
};

/**
 * purpose:WebService管理类
 * @class
 * @constructor
 * @param {String} Web服务地址
 */
Service.WebServiceManager = function (connectionString) {

    /**
    * 定义常量
    * @type
    */
    this.CONST = {

        /**
          * 异步调用
          * @type Boolean
          */
        ASYNC: false,
        /**
          * 过期时间
          * @type Integer
          */
        TIMEOUT: 2000,

        /**
          * 调用类型
          * @type String
          */
        TYPE: "post"
    };

    /**
     * Web服务地址字符串
     * @type String
     */
    this.ConnectionString = connectionString;

    /**
     * purpose:
     * @class
     * @constructor
     * @serviceName {String} 服务名称
     * @data {Object}  异步调用的数据
     * @succCallBack {Function}  成功时的回调
     * @errorCallBack {Function}  失败时的回调
     */
    this.Call = function (serviceName, data, succCallBack, errorCallBack) {

        $.ajax({
            async: this.CONST.ASYNC,
            url: this.ConnectionString + serviceName,
            data: data,
            type: this.CONST.TYPE,
            timeout: this.CONST.TIMEOUT,
            success: function (result) {
                if (succCallBack == undefined || succCallBack == null) return;
                succCallBack(result);
            },
            error: function (XmlHttpRequest, textStatus, errorThrow) {
                if (errorCallBack == undefined || errorCallBack == null) return;
                errorCallBack(XmlHttpRequest, textStatus, errorThrow);
            }
        });
    };

    /**
    * purpose:
    * @class
    * @constructor
    * @serviceName {String}  服务名称
    * @async {Boolean}  是否异步调用
    * @type {String}  调用类型Post,Get...
    * @timeout {Integer}  过期时间
    * @data {Object}  传送数据
    * @succCallBack {Function}  成功时回调
    * @errorCallBack {Function}  失败时回调
    */
    this.CallService = function (serviceName, async, type, timeout, data, succCallBack, errorCallBack) {

        $.ajax({
            async: async,
            url: this.ConnectionString + serviceName,
            data: data,
            type: type,
            timeout: timeout,
            success: function (result) {
                if (succCallBack == undefined || succCallBack == null) return;
                succCallBack(result);
            },
            error: function (XmlHttpRequest, textStatus, errorThrow) {
                if (errorCallBack == undefined || errorCallBack == null) return;
                errorCallBack(XmlHttpRequest, textStatus, errorThrow);
            }
        });
    },

    /**
    * purpose:
    * @class
    * @constructor
    * @serviceName {String}  服务名称
    * @data {Object}  传送数据
    * @return {Object}  成功时返回结果,失败返回null
    */
    this.Post = function (serviceName, data, isAsync) {
        var retresult = null;
        var pAsync = false;
        if (isAsync != undefined) pAsync = isAsync;

        $.ajax({
            async: pAsync,
            url: this.ConnectionString + serviceName,
            data: data,
            type: 'post',
            timeout: this.CONST.TIMEOUT,
            success: function (result) {
                retresult = result;
            },
            error: function (XmlHttpRequest, textStatus, errorThrow) {
                retresult = null;
            }
        });

        return retresult;
    }

    /**
    * purpose:
    * @class
    * @constructor
    * @serviceName {String}  服务名称
    * @data {Object}  传送数据
    * @return {Object}  成功时返回结果,失败返回null
    */
    this.PostJSonObject = function(serviceName,data)
    {
        if(data == null || typeof data == 'undefined')
            data = '{}';

        var retresult = null;
        var pAsync = false;

        $.ajax({
            async: pAsync,
            url: this.ConnectionString + serviceName,
            data: data,
            type: 'post',
            //dataType:'json',
            //contentType: "application/json;chartset=utf-8",
            timeout: this.CONST.TIMEOUT,
            success: function (result) {
                try{
                    retresult = eval('(' + result.text + ')');
                }
                catch(e){
                    retresult = null;
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrow) {
                retresult = null;
            }
        });

        return retresult;
    }
};

/**
* purpose:  判断网页是否存在
* @param url
* @return bool
*/
Service.UrlExists = function (url) {
  return true;

    try {
        var result;
        result = Service.WebService.Post("UrlExists", {
            fileName: url
        });
        if (result.text == "false") {
            return false;
        }
        else if (result.text == "true") {
            return true;
        }
        else {
            Service.ShowMessageBox('错误', '没有得到正确的结果！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
    } catch(e) {}
};

/**
* purpose:  判断网页是否存在
* @param url
* @return bool
*/
Service.LocalizeUrl = function (url,fileName) {
    try {
        var result;
        result = Service.WebService.Post("LocalizeUrl", {
            url: url,
            fileName: fileName
        });

        if (result!=undefined && result != null) {
           return result.text;
        }
        else
           return fileName;
    } catch(e) {}
};

/**
* 获取XMLHttpRequest对象
* @type String
*/
Service.GetHttpRequestByUrl = function (url) {
    var endIndex=url.indexOf('#');
    var xmlhttp=Service.GetXmlHttpObject();

    try
    {
        if(endIndex!=-1){
            url=url.substring(0,endIndex);
        }
        xmlhttp.open("GET", url, false);
        xmlhttp.send();

         if(xmlhttp.status==404)
                return null;

        if (xmlhttp.readyState == 4 )
        {
            if(xmlhttp.status==200)
                return xmlhttp;
        }
        return null;
    }
    catch(e)
    {
        return null;
    }
};

/**
* 创建XMLHttpRequest
* @type String
*/
Service.GetXmlHttpObject = function() {
    var xmlHttp=null;
    xmlHttp = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
//    try
//    {
//        // Firefox, Opera 8.0+, Safari
//        xmlHttp=new XMLHttpRequest();
//    }
//    catch (e)
//    {
//        // Internet Explorer
//        try
//        {
//            xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
//        }
//        catch (e)
//        {
//            xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
//        }
//    }
    return xmlHttp;
};

/**
* purpose:  判断是网路版还是单机版
* @param url
* @return bool
*/
Service.Isnet = function () {
    var href = window.location.href;
    var index = href.indexOf('//');
    if (index != -1) {
        href = href.substring(index + 2);
        if (href.toLowerCase().indexOf('localhost:') != -1 || href.toLowerCase().indexOf('127.0.0.1:') != -1) {
            return false;
        }
    }
    return true;
};

//定义服务实例
window.Service.WebService = new Service.WebServiceManager('Service/ManualService.asmx/');

/*
 *	新建一个GUID字符串
 */
Service.NewGuid = function () {
    var result;
    try {
        result = Service.WebService.Post('GetGuid', null);
    }
    catch(e) {
         //Service.ShowMessageBox('错误', '调用服务器发生错误！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
    }

    if (result!=undefined && result != null) {
       return result.text;
    }
    else
       return new Date().getMilliseconds();


};
/*
 *	通过RequestString的名字获得对应的值
 */
Service.RequestString = function (RequestName, search) {
    if (search == undefined) search = document.location.search;

    var s137 = search;
    if (s137 == "") return "";
    if (s137.charAt(0) == "?") s137 = s137.substring(1, s137.length);
    var s138 = s137.split("&");
    for (i = 0; i < s138.length; i++) {
        var s138_values = s138[i].split("=");
        if (RequestName == unescape(s138_values[0])) {
            var s140;
            if (window.decodeURIComponent) s140 = decodeURIComponent(s138_values[1]);
            else s140 = unescape(s138_values[1]);
            return s140;
        }
    }
    return "";
};

/*
 *	下载文件
 */
Service.DownloadFile = function (url) {
    try {
        var newWindow = window.open(url,  '', 'height=10, width=15, top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no');
        try {
            newWindow.attachEvent("onload", function () {
                    newWindow.close();
                })
        }
        catch(e){}
        return true;
    }
    catch(e){
        return false;
    }
}

/*
 *	禁止复制、剪贴、屏幕打印、右键菜单等
 */
Service.ForbidOperation = function (obj) {
    if (obj == undefined) return false;

    obj.oncontextmenu = function () {
        return false;
    };

    obj.onkeydown=function(){
          if(window.event!=null)
            {
                  if(event.keyCode==8)
                  {
                        if(event.srcElement.readOnly==true)
                            event.returnValue=false;
                        else if(event.srcElement.nodeName!="INPUT" && event.srcElement.nodeName!="TEXTAREA")
                            event.returnValue=false;
                        //ApplicationContext.MainFrame.SetMainToolbarButtonClick('m_btnBack');
                  }

                  if(event.ctrlKey&&event.keyCode==39)
                       event.returnValue=false;

                   if(event.ctrlKey&&event.keyCode==37)
                       event.returnValue=false;

                    if(event.ctrlKey&&event.keyCode==17)
                       event.returnValue=false;

                    if(event.ctrlKey&&event.keyCode==72)
                       event.returnValue=false;

                    if(event.ctrlKey&&event.keyCode==73)
                       event.returnValue=false;

                    if(event.ctrlKey&&event.keyCode==78)
                       event.returnValue=false;

                    if(event.ctrlKey&&event.keyCode==69)
                       event.returnValue=false;

                     if(event.ctrlKey&&event.keyCode==83)
                       event.returnValue=false;
            }
    };

    if(obj.body!=undefined)
    {
        obj.body.oncopy = function () {
            return false;
        };
        obj.body.oncut = function () {
            return false;
        };
        obj.body.onbeforeprint = function () {
            obj.body.style.display = "none";
        };
        obj.body.onafterprint = function () {
            obj.body.style.display = "block";
        };
    }

};

/*
 *	开启复制、剪贴、右键菜单等
 */
Service.OpenOperation = function (obj) {
    if (obj == undefined) return true;

    obj.oncontextmenu = function () {
        return true;
    };
    obj.body.oncopy = function () {
        return true;
    };
    obj.body.oncut = function () {
        return true;
    };
};

/*
 *	定义一个HashTable
 */
Service.HashTable = function () {
    this._content = new Array();
}
Service.HashTable.prototype.Count = function () {
    var count = 0;
    for (var i in this._content) count++;
    return count;
}

Service.HashTable.prototype.List = function () {
    return this._content;
}

Service.HashTable.prototype.Items = function (key) {
    if (this.Contains(key)) {
        return this._content[key];
    }
}

Service.HashTable.prototype.Add = function (key, value) {
    if (this._content.hasOwnProperty(key)) {
        return false;
    }
    else {
        this._content[key] = value;
        return true;
    }
}

Service.HashTable.prototype.Clear = function () {
    this._content = {};
}

Service.HashTable.prototype.Contains = function (key) {
    return this._content.hasOwnProperty(key);
}

Service.HashTable.prototype.Remove = function (key) {
    delete this._content[key];
}
