package com.publisher.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.publisher.Config;
import com.publisher.login.DbUtil;

/**
 * Servlet implementation class ContentServlet
 */
public class ContentServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ContentServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().append("Served at: ").append(request.getContextPath());
		String dmc = request.getParameter("dmc");
		
		DbUtil db = new DbUtil();
		String html = null;
		try {
			Connection con = db.getCon(Config.getInstance().getProjectName());
			Statement stmt = con.createStatement();
			ResultSet resultSet = stmt.executeQuery("select html from t_dmcmain where dmc='"+dmc+"';");
			
			if (resultSet.next())
				html = resultSet.getString(1);
			
			stmt.close();
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if (html != null)
			response.sendRedirect("projects/"+Config.getInstance().getProjectName()+"/" + html);
		else
			response.sendRedirect("projects/manual-resources/null.html");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
