///////////////////////////////////////////////////////////////////////////////
//功能描述：定义West区域的备注栏事件处理类
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
 
         /**
         * 目的：创建north区域的备注栏事件处理类。
         */
        MainFrame.NavigationTreeHandler =function (sender) {
            var viewer = sender;    
            //点击树上节点
            
            this.TreeTab_Changed=function (tab) {
                    var DMinfo=ApplicationContext.IMainFrame().GetActiveTabDMinfo();
                    var codeString;
                    if(DMinfo!=undefined && DMinfo!=null)
                    {
                         codeString=DMinfo.Dmc;
                         if(codeString!=null&&codeString!=undefined)
                            viewer.LocateTreeNode(codeString);
                         else
                            viewer.LocateTreeNode('');
                    }

            };
            
            this.DirectoryTree_Click=function (node, e) {
                var DMinfo=ApplicationContext.IMainFrame().GetActiveTabDMinfo();
                var IETM=ApplicationContext.IMainFrame().GetActiveTabIETM();
                    if(DMinfo!=undefined && DMinfo.DmType=='afi')
                        return;
                    else
                    if(node.parentNode.id!="root" && IETM!=null)
                       IETM.Reference.InsideXref('#'+node.id,'');
            };
        }
        
         