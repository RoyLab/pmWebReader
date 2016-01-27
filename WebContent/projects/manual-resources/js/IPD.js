//	功能：IPD模块动态效果
//	作者：LuCan
//	日期：2008-09-12
//	备注：
//	
//	修改历史：
//	日期			修改人		描述:

/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();

IETM.IPD = {
    Init : function () {
       var t=IETM.DMinfo;
    },
    
    //是否IPD节点
    isIpdModule: function () {

        if (typeof top.MainFrame != 'undefined') {
            var ipdCnt = $("#ipd-dmodule").length;
            return ipdCnt > 0 ? true : false;
        }
        else {
            return false;
        }

    },

    //从热点定位到Csn
    locateCsnRow: function (apsName) {
        if (typeof top.MainFrame == 'undefined') return;
        else {
            var item = $.trim(apsName);
            var csnRows = $("tr[csnItemNo='" + item + "']");
            var first = 0;
            csnRows.each(function () {
                if (first == 0) {
                    var table = GetOwnerTable(this);
                    ClearAllRowSelection(table);
                    first++;
                    ScrollRowEl(this);
                }
                AffectSelectRow(this, true);
            });
        }
    },

    locateGraphicHotspots: function (item) {
        try {
            var apsName =item;
            var hotspots = $("div[apsname='" + apsName + "']");
            
            
            if (apsName!=null&&''==$.trim(apsName.toString())) {
                top.document.frames['ifmMultimediaViewer'].frames[0].clearAllCgmHotspot();
                return;
            }
            else { if (hotspots.length > 0) {
                    var imgNode = hotspots[0];
                    while (imgNode != null) {
                        if ($(imgNode).attr('class') != null && $(imgNode).attr('class').toLowerCase() == 'figure') break;
                        imgNode = imgNode.parentNode;
                    }

                    var apsIds = $("div[apsname='" + apsName + "']", imgNode);
                    var arr = new Array();
                    apsIds.each(function () {
                        arr.push(this.apsid);
                    });

                    imgNode = $("img[class='figure_min']", imgNode);

                    if (imgNode.length > 0) 
                        IETM.Graphic.ShowImage(imgNode[0], imgNode[0].name == "" ? 0 : 1, arr,true);
                }
                else {
                    top.document.frames['ifmMultimediaViewer'].frames[0].clearAllCgmHotspot();
                }
            }
        } catch(e) {};
    }
}

/*
 *	单击CSN数据行(模板中使用)
 */
function onClickCsnTableCell()
{

    if(typeof top.MainFrame=='undefined')
        return;
    var currentClickRow=event.srcElement;
    while(currentClickRow.tagName.toLowerCase()!='tr')
      currentClickRow=currentClickRow.parentNode;
    var csnTable=GetOwnerTable(currentClickRow);
    ClearAllRowSelection(csnTable);
    SetSelectContinueRows(currentClickRow);
    
    //定位到图像热点
    var item=$(currentClickRow).attr('csnItemNo');
    IETM.IPD.locateGraphicHotspots(item);
}


/*
 *	单击CSN数据行头(模板中使用)
 */
function onClickCsnTableHeader()
{
    if(typeof top.MainFrame=='undefined')
        return;
    var csnTable=GetOwnerTable(event.srcElement);
    ClearAllRowSelection(csnTable);
}

//从CSN的Item属性转换成图片对象的apsname
function getCGMItemNoFromCsnItem(item)
{
    var midiItem=item;
    midiItem=parseFloat(item);
    if(isNaN(midiItem))
        midiItem=item;
    return midiItem;
}



//获取所属Table
function GetOwnerTable(clickRow)
{
    var csnTable=clickRow;
    while(csnTable!=null&&csnTable.tagName.toLowerCase()!='table')
        csnTable=csnTable.parentNode;
    return csnTable;
}

//清除选中效果
function ClearAllRowSelection(csnTable)
{
    if(csnTable!=null)
    {
        $("tr",csnTable).each(function(){
            AffectSelectRow(this,false)
        });
    }
}

//滚屏到CSN指定行数据
function ScrollRowEl(rowEl)
{
    var x=0,y=0;
    var el=rowEl;
    while(el.offsetParent!=null){
    if(el.tagName.toLowerCase()=='body')
        break;
        if(typeof el.offsetLeft!='undefined')
            x=x+el.offsetLeft;
        if(typeof el.offsetTop!='undefined')
            y=y+el.offsetTop;
        el=el.offsetParent;
    }
    
    
    var contentDoc=rowEl.document.body;
    if(!(y>contentDoc.scrollTop&&y+rowEl.offsetHeight<contentDoc.scrollTop+contentDoc.clientHeight)){
        if(y>10)
            y=y-10;
        window.scrollTo(x,y);
    }  
}

//根据单击行选中所有合并行
function SetSelectContinueRows(clickRow)
{
    var midiItemName;
    var itemName=$(clickRow).attr('csnSeqNo');
    var preRow=clickRow.previousSibling;
    while(preRow!=null)
    {
        if(preRow.tagName.toLowerCase()=='tr')
        {
            midiItemName=$(preRow).attr("csnSeqNo");
            if(midiItemName==itemName)
                AffectSelectRow(preRow,true);
            else
                break;
        }
        preRow=preRow.previousSibling
    }
    var nextRow=clickRow.nextSibling;
    while(nextRow!=null)
    {
        if(nextRow.tagName.toLowerCase()=='tr')
        {
            midiItemName=$(nextRow).attr("csnSeqNo");
        if(midiItemName==itemName)
            AffectSelectRow(nextRow,true);
        else
            break;
        }
        nextRow=nextRow.previousSibling
    }
    AffectSelectRow(clickRow,true);
}

//渲染行选中效果
function AffectSelectRow(row,isSelect)
{
    if(!isSelect)
        $(row).css('background','#FFFFFF');
    else
        $(row).css('background','#3399FF');
}



