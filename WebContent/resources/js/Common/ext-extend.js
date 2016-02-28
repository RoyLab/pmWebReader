//全文搜索输入框
Ext.app.SearchField = Ext.extend
(
    Ext.form.TwinTriggerField, 
    {
        initComponent : function()
        {
		    Ext.app.SearchField.superclass.initComponent.call(this);
		    this.on
		    (
		        'specialkey', function(f, e)
		        {
                    if(e.getKey() == e.ENTER)
                    {
                       this.onTrigger2Click();
                    }
                }, 
                this
            );
        },

        validationEvent:false,
        validateOnBlur:false,
        trigger1Class:'x-form-clear-trigger',
        trigger2Class:'x-form-search-trigger',
        hideTrigger1:true,
        width:180,
        hasSearch : false,
        paramName : 'query',

        onTrigger1Click : function()
        {
            if(this.hasSearch)
            {
			    this.el.dom.value = '';
                this.triggers[0].hide();
                this.hasSearch = false;
			    this.focus();
            }
        },

        onTrigger2Click : function()
        {
            var v = this.getRawValue();
            
            if(v.length < 1)
            {
                this.onTrigger1Click();
                return;
            }

            m_pnlFullTextSearch.setSrc('SearchIndex.aspx?pageIndex=1&searchCondition='+encodeURIComponent(v.replace(/<([A-Za-z\/])/g,"$1"))+'&user=' + m_UserInfo.ID+'&time='+new Date().getMinutes().toString()+new Date().getMilliseconds().toString());

            this.hasSearch = true;
            this.triggers[0].show();
		    this.focus();
        }
    }
);

//
HtmlEditorCN = Ext.extend(
    MyRemarkEditor,
    {
        fontFamilies : [            
            '宋体',
            '黑体',
            '隶书',
            '幼圆',
            '楷体_GB2312',
            '微软雅黑',
            'Arial',
            'Courier New',
            'Tahoma',
            'Times New Roman',
            'Verdana'
        ],
        defaultFont: '宋体',
    
        buttonTips : {
            bold : {
                title: '粗体 (Ctrl+B)',
                text: '给所选文字加粗体',
                cls: 'x-html-editor-tip'
            },
            italic : {
                title: '斜体 (Ctrl+I)',
                text: '给所选文字加斜体',
                cls: 'x-html-editor-tip'
            },
            underline : {
                title: '下划线 (Ctrl+U)',
                text: '给所选文字加下划线',
                cls: 'x-html-editor-tip'
            },
            increasefontsize : {
                title: '增大字体',
                text: '增大字号',
                cls: 'x-html-editor-tip'
            },
            decreasefontsize : {
                title: '缩小字体',
                text: '减小字号',
                cls: 'x-html-editor-tip'
            },
            backcolor : {
                title: '文字高亮颜色',
                text: '改变所选文字的背景色',
                cls: 'x-html-editor-tip'
            },
            forecolor : {
                title: '字体颜色',
                text: '改变所选文字的颜色',
                cls: 'x-html-editor-tip'
            },
            justifyleft : {
                title: '文本左对齐',
                text: '将文字左对齐',
                cls: 'x-html-editor-tip'
            },
            justifycenter : {
                title: '居中',
                text: '将文字居中',
                cls: 'x-html-editor-tip'
            },
            justifyright : {
                title: '文本右对齐',
                text: '将文字右对齐',
                cls: 'x-html-editor-tip'
            },
            insertunorderedlist : {
                title: '项目符号',
                text: '开始创建项目符号列表',
                cls: 'x-html-editor-tip'
            },
            insertorderedlist : {
                title: '编号',
                text: '开始创建编号列表',
                cls: 'x-html-editor-tip'
            },
            createlink : {
                title: '链接',
                text: '给所选文字加链接',
                cls: 'x-html-editor-tip'
            },
            sourceedit : {
                title: '源代码编辑器',
                text: '切换到源代码编辑模式',
                cls: 'x-html-editor-tip'
            }
        },
        
        enableDelete: true,
        
        getText:function()
        {
            return this.getValue();
        },
        
        onRender : function(ct, position){
            HtmlEditorCN.superclass.onRender.call(this, ct, position);
            
            if(this.enableDelete){
               this.tb.add(
                        '-',
                       {
                            itemId : 'deleteRemark',
                            cls: 'x-btn-icon',
                            icon:'resources/images/16x16/Delete.png',
                            scope: this,
                            handler:this.deleteText,
                            clickEvent:'mousedown',
                            tooltip: '<b>删除</b><br/>删除备注',
                            tabIndex:-1
                       }
                    );
            }
        },
        
        deleteText: function()
        {
            if(typeof this.win.document != 'undefined' && 
            typeof this.win.document.selection != 'undefined' && 
            this.win.document.selection.type == 'Text')
            {
               this.execCmd('delete', false);
            }
        }
    }
);


Ext.ux.XmlTreeLoader=Ext.extend(Ext.tree.TreeLoader,{
    processResponse : function(response,node,callback){
       var doc=response.responseXML.documentElement;
       try
       {
        node.beginUpdate();
        this.parseXml(doc,node);
        node.endUpdate();
        if(typeof callback=="function"){
         callback(this,node);
        }
       }
       catch(e)
       {
         //Ext
       }
    },
    parseXml : function(doc,node){
       var nodes=Ext.DomQuery.select("/JsonBookMark",doc);
       
       Ext.each(nodes,function(item){
          var text=Ext.DomQuery.selectValue("BookMarkname",item,"");
          var value=Ext.DomQuery.selectValue("Parentid",item,"");
          var leaf=Ext.DomQuery.selectValue("Leaf",item,true);
          var href=Ext.DomQuery.selectValue("BookMarkurl",item,"");
          var codeString=Ext.DomQuery.selectValue("codeString",item,"");
          var objectType=Ext.DomQuery.selectValue("objectType",item,"");
          if(text&&value)
          {
             var child=null;
             if(leaf=='true'){
               child=new Ext.tree.TreeNode({text:text,id:text,leaf:leaf,href:href,codeString:codeString,objectType:objectType,iconCls: "iconDM","isClass": true,cls: "cls"});
             }
             else{
               child=new Ext.tree.AsyncTreeNode({text:text,id:text,leaf:leaf,href:href,codeString:codeString,objectType:objectType,iconCls: "iconDM","isClass": true,cls: "cls"});
             }
             if(child)
             {
               node.appendChild(child);
             }
          }
          
       });//END each
       
    }
});

Ext.ux.MultiComBox=Ext.extend(Ext.form.ComboBox,{
    sep:',',
    onSelect:function(record,index){
        if(this.fireEvent('beforeSelect',this,record,index)!==false)
        {
            var values=this.getValue().split(this.sep);
            var selected_value=record.data[this.displayField];
            if(selected_value===this.emptyText)
                values=[this.emptyText];
            var i=values.indexOf(selected_value);
            if(i<0)
            {
                if(values.length<1||values[0]==='')
                {
                    values[0]=selected_value;
                }
                else
                {
                    values.push(selected_value);
                }
            }
            else
            {
                values.splice(i,1);
            }
            this.setValue(values.sort().join(this.sep));
            this.fireEvent('select',this,record,index);
            
        }
    }
});