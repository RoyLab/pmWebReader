
Service.RegNameSpace('window.Comment');

/**
 * @功能:意见打包信息窗体
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.CommentPackDetailWindow = Ext.extend(Ext.Window, {
    title: '打包意见 ',
    closable: true,
    width: 720,
    height: 280,
    plain: true,
    modal: true,
    closable: false,
    resizable: false,
    layout: 'border',

    m_CodeSet: null,
    m_SendOrReceiveSet: null,
    m_EventHandler: null,

    m_outputmodelic: null,
    m_outputdiyear: null,
    m_outputissdate: null,
    m_outputsendid: null,
    m_outputrecvid: null,
    m_outputsecurity: null,
    m_outputbizsecurity: null,
    m_outputauthrtn: null,
    m_outputfromentname: null,
    m_outputfromcountry: null,
    m_outputfromcity: null,
    m_outputtoentname: null,
    m_outputtocity: null,
    m_outputtocountry: null,
    
    /*
     *	需要进行打包的ID字符串：75&&76
     */
    CommentsIDStr: null,

    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        this.m_EventHandler = new Comment.CommentPackDetailWindowEventHandler(this);
        Comment.CommentPackDetailWindow.superclass.constructor.apply(this, arguments);
    },

    initComponent: function () {

        this.InitCodeSet();
        this.InidtSendOrReceiveSet();

        //拼装UI界面
        var pnloutputcomment = new Ext.FormPanel({
            id: 'pnloutputcomment',
            region: 'center',
            header: false,
            title: '打包意见',
            frame: true,
            labelWidth: 100,
            items: [m_CodeSet, m_SendOrReceiveSet]
        });

        this.items = [pnloutputcomment],
        this.buttons = [{
            text: '打包',
            handler: this.m_EventHandler.Confirm
        },

        {
            text: '关闭',
            id: 'closeButton',
            handler: this.m_EventHandler.Cancel
        }];

        Comment.CommentPackDetailWindow.superclass.initComponent.call(this);
    },

    /*
     *	初始化编码控件组
     */
    InitCodeSet: function () {
        m_outputmodelic = new Ext.form.TextField({
            id: 'm_outputmodelic',
            fieldLabel: '型号',
            value: TOC.modelicText,
            anchor: '95%',
            maxLength: 10,
            maxLengthText: '型号最大长度不能超过10！',
            allowBlank: false,
            blankText: '型号不允许为空！',
            tabIndex: 0,
            name: 'm_outputmodelic'
        });

        m_outputdiyear = new Ext.form.ComboBox({
            id: 'outputdiyear',
            store: new Ext.data.SimpleStore({
                fields: ['year'],
                data: Service.BasicDataService.GetCodeTableData('DiyearType')
            }),
            displayField: 'year',
            typeAhead: true,
            mode: 'local',
            editable: true,
            minLength: 4,
            minLengthText: '年份的长度为4，且只允许包括数字！',
            maxLength: 4,
            maxLengthText: '年份的长度为4，且只允许包括数字！',
            allowBlank: false,
            blankText: '年份不允许为空！',
            tabIndex: 2,
            triggerAction: 'all',
            selectOnFocus: true,
            fieldLabel: '年份',
            anchor: '95%',
            name: 'outputdiyear'
        });
        m_outputdiyear.setValue(new Date().getFullYear());

        m_outputissdate = new Ext.form.DateField({
            id: 'outputissdate',
            fieldLabel: '日期',
            anchor: '95%',
            format: 'Y/m/d',
            invalidText: '不符合日期格式！',
            editable: false,
            tabIndex: 5,
            name: 'outputissdate'
        });

        m_outputissdate.setValue(new Date());

        m_outputsecurity = new Ext.form.ComboBox({
            id: 'outputsecurity',
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetBasicDataByCache(Service.CodeTalbeType.SECURITY)
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            tabIndex: 9,
            selectOnFocus: true,
            fieldLabel: '密级',
            anchor: '95%',
            name: 'outputsecurity'
        });

        m_outputbizsecurity = new Ext.form.ComboBox({
            id: 'outputbizsecurity',
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('CommclsType')
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            tabIndex: 9,
            selectOnFocus: true,
            fieldLabel: '商业密级',
            anchor: '95%',
            name: 'outputbizsecurity'
        });

        m_outputauthrtn = new Ext.form.TextField({
            id: 'outputauthrtn',
            fieldLabel: '打包者',
            anchor: '95%',
            tabIndex: 0,
            name: 'outputauthrtn'
        });

        m_CodeSet = new Ext.form.FieldSet({
            title: ' 编码',
            autoHeight: true,
            collapsible: false,
            labelWidth: 55,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .33,
                    layout: 'form',
                    items: [m_outputmodelic, m_outputsecurity]
                },
                {
                    columnWidth: .33,
                    layout: 'form',
                    items: [m_outputdiyear, m_outputbizsecurity]
                },
                {
                    columnWidth: .34,
                    layout: 'form',
                    items: [m_outputissdate, m_outputauthrtn]
                }]

            }]
        });
    },

    /*
     *	发送单位和接受单位控件组
     */
    InidtSendOrReceiveSet: function () {
        m_outputsendid = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('SendidType') //下拉框数据从代码表获取
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            tabIndex: 1,
            blankText: '发送单位不允许为空！',
            emptyText: '请选择！',
            editable: false,
            selectOnFocus: true,
            fieldLabel: '发送方',
            anchor: '95%',
            name: 'outputsendid'
        });

        m_outputfromentname = new Ext.form.TextField({
            id: 'outputfromentname',
            fieldLabel: '企业',
            anchor: '95%',
            tabIndex: 7,
            name: 'outputfromentname'
        });

        m_outputfromcity = new Ext.form.ComboBox({
            id: 'outputfromcity',
            name: 'outputfromcity',
            fieldLabel: '城市',
            anchor: '95%',
            tabIndex: 8,
            name: 'city',
            store: new Ext.data.SimpleStore({
                fields: ['text'],
                data: Service.BasicDataService.GetCodeTableData('CityType')
            }),
            displayField: 'text',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: true,
            selectOnFocus: true
        });

        m_outputfromcountry = new Ext.form.ComboBox({
            id: 'outputfromcountry',
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('CountryType')
            }),
            displayField: 'text',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            selectOnFocus: true,
            fieldLabel: '国家',
            anchor: '95%',
            name: 'outputfromcountry'
        });

        m_outputrecvid = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('SendidType') //下拉框数据从代码表获取
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            tabIndex: 1,
            blankText: '发送单位不允许为空！',
            emptyText: '请选择！',
            editable: false,
            selectOnFocus: true,
            fieldLabel: '接收方',
            anchor: '95%',
            name: 'outputrecvid'
        });

        m_outputtoentname = new Ext.form.TextField({
            id: 'outputtoentname',
            fieldLabel: '企业',
            anchor: '95%',
            tabIndex: 7,
            name: 'outputtoentname'
        });

        m_outputtocity = new Ext.form.ComboBox({
            id: 'outputtocity',
            name: 'outputtocity',
            fieldLabel: '城市',
            anchor: '95%',
            tabIndex: 8,
            name: 'city',
            store: new Ext.data.SimpleStore({
                fields: ['text'],
                data: Service.BasicDataService.GetCodeTableData('CityType')
            }),
            displayField: 'text',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: true,
            selectOnFocus: true
        });

        m_outputtocountry = new Ext.form.ComboBox({
            id: 'outputtocountry',
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('CountryType')
            }),
            displayField: 'text',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            selectOnFocus: true,
            fieldLabel: '国家',
            anchor: '95%',
            name: 'outputtocountry'
        });

        m_SendOrReceiveSet = new Ext.form.FieldSet({
            title: '发送单位与接收单位',
            autoHeight: true,
            collapsible: false,
            labelWidth: 45,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .23,
                    layout: 'form',
                    items: [m_outputsendid, m_outputrecvid]
                },
                {
                    columnWidth: .23,
                    layout: 'form',
                    items: [m_outputfromcountry, m_outputtocountry]
                },
                {
                    columnWidth: .23,
                    layout: 'form',
                    items: [m_outputfromcity, m_outputtocity]
                },
                {
                    columnWidth: .31,
                    layout: 'form',
                    items: [m_outputfromentname, m_outputtoentname]
                }]

            }]
        });
    },

    /*
     *	验证输入字段的合法性
     */
    ValidataTextFiled: function () {
        var outputsendidText = m_outputsendid.getValue();
        var outputrecvidText = m_outputrecvid.getValue();
        var outputdiyearText = m_outputdiyear.getValue();

        if (!m_outputmodelic.validate() || !m_outputdiyear.validate() || !m_outputissdate.validate() || !m_outputsendid.validate() || !m_outputrecvid.validate()) {
            Service.ShowMessageBox('错误', '校验不能通过，请根据提示信息进行修改。', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            return false;
        }
        
        var reYear =/^([0-9]([0-9])*)$/;
        if(reYear.test(outputdiyearText)==false)
        {
            Service.ShowMessageBox('错误', '年份只能是数字，请重新输入！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            return false;
        }

        var re = /^([a-zA-Z0-9]([a-zA-Z0-9])*)$/;
        if (re.test(outputsendidText) == false) {
            Service.ShowMessageBox('错误', '发送单位只能由数字和字母组成。', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            return false;
        }

        if (re.test(outputrecvidText) == false) {
            Service.ShowMessageBox('错误', '接收单位只能由数字和字母组成。', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            return false;
        }

        return true;
    },

    /*
     *	从UI构建一个打包信息JSON数据
     */
    BuidOutPutPackInfo: function () {
        return {
            fileName: 'Comment\\',
            outputmodelic: m_outputmodelic.getValue(),
            outputdiyear: m_outputdiyear.getValue(),
            outputissdate: m_outputissdate.value,
            outputsecurity: m_outputsecurity.getValue(),
            outputbizsecurity: m_outputbizsecurity.getValue(),
            outputsendid: m_outputsendid.getValue(),
            outputfromentname: m_outputfromentname.getValue(),
            outputfromcity: m_outputfromcity.getValue(),
            outputfromcountry: m_outputfromcountry.getValue(),
            outputrecvid: m_outputrecvid.getValue(),
            outputtoentname: m_outputtoentname.getValue(),
            outputtocity: m_outputtocity.getValue(),
            outputtocountry: m_outputtocountry.getValue(),
            outputauthrtn: m_outputauthrtn.getValue(),
            commentsidstr: this.CommentsIDStr
        };
    }
});


/**
 * @功能:意见打包信息窗体事件处理类
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.CommentPackDetailWindowEventHandler = function (sender) {

    //持有UI窗体
    var commentPackDetailWindow = sender;

    /*
     *	确认
     */
    this.Confirm = function () {
        var validateresult = commentPackDetailWindow.ValidataTextFiled();
        if (validateresult == true) {
            var packInfo = commentPackDetailWindow.BuidOutPutPackInfo();
            var result;
            try {
                result = Service.WebService.Post('OutputComment', packInfo);
                if (result != null && result.text != '') {
                    var fname = result.text;
                    try {
                        var href = document.location.href;
                        var root = href.substring(0, href.lastIndexOf('/') + 1);
                        var addRefWin = window.open(root + 'Download.aspx?fname=' + fname + '&dtype=Comment', '', 'height=0, width=0, top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no');
                        addRefWin.attachEvent("onload", function () {
                            addRefWin.close();
                        })
                    }
                    catch(e) {}
                    commentPackDetailWindow.close();
                }
                else {
                    Service.ShowMessageBox('错误', '打包意见失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
                }
            }
            catch(e) {
                Service.ShowMessageBox('错误', '打包意见失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            }
        }

    };

    /*
     *	取消
     */
    this.Cancel = function () {
        commentPackDetailWindow.close();
    };
};