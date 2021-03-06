package com.publisher;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.publisher.utils.DbUtil;

public class SearchEngine {
	
	private Connection con = null;
	private static String sqlFullTextSearch = "select dmc from t_dmcmain where content like ?;";
	private static String sqlCombSearch = "select distinct dmId from t_* where content like ?;";
	private static String sqlIdQuery = "select dmc from t_dmcmain where id in (?);";
	
	public SearchEngine() throws Exception {
		con = DbUtil.getCon(Config.getInstance().getProjectName());
	}
	
	public List<String> fullTextSearch(String keyword) throws SQLException{
		PreparedStatement pstmt = con.prepareStatement(sqlFullTextSearch);
		pstmt.setString(1, "%"+keyword+"%");
		ResultSet rs = pstmt.executeQuery();
		List<String> result = new ArrayList<String>();
		while (rs.next()){
			result.add(rs.getString(1));
		}
		pstmt.close();
		return result;
	}
	
	public String combSearch(String keyword, String type) throws SQLException{
		PreparedStatement pstmt = con.prepareStatement(sqlCombSearch.replaceFirst("\\*", type));
		pstmt.setString(1, "%"+keyword+"%");
		ResultSet rs = pstmt.executeQuery();
		String ids = "";
		while (rs.next()){
			ids += Integer.toString(rs.getInt(1))+',';
		}
		pstmt.close();
		
		if (ids == "")	return "";
		
		Statement pstmt2 = con.createStatement();
		rs = pstmt2.executeQuery(sqlIdQuery.replaceFirst("\\?", ids.substring(0,ids.length()-1)));
		String result = "";
		while (rs.next()){
			result += rs.getString(1)+",";
		}
		pstmt2.close();
		return result;
	}
	
	
	public void destroy() throws SQLException{
		if (con != null) con.close();
	}
	
}
