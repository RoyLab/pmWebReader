/*
//	功能：当用户点击非叶子节点后，将该该节点的后代的全部叶子节点列表显示。
//	作者：wanghai
//	日期：2009-4-16
//	备注：
//	
//	修改历史：
//	日期			修改人		描述:
*/
    
    var table;//用于生成表格。
    var manualtable;//用于生成表格。
    var currayTreeNode;
    var cid;
    var tp;
    var treeType;
    
    $(document).ready(function()
    {      
        if(top.location != document.location)
        {                
            admType = $('#dmType').val();
            if (admType == "DMlist") 
            {
                treeType=s135("treeType");
                cid=s135("id").replace('~','#');
                document.title=s135("text")+'列表';
                tp=s135("listType");
               
                GetDMlistTable();
            }
        }
    });
    
     function s135(s136){
            var s137=document.location.search;
            if(s137=="")
                return "";
            if(s137.charAt(0)=="?")
                s137=s137.substring(1,s137.length);
            var s138=s137.split("&");
            for(i=0;i<s138.length;i++)
            {
                var s138_values=s138[i].split("=");
                if(s136==unescape(s138_values[0]))
                {
                    var s140;
                    if(window.decodeURIComponent)     
                        s140=decodeURIComponent(s138_values[1]);
                    else 
                        s140=unescape(s138_values[1]);  
                        return s140;
                 }
             }
             return "";
         }
     
    
    function GetDMlistTable()
    {
      var id;
      GetTableHeader();
      GetManualTableHeader();
      
      var treeNodeCollection=top.TOC.classData;
      if(top!=null && treeType=="m_pnlSnsTreeContainer")//当前为SNS树激活
      {
        treeNodeCollection=top.TOC.snsTreeData;
      }
      if(cid=="root")
      {
        currayTreeNode=treeNodeCollection;
      }
      else
      {
            for(var j=0;j<treeNodeCollection.length;j++)
              {
                    id=treeNodeCollection[j].id;
                    if(tp=='tp')
                    {
                        tempid=id.substring(0,id.indexOf('_'));
                        if(tempid==cid)
                        {
                            top.MainFrame.LocateNode(id,'');
                            currayTreeNode=treeNodeCollection[j].children;
                        }
                    }
                    else{
                        if(id==cid)
                        {
                            currayTreeNode=treeNodeCollection[j].children;
                        }
                    }
                    if(currayTreeNode==undefined&&treeNodeCollection[j].children!=undefined)
                    {
                        GetTreeCurryNode(treeNodeCollection[j]);
                        if(currayTreeNode!=undefined && currayTreeNode.children!=undefined)
                            currayTreeNode=currayTreeNode.children;
                    }
              }
      }
      

      GetTableRow(OrderDmc(GetAllDmc(currayTreeNode)));
      GetManualTableRow(GetAllPmentry(currayTreeNode));
        if(table.children.length>1)
        {
            $("#dmlisttitle").append(document.title.replace("列表","－")+"DM列表");
            $("#dmlist").append(table.outerHTML);
        }
        
        if(table.children.length>1 && manualtable.children.length>1)
          $("#myhr").css("display","block");
        else
          $("#myhr").css("display","none");
//        else{
//            $("#dmlisttitle").append("无DM列表");
//            table=$("#dmlist").append("");
//        }
        
         if(manualtable.children.length>1)
        {
            $("#manuallisttitle").append(document.title.replace("列表","－")+"列表");
            $("#manuallist").append(manualtable.outerHTML);
        }
        
//        else{
//            $("#manuallisttitle").append("无手册列表");
//            $("#manuallist").append("");
//        }
        
       
    }
    
    function GetTableHeader()
    {
        var tr;
        var td;
         table=document.createElement("table");
         table.width="95%";
         table.className="lists_table";
         tr=document.createElement("tr");
         tr.appendChild(Gettd("","DMC","th"));
         tr.appendChild(Gettd("","版本","th"));
         tr.appendChild(Gettd("","名称","th"));
         table.appendChild(tr);
    } 
    
    function GetManualTableHeader()
    {
        var tr;
        var td;
         manualtable=document.createElement("table");
         manualtable.width="95%";
         manualtable.className="lists_table";
         tr=document.createElement("tr");
         if(treeType!="SnsTree")
         {
             tr.appendChild(Gettd("","名 称","th"));
         }
         else
         {
             tr.appendChild(Gettd("","名 称","th"));
         }
         manualtable.appendChild(tr);
    } 
    
    function GetTreeCurryNode(nodes)
    {
         
         if(currayTreeNode!=undefined)
         {
            return;
         }
        
        for(var i=0;i<nodes.children.length;i++)
        {
            id=nodes.children[i].id;
            if(tp=='tp')
            {
                tempid=id.substring(0,id.indexOf('_'));
                if(tempid==cid)
                {
                    currayTreeNode=nodes.children[i];
                    return;
                }
            }
            else{
                if(id==cid)
                {
                    currayTreeNode=nodes.children[i];
                    return;
                }
            }
            
            if(nodes.children[i].leaf==undefined||!nodes.children[i].leaf)
            {
              GetTreeCurryNode(nodes.children[i]);
            }
        }
    }

     function GetAllPmentry(nodes)
     {
         var childnode;
         var arr=new Array();
         var k=0;
         if(nodes!=undefined)
         {
               for(var i=0;i<nodes.length;i++)
               {   
                 childnode=nodes[i];
                 if(childnode.leaf==undefined || childnode.leaf==false)
                 {
                    arr[k]={id:childnode.id,objectType:childnode.objectType,issno:childnode.issno,language:childnode.language,text:childnode.text};
                    k++;
                 }
               }
          }
           return arr;
     }
     
     
    function GetManualTableRow(arr)
    {
         var childnode;
         var tr;
         
         for(var i=0;i<arr.length;i++)
         {   
             childnode=arr[i];
             tr=document.createElement("tr");                                                    
             tr.align="left";
             tr.vAlign="center";
             tr.id=childnode.id;  
             tr.name="DMlist.html?id="+tr.id.replace('#','~')+"&text="+childnode.text+"&objectType="+childnode.objectType+"&treeType="+treeType;
             tr.onmouseover="mouseover(this)";
             tr.onmouseout="mouseout(this)";
             tr.onclick="tclick(this)";
             tr.appendChild(Gettd("",childnode.text,"td"));
             manualtable.appendChild(tr); 
         }
    }
    
    function GetAllDmc(nodes) {
         var childnode;
         var arr=new Array();
         var k=0;
         if(nodes!=undefined)
         {
               for(var i=0;i<nodes.length;i++)
               {   
                 childnode=nodes[i];
                 if(childnode.leaf!=undefined && childnode.leaf && childnode.href!=undefined && childnode.href!='')
                 {
                    arr[k]={id:childnode.id,objectType:childnode.objectType,href:childnode.href,codeString:childnode.codeString,issno:childnode.issno,language:childnode.language,text:childnode.text};
                    k++;
                 }
               }
         }
         
         return arr;
    }
    
    
    //.toLowerCase()  是性能的大问题。
    function OrderDmc(arr) {
          arr.sort(Comparestring);
        return arr;
    }
    
    function Comparestring(a,b)
    {
        return a.codeString>b.codeString;
    }
    
    function GetTableRow(arr)
    {
         var tr;
         var td;
         var childnode;
         var index=0;
         var temp='';
         var issno='';
         var result;
          var password;
         if(arr!=undefined )
         {
             for(var i=0;i<arr.length;i++)
             {   
                            childnode=arr[i];
                            result=false;
                            var FilterService=IETM.Common.FilterService;
                              result=FilterService.IsFilterDMC(childnode.codeString);
                              if(!result)
                              {

                                                 tr=document.createElement("tr");
                                                 tr.align="left";
                                                 tr.vAlign="center";
                                                 tr.id=childnode.id;  
                                                 if(childnode.href!=undefined)
                                                    tr.name=childnode.href;
                                                 else
                                                    tr.name="DMlist.html?id="+tr.id.replace('#','~')+"&text="+tr.children[0].innerText+"&treeType="+treeType;
                                                    
                                                 tr.onmouseover="mouseover(this)";
                                                 tr.onmouseout="mouseout(this)";
                                                 tr.onclick="tclick(this)";
                                                 temp=childnode.id;
                                                 index=temp.indexOf('_');
                                                 if(index>0)
                                                 {
                                                    temp=temp.substring(0,index);
                                                 }
                                                  issno=childnode.href;
                                                  index=issno.indexOf('_');
                                                   if(index>0)
                                                    {
                                                        issno=issno.substring(index+1);
                                                        index=issno.indexOf('_');
                                                        if(index>0)
                                                        {
                                                            issno=issno.substring(0,index);
                                                        }
                                                        else
                                                        {
                                                             index=issno.indexOf('.');
                                                             if(index>0)
                                                             {
                                                                issno=issno.substring(0,index);
                                                             }
                                                        }
                                                    }
                                                    else{
                                                         issno='';
                                                    }
                                                 
                                                 
                                                 tr.appendChild(Gettd("",temp,"td"));
                                                 tr.appendChild(Gettd("",issno,"td"));
                                                 tr.appendChild(Gettd("",childnode.text,"td"));
                                                 
                                                 table.appendChild(tr); 
                             }
             
             }
         
         }
    }
    
    function tclick(tr)
    {     
             IETM.Common.MainFrame.LoadMainHTMLTab(tr.id,tr.name);
    }
    
    
    function mouseover(tr)
    {
        tr.bgColor="3d71b8";
        tr.style.cursor="hand";
    }
    
    function mouseout(tr)
    {
         tr.bgColor="ffffff";
    }
    
    function Gettd(tdclass,text,tag)
    {
     var td;
     td=document.createElement(tag);
     td.className=tdclass;
     td.innerText=text;
     return td;
    }