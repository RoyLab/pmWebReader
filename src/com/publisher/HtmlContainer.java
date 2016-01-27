package com.publisher;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.jsp.JspWriter;

import com.publisher.utils.DbUtil;
import com.publisher.utils.XSLTTransformer;

// TODO
public class HtmlContainer {

	private static String sqlContentQuery = "select name,html from t_main where dmc=?;";
	private Connection con = null;
	
	public HtmlContainer() throws Exception {
		con = DbUtil.getCon(Config.getInstance().getProjectName());
	}

	public void writeHtml(JspWriter out, String dmc){
		try {
			String[] name = {"NULL"};
			String content = getHTMLContent(dmc, name);
			out.print("<div align=\"center\" class=\"dmodule_title\">"
					+ name[0]
					+ "	</div>");

			XSLTTransformer.xsl2StreamWithPath(content, out, Config.getInstance().getServletContext().getRealPath("")+"/xslt/dm.xslt");
				
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}


	public String getHTMLContent(String dmc, String[] name) throws SQLException{
		PreparedStatement pstmt = con.prepareStatement(sqlContentQuery);
		pstmt.setString(1, dmc);
		ResultSet resultSet = pstmt.executeQuery();
		if (resultSet.next()){
			name[0]=resultSet.getString(1);
			return resultSet.getString(2);
		}
		return "";
	}


	public void destroy() throws SQLException{
		if (con != null) con.close();
	}
}
