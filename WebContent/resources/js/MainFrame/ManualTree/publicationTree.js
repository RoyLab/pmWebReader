///////////////////////////////////////////////////////////////////////////////
//功能描述：出版物树类，支持多数据源切换
//作者：wuqifeng
//日期：2009-02-13
///////////////////////////////////////////////////////////////////////////////

//wanghai  目录树
function PublicationDirectoryTree() {
    var rootText = Scurity.Text;
    var normalTree;
    var snsTree;
    var curryCodeString='';
    var currytabId='';
    
    
    var treeNodeProvider = {
        data: [],
        getNodes: function() {
            return this.data;
        },
        setData: function(data) {
            this.data = data;
        },
        scope: this
    };

    var myTreeLoader = new Ext.tree.MyTreeLoader({
        treeNodeProvider: treeNodeProvider
    });

    function ajaxCallGetDataForTree(data) {
        try {
            var rootNode = pubDirectoryTree.getRootNode();
            var loader = pubDirectoryTree.getLoader();
            loader.updateTreeNodeProvider(data);
            loader.load(rootNode);
            rootNode.reload();
        }
        finally {
            pubDirectoryTree.body.unmask();
        }
    };

//    var btnExpandAll = new Ext.Toolbar.Button({
//        icon: 'resources/images/16x16/ExpandAll.gif',
//        cls: 'x-btn-icon',
//        tooltip: '<b>展开所有节点</b><br/>',
//        handler: function() { m_pnlTocTree.root.expand(true); }
//    });

//    var btnCollapseAll = new Ext.Toolbar.Button({
//        icon: 'resources/images/16x16/CollapseAll.gif',
//        cls: 'x-btn-icon',
//        tooltip: '<b>折叠所有节点</b><br/>',
//        handler: function() { m_pnlTocTree.root.collapse(true); }
//    });

    function ChangeDataSource(dataSource) {
        try {
            var rootNode = pubDirectoryTree.getRootNode();
            var loader = pubDirectoryTree.getLoader();
            //加载相同数据类型的树可以不设置Provider
            //loader.setTreeNodeProvider(treeNodeProvider);
            ajaxCallGetDataForTree(dataSource);
        }
        catch (e) {
        }
    };

    var pubDirectoryTree = new Ext.tree.TreePanel
        (
            {
                id: 'm_pnlDirectoryTree',
                //title: '内容目录',
                hideLabel:true,
                
                cmargins: '0 0 0 0',
                border: false,
                autoScroll: true,
                containerScroll: true,
                rootVisible: false,
                lines: true,
                //lines: false,
                //useArrows: true,
                //animCollapse: false,
                //animate: false,
                animate: false,
                animCollapse: true,
                iconCls: 'iconToc',
                collapseFirst: false,
                preloadChildren: true,
                clearOnLoad: true,
                maskDisabled: false,
                loader: myTreeLoader,
                
                
                autoHeight:false,
                
                
                root: new Ext.tree.AsyncTreeNode({
                    id: 'root',
                    text: rootText,
                    iconCls: 'iconManual',
                    expanded: true,
                    singleClickExpand: true,
                    draggable: false
                })//,
                //tbar: [top.m_btnTOCTrack, '-', btnExpandAll, btnCollapseAll, '-']//, loadTeachInfoTree, loadSnsTree]
            }
        );

    this.TreeControl = pubDirectoryTree;
    

    this.LoadDirectoryTree = function(codeString)
    {
            curryCodeString=codeString.toLowerCase();
            normalTree=GetDirectorySource(curryCodeString);
            
            if(normalTree!=undefined && normalTree!=null && normalTree.length!=0)
            {
                var afiObject;
                 ChangeDataSource(normalTree);
                
                var ietm=ApplicationContext.IMainFrame().GetActiveTabIETM();
                if(ietm!=undefined && ietm!=null)
                {
                  afiObject=ietm.Fault.GetValidProcArray();
                }
                
                if (afiObject!=undefined) {
                        if(afiObject[0]==undefined)
                        {
                            var isoprocid=afiObject;
                            pubDirectoryTree.expandAll();
                            var treeNodes=pubDirectoryTree.root.childNodes[0].childNodes;
                            for(var i=0;i<treeNodes.length;i++)
                            {
                                if (treeNodes[i].id!=isoprocid) {
                                    treeNodes[i].collapse();
                                }
                            }
                        }
                        else
                        {                            
                             GetDMPathById(afiObject,normalTree);
                        }
                }
            }
            else{
                this.unLoadDirectoryTree();
            }
         
         
         
    };
    
    this.unLoadDirectoryTree = function()
    {
        normalTree=[];
        ChangeDataSource(normalTree);
    };
    
    this.locateDirectoryTreeNode= function(result,isExpand)
    {
        if(normalTree==undefined)
            return;
            
        //var result=GetDMPathById(id,normalTree);
         var id=result.id;
        var path=result.path;
        var Node;

          if(path!='')
        {
            //pubDirectoryTree.expandAll();
            //pubDirectoryTree.expandPath(path);
            pubDirectoryTree.selectPath(path);
        }
    };
    
    this.getDataSource= function()
    {
        return normalTree;
    };
    
    
    function GetDMPathById(afiObject,toc){
        var result;
        var TreeNode;
        var childNode='';
        
        
         var CurrentAfiId;
         var NextAfiId;
         var isoprocid;
           
            isoprocid=afiObject[0].faultID;
           
            var afiTreeNode;
            var stepNode;
            var childNode;
            var ActionNode;
            var answerNode;
            
            for(var j=0;j<toc[0].children.length;j++)
            {
                afiTreeNode=toc[0].children[j];
                if (afiTreeNode.id==isoprocid) {
                    break;
                }
            }
            
            for(var i=0;i<afiTreeNode.children.length;i++)
            {
                    ActionNode=afiTreeNode.children[i];
                    for(var t=afiObject.length-1;t>=0;t--)
                    {
                        stepid=afiObject[t].goIsoProID;
                        var answerId=undefined;
                        if (afiObject[t+1]!=undefined) {
                            answerId=afiObject[t+1].goIsoProID;
                        }
                       
                       if(ActionNode.id==stepid)
                       {
                                stepNode=afiTreeNode.children[i];
                                if (stepNode.iconCls=="iconStep")
                                    if(t==afiObject.length-1) 
                                     stepNode.iconCls="iconSelectedStep";
                                    else
                                      stepNode.iconCls="iconSelectingStep";
                                     
                                if (answerId!=undefined) {
                                 if(ActionNode.children!=undefined)
                                        for(var k=0;k<ActionNode.children.length;k++)
                                        {
                                             answerNode=ActionNode.children[k];
                                             if(answerNode.children!=undefined)
                                                 for(var p=0;p<answerNode.children.length;p++)
                                                 {
                                                    if (answerNode.children[p].refid==answerId) {
                                                        if (answerNode.children[p].iconCls=="iconAnswer") 
                                                                answerNode.children[p].iconCls="iconSelectedAnswer";
                                                    }
                                                 }
                                        }
                                }
                                     
                                result='/root/'+toc[0].id+'/'+isoprocid+'/'+stepNode.id;
                                //pubDirectoryTree.selectPath(result);
                        }
                    }
            }
            
            pubDirectoryTree.expandAll();
            var treeNodes=pubDirectoryTree.root.childNodes[0].childNodes;
            for(var j=0;j<treeNodes.length;j++)
            {
                if (treeNodes[j].id!=isoprocid) {
                    treeNodes[j].collapse();
                }
            }
            pubDirectoryTree.selectPath(result);
    }
    
    function GetDirectorySource(codeString)
    {
        var result = false;
        var xmlResult;
        try {
            $.ajaxSetup({ async: false });
            xmlResult =Service.WebService.Post('GetDirectoryTree',{ dmc: codeString});
        }
        catch (e) {
            xmlResult == null;
        }
        finally {
            $.ajaxSetup({ async: true });
        }

        if (xmlResult != null && typeof xmlResult != 'undefined') {
            result =xmlResult.text;
        }
        return eval(result);
//        var DataSource=[];
//        for(var i=0;i<Scurity.CodeScurity.length;i++)
//        {
//            if(Scurity.CodeScurity[i][0].toLowerCase()==codeString.toLowerCase())
//            {
//               DataSource=Scurity.CodeScurity[i][1];
//               break;
//            }
//        }
//        return DataSource;
    }
    
};

//===================================================================== -->
function PublicationDirectoryTreeManager() {
    var publicationDirectoryTree = new PublicationDirectoryTree();
    var findCounter = 0;
  
     this.LoadDirectoryTree = function(codeString)
    {
        publicationDirectoryTree.LoadDirectoryTree(codeString);
    };
    
     this.unLoadDirectoryTree = function()
    {
        publicationDirectoryTree.unLoadDirectoryTree();
    };
    
    this.getDataSource= function()
    {
        return publicationDirectoryTree.getDataSource();
    };
    
    this.locateDirectoryTreeNode= function(codeString)
    {
                if(codeString!=undefined && codeString!='')
                {
                    publicationDirectoryTree.LoadDirectoryTree(codeString);
                }
        //publicationDirectoryTree.locateDirectoryTreeNode(id);
    };
    
    this.PublicationDirectoryTree = publicationDirectoryTree.TreeControl;
};
