//Tab的Icon不能设置
Ext.override(Ext.Panel, {
	initComponent : function(){
		Ext.Panel.superclass.initComponent.call(this);
		this.addEvents(
			'bodyresize',
			'titlechange',
			'iconchange',
			'collapse',
			'expand',
			'beforecollapse',
			'beforeexpand',
			'beforeclose',
			'close',
			'activate',
			'deactivate'
		);
		if(this.tbar){
			this.elements += ',tbar';
			if(typeof this.tbar == 'object'){
				this.topToolbar = this.tbar;
			}
			delete this.tbar;
		}
		if(this.bbar){
			this.elements += ',bbar';
			if(typeof this.bbar == 'object'){
				this.bottomToolbar = this.bbar;
			}
			delete this.bbar;
		}
		if(this.header === true){
			this.elements += ',header';
			delete this.header;
		}else if(this.title && this.header !== false){
			this.elements += ',header';
		}
		if(this.footer === true){
			this.elements += ',footer';
			delete this.footer;
		}
		if(this.buttons){
			var btns = this.buttons;
			this.buttons = [];
			for(var i = 0, len = btns.length; i < len; i++) {
				if(btns[i].render){                     btns[i].ownerCt = this;
					this.buttons.push(btns[i]);
				}else{
					this.addButton(btns[i]);
				}
			}
		}
		if(this.autoLoad){
			this.on('render', this.doAutoLoad, this, {delay:10});
		}
	},
	setIconClass : function(cls){
		var old = this.iconCls;
		this.iconCls = cls;
		if(this.rendered && this.header){
			if(this.frame){
				this.header.addClass('x-panel-icon');
				this.header.replaceClass(old, this.iconCls);
			}else{
				var hd = this.header.dom;
				var img = hd.firstChild && String(hd.firstChild.tagName).toLowerCase() == 'img' ? hd.firstChild : null;
				if(img){
					Ext.fly(img).replaceClass(old, this.iconCls);
				}else{
					Ext.DomHelper.insertBefore(hd.firstChild, {
						tag:'img', src: Ext.BLANK_IMAGE_URL, cls:'x-panel-inline-icon '+this.iconCls
					});
				 }
			}
		}
		this.fireEvent('iconchange', this, old, cls);
	}
});

//Tab的Icon不能设置
Ext.override(Ext.TabPanel, {
	initTab : function(item, index){
		var before = this.strip.dom.childNodes[index];
		var cls = item.closable ? 'x-tab-strip-closable' : '';
		if(item.disabled){
			cls += ' x-item-disabled';
		}
		if(item.iconCls){
			cls += ' x-tab-with-icon';
		}
		if(item.tabCls){
			cls += ' ' + item.tabCls;
		}
		var p = {
			id: this.id + this.idDelimiter + item.getItemId(),
			text: item.title,
			cls: cls,
			iconCls: item.iconCls || ''
		};
		var el = before ?
				 this.itemTpl.insertBefore(before, p) :
				 this.itemTpl.append(this.strip, p);
		Ext.fly(el).addClassOnOver('x-tab-strip-over');
		if(item.tabTip){
			Ext.fly(el).child('span.x-tab-strip-text', true).qtip = item.tabTip;
		}
		item.on('disable', this.onItemDisabled, this);
		item.on('enable', this.onItemEnabled, this);
		item.on('titlechange', this.onItemTitleChanged, this);
		item.on('iconchange', this.onItemIconChanged, this);
		item.on('beforeshow', this.onBeforeShowItem, this);
	},
	onItemIconChanged : function(item, oldCls, newCls){
		var el = this.getTabEl(item);
		if(el){
			var tabEl = Ext.fly(el);
			tabEl.child('span.x-tab-strip-text').replaceClass(oldCls, newCls);
			tabEl[newCls ? 'addClass' : 'removeClass']('x-tab-with-icon');
		}
	}
});

//panel的layout='accordion'时，其中的TreePanel尺寸计算不正确
Ext.override(Ext.layout.Accordion, {
    inactiveItems: [],//ADDED    
    // private    
    onLayout : function(ct, target){//ADDED
        Ext.layout.Accordion.superclass.onLayout.call(this, ct, target);
        if(this.autoWidth === false) {
            for(var i = 0; i < this.inactiveItems.length; i++) {
                var item = this.inactiveItems[i];
                item.setSize(target.getStyleSize());
            }        
        }
                            
    },    
    // private    
    beforeExpand : function(p, anim){//MODFIED
        var ai = this.activeItem;        
        if(ai){
            if(this.sequence){
                delete this.activeItem;                
                ai.collapse({callback:function(){
                                    p.expand(anim || true);                
                }, scope: this});                
                return false;            
            }else{
                ai.collapse(this.animate);                
                if(this.autoWidth === false && this.inactiveItems.indexOf(ai) == -1)//*****
                    this.inactiveItems.push(ai);//*****            
            }        
        }        
        this.activeItem = p;        
        if(this.activeOnTop){
            p.el.dom.parentNode.insertBefore(p.el.dom, p.el.dom.parentNode.firstChild);        
        }        
        if(this.autoWidth === false && this.inactiveItems.indexOf(this.activeItem) != -1)//*****
            this.inactiveItems.remove(this.activeItem);//*****        
        this.layout();    
    }    
});

//Toolbar中的按钮的show、hide方法有错误
Ext.override
(
    Ext.Toolbar.Item,
    {
        show: function()
        {
            this.hidden = false;
            this.el.style.display = "block";
        },
        
        hide: function()
        {
            this.hidden = true;
            this.el.style.display = "none";
        }
    }
);
