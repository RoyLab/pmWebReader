//
//定义命名空间
//
(function () {
    if (!window.MessageBox) window.MessageBox = {};
})();

MessageBox.Helper = {
	ShowMessageBox:function (config)
	{
		var messageForm = new MessageBox.MessageWindow(config);
		messageForm.show();
	}
}


MessageBox.MessageWindow = Ext.extend(Ext.Window, 
{ 
    //初始化窗体属性
    width: 280,
    height: 180,
    collapsible: false,
    closable: false,
    resizable: false,
    defaults: { border: false },
    layout:'fit',
    buttonAlign: 'center',
    iconCls: 'iconUsers',

	modal:true,

    checkBoxRecover : null,
    lblMessage : null,
    frmFormPanel : null,

    m_ConfirmHandler : null,
    m_CancleHandler : null,
	m_Message : '',
    m_FileName : '',

    constructor : function (config) 
    {
        if( config != undefined && config != null )
        {    
            this.m_ConfirmHandler = config.ConfirmHandler;
            this.m_CancleHandler = config.CancleHandler;
			this.m_Message = config.Message;
			this.m_FileName = config.FileName;
        }
                
        MessageBox.MessageWindow.superclass.constructor.apply(this, arguments);
    },
    
    //定义窗体方法
    initComponent : function ()
    {
        this.setTitle("导入确认");
    
        var Reader = new Ext.data.ArrayReader
            ({},[
                  {name: 'MedelName', type: 'string'},
                  {name: 'MedelScript', type: 'string'}
            ]);

		var checkReconver=new Ext.form.Checkbox({
            boxLabel: '覆盖导入',
			name:'cb-auto-1',
			hideLabel:true,
            checked: true
        });
		this.checkBoxRecover = checkReconver;

		var massage=new Ext.form.Label
          ({ 
                   cls: 'massege',
                   id : 'massege',
                   xtype: 'label', 
                   name: 'massege',
                   text: this.m_Message
          });
        
      this.lblMessage = massage;
                            
      var formPanel=new Ext.form.FormPanel
          ({
                   bodyStyle: 'padding-top:20px; background:white;text-indent: 20px',
                   labelAlign: 'right',
                   labelWidth: 55,
                   labelPad: 0,
                   items: 
                   [massage,
					{
						xtype: 'checkboxgroup',
						hideLabel: true,
						columns: 1,
						style: 'position: relative; left: 150;',
						items: [checkReconver]
					  }]
           }); 
                 
      this.frmFormPanel = formPanel;
      
       var ConfirmButton=new Ext.Button
          ({
                   text : '导入',
				   scope: this,
                   handler : this.ConfirmClick
          });
            
      var cancelButton=new  Ext.Button({
                         text : '取消',
						 scope: this,
						 handler: this.CancleClick
                });   
           
           //添加窗体控件     
       this.add(formPanel);
       this.addButton(ConfirmButton);
      
       this.addButton(cancelButton);
    },
    
    ConfirmClick : function (button)
    {
		if( this.m_ConfirmHandler != undefined  )
        {
            this.m_ConfirmHandler(this.checkBoxRecover.checked,this.FileName); 
        }
		this.close();
    },
    
    CancleClick : function (button)
    {
		if( this.m_CancleHandler != undefined  )
        {
            this.m_CancleHandler(); 
        }
		this.close();
    }
});