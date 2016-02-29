
/*
 * 加命名空间
 */
Service.RegNameSpace('window.MainFrame');


 var RCMMutliTab;//RCM接口使用
Ext.onReady
(
    function() {
            if(!Authentication())
                return;

            Ext.BLANK_IMAGE_URL = 'resources/images/s.gif';
            Ext.useShims=true;
            Ext.QuickTips.init();
            var Viewer=new MainFrame.Viewer();
            Viewer.doLayout();

            setTimeout(
                function() {
                    Ext.get('loading').remove();
                    Ext.get('loading-mask').fadeOut({ remove: true });
                },
                0);


                 //初始化加载首页，找了很久没有找到合适的事件来初始化加载，暂时放在这里。
               var fullSearch=Viewer.MutliTab.items.items[1];
               fullSearch.setSrc("about:blank");
               
               if(!ApplicationContext.UserInfo.RcmUser)
               {
                    Viewer.mainFrameHandler.MainToolbarHandler.MainToolbar_Click({id:"m_btnHomepage"});
               }
                 //如果是RCM接口隐藏部分模块
               else
               {
                    // Viewer.MutliTab.remove(fullSearch);
                    var dmc=ApplicationContext.IUserInfo().dmc;
                    Viewer.MutliTab.loadMainHTMLTab(dmc,"Manual/"+dmc+".HTM");
                    RCMMutliTab=Viewer.MutliTab;
               }

                 Service.ForbidOperation(document);

                document.body.onkeydown =function()
                {
                    if(event.keyCode==116)
                    {
                       event.keyCode=0;
                       event.cancelBubble=true;
                       event.returnValue=false;
                    }
                };
                /*--拦截主页面关闭事件--*/
               window.onbeforeunload=OnBeforeUnLoad;
       }
);

    //是不是经过认证的用户，转移到登录的界面。
    function Authentication()
    {
                var UserId=ApplicationContext.UserInfo.UserId;
                if(!ApplicationContext.UserInfo.RcmUser&&window.location.href.indexOf('index.html?manual=')==-1)
                {
                      window.location.href = 'login.html';
                      return false;
                }
                if (UserId.length == 0) {
                      window.location.href = 'login.html';
                      return false;
                }

                //设置用户在线
                if(UserId!='admin')
                {
                      try {
                        $.ajaxSetup({ async: false });
                        result = Service.WebService.Post('SaveUserState', { userid: UserId});
                        }
                        catch (e) {
                        }
                        finally {
                            $.ajaxSetup({ async: true });
                        }
                }
                return true;
    };

    function OnBeforeUnLoad() {

//                    if(MainFrame.GetContentDocument()!=undefined && MainFrame.GetContentDocument().body!=undefined)
//                    {
//                        MainFrame.GetContentDocument().body.onunload=function () {
//                        }
//                    }
            //有用户登录信息，才需要提示。比如在注销时，也是先清除用户信息，才离开页面。
            var userInfo= UserManager.Cookies.GetCookieName();
            if(userInfo!=undefined && userInfo!='')
            {
                window.event.returnValue="离开将退出系统。";
            }
                if(!ApplicationContext.UserInfo.RcmUser)
                {
                        //如果备注修改过,需要提示用户是否保存备注
                        var remarkEditor;
                        if(window.ApplicationContext.MainFrame.GetReMarkEditor)
                        {
                            remarkEditor=window.ApplicationContext.MainFrame.GetReMarkEditor();
                            if(remarkEditor.RemarkHandler.IsEditorHasChanged && remarkEditor.RemarkHandler.IsEditorHasChanged())
                            {
                                 if (confirm("备注已经更改，是否保存？")) {
                                    remarkEditor.RemarkHandler.SaveRemark();
                                 }
                            }
                        }

                        //设置离线状态 （注销和关闭）-------------------
                        var ui=ApplicationContext.UserInfo.UserId;
                        try {
                            $.ajaxSetup({ async: false });
                            result = Service.WebService.Post('SetUserOnline', { userid: ui});
                        }
                        catch (e) {
                        }
                        finally {
                            $.ajaxSetup({ async: true });
                        }
                //-----------------------------------------------
                }
                var R=Ext.lib.Event;
                R.doRemove(window, "unload", R._unload);
                delete Ext.ux.ManagedIFrame.Manager;
                Ext.destroy();
}


function showDmc(dmc) {
         if(RCMMutliTab!=undefined && RCMMutliTab!=null)
         {
               RCMMutliTab.loadMainHTMLTab(dmc,"Manual/"+dmc+".HTM");
         }
};
