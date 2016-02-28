///////////////////////////////////////////////////////////////////////////////
//功能描述：锁定网页
//作者：wanghai
//日期：2009-2-12
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间
 */
 Service.RegNameSpace('window.System');
 
 
 /**
 * 目的：锁定页面。
 */
System.LockPage = function() {
      var theResponse=false;
      var i=0;
      //加入覆盖层
      top.document.frames.lockframe.document.write("<div id='TB_overlay' style='z-index: 9999;width:100%;height:100%;background: #DFE8F6;border:1px #800080 solid'></div>");
      top.document.frames.lockframe.document.close();
      var framestyle=top.document.all.lockframe.style;
      framestyle.left=0;
      framestyle.top=0;
      framestyle.display='block';

     while(!theResponse)
     {
         theResponse=unlock(theResponse,i);
         i++;
         if(i>10||theResponse==2)
         {
             theResponse=false;
             break;
         }
         else if(theResponse==3)
         {
             theResponse=true;
             break;
         }
     }
        
    if(theResponse==true)
         framestyle.display='none';
    else
    {
         var Mask = new Ext.LoadMask(Ext.getBody(),{msg:"正在关闭页面..."});
         Mask.show();
         setTimeout(close, 5000);
    } 
    
    function close() {
        window.open('','_parent','');
        window.close();
    }   
        
     /**
     * 目的：解锁页面。
     */
    function unlock(atheResponse,i)
    {
        if(i!=0)
            alert('页面锁定！按确定解锁');
        try{
            atheResponse = window.showModalDialog("lock.html", i,"dialogHeight:170px; dialogWidth:250px;help:no;resizable:no;status:no");
        }
        catch(e)
        {
            bConfirmed = window.confirm('网页被阻止，不能正常使用锁定功能，是否关闭网页？');
            if(bConfirmed)
            {
                return 2;
            }
            else{
                return 3;
            }
            
        }
        return atheResponse;
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
}; 




