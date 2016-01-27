package com.publisher;

import com.publisher.login.User;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.*;

public class UserVerificationFilter implements Filter {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		// TODO Auto-generated method stub 
		HttpServletRequest servletrequest = (HttpServletRequest)request;
		HttpSession session = servletrequest.getSession();
		Object user = session.getAttribute("currentUser");
		String path=servletrequest.getServletPath();
		if(user==null && path.indexOf("workspace")>=0){
			servletrequest.getRequestDispatcher("login.jsp").forward(request, response);
		}else{
			chain.doFilter(request, response);
		}
		System.out.println("verifying user access.");
		//chain.doFilter(request, response);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

}
