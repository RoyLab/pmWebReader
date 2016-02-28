///////////////////////////////////////////////////////////////////////////////
//功能描述：定义North区域的工具或菜单栏事件处理类
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
 
         /**
         * 目的：创建North区域的备注栏事件处理类。
         */
        MainFrame.ToolbarHandler =function (sender) {
            this.m_sender = sender;
        };
         /**
         * 目的：响应工具或菜单栏事件的方法。
         */       
         MainFrame.ToolbarHandler.prototype={  
                Homepage_click : function(button,e){//回主页
                    if(1)
                    {
                      aa=1;
                    }
                },
                HistoryBack_click : function(button,e){//上一页
                
                }
         };
            
 
        