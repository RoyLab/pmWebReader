package com.publisher.genhtml;

public class ConverterFactory {
	public static HtmlConverterInterface genConverter(String type){
		switch (type){
		case "para":
			return new GeneralConverter();
		}
		return new GeneralConverter();
	}
}
