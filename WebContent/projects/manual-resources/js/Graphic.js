/// <reference path="../../test/js/jQuery.intellisense.js" />
/// <reference path="jquery.js" />

/*
 * 加命名空间IETM
 */
(function () {
    if (!window.IETM) window.IETM = {};
})();

IETM.Graphic={
     /*
     *	页面中的图片的集合
     */
     Images : null,
      /*
     *	当前多煤体窗体中正在显示的图的序号
     */
     currentGraphic:0,
     /*
     *	上一个显示的图的序号
     */     
     lastcurrentGraphic:-1,    
      /*
     *	但弹出窗口时，保存当前页面中的图片的序号。
     */     
     tempCurrentGraphic:-1,   
     templastcurrentGraphic:-1,       
     Init:function (imgs) {
            if(imgs==undefined)
                this.Images=$(".figure_min");
            else
                this.Images=imgs;
                
            if(IETM.Common.MainFrame != undefined && IETM.Common.MainFrame != null && this.Images.length<=0)
            {
                IETM.Common.MainFrame.SetMultimediaVieSwerCollapsed(true);
                IETM.Common.MainFrame.SetMultimediaViewerDisabled(true);
                return;
            }
            /*
             *	为每个图绑定事件
             */ 
            var images=this.Images;
            images.each(function(index)
            {
                images.eq(index).bind("click","",function()
                {
                    IETM.Graphic.ShowImage(this,this.name==""?0:1);
                });
            });
            /*
             *	为图片加入浮动层
             */ 
            this.ShowFlowImage();
            /*
             *	加载当前图片
             */ 
             if(this.currentGraphic==-1)
                this.currentGraphic=0;
                
            var image=this.Images[this.currentGraphic];
            if(image!=undefined&&image!=null)
            {
                 /*
                 *	如果是自动加载图片，则展开多媒体
                 */ 
               if(IETM.Common.UserInfo != undefined && IETM.Common.UserInfo != null && IETM.Common.UserInfo.GraphicAutoShow)
               {
                   IETM.Common.MainFrame.SetMultimediaVieSwerCollapsed(false);
                   this.GraphicCurrent();
               }
               else{
                   IETM.Common.MainFrame.SetMultimediaVieSwerCollapsed(true);
               }
            }
     },
     ReInit:function (imgs) {
             if(imgs==undefined)
                this.Images=$(".figure_min");
            else
                this.Images=imgs;
                
            if(IETM.Common.MainFrame != undefined && IETM.Common.MainFrame != null && this.Images.length<=0)
            {
                IETM.Common.MainFrame.SetMultimediaVieSwerCollapsed(true);
                IETM.Common.MainFrame.SetMultimediaViewerDisabled(true);
                return;
            }
            
             /*
             *	为每个图绑定事件
             */ 
            var images=this.Images;
            images.each(function(index)
            {
                images.eq(index).bind("click","",function()
                {
                    IETM.Graphic.ShowImage(this,this.name==""?0:1);
                });
            });
            
              /*
             *	为图片加入浮动层
             */ 
            this.ShowFlowImage();
            
            /*
             *	加载当前图片
             */ 
             if(this.currentGraphic==-1)
                this.currentGraphic=0;
                
            var image=this.Images[this.currentGraphic];
            if(image!=undefined&&image!=null)
            {
                image.style.borderColor ="#99CCFF";
                image.style.borderStyle ="solid";
                if(!IETM.Common.MainFrame.GetMultimediaViewerCollapsed())
                {
                    this.GraphicCurrent();
                }
            }
      },
    
     /*
     *	加载图片,同时要传递热点。
     */ 
     ShowImage :function (obj,type,arr,isIpd) {
         if(IETM.Common.MainFrame==undefined || IETM.Common.MainFrame == null)
            return;
            
        var eventList={'loadedImage': function(){
        }};
        if(typeof this.Images === "undefined")
        return;

        
        this.lastcurrentGraphic =this.currentGraphic; 
        this.currentGraphic =this.Images.index(obj);
        
        IETM.Common.MainFrame.SetMultimediaViewerDisabled(false);
        IETM.Common.MainFrame.SetMultimediaVieSwerCollapsed(false);

        IETM.Common.MainFrame.ViewMultimedia(obj.id,type,arr,eventList);

        this.SetGraphicEffect(isIpd); 
        this.SetButtonStatus();  

     },
     /*
     *	卸载图片
     */ 
     UnShowImage :function () {
        IETM.Common.MainFrame.SetMultimediaViewerDisabled(true);
        var NormalBorderColor="#99CCFF";
        var NormalBorderStyle="solid";
        var image=$(".figure_min")[this.lastcurrentGraphic];
        if(image!=null)
        {
            image.style.borderColor =NormalBorderColor;
            image.style.borderStyle =NormalBorderStyle;
        }
     },
      /*
     *	加载当前图片
     */ 
     GraphicCurrent :function () {
         if(this.Images === "undefined")
              return;
            this.lastcurrentGraphic =this.currentGraphic;
            this.currentGraphic =this.currentGraphic;
            var image=this.Images[this.currentGraphic];
            if(image==undefined)
                return;
            scr =image.id;
            type=(image.name==""?0:1);
            
           IETM.Common.MainFrame.SetPreGraphicDisabled(true);
           IETM.Common.MainFrame.SetNextGraphicDisabled(true); 
           var eventList={'loadedImage': function(){
             }};
            
            if(IETM.Common.MainFrame!=undefined && IETM.Common.MainFrame != null)
                IETM.Common.MainFrame.ViewMultimedia(scr,type,null,eventList);   
            
            IETM.Common.MainFrame.SetMultimediaViewerDisabled(false);    
            IETM.Graphic.SetGraphicEffect(); 
            IETM.Graphic.SetButtonStatus();
                
     },
     GraphicNext : function () {
            if(this.Images === "undefined")
              return;
    
            this.lastcurrentGraphic =this.currentGraphic;
            this.currentGraphic =this.currentGraphic +1;
            var image=this.Images[this.currentGraphic];
            if(image==undefined)
                return;
            scr =image.id;
            type=(image.name==""?0:1);
            
           IETM.Common.MainFrame.SetPreGraphicDisabled(true);
           IETM.Common.MainFrame.SetNextGraphicDisabled(true); 
           var eventList={'loadedImage': function(){
             }};
            
            if(IETM.Common.MainFrame!=undefined && IETM.Common.MainFrame != null)
                IETM.Common.MainFrame.ViewMultimedia(scr,type,null,eventList);    
                
            IETM.Graphic.SetGraphicEffect(); 
            IETM.Graphic.SetButtonStatus();   
          
     },
     GraphicPre :function () {
        if(this.Images === "undefined")
        return;
        
        this.lastcurrentGraphic =this.currentGraphic;
        this.currentGraphic =this.currentGraphic - 1;  
        //显示图片
        var image=this.Images[this.currentGraphic];
        if(image==undefined)
            return;
        scr =image.id;
        type=(image.name==""?0:1);
        
        IETM.Common.MainFrame.SetPreGraphicDisabled(true);
        IETM.Common.MainFrame.SetNextGraphicDisabled(true); 
        var eventList={'loadedImage': function(){
             }};
             
        if(IETM.Common.MainFrame!=undefined)
          IETM.Common.MainFrame.ViewMultimedia(scr,type,null,eventList);  
          
        IETM.Graphic.SetGraphicEffect(); 
        IETM.Graphic.SetButtonStatus();       
     },
     /**
    * 获得点击的当前图片的热点对应的链接
    * @type String
    */
     LocateHospot :function (apsid,apsname) {
            var curryimage=this.Images[this.currentGraphic];
            var hotdiv;
            if(curryimage!=undefined)
            {
                hotdiv = $("div[apsid=" + apsid + "]", curryimage.parentNode.parentNode);
                if (hotdiv.length != 0) {
                    return hotdiv[0].outerHTML;
                }
            }
     },
     /*
     *	设置按钮状态
     */     
     SetButtonStatus :function () {
             if (IETM.Common.MainFrame == undefined || IETM.Common.MainFrame == null) {
                 return;
             }
             if(this.currentGraphic == 0)
            {
                IETM.Common.MainFrame.SetPreGraphicDisabled(true);
                if(this.currentGraphic == this.Images.length -1)
                {
                    IETM.Common.MainFrame.SetNextGraphicDisabled(true);
                }
                else
                {
                     IETM.Common.MainFrame.SetNextGraphicDisabled(false);
                }
            }
            else if(this.currentGraphic == this.Images.length -1)
            {
                IETM.Common.MainFrame.SetNextGraphicDisabled(true);
                if(this.currentGraphic > 0)
                {
                    IETM.Common.MainFrame.SetPreGraphicDisabled(false);
                }
                else
                {
                    IETM.Common.MainFrame.SetPreGraphicDisabled(true);
                }
            }
            else
            {
                IETM.Common.MainFrame.SetNextGraphicDisabled(false); 
                IETM.Common.MainFrame.SetPreGraphicDisabled(false);
            }
     },
      /*
     *	设置静态页面的效果
     */     
     SetGraphicEffect: function (isNoScrollEffect) {
            var NormalBorderColor="#99CCFF";
            var ActiveBorderColor ="#FF6633";
            var NormalBorderStyle="solid";
            var ActiveBorderStyle="solid";
            var bookmarkIDAttrName = 'bookmarkid';
            
                 
           try{
                if(this.currentGraphic != this.lastcurrentGraphic)
                {
                   this.Images[this.lastcurrentGraphic].style.borderColor =NormalBorderColor;
                   this.Images[this.lastcurrentGraphic].style.borderStyle =NormalBorderStyle;
                }  
                
                this.Images[this.currentGraphic].style.borderColor =ActiveBorderColor;
                this.Images[this.currentGraphic].style.borderStyle =ActiveBorderStyle;
                if(isNeedScrollEffect!=undefined&&isNoScrollEffect)
                    return;
                if (this.tempCurrentGraphic!=-1) //处于弹出窗口中，不需要定位。
                    return
                var img = this.Images.eq(this.currentGraphic);
                if(img!=null && img.position!=undefined)
                {
                    var left = img.position().left + (img.width() / 2) - (window.document.body.offsetWidth / 2);
                    var top = img.position().top;
                    
                    if((top<document.body.scrollTop&&document.body.scrollTop-top<500)||(top>( document.body.scrollTop+ document.body.clientHeight)&&top-( document.body.scrollTop+ document.body.clientHeight)<500))
                        window.scrollTo(left,top-20);

                }
            }
            catch(e)
            {
            
            }
     },
      /*
     *	设置当鼠标移入、移出小图时的效果
     */     
     ShowFlowImage : function () {
        var images=this.Images;
        images.each(function(index)
        {
            if(images.eq(index)[0].name =="")
            {
                 images.eq(index).hover(function (){
                 
    //                var destSrc=GetImgDestSrc($(this).attr("id"));
    //                $(this).after("<img id=\"figure_toggleLayer\" src=\""+ destSrc+"\" />"); 
                    $(this).after("<img id=\"figure_toggleLayer\" src=\""+ $(this).attr("src")+"\" />"); 
                    
                    var offset =  $(this).offset();
                    var obj = $("#figure_toggleLayer");

                    var top = offset.top - $("body")[0].scrollTop;
                    var bottom = $("body")[0].clientHeight - top;

                    if(bottom < obj[0].height && top < obj[0].height)
                    {
                        if(bottom > top)
                        {
                            obj.css("height",bottom -20); 
                             obj.css("top",offset.top);
                         }
                        else
                        {
                            obj.css("height",top - 20); 
                            obj.css("top",offset.top - obj[0].height);
                        }
                    }
                    else if(bottom < obj[0].height)
                    {
                        obj.css("top",offset.top - obj[0].height);
                     }
                     else
                     {
                        obj.css("top",offset.top);
                     }
                        
                    var right = $("body")[0].clientWidth - (offset.left - $("body")[0].scrollLeft) -  $(this)[0].width;       
                    if(right < obj[0].width)
                        obj.css("width",right -20);  

                    obj.fadeIn("fast");
                    },
                    function () {
                    $("#figure_toggleLayer").remove(); 
                    });
                }       
            }
        ); 
     }
};










