/************************************************************************/
/*功能描述：组合查询
/*作者：sunlunjun
/*日期：2010-1-18                                                                 
/************************************************************************/

//定义名称空间Remark
Service.RegNameSpace('window.Search');

/**
 * @功能:组合查询窗体类
 */
Search.SearchFormPanel = Ext.extend(Ext.FormPanel, {

    id: 'pnlSearch',
    labelWidth: 75,
    frame: true,
    labelAlign: 'top',

    /*
     *	查询项
     */
    m_txtSNS: null,
    m_txtIncode: null,
    m_txtContent: null,
    m_txtPMC: null,
    m_txtAssociateItem: null,
    m_txtApplic: null,
    m_labelCtrlF: null,

    /*
     *	组合框
     */
    m_CodeSet: null,
    m_ContentSet: null,

    /*
     *	构造函数
     */
    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        Search.SearchFormPanel.superclass.constructor.apply(this, arguments);
    },

    InitInfoSet: function () {
        m_txtSNS = new Ext.form.TextField({
            fieldLabel: '技术名/SNS',
            anchor: '95%',
            allowBlank: true,
            tabIndex: 0,
            name: 'sns'
        });

        m_txtIncode = new Ext.form.TextField({
            fieldLabel: '信息名/信息码',
            anchor: '95%',
            allowBlank: true,
            tabIndex: 2,
            name: 'incode'
        });

        m_txtContent = new Ext.form.TextField({
            fieldLabel: '内容',
            emptyText: '请输入要查找的内容！',
            anchor: '95%',
            allowBlank: true,
            tabIndex: 3,
            name: 'content'
        });

        m_txtPMC = new Ext.form.ComboBox({
            store: AdvancedData("pmc"),
            typeAhead: true,
            mode: 'local',
            allowBlank: false,
            editable: false,
            tabIndex: 4,
            triggerAction: 'all',
            selectOnFocus: true,
            fieldLabel: '出版物',
            anchor: '95%',
            name: 'pmc'
        });

        m_txtAssociateItem = new Ext.form.ComboBox({
            store: AdvancedData("associateitem"),
            typeAhead: true,
            mode: 'local',
            allowBlank: false,
            editable: false,
            tabIndex: 5,
            triggerAction: 'all',
            selectOnFocus: true,
            fieldLabel: '关联项目',
            anchor: '95%',
            name: 'associateitem'

        });

        function AdvancedData(typeData) {
            if (AdvancedSearchData != undefined && AdvancedSearchData != null) {
                if (typeData == "associateitem") return AdvancedSearchData.associateitem;
                else if (typeData == "pmc") {
                    return AdvancedSearchData.pmc;
                }
            }
            else return[];
        };

        m_txtApplic = new Ext.form.Checkbox({
            layout: 'fit',
            fieldLabel: '是否使用适用性',
            //            labelSeparator: '',
            boxLabel: '使用',
            name: 'applic'

        });

        m_labelCtrlF = new Ext.form.Label({
            id: 'labelCtrlF',
            text: "若要在模块内搜索，请选取'Ctrl+F'。"
        });

        //编码分组框
        m_CodeSet = new Ext.form.FieldSet({
            title: '标题',
            collapsible: true,
            defaults: {
                anchor: "95%"
            },
            layout: 'column',
            items: [{
                layout: 'form',
                items: [m_txtSNS, m_txtIncode]
            }]
        });

        //内容分组框
        m_ContentSet = new Ext.form.FieldSet({
            title: '内容',
            collapsible: true,
            defaults: {
                anchor: "95%"
            },
            layout: 'column',
            items: [{
                layout: 'form',
                items: [m_txtContent, m_txtPMC, m_txtAssociateItem, m_txtApplic, m_labelCtrlF]
            }]
        });  
       
    },

    /*
     *	初始化控件
     */
    initComponent: function () {

        this.InitInfoSet();
        this.items = [m_CodeSet, m_ContentSet];
        this.buttons = [{
            text: '清除',
            handler: function () {
                m_txtSNS.setValue("");
                m_txtIncode.setValue("");
                m_txtContent.setValue("");
                m_txtPMC.setValue("0");
                m_txtAssociateItem.setValue("0");
                m_txtApplic.setValue("false");
            }
        },
        {
            text: '搜索',
            id: 'closeButton',
            handler: function () {
                try{
                ApplicationContext.MainFrame.ShowBusy();
                Search.QueryResult(m_txtSNS.getValue(),m_txtIncode.getValue(),m_txtContent.getValue(),m_txtPMC.getValue(),m_txtAssociateItem.getValue(),m_txtApplic.getValue());
                }
                catch(e)
                {
                    ApplicationContext.MainFrame.ShowReady();
                }
            }
        }];

        m_txtPMC.setValue("0");
        m_txtAssociateItem.setValue("0");
        
        Search.SearchFormPanel.superclass.initComponent.call(this);

    }

});



/*
* 查询结果
*/
Search.QueryResult = function (sns, incode, content, pmc, item, isApplic) {
    var conds = "";
    var tempReplace = "";
    var href = "";
    var m_pnlAdvancedSearch = new Ext.ux.ManagedIframePanel({
        id: 'm_pnlAdvancedSearch',
        closable: true,
        title: '组合查询',
        iconCls: 'iconSearch',
        autoScroll: true,
        html: '<br><br><p style="text-align:center;font:bold 16px 微软雅黑;color:gray">还没有执行过搜索操作</p>',
        listeners:
        {
            documentloaded: function(frame, ex) 
            {
               Service.ForbidOperation(frame.getWindow().document);
               ApplicationContext.MainFrame.ShowReady();
                frame.getWindow().document.onkeydown=function(){
                              var event=frame.getWindow().event;
                              if(event.keyCode==8 && (event.srcElement.nodeName!="INPUT" && event.srcElement.nodeName!="TEXTAREA"))
                                    event.returnValue=false;
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
                };
                
            }
            
        }
    });

    if (sns != null && sns != 'undefined' && sns != '') {

        tempReplace = sns.replace(/([^'])'([^'])/g, "$1''$2").replace(/^'([^'])/g, "''$1").replace(/([^'])'$/g, "$1''").replace(/([[%_^])/g, "[$1]").trim();
        sns = tempReplace.replace(/(['])/g, "").replace(/<([A-Za-z\/])/g, "$1");
        conds += " and (sns like '%" + sns + "%' or techname like '%" + sns + "%')";
    }
    if (incode != null && incode != 'undefined' && incode != '') {
        tempReplace = incode.replace(/([^'])'([^'])/g, "$1''$2").replace(/^'([^'])/g, "''$1").replace(/([^'])'$/g, "$1''").replace(/([[%_^])/g, "[$1]").trim();
        incode = tempReplace.replace(/(['])/g, "").replace(/<([A-Za-z\/])/g, "$1");
        conds += " and (incode like '%" + incode + "%' or infoname like '%" + incode + "%')";
    }
    if (content != null && content != 'undefined' && content != '') {
        tempReplace = content.replace(/([^'])'([^'])/g, "$1''$2").replace(/^'([^'])/g, "''$1").replace(/([^'])'$/g, "$1''").replace(/([[%_^])/g, "[$1]").trim();
        content = tempReplace.replace(/(['])/g, "").replace(/<([A-Za-z\/])/g, "$1");
        conds += " and content like '%" + content + "%'";
    }
    if (pmc != null && pmc != 'undefined' && pmc != '0') {
        conds += " and pmc like '%" + pmc + "%'";
    }
    if (item != null && item != 'undefined' && item != '0') {
        if (item == 'warning-caution') {
            conds += " and (associateitem='warning' or associateitem='caution')";
        }
        else if (item == 'fault') {
            conds += " and (associateitem='fault' or associateitem='cfault' or associateitem='dfault' or associateitem='ifault' or associateitem='ofault')";
        }
        else {
            conds += " and associateitem='" + item + "'";
        }
    }

 
    if (isApplic == undefined) isApplic = false;

    if (m_txtApplic.getValue() == true) {
        //            m_pnlAdvancedSearch.setSrc('AdvancedQeryResult.aspx?pageIndex=1&sns=' + encodeURIComponent(m_txtSNS.getValue()) + '&incode=' + encodeURIComponent(m_txtIncode.getValue()) + '&content=' + encodeURIComponent(m_txtContent.getValue()) + '&pmc=' + encodeURIComponent(m_txtPMC.getValue()) + '&item=' + encodeURIComponent(m_txtAssociateItem.getValue()) + '&user=' + ApplicationContext.IUserInfo().UserId + '&isApplic=' + m_txtApplic.getValue() + '&time=' + new Date().getMinutes().toString() + new Date().getMilliseconds().toString());
        href = 'AdvancedQeryResult.aspx?pageIndex=1&sns=' + encodeURIComponent(sns) + '&incode=' + encodeURIComponent(incode) + '&content=' + encodeURIComponent(content) + '&pmc=' + encodeURIComponent(pmc) + '&item=' + encodeURIComponent(item) + '&user=' + ApplicationContext.IUserInfo().UserId + '&isApplic=' + isApplic + '&time=' + new Date().getMinutes().toString() + new Date().getMilliseconds().toString();
    } else {
        //            m_pnlAdvancedSearch.setSrc('AdvancedQeryResult.aspx?pageIndex=1&sns=' + encodeURIComponent(m_txtSNS.getValue()) + '&incode=' + encodeURIComponent(m_txtIncode.getValue()) + '&content=' + encodeURIComponent(m_txtContent.getValue()) + '&pmc=' + encodeURIComponent(m_txtPMC.getValue()) + '&item=' + encodeURIComponent(m_txtAssociateItem.getValue()) + '&user=' + ApplicationContext.IUserInfo().UserId + '&isApplic=' + m_txtApplic.getValue());
        href = 'AdvancedQeryResult.aspx?pageIndex=1&sns=' + encodeURIComponent(sns) + '&incode=' + encodeURIComponent(incode) + '&content=' + encodeURIComponent(content) + '&pmc=' + encodeURIComponent(pmc) + '&item=' + encodeURIComponent(item) + '&user=' + ApplicationContext.IUserInfo().UserId + '&isApplic=' + isApplic;
    }
    ApplicationContext.MainFrame.loadPanelTab(m_pnlAdvancedSearch, href);

}
