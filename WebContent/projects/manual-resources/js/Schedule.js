/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();

IETM.Schedule={
     /*
     *	Http对象
     */
    XmlHttpObject : null,
    
    TaskCheckbox : null,
    
    SelectCheckboxNum : 0,
    
    AllSelectRadio : null,
    
    NoAllSelectRadio : null,
    /*
    *	初始化
    */   
    Init : function () {
        this.TaskCheckbox = $(":checkbox");
        this.AllSelectRadio = $("#schedule_all");
        this.NoAllSelectRadio = $("#schedule_noall");
        this.deftaskIsNull();
    },
    /**
    * 维护计划中其它列内容为空，不弹出
    * @type String
    */
    deftaskIsNull : function () {
        var obj = $(".deftask_other_cls");
        var objid,objrefid,objname;
        try {
            for (i = 0; i < obj.length; i++) {
                objid = obj[i];
                objname = objid.getAttribute("name");
                if (objname != "" && objname != null) {
                    objrefid = document.getElementById(objname);
                    if (objrefid.innerText == "") objid.innerHTML = "";
                }
            }    
        }
        catch(e)
        {
        }
    }
}

/**
* 维护计划查询（模板中用）
* @type String
*/
function taskCheckbox(obj) {
    var resulthtml,taskContent;
    var taskDiv = $("div[id='" + obj.value + "']");
    try {
        if (obj.checked) {
            IETM.Schedule.SelectCheckboxNum++;
            if (IETM.Schedule.SelectCheckboxNum == IETM.Schedule.TaskCheckbox.length) {
                IETM.Schedule.AllSelectRadio[0].checked = true;
                IETM.Schedule.NoAllSelectRadio[0].checked = false;
            }
            else
            {
                IETM.Schedule.AllSelectRadio[0].checked = false;
                IETM.Schedule.NoAllSelectRadio[0].checked = false;
            }
            try {
                obj.parentNode.childNodes[1].style.display = "inline";
                obj.parentNode.childNodes[2].style.display = "none";
            }
            catch(e)
            {
            }
            if (taskDiv.css("display") == "none") {
                taskDiv.css("display", "inline");
            }else {
                if (taskDiv.length > 0) {
                    var href = document.location.href.replace("schedule_taskgroups",obj.value);
                    if (IETM.Common.CommonService != undefined && IETM.Common.CommonService != null){
                        resulthtml = IETM.Common.CommonService.GetHttpRequestByUrl(href).responseText;
                    }
                    if (resulthtml == null) {
                        return ;
                    }
                    taskContent = $("#tasklist_table",resulthtml);
                    if (taskContent.length > 0) {
                        taskDiv[0].innerHTML = taskContent[0].innerHTML;
                        IETM.Reference.Init();   
                        IETM.Schedule.deftaskIsNull();
                    }else{
                        alert("没找到对应的内容！");
                    }
                }
            }
        }else{
            IETM.Schedule.SelectCheckboxNum--;
            if (IETM.Schedule.SelectCheckboxNum == 0) {
                IETM.Schedule.AllSelectRadio[0].checked = false;
                IETM.Schedule.NoAllSelectRadio[0].checked = true;
            }
            else
            {
                IETM.Schedule.AllSelectRadio[0].checked = false;
                IETM.Schedule.NoAllSelectRadio[0].checked = false;
            }
            try {
                obj.parentNode.childNodes[1].style.display = "none";
                obj.parentNode.childNodes[2].style.display = "inline"; 
            }
            catch(e)
            {
            }      
            taskDiv.css("display", "none");
        }    
    }
    catch(e)
    {
    }
}

/**
* 维护计划查询（模板中用）
* @type String
*/
function taskAllSelect(checkbox) {
    var allCheckbox = IETM.Schedule.TaskCheckbox;
    if (confirm("全选需等待待很久，是否继续？")) {
        for(ii = 0; ii < allCheckbox.length; ii++)
        {
            if (allCheckbox[ii].checked) {
                continue;
            }
            allCheckbox[ii].checked = true;  
            taskCheckbox(allCheckbox[ii]);              
        }
    }else{
       checkbox.checked = false; 
    }
}

/**
* 维护计划查询（模板中用）
* @type String
*/
function taskNoAllSelect(checkbox) {
    var allCheckbox = IETM.Schedule.TaskCheckbox;
    for(jj = 0; jj < allCheckbox.length; jj++)
    {
        if (!allCheckbox[jj].checked) {
            continue;
        }
        allCheckbox[jj].checked = false;  
        taskCheckbox(allCheckbox[jj]);              
    }
}

/**
* 维护计划查询控制是否显示（模板中用）
* @type String
*/
function deftaskIsExpandAll(img, div) {
    var obj = $(".schedule_query_content");
    var objImg = $(".schedule_collapseExpand");
    var objid;

    if (div.id == '1') {
        img.src = img.path + '/collapse.gif';
        div.id = '0';
        div.lastChild.data = '折叠所有';
        for (i = 0; i < objImg.length; i++) {
            objid = objImg[i];
            objid.src = img.path + '/collapse.gif';
        }
        for (i = 0; i < obj.length; i++) {
            objid = obj[i];
            objid.style.display = 'block';
        }
    }
    else {
        img.src = img.path + '/expand.gif';
        div.id = '1';
        div.lastChild.data = '展开所有';
        for (i = 0; i < objImg.length; i++) {
            objid = objImg[i];
            objid.src = img.path + '/expand.gif';
        }
        for (i = 0; i < obj.length; i++) {
            objid = obj[i];
            objid.style.display = 'none';
        }
    }
}

/**
* 维护计划的前置条件中用控制是否显示（模板中用）
* @type String
*/
function toggleLayer(id) {
    var objId = $("#" + id);
    objId.toggle();
}


/**
* 维护计划中弹出窗口（模板中用）
* @type String
*/
function ShowMessage(title, id) {
    var caption = title;
    var contentText,ele;
    var url = "#TB_inline?width=" + 600 + "&height=" + 400;
    var buttonHtml = "<input type=\"button\" class=\"buttoncls\" id=\"Conform\" value=\"确定\"  />";
    
    ele = document.getElementById(id);
    if (ele != undefined && ele != null) {
        contentText = ele.outerHTML;
    }
    
    tb_show(caption, url, buttonHtml);
    $("#Conform").bind("click", "", function () {
        tb_remove();
    });
    $("#tb_CloseImage").bind("click", "", function () {
        tb_remove();
    });
    
    $("#TB_ajaxContent").append(contentText);
    IETM.AssistantInfo.ModalFormShow = true;
}
