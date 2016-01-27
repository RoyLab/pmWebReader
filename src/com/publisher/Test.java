package com.publisher;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import com.publisher.utils.OperateXMLByDOM;

public class Test {

	public static void main(String[] args) throws SAXException, IOException, ParserConfigurationException {
		// TODO Auto-generated method stub
		Document doc = OperateXMLByDOM.xml2Doc("D:/pubRes/xml/DMC-SAMPLE-A-00-00-00-00A-041A-A_000-01_zh-CN.xml");
//		System.out.println(OperateXMLByDOM.doc2String(doc.getElementsByTagName("content").item(0)));
		System.out.println(OperateXMLByDOM.doc2String(doc.getElementsByTagName("refdm").item(0)));
	    String s = 
	      "<p>" +
	      "  <media type=\"audio\" id=\"au008093\" rights=\"wbowned\"/>" +
	      "    <title>Bee buzz</title>" +
	      "  " +
	      "  Most other kinds of bees live alone instead of in a colony." +
	      "  These bees make tunnels in wood or in the ground." +
	      "  The queen makes her own nest." +
	      "</p>";
	    InputStream is = new ByteArrayInputStream(s.getBytes());

	    DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
	    DocumentBuilder db = dbf.newDocumentBuilder();
	    Document d = db.parse(is);

	    Node rootElement = d.getDocumentElement();
	    System.out.println(OperateXMLByDOM.doc2String(rootElement));
	}

}
