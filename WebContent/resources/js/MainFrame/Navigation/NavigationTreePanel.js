///////////////////////////////////////////////////////////////////////////////
//功能描述：定义导航树区域的多页签面板，
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
    
/**
 * 目的：创建导航树区域多页签面板类
 * @return  Ext.Panel对象，
 */
MainFrame.NavigationTreePanel= function(Node_Click){
        MainFrame.NavigationTreePanel.superclass.constructor.call(this, {
            TreeNode_Click:Node_Click,
            id: 'm_pnlNavContainer',
            layout: 'fit',
            border: false,
            title: '导航树',
            iconCls: 'iconToc'
        });
    };
    
    
    Ext.extend(MainFrame.NavigationTreePanel, Ext.Panel, {
        initComponent : function ()
        {
            MainFrame.NavigationTreePanel.superclass.initComponent.call(this);
            this.addEvents({"Treetabchange":true,"DirectoryTreeclick":true});
                         
            
            this.m_pnlNavTree = new Ext.TabPanel({
                    id: 'm_pnlNavTree',
                    border: false,
                    deferredRender: false,
                    tabPosition: 'bottom'
            });  
              
            this.loadPanel({id:'m_pnlTocTreeContainer',checked:false,disabled:false,dataType:MainFrame.Tree.TreeType.TOCTree});
            this.loadPanel({id:'m_pnlSnsTreeContainer',checked:false,disabled:false,dataType:MainFrame.Tree.TreeType.SNSTree});
            //this.loadPanel({id:'m_pnlDirectoryContainer',checked:false,disabled:false,dataType:3});
             
                
              var DirectoryTreeManager = new PublicationDirectoryTreeManager();
              var m_pnlDirectoryTree = DirectoryTreeManager.PublicationDirectoryTree;
              
               var m_pnlDirectoryContainer = new Ext.Panel
                (
                    {
                        id: 'm_pnlDirectoryContainer',
                        DirectoryTreeManager: DirectoryTreeManager,
                        m_pnlDirectoryTree:m_pnlDirectoryTree,
                        border: false,
                        layout: 'fit',
                        title: 'DM目录',
                        autoScroll: true,
                        iconCls: 'iconDM'
                    }
                );
              
              this.m_pnlNavTree.add(m_pnlDirectoryContainer);
              
              var curry=this;
              this.m_pnlNavTree.on("tabchange",function (tabPanel,tab) {
                   if(tab.id=='m_pnlDirectoryContainer' && tab.items.length==0)
                    {
                       tab.add(tab.m_pnlDirectoryTree);
                       tab.doLayout();
                    }
                  curry.fireEvent("Treetabchange",tab);
              });
              
             m_pnlDirectoryTree.on('click', function(node, e) {
                   curry.fireEvent("DirectoryTreeclick",node, e);
            });
              
        
            this.m_pnlNavTree.setActiveTab('m_pnlTocTreeContainer');
            this.add(this.m_pnlNavTree);
            
        },

        initEvents : function(){
            MainFrame.NavigationTreePanel.superclass.initEvents.call(this);
        },
        
        loadPanel : function(config){
            var tab = this.m_pnlNavTree.getComponent(config.id);
            if(tab){
                this.m_pnlNavTree.setActiveTab(tab);
            }else{
                var p = this.m_pnlNavTree.add(new MainFrame.Tree.PublicationTreeManager(config));
                if(this.TreeNode_Click!=null)
                    p.node_Click=this.TreeNode_Click;
                this.m_pnlNavTree.setActiveTab(p);
            }
        }
    });



