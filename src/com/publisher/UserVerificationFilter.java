package com.publisher;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class UserVerificationFilter implements Filter {

	@Override
	public void destroy() {

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		HttpServletRequest servletrequest = (HttpServletRequest)request;
		HttpSession session = servletrequest.getSession();
		Object user = session.getAttribute("currentUser");
		String path=servletrequest.getServletPath();
		
		if(user==null && path.indexOf("workspace")>=0){
			servletrequest.getRequestDispatcher("login.html").forward(request, response);
		}else{
			chain.doFilter(request, response);
		}
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {

	}

}
