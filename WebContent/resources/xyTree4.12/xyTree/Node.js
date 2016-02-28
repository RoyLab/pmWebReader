/**
 * @fileoverview 这是复选框树的3个文件中的一个，表示树的一个节点。
 * @author xieye
 * @version 4.1  2007/06/17
 */
  
/*
 * 加命名空间xyTree
 */
(function() {
  if (!window.xyTree)
    window.xyTree = {};
})();

/**
 * 复选框树节点的构造方法
 * 必须按深度遍历的方法给树添加节点
 * 给节点设img属性可以自由添加自定义图片，图片最好是16*16
 * 可以给节点设一些业务需要的自定义的属性，用脚本的好处^-^，
 *   但是不能是构造方法里定义的如parent，child，tree等
 * @class 这个类构造一个复选框树的节点的实例
 * @constructor
 * @param {String} name 节点名称，会显示在屏幕上
 */
xyTree.Node = function(name) {
  /**
   * 节点的显示名称
   * @type String
   */
  this.name = name ;        
  
  /**
   * 节点的父节点
   * @type xyTree.Node
   */
  this.parent;

  /**
   * 节点的前一个节点
   * @type xyTree.Node
   */
  this.previous;

  /**
   * 节点的下一个节点
   * @type xyTree.Node
   */
  this.next;

  /**
   * 节点的子节点
   * @type Array:xyTree.Node
   */
  this.child = [];

  /**
   * 节点的级别，根节点为0
   * @type int
   */
  this.level = 0;
  
  /**
   * 节点数组对象，想要获得DivTree对象要用tempNode.tree.divtree
   * @type int
   */
  this.tree;

  /**
   * 节点在树中的序号，根节点为0
   * @type int
   */
  this.xuhao = 0;

  /**
   * 子节点正在显示吗？表示当前状态
   * @type boolean
   */
  this.displaychild = false;
	
  /**
   * 节点的复选框状态，0:不中， 1：选中， 2：部分,  -1: 无复选框
   * @type int
   */
  this.checked = -1;
  
  
  /**
   * 节点是否可用
   * @type bool
   */
  this.disabled = false;
  this.objectType;
  this.iconCls;
  this.codeString;
  this.issno;
  this.language;
   /**
   * 节点对应的DM类型
   * @type string
   */
  this.objectType;

  /**
   * 节点展开过的历史记录，一旦变true，无法改变，除非调树的改形状函数
   * @type boolean
   */
  this.zhankaiguo = false;

  /**
   * 节点的用户定义图标，可选属性
   * @type String
   */
  this.img;
  
    this.timecolor = 7;
  
    this.childIndent;
    this.wrap;
    this.elNode;
    this.ctNode;
    this.indentNode;
    this.ecNode;
    this.iconNode;
    this.checkbox;
    this.anchor;
    this.textNode;
    this.c1;
    this.c2;
    this.ecc='x-tree-ec-icon x-tree-elbow';
    this.emptyIcon = Ext.BLANK_IMAGE_URL;
    
    this.wasLeaf=true;
}

/**
 * 调试用
 */
xyTree.Node.prototype.toString = function() {
  var s = '[' + this.id + ']=[' + this.name + ']';
  return s;
};



/**
 * 创建节点的DOM对象
 * 这里的逻辑是最复杂的，插入行，结构见上面
 * @private
 * @return DOM对象，是一个div
 * @type HTMLElement:div
 */
 xyTree.Node.prototype={
  isExpandable:function(){
    var expand=false;
    if(this.child.length!=0 || this.objectType=="PMEntry")
        expand=true;
    return expand;
  },
 
  isLast:function(){
    if(this.parent)
    {
        var len=this.parent.child.length;
        return this.parent.child[len-1]==this;
    }
    else
        return true;
 },
 
   onDisableChange : function(node, state){
        this.disabled = state;
		if (this.checkbox) {
			this.checkbox.disabled = state;
		}        
        if(state){
            this.addClass("x-tree-node-disabled");
        }else{
            this.removeClass("x-tree-node-disabled");
        } 
    },

    
    onSelectedChange : function(state){
        if(state){
            this.focus();
            this.addClass("x-tree-selected");
        }else{
            
            this.removeClass("x-tree-selected");
        }
    },

   updateExpandIcon:function(){
            var n = this, c1, c2;
            var cls =  n.isLast() ? "x-tree-elbow-end" : "x-tree-elbow";
                    if(n.isExpandable())
                    {
                            if(n.displaychild){
                                cls += "-minus";
                                c1 = "x-tree-node-collapsed";
                                c2 = "x-tree-node-expanded";
                            }
                            else if(n.child.length!=0)
                            {
                                cls += "-plus";
                                c1 = "x-tree-node-expanded";
                                c2 = "x-tree-node-collapsed";
                            }
                            else{
                                c1 = "x-tree-node-expanded";
                                c2 = "x-tree-node-collapsed";
                            }
                            if(this.wasLeaf){
                                if(this.elNode)
                                    Ext.fly(this.elNode).removeClass("x-tree-node-leaf");  
                                this.wasLeaf = false;
                            }
                            if(this.c1 != c1 || this.c2 != c2){
                                Ext.fly(this.elNode).replaceClass(c1, c2);
                                this.c1 = c1; this.c2 = c2;
                            }
                    }
                    else
                    {
                        if(!this.wasLeaf)
                        {
                            Ext.fly(this.elNode).replaceClass("x-tree-node-expanded", "x-tree-node-leaf");
                            delete this.c1;
                            delete this.c2;
                            this.wasLeaf = true;
                        }
                    }
            var ecc = "x-tree-ec-icon "+cls;
            if(this.ecc != ecc){
                this.ecNode.className = ecc;
                this.ecc = ecc;
            }
    },
 
  getChildIndent:function(){
        if(!this.childIndent){
            var buf = [];
            var p = this;
            while(p){
                if(!p.isLast()) {
                    buf.unshift('<img src="'+this.emptyIcon+'" class="x-tree-elbow-line" />');
                } else {
                    buf.unshift('<img src="'+this.emptyIcon+'" class="x-tree-icon" />');
                }
                p = p.parent;
            }
            this.childIndent = buf.join("");
        }
        return this.childIndent;
    },
    
    /**
 * 根据状态返回图片（复选框）
 * @param {int} checked 节点状态
 * @return 根据状态返回图片（复选框）
 * @type String
 */
  UpdateCheckBoxCss :function(checked) {
      if (checked == 0) {
        this.checkbox.indeterminate=false;
        this.checkbox.checked = false;
      }
      if (checked == 1) {
        this.checkbox.indeterminate=false;
        this.checkbox.checked = true;
      }
      if (checked == 2) {
        this.checkbox.indeterminate=true;
        this.checkbox.checked = true;
      }
  },

/**
 * 返回复选框图片，副作用：改变节点状态属性
 * @return 返回复选框图片
 * @type String
 */
 UpdateCheckBoxfuxuan :function() {
      if(this.level==0)
        this.UpdateCheckBoxCss(this.checked);
      else if (this.parent.checked == 2)
         this.UpdateCheckBoxCss(this.checked);
      else if (this.parent.checked == 1) {
        this.checked = 1;
        this.UpdateCheckBoxCss(1);
      } else {
        this.checked = 0;
        this.UpdateCheckBoxCss(0);
      }
 },

 
 
 /**
 * 递归创建节点的DOM对象
 * 
 * @private
 * @return DOM对象，是一个div
 * @type HTMLElement:div
 */
outerhtml : function() {
      var nodes=this.child;
        var buf=[];
        var i=0;
        var len=nodes.length;
        var current;
        var nodeUInodes;
        var len=nodes.length;
        
        for(i=0;i<len;i++)
        {
                current=nodes[i];
                var indentMarkup =current.parent ? current.parent.getChildIndent() : '';
                var cb = !(current.checked == -1);
                var href = current.href ? current.href : "#";
                
                var childbuf='';
                if( current.child.length!=0)
                    childbuf=current.outerhtml();
                
                buf[i] = ['<li xuhao="',current.xuhao,'" class="x-tree-node"><div  class="x-tree-node-el x-tree-node-leaf x-unselectable TreeFontSize ', current.cls,'" unselectable="on">',
                    '<span class="x-tree-node-indent">',indentMarkup,"</span>",
                    '<img  src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
                    '<img  src="', current.icon ||this.emptyIcon, '" class="x-tree-node-icon',(current.icon ? " x-tree-node-inline-icon" : ""),(current.iconCls ? " "+current.iconCls : ""),'" unselectable="on" />',
                    cb ? ('<input class="x-tree-node-cb" type="checkbox"/>') : '',
                    '<a  hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
                     current.hrefTarget ? ' target="'+current.hrefTarget+'"' : "", '><span unselectable="on">',current.name,"</span></a></div>",
                    '<ul class="x-tree-node-ct" style="display:block;">',
                     childbuf,
                    '</ul>',
                    "</li>"].join('');
         }
         
         return buf.join('');
 },
 
 initNodesUI: function(nodeUInodes) {
     var nodeUInodes;
     var nodeUI;
     var current;
     var xuhao;
     var arr = this.tree.treeArray;
     for(var i=0;i<nodeUInodes.length;i++)
     {
                nodeUI=nodeUInodes[i];
                xuhao=nodeUI.attributes.xuhao.value;
                current=arr[xuhao];
                var cb = !(current.checked == -1);
                current.wrap =nodeUI;
                current.elNode = current.wrap.childNodes[0];
                current.ctNode = current.wrap.childNodes[1];
                var cs = current.elNode.childNodes;
                current.indentNode = cs[0];
                current.ecNode = cs[1];
                current.iconNode = cs[2];
                var index = 3;
                if(cb){
                    current.checkbox = cs[3];
                    current.checkbox.disabled=this.disabled;
                    current.UpdateCheckBoxfuxuan();
	                current.checkbox.onclick= function() {
	                    var current=arr[this.parentNode.parentNode.attributes.xuhao.value];
                        if (current.checked == 1 || current.checked == 2) 
                            current.checked = 0;
                        else 
                            current.checked = 1;
                        current.UpdateCheckBoxCss(current.checked);
                        current.upDigui(current);
                        current.downDigui(current);
                    }		
                    index++;
                }
                current.anchor = cs[index];
                current.textNode = cs[index].firstChild;
                
                current.displaychild=true;
                current.zhankaiguo=true;
                current.wasLeaf=true;
                current.ecc=undefined;
                current.c1=undefined;
                current.c2=undefined;
                current.childIndent=undefined;
                current.updateExpandIcon();
                 
                //节点事件
                current.elNode.onmouseover=function(){ Ext.fly(this).addClass('x-tree-node-over');};
                current.elNode.onmouseout=function(){ Ext.fly(this).removeClass('x-tree-node-over');};
                //图片事件
                current.iconNode.onclick = function() {this.previousSibling.onclick(); return false;};
                
                //链事件
                current.anchor.onclick = function() {                     
                     var current=arr[this.parentNode.parentNode.attributes.xuhao.value];
                     current.tree.divtree.clickNode(current);
                     var selnode=current.tree.selectNode;
                     if(selnode)
                        Ext.fly(selnode.elNode).removeClass('x-tree-selected');
                     current.tree.selectNode=current;
                        Ext.fly(current.elNode).addClass('x-tree-selected');
                 };

                 
                //减号和加号事件  
                current.ecNode.onclick = function() { 
                //xieye：状态在全局变量节点中，
                //xieye：这里要判断，如果本节点无子节点
                var current=arr[this.parentNode.parentNode.attributes.xuhao.value];
                var fu = this.parentNode.nextSibling;              	
                if (current.child.length == 0) {/*alert('无子节点');*/return;}
                var shimowei = current.next?false:true; //判断是否末尾
                   if (!current.displaychild) { //如果节点的子节点未打开
                      //alert('准备打开');
                      current.displaychild = true;
                      current.updateExpandIcon();
                          if (!current.zhankaiguo) { //所谓展开过是指它的子节点！
                            current.zhankaiguo = true;
                            current.addNodesUI('inner',fu);	
                          fu.style.display = 'block';
                          } else {
                              fu.style.display = 'block';
                          }
                    } else { //如果节点的子节点打开了，准备收缩
                          //alert('准备收缩');
                          current.displaychild = false;
                          current.updateExpandIcon();
                          //xieye：把这个节点下面所有的div设为隐藏显示
                          fu.style.display = 'none';
                    }
                    return false;
              };
              
              if(current.ctNode!=undefined)
                 this.initNodesUI(current.ctNode.childNodes);
     }
    
 },
 
 addAllNodesUI: function() {
     nodeUInodes=xyTree.insertHtml('inner',this.tree.root.ctNode,this.tree.root.outerhtml());
     this.initNodesUI(nodeUInodes);
 },

/**
 * 创建节点的DOM对象
 * 这里的逻辑是最复杂的，插入行，结构见上面
 * @private
 * @return DOM对象，是一个div
 * @type HTMLElement:div
 */
 addNodesUI: function(where,el) {
     
      //div.className = 'qiguai'; //做标记，寻找方便
        var nodes=this.child;
        var buf=[];
        var i=0;
        var len=nodes.length;
        var current;
        var nodeUInodes;
        var len=nodes.length;
        
        for(i=0;i<len;i++)
        {
                current=nodes[i];
                if(this.emptyIcon==undefined || this.emptyIcon==null)
                    this.emptyIcon = Ext.BLANK_IMAGE_URL;
                    
                var indentMarkup =current.parent ? current.parent.getChildIndent() : '';
                var cb = !(current.checked == -1);
                var href = current.href ? current.href : "#";
                
                try{
                    
                    buf[i] = ['<li xuhao="',current.xuhao,'"  class="x-tree-node"><div  class="x-tree-node-el x-tree-node-leaf x-unselectable TreeFontSize ', current.cls,'" unselectable="on">',
                        '<span class="x-tree-node-indent">',indentMarkup,"</span>",
                        '<img   src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
                        '<img  src="', current.icon || this.emptyIcon, '" class="x-tree-node-icon',(current.icon ? " x-tree-node-inline-icon" : ""),(current.iconCls ? " "+current.iconCls : ""),'" unselectable="on" />',
                        cb ? ('<input class="x-tree-node-cb" type="checkbox"/>') : '',
                        '<a  hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
                         current.hrefTarget ? ' target="'+current.hrefTarget+'"' : "", '><span unselectable="on">',current.name,"</span></a></div>",
                        '<ul class="x-tree-node-ct" style="display:none;"></ul>',
                        "</li>"].join('');
                    }
                    catch(e)
                    {
                        buf[i]='';
                    }
         }
         
         nodeUInodes=xyTree.insertHtml(where,el,buf.join(''));
         
         var arr = this.tree.treeArray;
         for(var j=0;j<nodeUInodes.length;j++)
         {
                nodeUI=nodeUInodes[j];
                xuhao=nodeUI.attributes.xuhao.value;
                current=arr[xuhao];
                var cb = !(current.checked == -1);
                current.wrap =nodeUI;
                current.elNode = current.wrap.childNodes[0];
                current.ctNode = current.wrap.childNodes[1];
                var cs = current.elNode.childNodes;
                current.indentNode = cs[0];
                current.ecNode = cs[1];
                current.iconNode = cs[2];
                var index = 3;
                current.updateExpandIcon();
                if(cb){
                    current.checkbox = cs[3];
                    current.checkbox.disabled=this.disabled;
                    current.UpdateCheckBoxfuxuan();
	                current.checkbox.onclick= function() {
	                    var current=arr[this.parentNode.parentNode.attributes.xuhao.value];
                        if (current.checked == 1 || current.checked == 2) 
                            current.checked = 0;
                        else 
                            current.checked = 1;
                        current.UpdateCheckBoxCss(current.checked);
                        current.upDigui(current);
                        current.downDigui(current);
                    }		
                    index++;
                }
                current.anchor = cs[index];
                current.textNode = cs[index].firstChild;
                
               
                 
                //节点事件
                current.elNode.onmouseover=function(){ Ext.fly(this).addClass('x-tree-node-over');};
                current.elNode.onmouseout=function(){ Ext.fly(this).removeClass('x-tree-node-over');};
                //图片事件
                current.iconNode.onclick = function() {this.previousSibling.onclick(); return false;};
                
                //链事件
                current.anchor.onclick = function() {
                     var current=arr[this.parentNode.parentNode.attributes.xuhao.value];
                     current.tree.divtree.clickNode(current);
                     var selnode=current.tree.selectNode;
                     if(selnode)
                        Ext.fly(selnode.elNode).removeClass('x-tree-selected');
                     current.tree.selectNode=current;
                        Ext.fly(current.elNode).addClass('x-tree-selected');
                 };

                 
                //减号和加号事件  
                current.ecNode.onclick = function() { 
                //xieye：状态在全局变量节点中，
                //xieye：这里要判断，如果本节点无子节点
                var current=arr[this.parentNode.parentNode.attributes.xuhao.value];
                var fu = this.parentNode.nextSibling;              	
                if (current.child.length == 0) {/*alert('无子节点');*/return;}
                var shimowei = current.next?false:true; //判断是否末尾
                   if (!current.displaychild) { //如果节点的子节点未打开
                      //alert('准备打开');
                      current.displaychild = true;
                      current.updateExpandIcon();
                      fu.style.display = 'block';
                      if (!current.zhankaiguo) { //所谓展开过是指它的子节点！
                            current.zhankaiguo = true;
                            current.addNodesUI('inner',fu);	
                          } 
                    } else { //如果节点的子节点打开了，准备收缩
                          //alert('准备收缩');
                          current.displaychild = false;
                          current.updateExpandIcon();
                          //xieye：把这个节点下面所有的div设为隐藏显示
                          fu.style.display = 'none';
                    }
                    return false;
              };
        }
    }

}



/**
 * 确定复选框的状态，并向下递归
 * @param {xyTree.Node} node 对这个参数节点递归，调用对象节点没用
 */
xyTree.Node.prototype.downDigui = function(node) {
  function downDigui2(node2) {
    node2.checked = node2.parent.checked;
	  node2.UpdateCheckBoxCss(node2.checked);
    //node2.getHtmlElementfuxuanimg().src = node2.getimgbyyangshi(node2.parent.checked);
    if (node2.level == node2.tree.maxlevel) return;
   	
    if (!node2.displaychild  && !node2.zhankaiguo) return;//注意到这里不同的地方！
    for (var i = 0; i < node2.child.length; i++)
      downDigui2(node2.child[i]);
  }
  
  if (node.level == node.tree.maxlevel) return;
  //如果子节点不在显示并且子节点不存在内存 就返回
  if (!node.displaychild && !node.zhankaiguo) return;//注意这句话！
  for (var j = 0; j < node.child.length; j++)
    downDigui2(node.child[j]);
}

/**
 * 确定复选框的状态，并向上递归
 * @param {xyTree.Node} node 对这个参数节点递归，调用对象节点没用
 */
xyTree.Node.prototype.upDigui = function(node) {
  if (node.level == 0) return;
  var boo = true;  //先假定节点状态全部一样
  var boo2 = false;
  var parentyangshi = node.parent.checked;            //父节点样式，可能是0，1，2
  var yangshi = node.checked;          //获得当前节点的样式,记住不可能是局部，只会是0或1
  	
  var arr = node.parent.child;
  for (var i = 0; i < arr.length; i++) {
    var tempyangshi = arr[i].checked;
    if (tempyangshi != yangshi) {
      boo = false;
      break;	
    }	
  }
  //如果boo=false，说明有不同，父节点选2，看一样不一样，来决定是否递归
  //如果boo=true,说明是相同，父节点选当前样式，看一样不一样，来决定是否递归
  if (!boo) {
    node.parent.checked = 2;
  } else {
    node.parent.checked = yangshi;
  }
	node.parent.UpdateCheckBoxCss(node.parent.checked);
//  node.parent.getHtmlElementfuxuanimg().src = 
//    this.getimgbyyangshi(node.parent.checked); //这是改html样式
  if (node.parent.checked != parentyangshi)	//判断是否递归
    this.upDigui(node.parent);
}


/**
 * 返回祖先节点
 * @param {int} i 与目标节点的级别差
 * @return 返回祖先节点
 * @type xyTree.Node
 */
xyTree.Node.prototype.getparent = function(i) {
  function getparentdigui(i,node) {
    var node = node.parent;
    i--;
    if (i == 0)
      return node;
    return getparentdigui(i, node);
  }
  return getparentdigui(i, this);
}

/**
 * 根据父节点返回竖线还是空格，是一行div中最前面的图片
 * @param {xyTree.Node} node 当前节点
 * @return 返回竖线还是空格的图片
 * @type String
 */
xyTree.Node.prototype.getimgkongge = function(node) {
  //父节点不是末尾 ? 图片1 : 图片2
  return (node.next) ? xyTree.TreeConfig.iIcon : xyTree.TreeConfig.blankIcon;
}

/**
 * 返回加号位置的图片，4种情况
 * (1)有子节点，不是末尾
 * (2)有子节点，是末尾
 * (3)无子节点，不是末尾
 * (4)无子节点，是末尾
 * @return 返回加号位置的图片
 * @type String
 */
xyTree.Node.prototype.getimgjiahao = function() {
  var s;
  if (this.child.length > 0) { //有子节点
    if (this.next)  //不是末尾
      s = xyTree.TreeConfig.tPlusIcon;
    else           //是末尾   
      s = xyTree.TreeConfig.lPlusIcon;
  } else {                      //无子节点
    if (this.next)  //不是末尾
      s = xyTree.TreeConfig.tIcon;
    else           //是末尾   
      s = xyTree.TreeConfig.lIcon;
  }
  return s;
}

/**
 * 返回加号位置的图片，不过是点击后判断,注意是4种图标
 * @param {boolean} img1 节点的子节点是否正在显示
 * @param {boolean} node 节点是否在末尾
 * @return 返回加号位置图片
 * @type String
 */
xyTree.Node.prototype.getimgdianji = function(img1, mowei) {
  var s;
  if (mowei)                      //在末尾
    //正在展开 ? 变为减 : 变为加
    s = img1 ? xyTree.TreeConfig.lMinusIcon : xyTree.TreeConfig.lPlusIcon;
  else                            //不在末尾
    //正在展开 ? 变为减 : 变为加
    s = img1 ? xyTree.TreeConfig.tMinusIcon : xyTree.TreeConfig.tPlusIcon;
  return s;
}

/**
 * 返回缺省文件夹图片
 * @return 返回文件夹图片
 * @type String
 */
xyTree.Node.prototype.getimgfold = function() {
  //xieye：有3种，开文件夹，闭文件夹，一张纸
  if (this.img)
    return this.img;
  var s;
  if(this.level != 0){
	  if (this.child.length > 0) //有子节点
	    if (this.displaychild)//子节点在显示
	      s = xyTree.TreeConfig.openFolderIcon;
	    else                  //子节点不在显示 
	      s = xyTree.TreeConfig.folderIcon;
	  else                       //无子节点
	    s = xyTree.TreeConfig.fileIcon;  
  }else{
	      s = xyTree.TreeConfig.openFolderIcon;
  }
  return s;
}

/**
 * 根据状态返回图片（复选框）
 * @param {int} checked 节点状态
 * @return 根据状态返回图片（复选框）
 * @type String
 */
xyTree.Node.prototype.getimgbyyangshi = function(checked) {
  if (checked == 0) return xyTree.TreeConfig.buzhongIcon;
  if (checked == 1) return xyTree.TreeConfig.quanzhongIcon;
  if (checked == 2) return xyTree.TreeConfig.jubuzhongIcon;
}

/**
 * 返回复选框图片，副作用：改变节点状态属性
 * @return 返回复选框图片
 * @type String
 */
xyTree.Node.prototype.getfuxuanimg = function() {
  if (this.parent.checked == 2)
    return this.getimgbyyangshi(this.checked);
  var s;
  if (this.parent.checked == 1) {
this.checked = 1;
    s = xyTree.TreeConfig.quanzhongIcon;
  } else {
    this.checked = 0;
    s = xyTree.TreeConfig.buzhongIcon;
  }
  return s;
}

/**
 * 渐变背景
 */
xyTree.Node.prototype.slowChange = function(timenum) {
  if(arguments.length == 1)
  xyTree.fun.slowChange(this.tree.divtree.xuhao,this.xuhao,timenum);
  else
  xyTree.fun.slowChange(this.tree.divtree.xuhao,this.xuhao);
  
}

/**
 * 页面上显示节点
 */
xyTree.Node.prototype.expand = function() {
  this.tree.divtree.expandNode(this);
}

/**
 * 页面上显示节点并打勾
 */
xyTree.Node.prototype.expandChecked = function() {
  this.tree.divtree.expandCheckedNode(this);
}

/**
 * 页面上展开子节点,谨慎使用
 * @private
 */
xyTree.Node.prototype.expandChilds = function() {
  //如果它不是叶节点，而且节点的状态是this.displaychild = false;
  //那么就单击
  if (this.displaychild || this.level == this.tree.maxlevel || this.child.length==0) 
    return;
  
  if(this.level == 0 )
     this.tree.divtree.showTreeBody();
  else
     this.ecNode.onclick();
}

/**
 * 返回节点链，0是根节点，最后是自己
 * @return 一个节点数组，从根节点开始，根节点的一个子节点，
 *         根节点的一个子节点的子节点……直到自己
 * @type Ayyay:xyTree.Node
 */
xyTree.Node.prototype.getNodeLink = function() {
  if(this.level == 0) return [this];
  
  var s = [];
  var node = this;
  s.unshift(node);
  ee(node);
  return s;
  //递归
  function ee(node){
    var parent = node.parent;
    s.unshift(parent);
    if (parent == node.tree.root) return;
    ee(parent);
  };
}

/**
 * 给节点添加子节点
 * @param {xyTree.Node} node 子节点
 */
xyTree.Node.prototype.add = function (node){
  //(1)设置自身的： child子节点，
  var chang = this.child.length;
  this.child[chang] = node;
  	
  //(2)要设置node的：parent，level，tree，不设置下一个节点，子节点
  node.parent = this;
  node.level = this.level + 1;
  node.tree = this.tree;
  	
  //(3)设置node的前一个节点的 ：next,     node的previous，
  if (chang > 0) {
    node.previous = this.child[chang - 1];
    node.previous.next = node;
  } 
  	
  //(4)设置树的treeArray[],     node的xuhao，
  chang =  node.tree.treeArray.length;
  node.tree.treeArray[chang] = node;
  node.xuhao = chang;
  	
  //(5)设置树的maxlevel;
  if (node.level > this.tree.maxlevel)
    this.tree.maxlevel = node.level;
};

/**
 * 给节点动态添加子节点,参数还可以是数组
 * @param {xyTree.Node} node 子节点
 */
xyTree.Node.prototype.addDynamic = function (node){
 // this.
  if(this.level == 0){ //如果是根节点
    moxingtianjia(this,node);
    var tree = this.tree.divtree; //获得树
    tree.showTreeBody();          //展开
    var div = tree.div.lastChild; //获得树干
    if(node instanceof Array){
      for(var i=0;i<node.length;i++){ 
        panduan(node[i]);
        div.appendChild(node[i].innerhtml());
        node[i].expand();
      }
    }
    else{ 
      panduan(node);
      div.appendChild(node.innerhtml());
      node.expand();
    }
  } else {  //如果当前节点不是根节点
    //首先自己一定要显示出来！！
    /* 
     * 1、没子节点
     * 变加号（注意到可能不是一级节点）
     * 变收缩文件夹或指定图片
     * 然后自己onclick()
     * 2、3、有子节点但不在显示,那就让子节点先显示
     * 如果子节点的最后一个是不带子节点的
     * 如果子节点的最后还是一个带子节点的且曾经显示过
     * 添加到模型tree
     * 然后父节点加innerHTML()
     * */
    this.expand();
    if(this.child.length == 0){ //自己没子节点
      moxingtianjia(this,node); //模型添加
      var jiahaoDOM = this.getHtmlElementjiahaoimg();
      if(this.next){     //如果不是最后一个
        jiahaoDOM.src = xyTree.TreeConfig.tPlusIcon;
      } else
        jiahaoDOM.src = xyTree.TreeConfig.lPlusIcon;
      if(!this.img)
        jiahaoDOM.nextSibling.src =   
          xyTree.TreeConfig.folderIcon;
      jiahaoDOM.onclick();    
      for(var j=0;j<this.child.length; j++)
        this.child[j].expand();
    }else{                      //自己有子节点
      if(!this.displaychild)
        this.expandChilds();
      var lastNode = this.child[this.child.length - 1];
      var lastNodejiahaoDOM = lastNode.getHtmlElementjiahaoimg();
      if(lastNode.child.length == 0) //如果末尾是不带子节点的
        lastNodejiahaoDOM.src = xyTree.TreeConfig.tIcon;
      else{
        if(lastNode.zhankaiguo){   //如果展开过，要递归
       //递归前先处理自己
          if(lastNode.displaychild) {     //正在显示
            //alert('ok222222');
              lastNodejiahaoDOM.src = xyTree.TreeConfig.tMinusIcon;    
          }
          else {                      //不在显示
            //alert('ok');
              lastNodejiahaoDOM.src = xyTree.TreeConfig.tPlusIcon;
          }
          var arr = lastNode.child; //递归
          for(var i=0; i<arr.length; i++)
            arr[i].chonghui2(lastNode.level-1);
        }else  //即便末尾未展开过，也变
           lastNodejiahaoDOM.src = xyTree.TreeConfig.tPlusIcon;
        
      }
     
      moxingtianjia(this,node); //模型添加
      var div = this.getHtmlElement();
      //逐个添加,要改
      if(node instanceof Array){
        for(var i=0;i<node.length;i++){ 
          div.appendChild(node[i].innerhtml());
          node[i].expand();
        }
      }
      else{ 
        div.appendChild(node.innerhtml());
        node.expand();
      }
    }//自己有子节点
  }//如果当前节点不是根节点
  //子函数：如果有前个节点，前个节点重绘
  function panduan(node2){
    if(node2.previous)node2.previous.chonghui();
  }
  //给内存中的树的某节点添加子节点
  function moxingtianjia(node3,node4){
    if(node4 instanceof Array){
      for(var i2=0;i2<node4.length;i2++) node3.add(node4[i2]);
    }
    else node3.add(node4);
  }
  
};

/*
 * 设置节点的文件夹图标为loading.gif
 * 仅在节点显示时有效
 */
xyTree.Node.prototype.loadingGif = function (node){
	var img = this.getHtmlElementfuxuanimg().previousSibling;
  if(this.level == 0){ //如果是根节点
  		img.src = xyTree.TreeConfig.loadingIcon;
  } else {  //如果当前节点不是根节点
  	//首先，要判断，如果当前节点不在显示，则什么都不做
  	if(this.parent.displaychild){
  		img.src = xyTree.TreeConfig.loadingIcon;
  	}else{
  	 /*alert("该节点不在显示")*/;
  	}
  }
} 
 
/*
 * 恢复节点的文件夹图标为标准样式 
 * 不是仅在节点显示时有效
 */
xyTree.Node.prototype.loadingGifRenew = function (node){
	var img = this.getHtmlElementfuxuanimg().previousSibling;
  if(!img)return;
  if(this.level == 0){ //如果是根节点
  		img.src = this.getimgfold();
  } else {  //如果当前节点不是根节点
  	//首先，要判断，如果当前节点不在显示，则什么都不做
  	if(this.parent.displaychild){
  		img.src = this.getimgfold();
  	}else{
  	 /*alert("该节点不在显示")*/;
  	 img.src = this.getimgfold(); //先凑合着用，看情况改
  	}
  }
} 
 



//重绘竖线
xyTree.Node.prototype.chonghui2 = function (num){
  
  if(this.parent.displaychild){
    var img = this.getHtmlElement().firstChild;
    for(var i=0;i<num; i++)
      img = getimg();
    img.src = xyTree.TreeConfig.iIcon;
    
    for(var j=0;j<this.child.length; j++)
      this.child[j].chonghui2(num);
  }
  
  function getimg(){
    img = img.nextSibling;
    return img;
  }
  
}


/**
 * 给节点重绘第一条线
 * @private
 */
xyTree.Node.prototype.chonghuifirstimg = function (){
//    alert(this.level);
  var img = this.getHtmlElement().firstChild;
   // alert(img.src);
  if(this.level == 1){
    if (this.child.length == 0 ) //如果没有子节点
      img.src = xyTree.TreeConfig.tIcon;
    else{                        //有子节点
      if(this.displaychild)      //正在显示
        img.src = xyTree.TreeConfig.tMinusIcon;    
      else                       //不在显示
        img.src = xyTree.TreeConfig.tPlusIcon;
    }
  }
  else
    img.src = xyTree.TreeConfig.iIcon;
}

/**
 * 给节点以及它的子节点重绘第一条线
 * @private
 */
xyTree.Node.prototype.chonghui = function (){
  if(this.parent.zhankaiguo){
    //alert('chonghui');
    this.chonghuifirstimg();
    var arr = this.child;
    for(var i=0; i<arr.length; i++)
      arr[i].chonghui();
  }
}





/**
 * 调试用
 */
xyTree.Node.prototype.display = function() {
  for (var i = 0; i <this.level; i++)
    this.tree.tempString += ' ';
  this.tree.tempString += '[' + this.id + ']=[' + this.name + ']' + '\n';
  for (var i = 0; i < this.child.length; i++)
    this.child[i].display();
};


