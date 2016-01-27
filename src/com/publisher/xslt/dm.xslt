<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method='html' version='1.0' encoding='UTF-8' indent='yes'/>

<xsl:import href="proced.xslt" />
<xsl:import href="descript.xslt" />

<xsl:template match="/">
	<xsl:apply-templates select="dmodule/content/descript | dmodule/content/proced"/>
</xsl:template>

<xsl:template match="dmodule/content/proced">
	<xsl:apply-imports/>
</xsl:template>


<xsl:template match="dmodule/content/descript">
	<xsl:apply-imports/>
</xsl:template>

</xsl:stylesheet>
