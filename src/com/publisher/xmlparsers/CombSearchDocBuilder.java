package com.publisher.xmlparsers;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Text;

import com.publisher.utils.DbUtil;

public class CombSearchDocBuilder {
	
	private static String sqlDmcInfoQuery = "select name,associateFile,dmc from t_main where dmc in (?);";
	
	public Document createTreeViewDoc(String dmcs) throws ParserConfigurationException, SQLException{
		
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		Document result = builder.newDocument();
		
		if (dmcs == ""){
			Element root = result.createElement("result");
			Text tn = result.createTextNode("没有找到相关模块！");
			root.appendChild(tn);
			result.appendChild(root);
			return result;
		}
		Connection con = null;
		try {
			con = DbUtil.getCon();
			Statement pstmt = con.createStatement();
			String str = ","+dmcs;
			str = str.replaceAll(",",	"','");
			str = str.substring(2, str.length()-2);
			ResultSet rs = pstmt.executeQuery(sqlDmcInfoQuery.replaceFirst("\\?", str));
			Element root = result.createElement("result");
			while (rs.next()){
				Element dm = result.createElement("dm");

				String name = rs.getString(1);
				String []names = name.split("-");
				Element info = result.createElement("techname");
				Text text = result.createTextNode(names[0].trim());
				info.appendChild(text);
				dm.appendChild(info);
				
				info = result.createElement("infoname");
				text = result.createTextNode(names[1].trim());
				info.appendChild(text);
				dm.appendChild(info);
				
				info = result.createElement("code");
				String path = rs.getString(2);
				int idx = path.lastIndexOf('\\');
				text = result.createTextNode(path.substring(idx+1, path.length()-4));
				info.appendChild(text);
				dm.appendChild(info);
				
				info = result.createElement("dmc");
				text = result.createTextNode(rs.getString(3));
				info.appendChild(text);
				dm.appendChild(info);
				
				root.appendChild(dm);
			}
			result.appendChild(root);
			
		} catch (Exception e){
			e.printStackTrace();
		} finally{
			con.close();
		}
		return result;
	}
}
