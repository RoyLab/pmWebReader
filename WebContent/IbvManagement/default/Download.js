function DownloadFile(url)
{
	 try {
        var newWindow = window.open(url,  '', 'height=3px, width=3px, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no, titlebar=no,directories=no');
        return true;
    }
    catch(e){
        return false;
    }
}