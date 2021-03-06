﻿///////////////////////////////////////////////////////////////////////////////
//功能描述：出版物树加载器
//作者：wuqifeng
//日期：2009-02-15
///////////////////////////////////////////////////////////////////////////////

/*
* Version 0.2.3
*
* Ext.tree.MyTreeLoader
*
* @author    Dott. Ing.  Marco Bellocchi
* @date      24. April 2008
* @license Ext.tree.MyTreeLoader.js is licensed under the terms of the Open Source
* LGPL 3.0 license.
*
* License details: http://www.gnu.org/licenses/lgpl.html
*/

//===================================================================== -->
Ext.tree.MyTreeLoader = function (config) {
    var canFireLoadEvent = true;
    var treeNodeProvider = null;
    var loading = false;

    Ext.apply(this, config);
    Ext.tree.MyTreeLoader.superclass.constructor.call(this, config);
    treeNodeProvider = this.treeNodeProvider;

    var processResponse = function(o, node, callback) {
        try {
            node.beginUpdate();
            for (var i = 0, len = o.length; i < len; i++) {
                var n = this.createNode(o[i]);
                if (n) {
                    node.appendChild(n);
                }
            }
            node.endUpdate();
        }
        catch (e) {
            canFireLoadEvent = false;
            this.fireEvent("loadexception", this, node, treeNodeProvider.data);
        }

        if (typeof callback == "function") {
            callback();
        }
        if (canFireLoadEvent === true)
            this.fireEvent("load", this, node, treeNodeProvider.data);
    } .createDelegate(this);

    var requestData = function(node, callback) {
        if (this.fireEvent("beforeload", this, node, callback) !== false) {
            loading = true;
            var nodesToAdd = null;
            try {
                nodesToAdd = treeNodeProvider.getNodes(treeNodeProvider.data);
            }
            catch (e) {
                canFireLoadEvent = false;
                this.fireEvent("loadexception", this, node, treeNodeProvider.data);
            }
            if (typeof nodesToAdd != "undefined" && nodesToAdd != null)
                processResponse(nodesToAdd, node, callback);
            loading = false;
        }
        else {
            canFireLoadEvent = false;
        }
    } .createDelegate(this);

    this.load = function(node, callback) {
        canFireLoadEvent = true;
        if (this.clearOnLoad) {
            while (node.firstChild) {
                var tmpNode = node.firstChild;
                node.removeChild(tmpNode);
                tmpNode.destroy();
            }
        }
        if (this.doPreload(node)) {
            if (typeof callback == "function") {
                callback();
            }
        }
        else if (treeNodeProvider) {
            requestData(node, callback);
        }
    };

    this.isLoading = function() {
        return loading;
    };

    this.updateTreeNodeProvider = function(obj) {
        if (treeNodeProvider) {
            treeNodeProvider.setData(obj);
        }
    };

    this.getTreeNodeProvider = function() {
        return treeNodeProvider;
    };

    this.setTreeNodeProvider = function(newTreeNodeProvider) {
        if (newTreeNodeProvider == null || (typeof newTreeNodeProvider == 'undefined'))
            throw 'setTreeNodeProvider, newTreeNodeProvider == null || (typeof newTreeNodeProvider == undefined)';

        treeNodeProvider = newTreeNodeProvider;
    };

};

//===================================================================== -->
Ext.tree.MyTreeLoader = Ext.extend(Ext.tree.MyTreeLoader, Ext.tree.TreeLoader);
