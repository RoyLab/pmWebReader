package com.publisher.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.w3c.dom.Document;

import com.publisher.Dmc2Xml;
import com.publisher.SearchEngine;
import com.publisher.utils.OperateXMLByDOM;
import com.publisher.utils.XSLTTransformer;

public class FullTextSearch extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static final int MAX_RESULT_PER_PAGE = 20;
	
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	response.setContentType("text/html; charset=utf-8");
    	PrintWriter out = response.getWriter();
    	Document xml = null;
    	try {
			SearchEngine searchEngine = new SearchEngine();
			String keyword = new String(request.getParameter("searchCondition").getBytes("ISO8859-1"),"UTF-8");
//			String keyword = new String(request.getParameter("searchCondition").getBytes("ISO8859-1"),"GB2312");
			
			List<String> dmcs = searchEngine.fullTextSearch((keyword != null)?keyword:"发动机");
			int pageId = -1;
			try{
				pageId = Integer.parseInt(request.getParameter("pageIndex"));
			} catch (Exception e)
			{
				System.err.println("page index not found.");
				pageId = -1;
			}
			
			String user = request.getParameter("user");
			
			Dmc2Xml docBuilder = new Dmc2Xml();
			xml = docBuilder.createTreeViewDoc(pageId, MAX_RESULT_PER_PAGE, dmcs, keyword, user);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
//    	out.write(OperateXMLByDOM.doc2FormatString(xml));
//    	response.setContentType("application/xml");
    	response.setContentType("text/html");
    	XSLTTransformer.xsl2Stream(OperateXMLByDOM.doc2FormatString(xml), out, this.getClass().getResourceAsStream("/com/publisher/xslt/ftsearch.xslt"));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	doGet(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
