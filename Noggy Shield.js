var GMsg = new String; //Message
var SimGMsg = new String; //Simplified URL (SImplified = The url without the rest of the message)
var IsSentvar = new Boolean;
var LastReceiveTime = new Date();
var LastSendTime = new Date();
var GExceptionList = new Array;
var HasWWW = new Boolean;
var WWWPos = new Number;
var DOMPos = new Number;
var http = new Number;

function OnEvent_ChatWndSendMessage(ChatWnd, Message)
{
	LastSendTime = Date();
}

function IsItSent()
{
	if(LastSendTime != LastReceiveTime)
	{
		IsSentvar = false;
		Debug.Trace("Recieved");
	}
	else
	{
		IsSentvar = true;
		Debug.Trace("Sent");
	}
}

function IsURL(string)
{
	if(string.indexOf("www.") >= 0 || string.indexOf(".com") >= 0 || string.indexOf(".net") >= 0 || string.indexOf(".org") >= 0 || string.indexOf(".info") >= 0)
	{
		return true;
	}
	else
	{ 
		return false;
	} 
}

function DeleteNonURL(sep, URL) 
{
	var _Pos = new Number;
	URL = URL.split(sep);
	for (var i = 0; i < URL.length;)//deletes non-url substrings
	{
	Debug.Trace("Msg: "+URL + " i: "+i + " _Pos: "+_Pos + " Current Substring: "+URL[i]);
		_Pos = URL[i].indexOf('.com');
		if(_Pos == -1)
		{
			_Pos = URL[i].indexOf('.net');
			if(_Pos == -1)
			{
				_Pos = URL[i].indexOf('.org');
				if(_Pos == -1)
				{
					_Pos = URL[i].indexOf('.info');
					if(_Pos == -1) //No URL in this substr
					{
						URL.splice(i, 1); //boom, deleted.
					}
					else{i++}
				}
				else{i++}
			}
			else{i++}
		}
		else{i++}
	}
	Debug.Trace(URL);
	return URL;
}

function FindDomain(str)
{
	//finds WWW and sets if it appears or not. this is useless, but i'll keep it :P
	if(str.indexOf('www.') == -1)
	{
		HasWWW = false;
	}
	else
	{
		HasWWW = true;
	}
	
	//now it searches for the domain and sets where it's located.
	DOMPos = str.indexOf('.com');
	if(DOMPos == -1)
	{
		DOMPos = str.indexOf('.net');
		if(DOMPos == -1)
		{
			DOMPos = str.indexOf('.org');
			if(DOMPos == -1)
			{
				DOMPos = str.indexOf('.info')+1;
			}
		}
	}
	Debug.Trace(DOMPos);
}

function SimplifyMsg(URL)
{
	var HasDom = new Number;
	var WWWRep = new String;//Useless thing I made when the code didn't work, but now does... I'm too lazy and scared to remove now :s I KNOW MY CODE IS PRETTY MESSY PLS FORGIVE ME AT LEAST IT WORKS
	Debug.Trace("texto inicial: "+URL);//texto inicial
	FindDomain(URL);
	sURL = URL.split("");//parte caracter por caracter
	if(HasWWW == true)
	{
		sURL[WWWPos-1] = "ß";
	}
	sURL[DOMPos+4] = "ß";					//IMPORTANTE!! hacer algo con lo de lo cosa.com/algo/esto.php probablemente usar los espacios como indicador
	sURL = sURL.join('');//junta todo
	sURL = sURL.split("ß");//parte desde la beta
	var _ifi = 0; //counter for how many times the loop starts over
	for (var i = 0; i < sURL.length; i++)//deletes non-url substrings
	{
		HasDom = sURL[i].indexOf('.com');
		if(HasDom == -1)
		{
			HasDom = sURL[i].indexOf('.net');
			if(HasDom == -1)
			{
				HasDom = sURL[i].indexOf('.org');
				if(HasDom == -1)
				{
					HasDom = sURL[i].indexOf('.info');
					if(HasDom == -1) //No URL in this substr
					{
						_ifi = _ifi+1;
						sURL.splice(i, 1);//boom, deleted.
					}
				}
			}
		}
	}
	sURL.join(''); //converts the array (which now has only ONE element, the url) to a string and assigns it to the globlal url variable
	if(HasWWW == false)
	{
		sURL = DeleteNonURL(" ", URL);
	}
	SimGMsg = sURL;
	Debug.Trace(sURL);//resultado final
}

function OnEvent_ChatWndReceiveMessage(ChatWnd, Origin, Message, MessageKind)
{
	LastReceiveTime = Date();
	var IsException = new Boolean;
	var GMsg = Message;
	var MsgURL = IsURL(GMsg);
	IsItSent();
	if(MsgURL)
	{
		SimplifyMsg(GMsg);
		Debug.Trace(GMsg);
		Debug.Trace(SimGMsg);
	}
	
	Debug.Trace(IsSentvar);
	if(Enabled=="true" && MsgURL && !IsSentvar && !IsInArray(GExceptionList, SimGMsg))
	{
		Debug.Trace("			URL: "+SimGMsg);
		MsgPlus.LogEvent("Noggy Shield", "URL Recieved ("+SimGMsg+", not exception). Scanning...", 5);
		ScanLink(SimGMsg, UseURLVoid, true, ShowScanFor);
	}
	else if(Enabled=="true" && MsgURL && !IsSentvar && IsInArray(GExceptionList, SimGMsg))
	{
		MsgPlus.LogEvent("Noggy Shield", "URL Recieved ("+SimGMsg+", exception). Not scanning; be carefull", 5);
		MsgPlus.DisplayToast("NG - Exception received", "A link has been detected, but not scanned as the item is in the whitelist. Please be carefull.", "Ding.wav");
	}
}

function OnEvent_Initialize(MessengerStart)
{
	GetWebExceptions();
	GetSettings();
	Debug.Trace("GEL: "+GExceptionList);
	Debug.Trace("Settings: "+CurrSettings);
}

function OnEvent_Uninitialize(MessengerExit)
{
	WriteWebExceptions();
	SaveSettings();
}