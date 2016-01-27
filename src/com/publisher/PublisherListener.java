package com.publisher;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class PublisherListener implements ServletContextListener {
	
	public void contextInitialized(ServletContextEvent event) {
		
		Config.setServletContext(event.getServletContext());
	}
	
	public void contextDestroyed(ServletContextEvent event) {
	}
}