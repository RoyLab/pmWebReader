/*
 *	代码表类型
 */
Service.CodeTalbeType = {
    COMENTTYPE: 'CommentType',
    SECURITY: 'SecurityType',
    PRIORITY: 'PriorityType',
    RESPONSETYPE: 'ResponseType'
};

 
 /**
 * @功能:基础数据管理类(代码表数据获取,翻译)
 * @作者: LuCan
 * @日期: 2010/01/08
 */
 
Service.BasicDataManager = function () {

    var mc_ctypeCodeTable = null; //意见类型代码表
    var mc_securityCodeTable = null; //密级代码表
    var mc_priorityCodeTable = null; //优先级代码表
    var mc_responseCodeTable = null; //回复类型代码表
    
    /*
     *	初始化意见类型代码表
     */
    this.InitCodeTable=function(type) {

        var retTable = this.GetCodeTableData(type);

        if (type == Service.CodeTalbeType.COMENTTYPE) {
            mc_ctypeCodeTable = retTable;
        }
        else if (type == Service.CodeTalbeType.PRIORITY) {
            mc_priorityCodeTable = retTable;
        }
        else if (type == Service.CodeTalbeType.RESPONSETYPE) {
            mc_responseCodeTable = retTable;
        }
        else if (type == Service.CodeTalbeType.SECURITY) {
            mc_securityCodeTable = retTable;
        }
    };
    

    /*
     *	根据值,和类型获取对应的代码中文对照值
     *  @type       代码表类型
     *  @value      代码值
     *  @return     返回中文对照值
     */
    this.GetBasicDataTextByValue = function (type, value) {
        if (type == Service.CodeTalbeType.COMENTTYPE) {
            if (mc_ctypeCodeTable == null) this.InitCodeTable(Service.CodeTalbeType.COMENTTYPE);
            for (var i = 0; i < mc_ctypeCodeTable.length; i++) {
                if (mc_ctypeCodeTable[i][0] == value) {
                    return mc_ctypeCodeTable[i][1];
                }
            }
        }
        if (type == Service.CodeTalbeType.SECURITY) {
            if (mc_securityCodeTable == null) {
                this.InitCodeTable(Service.CodeTalbeType.SECURITY);
            }
            for (var i = 0; i < mc_securityCodeTable.length; i++) {
                if (mc_securityCodeTable[i][0] == value) {
                    return mc_securityCodeTable[i][1];
                }
            }
        }
        if (type == Service.CodeTalbeType.PRIORITY) {
            if (mc_priorityCodeTable == null) {
                this.InitCodeTable(Service.CodeTalbeType.PRIORITY);
            }
            for (var i = 0; i < mc_priorityCodeTable.length; i++) {
                if (mc_priorityCodeTable[i][0] == value) {
                    return mc_priorityCodeTable[i][1];
                }
            }
        }
        if (type == Service.CodeTalbeType.RESPONSETYPE) {
            if (mc_responseCodeTable == null) {
                 this.InitCodeTable(Service.CodeTalbeType.RESPONSETYPE);
            }
            for (var i = 0; i < mc_responseCodeTable.length; i++) {
                if (mc_responseCodeTable[i][0] == value) {
                    return mc_responseCodeTable[i][1];
                }
            }
        }
        return value;
    };
    
    /*
     *	获取缓存的基础数据
     */
    this.GetBasicDataByCache=function (type) {
         if (type == Service.CodeTalbeType.COMENTTYPE) {
            if (mc_ctypeCodeTable == null) {
                this.InitCodeTable(Service.CodeTalbeType.COMENTTYPE);
            }
            return mc_ctypeCodeTable;
        }
        else if (type == Service.CodeTalbeType.SECURITY) {
            if (mc_securityCodeTable == null) {
                this.InitCodeTable(Service.CodeTalbeType.SECURITY);
            }
            return mc_securityCodeTable;
        }
        else if (type == Service.CodeTalbeType.PRIORITY) {
            if (mc_priorityCodeTable == null) {
                this.InitCodeTable(Service.CodeTalbeType.PRIORITY);
            }
            
            return mc_priorityCodeTable;
        }
        else if (type == Service.CodeTalbeType.RESPONSETYPE) {
            if (mc_responseCodeTable == null) {
                 this.InitCodeTable(Service.CodeTalbeType.RESPONSETYPE);
            }
            return mc_responseCodeTable;
        }
    };
    
    /*
     *	通过代码表类型获取代码表数据
     */
    this.GetCodeTableData=function(type) {
        var myArray = new Array();
        var result;
        try {
            result = Service.WebService.Post('GetBaseData', {
                type: type
            });
        }
        catch(e) {}
        if (result != null) {
            var nodes = Ext.DomQuery.select("/BaseData", result.documentElement);

            for (var i = 0; i < nodes.length; i++) {
                var ItemArray = new Array();
                ItemArray[0] = Ext.DomQuery.selectNode("/Value", nodes[i]).text;

                if (Ext.DomQuery.selectNode("/Text", nodes[i]) != null) {
                    ItemArray[1] = Ext.DomQuery.selectNode("/Text", nodes[i]).text;
                }
                if (Ext.DomQuery.selectNode("/Desc", nodes[i]) != null) {
                    ItemArray[2] = Ext.DomQuery.selectNode("/Desc", nodes[i]).text;
                }
                myArray[i] = ItemArray;
            }
        }
        return myArray;
    };
};

/*
 *	基础数据服务(单例)
 */
Service.BasicDataService=new Service.BasicDataManager();