/**
 * @功能:意见管理面板控件
 * @作者: LuCan
 * @日期: 2010/01/07
 */
 
Comment.CommentMgrPanel = Ext.extend(Ext.Panel, {
    id: 'm_pnlComment',
    region: 'center',
    closable: true,
    border: false,
    layout: 'border',
    //title: '意见管理',
    iconCls: 'iconComment',

    /*
     *	事件处理类
     */
    m_EventHandler: null,

    /*
     *	左边意见列表控件
     */
    m_CtrlCommentList: null,
    m_CommentAarryReader: null,
    m_CommentColModel: null,

    /*
      *	右边意见详细内容控件
      */
    m_CtrlCommentDetailList: null,

    m_radioAllDM: null,
    m_radioCurrentDM: null,
    m_SearchText: null,
    m_readOnly : false,

    /*
     *	config:配置
     *  eventHandler:事件处理类
     */
    constructor: function (config) {
        if (config != undefined) {
            Ext.apply(this, config);
        }
        
        if(config!=undefined)
        {
            
            if(config.DetailWindow!=undefined)
                this.m_EventHandler = new Comment.CommentPanelEventHandler(this,config.DetailWindow);
                
            if(config.readOnly!=undefined && config.readOnly)
            {
                this.m_readOnly=config.readOnly;
            }
            else
              this.title='意见管理';

			if(config.id!=undefined)
				this.id = config.id;
        }
        else
            this.m_EventHandler = new Comment.CommentPanelEventHandler(this);
        Comment.CommentMgrPanel.superclass.constructor.apply(this, arguments);
    },
   
    destroy:function()
    {
        Comment.CommentMgrPanel.superclass.destroy.call(this);
    },
    /*
     *	初始化控件
     */
    initComponent: function () {
        //当前意见RadioButton	
        m_radioCurrentDM = new Ext.form.Radio({
            checked: true,
            ieldLabel: '',
            labelSeparator: '',
            boxLabel: '当前DM意见&nbsp',
            name: 'dm-comment',
            inputValue: 'cur'
        });
        //挂接选择切换事件
        m_radioCurrentDM.on("check", this.m_EventHandler.ListCurrentDMComment);

        //所有意见RadioButton
        m_radioAllDM = new Ext.form.Radio({
            ieldLabel: '',
            labelSeparator: '',
            boxLabel: '所有DM意见',
            name: 'dm-comment',
            inputValue: 'all'
        });
        m_radioAllDM.on("check", this.m_EventHandler.ListAllDMComment);

        //新增意见Action
        var mc_btAddItem = new Ext.Action({
            text: '新增意见',
            icon: 'resources/images/16x16/AddComments.png',
            cls: 'x-btn-text-icon',
            handler: this.m_EventHandler.AddNewComment
        });

        //中间答复意见Action
        var mc_btMidReplayItem = new Ext.Action({
            text: '中间答复',
            icon: 'resources/images/16x16/AddComments.png',
            cls: 'x-btn-text-icon',
            handler: this.m_EventHandler.AddCommentMidReply
        });

        //最终答复意见Action
        var mc_btReplayItem = new Ext.Action({
            text: '最终答复',
            icon: 'resources/images/16x16/AddComments.png',
            cls: 'x-btn-text-icon',
            handler: this.m_EventHandler.AddCommentEndReply
        });

        //打包意见Action
        var mc_btCommentOutput = new Ext.Action({
            text: '打包意见',
            icon: 'resources/images/16x16/DownStep.png',
            cls: 'x-btn-text-icon',
            handler: this.m_EventHandler.PackComment
        });

        //打包历史Action
        var btCommentOutputHistory = new Ext.Action({
            id: 'btCommentOutputHistory',
            name: 'btCommentOutputHistory',
            text: '打包历史',
            icon: 'resources/images/16x16/Export.png',
            cls: 'x-btn-text-icon',
            handler: this.m_EventHandler.ViewPackCommentHistory
        });

        //打印意见Action
        var btCommentPrint = new Ext.Action({
            id: 'btCommentPrint',
            name: 'btCommentPrint',
            text: '打印意见',
            icon: 'resources/images/16x16/Print.png',
            cls: 'x-btn-text-icon',
            handler: this.m_EventHandler.PrintComment
        });

        //查找Action
        var mc_btSearch = new Ext.Action({
            text: '查找',
            icon: 'resources/images/16x16/search.gif',
            cls: 'x-btn-text-icon',
            handler: this.m_EventHandler.SearchComment
        });

        //查找文本输入框
        m_SearchText = new Ext.form.TextField({
            fieldLabel: '标题查找',
            emptyText: '标题或内容检索词',
            width: 110,
            hideLabel: false,
            name: 'searchTitle'
        });

        //展示列对照数组
        var mc_commentReader = new Ext.data.ArrayReader({},
        [{
            name: 'ID'
        },
        {
            name: 'parentID'
        },
        {
            name: 'modelic'
        },
        {
            name: 'sendid'
        },
        {
            name: 'diyear'
        },
        {
            name: 'seqnum'
        },
        {
            name: 'ctype'
        },
        {
            name: 'ctitle'
        },
        {
            name: 'issdate'
        },
        {
            name: 'language'
        },
        {
            name: 'languageCountry'
        },
        {
            name: 'entname'
        },
        {
            name: 'city'
        },
        {
            name: 'country'
        },
        {
            name: 'security'
        },
        {
            name: 'priority'
        },
        {
            name: 'response'
        },
        {
            name: 'ccode'
        },
        {
            name: 'crefs'
        },
        {
            name: 'ccontent'
        },
        {
            name: 'refcattach'
        },
        {
            name: 'ctypetext'
        },
        {
            name: 'securitytext'
        },
        {
            name: 'prioritytext'
        },
        {
            name: 'responsetext'
        }]);

        //左边区域列模型
        var mc_commentCM = new Ext.grid.ColumnModel([
        new Ext.grid.RowExpander({
            tpl: new Ext.Template('<p style="line-height:5mm"><b>型号:</b>&nbsp{modelic}<br/><b>发送单位:</b>&nbsp{sendid}<br/><b>分发年份:</b>&nbsp{diyear}<br/><b>序列号:</b>&nbsp{seqnum}<br/><b>批注类型:</b>&nbsp{ctypetext}<br/><b>内容:</b>&nbsp{ccontent}</p>')
        }), {
            header: "标题",
            width: '50%',
            sortable: true,
            dataIndex: 'ctitle'
        },
        {
            header: "编码",
            width: '50%',
            sortable: true,
            dataIndex: 'ccode'
        }]);

        //左边区域意见列表
        var mc_pnlCommetList = new Ext.grid.GridPanel({
            //id: 'pnlComments',
            region: 'west',
            stripeRows: true,
            deferRowRender: false,
            collapsible: true,
            split: true,
            title: '意见',
            width: 250,
            store: new Ext.data.Store({
                reader: mc_commentReader,
                data: new Array()
            }),
            cm: mc_commentCM,
            viewConfig: {
                forceFit: true
            },
            plugins: new Ext.grid.RowExpander({
                tpl: new Ext.Template('<p style="line-height:5mm"><b>型号:</b>&nbsp{modelic}<br/><b>发送单位:</b>&nbsp{sendid}<br/><b>分发年份:</b>&nbsp{diyear}<br/><b>序列号:</b>&nbsp{seqnum}<br/><b>批注类型:</b>&nbsp{ctypetext}<br/><b>内容:</b>&nbsp{ccontent}</p>'),
				enableCaching : false,
				lazyRender : false
            })
        });
        mc_pnlCommetList.on('rowclick', this.m_EventHandler.onCommentListRowClick);

        var curryPanel=this;
        //右边内容区域列表
        var mc_pnlCommentReplies = new Ext.grid.GridPanel({
            //id: 'pnlCommentReplies',
            region: 'center',
            title: '详细',
            store: new Ext.data.Store({
                reader: mc_commentReader,
                data: new Array()
            }),
            trackMouseOver: false,
            disableSelection: false,
            hideHeaders: true,
            loadMask: true,
            cm: new Ext.grid.ColumnModel([{
                dataIndex: ''
            }]),
            // customize view config
            viewConfig: {
                forceFit: true,
                enableRowBody: true,
                showPreview: true,
                getRowClass: function (record, rowIndex, p, store) {
                    if (this.showPreview) {
                        //   mc_currentCommentItem = record.data;
                        var title_img = '<img src="resources/images/16x16/Comments.png" align="absmiddle">';

                        if (record.data.ctype == 'I') {
                            title_img = '<img src="resources/images/16x16/Export.png" align="absmiddle">';
                        }
                        if (record.data.ctype == 'R') {
                            title_img = '<img src="resources/images/16x16/Reference.png" align="absmiddle">';
                        }

                        p.body = '<div style="margin-left: 5px; margin-right: 5px"><table style="width:100%" border=0>';
                        p.body += '<tr valign=center><td align=right width="80">' + title_img + '&nbsp;<B>编码: </B></td><td width="8"></td><td style="padding-top:1px">' + record.data.ccode + '</td><td align=center width="80">';
                        
                       var readOnly=false;
                       if(curryPanel!=undefined)
                            readOnly=curryPanel.m_readOnly;
                            
                        if(!readOnly)
                        {
                            p.body += '<a class="editCls" commentid="' + record.data.ID + '"  href="#">';
                            p.body += '<img commentid="' + record.data.ID + '" src="resources/images/16x16/DM.gif" align="absmiddle">编辑<a/>';
                        }
                        p.body += '</td><td align=center width="80">'
                     
                       if(!readOnly)
                       {
                            p.body += '<a class="deleteCls" href="#" commentid="' + record.data.ID + '">';
                            p.body += '<img commentid="' + record.data.ID + '" src="resources/images/16x16/Delete.png" align="absmiddle">删除<a/>';
                        }
                        p.body += '</td></tr>';
                        var title = record.data.ctitle.replace(/</g, "&lt;");
                        title = title.replace(/>/g, "&gt;");

                        p.body += '<tr><td align=right><B>标题: </B></td><td></td><td style="padding-top:1px">' + title + '</td><td></td><td></td></tr>';
                        p.body += '<tr><td align=right><B>引用对象: </B></td><td></td><td style="padding-top:1px">' + record.data.crefs + '</td><td></td><td></td></tr>';
                        p.body += '<tr><td align=right><B>附件: </B></td><td></td><td style="padding-top:1px">' + record.data.refcattach + '</td><td></td><td></td></tr>';
                        p.body += '<tr><td align=right><B>签署日期:   </B></td><td></td><td style="padding-top:1px">' + record.data.issdate + '</td><td></td><td></td></tr>';
                        p.body += '<tr><td align=right><B>语言:    </B></td><td></td><td style="padding-top:1px">' + record.data.language + '-' + record.data.languageCountry + '</td><td></td><td></td></tr>';
                        p.body += '<tr><td align=right><B>创建单位: </B></td><td></td><td style="padding-top:1px">' + record.data.country + '-' + record.data.city + '-' + record.data.entname + '</td><td></td><td></td></tr>';
                        p.body += '<tr><td align=right><B>密级:   </B></td><td></td><td style="padding-top:1px">' + record.data.securitytext + '</td><td></td><td></td></tr>';
                        p.body += '<tr><td align=right><B>优先级:    </B></td><td></td><td style="padding-top:1px">' + record.data.prioritytext + '</td><td></td><td></td></tr>';
                        p.body += '<tr><td align=right><B>回复类型:    </B></td><td></td><td style="padding-top:1px">' + record.data.responsetext + '</td><td></td><td></td></tr>';

                        var content = record.data.ccontent.replace(/</g, "&lt;");
                        content = content.replace(/>/g, "&gt;");
                        p.body += '<tr><td align=right><B>内容:   </B></td><td></td><td style="padding-top:1px">' + content + '</td><td></td><td></td></tr>';
                        p.body += '</table></div><br>';
                    }
                }
            }
        });

        //tbar和Items需要加入后再调用基类的初始化组件
        if(!this.m_readOnly)
            this.tbar = [m_radioCurrentDM, m_radioAllDM, '-', mc_btAddItem, mc_btMidReplayItem, mc_btReplayItem, '-', mc_btCommentOutput, btCommentOutputHistory, btCommentPrint, '-', m_SearchText, mc_btSearch];
        this.items = [mc_pnlCommetList, mc_pnlCommentReplies];

        //设置成员
        this.m_CtrlCommentList = mc_pnlCommetList,
        this.m_CtrlCommentReplyList = mc_pnlCommentReplies,
        this.m_CommentAarryReader = mc_commentReader;
        this.m_CommentColModel = mc_commentCM;

        Comment.CommentMgrPanel.superclass.initComponent.call(this);
    },

    /*
     *	绑定意见列表数据
     *  @参数 {Array} 意见列表数据
     */
    BindingCommentList: function (commentArray) {
        var store = new Ext.data.Store({
            reader: this.m_CommentAarryReader,
            data: commentArray
        });
        this.focus();
        this.m_CtrlCommentList.reconfigure(store, this.m_CommentColModel);
    },

    /*
     *	绑定意见回复列表数据
     *  @参数 {Array} 意见列表数据
     */
    BindingCommentDetailList: function (replyArray) {
        var store = new Ext.data.Store({
            reader: this.m_CommentAarryReader,
            data: replyArray
        });
        this.m_CtrlCommentReplyList.reconfigure(store, new Ext.grid.ColumnModel([{
            dataIndex: ''
        }]));

        //获取行数据中的编辑元素,并且动态挂接事件
        var editArray = $(".editCls");
        for (var i = 0; i < editArray.length; i++) {
            editArray[i].onclick = this.m_EventHandler.EditComment;
        }
        //获取行数据中的删除元素,并且动态挂接事件
        var deleteArray = $(".deleteCls");
        for (var i = 0; i < editArray.length; i++) {
            deleteArray[i].onclick = this.m_EventHandler.DeleteComment;
        }

        //获取行数据中的附件元素,并且动态挂接事件
        var attchArray = $(".attachCls");
        for (var i = 0; i < attchArray.length; i++) {
            attchArray[i].onclick = this.m_EventHandler.OpenCommentAttach;
        }
    },
    

    /*
     *	从左边列表获取当前选中的COMMENT对象
     */
    GetCurrentCommentFromCommentList: function () {
        var currentRow = this.m_CtrlCommentList.getSelectionModel();
        if (currentRow.selections.items.length > 0) {
            currentComment = currentRow.selections.items[0].data;
            return currentComment;
        }
        return null;
    },

    /*
     *	从右边明细区获取当前选中COMMENT对象
     */
    GetCurrentCommentFromDetailList: function () {
        var currentRow = this.m_CtrlCommentReplyList.getSelectionModel();
        if (currentRow.selections.items.length > 0) {
            currentComment = currentRow.selections.items[0].data;
            return currentComment;
        }
        return null;
    },

    /*
     *	从右边明细区列表通过ID获取对应的COMMENT对象
     */
    GetCommentFromDetailListByID: function (id) {

        for (var i = 0; i < this.m_CtrlCommentReplyList.store.data.length; i++) {
            var currentRowData = this.m_CtrlCommentReplyList.store.data.items[i];
            if (currentRowData.data.ID == id) return currentRowData.data;
        }
        return null;
    },

    /*
     *	从左边列表通过ID获取对应的COMMENT对象
     */
    GetCommentFromCommentListByID: function (id) {

        for (var i = 0; i < this.m_CtrlCommentList.store.data.length; i++) {
            var currentRowData = this.m_CtrlCommentList.store.data.items[i];
            if (currentRowData.data.ID == id) return currentRowData.data;
        }
        return null;
    },

    /*
      *	刷新右边明细列表
      */
    RefreshDetailList: function () {
        var detailArray = new Array();
        var currentComment = this.GetCurrentCommentFromCommentList();
        if (currentComment != null) 
			detailArray = Comment.Biz.QueryCommentList(currentComment.ID);
        this.BindingCommentDetailList(detailArray);

		
		
    },
    /*
      *	刷新左边当前选中数据
      */
    RefreshCurrentComment: function () {
		var detailArray = new Array();
        var currentComment = this.GetCurrentCommentFromCommentList();
        if (currentComment != null) 
		{
			detailArray = Comment.Biz.QueryCommentList(currentComment.ID);
			var currentRow = this.m_CtrlCommentList.getSelectionModel();

			if (currentRow.selections.items.length > 0 && detailArray.length > 0) {
				var store = new Ext.data.Store({
					reader: this.m_CommentAarryReader,
					data: detailArray
				});
				currentRow.selections.items[0].data = store.data.items[0].data;
				currentRow.selections.items[0].commit();
			}
		}
    },
    /*
      *	刷新左边列表
      */
    RefreshCommentList: function () {
        if (m_radioCurrentDM.checked) this.m_EventHandler.ListCurrentDMComment(m_radioCurrentDM, true);
        else this.m_EventHandler.ListAllDMComment(m_radioAllDM, true);
    },

    /*
      *	显示所有DM意见checkBox是否选中
      */
    IsRadioAllDMChecked: function () {
        return m_radioAllDM.checked;
    },

    GetSearchText: function () {
        return m_SearchText.getValue();
    },
    
    show:function () {
            Comment.CommentMgrPanel.superclass.show.call(this);
            this.on('activate',this.m_EventHandler.onPanelActived)
    }

});


/*
 * @功能:意见管理面板控件事件处理类
 * @作者: LuCan
 * @日期: 2010/01/07
 */
 
Comment.CommentPanelEventHandler = function (sender,commentDetailWindow) {

    /*********************************持有UI对象******************************************/
    //持有面板UI对象
    var commentPanel = sender;
 
    
    /*
     *	侦听编辑窗体提交成功事件
     */
    this.onDetaiWindowConfirm = function (hasEdit, hasNewComment, hasNewReply) {
     
        if (hasEdit || hasNewReply)	{
			//比较好的做法应该是修改原始意见时才需要刷新左边当前数据信息，
			//但是现在不好判断是编辑原始的还是中间答复还是最终答复，现在只好凡是修改了意见都刷新。
			commentPanel.RefreshCurrentComment();
			commentPanel.RefreshDetailList();
		}
        else if (hasNewComment) {
            commentPanel.RefreshCommentList();
        }
    }

    /*
     *	新增、编辑明细窗体(必须位置放在this.onDetaiWindowConfirm后面,否则事件挂接不上去)
     *  多次New ExtWindow实例会产生内存泄露,所以只允许一个实例
     */
    var detailWindow = commentDetailWindow;
//    new Comment.CommentDetailWindow({
//        WindowType: Comment.CommentWindowType.NewCommentWindow
//    });
    if(detailWindow!=undefined)
        detailWindow.on("confirmSuccess", this.onDetaiWindowConfirm);

    /*
     *  显示当前DM意见
     */
    this.ListCurrentDMComment = function (cb, checkValue) {
        if (checkValue) {
            var commentList = Comment.Biz.GetCurrentDMCComments();
            commentPanel.BindingCommentList(commentList);
            //清空回复内容区域
            commentPanel.BindingCommentDetailList(new Array());
        }

    };

    /*
     *	显示所有DM意见
     */
    this.ListAllDMComment = function (cb, checkValue) {

        if (checkValue) {
            var allComments = Comment.Biz.QueryCommentList(Comment.QueryCommentType.AllCOMMENT);
            commentPanel.BindingCommentList(allComments);
             //清空回复内容区域
            commentPanel.BindingCommentDetailList(new Array());
        }

    };

    /*
     *	新增意见
     */
    this.AddNewComment = function () {
        detailWindow.WindowType = Comment.CommentWindowType.NewCommentWindow;
        detailWindow.HasParentCommentPanel=true;
        detailWindow.show();
        detailWindow.ParentComment = null;
        detailWindow.CurrentComment = null;
        detailWindow.ResetWindow(); //重置对象
        detailWindow.BindObjUIData(Comment.Biz.GetDefaultRefObjData()); //绑定对象列表
        detailWindow.SetUIState(); //设置控件状态
    };

    /*
     *	新增中间回复
     */
    this.AddCommentMidReply = function () {
        AddCommentReply(Comment.CommentWindowType.NewMidReplyWindow);
    };

    /*
     *	新增意见最终答复
     */
    this.AddCommentEndReply = function () {
        AddCommentReply(Comment.CommentWindowType.NewEndReplyWindow);
    };

    /*
     *	明细区域编辑意见或回复
     */
    this.EditComment = function () {
        //获取当前编辑行的意见ID
        var id = event.srcElement.attributes["commentid"].value
       // id = parseInt(id);
        var comment = commentPanel.GetCommentFromDetailListByID(id);
        if (comment == null) return;
        detailWindow.WindowType = Comment.CommentWindowType.EditCommentWindow;
		detailWindow.HasParentCommentPanel=true;
        detailWindow.ParentComment = null;
        detailWindow.CurrentComment = comment;
        detailWindow.show();
        detailWindow.ResetWindow(); //重置对象
        detailWindow.BindingUIData(comment); //绑定对象列表
        detailWindow.SetUIState(); //设置控件状态
    };

    /*
     *	明细区域删除意见
     */
    this.DeleteComment = function () {

        var deleteid = event.srcElement.attributes["commentid"].value
        //deleteid = parseInt(deleteid);
        if (!Comment.Biz.IsCanAddReply(deleteid, Comment.CommentWindowType.NewMidReplyWindow) || !Comment.Biz.IsCanAddReply(deleteid, Comment.CommentWindowType.NewEndReplyWindow)) {
            Service.ShowMessageBox('错误', '已经存在中间回复或最终答复，无法进行删除！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            return;
        }

        Service.ShowMessageBox('确认', '您确认要删除意见吗？', Ext.MessageBox.YESNO, Ext.MessageBox.QUESTION, CommentDeleteCallBack);

        function CommentDeleteCallBack(button, text) {
            if (button == 'yes') {
                try {
                    Service.WebService.Post('DeleteCommentElement', {
                        id: deleteid
                    },
                    null);

                    if (commentPanel.GetCommentFromCommentListByID(deleteid) != null)
                         commentPanel.RefreshCommentList();
                    commentPanel.RefreshDetailList();
                }
                catch(e) {
                    Service.ShowMessageBox('错误', '删除意见失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
                }
                finally {}
            }
        };
    };

    /*
     *	右边明细区域打开意见的附件
     */
    this.OpenCommentAttach = function () {
        var attachUrl = null;
        var win;
        var attachid = event.srcElement.attributes["attachID"].value
        attachid = parseInt(attachid);
        attachUrl = Comment.Biz.GetAttachFileNameByAttachID(attachid);
        if (attachUrl != null) {
            win = window.open('CommentAttachmentDownLoad.aspx?fileName=' + attachUrl, '_blank', 'height=1, width=1, top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
            ClosePage(win);
        }

        function ClosePage(win) {
            if (win == null || win.closed || win == undefined) {
                return;
            }
            setTimeout(function () {
                try {
                    win.close();
                }
                catch(e) {
                    return;
                }

                ClosePage(win);

            },
            2000);
        };
    }

    /*
     *	打包意见
     */
    this.PackComment = function () {
        var packWindow = new Comment.CommentPackWindow();
        var commentList = new Array();
        var commentViewList = new Array();

        if (commentPanel.IsRadioAllDMChecked()) {
            commentList = Comment.Biz.QueryCommentList(Comment.QueryCommentType.AllCOMMENT);
        }
        else {
            commentList = Comment.Biz.GetCurrentDMCComments();
            if (commentList.length == 0) {
                Service.ShowMessageBox('信息', '当前没有意见可打包！', Ext.MessageBox.OK, Ext.MessageBox.INFO, null);
                return;
            }
        }
        packWindow.show();
        commentViewList = packWindow.BuidListViewData(commentList);
        packWindow.BindCommentListUIData(commentViewList)

    };

    /*
     *	查看打包历史记录
     */
    this.ViewPackCommentHistory = function () {
        var historyWidow = new Comment.CommentPackHistoryWindow();
        var allHistoryData = Comment.Biz.GetAllCommentHistoryData();
        historyWidow.show();
        historyWidow.BindPackHistoryListUIData(allHistoryData);
    };

    /*
     *	打印意见
     */
    this.PrintComment = function () {
        if (commentPanel.IsRadioAllDMChecked()) {
            commentList = Comment.Biz.QueryCommentList(Comment.QueryCommentType.AllCOMMENT);
        }
        else commentList = Comment.Biz.GetCurrentDMCComments();
        var printWindow = new Comment.CommentPrintWindow();
        printWindow.show();
        printWindow.IsShowAllDMComment = commentPanel.IsRadioAllDMChecked;
        printWindow.BindTreeUIData(commentList);

    };

    /*
     *	查找意见
     */
    this.SearchComment = function () {
        var searchText = commentPanel.GetSearchText();
        if (searchText.length <= 100) {
            var myArray = new Array();
            var result;
            try {
                result = Service.WebService.Post('SearchCommentElements', {
                    searchText: searchText
                });
            }
            catch(e) {}
            if (result != null) {
                myArray = Comment.Biz.BuidCommentListByReponseResult(result);
                commentPanel.BindingCommentList(myArray);
                commentPanel.BindingCommentDetailList(new Array());
            }
        }
        else {
            Service.ShowMessageBox('信息', '检索词超过规定的长度(100)，请重新输入！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
        }
    };

    /*
     *	意见列表数据行单击(刷新明细内容区域)
     */
    this.onCommentListRowClick = function (grid, rowIndex, e) {
        commentPanel.RefreshDetailList();
    }

    this.onDetailListEditClick = function () {
        //获取单击编辑对象行对应COMMENT的ID
        var id = event.srcElement.attributes["commentid"].value
        this.EditComment(id);
    }

   
     /*
     *	如果当前面板要求显示当前DM意见列表,
     *  则在面板每次激活的时候获取下该DM的意见
     */
    this.onPanelActived=function () {
        if(!commentPanel.IsRadioAllDMChecked())
        {
            var commentList = Comment.Biz.GetCurrentDMCComments();
            commentPanel.BindingCommentList(commentList);
            //清空回复内容区域
            commentPanel.BindingCommentDetailList(new Array());
        }
    }
    /****************************辅助方法***********************************/
    function AddCommentReply(replyType) {
        detailWindow.HasParentCommentPanel=true;
        //验证是否可添加回复
        var currentComment = commentPanel.GetCurrentCommentFromCommentList();
        if (currentComment == null) {
            Service.ShowMessageBox('错误', '当前未选中意见，无法进行回复！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            return;
        }

        if (!Comment.Biz.IsCanAddReply(currentComment.ID, replyType)) {
            Service.ShowMessageBox('错误', '已经存在中间回复或最终答复，无法进行回复！', Ext.MessageBox.OK, Ext.MessageBox.ERROR, null);
            return;
        }
        detailWindow.WindowType = replyType;
        detailWindow.ParentComment = currentComment;
        detailWindow.CurrentComment = null;
        detailWindow.show();
        detailWindow.ResetWindow(); //重置对象
        detailWindow.BindingUIData(currentComment); //绑定对象列表
        detailWindow.SetUIState(); //设置控件状态
    };
};


/*
 * @功能:意见管理面板控件事件处理类
 * @作者: wanghai
 * @日期: 2010/06/01
 */
Comment.CommentViewWindow =  Ext.extend(Ext.Window, {
    closable: false,
    iconCls: 'iconComment',
    title:'意见列表',
    width: 720,
    height: 580,
    id:'CommentViewWindow',
    buttonAlign: 'center',
    plain: true,
    modal: true,
    closable: false,
    resizable: false,
    layout: 'border',
    shadow : false,
     //wanghai 重写Render方法，改变MASK。
     onRender : function(ct, position){
            Comment.CommentViewWindow.superclass.onRender.call(this,ct, position);
            this.el.shadowDisabled=true;
     },
     show : function(animateTarget, cb, scope)
     {
            Comment.CommentViewWindow.superclass.show.call(this,animateTarget, cb, scope);
            var commentList = Comment.Biz.GetCurrentDMCComments();
            this.viewPamel.BindingCommentList(commentList);
         
            
            this.viewPamel.m_CtrlCommentList.selModel.selectRow(0, true);
            this.viewPamel.RefreshDetailList();
     },
     
      /*
     *	初始化控件
     */
    initComponent: function () {
           var detailWindow = Ext.WindowMgr.get("CommentDetailWindow");   
           if(detailWindow == null)
           {
                detailWindow = new Comment.CommentDetailWindow({
                    WindowType: Comment.CommentWindowType.NewCommentWindow
                });
           }
		   //设置专门的ID，免得与意见管理使用面板的默认ID重复
		   var tempViewPamel = Ext.WindowMgr.get("CommentViewWindowPanel");   
		   if(tempViewPamel == null)
		   {
				tempViewPamel = new Comment.CommentMgrPanel({id:"CommentViewWindowPanel",readOnly:true,DetailWindow:detailWindow});
		   }
		   this.viewPamel = tempViewPamel;
           this.items = [this.viewPamel];
           this.buttons = [{
            text: '关闭',
            id: 'closeButton',
            handler: function(){
                var  viewWindow=Ext.WindowMgr.get("CommentViewWindow");   
                viewWindow.hide();
                viewWindow.fireEvent("CommentHide",this);
            }
        }];
        
         this.addEvents({"CommentHide":true});
         Comment.CommentDetailWindow.superclass.initComponent.call(this);
    }
});