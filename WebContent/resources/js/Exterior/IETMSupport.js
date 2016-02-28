///////////////////////////////////////////////////////////////////////////////
//功能描述：外部接口。
//作者：
//日期：2011-6-15
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.MainFrame');
 
/**
 * purpose:打开指定DMC
 */
function OpenDMC(dmc) 
{
    try
    {
//        window.ApplicationContext.MainFrame.LoadMainHTMLTab(dmc,"Manual/"+dmc+".HTM","","");
        top.ApplicationContext.MainFrame.m_Wiever.MutliTab.loadMainHTMLTab(dmc,"Manual/"+dmc+".HTM");
    }catch(e){
        return e.message;
    }
};

/**
 * purpose:获取当前打开的DMC
 */
function GetActiveDMC() 
{
    try
    {
        //获得当前激活页签中的DM信息。
        var dminfo;
        var tab=top.ApplicationContext.MainFrame.m_Wiever.MutliTab.activeTab;
        if(tab.IETM!= undefined)
            dminfo=tab.IETM.Common.DMinfo;
        if(dminfo!=undefined)
        {
            return dminfo.Dmc;
//            var dmc = dminfo.Dmc;
//            //非DMC不返回。
//            if(dmc!=undefined)
//            {
//                if(dmc.indexOf("DMC")==0)
//                    return dmc;
//            }
        }
    }catch(e){
        return "error:"+e.message;
    }
};