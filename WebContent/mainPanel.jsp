<%@ page language="java" contentType="text/html; charset=utf-8"
<html>
<head>
	<meta charset="UTF-8">
	<title>Complex Layout - jQuery EasyUI Demo</title>
	<link rel="stylesheet" type="text/css" href="resources/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="resources/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="resources/style/workspace.css">
	<script type="text/javascript" src="resources/js/jquery.min.js"></script>
	<script type="text/javascript" src="resources/js/jquery.easyui.min.js"></script>
</head>

<body>

<div class="main easyui-layout" data-options="fit:true">

	<script>
	function changetoC(){
		$('#remarks').menubutton({
			text:'备注',
		});
		$('#navigation').menubutton({
			text:'导航',
		});
        $('#management').menubutton({
			text:'管理',
		});
		$('#system').menubutton({
			text:'系统',
		});
		$('#hheellpp').menubutton({
			text:'帮助',
		});

		$('#hide').tooltip({
			content:'显示/隐藏',
			position:'right',
		});
		$('#home2').tooltip({
			content:'主页',
			position:'right',
		});
		$('#back2').tooltip({
			content:'后退',
			position:'right',
		});
		$('#forward2').tooltip({
			content:'前进',
			position:'right',
		});
		$('#media').tooltip({
			content:'多媒体',
			position:'right',
		});
		$('#remarks2').tooltip({
			content:'备注',
			position:'right',
		});
		$('#exportremarks2').tooltip({
			content:'导出备注',
			position:'right',
		});
		$('#viewcomment').tooltip({
			content:'查看意见',
			position:'right',
		});
		$('#addcomment').tooltip({
			content:'添加意见',
			position:'right',
		});
		$('#exportdmfiles').tooltip({
			content:'导出DM文件',
			position:'right',
		});
		$('#print2').tooltip({
			content:'打印',
			position:'right',
		});
		$('#applicability2').tooltip({
			content:'适用性',
			position:'right',
		});
		$('#maintaintask').tooltip({
			content:'维护任务',
			position:'right',
		});
		$('#lock').tooltip({
			content:'锁定',
			position:'right',
		});

		$('#left').panel({
			title:'导航',
		});
		$('#left1').panel({
			title:'导航树',
		});
		$('#left2').panel({
			title:'书签',
		});
		$('#left3').panel({
			title:'访问记录',
		});
		$('#left4').panel({
			title:'组合查询',
		});

		var tab = $('#center').tabs('getTab',0); // 取得第一个tab 
		$('#center').tabs('update', { 
			tab:tab, 
			options: { 
				title: '首页'
			} 
		});
		var tab = $('#center').tabs('getTab',1); // 取得第一个tab 
		$('#center').tabs('update', { 
			tab:tab, 
			options: { 
				title: '全文搜索'
			} 
		});

		$('#mm1').menu('setText', {
			target:home,
			text: '首页'
		});
		$('#mm1').menu('setText', {
			target: back,
			text: '后退'
		});
		$('#mm1').menu('setText', {
			target: forward,
			text: '前进'
		});
		$('#mm2').menu('setText', {
			target:editremarks,
			text: '编辑备注'
		});
		$('#mm2').menu('setText', {
			target:exportremarks,
			text: '导出备注'
		});
		$('#mm3').menu('setText', {
			target: usermanagement,
			text: '用户管理'
		});
		$('#mm3').menu('setText', {
			target: usermaintain,
			text: '角色维护'
		});
		$('#mm3').menu('setText', {
			target: command,
			text: '口令安全设置'
		});
		$('#mm3').menu('setText', {
			target: advicemanagement,
			text: '意见管理'
		});
		$('#mm4').menu('setText', {
			target: userconfiguration,
			text: '用户配置'
		});
		$('#mm4').menu('setText', {
			target:applicability,
			text: '适用性'
		});
		$('#mm4').menu('setText', {
			target:interfaceconfiguration,
			text: '界面配置'
		});
		$('#mm4').menu('setText', {
			target:pr,
			text:'打印'
		});
		$('#mm4').menu('setText', {
			target:log,
			text:'注销'
		});
		$('#mm4').menu('setText', {
			target:changelanguage,
			text: '语言选项'
		});
		$('#mm4').menu('setText', {
			target:clo,
			text: '关闭'
		});
		$('#mm5').menu('setText', {
			target:help,
			text: '帮助'
		});
		$('#mm5').menu('setText', {
			target:about,
			text: '关于'
		});
	}
	</script>
    <script>
	function changetoE(){
		$('#remarks').menubutton({
			text:'Remarks',
		});
		$('#navigation').menubutton({
			text:'Navigation',
		});
        $('#management').menubutton({
			text:'Management',
		});
		$('#system').menubutton({
			text:'System',
		});
		$('#hheellpp').menubutton({
			text:'Help',
		});

		$('#hide').tooltip({
			content:'Hide/Display',
			position:'right',
		});
		$('#home2').tooltip({
			content:'HomePage',
			position:'right',
		});
		$('#back2').tooltip({
			content:'Backward',
			position:'right',
		});
		$('#forward2').tooltip({
			content:'Forward',
			position:'right',
		});
		$('#media').tooltip({
			content:'Media',
			position:'right',
		});
		$('#remarks2').tooltip({
			content:'Remarks',
			position:'right',
		});
		$('#exportremarks2').tooltip({
			content:'Export Remarks',
			position:'right',
		});
		$('#viewcomment').tooltip({
			content:'View Comments',
			position:'right',
		});
		$('#addcomment').tooltip({
			content:'Add Comments',
			position:'right',
		});
		$('#exportdmfiles').tooltip({
			content:'Export DM Files',
			position:'right',
		});
		$('#print2').tooltip({
			content:'Print',
			position:'right',
		});
		$('#applicability2').tooltip({
			content:'Applicability',
			position:'right',
		});
		$('#maintaintask').tooltip({
			content:'Maintain Task',
			position:'right',
		});
		$('#lock').tooltip({
			content:'Lock',
			position:'right',
		});

		$('#left').panel({
			title:'Navigation',
		});
		$('#left1').panel({
			title:'Navigation Tree',
		});
		$('#left2').panel({
			title:'Bookmark',
		});
		$('#left3').panel({
			title:'Access Record',
		});
		$('#left4').panel({
			title:'Compound Search',
		});

		var tab = $('#center').tabs('getTab',0); // 取得第一个tab 
		$('#center').tabs('update', { 
			tab:tab, 
			options: { 
				title: 'Home Page'
			} 
		});
		var tab = $('#center').tabs('getTab',1); // 取得第一个tab 
		$('#center').tabs('update', { 
			tab:tab, 
			options: { 
				title: 'Search'
			} 
		});

		$('#mm1').menu('setText', {
			target:home,
			text: 'Home Page'
		});
		$('#mm1').menu('setText', {
			target: back,
			text: 'Backward'
		});
		$('#mm1').menu('setText', {
			target: forward,
			text: 'Forward'
		});
		$('#mm2').menu('setText', {
			target:editremarks,
			text: 'Edit Remarks'
		});
		$('#mm2').menu('setText', {
			target:exportremarks,
			text: 'Export Remarks'
		});
		$('#mm3').menu('setText', {
			target: usermanagement,
			text: 'User Management'
		});
		$('#mm3').menu('setText', {
			target: usermaintain,
			text: 'User Maintain'
		});
		$('#mm3').menu('setText', {
			target:command,
			text: 'Command'
		});
		$('#mm3').menu('setText', {
			target: advicemanagement,
			text: 'Advice Management'
		});
		$('#mm4').menu('setText', {
			target: userconfiguration,
			text: 'User Configuration'
		});
		$('#mm4').menu('setText', {
			target:applicability,
			text: 'Applicability'
		});
		$('#mm4').menu('setText', {
			target:interfaceconfiguration,
			text: 'Interface Configuration'
		});
		$('#mm4').menu('setText', {
			target:pr,
			text:'Print'
		});
		$('#mm4').menu('setText', {
			target:log,
			text:'Log Out'
		});
		$('#mm4').menu('setText', {
			target:changelanguage,
			text: 'Language'
		});
		$('#mm4').menu('setText', {
			target:clo,
			text: 'Close'
		});
		$('#mm5').menu('setText', {
			target:help,
			text: 'Help'
		});
		$('#mm5').menu('setText', {
			target:about,
			text: 'About'
		});
	}
	</script>

	<script type="text/javascript">
	//var xmlhttp;
	function doSearch(){
		document.getElementById("SearchForm").submit();
	}
	
	function logout(){
		var sfForm = document.createElement("form");
		document.body.appendChild(sfForm);
		sfForm.method="post";
		sfForm.action="/Publisher/logout"
		sfForm.id="LogoutForm";
		sfForm.submit();
	}
	</script>
	
	<script> 
	$('#tt').tree({
    onClick: function(node){
    	var v = node.id;
       	document.getElementById("dmc").value=v;
       	//alert(document.getElementById("dmc").value);
       	document.getElementById("ContentForm").submit();
    }
	});
	</script>


</body>
</html>