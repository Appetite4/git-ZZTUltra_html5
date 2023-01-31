// parse.js:  The program's file read/write and JSON parsing/conversion functions.
"use strict";

class parse {

static initClass() {
	// The domain prefix determines the load location for content.  If set
	// to empty, all content is assumed to be local.
	parse.domainPrefix = "";

	// Use when ZAPTCHA is fundamental absolute domain.
	//parse.domainPrefix = "http://www.chriskallen.com/zzt/blog/";

	// Use when my website is fundamental absolute domain.
	//parse.domainPrefix = "http://www.chriskallen.com/zzt/";

	parse.dataset = null;
	parse.jsonObj = null;
	parse.embedData = null;
	parse.fileRef = null;
	parse.origFileData = null;
	parse.fileData = null;
	parse.zipData = null;
	parse.lumpData = null;
	parse.origLastFileName = "";
	parse.lastFileName = "";
	parse.pwadKey = "";
	parse.originalAction = zzt.MODE_NORM;
	parse.loadingAction = zzt.MODE_NORM;
	parse.loadingName = "";
	parse.loadingMessage = "";
	parse.myLoader = null;
	parse.loadingSuccess = false;
	parse.localFileSource = false;
	parse.cancellingAction = zzt.MODE_NORM;
	parse.allowFileBrowse = false;
	parse.embeddedFiles = [];

	// The earlier as3corlib implementation of JSON was more lenient about
	// markup within the spec; content had been generated that relied upon
	// this leniency.  Hence, the makeSafeJSON function exists.  This array
	// assists in marking up characters such as control codes.
	parse.unicodeRep0To31 = [
		"\\u0000", "\\u0001", "\\u0002", "\\u0003", "\\u0004", "\\u0005", "\\u0006", "\\u0007",
		"\\u0008", "\\u0009", "\\u000A", "\\u000B", "\\u000C", "\\u000D", "\\u000E", "\\u000F",
		"\\u0010", "\\u0011", "\\u0012", "\\u0013", "\\u0014", "\\u0015", "\\u0016", "\\u0017",
		"\\u0018", "\\u0019", "\\u001A", "\\u001B", "\\u001C", "\\u001D", "\\u001E", "\\u001F",
	];

	// File input control should have a definition somewhat like this:
	// <input type="file" id="fileInput" style="display:none">
	// Change this if file input on page has a different ID
	// Looks best if style="display:none" is set for control
	parse.inputCtrlID = "fileInput";
	parse.downloadID = "a";
};

// This function has little meaning in JS; it is a holdover from AS3.
static getEmbeddedFile(fName) {
	for (var i = 0; i < parse.embeddedFiles.length; i++) {
		if (fName == parse.embeddedFiles[i][0])
			return (new (parse.embeddedFiles[i][1])());
	}

	return null;
};

// Load a remote text file.
static loadTextFile(filename, action) {
	parse.localFileSource = false;
	parse.loadingName = filename;
	parse.loadingAction = action;
	parse.myLoader = null;

	parse.loadingMessage = "Loading " + filename + "...";
	parse.loadingSuccess = false;

	parse.embedData = parse.getEmbeddedFile(filename);
	if (parse.embedData != null)
	{
		// Special embedded file instant-load.
		parse.loaderCompleteHandler(null);
		return;
	}

	try {
		parse.myLoader = new XMLHttpRequest();
		parse.myLoader.overrideMimeType("application/json"); // Use this only when loading JSON
		parse.myLoader.open('GET', parse.domainPrefix + filename);
		parse.myLoader.onreadystatechange = parse.loaderStateChange;
		parse.myLoader.send();
	}
	catch (e)
	{
		zzt.Toast("ERROR:  " + e);
		return;
	}
};

static loaderStateChange() {
	// We are only interested in treating the response as complete
	// for state 4 (request complete; response ready).
	console.log(parse.myLoader.readyState, parse.myLoader.status, parse.myLoader.statusText);
	if (parse.myLoader.readyState == 4)
	{
		// 200 = Complete code.
		//   0 = Apparently an acceptable completion code in Chrome.
		if (parse.myLoader.status == 200 || parse.myLoader.status == 0)
			parse.loaderCompleteHandler();
		else
			parse.errorHandler();
	}
};

// Error handler for file loading attempt.
static errorHandler() {
	zzt.showLoadingAnim = false;
	console.log("IO ERROR:  ", parse.myLoader.readyState, parse.myLoader.status, parse.myLoader.statusText, zzt.mainMode);
	zzt.mainMode = zzt.MODE_NORM;
};

// Handler when file dialog cancelled.
static cancelHandler() {
	zzt.showLoadingAnim = false;
	zzt.mainMode = parse.cancellingAction;
};

// Handler for file loading success.
static loaderCompleteHandler() {
	if (parse.embedData != null)
		parse.dataset = parse.embedData.readUTFBytes(parse.embedData.length);
		//dataset = ZZTLoader.readExtendedASCIIString(embedData, embedData.length);
	else
		parse.dataset = parse.myLoader.responseText;

	if (parse.loadingAction == zzt.MODE_LOADMAIN || parse.loadingAction == zzt.MODE_LOADDEFAULTOOP ||
		parse.loadingAction == zzt.MODE_LOADINI)
	{
		// JSON.parse does not permit strings to have unprintables that aren't
		// marked up.  Generally speaking, there will be only two contexts in
		// ZZT Ultra where this creates problems in long strings:  GUI text
		// definitions, and ZZT-OOP code within type definitions.
		var markupKey = null;
		if (parse.loadingAction == zzt.MODE_LOADMAIN)
			markupKey = "Text";
		else if (parse.loadingAction == zzt.MODE_LOADDEFAULTOOP)
			markupKey = "Code";

		// Decode JSON.
		try {
			parse.jsonObj = parse.jsonDecode(parse.dataset, markupKey);
			//console.log(parse.jsonObj);
		}
		catch (e)
		{
			zzt.Toast("ERROR:  " + e);
			zzt.mainMode = zzt.MODE_NORM;
			return;
		}
	}

	zzt.mainMode = parse.loadingAction;
	parse.loadingSuccess = true;
};

// Mark up a JSON-syntax string (\n, \r, and other codes < 32)
static makeSafeJSON(s, key) {

	// Get key to locate
	var mKey;
	if (key == "ALL")
		mKey = "\"";
	else
		mKey = "\"" + key + "\":\"";

	var skip = mKey.length;
	var delim = "\"";

	var i = 0;
	while (i < s.length) {
		// Locate key; move beyond it
		i = s.indexOf(mKey, i);
		if (i == -1)
			break;

		i += skip;
		var j = i;

		// Locate bounding quotes
		// Skip marked up quotes
		do {
			j = s.indexOf(delim, j);
			if (j == -1)
				return s; // Bad quote closure?

			j++;
		} while (s.charAt(j - 2) == "\\");

		var s2 = s.substring(i, j);

		// Carriage returns are removed
		s2 = utils.replaceAll(s2, "\r", "");

		// Genuine newlines must be translated to marked-up newlines
		var s2 = utils.replaceAll(s2, "\n", "\\n");

		// All other characters below code 32 are marked up if found
		var s3 = "";
		for (var k = 0; k < s2.length; k++) {
			var c = s2.charCodeAt(k);
			if (c == 92)
			{
				if (s2.charCodeAt(k+1) < 32)
				{
					// Special:  singular backslash.  Mark it up.
					console.log("Singular backslash before " + s2.charCodeAt(k+1));
					s3 += "\\\\";
				}
				else
				{
					// Normal markup.
					s3 += "\\";
				}
			}
			else if (c < 32)
			{
				// Unicode character markup needed.
				console.log("Marked up code " + c);
				s3 += "\\u00" + utils.hexcode(c);
				//s3 += parse.unicodeRep0To31[c];
			}
			else
			{
				// Normal character.
				s3 += s2.charAt(k);
			}
		}

		var s3Len = s3.length;

		s = s.substring(0, i) + s3 + s.substring(j);
		i += s3Len;
	}

	return s;
};

// Decode a JSON string into a JSON object.
static jsonDecode(str, markupKey=null) {
	try {
		if (markupKey != null)
			str = parse.makeSafeJSON(str, markupKey);

		parse.jsonObj = JSON.parse(str);
	}
	catch (e)
	{
		zzt.Toast("ERROR:  " + e);
		parse.jsonObj = null;
	}

	return parse.jsonObj;
};

// Convert object into JSON string
static jsonToText(jObj, sorted=false, purgePattern="") {
	try {
		if (sorted)
		{
			// Sort all keys alphabetically, with periodic line breaks
			var s = parse.getSortedObject(jObj, purgePattern);
			return s;
		}
		else
		{
			// No special handling; has no whitespace worth a mention between items.
			return JSON.stringify(jObj);
		}
	}
	catch (e)
	{
		zzt.Toast("ERROR:  " + e);
	}

	return "";
};

// This extension of jsonToText handles keys in a specific order, and
// purges patterns of keys deemed unnecessary.
static getSortedObject(jObj, purgePattern="") {
	// Get sort order of main keys.
	var mainKeys = [];
	var kObj;
	for (kObj in jObj) {
		var k = kObj.toString();
		if (purgePattern == "")
			mainKeys.push(k);
		else
		{
			// The "purge pattern" allows for some extraneous keys
			// to be removed from the final object as part of this step.
			if (!utils.startswith(k, purgePattern))
				mainKeys.push(k);
		}
	}

	var sortOrder = mainKeys.sort(); //Array.RETURNINDEXEDARRAY

	// Piece together sorted version of object.
	var allStr = "{";
	for (var i = 0; i < sortOrder.length; i++) {
		var thisKey = sortOrder[i];
		var thisVal = jObj[thisKey];
		if (thisKey == "KeyInput" || thisKey == "MouseInput" || thisKey == "Label")
		{
			// Further sort the keys within the sub-object.
			allStr += "\"" + thisKey + "\":" + parse.getSortedObject(thisVal) + ",\n";
		}
		else
		{
			allStr += "\"" + thisKey + "\":" + parse.jsonToText(thisVal) + ",\n";
		}
	}

	// Modify closing characters and return.
	if (sortOrder.length > 0)
	{
		allStr = allStr.substr(0, allStr.length - 2);
	}

	return (allStr + "}");
};

// File upload prompt
static loadLocalFile(extension, action, cancelAction=-1) {
	parse.localFileSource = true;
	parse.loadingMessage = "Loading...";
	parse.loadingAction = action;
	parse.loadingSuccess = false;
	parse.cancellingAction = cancelAction;

	parse.allowFileBrowse = false;
	var inpCtrl = document.getElementById(parse.inputCtrlID);

	inpCtrl.onchange = parse.fileInputStateChange;

	if (extension == "ALL")
		inpCtrl.accept = "*";
	else
		inpCtrl.accept = "." + extension;

	parse.allowFileBrowse = true;
	inpCtrl.click();
};

// We respond to any change in file list within the browser.
static fileInputStateChange(event) {
	if (!parse.allowFileBrowse)
		return;

	var inpCtrl = document.getElementById(parse.inputCtrlID);
	if (!inpCtrl)
		console.log("ERROR:  Unable to find the fileinput element.");
	else if (!inpCtrl.files)
		console.log("ERROR:  No support for the 'files' property of file inputs.");
	else if (inpCtrl.files[0])
	{
		// File name is set; load file.
		parse.fileRef = inpCtrl.files[0];
		console.log("Local file " + parse.fileRef.name + " is " + parse.fileRef.size + " bytes in size");
		parse.loadingName = parse.fileRef.name;
		parse.selectHandler();
	}
	else
	{
		if (cancelAction != -1)
			parse.cancelHandler();
	}

	parse.allowFileBrowse = false;
};

// Selection handler (loads local file)
static selectHandler() {
	zzt.showLoadingAnim = true;
	var reader = new FileReader();
	reader.onload = parse.bCompleteHandler;
	reader.readAsArrayBuffer(parse.fileRef);
};

// File load complete handler.
static bCompleteHandler(event) {
	zzt.showLoadingAnim = false;
	if (parse.localFileSource)
	{
		var myLoadedFile = event.target.result;
		parse.fileData = ByteArray.fromArrayBuffer(myLoadedFile);
		parse.lastFileName = parse.loadingName;
	}
	else if (parse.embedData != null)
		parse.fileData = parse.embedData;
	else
	{
		myLoadedFile = parse.myLoader.response;
		parse.fileData = ByteArray.fromArrayBuffer(myLoadedFile);
	}

	//console.log(parse.fileData.length);

	if (parse.loadingAction == zzt.MODE_LOADZIP)
	{
		try {
			parse.zipData = new ZipFile(parse.fileData);
			if (parse.zipData.hasError)
			{
				zzt.Toast("ERROR:  Unable to load ZIP file.");
				zzt.mainMode = zzt.MODE_NORM;
				return;
			}
		}
		catch (e)
		{
			zzt.Toast("ERROR:  " + e);
			zzt.mainMode = zzt.MODE_NORM;
			return;
		}
	}

	parse.originalAction = zzt.mainMode;
	zzt.mainMode = parse.loadingAction;
	parse.loadingSuccess = true;
};

// Load file over HTTP
static loadRemoteFile(filename, action, specStr="") {
	parse.localFileSource = false;
	parse.loadingName = filename;
	parse.loadingAction = action;
	parse.loadingMessage = "Loading " + filename + "...";
	parse.loadingSuccess = false;

	parse.lastFileName = filename;
	do {
		var i = parse.lastFileName.indexOf("/");
		if (i != -1)
			parse.lastFileName = parse.lastFileName.substr(i + 1);
		else
		{
			i = parse.lastFileName.indexOf("\\");
			if (i != -1)
				parse.lastFileName = parse.lastFileName.substr(i + 1);
		}
	} while (i != -1);

	parse.embedData = parse.getEmbeddedFile(filename);
	if (parse.embedData != null)
	{
		// Special embedded file instant-load.
		parse.bCompleteHandler(null);
		return;
	}

	zzt.showLoadingAnim = true;

	try {
		parse.myLoader = new XMLHttpRequest();

		// Formulate HTTP GET request URL
		var url = parse.domainPrefix + filename;
		if (specStr != "")
			url += "?spec=" + specStr;

		parse.myLoader.open('GET', url);
		parse.myLoader.overrideMimeType("application/octet-stream"); // Force browser to treat file as binary
		parse.myLoader.responseType = "arraybuffer";
		parse.myLoader.onreadystatechange = parse.bLoaderStateChange;
		parse.myLoader.send();
	}
	catch (e)
	{
		zzt.Toast("ERROR:  " + e);
		return;
	}
};

static bLoaderStateChange() {
	// We are only interested in treating the response as complete
	// for state 4 (request complete; response ready).
	//console.log(parse.myLoader.readyState, (parse.myLoader.status, (parse.myLoader.statusText);
	if (parse.myLoader.readyState == 4)
	{
		if (parse.myLoader.status == 200)
			parse.bCompleteHandler();
		else
			parse.errorHandler();
	}
};

// File download prompt.  Note that unlike AS3, which allows the user
// direct control over the download location and filename, JS does not
// provide a universal mechanism for downloads.  Adding a file to the
// document could do a lot of things based on the browser, the browser
// settings, etc.  We "try" to set a filename, but whatever.
static saveLocalFile(localFile, action, cancelAction, saveData) {
	parse.localFileSource = true;
	parse.loadingMessage = "Saving...";
	parse.loadingAction = action;
	parse.loadingSuccess = false;
	parse.cancellingAction = cancelAction;

	if (localFile.charAt(0) == ".")
		localFile = "untitled" + localFile;

	parse.lastFileName = localFile;

	// Either text or a ByteArray can be saved.  Convert to something Blob can use.
	if (typeof saveData == "string")
		saveData = ByteArray.tEncoder.encode(saveData);
	else
		saveData = saveData.m_uint8.slice(0, saveData.length);

	var fDownload = document.createElement(parse.downloadID);
	var blob = new Blob([saveData], {'type':'application/octet-stream'});
	fDownload.href = window.URL.createObjectURL(blob);
	fDownload.download = localFile;

	if (document.createEvent) {
		// Firefox
		var mEvent = document.createEvent('MouseEvents');
		mEvent.initEvent('click', true, true);
		fDownload.dispatchEvent(mEvent);
	}
    else {
		// Chrome
		fDownload.click();
    }

	// Lack of dedicated event handling prevents us from truly knowing
	// what happened to the file (saved or not).  We assume it worked.
	parse.bSCompleteHandler(null);
};

// File download complete handler.
static bSCompleteHandler(event) {
	zzt.showLoadingAnim = false;
	zzt.mainMode = parse.loadingAction;
	parse.loadingSuccess = true;
	//console.log("Successful save.");
};

// Special PWAD load operation; uses remote file load to patch current IWAD.
static pwadLoad(pwadIndex, action) {
	if (!utils.ciTest(pwadIndex, parse.lastFileName))
		return false; // Not in PWAD index

	// Save just-loaded file name and data
	parse.origFileData = parse.fileData;
	parse.origLastFileName = parse.lastFileName;
	parse.pwadKey = utils.ciLookup(pwadIndex, parse.lastFileName).toString();

	// Load PWAD file
	parse.loadRemoteFile(parse.pwadKey, action);
	return true;
};

// Integrated HTML page load (replacing self)
static replacePage(newUrl) {
	var url = "http://www.chriskallen.com/zzt/" + newUrl;
	window.open(url, '_self');
};

// Integrated HTML page load (opening blank window)
static blankPage(newUrl) {
	var url = "http://www.chriskallen.com/zzt/" + newUrl;
	window.open(url, '_blank');
};

}

parse.initClass();
