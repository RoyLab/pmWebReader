///////////////////////////////////////////////////////////////////////////////
//功能描述：DM源文件导出管理类
//作者：wuqifeng
//日期：2009-03-03
///////////////////////////////////////////////////////////////////////////////
Service.RegNameSpace('window.System');

System.ExportDMManager = function() {

    var exportWindow;

    function ExportDM() {
        if (exportWindow.IsDMIndentifyValid()) {
            var fileUrl,result;
            var dmcString = exportWindow.GetDMIndentify();
            
            if (dmcString == null || typeof dmcString == 'undefined' || dmcString == '') {
                dmcControl.markInvalid('DMC不允许为空！');
                focus();
                return;
            }

            fileUrl = GetFileUrl(dmcString);
            
            if (fileUrl != null && typeof fileUrl != 'undefined' && fileUrl != '') {
                result = Service.DownloadFile(fileUrl);

                if (!result) {
                    Service.ShowMessageBox('错误', '导出失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                }
            }
            else {
                Service.ShowMessageBox('提示', '没有相应的DM文件可以导出。', Ext.MessageBox.OK, Ext.MessageBox.INFO);
            }

            exportWindow.close();
        }
    };

    /**
     * purpose:导出
     */
    this.Export = function(dmcStr) {
        exportWindow = new System.ExportDMWindow({ExportDMHanlder : ExportDM,DMIndentify : dmcStr });
        exportWindow.show();
    };

    function GetFileUrl(codeString) {
        var url = null;

        Service.WebService.Call('GetDMDocumentByDMC',
                                { dmcString: codeString },
                                function (result) {url = result.text;}
                                );

        return url;
    };
};

/**
 * purpose:导出DM窗体
 * @class ExportDMWindow
 */
System.ExportDMWindow = Ext.extend(Ext.Window,{

    title: '导出DM文件',

    closable: true,
    width: 400,
    plain: true,
    modal: true,
    resizable: false,
    autoHeight: true,
    closeAction: 'close',
    
    
    txtDMIndentify : null,
    
    /**
     * DMID
     * @String
     */
    m_DMIndentify : null,
    
    constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_ExportDMHanlder = config.ExportDMHanlder;
            this.m_DMIndentify = config.DMIndentify;
        }
        
        this.keys=[{ key: Ext.EventObject.ENTER, fn: this.ExportDM, scope: this}];
        
        System.ExportDMWindow.superclass.constructor.apply(this, arguments);
    },
        
    initComponent : function () 
    {
         var dmcControl = new Ext.form.TextField
        ({
            fieldLabel: 'DMC',
            anchor: '100%',
            invalidText: 'DMC不允许为空！',
            tabIndex: 0,
            readOnly: true,
            value: '',
            name: 'dmcControl'
        });
        dmcControl.setValue(this.m_DMIndentify);
        this.txtDMIndentify = dmcControl;

        var pnlDMC = new Ext.FormPanel
        ({
            id: 'pnlDMC',
            region: 'south',
            frame: true,
            labelWidth: 60,
            autoScroll: false,
            containerScroll: false,
            items: [dmcControl]
        });
        
        var okButton = new Ext.Button({
                    text: '确定',
                    scope: this,
                    handler: function() {
                    this.ExportDM();}
               });
        
        var cancelButton = new Ext.Button({     
                    text: '取消', 
                    scope : this,
                    handler: function() {
                    this.close();}
               });
        
        System.ExportDMWindow.superclass.initComponent.call(this);
        this.add(pnlDMC);
        this.addButton(okButton);
        this.addButton(cancelButton);     
    },
    
    /**
     * purpose:导出DM
     */
    ExportDM : function () 
    {
        if( !Service.IsFunction(this.m_ExportDMHanlder))
            return;
        
        this.m_ExportDMHanlder();
    },
    
    /**
     * purpose:获取导出DMID
     */
    GetDMIndentify : function () 
    {
        return this.txtDMIndentify.getValue();
    },
    
    /**
     * purpose:判断DMID控件是否有效
     * @class 
     * @constructor
     * @param {type} name1
     */
    IsDMIndentifyValid : function () 
    {
        return this.txtDMIndentify.isValid();
    },
    
    /**
     * purpose:标识无效DMID
     * @text {String} 无效内容
     */
    MarkDMIndentifyInvalid : function (text) 
    {
        this.txtDMIndentify.markInvalid(text);
    }
});