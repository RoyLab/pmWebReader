Service.RegNameSpace('window.Comment');

/*
 *	Comment查询类型
 */
Comment.QueryCommentType = {
    //所有意见不包括回复
    AllCOMMENT: 0,
    //所有意见包括回复
    ALLCOMMENTINCLUDEREPLY: null,
    EMPTYCOMMENT: -1
};

/*
 * @功能: 意见业务服务类
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Comment.Biz = {

    /*
     *	根据查询类型,查询Comment列表
     *  ALLCOMMENT:所有意见不包括回复
     *  ALLCOMMENTINCLUDEREPLY:所有意见包括回复
     *  其他为根据ID查询该ID相关的所有意见包括回复
     */
    QueryCommentList: function (qureyType) {
        var retArray = new Array();
        var result;
        var refobjectresult;
        var refcattachResult;

        try {
            result = Service.WebService.Post('GetCommentElements', {
                ID: qureyType
            });
            refobjectresult = Service.WebService.Post('GetRefObjects', {
                ID: qureyType
            });

            if (result != null && refobjectresult != null) {
                var nodes = Ext.DomQuery.select("/CommentElement", result.documentElement);

                for (var i = 0; i < nodes.length; i++) {
                    var ItemArray = new Array();
                    ItemArray[0] = Ext.DomQuery.selectNode("/ID", nodes[i]).text;
                    ItemArray[1] = Ext.DomQuery.selectNode("/parentID", nodes[i]).text;
                    ItemArray[2] = Ext.DomQuery.selectNode("/modelic", nodes[i]).text;
                    ItemArray[3] = Ext.DomQuery.selectNode("/sendid", nodes[i]).text;
                    ItemArray[4] = Ext.DomQuery.selectNode("/diyear", nodes[i]).text;
                    ItemArray[5] = Ext.DomQuery.selectNode("/seqnum", nodes[i]).text;
                    ItemArray[6] = Ext.DomQuery.selectNode("/ctype", nodes[i]).text;
                    ItemArray[7] = Ext.DomQuery.selectNode("/ctitle", nodes[i]).text;
                    ItemArray[8] = Ext.DomQuery.selectNode("/issdate", nodes[i]).text;
                    ItemArray[9] = Ext.DomQuery.selectNode("/language", nodes[i]).text;
                    ItemArray[10] = Ext.DomQuery.selectNode("/languageCountry", nodes[i]).text;
                    ItemArray[11] = Ext.DomQuery.selectNode("/entname", nodes[i]).text;
                    ItemArray[12] = Ext.DomQuery.selectNode("/city", nodes[i]).text;
                    ItemArray[13] = Ext.DomQuery.selectNode("/country", nodes[i]).text;
                    ItemArray[14] = Ext.DomQuery.selectNode("/security", nodes[i]).text;
                    ItemArray[15] = Ext.DomQuery.selectNode("/priority", nodes[i]).text;
                    ItemArray[16] = Ext.DomQuery.selectNode("/response", nodes[i]).text;
                    ItemArray[17] = Ext.DomQuery.selectNode("/ccode", nodes[i]).text;

                    var refobjectresultnodes = Ext.DomQuery.select("/RefObject", refobjectresult.documentElement);
                    var refobjectresulttext = '';
                    for (var j = 0; j < refobjectresultnodes.length; j++) {
                        refobjectresulttext += Ext.DomQuery.selectNode("/Title", refobjectresultnodes[j]).text + '(' + Ext.DomQuery.selectNode("/DMC", refobjectresultnodes[j]).text + ')<br/>';
                    }
                    ItemArray[18] = refobjectresulttext;

                    ItemArray[19] = Ext.DomQuery.selectNode("/ccontent", nodes[i]).text;

                    refcattachResult = Service.WebService.Post('GetRefcattachs', {
                        id: ItemArray[0]
                    });
                    var refcattachresultnodes = Ext.DomQuery.select("/Refcattach", refcattachResult.documentElement);
                    var refcattachresulttext = '';
                    for (var k = 0; k < refcattachresultnodes.length; k++) {
                        refcattachresulttext += '<a href="#" class="attachCls" attachID="';
                        refcattachresulttext += Ext.DomQuery.selectNode("/ID", refcattachresultnodes[k]).text;
                        refcattachresulttext += '">'
                        //		                refcattachresulttext+='<a href="javascript:void(OpenRefCattachFile2(';			        
                        //		                refcattachresulttext+=Ext.DomQuery.selectNode("/ID",refcattachresultnodes[k]).text;
                        //		                refcattachresulttext+='));">';
                        refcattachresulttext += Ext.DomQuery.selectNode("/FileName", refcattachresultnodes[k]).text;
                        refcattachresulttext += '</a><br/>';

                    }
                    ItemArray[20] = refcattachresulttext;

                    ItemArray[21] = Service.BasicDataService.GetBasicDataTextByValue(Service.CodeTalbeType.COMENTTYPE, ItemArray[6]);
                    ItemArray[22] = Service.BasicDataService.GetBasicDataTextByValue(Service.CodeTalbeType.SECURITY, ItemArray[14]);
                    ItemArray[23] = Service.BasicDataService.GetBasicDataTextByValue(Service.CodeTalbeType.PRIORITY, ItemArray[15]);
                    ItemArray[24] = Service.BasicDataService.GetBasicDataTextByValue(Service.CodeTalbeType.RESPONSETYPE, ItemArray[16]);

                    retArray[i] = ItemArray;
                }
            }
        }
        catch(e) {

        }
        return retArray;
    },

    /*
     *	通过请求文档构造CommentList
     *  @参数reponseResult 通过服务端获取的Comment对象文档 
     */
    BuidCommentListByReponseResult: function (reponseResult) {
        var myArray = new Array();
        var refobjectresult;
        var refcattachResult;

        try {
            if (reponseResult != null && reponseResult != undefined) {
                var nodes = Ext.DomQuery.select("/CommentElement", reponseResult.documentElement);

                for (var i = 0; i < nodes.length; i++) {
                    var ItemArray = new Array();
                    ItemArray[0] = Ext.DomQuery.selectNode("/ID", nodes[i]).text;
                    refobjectresult = Service.WebService.Post('GetRefObjects', {
                        id: ItemArray[0]
                    });

                    ItemArray[1] = Ext.DomQuery.selectNode("/parentID", nodes[i]).text;
                    ItemArray[2] = Ext.DomQuery.selectNode("/modelic", nodes[i]).text;
                    ItemArray[3] = Ext.DomQuery.selectNode("/sendid", nodes[i]).text;
                    ItemArray[4] = Ext.DomQuery.selectNode("/diyear", nodes[i]).text;
                    ItemArray[5] = Ext.DomQuery.selectNode("/seqnum", nodes[i]).text;
                    ItemArray[6] = Ext.DomQuery.selectNode("/ctype", nodes[i]).text;
                    ItemArray[7] = Ext.DomQuery.selectNode("/ctitle", nodes[i]).text;
                    ItemArray[8] = Ext.DomQuery.selectNode("/issdate", nodes[i]).text;
                    ItemArray[9] = Ext.DomQuery.selectNode("/language", nodes[i]).text;
                    ItemArray[10] = Ext.DomQuery.selectNode("/languageCountry", nodes[i]).text;
                    ItemArray[11] = Ext.DomQuery.selectNode("/entname", nodes[i]).text;
                    ItemArray[12] = Ext.DomQuery.selectNode("/city", nodes[i]).text;
                    ItemArray[13] = Ext.DomQuery.selectNode("/country", nodes[i]).text;
                    ItemArray[14] = Ext.DomQuery.selectNode("/security", nodes[i]).text;
                    ItemArray[15] = Ext.DomQuery.selectNode("/priority", nodes[i]).text;
                    ItemArray[16] = Ext.DomQuery.selectNode("/response", nodes[i]).text;
                    ItemArray[17] = Ext.DomQuery.selectNode("/ccode", nodes[i]).text;

                    var refobjectresultnodes = Ext.DomQuery.select("/RefObject", refobjectresult.documentElement);
                    var refobjectresulttext = '';
                    for (var j = 0; j < refobjectresultnodes.length; j++) {
                        refobjectresulttext += Ext.DomQuery.selectNode("/Title", refobjectresultnodes[j]).text + '(' + Ext.DomQuery.selectNode("/DMC", refobjectresultnodes[j]).text + ')<br/>';
                    }
                    ItemArray[18] = refobjectresulttext;

                    ItemArray[19] = Ext.DomQuery.selectNode("/ccontent", nodes[i]).text;

                    refcattachResult = Service.WebService.Post('GetRefcattachs', {
                        id: ItemArray[0]
                    });
                    var refcattachresultnodes = Ext.DomQuery.select("/Refcattach", refcattachResult.documentElement);
                    var refcattachresulttext = '';
                    for (var k = 0; k < refcattachresultnodes.length; k++) {
                        refcattachresulttext += '<a href="javascript:void(OpenRefCattachFile2(';
                        refcattachresulttext += Ext.DomQuery.selectNode("/ID", refcattachresultnodes[k]).text;
                        refcattachresulttext += '));">';
                        refcattachresulttext += Ext.DomQuery.selectNode("/FileName", refcattachresultnodes[k]).text;
                        refcattachresulttext += '</a><br/>';
                    }
                    ItemArray[20] = refcattachresulttext;

                    ItemArray[21] = Service.BasicDataService.GetBasicDataTextByValue(Service.CodeTalbeType.COMENTTYPE, ItemArray[6]);
                    ItemArray[22] = Service.BasicDataService.GetBasicDataTextByValue(Service.CodeTalbeType.SECURITY, ItemArray[14]);
                    ItemArray[23] = Service.BasicDataService.GetBasicDataTextByValue(Service.CodeTalbeType.PRIORITY, ItemArray[15]);
                    ItemArray[24] = Service.BasicDataService.GetBasicDataTextByValue(Service.CodeTalbeType.RESPONSETYPE, ItemArray[16]);

                    myArray[i] = ItemArray;
                }
            }

        }
        catch(e) {}
        finally {}
        return myArray;
    },

    /*
     *	根据CommentID获取对应的对象列表
     */
    GetRefObjectData: function (id) {
        var result;
        var myArray = new Array();
        try {
            result = Service.WebService.Post('GetRefObjects', {
                id: id
            });
        }
        catch(e) {
            return new Array();
        }
        if (result != null && result != undefined) {
            var nodes = Ext.DomQuery.select("/RefObject", result.documentElement);

            for (var i = 0; i < nodes.length; i++) {
                var ItemArray = new Array();
                ItemArray[0] = Ext.DomQuery.selectNode("/Title", nodes[i]).text;
                ItemArray[1] = Ext.DomQuery.selectNode("/DMC", nodes[i]).text;
                ItemArray[2] = Ext.DomQuery.selectNode("/Issno", nodes[i]).text;
                ItemArray[3] = Ext.DomQuery.selectNode("/Lang", nodes[i]).text;
                ItemArray[4] = Ext.DomQuery.selectNode("/ObjectType", nodes[i]).text;
                myArray[i] = ItemArray;
            }
        }
        return myArray;
    },

    /*
    *	获取默认的对象
    */
    GetDefaultRefObjData: function () {
        var objArray = new Array();
        var currentDMInfo = ApplicationContext.IMainFrame().GetMainTabDMinfo();
        if(currentDMInfo!=null&&currentDMInfo.Dmc!=null&&(currentDMInfo.ObjectType=='RefDM'||currentDMInfo.ObjectType=='PM'||currentDMInfo.ObjectType=='RefPM'))
        {
            var ItemArray=new Array();
            
            //处理bug2254 PM和RefPM获取的标题和DMC不正确 需要特殊处理
            if(currentDMInfo.ObjectType=='RefPM'||currentDMInfo.ObjectType=='PM')
            {
                ItemArray[0]=currentDMInfo.Title.substr(0,currentDMInfo.Title.length-2);
	            ItemArray[1]=currentDMInfo.Dmc.substr(0,currentDMInfo.Dmc.length-1);
	            ItemArray[2]=currentDMInfo.Issno+"-"+currentDMInfo.Issno_inwork;
	            ItemArray[3]=currentDMInfo.Language+"-"+currentDMInfo.Country;
	            if(currentDMInfo.ObjectType=='PM'||currentDMInfo.ObjectType=='RefPM')
	                ItemArray[4]="PM";
            }
            else
            {
                ItemArray[0]=currentDMInfo.Title;
	            ItemArray[1]=currentDMInfo.Dmc;
	            ItemArray[2]=currentDMInfo.Issno+"-"+currentDMInfo.Issno_inwork;
	            ItemArray[3]=currentDMInfo.Language+"-"+currentDMInfo.Country;
	            ItemArray[4]="DM";
            }
            objArray[0]=ItemArray;
        }
        
        return objArray;
    },

    /*
     *	根据CommentID获取附件列表
     */
    GetRefAttachData: function (id) {
        var result;
        var myArray = new Array();
        try {
            result = Service.WebService.Post('GetRefcattachs', {
                id: id
            });
        }
        catch(e) {
            return myArray;
        }
        finally {}
        if (result != null && result != undefined) {
            var nodes = Ext.DomQuery.select("/Refcattach", result.documentElement);

            for (var i = 0; i < nodes.length; i++) {
                var ItemArray = new Array();
                ItemArray[0] = Ext.DomQuery.selectNode("/FileName", nodes[i]).text;
                ItemArray[1] = Ext.DomQuery.selectNode("/Path", nodes[i]).text;
                myArray[i] = ItemArray;
            }
        }
        return myArray;
    },

    /*
     *	是否可进行答复
     *  @id 当前意见ID
     *  @type 答复类型 
     */
    IsCanAddReply: function (id, type) {
        var result;
        var resultValue = false;
        try {
            result = Service.WebService.Post('SearchReplayComment', {
                id: id,
                type: type
            });
        }
        catch(e) {
            return false;
        }
        finally {}

        if (result != null && result != undefined) {
            if (result.text == 'true') {
                resultValue = true;
            }
            if (result.text == 'false') {
                resultValue = false;
            }
        }
        return !resultValue;
    },

    /*
     *	通过CCODE判断系统中是否存在该意见或回复
     *  CCODE=MODELIC-DIYEAR-SEQNUM-CTYPE
     */
    IsExistComment: function (ccode) {
        try {
            var result;
            result = Service.WebService.Post('IsCommentExits', {
                commentCode: ccode
            });
            var isExits = result.text;
            if (isExits == 'true') {
                return true;
            }
            return false
        }
        catch(e) {}
    },

    /*
     *	删除附件(并且删除与该附件对应关系相关的数据)
     *  @fileList 需要删除的附件名称
     */
    DeleteAttachFiles: function (fileList) {
        for (i = 0; i < fileList.length; i++) {
            try {
                Service.WebService.Post('DeleteFile', {
                    path: fileList[i]
                });
            }
            catch(e) {}
            finally {}
        }
    },

    /*
     *	删除上传的附件
     * 参数:fileName 为上传到临时文件的文件名称
     */
    DeleteTempAttachFile: function (fileName) {
        var result;
        try {
            result = Service.WebService.Post('DeleteTempRefCattachFile', {
                fileName: fileName
            });
        }
        catch(e) {

        }
        finally {}

    },

    /*
     *	通过ID获取临时文件夹的附件
     * 参数:commentUUID  
     */
    GetFileListByCommentUUID: function (commentUUID) {
        var fileList = new Array();
        var result;
        try {
            result = Service.WebService.Post('GetRefcattachFilesResult', {
                CommentID: commentUUID
            });
        }
        catch(e) {}
        finally {}
        if (result != null && result != undefined) {
            var nodes = Ext.DomQuery.select("/string", result.documentElement);

            for (var i = 0; i < nodes.length; i++) {
                fileList[i] = nodes[i].text;
            }
        }
        return fileList;
    },

   /*
    *	通过附件ID获取附件名称
    */
    GetAttachFileNameByAttachID: function (attachID) {

        var retFilename = null,
        refcattachResult;
        try {
            refcattachResult = Service.WebService.Post('GetRefcattachsFileName', {
                id: attachID
            });
            if (refcattachResult != null && refcattachResult != undefined) {
                retFilename = refcattachResult.documentElement.text;
                retFilename = retFilename.substring(retFilename.lastIndexOf('\Comment\\'));
            }
        }
        catch(e) {}
        return retFilename;
    },

    /*
     *	获取当前DM的意见列表
     */
    GetCurrentDMCComments: function () {
        var currentDMInfo = ApplicationContext.IMainFrame().GetMainTabDMinfo();
        var commentList = new Array();
        if (currentDMInfo != null&&currentDMInfo.Dmc!=null) {
            var issno='';
            if(currentDMInfo.ObjectType=="RefDM"||currentDMInfo.ObjectType=="PM"||currentDMInfo.ObjectType=="RefPM")
                issno=currentDMInfo.Issno+"-"+currentDMInfo.Issno_inwork;
            var reponseResult = Service.WebService.Post('GetCommentElementsBydmc', {dmc:Comment.Biz.GetDMCByCodeString(currentDMInfo.Dmc),issno:issno});
            commentList = Comment.Biz.BuidCommentListByReponseResult(reponseResult);
        }
        return commentList;
    },
    
    /*
     *	获取所有打包历史记录
     */
    GetAllCommentHistoryData: function () {
        var myArray = new Array();
        var result;
        try {
            result = Service.WebService.Post('GetAllCommentOutputHistory', null);

            if (result != null && result != undefined) {
                var nodes = Ext.DomQuery.select("/CommnetDDNObject", result.documentElement);
                for (var i = 0; i < nodes.length; i++) {
                    var ItemArray = new Array();
                    ItemArray[0] = Ext.DomQuery.selectNode("/id", nodes[i]).text;

                    ItemArray[1] = Ext.DomQuery.selectNode("/modelic", nodes[i]).text + '-' + Ext.DomQuery.selectNode("/sendid", nodes[i]).text + '-' + Ext.DomQuery.selectNode("/recvid", nodes[i]).text + '-' + Ext.DomQuery.selectNode("/diyear", nodes[i]).text + '-' + Ext.DomQuery.selectNode("/seqnum", nodes[i]).text;

                    ItemArray[2] = Ext.DomQuery.selectNode("/dispfrom_country", nodes[i]).text + Ext.DomQuery.selectNode("/dispfrom_city", nodes[i]).text + Ext.DomQuery.selectNode("/dispfrom_entname", nodes[i]).text;

                    ItemArray[3] = Ext.DomQuery.selectNode("/dispto_country", nodes[i]).text + Ext.DomQuery.selectNode("/dispto_city", nodes[i]).text + Ext.DomQuery.selectNode("/dispto_entname", nodes[i]).text;

                    ItemArray[4] = Ext.DomQuery.selectNode("/authrtn", nodes[i]).text;
                    ItemArray[5] = Ext.DomQuery.selectNode("/outputtime", nodes[i]).text;
                    ItemArray[6] = Ext.DomQuery.selectNode("/path", nodes[i]).text;

                    myArray[i] = ItemArray;
                }
            }
        }
        catch(e) {}
        return myArray;
    },
    
     /*
     *	根据DMC去掉版本号和语言
     */
    GetDMCByCodeString: function (codeString) {
        if (codeString != null) {
            var index = codeString.indexOf("_");

            if (index > 0) {
                return codeString.substring(0, index);
            }
        }
        return codeString;
    },
    
      /*
     *	获取当前DM的型号
     */
    GetCurrentDMModelicStr: function () {
        var modid=''
        var currentDMInfo = ApplicationContext.IMainFrame().GetMainTabDMinfo();
        if (typeof currentDMInfo == 'undefined' || currentDMInfo.DmType == "DMlist")
        {
            return  TOC.modelicText;
        }
        if(currentDMInfo!=null&&currentDMInfo.Dmc!=null){
            if(currentDMInfo.Dmc.substr(0,4)=="DMC-")
            {
                 var dmcCode=currentDMInfo.Dmc.substr(4,currentDMInfo.Dmc.length-4);
                 modid=dmcCode.substring(0, dmcCode.indexOf('-')); 
            }
            else
            {
                 var dmcCode=currentDMInfo.Dmc.substr(4,currentDMInfo.Dmc.length-4);
                 dmcCode=dmcCode.substring(dmcCode.indexOf('-')+1);
                 dmcCode=dmcCode.substring(dmcCode.indexOf('-')+1);
                 modid=dmcCode.substring(0, dmcCode.indexOf('-')); 
            }
            
        }
        return modid;
    }
};

