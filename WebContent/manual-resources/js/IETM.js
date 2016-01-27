///////////////////////////////////////////////////////////////////////////////
//功能描述：加载的页面公用的初始化和对外接口，ApplicationContext是主框架对IETM接口
//作者：wanghai
//日期：2010-1-19
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();

$(document).ready(function () {

        if(IETM.Reference!=undefined)
           IETM.Reference.Init();
           
         if (top.ApplicationContext == undefined || top.ApplicationContext == null || top.ViewHistory == undefined || top.ViewHistory == null || top.ViewHistory.ViewHistoryService == undefined || top.ViewHistory.ViewHistoryService == null) {
             try{
                    if(IETM.Graphic!=undefined && IETM.Graphic!=null)
                    {
                        IETM.Graphic.Images=$(".figure_min");
                        IETM.Graphic.ShowFlowImage();
                    }
                    if(IETM.Schedule!=undefined && IETM.Schedule!=null)
                        IETM.Schedule.Init();
                        
                    return ;
                }
                catch(e)
                {
                    return ;
                }
         }
            
       
        IETM.Common.Init();
      
        if(IETM.AssistantInfo!=undefined)
            IETM.AssistantInfo.Init();
        if(IETM.ApplicRecised!=undefined)
            IETM.ApplicRecised.Init();   
      
        
        //根据不同的DM类型来确定是否要初始化
        var dmType=IETM.Common.DMinfo.DmType;
        if(IETM.IPD!=null)
            IETM.IPD.Init();
        if (dmType == "schedule" && IETM.Schedule!=undefined)
            IETM.Schedule.Init();
        if (dmType == "afi" && IETM.Fault!=undefined)
            IETM.Fault.Init();
        if (dmType == "proced" || dmType == "proced_card" && IETM.Proced!=undefined)
            IETM.Proced.Init();
        if (dmType == "process" && IETM.Process!=undefined)
            IETM.Process.Init();
            
         /*
         *要放在最后面，因为可能初始化的是弹出窗口的图片
         */
        if (IETM.Graphic!=undefined && !IETM.AssistantInfo.AutoShowSafety) 
            IETM.Graphic.Init();
        
       //高亮显示
       IETM.Common.HightingKeyword();      
});

/*
 *目的： 页面公共的初始化和对外的接口，主框架对IETM接口。
 */
IETM.Common =  {
     /*
     *	主框架接口
     */
     MainFrame:null,               
      /*
     *	用户信息接口
     */
     UserInfo:null,                
      /*
     *	过滤服务接口
     */
     FilterService:null,           
      /*
     *	通用服务接口
     */
     CommonService:null,           
      /*
     *	DM信息
     */
     DMinfo : null,              
      /*
     *	元数据面板
     */
     ObjMetadataPane:null,    
      /*
     *	历史记录变量
     */
     HistoryEntry : null,
      /*
     *	页面隐藏iframe的id。
     */
     DataFrameID:"ifm_proced", 
     Init : function () {
                this.Validate();
                if (top.ApplicationContext != undefined && top.ApplicationContext != null && top.ViewHistory!=undefined && top.ViewHistory!=null && top.ViewHistory.ViewHistoryService!=undefined && top.ViewHistory.ViewHistoryService!=null) {
                    this.MainFrame = top.ApplicationContext.IMainFrame();
                    this.UserInfo = top.ApplicationContext.IUserInfo();
                    this.FilterService= top.ApplicationContext.IFilterService();
                    this.CommonService=top.ApplicationContext.ICommonService();
                    this.HistoryEntry=top.ViewHistory.ViewHistoryService.Current();
                    //禁止复制、剪贴、屏幕打印、右键菜单等window
                    this.CommonService.ForbidOperation(document);           
                }

                this.objMetadataPane = $("#metadataPane");  
                this.DMinfo=this.GetDMInfo(); 
                //添加缩略词效果
                this.AddAcrodef();
     },
     /*
     *目的： 验证访问的合法性
     */
     Validate : function () {
          if(top.location == document.location)
          { 
                href = window.location.href;
                
                if (href.indexOf('rcm=rcm') == -1) 
                {
                    return;
                }
                if (href.indexOf('?print=0') == -1) 
                    return;
                    
                if (href.indexOf('http://') != -1) {
                    index = href.indexOf('Manual');
                    href = href.substring(0, index);
                    alert('用该路径访问将会导致错误，请重新登录！');
                    window.location.href = href + 'login.html';
                    window.opener = null;
                    return;
                }
          }
     },
      /*
     *目的： 实现缩略词功能
     */
     AddAcrodef : function () {
           var terms = $(".acrotermcls");
            terms.each(function (index) {
                var def = $(this).parent().children(".acrodefcls");
                if (def.length > 0) {
                    def.css("display", "none");
                    terms.eq(index).hover(function () {
                       def.css("position", "absolute");
                        def.css("z-index", "9999");
                        
                        var Width=def[0].clientWidth;
                        var Height=def[0].clientHeight;
                        
                        var y=event.clientY;
                        var x=event.clientX;
                        var top = event.clientY - document.body.scrollTop;
                        var bottom =document.body.clientHeight - top;
                        var left = event.clientX - document.body.scrollLeft;
                        var right =document.body.clientWidth - left;
                        
                        if(bottom<top)
                        {
                            def.css("top", y - Height);
                        }
                        else{
                            def.css("top", y);
                        }
                        
                         if(right<left)
                         {
                            def.css("left",x - Width);
                         }
                         else{
                            def.css("left", x);
                         }
                         
                         def.css("display", "block");

                    },
                    function () {
                        def.css("display", "none");
                    });
                }
            });
     },
     /*
     *目的： 获取DM信息
     */
     GetDMInfo : function () {
        var dmInfo;
        var result = '';
        var dmcext = document.getElementById('dmcxt');
        var dmc = document.getElementById('dmc');
        var dmType = $('#dmType').val();
        var security = $('#security').val();
        var issno = $('#issno').val();
        var issno_inwork = $('#issno_inwork').val();
        var language = $('#language').val();
        var country = $('#country').val();
        var title = document.title;
        var objectType="RefDM";
        
        var url=document.location.pathname;
        var index=url.indexOf("Manual");
        if(index!=-1)
           url=url.substring(index);
        url=url+document.location.search;
        
        if (window.location.href.indexOf('process.htm') != -1) dmType = 'process';
        
        if(dmType!="DMlist")
        {
            if (dmc != null && dmc.value != '') {
            result = dmc.value;
            if (issno != null && issno!= '') {
                result += '_' + issno + ((issno_inwork != null && issno_inwork != '') ? '-' + issno_inwork : null);
            }

            if (language != null && language != '') {
                result += '_' + language + ((country != null && country != '') ? '-' + country : null);
            }

            if (dmcext != null && dmcext.value != '-' && dmcext.value != '') {
                result = 'DME-' + dmcext.value + '-' + result;
            }
            else result = 'DMC-' + result;
            }

            if (dmType == "proced_card") {
                result += "_CARD";
            }
        }
        else
        {
           result=IETM.Common.CommonService.RequestString("id",document.location.search).replace('~','#'); 
           title=IETM.Common.CommonService.RequestString("text",document.location.search)+'列表';
           objectType=IETM.Common.CommonService.RequestString("objectType",document.location.search);
        }
        
        if(result!=''&&result!='root'&&(objectType=='PM'||objectType=='RefPM'))
        {
            var midiStr=result.substring(result.indexOf("_")+1);
            issno=midiStr.substring(0,midiStr.indexOf("-"));
            midiStr=midiStr.substring(midiStr.indexOf("-")+1);
            issno_inwork=midiStr.substring(0,midiStr.indexOf("_"));
            midiStr=midiStr.substring(midiStr.indexOf("_")+1);
            language=midiStr.substring(0,midiStr.indexOf("-"));
            midiStr=midiStr.substring(midiStr.indexOf("-")+1);
            country=midiStr;
        }
        if(result=="root")
            result=null;
            
        dmInfo = {
            "Dmc": result,
            "DmType": dmType,
            "Security": security,
            "Issno": issno,
            "Issno_inwork": issno_inwork,
            "Language": language,
            "Country": country,
            "Title": title,
            "Src" : url,
            "ObjectType" : objectType
        };
        return dmInfo;
     },
     /*
     *目的： 获取适应性
     */
     GetApplic : function () {
            var applicVal = null;
            var applicNode = document.getElementById('applicValue');
            var globalVersion = top.TOC.Version['Version'];
            //sunjian20120214注释此代码，2.3也返回使用性内容好在标题上加上显示
//            if (globalVersion!=undefined && globalVersion == '2.3') {
//                return '';
//            }
            if(applicNode != null && typeof applicNode != 'undefined')
            {
                try{
                    var val = applicNode.value;
                    if(val != null && val != '' && typeof val != 'undefined')
                        applicVal = '适用性：' + val;
                }
                catch(e){ applicVal = null; }
            }
            else
            {
                applicVal = '适用性：全部';
            }

            if(applicVal == null || typeof applicVal == 'undefined')
                applicVal = '适用性：全部';
                
            return applicVal;
     },
      /*
     *目的： 定位
     */
     Scroller : function (el,duration,tip) {
                if (typeof el != 'object') {
                el = document.getElementById(el);
            }

            if (!el) return;
            var Z = this;
            Z.el = el;
            Z.p = this.GetPosition(el);
            Z.s = this.GetScroll();
            Z.clear = function () {
                window.clearInterval(Z.timer);
                Z.timer = null;
            };
            Z.t = new Date().getTime();
            Z.step = function () {
                var t = new Date().getTime();
                var p = (t - Z.t) / duration;
                if (t >= duration + Z.t) {
                    Z.clear();
                    window.setTimeout(function () {
                        Z.scroll(Z.p.y, Z.p.x);
                    },
                    13);
                }
                else {
                    st = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (Z.p.y - Z.s.t) + Z.s.t;
                    sl = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (Z.p.x - Z.s.l) + Z.s.l;
                    Z.scroll(st, sl);
                }
            };
            Z.scroll = function (t, l) {
                window.scrollTo(l, t);
            };

            if (tip == null) {
                Z.scroll(Z.p.y, Z.p.x);
            }
            else if ((Z.p.y < document.body.scrollTop) || (Z.p.y > (document.body.scrollTop + document.body.clientHeight))) {
                Z.scroll(Z.p.y, Z.p.x);
            }

            if (tip != null) {
                //      Z.timer=window.setInterval(function(){Z.step();},13);
                var lef = (Z.p.x - 90) <= 0 ? 0 : (Z.p.x - 90);
                var framestyle = tip.style;
                framestyle.left = lef;
                framestyle.top = Z.p.y + Z.p.h;
                tip.style.position = "absolute";
                tip.style.display = 'block';
                //	    tip.onblur=function(){tooltip.style.display='none';};
                //       tip.focus();

                tip.onfocus = function () {
                    setTimeout("tooltip.style.display='none'", 10000);
                };
                tip.focus();
            }
     },
     /**
    * 获取滚动条的位置
    * @type String
    */
    GetScroll : function () {
        var t, l, w, h;
        if (document.documentElement != undefined && document.documentElement.scrollTop != undefined) {
            l = document.documentElement.scrollLeft;
            t = document.documentElement.scrollTop;
            w = document.documentElement.scrollWidth;
            h = document.documentElement.scrollHeight;
        }
        else if (document.body != undefined) {
            l = document.body.scrollLeft;
            t = document.body.scrollTop;
            w = document.body.scrollWidth;
            h = document.body.scrollHeight;
        }
        return {
            t: t,
            l: l,
            w: w,
            h: h
        };
    },

    /**
    * 获取滚动条的位置
    * @type String
    */
    GetPosition : function (ele) {

        var posObj;
        var childs;
        if (ele.offsetTop == 0) {
            posObj = ele;
        }

        var l = 0;
        var t = 0;
        var w = intval(ele.style.width);
        var h = intval(ele.style.height);
        var wb = ele.offsetWidth;
        var hb = ele.offsetHeight;
        while (ele) {
            if (ele.nodeName == "TABLE") {
                if (ele.parentNode.style.display = 'none') {
                    ele.parentNode.style.display = 'block';
                }

                if (posObj != undefined)//当锚点在表行的外面，不能通过描点来定位。
                {
                    if (ele.firstChild.tagName.toUpperCase() == "TBODY") childs = ele.children[0].childNodes;
                    else if (ele.firstChild.tagName.toUpperCase() == "COLGROUP") childs = ele.children[1].childNodes;
                    else childs = ele.childNodes;

                    for (var i = 0; i < childs.length; i++) {
                        if (childs[i].outerHTML.indexOf(posObj.outerHTML) != -1) {
                            if (childs[i].nodeName.toUpperCase() == "TR") {
                                ele = childs[i];
                                l = 0;
                                t = 0;
                                posObj = undefined;
                                break;
                            }
                            else if (childs[i + 1] != undefined && childs[i + 1].nodeName.toUpperCase() == "TR") {
                                ele = childs[i + 1];
                                l = 0;
                                t = 0;
                                posObj = undefined;
                                break;
                            }
                        }
                    }
                }
            }

            l += ele.offsetLeft + (ele.currentStyle ? intval(ele.currentStyle.borderLeftWidth) : 0);
            t += ele.offsetTop + (ele.currentStyle ? intval(ele.currentStyle.borderTopWidth) : 0);

            ele = ele.offsetParent;
        }

        return {
            x: l,
            y: t,
            w: w,
            h: h,
            wb: wb,
            hb: hb
        };

        function intval(v) {
            v = parseInt(v);
            return isNaN(v) ? 0 : v;
        }
    },
    
    /**
    * 页面中查询高亮显示
    * @type String
    */
    HightingKeyword : function() {
        try
        {
            var param = decodeURIComponent(window.location.href);
            var content,contentReg,ele;

            var reg = new RegExp("(contentKey=)([^&]*)","ig");

            if(reg.exec(param) == null)
                return ;
                
            content = RegExp.$2;
            reg = new RegExp("<(.*)>.*<\/\1>","ig");
            
            if(reg.exec(content) != null)
                return ;
                
            content = content.replace(/(\')|(\/)|(\?)|(\+)|(\^)|(\()|(\))|(\$)|(\.)|(\|)|(\*)|(\{)|(})|(\[)|(])|(&)|(@)|(%)|(#)|(;)|(:)|(-)|(=)|(<)|(>)/g,"");        
            if(content!="")
            {
                ele = document.getElementById("dmContent");

                reg = new RegExp("^\[ ]+","g");
                contentReg = new RegExp("("+content+")","ig");
                this.GetInnerText(ele,reg,contentReg);
            }    
        }
        catch(e) {
            return ;
        }
    },

    /**
    * 页面中查询高亮显示递归查找文本
    * @type String
    */
    GetInnerText : function(ele,reg,contentReg) {
        if(ele != null)
        {
            if(ele.nodeType == 3)
            {
                var replaceText = ele.nodeValue.replace(contentReg,"<font color=\"#FF0000\">$1</font>");
                if(replaceText != ele.nodeValue)
                {
                    var newNode = ele.ownerDocument.createElement("span");
                    if(reg.exec(ele.nodeValue))
                    {
                        newNode.innerHTML = "&nbsp;" + replaceText;                       
                    }
                    else
                    {
                        newNode.innerHTML = replaceText;
                    }
                    ele.parentNode.replaceChild(newNode,ele);
                }        
            }
            else
            {
                for(var i =0; i < ele.childNodes.length; i++)
                {
                    this.GetInnerText(ele.childNodes[i],reg,contentReg);
                }            
            }
        }
    }
}

/**
* 页面交互控制是否显示（模板中用）
* @type String
*/
function togglediv(img, div) {
    if (div.style.display == '' || div.style.display == 'none') {
        div.style.display = 'block';
        img.src = img.path + '/collapse.gif';
    }
    else {
        div.style.display = 'none';
        img.src = img.path + '/expand.gif';
    }
}
