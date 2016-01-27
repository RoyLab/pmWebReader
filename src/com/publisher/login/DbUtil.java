package com.publisher.login;

import java.sql.Connection;
import java.sql.DriverManager;

import javax.servlet.ServletContext;

import com.publisher.Config;

public class DbUtil {

	private String dbUrl;//="jdbc:mysql://localhost:3306/db_military";
	private String dbUserName;//="root";
	private String dbPassword;//="123456";
	private String jdbcName;//="com.mysql.jdbc.Driver";
	
	public Connection getCon() throws Exception{
		ServletContext ctx = Config.getServletContext();
		dbUrl=ctx.getInitParameter("UserDburl");
		dbUserName=ctx.getInitParameter("dbUserName");
		dbPassword=ctx.getInitParameter("dbPassword");
		jdbcName=ctx.getInitParameter("jdbcName");
		Class.forName(jdbcName);
		Connection con=DriverManager.getConnection(dbUrl, dbUserName, dbPassword);
		return con;
	}
	
	public void closeCon(Connection con)throws Exception{
		if(con!=null){
			con.close();
		}
	}
	
	public static void main(String[] args) {
		DbUtil dbUtil=new DbUtil();
		try {
			dbUtil.getCon();
			System.out.println("success");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("fail");
		}
	}
}
