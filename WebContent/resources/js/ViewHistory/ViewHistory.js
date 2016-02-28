    Service.RegNameSpace('window.ViewHistory');

    /*
     *	访问历史记录管理
     */
ViewHistory.ViewHistoryManager = function (viewer) {

    /*
     *	最大历史记录数
     */
    var maxViewHistoryCount = 50;

    var vHistoryArray = new Array();
    
     /*
     *	是否是前进或者后退
     */
    this.backorforward = false;
    /*
     *	历史记录总数量
     */
    var totalCount = 0;

    /*
     *	当前历史记录位置
     */
    var currentIndex = -1;

    /*
     *	添加一个访问记录
     */
    this.Add = function (histroyEntry) {
        var newArray = new Array();
        var count = 1;
        totalCount = vHistoryArray.length
        newArray[0] = histroyEntry;
        
        //处理后退过程,重新增加一条历史记录
        if(currentIndex>0)
        {
            newArray[1]=vHistoryArray[currentIndex];
            count=2;
            for(var i=currentIndex-1;i>=0;i--)
            {
                if (vHistoryArray[i].EntryID != histroyEntry.EntryID)
                {
                     newArray[count]=vHistoryArray[i];
                     count++;
                }
            }
        }

        var index=0;
        if(count>=2)
            index=currentIndex+1;
        else
            index=0;
            
        //如果存在则移除历史，并把该记录移到第一的位置
        for (; index < totalCount; index++) {
            if (vHistoryArray[index].EntryID != histroyEntry.EntryID) {
                newArray[count] = vHistoryArray[index];
                count++;
                //超过最大记录数 不再需要之前的历史了
                if (count > maxViewHistoryCount - 1) break;
            }
        }
        
        vHistoryArray = newArray;
        currentIndex = 0;
    };

    /* 
     *	移除一个访问记录
     */
    this.Remove = function (historyEntry) {
        var newArray = new Array();
        var count = 0;

        //如果存在则移除历史，并把该记录移到第一的位置
        for (var i = 0; i < totalCount; i++) {
            if (vHistoryArray[i].EntryID != histroyEntry.EntryID) {
                newArray[count] = vHistoryArray[i];
                count++;
            }
        }

        vHistoryArray = newArray;
        currentIndex = vHistoryArray.length - 1;
        totalCount = vHistoryArray.length
    };

    /*
     *	清除所有访问记录
     */
    this.Clear = function () {
        vHistoryArray = new Array();
        currentIndex = -1;
        totalCount = 0;
    };

    /*
     *	后退
     *  @return 返回后退后需要导航的entry对象
     */
    this.Next = function () {
        
        if(!this.IsCanNext())
        {
            return null;
        }
        currentIndex=currentIndex-1;
        var nextEntry=vHistoryArray[currentIndex];
        return nextEntry;
    };

    /*
     *	前进
     */
    this.Back = function () {
    
        if(!this.IsCanBack())
        {
            return null;
        }
        currentIndex=currentIndex+1;
        var previousEntry=vHistoryArray[currentIndex];
        return previousEntry;
    };
    
    /*
     *	当前
     */
    this.Current = function () {
        var previousEntry;
        if(this.backorforward)
            previousEntry=vHistoryArray[currentIndex];
        else
            previousEntry=new ViewHistory.HistoryEntry();
            
        return previousEntry;
    };


    /*
     *	是否可前进
     */
    this.IsCanNext = function () {
        if (currentIndex <=0) {
            return false;
        }
        else{
            return true;
        }
    };

    /*
     *	是否可后退
     */
    this.IsCanBack = function () {
        if (currentIndex >= vHistoryArray.length - 1) {
            return false;
        }
        else {
            return true;
        }
    };
     /*
     *	还原历史
     */
     this.RevertHistory=function(ietm)
     {
           var historyEntry=vHistoryArray[currentIndex];
            switch(historyEntry.DialogType) {
            case ViewHistory.DLGTYPE.MetaData:
                ietm.AssistantInfo.ShowMetaData();
            	break;
            case ViewHistory.DLGTYPE.PMRefed:
                ietm.AssistantInfo.ShowPMRefedList();
            	break;
            case ViewHistory.DLGTYPE.DMRefed:
            	 ietm.AssistantInfo.ShowDMRefedList();
            	break;
            case ViewHistory.DLGTYPE.Safety:
                  ietm.AssistantInfo.ShowSafety();
            	break;
            	 case ViewHistory.DLGTYPE.Prelreqs:
            	 ietm.AssistantInfo.ShowPrelreqs();
            	break;
            case ViewHistory.DLGTYPE.Proced:
                 ietm.Proced.CurrentStep= historyEntry.CurrentStep-1;
                 ietm.Proced.StepmodalFormShow=false;
                 ietm.Proced.ToggleStepForm();
            	break;
            }
            
            if(ietm!=undefined &&ietm.Reference!=undefined)
                ietm.Reference.ColorLink(historyEntry.CheckedLinks);
            
             this.backorforward=false;
     };
};

ViewHistory.DLGTYPE ={
        NONE:-1,
        MetaData:0,
        PMRefed:1,
        DMRefed:2,
        Safety:3,
        Prelreqs:4,
        Proced:5
    };


   /*
    *	历史记录条目
    */
ViewHistory.HistoryEntry = function () {

    
    /*
     *	唯一标识ID
     */
    this.EntryID = null;

    /*
     *	链接目的
     */
    this.Href = null;

    /*
     *	标题
     */
    this.Title = null;
    
    /*
     *	标题
     */
    this.TreeType = null;

    /*
     *	ietm对象列表，该对象记忆了当前的状态
     */
    this.DialogType=ViewHistory.DLGTYPE.NONE;
    
     /*
     *	ietm对象列表，该对象记忆了当前的状态
     */
    this.CurrentStep=-1;
     /*
     *	记忆点击的链接状态
     */
    this.CheckedLinks={"InsideXrefs":[],"OutsideXrefs":[],"OutsideXreftps":[]};
};

ViewHistory.HistoryEntry.prototype.AddInsideXrefLink=function(linkindex)
{
   this.CheckedLinks.InsideXrefs.push(linkindex);
};

ViewHistory.HistoryEntry.prototype.AddOutsideXrefLink=function(linkindex)
{
   this.CheckedLinks.OutsideXrefs.push(linkindex);
};

ViewHistory.HistoryEntry.prototype.AddOutsideXreftpLink=function(linkindex)
{
   this.CheckedLinks.OutsideXreftps.push(linkindex);
};

ViewHistory.ViewHistoryService=new ViewHistory.ViewHistoryManager(); 