//Settings vars
var CurrSettings = new Array
var UseURLVoid = new Boolean;
var ShowScanFor = new Number;
var Enabled = new Boolean;
//Windows vars
var ManScanWnd;
var AddExWnd;
var DelExWnd;
var ConfigWnd;
var AboutWnd;
var ScanWnd;

//Settings-related functions
function GetSettings()
{
	var forReading = 1, forWriting = 2, forAppending = 8;
	
	rline = new Array();
	
	fs = new ActiveXObject("Scripting.FileSystemObject");
	f = fs.GetFile(MsgPlus.ScriptFilesPath + "\\" + "Settings.txt");
	
	is = f.OpenAsTextStream( forReading, 0 );
	
	var count = 0;
	while( !is.AtEndOfStream ){
	   rline[count] = is.ReadLine();
	   count++;
	}

	is.Close();

	var List = "";
	for(i = 0; i < rline.length; i++){
	   List += rline[i];
	}
	
	CurrSettings = List.split("|");
	
	UseURLVoid = CurrSettings[0];
	ShowScanFor = CurrSettings[1];
	Enabled = CurrSettings[2];
}

function SaveSettings()
{
	var NewSettings = CurrSettings.toString();
	NewSettings = NewSettings.replace(/,/g, "|");
	 
	var forReading = 1, forWriting = 2, forAppending = 8;
	
	fs = new ActiveXObject( "Scripting.FileSystemObject" );
	
	fs.CreateTextFile(MsgPlus.ScriptFilesPath + "\\" + "Settings2.txt");
	
	os = fs.GetFile(MsgPlus.ScriptFilesPath + "\\" + "Settings2.txt");
	os = os.OpenAsTextStream( forAppending, 0 );
	
	os.write(NewSettings);
	
	os.Close();
}

//UI-related functions
function OnEvent_MenuClicked(MenuItemId, Location, OriginWnd)
{
	switch(MenuItemId){
		case "ManScan":
			ManScanWnd = MsgPlus.CreateWnd("GUI.xml", "ManScan");
			Debug.Trace("ManScan");
			break;
		case "AddEx":
			AddExWnd = MsgPlus.CreateWnd("GUI.xml", "AddEx");
			Debug.Trace("AddEx");
			break;
		case	"DelEx":
			DelExWnd = MsgPlus.CreateWnd("GUI.xml", "DelEx");
			SetComboList();
			DelExWnd.Combo_SetCurSel("DelExComboBox", 0)
			Debug.Trace("DelEx");
			break;
		case "Config":
			ConfigWnd = MsgPlus.CreateWnd("GUI.xml", "Config")
			SetSettings();
			Debug.Trace("Config")
			break;
		case "About":
			AboutWnd = MsgPlus.CreateWnd("GUI.xml", "About");
			Debug.Trace("About");
			break;
	}
}
var WebControl;
function ScanLink(URL, Engine, TimerOn, TimerTime)
/*URL: URL to scan. Engine: true for URLVoid, false for Sucuri.
TimerOn: If true, closes the window in the especified time in the TimerTime Variable.*/
{	
	//NOTE FOR LATER: if !TimerOn, CountdownText="" and 
	
	ScanWnd = MsgPlus.CreateWnd("GUI.xml", "ScanWindow"); //Open the window
	
	WebControl = ScanWnd.Browser_GetInterface("Browser"); //Initialize IE and navigate to the scan
	if(Engine)
	{
		WebControl.Navigate2("http://www.urlvoid.com/scan/"+URL);
	}
	else
	{
		WebControl.Navigate2("https://sitecheck.sucuri.net/results/"+URL);
	}
	
	Debug.Trace("Level 1");
}

function SetComboList()
{
	for(var i=0; i<GExceptionList.length; i++)
	{
		DelExWnd.Combo_AddItem("DelExComboBox", GExceptionList[i]);
	}
}

function SetSettings()
{
	if(UseURLVoid)
	{
		ConfigWnd.Button_SetCheckState("URLVoidRadio", true);
	}
	else if(!UseURLVoid)
	{
		ConfigWnd.Button_SetCheckState("URLVoidRadio", false);
		ConfigWnd.Button_SetCheckState("SucuriRadio", true);
	}
}