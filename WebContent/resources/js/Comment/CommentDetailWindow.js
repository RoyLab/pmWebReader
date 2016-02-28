

Service.RegNameSpace('window.Comment');

/*
 *	意见类型枚举
 */
Comment.CommentWindowType={
    //新增意见窗体
    NewCommentWindow:'Q',
    //新增中间回复窗体
    NewMidReplyWindow:'I',
    //新增最终答复窗体
    NewEndReplyWindow:'R',
    //新增编辑意见窗体
    EditCommentWindow:'E'
};

/**
 * @功能:意见编辑明细窗体类
 * @作者: LuCan
 * @日期: 2010/01/08
 */

Comment.CommentDetailWindow = Ext.extend(Ext.Window, {

    title: '意见 ',
    closable: false,
    width: 720,
    height: 580,
    id:'CommentDetailWindow',
    plain: true,
    modal: true,
    closable: false,
    resizable: false,
    layout: 'border',
    shadow : false,
    
    /*
     *	当前窗体的类型
     *  新增意见     Q
     *  新增中间答复 I
     *  新增最终答复 R
     *  编辑意见     E
     */
    WindowType:null,
    
    /*
     *	父意见
     */
    ParentComment:null,
    //当前意见
    CurrentComment:null,

    //窗体每SHow一次，该值不一样
    CommentUUID:null,
    
    /*****************编码控件区******************************/
    //基础编码分组控件
    m_CodeSet: undefined,
    //型号输入控件
    m_txtModelic: null,
    //发送单位输入控件
    m_txtSendid: null,
    //分发年份输入控件
    m_txtYear: null,
    //序列号输入控件
    m_txtseqnum: null,
    //类型号输入控件
    m_txtCtype: null,

    /*****************信息控件区******************************/
    //基础信息分组控件
    m_InfoSet: null,
    //标题输入控件
    m_txtTitle: null,
    //签署日期输入控件
    m_txtIssueDate: null,
    //语言输入控件
    m_txtLanguage: null,
    //语言国家输入控件
    m_txtLanguageCountry: null,
    //国家输入控件
    m_txtCountry: null,
    //城市输入控件
    m_txtCity: null,
    //企业名称输入控件
    m_txtEntName: null,
    //优先级输入控件
    m_txtPriority: null,
    //回复类型输入控件
    m_txtResponse: null,
    //密级输入控件
    m_txtSecurity: null,

    /*****************内容控件区******************************/
    //内容分组控件
    m_ContentSet: null,
    //回复内容编辑控件
    m_txtContent: null,

    /*****************对象控件区******************************/
    //选择对象分组控件
    m_ObjSet: null,
    //对象列表控件(公开)
    txtObjGrid: null,
    
    m_TabPanel:null,
    m_IsFirstShow:true,

    /*****************对象控件区******************************/
    //附件分组控件
    m_AttachSet: null,
    //附件列表控件(公开)
    txtRefsGrid: null,
    
    m_AddObjButton:null,
    m_DeleteObjButton:null,

    /*
     *	事件处理类
     */
    m_EventHandler: null,
    
    /*
     *	父CommentMgrPanel
     */
    HasParentCommentPanel:false,
    
    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }      
        this.m_EventHandler = new Comment.CommentDetailWindowEventHandler(this);
        Comment.CommentDetailWindow.superclass.constructor.apply(this, arguments);
    },
    //wanghai 重写Render方法，改变MASK。
     onRender : function(ct, position){
//                   this.modal=false;
                   Comment.CommentDetailWindow.superclass.onRender.call(this,ct, position);
                    this.el.shadowDisabled=true;
//                    this.mask = this.container.createChild({cls:"ext-el-mask",tag:"iframe"}, this.el.dom);
//                    this.mask.enableDisplayMode("block");
//                    this.mask.hide();
//                    this.modal=true;
     },
    /*
     *	重写Show方法 初始化CommentUUID
     */
    show:function(animateTarget, cb, scope) {
        
         this.CommentUUID=Service.NewGuid();
      
         Comment.CommentDetailWindow.superclass.show.call(this,animateTarget, cb, scope);
    },
    
    /*
     *	重写隐藏方法 删除过程中产生的临时文件夹
     */
    hide:function () {
		 Comment.CommentDetailWindow.superclass.hide.call(this);  
		 //删除上传文件所产生的临时文件夹
		 Service.WebService.Post('DeleteTempCommentDirctoryByUUID', {id:this.CommentUUID},true);    
    },
    
    close:function(){
         Comment.CommentDetailWindow.superclass.close.call(this);  
		 //删除上传文件所产生的临时文件夹
		 Service.WebService.Post('DeleteTempCommentDirctoryByUUID', {id:this.CommentUUID},true); 
    },
    /*****************************************构建UI控件*******************************************************/
    
    beforeDestroy : function(){
           Comment.CommentDetailWindow.superclass.beforeDestroy.call(this);  
           Ext.destroy(
            this.body,
            this.buttons,
            this.collapseDefaults,
            this.footer,
            this.header,
            this.items,
            this.focusEl,
            this.bwrap,
            this.resizer,
            this.dd,
            this.tools,
            this.proxy,
            this.mask
            );
      
            this.body=null;
            this.buttons=null;
            this.collapseDefaults=null;
            this.footer=null;
            this.header=null;
            this.items=null;
            this.focusEl=null;
            this.bwrap=null;
            this.resizer=null;
            this.dd=null;
            this.proxy=null;
            this.mask=null;
            this.tools=null;
     },


    /*
     *	初始化编码控件组
     */
    InitCodeSet: function () {

        //型号文本框
        m_txtModelic = new Ext.form.TextField({
            fieldLabel: '型号',
            anchor: '95%',
            allowBlank: false,
            blankText: '型号不允许为空！',
            maxLength: 10,
            maxLengthText: '型号的最大长度不能超过10！',
            tabIndex: 0,
            name: 'modelic'
        });

        //发送单位下拉输入框
        m_txtSendid = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('SendidType') //下拉框数据从代码表获取
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            tabIndex: 1,
            blankText: '发送单位不允许为空！',
            emptyText: '请选择！',
            editable: false,
            selectOnFocus: true,
            fieldLabel: '发送单位',
            anchor: '95%',
            name: 'sendid'
        });

        //年份下拉输入框
        m_txtYear = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['year'],
                data: Service.BasicDataService.GetCodeTableData('DiyearType') //下拉框数据从代码表获取
            }),
            displayField: 'year',
            typeAhead: true,
            mode: 'local',
            editable: true,
            minLength: 4,
            minLengthText: '分发年份的长度为4，且只允许包括数字！',
            maxLength: 4,
            maxLengthText: '分发年份的长度为4，且只允许包括数字！',
            allowBlank: false,
            blankText: '分发年份不允许为空！',
            tabIndex: 2,
            triggerAction: 'all',
            selectOnFocus: true,
            fieldLabel: '分发年份',
            anchor: '95%',
            name: 'diyear'

        });

        //序号文本输入框
        m_txtseqnum = new Ext.form.TextField({
            fieldLabel: '序列号',
            anchor: '95%',
            minLength: 5,
            minLengthText: '序列号的长度为5，且只允许包括数字！',
            maxLength: 5,
            maxLengthText: '序列号的长度为5，且只允许包括数字！',
            allowBlank: false,
            blankText: '序列号不允许为空！',
            tabIndex: 3,
            name: 'seqnum'
        });

        //意见类型下拉输入框
        m_txtCtype = new Ext.form.ComboBox({
            name: 'ctype',
            typeAhead: true,
            triggerAction: 'all',
            anchor: '95%',
            editable: false,
            mode: 'local',
            displayField: 'text',
            valueField: 'name',
            selectOnFocus: true,
            fieldLabel: '类型',
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetBasicDataByCache(Service.CodeTalbeType.COMENTTYPE) //下拉框数据从代码表获取
            })

        });

        //编码分组框
        m_CodeSet = new Ext.form.FieldSet({
            title: ' 编码',
            autoHeight: true,
            width: 690,
            collapsible: false,
            labelWidth: 55,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .33,
                    layout: 'form',
                    items: [m_txtModelic, m_txtseqnum]
                },
                {
                    columnWidth: .33,
                    layout: 'form',
                    items: [m_txtSendid, m_txtCtype]
                },
                {
                    columnWidth: .34,
                    layout: 'form',
                    items: [m_txtYear]
                }]

            }]
        });
    },

    /*
     *	初始化信息控件组
     */
    InitInfoSet: function () {
        //标题文本框
        m_txtTitle = new Ext.form.TextField({
            fieldLabel: '标题',
            anchor: '98%',
            allowBlank: false,
            blankText: '标题不允许为空！',
            maxLength: 50,
            maxLengthText: '标题的最大长度为50！',
            tabIndex: 4,
            name: 'ctitle'
        });

        //签署日期文本框
        m_txtIssueDate = new Ext.form.DateField({
            fieldLabel: '签署日期',
            anchor: '95%',
            format: 'Y/m/d',
            invalidText: '不符合日期格式！',
            editable: false,
            tabIndex: 5,
            name: 'issdate'
        });

        //语言下拉输入框
        m_txtLanguage = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('LanguageType') //下拉框数据从代码表获取
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: '请选择！',
            editable: false,
            tabIndex: 6,
            selectOnFocus: true,
            fieldLabel: '语言',
            anchor: '95%',
            name: 'language'
        });

        //语言国家下拉输入框
        m_txtLanguageCountry = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('CountryType') //下拉框数据从代码表获取
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: '请选择！',
            editable: false,
            tabIndex: 6,
            selectOnFocus: true,
            fieldLabel: '语言国家',
            anchor: '95%',
            name: 'language'
        });

        //企业名称输入框
        m_txtEntName = new Ext.form.TextField({
            fieldLabel: '企业',
            anchor: '95%',
            tabIndex: 7,
            name: 'entname'
        });

        //国家输入框
        m_txtCountry = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetCodeTableData('CountryType') //下拉框数据从代码表获取
            }),
            displayField: 'text',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: '请选择！',
            editable: false,
            selectOnFocus: true,
            fieldLabel: '国家',
            anchor: '95%',
            name: 'country'
        });

        //城市输入框
        m_txtCity = new Ext.form.ComboBox({
            fieldLabel: '城市',
            anchor: '95%',
            tabIndex: 8,
            name: 'city',
            store: new Ext.data.SimpleStore({
                fields: ['text'],
                data: Service.BasicDataService.GetCodeTableData('CityType') //下拉框数据从代码表获取
            }),
            displayField: 'text',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: true,
            selectOnFocus: true
        });

        //密级下拉输入框
        m_txtSecurity = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetBasicDataByCache(Service.CodeTalbeType.SECURITY) //下拉框数据从代码表获取
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: '请选择！',
            editable: false,
            tabIndex: 9,
            selectOnFocus: true,
            fieldLabel: '密级',
            anchor: '95%',
            name: 'security'
        });

        //优先级下拉输入框
        m_txtPriority = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetBasicDataByCache(Service.CodeTalbeType.PRIORITY) //下拉框数据从代码表获取
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: '请选择！',
            editable: false,
            tabIndex: 10,
            selectOnFocus: true,
            fieldLabel: '优先级',
            anchor: '95%',
            name: 'priority'
        });

        //回复类型下拉输入框
        m_txtResponse = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['name', 'text'],
                data: Service.BasicDataService.GetBasicDataByCache(Service.CodeTalbeType.RESPONSETYPE) //下拉框数据从代码表获取
            }),
            displayField: 'text',
            valueField: 'name',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: '请选择！',
            editable: false,
            tabIndex: 11,
            selectOnFocus: true,
            fieldLabel: '回复类型',
            anchor: '95%',
            name: 'response'
        });

        //信息分组框
        m_InfoSet = new Ext.form.FieldSet({
            title: '信息',
            autoHeight: true,
            width: 690,
            collapsible: false,
            labelWidth: 55,
            items: [m_txtTitle, {
                layout: 'column',
                items: [{
                    columnWidth: .33,
                    layout: 'form',
                    items: [m_txtIssueDate, m_txtCountry, m_txtPriority]
                },
                {
                    columnWidth: .33,
                    layout: 'form',
                    items: [m_txtLanguage, m_txtCity, m_txtResponse]
                },
                {
                    columnWidth: .34,
                    layout: 'form',
                    items: [m_txtLanguageCountry, m_txtEntName, m_txtSecurity]
                }]

            }]
        });
    },

    InitContentSet: function () {

        //回复内容编辑控件
        m_txtContent = new Ext.form.TextArea({
            id: 'replyEditor',
            hideLabel: true,
            title:'内容',
            height:240,
            anchor: '100%',
            listeners: { //控件初始化设置
                'initialize': function (contentEditor) {
                    contentEditor.doc.body.style.wordWrap = 'break-word';
                }
            }
        });
    },

    InitOjectSet: function () {
    
        m_AddObjButton=new Ext.Button({
                text: '选择对象',
                id: 'add_object_bt',
                handler: this.m_EventHandler.SelectObject
            });
        
        m_DeleteObjButton=new Ext.Button({
                text: '删除对象',
                id: 'delete_object_bt',
                handler: this.m_EventHandler.DeleteObject
            });
        //对象表格列表
        this.txtObjGrid = new Ext.grid.GridPanel({
            id: 'objGrid',
            region: 'center',
            title: '对象',
            height:240,
            width:670,
            store: new Ext.data.Store({
                reader: new Ext.data.ArrayReader({},
                [{
                    name: 'Title'
                },
                {
                    name: 'DMC'
                },
                {
                    name: 'Issno'
                },
                {
                    name: 'Lang'
                },
                {
                    name: 'ObjType'
                }]),
                data:new Array()
            }),
            trackMouseOver: false,
            disableSelection: false,
            hideHeaders: true,
            header: false,
            loadMask: false,
            tbar: [m_AddObjButton,
            '-', m_DeleteObjButton],
            cm: new Ext.grid.ColumnModel([{
                header: "标题",
                width: '35%',
                sortable: true,
                dataIndex: 'Title'
            },
            {
                header: "DMC",
                width: '40%',
                sortable: true,
                dataIndex: 'DMC'
            },
            {
                header: "版本",
                width: '15%',
                sortable: true,
                dataIndex: 'Issno'
            },
            {
                header: "类型",
                width: '20%',
                sortable: true,
                dataIndex: 'ObjType'
            }])
        });
    },

    InitAttachSet: function () {
        //附件列表控件
        this.txtRefsGrid = new Ext.grid.GridPanel({
            id: 'refsGrid',
            region: 'center',
            title: '附件',
            height:240,
            width:670,
            store: new Ext.data.Store({
                reader: new Ext.data.ArrayReader({},
                [{
                    name: 'file'
                },
                {
                    name: 'path'
                }]),
                data: new Array()
            }),
            trackMouseOver: false,
            disableSelection: false,
            hideHeaders: true,
            header: false,
            loadMask: false,

            tbar: [{
                id: 'addRefFiles',
                text: '增加附件',
                handler: this.m_EventHandler.AddAttach
            },
            '-', {
                text: '删除附件',
                handler: this.m_EventHandler.DeleteAttach
            }],
            cm: new Ext.grid.ColumnModel([{
                width: '100%',
                dataIndex: 'file'
            }])
        });
    },

    /*
     *	初始化控件
     */
    initComponent: function () {
        this.InitCodeSet();
        this.InitInfoSet();
        this.InitContentSet();
        this.InitOjectSet();
        this.InitAttachSet();

        m_TabPanel=new Ext.TabPanel();
        
         m_TabPanel.add(this.txtObjGrid);
         m_TabPanel.add(this.txtRefsGrid);
         m_TabPanel.add(m_txtContent);
            
        var allSetsPanel = new Ext.FormPanel({
            id: 'allSetsPanel',
            region: 'center',
            header: false,
            frame: true,
            labelWidth: 100,
            items: [m_CodeSet, m_InfoSet, m_TabPanel]
        });

        //组装UI界面
        this.items = [allSetsPanel];
        this.buttons = [{
            text: '提交',
            handler: this.m_EventHandler.Confirm
        },
        {
            text: '关闭',
            id: 'closeButton',
            handler: this.m_EventHandler.Close
        }];
        
        //增加一个提交成功事件
         this.addEvents({
        "confirmSuccess": true,"CommentHide":true});
        Comment.CommentDetailWindow.superclass.initComponent.call(this);
    },
    
    /******************************************辅助方法******************************************************/
    
    /*
     *	绑定对象列表(必须在Window.Show后才可以绑定)
     */
    BindObjUIData:function (objData){
    
        var oldActivedTab=m_TabPanel.getActiveTab();
	    var store= new Ext.data.Store
	    ({
		    reader: new Ext.data.ArrayReader
				    ({},[
					    {name: 'Title'},
					    {name: 'DMC'},
					    {name: 'Issno'},
					    {name: 'Lang'},
					    {name: 'ObjType'}
				    ]),
		      data: objData
	    });
    	
	    var objColumn = new Ext.grid.ColumnModel([ 
		    { header: "标题",width: '30%', dataIndex: 'Title'}, 
		    { header: "DMC", width: '40%', dataIndex: 'DMC'}, 
		    { header: "版本", width: '15%', dataIndex: 'Issno'}, 
		    { header: "类型", width: '15%', dataIndex: 'ObjType'}
		    ]);
		m_TabPanel.activate("objGrid");
	    this.txtObjGrid.reconfigure(store,objColumn);
	    if(oldActivedTab!=null&&oldActivedTab.id!="objGrid")
	        m_TabPanel.activate(oldActivedTab.id);
    },
    
    /*
     *	绑定附件对象列表(必须在Window.Show后才可以绑定)
     */
    BindAttachUIData:function(attachData)
    {
        var oldActivedTab=m_TabPanel.getActiveTab();
	    var store= new Ext.data.Store
	    ({
            reader: new Ext.data.ArrayReader
                    ({},[
                        {name: 'file'},
                        {name: 'path'}
                    ]),
		      data: attachData
	    });
    	
	    var refCatColumn = new Ext.grid.ColumnModel([ { width: '100%', dataIndex: 'file'} ]);
    	m_TabPanel.activate("refsGrid");
	    this.txtRefsGrid.reconfigure(store,refCatColumn);
	    if(oldActivedTab!=null&&oldActivedTab.id!="refsGrid")
	        m_TabPanel.activate(oldActivedTab.id);
    },
    
    /*
     *	向附件列表添加新的条目
     *  fileList 文件列表
     */
    AddAttachUIData:function (fileList) {
        var oldData=new Array();
        var isExist=false;
        if(fileList!=null&&fileList.length>0)
        {
             for(var j=0;j<fileList.length;j++)
            {   
                var fileName=fileList[j];
                isExist=false;
                for(var i=0;i<this.txtRefsGrid.store.data.length;i++)
	            {
	                //oldData.push(new Array(this.txtRefsGrid.store.data.items[i].json[0],this.txtRefsGrid.store.data.items[i].json[1]));
	                if(this.txtRefsGrid.store.data.items[i].json[1]==fileName)
	                {
	                     isExist=true;
	                     break;
	                }
	            }		
	            if(!isExist)
	                oldData.push(new Array(fileName.substring(fileName.lastIndexOf('\\')+1),fileName));
            }
            
            for(var i=0;i<this.txtRefsGrid.store.data.length;i++)
                oldData.push(new Array(this.txtRefsGrid.store.data.items[i].json[0],this.txtRefsGrid.store.data.items[i].json[1]));
    	    
	        this.BindAttachUIData(oldData);
        }
    },
    
    /*
     *	绑定数据 (必须在Window.Show后才可以绑定)
     *  @commentObj 要绑定的意见对象
     */
    BindingUIData:function (commentObj) {
        if(commentObj==null||commentObj==undefined)
            return;
            
        m_txtModelic.setValue(commentObj.modelic);
        m_txtSendid.setValue(commentObj.sendid);
        m_txtYear.setValue(commentObj.diyear);
       // m_txtCtype.setValue(commentObj.ctype);
        m_txtseqnum.setValue(commentObj.seqnum);
        
        //绑定对象列表
        var objList=Comment.Biz.GetRefObjectData(commentObj.ID);
        this.BindObjUIData(objList)
        //this.txtObjGrid.setDisabled(true);
            
        //编辑意见
        if (this.WindowType==Comment.CommentWindowType.EditCommentWindow) {
            m_txtIssueDate.setValue(commentObj.issdate);
            m_txtLanguage.setValue(commentObj.language);
            m_txtLanguageCountry.setValue(commentObj.languageCountry);
            m_txtEntName.setValue(commentObj.entname);
            m_txtCity.setValue(commentObj.city);
            m_txtCountry.setValue(commentObj.country);
            m_txtSecurity.setValue(commentObj.security);
            m_txtPriority.setValue(commentObj.priority);
            m_txtResponse.setValue(commentObj.response);
            
            m_txtTitle.setValue(commentObj.ctitle);
            m_txtContent.setValue(commentObj.ccontent);
            
            m_txtCtype.setValue(commentObj.ctype);
                
            var attachList=Comment.Biz.GetRefAttachData(commentObj.ID);
            this.BindAttachUIData(attachList);
            
            m_txtTitle.focus();
        }
    },
    
    /*
     *	设置UI控件状态
     */
    SetUIState:function () {
        //非新增意见设置控件只读
        if (this.WindowType!=Comment.CommentWindowType.NewCommentWindow) {
            m_txtModelic.setDisabled(true);
            m_txtSendid.setDisabled(true);
            m_txtseqnum.setDisabled(true);
            m_txtCtype.setDisabled(true);
            m_txtIssueDate.setDisabled(true);
            m_txtYear.setDisabled(true);
          //  this.txtObjGrid.setDisabled(true);
            m_AddObjButton.setDisabled(true);
            m_DeleteObjButton.setDisabled(true);
        }
        else
        {
            m_txtCtype.setDisabled(true);
            m_txtIssueDate.setDisabled(true);
        }
    },
    
    /*
     *	重置UI界面
     */
    ResetWindow:function ()
    {
        var modelicString=Comment.Biz.GetCurrentDMModelicStr();
        m_txtModelic.setValue(modelicString);
        m_txtTitle.reset();
        m_txtLanguage.reset();
        m_txtLanguageCountry.reset();
        m_txtEntName.reset();
        m_txtCity.reset();
        m_txtCountry.reset();
        m_txtSecurity.reset();
        m_txtPriority.reset();
        m_txtResponse.reset();
        m_txtContent.setValue('')  ;
        this.txtRefsGrid.store.removeAll(); 
        this.txtObjGrid.store.removeAll(); 
        m_txtSendid.reset();
        m_txtseqnum.reset();
        
        m_txtCtype.setValue(this.WindowType);
        m_txtYear.setValue(new Date().getFullYear());
        m_txtIssueDate.setValue(new Date());
        m_TabPanel.activate("objGrid");
        
        //设置所有控件为非只读
        m_txtModelic.setDisabled(false);
        m_txtSendid.setDisabled(false);
        m_txtseqnum.setDisabled(false);
        m_txtCtype.setDisabled(false);
        m_txtIssueDate.setDisabled(false);
        m_txtYear.setDisabled(false);
        this.txtObjGrid.setDisabled(false);
        m_AddObjButton.setDisabled(false);
        m_DeleteObjButton.setDisabled(false);
    },
    
    /*
     *	校验界面录入的数据是否合法
     */
    ValidataTextFiled:function()
    {
        var modelicText=m_txtModelic.getValue();
        var sendidText=m_txtSendid.getValue();
        var diyearText=m_txtYear.getValue();
        var seqnumText=m_txtseqnum.getValue();
        var ctypeText=m_txtCtype.getValue();
        var titleText=m_txtTitle.getValue();
        var repalyCommentText = m_txtContent.getValue();
        var objCount=this.txtObjGrid.store.data.length;
        
        
        //使用检验方法
        if(!m_txtModelic.validate()|| !m_txtSendid.validate()|| !m_txtYear.validate()|| !m_txtseqnum.validate()|| !m_txtCtype.validate()|| !m_txtTitle.validate()|| !m_txtContent.validate())
        {
		    Service.ShowMessageBox('错误', '校验不能通过，请根据提示信息进行修改。', Ext.MessageBox.OK, Ext.MessageBox.ERROR,null);
            return false;
        }
        
        var errorInfo='';
        
        //空检验
        if(repalyCommentText=='')
            errorInfo+='内容不能为空！';
        
        //对象列表检验
        if(objCount==0)
            errorInfo+='对象不能为空！'

         if(errorInfo!='')
         {
            Service.ShowMessageBox('错误', errorInfo, Ext.MessageBox.OK, Ext.MessageBox.ERROR,null);
            return false;
         }

        var re =/^([a-zA-Z0-9]([a-zA-Z0-9])*)$/;
        if(re.test(sendidText)==false)
        {
            Service.ShowMessageBox('错误', '发送单位只能包含字母或数字，请重新输入！', Ext.MessageBox.OK, Ext.MessageBox.ERROR,null);
            return false;
        }
        
        var reYear =/^([0-9]([0-9])*)$/;
        if(reYear.test(diyearText)==false)
        {
            Service.ShowMessageBox('错误', '分发年份只能是数字，请重新输入！', Ext.MessageBox.OK, Ext.MessageBox.ERROR,null);
            return false;
        }
        
        var reNum =/^([0-9]([0-9])*)$/;
        if(reNum.test(seqnumText)==false)
        {
            Service.ShowMessageBox('错误', '序列号只能是数字，请重新输入！', Ext.MessageBox.OK, Ext.MessageBox.ERROR,null);
            return false;
        }
        
        if(this.WindowType==Comment.CommentWindowType.NewCommentWindow)
        {
            try 
            {
                var ccode=modelicText+'-'+sendidText+'-'+diyearText+'-'+seqnumText+'-'+ctypeText;
	            if(Comment.Biz.IsExistComment(ccode))
                {
		            Service.ShowMessageBox('错误', '编码（型号、发送单位、分发年份、序列号、类型）不允许重复，请重新输入！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                    return false;
                }
            }            
            catch (e) 
            {
            }
            finally 
            {
            }
        }
        return true;
    },
    
    /*
     *  通过界面数据构建COMMENT
     */
    BuildComment:function () {
        var pID=0;
        if(this.ParentComment!=null)
            pID=this.ParentComment.ID;
         
        var retComment={ 
                  parentID:pID,  
				  modelic:m_txtModelic.getValue(), 
				  sendid:m_txtSendid.getValue(), 
				  diyear:m_txtYear.getValue(),
				  seqnum:m_txtseqnum.getValue(), 
				  ctype:m_txtCtype.getValue(), 
				  ctitle:m_txtTitle.getValue(), 
				  issdate:m_txtIssueDate.value, 
				  clanguage:m_txtLanguage.getValue(), 
				  clanguageCountry:m_txtLanguageCountry.getValue(),
				  entname:m_txtEntName.getValue(), city:m_txtCity.getValue(), 
				  country:m_txtCountry.getValue(),
				  security:m_txtSecurity.getValue(), 
				  priority:m_txtPriority.getValue(), 
				  response:m_txtResponse.getValue(), 
				  crefs:null, 
				  ccontent:m_txtContent.getValue(), 
				  refcattach:m_txtContent.getValue()};
	    return retComment;
    },
    
    /*
     *  通过界面数据构建简单COMMENT对象(不包括型号,发送单位,年份,序列号,意见类型)
     */
    BuildSingleComment:function () {
        var id=0;
        if(this.CurrentComment!=null)
            id=this.CurrentComment.ID;
        var retComment={ 
                  ID:id,   
				  ctitle:m_txtTitle.getValue(), 
				  issdate:m_txtIssueDate.value, 
				  clanguage:m_txtLanguage.getValue(), 
				  clanguageCountry:m_txtLanguageCountry.getValue(),
				  entname:m_txtEntName.getValue(), city:m_txtCity.getValue(), 
				  country:m_txtCountry.getValue(),
				  security:m_txtSecurity.getValue(), 
				  priority:m_txtPriority.getValue(), 
				  response:m_txtResponse.getValue(), 
				  crefs:null, 
				  ccontent:m_txtContent.getValue(), 
				  refcattach:m_txtContent.getValue()};
	    return retComment;
    },
    
    /*
     *	获取当前对象列表数据
     */
    GetRefObjDatas:function () {
       var objList=new Array();
       if (this.txtObjGrid.store.data.length>0) 
        objList=this.txtObjGrid.store.data.items;
       return objList;
    }
    
    
});

/**
 * @功能:意见编辑明细窗体事件处理类
 * @作者: LuCan
 * @日期: 2010/01/08
 */

Comment.CommentDetailWindowEventHandler = function (sender) {

    //持有窗体UI对象
    var commentDetailWindow = sender;
    
    //编辑的时候维护需要删除的附件列表
    var deleteAttachList=new Array();
    //上传附件窗体
    var upLoadFileWin=null;
    
  
   
    /*
     *	选择对象
     */
    this.SelectObject = function () {
         //选择对象UI窗体
        var selectObjWindow=new Comment.CommentSelectObjWindow();
        selectObjWindow.on("confirmSuccess",onSelectWindowConfirm)
        
      //  var currentObjList=commentDetailWindow.GetRefObjDatas();
        
        //selectObjWindow.SetTreeNodesChecked(currentObjList);
        selectObjWindow.show();
        //同步树对象选中节点

    };

    /*
     *	删除对象
     */
    this.DeleteObject = function () {
        while (commentDetailWindow.txtObjGrid.selModel.selections.length>0) {
               commentDetailWindow.txtObjGrid.store.remove(commentDetailWindow.txtObjGrid.selModel.selections.items[0]);
         }                            
    };

    /*
     *	增加附件
     */
    this.AddAttach = function () {
       var hosturl=window.location.href;
       hosturl=hosturl.substring(0,hosturl.lastIndexOf('index.html'));
       upLoadFileWin =  window.open(hosturl+'UpLoad.aspx?CommentID='+commentDetailWindow.CommentUUID,'_blank','height=220, width=550, top=200, left=200, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no');
       upLoadFileWin.attachEvent("onunload",AddRefAttachCallBack);
    };

    /*
     *	删除附件
     */
    this.DeleteAttach = function () {
         while (commentDetailWindow.txtRefsGrid.selModel.selections.length>0)
	    {
	        Comment.Biz.DeleteTempAttachFile(commentDetailWindow.txtRefsGrid.selModel.selections.items[0].data.path);
            deleteAttachList.push(commentDetailWindow.txtRefsGrid.selModel.selections.items[0].data.path);
		    commentDetailWindow.txtRefsGrid.store.remove(commentDetailWindow.txtRefsGrid.selModel.selections.items[0]);
	    }  
    };

    /*
     *	提交
     */
    this.Confirm = function () {
        if(!commentDetailWindow.ValidataTextFiled())
            return;
        try 
        {   var result=null;
            var comment=null;
            //编辑意见或答复
            if (commentDetailWindow.WindowType==Comment.CommentWindowType.EditCommentWindow) {
                comment=commentDetailWindow.BuildSingleComment();
                result=Service.WebService.Post('UpdataCommentElement',comment);
                if(result!=null){
                    AddRefAttachs(comment.ID);
                    Comment.Biz.DeleteAttachFiles(deleteAttachList);
                    deleteAttachList=new Array();
                }
            }
            //新增意见或回复
            else 
            {
                comment=commentDetailWindow.BuildComment();
                comment.ID=Service.NewGuid();
                result=Service.WebService.Post('AddCommentElement',comment);
                if(result!=null){
                    if(result.text=='isexist')
				    {
				         Service.ShowMessageBox('错误', '中间答复或最终答复只能添加一个！', Ext.MessageBox.OK, Ext.MessageBox.ERROR,null);
                         return;
				    }
                    AddRefObjects(comment.ID);
                    AddRefAttachs(comment.ID);
                }
            }
            
            //confirmSuccess 参数 hasEdit --是否编辑,hasNewComment--是否新增意见,hasNewReply--是否新增回复
            var hasEdit=false,hasNewComment=false,hasNewReply=false;
            if(commentDetailWindow.WindowType==Comment.CommentWindowType.EditCommentWindow)
               hasEdit=true;
            else if (commentDetailWindow.WindowType==Comment.CommentWindowType.NewCommentWindow)
                hasNewComment=true;
            else if (commentDetailWindow.WindowType==Comment.CommentWindowType.NewMidReplyWindow||
              commentDetailWindow.WindowType==Comment.CommentWindowType.NewEndReplyWindow) 
              hasNewReply=true;
            
            commentDetailWindow.hide();
            
            if(commentDetailWindow.HasParentCommentPanel==true)
            {
                commentDetailWindow.fireEvent("confirmSuccess",hasEdit,hasNewComment,hasNewReply);
            }
            
        }
        catch(e)
        {
        
        }
        finally
        {
            
        }
    };


    /*
     *	关闭
     */
    this.Close = function () {
           try 
	       {
	            commentDetailWindow.fireEvent("CommentHide",this);
	            commentDetailWindow.CurrentComment=null;
	            commentDetailWindow.ParentComment=null;
	            
	            //检测附件浏览页面是否关闭
	            if(upLoadFileWin!=null&&upLoadFileWin!=undefined)
                 {
                    upLoadFileWin.close();
                 }
                            
	            //不需要关闭,因为该对象在系统中为单实例        
	            commentDetailWindow.hide();	
	            
	        }               
	        catch (e) 
	        {
	        }
    };
    
    /*
     *	提交添加对象 
     */
    function AddRefObjects(id) {
        var txtObjGrid=commentDetailWindow.txtObjGrid;
        for(var i = 0; i < txtObjGrid.store.data.length; i++)
		{
			var formatdmc = Comment.Biz.GetDMCByCodeString(txtObjGrid.store.data.items[i].data.DMC);
			var refObj={ cid:id, 
					dmc:formatdmc,//objGrid.store.data.items[i].data.DMC, 
					title:txtObjGrid.store.data.items[i].data.Title, 
					objecttype:txtObjGrid.store.data.items[i].data.ObjType,
					issno:txtObjGrid.store.data.items[i].data.Issno, 
					lang:txtObjGrid.store.data.items[i].data.Lang, 
					objectdate:''};
			Service.WebService.Post('AddRefObjects',refObj);
	    }
    };
    
    /*
     *	提交添加附件
     */
    function AddRefAttachs(id) {
        var txtRefsGrid=commentDetailWindow.txtRefsGrid;
        for(var i = 0; i < txtRefsGrid.store.data.length; i++)
		{
		    var refAttach={cid:id,
						filename:txtRefsGrid.store.data.items[i].json[0], 
						extfilename:txtRefsGrid.store.data.items[i].json[0].substring(txtRefsGrid.store.data.items[i].json[0].lastIndexOf('.')+1), 
						path:txtRefsGrid.store.data.items[i].json[1]};
			Service.WebService.Post('AddRefcattachs',refAttach);
		}
    };
    
    /*
     *	增加附件后的回调处理
     */
    function AddRefAttachCallBack() {
      var tempFileList= Comment.Biz.GetFileListByCommentUUID(commentDetailWindow.CommentUUID);
      commentDetailWindow.AddAttachUIData(tempFileList);
      
      if(upLoadFileWin!=null)
        upLoadFileWin.close();
      upLoadFileWin=null;
    };
    
  /*
   *	选择窗体提交事件响应方法(刷新选择对象列表)
   */
   function onSelectWindowConfirm(selectObjList) {
        commentDetailWindow.BindObjUIData(selectObjList);
    }
    
};