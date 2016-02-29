<?xml version="1.0" encoding="UTF-8"?>
<!-- Edited with XML Spy v2007 (http://www.altova.com) -->
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method='html' version='1.0' encoding='UTF-8' indent='yes'/>

<xsl:template match="/error">
<p><xsl:value-of select="."/></p>
</xsl:template>


<xsl:variable name="guser"><xsl:value-of select="result/user" /></xsl:variable>
<xsl:variable name="gkey"><xsl:value-of select="result/key" /></xsl:variable>
<xsl:variable name="gpagenum"><xsl:value-of select="result/pagenum" /></xsl:variable>

<xsl:template match="/result">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
	<title>
		搜索结果
	</title>
    <script type="text/javascript" src="resources/js2/jquery-1.8.0.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="resources/js2/jquery.highlight-5.js" charset="utf-8"></script>
    <style type="text/css">
      body.td{font-family:Arial}
      body{margin:6px 0 0 0;background-color:#fff;color:#000;}
      table{border:0}
      TD{FONT-SIZE:9pt;LINE-HEIGHT:19px;}
      .p{padding-left:18px;font-size:14px;word-spacing:4px;}
      .f{line-height:120%;font-size:100%;width:32em;padding-left:15px;}
      .bi{background-color:#D9E1F7;height:20px;}
      .highlight { color:red; }
    </style>
    <script language="javascript" type="text/javascript">
        function showContent(pobj,divid)
        {
            var obj=document.getElementById(divid);
            obj.style.position='absolute';  
            var Width=obj.clientWidth;
            var Height=obj.clientHeight;
            
             var top = pobj.offsetTop - document.body.scrollTop;
             var bottom =document.body.clientHeight - top;
             
             var left = pobj.offsetLeft;
             var right =document.body.clientWidth - left;
             if(Height > bottom &amp;&amp;  Height > top)
            {
                if(bottom > top)
                {
                    //obj.height=bottom -20; 
                    obj.top=pobj.offsetTop;
                 }
                else
                {
                    //obj.height=top - 20; 
                    obj.top=pobj.offsetTop - Height;
                }
            }
            
            else if(Height > bottom)
            {
                obj.top=pobj.offsetTop - Height;
             }
             else
             {
                obj.top=pobj.offsetTop;
             }
                
                //
            if(Width > right &amp;&amp;  Width > left)
            {
                if(right > left)
                {
                    //obj.height=bottom -20; 
                    obj.style.left=pobj.offsetLeft;
                 }
                else
                {
                    //obj.height=top - 20; 
                    obj.style.left=pobj.offsetLeft - Width;
                }
            }
            
            else if( Width > right)
            {
                obj.style.left=pobj.offsetLeft - Width;
             }
             else
             {
                obj.style.left=pobj.offsetLeft;
             }
                
           obj.style.display='block'; 
 
        }
        
        function clickHref(pageIndex,searchCondition,user)
        {
            window.location.href="ftsearch?pageIndex="+pageIndex+"&amp;searchCondition="+encodeURIComponent(searchCondition)+"&amp;user=" + user;
        }
        
        function Goto(searchCondition,user,count)
        {
            var txtPage =document.getElementsByName('txtPage')[0]; 
            var text = txtPage.value;
            var index = text.indexOf('.');
            
            var integer=parseFloat(text);
            if( integer==undefined || !integer>0 || integer%1!=0)
            {
              alert('请输入一个正整数！'); 
              return;
            }
            if(isNaN(text) || text=='')
            {
              alert('请输入一个正整数！'); 
              return;
            }
            
            if(integer>count || integer>=10000000000)
            {
              alert('输入数值超出了页面的总数！'); 
              return;
            }
            
            
            clickHref(integer,searchCondition,user);
        }
        
        function onClickItem(dmc)
        {
        	top.ApplicationContext.IMainFrame().LoadMainHTMLTab(dmc,'Manual/'+dmc+'.htm?contentKey='+'<xsl:value-of select="$gkey"/>')
        }
        
    </script>
  </head>
  <body>
  	<table style="background-color:#D9E1F7;height:20px;" width="100%" border="0" cellpadding="0" cellspacing="0">
	  	<tr align="right">
	  	<td align="right" style="width:100%;text-align:right">共搜索到<xsl:value-of select="recordnum"/>条记录，分成<xsl:value-of select="pagenum"/>页，当前是第<xsl:value-of select="pageid"/>页</td>
	  	</tr>
	  	</table>
  
    <xsl:for-each select="dm">
    	<xsl:variable name="dmc">
    		<xsl:value-of select="code"/>
   		</xsl:variable>
        <table width="100%"  border="0" cellpadding="0" cellspacing="0">
		<tr>
		<td class="f" style="width:100%;word-break:break-all"><a href="#" onclick="onClickItem('{$dmc}')">
		<font size="3" class="content"><xsl:value-of select="techname"/> - <xsl:value-of select="infoname"/></font></a>
		<br/>
		<font size="-1" class="content"><xsl:value-of select="abstract"/></font>
		<br/>
		<font color="#00800"><xsl:value-of select="code"/>, <xsl:value-of select="date"/></font>
		</td>
		</tr>
		</table><br/>
    </xsl:for-each>
    
    <script type="text/javascript">
      $('.content').highlight('<xsl:value-of select="$gkey"/>');
    </script>

	<xsl:apply-templates select="foot"/>
	
	<form name="form1" method="post" action="ftsearch?pageIndex=1&amp;searchCondition=1&amp;user=admin&amp;time=5683" id="form1">
	<div>
	<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUJNzgzNDMwNTMzZGTN6E79PcJ+lrjkLfYeHq5kPGJe0w==" />
	</div>
 
    
    </form>
	</body>
	</html>
</xsl:template>


<xsl:template match="foot">
	<div class="p">
    <xsl:apply-templates select="item"/>
	跳转到<input id='txtPage' type='text' style='width:20pt'/>页<input type='button' value='GO' onclick="Goto('{$gkey}','{$guser}','{$gpagenum}')"/>
   	</div>
</xsl:template>

<xsl:template match="item">
	<xsl:variable name="cpage"><xsl:value-of select="Id" /></xsl:variable>
	<a href="#" onclick="clickHref('{$cpage}','{$gkey}','{$guser}')"><xsl:value-of select="text" /></a>
    <xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
</xsl:template>


</xsl:stylesheet>
