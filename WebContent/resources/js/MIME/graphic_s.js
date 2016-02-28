function init()
{

}	
function ZoomIn()
{
 axCGM.ZoomIn();
}
function ZoomOut()
{
  axCGM.ZoomOut();
}
function BestFit()
{
  axCGM.BestFit();
}

function DisplayHotSpot()
{
    axCGM.DisplayHotSpot();
}

function ShowOverview()
{
    axCGM.ShowMagnifier(0);
    axCGM.ShowOverview(1);
}

function ShowMagnifier()
{
    axCGM.ShowOverview(0);
    axCGM.ShowMagnifier(1);
}

function RotateLeft()
{
  axCGM.RotateLeft();
}
function RotateRight()
{
  axCGM.RotateRight();
}
function SetPanMode(mode)
{
  axCGM.SetPanMode(mode);
}

function PrintDialog()
{
    axCGM.PrintDialog();
}

function HighlightNode(aspid)
{
    axCGM.HighlightNode(aspid);     //高亮指定热点。参数为热点的aspid。如果链接指向某个热点，链接应当翻译成指向a的页面。点击时根据目标获取aspid并调用此方法。
}
    
var previousObj = null;
var hot = "red";
var notHot = "white";

