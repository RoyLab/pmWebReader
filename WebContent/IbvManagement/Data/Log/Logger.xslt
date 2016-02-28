<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
	<HTML>
	  <HEAD>
		<title>数据交换日志</title>
		<style type="text/css">
		  .lists_table
		  {
		  font-family: Arial,宋体;
		  font-size: 10.5pt;
		  color: black;
		  font-weight: normal;
		  font-style: normal;
		  text-decoration: none;
		  line-height: 1.2;
		  letter-spacing: 0mm;
		  text-align: ;
		  border-top-width: 1pt;
		  border-top-style: solid;
		  border-left-width: 1pt;
		  border-left-style: solid;
		  border-collapse: collapse;
		  border-color: #000000;
		  }

		  .lists_table th
		  {
		  border-right-width: 1pt;
		  border-right-style: solid;
		  border-bottom-width: 1pt;
		  border-bottom-style: solid;
		  border-collapse: collapse;
		  border-color: #000000;
		  background-color: #FFFFCC;
		  padding: 5px;
		  text-align: center;
		  }

		  .lists_table td
		  {
		  border-right-width: 1pt;
		  border-right-style: solid;
		  border-bottom-width: 1pt;
		  border-bottom-style: solid;
		  border-collapse: collapse;
		  border-color: #000000;
		  padding: 5px;
		  text-align: ;
		  vertical-align: top;
		  }
		</style>
	  </HEAD>
	  <BODY>
		<xsl:apply-templates select="Log"></xsl:apply-templates>
	  </BODY>
	</HTML>
  </xsl:template>

  <xsl:template match="Log">
    <h3 align="center">
      <xsl:text>数据交换日志</xsl:text>
    </h3>
    <table class="lists_table" align="center" width="98%">
      <tr>
        <th>操作</th>
        <th>时间</th>
        <th>用户</th>
      </tr>

      <xsl:for-each select="Item">
        <tr>
          <td>
            <xsl:value-of select="./Message/text()"/>
          </td>
          <td>
            <xsl:value-of select="./Date/text()"/>
          </td>
          <td>
            <xsl:value-of select="./User/text()"/>
          </td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>

