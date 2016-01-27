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
		String userName=request.getParameter("userName");
		String password=request.getParameter("password");
		String authority=request.getParameter("authority");
		
		Connection con=null;
		try{
			con=dbUtil.getCon();
			User user=new User(userName,password,authority);
			User currentUser=userDao.login(con, user);
			boolean exist=userDao.login(con, userName);
			if(!exist){
				request.setAttribute("user", user);
				request.setAttribute("error", "用户名不存在");
				request.getRequestDispatcher("login.jsp").forward(request, response);
			}
			else if(currentUser==null){
				request.setAttribute("user", user);
				request.setAttribute("error", "用户名密码错误");
				request.getRequestDispatcher("login.jsp").forward(request, response);
			}else{
				session.setAttribute("currentUser", currentUser);
				response.sendRedirect("mainPanel.jsp");
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try {
				dbUtil.closeCon(con);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	
}
