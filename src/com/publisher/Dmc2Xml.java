package com.publisher;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Text;

import com.publisher.utils.DbUtil;
import com.publisher.utils.OperateXMLByDOM;

public class Dmc2Xml {
	
	private static String sqlDmcInfoQuery = "select name,fulldmc,dmc,content,modified from t_dmcmain where dmc in (?);";
	
	private static int ABSTRACT_CHAR_NUMBER = 250;
	
	public Document createTreeViewDoc(int pageId, int maxnum, List<String> dmcs, 
			String key, String user) throws ParserConfigurationException, SQLException{
		
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		Document result = builder.newDocument();
		
		if (dmcs.size() == 0){
			Element root = result.createElement("error");
			Text tn = result.createTextNode("没有找到相关模块！");
			root.appendChild(tn);
			result.appendChild(root);
			return result;
		}
		Connection con = null;
		try {
			con = DbUtil.getCon(Config.getInstance().getProjectName());
			Statement pstmt = con.createStatement();
			
			// 检查pageId的正确性
			int pagenum = (int) Math.ceil((double)dmcs.size() / maxnum);
			if (pageId > pagenum)
			{
				Element root = result.createElement("error");
				Text tn = result.createTextNode("页码超出范围！");
				root.appendChild(tn);
				result.appendChild(root);
				return result;
			}
			
			int begin = (pageId-1) * maxnum;
			int maybeend = pageId * maxnum;
			int end = maybeend < dmcs.size()? maybeend: dmcs.size();
			
			String str = "";
			for (int i = begin; i < end; i++)
				str += "'"+dmcs.get(i)+"',";
			
			str = str.substring(0, str.length()-1);
			ResultSet rs = pstmt.executeQuery(sqlDmcInfoQuery.replaceFirst("\\?", str));
			Element root = result.createElement("result");
			Element keyElem = result.createElement("key");
			Text keyText = result.createTextNode(key);
			keyElem.appendChild(keyText);
			root.appendChild(keyElem);
			
			OperateXMLByDOM.AddTextNode(result, root, "pageid", Integer.toString(pageId));
			OperateXMLByDOM.AddTextNode(result, root, "pagenum", Integer.toString(pagenum));
			OperateXMLByDOM.AddTextNode(result, root, "recordnum", Integer.toString(dmcs.size()));
			OperateXMLByDOM.AddTextNode(result, root, "user", user);
	
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
//				int idx = path.lastIndexOf('\\');
				text = result.createTextNode(path);
				info.appendChild(text);
				dm.appendChild(info);
				
				info = result.createElement("dmc");
				text = result.createTextNode(rs.getString(3));
				info.appendChild(text);
				dm.appendChild(info);
				
				info = result.createElement("date");
				String datastr = rs.getString(5);
				text = result.createTextNode(datastr.substring(0, datastr.length()-2));
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
			
			if (pagenum != 1)
			{
				Element footprint = result.createElement("foot");
				root.appendChild(footprint);
				
				boolean hasPrev = pageId == 1? false:true;
				boolean hasNext = pageId == pagenum? false:true;
				begin = (pageId - 4 > 0)?pageId-4:1;
				end = (pageId + 4 <= pagenum)?pageId+4:pagenum;
				
				if (hasPrev)
				{
					Element item = result.createElement("item");
					footprint.appendChild(item);
					
					OperateXMLByDOM.AddTextNode(result, item, "Id", Integer.toString(pageId-1));
					OperateXMLByDOM.AddTextNode(result, item, "text", "上一页");
				}
				
				for (int i = begin; i <= end; i++)
				{
					Element item = result.createElement("item");
					footprint.appendChild(item);
					
					OperateXMLByDOM.AddTextNode(result, item, "Id", Integer.toString(i));
					if (i == pageId)
						OperateXMLByDOM.AddTextNode(result, item, "text", Integer.toString(i));
					else
						OperateXMLByDOM.AddTextNode(result, item, "text", "["+i+"]");
				}
				
				if (hasNext)
				{
					Element item = result.createElement("item");
					footprint.appendChild(item);
					
					OperateXMLByDOM.AddTextNode(result, item, "Id", Integer.toString(pageId+1));
					OperateXMLByDOM.AddTextNode(result, item, "text", "下一页");
				}
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
