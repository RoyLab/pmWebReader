/************************************************************************
*功能描述：打印
*作者：练文辉
*日期：2009-03-12      
*修改：
*2010-01-13   hyb  重构Print.js文件
*                  不需要网页打印功能，删除该功能代码
************************************************************************/

Service.RegNameSpace("window.System");

    var HKEY_Root,HKEY_Path,HKEY_Key,oldFooterKey,oldHeaderKey,old_margin_left,old_margin_right; 
    HKEY_Root="HKEY_CURRENT_USER";     
    HKEY_Path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";  

    var hasCGM=false;
    var currentLevel=0;
    var iFrame;
    var printWindow;
    var objectCommand;
    var hasSetHeaderFooter=false;
    var hasClosed=false;
    var printComment = false;
    var printRemark = false;
    
    var cont;
    var otherType=false;

    var hasModifyHeaderFooter=false;


   /*--———————————-获取适用性文本--————————————-*/
    function GetApplicText()
    {
        var applicText="";
        var codeString=MainFrame.GetContentPage().GetExtDMC();
        
        //wuqifeng 支持多适用性（包括内联适用性）
        var applics = GetApplicFragmentInternal(codeString);
        if(applics != null && typeof applics != 'undefined')
        {
            var length = applics.length;
            for(var i = 0; i < length; i++)
            {
                var xmlString = applics[i];
                if(xmlString == '' || typeof xmlString == 'undefined')
                    continue;
                
                var doc = new ActiveXObject("MSXML2.DOMDocument");
                doc.async = "false";
                doc.loadXML(xmlString);
                
                if(doc.getElementsByTagName("model").length>0)
                {
                    applicText+='适用性';
                    for(var i=0;i<doc.getElementsByTagName("model").length;i++)
                    {
                        applicText += '['+doc.getElementsByTagName("model")[i].getAttributeNode("model").value+']';
                    }
                }
                else if(doc.getElementsByTagName("displaytext").length>0)
                {
                    var displaytext=doc.getElementsByTagName("displaytext")[0].text;
                    if(displaytext==null||displaytext==''||displaytext=='undefined')
                    {
                        applicText += '适用性[全部]';
                    }
                    else
                    {
                        applicText += doc.getElementsByTagName("displaytext")[0].text;
                    }
                    
                }
                else
                {
                    applicText += '适用性[全部]';
                }
                
                if(length > 1 && (i + 1) < length && applicText != '')
                {
                    applicText += ' ;';
                }
            }
        }
        
        if(applicText == '')
            applicText = '适用性[全部]';
        
        return applicText;
    }
    
    
    //加载适用性过滤文档并获取对应XML片段
    function GetApplicFragmentInternal(codeString)
    {
        var applicDoc;
        if (codeString == null || typeof codeString == 'undefined' || codeString == '')
            return null;
         
        if(applicDoc==null||applicDoc=='undefined')
        {   
            applicDoc = new ActiveXObject("MSXML2.DOMDocument");
            applicDoc.async = "false";
            applicDoc.load('manual-resources/js/ApplicFile.xml');
        }

        var list = new Array();
        try {
            if (applicDoc != null) {
                //wuqifeng 2010-11-22 支持多个适用性（包括内联适用性）
                var xpath = "//dmc[@code=\"" + codeString.toLowerCase() + "\"]/applic";
                var applicNodes = applicDoc.selectNodes(xpath);
                if (applicNodes != null && typeof applicNodes != 'undefined') 
                {
                    var length = applicNodes.length;
                    for(var i = 0; i < length; i++)
                    {
                        var applicNode = applicNodes[i];
                        applicFragment = applicNode.xml;
                        list[i] = applicNode.xml;
                    }   
                }
            }
        }
        catch (e) { }

        return list;
    }
    


  /*--———————————-设置页眉页脚的值--————————————-*/     
function DMPrintPageSetup_Null()     
{     
    try     
    { 
      var  applicText=GetApplicText();    
      var   Wsh=new   ActiveXObject("WScript.Shell");     
      HKEY_Key="header"; 
      oldHeaderKey=Wsh.RegRead(HKEY_Root+HKEY_Path+HKEY_Key);
      Wsh.RegWrite(HKEY_Root+HKEY_Path+HKEY_Key,"&w&b密级："+MainFrame.GetContentPage().Security[0].value);     
      HKEY_Key="footer"; 
      oldFooterKey=Wsh.RegRead(HKEY_Root+HKEY_Path+HKEY_Key);    
      Wsh.RegWrite(HKEY_Root+HKEY_Path+HKEY_Key,applicText+"&b页码：&p/&P&b&d"); 
      
      hasModifyHeaderFooter = true;
         
    }     
    catch(e){}     
} 
                
/*--———————————-还原页眉页脚的值--————————————-*/    
function DMPrintPageSetup_Default()     
{   

if(!hasModifyHeaderFooter)
{
return;
}      
try     
 {     
   var   Wsh=new   ActiveXObject("WScript.Shell");     
   HKEY_Key="header";     
   Wsh.RegWrite(HKEY_Root+HKEY_Path+HKEY_Key,oldHeaderKey);     
   HKEY_Key="footer";     
   Wsh.RegWrite(HKEY_Root+HKEY_Path+HKEY_Key,oldFooterKey); 
   
   hasModifyHeaderFooter = false;  
 }     
 catch(e){}     
 }
                
  function GetPrintHeader()
    {
    var   Wsh=new   ActiveXObject("WScript.Shell"); 
    HKEY_Key="header"; 
     var header = Wsh.RegRead(HKEY_Root+HKEY_Path+HKEY_Key);
     return header;
    }
    
    function GetPrintFoot()
    {
    var   Wsh=new   ActiveXObject("WScript.Shell"); 
    HKEY_Key="footer"; 
     var foot = Wsh.RegRead(HKEY_Root+HKEY_Path+HKEY_Key);
     return foot;
    }
    
//-------------------------------------------------wanghai rcm接口
var IsFinished=false;
function FinishedPrint() {
    return IsFinished;
}

function InitPrint() {
     var dminfo=ApplicationContext.MainFrame.GetActiveTabDMinfo();
    
    if(dminfo==undefined)
   {
         Service.ShowMessageBox('提示', '当前内容无法进行PDF输出！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
         return;
    }

    var cont=dminfo.Src;
    if(cont=='about:blank')
    {
        Service.ShowMessageBox('提示', '当前内容为空，无法进行PDF输出！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
        return;
    }
    
    if(cont.match('DMlist.html')!=null)
    {
         Service.ShowMessageBox('提示', '当前选中节点属于PMEntry节点，无法进行PDF输出！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
         return;
    }
    if(cont.match('HomePage/HomePage.htm')!=null)
    {
        Service.ShowMessageBox('提示', '首页目前不支持PDF输出！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
        return;
    }
}

function SetOption() {


}



function Print(currentLevel) {

    IsFinished=false;
    
    
     var dminfo=ApplicationContext.MainFrame.GetActiveTabDMinfo();
    
    PrintPDF(currentLevel);
    
    function PrintPDF(printLevel)
    {
        var waiting=Ext.getCmp('mainViewPort');
        waiting.container.mask('正在输出PDF文档……', 'x-mask-loading');
        
        setTimeout(function()
        {
            waiting.container.unmask();
            Print1(printLevel); 
        }, 10);	
    }



     var treeArrDM;
     
     function GetTreeCurryNode(node)
    {
    
        if(node==undefined || node.children==undefined)
            return;
            
        for(var i=0;i<node.children.length;i++)
        {
            if(node.children[i].leaf==undefined||!node.children[i].leaf)
            {
              GetTreeCurryNode(node.children[i]);
            }
            else
            {
                treeArrDM[treeArrDM.length]=node.children[i].codeString;
            }
        }
         
    };
    function Print1(printLevel)
    {
        var curdmc= dminfo.Dmc;
        
        if(treeArrDM==undefined)
        {
            treeArrDM= new Array();
              for(var j=0;j<top.TOC.classData.length;j++)
              {
                GetTreeCurryNode(top.TOC.classData[j]);
              }
        }
        var treeDM='';
        userInfo = ApplicationContext.IUserInfo();
        
        treeDM = treeArrDM.join(',');
        
        var WebServiceConnectState=true;
        try 
        {            
            $.ajaxSetup({ async: false });
            var para1= {dmc:curdmc,version:TOC.Version['Version'],level:printLevel,securet:userInfo.UserScurity,applicContent:userInfo.ApplicContext(),userID:userInfo.UserId,treeDM:treeDM};
            result = $.post( 'Service/ManualService.asmx/PrintPDF',para1);  

        }            
        catch (e) 
        {
            WebServiceConnectState = false;
            alert(e);
        }
        finally 
        {
            $.ajaxSetup({ async: true });
        }
         
        if (WebServiceConnectState == true)
        {
            
            pdfFileName=result.responseXML.text;
            if(pdfFileName!="")
            {
	              nwin = window.open(pdfFileName,'_blank', 'height=600, width=800,top=100, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
                 
            }
            if(pdfFileName=='false')
            {
                Service.ShowMessageBox('提示', '打印失败。', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
            }
        }
        else
        {
             Service.ShowMessageBox('错误', '生成PDF失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
        }
        
         IsFinished=true;
                    
//        Service.WebService.Call('PrintPDF',
//                                 { dmc:curdmc,version:TOC.Version['Version'],level:printLevel,securet:userInfo.UserScurity,applicContent:userInfo.ApplicContext,userID:userInfo.ID,treeDM:treeDM},
//                                 PrintCallBack,
//                                 null
//                               );
//        alert('3');                      
//        function PrintCallBack (result) 
//        {
//               var pdfFileName = result.text;
//                //waiting.container.unmask();
//                alert('5'); 
//               if(pdfFileName=="error")
//               {
//                    Service.ShowMessageBox('提示', '打印失败。', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
//               }
//                
//               if(pdfFileName!="")
//               {
//                    nwin = window.open(pdfFileName,'_blank', 'height=600, width=800,top=100, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
//                    IsFinished=true;
//               }
//               else
//               {
//                    Service.ShowMessageBox('错误', '生成PDF失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
//               }
//        } 
   
    }

				  
}
//-------------------------------------------------wanghai rcm接口
var treeArrDM;
/**
 * purpose:PDF打印处理方法
 * @class 
 */
System.PrintPDFContent = function ()
{
    //TODO:把cont的判断移动到m_pnlContentMain上。
    var dminfo=ApplicationContext.MainFrame.GetActiveTabDMinfo();
    
    if(dminfo==undefined)
   {
         Service.ShowMessageBox('提示', '当前内容无法进行PDF输出！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
         return;
    }

    var cont=dminfo.Src;
    if(cont=='about:blank')
    {
        Service.ShowMessageBox('提示', '当前内容为空，无法进行PDF输出！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
        return;
    }
    
    if(cont.match('DMlist.html')!=null)
    {
         Service.ShowMessageBox('提示', '当前选中节点属于PMEntry节点，无法进行PDF输出！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
         return;
    }
    if(cont.match('HomePage/HomePage.htm')!=null)
    {
        Service.ShowMessageBox('提示', '首页目前不支持PDF输出！', Ext.MessageBox.OK, Ext.MessageBox.INFO);
        return;
    }
    
    ShowPrintSettingWindow();
    
    /**
     * purpose:显示打印设置窗体
     */
    function ShowPrintSettingWindow()
    {
        Ext.QuickTips.init();
       
        //解决Media player显示在层上面的问题。
        var player=top.ifmMultimediaViewer.multiframe.axCGM;
        if(player!=undefined)
        {
            if(player.controls!=undefined)
            {
                player.controls.stop();
                player.style.display='none';
            }
        }
        
                                        
        var settingWindow = new System.PDFPrintSettingWindow({PrintPDFHandler : PrintPDF});
        settingWindow.show();
        
        settingWindow.on("close",function()
        {
             if(player!=undefined)
            {
                if(player.controls!=undefined)
                {
                    player.style.display='block';
                }
            }
        });
        
        
        
    }
    
    function PrintPDF(printLevel)
    {
        var waiting=Ext.getCmp('mainViewPort');
        waiting.container.mask('正在输出PDF文档……', 'x-mask-loading');
        
        setTimeout(function()
        {
            waiting.container.unmask();
            Print(printLevel); 
        }, 10);	
    }



     function GetTreeCurryNode(node)
    {
    
        if(node==undefined || node.children==undefined)
            return;
            
        for(var i=0;i<node.children.length;i++)
        {
            if(node.children[i].leaf==undefined||!node.children[i].leaf)
            {
              GetTreeCurryNode(node.children[i]);
            }
            else
            {
                treeArrDM[treeArrDM.length]=node.children[i].codeString;
            }
        }
         
    };
    function Print(printLevel)
    {
        var curdmc= dminfo.Dmc;
        
        if(treeArrDM==undefined)
        {
            treeArrDM= new Array();
              for(var j=0;j<top.TOC.classData.length;j++)
              {
                GetTreeCurryNode(top.TOC.classData[j]);
              }
        }
        var treeDM='';
        userInfo = ApplicationContext.IUserInfo();
        
        treeDM = treeArrDM.join(',');
        
        var para1= {dmc:curdmc,version:TOC.Version['Version'],level:printLevel,securet:userInfo.UserScurity,applicContent:userInfo.ApplicContext(),userID:userInfo.UserId,treeDM:treeDM};
        Service.WebService.Call('PrintPDF',
                                 para1,
                                 PrintCallBack,
                                 null
                               );
                               
        function PrintCallBack (result) 
        {
               var pdfFileName = result.text;

               if(pdfFileName=="error")
               {
                    Service.ShowMessageBox('提示', '打印失败。', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
               }
                
               if(pdfFileName!="")
               {
                    nwin = window.open(pdfFileName,'_blank', 'height=600, width=800,top=100, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');

               }
               else
               {
                    Service.ShowMessageBox('错误', '生成PDF失败！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
               }
        } 
   
    }
};

/**
 * purpose:PDF打印设置窗体
 * @class : PDFPrintSettingWindow
 */
System.PDFPrintSettingWindow = Ext.extend(Ext.Window,
{
	title    : '打印',
	closable : true,
	resizable: false,
	width    : 570,
	height   : 250,
	plain    : true,
	modal    : true,
	shadow : false,
	
	m_PrintPDFHandler : null,
	
	constructor: function (config) {
        if (config != undefined && config != null) {
            this.m_PrintPDFHandler = config.PrintPDFHandler;
        }

        System.PDFPrintSettingWindow.superclass.constructor.apply(this, arguments);
    },
  
    initComponent : function () 
    {
        var selectItem =new Ext.form.FieldSet
		({
		    title: '',
		    id:'selectItem',
            autoHeight: true,
            items: [{
                xtype: 'radiogroup',
                labelStyle:'width: 70;font-weight:bold;',
                id:'radiogroup',
                fieldLabel: '选择级别',
                items: [{
                        id:'0level',boxLabel: '当前', name: 'rb-auto', inputValue: '0', checked: true
                    },
                    {
                        id:'1level',boxLabel: '1层', name: 'rb-auto', inputValue: '1'
                    },
                    {
                        id:'2level',boxLabel: '2层', name: 'rb-auto', inputValue: '2'
                    },
                    {
                        id:'3level',boxLabel: '自定义层：', name: 'rb-auto', inputValue: '3'
                    },
                    {
                        id:'curLevelValue',xtype: 'textfield',name: 'txt-test4',fieldLabel: '',value:'3'
                    }
                ]
            }]
		});
		
		var promtInfo =new Ext.form.FieldSet
		({
			title:' 说明',
			html:new Ext.Template('<p><b>参数说明：</b><br/>当前：打印当前数据模块。<br/>1层：打印当前数据模块以及引用的至第一层前所有模块。<br/>2层：打印当前数据模块以及引用的至第二层前所有模块。<br/>自定义层：打印当前数据模块以及引用的至自定义层前所有模块。<br/>自定义层范围：自定义层的打印范围从第0层到第15层。</p>'),
			autoHeight:true,
			collapsible: false
		});
		
		var printButton = { text: '打印', 
		                    scope:this,
		                    handler:function()
					        {
					            var printLevel = this.GetSelectedPrintLevel();
					            //判断是否为0～15的整数
					            if(printLevel<0 || printLevel > 15 || 
					               isNaN(printLevel) || printLevel.indexOf(".") > 0 ) 
					            {
		                            Service.ShowMessageBox('错误', '自定义层的范围错误，应为0——15的整数！', Ext.MessageBox.OK, Ext.MessageBox.ERROR);
				                    return;
                                }
                                
                                this.PringPDF(printLevel);
                                this.close();                        
					        } 
				        };
		
		var cancelButton = 	{ text: '关闭',
		                      scope : this,
		                      handler:function()
	                          {
	                              this.close();
	                                 Ext.destroy(
                                        this.body,
                                        this.buttons,
                                        this.collapseDefaults,
                                        this.footer,
                                        this.header,
                                        this.items,
                                        this.focusEl,
                                        this.bwrap,
                                        this.resizer,
                                        this.dd,
                                        this.tools,
                                        this.proxy,
                                        this.mask,
                                        this.el,
                                        this.container,
                                        this.expandDefaults,
                                        this.initialConfig,
                                        this.keyMap,
                                        this.toolTemplate,
                                        this.events,
                                        this.layout,
                                        this.manager,
                                        this.lastSize
                                        );
                                  
                                        this.body=null;
                                        this.buttons=null;
                                        this.collapseDefaults=null;
                                        this.footer=null;
                                        this.header=null;
                                        this.items=null;
                                        this.focusEl=null;
                                        this.bwrap=null;
                                        this.resizer=null;
                                        this.dd=null;
                                        this.proxy=null;
                                        this.mask=null;
                                        this.tools=null;
                                        this.el=null;
                                        this.container=null;
                                        this.expandDefaults=null;
                                        this.initialConfig=null;
                                        this.keyMap=null;
                                        this.toolTemplate=null;
                                        this.events=null;
                                        this.layout=null;
                                        this.manager=null;
                                        this.lastSize=null;
	                          } 
				            };
		
		
		this.add(selectItem);
		this.add(promtInfo);
		this.addButton(printButton);
		this.addButton(cancelButton);	
    },
    
     onDestroy : function(){
            System.PDFPrintSettingWindow.superclass.onDestroy.call(this);
        
     },
    
    //解决EXT.WINDOW不能被释放的问题。
     beforeDestroy : function(){
            System.PDFPrintSettingWindow.superclass.beforeDestroy.call(this);
     },
   onRender : function(ct, position){
//                   this.modal=false;
                   System.PDFPrintSettingWindow.superclass.onRender.call(this,ct, position);
                   this.el.shadowDisabled=true;
//                    this.mask = this.container.createChild({cls:"ext-el-mask",tag:"iframe"}, this.el.dom);
//                    this.mask.enableDisplayMode("block");
//                    this.mask.hide();
//                    this.modal=true;
     },
    /**
     * purpose:获取选择的打印级别
     */
    GetSelectedPrintLevel : function () 
    {
        var level = 0;
        var radioGroup = Ext.getCmp('radiogroup');

        for(var i= 0 ;i<4;i++)
        {
            var radioButton = radioGroup.items.items[i];
            if( !radioButton.checked )
                continue;
            
            level = radioButton.inputValue;
            if( i == 3 )
            {
                level = radioGroup.items.items[4].getValue();
            }
        }
        
        return level;
    },
    
    /**
     * purpose: 打印PDF
     */
    PringPDF : function (printLevel) 
    {
        if( !Service.IsFunction(this.m_PrintPDFHandler) )
            return;
            
        this.m_PrintPDFHandler(printLevel);
    }
});

 