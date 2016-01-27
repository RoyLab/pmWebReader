
/************************************************************************/
//	功能：过程类
//	作者：sunlunjun
//	日期：2010-1-18                                                            
/************************************************************************/

/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();

IETM.Proced = {
    
    /*
     *	当前步骤
     */    
    CurrentStep: -1,

    /*
     *	是否是步骤窗口
     */    
    StepmodalFormShow: false,

    /*
     *	步骤内容
     */    
    Steps:null,

    /*
     *	步进窗口的大小
     */    
    StepWindowSize: null,

    /*
     *	步骤中当前显示的图的索引
     */
    StepImgIndex: -1,

    /*
     *目的： 初始化。
     */
    Init: function () {
        //获取步骤内容，模板中做的标记
        if(IETM.Common.MainFrame == undefined && IETM.Common.MainFrame == null)
            return;
            
        var dproced = $("body", window.frames[IETM.Common.DataFrameID].document);
        IETM.ApplicRecised.FilterApplic(dproced);
        this.Steps = $("#proced_step1 .step_text", dproced);
        
        if (($(".ReqcondsContent").length > 0 && $(".ReqcondsContent")[0].innerText == "" || $(".nullpmd").length > 0 ) && $(".nullreqpers").length > 0 && $(".nullreqconds").length > 0 && $(".nullsupequip").length > 0 && $(".nullsupplies").length > 0 && $(".nullspares").length > 0) {
            IETM.Common.MainFrame.SetTopToolbarButtonDisabled('m_btnPreCondition',true);            
        }else{
            IETM.Common.MainFrame.SetTopToolbarButtonDisabled('m_btnPreCondition',false);                    
        }
        
        if(IETM.AssistantInfo!=undefined && IETM.AssistantInfo != null)
          this.StepWindowSize = IETM.AssistantInfo.GetSizeFormCss(".StepWindowSize");
          
        if (IETM.Common.DMinfo.DmType == "proced_card") {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Begin,true);
        } else{
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Begin,false);
        }


        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Next,true);
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Back,true);

        window.focus();
    }
}

/**
* 步进交互窗口
* @type String
*/
IETM.Proced.ToggleStepForm = function() {
    if (typeof IETM.Proced.Steps === "undefined") return;

    if (IETM.Proced.StepmodalFormShow) {
        IETM.AssistantInfo.CloseModalWindow();
        IETM.Proced.StepmodalFormShow = false;
        IETM.Proced.CurrentStep = -1;
   
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Next,true);
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Back,true);

    }
    else {
        var button = "<input type=\"button\" class=\"buttoncls\" id=\"btnPreviousStep\" disabled=\"true\" value=\"上一步\" onclick=\"IETM.Proced.PreviousStep()\" />&nbsp;&nbsp;<input type=\"button\" class=\"buttoncls\" disabled=\"true\" id=\"btnNextStep\" value=\"下一步\" onclick=\"IETM.Proced.NextStep()\" />";
        IETM.AssistantInfo.ShowModalWindow($(".dmodule_title")[0].innerText, "#TB_inline?" + "width=" + IETM.Proced.StepWindowSize[0] + "&height=" + IETM.Proced.StepWindowSize[1], button);
        IETM.Proced.StepmodalFormShow = true;
        if (IETM.Proced.Steps.length > 1) {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Next,false);
            $("#btnNextStep").attr("disabled", false);
        }
        else {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Next,true);
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Back,true);
        }

        if (IETM.Proced.Steps.length > 0) {
            IETM.Proced.NextStep();
        }
        if (top.ViewHistory!=undefined && top.ViewHistory!=null && top.ViewHistory.DLGTYPE!=undefined && top.ViewHistory.DLGTYPE!=null) {
            IETM.Common.HistoryEntry.DialogType=top.ViewHistory.DLGTYPE.Proced;
        }
    }
}

/**
* 步进交互窗口下一步
* @type String
*/
IETM.Proced.NextStep = function() {
    if (typeof IETM.Proced.Steps === "undefined") return;

    var stepImages = $("#contentPanel .figure_min");
    RemoveShowFlowImage(stepImages);
    IETM.Proced.CurrentStep = IETM.Proced.CurrentStep + 1;
    if (IETM.Proced.StepmodalFormShow) {

        ShowStepContent();
    }

    if (IETM.Proced.CurrentStep == IETM.Proced.Steps.length - 1 || IETM.Proced.Steps.length == 1) {
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Next,true);
        $("#btnNextStep").attr("disabled", true);
    }
    else {
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Next,false);
        $("#btnNextStep").attr("disabled", false);
    }

    if (IETM.Proced.CurrentStep > 0 && IETM.Proced.Steps.length > 1) {
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Back,false);
        $("#btnPreviousStep").attr("disabled", false);
    }
}

/**
* 步进交互窗口上一步
* @type String
*/
IETM.Proced.PreviousStep = function() {
    if (typeof IETM.Proced.Steps === "undefined") return;

    var stepImages = $("#contentPanel .figure_min");
    RemoveShowFlowImage(stepImages);
    IETM.Proced.CurrentStep = IETM.Proced.CurrentStep - 1;
    if (IETM.Proced.StepmodalFormShow) {
        ShowStepContent();
      
    }

    if (IETM.Proced.CurrentStep == 0) {
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Back,true);
        $("#btnPreviousStep").attr("disabled", true);
    }
    else {
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Back,false);
        $("#btnPreviousStep").attr("disabled", false);
    }

    if (IETM.Proced.CurrentStep < IETM.Proced.Steps.length - 1) {
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Proced_Next,false);
        $("#btnNextStep").attr("disabled", false);
    }

}

/**
* 热键功能
* @type String
*/
AddHotKey = function() {
    document.onkeydown = function (e) {
        if (event.keyCode == 27)//关闭
        {
            IETM.AssistantInfo.CloseModalWindow();
        }
        else if (event.keyCode == 13) {
            if (IETM.AssistantInfo.ModalFormShow && !IETM.Proced.StepmodalFormShow) {
                //安全条件和前置条件一起显示要调用按钮事件，否则调用CloseModalWindow
                var $button = $("#ConformPrelreqs");
                if ($button.length == 0) {
                    $button = $("#ConformSafety");
                }

                if ($button.length == 0) {
                    IETM.AssistantInfo.CloseModalWindow();
                }
                else {
                    $button.click();
                }
            }
        }
        else if (event.keyCode == 33 || event.keyCode == 37 || event.keyCode == 38)//PgUp、向上和向左
        {
            if (IETM.Proced.StepmodalFormShow)//步进
            {
                if ($("#btnPreviousStep").attr("disabled") == false) 
                    IETM.Proced.PreviousStep();
            }
            else { if ($("#btnPrevious").attr("disabled") == false) Previous();
            }
        }
        else if (event.keyCode == 34 || event.keyCode == 39 || event.keyCode == 40)//PgDn、向下和向右
        {
            if (IETM.Proced.StepmodalFormShow)//步进
            {
                if ($("#btnNextStep").attr("disabled") == false) 
                    IETM.Proced.NextStep();
            }
            else { if ($("#btnNext").attr("disabled") == false) Next();
            }
        }

    }

}

/**
*显示步进内容
* @type String
*/
function ShowStepContent() {
    if (typeof IETM.Proced.Steps != "undefined") {
        var stepcontent = IETM.Proced.Steps.get(IETM.Proced.CurrentStep);
        if (stepcontent != undefined) {
            tb_ChangeContent(stepcontent.innerHTML);
        }
    }
}


/**
*取当前步骤的图像
* @type String
*/
function RemoveShowFlowImage(images) {
    if (images == null) return;

    images.each(function (index) {
        if (images.eq(index)[0].name == "") {
            images.eq(index).unbind("mouseover", MouseOver);
            images.eq(index).unbind("mouseout", MouseOut);
        }
    });
};

/**
*取当前步骤的图像
* @type String
*/
function GetCurrentStepImage() {
    var stepImages;
    if (IETM.Proced.CurrentStep == -1 || StepImgIndex == -1) return null;
    else {
        stepImages = $("#contentPanel .figure_min");
        return stepImages[StepImgIndex];
    }
}

var MouseOver = function () {
    var offset = $(this).offset();
    var topPosition = offset.top;
    var leftPosition = offset.left;

    var destSrc = GetImgDestSrc($(this).attr("id"));
    $("body").append("<div id=\"imgDiv\"><img id=\"figure_toggleLayer\" src=\"" + destSrc + "\" /></div>");
    var obj = $("#imgDiv");
    var img = $("#figure_toggleLayer");
    var bottom = $("body")[0].clientHeight - topPosition;
    if (bottom < img[0].height && topPosition < img[0].height) {
        if (bottom > topPosition) {
            img.css("height", bottom - 20);
            obj.css("top", topPosition);
        }
        else {
            img.css("height", topPosition - 20);
            obj.css("top", topPosition - img[0].height);
        }
    }
    else if (bottom < img[0].height) {
        obj.css("top", topPosition - img[0].height);
    }
    else {
        obj.css("top", topPosition);
    }

    obj.css("position", "absolute");
    obj.css("z-index", 999);
    obj.css("left", leftPosition + $(this).width() + 5);
    var right = $("body")[0].clientWidth - (leftPosition - $("body")[0].scrollLeft) - $(this)[0].width;
    if (right < img[0].width) {
        img.css("width", right - 20);
    }

    obj.fadeIn("fast");
};

var MouseOut = function () {
    $("#imgDiv").remove();
};

