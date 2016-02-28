///////////////////////////////////////////////////////////////////////////////
//功能描述：定义主框架视图对象树面板，
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame.Tree');
 
 MainFrame.Tree.TreeType={
    TOCTree:0,
    SNSTree:1
 }

 /**
 *目的：依据DMC定位
 * @param config  
 * @return XYtree节点
 */
MainFrame.Tree.BuildxyTreeNode=function (config) {
        var node1=new xyTree.Node(config.text);
        node1.id=config.id;
        node1.checked=config.checked;
        node1.disabled=config.disabled;
        node1.objectType=config.objectType;
           switch(config.objectType) {
           case "RefDM":
       	        node1.iconCls= "iconDM";
       	        break;
           case "PMEntry":
       	        //node1.iconCls= "iconPMNoChild";//不能可用，
       	        break;
           default:
                node1.iconCls= "iconManual";
           }
        node1.text=config.text;
        node1.codeString=config.codeString;
        node1.issno=config.issno;
        node1.language=config.language;
        return node1;
}


//=====================================================================end TreeManager

//=====================================================================begin PublicationTreeManager
/**
 * 创建树管理类
 * @param config
 * @return Ext.Panel对象
 */
MainFrame.Tree.PublicationTreeManager=function (config) {
    this.TOCdataSource;
    this.id='tree';
    this.checked=false;
    this.disabled=false;
    this.curryTree=new xyTree.DivTree(TOC.rootText);
    this._container;
    this.dmids=new Service.HashTable();        //记录选中的和要初始化的ID。
    this.node_Click;
    var title;
    var iconCls;
    if(config!=null)
    {
        if(config.id!=null)
            this.id=config.id;
        if(config.checked!=null)
            this.checked=config.checked;
        if(config.disabled!=null)
            this.disabled=config.disabled;
    }
    else{
        config.dataType=0;
    }
    switch(config.dataType)
    {
        case 0:
            this.TOCdataSource=TOC.classData;
            title="手册";
            iconCls='iconManual';
            break;
        case 1:
            this.TOCdataSource=TOC.snsTreeData;
            title="结构";
            iconCls='iconSNS';
            break;
//         case 2:
//            this.TOCdataSource=TOC.classData;
//            title="DM目录";
//            iconCls='iconDM';
//            break;
    }
    MainFrame.Tree.PublicationTreeManager.superclass.constructor.call(this, {
                id: this.id,
                border: false,
                layout: 'fit',
                title: title,
                autoScroll: true,
                iconCls: iconCls,
                tbar : []
        });        
}

Ext.extend(MainFrame.Tree.PublicationTreeManager,Ext.Panel,{
initComponent : function ()
{
    MainFrame.Tree.PublicationTreeManager.superclass.initComponent.call(this); 
    //this.addEvents("dataSourcebeforeLoad",true);
}, 
afterRender : function(container){
            MainFrame.Tree.PublicationTreeManager.superclass.afterRender.call(this);
            var current=this;
             var  m_btnTOCTrack = new Ext.Toolbar.Button({ id: 'm_btnTOCTrack', icon: 'resources/images/16x16/TOCTrack.png', cls: 'x-btn-icon', tooltip: '<b>定位</b><br/>与手册/结构同步', 
                   handler: function () {
                        var DMinfo=ApplicationContext.IMainFrame().GetActiveTabDMinfo();
                        if(DMinfo!=undefined && DMinfo.Dmc!=undefined)
                            current.selectPathByDMC(DMinfo.Dmc);
                   } 
                   });

                    var btnExpandAll = new Ext.Toolbar.Button({
                        icon: 'resources/images/16x16/ExpandAll.gif',
                        cls: 'x-btn-icon',
                        tooltip: '<b>展开所有节点</b><br/>',
                        handler: function() { 
                            current.expandAll(); 
                        }
                    });

                    var btnCollapseAll = new Ext.Toolbar.Button({
                        icon: 'resources/images/16x16/CollapseAll.gif',
                        cls: 'x-btn-icon',
                        tooltip: '<b>折叠所有节点</b><br/>',
                        handler: function() { 
                            if(1)
                            {
                            
                            }
                            current.collapseAll(); 
                        }
                    });   
            if(!this.checked)   
                this.topToolbar.add(m_btnTOCTrack);
            this.topToolbar.add(btnCollapseAll)
            this._container=this.body.dom;
            this.LoadTree(this._container);
        }
}
);

/**
 * 展开树
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.expandAll=function () {
        this.curryTree.expandAll();
    };
    
    
 /**
 * 折叠树
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.collapseAll=function () {
        this.curryTree.collapseAll();
    };
    
 /**
 *依据DMC定位
 * @param dmc  用于定位的DMC
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.selectPathByDMC=function (dmc) {
         //得到节点
         var id;
         var node;
         var index;
         var nodeHtmlElement;
         if(dmc==undefined || dmc==null || dmc=='')
            return;
            
         if(this.curryTree.tree.selectNode!=undefined)
         {
            id=this.curryTree.tree.selectNode.id;
            index=id.indexOf('#');
            if(index!=-1)
                id=id.substring(0,index);
            if(id==dmc)
                node=this.curryTree.tree.selectNode;
            else
                node  = this.curryTree.findOneNodeByDMC(dmc);
              
         }
         else
            node  = this.curryTree.findOneNodeByDMC(dmc);
         if(node)//展开，有异常自动终止
         { 
              //展开树节点，并且选择节点
              this.curryTree.expandNode(node);
              var Top=0;
              nodeHtmlElement=node.elNode;
              while (nodeHtmlElement) {
                  Top+=nodeHtmlElement.offsetTop;
                  nodeHtmlElement=nodeHtmlElement.offsetParent;
                  if(nodeHtmlElement==undefined || nodeHtmlElement.style.overflow=="auto")
                    break;
              }
              
              Height=this._container.clientHeight;
              if(Height+this._container.scrollTop<Top)
                this._container.scrollTop=Top-Height/2;
              else if(Top<this._container.scrollTop)
               {
                    if(Top>Height/2)
                        this._container.scrollTop=Top-Height/2;
                    else
                        this._container.scrollTop=Top-20;
               }
         } 
           
         return node;
    };
    
 /**
 *依据ID定位
 * @param id  用于定位的ID
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.selectPathById=function (id) {
         //得到节点
         var cid;
         var node;
         var index;
         if(this.curryTree.tree.selectNode!=undefined)
         {
            cid=this.curryTree.tree.selectNode.id;
            if(cid==id)
              node=this.curryTree.tree.selectNode;
            else
              node  = this.curryTree.findOneNodeById(id);
         }
         else
            node  = this.curryTree.findOneNodeById(id);
            
         if(node)//展开，有异常自动终止
         {
              this.curryTree.expandNode(node);
              var Top=0;
              nodeHtmlElement=node.elNode;
              while (nodeHtmlElement) {
                  Top+=nodeHtmlElement.offsetTop;
                  nodeHtmlElement=nodeHtmlElement.offsetParent;
                  if(nodeHtmlElement==undefined || nodeHtmlElement.style.overflow=="auto")
                    break;
              }
              
              Height=this._container.clientHeight;
              if(Height+this._container.scrollTop<Top)
                this._container.scrollTop=Top-Height/2;
              else if(Top<this._container.scrollTop)
               {
                    if(Top>Height/2)
                        this._container.scrollTop=Top-Height/2;
                    else
                        this._container.scrollTop=Top-20;
               }
         } 
          return node;
    };
    
 /**
 *加载树
 * @param Container  加载树的容器
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.LoadTree = function(Container)
    {
        if(Container==undefined  || Container.children.length!=0)
            return;
          
        this._container= Container;
        if(this.curryTree.tree.root.child.length==0)
        {
            this.Build(this.TOCdataSource,this.curryTree);
            this.curryTree.tree.root.checked=-1;
            this.curryTree.tree.root.id="root";
            this.curryTree.tree.root.objectType="PM"
            this.curryTree.tree.root.text=TOC.rootText;
            this.curryTree.tree.root.iconCls= "iconManual";
            if(this.checked)
            {
                this.CheckedTree( this.curryTree.tree.root);
                this.curryTree.init(null);
            }
            else
                this.curryTree.init(this.node_Click); 
            Container.appendChild(this.curryTree.div);
        }
    };
    
    
  /**
 *重新加载树
 * @param Container  加载树的容器
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.reLoadTree = function()
    {
            if(this._container==undefined)
                return;
            
            this.curryTree=new xyTree.DivTree(TOC.rootText);
            this.Build(this.TOCdataSource,this.curryTree);
            this.curryTree.tree.root.checked=-1;
            this.curryTree.tree.root.iconCls= "iconManual";
            this.curryTree.tree.root.objectType="PM"
            this.curryTree.tree.root.id="root";
            this.curryTree.tree.root.text=TOC.rootText;
            if(this.checked)
            {
                this.CheckedTree( this.curryTree.tree.root);
                this.curryTree.init(null);
            }
            else
                this.curryTree.init(this.node_Click); 
                
            this._container.innerHTML=""; 
            this._container.appendChild(this.curryTree.div);
    };
    
/**
 *将JASON数据转化成xytree能识别的数据
 * @param dataSource  jason数据源
 * @param xtree  xytree树数据
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.Build=function(dataSource,xtree)
    {
        var checked=-1;
        
        for(var i=0;i<dataSource.length;i++)
        {
           var node=dataSource[i];
           
            var codestring='';
            codestring=node.codeString;
            if(codestring!=undefined && codestring!='')
            {
                  //过滤
                if(ApplicationContext.FilterService.IsFilterDMC(codestring))
                    continue;
                        
                if(this.checked)
               {
                    checked=-1;
                    if(this.dmids.Contains(codestring))
                        checked=1;
               }
            }
            var xynode=MainFrame.Tree.BuildxyTreeNode({
                     text:node.text,
                     id:node.id,
                     checked:checked,
                     disabled:this.disabled,
                     objectType:node.objectType,
                     codeString:node.codeString,
                     issno:node.issno,
                     language:node.language
                    })
            xtree.add(xynode);
            if(node.children!=undefined)
                    this.Build(node.children,xynode)
        }
    };

/**
 * 返回当前选中的树上的节点
 * @param null
 * @return 当前选中节点
 */
    MainFrame.Tree.PublicationTreeManager.prototype.selNode=function()
    {
        return this.curryTree.tree.selectNode;
    };
    
    /**
 *确定树中节点的选择状态
 * @param xtreenode  树中的一个节点
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.CheckedTree=function (xtreenode) {
         var checked=-1;
         var tempchecked=-1;
         var node;
            if (xtreenode != null)
            {
                    if (xtreenode.child.length>0) 
                    {
                        for(var i=0 ;i<xtreenode.child.length;i++)
                        {
                            node=xtreenode.child[i];
                            switch(node.checked) 
                            {
                                    case -1:
                                    {
                                        if (node.child.length==0) 
                                        {
                                            node.checked=0;
                                            if(checked==-1)
                                                checked=0;
                                            else if(checked==1)
                                                checked=2;
                                        }
                                        else
                                        {
                                               tempchecked=this.CheckedTree(node);
                                               switch(tempchecked) 
                                               {
                                                    case -1:
                                                        checked=0;
                                           	        break;
                                                    case 0:
                                           	       {
                                                        if(checked==-1)
                                                            checked=0;
                                                        else if(checked==1)
                                                            checked=2;
                        	                            break;
                                                    }
                                                    case 1:
                                                        if(checked==-1)
                                                            checked=1;
                                                        else if(checked==0||checked==2)
                                                            checked=2;
                        	                            break;
                                                    case 2:
                                                        if(checked==-1)
                                                            checked=2;
                                                        else if(checked==0||checked==1)
                                                            checked=2;
                        	                            break;
                                                    default:
                                                        checked=0;
                                               }
                                        }
                        	            break;
                                    }
                                    case 0:
                                    {
                                        if(checked==-1)
                                            checked=0;
                                        else if(checked==1)
                                            checked=2;
                        	            break;
                                    }
                                    case 1:
                                        if(checked==-1)
                                            checked=1;
                                        else if(checked==0||checked==2)
                                            checked=2;
                        	            break;
                                    case 2:
                                        if(checked==-1)
                                            checked=2;
                                        else if(checked==0||checked==1)
                                            checked=2;
                        	            break;
                                    default:
                                        checked=0;
                            }
                        }
                        xtreenode.checked=checked;
                        return checked;
                    }
            }

    };

/**
 *设置初始化时树要选中的节点
 * @param arr  要选中的节点
 * @return void
 */
    MainFrame.Tree.PublicationTreeManager.prototype.SetCheckedNodesByDmcs=function (dmcArr)
    {
        for(var i=0;i<dmcArr.length;i++)
        {
            this.dmids.Add(dmcArr[i],dmcArr[i]);
        }
    };

/**
 *获取树选中的节点
 * @return 树中选中的ID
 */
    MainFrame.Tree.PublicationTreeManager.prototype.GetCheckedNodes=function ()
    {
        var ids=new Array();
        var id;
        var nodes=this.curryTree.getNodesMoji();
        return  nodes;
    };
    
     /**
     *获取树选中的指定类型的节点,供意见中使用
     * @return 树中选中的ID
     */
    MainFrame.Tree.PublicationTreeManager.prototype.GetCheckedObjectTypeNodes=function (objectType)
    {
        var resultArr = [];
        var checked=0;
        function getNodesdigui(arr, node) {
            if(node.parent!=undefined && !node.parent.zhankaiguo)
                checked=node.parent.checked;
            else
                checked=node.checked;
            if (checked == 0)
              ;
            else if (checked == 1 && node.level != 0 && node.objectType==objectType)
              arr.push(node);
            else if (checked == 1 && node.level != 0 && (node.objectType=='PM' || node.objectType=='RefPM'))
              ;
            else if (checked == 1 && node.level == 0)
              for (var i = 0; i < node.child.length ; i++)
                getNodesdigui(arr, node.child[i]);
            else
              for (var i = 0; i < node.child.length ; i++)
                getNodesdigui(arr, node.child[i]);
          }
          var resultArr = [];
          getNodesdigui(resultArr, this.curryTree.tree.root);
          return resultArr;
    };
     /**
     *清空选中的复选框
     *
     */
    MainFrame.Tree.PublicationTreeManager.prototype.ClearAllCheckedBox=function ()
    {
        this.curryTree.initClearAllCheckBox();
    };


//===================================================================== end PublicationTreeManager




