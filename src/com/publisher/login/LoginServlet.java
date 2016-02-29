package com.publisher.login;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginServlet extends HttpServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	DbUtil dbUtil=new DbUtil();
	UserDao userDao=new UserDao();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session=request.getSession();
		String userName=request.getParameter("userid");
		String password=request.getParameter("userpass");
		String authority=request.getParameter("authority");
		
		authority = "admin";
		
		Connection con=null;
		try{
			con=dbUtil.getCon();
			User user=new User(userName,password,authority);
			User currentUser=userDao.login(con, user);
			boolean exist=userDao.login(con, userName);
			if(!exist){
				response.getWriter().append("invalid user");
			}
			else if(currentUser==null){
				response.getWriter().append("wrong pwd");
			}else{
				session.setAttribute("currentUser", currentUser);
				response.getWriter().append(userName+"&"+password+"&99&管理员&;1,2,3&D:~test&1&false&true&1&true&true&true&true&true&true&true&true");
//				response.sendRedirect("index.html");
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try {
				dbUtil.closeCon(con);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	
}
