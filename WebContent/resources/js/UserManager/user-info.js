/************************************************************************
*功能描述：用户信息
*作者：wanghai
*日期：2009-03-12      
*修改：
*2010-01-12   hyb  重构(待续)
************************************************************************/

//定义名称空间
Service.RegNameSpace('window.UserManager');

/**
 * purpose:Cookie管理
 * @class 
 * @constructor
 * @param {type} name1
 */
UserManager.CookiesManager = function () {
  
    var CookieName='CookiePath';
    var CookieApplicName='CookieApplicPath';
    var CookieLock='CookieLock';
    var CookiePMA='PMA';
    
    /**
     * 设置Cookies
     */
    function  Set(name, value){
         var argv = arguments;
         var argc = arguments.length;
         var expires = (argc > 2) ? argv[2] : null;
         var path = (argc > 3) ? argv[3] : '/';
         var domain = (argc > 4) ? argv[4] : null;
         var secure = (argc > 5) ? argv[5] : false;
         document.cookie = name + "=" + escape (value) +
           ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
           ((path == null) ? "" : ("; path=" + path)) +
           ((domain == null) ? "" : ("; domain=" + domain)) +
           ((secure == true) ? "; secure" : "");
    };
    
    /**
     * 读取Cookies
     */
    function  Get(name)
    {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        var j = 0;
        while(i < clen){
            j = i + alen;
            if (document.cookie.substring(i, j) == arg)
                return GetCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if(i == 0)
                break;
        }
        return null;
    };
    
    /**
     * 清除Cookies
     */
    this.Clear = function(name) {
      if(Get(name)){
        var expdate = new Date(); 
        expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
        Set(name, "", expdate); 
      }
    };

    function GetCookieVal (offset){
       var endstr = document.cookie.indexOf(";", offset);
       if(endstr == -1){
           endstr = document.cookie.length;
       }
       return unescape(document.cookie.substring(offset, endstr));
    };
    
    /**
     * purpose:设置Cookies名称
     * @class 
     * @constructor
     * @param {type} name1
     */
    this.SetCookiesName = function(name)
    {
        Set(CookieName,name);
    };
    
    this.GetCookieName = function()
    {
        return Get(CookieName);
    };
    
    this.SetApplicName = function(applicName)
    {
        Set(CookieApplicName,applicName);
    };
    
    this.GetApplicName = function()
    {
        return Get(CookieApplicName);
    };
    
    this.SetLock = function(lock)
    {
        Set(CookieLock,lock);
    };
    
    this.GetLock = function()
    {
        return Get(CookieLock);
    };
    
    this.SetPMA = function(pmaValue)
    {
        return Set(CookiePMA, pmaValue);
    };
    
    this.GetPMA = function()
    {
        return Get(CookiePMA);
    };
};

UserManager.Cookies = new UserManager.CookiesManager();


/**
 * purpose:
 * @class 
 * @constructor
 * @param {type} name1
 */
UserManager.UserInfo = function ()
{
      this.UserId='';
      this.UserName='';
      this.UserRole='';
      this.UserScurity='';
      this.UserRightId='';
      this.UserDMindex='';
      this.ID='';
      this.ApplicContext='';   //"Model:m1,m2,m3;Vesion:v1,v2,v3"
      this.path='';//物理路径，用于单机版图片的保存
      this.lock=0;
      this.GraphicType=0;
      this.PDFPrintVisable=false;
      this.Treeline=true;
      this.ToolBar=true;
      this.NavigationTree=true;
      this.Bookmark=true;
      this.VisitedHistory=true;
      this.Search=true;
      this.ShowDmc=true;
      
      this.RcmUser=false;
      this.PMAUser=false;
	  this.FullShow='0';
      
      this.GraphicAutoShow;

      this.TreeAutoLocate=true;
      
      
      ///**************************Begin ICNConfig**************************///
      this.m_mviewer=null;
      this.m_ICNTrueViewFileDic=null;
      this.m_ICNLocalViewDic=null;
      
      //获取icn文件的预览控件类型。
      this.GetICNViewType =function(ext)
      {
        this.InitICNConfig();
        //保证不区分大小写
        ext=ext.toLowerCase();
        return this.m_mviewer[ext];//为空返回的是undefined
      };
      
      //获取预览图片时使用的真实文件。
      this.GetICNTrueViewFile =function(src)
      {
        try
        {
            if(src==undefined || src.length<=0)
                return src;
            
            this.InitICNConfig();
            
            var extpos = src.lastIndexOf('.') + 1;
            var ext = src.substr(extpos).toLowerCase();
            
            //保证不区分大小写
            ext=ext.toLowerCase();
            var viewext=this.m_ICNTrueViewFileDic[ext];
            if(viewext==undefined)
                return src;
            if(viewext=="tif")
            {
                src = src.substr(0, extpos) + 'tif';
            }
         }catch(e)
         {}
         return src;
      };
      //获取icn文件是否需要作为本地文件预览（必须为单机版）。
      this.GetICNLocalizeUrl =function(fullsrc)
      {
        this.InitICNConfig();
        
        var extpos = fullsrc.lastIndexOf('.') + 1;
        //保证不区分大小写
        var ext = fullsrc.substr(extpos).toLowerCase();
        var ret=this.m_ICNLocalViewDic[ext];//为空返回的是undefined
        if(ret!="true")
            return fullsrc
        
        fullsrc=top.ApplicationContext.ICommonService().LocalizeUrl(document.URL,fullsrc);
        return fullsrc;
      };
      
      this.InitICNConfig=function()
      {
        if(this.m_mviewer==null || this.m_mviewer==undefined ||
            this.m_ICNTrueViewFileDic==null || this.m_ICNTrueViewFileDic==undefined ||
            this.m_ICNLocalViewDic==null || this.m_ICNLocalViewDic==undefined)
        {
            this.m_mviewer=new Array();
            this.m_ICNTrueViewFileDic=new Array();
            this.m_ICNLocalViewDic=new Array();
            GetICNViewTypeCallback(this.m_mviewer,this.m_ICNTrueViewFileDic,this.m_ICNLocalViewDic);
        }
      }

      function GetICNViewTypeCallback(mviewer,icnTrueViewFileDic,icnLocalViewDic)
      {
//        var mviewer = new Array();
        
        var doc;
        try
        {
            if(window.ActiveXObject)
            {
    //            doc = new ActiveXObject("MSXML2.DOMDocument");
                doc = new ActiveXObject("Microsoft.XMLDOM");
            }
            else if(document.implementation && document.implementation.createDocument)
            {
                doc=document.implementation.createDocument("","",null);
            }
            else
            {
                alert("浏览器不支持XML Document!");
            }
            if(doc!=null && doc!=undefined)
            {
                doc.async = "false";
    //            doc.loadXML(result.text);
                doc.load("ICNConfig.xml");
            }
        }
        catch(e)
        {
            alert("读取配置失败："+e);
            //创建doc失败，xml片段错误或者ie版本不对。
            return mviewer;
        }
        if(doc==null || doc==undefined)
            return mviewer;
    
        var nodes = Ext.DomQuery.select("/root/icnview/item", doc);
        if (nodes.length <= 0) return mviewer;

        for (var i = 0; i < nodes.length; i++) 
        {
            var ext=undefined;
            var view=undefined;
            var viewext=undefined;
            var localview=undefined;
            try {
                if(nodes[i].attributes.getNamedItem("ext")!=null)
                    ext = nodes[i].attributes.getNamedItem("ext").text;
                if(nodes[i].attributes.getNamedItem("view")!=null)
                    view = nodes[i].attributes.getNamedItem("view").text;
                if(nodes[i].attributes.getNamedItem("viewext")!=null)
                    viewext = nodes[i].attributes.getNamedItem("viewext").text;
                if(nodes[i].attributes.getNamedItem("localview")!=null)
                    localview = nodes[i].attributes.getNamedItem("localview").text;
            }
            catch(e) {
                continue;
            }
            if(ext==undefined)
                continue;
            if(view!=undefined)
            {
                //保证不区分大小写
                mviewer[ext.toLowerCase()] =view.toLowerCase();
                
                if(viewext!=undefined)
                {
                    icnTrueViewFileDic[ext.toLowerCase()] =viewext.toLowerCase();
                }
            }
            if(localview!=undefined)
            {
                if(localview.toLowerCase()=="true")
                {
                    icnLocalViewDic[ext.toLowerCase()]="true";
                }
            }
        }
//        return mviewer;
      }
      ///**************************End ICNConfig**************************///
      
      
      ///**************************Begin ICNExtension**************************///
      //ICN文件依赖哪些文件。
      this.m_ICNViewDependFilesDic=null;
      
//      //获取icn依赖的文件。
//      this.GetICNDependFiles =function(ext)
//      {
//        this.InitICNConfig();
//        //保证不区分大小写
//        ext=ext.toLowerCase();
//        return this.m_mviewer[ext];//为空返回的是undefined
//      };
      
      //获取icn依赖的文件。
      this.GetICNViewDependFiles =function(src)
      {
        try
        {
            if(src==undefined || src.length<=0)
                return undefined;
            
            this.InitICNViewDependFiles();
            
            var extpos = src.lastIndexOf('.');            
            var icn = src.substr(0, extpos).toLowerCase();
            
            //保证不区分大小写
            icn=icn.toLowerCase();
            var dependsArray=this.m_ICNViewDependFilesDic[icn];
            if(dependsArray==undefined)
                return undefined;
            return dependsArray;
         }catch(e)
         {}
         return undefined;
      };
      this.InitICNViewDependFiles=function()
      {
        if(this.m_ICNViewDependFilesDic==null || this.m_ICNViewDependFilesDic==undefined)
        {
            this.m_ICNViewDependFilesDic=new Array();
            GetICNViewDependFilesCallback(this.m_ICNViewDependFilesDic);
        }
      }

      function GetICNViewDependFilesCallback(icnViewDependFilesDic)
      {
        var configFile="manual/ICNExtension.xml";
        if(!top.ApplicationContext.ICommonService().UrlExists(configFile))
            return;
        var doc;
        try
        {
            if(window.ActiveXObject)
            {
    //            doc = new ActiveXObject("MSXML2.DOMDocument");
                doc = new ActiveXObject("Microsoft.XMLDOM");
            }
            else if(document.implementation && document.implementation.createDocument)
            {
                doc=document.implementation.createDocument("","",null);
            }
            else
            {
                alert("浏览器不支持XML Document!");
            }
            if(doc!=null && doc!=undefined)
            {            
                doc.async = "false";
    //            doc.loadXML(result.text);
                doc.load(configFile);
            }
        }
        catch(e)
        {
            alert("读取配置失败："+e);
            //创建doc失败，xml片段错误或者ie版本不对。
            return;
        }
        if(doc==null || doc==undefined)
            return;
    
        var nodes = Ext.DomQuery.select("/icnextension/viewdepends/item", doc);
        if (nodes.length <= 0) return;

        for (var i = 0; i < nodes.length; i++) 
        {
            var node = nodes[i];
            var icn=undefined;
            if(node.attributes.getNamedItem("icn")!=null)
                icn = node.attributes.getNamedItem("icn").text;
            if(icn==undefined)
                continue;
                
            var dependsNodes = Ext.DomQuery.select("depends/item", node);
            if (dependsNodes.length <= 0)
                continue;
        
            var dependsArray = new Array();
            for (var y = 0; y < dependsNodes.length; y++) 
            {
                var file=undefined;
                var dependNode=dependsNodes[y];
                try {
                    if(dependNode.attributes.getNamedItem("file")!=null)
                        file = dependNode.attributes.getNamedItem("file").text;
                }
                catch(e) {
                    continue;
                }
                if(file==undefined)
                    continue;
                dependsArray.push(file);
            }
            
            //保证不区分大小写
            icnViewDependFilesDic[icn.toLowerCase()]=dependsArray;
        }
      }
      ///**************************End ICNExtension**************************///
      
      Initialize.call(this);

      this.IsSupperUser = function ()
      {
           return this.UserIsHaveRight(1);
      }
      
      /**
       * purpose:是否是管理员用户
       * @class User-info
       */
      this.IsAdministrator = function () 
      {
            return UserManager.IsAdministrator(this.UserId);
      }
      
      /**
       * purpose:判断用户是否具有某个功能权限
       * @right {Integer} 权限ID
       *1是管理员
       *2是非管理员
       */
      this.UserIsHaveRight =function(right)
      {
            var index=this.UserRightId.indexOf(';');
            var temp=this.UserRightId.substring(0,index);
            var rights =temp.split(',');
            for(var i=0;i<rights.length;i++)
            {
                if(rights[i]==right)
                  return true;
            }
            
            temp=this.UserRightId.substring(index+1);
            rights =temp.split(',');
            for(var i=0;i<rights.length;i++)
            {
                if(rights[i]==right)
                  return true;
            }
            
            return false;
      };
      
      /**
       * purpose:获取用户数据权限
       * @class 
       * @constructor
       * @Return {String}
       */
      this.GetUserDMindex=function()
      {
           if(this.UserDMindex == '')
              this.UserDMindex = GetUserDataRight(this.UserId);
         
           return this.UserDMindex;
      };
      
      /**
       * purpose:判断用户是否拥有指定的DMID权限
       * @class 
       * @constructor
       * @Return {Boolean} 
       */
      this.UserIsDM =function(id)
      {
           if(this.UserDMindex=='')
             this.UserDMindex=GetUserDataRight();
             
            if(this.UserId=='admin'&& this.UserDMindex==';')
            {
                return true;
            }
            var index=this.UserDMindex.indexOf(';');
            var temp=this.UserDMindex.substring(0,index);
            var DMlist =temp.split(',');
            for(var i=0;i<DMlist.length;i++)
            {
                if(DMlist[i]==id)
                  return true;
            }
            
            temp=this.UserDMindex.substring(index+1);
            DMlist =temp.split(',');
            for(var i=0;i<DMlist.length;i++)
            {
                   
                if(DMlist[i]==id)
                  return true;
            }
            
            return false;
      };
      
      /**
       * purpose:初始化用户
       */
      function Initialize()
      {
          this.dmc = GetParameterValue("dmc");
          this.fcode = GetParameterValue("fcode");
          this.FullShow  = GetParameterValue("fullshow");

          pma=UserManager.Cookies.GetPMA();
          if(pma!=undefined && pma=='true')
          {
                this.PMAUser=true;
          }

          var userInfo;
          if( this.dmc!='')
          {
                this.RcmUser=true;
                this.UserId="admin";
                this.UserDMindex=';'
                this.UserScurity=100;
                this.ApplicContext=function()
                                {return 'model:all';};
                this.GraphicType=0;
          }
          else{
                  userInfo= UserManager.Cookies.GetCookieName();
                  if(userInfo!=undefined &&userInfo!='')
                  {
                      var users=userInfo.split("&");
                      this.UserId=users[0];
                      this.UserName=users[1];
                      this.UserScurity=users[2];
                      this.UserRole=users[3];
                      this.UserRightId=users[4];
                      
                      this.path=function getpath()
                      {
                         var rg=new RegExp("~","g");
                        return users[5].replace(rg,"\\");
                      };
                      
                      this.ID=users[0];
                      if(users[7]=="true")
                        this.GraphicAutoShow=true;
                      else
                        this.GraphicAutoShow=false;
                        
                      if(users[8]=="true")
                        this.TreeAutoLocate=true;
                      else
                        this.TreeAutoLocate=false;
                        
                      this.GraphicType=users[9];
					   
					  if(users[10]=="" || users[10].toLowerCase() == "true")
                        this.PDFPrintVisable=true;
                      else
                        this.PDFPrintVisable=false;
                      
                      if(users[11]=="false")
                        this.Treeline=false;
                        
                      if(users[12]=="false")
                        this.ToolBar=false;
                        
                      if(users[13]=="false")
                        this.NavigationTree=false;
                      
                      if(users[14]=="false")
                        this.Bookmark=false;
                        
                      if(users[15]=="false")
                        this.VisitedHistory=false;
                        
                      if(users[16]=="false")
                        this.Search=false;
                        
                      if(users[17]=="false")
                        this.ShowDmc=false;

                      this.ApplicContext=function()
                            {
                                  var applic=UserManager.Cookies.GetApplicName();
                                  if(applic==undefined)
                                   return '';
                                    
                                  if(applic=='model:all')
                                  {
                                    return applic;
                                  }
                                  
                                  if(Applic.Product!=undefined)
                                  {
                                    for(var i=0;i<Applic.Product.length;i++)
                                    {
                                        applic+=";";
                                        for(var j=0;j<Applic.Product[i].length;j++)
                                        {
                                            applic+=Applic.Product[i][j];
                                            applic+=",";
                                        }
                                    }
                                  }
                                  else{
                                    applic+=";";
                                  }
                                  return applic;
                              
                            };
                            
                       this.lock=UserManager.Cookies.GetLock();
               }

          };
          
      };
      
      /**
       * purpose:获取用户数据权限
       *         
       * @UserId {String} 用户ID
       * @Return {String} 数据权限
       *                  数据权限分为用户权限和角色权限，以[;]分开；
       *                  用户权限和角色权限内部使用[,]区分多个DMC。
       *                  
       */
       function GetUserDataRight(UserId) {
       
            var result = false;
            
            Service.WebService.Call('GetUserDMindex',{ userid: UserId},
                function (xmlResult) {
                        if (xmlResult != null && typeof xmlResult != 'undefined') 
                        {
                                result = xmlResult.text;
                        }
                    }
                );
          
            return result;
        };
        
      /**
       * purpose:根据参数名称获取参数值
       *         参数集合存储结构:?parameter1=value1&parameter2=value2&.....
       * @class 
       * @constructor
       * @parameterName {String} 参数名称
       */
      function GetParameterValue(parameterName)
      {
           return UserManager.GetKeyValue(document.location.search,'&','=',parameterName);
      }
};



