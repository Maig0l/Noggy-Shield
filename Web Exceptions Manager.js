var GExceptionList = new Array;

function GetWebExceptions()
{
	// define constants
	// Note: if a file exists, using forWriting will set
	// the contents of the file to zero before writing to
	// it. 
	var forReading = 1, forWriting = 2, forAppending = 8;
	
	// define array to store lines. 
	rline = new Array();
	
	// Create the object 
	fs = new ActiveXObject("Scripting.FileSystemObject");
	f = fs.GetFile(MsgPlus.ScriptFilesPath + "\\" + "Exceptions list.txt");
	
	// Open the file 
	is = f.OpenAsTextStream( forReading, 0 );
	
	// start and continue to read until we hit
	// the end of the file. 
	var count = 0;
	while( !is.AtEndOfStream ){
	   rline[count] = is.ReadLine();
	   count++;
	}

	// Close the stream 
	is.Close();

	// Place the contents of the array into 
	// a variable. 
	var List = "";
	for(i = 0; i < rline.length; i++){
	   List += rline[i] + "\n";
	}
 
	//DO SOMETHING!!
	//IsAnException(List, Msg);
	
	var ListArray = List.split("|");
	
	GExceptionList = ListArray;
}

function removeBlanks()
{
	GetWebExceptions();
	var _LB = new Number;
	var _TempList = new Array;
	Debug.Trace("Before: "+GExceptionList);
	_TempList = GExceptionList.join('ß');
	while(_TempList.indexOf("") > -1)
	{
		_TempList = GExceptionList.join('ß');
		_LB = _TempList.indexOf("\n");
		_TempList = _TempList.split("ß");
		_TempList.splice(_LB, 1);
	}
	GExceptionList = _TempList;
}

function removeFromList(URL)
{
	GetWebExceptions();
	if(URL.indexOf(GExceptionList) > -1)
	{
		//hacer loop for para que busque el numero de substr de la url
		GExceptionList.splice(URL, 1);
	}
	/*else
	tirar ventana de error de que no se puede
	porque no está*/
}

function addToList(URL)
{
	GetWebExceptions(); //defines GExceptionList
	GExceptionList.push(URL);
}

function WriteWebExceptions()
{
	GetWebExceptions();
	
	NewExceptions = GExceptionList.toString();
	NewExceptions = NewExceptions.replace(/,/g, "|")
	
	// define constants
	// Note: if a file exists, using forWriting will set
	// the contents of the file to zero before writing to
	// it. 
	var forReading = 1, forWriting = 2, forAppending = 8;
	
	// Create FileSystemObject 
	fs = new ActiveXObject( "Scripting.FileSystemObject" );
	
	// Create the text file 
	fs.CreateTextFile(MsgPlus.ScriptFilesPath + "\\" + "Exceptions list2.txt");
	
	// Open the file for appending 
	os = fs.GetFile(MsgPlus.ScriptFilesPath + "\\" + "Exceptions list2.txt");
	os = os.OpenAsTextStream( forAppending, 0 );
	
	// Write two lines of text to the file 
	os.write(NewExceptions);
	
	// Close the file 
	os.Close();
}
