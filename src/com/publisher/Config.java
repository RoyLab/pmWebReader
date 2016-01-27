package com.publisher;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletContext;


public class Config {
	
	public final static String[] SEARCH_CLASS = {"pnr", "nsn", "para",
			"figure", "table", "step", "warning", "caution"};
	
	public static Config getInstance(){
		if (instance == null)
			instance = new Config();
		return instance;
	}
		
	private static Config instance = null;
	private Config(){
	}
	
	private String projName = null;
	public String getProjectName(){
		return projName;
	}
	
	public void init(){
		projName = servletContext.getInitParameter("projectName");
	}
	
	private ServletContext servletContext = null;
	public ServletContext getServletContext() {
		return servletContext;
	}

	public void setServletContext(ServletContext svctx) {
		servletContext = svctx;
	}
}

class PropertiesUtil {
	
	private Properties prop = null;
	
	public PropertiesUtil(String path){
		
		InputStream in= this.getClass().getResourceAsStream(path);
		prop=new Properties();
		try {
			prop.load(in);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getValue(String key){
		return (String)prop.get(key);
	}
}
