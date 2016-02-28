<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<html>
<head>
	<meta charset="UTF-8">
	<title>Complex Layout - jQuery EasyUI Demo</title>
	<link rel="stylesheet" type="text/css" href="resources/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="resources/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="resources/style/workspace.css">
	<script type="text/javascript" src="resources/js/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="resources/js/jquery.easyui.min.js"></script>
</head>

<body>

<div class="main easyui-layout" data-options="fit:true">	<div class="easyui-layout" data-options="region:'north'">			<div class="easyui-panel" data-options="region:'north',border:false" style="background-color:#e6e6fa;overflow:hidden;width:100%">				<div id="allmenu" class="menutitle">			<a id="navigation" href="#" class="easyui-menubutton" menu="#mm1" >导航</a>			<a id="remarks" href="#" class="easyui-menubutton" menu="#mm2" >备注</a>			<a id="management" href="#" class="easyui-menubutton" menu="#mm3" >管理</a>			<a id="system" href="#" class="easyui-menubutton" menu="#mm4" >系统</a>			<a id="hheellpp" href="#" class="easyui-menubutton" menu="#mm5" >帮助</a>		</div>		<div class="easyui-menu" id="mm1" >			<div id="home">首页</div>			<div id="back">后退</div>			<div id="forward">前进</div>		</div>		<div class="easyui-menu" id="mm2">			<div id="editremarks">编辑备注</div>			<div id="exportremarks">导出备注</div>		</div>		<div class="easyui-menu" id="mm3" >			<div id="usermanagement">用户管理</div>			<div id="usermaintain">角色维护</div>			<div class="menu-sep"></div>			<div id="command">口令安全设置</div>			<div id="advicemanagement">意见管理</div>		</div>		<div class="easyui-menu" id="mm4">			<div id="userconfiguration">用户配置</div>			<div id="applicability">适用性</div>			<div id="interfaceconfiguration">界面配置</div>			<div id="pr">打印</div>			<div class="menu-sep"></div>			<div id="log" onclick="logout()">注销</div>			<div id="changelanguage">语言选项  				  <div style="width:150px;">  					 <div onclick="changetoC()">简体中文</div>  					 <div onclick="changetoE()">English</div>  				  </div>  			</div>			<div id="clo">关闭</div>		</div>		<div class="easyui-menu" id="mm5">			<div id="help">帮助</div>			<div id="about">关于</div>		</div>		</div>								<div class="easyui-panel" data-options="region:'center',border:false" style="background-color:#e0eeee;overflow:hidden;width:100%">		<div class="tool">			<img id="hide" src="resources/themes/icons/NavPane.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="显示/隐藏" />			<img id="home2" src="resources/themes/icons/Home.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="首页" />			<img id="back2" src="resources/themes/icons/back.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="后退" />			<img id="forward2" src="resources/themes/icons/Next.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="前进" />			<img id="media" src="resources/themes/icons/MultimediaViewer.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="多媒体" />			<img id="remarks2" src="resources/themes/icons/Remark.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="备注" />			<img id="exportremarks2" src="resources/themes/icons/ExportRemark.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="导出备注" />			<img id="addcomment" src="resources/themes/icons/AddComments.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="添加意见" />			<img id="viewcomment" src="resources/themes/icons/Comments.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="查看意见" />			<img id="exportdmfiles" src="resources/themes/icons/ExportDM.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="导出DM文件" />			<img id="print2" src="resources/themes/icons/print.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="打印" />			<img id="applicability2" src="resources/themes/icons/Applic.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="适用性" />			<img id="maintaintask" src="resources/themes/icons/PlanReport.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="维护任务" />			<img id="lock" src="resources/themes/icons/Lock.png" class="tools easyui-linkbutton easyui-tooltip" data-options="plain:true" title="锁定" />		</div>		</div>	</div>	<div id="left" class="leftpart" data-options="region:'west',split:true" title=" " minWidth="300px">		<div class="easyui-accordion" data-options="fit:true,border:false">			<div id="left1" title="目录" style="padding:10px;">				<form method="post" action="./ContentServlet" name="ContentForm" id="ContentForm" target="read-content">					<ul class="easyui-tree" id="tt" url="projects/<%= request.getServletContext().getInitParameter("projectName") %>/tree.json" >					</ul>					<input type="hidden" name="dmc" id="dmc" value="">				</form>			</div>			<div id="left2" title="书签" style="padding:10px;">				暂无书签			</div>			<div id="left3" title="访问记录" style="padding:10px">				暂无访问记录			</div>			<div id="left4" title="组合查询" style="padding:10px">				建设中			</div>		</div>	</div>	<div data-options="region:'center'">		<div id="center" class="easyui-tabs" data-options="fit:true,border:false,plain:true">			<div id="center1" title="首页"  style="padding:5px;">				<div id="p" class="easyui-panel" data-options="fit:true" style="overflow:hidden;">					<iframe name="read-content" id="read-content" frameborder="0" src="/Publisher/ContentServlet" style="width:100%;height:100%"></iframe>				</div>			</div>			<div id="center2" title="全文搜索" style="padding:5px;">				<div id="p" class="easyui-panel" data-options="fit:true">					<div id="tb" class="easyui-layout" data-options="fit:true" style="padding:3px;background-color:#321;">						<div class="easyui-panel" data-options="region:'north',border:'false'" style="height:38px;overflow:hidden;">							<form method="post" id="SearchForm" action="./ftsearch" target="search-result">								<span>搜索内容</span>								<input id="search-content" id="key" name="key">								<img id="search-button" class="easyui-linkbutton" plain="true" onclick="doSearch()" src="resources/themes/icons/search.png" />							</form>						</div>						<div class="easyui-panel" data-options="region:'center'">							<iframe name="search-result" id="search-result"></iframe>						</div>					</div>				</div>			</div>		</div>	</div></div>

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