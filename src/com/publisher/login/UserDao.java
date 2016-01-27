package com.publisher.login;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.publisher.login.User;

public class UserDao {

	public User login(Connection con,User user)throws Exception{
		User resultUser=null;
		String sql="select * from t_user where userName=? and password=? and authority=?";
		PreparedStatement pstmt=con.prepareStatement(sql);
		pstmt.setString(1, user.getUserName());
		pstmt.setString(2, user.getPassword());
		pstmt.setString(3, user.getAuthority());
		ResultSet rs=pstmt.executeQuery();
		if(rs.next()){
			resultUser=new User();
			resultUser.setUserId(rs.getInt("userId"));
			resultUser.setUserName(rs.getString("userName"));
			resultUser.setPassword(rs.getString("password"));
			resultUser.setAuthority(rs.getString("authority"));
		}
		return resultUser;
	}
	
	public boolean login(Connection con,String userName) throws SQLException{
		String sqlUserName="select * from t_user where userName=?";
		PreparedStatement pstmtUserName=con.prepareStatement(sqlUserName);
		pstmtUserName.setString(1, userName);
		ResultSet rsUserName=pstmtUserName.executeQuery();
		if(rsUserName.next()){
			return true;
		}
		return false;
	}
}
