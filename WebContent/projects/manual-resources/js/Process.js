/************************************************************************/
//	功能：流程类
//	作者：sunlunjun
//	日期：2010-1-18                                                            
/************************************************************************/

/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();

IETM.Process = {

     /*
     *	页面
     */
    PageProcess: 'process.htm',

     /*
     *	上一不是否可用，默认不可用
     */
    ProcessProcessUp: true,

     /*
     *	步骤
     */
    ProcessStepModel: null,

     /*
     *	步骤内容
     */
    ContentPanel: null,
    
     /*
     *	步骤内容
     */
    ProcessXML:null,


     /*
     *	提交的变量
     */
    DialogContent: null, 
    

     /*
     *	WebService
     */
    ServiceConnectionString: '../Service/ManualService.asmx/',

    /*
     *目的： 初始化。
     */
    Init: function () {
            this.ToggleProcessForm('', true);
    },
    
    /*
     *目的： 链接。
     */
    InitLink: function () {

            $(document).find("a[class=insideXref]").each(function () {
                if (this.href != "" && this.href.indexOf('javascript') == -1) {

                    this.href = "javascript:top.ApplicationContext.IIETM().Process.GotoInsideXref('" + this.href + "','')";
                }
            });

            $(document).find("a[class=outsideXref]").each(function () {
                if (this.href != "" && this.href.indexOf('javascript') == -1) {
                    this.href = "javascript:top.ApplicationContext.IIETM().Process.GotoOutsideXref('" + this.href + "','" + this.attributes["dmtarget"].value + "')";
                }
            });
    },
    
     /*
     *目的： 开始导航窗体。
     */
    ToggleProcessForm:function (item, pressed) {
        var result;
        var framesrc = window.location.href;
        var index = framesrc.lastIndexOf('/');
        var sourcePath = "Manual\\SourceFiles\\" + framesrc.substring(index + 1);
        sourcePath = sourcePath.replace(".HTM", ".xml");
        sourcePath = sourcePath.replace(".htm", ".xml");

        result = IETM.Process.ReturnResult("Start", {
            dmxml: sourcePath
        });
        ProcessLoad(result.responseXML);
    },
    
     /*
     *目的： 内部连接处理。
     */    
    GotoOutsideXref:function(href, dmtarget) {
        var index;
        var path;

        var endstr = href.indexOf('#', 0);
        var xrefId;

        if (endstr != -1) {
            xrefId = href.substring(endstr + 1, href.length);
        }
        // && IETM.Common.MainFrame.GetNavigator() == "IE7"
        else { if (IETM.Common.MainFrame != undefined && IETM.Common.MainFrame != null) {
                href = decodeURIComponent(href);
            }

            endstr = href.indexOf('#', 0);

            if (endstr != -1) {
                xrefId = href.substring(endstr + 1, href.length);
            }
        }

        if (dmtarget != undefined) {
            path = 'Manual/' + dmtarget + '.htm';
        }
        else {
            index = href.lastIndexOf('/');
            path =href.substring(index + 1);
            index= path.lastIndexOf('.');
            dmtarget=path.substring(0,index);
            path = 'Manual/' + path;
        }
        IETM.Common.MainFrame.LoadNewHTMLTab(dmtarget, href, xrefId);
    },

     /*
     *目的： 外部连接处理。
     */     
    GotoInsideXref:function(href, teget) {
        if (href == null || href == undefined || href == '') {
            return;
        }
        var id;
        var endstr;
        var result;
        endstr = href.indexOf('#', 0);
        if (endstr != -1) {
            id = href.substring(endstr + 1, href.length);
        }
        result = IETM.Process.ReturnResult("GotoInsideXref", {
            id: id
        });
        ProcessLoad(result.responseXML);
    }   
}

/**
* 导航上一步
* @type String
*/
IETM.Process.ProcessUpStep = function () {
    var result;
    result = IETM.Process.ReturnResult("Back", null);
    ProcessLoad(result.responseXML);
   
}

/**
* 导航下一步
* @type String
*/
IETM.Process.ProcessBackStep = function () {
    var result;
    result = IETM.Process.ReturnResult("Next", null);
    ProcessLoad(result.responseXML);
   
}

/**
* 导航返回
* @type String
*/
IETM.Process.ProcessReturnStep = function () {
    var result;
    result = IETM.Process.ReturnResult("Return", null);
    ProcessLoad(result.responseXML);
}

/**
* 导航服务返回结果
* @type String
*/
IETM.Process.ReturnResult = function(servicefun, param) {

    try {
        $.ajaxSetup({
            async: false
        });
        result = $.post(IETM.Process.ServiceConnectionString + servicefun, param, null);
    }
    catch(e) {
       alert('请求失败！');
    }
    finally {
        $.ajaxSetup({
            async: true
        });
    }

    return result;
}

/**
* 加载程序类步
* @type String
*/
function ProcessLoad(resultXML) {
    var contentText;
    var titlePanel;
    var buttonPanel;
    var numbercls;
    var ErrorMessage = GetFromXML(resultXML, "//ErrorMessage");
    if (ErrorMessage != undefined) {
        alert(ErrorMessage);
        return;
    }
    else {
        //GetVaraiblesFromXML(resultXML);
    }
    this.DialogContent = GetFromXML(resultXML, "//ResultHtml");
    if (this.DialogContent == undefined) {
        alert('没有产生输出，请检查输入条件！');
        return;
    }
    
    this.ProcessXML=resultXML;
    contentPanel = $("#contentPanel1", $(this.DialogContent)).html();
    if (contentPanel == undefined) {
        if (GetFromXML(resultXML, "//NextButtonEnable") == "true") {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Next,false);
        }
        else {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Next,true);
        }

        if (GetFromXML(resultXML, "//BackButtonEnable") == "true") {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Back,false);
            IETM.Process.ProcessProcessUp = false;
        }
        else {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Back,true);
            IETM.Process.ProcessProcessUp = true;
        }

        if (GetFromXML(resultXML, "//ReturnButtonEnable") == "true") {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Return,false);
        }
        else {
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Return,true);
        }
        
        var processHtml=GetFromXML(resultXML, "//ProcessHtml");
        document.body.innerHTML=processHtml;
        IETM.Process.InitLink();
        IETM.Graphic.Init();
        
         //IETM.Common.MainFrame.LoadMainHTMLTab("process","manual/process.htm");
    }
    else { //生成Dialog
    
        if (GetFromXML(resultXML, "//BackButtonEnable") == "true")//记录前一步是不是可以用
        {
             IETM.Process.ProcessProcessUp = false;
            IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Back,false);
        }
        else {
              IETM.Process.ProcessProcessUp = false;
             IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Back,true);
        }
       
        //效验变量是否都定义了，如果没有要定义变量。
        var varNames=GetvarNameFrom();
        var result = IETM.Process.ReturnResult("ValidateVariables", {
        varNames: varNames
         });
         
         if(result.responseXML.text!='')
         {
           
            var variables=result.responseXML.text.split(',');
           
            var url = "#TB_inline?" + "width=" + 500 + "&height=" + 80*variables.length;
            var buttonPanel = "<input type=\"button\" class=\"buttoncls\" id=\"ConformVariables\" value=\"确定\"  />";
            var titlePanel = "请先设置没有定义的变量";
            var variablesTable=CreateVariablesDialog(variables,ShowProcessDialog);
            contentPanel= variablesTable.outerHTML;
            Processtb_show(titlePanel, url, buttonPanel, contentPanel);
            var selects=$($("#TB_window")[0]).find("select");
            var inputs=$($("#TB_window")[0]).find("INPUT");
            selects.each(
                function(index)
                {
                    selects[index].onchange=function()
                    {
                           var td=this.parentNode.parentNode.lastChild;
                           var input=document.createElement("INPUT");
                           var optionvalue=this.options[this.options.selectedIndex].value;
                           if(optionvalue==1)
                           {
                             inputs[index*2].style.display="block";
                             inputs[index*2+1].style.display="none";
                           }
                           else{
                             inputs[index*2].style.display="none";
                             inputs[index*2+1].style.display="block";
                           }
                    };
                }
            );
            
            $("#tb_CloseImage").bind("click", "", function () {
                if(confirm("有变量没有定义，可能产生错误的结果"))
                {
                  tb_remove();
                  ShowProcessDialog();
                }
            });
            
            $("#ConformVariables").bind("click", "", function () {
                var variables="";
                var row;
                var select;
                var input;
                for(var i=1;i<variablesTable.children.length;i++)
                {
                    row=variablesTable.children[i];
                    variables+=row.children[0].outerText+",";
                    select=selects[i-1];
                    variables+=select.value+",";
                    
                    input=inputs[(i-1)*2];
                    if(input.style.display=="none")
                        input=inputs[(i-1)*2+1];
                        
                    if(input.type=="text")
                    {
                        variables+=input.value;
                    }
                    else{
                        variables+=input.checked;
                    }
                    variables+=";";
                }
                var result = IETM.Process.ReturnResult("AddVariables", {
                variables: variables
                 });
                tb_remove();
                ShowProcessDialog();
            });
           //alert('存在未定义的变量！');
           //ShowProcessDialog();
         }
         else
            ShowProcessDialog();
            
               
                var node=resultXML.selectSingleNode("//VaraibleList");
                var varaibleList=new Array();
                
                if(node!=null && node.childNodes!=null)
                {
                    for(var i=0;i<node.childNodes.length;i++)
                    {
                        varaibleList.push({"name":node.childNodes[i].firstChild.text,"value":node.childNodes[i].lastChild.text});
                    }
                    if(varaibleList.length!=0)
                        SetValueFrom(varaibleList);
                }
    }
}
/**
* 生成设置变量窗体
* 
*/
function CreateVariablesDialog(variables,callback)
{
        var objTable = document.createElement("table");
        var otr;
        var ocell1;
        var ocell2;
        var ocell3;
        var input1;
        var input2;
         objTable.setAttribute("width", "100%");
         objTable.className="lists_table";
         tr=document.createElement("tr");
         ocell1=document.createElement("th");
         ocell1.innerText="变量名";
         tr.appendChild(ocell1);
         ocell2=document.createElement("th");
         ocell2.innerText="变量类型";
         tr.appendChild(ocell2);
         ocell3=document.createElement("th");
         ocell3.innerText="变量值";
         tr.appendChild(ocell3);
         objTable.appendChild(tr);
         
        for(var i=0;i<variables.length;i++)
        {
             if(variables[i]=='')
                continue;
                
             otr = document.createElement("tr");
             ocell1=document.createElement("td");
             ocell1.innerHTML=variables[i];
             otr.appendChild(ocell1);
             ocell2=document.createElement("td");
             ocell2.appendChild(CreatSelect());
             otr.appendChild(ocell2);
             ocell3=document.createElement("td");
             input1=document.createElement("INPUT");
             input1.type="checkbox";
             ocell3.appendChild(input1);
             input2=document.createElement("INPUT");
             input2.type="text";
             input2.style.display="none";
             ocell3.appendChild(input2);
             otr.appendChild(ocell3);
             objTable.appendChild(otr);
        }
        return objTable;
}

function CreatSelect()
{
    var select=document.createElement("select");
    var option;
    option =document.createElement("OPTION");
    option.value=1;
    option.text="Boolean";
    select.options.add(option);
    option =document.createElement("OPTION");
    option.value=2;
    option.text="Integer";
    select.options.add(option);
    option =document.createElement("OPTION");
    option.value=3;
    option.text="Real";
    select.options.add(option);
    option =document.createElement("OPTION");
    option.value=4;
    option.text="String";
    select.options.add(option);
    option =document.createElement("OPTION");
    option.value=10;
    option.text="UnKownType";
    select.options.add(option);
   
    return select;
}

/**
* 生成Dialog
* 
*/
function ShowProcessDialog()
{
        var content = $("#TB_ajaxContent");
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Next,true);
        //IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Back,true);
        IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Return,true);
        
        contentPanel = $("#contentPanel1", $(this.DialogContent)).html();
        if (IETM.Process.ProcessStepModel == null || content.length == 0) {
            DialogSize = IETM.AssistantInfo.GetSizeFormCss(".dialog_windows");
            titlePanel = $("#titlePanel1", $(this.DialogContent)).html();
            buttonPanel = $("#buttonPanel1", $(this.DialogContent)).html();
            var url = "#TB_inline?width=" + DialogSize[0] + "&height=200";
            Processtb_show(titlePanel, url, buttonPanel, contentPanel);

            $("#tb_CloseImage").bind("click", "", function () {
                ProcessCloseModalWindow();
            });
            BindbuttonPanelButton();
            BindExtappPanel();
            IETM.Process.ProcessStepModel = true;
        }
        else {
            titlePanel = $("#titlePanel1", $(this.DialogContent)).html();
            buttonPanel = $("#buttonPanel1", $(this.DialogContent)).html();
            var button = $("#TB_ButtonPanel");

            content.empty();
            content.append(contentPanel);
            button.empty();
            button.append(buttonPanel);
            BindbuttonPanelButton();
            IETM.Process.ProcessStepModel = true;
        }
}

/**
* 从XML获得指定节点的内容
* @type String
*/
function GetFromXML(resultXML, xph) {
    var dmcNode = resultXML.selectSingleNode(xph);
    if (dmcNode != null) {
        return dmcNode.text;
    }
    else return dmcNode;
}

/**
* 关闭导航窗口
* @type String
*/
function ProcessCloseModalWindow() {
    tb_remove();
    //IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Begin,true);
    IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Next,true);
    IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Back,true);
    IETM.Common.MainFrame.SetPageNavigationButtonDisabled(IETM.Common.MainFrame.PageNavigationButtonType.Process_Return,true);
}




function BindbuttonPanelButton() {
    $("#TB_ButtonPanel").find(":input").each(
    function () {
        $(this).className = "buttoncls";
        $(this).click(function () {
            inputClick(this.type, this.name);
        });
    });
    
    
}

function inputClick(type, name) {
    switch (type) {
    case 'submit':
        {
            if (name == 'dialog' || name=='extapp') validatesubmit();
            else//message
            {
                var result;
                result = IETM.Process.ReturnResult("Next", null);
                ProcessLoad(result.responseXML);
            }

            break;
        }
    case 'reset':
        {
            var content = $("#TB_ajaxContent");
            content.empty();
            content.append(contentPanel);
            if(this.ProcessXML!=null)
            {
              var node=this.ProcessXML.selectSingleNode("//VaraibleList");
                var varaibleList=new Array();
                
                if(node!=null && node.childNodes!=null)
                {
                    for(var i=0;i<node.childNodes.length;i++)
                    {
                        varaibleList.push({"name":node.childNodes[i].firstChild.text,"value":node.childNodes[i].lastChild.text});
                    }
                    if(varaibleList.length!=0)
                        SetValueFrom(varaibleList);
                }
             }
            break;
        }
    case 'button':
        {
            tb_remove();
            IETM.Process.ProcessUpStep();
            break;
        }
    }
}

function validatesubmit() {
    var result;
    var strValue = GetValueFrom();
    result = IETM.Process.ReturnResult("ValidateSubmit", {
        validateXml: strValue
    });
    if (!ShowValidateMessage(result.responseXML)) 
        ProcessLoad(result.responseXML);
}

function ShowValidateMessage(resultXML) {
    var ValidateResults = resultXML.selectSingleNode("//ValidateResults");
    var IsSuccess;
    var Validaters = $("#TB_ajaxContent").find("span[condition=validate]");
    var ValidaterMessage;
    if (ValidateResults != null) {
            for (var i = 0; i < Validaters.length; i++) {
                ValidaterMessage = $(Validaters[i]).next()[0];
                IsSuccess = GetFromXML(ValidateResults.childNodes[i], "//Success");
                if (IsSuccess != undefined && IsSuccess == "false") {

                    ValidaterMessage.style.display = 'block'
                }
                else {
                    ValidaterMessage.style.display = 'none'
                }
            }
        return true;
    }
    else {
        return false;
    }
}

function SetValueFrom(variableKeyPairs) {
    var varName;
    var Expression;
    $("#TB_ajaxContent").find("span[condition=validate]").each(function () {
        var inpt = this.parentNode.children[0];
        var variableKeyPair;
        for(var i=0;i<variableKeyPairs.length;i++)
        {
            variableKeyPair=variableKeyPairs[i];
            if(inpt.id==variableKeyPair.name)
            {
                inpt.value=variableKeyPair.value;
                break;
            }
        }
    });

    $("#TB_ajaxContent").find("INPUT").each(function () {
        if (this.type == "checkbox" || this.type == "radio")
            return;
            
            var variableKeyPair;
            for(var i=0;i<variableKeyPairs.length;i++)
            {
                variableKeyPair=variableKeyPairs[i];
                if(this.id==variableKeyPair.name)
                {
                    this.value=variableKeyPair.value;
                    break;
                }
            }
    });

    $("#TB_ajaxContent").find("input:checkbox").each(
    function () {
            var variableKeyPair;
            var pression;
            for(var i=0;i<variableKeyPairs.length;i++)
            {
                variableKeyPair=variableKeyPairs[i];
                if(this.id==variableKeyPair.name)
                {
                    Expression = $("span[condition=expression]", this.parentNode);
                    if(Expression[0].innerText!='')
                    {
                          if(Expression[0].innerText==variableKeyPair.value)
                            this.checked=true;
                    }
                    else{
                        if(Expression[0].innerHTML.indexOf(variableKeyPair.value.toUpperCase())!=-1)
                            this.checked=true;
                    }
                    break;
                }
            }
    });
    $("#TB_ajaxContent").find("input:radio").each(
    function () {
             var variableKeyPair;
            for(var i=0;i<variableKeyPairs.length;i++)
            {
               variableKeyPair=variableKeyPairs[i];
                if(this.id==variableKeyPair.name)
                {
                    Expression = $("span[condition=expression]", this.parentNode.parentNode);
                    if(Expression[0].innerText!='')
                    {
                          if(Expression[0].innerText==variableKeyPair.value)
                            this.checked=true;
                    }
                    else{
                        if(Expression[0].innerHTML.indexOf(variableKeyPair.value.toUpperCase())!=-1)
                            this.checked=true;
                    }
                    break;
                }
            }
    });

    $("#TB_ajaxContent").find("select").each(
    function () {
           var variableKeyPair;
            for(var i=0;i<variableKeyPairs.length;i++)
            {
                variableKeyPair=variableKeyPairs[i];
                if(this.id==variableKeyPair.name)
                {
                    this.value=variableKeyPair.value;
                    break;
                }
            }
    });
    $("#TB_ajaxContent").find("textarea").each(
    function () {
           var variableKeyPair;
            for(var i=0;i<variableKeyPairs.length;i++)
            {
                variableKeyPair=variableKeyPairs[i];
                if(this.id==variableKeyPair.name)
                {
                    this.value=variableKeyPair.value;
                    break;
                }
            }
    });

}


function GetvarNameFrom() {
    var varName;
    var varStr = '';
    var Expression;
    $(this.DialogContent).find("span[condition=validate]").each(function () {
        var inpt = this.parentNode.children[0];
        varStr += inpt.id + ',';
    });

    $(this.DialogContent).find("INPUT").each(function () {
        if (this.type != "checkbox" && this.type != "radio") 
            varStr += this.id + ',';
    });
    
     $(this.DialogContent).find("input:checkbox").each(
     function () {
            varStr += this.id + ',';
    });
    
    $(this.DialogContent).find("input:radio").each(
    function () {
        if (this.status == true) {
                varStr += this.id + ',';
        }
    });

    $(this.DialogContent).find("select").each(
    function () {
        varStr += this.id + ',';
    });
    $(this.DialogContent).find("textarea").each(
    function () {
        varStr += this.id + ',';
    });

    return varStr;
}


function GetValueFrom() {
    var varName;
    var varStr = '';
    var Expression;
    $("#TB_ajaxContent").find("span[condition=validate]").each(function () {

        var valid = $(this).html();
        var inpt = this.parentNode.children[0];
        if (inpt.value == '') varStr += inpt.id + ',0,' + valid + ';';
        else varStr += inpt.id + ',' + inpt.value + ',' + valid + ';';
    });

    $("#TB_ajaxContent").find("INPUT").each(function () {
        if (this.type != "checkbox" && this.type != "radio") varStr += this.id + ',' + this.value + ',;';
    });

    $("#TB_ajaxContent").find("input:checkbox").each(
    function () {
        if (this.checked == true) {
            Expression = $("span[condition=expression]", this.parentNode);
            if (Expression.length != 0) {
                varStr += this.id + ',' + Expression[0].innerHTML + ',;';
            }
        }
    });
    
     $("#TB_ajaxContent").find("input:checkbox").each(
     function () {
        if (this.checked == false && varStr.indexOf(this.id)==-1) {
            varStr += this.id + ', ,;';
        }          
    });
    
    

    $("#TB_ajaxContent").find("input:radio").each(
    function () {
        if (this.status == true) {
            Expression = $("span[condition=expression]", this.parentNode.parentNode);
            if (Expression.length != 0) {
                varStr += this.id + ',' + Expression[0].innerHTML + ',;';
            }
        }
    });

    $("#TB_ajaxContent").find("select").each(
    function () {
        varStr += this.id + ',' + Getselectvalue(this) + ',;';
    });
    $("#TB_ajaxContent").find("textarea").each(
    function () {
        varStr += this.id + ',' + this.value + ',;';
    });
    
    $("#TB_ajaxContent").find("tr[name=extapp]").each(
    function () {
        varStr += this.children[0].innerText + ',' + this.children[1].innerText + ',;';
    });

    return varStr;
}

function Getselectvalue(select) {
    var selectValue = '';
    var index = 0;
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected == true) {
            selectValue += select.options[i].text;
            selectValue += ",";
        }
    }
    index = selectValue.lastIndexOf(",");
    if (index != -1) selectValue = selectValue.substring(0, index);
    return selectValue;
}

/*******************为程序类DM服务的弹出窗体***************************/
function Processtb_show(caption, url, buttonHtml, contentText) {
    try {
        if (caption === null) {
            caption = "";
        }
        queryString = url.replace(/^[^\?]+\??/, '');
        params = tb_parseQuery(queryString);

        InitWindow();
        var tbWindows = $("#TB_window");
        AddTitle(tbWindows,caption);
        GetSize();
        var $content = $("#TB_ajaxContent");
        $content.append(contentText);

        AddButton(tbWindows,buttonHtml);

        tb_layout(TB_LEFT, TB_TOP, TB_WIDTH, TB_HEIGHT);
        tbWindows.css({
            display: "block"
        });

        //若窗口大小改变则随着改变大小		
        $(window).bind("resize", "", Resize);

        MoveWindow(tbWindows[0]);

        //拖拽改变大小
        DragResize(tbWindows[0]);

        //设置鼠标效果
        SetMouse(tbWindows[0]);

        tbWindows[0].focus();

    }
    catch(e) {

    }
}


/**
* 处理extapp
* @type String
*/
function BindExtappPanel() {
    var extapp=$("#TB_ajaxContent").find("span[class=extapp]");
    if(extapp.length!=0)
    {
         $("#TB_ButtonPanel").empty();
         $("#TB_ButtonPanel").append("<input type=\"button\" name=\"send\" value=\"请求\" class=\"dialog_button\" />");
         
          $("#TB_ButtonPanel").find(":input").each(
            function () {
                $(this).className = "buttoncls";
                $(this).click(function () {
                    send();
                });
            });
    }
    
}


/**
* 通过变量名获取变量的value
* 
*/
function send()
{
            var send='';
            var receive='';
            
            var sendname='';
            var sendstring='';
            var sendv='';
            var receivev='';
            
            $("span[class=send]").each(
                function(){
                     var input;
                     for(var i=0;i<this.children.length;i++)
                     {
                        input=this.children[i];
                         if(input.name=="sendname")
                            sendname=input.value;
                         if(input.name=="sendstring")
                            sendstring=input.value;
                         if(input.name=="sendv")
                            sendv=input.value;
                     }
                     
                     if(sendv!='')
                        sendstring=GetVariableValuebyName(sendv);
                     
                     if(send!='')
                        send+=";";
                     send+=sendname+","+sendstring;
                }
            );
            
            $("span[class=receive]").each(
                function(){
                     var input;
                     for(var i=0;i<this.children.length;i++)
                     {
                       input=this.children[i];
                       if(input.name=="receivev")
                         receivev=input.value;
                     }
                   
                     if(receive!='')
                        receive+=";";
                     receive+=receivev+","+'';
                }
            );
            
            
           var receive=sendValueToActiveXObject(send,receive);
           
           if(receive!='')
           {
              //sendValueToActiveXObject(receive);
              displayReceive(receive);
           }
}

/**
* 把要send的值传递给ActiveXObject
* @return 要接受（receive）的值。
* send和receive值的格式都是key1，value1；key2，value2；key3，value3；
* receive的value都是空的。
*/
function sendValueToActiveXObject(send,receive)
{
     var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
     
     return "key1,value1;key2,value2;key3,value3";
}


/**
* 通过变量名获取变量的value
* 
*/
function GetVariableValuebyName(sendv)
{
     var result;
     result = IETM.Process.ReturnResult("GetVariableValuebyName", {
        variableName: sendv
     });
     if(result!=null)
     {
        return result.responseXML;
     }
     
     return "";
}

/**
* 通过变量名获取变量的value
* 
*/
function displayReceive(receive)
{
        var objTable = document.createElement("table");
        var otr;
        var ocell1;
        var ocell2;
        var ocell3;
        var input1;
        var input2;
         objTable.setAttribute("width", "100%");
         objTable.className="lists_table";
         tr=document.createElement("tr");
         ocell1=document.createElement("th");
         ocell1.innerText="变量名";
         tr.appendChild(ocell1);
         ocell2=document.createElement("th");
         ocell2.innerText="变量值";
         tr.appendChild(ocell2);
         objTable.appendChild(tr);
         
        receives=receive.split(';');
        for(var i=0;i<receives.length;i++)
        {
             variables=receives[i].split(',');
             if(variables.length>1)
             {
                 otr = document.createElement("tr");
                 otr.name="extapp";
                 ocell1=document.createElement("td");
                 ocell1.innerHTML=variables[0];
                 otr.appendChild(ocell1);
                 ocell2=document.createElement("td");
                 ocell2.innerHTML=variables[1];
                 otr.appendChild(ocell2);
                 objTable.appendChild(otr);
             }
        }
        
//         otr = document.createElement("tr");
//         ocell3=document.createElement("td");
//         input1=document.createElement("INPUT");
//         input1.type="submit";
//         input1.name='extapp';
//         input1.value='提交'
//         $(input1).click=function()
//         {
//            inputClick("submit",'extapp');
//         }
//         
//         ocell3.appendChild(input1);
//         otr.appendChild(ocell3);
//         objTable.appendChild(otr);
        
        $("#TB_ajaxContent").empty()
        $("#TB_ajaxContent").append(objTable.outerHTML);
        
        
         $("#TB_ButtonPanel").empty();
         $("#TB_ButtonPanel").append("<input type=\"submit\" name=\"extapp\" value=\"提交\" class=\"dialog_button\" />");
         
          $("#TB_ButtonPanel").find(":input").each(
            function () {
                $(this).className = "buttoncls";
                $(this).click(function () {
                    inputClick("submit", "extapp")
                });
            });
}






/*******************完***************************/