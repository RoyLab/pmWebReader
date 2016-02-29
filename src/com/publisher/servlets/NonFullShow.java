package com.publisher.servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class NonFullShow
 */
public class NonFullShow extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public NonFullShow() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//		HttpServletRequest servletrequest = (HttpServletRequest)request;
		String dmc=request.getParameter("dmc");
		String manual=request.getParameter("manual");
		manual = manual==null?"null":manual;
		response.sendRedirect("index.html?manual="+manual+"&dmc="+dmc+"&showall=0");
//		servletrequest.getRequestDispatcher("index.html?manual=null&dmc="+dmc+"&showall=0").forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
