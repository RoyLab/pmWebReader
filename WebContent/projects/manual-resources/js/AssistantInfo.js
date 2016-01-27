/// <reference path="../../test/js/jQuery.intellisense.js" />
/// <reference path="jquery.js" />

/************************************************************************/
//	功能：各类窗口管理（元数据、DM被引、PM被引、前置条件、安全条件）
//	作者：sunlunjun
//	日期：2010-1-18                                                            
/************************************************************************/

/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();

IETM.AssistantInfo = {

    /*
     *	元数据窗口的大小
     */
    MetadataPaneSize: null,

    /*
     *	DM被引窗口的大小
     */
    DMRefedListSize: null,

    /*
     *	PM被引窗口的大小
     */
    PMRefedListSize: null,

    /*
     *	前置条件窗口的大小
     */
    PrelreqsSize: null,

    /*
     *	安全条件窗口的大小
     */
    SafetySize: null,

    /*
     *	安全条件是否为空
     */
    Nullsafety: null,
    
    /*
     *	前置条件是否为空
     */
    NullPrelreqs: null,

    /*
     *	步骤中当前显示的图的索引
     */
    StepImgIndex: -1,

    /*
     *	记录警告注意内容
     */
    AllContentWaringsAndCautions: null,

    /*
     *	是否是弹出窗口
     */    
    ModalFormShow: false,

    /*
     *	指示当前安全条件是否是页面加载时自动弹出的ID
     */
    AutoShowSafety: false,

    /*
     *目的： 初始化。
     */
    Init: function () {
        //获取相关窗口大小数据
        this.MetadataPaneSize = IETM.AssistantInfo.GetSizeFormCss(".MetadataPaneSize");
        this.DMRefedListSize = IETM.AssistantInfo.GetSizeFormCss(".DMRefedListSize");
        this.PMRefedListSize = IETM.AssistantInfo.GetSizeFormCss(".PMRefedListSize");
        this.PrelreqsSize = IETM.AssistantInfo.GetSizeFormCss(".PrelreqsSize");
        this.SafetySize = IETM.AssistantInfo.GetSizeFormCss(".SafetySize");

        if ($(".nullsafety").length == 1)//==1为空 
        {
            this.Nullsafety = true;
        }
        else {
            this.Nullsafety = false;
        }

        if (IETM.Common.DMinfo.DmType == "proced" || IETM.Common.DMinfo.DmType == "proced_card") {

            this.AllContentWaringsAndCautions = $(".contentWaringOrCaution");
        }
        
        if(IETM.Common.HistoryEntry != undefined && IETM.Common.HistoryEntry != null && IETM.Common.HistoryEntry.DialogType==top.ViewHistory.DLGTYPE.NONE)
           this.ShowSafety(true);
    }
}

/*
 *目的： 显示元数据
 */
IETM.AssistantInfo.ShowMetaData = function () {
    var metadata = $("#metadataPane");

    if (metadata.length > 0) {
        var url = "#TB_inline?" + "width=" + IETM.AssistantInfo.MetadataPaneSize[0] + "&height=" + IETM.AssistantInfo.MetadataPaneSize[1];
        var button = "<input type=\"button\" class=\"buttoncls\" id=\"ConformMeatdata\" value=\"确定\"  />";
        IETM.AssistantInfo.ShowModalWindow("数据模块状态", url, button);
        tb_ChangeContent(metadata.html());
        $("#ConformMeatdata").bind("click", "", function () {
            IETM.AssistantInfo.CloseModalWindow();
        });
        
        IETM.Common.HistoryEntry.DialogType=top.ViewHistory.DLGTYPE.MetaData;
    }
}

/*
 *目的： 激活查找框
 */
IETM.AssistantInfo.FindContent = function() {
    try {
        var wshshell = new ActiveXObject("WScript.Shell");
        document.body.focus();
        wshshell.SendKeys("^f");
        wshshell.Quit;
    }
    catch(e) {}
}

/*
 *目的： PM被引
 */
IETM.AssistantInfo.ShowPMRefedList = function () {
    if ($("#PMRefedList").length == 0) {
        return;
    }
    var url = "#TB_inline?" + "width=" + IETM.AssistantInfo.PMRefedListSize[0] + "&height=" + IETM.AssistantInfo.PMRefedListSize[1];
    var button = "<input type=\"button\" class=\"buttoncls\" id=\"ConformPMRefedList\" value=\"确定\"  />";
    IETM.AssistantInfo.ShowModalWindow("PM被引", url, button);
    tb_ChangeContent($("#PMRefedList").get(0).innerHTML);
    $("#ConformPMRefedList").bind("click", "", function () {
        IETM.AssistantInfo.CloseModalWindow();
    });
   IETM.Common.HistoryEntry.DialogType=top.ViewHistory.DLGTYPE.PMRefed;
}

/*
 *目的： DM被引
 */
IETM.AssistantInfo.ShowDMRefedList = function () {
    var url = "#TB_inline?" + "width=" + IETM.AssistantInfo.DMRefedListSize[0] + "&height=" + IETM.AssistantInfo.DMRefedListSize[1];
    var button = "<input type=\"button\" class=\"buttoncls\" id=\"ConformDMRefedList\" value=\"确定\"  />";
    IETM.AssistantInfo.ShowModalWindow("DM被引", url, button);
    if ($("#DMRefedList").get(0) != undefined) {
        tb_ChangeContent($("#DMRefedList").get(0).innerHTML);
    }
    $("#ConformDMRefedList").bind("click", "", function () {
        IETM.AssistantInfo.CloseModalWindow();
    });
    IETM.Common.HistoryEntry.DialogType=top.ViewHistory.DLGTYPE.DMRefed;
}

/*
 *目的： 显示安全信息。
 */
IETM.AssistantInfo.ShowSafety = function (isPress) {

    if (IETM.Common.DMinfo.DmType != "proced" && IETM.Common.DMinfo.DmType != "proced_card") {
        return false;
    } 

     if (IETM.Common.MainFrame == undefined || IETM.Common.MainFrame == null)
       return;
       
    if (!IETM.AssistantInfo.Nullsafety || IETM.AssistantInfo.AllContentWaringsAndCautions != undefined && IETM.AssistantInfo.AllContentWaringsAndCautions.length > 0) {
        IETM.Common.MainFrame.SetTopToolbarButtonDisabled('m_btnSafeConfition',false);
        var url = "#TB_inline?frameId=" + IETM.Common.DataFrameID + "&width=" + IETM.AssistantInfo.SafetySize[0] + "&height=" 
            + IETM.AssistantInfo.SafetySize[1] + "&inlineId=proced_safety";
        var button = "<input type=\"button\" class=\"buttoncls\" id=\"ConformSafety\" value=\"确定\"  />";

        try {
            var safeyies = $('#proced_safety', window.frames[IETM.Common.DataFrameID].document);
            var html = '<table width=\"100%\"><tr><td>';
            if (safeyies.length > 0) {
                html += safeyies[0].outerHTML;
                if (IETM.AssistantInfo.AllContentWaringsAndCautions != undefined) {
                    if (IETM.AssistantInfo.AllContentWaringsAndCautions.length > 0) {
                        html += "<br/>";
                        html += "<div class=\"lists_title2\">其它安全信息</div>";
                    }

                    for (var i = 0; i < IETM.AssistantInfo.AllContentWaringsAndCautions.length; i++) {
                        html += "<br/>";
                        html += IETM.AssistantInfo.AllContentWaringsAndCautions[i].outerHTML;
                    }
                }
            }
            html += '</td></tr><table>';

            IETM.AssistantInfo.ShowModalWindow("安全信息", url, button, html);

            $("#ConformSafety").bind("click", "", function () {
                IETM.AssistantInfo.CloseModalWindow();

            });
            
            if(isPress)
                this.AutoShowSafety = true;
            IETM.Common.HistoryEntry.DialogType=top.ViewHistory.DLGTYPE.Safety;

        }
        catch(e) {
            return false;
        }
        return false;
    } else{
        IETM.Common.MainFrame.SetTopToolbarButtonDisabled('m_btnSafeConfition',true);
    }
}

/*
 *目的： 显示前置条件。
 */
IETM.AssistantInfo.ShowPrelreqs = function () {
    var url = "#TB_inline?frameId=" + IETM.Common.DataFrameID + "&width=" + IETM.AssistantInfo.PrelreqsSize[0] 
        + "&height=" + IETM.AssistantInfo.PrelreqsSize[1] + "&inlineId=proced_prelreqs";
    var button = "<input type=\"button\" class=\"buttoncls\" id=\"ConformPrelreqs\" value=\"确定\"  />";
    IETM.AssistantInfo.ShowModalWindow("前置条件", url, button);
    $("#ConformPrelreqs").bind("click", "", function () {
        IETM.AssistantInfo.CloseModalWindow();
    });
    IETM.Common.HistoryEntry.DialogType=top.ViewHistory.DLGTYPE.Prelreqs;
}

/*
 *目的：从样式中读取窗口大小的函数代码
 */
IETM.AssistantInfo.GetSizeFormCss = function (clsName) {
    var ret = new Array(800, 500);

    for (i = 0; i < document.styleSheets.length; i++) {
        var stylesheet = document.styleSheets[i];
        for (j = 0; j < stylesheet.rules.length; j++) {
            if (stylesheet.rules.item(j).selectorText == clsName) {
                var rule = stylesheet.rules.item(j);
                if (rule != undefined) {
                    if (rule.style.width != "") {
                        ret[0] = rule.style.width.replace("px", "");
                    }

                    if (rule.style.height != "") {
                        ret[1] = rule.style.height.replace("px", "");
                    }
                }
                return ret;
            }
        }
    }

    return ret;
}

/**
* 目的：显示窗口
* @type String
*/
IETM.AssistantInfo.ShowModalWindow = function(title, url, button, contenthmtl) {
    IETM.AssistantInfo.CloseModalWindow();
    tb_show(title, url, button, contenthmtl);
    $("#tb_CloseImage").bind("click", "", function () {
        IETM.AssistantInfo.CloseModalWindow();
    });

    AddHotKey();
    
    IETM.AssistantInfo.ModalFormShow = true;
}

/**
* 目的：关闭窗口
* @type String
*/
IETM.AssistantInfo.CloseModalWindow = function() {
    if(IETM.AssistantInfo.ModalFormShow)
    {
        tb_remove();  
         if(IETM.AssistantInfo.AutoShowSafety)
        {
            IETM.Graphic.Init();
            IETM.AssistantInfo.AutoShowSafety=false;
        } 
        if (top.ViewHistory!=undefined && top.ViewHistory!=null && top.ViewHistory.DLGTYPE!=undefined && top.ViewHistory.DLGTYPE!=null) {
            IETM.Common.HistoryEntry.DialogType=top.ViewHistory.DLGTYPE.NONE;
        }         
        IETM.AssistantInfo.ModalFormShow =false;
    }
    if (IETM.Proced.StepmodalFormShow) {
        IETM.Common.MainFrame.SetPageNavigationButtonToggle(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Begin,false);
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Back,true);
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Next,true);
        IETM.Proced.StepmodalFormShow = false;
        IETM.Proced.CurrentStep = -1;
    }
    document.onkeydown = null;
}

