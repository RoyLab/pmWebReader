///////////////////////////////////////////////////////////////////////////////
//功能描述：定义主框架视图west区域的导航面板，该面板用于展示该面板用于展示
//          手册树，结构树，目录树，故障树，书签树，历史记录树
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
         /**
         * 目的：树的类型（常量）
         */
         MainFrame.TREETYPE={
            TOC:'m_pnlTocTreeContainer',
            SNS:'m_pnlSnsTreeContainer',
            DIRECTORY:'m_pnlDirectoryContainer'
         }

         /**
         * 目的：创建west区域的导航面板类
         * @return  Ext.Panel对象，
         */
           MainFrame.PanelNavigation=function(config)
            {
                MainFrame.PanelNavigation.superclass.constructor.call(this, 
                {
                    region: config.region,
                    id: 'west-panel',
                    title: '导航',
                    //collapsed: true,
                    titlebar: false,
                    //collapseMode: 'mini',
                    split: true,
                    width: 225,
                    minSize: 150,
                    maxSize: 500,
                    animCollapse: false,
                    collapsible: true,
                    //margins: '0 0 0 5',
                    layout: 'accordion',

                    layoutConfig:
                    {
                        autoWidth: false,
                        animate: true
                    }
                });
            }
         
          Ext.extend( MainFrame.PanelNavigation,Ext.Panel,
            {
                initComponent : function ()
                {
                       var m_navigationTreeHandler=new MainFrame.NavigationTreeHandler(this);
                       MainFrame.PanelNavigation.superclass.initComponent.call(this); 
                       this.addEvents({"DMInfoChanged":true});
                       
                       var curry=this;
                       this.navigationTreePanel=new MainFrame.NavigationTreePanel(function(node){
                            var dmInfo={Id:node.id,Text:node.text,IconCls:node.iconCls,ObjectType:node.objectType};
                            curry.fireEvent("DMInfoChanged",curry.navigationTreePanel.m_pnlNavTree.activeTab,dmInfo);
                            });
                       this.BookmarkPanel=this.initBookmarkPanel();
                       
                       this.navigationTreePanel.on("expand",function () {
                               var tab=this.m_pnlNavTree.activeTab;
                               m_navigationTreeHandler.TreeTab_Changed(tab);
                       });
                       
                       this.navigationTreePanel.on("Treetabchange",function (tab) {
                               m_navigationTreeHandler.TreeTab_Changed(tab);
                       });
                       
                         this.navigationTreePanel.on("DirectoryTreeclick",function (node, e) {
                                m_navigationTreeHandler.DirectoryTree_Click(node, e);
                       });
                       
                       if(!ApplicationContext.UserInfo.NavigationTree && !ApplicationContext.UserInfo.Bookmark && !ApplicationContext.UserInfo.VisitedHistory && !ApplicationContext.UserInfo.Search)
                          this.hide();
                       
                       if(!ApplicationContext.UserInfo.NavigationTree)
                          this.navigationTreePanel.hide();
                          
                          this.add(this.navigationTreePanel);   
                       
                       if(!ApplicationContext.UserInfo.Bookmark)
                          this.BookmarkPanel.hide();
                          
                          this.add(this.BookmarkPanel);  
                       
                       //初始化书签面板
                       this.VisitedHistoryPanel=new MainFrame.VisitedHistory();
                       this.VisitedHistoryPanel.on("click",function (node, e) {
                            //停止事件继续往下传递(Ext框架会默认为树增加树点击的处理事件)
                            e.stopEvent();
                            var dmInfo={Id:node.id,Href:node.attributes.href,TreeType:node.attributes.treeType};
                            curry.fireEvent("DMInfoChanged",curry.VisitedHistoryPanel,dmInfo);

                       });
                       this.SearchPanel=this.initSearchPanel();
                       
                       if(!ApplicationContext.UserInfo.VisitedHistory)
                        this.VisitedHistoryPanel.hide();
                          this.add(this.VisitedHistoryPanel);
                       
                       if(!ApplicationContext.UserInfo.Search)
                        this.SearchPanel.hide();
                          this.add(this.SearchPanel);   
                },
                
                initBookmarkPanel : function (){//初始化书签面板
                        var pnlBookmarkTreeConn = new Bookmark.BookmarkTreePanel();
                        var curry=this;
                        pnlBookmarkTreeConn.on("BookmarkSelected",function (dmInfo) {
                            curry.fireEvent("DMInfoChanged",this,dmInfo);
                        });
                        return pnlBookmarkTreeConn;
                },
                initSearchPanel : function (){//初始化组合查询面板
                       return new Ext.Panel({
                           id: 'm_pnlSearch',
                           border: false,
                           title: '组合查询',
                           autoScroll: true,
                           iconCls: 'iconSearch',
                           items:  new Search.SearchFormPanel()
                       });
                },
                LocateDirectoryTreeNode :function (dmc) {
                    tab =this.navigationTreePanel.m_pnlNavTree.activeTab;
                    var directoryTreeManager;
                    if(tab.id=="m_pnlDirectoryContainer")
                    {
                        directoryTreeManager=tab.DirectoryTreeManager;
                        directoryTreeManager.locateDirectoryTreeNode(dmc);  
                    }
                    
                },
                 UpdateVisitedHistory: function(url,text,id,tree) {
                            var root = this.VisitedHistoryPanel.root;
                            var iconCls='';
                            var objectType;
                            //添加新数据      
                            for(var i=0;i<root.childNodes.length;i++)
                            {
                                //通过访问的源来比较，访问记录一个DM只保留一条，如果通过ID,可能是链接
                                //访问到的 则ID可能和树上的ID不一致
                                if(id==root.childNodes[i].id ||root.childNodes[i].src==url)
                                {
                                    root.childNodes[i].remove();
                                }
                                
                            }
                        
                            if(url.indexOf('DMlist')==-1)
                            {
                                var index=url.indexOf('_');
                                var lastindex=url.lastIndexOf('_');
                                var v='';
                                if(index==lastindex)
                                    lastindex=url.lastIndexOf('.');
                                    
                                v=url.substring(index+1,lastindex);
                                
                                text= text+'(版本'+v+')';
                            }
                            
                              objectType=Service.RequestString("objectType",url);
                              switch(objectType) {
                                       case "":
       	                                    iconCls='iconDM'; 
       	                                    break;
                                       case "PMEntry":
       	                                    iconCls="iconPMNoChild";
       	                                    break;
                                       default:
                                            iconCls="iconManual";
                                       }
                                       
                            var node = new Ext.tree.TreeNode({text: text,id: id,iconCls:iconCls, leaf: true, href: url, "isClass": true, treeType: tree});
                            
                            node.src=url;
                            
                            if (root.firstChild == null) {
                                root.appendChild(node);
                            }
                            else {
                                root.insertBefore(node, root.firstChild);
                            }
                },
                LocateTreeNode :function (id) {
                    tab =this.navigationTreePanel.m_pnlNavTree.activeTab;
                    var index=id.indexOf('#');  
                    var locatedNode = null;                
                    if(tab.id=='m_pnlDirectoryContainer')
                    {
                        var codeString=id;
                        if (index!=-1) 
                            codeString=codeString.substring(0,index);
                            
                        tab.DirectoryTreeManager.LoadDirectoryTree(codeString);
                    }
                    else
                    {
                        //是否定位
                        if (ApplicationContext.IUserInfo().TreeAutoLocate) 
                        {
                            var node=tab.selNode();
                            if (index==-1) {
                                 if(node==undefined || node.codeString!=id)
                                        locatedNode = tab.selectPathByDMC(id);
                            }
                            else
                            {
                               if(node==undefined || (node.parent!=undefined && node.parent!=null &&!node.parent.displaychild) || node.id!=id)
                               {
                                    locatedNode = tab.selectPathById(id);
                               }
                            }
                        }
                    }
                    
                    return locatedNode;
                },
                ReLoadTree : function()
                {
                        var tabs=this.navigationTreePanel.m_pnlNavTree.items.items;
                        if(tabs!=undefined)
                        {
                            tabs[0].reLoadTree();
                            tabs[1].reLoadTree();
                        }
                },
                
                setVisibe : function(tree,bookmark,history,search)
                {
//                    if(!tree && !bookmark && !history && !search)
//                    {
//                        this.hide();
//                    }
//                    else
//                    {
//                        this.show();
//                        
//                        if(tree)
//                        {
//                            this.navigationTreePanel.show();
//                        }
//                        else
//                        {
//                            this.navigationTreePanel.hide();
//                        }
//                        
//                        if(bookmark)
//                        {
//                            this.navigationTreePanel.show();
//                        }
//                        else
//                        {
//                            this.navigationTreePanel.hide();
//                        }
//                    }
                        
                }
            }
        );
        
        
        
     
    
        