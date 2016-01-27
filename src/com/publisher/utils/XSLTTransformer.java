package com.publisher.utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

public class XSLTTransformer {
	  
	public static void xsl(
		        String inFilename,
		        String outFilename,
		        String xslFilename) {
        try {
            // Create transformer factory
            TransformerFactory factory = TransformerFactory.newInstance();

            // Use the factory to create a template containing the xsl file
            Templates template = factory.newTemplates(new StreamSource(
                new FileInputStream(xslFilename)));

            // Use the template to create a transformer
            Transformer xformer = template.newTransformer();

            // Prepare the input and output files
            Source source = new StreamSource(new FileInputStream(inFilename));
            Result result = new StreamResult(new FileOutputStream(outFilename));

            // Apply the xsl file to the source file and write the result to the
            // output file
            xformer.transform(source, result);
        } catch (FileNotFoundException e) {
            // File not found
        } catch (TransformerConfigurationException e) {
            // An error occurred in the XSL file
        } catch (TransformerException e) {
            // An error occurred while applying the XSL file
            // Get location of error in input file
        }
	}
	
	public static void xsl2Stream(
	        String inFilename,
	        Writer writer,
	        String xslFilename) {
	    try {
	        // Create transformer factory
	        TransformerFactory factory = TransformerFactory.newInstance();
	
	        // Use the factory to create a template containing the xsl file
	        Templates template = factory.newTemplates(new StreamSource(
	            new FileInputStream(xslFilename)));
	
	        // Use the template to create a transformer
	        Transformer xformer = template.newTransformer();
	
	        // Prepare the input and output files
	        Source source = new StreamSource(new FileInputStream(inFilename));
	        Result result = new StreamResult(writer);
	
	        // Apply the xsl file to the source file and write the result to the
	        // output file
	        xformer.transform(source, result);
	    } catch (FileNotFoundException e) {
	    	e.printStackTrace();
	        // File not found
	    } catch (TransformerConfigurationException e) {
	    	e.printStackTrace();
	        // An error occurred in the XSL file
	    } catch (TransformerException e) {
	    	e.printStackTrace();
	        // An error occurred while applying the XSL file
	        // Get location of error in input file
	    }
	}

	public static void xsl2Stream2(
	        String input,
	        Writer writer,
	        String xslFilename) {
	    try {
	        // Create transformer factory
	        TransformerFactory factory = TransformerFactory.newInstance();
	
	        // Use the factory to create a template containing the xsl file
	        Templates template = factory.newTemplates(new StreamSource(
	            new FileInputStream(xslFilename)));
	
	        // Use the template to create a transformer
	        Transformer xformer = template.newTransformer();
	
	        // Prepare the input and output files
	        Source source = new StreamSource(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
	        Result result = new StreamResult(writer);
	
	        // Apply the xsl file to the source file and write the result to the
	        // output file
	        xformer.transform(source, result);
	    } catch (FileNotFoundException e) {
	    	e.printStackTrace();
	        // File not found
	    } catch (TransformerConfigurationException e) {
	    	e.printStackTrace();
	        // An error occurred in the XSL file
	    } catch (TransformerException e) {
	    	e.printStackTrace();
	        // An error occurred while applying the XSL file
	        // Get location of error in input file
	    }
	}
	
	public static void xsl2Stream(
	        String input,
	        Writer writer,
	        InputStream xslFile) {
	    try {
	        // Create transformer factory
	        TransformerFactory factory = TransformerFactory.newInstance();
	
	        // Use the factory to create a template containing the xsl file
	        Templates template = factory.newTemplates(new StreamSource(
	        		xslFile));
	
	        // Use the template to create a transformer
	        Transformer xformer = template.newTransformer();
	
	        // Prepare the input and output files
	        Source source = new StreamSource(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
	        Result result = new StreamResult(writer);
	
	        // Apply the xsl file to the source file and write the result to the
	        // output file
	        xformer.transform(source, result);
	    } catch (TransformerConfigurationException e) {
	    	e.printStackTrace();
	        // An error occurred in the XSL file
	    } catch (TransformerException e) {
	    	e.printStackTrace();
	        // An error occurred while applying the XSL file
	        // Get location of error in input file
	    }
	}
	
	public static void xsl2StreamWithPath(
	        String input,
	        Writer writer,
	        String xslFilename) {
	    try {
	        // Create transformer factory
	        TransformerFactory factory = TransformerFactory.newInstance();

	        URL url = null;
	        try {
	        	url = new File(xslFilename).toURI().toURL();
			} catch (MalformedURLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        StreamSource source1 = new StreamSource(
		            new FileInputStream(xslFilename));
	        source1.setSystemId(url.toExternalForm());
	        System.out.println(url.toExternalForm());
	        
	        // Use the factory to create a template containing the xsl file
	        Templates template = factory.newTemplates(source1);
	
	        // Use the template to create a transformer
	        Transformer xformer = template.newTransformer();
	
	        // Prepare the input and output files
	        Source source = new StreamSource(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));

	        Result result = new StreamResult(writer);
	
	        // Apply the xsl file to the source file and write the result to the
	        // output file
	        xformer.transform(source, result);
	    } catch (FileNotFoundException e) {
	    	e.printStackTrace();
	        // File not found
	    } catch (TransformerConfigurationException e) {
	    	e.printStackTrace();
	        // An error occurred in the XSL file
	    } catch (TransformerException e) {
	    	e.printStackTrace();
	        // An error occurred while applying the XSL file
	        // Get location of error in input file
	    }
	}
	
	public static void main(String[] args) {
		xsl("D:\\pubRes\\xml\\DMC-SAMPLE-A-72-00-00-00A-110B-A_000-03_zh-CN.xml",
				"C:/Users/RUI/Desktop/xlst/output.html",
				"D:\\Codes\\eclipse\\Publisher\\\\xsl\\bridge\\toolkit\\commands\\dmStylesheet.mobile.xsl");
	}
}
