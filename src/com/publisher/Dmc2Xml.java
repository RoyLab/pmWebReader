package com.publisher;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Text;

import com.publisher.utils.DbUtil;

public class Dmc2Xml {
	
	private static String sqlDmcInfoQuery = "select name,associateFile,dmc,content,modified from t_dmcmain where dmc in (?);";
	
	private static int ABSTRACT_CHAR_NUMBER = 250;
	
	public Document createTreeViewDoc(String dmcs, String key) throws ParserConfigurationException, SQLException{
		
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
			con = DbUtil.getCon(Config.getInstance().getProjectName());
			Statement pstmt = con.createStatement();
			String str = ","+dmcs;
			str = str.replaceAll(",",	"','");
			str = str.substring(2, str.length()-2);
			ResultSet rs = pstmt.executeQuery(sqlDmcInfoQuery.replaceFirst("\\?", str));
			Element root = result.createElement("result");
			Element keyElem = result.createElement("key");
			Text keyText = result.createTextNode(key);
			keyElem.appendChild(keyText);
			root.appendChild(keyElem);
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
				
				info = result.createElement("date");
				text = result.createTextNode(rs.getString(5));
				info.appendChild(text);
				dm.appendChild(info);
				
				info = result.createElement("abstract");
				String ft = rs.getString(4);
				
				Pattern p = Pattern.compile(key);
				Matcher m = p.matcher(ft);
				int a = 0;
				if (m.find())
					a = m.start();
				
				int b = a + ABSTRACT_CHAR_NUMBER;
				String tail = "...";
				if (b >= ft.length()){
					b = ft.length();
					tail = "";
				}
				
				text = result.createTextNode(ft.substring(a, b)+tail);
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
