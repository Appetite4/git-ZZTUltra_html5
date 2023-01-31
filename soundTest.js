// soundTest.js:  Sound test interface business logic.

class soundTest {

static initClass() {

// Set this to true when testing locally.
// Will still submit to the production website, but only reads text file from local storage.
soundTest.testLocal = false;

// Constants
soundTest.PAGE_MAIN = 0;
soundTest.PAGE_UPLOAD = 1;

soundTest.MAX_MISTAKE_ALLOWED = 4;
soundTest.LOGIN_DURATION = 30 * 60 * 30; // 30 minutes

// Login tunes
soundTest.loginTunes = [
	"ICXFXGXCXFXGXCXFX",
	"IDGFGCGEG",
	"IFGAGFEDC",
	"IDGECQDG",
	"IEEEESD#EIF#E",
	"ICD#FGFD#QCX",
	"IFA#FAFAFA",
	"ICEGAA#AGE",
	"IF#G#IAG#F#E",
	"IAG#XF#XEXF#XG#XHAIX"
];
soundTest.masterTune = "SC#CC#CC#XXXSC#CC#D#FD#FF#G#GG#GG#XXX";
soundTest.masterMatch = "C#CC#CC#C#CC#D#FD#FF#G#GG#GG#";

// Song filters
soundTest.allFilters = [];

soundTest.platformFilters = [
"AMIGA",
"COMMODORE",
"KONAMI",
"NES",
"NOVELTY",
"SNES",
"SUPER",
"ULTRA"
];

soundTest.gameFilters = [
"Banana Quest",
"Bucky O'Hare",
"Burger Joint",
"Burglar!",
"Dungeons",
"Edible Vomit",
"Elis House",
"Ezanya",
"Final Fantasy",
"Frost",
"Giana",
"Jacky T",
"Lebensraum",
"Lost Forest",
"Merbotia",
"Mercenary",
"Metal Gear",
"Monster Zoo",
"NARC",
"Ned the Knight",
"Secret of Evermore",
"Super Mario Bros. 3",
"Smash ZZT",
"Town",
"Winter"
];

soundTest.authorFilters = [
"Alexis Janson",
"Allen Pilgrim",
"Al Payne",
"Bitbot",
"Brian L. Schmidt",
"Christopher Allen",
"Chris Huelsbeck",
"Claude Debussy",
"Danny Bloody Baranowsky",
"Doc Pomus",
"Draco",
"Ennio Morricone",
"GingerMuffins",
"Harry M. Woods",
"Herbie Hancock",
"Interactive Fantasies",
"Jeremy LaMar",
"Jeremy Soule",
"Johann Pachelbel",
"Jon Hey",
"Kev Carter",
"Koji Kondo",
"Lipid",
"MadTom",
"Marshall Parker",
"Matt Dabrowski",
"Michael Jackson",
"Monte Emerson",
"Mort Dixon",
"Mort Shuman",
"Mozart",
"Myth",
"N. Nakazato",
"Nobuo Uematsu",
"Peter, Paul and Mary",
"q2k2k",
"Queen",
"Richard M. Sherman",
"Rick Astley",
"Robert B. Sherman",
"Sonic 256",
"Tim Sweeney",
"T. Sumiyama",
"Todd Daggert",
"Viovis Acropolis",
"WiL",
"Wong Chung Bang",
"Yoko O.",
"Zenith Nadir"
];

// Controls
soundTest.cbFilter = null;
soundTest.lbLibrary = null;
soundTest.txtSongInfo = null;
soundTest.txtCurTime = null;
soundTest.tbPrefix = null;
soundTest.taSong = null;
soundTest.scrTimeline = null;
soundTest.scrCont = null;
soundTest.sbMainVolume = null;
soundTest.bUpload = null;
soundTest.bPlay = null;
soundTest.bStop = null;
soundTest.bLoopPlay = null;
soundTest.bPause = null;

soundTest.bMsgCont = null;
soundTest.bMsgTxt = null;

soundTest.tbContrib = null;
soundTest.tbTitle = null;
soundTest.tbCover = null;
soundTest.tbAuthor = null;
soundTest.tbGame = null;
soundTest.tbYear = null;
soundTest.tbTags = null;
soundTest.tbDesc = null;
soundTest.bUpdate = null;

soundTest.txtMessage = null;

// Dataset vars
soundTest.dataset = "";
soundTest.jsonObj = null;
soundTest.lObj = null;

soundTest.maxUID = 1;
soundTest.libraryUIDs = [];
soundTest.libraryNames = [];
soundTest.libraryDisp = [];
soundTest.libraryChanging = false;
soundTest.extraSongObj = {
	"contrib": "",
	"title": "[New Song Title]",
	"cover": "",
	"author": "",
	"game": "",
	"year": "",
	"tags": "",
	"desc": "",
	"song": ""
};
soundTest.usingExtraSong = false;

// Loading status
soundTest.isInit = false;
soundTest.loadingName = "";
soundTest.myLoader = null;
soundTest.loadingSuccess = false;
soundTest.loadMode = 0;
soundTest.tickTimer;
soundTest.mcount = 0;
soundTest.loginRefreshTime = 0;
soundTest.partialUpdate = false;
soundTest.canLogin = false;

// Timeline management
soundTest.chanDurations = new Array(Sounds.NUM_CHANNELS);
soundTest.chanTempoMultiplier = new Array(Sounds.NUM_CHANNELS);
soundTest.chanPos = new Array(Sounds.NUM_CHANNELS);
soundTest.chanStrings = new Array(Sounds.NUM_CHANNELS);
soundTest.chanDone = new Array(Sounds.NUM_CHANNELS);
soundTest.lastChannel = 0;
soundTest.lastTempoMultiplier = 1.0;
soundTest.lastDuration = FxEnvelope.T1_DURATION;
soundTest.songDuration = 44100.0;
soundTest.middleMSTime = 0.0;
soundTest.runningTicks = 0;
soundTest.msgTimeout = 0;

soundTest.scrMaxPosition = 100.0;
soundTest.scrPageSize = 10.0;
soundTest.scrPosition = 0.0;

// Action-on-start
soundTest.initPlaySongName = "";
soundTest.initFilterName = "";
soundTest.initLoopPlay = 0;
soundTest.initStartTime = 0.0;

// Other
soundTest.activePage = 0;
soundTest.uploadMod = false;
soundTest.lastListSel = -1;
soundTest.loggedIn = false;
soundTest.masterKey = false;
soundTest.badStanding = false;
soundTest.userStartedPlay = false;
soundTest.userPausedPlay = false;
soundTest.userSetMiddlePlay = false;
soundTest.loopingActive = false;
soundTest.loopingPosted = false;
soundTest.shownUpload = false;
soundTest.defaultPrefix = "Z01@U137V40K40:0.3:";
soundTest.userName = "";
soundTest.playedNoteSequence = "";
soundTest.reqNoteSequence = "";
soundTest.myNoteSequence = "";
soundTest.mistakeDelay = utils.int(250 * 30 / 1000);
soundTest.mistakeTimeOut = 0;
soundTest.mistakeCount = 0;
soundTest.gcTriviaFlag = false;
soundTest.gcTriviaCount = utils.int(3000 * 30 / 1000);
};

// Constructor
static init() {
	// Set up song filters
	soundTest.isInit = true;
	soundTest.initSongFilters();

	// Main
	soundTest.cbFilter = soundTest.getUIComponentByName("cb_filter");
	soundTest.lbLibrary = soundTest.getUIComponentByName("lb_library");
	soundTest.txtSongInfo = soundTest.getUIComponentByName("txt_songinfo");
	soundTest.txtCurTime = soundTest.getUIComponentByName("txt_curtime");
	soundTest.tbPrefix = soundTest.getUIComponentByName("tb_prefix");
	soundTest.taSong = soundTest.getUIComponentByName("ta_song");
	soundTest.sbMainVolume = soundTest.getUIComponentByName("sb_mainvolume");
	soundTest.bUpload = soundTest.getUIComponentByName("b_upload");
	soundTest.bPlay = soundTest.getUIComponentByName("b_play");
	soundTest.bLoopPlay = soundTest.getUIComponentByName("b_loopplay");
	soundTest.bStop = soundTest.getUIComponentByName("b_stop");
	soundTest.bPause = soundTest.getUIComponentByName("b_pause");
	soundTest.scrTimeline = soundTest.getUIComponentByName("scr_timeline");
	soundTest.scrCont = soundTest.getUIComponentByName("scr_cont");

	// Upload
	soundTest.tbContrib = soundTest.getUIComponentByName("tb_contrib");
	soundTest.tbTitle = soundTest.getUIComponentByName("tb_title");
	soundTest.tbCover = soundTest.getUIComponentByName("tb_cover");
	soundTest.tbAuthor = soundTest.getUIComponentByName("tb_author");
	soundTest.tbGame = soundTest.getUIComponentByName("tb_game");
	soundTest.tbYear = soundTest.getUIComponentByName("tb_year");
	soundTest.tbTags = soundTest.getUIComponentByName("tb_tags");
	soundTest.tbDesc = soundTest.getUIComponentByName("tb_desc");
	soundTest.bUpdate = soundTest.getUIComponentByName("b_update");

	// Message
	soundTest.bMsgCont = soundTest.getUIComponentByName("txt_msg_overlay");
	soundTest.bMsgTxt = soundTest.getUIComponentByName("txt_msg");

	// Add filter strings to combo box
	for (var j = 0; j < soundTest.allFilters.length; j++) {
		var o = document.createElement("option");
		o.text = soundTest.allFilters[j];
		soundTest.cbFilter.add(o);
	}

	soundTest.scrTimeline.style.left = "0px";
	soundTest.scrTimeline.style.width = "5%";
	soundTest.tbPrefix.value = soundTest.defaultPrefix;

	// Load library
	soundTest.loadSongLibrary();

	// Add event handlers
	soundTest.bUpload.onclick = soundTest.showUploadScreen;
	soundTest.bPlay.onclick = soundTest.playSong;
	soundTest.bLoopPlay.onclick = soundTest.loopPlaySong;
	soundTest.bStop.onclick = soundTest.stopSong;
	soundTest.bPause.onclick = soundTest.pauseSong;
	soundTest.bUpdate.onclick = soundTest.updateSong;

	soundTest.sbMainVolume.onchange = soundTest.setMasterVolume;
	soundTest.lbLibrary.onchange = soundTest.loadFromLibrary;
	soundTest.cbFilter.onchange = soundTest.changeFilter;
	soundTest.scrCont.onclick = soundTest.modScrollTimeline;

	// Read GET variables from URL, if any
	var params = (new URL(document.location)).searchParams;
	var vSong = soundTest.tryGetParam(params, "song");
	var vFilter = soundTest.tryGetParam(params, "filter");
	var vLoop = soundTest.tryGetParam(params, "loop");
	var vTime = soundTest.tryGetParam(params, "time");

	if (vSong)
		soundTest.initPlaySongName = vSong;
	if (vFilter)
		soundTest.initFilterName = vFilter;
	if (vLoop)
		soundTest.initLoopPlay = utils.int0(vLoop);
	if (vTime)
		soundTest.initStartTime = utils.float0(vTime);
};

static tryGetParam(params, k) {
	var v = params.get(k);
	if (v)
		return v;
	else
		return params.get(k.toUpperCase());
};

static initSongFilters() {
	// Initialize the "all filters" list.
	soundTest.allFilters = [];
	var i;

	// Add platform filters.
	soundTest.allFilters.push("[No Filter]");
	soundTest.allFilters.push("");
	soundTest.allFilters.push("-- Platforms --");
	for (i = 0; i < soundTest.platformFilters.length; i++) {
		soundTest.allFilters.push(soundTest.platformFilters[i]);
	}

	// Add game filters.
	soundTest.allFilters.push("");
	soundTest.allFilters.push("-- Games --");
	for (i = 0; i < soundTest.gameFilters.length; i++) {
		soundTest.allFilters.push(soundTest.gameFilters[i]);
	}

	// Add author filters.
	soundTest.allFilters.push("");
	soundTest.allFilters.push("-- Authors --");
	for (i = 0; i < soundTest.authorFilters.length; i++) {
		soundTest.allFilters.push(soundTest.authorFilters[i]);
	}
}

// This function fetches a user interface component.
static getUIComponentByName(str) {
	var uiComp = document.getElementById(str);
	return uiComp;
}

// Set a song info value.
static setSongInfoText(k, val) {
	var idx = -1;
	var nm = "";

	switch (k) {
		case "contrib":
			idx = 0;
			nm = "tb_contrib";
		break;
		case "title":
			idx = 1;
			nm = "tb_title";
		break;
		case "cover":
			idx = 2;
			nm = "tb_cover";
		break;
		case "author":
			idx = 3;
			nm = "tb_author";
		break;
		case "game":
			idx = 4;
			nm = "tb_game";
		break;
		case "year":
			idx = 5;
			nm = "tb_year";
		break;
		case "tags":
			idx = 6;
			nm = "tb_tags";
		break;
		case "desc":
			idx = 7;
			nm = "tb_desc";
		break;
	}

	if (idx != -1)
	{
		if (soundTest.activePage == 0)
		{
			// Main page:  set label text
			if (k == "contrib")
			{
				val = "&nbsp;";
				soundTest.txtSongInfo.rows[idx].cells[0].innerHTML = "&nbsp;";
			}

			soundTest.txtSongInfo.rows[idx].cells[1].innerHTML = "<LBTEXT>" + val + "</LBTEXT>";
			var uiComp = document.getElementById(nm);
			uiComp.hidden = true;
		}
		else
		{
			// Upload page:  set text box
			soundTest.txtSongInfo.rows[idx].cells[1].innerHTML = "&nbsp;";
			var uiComp = document.getElementById(nm);
			uiComp.value = val;
			uiComp.hidden = false;

			if (k == "contrib")
				soundTest.txtSongInfo.rows[idx].cells[0].innerHTML = "<LBTEXT>" + "Contributor:" + "</LBTEXT>";
		}
	}
}

static keyPressed(theCode, shiftStatus, ctrlStatus) {
	// Process shortcuts for key combinations
	switch (theCode) {
		case 116: // F5
			if (!ctrlStatus)
				soundTest.basicPlaySong();
		break;
		case 117: // F6
			if (!ctrlStatus)
				soundTest.loopPlaySong(null);
		break;
		case 118: // F7
		case 19: // Pause/Break
			if (!ctrlStatus)
				soundTest.pauseSong(null);
		break;
		case 119: // F8
			if (!ctrlStatus)
				soundTest.stopSong(null);
		break;
	}
}

static showMainScreen(event)
{
	if (soundTest.lbLibrary.selectedIndex == 0)
		soundTest.updateExtraSongObj();

	soundTest.activePage = soundTest.PAGE_MAIN;
	soundTest.bUpdate.hidden = true;
	soundTest.bUpload.innerHTML = "Enter Upload Mode";
	soundTest.loadFromLibrary(null);
}

static showUploadScreen(event)
{
	if (soundTest.activePage == soundTest.PAGE_UPLOAD)
	{
		soundTest.showMainScreen(event);
		return;
	}

	soundTest.loggedIn = true;
	soundTest.tbContrib.value = soundTest.userName;
	soundTest.activePage = soundTest.PAGE_UPLOAD;
	soundTest.uploadMod = false;

	// Ensure entire library is shown
	soundTest.cbFilter.selectedIndex = 0;
	soundTest.populateLibraryList("");

	if (!soundTest.shownUpload)
	{
		soundTest.usingExtraSong = true;
		soundTest.shownUpload = true;
	}
	else
		soundTest.usingExtraSong = false;

	soundTest.lbLibrary.selectedIndex = 0;
	soundTest.loadFromLibrary(null);

	soundTest.bUpdate.hidden = false;
	soundTest.bUpload.innerHTML = "Leave Upload Mode";
}

// Find keyword match.
static kwFilterMatch(s, fText) {
	var idx = s.indexOf(fText);
	if (idx == -1)
		return false;

	// Keyword match favors whole words only.
	var tChars = [0, 0];
	if (idx > 0)
		tChars[0] = s.charCodeAt(idx - 1);
	if (idx + fText.length < s.length)
		tChars[1] = s.charCodeAt(idx + fText.length);

	for (var i = 0; i < 2; i++)
	{
		var c = tChars[i];
		if (c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122)
			return false;
	}

	return true;
}

static safeText(s) {
	s = utils.replaceAll(s, "\"", "'");
	s = utils.replaceAll(s, "\\", "");
	return s;
}

static cleanZZTOOP(s) {
	// Transform #PLAY into ordinary state reset
	s = (s.split("#PLAY").join("@"));

	// Purge a variety of ZZT-OOP commands that would cause problems
	s = (s.split("\r\n").join("\n"));
	s = (s.split("\r").join("\n"));

	var idx = s.indexOf("\n#");
	while (idx != -1) {
		var idx2 = s.indexOf("\n", idx + 1);
		if (idx2 == -1)
		{
			// Clip last statement
			s = s.substring(0, idx);
			break;
		}
		else
		{
			// Remove command
			s = s.substring(0, idx) + s.substring(idx2);
			idx = s.indexOf("\n#", idx);
		}
	}

	return s;
}

static showMessage(msg) {
	soundTest.bMsgTxt.rows[0].cells[0].innerHTML = "<H1>" + utils.replaceAll(msg, "\n", "<BR>") + "</H1>";
	soundTest.bMsgCont.hidden = false;
	soundTest.msgTimeout = 60;
}

static updateSong(event)
{
	// Check if required fields present
	soundTest.uploadMod = true;
	if (soundTest.tbTitle.value == "" || soundTest.tbCover.value == "" || soundTest.tbGame.value == "" ||
		soundTest.tbYear.value == "" || soundTest.taSong.value == "" || soundTest.tbContrib.value == "")
	{
		soundTest.showMessage("These fields are required:\n\n\
Contributor E-mail, Title, Covered By, Game, Year, Song");
		return;
	}

	// Update object (if new).
	var foundIdx = soundTest.lbLibrary.selectedIndex;
	var unique = Boolean(foundIdx == 0);
	if (unique)
		soundTest.updateExtraSongObj();

	// Get song info.
	var uid = soundTest.libraryUIDs[foundIdx];
	var lObj = soundTest.jsonObj[uid];

	// Establish contributor.
	if (soundTest.userName.indexOf("@") == -1)
	{
		// No username set; use entry set in current field.
		soundTest.userName = lObj.contrib;
	}

	if (soundTest.userName != lObj.contrib) // || lObj.contrib == "chris@chriskallen.com")
	{
		soundTest.showMessage("Unable to modify this entry.\n\n\
You are not the original contributor.");
		return;
	}

	if (soundTest.userName.indexOf("@") == -1)
	{
		soundTest.showMessage("You must enter a valid e-mail address.");
		return;
	}

	// Base fields
	uid = unique ? (soundTest.maxUID + 1).toString() : uid;
	var title = soundTest.tbTitle.value;
	var cover = soundTest.tbCover.value;
	var author = soundTest.tbAuthor.value;
	var game = soundTest.tbGame.value;
	var year = soundTest.tbYear.value;
	var tags = soundTest.tbTags.value;
	var desc = soundTest.tbDesc.value;
	var song =  soundTest.taSong.value;
	var contrib = soundTest.userName;

	song = soundTest.safeText(song);
	song = utils.replaceAll(song, "\r\n", "\n");
	song = utils.replaceAll(song, "\r", "");

	// Create package for submittal
	var newSubmission = "\"" + uid +
		"\":{\n\"title\":\"" + soundTest.safeText(title) + "\",\n\"cover\":\"" + soundTest.safeText(cover) +
		"\",\n\"author\":\"" + soundTest.safeText(author) + "\",\n\"game\":\"" + soundTest.safeText(game) +
		"\",\n\"year\":\"" + soundTest.safeText(year) + "\",\n\"tags\":\"" + soundTest.safeText(tags) +
		"\",\n\"desc\":\"" + soundTest.safeText(desc) + "\",\n\"contrib\":\"" + soundTest.safeText(contrib) +
		"\",\n\"song\":\"" + song + "\"\n},\n\n";
	//utils.trace(newSubmission);

	var paths = soundTest.getBackendPaths();
	soundTest.submitSong(paths[1], newSubmission, unique);
}

static playSong(event) {
	soundTest.basicPlaySong();
}

static basicPlaySong(useLooping=false) {
	// Signal restart if any sounds are still playing.
	Sounds.stopAllChannels();
	Sounds.audioCtx.resume();

	// Join prefix and main song text; play.
	var prefix = soundTest.tbPrefix.value;
	var s;
	var scr;
	if (soundTest.activePage == soundTest.PAGE_MAIN)
	{
		s = soundTest.taSong.value;
		scr = soundTest.scrTimeline;
	}
	else
	{
		s = soundTest.taSong.value;
		scr = soundTest.scrUTimeline;
	}

	// If the user posted a #PLAY statement, change to @.
	s = soundTest.cleanZZTOOP(s.toUpperCase());

	// TBD:  Purge other ZZT-OOP commands that would disrupt operations.

	// Glass Canon super powers tune flag?
	if (utils.allStrip(s) == "@+QDEC-CG")
	{
		soundTest.gcTriviaFlag = true;
		soundTest.taSong.value = "THIS TUNE HAS SUPER POWERS";
	}

	// Set scrollbar info and max time from samples time.
	s = prefix + s;
	soundTest.songDuration = soundTest.calcSamplesTime(s);
	var oldPos = soundTest.scrPosition;
	soundTest.scrMaxPosition = soundTest.songDuration;
	soundTest.scrPageSize = soundTest.songDuration / 10.0;
	soundTest.setTimeValue(1, soundTest.songDuration);

	if (soundTest.userSetMiddlePlay)
	{
		// User had set a middle position (from a pause or manual
		// scrollbar adjustment).  Modify string accordingly.
		soundTest.runningTicks = soundTest.msTime2Ticks(soundTest.middleMSTime);
		s = soundTest.createMiddlePlayString(prefix, s, soundTest.middleMSTime);
		soundTest.userSetMiddlePlay = false;
	}
	else
	{
		// Start song from the beginning.
		soundTest.runningTicks = 0;
		soundTest.scrPosition = oldPos;
		soundTest.setScrollThumb();
	}

	// Start playing notes.
	soundTest.loopingActive = useLooping;
	soundTest.loopingPosted = false;
	soundTest.userStartedPlay = true;
	soundTest.userPausedPlay = false;
	Sounds.distributePlayNotes(s);
	Sounds.playVoice();
}

static loopPlaySong(event)
{
	if (soundTest.userStartedPlay && !soundTest.userPausedPlay && Sounds.isAnyChannelPlaying())
		soundTest.loopingActive = true;
	else
		soundTest.basicPlaySong(true);
}

static pauseSong(event)
{
	if (soundTest.userStartedPlay && soundTest.userPausedPlay)
	{
		// Treat as unpause if already playing.
		soundTest.basicPlaySong();
		return;
	}

	// Log middle position of song.
	soundTest.userPausedPlay = true;
	soundTest.userSetMiddlePlay = true;
	soundTest.loopingActive = false;
	soundTest.loopingPosted = false;
	soundTest.middleMSTime = soundTest.ticks2MSTime(soundTest.runningTicks);

	// Stop all channels.
	Sounds.stopAllChannels();
}

static getRealOffset(event) {
	var x = 0;
	var y = 0;

	while (event) {
		if (event.tagName == "BODY")
		{
			var xOff = event.scrollLeft || document.documentElement.scrollLeft;
			var yOff = event.scrollTop || document.documentElement.scrollTop;
			x += (event.offsetLeft - xOff + event.clientLeft);
			y += (event.offsetTop - yOff + event.clientTop);
		}
		else
		{
			x += (event.offsetLeft - event.scrollLeft + event.clientLeft);
			y += (event.offsetTop - event.scrollTop + event.clientTop);
		}

		event = event.offsetParent;
	}

	return [x, y];
}

static modScrollTimeline(event)
{
	// Any scroll event that happens during playback is assumed to be as a result
	// of the timer routine.  Do not log a user-set middle position.
	if (soundTest.userStartedPlay && !soundTest.userPausedPlay && Sounds.isAnyChannelPlaying())
	{
		soundTest.userSetMiddlePlay = false;
		return;
	}

	// Assume user modified scroll position to set the timeline manually.
	if (soundTest.songDuration > 0.0)
	{
		var parentPos = soundTest.getRealOffset(event.currentTarget);
		var x = event.clientX - parentPos[0];
		var y = event.clientY - parentPos[1];

		soundTest.getScrollThumb(x);
		soundTest.setScrollThumb();
		soundTest.middleMSTime = soundTest.samples2MSTime(soundTest.scrPosition);
		soundTest.setTimeValue(0, soundTest.scrPosition);
		soundTest.userSetMiddlePlay = true;
	}
	else
	{
		soundTest.userSetMiddlePlay = false;
	}
}

static getScrollThumb(x) {
	soundTest.scrPosition = x * soundTest.scrMaxPosition / soundTest.scrCont.offsetWidth;
	return soundTest.scrPosition;
}

static setScrollThumb() {
	var w = soundTest.scrCont.offsetWidth;
	var px = utils.int(w * soundTest.scrPosition / soundTest.scrMaxPosition);
	if (px > w)
		px = w;

	soundTest.scrTimeline.style.width = px.toString() + "px";
}

static stopSong(event)
{
	// Clear playing status.
	soundTest.userStartedPlay = false;
	soundTest.userPausedPlay = false;
	soundTest.userSetMiddlePlay = false;
	soundTest.loopingActive = false;
	soundTest.loopingPosted = false;
	soundTest.middleMSTime = 0.0;

	var scr = (soundTest.activePage == soundTest.PAGE_MAIN) ? soundTest.scrTimeline : soundTest.scrUTimeline;
	soundTest.scrPosition = 0.0;
	soundTest.setScrollThumb();
	soundTest.setTimeValue(0, 0.0);

	// Stop all channels.
	Sounds.stopAllChannels();
}

static setMasterVolume(event)
{
	// Set master volume.
	Sounds.setMasterVolume(utils.int(soundTest.sbMainVolume.value));
}

static getBackendPaths() {
	// Get the "read" and "write" HTTP request paths used for the library.
	var randNum = utils.randrange(0, 65536);

	if (soundTest.testLocal)
	{
		// Read from local file; submit directly to absolute server location
		return ["guis/song_library.txt", "http://www.chriskallen.com/zzt/guis/submit_song.php"];
	}
	else
	{
		// Read/Write based on server relative reference
		return ["guis/song_library.php?rand=" + randNum.toString(), "guis/submit_song.php"];
	}
}

static loadSongLibrary() {
	var paths = soundTest.getBackendPaths();
	soundTest.loadTextFile(paths[0]);
}

static setupLibrary() {
	if (!soundTest.loadingSuccess)
		return false;

	// Load object with sorted key order
	var altLibraryUIDs = []
	var altLibraryNames = [];
	var kObj;

	for (kObj in soundTest.jsonObj)
	{
		var uid = kObj.toString();
		var uidNum = utils.int(uid);
		var lName = soundTest.jsonObj[uid]["title"].toString();
		if (lName != "dummy" && uidNum != -1)
		{
			altLibraryUIDs.push(uid);
			altLibraryNames.push(lName);
			if (soundTest.maxUID < uidNum)
				soundTest.maxUID = uidNum;
		}
	}

	// Ensure library UIDs and names are properly sorted
	altLibraryNames.sort();
	soundTest.libraryUIDs = [];
	soundTest.libraryNames = [];

	// Add new song as first item
	soundTest.libraryUIDs.push("-1");
	soundTest.libraryNames.push("[New Song Title]");
	soundTest.jsonObj["-1"] = soundTest.extraSongObj;

	// Add rest of list
	for (var j = 0; j < altLibraryNames.length; j++) {
		for (kObj in soundTest.jsonObj) {
			uid = kObj.toString();
			var o = soundTest.jsonObj[uid];
			lName = o["title"].toString();

			if (altLibraryNames[j] == lName)
			{
				soundTest.libraryUIDs.push(uid);
				soundTest.libraryNames.push(lName);
				break;
			}
		}
	}

	// Populate list with appropriate filter
	return (soundTest.populateLibraryList());
}

static populateLibraryList(fText="") {
	// Populate library list box with filtered entries
	soundTest.libraryChanging = true;
	soundTest.libraryDisp = [];

	while (soundTest.lbLibrary.length > 0)
		soundTest.lbLibrary.remove(0);

	for (var i = 0; i < soundTest.libraryNames.length; i++) {
		var name = soundTest.libraryNames[i];
		var uid = soundTest.libraryUIDs[i];
		var entry = soundTest.jsonObj[uid];
		var useEntry = false;

		// If filter text is empty, show all entries.
		if (fText == "")
			useEntry = true;
		else
		{
			// Entry is used only if keyword match(es) are present.
			useEntry =
				soundTest.kwFilterMatch(name, fText) ||
				soundTest.kwFilterMatch(entry.cover, fText) ||
				soundTest.kwFilterMatch(entry.author, fText) ||
				soundTest.kwFilterMatch(entry.game, fText) ||
				soundTest.kwFilterMatch(entry.tags, fText) ||
				soundTest.kwFilterMatch(entry.desc, fText);
		}

		if (useEntry)
		{
			var o = document.createElement("option");
			o.text = name;
			soundTest.lbLibrary.add(o);
			soundTest.libraryDisp.push(entry);
		}
	}

	soundTest.libraryChanging = false;
	return true;
}

// Find index of title within either the entire list or the filtered list.
static findInLibrary(title, fromFilteredList) {
	if (fromFilteredList)
	{
		for (var i = 0; i < soundTest.libraryDisp.length; i++) {
			if (soundTest.libraryDisp[i].title == title)
				return i;
		}
	}
	else
	{
		return (soundTest.libraryNames.indexOf(title));
	}

	return -1;
}

static loadFromLibrary(event) {
	var i = soundTest.lbLibrary.selectedIndex;

	// Update the "new" song fields if necessary
	if (soundTest.lastListSel == 0 && soundTest.activePage == soundTest.PAGE_UPLOAD)
		soundTest.updateExtraSongObj();

	if (soundTest.activePage != soundTest.PAGE_MAIN)
		soundTest.uploadMod = true;

	if (soundTest.libraryChanging || (i < 0 || i >= soundTest.libraryDisp.length))
		return;

	// Select object from library
	soundTest.lastListSel = i;
	soundTest.lObj = soundTest.libraryDisp[i];
	if (i == 0)
		soundTest.lObj = soundTest.extraSongObj;

	// Populate information from library entry
	var title = soundTest.lObj.title;
	var cover = soundTest.lObj.cover;
	var author = soundTest.lObj.author;
	var game = soundTest.lObj.game;
	var year = soundTest.lObj.year;
	var tags = soundTest.lObj.tags;
	var desc = soundTest.lObj.desc;
	var contrib = soundTest.lObj.contrib;
	var song = soundTest.lObj.song.toString();

	soundTest.setSongInfoText("contrib", contrib);
	soundTest.setSongInfoText("title", title);
	soundTest.setSongInfoText("cover", cover);
	soundTest.setSongInfoText("author", author);
	soundTest.setSongInfoText("game", game);
	soundTest.setSongInfoText("year", year);
	soundTest.setSongInfoText("tags", tags);
	soundTest.setSongInfoText("desc", desc);
	soundTest.taSong.value = song;

	// Capture song length and other info
	if (!soundTest.userStartedPlay || soundTest.userPausedPlay || !Sounds.isAnyChannelPlaying())
	{
		soundTest.userStartedPlay = false;
		soundTest.userPausedPlay = false;
		soundTest.userSetMiddlePlay = false;

		var scr = (soundTest.activePage == soundTest.PAGE_MAIN) ? soundTest.scrTimeline : soundTest.scrUTimeline;
		soundTest.songDuration = soundTest.calcSamplesTime((soundTest.tbPrefix.value + song).toUpperCase());
		soundTest.scrMaxPosition = soundTest.songDuration;
		soundTest.scrPageSize = soundTest.songDuration / 0.10;
		soundTest.scrPosition = 0.0;
		soundTest.setScrollThumb();
		soundTest.setTimeValue(1, soundTest.songDuration);
		soundTest.setTimeValue(0, 0.0);
	}
}

static updateExtraSongObj() {
	soundTest.extraSongObj["contrib"] = soundTest.tbContrib.value;
	soundTest.extraSongObj["title"] = soundTest.tbTitle.value;
	soundTest.extraSongObj["cover"] = soundTest.tbCover.value;
	soundTest.extraSongObj["author"] = soundTest.tbAuthor.value;
	soundTest.extraSongObj["game"] = soundTest.tbGame.value;
	soundTest.extraSongObj["year"] = soundTest.tbYear.value;
	soundTest.extraSongObj["tags"] = soundTest.tbTags.value;
	soundTest.extraSongObj["desc"] = soundTest.tbDesc.value;
	soundTest.extraSongObj["song"] = soundTest.taSong.value;
}

static changeFilter(event) {
	if (soundTest.activePage != soundTest.PAGE_MAIN)
		return;

	// Get filter selection
	var i = soundTest.cbFilter.selectedIndex;
	var fText = soundTest.allFilters[i];
	if (fText == "[No Filter]" || utils.startswith(fText, "--"))
		fText = "";

	soundTest.populateLibraryList(fText);
}

static loadTextFile(filename) {
	soundTest.loadingName = filename;
	soundTest.myLoader = null;
	soundTest.loadingSuccess = false;
	soundTest.loadMode = 0;

	try {
		soundTest.myLoader = new XMLHttpRequest();
		soundTest.myLoader.overrideMimeType("application/json"); // Use this only when loading JSON
		soundTest.myLoader.open('GET', filename);
		soundTest.myLoader.onreadystatechange = soundTest.loaderStateChange;
		soundTest.myLoader.send();
	}
	catch (e)
	{
		utils.trace("ERROR:  " + e);
		return;
	}
}

static loaderStateChange() {
	// We are only interested in treating the response as complete
	// for state 4 (request complete; response ready).
	utils.trace(soundTest.myLoader.readyState, soundTest.myLoader.status, soundTest.myLoader.statusText);
	if (soundTest.myLoader.readyState == 4)
	{
		// 200 = Complete code.
		//   0 = Apparently an acceptable completion code in Chrome.
		if (soundTest.myLoader.status == 200 || soundTest.myLoader.status == 0)
		{
			if (soundTest.loadMode == 0)
				soundTest.loaderCompleteHandler();
			else
				soundTest.submitCompleteHandler();
		}
		else
			soundTest.errorHandler();
	}
};

// Error handler for file loading attempt.
static errorHandler() {
	utils.trace("IO ERROR:  ", soundTest.myLoader.readyState,
		soundTest.myLoader.status, soundTest.myLoader.statusText);
};

// Written JSON might not have marked up line breaks; fix now.
static makeSafeJSON(s) {
	var sFind = "\"song\":\"";
	var idx = 0;

	while (idx != -1 && idx < s.length) {
		// Find location where markup needed.
		var i = s.indexOf(sFind, idx);
		if (i == -1)
			break;

		// Bound location; get substring.
		i += sFind.length;
		var j = s.indexOf("\"", i);
		var s2 = s.substring(i, j);

		// Mark up substring.
		s2 = utils.replaceAll(s2, "\r\n", "\\n");
		s2 = utils.replaceAll(s2, "\r", "");
		s2 = utils.replaceAll(s2, "\n", "\\n");

		// Replace edited portion.
		var lDif = s2.length - (j - i);
		s = s.substring(0, i) + s2 + s.substring(j);
		idx = j + lDif;
	}

	idx = s.indexOf("<script");
	if (idx != -1)
		s = s.substring(0, idx);

	console.log(s.substring(0, 512));
	console.log(s.substring(s.length - 512, s.length));
	return s;
}

// Handler for file loading success.
static loaderCompleteHandler() {
	// Load song dataset
	soundTest.dataset = soundTest.myLoader.responseText;

	// Decode JSON.
	try {
		soundTest.jsonObj = JSON.parse(soundTest.makeSafeJSON(soundTest.dataset));
	}
	catch (e)
	{
		utils.trace("ERROR:  " + e);
		return;
	}

	// Update library
	soundTest.loadingSuccess = true;
	soundTest.setupLibrary();

	// Set initial list filter, if one provided.
	if (soundTest.initFilterName != "")
	{
		soundTest.populateLibraryListsoundTest(initFilterName);
		soundTest.initFilterName = "";
	}

	if (soundTest.initPlaySongName != "")
	{
		// Play initial song if name indicated in URL
		var i = soundTest.findInLibrary(soundTest.initPlaySongName, false);
		var li = soundTest.findInLibrary(soundTest.initPlaySongName, true);
		if (i != -1)
		{
			soundTest.lbLibrary.selectedIndex = li;
			soundTest.loadFromLibrary(null);

			if (soundTest.initStartTime > 0.0)
			{
				soundTest.userSetMiddlePlay = true;
				soundTest.middleMSTime = soundTest.initStartTime * 1000.0;
			}

			soundTest.basicPlaySong(Boolean(soundTest.initLoopPlay != 0));
		}

		soundTest.initPlaySongName = "";
	}
}

static submitSong(filename, info, isNew) {
	// Get hash of submission
	var hashInt = 13291797;
	for (var i = 0; i < info.length; i++) {
		var c = info.charCodeAt(i);
		hashInt = ((c * 71) + hashInt) & 1073741823;
	}

	// Synth POST variables
	hashInt ^= info.length;
	var params = "submission=" + info + "&isnew=" + (isNew ? "1" : "0") + "&hash=" + hashInt.toString();

	soundTest.loadingName = filename;
	soundTest.myLoader = null;
	soundTest.loadingSuccess = false;
	soundTest.loadMode = 1;

	// Send request
	try {
		soundTest.myLoader = new XMLHttpRequest();
		soundTest.myLoader.open('POST', filename, true);
		soundTest.myLoader.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		soundTest.myLoader.onreadystatechange = soundTest.loaderStateChange;
		soundTest.myLoader.send(params);
	}
	catch (e)
	{
		utils.trace("ERROR:  " + e);
		return;
	}
}

static submitCompleteHandler(event) {
	soundTest.loaderCompleteHandler(event);

	if (soundTest.loadingSuccess)
		soundTest.showMessage("Submitted entry to library.");
}

static jsonToText(jObj, lineBreaks=false, sorted=false) {
	try {
		if (sorted)
		{
			// Sort all keys alphabetically, with periodic line breaks
			var s = soundTest.getSortedObject(jObj);
			return s;
		}
		else if (lineBreaks)
		{
			// Insert line breaks between , and "
			s = JSON.encode(jObj);
			while (s.search(",\"") != -1)
				s = s.replace(",\"", ",\n\"");

			return s;
		}
		else
		{
			// No line breaks; has no whitespace worth a mention between items.
			return JSON.encode(jObj);
		}
	}
	catch (e)
	{
		utils.trace("ERROR:  " + e);
	}

	return "";
}

static getSortedObject(jObj) {
	// Get sort order of main keys.
	var mainKeys = [];
	var kObj;
	for (kObj in jObj)
		mainKeys.push(kObj.toString());

	var sortOrder = mainKeys.sort(Array.RETURNINDEXEDARRAY);

	// Piece together sorted version of object.
	var allStr = "{";
	for (var i = 0; i < sortOrder.length; i++) {
		var thisKey = mainKeys[sortOrder[i]];
		var thisVal = jObj[thisKey];

		if (thisKey == "KeyInput" || thisKey == "Label")
		{
			// Further sort the keys within the sub-object.
			allStr += "\"" + thisKey + "\":" + getSortedObject(thisVal) + ",\n";
		}
		else
		{
			allStr += "\"" + thisKey + "\":" + JSON.encode(thisVal) + ",\n";
		}
	}

	// Modify closing characters and return.
	if (sortOrder.length > 0)
	{
		allStr = allStr.substr(0, allStr.length - 2);
	}

	return (allStr + "}");
}

// This sets the tempo for all channels.
static updateAllTempo(tempoMultiplier) {
	for (var i = 0; i < Sounds.NUM_CHANNELS; i++)
		soundTest.chanTempoMultiplier[i] = soundTest.tempoMultiplier;
}

// Samples and millisecond conversion functions
static samples2MSTime(sTime) {
	return (sTime * 1000.0 / FxEnvelope.SR);
}
static msTime2Samples(msTime) {
	return (msTime * FxEnvelope.SR / 1000.0);
}
static ticks2MSTime(tTime) {
	return (tTime * 1000.0 / 30.0);
}
static msTime2Ticks(msTime) {
	return (msTime * 30.0 / 1000.0);
}

// Set a text field with time value information.
static setTimeValue(destField, sTime) {
	// Get breakdown
	var secTime = soundTest.samples2MSTime(sTime) / 1000.0;
	var minutes = utils.int(secTime / 60.0);
	var seconds = utils.int(secTime - minutes * 60);
	var fracs = secTime - (minutes * 60) - seconds;

	// Piece together string
	var s = "" + minutes + ":";
	if (seconds >= 10)
		s += seconds;
	else
		s += "0" + seconds;

	var sf = fracs.toString();
	var dpIdx = sf.indexOf(".");
	if (dpIdx != -1)
	{
		sf += "000";
		sf = sf.substr(dpIdx, 4);
	}
	else
		sf = ".000";

	s += sf;

	var idx = destField * 2 + 2;
	soundTest.txtCurTime.rows[0].cells[idx].innerHTML = "<LBTEXT>" + s + "</LBTEXT>";
}

// Calculate the total time, in samples, allocated to a specific string.
static calcSamplesTime(pString) {

	// Current channel being parsed
	var curChannel = soundTest.lastChannel;

	// Tempo multiplier for current channel
	var tempoMultiplier = soundTest.lastTempoMultiplier;
	soundTest.updateAllTempo(tempoMultiplier);

	// Note duration for current channel in samples
	var curDuration = soundTest.lastDuration;

	// Total duration of channel in samples
	var chanDuration = 0.0;
	for (var i = 0; i < Sounds.NUM_CHANNELS; i++) {
		soundTest.chanDurations[i] = 0.0;
	}

	var idx = 0;
	var pos = 0;
	var tempoPos = 0;

	while (pos < pString.length) {
		var c = pString.charAt(pos);
		switch (c) {
			// Log note duration
			case "C":
			case "D":
			case "E":
			case "F":
			case "G":
			case "A":
			case "B":
			case "0":
			case "1":
			case "2":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
			case "X":
				chanDuration += curDuration;
				pos++;
			break;

			// Change duration for subsequent notes
			case "W":
				pos++;
				curDuration = FxEnvelope.W1_DURATION * tempoMultiplier;
			break;
			case "H":
				pos++;
				curDuration = FxEnvelope.H1_DURATION * tempoMultiplier;
			break;
			case "Q":
				pos++;
				curDuration = FxEnvelope.Q1_DURATION * tempoMultiplier;
			break;
			case "I":
				pos++;
				curDuration = FxEnvelope.I1_DURATION * tempoMultiplier;
			break;
			case "S":
				pos++;
				curDuration = FxEnvelope.S1_DURATION * tempoMultiplier;
			break;
			case "T":
				pos++;
				curDuration = FxEnvelope.T1_DURATION * tempoMultiplier;
			break;
			case "J":
				pos++;
				curDuration = FxEnvelope.T64_DURATION * tempoMultiplier;
			break;
			case "@":
				pos++;
				curDuration = FxEnvelope.T1_DURATION;
			break;
			case ".":
				pos++;
				curDuration *= 1.5;
			break;
			case "3":
				pos++;
				curDuration *= 0.3333333333;
			break;

			// Control codes must be skipped; timing not affected
			case "P":
			case "V":
				pos += 3;
			break;
			case "R":
				idx = pString.indexOf(":", pos);
				if (idx != -1)
					pos = idx + 1;
				else
					pos++;
			break;
			case "K":
				pos++;
				if (pos + 5 <= pString.length)
				{
					idx = pString.indexOf(":", pos + 3);
					if (idx != -1)
						pos = idx + 1;
				}
			break;

			// Channel change and tempo change will affect timing
			case "Z":
				soundTest.chanDurations[curChannel] = chanDuration;
				soundTest.chanTempoMultiplier[curChannel] = tempoMultiplier;
				pos++;
				if (pos + 2 <= pString.length)
				{
					// Change target channel
					curChannel = soundTest.intFrom2D(pString, pos, 0);
					chanDuration = soundTest.chanDurations[curChannel];
					tempoMultiplier = soundTest.chanTempoMultiplier[curChannel];
					pos += 2;
				}
			break;
			case "U":
				pos++;
				if (pos + 3 <= pString.length)
				{
					tempoPos = soundTest.intFrom3D(pString, pos, -1);
					if (tempoPos > 0)
					{
						// Adjust tempo multiplier
						pos += 3;
						tempoMultiplier = FxEnvelope.ASSUMED_TEMPO / tempoPos;
	
						// If colon present at end, only current channel tempo is affected.
						if (pos >= pString.length)
							soundTest.updateAllTempo(tempoMultiplier);
						else if (pString.charAt(pos) != ":")
							soundTest.updateAllTempo(tempoMultiplier);
						else
							pos++;
					}
				}
			break;

			default:
				pos++;
			break;
		}
	}

	// Finalize channel durations, times, etc.
	soundTest.chanDurations[curChannel] = chanDuration;
	soundTest.chanTempoMultiplier[curChannel] = tempoMultiplier;
	soundTest.lastChannel = curChannel;
	soundTest.lastTempoMultiplier = tempoMultiplier;
	soundTest.lastDuration = curDuration;

	// Find the "overall" duration based on the maximum of all channels.
	var overallTime = 0.0;
	for (i = 0; i < Sounds.NUM_CHANNELS; i++) {
		if (overallTime < soundTest.chanDurations[i])
			overallTime = soundTest.chanDurations[i];
	}

	// In addition to the overall time, chanDurations reports the time
	// allocated to each channel individually.
	return overallTime;
}

// Create an alternate play string based upon a partial milliseconds advancement.
static createMiddlePlayString(prefix, pString, msTime) {

	// Convert starting milliseconds to sample time; early-out if at beginning or end.
	var sLimit = soundTest.msTime2Samples(msTime);
	if (sLimit <= 0.0)
		return pString;
	else if (sLimit >= soundTest.songDuration)
		return "";

	// Current channel being parsed
	var curChannel = soundTest.lastChannel;

	// Tempo multiplier for current channel
	var tempoMultiplier = soundTest.lastTempoMultiplier;
	soundTest.updateAllTempo(tempoMultiplier);

	// Note duration for current channel in samples
	var curDuration = soundTest.lastDuration;

	// Total duration of channel in samples
	var chanDuration = 0.0;
	for (var i = 0; i < Sounds.NUM_CHANNELS; i++) {
		soundTest.chanDurations[i] = 0.0;
		soundTest.chanStrings[i] = "";
		soundTest.chanDone[i] = false;
	}

	// We will add prefix back to composite string later.
	pString = pString.substr(prefix.length);

	// The loop iteration stops when a single channel's duration
	// steps beyond the sample limit or falls within a tolerance of exact.
	var idx = 0;
	var pos = 0;
	var tempoPos = 0;
	var restAdder = "";

	while (pos < pString.length) {
		var c = pString.charAt(pos);
		switch (c) {
			// Log note duration
			case "C":
			case "D":
			case "E":
			case "F":
			case "G":
			case "A":
			case "B":
			case "0":
			case "1":
			case "2":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
			case "X":
				// If channel starting position already found, add note.
				pos++;
				if (soundTest.chanDone[curChannel])
				{
					soundTest.chanStrings[curChannel] += c;
					break;
				}

				// Otherwise, add to overall duration count.
				chanDuration += curDuration;

				// If the target duration falls within tolerance,
				// we have found the starting point.
				if (Math.abs(chanDuration - sLimit) <=
					FxEnvelope.T64_DURATION * tempoMultiplier * 0.25)
				{
					// Downstream notes will be logged.
					soundTest.chanDone[curChannel] = true;
				}
				else if (chanDuration >= sLimit)
				{
					// This happens when the note overshoots the starting point.
					// We can't play a fraction of a note, so we insert rests
					// to make up the difference.
					restAdder = ":J";
					while (chanDuration > sLimit &&
						Math.abs(chanDuration - sLimit) >
						FxEnvelope.T64_DURATION * tempoMultiplier * 0.25)
					{
						restAdder += "X";
						chanDuration -= FxEnvelope.T64_DURATION * tempoMultiplier;
					}

					// We prefix the entire channel's note sequence with the rests
					// so that the starting point is aligned properly.
					var chanPrefix = "Z" + utils.twogrouping(curChannel) + "U" +
						utils.threegrouping(utils.int(FxEnvelope.ASSUMED_TEMPO / tempoMultiplier)) +
						restAdder;
					soundTest.chanStrings[curChannel] = chanPrefix + soundTest.chanStrings[curChannel];
					soundTest.chanDone[curChannel] = true;
				}
			break;

			// Change duration for subsequent notes
			case "W":
				pos++;
				curDuration = FxEnvelope.W1_DURATION * tempoMultiplier;
				soundTest.chanStrings[curChannel] += c;
			break;
			case "H":
				pos++;
				curDuration = FxEnvelope.H1_DURATION * tempoMultiplier;
				soundTest.chanStrings[curChannel] += c;
			break;
			case "Q":
				pos++;
				curDuration = FxEnvelope.Q1_DURATION * tempoMultiplier;
				soundTest.chanStrings[curChannel] += c;
			break;
			case "I":
				pos++;
				curDuration = FxEnvelope.I1_DURATION * tempoMultiplier;
				soundTest.chanStrings[curChannel] += c;
			break;
			case "S":
				pos++;
				curDuration = FxEnvelope.S1_DURATION * tempoMultiplier;
				soundTest.chanStrings[curChannel] += c;
			break;
			case "T":
				pos++;
				curDuration = FxEnvelope.T1_DURATION * tempoMultiplier;
				soundTest.chanStrings[curChannel] += c;
			break;
			case "J":
				pos++;
				curDuration = FxEnvelope.T64_DURATION * tempoMultiplier;
				soundTest.chanStrings[curChannel] += c;
			break;
			case "@":
				pos++;
				curDuration = FxEnvelope.T1_DURATION;
				soundTest.chanStrings[curChannel] += c;
			break;
			case ".":
				pos++;
				curDuration *= 1.5;
				soundTest.chanStrings[curChannel] += c;
			break;
			case "3":
				pos++;
				curDuration *= 0.3333333333;
				soundTest.chanStrings[curChannel] += c;
			break;

			// Control codes must be skipped; timing not affected
			case "P":
			case "V":
				soundTest.chanStrings[curChannel] += pString.substr(pos, 3);
				pos += 3;
			break;
			case "R":
				idx = pString.indexOf(":", pos);
				if (idx != -1)
				{
					soundTest.chanStrings[curChannel] += pString.substring(pos, idx + 1);
					pos = idx + 1;
				}
				else
					pos++;
			break;
			case "K":
				pos++;
				if (pos + 5 <= pString.length)
				{
					idx = pString.indexOf(":", pos + 3);
					if (idx != -1)
					{
						soundTest.chanStrings[curChannel] += pString.substring(pos - 1, idx + 1);
						pos = idx + 1;
					}
				}
			break;

			// Channel change and tempo change will affect timing
			case "Z":
				soundTest.chanDurations[curChannel] = chanDuration;
				soundTest.chanTempoMultiplier[curChannel] = tempoMultiplier;
				pos++;
				if (pos + 2 <= pString.length)
				{
					// Change target channel
					curChannel = soundTest.intFrom2D(pString, pos, 0);
					chanDuration = soundTest.chanDurations[curChannel];
					soundTest.chanStrings[curChannel] += pString.substr(pos - 1, 3);
					tempoMultiplier = soundTest.chanTempoMultiplier[curChannel];
					pos += 2;
				}
			break;
			case "U":
				pos++;
				if (pos + 3 <= pString.length)
				{
					tempoPos = soundTest.intFrom3D(pString, pos, -1);
					if (tempoPos > 0)
					{
						// Adjust tempo multiplier
						soundTest.chanStrings[curChannel] += pString.substr(pos - 1, 4);
						pos += 3;
						tempoMultiplier = FxEnvelope.ASSUMED_TEMPO / tempoPos;

						// If colon present at end, only current channel tempo is affected.
						if (pos >= pString.length)
							soundTest.updateAllTempo(tempoMultiplier);
						else if (pString.charAt(pos) != ":")
							soundTest.updateAllTempo(tempoMultiplier);
						else
						{
							soundTest.chanStrings[curChannel] += ":";
							pos++;
						}
					}
				}
			break;

			default:
				soundTest.chanStrings[curChannel] += c;
				pos++;
			break;
		}
	}

	// Synth a new string from the modified individual channel strings.
	var newString = prefix;
	for (i = 0; i < Sounds.NUM_CHANNELS; i++) {
		newString += soundTest.chanStrings[i];
	}

	return newString;
}

static intFrom2D(s, start, defInt=0) {
	return utils.intMaybe(s.substr(start, 2), defInt);
}

static intFrom3D(s, start, defInt=0) {
	return utils.intMaybe(s.substr(start, 3), defInt);
}

static mTick(event)
{
	// Master counter
	soundTest.mcount++;

	if (soundTest.mcount == 15)
	{
		// Initialize classes.
		Sounds.initAllSounds();
		return;
	}

	if (Sounds.isInit && !soundTest.isInit)
	{
		// Initialize library.
		soundTest.init();
		return;
	}

	// Reset action suspension after delay.
	if (soundTest.mistakeTimeOut > 0)
	{
		soundTest.mistakeTimeOut--;
		if (soundTest.mistakeTimeOut == 0)
		{
			soundTest.mistakeReset();
		}

		return;
	}

	if ((soundTest.activePage == soundTest.PAGE_MAIN || soundTest.activePage == soundTest.PAGE_UPLOAD) &&
		Sounds.isAnyChannelPlaying() && soundTest.userStartedPlay && !soundTest.userPausedPlay)
	{
		// Update scrollbar and current time while playing.
		var scr = (soundTest.activePage == soundTest.PAGE_MAIN) ? soundTest.scrTimeline : soundTest.scrUTimeline;
		var curPos = soundTest.msTime2Samples(soundTest.ticks2MSTime(++soundTest.runningTicks));
		soundTest.scrPosition = curPos;
		soundTest.setScrollThumb();
		soundTest.setTimeValue(0, curPos);

		// If looping is active, post the notes again when conditions are satisfied.
		if (soundTest.loopingActive)
		{
			if (curPos >= soundTest.songDuration)
			{
				// Wrap scrollbar and ticks accordingly after limit reached.
				curPos -= soundTest.songDuration;
				soundTest.runningTicks = soundTest.msTime2Ticks(soundTest.samples2MSTime(curPos));
				soundTest.loopingPosted = false;
			}
			else if (!soundTest.loopingPosted && soundTest.samples2MSTime(soundTest.songDuration - curPos) <= 2000.0)
			{
				// Post notes.
				soundTest.loopingPosted = true;

				var s = (soundTest.activePage == soundTest.PAGE_MAIN) ? soundTest.taSong.value : soundTest.taSong.value;
				s = soundTest.cleanZZTOOP(s.toUpperCase());
				Sounds.distributePlayNotes(soundTest.tbPrefix.value + s);
				Sounds.playVoice();
			}
		}
	}

	if (soundTest.msgTimeout > 0)
	{
		if (--soundTest.msgTimeout <= 0)
			soundTest.bMsgCont.hidden = true;
	}

	if (soundTest.gcTriviaFlag)
	{
		if (--soundTest.gcTriviaCount == 0)
			window.location = "http://www.chriskallen.com/zzt/glass_canon_trivia.php";
	}
}

};

soundTest.initClass();
