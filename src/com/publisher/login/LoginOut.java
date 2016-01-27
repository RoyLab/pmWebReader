package com.publisher.login;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.publisher.Config;
import com.publisher.login.DbUtil;
import com.publisher.login.User;
import com.publisher.login.UserDao;


public class LoginOut extends HttpServlet{
	
	
	private static final long serialVersionUID = 1L;
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException{
		HttpSession session=request.getSession();
		//System.out.println("get");
		session.removeAttribute("currentUser");
		response.sendRedirect("login.jsp");
	}
	
	
	
}
