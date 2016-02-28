//
//定义命名空间
//
(function () {
    if (!window.Service) window.Service = {};
})();


Service.WebServiceManager = function (connectionString) {
    /**
    * 定义常量
    * @type
    */
    this.CONST = {

        /**
          * 异步调用
          * @type Boolean
          */
        ASYNC: true,
        /**
          * 过期时间
          * @type Integer
          */
        TIMEOUT: 0,

        /**
          * 调用类型
          * @type String
          */
        TYPE: "post"
    };

    /**
     * Web服务地址字符串
     * @type String
     */
    this.ConnectionString = connectionString;

    /**
     * purpose:
     * @class 
     * @constructor
     * @serviceName {String} 服务名称
     * @data {Object}  异步调用的数据 
     * @succCallBack {Function}  成功时的回调
     * @errorCallBack {Function}  失败时的回调
     */
    this.Call = function (serviceName, data, succCallBack, errorCallBack) {

        $.ajax({
            async: this.CONST.ASYNC,
            url: this.ConnectionString + serviceName,
            data: data,
            type: this.CONST.TYPE,
            timeout: this.CONST.TIMEOUT,
            success: function (result) {
                if (succCallBack == undefined || succCallBack == null) return;
                succCallBack(result);
            },
            error: function (XmlHttpRequest, textStatus, errorThrow) {
                if (errorCallBack == undefined || errorCallBack == null) return;
                errorCallBack(XmlHttpRequest, textStatus, errorThrow);
            }
        });
    };
}

//定义服务实例
window.Service.WebService = new Service.WebServiceManager('Service/ManagementService.asmx/');