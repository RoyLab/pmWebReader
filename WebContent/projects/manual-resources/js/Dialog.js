/// <reference path="jquery.js" />
/// <reference path="jQuery.intellisense.js" />


/*
//	功能：modal弹出窗口
//	作者：王桂锋
//	日期：2008-11-14
//	备注：
//        待解决的问题：
//          1.窗口拖动边框改变大小的几个函数可以提取公共函数，以减少代码量；
//          2.显示弹出窗体时为元素的事件绑定处理函数的操作对性能影响比较大，可以采用延迟绑定
//              或者直接在html中绑定好。
//
//        心得：使用jquery确实非常方便，但在使用时应该思考一下，否是使用原始的方法会更好。
//	
//	修改历史：
//	日期			修改人		描述:
    2009-08-19      Lu Can      修改tb_show接口，增加参数contentHtml参数，
                                允许从外面直接传Html片段进行展示
    */

var TB_WIDTH,TB_HEIGHT,TB_TOP,TB_LEFT; //窗口的宽、高，左上角坐标
var params;  //传入参数的数组
var maximize = false;   //是否最大化

var resizingBottom =false;  //窗口下边框正在拖动改变大小
var resizingTop =false;  //窗口顶边框正在拖动改变大小


//处理窗体弹出后，还可以滚动的bug2420 
var orginalScrollLeft,originalScrollTop,originalScrollHandler;

/*显示弹出窗体*/ 
function tb_show(caption, url,buttonHtml,contentHtml) 
{
	try 
	{   
		queryString = url.replace(/^[^\?]+\??/,'');
		params = tb_parseQuery( queryString );		
		       
		        
		InitWindow();
		
	    var tbWindows = $("#TB_window");
		GetSize();
		AddTitle(tbWindows,caption);
		AddContent(tbWindows,contentHtml);
        AddButton(tbWindows,buttonHtml);      
	
		tb_layout(TB_LEFT,TB_TOP,TB_WIDTH,TB_HEIGHT);      
		    
		tbWindows.css({display:"block"}); 
		
		//若窗口大小改变则随着改变大小		
		$(window).bind("resize","",Resize);		
  
		MoveWindow(tbWindows[0]);
		
		//拖拽改变大小
		DragResize(tbWindows[0]);
		
		//设置鼠标效果
		SetMouse(tbWindows[0]);
		
		tbWindows[0].focus();
	

	

	   //不能去掉 修复bug1814,不知道什么原因，需要重新设置下高度才正常显示.
	   var oldheigth= parseInt($("#TB_ajaxContent").get(0).style.height);
       var content=$("#TB_ajaxContent").get(0);
       content.style.height=(oldheigth+1).toString()+'PX';
       

       //修复设置document.body.scroll="no"在滚动条不可见的情况，拖动鼠标导致文档滚动。
       orginalScrollLeft=document.body.scrollLeft;
       originalScrollTop=document.body.scrollTop;
       originalScrollHandler=document.body.onscroll;
	   document.body.onscroll=prohibitScroll;
	   
	   
	   //让放大栏不能使用
	   if(IETM.Common.MainFrame!=undefined && IETM.Common.MainFrame!=null)
	   {
	        IETM.Common.MainFrame.SetSliderDisabled(true);
	        //document.body.style.zoom="101%";
	   }
	   
	} 
	catch(e) 
	{
		
	}	
}

/**
 * 弹出窗体后禁止拖动滚动条
 */
function prohibitScroll()
{
      //wanghai 解决BUG2420 IE6中闪的问题，让弹出窗口移动
      Resize();
//    var ev=window.event;
//    if(document.body.scrollTop!=originalScrollTop|| 
//    document.body.scrollLeft!=orginalScrollLeft)
//        window.scrollTo(orginalScrollLeft,originalScrollTop);
}



//在目标元素的后代元素中查找元素,比起直接使用$能快上10倍左右
function FindChildElement(tbWindow,classOrid)
{ 

   if(tbWindow==undefined)
    return;
    
   for( var i =0;i<tbWindow.children.length ;i++)
   {
       var child = tbWindow.children[i];
       
       if( child.className == classOrid || child.id == classOrid ) 
       {
          return child;
       }
       else 
       {
          var deschild = FindChildElement(child,classOrid);
          if( typeof deschild != 'undefined')
          {
              return deschild;
          }
       }
   }
}


/*******************设置鼠标效果***************************/
function SetMouse(tbWindow)
{
    SetTopMouse($(FindChildElement(tbWindow,"TB_title")))
    SetObjectMouse($(FindChildElement(tbWindow,"TB_titleDiv")),"move");
    SetObjectMouse($(FindChildElement(tbWindow,"left-corners")),"nw-resize");
    SetObjectMouse($(FindChildElement(tbWindow,"left-right")),"w-resize");
    SetObjectMouse($(FindChildElement(tbWindow,"left-corners2")),"sw-resize");
    
    SetBottomMouse( $(FindChildElement(tbWindow,"TB_ButtonPanel")));  
    SetObjectMouse( $(FindChildElement(tbWindow,"right-corners2")),"se-resize");
    SetObjectMouse( $(FindChildElement(tbWindow,"left-corners2")),"e-resize");
    SetObjectMouse( $(FindChildElement(tbWindow,"right-corners")),"ne-resize");   
}

function SetObjectMouse(obj,mouse)
{
    obj.mouseover(function()
    {
        if(maximize)
        {
            $(this).get(0).style.cursor  = "default";            
        }
        else
        {
             $(this).get(0).style.cursor = mouse;             
        }
    });
}

function SetTopMouse(TB_title)
{
    TB_title.mouseover(function()
    {
        if(maximize)
        {
            $(this).get(0).style.cursor  = "default";
        }
        else
        {
             if(!resizingTop)
             {
               if(event.srcElement !=null && event.offsetY <= 5 && event.offsetX < event.srcElement.offsetWidth -40)
                    $(this).get(0).style.cursor = "n-resize";
               else
                    $(this).get(0).style.cursor  = "default";
             }
        }
    });
    
     TB_title.mousemove(function()
     {
        if(maximize) 
        {
            $(this).get(0).style.cursor  = "default";
        }
        else
        { 
             if(!resizingTop)
             {
                 if(event.srcElement !=null && event.offsetY <= 5 && event.offsetX < event.srcElement.offsetWidth -40)
                    $(this).get(0).style.cursor = "n-resize";
                 else
                    $(this).get(0).style.cursor  = "default";
              }  
         }
     });
}

function SetBottomMouse(buttonPanel)
{   
    buttonPanel.mouseover(function()
    {
        if(maximize)
        {
            $(this).get(0).style.cursor  = "default";
        }
        else
        {    
             if(!resizingBottom)
             {

                 if(event.srcElement !=null && event.offsetY > event.srcElement.offsetHeight -5)
                    $(this).get(0).style.cursor = "s-resize";
                 else
                    $(this).get(0).style.cursor  = "default";
              }
        }
    });
    
     buttonPanel.mousemove(function()
     {
        if(maximize)
        {
            $(this).get(0).style.cursor  = "default";
        }
        else
        {  
             if(!resizingBottom)
             {
                 if(event.srcElement !=null && event.offsetY >= event.srcElement.offsetHeight -5)
                    $(this).get(0).style.cursor = "s-resize";
                 else
                    $(this).get(0).style.cursor  = "default";
             }

        }   
     });
}
/*******************设置鼠标效果结束***************************/


/*******************拖动边框改变窗口大小***************************/
function DragResize(tbWindow)
{
   DragTop(tbWindow);
   DragLeftCorner(tbWindow);
   DragLeft(tbWindow);
   DragLeftCorner2(tbWindow);
   DragBottom(tbWindow);
   DragRightCorner2(tbWindow);
   DragRight(tbWindow);
   DragRightCorner(tbWindow);
}

function DragTop(tbWindow)
{
    $(FindChildElement(tbWindow,"TB_title")).mousedown(function()
    {
        if(maximize)
	        return;
	        
	    var g_Y;
	    var dragObj = $(this).get(0);
	    if(event.button ==1 && event.offsetY <= 5  && event.offsetX < event.srcElement.offsetWidth -40)
	    {	        
	        g_Y =event.clientY;	 
	        dragObj.style.cursor  = "n-resize";     
	        dragObj.setCapture();
	         var window = $("#TB_window").get(0);
	         resizingTop =true;
	        
	        dragObj.onmousemove =function()
	        {
	            var offset_Y =event.clientY -g_Y;	          
	            g_Y =event.clientY;	         	            
	           
	            var content = $("#TB_ajaxContent").get(0);	              
	            rTop = window.style.pixelTop + offset_Y;   //- $("body")[0].scrollTop;
	            
	            if(rTop>0 && TB_HEIGHT - offset_Y >= 250)
	            {
	                window.style.pixelTop =rTop;  
	                TB_HEIGHT =window.style.pixelHeight - offset_Y;
	                content.style.pixelHeight  = content.style.pixelHeight -offset_Y;
	                window.style.pixelHeight  = window.style.pixelHeight - offset_Y;	                               
	            }                      
	        };		        
	        
	        dragObj.onmouseup =function()
	        {	          
	           resizingTop =false;
	           dragObj.releaseCapture();
	           dragObj.onmousemove =null;
	           dragObj.onmouseup =null;
	           dragObj.style.cursor  = "default";
	           TB_TOP = window.style.pixelTop;
	           TB_LEFT = window.style.pixelLeft;
	        };		        
	        
	    }
	        
    });
}

function DragLeftCorner(tbWindow)
{
    $(FindChildElement(tbWindow,"left-corners")).mousedown(function()
    {
        if(maximize)
	        return;
	        
	    var g_X,g_Y;
	    var dragObj = $(this).get(0);
	    if(event.button ==1)
	    {
	        g_X =event.clientX;
	        g_Y =event.clientY;
	        dragObj.style.cursor  = "nw-resize";   
	        var window = $("#TB_window").get(0);  
	        dragObj.setCapture();
	        
	        dragObj.onmousemove =function()
	        {
	            var offset_X =event.clientX -g_X;
	            var offset_Y =event.clientY -g_Y;
	            g_X =event.clientX;
	            g_Y =event.clientY;
	            
	            var content = $("#TB_ajaxContent").get(0);
	            rTop =window.style.pixelTop +  offset_Y ;//-$("body")[0].scrollTop;        
	            rLeft = window.style.pixelLeft + offset_X- $("body")[0].scrollLeft;
	            
	            if(rLeft >= 0 && TB_WIDTH - offset_X >= 250)
	            {
	                TB_WIDTH =window.style.pixelWidth -offset_X;
	                content.style.pixelWidth  = content.style.pixelWidth -offset_X;
	                window.style.pixelWidth  = window.style.pixelWidth -offset_X;
	                window.style.pixelLeft =rLeft + $("body")[0].scrollLeft;                  
	            }
	            
	            if(rTop >= 0 && TB_HEIGHT - offset_Y >=250)
	            {
	               TB_HEIGHT =TB_HEIGHT -offset_Y;
	               content.style.pixelHeight  = content.style.pixelHeight -offset_Y ;
	               window.style.pixelHeight  = window.style.pixelHeight -offset_Y ;
	               window.style.pixelTop =rTop;	               
	            }            
	                                  
	        };		        
	        
	        dragObj.onmouseup =function()
	        {	          
	           dragObj.releaseCapture();
	           dragObj.onmousemove =null;
	           dragObj.onmouseup =null;	 
	            TB_TOP = window.style.pixelTop;
	           TB_LEFT = window.style.pixelLeft;           
	        };		        
	        
	    }
	        
    });
}

function DragLeft(tbWindow)
{
     $(FindChildElement(tbWindow,"left-right")).mousedown(function()
    {
        if(maximize)
	        return;
	        
	    var g_X;
	    var dragObj = $(this).get(0);
	    if(event.button ==1)
	    {
	        g_X =event.clientX;	      
	        dragObj.setCapture();
	        dragObj.style.cursor  = "w-resize";
	        var window = $("#TB_window").get(0);
	        
	        dragObj.onmousemove =function()
	        {
	            var offset_X =event.clientX -g_X;	          
	            g_X =event.clientX;	        
	              
	            var content = $("#TB_ajaxContent").get(0);	              
	            rLeft = window.style.pixelLeft + offset_X- $("body")[0].scrollLeft;
	            
	            if(rLeft >= 0 && TB_WIDTH - offset_X >= 250)
	            {
	                TB_WIDTH =window.style.pixelWidth -offset_X;
	                content.style.pixelWidth  = content.style.pixelWidth -offset_X;
	                window.style.pixelWidth  = window.style.pixelWidth -offset_X;
	                window.style.pixelLeft =rLeft + $("body")[0].scrollLeft;	                  
	            }                      
	        };		        
	        
	        dragObj.onmouseup =function()
	        {	          
	           dragObj.releaseCapture();
	           dragObj.onmousemove =null;
	           dragObj.onmouseup =null;	   
	           TB_TOP = window.style.pixelTop;
	           TB_LEFT = window.style.pixelLeft;       
	        };		        
	        
	    }
	        
    });
}

function DragLeftCorner2(tbWindow)
{
     $(FindChildElement(tbWindow,"left-corners2")).mousedown(function()
    {
        if(maximize)
	        return;
	        
	    var g_X,g_Y;
	    var dragObj = $(this).get(0);
	    if(event.button ==1)
	    {
	        g_X =event.clientX;
	        g_Y =event.clientY;
	        dragObj.setCapture();
	        dragObj.style.cursor  = "sw-resize";
	        var window = $("#TB_window").get(0);
	        
	        dragObj.onmousemove =function()
	        {
	            var offset_X =event.clientX -g_X;
	            var offset_Y =event.clientY -g_Y;
	            g_X =event.clientX;
	            g_Y =event.clientY;	            
	            
	            var content = $("#TB_ajaxContent").get(0);
	            rBottomY =window.style.pixelTop + window.style.pixelHeight + offset_Y ;//-$("body")[0].scrollTop;        
	            rLeft = window.style.pixelLeft + offset_X- $("body")[0].scrollLeft;
	            
	            if(rLeft >= 0 && TB_WIDTH - offset_X >= 250)
	            {
	                TB_WIDTH =window.style.pixelWidth -offset_X;
	                content.style.pixelWidth  = content.style.pixelWidth -offset_X;
	                window.style.pixelWidth  = window.style.pixelWidth -offset_X;
	                window.style.pixelLeft =window.style.pixelLeft+ offset_X;	                  
	            }
	            
	            if(rBottomY< $("body")[0].clientHeight && TB_HEIGHT + offset_Y >=250)
	            {
	               TB_HEIGHT =window.style.pixelHeight +offset_Y;
	               content.style.pixelHeight  = content.style.pixelHeight + offset_Y ;
	               window.style.pixelHeight  = window.style.pixelHeight + offset_Y ;	                            
	            }            
	                                  
	        };		        
	        
	        dragObj.onmouseup =function()
	        {	          
	           dragObj.releaseCapture();
	           dragObj.onmousemove =null;
	           dragObj.onmouseup =null;	
	           TB_TOP = window.style.pixelTop;
	           TB_LEFT = window.style.pixelLeft;          
	        };		        
	        
	    }
	        
    });
}

function DragBottom(tbWindow)
{
     $(FindChildElement(tbWindow,"TB_ButtonPanel")).mousedown(function()
    {
        if(maximize)
	        return;
	        
	    var g_Y;
	    var dragObj = $(this).get(0);
	    if(event.button == 1 && event.offsetY >= event.srcElement.offsetHeight -5)
	    {	        
	        g_Y =event.clientY;	 
	        dragObj.style.cursor  = "s-resize";     
	        dragObj.setCapture();	        
	        resizingBottom =true;
	        var window = $("#TB_window").get(0);        
  
	        dragObj.onmousemove =function()
	        {
	            var offset_Y =event.clientY -g_Y;	          
	            g_Y =event.clientY;	                    
	            
	            var content = $("#TB_ajaxContent").get(0);	              
	            rBottomY = window.style.pixelTop + offset_Y + window.style.pixelHeight;// - $("body")[0].scrollTop;
	            
	            if(rBottomY< $("body")[0].clientHeight && TB_HEIGHT + offset_Y >= 250)
	            {
	                TB_HEIGHT =window.style.pixelHeight +offset_Y;
	                content.style.pixelHeight  = content.style.pixelHeight+offset_Y;
	                window.style.pixelHeight  = window.style.pixelHeight +offset_Y;	
                     
	            }                      
	        };		        
	        
	        dragObj.onmouseup =function()
	        {              
	           dragObj.releaseCapture();
	           resizingBottom =false;
	           dragObj.onmousemove =null;
	           dragObj.onmouseup =null;	
	           TB_TOP = window.style.pixelTop;
	           TB_LEFT = window.style.pixelLeft;        
	        };		        
	        
	    }
	        
    });
}


function DragRightCorner2(tbWindow)
{
     $(FindChildElement(tbWindow,"right-corners2")).mousedown(function()
    {
        if(maximize)
	        return;
	        
	    var g_X,g_Y;
	    var dragObj = $(this).get(0);
	    if(event.button ==1)
	    {
	        g_X =event.clientX;
	        g_Y =event.clientY;
	        dragObj.setCapture();
	        dragObj.style.cursor  = "se-resize";
	         var window = $("#TB_window").get(0);
	        
	        dragObj.onmousemove =function()
	        {
	            var offset_X =event.clientX -g_X;
	            var offset_Y =event.clientY -g_Y;
	            g_X =event.clientX;
	            g_Y =event.clientY;	            
	           
	            var content = $("#TB_ajaxContent").get(0);
	            rBottomY =window.style.pixelTop +  offset_Y +  window.style.pixelHeight ;//-$("body")[0].scrollTop;        
	            rBottomX = window.style.pixelLeft + offset_X +  window.style.pixelWidth - $("body")[0].scrollLeft;
	            
	            if(rBottomX < $("body")[0].clientWidth  && TB_WIDTH + offset_X >= 250)
	            {
	                TB_WIDTH =window.style.pixelWidth +offset_X;
	                content.style.pixelWidth  = content.style.pixelWidth +offset_X;
	                window.style.pixelWidth  = window.style.pixelWidth +offset_X;	                               
	            }
	            
	            if(rBottomY < $("body")[0].clientHeight  && TB_HEIGHT +offset_Y >=250)
	            {
	               TB_HEIGHT =window.style.pixelHeight +offset_Y;
	               content.style.pixelHeight  = content.style.pixelHeight +offset_Y ;
	               window.style.pixelHeight  = window.style.pixelHeight +offset_Y ;	                        
	            }            
	                                  
	        };		        
	        
	        dragObj.onmouseup =function()
	        {	          
	           dragObj.releaseCapture();
	           dragObj.onmousemove =null;
	           dragObj.onmouseup =null;	
	            TB_TOP = window.style.pixelTop;
	           TB_LEFT = window.style.pixelLeft;          
	        };		        
	        
	    }
	        
    });
}

function DragRight(tbWindow)
{
    $(FindChildElement(tbWindow,"left-right2")).mousedown(function()
    {
        if(maximize)
	        return;
	        
	    var g_X;
	    var dragObj = $(this).get(0);
	    
	    if(event.button ==1)
	    {
	        g_X =event.clientX;	      
	        dragObj.setCapture();
	        dragObj.style.cursor  = "e-resize";
	        var window = $("#TB_window").get(0);
	        
	        dragObj.onmousemove =function()
	        {
	            var offset_X =event.clientX -g_X;	          
	            g_X =event.clientX;	         
	            
	           
	            var content = $("#TB_ajaxContent").get(0);	              
	            rRightX = window.style.pixelLeft + offset_X + window.style.pixelWidth - $("body")[0].scrollLeft;
	            
	            if(rRightX < $("body")[0].clientWidth && TB_WIDTH + offset_X >= 250)
	            {
	                TB_WIDTH =window.style.pixelWidth + offset_X;
	                content.style.pixelWidth  = content.style.pixelWidth + offset_X;
	                window.style.pixelWidth  = window.style.pixelWidth + offset_X;	                              
	            }                      
	        };		        
	        
	        dragObj.onmouseup =function()
	        {	          
	           dragObj.releaseCapture();
	           dragObj.onmousemove =null;
	           dragObj.onmouseup =null;	 
	           TB_TOP = window.style.pixelTop;
	           TB_LEFT = window.style.pixelLeft;          
	        };    
	        
	    }
	        
    });
}


function DragRightCorner(tbWindow)
{
     $(FindChildElement(tbWindow,"right-corners")).mousedown(function()
    {
        if(maximize)
	        return;
	        
	    var g_X,g_Y;
	    var dragObj = $(this).get(0);
	    if(event.button ==1)
	    {
	        g_X =event.clientX;
	        g_Y =event.clientY;
	        dragObj.setCapture();
	        dragObj.style.cursor  = "ne-resize";
	         var window = $("#TB_window").get(0);
	        
	        dragObj.onmousemove =function()
	        {
	            var offset_X =event.clientX -g_X;
	            var offset_Y =event.clientY -g_Y;
	            g_X =event.clientX;
	            g_Y =event.clientY;
	            
	           
	            var content = $("#TB_ajaxContent").get(0);

	            rTop =window.style.pixelTop +  offset_Y ;//-$("body")[0].scrollTop;        
	            rLeft = window.style.pixelLeft+  window.style.pixelWidth + offset_X- $("body")[0].scrollLeft;
	            
	            if(rLeft < $("body")[0].clientWidth  && TB_WIDTH + offset_X >= 250)
	            {
	                TB_WIDTH =window.style.pixelWidth+offset_X;
	                content.style.pixelWidth  = content.style.pixelWidth +offset_X;
	                window.style.pixelWidth  = window.style.pixelWidth +offset_X;	                               
	            }
	            
	            if(rTop >0  && TB_HEIGHT -offset_Y >=250)
	            {
	               TB_HEIGHT =TB_HEIGHT -offset_Y;
	               content.style.pixelHeight  = content.style.pixelHeight -offset_Y ;
	               window.style.pixelHeight  = window.style.pixelHeight -offset_Y ;	
	               window.style.pixelTop = rTop;	                           
	            }            
	                                  
	        };		        
	        
	        dragObj.onmouseup =function()
	        {	          
	           dragObj.releaseCapture();
	           dragObj.onmousemove =null;
	           dragObj.onmouseup =null;	  
	            TB_TOP = window.style.pixelTop;
	           TB_LEFT = window.style.pixelLeft;         
	        };		        
	        
	    }
	        
    });
}
/*******************拖动边框改变窗口大小结束***************************/

/*******************通过标题栏移动窗口***************************/
function MoveWindow(tbWindow)
{
    $(FindChildElement(tbWindow,"TB_titleDiv")).mousedown(function()
	{	  
	    if(maximize)
	        return;        

	    var g_X,g_Y;
	    var divObj = $("#TB_titleDiv").get(0);
	    if(event.button ==1)
	    {
	        g_X =event.clientX;
	        g_Y =event.clientY;
	        divObj.setCapture();
	        divObj.style.cursor  = "move";
	        var window = $("#TB_window").get(0);	      
	        
	        divObj.onmousemove =function()
	        {
	            var offset_X =event.clientX -g_X;
	            var offset_Y =event.clientY -g_Y;
	            g_X =event.clientX;
	            g_Y =event.clientY;	            
	          
	            
	            rTop =window.style.pixelTop + offset_Y ;//-$("body")[0].scrollTop;        
	            rLeft = window.style.pixelLeft + offset_X - $("body")[0].scrollLeft;
	            if(rTop >= 0 && window.offsetHeight + rTop <= window.document.body.clientHeight)
	            {            
	                window.style.pixelTop = window.style.pixelTop + offset_Y;
	            }	
	            if(rLeft >= 0 && window.offsetWidth + rLeft <= window.document.body.clientWidth)
	            {	            
	                window.style.pixelLeft =window.style.pixelLeft + offset_X;	               
	            }	                       
	        };		        
	        
	        divObj.onmouseup =function()
	        {	          
	           divObj.releaseCapture();
	           divObj.onmousemove =null;
	           divObj.onmouseup =null;
	           TB_TOP = $("#TB_window").get(0).style.pixelTop;
	           TB_LEFT = $("#TB_window").get(0).style.pixelLeft;
	        };		        
	        
	    }
	});		
}
/*******************通过标题栏移动窗口结束***************************/

/*******************随容器大小改变而改变窗口大小***************************/
function Resize()
{
    if(maximize)
    {
        tb_layout(0 + $("body")[0].scrollLeft,0 + $("body")[0].scrollTop,window.document.body.clientWidth,window.document.body.clientHeight);
    }
    else
    {
       //优先保持窗口大小不变
        var l,t,w,h;
        var cw=window.document.body.clientWidth;
        var ch=window.document.body.clientHeight;
        
        if(parseInt(TB_WIDTH,10)  < cw)
        {
           w =TB_WIDTH;
           //l =TB_LEFT;          
        }
        else
        {
            w =cw-60;
        }
        l=parseInt((cw -w )/ 2 + $("body")[0].scrollLeft ,10);
        
         if(parseInt(TB_HEIGHT,10)  < ch)
        {
           h =TB_HEIGHT;
           //t = TB_TOP;            
        }
        else
        {
            h =ch-60;
        }
         t=parseInt((ch - h) / 2+ $("body")[0].scrollTop ,10);   
        
        //wanghai 改变大小时覆盖层的大小也要改变
        var width=document.body.scrollWidth > document.body.offsetWidth ? document.body.scrollWidth : document.body.offsetWidth + 'px';
	    var height=document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + 'px';
        var tbOverLays = $("#TB_overlay");
	    tbOverLays.css({position:"absolute",width:width,height:height});
        tb_layout(l,t,w,h);
    }
}
/*******************随容器大小改变而改变窗口大小结束***************************/

/*******************实现窗口功能代码***************************/
function GetSize()
{
    if(params['width'] ==undefined)
    {
        TB_WIDTH = window.document.body.clientWidth - 60;  
    }
    else
    {
        if(params['width'] > window.document.body.clientWidth)
        {
            TB_WIDTH = window.document.body.clientWidth - 60;  
        }
        else
        {
            TB_WIDTH = params['width'];  
        }
    }
    
    if(params['height'] ==undefined)
    {
        TB_HEIGHT = window.document.body.clientHeight - 60;  
    }
    else
    {
        if(params['height'] > window.document.body.clientHeight)
        {
            TB_HEIGHT = window.document.body.clientHeight - 60;  
        }
        else
        {
            TB_HEIGHT = params['height'];  
        }
    } 
    
    TB_LEFT = parseInt((window.document.body.clientWidth -TB_WIDTH )/ 2 + $("body")[0].scrollLeft ,10);
    TB_TOP =  parseInt((window.document.body.clientHeight - TB_HEIGHT) / 2+ $("body")[0].scrollTop ,10);    
}

function InitWindow()
{
    if($("#TB_window").length!=0)
        tb_remove();
        
	var width=document.body.scrollWidth > document.body.offsetWidth ? document.body.scrollWidth : document.body.offsetWidth + 'px';
	var height=document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + 'px';
	var margintop=document.documentElement?document.documentElement.scrollTop+ 'px':document.body.scrollTop + 'px';
	
	//	if(document.documentElement)
//	    $("#TB_window").css('margin-top:'+ document.documentElement.scrollTop+ 'px');
//	else
//	    $("#TB_window").css('margin-top:'+ document.body.scrollTop + 'px');


    //$("body","html").css({height: "100%", width: "100%"});
	$("html").css("overflow","hidden");
	//
	//$("html").css({position:"absolute",width:width,height:height});
	$("html").css("margin-top",margintop);
	//
	$("html")[0].document.body.scroll ="no";
		
    $("body").append("<div id='TB_overlay'></div>");
	$("body").append("<div id='TB_window'><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">"
	    +"<tr ><td class=\"left-corners\">&nbsp;</td><td id=\"titlePanel\"></td><td class=\"right-corners\">&nbsp;</td></tr>"
	    +"<tr><td class=\"left-right\">&nbsp;</td><td id=\"contentPanel\"></td><td class=\"left-right2\">&nbsp;</td></tr>"
	    +"<tr><td class=\"left-corners2\">&nbsp;</td><td id=\"buttonPanel\" class=\"top-bottom2\"></td><td class=\"right-corners2\">&nbsp;</td></tr>"
	    +"</table></div>");
		    
    var tbWindows = $("#TB_window");		    
	if(tbWindows.css("display") != "block")
    {		   	   
	    $(FindChildElement(tbWindows[0],"contentPanel")).append("<div id='TB_ajaxContent'></div>");  
	}
	//
	var tbOverLays = $("#TB_overlay");
	//tbOverLays.css({position:"absolute",width:width,height:height});
	//tbOverLays.css("z-index",99999);
	tbWindows.css({position:"absolute"});
	tbWindows.css("margin-top",margintop);
	//
	tbOverLays.addClass("TB_overlayBG");		
    tbOverLays.addClass("position: absolute;width:100%;height:100%");
}

function AddTitle(tbWindows,caption)
{
    if(tbWindows.css("display") != "block")
    {	
	    $(FindChildElement(tbWindows[0],"titlePanel")).append("<table id='TB_title' border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">"
	        +"<tr><td><div id=\"TB_titleDiv\">"+caption+"</div></td>"
	        +"<td align=\"right\" width=\"35\"><img id=\"tb_maximize\" src=\"../manual-resources/images/max21.png\" alt=\"最大化\" width=\"15px\" height=\"15px\" />&nbsp;<img id=\"tb_CloseImage\" src=\"../manual-resources/images/close1.png\" alt=\"关闭\" width=\"15px\" height=\"15px\" /></td></tr>"
	        +"</table>");
	        
	    $(FindChildElement(tbWindows[0],"tb_CloseImage")).hover(function()
	    {
	       $(this).attr("src","../manual-resources/images/close2.png"); 
	    },function()
	    {
	       $(this).attr("src","../manual-resources/images/close1.png"); 
	    });
	    
	    $(FindChildElement(tbWindows[0],"tb_maximize")).hover(function()
	     {
	        if(maximize)
	        {
	             $(this).attr("src","../manual-resources/images/max12.png"); 
	        }
	        else
	        {
	             $(this).attr("src","../manual-resources/images/max22.png"); 
	        }
	     },function()
	     {
	        if(maximize)
	        {
	             $(this).attr("src","../manual-resources/images/max11.png"); 
	        }
	        else
	        {
	            $(this).attr("src","../manual-resources/images/max21.png");
	        }
	     });
	    
	    $(FindChildElement(tbWindows[0],"tb_maximize")).bind("click","",function()
	    {
	        if(maximize)
	        {
	            maximize =false;
	            Resize();
	            //tb_layout(TB_LEFT,TB_TOP,TB_WIDTH,TB_HEIGHT);
	            $(this).attr("alt","最大化");
	            $(this).attr("src","../manual-resources/images/max22.png");
	           
	            
	        }
	        else
	        {
	            tb_layout(0 + $("body")[0].scrollLeft,0 + $("body")[0].scrollTop,window.document.body.clientWidth,window.document.body.clientHeight);
	            $(this).attr("alt","向下还原");
	            $(this).attr("src","../manual-resources/images/max12.png");
	            maximize =true;
	            
	        }
	    });
	}
}

function AddContent(tbWindows,html)
{  	
    if(typeof html=="undefined")
    {
        if(typeof params['frameId'] === "undefined")
        {
            $(FindChildElement(tbWindows[0],"TB_ajaxContent")).append($('#' + params['inlineId']).children());
            tbWindows.unload(function () {
            $('#' + params['inlineId']).append( $(FindChildElement(tbWindows[0],"contentPanel")).children() ); 
                });
        }
        else
        {					    
             var content =$('#' + params['inlineId'],window.frames[params['frameId']].document);			     
             $(FindChildElement(tbWindows[0],"TB_ajaxContent")).append(content[0].innerHTML);   
               //设置多媒体预览是否可用
             SetGraphicEnableInModal();                    					     
        } 
    }
    else
        AddHtmlContent(tbWindows,html)
 
    ChangeLinkTarget();	
  
}

function AddHtmlContent(tbWindows,html)
{		     
    $(FindChildElement(tbWindows[0],"TB_ajaxContent")).append(html); 
      //设置多媒体预览是否可用
    SetGraphicEnableInModal();       
}


function ChangeLinkTarget()
{
    var links =$("#TB_ajaxContent a");
    var xrefclass;
    links.each(function(index)
    {
           //wanghai,加入交叉引用连接
           if(links.eq(index)[0].href !="" && links.eq(index)[0].href.indexOf('javascript')==-1)
           {
               if(links.eq(index)[0].className=="insideXref")
               {
                    links.eq(index)[0].href="javascript:top.ApplicationContext.IIETM().Reference.InsideXref('"+encodeURIComponent(links.eq(index)[0].href)+"','"+links.eq(index)[0].tget+"')";
                    //$(links.eq(index)).bind("click",function(){insideXref(links.eq(index)[0].href,links.eq(index)[0])});
               } 
               else if(links.eq(index)[0].className=="outsideXref")
               {
                    links.eq(index)[0].href="javascript:top.ApplicationContext.IIETM().Reference.OutsideXref('"+encodeURIComponent(links.eq(index)[0].href)+"','"+links.eq(index)[0].attributes["dmtarget"].value+"')";
                    //$(links.eq(index)).bind("click",function(){outsideXref(links.eq(index)[0].href,links.eq(index)[0])});
               } 
                else if(links.eq(index)[0].className=="outsideXreftp")
               {
                    links.eq(index)[0].href="javascript:top.ApplicationContext.IIETM().Reference.OutsideXreftp('"+encodeURIComponent(links.eq(index)[0].attributes["tptarget"].value)+"')";
                    //$(links.eq(index)).bind("click",function(){outsideXreftp(links.eq(index)[0].href,links.eq(index)[0])});
               } 
           }

    });
  
}

function AddButton(tbWindows,buttonHtml)
{
    $(FindChildElement(tbWindows[0],"buttonPanel")).append("<div id='TB_ButtonPanel'>" + buttonHtml + "</div>");	
}

function tb_ChangeTitle(title)
{
    var $title = $("#TB_titleDiv");
    $title.empty();
    $title.append(title);
}

function tb_remove() 
{ 	
    $(window).unbind("resize",Resize);
    $("body","html").css({height: "auto", width: "auto"});
    $("html").css("overflow","");
    $("#TB_overlay").remove();
    $("#TB_window").remove();
    $("html")[0].document.body.scroll ="auto";
    
    //还原之前的滚动处理函数
    if(document.body.onscroll!=undefined)
        document.body.onscroll=originalScrollHandler;
    
     maximize = false;
       
     resizingBottom =false;
     resizingTop =false;    
      
     IETM.Graphic.lastcurrentGraphic=IETM.Graphic.templastcurrentGraphic;
     IETM.Graphic.currentGraphic=IETM.Graphic.tempCurrentGraphic; //wanghai 恢复页面的状态
     IETM.Graphic.tempCurrentGraphic=-1;
     IETM.Graphic.ReInit($(".figure_min"));
     
       //让放大栏能使用
       if(IETM.Common.MainFrame!=undefined && IETM.Common.MainFrame!=null)
	        IETM.Common.MainFrame.SetSliderDisabled(false);
	return false; 
}

function tb_ChangeContent(content)
{
    var $content = $("#TB_ajaxContent");
    $content.empty();
    $content.append(content);
    
     //不能去掉 修复bug2400,不知道什么原因，需要重新设置下高度才正常显示.
	   var oldheigth= parseInt($("#TB_ajaxContent").get(0).style.height);
       var content=$("#TB_ajaxContent").get(0);
       content.style.height=(oldheigth+1).toString()+'PX';
       
    ChangeLinkTarget();
    
    
    SetGraphicEnableInModal();
}

function tb_AppendContent(objDiv)
{  				    
   $("#TB_ajaxContent").append(objDiv);                    					     
}

function tb_parseQuery ( query ) 
{
   var Params = {};
   if ( ! query ) {return Params;}
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) 
   {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   
   return Params;
}
 
function tb_layout(left,top,width,height) 
{
    var tbWindows =  $("#TB_window");
    
    var ch=height - $(FindChildElement(tbWindows[0],"titlePanel"))[0].clientHeight - $(FindChildElement(tbWindows[0],"buttonPanel"))[0].clientHeight;
	if(ch ==height)
	    ch = height-66;
	if(ch<0) //设置最小高度，否则可能会出现异常
	    ch=15;
	    
	$(FindChildElement(tbWindows[0],"TB_ajaxContent")).css({ width: width-12 + 'px',height: ch + 'px'});
	
	
    tbWindows.css({ width: width + 'px',height: height + 'px'});
    tbWindows.css({left: left + 'px'});
	tbWindows.css({top: top + 'px'});

	
}
/*******************实现窗口功能代码结束***************************/


//在模式窗口显示时设置多媒体预览是否可用
function SetGraphicEnableInModal()
{
        IETM.Graphic.tempCurrentGraphic=IETM.Graphic.currentGraphic;
        IETM.Graphic.templastcurrentGraphic=IETM.Graphic.lastcurrentGraphic;
        IETM.Graphic.currentGraphic=0;
        //IETM.Graphic.Images =$("#contentPanel .figure_min");
        IETM.Graphic.Init($("#contentPanel .figure_min"));
        GetSize();
        Resize();
}