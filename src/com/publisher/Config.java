package com.publisher;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletContext;


public class Config {
	
	public static String[] SEARCH_CLASS = {"pnr", "nsn", "para",
			"figure", "table", "step", "warning", "caution"};
	
	private static ServletContext servletContext = null;

	public static ServletContext getServletContext() {
		return servletContext;
	}

	public static void setServletContext(ServletContext svctx) {
		servletContext = svctx;
	}

//	public Config(ServletContext svctx){
//		PropertiesUtil prop = new PropertiesUtil("/config.properties");
//		setServletContext(svctx);
//	}
	
}

class PropertiesUtil {
	
	private Properties prop = null;
	
	public PropertiesUtil(String path){
		
		InputStream in= this.getClass().getResourceAsStream(path);
		prop=new Properties();
		try {
			prop.load(in);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public String getValue(String key){
		return (String)prop.get(key);
	}
}
