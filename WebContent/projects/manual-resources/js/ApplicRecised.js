/// <reference path="../../test/js/jquery-debug.js" />

/// <reference path="../../test/js/jQuery.intellisense.js" />

/************************************************************************/
/*功能描述：实现适用性和修订
/*	作者：sunlunjun
/*	日期：2009-03-04                                                                
/************************************************************************/

/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();


/**
 * 适用性过滤功能
 */
IETM.ApplicRecised = {

    /*
     *目的： 初始化。
     */
    Init: function () {
        this.FilterApplic(null);
    },
    /*
     *目的： 适用性过滤。
     */
    FilterApplic : function (obj) {
        //获取适用性的条件，模板中做的标记
        var objDesc = null;
        var isFilterApplic = false;
        if(obj != undefined && obj != null) {
            objDesc = $("span[condition*='applic']",obj);
        }else{
            objDesc = $("span[condition*='applic']");
        }

        if (objDesc == null || typeof objDesc == 'undefined' || objDesc.length == 0) {
            return isFilterApplic;
        }
        try
        {
            for (i = 0; i < objDesc.length; i++) {
                var applicStr = null;
                var applicNode = objDesc[i];
                var conut = 0;
                while (applicNode != null && typeof applicNode != 'undefined') {
                    if (applicNode.nodeName.toLowerCase() == "applic") {
                        applicStr = applicNode.parentNode.innerHTML;
                        break;
                    }
                    if (conut++>10) {
                        break;
                    }
                    applicNode = applicNode.childNodes[0];
                    if (applicNode != undefined && applicNode.tagName.toLowerCase() == "a") {
                        applicNode = objDesc[i].childNodes[1];
                    }
                }
                var filterCondition = IETM.Common.FilterService != undefined && IETM.Common.FilterService != null && IETM.Common.FilterService.FilterApplic(applicStr) == false;
                if(filterCondition)
                {
                    var nodetr = $("tr",objDesc[i]);
                    var nodetd = $("td",objDesc[i]);
                    if(nodetr.length > 0 || nodetd.length == 0) {
                        objDesc[i].innerHTML = "&nbsp;";
                        if(!isFilterApplic)
                            isFilterApplic = true;
                    } else {
                        for(j = 0; j < nodetd.length; j++)
                        {
                            nodetd[j].innerHTML = "&nbsp;";
                            if(!isFilterApplic)
                                isFilterApplic = true;
                        }
                    }
                }  
            }
        }
        catch (e){}           

      return isFilterApplic;     
    }
}
