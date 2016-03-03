/**
 * 作者：SJTU
 */

TOC1 = {};
TOC1.rootText = '飞机测试数据源';
TOC1.modelicText = 'SAMPLE';
TOC1.classData = null;

$.ajax({
	  url: 'MyArray.json',
	  async: false,
	  dataType: 'json',
	  success: function (response) {
		  TOC1.classData = response;
	  }
	});