/************************************************************************
*功能描述：锁定网页
*作者：wanghai
*日期：2009-2-12     
*修改：
*2010-01-19   hyb  重构lockwebpage.js文件
************************************************************************/

Service.RegNameSpace("window.System");

Ext.onReady(function(){

  HookWindowEvent();
  
  InitialzeLockViewPageScript(); 
});

/**
 * purpose:挂接窗体事件
 */
function HookWindowEvent() 
{
    //
}

function InitialzeLockViewPageScript()
{
     Ext.QuickTips.init();
    
     var lockViewport = new System.LockViewport({UnlockHanlder : Unlock,
                                                UserID : ApplicationContext.IUserInfo().UserId}
                                       );
        
     lockViewport.doLayout();
    
     /**
      * purpose:解锁
      */
     function Unlock(){
            
            var uId= lockViewport.GetUserID();
            var passwd=lockViewport.GetPassword();
            
            Service.WebService.Call('UserLock',{userid: uId, userpass:passwd},
                                     function(result){callback(result);},
                                     null
                     );
        };

     function callback(result){
        if (result.text=='false') {
            Service.ShowMessageBox('警告', '密码错误，解除锁定失败！', Ext.MessageBox.OK, Ext.MessageBox.WARNING,null);
        }
        else {
            window.returnValue=true;
            window.open('','_parent','');
            window.opener=null;
            window.close();
        }
     };
};

/**
 * purpose:锁住页面
 */
System.LockViewport = Ext.extend(Ext.Viewport,
{
    id: 'fullViewPort',
    layout: 'border',
    
    txtPassword : null,   
    txtUserID : null,
    
    m_UserID : null,
    
    /**
     * 解锁处理方法
     * @type Function
     */
    m_UnlockHanlder : null,
    
    constructor : function (config) 
    {
        if (config != undefined && config != null) {
            this.m_UnlockHanlder = config.UnlockHanlder;
            this.m_UserID = config.UserID;
        }
        
        System.LockViewport.superclass.constructor.apply(this, arguments);
    },
    
    initComponent : function () 
    {
         System.LockViewport.superclass.initComponent.call(this);
         
         var userId=new Ext.form.TextField( {
                            fieldLabel: '帐号',
                            name: 'userName',
                            readOnly:true,
                            value : this.m_UserID
         });
         this.txtUserID = userId;
         
         var  password=new Ext.form.TextField( {
                            fieldLabel: '登录密码',
                            inputType: 'password'
         });  
         this.txtPassword = password;
        
         var massege=new Ext.form.Label({ 
                            cls: 'massege',
                            id : 'massege',
                            style : '{color: #FF0000;}',
                            xtype: 'label', 
                            name: 'massege',
                            text: ''
                            });
            
        var simple = new Ext.FormPanel({
            region: 'center',
            labelWidth: 80,
            labelAlign: 'right',
            frame:false,
            border: false,
            title: '',
            bodyStyle:'padding-top:20px; background: #DFE8F6;',
            width:350,
            higth:350,
            buttonAlign: 'center',
            defaultType: 'textfield',

            items: [userId,password],
               buttons: [{
                name:'unLock',
                text: '解锁',
                scope : this,
                handler:function(){
                    this.Unlock();
                }
            }],
            keys : [{
                     key : Ext.EventObject.ENTER,
                     fn :  this.Unlock, 
                     scope : this
                }]

        });
        
        pnlContent = new Ext.Panel({
                    region: 'center',
                    id: 'm_pnlContent',
                    closable: false,
                    layout: 'border',
                    iconCls: 'iconManual',
                    items: [simple]
          });
          
        this.add(pnlContent);
    },
    
    /**
     * purpose:获取密码框输入
     * @class 
     * @constructor
     * @Return {String} 密码
     */
    GetPassword : function () 
    {
        return this.txtPassword.getValue();
    },
    
    /**
     * purpose:获取用户名称
     * @class 
     * @constructor
     * @Return {String} 密码
     */
    GetUserID : function () 
    {
        return this.txtUserID.getValue();
    },

    /**
     * purpose:新增用户
     * @class UserManagerPanel
     */
    Unlock: function () {
        if (!Service.IsFunction(this.m_UnlockHanlder)) return;

        this.m_UnlockHanlder();
    }
});
