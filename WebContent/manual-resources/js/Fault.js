/************************************************************************
*功能描述：故障管理
*作者：wanghai
*日期：2009-03-12      
*修改：
*2010-01-12  lucan  重构
************************************************************************/

/**********************************供模板翻译HTML使用的方法***********************/
/*
 *	单击导航过程处理方法
 */
function answer(id) {
    IETM.Fault.GoIsoProcID = id;
    IETM.Fault.OnAfiNextClick();
}

///模板中用
function afiHightLineLayer(code, title) {
    //收起多媒体控件区域
    if (IETM.Common.MainFrame != undefined && IETM.Common.MainFrame != null) {
        IETM.Common.MainFrame.SetMultimediaVieSwerCollapsed(true);
    }
    IETM.Fault.ShowIsolatep(code, title);
}
/*********************************************************************************/


/*
 *	故障对外接口
 */
IETM.Fault = {
    /*
     *	排故过程的当前步骤
     */
    CurrentIsoProcIndex: -1,

    /*
     *	排故过程数组 
     */
    IsoProArray: null,

    /*
     *	最大可排故过程数量
     */
    MaxIsoProCount: 50,

    /*
     *	下一步的步骤ID
     */
    GoIsoProcID: -1,

    /*
     *	当前排故故障ID
     */
    FaultID: undefined,
    
     /*
     *	RCM排故
     */
    IsRcmUser: false,
    
     /*
     *	缓存故障的动态内容
     */
    FaultDocument:null,

    /*
     *	初始化
     */
    Init: function () {
        var code = null,
        title = null;
        this.FaultDocument = $("body", window.frames[IETM.Common.DataFrameID].document);
        IETM.ApplicRecised.FilterApplic(this.FaultDocument);

        if(IETM.Common!=undefined && IETM.Common!=null)
            this.IsRcmUser=IETM.Common.UserInfo.RcmUser;

        if(this.IsRcmUser)
        {
        $("body",top.document).append("<div style='display:none' id='RCM-Report'></div>");
            IETM.Common.MainFrame.SetPageNavigationButtonVisible(IETM.Common.MainFrame.PageNavigationButtonType.Afi_Report,true);
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Afi_Report,true); 
        }
        else{
            IETM.Common.MainFrame.SetPageNavigationButtonVisible(IETM.Common.MainFrame.PageNavigationButtonType.Afi_Report,false);
        }

        this.SetAfiBeginButtonDisabled(true);
        this.SetAfiBackButtonDisabled(true);

        var proceesAfiXrefHandler = this.ProcessAfiXref;

        IsRcmUser=this.IsRcmUser;
        $(document).find("a[class=afiXref]").each(function () {

            if(IsRcmUser && IETM.Common.UserInfo.fcode!='')
            {
                        if(code==null)
                        {
                            title=this.attributes["afitarget"].value;
                            ind=title.indexOf('-');
                            var drnode;
                            if(ind!=-1)
                            {
                                if(title.substring(ind+2)==IETM.Common.UserInfo.fcode)
                                {
                                    code=this.attributes["name"].value;
                                }
                                else
                                { 
                                   drnode=this.parentNode.parentNode;
                                  drnode.deleteCell(0)
                                  drnode.deleteCell(0)
                                  //this.parentNode.parentNode.style.display="none";
                                }
                            }
                        }
                        else
                        {
                                  drnode=this.parentNode.parentNode;
                                  drnode.deleteCell(0)
                                  drnode.deleteCell(0)
                                  //this.parentNode.parentNode.style.display="none";
                        }
            } 
            else
            {
                //获取第一个故障的代码和标题
                if (code == null && title == null) {
                    code = this.attributes["name"].value;
                    title = this.attributes["afitarget"].value;
                }
            }

            //处理故障头信息
            proceesAfiXrefHandler.call(IETM.Fault, this);

        });
        //显示第一个故障
        this.ShowIsolatep(code, title);
        
    },

    OnAfiLogicTableClick: function () {
        //(实现点击成为开关)这个寻找方法如果dialog.js里面更改了逻辑标题的id不叫TB_titleDiv这里就没用了
        var titleDiv=$("#TB_window #TB_titleDiv");
        if(titleDiv.length>0 && titleDiv[0].innerText=="故障隔离逻辑表")
        {
            tb_remove();
            return;
        }
        //把弹出的窗体关闭
            tb_remove();
            var caption = "故障隔离逻辑表";
            var url = "#TB_inline?width=" + 600 + "&height=" + 400;
            var buttonHtml = "<input type=\"button\" class=\"buttoncls\" id=\"Conform\" value=\"确定\"  />";
            
            var LogicTableContent="<div></div>";
            var contentHtml = $("div[name='LogicTable"+ this.FaultID +"']", this.FaultDocument);
            if(contentHtml.length>0)
            {
                LogicTableContent=contentHtml[0].innerHTML;
            }
            
            tb_show(caption, url, buttonHtml,LogicTableContent);

            $("#Conform").bind("click", "", function () {
                tb_remove();
            });
            $("#tb_CloseImage").bind("click", "", function () {
                tb_remove();
            }); 
            //IETM.AssistantInfo.ModalFormShow = true;
        
    },

    /*
     *	响应开始隔离按钮单击事件
     */
    OnBenginAfiClick: function (faultID) {
        //可能已经排故了,并且有弹出窗体,需要现把弹出的窗体关闭
        tb_remove();
        
        //已经进行了排故
        if (this.CurrentIsoProcIndex != -1) {
            //换另外一个故障进行排故
            if (faultID != undefined) {
                if (window.confirm("你确认要重新开始故障隔离吗?")) {
                    var title = $("a[name=" + faultID + "]").attr('afitarget');
                    this.ShowIsolatep(faultID, title)
                    this.OnAfiNextClick();
                }
                else return;
            }
            else {
                //同一个故障再次重新排故
                if (window.confirm("你确认要重新开始故障隔离吗?")) {
                    var arr = this.IsoProArray[0];
                    if (arr != undefined) {
                        this.FaultID = arr.faultID;
                        this.GoIsoProcID = arr.goIsoProID;
                    }
                    this.CurrentIsoProcIndex = -1;
                    this.OnAfiNextClick();
                }
                else return;
            }

            this.SetAfiBackButtonDisabled(true);
        }
        else { if (faultID != undefined) {
                var title = $("a[name=" + faultID + "]").attr('afitarget');
                this.ShowIsolatep(faultID, title)
            }
            this.OnAfiNextClick();
        }
    },

    /*
     *	响应下一步按钮单击事件
     */
    OnAfiNextClick: function () {
        //注册当前步
        if (this.CurrentIsoProcIndex == -1) $("#history-dynamic-afi-proc-title").html("隔离过程");

        var contentText = this.GetWaringAndCautionText();
        if (contentText == '') this.ProcessAfiNext();
        else this.ProcessWaringAndCaution(contentText, this.ProcessAfiNext);
    },

    /*
     *	响应上一步按钮单击事件
     */
    OnAfiBackClick: function () {
        this.CurrentIsoProcIndex = this.CurrentIsoProcIndex - 1;
        if (this.CurrentIsoProcIndex >= 0) {
            var arr = this.IsoProArray[this.CurrentIsoProcIndex];
            if (arr != undefined) {
                this.FaultID = arr.faultID;
                this.GoIsoProcID = arr.goIsoProID;

                var contentText = this.GetWaringAndCautionText();
                if (contentText == '') this.ProcessAfiBack();
                else this.ProcessWaringAndCaution(contentText, this.ProcessAfiBack);
            }
        }
    },
    
    /*
     *	显示指定ID故障
     *  @id 故障ID
     *  @title 故障标题
     */
    ShowIsolatep: function (id, title) {

        var isDisable = true;
        if (id != null && id != '') isDisable = false;
        
        if(id!=this.FaultID)
        {
            //加入步骤外的图片,表格等.
            this.AppendOther(id);
        }
        this.FaultID = id;

        this.SetAfiBackButtonDisabled(true);
        this.SetAfiBeginButtonDisabled(isDisable);

        this.CurrentIsoProcIndex = -1;
        this.IsoProArray = new Array(this.MaxIsoProCount);

        //设置当前选中故障头效果
        this.SetSelectIsolatepAffect(id);

        this.SetIsolatepTitleHtml(title);
        this.SetIsolateContentHtml(null);
        this.SetIsolatepEndHtml(null);

        this.SetPrelreqsContentHtml(null);
        //前置条件
        var content = $("div[id='" + id + "'] div[id='proced_prelreqs']", this.FaultDocument);
        if (content.length > 0) {
            //将翻译的前置要求标题去掉，因为内容区域已经有该节点
            content[0].children[0].innerHTML = "";
            this.AppendPrelreqsContentHtml(content[0].innerHTML);
        }

        //安全条件
        content = $("div[id='" + this.FaultID + "'] div[id='proced_safety']", this.FaultDocument);
        if (content.length > 0) {
            this.AppendPrelreqsContentHtml(content[0].innerHTML);
            content = $("div[id='" + this.FaultID + "'] div[name='isostep']", this.FaultDocument);
            if (content.length > 0) {
                this.GoIsoProcID = content[0].id;
            }
            else{
                //特殊处理下存在没有isostep而就一个isoend的情况
                content = $("div[id='" + this.FaultID + "'] div[name='isoend']", this.FaultDocument);
                if(content.length > 0)
                    this.GoIsoProcID=content[0].id;
            }
        }
        
        this.HidePrelreqs(false);
        
        IETM.Graphic.Init();
        IETM.Reference.Init();
        
        //弹出故障里的安全条件
        var isNullSafety=$("div[id='" + this.FaultID + "'] .nullsafety", this.FaultDocument);
        content = $("div[id='" + this.FaultID + "'] div[id='proced_safety']", this.FaultDocument);
        if(isNullSafety.length!=1&&content.length>0)
        {
            this.ShowFaultSafety(content[0].innerHTML);
        }
            
    },

    /*
     *	弹出故障的安全条件
     */
    ShowFaultSafety:function (safetyContent) {
            tb_remove();
            var caption = "安全条件";
            var url = "#TB_inline?width=" + 600 + "&height=" + 400;
            var buttonHtml = "<input type=\"button\" class=\"buttoncls\" id=\"Conform\" value=\"确定\"  />";
            tb_show(caption, url, buttonHtml,safetyContent);

            $("#Conform").bind("click", "", function () {
                tb_remove();
            });
            $("#tb_CloseImage").bind("click", "", function () {
                tb_remove();
            }); 
            IETM.AssistantInfo.ModalFormShow = true;
    },
    
    
    /*
     *	设置隔离按钮是否可用
     */
    SetAfiBeginButtonDisabled: function (isDisable) {
        if (IETM.Common.MainFrame != undefined && IETM.Common.MainFrame != null) {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Afi_Begin, isDisable);
        }
    },

    /*
     *	设置上一步按钮是否可用
     */
    SetAfiBackButtonDisabled: function (isDisable) {
         if (IETM.Common.MainFrame != undefined && IETM.Common.MainFrame != null) {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Afi_Back, isDisable);         
        }
    },

    /*
     *	设置选中故障隔离头效果
     */
    SetSelectIsolatepAffect: function (id) {
        //清除所有效果
        $(".afi_tr_fcode").css("background", "#FFFFFF");
        $(".afi_img_fcode").css("visibility", "hidden");
        //设置所选故障效果
        $("#" + id).css("background", "#d9d9d9");
        $("#" + id + " img").css("visibility", "visible");
    },

    /*
     *	设置隔离头区域内容
     */
    SetIsolatepTitleHtml: function (html) {
        if (html == null) $("#dynamic-afi-proc-title").empty();
        else $("#dynamic-afi-proc-title").html(html);

    },

    /*
     *	设置隔离内容区域内容
     */
    SetIsolateContentHtml: function (html) {
        if (html == null) $("#history-dynamic-afi-proc-content").empty();
        else $("#history-dynamic-afi-proc-content").html(html);
    },

    /*
     *	前置要求区域添加内容
     */
    AppendPrelreqsContentHtml: function (html) {
        $("#prelreqs-afi-proc-content").append(html);
    },

    /*
     *	前置要求区域设置内容
     */
    SetPrelreqsContentHtml: function (html) {
        if (html == null) $("#prelreqs-afi-proc-content").empty();
        $("#prelreqs-afi-proc-content").html(html);
    },

    /*
     *	设置隔离结束区域内容
     */
    SetIsolatepEndHtml: function (html) {
        if (html == null) $("#history-dynamic-afi-proc-closetxt").empty();
        else $("#history-dynamic-afi-proc-closetxt").html(html);
    },

    /*
     *	缓存隔离过程
     */
    CacheIsoProc: function (faultID, goIsoProID) {
        //记录排故步骤

        if (this.CurrentIsoProcIndex < this.MaxIsoProCount && this.CurrentIsoProcIndex >= 0) {
            this.IsoProArray[this.CurrentIsoProcIndex] = {
                faultID: faultID,
                goIsoProID: goIsoProID
            };
        }
    },

    /*
     *	处理下一步
     */
    ProcessAfiNext: function () {
        this.CurrentIsoProcIndex++;
        this.CacheIsoProc(this.FaultID, this.GoIsoProcID);
        if (this.CurrentIsoProcIndex > 0) this.SetAfiBackButtonDisabled(false);

   
       IETM.Common.MainFrame.LocateDirectoryTree();

        //显示，同时注册事件
        this.ShowStep(true);

        IETM.Graphic.ReInit();
        IETM.Reference.Init();
        IETM.Common.Scroller(document.getElementsByName("current-dynamic-a")[0], 800, null);
    },

    /*
     *	处理上一步
     */
    ProcessAfiBack: function () {
        this.ShowStep(false);
        IETM.Common.MainFrame.LocateDirectoryTree();
        IETM.Graphic.ReInit();
        IETM.Reference.Init();
        this.HidePrelreqs(false);

        IETM.Common.Scroller(document.getElementsByName("current-dynamic-a")[0], 800, null);
        if (this.CurrentIsoProcIndex <= 0) {
            this.SetAfiBackButtonDisabled(true);
        }

    },

    /*
     *	处理警告和注意
     *  @afterHandler 处理完后执行的委托
     */
    ProcessWaringAndCaution: function (contentText, afterHandler) {

        tb_remove();
        var caption = "警告！注意";
        var url = "#TB_inline?width=" + 600 + "&height=" + 400;
        var buttonHtml = "<input type=\"button\" class=\"buttoncls\" id=\"Conform\" value=\"确定\"  />";
        tb_show(caption, url, buttonHtml,contentText);

        $("#Conform").bind("click", "", function () {
            tb_remove();
            afterHandler.call(IETM.Fault);
        });
        $("#tb_CloseImage").bind("click", "", function () {
            tb_remove();
            afterHandler.call(IETM.Fault);
        });
        
        IETM.AssistantInfo.ModalFormShow = true;
    },

    /*
     *	获取警告注意文本
     */
    GetWaringAndCautionText: function () {
        var contentText = '';
        var warnings = $("div[id='" + this.FaultID + "'] div[id='" + this.GoIsoProcID + "'] div[class='warning']", this.FaultDocument);
        if (warnings.length > 0) {
            for (var i = 0; i < warnings.length; i++) {
                contentText += warnings[i].innerHTML;
            }
        }
        var cautions = $("div[id='" + this.FaultID + "'] div[id='" + this.GoIsoProcID + "'] div[class='caution']", this.FaultDocument);
        if (cautions.length > 0) {
            for (var i = 0; i < cautions.length; i++) {
                contentText += cautions[i].innerHTML;
            }
        }

        return contentText;
    },

    /*
     *	是否可以下一步(现在不需要该方法,没有下一步按钮,直接界面导航过去了)
     */
    CanNextProc: function () {
        var ret = false;
        //下一步没有内容时也认为是最后一步
        var nextcontent = $("div[id='" + this.FaultID + "'] div[id='" + this.GoIsoProcID + "']", this.FaultDocument);
        if (nextcontent.length == 0) return false;
        else return true;
    },

    /*
     *	显示当前步骤内容
     *  froward=true表示前进，
     *  froward=false表示后退，后退时不记录步骤
     */
    ShowStep: function (forward) {
        if (this.GoIsoProcID != "proced_prelreqs" && this.GoIsoProcID != "proced_safety" && this.GoIsoProcID != null) {
            var content = $("div[id='" + this.FaultID + "'] div[id='" + this.GoIsoProcID + "']", this.FaultDocument);
            var childs = content[0];
            if (childs) {
                //添加历史排故过程
                if (this.CurrentIsoProcIndex >= 0) this.AddAfiProc();
                this.InitInput(forward);
            }
            else {
                alert('不存在隔离步骤：' + this.GoIsoProcID);
                this.CurrentIsoProcIndex = this.CurrentIsoProcIndex - 1;
                if (this.CurrentIsoProcIndex <= 0) {
                    this.SetAfiBackButtonDisabled(true);
                }
            }
        }
    },

    /*
     *	隐藏前置要求内容区域
     */
    HidePrelreqs: function (hide) {
        var div = document.getElementById("prelreqs-afi-proc-content");
        var img = div.parentNode.firstChild.firstChild;
        if (!hide) {
            if (div.style.display == 'none' || div.style.display == '') {
                div.style.display = 'block';
                img.src = img.path + '/collapse.gif';

            }
        }
        else { if (div.style.display == 'block' || div.style.display == '') {
                div.style.display = 'none';
                img.src = img.path + '/expand.gif';

            }
        }
    },

    /*
     *	添加排故区域内容
     */
    AddAfiProc: function () {
        $("#history-dynamic-afi-proc-content").empty();
        this.CreateAfiProc(false)
    },

    /*
     *	生成排故障过程,output=true 表示输出使用 output=false 表示页面内部使用
     */
    CreateAfiProc: function (output) {
        var objTable;
        var p = 0;
        var k = 0; //步骤号
        var temp_fault;
        var temp_procID;
        for (p = 0; p <= this.CurrentIsoProcIndex && this.CurrentIsoProcIndex < this.MaxIsoProCount; p++) {
            var arr = this.IsoProArray[p];
            if (arr != undefined) {
                temp_fault = arr.faultID;
                temp_procID = arr.goIsoProID;
                temp_selectedID = arr.goIsoProID;
                if (this.IsoProArray[p + 1] != undefined) temp_selectedID = this.IsoProArray[p + 1].goIsoProID;

                objTable = document.createElement("table");
                objTable.setAttribute("width", "100%");
                objTable.className = "afiproc_table";
                objTable.id = temp_procID;

                k = k + 1; //步骤号自增一
                this.CreateAfiProcRow(objTable, temp_fault, temp_procID, temp_selectedID, k);

                //将插入锚点往里面提，不然之前都在所有的隔离步骤之后才加上，定位不准确
                if(p == this.CurrentIsoProcIndex)
                    $("#history-dynamic-afi-proc-content").append("</br><a name=\"current-dynamic-a\"></a>");
                $("#history-dynamic-afi-proc-content").append(objTable.outerHTML);
            }
        }

        
        
        //加入步骤外的图片,表格等.
        //this.AppendOther(temp_fault);
        
        //RCM
        if(this.IsRcmUser)
            this.CreateAfiReportRow();

    },

     /*
     *	加入步骤外的图片,表格等.
     */
    AppendOther : function(faultID)
    {
        //20111009sunjian:去掉这个if判断，因为调用的地方已判断是否同一个故障隔离
//        if($("div[id="+faultID+"]").length<=0)
//        {
            var isoproc=$("div[name=isoproc]");
            if(isoproc.length>0)
            {
                isoproc.empty();
                isoproc=isoproc[0];
            }
            else{
                isoproc=document.createElement("div");
                isoproc.id=faultID;
                isoproc.name="isoproc";
                $("#history-dynamic-afi-proc-content").after(isoproc);
            }
            
            
            var content = $("div[id='" + faultID + "']", this.FaultDocument);
            var inHtml='';
            if(content && content[0])
            {
                l=content[0].children.length;
                for(var i=0;i<l;i++)
                {
                    var child=content[0].children[i];
                    if(child.className=="figure")
                    {
                        //加入图片前面的<a>，不然链接找不到
                       inHtml+=child.previousSibling.previousSibling.outerHTML;
                       inHtml+=child.previousSibling.outerHTML;
                       inHtml+= child.outerHTML;
                       inHtml+=child.nextSibling.outerHTML;
                       inHtml+=child.nextSibling.nextSibling.outerHTML
                    }
                    else if(child.className=="table_withhead_title")
                    {
                        inHtml+= child.outerHTML;
                        inHtml+=child.nextSibling.outerHTML;
                    }
                    else if(child.className=="foldout")
                    {
                        inHtml+= child.outerHTML;
                    }
                }
                
                isoproc.innerHTML=inHtml;
            }
//        }
    },
    /*
     *	生成排故报表的行
     */
    CreateAfiProcRow: function (objTable, faultID, procID, nextProcID, stepNo) {
        var ocell0;
        var otr;
        var ocell1;
        var ocell2;

        var content;
        var procs;

        var node;

        content = $("div[id='" + faultID + "'] div[id='" + procID + "']", this.FaultDocument);
        if (content.length > 0) {
            content = content[0];
        }
        else return;

        if (content) {
            var answer;
            var child;
			var childInnerHTML;
			var childOuterHTML;
            var ig;
            var tn = 1;
			var hasAddSerialNo = false;
			var firstRow = true;

            for (var i = 0; i < content.children.length; i++) {
                child = content.children[i];

                if (child.className == 'applic') 
					continue;
				childInnerHTML = child.innerHTML;
				childOuterHTML = child.outerHTML;
				
				if(childInnerHTML == "" || child.className == 'isoendcontent'
					|| (child.className == 'title' && childInnerHTML == content.id))
					continue;

                otr = objTable.insertRow();
                otr.vAlign = "top";

                ocell0 = otr.insertCell();
                ocell0.width = '20px';

                ocell1 = otr.insertCell();
                ocell1.width = '40px';
                ocell1.align = "left";
                ocell1.vAlign = "top";

                ocell2 = otr.insertCell();

                if (child.className == 'title') {
                    ocell2.className = "afiproc_table_td para0_title";
                    ocell1.className = "afiproc_table_td para0_title";

					hasAddSerialNo = true;
                    ocell1.insertAdjacentText("afterBegin", stepNo);
                    if (childInnerHTML != content.id) 
						ocell2.innerHTML = childOuterHTML;
                }
                else if (child.className == 'action') {
                    //ocell2.className = "afiproc_table_td subpara1_title";
                    //ocell1.align = "left";
                   
                    //ocell1.className = "afiproc_table_td subpara1_title";
                    //ocell2.vAlign= "middle";
                    //ocell1.vAlign = "top";
                    //ocell2.vAlign= "top";
					if(!hasAddSerialNo)
					{
						ocell1.vAlign = "top";
						ocell2.vAlign= "top";
						ocell1.className = "afiproc_table_td subpara1_title";
						ocell1.insertAdjacentText("afterBegin", stepNo);
						ocell2.innerHTML = "<div style='padding-top:8px'>"+childOuterHTML+"</div>";
						//ocell1.insertAdjacentText("afterBegin", stepNo + '.' + tn);
						hasAddSerialNo = true;
					}
					else
						ocell2.innerHTML = "<div>"+childOuterHTML+"</div>";
                    tn++;
                }
                else if (child.className == 'question') {

                    //ocell2.className = "afiproc_table_td subpara1_title";
                    //ocell1.className = "afiproc_table_td subpara1_title";

					if(!hasAddSerialNo)
					{
						ocell1.vAlign = "top";
						ocell2.vAlign= "top";
						ocell1.className = "afiproc_table_td subpara1_title";
						ocell1.insertAdjacentText("afterBegin", stepNo);
						ocell2.innerHTML = "<div style='padding-top:8px'>"+childOuterHTML+"</div>";
						//ocell1.insertAdjacentText("afterBegin", stepNo + '.' + tn);
						hasAddSerialNo = true;
					}
					else
						ocell2.innerHTML = childOuterHTML;
                    tn++;
                }
                else {
                    ocell2.innerHTML = childOuterHTML;
                }

                if (stepNo == this.CurrentIsoProcIndex + 1) {
                    if (child.className == 'question') Isanswer = true;

                    if (child.className == 'answer') ocell2.id = "current-dynamic-afi-proc-content";

                    
                    //出版时如果无title就生成一个用id做内容的className=title，由于在上面已过滤，如果没有title时则没生成第一行的样式，改为用firstrow
                    //child.className == 'title'
                    if (firstRow) {
                        ocell0.align = "center";
                        ocell0.vAlign = "top";
                        ocell0.innerHTML = "<img src=\"../manual-resources/images/Next1.gif\">";
                        ocell1.style.cssText = "background-color:#f0f0f0;border:1px #a9a9a9 solid;border-right:none;border-bottom:none";
                        ocell2.style.cssText = "background-color:#f0f0f0;border:1px #a9a9a9 solid;border-left:none;border-bottom:none";
                        firstRow = false;
                    }
                    else {
                        ocell1.style.cssText = "background-color:#f0f0f0;border:1px #a9a9a9 solid;border-right:none;border-bottom:none;border-top:none";
                        ocell2.style.cssText = "background-color:#f0f0f0;border:1px #a9a9a9 solid;border-left:none;border-bottom:none;border-top:none";
                    }

                }
                else {
                    var temp_input = ocell2.getElementsByTagName("a");
                    for (var m = 0; m < temp_input.length && temp_input[m].className == "radio"; m++) {
                        if (temp_input[m].id == nextProcID) {
                            answer = "— " + temp_input[m].parentElement.innerText;
                            break;
                        }
                    }

                    var temp_div = ocell2.getElementsByTagName("div");
                    var temp_ul;
                    for (var j = 0; j < temp_div.length; j++) {
                        if (temp_div[j].className == 'answer') {
                            temp_ul = temp_div[j];
                            var _p = temp_ul.parentElement;
                            _p.removeChild(temp_ul);
                            _p.insertAdjacentText("beforeEnd", answer);

                            break;
                        }
                    }

                    //加入报告
                }
            }

            if (content.name == 'isoend') {

				var isoendContent = "";
				var tempdiv = content.getElementsByTagName("div");
				for (var j = 0; j < tempdiv.length; j++) {
					if (tempdiv[j].className == 'isoendcontent') {
						isoendContent = tempdiv[j].innerHTML;
						break;
					}
				}

                otr = objTable.insertRow();
                otr.id = procID;
                otr.vAlign = "top";
                ocell0 = otr.insertCell();
                ocell0.width = '20px';
                ocell1 = otr.insertCell();
                ocell1.width = '40px';
                ocell1.align = "left";
                ocell1.vAlign = "top";
                ocell2 = otr.insertCell();
                ocell2.innerHTML = isoendContent;//"<b>转到收尾工作。</b>";//"<span font-weight:bold; background-color:Transparent; color:Black\">转到收尾工作。</span>";
                ocell1.style.cssText = "background-color:#f0f0f0;border:1px #a9a9a9 solid;border-right:none;border-bottom:none;border-top:none";
                ocell2.style.cssText = "background-color:#f0f0f0;border:1px #a9a9a9 solid;border-left:none;border-bottom:none;border-top:none";

                closeText = $("div[id='" + faultID + "'] div[class='closetxt']", this.FaultDocument);
                $("#history-dynamic-afi-proc-closetxt").empty();
                $("#history-dynamic-afi-proc-closetxt").html(closeText[0].innerHTML);

                 //生成报告
                  if(this.IsRcmUser)
                         IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Afi_Report,false); 
            }
            else {
                $("#history-dynamic-afi-proc-closetxt").empty();
                 if(this.IsRcmUser)
                         IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Afi_Report,true); 

            }

            if (stepNo == this.CurrentIsoProcIndex + 1 && ocell1 != undefined) {
                ocell1.style.cssText = "background-color:#f0f0f0;border:1px #a9a9a9 solid;border-right:none;border-top:none";
                ocell2.style.cssText = "background-color:#f0f0f0;border:1px #a9a9a9 solid;border-left:none;border-top:none";
            }

        }

    },

    /*
     *	生成RCM排故结果数据
     */
    CreateAfiReportRow: function () {
        //加入报告
        var Report = $("#history-dynamic-afi-proc-content").html() + '/r/n' + $("#history-dynamic-afi-proc-closetxt").html();
        $("#RCM-Report", top.document).empty();
        $("#RCM-Report", top.document).append(Report);
    },

    /*
     *	生成排故报告
     */
    CreateAfiReport: function () {
        var otable = CreateAfiProc(true);
        otable.style.display = "block";

        //添加故障信息
        var afitr = otable.insertRow(0);
        var afitd = afitr.insertCell();
        afitd.setAttribute("colspan", "2");
        afitd.className = "afiproc_table_td";

        if (this.FaultID != "") {
            var fdes = $("div[id='" + this.FaultID + "']");
            for (var n = 0; n < fdes.length; n++) {
                afitd.insertAdjacentHTML("beforeEnd", fdes[n].outerHTML);
            }
        }
        else {
            afitd.insertAdjacentHTML("beforeEnd", "&nbsp;");
        }

        //清除链接的地址
        var oa = otable.getElementsByTagName("a");
        for (var kk = 0; kk < oa.length; kk++) {
            if (oa[kk].href == "" || oa[kk].href == undefined) continue;

            oa[kk].href = "#不存在的猫点"; //为了让报告中不响应链接的跳转，所以设置一个不存在的内部锚点
        }

        //清除修订内容
        var ospan = otable.getElementsByTagName("span");
        for (var cc = 0; cc < ospan.length; cc++) {
            if (ospan[cc].id == "revised-quiet" || ospan[cc].id == "revised-rfc" || ospan[cc].id == "revised-delete") {
                ospan[cc].innerHTML = "";
            }

        }

        //使用window.open有时页面为空，随机出现
        window.showModalDialog("../afiReport.htm", otable, "dialogWidth=600px;dialogHeight=500px;status=no;scrollbars=yes;");
    },

    /*
     *	处理故障列表中的故障Href
     */
    ProcessAfiXref: function (afiXrefNode) {
        if (afiXrefNode.href != "" && afiXrefNode.href.indexOf('javascript') == -1) {
            afiXrefNode.href = "javascript:afiHightLineLayer('" + afiXrefNode.attributes["name"].value + "','" + afiXrefNode.attributes["afitarget"].value + "')";
        }
    },

   /*
    *	挂接故障过程导航链接事件
    */
    InitInput: function (forward) {

        var input = $("a[class='radio']", "#current-dynamic-afi-proc-content");

        input.each(function () {
            this.href = "javascript:answer('" + this.id + "')";
        });
    },

   /*
    *  获取有效的导航过程数组（如果没有导航过程,直接返回故障ID）
    */
    GetValidProcArray: function () {

        var retArray = new Array();
        for (var i = 0; i <= this.CurrentIsoProcIndex; i++)
        retArray[i] = this.IsoProArray[i];

        if (retArray.length > 0) return retArray;
        else return this.FaultID;
    }

}