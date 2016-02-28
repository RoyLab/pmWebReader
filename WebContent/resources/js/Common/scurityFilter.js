///////////////////////////////////////////////////////////////////////////////
//功能描述：密级过滤器
//作者：wanghai
//日期：2009-03-11 
///////////////////////////////////////////////////////////////////////////////

function ScurityPassword(dmc,callback,navigateType)
{
        Ext.QuickTips.init();
        InitializeScurityPassword();
        
        var result=false;
        var  password=new Ext.form.TextField( {
                            //xtype: 'textfield', 
                            //cls: 'password',
                            //name: 'password',
                            fieldLabel: '密码',
                            width: 180,
                            //value: '',
                            //blankText: '密码不允许为空',
                            inputType: 'password'
        });  
     
        var massege=new Ext.form.Label({ 
                            cls: 'massege',
                            id : 'massege',
                            style : '{color: #FF0000;}',
                            xtype: 'label', 
                            name: 'massege',
                            text: ''});
        var FormPanel=new Ext.form.FormPanel(
                {
                    bodyStyle: 'padding-top:20px; background:transparent;',
                    labelAlign: 'right',
                    labelWidth: 55,
                    labelPad: 0,
                    frame: false,
                    defaults: {
                    //anchor: '90%',
                    selectOnFocus: true,
                    invalidClass:null,
                    msgTarget: 'side'
                    },
                    items: 
                    [password,massege]
                }
            ); 
        var loginButton=new  Ext.Button({
                 text : '确定',
                 handler : function(){
                     if(FormPanel.getForm().isValid())
                        {
                        AsyncLogon();
                        }
                 }
        });    
       var CancelButton=new  Ext.Button({
                 text : '取消',
                 handler : function(){
                  //前进后退有密码本的时候处理
                  if(navigateType!=undefined&&navigateType=="Back")
                    ViewHistory.ViewHistoryService.Next();
                  else if (navigateType!=undefined&&navigateType=="Next") {
                    ViewHistory.ViewHistoryService.Back();
                  }
                  ScurityPasswordWindow.close();
                 }
        });   
       var  ScurityPasswordWindow =new  Ext.Window({
            title: '验证密码',
            width: 280,
             height: 150,
             modal: true,
            collapsible: false,
            closable: false,
            resizable: false,
            defaults: { border: false },
            layout:'fit',
            buttonAlign: 'center',
            iconCls: 'iconUsers',
            items:FormPanel,
            buttons : [loginButton,CancelButton],
            keys : [{
                 key : Ext.EventObject.ENTER,
                 fn :  AsyncLogon, 
                 scope : this
            }],
            listeners:
            {
                show : function(){password.focus(true,true);}
            }
        });

        //wuqifeng auto set the positon of the loginWindow-------------------------------
        window.onresize = function() {
            try{
                    if (ScurityPasswordWindow != null && typeof ScurityPasswordWindow != 'undefined')
                    {
                        if(!ScurityPasswordWindow.hidden && !ScurityPasswordWindow.disabled)
                            ScurityPasswordWindow.center();
                    }
               }
            catch(e){}
        };   
        //-------------------------------------------------------------------------------
    //loginButton.on('click',Logon);
    //userId.focus('');

    ScurityPasswordWindow.show();
    
    function AsyncLogon(){
        var passwd=password.getValue();
        var srcPass = null;
        try
        {
            srcPass = top.Scurity.Password[0].password;
        }
        catch(e){
            srcPass = null;
        }
        
        if (srcPass != null && srcPass == passwd) 
        {
            ScurityPasswordWindow.close();
            callback();
        }
        else 
        {
            massege.setText("密码错误！");
        }
      };
        
        
     function InitializeScurityPassword()
     {
        if(top.Scurity.Password == null || typeof top.Scurity.Password == 'string')
        {
            top.Scurity.Password =  window.Service.WebService.PostJSonObject('GetSecurityPassword',{content:top.Scurity.Password});
        }
     };
    
     return result;


   

};//end ScurityPasswordWindow