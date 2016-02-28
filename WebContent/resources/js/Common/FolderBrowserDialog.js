///////////////////////////////////////////////////////////////////////////////
//功能描述：目录、文件选择器类
//作者：wuqifeng
//日期：2009-02-19
///////////////////////////////////////////////////////////////////////////////
//===================================================================== -->
function FileSystemObject() {
    var createFileNodes = false;
    var fso;
    Initialize();

    function Initialize() {
        try {
            fso = new ActiveXObject("Scripting.FileSystemObject");
        }
        catch (e) { return null; }
    };

    this.setCanSelectFiles = function(value) {
        createFileNodes = value;
    };

    this.CreateFolderNode = function(node) {
        var folderObj = fso.GetFolder(node.attributes.path);
        if (folderObj.SubFolders.Count < 0)
            return;

        var en = new Enumerator(folderObj.SubFolders);
        while (!en.atEnd()) {
            var dir = en.item();
            var text = dir.Name;
            var path = dir.Path;
            var folderNode = new Ext.tree.AsyncTreeNode({
                text: text,
                path: path,
                singleClickExpand: true,
                children: [],
                draggable: false
            });

            node.appendChild(folderNode);

            en.moveNext();
        }

        if (createFileNodes) {
            var files = folderObj.Files;
            CreateFileNode(node, files);
        }
    };

    function CreateFileNode(ownnerNode, filesObj) {
        var en = new Enumerator(filesObj);
        while (!en.atEnd()) {
            var dir = en.item();
            var text = dir.Name;
            var path = dir.Path;
            var fileNode = new Ext.tree.AsyncTreeNode({
                text: text,
                path: path,
                leaf: true,
                draggable: false
            });

            ownnerNode.appendChild(fileNode);

            en.moveNext();
        }
    };

    function CreateDirverNode(dir) {
        var node;
        var text = dir.RootFolder.Type + ' (' + dir.DriveLetter + ')';
        var path = dir.RootFolder.Path;
        var folderObj = fso.GetFolder(path);
        if (folderObj.SubFolders.Count < 0) {
            node = {
                text: text,
                path: path,
                leaf: true
            }
        }
        else {
            node = {
                text: text,
                path: path,
                children: [],
                leaf: false
            }
        }

        return node;
    };

    this.GetDriList = function() {
        var driJson = [];
        var en = new Enumerator(fso.Drives);
        while (!en.atEnd()) {
            var dir = en.item();
            if (dir.IsReady) {
                var node = CreateDirverNode(dir);
                if (node != null || typeof node != 'undefined')
                    driJson.push(node);
            }

            en.moveNext();
        }

        return driJson;
    };
};

//===================================================================== -->
FolderBrowserDialog = function() {
    var fo, fileNameControl, mainWindow;

    function Initialize(showFile) {
        fo = new FileSystemObject();
        fo.setCanSelectFiles(showFile);
    };

    function getDirvers() {
        var dirList = [];
        if (fo != null) {
            try {
                dirList = fo.GetDriList();
            }
            catch (e) { }
        }

        return dirList;
    };

    function closeWindow() {
        if (mainWindow != null && typeof mainWindow != 'undefined')
            mainWindow.hide();
    };

    function showWinodw(animateTarget) {
        if (mainWindow != null && typeof mainWindow != 'undefined')
            mainWindow.show(animateTarget);
    };

    function getValue() {
        if (fileNameControl != null && typeof fileNameControl != 'undefined')
            return fileNameControl.getValue();

        return null;
    };

    function focus() {
        if (fileNameControl != null && typeof fileNameControl != 'undefined')
            fileNameControl.focus(true, true);
    };

    function WindowsSyncSize() {
        try {
            if (mainWindow != null && typeof mainWindow != 'undefined') {
                mainWindow.syncSize();
                mainWindow.center();
            }
        }
        catch (e) { }
    };

    return {
        Title: '浏览目录',
        OKButtonText: '确定',
        CancelButtonText: '取消',
        DirectryTextBoxText: '路径',
        ShowFile: false,

        ShowDialog: function(AnimateTarget, OKCallBack, CancelCallBack) {
            Ext.QuickTips.init();
            if (!mainWindow) {
                Initialize(this.ShowFile);

                var dirTree = new Ext.tree.TreePanel
        (
            {
                id: 'dirTree',
                title: '浏览目录',
                border: true,
                autoScroll: true,
                containerScroll: true,
                rootVisible: true,
                lines: true,
                animate: false,
                animCollapse: false,
                preloadChildren: true,
                clearOnLoad: true,
                maskDisabled: false,
                width: 383,
                height: 190,
                collapsible: true,
                collapsed: true,
                loader: new Ext.tree.TreeLoader
                (
                    {
                        preloadChildren: true,
                        clearOnLoad: false
                    }
                )
            }
        );

                dirTree.on('collapse', function(p) {
                    WindowsSyncSize();
                });

                dirTree.on('expand', function(p) {
                    WindowsSyncSize();
                });

                dirTree.on('render', function(control) {
                    var drivers = getDirvers();
                    var rootNode = new Ext.tree.AsyncTreeNode({
                        id: 'root',
                        text: '我的电脑',
                        path: '',
                        expanded: true,
                        singleClickExpand: true,
                        children: drivers,
                        draggable: false
                    });

                    dirTree.setRootNode(rootNode);
                });

                dirTree.on('click', function(node, e) {
                    var path = node.attributes.path;
                    if (path != null && typeof path != 'undefined')
                        fileNameControl.setValue(path);
                    else
                        fileNameControl.setValue('');

                    if (!node.isLeaf()) {
                        node.expand();
                    }
                });

                dirTree.on('beforeexpandnode', function(node, deep, anim) {
                    dirTree.body.mask("请稍候...");
                    try {
                        if (!node.isLeaf()) {
                            if (node.attributes.id != 'root') {
                                if (node.childNodes.length == 0)
                                    fo.CreateFolderNode(node);
                            }
                        }
                    }
                    finally {
                        dirTree.body.unmask();
                    }
                });

                fileNameControl = new Ext.form.TextField
    ({
        fieldLabel: this.DirectryTextBoxText,
        anchor: '100%',
        //allowBlank: false,
        //blankText: '路径不允许为空！',
        invalidText: this.DirectryTextBoxText + '不允许为空！',
        tabIndex: 0,
        value: '',
        name: 'fileNameControl'
    });

                var pnlfileName = new Ext.FormPanel
    ({
        id: 'pnlfileName',
        region: 'south',
        frame: true,
        labelWidth: 60,
        autoScroll: false,
        containerScroll: false,
        items: [fileNameControl]
    });

                mainWindow = new Ext.Window
    ({
        title: this.Title,
        id: 'mainWindow',
        closable: true,
        width: 400,
        plain: true,
        modal: true,
        resizable: false,
        autoHeight: true,
        closeAction: 'hide',
        items: [dirTree, pnlfileName],
        keys: [{
            key: Ext.EventObject.ENTER,
            fn: OKButtonClicked,
            scope: this
}],
            buttons:
        [
            { text: this.OKButtonText, handler: function() {
                OKButtonClicked();
            }
            },

            { text: this.CancelButtonText, handler: function() {
                CancelButtonClicked();
            }
            }
        ]
        });

                function OKButtonClicked() {
                    if (fileNameControl.isValid()) {
                        var value = fileNameControl.getValue();
                        if (value == null || typeof value == 'undefined' || value == '') {
                            fileNameControl.markInvalid(this.DirectryTextBoxText + '不允许为空！');
                            focus();
                            return;
                        }

                        if (typeof OKCallBack == "function") {
                            OKCallBack();
                        }
                    }
                };

                function CancelButtonClicked() {
                    if (typeof CancelCallBack == "function") {
                        CancelCallBack();
                    }

                    closeWindow();
                };

                mainWindow.on('show', function(control) {
                    focus();
                });
            }

            showWinodw(AnimateTarget);
        },

        GetValue: function() {
            return getValue();
        },

        Close: function() {
            closeWindow();
        },

        SetFocus: function() {
            focus();
        },

        CanUse: function() {
            var fso;
            try {
                fso = new ActiveXObject("Scripting.FileSystemObject");
            }
            catch (e) { fso = null; }

            if (!fso || fso == null || typeof fso == 'undefined') {
                return false;
            }
            else
                return true;
        }
    };
} ();

//===================================================================== -->
SaveXmlFileDialog = function()
{
    this.SaveFileFromUrl = function(fileUrl,saveFileName)
    {
        var xh;
        try{
            if(!xh)
                xh = new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch(e){xh = null;}
        
        if(xh != null && typeof xh != 'undefined')
        {
            xh.open('Get',fileUrl,false,'','');
            xh.send();
            
            var fileName = saveFileName;
            if(!saveFileName)
                fileName = GetFileName(fileUrl);
            
            if(!fileName || typeof fileName == 'undefined' || fileName == '')
                return false;
                
            this.SaveFile(xh.responseXml.xml,fileName);
            
            return true;
        }
        else
        {
            return false;
        }
    };
    
    this.SaveFile = function(contentString,fileName)
    {
        var newWindow = window.open('','文件下载','channelmode=yes,menubar=no,scrollbars=no,fullscreen=no,toolbar=no,resizable=no,location=no,height=5,width=5,titlebar=no,status=no,left=0,top=0');
        
        try{
            var bodyEle = newWindow.document.createElement('body');
            var frameEle = newWindow.document.createElement('iframe');
            frameEle.id = 'downloadFrame';
            frameEle.loaction = 'about:blank';
            frameEle.style.display = 'none';
            
            bodyEle.appendChild(frameEle);
            newWindow.document.appendChild(bodyEle);

            var newDoc = frameEle.contentWindow.document;
            newDoc.open();
            newDoc.write(contentString);
            newDoc.close();
            newDoc.execCommand('SaveAs',true,fileName);
        }
        catch(e){
            alert('下载时发生错误，下载失败！');
        }
        finally
        {
            try{
                if(newWindow != null && typeof newWindow != 'undefined')
                    newWindow.close();
            }
            catch(e){}
        }
    };
    
    function GetFileName(fileUrl)
    {
        if(!fileUrl)
            return file;
            
        var index = fileUrl.lastIndexOf('/');
        var fileName = fileUrl.substr(index + 1);
        
        return fileName;
    }
};