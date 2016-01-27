/************************************************************************/
//	功能：内部交叉引用(图形热点)
//	作者：wanghai
//	日期：2009-1-6
//	备注： 该js处理内部交叉引用，包括图形热点的引用。
//	
//	修改历史：
//	日期			修改人		描述:                                                             
/************************************************************************/

/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();

IETM.Reference = {
    InsideXrefs:null,
    OutsideXrefs:null,
    OutsideXreftps:null,
    /*
     *目的： 初始化。
     */
    Init: function () {
        this.ValidLink();
        this.PreLinkInfo();
        this.LinkLocation();
    },
    
    /*
     *目的： 已经电击的链接。
     */
    ColorLink: function (checkedLinks) {
       if(checkedLinks==undefined || checkedLinks==null)
            return;
        
        var link;
       OutsideXrefIndexs=checkedLinks.OutsideXrefs;
       for(var i=0;i<OutsideXrefIndexs.length;i++)
       {
            link=this.OutsideXrefs[OutsideXrefIndexs[i]];
            if(link!=undefined)
                link.style.color="#555";
       }
       
       OutsideXreftpIndexs=checkedLinks.OutsideXreftps;
       for(var i=0;i<OutsideXreftpIndexs.length;i++)
       {
            link=this.OutsideXreftps[OutsideXreftpIndexs[i]];
            if(link!=undefined)
                link.style.color="#555";
       }
       
       InsideXrefIndexs=checkedLinks.InsideXrefs;
       for(var i=0;i<InsideXrefIndexs.length;i++)
       {
            link=this.InsideXrefs[InsideXrefIndexs[i]];
            if(link!=undefined)
                link.style.color="#555";
       }
    },


    /*
     *目的： 判断链接是否有效。
     */
    ValidLink: function () {
        var dt, tm;
        var linkObj = $("a[href='.htm']");
        linkObj.click(function () {
            dt = new Date();
            tm = dt.getTime();
            linkObj.attr("href", "#" + tm.toString(10));
            alert("链接不存在！");
        });
    },

    /*
     *目的： 处理超链接提示信息。
     */
    PreLinkInfo: function () {
        var links = $("a");
        links.each(function (index) {
            if (links.eq(index)[0].href != "") {
                if ($(this)[0].title == "") {
                    $(this)[0].title = $(this).attr("outerText");
                }
            }
        });
    },

    /*
     *目的： 处理定位。
     */
    LinkLocation: function () {

        //非导航模式下加入连接。暂时用这种方式，等模板写好很，在模板中加入特定表示
        if (window.location.href.indexOf('process.htm') == -1) {
        
            this.InsideXrefs=$(document).find("a[class=insideXref]");
            this.OutsideXrefs= $(document).find("a[class=outsideXref]");
            this.OutsideXreftps=$(document).find("a[class=outsideXreftp]");
            
            var i=0;
            this.InsideXrefs.each(function () {
                if (this.href != "" && this.href.indexOf('javascript') == -1) {
                    var xrefId;
                    var endstr = this.href.indexOf('#', 0);
                    if ((this.id == '' || this.id == undefined) && endstr != -1) {
                        xrefId = this.href.substring(endstr, this.href.length);
                        this.id = xrefId;
                    }
                    if(top!=undefined && top.ApplicationContext!=undefined)
                        this.href = "javascript:top.ApplicationContext.IIETM().Reference.InsideXref('" + encodeURIComponent(this.href) + "','" + this.tget + "','" + i + "')";
                    else
                         this.href = "javascript:IETM.Reference.InsideXref('" + encodeURIComponent(this.href) + "','" + this.tget + "','" + i + "')";
                }
                i++;
            });

            i=0;
            this.OutsideXrefs.each(function () {
                if (this.href != "" && this.href.indexOf('javascript') == -1) {
                    this.href = "javascript:top.ApplicationContext.IIETM().Reference.OutsideXref('" + encodeURIComponent(this.href) + "','" + this.attributes["dmtarget"].value + "','" + i + "')";
                }
                i++;
            });

            i=0;
            this.OutsideXreftps.each(function () {
                if (this.href != "" && this.href.indexOf('javascript') == -1) {
                    this.href = "javascript:top.ApplicationContext.IIETM().Reference.OutsideXreftp('" + this.attributes["tptarget"].value + "','" + i + "')";
                }
                i++;
            });

        }
    }

}


/**
* 外部链接DM列表
* @type String
*/
IETM.Reference.OutsideXreftp = function (href,xrefindex) {
    var index;
    if(xrefindex!=undefined && IETM.Common.HistoryEntry!=null)
        IETM.Common.HistoryEntry.AddOutsideXreftpLink(xrefindex);
        
    index = href.indexOf('PMC-');
    if (index == -1) {
        href = 'PMC-' + href;
    }

     //  MainFrame.Go(1, "DMlist.html?id=" + href + "&text=出版物&listType=tp", '', dmType, href);
}

/**
* 外部链接
* @type String
*/
IETM.Reference.OutsideXref = function (href, dmtarget,xrefindex) {
    var index;
    var path;

    var endstr = href.indexOf('#', 0);
    var xrefId;

     if(xrefindex!=undefined && IETM.Common.HistoryEntry!=null)
        IETM.Common.HistoryEntry.AddOutsideXrefLink(xrefindex);
        
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

    if (IETM.Common.CommonService != undefined && IETM.Common.CommonService != null && IETM.Common.CommonService.UrlExists(path)) {
        var DMinfo=IETM.Common.MainFrame.GetMainTabDMinfo();
        
        if (DMinfo!=undefined && DMinfo!=null && (DMinfo.DmType == "afi" ||  DMinfo.DmType =="process")) {
            IETM.Common.MainFrame.LoadNewHTMLTab(dmtarget, path, xrefId);
        } else {
              IETM.Common.MainFrame.LoadMainHTMLTab(dmtarget, path, xrefId);
        }
    }
    else { if (IETM.Common.UserInfo != undefined && IETM.Common.UserInfo != null && !IETM.Common.UserInfo.RcmUser) {
            alert('指定的网页不存在！');
        }
        return;
    }
}

/**
* 内部链接
* @type String
*/
IETM.Reference.InsideXref = function (href, tget,xrefindex) {
    var hgraphic;
    var isApplic = false;
    var IsHospot = false;
    var endstr = href.indexOf('#', 0);
    var xrefId;
    var arr = new Array();

    if(xrefindex!=undefined && IETM.Common.HistoryEntry!=null)
        IETM.Common.HistoryEntry.AddInsideXrefLink(xrefindex);
    //如果是步进模式，关掉窗口
//    if (IETM.AssistantInfo.ModalFormShow) {
//        IETM.AssistantInfo.CloseModalWindow();
//    }

    if (endstr != -1) {
        xrefId = href.substring(endstr + 1, href.length);
        // && IETM.Common.ApplicationContext.MainFrame.GetNavigator() == "IE7"
        if (IETM.Common.MainFrame != undefined && IETM.Common.MainFrame != null) {
            href = decodeURIComponent(href);
        }
    }// && IETM.Common.ApplicationContext.MainFrame.GetNavigator() == "IE7"
    else { if (IETM.Common.MainFrame != undefined && IETM.Common.MainFrame != null) {
        href = decodeURIComponent(href);
    }

        endstr = href.indexOf('#', 0);

        if (endstr != -1) {
            xrefId = href.substring(endstr + 1, href.length);
        }
    }

    //如果是热点
    hospot = $("#" + decodeURIComponent(xrefId));
    if (hospot.length != 0)//如果是热点ID
    {
        hgraphic = Hithhospot(hospot.parent());
        if (hgraphic != undefined && hgraphic.length != 0) {
            curryhospot = hospot.attr("apsid");
            arr.push(curryhospot);
            IETM.Graphic.ShowImage(hgraphic[0], hgraphic[0].name == "" ? 0 : 1, arr);
  
            IsHospot = true;
        }
    }
    else if (tget != undefined && tget != "undefined" && tget.length != 0)//如果是热点名字 
    {
        graphics = $("a[name=" + xrefId + "]").next("div[class=figure]");
        var graphic;
        if (graphics.length != 0) {
            var curryHospotName = tget;
            for(var i=0;i<graphics.length;i++)
            {
                graphic=graphics[i];
                aspnames=$("div[apsname=" + curryHospotName + "]", graphic);
                if(aspnames.length!=0)
                {
                        aspnames.each(
                        function () {
                            arr.push(this.apsid);
                        });
                       image = $(graphic).children("p").children("img");
                       IETM.Graphic.ShowImage(image[0], image[0].name == "" ? 0 : 1, arr);
                       break;
                }
            }
            IsHospot = true;
        }
    }

    //如果不是热点gdf  $(this).next().attr("condition")=='applic'
    if (!IsHospot) {
        var link;
        isApplic = false;

        if ($("a[name=" + xrefId + "]").length != 0) {
            link = $("a[name=" + xrefId + "]")[0];
        }
        else if (IETM.Common.UserInfo != null && !IETM.Common.UserInfo.RcmUser) {
            alert('指定链终在导航范围内不存在！');
        }

        //如果适用性已经隐藏，不用连接。
        if ($(link).next().attr("condition") == 'applic' && $(link).next().attr("style") == 'DISPLAY: none') {
            isApplic = true
        }
        else {
            isApplic = IsApplicCondition(xrefId);
        }
        
        if(IsHidden(xrefId)) {
            alert('指定链终在导航范围内不存在！');
        }
        else if (isApplic) {
            alert('指定链终不满足适用性条件！');
        }else{
            //特殊加一个处理步进模式下的交叉引用将目标图展示出来
            if (IETM.AssistantInfo.ModalFormShow) {
                hgraphic = Hithhospot($("a[name=" + xrefId + "]").next("div[class=figure]"));
                if(hgraphic!=undefined && hgraphic.length>0)
                {
                    IETM.Graphic.ShowImage(hgraphic[0], hgraphic[0].name == "" ? 0 : 1, arr);
                }
            }
            
            if(document.all.tooltip!=undefined && document.all.tooltip!=null)
                IETM.Common.Scroller(link, 800, document.all.tooltip);        
                
        }
    }
}

/**
* 热点连接
* @type String
*/
IETM.Reference.LocateHospot = function (apsid, apsname) {
    var curryimage;
    var hotdiv;
    if (stepmodalFormShow) {
        curryimage = GetCurrentStepImage();
    }
    else {
        curryimage = GetCurrentGraphicImage();

    }
    hotdiv = $("div[apsid=" + apsid + "]", curryimage.parentNode.parentNode);
    if (hotdiv.length != 0) {
        return hotdiv[0].outerHTML;
    }
}

/**
* 热点连接
* @type String
*/
function Hithhospot(prt) {
    var hgraphic = undefined;
    if (prt != undefined && prt[0] != undefined && prt[0].parentNode != null) {
        if (prt.length > 0 && prt[0].className == 'figure') {
            hgraphic = $("img", prt);
        }
        else {
            Hithhospot(prt.parent());
        }
    }
    return hgraphic;
}

/**
 * 如果结点已经隐藏，不用连接
 */
function IsHidden(xrefId) {

    //获取适用性的条件，模板中做的标记
    var objDesc = $("div[id*='schedule_']:has(a[name='" + xrefId +"'])");

    if (objDesc == null || typeof objDesc == 'undefined' || objDesc.length == 0) {
        return false;
    }
    
    if (objDesc[0].style.display == "none") {
        return true;
    }else {
        return false;
    }
}

/**
 * 如果适用性已经隐藏，不用连接
 */
function IsApplicCondition(xrefId) {

    //获取适用性的条件，模板中做的标记
    var objDesc = $("span[condition*='applic']:has(a[name='" + xrefId +"'])");

    if (objDesc == null || typeof objDesc == 'undefined' || objDesc.length == 0) {
        return false;
    }
    
    if (objDesc[0].style.display == "none") {
        return true;
    }else {
        return false;
    }
}