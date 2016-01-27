<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>

<html>
<head>
	<meta charset="UTF-8">
	<title>虚拟军事训练系统登录</title>
	<link rel="stylesheet" type="text/css" href="resources/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="resources/themes/acon.css">
	<link rel="stylesheet" type="text/css" href="resources/style/login.css">
	<script type="text/javascript" src="resources/js/jquery.min.js"></script>
	<script type="text/javascript" src="resources/js/jquery.easyui.min.js"></script>
	<%
        String login;   	
		if(request.getAttribute("error")!=null){
			login=(String)request.getAttribute("error"); 
		}
		else{
			login="";
		}
    %>
	
</head>


<body background="style/LoginBackgroundImage.jpg" >
	<div id="loginWin" class="easyui-window" title="虚拟军事训练系统登录" minimizable="false" maximizable="false" resizable="false" collapsible="false">
    <div class="easyui-layout" fit="true">
            <div region="center" border="false" style="padding:5px;background:#fff;border:1px solid #ccc;">
        <form id="loginForm" method="post" action="login">
            <div style="padding:5px 0;">
                <label for="login">账号：</label>
                <input type="text" id="userName" name="userName" class="user-input" placeholder="请输入您的用户名"></input>
            </div>
            <div style="padding:5px 0;">
                <label for="password">密码:</label>
                <input type="password" id="password" name="password" class="user-input" placeholder="请输入您的密码"></input>
            </div>
            <div style="padding:5px 0;">
                <label for="authority">权限：</label>
                <select class="easyui-combobox" id="authority" name="authority">
                <option value="soldier">士兵</option> 
				<option value="coach">教官</option> 
				<option value="admin">管理员</option> 
                </select>
            </div>
            <font color="red"><%=login %>
            </font>
            <div region="south" border="false" style="text-align:center;padding:5px 0;">
                <input type="submit" value="登 陆"id="button1"></input>
                <button type="reset"  id="button2">重 置</button>
            </div>
            </form>
            </div>
    </div>
</div>
</body>
</html>