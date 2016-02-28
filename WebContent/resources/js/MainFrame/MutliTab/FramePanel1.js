/////////////////////////////////////////////////////////////////////////////////
////功能描述：定义主框架视图center区域的多页签面板，该面板用于多页签展示HTML页面和别的Panel.
////作者：wanghai
////日期：2010-1-8
/////////////////////////////////////////////////////////////////////////////////
///*
// * 加命名空间
// */
// Service.RegNameSpace('window.MainFrame');
// 
// /**
// * 目的：创建用于加入到多页签的面板，该面板可以加载HTML页面 
// * @return  Ext.Panel对象，
// */
// 
// MainFrame.FramePanel=function (config) {
//        var id,cclass,title,iconCls,closable=true;
//        if (config!=null) {
//            id=config.Cls;
//            cclass=config.Cls;
//            title=config.title;
//            iconCls=config.iconCls;
//            if(config.closable!=undefined)
//                closable=config.closable;
//        }
//        MainFrame.FramePanel.superclass.constructor.call(this, {
//                m_frameHandler:null,
//                IETM:null,
//                Iframe:null,
//                id: id,
//                cclass : cclass,
//                dmID : null,
//                title:title,
//                iconCls:iconCls,
//                closable: closable,
//                autoScroll  : false,
//                bodyStyle   :{position:'relative'},
//                style: 'border-right:1 solid; border-bottom:1 solid;',
//                border: false,
//                tbar : [],
//                bbar : []
//        });        
// }
//Ext.extend(MainFrame.FramePanel,Ext.Panel, {
//    afterRender : function(container){
//            MainFrame.FramePanel.superclass.afterRender.call(this);
//                 this.Iframe=document.createElement("IFRAME");
//                 this.Iframe.frameBorder=0;
//                 this.Iframe.width="100%";
//                 this.Iframe.height="100%";
//                 this.Iframe.style.overflow="auto";
//                 var curry=this;
//                 this.Iframe.onreadystatechange=function()
//                 {
//                    switch(this.readyState)
//                    {
//                        case "loading":
//                        {
//                            break;
//                        }
//                        case "interactive":
//                        {
//                            break;
//                        }
//                        case 'complete': //IE
//                        {
//                            curry.fireEvent.defer(20,curry,["documentloaded",this]);
//                            break;
//                        }
//                    }
//                 }
//                 this.body.dom.appendChild(this.Iframe);
//                 
//            this.topToolbar.add(this.m_btnMetaData);
//            this.topToolbar.add(this.m_btnFindContent);
//            this.topToolbar.add(this.m_btnRefDM);
//            this.topToolbar.add(this.m_btnRefPM);
//            this.topToolbar.add(this.m_btnPreCondition);
//            this.topToolbar.add(this.m_btnSafeConfition);
//            this.topToolbar.add(new Ext.Toolbar.Fill());
//            this.topToolbar.add(this.m_lbldmc);
//            this.topToolbar.add(this.m_lblvesion);
//            this.topToolbar.add(this.m_lblClassification); 
//            
//            this.bottomToolbar.add(this.m_btnProcessMode);
//            this.bottomToolbar.add(this.m_btnStepMode);
//            this.bottomToolbar.add(this.m_btnAfiMode);
//            this.bottomToolbar.add(new Ext.Toolbar.Separator());
//            this.bottomToolbar.add(this.m_btnProcessUpStep);
//            this.bottomToolbar.add(this.m_btnProcessBackStep);
//            this.bottomToolbar.add(this.m_btnProcessReturnStep);
//            this.bottomToolbar.add(this.m_btnUpStep);
//            this.bottomToolbar.add(this.m_btnDownStep);
//            this.bottomToolbar.add(this.m_btnAfiUpStep);
//            this.bottomToolbar.add(this.m_btnAfiReport);
//            this.bottomToolbar.add(new Ext.Toolbar.Fill());
//            this.bottomToolbar.add(this.m_btnZoom);
//            this.bottomToolbar.add(this.m_sldZoom);
//    },
//    initComponent : function(){
//        MainFrame.FramePanel.superclass.initComponent.call(this);
//                this.m_frameHandler=new MainFrame.FrameHandler(this);
//                
//                this.addEvents({"documentloaded":true});
//                this.m_btnProcessMode = new Ext.Toolbar.Button({ id: 'm_btnProcessMode', hidden : true,text: '导航',icon: 'resources/images/16x16/Go.png', cls: 'x-btn-text-icon', tooltip: '<b>导航</b><br/>以导航的方式浏览数据模块的内容', enableToggle: true, toggleHandler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnProcessUpStep = new Ext.Toolbar.Button({ id: 'm_btnProcessUpStep', hidden : true,disabled:true,text: '上一步',icon: 'resources/images/16x16/PreStep.png', cls: 'x-btn-text-icon', tooltip: '<b>上一步</b><br/>导航到上一步', handler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnProcessBackStep = new Ext.Toolbar.Button({ id: 'm_btnProcessBackStep', hidden : true,disabled:true,text: '下一步', icon: 'resources/images/16x16/NextStep.png', cls: 'x-btn-text-icon', tooltip: '<b>下一步</b><br/>导航到下一步', handler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnProcessReturnStep = new Ext.Toolbar.Button({ id: 'm_btnProcessReturnStep', hidden : true,disabled:true,text: '返回', icon: 'resources/images/16x16/Return.png', cls: 'x-btn-text-icon', tooltip: '<b>返回</b><br/>导航返回', handler: this.m_frameHandler.FrameToolBar_Click});
//                
//                this.m_btnStepMode = new Ext.Toolbar.Button({ id: 'm_btnStepMode', hidden : true,text: '步进模式', icon: 'resources/images/16x16/StepMode.png', cls: 'x-btn-text-icon', tooltip: '<b>浏览/步进</b><br/>以浏览或步进的方式浏览数据模块的内容', enableToggle: true, toggleHandler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnUpStep = new Ext.Toolbar.Button({ id: 'm_btnUpStep', hidden : true,text: '上一步', disabled:true, icon: 'resources/images/16x16/UpStep.png', cls: 'x-btn-text-icon', tooltip: '<b>上一步</b><br/>导航到上一步', handler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnDownStep = new Ext.Toolbar.Button({ id: 'm_btnDownStep', hidden : true,text: '下一步', disabled:true, icon: 'resources/images/16x16/DownStep.png', cls: 'x-btn-text-icon', tooltip: '<b>下一步</b><br/>导航到下一步', handler: this.m_frameHandler.FrameToolBar_Click});
//                
//                this.m_btnAfiMode = new Ext.Toolbar.Button({ id: 'm_btnAfiMode', hidden : true,text: '开始隔离',  icon: 'resources/images/16x16/play.png', cls: 'x-btn-text-icon', tooltip: '<b>开始隔离</b><br/>开始隔离当前选中的故障', handler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnAfiUpStep = new Ext.Toolbar.Button({ id: 'm_btnAfiUpStep', hidden : true,disabled:true,text: '上一步',  icon: 'resources/images/16x16/UpStep.png', cls: 'x-btn-text-icon', tooltip: '<b>上一步</b><br/>导航到上一步', handler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnAfiReport = new Ext.Toolbar.Button({ id: 'm_btnAfiReport', text: '故障报告', hidden:true, icon: 'resources/images/16x16/History.png', cls: 'x-btn-text-icon', tooltip: '<b>下一步</b><br/>生成故障报告', handler: this.m_frameHandler.FrameToolBar_Click});

//                this.m_lblarytext = new Ext.form.Label({ id: 'm_lblarytext', text: '' });
//                
//                 this.m_btnMetaData = new Ext.Toolbar.Button({ id: 'm_btnMetaData',disabled:true, text: '', icon: 'resources/images/16x16/MetaData.png', cls: 'x-btn-text-icon', tooltip: '<b>数据模块状态</b><br/>查看当前数据单元的基本信息', handler: this.m_frameHandler.FrameToolBar_Click});
//                 this.m_btnFindContent = new Ext.Toolbar.Button({ id: 'm_btnFindContent',disabled:true, text: '', icon: 'resources/images/16x16/FindContent.png', cls: 'x-btn-text-icon', tooltip: '<b>查找</b><br/>查找当前DM的内容', handler: this.m_frameHandler.FrameToolBar_Click});
//                 
//                 this.m_lbldmc = new Ext.Toolbar.TextItem({ id: 'm_lbdmc1', text: ' ' });
//                 this.m_lblvesion = new Ext.form.Label({ id: 'm_lblvesion1', text: '' });
//                 this.m_lblClassification = new Ext.form.Label({ id: 'm_lblClassification1', text: '' });

//                 this.m_btnPreCondition = new Ext.Toolbar.Button({ id: 'm_btnPreCondition', icon: 'resources/images/16x16/PreCondition.png', cls: 'x-btn-icon', tooltip: '<b>前置要求</b><br/>查看当前数据模块的前置要求信息', handler: this.m_frameHandler.FrameToolBar_Click});
//                 this.m_btnSafeConfition = new Ext.Toolbar.Button({ id: 'm_btnSafeConfition', icon: 'resources/images/16x16/SafeConfition.png', cls: 'x-btn-icon', tooltip: '<b>安全条件</b><br/>查看当前数据模块的安全条件信息', handler: this.m_frameHandler.FrameToolBar_Click});
//                 this.m_btnRefPM = new Ext.Toolbar.Button({ id: 'm_btnRefPM',disabled:true, icon: 'resources/images/16x16/RefPM.png', cls: 'x-btn-icon', tooltip: '<b>PM引用</b><br/>查看当前数据单元被哪些出版物引用', handler: this.m_frameHandler.FrameToolBar_Click});
//                 this.m_btnRefDM = new Ext.Toolbar.Button({ id: 'm_btnRefDM',disabled:true, icon: 'resources/images/16x16/RefDM.png', cls: 'x-btn-icon', tooltip: '<b>DM引用</b><br/>查看当前数据单元被哪些数据模块引用', handler: this.m_frameHandler.FrameToolBar_Click});
//                 
//                this.m_btnZoom = new Ext.Toolbar.Button({ id: 'm_btnZoom', icon: 'resources/images/16x16/Zoom.png', cls: 'x-btn-text-icon', tooltip: '<b>100%</b><br/>恢复页面缩放比例为100%', handler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnZoomMinus = new Ext.Toolbar.Button({ id: 'm_btnZoomMinus', icon: 'resources/images/16x16/Minus.png', cls: 'x-btn-icon', tooltip: '<b>缩小</b><br/>', handler: this.m_frameHandler.FrameToolBar_Click});
//                this.m_btnZoomPlus = new Ext.Toolbar.Button({ id: 'm_btnZoomPlus', icon: 'resources/images/16x16/Plus.png', cls: 'x-btn-icon', tooltip: '<b>放大</b><br/>', handler: this.m_frameHandler.FrameToolBar_Click});
//                var current=this;
//                this.m_sldZoom = new Ext.Slider
//                ({
//                    width: 140,
//                    minValue: 20,
//                    maxValue: 300,
//                    value: 100,
//                    increment: 10,

//                    listeners:
//                    {
//                        change: function(slider, newValue) {
//                            var zoom = String.format('{0}%', this.getValue());
//                            current.m_btnZoom.setText(zoom);
//                            if (current.getFrameDocument())
//                                current.getFrameDocument().body.style.zoom = zoom;
//                        }
//                    }
//                });
//    },
//    setSrc : function(href)
//    {   
//       this.Iframe.src=href;
//    },
//    scrollToMember : function(member){
//        if(this.IETM!=undefined && this.IETM.Reference!=undefined)
//            this.IETM.Reference.InsideXref("#"+member);
//    },
//    hlMember : function(member){
//        var el = Ext.fly(this.cclass + '-' + member);
//        if(el){
//            el.up('tr').highlight('#cadaf9');
//        }
//    },
//    getFrameWindow : function()
//    {
//        return this.Iframe.contentWindow;
//    },
//    getFrameDocument : function()
//    {
//        return this.Iframe.contentWindow.document;
//    },
//    getFrameBody : function()
//    {
//         return this.Iframe.contentWindow.document.body;
//    }
//});