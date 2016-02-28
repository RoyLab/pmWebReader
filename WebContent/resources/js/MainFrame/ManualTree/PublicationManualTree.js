///////////////////////////////////////////////////////////////////////////////
//功能描述：出版物树类,对xytree的封装
//作者：wanghai
//日期：2009-12-16
///////////////////////////////////////////////////////////////////////////////


/*
 * 加命名空间MainFrm
 */
(function () {
    if (!window.MainFrm) {
     window.MainFrm = {};
    }
    
     if (!window.MainFrm.Tree) {
     window.MainFrm.Tree = {};
    }
})();

//=====================================================================begin TreeManager
/**
 * 树公共函数
 */
 
 /**
 *依据DMC定位
 * @param config  
 * @return XYtree节点
 */
MainFrm.Tree.BuildxyTreeNode=function (config) {
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
       	        //node1.iconCls= "iconPMNoChild";
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
 * @return DOM对象，是一个div
 */
MainFrm.Tree.PublicationTreeManager=function (config) {
    this.TOCdataSource;
    this.checked=config.checked;
    this.disabled=config.disabled;
    this.curryTree=new xyTree.DivTree(TOC.rootText);
    
    this.node_Click;
    
    if(config.dataType==1)
       this.TOCdataSource=TOC.classData;
    else
       this.TOCdataSource=TOC.snsTreeData;
       
    this._container;
}

/**
 * 展开树
 * @return void
 */
    MainFrm.Tree.PublicationTreeManager.prototype.expandAll=function () {
        this.curryTree.expandAll();
    };
    
    
 /**
 * 折叠树
 * @return void
 */
    MainFrm.Tree.PublicationTreeManager.prototype.collapseAll=function () {
        this.curryTree.collapseAll();
    };
    
 /**
 *依据DMC定位
 * @param dmc  用于定位的DMC
 * @return void
 */
    MainFrm.Tree.PublicationTreeManager.prototype.selectPathByDMC=function (dmc) {
         //得到节点
         var id;
         var node;
         var index;
         var nodeHtmlElement;
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
    MainFrm.Tree.PublicationTreeManager.prototype.selectPathById=function (id) {
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
    MainFrm.Tree.PublicationTreeManager.prototype.LoadTree = function(Container)
    {
        if(Container==undefined  || Container.children.length!=0)
            return;
          
        this._container= Container;
        if(this.curryTree.tree.root.child.length==0)
        {
            this.Build(this.TOCdataSource,this.curryTree);
            this.curryTree.tree.root.checked=-1;
            this.curryTree.tree.root.id="root";
            this.curryTree.tree.root.disabled=this.disabled;
            this.curryTree.tree.root.iconCls= "iconManual";
            this.curryTree.init(this.node_Click); 
            Container.appendChild(this.curryTree.div);
        }
    };
    
    
  /**
 *重新加载树
 * @param Container  加载树的容器
 * @return void
 */
    MainFrm.Tree.PublicationTreeManager.prototype.reLoadTree = function()
    {
            if(this._container==undefined)
                return;
            
            this.curryTree=new xyTree.DivTree(TOC.rootText);
            this.Build(this.TOCdataSource,this.curryTree);
            this.curryTree.tree.root.checked=-1;
            this.curryTree.tree.root.disabled=this.disabled;
            this.curryTree.tree.root.iconCls= "iconManual";
            this.curryTree.tree.root.id="root";
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
    MainFrm.Tree.PublicationTreeManager.prototype.Build=function(dataSource,xtree)
    {
        var checked=-1;
        
        for(var i=0;i<dataSource.length;i++)
        {
           var node=dataSource[i];
           //过滤
           var deny =  top.m_Filter.IsFilterDMC(node.codeString);
           if(deny>=0)
               continue;
           
            var xynode=MainFrm.Tree.BuildxyTreeNode({
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
    MainFrm.Tree.PublicationTreeManager.prototype.selNode=function()
    {
        return this.curryTree.tree.selectNode;
    };

//===================================================================== end PublicationTreeManager




/**
 * 创建选择树管理类
 * @param config
 * @return DOM对象，是一个div
 */
MainFrm.Tree.ClickPublicationTreeManager=function (config) {
    this.TOCdataSource;
    this.checked=config.checked;
    this.disabled=config.disabled;
    this.tocTree=new xyTree.DivTree(TOC.rootText);
    this.snsTree=new xyTree.DivTree(TOC.rootText);
    this.dmids=new Service.HashTable();        //记录选中的和要初始化的ID。
    
    this.node_Click;
}

 /**
 *加载手册树数据
 * @param Container  加载树的容器
 * @return void
 */
    MainFrm.Tree.ClickPublicationTreeManager.prototype.LoadtocTree = function(Container)
    {
        var isLoad=false;
        var root=this.tocTree.tree.root;
        
        if(Container==undefined)
            return;
            
        if(this.tocTree.tree.root.child.length==0)
        {
            isLoad=true;
            this.Build(TOC.classData,this.tocTree);
            root.checked=-1;
            root.id="root";
            root.disabled=this.disabled;
            root.iconCls= "iconManual";
            this.CheckedTree(this.tocTree.tree.root);
            this.tocTree.init(null);  
            Container.appendChild(this.tocTree.div);
        }
        else
        {
            var id;
            var nodes=this.snsTree.getNodesMoji();
            var ids=new Service.HashTable();
           for(var i=0;i<nodes.length;i++)
           {
                node=nodes[i];
                id=node.id;
                index=id.indexOf('#');
                if(index!=-1)
                    id=id.substring(0,index);
                    
                if (isLoad==false && !this.dmids.Contains(id)) 
                    isLoad=true;
                ids.Add(id,id);
            }
            
            if(isLoad)
            {
                this.dmids=ids;
                this.tocTree=new xyTree.DivTree(TOC.rootText);
                this.Build(TOC.classData,this.tocTree);
                root.checked=-1;
                root.disabled=this.disabled;
                root.id="root";
                root.iconCls= "iconManual";
                this.CheckedTree(this.tocTree.tree.root);
                this.tocTree.init(null);  
                Container.innerHTML="";
                Container.appendChild(this.tocTree.div);
            }

        }
        
        //解决开始是IE6中选不中的问题
         if(root.checked==1)
            root.checkbox.checked=true;
         for(var i=0;i<root.child.length;i++)
         {
            var node=root.child[i];
            if(node!=undefined && node.checked==1)
                node.checkbox.checked=true;
         }
    };
    
    
 /**
 *加载结构树数据
 * @param Container  加载树的容器
 * @return void
 */
    MainFrm.Tree.ClickPublicationTreeManager.prototype.LoadsnsTree = function(Container)
    {
        var isLoad=false;
        var root=this.snsTree.tree.root;
        
        if(Container==undefined)
            return;
            
        var id;
        var nodes=this.tocTree.getNodesMoji();
        var ids=new Service.HashTable();
        for(var i=0;i<nodes.length;i++)
        {
            node=nodes[i];
            id=node.id;
            index=id.indexOf('#');
            if(index!=-1)
                id=id.substring(0,index);
            if(isLoad==false && !this.dmids.Contains(id))
                isLoad=true;
            ids.Add(id,id);
        }
        
            
        if(this.snsTree.tree.root.child.length==0)
        {
            this.dmids=ids;
            this.Build(TOC.snsTreeData,this.snsTree);
            root.checked=-1;
            root.disabled=this.disabled;
            root.id="root";
            this.CheckedTree(this.snsTree.tree.root);
            this.snsTree.init(null); 
            Container.appendChild(this.snsTree.div); 
        }
        else
        {
            if(isLoad)
            {
                this.dmids=ids;
                this.snsTree=new xyTree.DivTree(TOC.rootText);
                this.Build(TOC.snsTreeData,this.snsTree);
                root.checked=-1;
                root.disabled=this.disabled;
                root.id="root";
                this.CheckedTree(this.snsTree.tree.root);
                this.snsTree.init(null);  
                Container.innerHTML="";
                Container.appendChild(this.snsTree.div);
            }
        }
        
        if(root.checked==1)
            root.checkbox.checked=true;
         for(var i=0;i<root.child.length;i++)
         {
            var node=root.child[i];
            if(node!=undefined && node.checked==1)
                node.checkbox.checked=true;
         }
      
    };


/**
 *将JASON数据转化成xytree能识别的数据
 * @param dataSource  jason数据源
 * @param xtree  xytree树数据
 * @return void
 */
    MainFrm.Tree.ClickPublicationTreeManager.prototype.Build=function(dataSource,xtree)
    {
        var checked=-1;
        
        for(var i=0;i<dataSource.length;i++)
        {
           var node=dataSource[i];
           if(this.checked)
           {
                var codestring='';
                checked=-1;
                codestring=node.codeString;
                if(codestring== undefined || codestring=='')
                    codestring=node.id;
                    
                if(this.dmids.Contains(codestring))
                    checked=1;
           }
           
             var xynode=MainFrm.Tree.BuildxyTreeNode({
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
 *确定树中节点的选择状态
 * @param xtreenode  树中的一个节点
 * @return void
 */
    MainFrm.Tree.ClickPublicationTreeManager.prototype.CheckedTree=function (xtreenode) {
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
    MainFrm.Tree.ClickPublicationTreeManager.prototype.setDMids=function (arr)
    {
        for(var i=0;i<arr.length;i++)
        {
            this.dmids.Add(arr[i],arr[i]);
        }
        
    };

/**
 *获取树选中的节点
 * @return 树中选中的ID
 */
    MainFrm.Tree.ClickPublicationTreeManager.prototype.GetDMids=function (treeType)
    {
        var ids=new Array();
        var id;
        var tree;
        if( treeType == MainFrm.Tree.TreeType.TOC)
        {
            tree = this.tocTree;
        }
        else
        {
            tree = this.snsTree;
        }
        
        var nodes=tree.getNodesMoji();
        for(var i=0;i<nodes.length;i++)
        {
            node=nodes[i];
            id=node.id;
            index=id.indexOf('#');
            if(index!=-1)
                id=id.substring(0,index);
            ids.push(id);
        }
        return  ids;
    };
    
    MainFrm.Tree.TreeType = {TOC : 0,SNS : 1};