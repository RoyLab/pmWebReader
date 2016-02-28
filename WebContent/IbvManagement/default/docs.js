Ext.BLANK_IMAGE_URL = 'extjs/resources/images/default/s.gif';

Docs = {};

var myMask;

ApiPanel = function() {
    ApiPanel.superclass.constructor.call(this, {
        id:'api-tree',
        region:'west',
        split:true,
        width: 180,
        minSize: 150,
        maxSize: 500,
        collapsible: true,
        margins:'0 0 5 5',
        cmargins:'0 0 0 0',
        rootVisible:false,
        lines:false,
        autoScroll:true,
        animCollapse:false,
        animate: false,
        collapseMode:'mini',
        loader: new Ext.tree.TreeLoader({
			preloadChildren: true,
			clearOnLoad: false
		}),
        root: new Ext.tree.AsyncTreeNode({
            text:'Ext JS',
            id:'root',
            expanded:true,
            draggable: false,
            children:[Docs.classData]
         })
        //collapseFirst:false
    });
    // no longer needed!
    //new Ext.tree.TreeSorter(this, {folderSort:true,leafAttr:'isClass'});

    this.getSelectionModel().on('beforeselect', function(sm, node){
        return node.isLeaf();
    });
};

Ext.extend(ApiPanel, Ext.tree.TreePanel, {
    selectClass : function(cls){
        if(cls){
            var parts = cls.split('.');
            var last = parts.length-1;
            for(var i = 0; i < last; i++){ // things get nasty - static classes can have .
                var p = parts[i];
                var fc = p.charAt(0);
                var staticCls = fc.toUpperCase() == fc;
                if(p == 'Ext' || !staticCls){
                    parts[i] = 'pkg-'+p;
                }else if(staticCls){
                    --last;
                    parts.splice(i, 1);
                }
            }
            parts[last] = cls;

            this.selectPath('/root/apidocs/'+parts.join('/'));
        }
    }
});



DocPanel = Ext.extend(Ext.ux.ManagedIframePanel, {
    id : 'main',
    closable: false,
    autoScroll:true,
    bodyStyle   :{position:'relative'},
    style: 'border-right:1 solid; border-bottom:1 solid;',
    border: false,
    initComponent : function(){
          this.title=this.cclass;
        DocPanel.superclass.initComponent.call(this);
    },

    hlMember : function(member){
        var el = Ext.fly(this.cclass + '-' + member);
        if(el){
            el.up('tr').highlight('#cadaf9');
        }
    },
    listeners:
    {
        documentloaded : function()
        {
            if(myMask!=null)
                myMask.hide();
        }
    }
});


MainPanel = function(){
    MainPanel.superclass.constructor.call(this, {
        id:'doc-body',
        region:'center',
        margins:'0 5 5 0',
        resizeTabs: true,
        minTabWidth: 135,
        tabWidth: 135,
        enableTabScroll: true,
        activeTab: 0
    });
};

Ext.extend(MainPanel, Ext.TabPanel, {

    initEvents : function(){
        MainPanel.superclass.initEvents.call(this);
    },
    
     initComponent : function(){
        MainPanel.superclass.initComponent.call(this);
        
        var p=new DocPanel();
        //this.loadClass("SystemBackup.aspx","系统备份", 1);
        this.add(p);
        
    },
    
    loadClass : function(href, cls, member){
        var id = 'docs-' + cls;
        var tab = this.getComponent('main');
        if(tab){
             if(myMask==null)
                 myMask= new Ext.LoadMask(Ext.getBody(),{msg:"正在加载页面..."});
             myMask.show();
             
             tab.cclass=cls;
             tab.setTitle(cls);
             var date=new Date();
             tab.setSrc(href+'?M='+date.getMinutes()+date.getMilliseconds());
        }
    }
});


Ext.onReady(function(){

    Ext.QuickTips.init();

    var api = new ApiPanel();
    var mainPanel = new MainPanel();

    api.on('click', function(node, e){
         if(node.isLeaf()){
            if(e!=null)
                e.stopEvent();
            mainPanel.loadClass(node.attributes.href,node.text, node.id);
         }
    });
    
    

    mainPanel.on('tabchange', function(tp, tab){
        api.selectClass(tab.cclass); 
    });


    var viewport = new Ext.Viewport({
        layout:'border',
        items:[api, mainPanel ]
    });
    
     
     api.root.expand(true);
     
//     var child=api.root.firstChild.firstChild.firstChild;
//	child.fireEvent('click',child);
	mainPanel.loadClass("Welcome.html","欢迎访问",0);

     
    viewport.doLayout();
    

      setTimeout(
                function() {
                    Ext.get('loading').remove();
                    Ext.get('loading-mask').fadeOut({ remove: true });
                },
                500);
                
    //mainPanel.loadClass('','系统备份', 1);	
    
	var filter = new Ext.tree.TreeFilter(api, {
		clearBlank: true,
		autoClear: true
	});
	var hiddenPkgs = [];
	function filterTree(e){
		var text = e.target.value;
		Ext.each(hiddenPkgs, function(n){
			n.ui.show();
		});
		if(!text){
			filter.clear();
			return;
		}
		api.expandAll();
		
		var re = new RegExp('^' + Ext.escapeRe(text), 'i');
		filter.filterBy(function(n){
			return !n.attributes.isClass || re.test(n.text);
		});
		
		// hide empty packages that weren't filtered
		hiddenPkgs = [];
		api.root.cascade(function(n){
			if(!n.attributes.isClass && n.ui.ctNode.offsetHeight < 3){
				n.ui.hide();
				hiddenPkgs.push(n);
			}
		});
	}
	
});


var isShowWait=false;

function showWait(mg)
	{
	   Ext.MessageBox.show({
           msg: mg,
           progressText: 'saving...',
           width:300,
           wait:true,
           waitConfig: {interval:200},
           icon:'ext-mb-download' //custom class in msg-box.html
           //animEl: 'mb7'
       });
       
       isShowWait=true;
	}
	
function HidenWait()
	{
	    Ext.MessageBox.hide();
	    isShowWait=false;
	} 
	
function isExite()
	{
	    return isShowWait;
	}
	


