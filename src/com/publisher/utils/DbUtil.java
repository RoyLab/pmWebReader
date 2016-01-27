package com.publisher.utils;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletContext;

import com.mysql.jdbc.PreparedStatement;
import com.publisher.Config;

public class DbUtil {

	public static Connection getCon(){
		Connection con=null;
		ServletContext ctx = Config.getInstance().getServletContext();
		try {
			Class.forName(ctx.getInitParameter("jdbcName"));
			con=DriverManager.getConnection(ctx.getInitParameter("dbUrl"), 
					ctx.getInitParameter("dbUserName"), ctx.getInitParameter("dbPassword"));
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return con;
	}
	
	public static void close(Statement stmt,Connection con)throws Exception{
		if(stmt!=null){
			stmt.close();
			if(con!=null){
				con.close();
			}
		}
	}
	
	public static void close(PreparedStatement pstmt,Connection con)throws Exception{
		if(pstmt!=null){
			pstmt.close();
			if(con!=null){
				con.close();
			}
		}
	}
	
	public static void close(CallableStatement cstmt,Connection con)throws Exception{
		if(cstmt!=null){
			cstmt.close();
			if(con!=null){
				con.close();
			}
		}
	}
}
