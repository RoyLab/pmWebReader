
//定义名称空间
Service.RegNameSpace('window.System');
 
/**
 * purpose:
 * @class 
 */
 System.ViewProfileEventHandler = function()
 {
    var ViewProfileWindow = new UserManager.ViewProfileWindow({
        SaveCallBackHandler: SaveCallback
    });
    
    function SaveCallback()
    {
        ViewProfileWindow.close();
    };
    
    ViewProfileWindow.show();
 }
 
 UserManager.ViewProfileWindow = Ext.extend(Ext.Window,{
        title: '界面显示设置',
        width: 250,
        height: 300,
        collapsible: false,
        closable: false,
        resizable: false,
        modal : true,
        defaults: {
            border: false
        },
        layout: 'fit',
        buttonAlign: 'center',
        iconCls: '.ViewProfile{background-image: url(../../images/16x16/View.png)}',
//        keys: [{
//            key: Ext.EventObject.ENTER,
//            fn: this.SaveProfile,
//            scope: this
//        }],

        cbToolBar: null,
        cbNavigationTree: null,
        cbBookmark: null,
        cbVisitedHistory: null,
        cbSearch: null,
        configStr:null,

        m_SaveCallback: null,

        constructor: function (config) {
            if (config != undefined && config != null) {
                m_SaveCallback = config.SaveCallBackHandler;
            }
            System.ProfileWindow.superclass.constructor.apply(this, arguments);
        },

        initComponent: function () {
            var ToolBar = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '工具栏',
                name: 'complexity',
                checked: false
            });
            this.cbToolBar = ToolBar;
            
            var NavigationTree = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '导航树',
                hideLabels: true,
                name: 'complexity',
                checked: true
            });
            this.cbNavigationTree = NavigationTree;

            var Bookmark = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '书签',
                name: 'complexity',
                checked: true
            });
            this.cbBookmark = Bookmark;
            
            var VisitedHistory = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '访问记录',
                name: 'complexity',
                checked: true
            });
            this.cbVisitedHistory = VisitedHistory;
            
            var Search = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '组合查询',
                name: 'complexity',
                checked: true
            });
            this.cbSearch = Search;
            
            

            var saveButton = new Ext.Button({
                text: '设置',
                scope: this,
                handler: function(){
                    if(formPanel.getForm().isValid())
                    {
                        this.Save();
                    }
                }
            });

            var cancelButton = new Ext.Button({
                text: '取消',
                scope: this,
                handler: function(){
                    this.close();
                }
            });
            
            var fontSize = new Ext.form.NumberField({
                fieldLabel: '字号',
                name: 'fontSize',
                allowNegative: false,
                allowDecimals: false,
                allowBlank: false,
                blankText: '不允许为空！',
                decimalPrecision: 0,
                minValue: 10,
                maxValue: 30,
                width:80,
                maxText: '最大值为30！',
                minText: '最小值为10！',
                maskRe: /\d/
            });
            this.tbfontSize=fontSize;
            
            var label = new Ext.form.Label({
                text:"以上设置需要重启服务以使设置生效"
            });

            var formPanel = new Ext.form.FormPanel({
                bodyStyle: 'padding-top:20px;padding-left:20px;padding-right:20px; background:transparent;',
                labelPad: 0,
                frame: false,
                hideLabels: true,
                header:false,
                defaults: {
                    selectOnFocus: true,
                    invalidClass: null,
                    msgTarget: 'side'
                },
                items: [this.cbToolBar,this.cbNavigationTree,this.cbBookmark,this.cbVisitedHistory,this.cbSearch,
                    {
                                xtype: 'fieldset',
                                title: '导航树字体大小，默认为12',
                                labelAlign: 'right',
                                labelWidth: 40,
                                width: 'auto',
                                items: [fontSize]
                    }
                    ,label
                ]
            });
            
            this.add(formPanel);
//            this.add(this.cbToolBar);
//            this.add(this.cbNavigationTree);
//            this.add(this.cbBookmark);
//            this.add(this.cbVisitedHistory)
//            this.add(this.cbSearch);
            this.addButton(saveButton);
            this.addButton(cancelButton);

            this.addListener("show",this.Initialize,this);
        },
        
        Initialize: function(){
            //todo:获取设置初始化勾选选项
            var appConfig;
            Service.WebService.Call('LoadViewProfile',
                null,
                function(result)
                {
                    appConfig=result.text;
                    
                },
                function(XmlHttpRequest, textStatus, errorThrow)
                {
                    
                });
            var app=appConfig.split('&');
                    this.cbToolBar.setValue(app[0]);
                    this.cbNavigationTree.setValue(app[1]);
                    this.cbBookmark.setValue(app[2]);
                    this.cbVisitedHistory.setValue(app[3]);
                    this.cbSearch.setValue(app[4]);
                    this.tbfontSize.setValue(app[5]);
        },
        
        Save: function(){
            //todo:保存设置
//            if(this.cbToolBar.getValue())
//            {
//                ApplicationContext.MainFrame.m_Wiever.Toolbar.SetToolbarVisible(true);
//            }
//            else
//            {
//                ApplicationContext.MainFrame.m_Wiever.Toolbar.SetToolbarVisible(false);
//            }
//            ApplicationContext.MainFrame.m_Wiever.Navigation.setVisibe(this.cbNavigationTree.getValue(),this.cbBookmark.getValue(),this.cbVisitedHistory.getValue(),this.cbSearch.getValue());
            var strConfig="ToolBar:" + this.cbToolBar.getValue() + "&NavigationTree:" + this.cbNavigationTree.getValue() + "&Bookmark:" + this.cbBookmark.getValue() + "&VisitedHistory:" + this.cbVisitedHistory.getValue() + "&Search:" + this.cbSearch.getValue() + "&TreeFontSize:" + this.tbfontSize.getValue();
            Service.WebService.Call('SaveViewProfile',
                {choice: strConfig},
                function(result)
                {
                    //SaveCallback(result);
                    m_SaveCallback(result);
                },
                function(XmlHttpRequest, textStatus, errorThrow)
                {
                    //SaveCallback(textStatus);
                    m_SaveCallback(textStatus);
                });
        },
        SaveCallback: function(result)
        {
            this.close();
        }
 });