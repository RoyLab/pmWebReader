package com.publisher;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class PublisherListener implements ServletContextListener {
	
	public void contextInitialized(ServletContextEvent event) {
		
		Config config = Config.getInstance();
		config.setServletContext(event.getServletContext());
		config.init();
	}
	
	public void contextDestroyed(ServletContextEvent event) {
	}
}