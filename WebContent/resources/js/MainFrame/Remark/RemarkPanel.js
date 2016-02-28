///////////////////////////////////////////////////////////////////////////////
//功能描述：定义主框架视图south区域的备注面板，该面板用于展示备注
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');

         /**
         * 目的：创建south区域的备注面板类
         * @return  Ext.Panel对象，
         */
         
          MainFrame.PanelRemarkEditor=function(config)
            {
                MainFrame.PanelRemarkEditor.superclass.constructor.call(this, 
                {
                    m_PanelRemarkHandler:null,
                    region: config.region,
                    split: true,
                    title: '备注',
                    border: false,
                    style: 'border-top:1 solid;',
                    animCollapse: false,
                    collapsible: true,
                    collapseMode: 'mini',
                    collapsed: true,
                    titlebar: true,
                    height: 200,
                    minSize: 80,
                    maxSize: 300,
                    layout: 'fit',
                    iconCls: 'iconRemark'
                });
            }
            
            
            Ext.extend(MainFrame.PanelRemarkEditor,Ext.Panel,
            {
                initComponent : function ()
                {
                    this.m_PanelRemarkHandler=new MainFrame.RemarkHandler(this);
                    MainFrame.PanelRemarkEditor.superclass.initComponent.call(this);
                     
                    this.RemarkHandler=new Remark.RemarkHandler();
                    this.RemarkManager=this.RemarkHandler.m_EventHandler;                    
                    this.add(this.RemarkHandler);                    
                }
                
            }
        );