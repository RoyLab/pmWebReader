///////////////////////////////////////////////////////////////////////////////
//功能描述：过滤功能：适用性（2），密级（1），用户权限数据（0），密码本,
//作者：王海
//日期：2010-1-9
//说明：deny,适用性过滤2，密级过滤1，用户权限数据过滤0，不过滤-1，密码本-2
///////////////////////////////////////////////////////////////////////////////
//
//定义命名空间
//
(function() {
    if (!window.Service)
         window.Service = {};
})();


Service.FilterService = function(userInfo){
    this.hashTable;
    this.m_UserInfo=userInfo;
    //初始化参数
    this.FilterAllDMC();
}

/*
 *	过滤类型
 */
Service.FilterService.prototype.FilterType = {
    APPLIC: '2',
    SECURITY: '1',
    USERDATA: '0',
    ONFILTER: '-1',
    PASSWORD:'-2'
};

//返回deny,适用性过滤2，密级过滤1，用户权限数据0，不过滤-1，密码本-2
 Service.FilterService.prototype.IsFilterDMC= function(codeString)
{
    if (codeString == null || typeof codeString == 'undefined' || codeString == '')
        return -1;
    codeString=codeString.toLowerCase();
    var deny=-1;
    try {
        if (Doc != null) {

                    var dmcNode =  this.hashTable.Items(codeString);
                    if( typeof dmcNode !=  'undefined' )
                    {
                        deny = dmcNode.attributes[1].value;
                    }
            }
    }
    catch (e) { }

    switch(deny)
    {
        case this.FilterType.APPLIC:
        case this.FilterType.SECURITY:
        case this.FilterType.USERDATA:
               return true;
        case this.FilterType.PASSWORD:
        default:
               return false;
    }
};

 Service.FilterService.prototype.FilterDMC= function(codeString,callback,navigateType)
{
    if (codeString == null || typeof codeString == 'undefined' || codeString == '')
        return -1;

    codeString=codeString.toLowerCase();
    var index=codeString.indexOf('#');
    if(index!=-1)
        codeString=codeString.substring(0,index);

    var deny=-1;
    var result=false;

    try {
        if (Doc != null) {

                    var dmcNode =  this.hashTable.Items(codeString);
                    if( typeof dmcNode !=  'undefined' )
                    {
                        deny = dmcNode.attributes[1].value;
                    }
            }
    }
    catch (e) { }

    switch(deny)
    {
        case this.FilterType.APPLIC:
        {
                alert("不符合适用性！");
                return true;
        }
        case this.FilterType.SECURITY:
        {
              alert("密级不够高！");
              return true;
        }
        case this.FilterType.USERDATA:
        {
             alert("没有数据权限！");
             return true;
        }
        case this.FilterType.PASSWORD:
        {
             ScurityPassword(codeString,callback,navigateType);
             return false;
        }
        default:
             callback();

    }

};

//
Service.FilterService.prototype.IsFilterDMC= function(codeString)
{
    if (codeString == null || typeof codeString == 'undefined' || codeString == '')
        return -1;
    codeString=codeString.toLowerCase();
    var index = codeString.indexOf('#');
    if (index != -1) codeString = codeString.substring(0, index);

    var deny=-1;
    try {
        if (Doc != null) {

                    var dmcNode =  this.hashTable.Items(codeString);
                    if( typeof dmcNode !=  'undefined' )
                    {
                        deny = dmcNode.attributes[1].value;
                    }
            }
    }
    catch (e) { }

    switch(deny)
    {
        case this.FilterType.APPLIC:
        case this.FilterType.SECURITY:
        case this.FilterType.USERDATA:
               return true;
        case this.FilterType.PASSWORD:
        default:
               return false;
    }
};

Service.FilterService.prototype.GetFilterDMinfo = function() {

      // try {
      //               var ID=this.m_UserInfo.ID;
      //               $.ajaxSetup({ async: false });
      //               result =Service.WebService.Post('GetFilterAllDMC',{userName:ID});
      //               if(result!=null)
      //               {
      //                   Doc=result;
      //                   var xpath = "//dmc";
      //                   dmcNodes = Doc.selectNodes(xpath);
      //                   this.hashTable = new Service.HashTable();
      //                    for(var i=0;i<dmcNodes.length;i++)
      //                    {
      //                        var dmcNode = dmcNodes[i];
      //                        this.hashTable.Add(dmcNode.attributes[0].value,dmcNode);
      //                    }
      //               }
      //       else {
      //           Service.ShowMessageBox('错误', '没有得到正确的结果！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
      //       }
      //   }
      //   catch (e) {
      //        Service.ShowMessageBox('错误', '调用服务器发生错误！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
      //   }
      //   finally {
      //
      //   }


    };

Service.FilterService.prototype.FilterAllDMC=function(){
        var WebServiceConnectState;
        var result;
        var version = TOC.Version['Version'];
        var applicContext = '';
        if (this.m_UserInfo.ApplicContext().length != 0)
            applicContext = this.m_UserInfo.ApplicContext();
        var securityClass=this.m_UserInfo.UserScurity;
        var userData=this.m_UserInfo.GetUserDMindex();
        var userName=this.m_UserInfo.UserId;
        var ID=this.m_UserInfo.ID;

         if(this.m_UserInfo.UserId=='admin')
        {
          userData="all";
        }

        try {
            $.ajaxSetup({ async: false });
            var webMethod ='FilterAllDMC';
            result = Service.WebService.Post(webMethod, { version: version, applicContext: applicContext, securityClass:securityClass,userData:userData,userName:ID});
            this.GetFilterDMinfo();
        }
        catch (e) {
             Service.ShowMessageBox('错误', '调用服务器发生错误！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        finally {

        }

};



Service.FilterService.prototype.FilterApplic= function(applic) {
        var WebServiceConnectState;
        var result;
        var version = TOC.Version['Version'];
        var applicContext = '';
        if (this.m_UserInfo.ApplicContext().length != 0)
            applicContext = this.m_UserInfo.ApplicContext();

        if (applicContext.length == 0 || applicContext == "model:all") {
            return true;
        }

        try {
            $.ajaxSetup({ async: false });
            result = Service.WebService.Post('Evaluate', { version: version, applicContext: applicContext, applic: applic });
             if (result.text.indexOf('false') != -1) {
                    return false;
                }
                else if (result.text.indexOf('true') != -1) {
                    return true;
                }
                else {
                    Service.ShowMessageBox('错误', '没有得到正确的结果！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                }
        }
        catch (e) {
           Service.ShowMessageBox('错误', '调用服务器发生错误！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        finally {

        }
    };
