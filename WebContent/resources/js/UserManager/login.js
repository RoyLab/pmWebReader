/************************************************************************
*功能描述：登录管理类
*作者：wanghai
*日期：2008-11-24      
*修改：
*2009-12-29   hyb  重构Login文件
************************************************************************/

//定义名称空间
Service.RegNameSpace('window.UserManager');


InitLoginPageScript();


/**
 * purpose:初始化脚本文件
 */
function InitLoginPageScript() 
{
    Ext.QuickTips.init();
    
    Ext.onReady
    (
        OnLoginScriptFileLoaded
    );
};


/**
 * purpose:脚本文件加载完成处理方法
 */
function OnLoginScriptFileLoaded() 
{         
                                    
        var  loginWindow = new UserManager.LoginWindow({LogonHandler : Logon,ManagerLogonHandler : ManagerLogon});
        
        loginWindow.show();
        
        HookPageEvent();
       
        setTimeout
        (
            function()
            {
                Ext.get('loading-mask').fadeOut
                (
                    { remove: true }
                );
            }, 
            300
        ); 

        isPMA = document.location.search.indexOf('pma');
        //接受形为?pma=admin&admin#
        if(isPMA!=-1)
        {            
            UserManager.Cookies.SetPMA('true');
            
            loginWindow.hide();
            var parameter = document.location.search.substring(5);
            var pair=parameter.split('&');
            loginWindow.txtUserID.setValue(pair[0]);
            loginWindow.txtPassword.setValue(pair[1]);
            loginWindow.m_LogonHandler();
            
        }
        
        
        /**
         * purpose:挂接页面全局事件
         */
        function HookPageEvent() 
        {
            window.onresize = WindowResizeHandler;
            
            document.body.onkeydown = BodyKeyDownHandler;
            
            /**
             * purpose:处理按键事件
             */
            function BodyKeyDownHandler()
            {
                if(event.keyCode==13)
                {
                   Logon();
                }
            }
            
            /**
             * purpose: 处理页面缩放事件
             */
            function WindowResizeHandler()
            {
                if (loginWindow != null && typeof loginWindow != 'undefined')
                    loginWindow.center();
            }
        }
        
         /**
         * purpose:登录
         */
        function ManagerLogon()
        {
            
            loginWindow.AddLoginButtonClass("x-btn-click");
                
            var result;
            
            var uId = loginWindow.GetUserID();
            var passwd = loginWindow.GetPassword();
            
            Service.WebService.Call('UserLogon',
                                    {userid: uId, userpass:passwd},
                                    function(result)
                                    {ManagerLogonCallback2(result);},
                                    function(XmlHttpRequest,textStatus,errorThrow)
                                    { 
                                        ManagerLogonCallback2(textStatus);
                                        alert(XmlHttpRequest.responseText);
                                        Service.ShowMessageBox('错误', XmlHttpRequest.responseText, Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                                    });
                                    
                                    
            
//            if(uId!="admin")
//            {
//                loginWindow.SetPromtMessage("请用管理员身份登录！");
//                return;
//            }
            
            
            
            loginWindow.FocusLoginButton();
            
//            Service.WebService.Call('ManagerUserLogon',
//                                    {userid: uId, userpass:passwd},
//                                    function(result){ManagerLogonCallback(result);},
//                                    function(XmlHttpRequest,textStatus,errorThrow)
//                                    { 
//                                        ManagerLogonCallback(textStatus);
//                                        alert(XmlHttpRequest.responseText);
//                                        Service.ShowMessageBox('错误', XmlHttpRequest.responseText, Ext.MessageBox.OK, Ext.MessageBox.ERROR);
//                                    });
           
        };
        
        

        /**
         * purpose:登录回调
         */
        function ManagerLogonCallback(result)
        {
            if(result.text=='')
            {
                loginWindow.SetPromtMessage("用户名或密码错误，登录失败！");
            }
            else
            {
                if(result.text.indexOf('{Authorization')!=-1)
                {
                      eval("au="+result.text);
                      if(au!=undefined && au.Authorization!=undefined)
                      {
                          Service.ShowMessageBox('错误', au.Authorization, Ext.MessageBox.OK, Ext.MessageBox.ERROR,WindowClose);
                      }
                }
                else
                {
                      //SetModelCookie(); 
                      loginWindow.SetPromtMessage("正在登录.....");
                      GoManagerPage(result.text);
                }
            }
       };
       
       /**
         * purpose:登录回调
         * 由于要放开除admin以外的管理员用户可以登录，登录时初始化一个userinfo来判断是否管理员
         */
        function ManagerLogonCallback2(result)
        {
            if(result.text=='')
            {
                loginWindow.SetPromtMessage("用户名或密码错误，登录失败！");
                return;
            }
            else
            {
                if(result.text.indexOf('{Authorization')!=-1)
                {
                      eval("au="+result.text);
                      if(au!=undefined && au.Authorization!=undefined)
                      {
                          Service.ShowMessageBox('错误', au.Authorization, Ext.MessageBox.OK, Ext.MessageBox.ERROR,WindowClose);
                      }
                }
                UserManager.Cookies.SetCookiesName(result.text);
                UserInfo = new UserManager.UserInfo(); 
                if (!UserInfo.UserIsHaveRight(1))
                {
                   UserManager.Cookies.SetCookiesName('');
                   loginWindow.SetPromtMessage("请用管理员身份登录！");
                   return; 
                }
                else
                {
                    UserManager.Cookies.SetCookiesName('');
                    loginWindow.SetPromtMessage("正在登录.....");
                    GoManagerPage(result.text);
                }
            }
        }
       
       function GoManagerPage(name)
       {      
              var hostname=window.location.hostname;
              var host=window.location.host;
              var protocol=window.location.protocol;
              var port=window.location.port;
              var pathname= window.location.pathname;
              var url="";
              var userName=encodeURIComponent();
              if(port=="" ||port=="80")
              {
                //url=protocol+"//"+host+"/IbvManagement/Default.html?name="+name;
                url=protocol+"//"+hostname+":"+port+ pathname.replace("/login.html","Management/Default.html");

              }
              else{
                      if(hostname=="localhost" || hostname=="127.0.0.1")
                        {
                            //url="http://localhost:2576/IbvManagement/Default.html";
                            port=parseInt(port)+1;
                            url=protocol+"//"+hostname+":"+port+ pathname.replace("login.html","Default.html");
                        }
                        else{
                            //url=protocol+"//"+host+"/IbvManagement/Default.html?name="+name;
                            url=protocol+"//"+hostname+":"+port+ pathname.replace("/login.html","Management/Default.html");

                        }
                }
              window.location.href = url;
       }
       
        

        
        /**
         * purpose:登录
         */
        function Logon()
        {
            loginWindow.AddLoginButtonClass("x-btn-click",1);
            
            var result;
            
            var uId = loginWindow.GetUserID();
            var passwd = loginWindow.GetPassword();
            loginWindow.FocusLoginButton(1);
            
            Service.WebService.Call('login',
                                    {userid: uId, userpass:passwd},
                                    function(result){LogonCallback(result);},
                                    function(XmlHttpRequest,textStatus,errorThrow)
                                    { 
                                        LogonCallback(textStatus);
                                        alert(XmlHttpRequest.responseText);
                                        Service.ShowMessageBox('错误', XmlHttpRequest.responseText, Ext.MessageBox.OK, Ext.MessageBox.ERROR);
                                    });
        };

        /**
         * purpose:登录回调
         */
        function LogonCallback(result)
        {
            //result.text = "admin&admin&99&管理员&;1,2,3&D:~test&1&false&true&1&true&true&true&true&true&true&true&true";
            if(result=='wrong pwd')
            {
                loginWindow.SetPromtMessage("密码错误，登录失败！");
                
                if(UserManager.Cookies.GetPMA()=='true')
                {
                    for(i=0;i<loginWindow.buttons.length;i++)
                    {
                        if(loginWindow.buttons[i].id=="ManagerLoginButton")
                        {
                            loginWindow.buttons[i].hide();
                            break;
                        }
                    }
                    loginWindow.show();
                    alert('使用默认的用户名密码登录失败，请输入登录名密码');
                }
            } else if (result=='invalid user')
            {
            	loginWindow.SetPromtMessage("用户名不存在！");
            }
            else
            {
                if(result.indexOf('{Authorization')!=-1)
                {
                      eval("au="+result.text);
                      if(au!=undefined && au.Authorization!=undefined)
                      {
                          Service.ShowMessageBox('错误', au.Authorization, Ext.MessageBox.OK, Ext.MessageBox.ERROR,WindowClose);
                      }
                }
                else
                {
                      UserManager.Cookies.SetCookiesName(result);
                      SetModelCookie(); 
                      
                      loginWindow.SetPromtMessage("正在登录.....");
                      GoMainPage();
                }
            }
       };
       
       /**
        * purpose:重新定位到登录页面
        */  
       function  WindowClose()
       {
            UserManager.Cookies.SetCookiesName('');
            window.location.href = 'login.html';
       };
                    
       /**
        * purpose:打开阅读器主页面
        */
       function GoMainPage()
       {
            if(UserManager.Cookies.GetPMA()=='true')
            {
                 window.location.href='index.html?manual=' + Applic.Text;
                 
            }
            else
            {
                blogged=window.open('index.html?manual=' + Applic.Text,'_blank','top=0,left=0,scrolbars=no,toolbar=no,lacation=no,status=no,menubar=no,resizable=yes',false);
                if(blogged)
                {
                    blogged.resizeTo(window.screen.availWidth,window.screen.availHeight);
                    window.open('','_parent','');
                    window.opener=null;
                    window.close();
                }
                else
                {
                    location='index.html';
                }
            }
       };
                 
        /**
         * purpose:设置型号的适用性环境变量字符串
         */
       function SetModelCookie()
       {
             var ss;
             var applicValue = loginWindow.GetApplicValue();

             if(typeof applicValue =="undefined" || applicValue==null || applicValue == '')
             {
                ss = 'model:all';
             }
             else
             {
                ss='model:'+ applicValue;
             }
             

             UserManager.Cookies.SetApplicName(ss);
      };
};

/**
 * purpose:登录窗体
 * @class Ext.Window
 */
UserManager.LoginWindow = Ext.extend(Ext.Window, 
{ 
    //初始化窗体属性
    width: 280,
    height: 180,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: { border: false },
    layout:'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',
    listeners:
    {
        show : function(){this.txtUserID.focus(true,true);}
    },
    
    txtUserID : null,
    txtPassword :null,
    cbApplic : null,
    lblMessage : null,
    frmFormPanel : null,
    
    m_LogonHandler : null,
    
     m_ManagerLogonHandler : null,
    
    constructor : function (config) 
    {
        if( config != undefined && config != null )
        {    
            this.m_LogonHandler = config.LogonHandler;
            this.m_ManagerLogonHandler = config.ManagerLogonHandler;
        }
                
        UserManager.LoginWindow.superclass.constructor.apply(this, arguments);
    },
    
    //定义窗体方法
    initComponent : function ()
    {
        this.setTitle( '打开'+Applic.Text);
        
        var sm = new Ext.grid.CheckboxSelectionModel
            ({
                 listeners:
                 {
                     rowSelect:function(sm,rowIndex,keep,rec)
                     {   
                     },
                     selectionchange :function(sm)
                     {  
                     }
                 }
            });
    
        var Reader = new Ext.data.ArrayReader
            ({},[
                  {name: 'MedelName', type: 'string'},
                  {name: 'MedelScript', type: 'string'}
            ]);
                
        var datastore=new Ext.data.Store
            ({
                   reader: Reader,
                   data: Applic.Model
             }); 
                
        var grid = new Ext.grid.GridPanel
            ({
                   stripeRows: true,
                   region      : 'east',
                   collapsible : true,
                   margins     : '3 0 3 3',
                   cmargins    : '3 3 3 3',
                   width:200,
                   title:'型号',
                   sm:sm,
                   store: datastore,
                   cm: new Ext.grid.ColumnModel
                   ([
                       sm,
                       {header: "型号名称", width: 75, sortable: true, renderer: 'MedelName', dataIndex: 'MedelName'},
                       {header: "型号描述", width: 75, sortable: true, renderer: 'MedelScript', dataIndex: 'MedelScript'}
                   ])  
           });

                
       var userId=new Ext.form.TextField
           ({
                   fieldLabel: '帐号',
                   width: 180,
                   allowBlank: false,
                   blankText: '帐号不允许为空'
            });
        
      this.txtUserID = userId;
        
      var  password=new Ext.form.TextField
           ({
                   fieldLabel: '密码',
                   width: 180,
                   inputType: 'password'
           });  
           
      this.txtPassword = password;
        
      var applicData=new Array();
      applicData.push(["","所有"]);
      var i=Applic.Model.length;
      if(i!=0)
      for(var j=0;j<i;j++)
      {
          var item= Applic.Model[j];
          applicData.push(item);
      }
      
      var applic=new Ext.ux.MultiComBox
          ({
                   fieldLabel: '型号',
                   emptyText: '所有',
                   width: 180,
                   mode: 'local',
                   displayField: 'ModelText',
                   valueField: 'Modelvalue',
                   readOnly: true,
                   triggerAction: 'all',
                   store: new Ext.data.SimpleStore                            
                   ({
                       fields: ['Modelvalue','ModelText'],
                       data: applicData
                   })
           });   
                    
      this.cbApplic = applic;
      
      var ApplicText='';
      Service.WebService.Call('GetDefaultApplic',
                                    {},
                                    function(result){ApplicText = result.text;},
                                    function()
                                    {}); 
                                    
      if(ApplicText != undefined)
      {
        var index = ApplicText.split(",");
        var values=new Array();
        for(i=0;i<index.length;i++)
        {
            if(applicData[index[i]]!=undefined)
            {
                values.push(applicData[index[i]][0]);
            }
        }
        this.cbApplic.setValue(values.sort().join(','));
      }
        
      var massage=new Ext.form.Label
          ({ 
                   cls: 'massege',
                   id : 'massege',
                   style : '{color: #FF0000;}',
                   xtype: 'label', 
                   name: 'massege',
                   text: ''
          });
        
      this.lblMessage = massage;
                            
      var formPanel=new Ext.form.FormPanel
          ({
                   bodyStyle: 'padding-top:20px; background:transparent;',
                   labelAlign: 'right',
                   labelWidth: 55,
                   labelPad: 0,
                   frame: false,
                   defaults: 
                   {
                       selectOnFocus: true,
                       invalidClass:null,
                       msgTarget: 'side'
                   },
                   items: 
                   [userId,password,applic,massage]
           }); 
                 
      this.frmFormPanel = formPanel;
      
      var ManagerLoginButton=new Ext.Button
          ({
                    id:"ManagerLoginButton",
                   text : '系统管理登录',
                   handler : this.ManagerLogin,
                   scope : this
          });       
      var loginButton=new Ext.Button
          ({
                   text : '登录',
                   handler : this.Login,
                   scope : this
          });    
            
      var cancelButton=new  Ext.Button({
                         text : '重置',
                         handler : function(){
                             userId.setValue('');
                             password.setValue('');
                             applic.setValue('');
                             massage.setText('');
                         }
                });   
           
           //添加窗体控件     
       this.add(formPanel);
//       this.addButton(ManagerLoginButton);
      
       this.addButton(loginButton);
       this.addButton(cancelButton);
    },
     
    /**
     * purpose:登录处理事件
     */
    OnLogon : function () 
    {
        if( this.m_LogonHandler != undefined  )
        {
            this.m_LogonHandler(); 
        }
    },
    
      /**
     * purpose:登录处理事件
     */
    OnManagerLogon : function () 
    {
        if( this.m_ManagerLogonHandler != undefined  )
        {
            this.m_ManagerLogonHandler(); 
        }
    },
    
    /**
     * purpose:登录
     */
    Login : function (button)
    {
         if(this.frmFormPanel.getForm().isValid())
         {
             this.OnLogon();
         }
    },
    
       ManagerLogin : function (button)
    {
         if(this.frmFormPanel.getForm().isValid())
         {
             this.OnManagerLogon();
         }
    },
    
    
    /**
     * purpose:添加登录按钮样式
     * @cls {String} name1
     */
    AddLoginButtonClass : function(cls,index)
    {
        if(index==null)
            index=0;
            
        var element = this.buttons[index].getEl();
        
        element.addClass(cls);
    },
    
    /**
     * purpose:获取用户ID
     */
    GetUserID : function () 
    {
        return this.txtUserID.getValue();
    },
    
    /**
     * purpose: 获取用户密码
     */
    GetPassword : function ()
    {
        return this.txtPassword.getValue();
    },
    
    /**
     * purpose:设置
     */
    FocusLoginButton : function (index)
    {
        if(index==null)
            index=0;
        this.buttons[index].focus();
    },
    
    /**
     * purpose:获取适用性信息
     */
    GetApplicValue : function ()
    {        
        return this.cbApplic.getValue();
    },
    
    /**
     * purpose:设置提示信息
     * @msg {String} 设置用户提示信息
     */
    SetPromtMessage : function (msg)
    {
        return this.lblMessage.setText(msg);
    }

});
    
