/************************************************************************/
/*功能描述：备注管理类
/*作者：wuqifeng
/*日期：2008-11-21                                                                  
/************************************************************************/

//定义名称空间Remark
Service.RegNameSpace('window.Remark');

/**
 * purpose:RemarkManager管理类
 * @class 
 * @constructor 
 */
Remark.RemarkManager = function (sender) {

    /**
   * 是否显示
   * @type bool
   */
    var canShow = true;

    /**
   * 备注容器
   * @type bool
   */
    var remarkEditor = sender;

    /**
    * 取用户id
    * @type int
    */
    function GetUserId() {
        if (typeof ApplicationContext.IUserInfo() == 'undefined' || ApplicationContext.IUserInfo() == null) return null;

        return ApplicationContext.IUserInfo().UserId;
    };

    /**
    * 取用户名
    * @type int
    */
    function GetUserName() {
        if (typeof ApplicationContext.IUserInfo() == 'undefined' || ApplicationContext.IUserInfo() == null) return null;

        return ApplicationContext.IUserInfo().UserName;
    };

    /**
    * 取dmc
    * @type String
    */
    function GetDMC() {
        if (typeof ApplicationContext.IMainFrame().GetActiveTabDMinfo() == 'undefined' || ApplicationContext.IMainFrame().GetActiveTabDMinfo() == null) return null;

        return ApplicationContext.IMainFrame().GetActiveTabDMinfo().Dmc;
    };

    /**
    * 取title
    * @type String
    */
    function GetTitle() {
        if (typeof ApplicationContext.IMainFrame().GetActiveTabDMinfo() == 'undefined' || ApplicationContext.IMainFrame().GetActiveTabDMinfo() == null) return null;

        return ApplicationContext.IMainFrame().GetActiveTabDMinfo().Title;
    };

    /**
    * 取对象id
    * @type String
    */
    function GetObjId() {
        if (typeof ApplicationContext.IMainFrame().GetActiveTabDMinfo() == 'undefined' || ApplicationContext.IMainFrame().GetActiveTabDMinfo() == null) return null;

        return '-1';
    };

    /**
   * 备注内容
   * @type bool
   */
    var preRemarkContent;


    /**
   * 加载
   * @type String
   */
    Remark.RemarkManager.prototype.LoadRemark = function () {
        canShow = true;
        var result=false;
        var dmcString = GetDMC();
        
        if(dmcString!=null&&dmcString!=undefined)
        {
            dmcString=dmcString.toLowerCase().substr(0,3);
            if(dmcString=="dmc"||dmcString=="dme")
                canShow=true;
            else
                canShow=false;
        }
        else
        {
            canShow=false;
        }
            
            
//        if (typeof dmcString == 'undefined' || dmcString == null || dmcString == '') {
//            canShow = false;
//        }
        if (Remark.RemarkManager.prototype.IsDirty() && Remark.RemarkManager.prototype.ReamarkHadChanged(remarkEditor)) {
             if (confirm("备注已经更改，是否保存？")) {
                Remark.RemarkManager.prototype.SaveRemark();
                result = true;
             }
        } 
        Remark.RemarkManager.prototype.SetEntry();
        return result;
       
    };

    /**
    * 判断是否显示备注栏
    * @type String
    */
    Remark.RemarkManager.prototype.SetEntry = function () {
        preRemarkContent = '';
        remarkEditor.setValue('');

        if (canShow) {
            Remark.RemarkManager.prototype.GetRemark();
            ApplicationContext.MainFrame.m_Wiever.RemarkEditor.focus();
        }else{
            ApplicationContext.MainFrame.m_Wiever.RemarkEditor.blur();
        }
        ApplicationContext.MainFrame.m_Wiever.RemarkEditor.setDisabled(!canShow);
    };

    /**
    * 判断是否是有效数据
    * @type String
    */
    Remark.RemarkManager.prototype.IsDirty = function () {
        if (top == null || remarkEditor == null) {
            return false;
        }

        if (remarkEditor.isDirty()) {
            return true;
        }

        return false;
    };

    /**
    * 取备注内容
    * @type String
    */  
    function RemarkObject(time, content) {
        var RemarkTime = time;
        var RemarkContent = content;
    };

    /**
    * 初始备注数据
    * @type String
    */
    Remark.RemarkManager.prototype.GetRemark = function () {
        var dmcString = GetDMC();
        var result;
        if (typeof dmcString == "undefined" || dmcString == null) {
            remarkEditor.setValue('');
            preRemarkContent = '';
            return;
        };

        try {
            result = Service.WebService.Post("GetRemark",{ userid: GetUserId,dmc: GetDMC,objid: GetObjId});
            
            GetRemarkCallBack(result);
        }
        catch(e) {
            remarkEditor.setValue('');
            preRemarkContent = '';
            //Service.ShowMessageBox('错误', '调用服务器发生错误！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        finally {
            $.ajaxSetup({
                async: true
            });
        }

        return result;
    };

    /**
    * 取备注回调
    * @type String
    */
    function GetRemarkCallBack(result) {

        var remarkObj = null;

        try {
            remarkObj = DeSerialize(result.xml);
        }
        catch(e) {}
        finally {
            if (typeof remarkObj == 'undefined') {
                remarkEditor.setValue('');
                preRemarkContent = '';
            }
            else {
                var remarkContent = remarkObj.RemarkContent;
                if (typeof remarkContent != 'undefined' && remarkContent != null) {
                    remarkEditor.setValue(remarkContent);
                    preRemarkContent = remarkContent;
                }
                else {
                    remarkEditor.setValue('');
                    preRemarkContent = '';
                }
            }
        }

        return result;
    };

    /**
    * 取备注回调
    * @type String
    */
    function DeSerialize(xmlString) {
        var result;
        var doc = new ActiveXObject("MSXML2.DOMDocument");
        doc.async = "false";
        doc.loadXML(xmlString);
        if (doc != null) {
            var timeNode = doc.selectSingleNode("//RemarkElement/SaveTime");
            var contentNode = doc.selectSingleNode("//RemarkElement/HtmlContent");
            result = new RemarkObject();
            if (timeNode != null) {
                result.RemarkTime = timeNode.nodeTypedValue;
            }
            if (contentNode != null) {
                result.RemarkContent = contentNode.nodeTypedValue;
            }
        }

        return result;
    };

    /**
    * 新增备注
    * @type String
    */
    Remark.RemarkManager.prototype.AddRemark = function () {
        ApplicationContext.MainFrame.m_Wiever.RemarkEditor.focus();
        remarkEditor.win.focus();
        remarkEditor.syncValue();
        remarkEditor.deferFocus();

        var oldValue = remarkEditor.getValue();
        if (IsRemarkEditorEmpty()) {
            oldValue = '';
            remarkEditor.setValue(oldValue);
        }

        var newValue;
        var dateObj = new Date();
        var userId = GetUserId();
        var userName = GetUserName();
        var dateString = dateObj.getYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes();

        var userString = '';
        if (userName != null || typeof userName != 'undefined') {
            userString = userName;
        }

        if (userId != null || typeof userId != 'undefined') {
            userString += ' &lt;' + userId + '&gt;';
        }

        var header = '<b><FONT color=#003366>' + userString + ',' + dateString + ':</FONT></b> ';
        var sep = '<br/><br/>';

        if (oldValue == null || typeof oldValue == 'undefined' || oldValue.length == 0) {
            newValue = header;
        }
        else {
            newValue = oldValue + sep + header;
        }

        ApplicationContext.MainFrame.m_Wiever.RemarkEditor.focus();
        remarkEditor.win.focus();
        remarkEditor.setValue(newValue);
        remarkEditor.syncValue();
        remarkEditor.deferFocus();
    }

    /**
    * 保存备注
    */
    Remark.RemarkManager.prototype.SaveRemark = function () {
        ApplicationContext.MainFrame.m_Wiever.RemarkEditor.focus();
        remarkEditor.win.focus();
        remarkEditor.syncValue();
        remarkEditor.deferFocus();

        if (Remark.RemarkManager.prototype.ReamarkHadChanged(remarkEditor)) {
            var htmlContent = remarkEditor.getValue();
            var textContent = '';
            var dmcString = GetDMC();
            var idString = GetObjId();
            try {
                textContent = remarkEditor.doc.body.innerText;
            }
            catch(e) {}

            if (htmlContent == null || typeof htmlContent == "undefined") {
                htmlContent = '';
            }

            if (typeof dmcString == "undefined" || dmcString == null) {
                preRemarkContent = htmlContent;
                Service.ShowMessageBox('错误', 'DMC不存在不能保存！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                return;
            };

            if (typeof idString == "undefined" || idString == null) {
                preRemarkContent = htmlContent;
                Service.ShowMessageBox('错误', '发生未知错误，保存失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                return;
            };

            UpdateRemark(htmlContent, textContent);
        }
    };

    /**
    * 修改备注
    * @type String
    */
    function UpdateRemark(htmlContent, textContent) {

        try {
            var teachInfoName = GetTitle();
            var userId = GetUserId();
            var dmcString = GetDMC();
            var idString = GetObjId();
            if (IsRemarkEditorEmpty()) {
                remarkEditor.setValue('');
                htmlContent = '';
                textContent = '';
            }

            Service.WebService.Call('UpdateRemark', {
                userid: userId,
                dmc: dmcString,
                objid: idString,
                title: teachInfoName,
                htmlContent: htmlContent,
                textContent: textContent
            },
            function (result) {
                UpdateRemarkCallBack(result);
            },
            function (XmlHttpRequest, textStatus, errorThrow) {
                Service.ShowMessageBox('错误', '调用服务器发生错误！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            });
            preRemarkContent = htmlContent;

        }
        catch(e) {
            Service.ShowMessageBox('错误', '调用服务器发生错误！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        finally {
            $.ajaxSetup({
                async: true
            });
        }
    };

    /**
    * 导出备注
    */
    Remark.RemarkManager.prototype.ExportRemark = function () {

        var result;
        var xmlResult;

        try {

            $.ajaxSetup({
                async: false,
                timeout: 60000
            });
            xmlResult = Service.WebService.Post("ExportRemark");
        }
        catch(e) {
            xmlResult == null;
        }
        finally {
            $.ajaxSetup({
                async: true
            });
        }

        if (xmlResult != null && typeof xmlResult != 'undefined') {
            result = Service.DownloadFile(xmlResult.text);
        }

        if (!result) {
            Service.ShowMessageBox('错误', '导出失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }

        return result;
    };

    /**
    * 判断是否有变化
    * @type String
    */
    Remark.RemarkManager.prototype.ReamarkHadChanged = function (remarkEdit) {
        try {
            var val1 = remarkEdit.getValue();
            if (typeof val1 != 'undefined' && val1 != null) {
                while (val1.indexOf('\n') >= 0) {
                    val1 = val1.replace('\n', '');
                }

                while (val1.indexOf('\r') >= 0) {
                    val1 = val1.replace('\r', '');
                }

                while (val1.indexOf('\n\r') >= 0) {
                    val1 = val1.replace('\n\r', '');
                }

                while (val1.indexOf('\r\n') >= 0) {
                    val1 = val1.replace('\r\n', '');
                }
            }
            else {
                return false;
            }

            var val2 = preRemarkContent;
            if (typeof val2 != 'undefined' && val2 != null) {
                while (val2.indexOf('\n') >= 0) {
                    val2 = val2.replace('\n', '');
                }

                while (val2.indexOf('\r') >= 0) {
                    val2 = val2.replace('\r', '');
                }

                while (val2.indexOf('\n\r') >= 0) {
                    val2 = val2.replace('\n\r', '');
                }

                while (val2.indexOf('\r\n') >= 0) {
                    val2 = val2.replace('\r\n', '');
                }

                if (val2 != val1) {
                    return true;
                }
            }
        }
        catch(e) {}

        return false;
    };

    /**
    * 修改备注回调
    * @type String
    */
    function UpdateRemarkCallBack(result) {

        if (result.error || (typeof result.text != "undefined" && result.text == 'false')) {
            Service.ShowMessageBox('错误', '保存失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        else {
            ShowWaitBox('信息', '正在更新...', null, null, null);
            setTimeout(function () {
                Ext.MessageBox.hide();
            },
            500);
        }
    };

    /**
    * 判断是否为空
    * @type String
    */
    function IsRemarkEditorEmpty() {
        var value = remarkEditor.getValue();
        if (value != null && typeof value != 'undefined') {
            if (value.toLowerCase() == '<p>&nbsp;</p>') {
                return true;
            }
        }

        return false;
    };

    /**
     * purpose:RemarkPrint打印
     * @class 
     * @constructor 
     */
    var HKEY_Root, oldFooterKey, oldHeaderKey;

    var hkeyRoot = "HKEY_CURRENT_USER";
    var hkeyPath = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";

    /**
    * 备注打印
    * @type String
    */
    Remark.RemarkManager.prototype.PrintRemark = function () {
        var value = remarkEditor.getValue();
        //GetDMC
        var curdmc = GetDMC();//MainFrame.GetContentPage().GetExtDMC();
        var title = "<div style=\"font-weight: bold; font-size: large; text-align: center;\">备注</div><br/>" + curdmc + "<br/><br/><br/>";
        value = "<div style=\"font-size: medium;word-wrap:break-word;work-break:break-all\">" + value + "</div>";

        var tableContent = "<table width=\"100%\"><tr><td>" + title + "</td></tr><tr><td>" + value + "</td></tr></table>";

        var printWindow = window.open('', '_blank', 'height=1, width=1, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');

        try {
            var bodyEle = printWindow.document.createElement('body');

            printWindow.document.appendChild(bodyEle);

            var newDoc = bodyEle.document;
            newDoc.open();
            newDoc.write(tableContent);
            newDoc.close();

            var objectCommand = newDoc.createElement("div");

            if (newDoc.all.WebBrowser == null) {
                objectCommand.innerHTML = '<OBJECT classid= CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 height=0 id=WebBrowser width=0></<OBJECT>';
                newDoc.body.appendChild(objectCommand);
            }

            PageSetup();

            if (printWindow != null) {
                printWindow.attachEvent('onunload', function () {

                    var dObj = new Date();

                    var d1 = dObj.getSeconds();
                    while (true) {
                        var dObj2 = new Date();
                        var d2 = dObj2.getSeconds();
                        if (d2 - d1 >= 2 || d2 - d1 <= -2) {
                            break;
                        }
                    }

                });

                printWindow.print();

            }

        }
        catch(e) {
            Service.ShowMessageBox('错误', '调用服务器发生错误！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        finally {

            PageSetup_Default();
            try {
                if (printWindow != null && typeof printWindow != 'undefined') printWindow.close();
            }
            catch(e) {}
        }
    }

    /**
    * 设置页
    * @type String
    */
    function PageSetup() {
        try {

            var Wsh = new ActiveXObject("WScript.Shell");
            HKEY_Key = "header";
            oldHeaderKey = Wsh.RegRead(HKEY_Root + HKEY_Path + HKEY_Key);
            Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
            HKEY_Key = "footer";
            oldFooterKey = Wsh.RegRead(HKEY_Root + HKEY_Path + HKEY_Key);
            Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "&b页码：&p/&P&b&d");
        }
        catch(e) {}
    }

    /**
    * 还原页眉页脚的值
    * @type String
    */
    function PageSetup_Default() {
        try {
            var Wsh = new ActiveXObject("WScript.Shell");
            HKEY_Key = "header";
            Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, oldHeaderKey);
            HKEY_Key = "footer";
            Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, oldFooterKey);
            // Header:&w&b页码,&p/&P   //Footer:&u&b&d

        }
        catch(e) {}
    }

    /**
    * 进度条
    * @type String
    */
    function ShowWaitBox(title, message, button, icon, callBack) {
        Ext.MessageBox.show({
            title: title,
            msg: message,
            modal: false,
            buttons: button,
            fn: callBack,
            icon: icon,
            width: 200,
            progress: true,
            wait: true,
            closable: false,
            waitConfig: {
                interval: 50
            }
        });
    };

};

/**
 * purpose:事件处理
 * @class 
 * @constructor 
 */
Remark.RemarkHandler = Ext.extend(HtmlEditorCN, {

    id: 'm_RemarkEditor',
    hideLabel: true,
    height: 200,
    enableLinks: false,
    enableDelete: true,
    enableSourceEdit: false,
    m_btnAddRemarkkmark:null,
    m_btnSaveRemarkmark:null,
    m_btnPrintRemarkmark:null,
    
     /*
     *	事件处理类
     */
    m_EventHandler: null,
    
     /*
     *	构造函数
     */
    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        this.m_EventHandler = new Remark.RemarkManager(this);
        Remark.RemarkHandler.superclass.constructor.apply(this, arguments);
    },
    
     /*
     *	初始化信息控件组
     */
    InitInfoBar: function () {
        m_btnAddRemarkkmark = new Ext.Toolbar.Button({
            id: 'm_btnAddRemarkkmark',
            tabIndex: -1,
            icon: 'resources/images/16x16/Add.png',
            cls: 'x-btn-icon',
            tooltip: '<b>新增</b><br/>新增备注',
            handler: this.m_EventHandler.AddRemark
        });

        m_btnSaveRemarkmark = new Ext.Toolbar.Button({
            id: 'm_btnSaveRemarkmark',
            tabIndex: -1,
            icon: 'resources/images/16x16/Save.png',
            cls: 'x-btn-icon',
            tooltip: '<b>保存</b><br/>保存备注',
            handler: this.m_EventHandler.SaveRemark
        });

        m_btnPrintRemarkmark = new Ext.Toolbar.Button({
            id: 'm_btnPrintRemarkmark',
            tabIndex: -1,
            icon: 'resources/images/16x16/Print.png',
            cls: 'x-btn-icon',
            tooltip: '<b>打印</b><br/>打印备注',
            handler: this.m_EventHandler.PrintRemark
        }); 
    },
    
     /*
     *	初始化控件
     */
    initComponent: function () {

        this.on('initialize', function (control) {
            if (this.doc != null && typeof this.doc != 'undefined' && this.doc.body != null) {
                this.doc.body.style.wordWrap = 'break-word';
            }
        });
        this.InitInfoBar();
         
        this.on('render', function(control) { 
            this.getToolbar().insertButton(19, m_btnAddRemarkkmark);
            this.getToolbar().add("-", m_btnSaveRemarkmark);
            this.getToolbar().add(m_btnPrintRemarkmark);
        });
          
        Remark.RemarkHandler.superclass.initComponent.call(this);
    } ,
    
    /*
     *	编辑的备注内容是否改变
     */
    IsEditorHasChanged:function(){
        if(this.m_EventHandler.IsDirty() && this.m_EventHandler.ReamarkHadChanged(this)) {
            return true;
        } 
        else
            return false;
    },
    
    /*
     *	保存备注
     */
    SaveRemark:function(){
        this.m_EventHandler.SaveRemark();
        this.m_EventHandler.SetEntry();
    }
});