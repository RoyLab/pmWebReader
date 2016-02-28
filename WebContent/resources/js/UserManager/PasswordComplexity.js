/************************************************************************
*功能描述：口令复杂度设置
*作者：chensiming
*日期：2011-08-01  
************************************************************************/

//定义名称空间
Service.RegNameSpace('window.UserManager');
 
/**
 * purpose:口令安全设置管理
 * @class PasswordComplexityEventHandler
 */
 UserManager.PasswordComplexityEventHandler = function()
 {
    var complexityWindow = new UserManager.PasswordComplexityWindow({
        SaveComplexityHandler: SaveComplexity
    });
    
    complexityWindow.show();
    
    function SaveComplexity(){
        var complexityEnabled = complexityWindow.GetComplexityEnabled();
        if(complexityEnabled == true)
        {
            var includeUpperChar = "IncludeUpperChar," + complexityWindow.GetIncludeUpperChar();
            var includeLowerChar = "IncludeLowerChar," + complexityWindow.GetIncludeLowerChar();
            var includeNumber = "IncludeNumber," + complexityWindow.GetIncludeNumber();
            var includeSpecimalChar = "IncludeSpecimalChar," + complexityWindow.GetIncludeSpecimalChar();
            var specimalCharAccount = "SpecimalCharAccount," + complexityWindow.GetSpecimalCharAccount();
            var passwordLength = "PasswordLength," + complexityWindow.GetPasswordLength();
            
            Service.WebService.Call('SavePasswordComplexityConfig',
                {config: includeUpperChar + ";" + includeLowerChar + ";" + includeNumber + ";" + includeSpecimalChar + ";" + specimalCharAccount + ";" + passwordLength},
                function(result)
                {
                    SaveComplexityCallback(result);
                },
                function(XmlHttpRequest, textStatus, errorThrow)
                {
                    SaveComplexityCallback(textStatus);
                });
        }
        else
        {
            Service.WebService.Call('SavePasswordComplexityConfig',
                {config: ""},
                function(result)
                {
                    SaveComplexityCallback(false);
                },
                function(XmlHttpRequest, textStatus, errorThrow)
                {
                    SaveComplexityCallback(textStatus);
                });
        }
    };
    
    function SaveComplexityCallback(result)
    {
        complexity = ApplicationContext.IComplexity();
        
        if(result.text == 'true')
        {
            complexity.SetComplexityEnabled(true);
            if(complexityWindow.GetIncludeUpperChar() == true)
            {
                complexity.SetIncludeUpperChar(true);
            }
            else
            {
                complexity.SetIncludeUpperChar(false);
            }
            if(complexityWindow.GetIncludeLowerChar() == true)
            {
                complexity.SetIncludeLowerChar(true);
            }
            else
            {
                complexity.SetIncludeLowerChar(false);
            }
            if(complexityWindow.GetIncludeNumber() == true)
            {
                complexity.SetIncludeNumber(true);
            }
            else
            {
                complexity.SetIncludeNumber(false);
            }
            if(complexityWindow.GetIncludeSpecimalChar() == true)
            {
                complexity.SetIncludeSpecimalChar(true);
            }
            else
            {
                complexity.SetIncludeSpecimalChar(false);
            }
            complexity.SetSpecimalCharAccount(complexityWindow.GetSpecimalCharAccount());
            complexity.SetPasswordLength(complexityWindow.GetPasswordLength());
        }
        else
        {
            complexity.SetComplexityEnabled(false);
            complexity.SetIncludeUpperChar(false);
            complexity.SetIncludeLowerChar(false);
            complexity.SetIncludeNumber(false);
            complexity.SetIncludeSpecimalChar(false);
            complexity.SetSpecimalCharAccount(0);
            complexity.SetPasswordLength(0);
        }
        
        complexityWindow.close();
    };
 };
 
 /**
 * purpose:口令安全设置窗体
 * @class PasswordComplexityWindow
 */
 UserManager.PasswordComplexityWindow = Ext.extend(Ext.Window,{
        title: '口令安全设置',
        width: 330,
        height: 330,
        collapsible: false,
        closable: false,
        resizable: false,
        defaults: {
            border: false
        },
        layout: 'fit',
        buttonAlign: 'center',
        iconCls: 'iconUsers',
        keys: [{
            key: Ext.EventObject.ENTER,
            fn: this.SaveProfile,
            scope: this
        }],

        cbComplexityEnabled: null,
        cbIncludeUpperChar: null,
        cbIncludeLowerChar: null,
        cbIncludeNumber: null,
        cbIncludeSpecimalChar: null,
        nfSpecimalCharAccount: null,
        nfPasswordLength: null,

        m_SaveComplexityHandler: null,

        constructor: function (config) {
            if (config != undefined && config != null) {
                this.m_SaveComplexityHandler = config.SaveComplexityHandler;
            }

            System.ProfileWindow.superclass.constructor.apply(this, arguments);
        },

        initComponent: function () {
            var complexityEnabled = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '启用口令复杂度验证密码',
                name: 'complexity',
                checked: false
            });
            this.cbComplexityEnabled = complexityEnabled;
            
            var includeUpperChar = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '必须包含大写英文字母',
                hideLabels: true,
                name: 'complexity',
                checked: true,
                disabled: true
            });
            this.cbIncludeUpperChar = includeUpperChar;

            var includeLowerChar = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '必须包含小写英文字母',
                name: 'complexity',
                checked: true,
                disabled: true
            });
            this.cbIncludeLowerChar = includeLowerChar;
            
            var includeNumber = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '必须包含数字',
                name: 'complexity',
                checked: true,
                disabled: true
            });
            this.cbIncludeNumber = includeNumber;
            
            var includeSpecimalChar = new Ext.form.Checkbox({
                layout: 'fit',
                boxLabel: '必须包含特殊字符',
                name: 'complexity',
                checked: true,
                disabled: true
            });
            this.cbIncludeSpecimalChar = includeSpecimalChar;
            
            var specimalCharAccount = new Ext.form.NumberField({
                fieldLabel: '最少特殊字符个数',
                name: 'specimalCharAccount',
                allowNegative: false,
                allowDecimals: false,
                allowBlank: false,
                blankText: '不允许为空！',
                decimalPrecision: 0,
                minValue: 1,
                maxValue: 30,
                maxText: '特殊字符个数最大值为30！',
                minText: '特殊字符个数最小值为1！',
                maskRe: /\d/,
                disabled: true
            });
            this.nfSpecimalCharAccount = specimalCharAccount;
            
            var passwordLength = new Ext.form.NumberField({
                fieldLabel: '密码最小长度',
                name: 'passwordLength',
                allowBlank: false,
                blankText: '不允许为空！',
                allowNegative: false,
                allowDecimals: false,
                decimalPrecision: 0,
                minValue: 1,
                maxValue: 30,
                maxText: '密码最小长度最大值为30！',
                minText: '密码最小长度最小值为1！',
                maskRe: /\d/,
                disabled: true
            });
            this.nfPasswordLength = passwordLength;

            var formPanel = new Ext.form.FormPanel({
                bodyStyle: 'padding-top:20px; background:transparent;',
                labelPad: 0,
                frame: false,
                hideLabels: true,
                defaults: {
                    selectOnFocus: true,
                    invalidClass: null,
                    msgTarget: 'side'
                },
                items: [
                    complexityEnabled,
                    {
                        xtype: 'fieldset',
                        title: '口令复杂度策略',
                        hideLabels: true,
                        items: [includeUpperChar,includeLowerChar,includeNumber,includeSpecimalChar,
                            {
                                xtype: 'fieldset',
                                title: '附加项',
                                labelAlign: 'right',
                                labelWidth: 110,
                                width: 'auto',
                                items: [specimalCharAccount,passwordLength]
                            }
                        ]
                    }
                ]
            });

            var saveButton = new Ext.Button({
                text: '设置',
                scope: this,
                handler: function(){
                    if(formPanel.getForm().isValid())
                    {
                        this.SaveComplexity();
                    }
                }
            });

            var cancelButton = new Ext.Button({
                text: '取消',
                scope: this,
                handler: function(){
                    this.close();
                }
            });

            this.add(formPanel);
            this.addButton(saveButton);
            this.addButton(cancelButton);

            this.cbComplexityEnabled.addListener("check",function(){
                if(this.checked == false)
                {
                    includeUpperChar.setDisabled(true);
                    includeLowerChar.setDisabled(true);
                    includeNumber.setDisabled(true);
                    includeSpecimalChar.setDisabled(true);
                    specimalCharAccount.setDisabled(true);
                    passwordLength.setDisabled(true);
                    specimalCharAccount.setValue(1);
                    passwordLength.setValue(1);
                }
                else
                {
                    includeUpperChar.setDisabled(false);
                    includeLowerChar.setDisabled(false);
                    includeNumber.setDisabled(false);
                    includeSpecimalChar.setDisabled(false);
                    if(includeSpecimalChar.checked == true)
                        specimalCharAccount.setDisabled(false);
                    else
                    {
                        specimalCharAccount.setDisabled(true);
                        specimalCharAccount.setValue(1);
                    }
                    passwordLength.setDisabled(false);
                }
            });
            this.cbIncludeSpecimalChar.addListener("check",function(){
                if(this.checked == false)
                {
                    specimalCharAccount.setDisabled(true);
                    specimalCharAccount.setValue(1);
                }
                else
                {
                    specimalCharAccount.setDisabled(false);
                }
            });
            this.addListener("show",this.Initialize,this);
        },
        
        Initialize: function(){
            complexityRule = ApplicationContext.IComplexity();
            if(complexityRule.GetComplexityEnabled() == true)
            {
                this.cbComplexityEnabled.setValue(true);
                this.cbIncludeUpperChar.setValue(complexityRule.GetIncludeUpperChar());
                this.cbIncludeLowerChar.setValue(complexityRule.GetIncludeLowerChar());
                this.cbIncludeNumber.setValue(complexityRule.GetIncludeNumber());
                if(complexityRule.GetIncludeSpecimalChar() == true)
                {
                    this.cbIncludeSpecimalChar.setValue(true);
                    this.nfSpecimalCharAccount.setValue(complexityRule.GetSpecimalCharAccount());
                }
                else
                {
                    this.cbIncludeSpecimalChar.setValue(false);
                    this.nfSpecimalCharAccount.setValue(1);
                }
                this.nfPasswordLength.setValue(complexityRule.GetPasswordLength());
            }
            else
            {
                this.cbComplexityEnabled.setValue(false);
                this.cbIncludeUpperChar.setValue(true);
                this.cbIncludeLowerChar.setValue(true);
                this.cbIncludeNumber.setValue(true);
                this.cbIncludeSpecimalChar.setValue(true);
                this.nfSpecimalCharAccount.setValue(1);
                this.nfPasswordLength.setValue(1);
            }
        },
        
        SaveComplexity: function(){
            if(!Service.IsFunction(this.m_SaveComplexityHandler))
                return;
                
            this.m_SaveComplexityHandler();
        },
        
        GetComplexityEnabled: function(){
            return this.cbComplexityEnabled.getValue();
        },
        GetIncludeUpperChar: function(){
            return this.cbIncludeUpperChar.getValue();
        },
        GetIncludeLowerChar: function(){
            return this.cbIncludeLowerChar.getValue();
        },
        GetIncludeNumber: function(){
            return this.cbIncludeNumber.getValue();
        },
        GetIncludeSpecimalChar: function(){
            return this.cbIncludeSpecimalChar.getValue();
        },
        GetSpecimalCharAccount: function(){
            if(this.cbIncludeSpecimalChar.getValue() == true)
            {
                return this.nfSpecimalCharAccount.getValue();
            }
            else
            {
                return 0;
            }
        },
        GetPasswordLength: function(){
            return this.nfPasswordLength.getValue();
        }
 });
 
 /**
 * purpose:口令复杂度对象
 * @class PasswordComplexityRule
 */
 UserManager.PasswordComplexityRule = function()
 {
    includeUpperChar = null;
    includeLowerChar = null;
    includeNumber = null;
    includeSpecimalChar = null;
    specimalCharAccount = null;
    passwordLength = null;
    complexityEnabled = null;
    
    Initialize.call(this);

    function Initialize()
    {
        if(this.complexityEnabled == null)
        {
            Service.WebService.Call('LoadPasswordComplexityConfig',null,
                function(result)
                {
                    if(result.text == "")
                    {
                        SetMemberOfNoRule();
                    }
                    else
                    {
                        var rules = result.text.split('&');
                        if(rules[0] == 'true')
                        {
                            includeUpperChar = true;
                        }
                        else
                        {
                            includeUpperChar = false;
                        }
                        if(rules[1] == 'true')
                        {
                            includeLowerChar = true;
                        }
                        else
                        {
                            includeLowerChar = false;
                        }
                        if(rules[2] == 'true')
                        {
                            includeNumber = true;
                        }
                        else
                        {
                            includeNumber = false;
                        }
                        if(rules[3] == 'true')
                        {
                            includeSpecimalChar = true;
                        }
                        else
                        {
                            includeSpecimalChar = false;
                        }
                        specimalCharAccount = rules[4];
                        passwordLength = rules[5];
                        complexityEnabled = true;
                    }
                },
                function(XmlHttpRequest,textStatus,errorThrow)
                {
                    SetMemberOfNoRule();
                }
            );
        }
    };
    
    function SetMemberOfNoRule()
    {
        includeUpperChar = false;
        includeLowerChar = false;
        includeNumber = false;
        includeSpecimalChar = false;
        specimalCharAccount = 1;
        passwordLength = 1;
        complexityEnabled = false;
    };
    
    this.GetComplexityEnabled = function()
    {
        return complexityEnabled;
    };
    this.SetComplexityEnabled = function(value)
    {
        complexityEnabled = value;
    };
    
    this.GetIncludeUpperChar = function()
    {
        return includeUpperChar;
    };
    this.SetIncludeUpperChar = function(value)
    {
        includeUpperChar = value;
    };
    
    this.GetIncludeLowerChar = function()
    {
        return includeLowerChar;
    };
    this.SetIncludeLowerChar = function(value)
    {
        includeLowerChar = value;
    };
    
    this.GetIncludeNumber = function()
    {
        return includeNumber;
    };
    this.SetIncludeNumber = function(value)
    {
        includeNumber = value;
    };
   
    this.GetIncludeSpecimalChar = function()
    {
        return includeSpecimalChar;
    };
    this.SetIncludeSpecimalChar = function(value)
    {
        includeSpecimalChar = value;
    };
   
    this.GetSpecimalCharAccount = function()
    {
        return specimalCharAccount;
    };
    this.SetSpecimalCharAccount = function(value)
    {
        specimalCharAccount = value;
    };
   
    this.GetPasswordLength = function()
    {
        return passwordLength;
    };
    this.SetPasswordLength = function(value)
    {
        passwordLength = value;
    };
 };
 
  /**
 * purpose:口令复杂度验证
 * @class PasswordComplexityValidate
 */
 UserManager.PasswordComplexityValidate = function()
 {
    //数字Unicode编码
    NumberBegin = null;
    NumberEnd = null;
    //大写英文字母Unicode编码
    UpperCharBegin = null;
    UpperCharEnd = null;
    //小写英文字母Unicode编码
    LowerCharBegin = null;
    LowerCharEnd = null;
    //持有一个口令复杂度对象
    complexityRule=null;
    
    Initialize.call(this);
    
    function Initialize()
    {
        NumberBegin = 48;
        NumberEnd = 57;
        UpperCharBegin = 65;
        UpperCharEnd = 90;
         LowerCharBegin = 97;
        LowerCharEnd = 122;
        complexityRule=new UserManager.PasswordComplexityRule()
    };
    
    //验证是否为数字
    this.IsNumber = function(ch)
    {
        charCode = ch.charCodeAt(0);
        if(charCode < 0 || charCode > 127)
        {
            return false;
        }
        
        if(charCode >= NumberBegin && charCode <= NumberEnd)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    //验证是否为大写英文字母
    this.IsUpperChar = function(ch)
    {
        charCode = ch.charCodeAt(0);
        if(charCode < 0 || charCode > 127)
        {
            return false;
        }
        
        if(charCode >= UpperCharBegin && charCode <= UpperCharEnd)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    //验证是否为小写英文字母
    this.IsLowerChar = function(ch)
    {
        charCode = ch.charCodeAt(0);
        if(charCode < 0 || charCode > 127)
        {
            return false;
        }
        
        if(charCode >= LowerCharBegin && charCode <= LowerCharEnd)
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    //验证是否为特殊字符
    this.IsSpecimalChar = function(ch)
    {
        charCode = ch.charCodeAt(0);
        if(charCode < 0 || charCode > 127)
        {
            return false;
        }
        
        if(!this.IsNumber(ch) && !this.IsUpperChar(ch) && !this.IsLowerChar(ch))
        {
            return true;
        }
        else
        {
            return false;
        }
    };
    //20120207 将检验的部分从userManagerUI拿过来以多次调用
    this.isPasswordValid=function(passwordValue)
    {
        message = '';
        if(complexityRule.GetComplexityEnabled() == true)
        {
            
            validate = this;
            if(complexityRule.GetIncludeUpperChar() == true)
            {
                result = false;
                for(i=0; i<passwordValue.length; i++)
                {
                    if(validate.IsUpperChar(passwordValue.charAt(i)) == true)
                    {
                        result = true;
                        break;
                    }
                }
                if(result == false)
                    message = '密码必须包含大写英文字母！' 
            }
            if(complexityRule.GetIncludeLowerChar() == true)
            {
                result = false;
                for(i=0; i<passwordValue.length; i++)
                {
                    if(validate.IsLowerChar(passwordValue.charAt(i)) == true)
                    {
                        result = true;
                        break;
                    }
                }
                if(result == false)
                {
                    message += '密码必须包含小写英文字母！';
                }
            }
            if(complexityRule.GetIncludeNumber() == true)
            {
                result = false;
                for(i=0; i<passwordValue.length; i++)
                {
                    if(validate.IsNumber(passwordValue.charAt(i)) == true)
                    {
                        result = true;
                        break;
                    }
                }
                if(result == false)
                {
                    message += '密码必须包含数字！';
                }
            }
            if(complexityRule.GetIncludeSpecimalChar() == true)
            {
                result = complexityRule.GetSpecimalCharAccount();
                for(i=0; i<passwordValue.length; i++)
                {
                    if(validate.IsSpecimalChar(passwordValue.charAt(i)) == true)
                        result--;
                    if(result <= 0)
                        break;
                }
                if(result > 0)
                {
                    message += '密码必须包含' + complexityRule.GetSpecimalCharAccount() + '个或以上的特殊字符！';
                }
            }
            valueLength = complexityRule.GetPasswordLength();
            if(passwordValue.length < valueLength)
            {
                message += '密码长度不能小于' + valueLength + '！';
            }
        }
        
        return message;
        
    };
 };