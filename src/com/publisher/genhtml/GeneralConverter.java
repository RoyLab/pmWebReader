package com.publisher.genhtml;

import org.w3c.dom.Node;

import com.publisher.utils.OperateXMLByDOM;

public class GeneralConverter implements HtmlConverterInterface {

	@Override
	public String convert(Node xml) {
		// TODO Auto-generated method stub
		return OperateXMLByDOM.doc2String(xml);
	}

}
