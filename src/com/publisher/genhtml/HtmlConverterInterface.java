package com.publisher.genhtml;

import org.w3c.dom.Node;

public interface HtmlConverterInterface {
	
	public abstract String convert(Node xml);
}
