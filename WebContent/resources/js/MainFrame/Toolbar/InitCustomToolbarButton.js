
    Ext.Toolbar.MidiSeparator = function(){
        var s = document.createElement("span");
        s.className = "customytb-sep";
        Ext.Toolbar.MidiSeparator.superclass.constructor.call(this, s);
    };
        //添加自定义的分隔符
    Ext.extend(Ext.Toolbar.MidiSeparator, Ext.Toolbar.Item, {
        enable:Ext.emptyFn,
        disable:Ext.emptyFn,
        focus:Ext.emptyFn
    });
    
    Ext.reg('tbmidiseparator', Ext.Toolbar.MidiSeparator);

    Ext.Toolbar.prototype.addMidiSeparator =function(){
        return this.addItem(new Ext.Toolbar.MidiSeparator());
    };
    
    Ext.Toolbar.prototype.add=function(){
        var a = arguments, l = a.length;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.isFormField){ 
                this.addField(el);
            }else if(el.render){ 
                this.addItem(el);
            }else if(typeof el == "string"){ 
                if(el == "separator" || el == "-"){
                    this.addSeparator();
                }
                else if(el=="--"){
                    this.addMidiSeparator();
                }
                else if(el == " "){
                    this.addSpacer();
                }else if(el == "->"){
                    this.addFill();
                }else{
                    this.addText(el);
                }
            }else if(el.tagName){ 
                this.addElement(el);
            }else if(typeof el == "object"){ 
                if(el.xtype){
                    this.addField(Ext.ComponentMgr.create(el, 'button'));
                }else{
                    this.addButton(el);
                }
            }
        }
    };
    
    
    Ext.Toolbar.CustomSizeButton = function(renderTo, config){
        Ext.Toolbar.CustomSizeButton.superclass.constructor.call(this, renderTo, config);
    };
    
    Ext.extend(Ext.Toolbar.CustomSizeButton,Ext.Toolbar.Button,{
    initButtonEl : function(btn, btnEl){

        this.el = btn;
        btn.addClass("x-btn");

        if(this.icon){
            btnEl.setStyle('background-image', 'url(' +this.icon +')');
        }
        if(this.iconCls){
            btnEl.addClass(this.iconCls);
            if(!this.cls){
                btn.addClass(this.text ? 'x-custombtn-text-icon' : 'x-custombtn-icon');
            }
        }
        if(this.tabIndex !== undefined){
            btnEl.dom.tabIndex = this.tabIndex;
        }
        if(this.tooltip){
            if(typeof this.tooltip == 'object'){
                Ext.QuickTips.register(Ext.apply({
                      target: btnEl.id
                }, this.tooltip));
            } else {
                btnEl.dom[this.tooltipType] = this.tooltip;
            }
        }

        if(this.pressed){
            this.el.addClass("x-custombtn-pressed");
        }

        if(this.handleMouseEvents){
            btn.on("mouseover", this.onMouseOver, this);
                                    btn.on("mousedown", this.onMouseDown, this);
        }

        if(this.menu){
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }

        if(this.id){
            this.el.dom.id = this.el.id = this.id;
        }

        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn,
                typeof this.repeat == "object" ? this.repeat : {}
            );
            repeater.on("click", this.onClick,  this);
        }

        btn.on(this.clickEvent, this.onClick, this);
    },
    
        onMouseOver : function(e){
        if(!this.disabled){
            var internal = e.within(this.el,  true);
            if(!internal){
                this.el.addClass("x-custombtn-over");
                if(!this.monitoringMouseOver){
                    Ext.getDoc().on('mouseover', this.monitorMouseOver, this);
                    this.monitoringMouseOver = true;
                }
                this.fireEvent('mouseover', this, e);
            }
            if(this.isMenuTriggerOver(e, internal)){
                this.fireEvent('menutriggerover', this, this.menu, e);
            }
        }
    },

        monitorMouseOver : function(e){
        if(e.target != this.el.dom && !e.within(this.el)){
            if(this.monitoringMouseOver){
                Ext.getDoc().un('mouseover', this.monitorMouseOver, this);
                this.monitoringMouseOver = false;
            }
            this.onMouseOut(e);
        }
    },

        onMouseOut : function(e){
        var internal = e.within(this.el) && e.target != this.el.dom;
        this.el.removeClass("x-custombtn-over");
        this.fireEvent('mouseout', this, e);
        if(this.isMenuTriggerOut(e, internal)){
            this.fireEvent('menutriggerout', this, this.menu, e);
        }
    },
        onFocus : function(e){
        if(!this.disabled){
            this.el.addClass("x-custombtn-focus");
        }
    },
        onBlur : function(e){
        this.el.removeClass("x-custombtn-focus");
    },

        getClickEl : function(e, isUp){
       return this.el;
    },

    toggle : function(state){
        state = state === undefined ? !this.pressed : state;
        if(state != this.pressed){
            if(state){
                this.el.addClass("x-custombtn-pressed");
                this.pressed = true;
                this.fireEvent("toggle", this, true);
            }else{
                this.el.removeClass("x-custombtn-pressed");
                this.pressed = false;
                this.fireEvent("toggle", this, false);
            }
            if(this.toggleHandler){
                this.toggleHandler.call(this.scope || this, this, state);
            }
        }
    },
    
        onMouseDown : function(e){
        if(!this.disabled && e.button == 0){
            this.getClickEl(e).addClass("x-custombtn-click");
            Ext.getDoc().on('mouseup', this.onMouseUp, this);
        }
    },
        onMouseUp : function(e){
        if(e.button == 0){
            this.getClickEl(e, true).removeClass("x-custombtn-click");
            Ext.getDoc().un('mouseup', this.onMouseUp, this);
        }
    },
        onMenuShow : function(e){
        this.ignoreNextClick = 0;
        this.el.addClass("x-custombtn-menu-active");
        this.fireEvent('menushow', this, this.menu);
    },
        onMenuHide : function(e){
        this.el.removeClass("x-custombtn-menu-active");
        this.ignoreNextClick = this.restoreClick.defer(250, this);
        this.fireEvent('menuhide', this, this.menu);
    } });
    