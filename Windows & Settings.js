//Settings vars
var SucuriSelected = new Boolean;
var ShowScanFor = new Number;
var Enabled = new Boolean;

function OnEvent_MenuClicked(MenuItemId, Location, OriginWnd)
{
	switch(MenuItemId){
		case "AddEx":
			var AddErr = MsgPlus.CreateWnd("GUI.xml", "AddErr");
			Debug.Trace("AddEx");
			break;
		case	"DelEx":
			Debug.Trace("DelEx");
			break;
		case "About":
			Debug.Trace("About");
			break;
	}
}