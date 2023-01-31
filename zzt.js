// zzt.js:  The main engine.
"use strict";

class zzt {

static initClass() {
// Directive constants
zzt.GUIS_PREFIX = "guis/";
zzt.USE_SHAREDOBJECTS = 1;
zzt.CHEATING_DISABLES_PROGRESS = 1;
zzt.DISABLE_CHEATS = 0;
zzt.DISABLE_MEDALS = 1;
zzt.DISABLE_HISCORE = 0;

// Constants
zzt.MODE_PARTIALINIT = -1;
zzt.MODE_INIT = 0;
zzt.MODE_LOADMAIN = 1;
zzt.MODE_LOADZZT = 2;
zzt.MODE_LOADSZT = 3;
zzt.MODE_LOADWAD = 4;
zzt.MODE_SAVEWAD = 5;
zzt.MODE_NORM = 6;
zzt.MODE_SETUPMAIN = 7;
zzt.MODE_SETUPZZT = 8;
zzt.MODE_SETUPSZT = 9;
zzt.MODE_SETUPWAD = 10;
zzt.MODE_ENTERGUIPROP = 11;
zzt.MODE_LOADGUI = 12;
zzt.MODE_SAVEGUI = 13;
zzt.MODE_CONFMESSAGE = 14;
zzt.MODE_TEXTENTRY = 15;
zzt.MODE_LOADDEFAULTOOP = 16;
zzt.MODE_SETUPOOP = 17;
zzt.MODE_SCROLLOPEN = 18;
zzt.MODE_SCROLLINTERACT = 19;
zzt.MODE_SCROLLCLOSE = 20;
zzt.MODE_SCROLLCHAIN = 21;
zzt.MODE_LOADFILELINK = 22;
zzt.MODE_SELECTPEN = 23;
zzt.MODE_LOADSAVEWAIT = 24;
zzt.MODE_RESTOREWADFILE = 25;
zzt.MODE_ENTEROPTIONS = 26;
zzt.MODE_ENTEROPTIONSPROP = 27;
zzt.MODE_ENTERCONSOLE = 28;
zzt.MODE_ENTERCONSOLEPROP = 29;
zzt.MODE_LOADZIP = 30;
zzt.MODE_NATIVELOADZZT = 31;
zzt.MODE_NATIVELOADSZT = 32;
zzt.MODE_LOADINDEXPATHS = 33;
zzt.MODE_LOADINI = 34;
zzt.MODE_AUTOSTART = 35;
zzt.MODE_LOADFILEBROWSER = 36;
zzt.MODE_FILEBROWSER = 37;
zzt.MODE_DISSOLVE = 38;
zzt.MODE_SCROLLMOVE = 39;
zzt.MODE_COLORSEL = 40;
zzt.MODE_CHARSEL = 41;
zzt.MODE_ENTEREDITORPROP = 42;
zzt.MODE_SAVEHLP = 43;
zzt.MODE_LOADZZL = 44;
zzt.MODE_SAVELEGACY = 45;
zzt.MODE_LOADEXTRAGUI = 46;
zzt.MODE_LOADTRANSFERWAD = 47;
zzt.MODE_WAITUNTILPROP = 48;
zzt.MODE_LOADEXTRALUMP = 49;
zzt.MODE_FADETOBLOCK = 50;
zzt.MODE_LOADCHAREDITFILE = 51;
zzt.MODE_PATCHLOADZZT = 52;
zzt.MODE_PATCHLOADSZT = 53;
zzt.MODE_PATCHLOADWAD = 54;
zzt.MODE_GETHIGHSCORES = 55;
zzt.MODE_POSTHIGHSCORE = 56;

zzt.MTRANS_NORM = 0;
zzt.MTRANS_ZIPSCROLL = 1;
zzt.MTRANS_SAVEWORLD = 2;

zzt.FST_NONE = 0;
zzt.FST_DIR = 1;
zzt.FST_ZIP = 2;
zzt.FST_WAD = 3;

zzt.ANIM_NONE = 0;
zzt.ANIM_MG = 1;
zzt.ANIM_FBG = 2;
zzt.ANIM_SCROLLMSGALL = 3;
zzt.ANIM_SCROLLMSGTXT = 4;
zzt.ANIM_SCROLLMSGEDITOR = 5;

zzt.STAGE_WIDTH = 640;
zzt.STAGE_HEIGHT = 400;

zzt.MAX_WIDTH = 96;
zzt.MAX_HEIGHT = 80;

zzt.CHARS_WIDTH = 80;
zzt.CHARS_HEIGHT = 25;

zzt.LEGACY_TICK_SIZE = 420;

zzt.TRANSITION_BASE_RATE = 33.33333333;

// Variables
zzt.stage = null;
zzt.stageCtx = null;
zzt.tempCanvas = null;
zzt.tempCtx = null;
zzt.cellCanvas = null;
zzt.cellCtx = null;
zzt.stockCharSets = null;

zzt.mg = null;
zzt.fbg = null;
zzt.cpg = null;
zzt.csg = null;
zzt.activeObjs = false;
zzt.oopReady = false;
zzt.arcFileNames = [];
zzt.textBrowserLines = [];
zzt.textBrowserName = "";
zzt.textBrowserSize = null;
zzt.textBrowserCursor = null;
zzt.fileLinkName = "";

zzt.opts = {};
zzt.medals = {};
zzt.zztSO = null;

// Timing
zzt.fpsRate = 30;
zzt.tickTimer = null;
zzt.mcount = 0;
zzt.scount = 0;
zzt.bcount = 0;
zzt.typeAllInfoDelay = 0;
zzt.gTickInit = 3.2967032967;
zzt.gTickCurrent = 0.0;
zzt.gameSpeed = 0;
zzt.legacyTick = 1;
zzt.legacyIndex = 1;
zzt.propTextDelay = 0;
zzt.loadAnimColor = 14;
zzt.loadAnimPos = 0;
zzt.showLoadingAnim = false;
zzt.toastText = [];
zzt.toastTime = 0;
zzt.toastTempGridHide = false;
zzt.speedInits = [
	1.0, 1.25, 1.648351648,
	2.197802198, 3.2967032967, 3.5964, 3.95603526, 4.39558829, 4.945054945
];

// Transitions
zzt.transModeWhenDone = 0;
zzt.transColor = 0;
zzt.transDX = 0;
zzt.transDY = 0;
zzt.transProgress = 0;
zzt.transProgress2 = 0;
zzt.transExtent = 0;
zzt.transSquaresPerFrame = 0;
zzt.transSquaresPerFrame2 = 0;

zzt.transFrameCount = 0;
zzt.transCurFrame = 0;
zzt.transLogTime = 0.0;
zzt.transBaseRate = 33.0;

zzt.transPaletteCur = null;
zzt.transPaletteDelta = null;
zzt.transPaletteFinal = null;
zzt.transPaletteStartIdx = null;
zzt.transPaletteNumIdx = null;

// Special interfaces
zzt.confLabelStr = null;
zzt.confYesMsg = null;
zzt.confNoMsg = null;
zzt.confCancelMsg = null;
zzt.penStartVal = null;
zzt.penEndVal = null;
zzt.penActVal = null;
zzt.penChrCode = null;
zzt.penAttr = null;
zzt.textChars = null;
zzt.textCharsColor = null;
zzt.textMaxCharCount = null;

// Mode
zzt.mainMode = 0;
zzt.modeChanged = false;
zzt.modeWhenBrowserClosed = 0;
zzt.modeForPropText = 0;
zzt.inEditor = false;
zzt.inCharEdit = false;
zzt.configType = 0;
zzt.fileSystemType = 0;
zzt.animUpdateMode = 0;

// Deployment
zzt.deployedFile = "";
zzt.deployedDir = "";
zzt.allDeployedPaths = [];
zzt.indexLoadPaths = [];
zzt.indexLoadPathLevels = [];
zzt.indexLoadPos = 0;
zzt.indexLoadFormat = 0;
zzt.featuredWorldName = "";
zzt.featuredWorldFile = "";
zzt.depIndexPath = "";
zzt.depIndexFile = "";
zzt.depIndex = [];
zzt.depRecursiveLevel = 0;
zzt.depGETVars = {};
zzt.pwadIndex = {};

// GUI state
zzt.thisGuiName = "DEBUGMENU";
zzt.thisGui = null;
zzt.prefEditorGui = "ED_ULTRA1";
zzt.propDictToUpdate = null;
zzt.propSubset = null;
zzt.generalSubset = false;
zzt.aSubsetName = "";
zzt.optCursor = 0;
zzt.Use40Column = null;
zzt.OverallSizeX = null;
zzt.OverallSizeY = null;
zzt.GuiLocX = 1;
zzt.GuiLocY = 1;
zzt.GuiWidth = 20;
zzt.GuiHeight = 25;
zzt.cellXDiv = 8;
zzt.cellYDiv = 16;
zzt.virtualCellYDiv = 16;
zzt.aspectMultiplier = 2;
zzt.curHighlightButton = "";
zzt.Viewport = null;
zzt.GuiText = null;
zzt.GuiColor = null;
zzt.GuiKeys = null;
zzt.GuiLabels = null;
zzt.GuiMouseEvents = {};
zzt.GuiTextLines = [];
zzt.GuiColorLines = [];

zzt.GuiKeyMapping = new Array(256);
zzt.GuiKeyMappingShift = new Array(256);
zzt.GuiKeyMappingCtrl = new Array(256);
zzt.GuiKeyMappingShiftCtrl = new Array(256);

zzt.GuiKeyMappingAll = [
	zzt.GuiKeyMapping, zzt.GuiKeyMappingShift, zzt.GuiKeyMappingCtrl, zzt.GuiKeyMappingShiftCtrl
];

zzt.defsObj = null;
zzt.origGuiStorage = {};
zzt.guiStorage = {};
zzt.guiStack = ["DEBUGMENU"];

// Game-oriented toast message and scroll message
zzt.toastMsgSize = 1;
zzt.toastMsgCont = [ null, null ];
zzt.toastMsgTimeLeft = 0;
zzt.toastMsgText = [ "", "" ];
zzt.toastMsgColor = 9;

zzt.scrollCenterX = 30;
zzt.scrollCenterY = 13;
zzt.numTextLines = 0;
zzt.msgNonBlank = false;
zzt.msgScrollFormats = [];
zzt.msgScrollText = [];
zzt.msgScrollObjName = "";
zzt.msgScrollWidth = 42;
zzt.msgScrollHeight = 15;
zzt.msgScrollIsRestore = false;
zzt.msgScrollFiles = false;
zzt.scroll40Column = 0;
zzt.msgScrollIndex = 0;
zzt.mouseScrollOffset = 0;
zzt.curScrollCols = 1;
zzt.curScrollRows = 1;

// Layers and controls
zzt.guiProperties = null;
zzt.guiPropText = null;
zzt.guiPropLabel = null;
zzt.scrollArea = null;

zzt.scrollUL = null;
zzt.scrollUR = null;
zzt.scrollDL = null;
zzt.scrollDR = null;
zzt.scrollU1 = null;
zzt.scrollU2 = null;
zzt.scrollD1 = null;
zzt.scrollL1 = null;
zzt.scrollR1 = null;
zzt.sBorderColor = 0xFFFFFFFF;
zzt.sShadowColor = 0xFF000000;
zzt.sBGColor = 0xFF0000AA;
zzt.sTextColor = 30;
zzt.sCenterTextColor = 31;
zzt.sButtonColor = 29;
zzt.sArrowColor = 28;
zzt.titleGrid = null;
zzt.scrollGrid = null;
zzt.tg = null;
zzt.cg = null;
zzt.lg = null;
zzt.sg = null;
zzt.gridWidth = null;
zzt.gridHeight = null;
zzt.bEdgeType = 1;
zzt.bulletType = 0;
zzt.starType = 0;
zzt.playerType = 0;
zzt.objectType = 0;
zzt.transporterType = 0;
zzt.bearType = 0;
zzt.breakableType = 0;
zzt.waterType = 0;
zzt.lavaType = 0;
zzt.invisibleType = 0;
zzt.windTunnelType = 253;
zzt.fileLinkType = 0;
zzt.patchType = 0;
zzt.loadedOOPType = -3;
zzt.overrideDefaults = false;
zzt.extraEmptyType = -1;
zzt.extraEmptyCode = -1;

zzt.typeList = null;
zzt.extraTypeList = null;
zzt.extraTypeCode = null;
zzt.extraKindNames = null;
zzt.extraKindNumbers = null;
zzt.emptyTypeTemplate = null;
zzt.emptyCodeTemplate = null;
zzt.typeTrans = [];
zzt.statElem = null;
zzt.globals = {};
zzt.regions = {};
zzt.globalProps = {};
zzt.boardProps = {};
zzt.masks = {};
zzt.soundFx = {};

zzt.pMoveDir = -1;
zzt.pShootDir = -1;

zzt.highScores = [];
zzt.highScoresLoaded = false;
zzt.highScoreServer = false;

// Confirmation yes/no buttons
zzt.confButtonX = 1;
zzt.confButtonY = 1;
zzt.confButtonSel = -1;
zzt.confButtonTextYes = " Yes ";
zzt.confButtonTextNo = " No ";
zzt.confButtonColorSelYes = 32 + 15;
zzt.confButtonColorSelNo = 64 + 15;
zzt.confButtonColorYes = 10;
zzt.confButtonColorNo = 12;
zzt.confButtonUnderBG = 0;
zzt.confButtonUnderText = [];
zzt.confButtonUnderColors = [];

// Edge-nav arrows
zzt.lastEdgeNavArrowX = -1;
zzt.lastEdgeNavArrowY = -1;
zzt.edgeNavArrowChars = [ 16, 31, 17, 30 ];

zzt.stdTorchMask = [
 "000111111111000",
 "001111111111100",
 "011111111111110",
 "011111111111110",
 "111111111111111",
 "011111111111110",
 "011111111111110",
 "001111111111100",
 "000111111111000"
];
zzt.stdBombMask = [
 "000111111111000",
 "001111111111100",
 "011111111111110",
 "011111111111110",
 "111111111111111",
 "011111111111110",
 "011111111111110",
 "001111111111100",
 "000111111111000"
];
zzt.sztBombMask = [
 "000011111110000",
 "001111111111100",
 "011111111111110",
 "011111111111110",
 "111111111111111",
 "111111111111111",
 "111111111111111",
 "111111111111111",
 "111111111111111",
 "111111111111111",
 "111111111111111",
 "011111111111110",
 "011111111111110",
 "001111111111100",
 "000011111110000"
];

zzt.configTypeNames = ["Modern ", "Classic"];
};

static getURLParams() {
	var url = window.location.href;
	var paramDict = {};

	var idx = url.indexOf("?");
	while (idx != -1 && idx < url.length) {
		// Establish start of parameter definition
		idx++;
		var nextIdx = idx;

		// Find end of parameter definition
		do {
			nextIdx = url.indexOf("&", nextIdx);
			if (nextIdx != -1)
			{
				if (url.charAt(nextIdx - 1) != "\\")
					break;
				else
					nextIdx++;
			}
		} while (nextIdx != -1);

		if (nextIdx == -1)
			nextIdx = url.length;

		// Establish parameter definition string
		var paramDef = url.substring(idx, nextIdx);
		idx = nextIdx;

		if (paramDef.length > 0)
		{
			var eqLoc = paramDef.indexOf("=");
			if (eqLoc != -1)
			{
				var k = paramDef.substring(0, eqLoc);
				var v = paramDef.substr(eqLoc + 1);
				if (k.length > 0)
					paramDict[k] = v;
			}
		}
	}

	// Return parameter dictionary.
	console.log(paramDict);
	return paramDict;
}

static partialInit(myStage, stageCtx, tempCanvas, tempCtx, cellCanvas, cellCtx, stockCharSets) {
	// Set stage and related objects
	zzt.stage = myStage;
	zzt.stageCtx = stageCtx;
	zzt.tempCanvas = tempCanvas;
	zzt.tempCtx = tempCtx;
	zzt.cellCanvas = cellCanvas;
	zzt.cellCtx = cellCtx;
	zzt.stockCharSets = stockCharSets;

	// Keypress timing vector
	input.keyCodeDowns = new Int32Array(256);
	input.keyCharDowns = new Int32Array(256);
	for (var i = 0; i < 256; i++)
	{
		input.keyCodeDowns[i] = 0;
		input.keyCharDowns[i] = 0;
	}
}

static init(setEventHandlers=true) {
	// Initialize bitmaps
	ASCII_Characters.Separate_ASCII_Characters(zzt.tempCtx, zzt.stockCharSets);
	CellGrid.initClass(zzt.stageCtx, zzt.tempCtx, zzt.tempCanvas, zzt.cellCtx, zzt.cellCanvas);

	// Add standard grid to the stage
	zzt.mg = new CellGrid(zzt.CHARS_WIDTH, zzt.CHARS_HEIGHT);
	SE.mg = zzt.mg;

	// Add file browser grid to the stage
	zzt.fbg = new CellGrid(zzt.CHARS_WIDTH, zzt.CHARS_HEIGHT, 0, 0, zzt.mg);

	// Add character preview and character set grids to the stage
	zzt.cpg = new CellGrid(3, 3,
		15 * ASCII_Characters.CHAR_WIDTH, 21 * ASCII_Characters.CHAR_HEIGHT, zzt.mg);

	zzt.csg = new CellGrid(32, 8,
		24 * ASCII_Characters.CHAR_WIDTH, 16 * ASCII_Characters.CHAR_HEIGHT, zzt.mg);

	// Add text portions of ScrollArea to the stage
	zzt.scrollArea = new IPoint(0, 0);
	zzt.scrollTitle = new IPoint(0, 0);
	zzt.scrollBody = new IPoint(0, 0);
	zzt.titleGrid = new CellGrid(zzt.CHARS_WIDTH, 1, 0, 0, zzt.mg);
	zzt.titleGrid.writeConst(0, 0, zzt.CHARS_WIDTH, 1, " ", zzt.sTextColor);
	zzt.scrollGrid = new CellGrid(zzt.CHARS_WIDTH, zzt.CHARS_HEIGHT, 0, 0, zzt.mg);
	zzt.scrollGrid.writeConst(0, 0, zzt.CHARS_WIDTH, zzt.CHARS_HEIGHT, " ", zzt.sTextColor);

	// Set TEXTAREA interface
	zzt.guiPropText = document.getElementById("codeEntry");

	// Create editor and game char/color storage space
	var totalSquares = (zzt.MAX_WIDTH+2) * (zzt.MAX_HEIGHT+2);
	editor.editorChars = new ByteArray(totalSquares);
	editor.editorAttrs = new ByteArray(totalSquares);
	zzt.tg = new Uint8Array(totalSquares);
	SE.tg = zzt.tg;
	zzt.cg = new Uint8Array(totalSquares);
	SE.cg = zzt.cg;
	zzt.lg = new Uint8Array(totalSquares);
	SE.lg = zzt.lg;
	zzt.sg = [];
	SE.sg = zzt.sg;
	for (var i = 0; i < totalSquares; i++)
	{
		editor.editorChars.b[i] = 32;
		editor.editorAttrs.b[i] = 31;
		zzt.tg[i] = 0;
		zzt.cg[i] = 0;
		zzt.lg[i] = 0;
		zzt.sg.push(null);
	}

	zzt.globals = {};
	zzt.regions = {};
	zzt.globalProps = {};
	zzt.boardProps = {};
	zzt.masks = {};
	zzt.soundFx = {};

	zzt.globalProps["MAXSTATELEMENTCOUNT"] = 9999;
	zzt.globalProps["SOUNDOFF"] = 0;
	zzt.globalProps["BECOMESAMECOLOR"] = 0;
	zzt.globalProps["LIBERALCOLORCHANGE"] = 0;
	zzt.globalProps["VERSION"] = ZZTProp.defaultPropsGeneral["VERSION"];
	zzt.globalProps["MOUSEBEHAVIOR"] = 3;
	zzt.globalProps["IMMEDIATESCROLL"] = 0;
	zzt.globalProps["ORIGINALSCROLL"] = 0;
	zzt.globalProps["OVERLAYSCROLL"] = 1;
	zzt.globalProps["OLDTORCHBAR"] = 0;
	zzt.globalProps["BIT7ATTR"] = 1;
	zzt.globalProps["FASTESTFPS"] = 30;
	zzt.globalProps["LEGACYTICK"] = 0;
	zzt.globalProps["BQUESTHACK"] = 0;
	zzt.globalProps["ZSTONELABEL"] = "Stone";
	zzt.globalProps["SITELOADCHOICE"] = 3;
	zzt.globalProps["HIGHSCOREACTIVE"] = 1;
	zzt.globalProps["MASTERVOLUME"] = 50;
	zzt.globalProps["FREESCOLLING"] = 0;
	zzt.globalProps["SENDALLENTER"] = 0;
	zzt.globalProps["PLAYERCHARNORM"] = 2;
	zzt.globalProps["PLAYERCOLORNORM"] = 31;
	zzt.globalProps["PLAYERCHARHURT"] = 1;
	zzt.globalProps["PLAYERCOLORHURT"] = 31;
	zzt.globalProps["PAUSEANIMATED"] = 1;
	zzt.globalProps["DEP_RECURSIVELEVEL"] = 0;
	zzt.globalProps["DEP_AUTORUNZIP"] = 0;
	zzt.globalProps["DEP_STARTUPFILE"] = "";
	zzt.globalProps["DEP_STARTUPGUI"] = "DEBUGMENU";
	zzt.globalProps["DEP_EXTRAFILTER"] = "";
	zzt.globals["$PLAYER"] = -1;
	zzt.globals["$PLAYERMODE"] = 3; // "ZZT title screen" mode
	zzt.globals["$PLAYERPAUSED"] = 0;
	zzt.globals["$PAUSECYCLE"] = 0;
	zzt.globals["$PASSAGEEMERGE"] = 0;
	zzt.globals["$LASTSAVESECS"] = 0;
	zzt.addMask("TORCH", zzt.stdTorchMask);
	zzt.addMask("BOMB", zzt.stdBombMask);
	zzt.addMask("SZTBOMB", zzt.sztBombMask);

	zzt.statElem = [];
	editor.newWorldSetup();
	ZZTProp.setOverridePropDefaults();
	ZZTProp.overridePropsGeneral = ZZTProp.overridePropsGenModern;

	zzt.initSharedObj();
	zzt.setGameSpeed(4);

	// Initialize sounds
	Sounds.initAllSounds(zzt.soundFx, zzt.globalProps);

	// Read GET variables
	var uVars = zzt.getURLParams();
	for (var kObj in uVars)
	{
		var k = kObj.toString().toUpperCase();
		if (k.substr(0, 4) == "DEP_")
		{
			// Can't change all deployment with GET variables; only some work
			if (k != "DEP_STARTUPFILE" && k != "DEP_AUTORUNZIP" && k != "DEP_EXTRAFILTER")
				k = "";
		}

		if (k.length > 0)
		{
			var v = uVars[kObj].toString();
			zzt.depGETVars[k] = v;
		}
	}

	// Load main GUI component file
	if (setEventHandlers)
		parse.loadTextFile(zzt.GUIS_PREFIX + "zzt_guis.txt", zzt.MODE_LOADMAIN);
}

// Shared object uses HTML 5 localStorage.
static initSharedObj() {
	// ZZTMedal.resetMedals();
	if (!zzt.USE_SHAREDOBJECTS)
		return;

	try {
		// Get or create shared object
		zzt.zztSO = {};

		// Saved configuration settings
		var cfgHives = ["CFGMODERN", "CFGCLASSIC", "CFGZZTSPEC", "CFGSZTSPEC"];
		for (var i = 0; i < cfgHives.length; i++) {
			var soName = cfgHives[i];
			var soPrefix = soName + ".";
			zzt.guaranteeSharedObj(soName);

			//var o = zzt.zztSO[soName];
			var keys = Object.keys(localStorage);
			for (var j in keys) {
				var s = keys[j];
				if (!utils.startswith(s, soPrefix))
				{
					//zzt.guaranteeSharedObj(s);
					continue;
				}

				var tKey = s.substr(soPrefix.length);
				var val = localStorage[s];
				var testInt = utils.strictInt(val);
				if (!isNaN(testInt))
					val = testInt;

				if (soName == "CFGMODERN")
					ZZTProp.overridePropsGenModern[tKey] = val;
				else if (soName == "CFGCLASSIC")
					ZZTProp.overridePropsGenClassic[tKey] = val;
				else if (soName == "CFGZZTSPEC")
					ZZTProp.overridePropsZZT[tKey] = val;
				else if (soName == "CFGSZTSPEC")
					ZZTProp.overridePropsSZT[tKey] = val;
			}
		}

		if (zzt.depGETVars.hasOwnProperty("CONFIGTYPE"))
		{
			var cTypeVal = utils.int0(zzt.depGETVars["CONFIGTYPE"]);
			ZZTProp.overridePropsGenModern["CONFIGTYPE"] = cTypeVal;
		}

		zzt.setConfigType(ZZTProp.overridePropsGenModern["CONFIGTYPE"] & 1);

		// Saved medal list
		if (zzt.zztSO.hasOwnProperty("MEDALLIST"))
			zzt.medals = zzt.zztSO["MEDALLIST"];
		else
			zzt.zztSO["MEDALLIST"] = zzt.medals;
	}
	catch (e)
	{
		zzt.Toast("localStorage LOAD ERROR:  " + e);
	}
};

// Force prefix to exist in our internal records.
static guaranteeSharedObj(soName) {
	if (!localStorage.hasOwnProperty(soName))
		zzt.zztSO[soName] = [];
};

// Shared object loading uses HTML 5 localStorage.
static loadSharedObj(soName, soMember) {
	var sKey = soName + "." + soMember;
	if (!localStorage.hasOwnProperty(sKey))
		return 0;

	var s = String(localStorage.getItem(sKey));
	var testInt = utils.strictInt(s);
	if (isNaN(testInt))
		return s;
	else
		return testInt;
};

// Shared object member saving uses HTML 5 localStorage.
static saveSharedObj(soName, soMember, soValue) {
	if (!zzt.USE_SHAREDOBJECTS)
		return;

	try {
		zzt.guaranteeSharedObj(soName);
		var s = soName + "." + soMember;
		localStorage.setItem(s, soValue);
	}
	catch (e)
	{
		zzt.Toast("localStorage SAVE ERROR:  " + e);
	}
};

// Shared object container saving uses HTML 5 localStorage.
static saveSharedObjCont(soName, soCont) {
	if (!zzt.USE_SHAREDOBJECTS)
		return;

	try {
		for (var j in soCont)
		{
			var s = soName + "." + j;
			localStorage.setItem(s, soCont[j]);
		}
	}
	catch (e)
	{
		zzt.Toast("localStorage SAVE ERROR:  " + e);
	}
};

// Shared object member deletion uses HTML 5 implementation.
static deleteSharedObjMember(soName, soMember) {
	if (!zzt.USE_SHAREDOBJECTS)
		return;

	try {
		var s = soName + "." + soMember;
		if (localStorage.hasOwnProperty(s))
			localStorage.removeItem(s);
	}
	catch (e)
	{
		zzt.Toast("localStorage DELETION ERROR:  " + e);
	}
};

// Shared object deletion uses HTML 5 implementation.
static deleteSharedObj(soName) {
	if (!zzt.USE_SHAREDOBJECTS)
		return;

	try {
		var soPrefix = soName + ".";
		var keys = Object.keys(localStorage);

		for (var j in keys) {
			var s = keys[j];
			if (utils.startswith(s, soPrefix))
				localStorage.removeItem(s);
		}
	}
	catch (e)
	{
		zzt.Toast("localStorage DELETION ERROR:  " + e);
	}
};

static establishINI() {
	// Read deployment variables from INI
	var iniVars = parse.jsonObj;
	for (var gvObj in iniVars) {
		// World property is taken from INI, unless overridden by HTTP GET variable
		var gvStr = gvObj.toString().toUpperCase();
		if (!zzt.depGETVars.hasOwnProperty(gvStr))
			zzt.depGETVars[gvObj] = iniVars[gvObj];
	}

	for (var kObj in zzt.depGETVars) {
		var k = kObj.toString().toUpperCase();
		if (k.charAt(0) == "'" || k.charAt(0) == "#")
			continue;

		if (k == "DEP_INDEX")
		{
			// Index is defined in INI file
			var indexArray = zzt.depGETVars[kObj];
			for (var i = 0; i < indexArray.length; i++) {
				var s = utils.scrubPath(indexArray[i]);
				if (s != "")
					zzt.allDeployedPaths.push(s);
			}

			if (zzt.allDeployedPaths.length > 0)
			{
				zzt.featuredWorldFile = zzt.allDeployedPaths[0];
				zzt.featuredWorldName = utils.namePartOfFile(zzt.featuredWorldFile);
			}
		}
		else if (k == "PWADS")
		{
			// PWAD index
			zzt.pwadIndex = zzt.depGETVars[kObj];
		}
		else
		{
			var v = zzt.depGETVars[kObj].toString();
			if (k == "DEP_INDEXRESOURCE")
			{
				// Index is fetched from HTTP resource
				zzt.indexLoadFormat = 0;
				zzt.depIndexFile = utils.scrubPath(v);
				zzt.indexLoadPaths.push(zzt.depIndexFile);
				zzt.indexLoadPathLevels.push(0);
			}
			else if (k == "DEP_INDEXPATH")
			{
				// Index is fetched by evaluating directory over HTTP
				zzt.indexLoadFormat = 1;
				zzt.depIndexFile = utils.scrubPath(v);
				zzt.indexLoadPaths.push(zzt.depIndexFile);
				zzt.indexLoadPathLevels.push(0);
				if (zzt.depGETVars.hasOwnProperty("DEP_RECURSIVELEVEL"))
					zzt.depRecursiveLevel = utils.int(zzt.depGETVars["DEP_RECURSIVELEVEL"]);
			}

			var vc = v.charCodeAt(0);
			if ((vc >= 48 && vc <= 57) || vc == 45)
			{
				// Integer property
				ZZTProp.defaultPropsGeneral[k] = utils.int(v);
				ZZTProp.overridePropsGeneral[k] = utils.int(v);
				zzt.globalProps[k] = utils.int(v);
			}
			else
			{
				// String property
				ZZTProp.defaultPropsGeneral[k] = v;
				ZZTProp.overridePropsGeneral[k] = v;
				zzt.globalProps[k] = v;
			}
		}
	}

	if (zzt.indexLoadPaths.length > 0)
	{
		// If we need to load paths to determine configuration, start now.
		parse.loadTextFile(zzt.depIndexFile, zzt.MODE_LOADINDEXPATHS);
		return true;
	}

	return false;
};

static addIndexPaths() {
	if (zzt.indexLoadFormat == 0)
	{
		// Index resource has paths separated by line breaks.
		var realStr = parse.dataset.toUpperCase();
		var bound1 = realStr.indexOf("<PRE>");
		var bound2 = realStr.indexOf("</PRE>");
		if (bound1 != -1 && bound2 != -1)
			realStr = parse.dataset.substring(bound1 + 5, bound2); // Inside PRE tag
		else
			realStr = parse.dataset; // Entire

		var lines = realStr.split("\n");
		for (var i = 0; i < lines.length; i++) {
			// Scrub and strip whitespace
			var s = utils.allStrip(utils.scrubPath(lines[i]));

			// If path starts with "./" change to ordinary file portion
			if (s.substr(0, 2) == "./")
				s = s.substr(2);

			// Add to deployed paths
			if (s != "")
				zzt.allDeployedPaths.push(s);
		}

		if (zzt.allDeployedPaths.length > 0)
		{
			zzt.featuredWorldFile = zzt.allDeployedPaths[0];
			zzt.featuredWorldName = utils.namePartOfFile(zzt.featuredWorldFile);
		}

		// Done!
		return false;
	}
	else
	{
		// Need to use heuristics to deduce paths.
		var aHrefPattern = new RegExp("((href)|(HREF))=[\"'][\-_A-Za-z0-9]+");
		var quotePattern = new RegExp("[\"']");

		// Find files and directories.
		var fileArray = [];
		var dirArray = [];
		var fileStr = parse.dataset;
		while (fileStr != "") {
			var idx = fileStr.search(aHrefPattern);
			if (idx == -1)
				fileStr = ""; // Done
			else
			{
				// Get text within hyperlink location
				var nextIdx = fileStr.substr(idx).search(quotePattern) + idx;
				var finalIdx = fileStr.substr(nextIdx + 1).search(quotePattern);
				if (finalIdx == -1)
					continue;
				finalIdx += nextIdx + 1;

				s = fileStr.substring(nextIdx + 1, finalIdx);
				if (s.charAt(0) != ".")
				{
					if (s.charAt(s.length - 1) == "/")
						dirArray.push(s);
					else
						fileArray.push(s);
				}

				fileStr = fileStr.substr(finalIdx + 1);
			}
		}

		// Set deployed paths, joining root to found file
		if (depIndexFile == ".")
			depIndexFile = "";
		else if (depIndexFile.charAt(depIndexFile.length - 1) != "/")
			depIndexFile += "/";

		for (i = 0; i < fileArray.length; i++)
			allDeployedPaths.push(depIndexFile + fileArray[i]);

		// If we found subfolders, only continue to enumerate contents
		// of these folders if the recursion level would allow it.
		if (indexLoadPathLevels[indexLoadPos] < depRecursiveLevel)
		{
			for (i = 0; i < dirArray.length; i++)
			{
				indexLoadPaths.push(depIndexFile + dirArray[i])
				indexLoadPathLevels.push(indexLoadPathLevels[indexLoadPos] + 1);
			}
		}

		if (++indexLoadPos >= indexLoadPaths.length)
		{
			if (allDeployedPaths.length > 0)
			{
				featuredWorldFile = allDeployedPaths[0];
				featuredWorldName = utils.namePartOfFile(featuredWorldFile);
			}

			return false; // Done!
		}

		// Not done yet; need to load more subfolder contents.
		depIndexFile = indexLoadPaths[indexLoadPos];
		parse.loadTextFile(depIndexFile, MODE_LOADINDEXPATHS);
		return true;
	}
};

static loadDeployedFile(action) {
	zzt.numTextLines = 0;
	zzt.msgScrollFormats = [];
	zzt.msgScrollText = [];
	zzt.msgScrollFiles = true;

	// Convert file filter to regular expression
	var filter = zzt.globalProps["DEP_EXTRAFILTER"].toUpperCase();
	var filterExpr;
	if (filter != "")
	{
		filter = filter.replace(".", "[.]");
		filter = filter.replace("*", ".*");
		filterExpr = new RegExp(filter);
	}

	// Deployed filenames
	var slChoice = zzt.globalProps["SITELOADCHOICE"];
	var subDirFiles = zzt.allDeployedPaths;
	for (var i = 0; i < subDirFiles.length && (slChoice == 2 || slChoice == 3); i++) {
		// Display file link, unless filtered out
		var btnText = subDirFiles[i];

		var testText = btnText.toUpperCase();
		if (filter == "")
			zzt.addMsgLine(i.toString(), btnText); // No filter
		else if (filter != "" && testText.search(filterExpr) != -1)
			zzt.addMsgLine(i.toString(), btnText); // Matches regular expression
	}

	if (zzt.allDeployedPaths.length == 0 && slChoice == 2)
	{
		// No deployed files
		zzt.msgScrollFiles = false;
		zzt.mainMode = zzt.MODE_NORM;
		zzt.addMsgLine("$", "No deployed files for site.");
		zzt.addMsgLine("$", "Check " + zzt.GUIS_PREFIX + "zzt_ini.txt");
	}

	// Local file options
	if (slChoice == 0)
	{
		// Last-loaded type ONLY--show local file interface immediately.
		zzt.highScoreServer = false;
		if (zzt.globalProps["WORLDTYPE"] == -1)
			parse.loadLocalFile("ZZT", zzt.MODE_NATIVELOADZZT, zzt.MODE_NORM);
		else if (zzt.globalProps["WORLDTYPE"] == -2)
			parse.loadLocalFile("SZT", zzt.MODE_NATIVELOADSZT, zzt.MODE_NORM);
		else
			parse.loadLocalFile("WAD", zzt.MODE_LOADWAD, zzt.MODE_NORM);

		return;
	}
	else if (slChoice == 1 || slChoice == 3)
	{
		// Local file options exist.
		if (zzt.allDeployedPaths.length > 0)
			zzt.addMsgLine("$", "-------------------------");

		zzt.addMsgLine("-1", "(Local File:  ZZT)");
		zzt.addMsgLine("-2", "(Local File:  Super ZZT)");
		zzt.addMsgLine("-3", "(Local File:  WAD)");
		zzt.addMsgLine("-4", "(Local File:  ZIP)");
	}

	// Initiate scroll
	zzt.fileSystemType = zzt.FST_NONE;
	zzt.ScrollMsg("Game Files");
};

static launchDeployedFileIfPresent(fileName) {
	// Search deployed paths for an exact match.
	for (var i = 0; i < zzt.allDeployedPaths.length; i++) {
		if (fileName.toUpperCase() == zzt.allDeployedPaths[i].toUpperCase())
		{
			// Exact match.
			zzt.launchDeployedFile(fileName);
			return;
		}
	}

	// If no exact match exists, see if the name portion only matches.
	fileName = utils.namePartOfFile(fileName);
	for (i = 0; i < zzt.allDeployedPaths.length; i++) {
		if (fileName.toUpperCase() ==
			utils.namePartOfFile(zzt.allDeployedPaths[i]).toUpperCase())
		{
			// Name-only match.
			zzt.launchDeployedFile(zzt.allDeployedPaths[i]);
			return;
		}
	}

	// Ignore the launch attempt if no match exists.
};

static launchDeployedFile(fileName) {
	zzt.mainMode = zzt.MODE_NORM;
	if (utils.endswith(fileName, ".ZZT"))
	{
		zzt.highScoreServer = true;
		zzt.featuredWorldFile = fileName;
		parse.loadRemoteFile(fileName, zzt.MODE_LOADZZT);
	}
	else if (utils.endswith(fileName, ".SZT"))
	{
		zzt.highScoreServer = true;
		zzt.featuredWorldFile = fileName;
		parse.loadRemoteFile(fileName, zzt.MODE_LOADSZT);
	}
	else if (utils.endswith(fileName, ".WAD"))
	{
		zzt.highScoreServer = true;
		zzt.featuredWorldFile = fileName;
		parse.loadRemoteFile(fileName, zzt.MODE_LOADWAD);
	}
	else if (utils.endswith(fileName, ".ZIP"))
	{
		zzt.highScoreServer = true;
		zzt.featuredWorldFile = fileName;
		parse.loadRemoteFile(fileName, zzt.MODE_LOADZIP);
	}
	else if (utils.endswith(fileName, ".HLP"))
		zzt.displayFileLink(fileName);
	else
		parse.loadRemoteFile(fileName, zzt.MODE_LOADFILEBROWSER);

	zzt.featuredWorldName = utils.namePartOfFile(zzt.featuredWorldFile);
};

static getTypeFromName(tName) {
	// We iterate in reverse order as a way to capture overridden types first.
	for (var i = zzt.typeList.length - 1; i >= 0; i--) {
		var eInfo = zzt.typeList[i];
		if (eInfo.NAME == tName)
			return eInfo; // Match
	}

	// No match
	return null;
};

static establishOOP() {
	// For each child of the definitions, we have an object definition.
	// The first definition should always be the main dispatch receiver.
	zzt.typeList = [];
	zzt.extraTypeList = [];
	zzt.extraTypeCode = {};
	zzt.extraKindNames = [];
	zzt.extraKindNumbers = [];
	SE.typeList = zzt.typeList;
	SE.statElem = zzt.statElem;
	SE.statLessCount = 0;
	SE.IsDark = 0;
	SE.darkChar = 176;
	SE.darkColor = 8;
	SE.CameraX = 1;
	SE.CameraY = 1;
	interp.typeList = zzt.typeList;
	interp.typeTrans = zzt.typeTrans;
	interp.codeBlocks = [];
	oop.zeroTypeLabelAction = 0;
	oop.setOOPType();
	zzt.loadedOOPType = -3;

	for (var s in zzt.defsObj)
	{
		if (!zzt.establishType(s, zzt.defsObj[s], true))
			return false;
	}
	oop.zeroTypeLabelAction = 0;

	// Create several "stock" status elements.
	interp.customDrawSE = new SE(0, 0, 0, 0, true);
	interp.blankSE = new SE(0, 0, 0, 0, true);
	interp.thisSE = interp.blankSE;
	interp.numBuiltInTypes = zzt.typeList.length;
	interp.numOverrideTypes = 0;

	// Set up type translation
	zzt.setupTypeTranslation();
	zzt.emptyTypeTemplate = zzt.typeList[0];
	zzt.emptyCodeTemplate = interp.codeBlocks[0];

	// Property dispatch function
	interp.onPropPos = interp.findLabel(interp.codeBlocks[0], "$ONPROPERTY");
	interp.onMousePos = interp.findLabel(interp.codeBlocks[0], "$ONMOUSE");

	// Remember how many built-in object code blocks there are
	interp.numBuiltInCodeBlocks = interp.codeBlocks.length;
	interp.numBuiltInCodeBlocksPlus = interp.numBuiltInCodeBlocks;
	zzt.globalProps["NUMBASECODEBLOCKS"] = interp.numBuiltInCodeBlocksPlus;
	interp.unCompCode = [];

	zzt.oopReady = true;
	return true;
};

static establishExtraTypes(typeObjs) {
	zzt.extraTypeList = [];
	zzt.extraEmptyType = -1;
	zzt.extraEmptyCode = -1;
	zzt.extraKindNames = [];
	zzt.extraKindNumbers = [];
	oop.zeroTypeLabelAction = 0;
	oop.setOOPType();
	zzt.loadedOOPType = -3;

	for (var k in typeObjs) {
		zzt.extraKindNames.push(k.toUpperCase());
		zzt.extraKindNumbers.push(utils.int(typeObjs[k]["NUMBER"]));
	}

	for (k in typeObjs) {
		if (!zzt.establishType(k, typeObjs[k], false))
			return false;
	}

	for (var i = 0; i < zzt.extraTypeList.length; i++)
	{
		if (zzt.extraTypeList[i].NUMBER != 0)
			zzt.typeList.push(zzt.extraTypeList[i]);
	}

	ZZTLoader.worldType = zzt.globalProps["WORLDTYPE"];
	zzt.loadedOOPType = zzt.globalProps["WORLDTYPE"];
	oop.setOOPType();

	zzt.setupTypeTranslation();
	interp.onPropPos = interp.findLabel(interp.codeBlocks[0], "$ONPROPERTY");
	interp.onMousePos = interp.findLabel(interp.codeBlocks[0], "$ONMOUSE");
	interp.numOverrideTypes = zzt.extraTypeList.length;
	interp.numBuiltInCodeBlocksPlus = interp.codeBlocks.length;

	return true;
};

static resetTypes() {
	if (zzt.extraEmptyType != -1)
	{
		// Restore main type code, if replaced
		zzt.typeList[0] = zzt.emptyTypeTemplate;
		interp.codeBlocks[0] = zzt.emptyCodeTemplate;
		zzt.extraEmptyType = -1;
		zzt.extraEmptyCode = -1;

		// Restore "zapped" main type code labels
		oop.restoreOldZeroTypeLabels();
	}

	// Clear jump optimizations
	for (var i = 0; i < interp.numBuiltInCodeBlocks; i++)
		interp.findLabel(interp.codeBlocks[i], "#!NOLABELMATCH", 0, 4);

	// Restore number of types to original count
	zzt.typeList.length = interp.numBuiltInTypes;

	// Restore number of code blocks to original count
	interp.numBuiltInCodeBlocksPlus = interp.numBuiltInCodeBlocks;
	interp.codeBlocks.length = interp.numBuiltInCodeBlocks;
};

static establishType(name, defProps, builtIn) {
	// Create ElementInfo instance; handle members.
	var myDef = new ElementInfo(name.toUpperCase());
	var codeProp = "#required!";
	var hasCustomStart = false;
	oop.lineStartIP = 0;
	oop.zeroTypeLabelAction = 0;

	for (var prop in defProps)
	{
		var uProp = prop.toUpperCase();
		switch (uProp) {
			case "NUMBER":
				myDef.NUMBER = utils.int(defProps[prop]);
			break;
			case "CYCLE":
				myDef.CYCLE = utils.int(defProps[prop]);
			break;
			case "STEPX":
				myDef.STEPX = utils.int(defProps[prop]);
			break;
			case "STEPY":
				myDef.STEPY = utils.int(defProps[prop]);
			break;
			case "CHAR":
				myDef.CHAR = utils.int(defProps[prop]);
			break;
			case "COLOR":
				myDef.COLOR = utils.int(defProps[prop]);
			break;
			case "NOSTAT":
				myDef.NoStat = Boolean(defProps[prop]);
			break;
			case "BLOCKOBJECT":
				myDef.BlockObject = Boolean(defProps[prop]);
			break;
			case "BLOCKPLAYER":
				myDef.BlockPlayer = Boolean(defProps[prop]);
			break;
			case "ALWAYSLIT":
				myDef.AlwaysLit = Boolean(defProps[prop]);
			break;
			case "DOMINANTCOLOR":
				myDef.DominantColor = Boolean(defProps[prop]);
			break;
			case "FULLCOLOR":
				myDef.FullColor = Boolean(defProps[prop]);
			break;
			case "TEXTDRAW":
				myDef.TextDraw = Boolean(defProps[prop]);
			break;
			case "CUSTOMDRAW":
				myDef.CustomDraw = Boolean(defProps[prop]);
			break;
			case "HASOWNCHAR":
				myDef.HasOwnChar = Boolean(defProps[prop]);
			break;
			case "HASOWNCODE":
				myDef.HasOwnCode = Boolean(defProps[prop]);
			break;
			case "CUSTOMSTART":
				hasCustomStart = Boolean(defProps[prop]);
			break;
			case "PUSHABLE":
				myDef.Pushable = utils.int(defProps[prop]);
			break;
			case "SQUASHABLE":
				myDef.Squashable = Boolean(defProps[prop]);
			break;
			case "CODE":
				codeProp = prop;
			break;
			default:
				// This member is assumed to be a default for a status
				// element or initial value.
				myDef.extraVals[uProp] = defProps[prop];
			break;
		}
	}

	// Ensure default "CHAR" extension exists if has own character.
	if (myDef.HasOwnChar)
	myDef.extraVals["CHAR"] = myDef.CHAR;

	// The one final property to handle is the code, which must be compiled.
	// This property is sent to the oop object, and a valid code ID is returned.
	if (!builtIn)
		zzt.extraTypeCode[name] = defProps[codeProp];

	var codeLines = defProps[codeProp].split("\n");
	var myCodeBlock = [];

	// First line cannot be empty text
	if (codeLines[0] == "\r" || codeLines[0] == "")
		codeLines[0] = "' ";

	// Collect all labels used in main type code initially.
	// If overridden main type code, "zap" these old labels in the process.
	if (myDef.NUMBER == 0)
	{
		oop.zeroTypeLabelAction = builtIn ? 1 : 2;
		if (!builtIn)
		{
			myCodeBlock = zzt.emptyCodeTemplate.concat();
			interp.codeBlocks[0] = myCodeBlock;
		}
	}

	// Compile code for type
	for (var i = 0; i < codeLines.length; i++) {
		// Strip trailing CR, if present
		var line = codeLines[i];
		if (line.charCodeAt(line.length-1) == 13)
		{
			line = line.substr(0, line.length-1);
			codeLines[i] = line;
		}

		// If line continuation code present, concatenate the next line.
		if (line.length > 0)
		{
			if (line.charAt(line.length-1) == '\\')
			{
				codeLines[i+1] = line.substr(0, line.length-1) + codeLines[i+1];
				codeLines[i] = "'";
				continue;
			}
		}

		oop.checkMiddleOffset = -1;
		var resultArr = oop.parseLine(myCodeBlock, codeLines[i]);
		if (resultArr == null)
		{
			zzt.Toast(oop.errorText);
			return false;
		}
	}

	// If custom code allowed, identify "real" start if needed
	if (hasCustomStart)
		myDef.CustomStart = myCodeBlock.length;

	// Add object definition to list.  Compiled code block is permanently
	// added to the code block record.
	if (builtIn)
	{
		if (myDef.NUMBER == 0)
		{
			// The zero-type is always added at the start.
			interp.codeBlocks.splice(0, 0, myCodeBlock);
			zzt.typeList.splice(0, 0, myDef);
		}
		else
		{
			// All other types are added sequentially.
			interp.codeBlocks.push(myCodeBlock);
			zzt.typeList.push(myDef);
		}
	}
	else
	{
		if (myDef.NUMBER == 0)
		{
			// An overridden zero-type must be accounted for.
			// This REPLACES the original zero-type template with
			// a composite of the original and the appended custom section.
			myDef.CODEID = 0;
			zzt.extraEmptyType = zzt.extraTypeList.length;
			zzt.extraEmptyCode = 0;

			interp.codeBlocks.push(myCodeBlock);
			zzt.extraTypeList.push(myDef);
			zzt.typeList[0] = myDef;
		}
		else
		{
			// Type is added to extra type list.
			myDef.CODEID = interp.codeBlocks.length;
			interp.codeBlocks.push(myCodeBlock);
			zzt.extraTypeList.push(myDef);
		}
	}

	return true;
};

static setupTypeTranslation() {
	// Create the number-to-type translation table.
	for (var i = 0; i < 256; i++)
		zzt.typeTrans[i] = 0;
	for (i = 0; i < zzt.typeList.length; i++)
		zzt.typeTrans[zzt.typeList[i].NUMBER] = i;

	zzt.typeTrans[0] = 0;

	// Find special dispatch label locations in the code
	for (i = 0; i < zzt.typeList.length; i++)
	{
		if (zzt.typeList[i].NAME == "BOARDEDGE")
			zzt.bEdgeType = i;
		else if (zzt.typeList[i].NAME == "BULLET")
			zzt.bulletType = i;
		else if (zzt.typeList[i].NAME == "STAR")
			zzt.starType = i;
		else if (zzt.typeList[i].NAME == "PLAYER")
			zzt.playerType = i;
		else if (zzt.typeList[i].NAME == "OBJECT")
			zzt.objectType = i;
		else if (zzt.typeList[i].NAME == "TRANSPORTER")
			zzt.transporterType = i;
		else if (zzt.typeList[i].NAME == "BEAR")
			zzt.bearType = i;
		else if (zzt.typeList[i].NAME == "BREAKABLE")
			zzt.breakableType = i;
		else if (zzt.typeList[i].NAME == "LAVA")
			zzt.lavaType = i;
		else if (zzt.typeList[i].NAME == "WATER")
			zzt.waterType = i;
		else if (zzt.typeList[i].NAME == "INVISIBLE")
			zzt.invisibleType = i;
		else if (zzt.typeList[i].NAME == "_WINDTUNNEL")
			zzt.windTunnelType = i;
		else if (zzt.typeList[i].NAME == "FILELINK")
			zzt.fileLinkType = i;
		else if (zzt.typeList[i].NAME == "PATCH")
			zzt.patchType = i;

		if (i < interp.numBuiltInTypes)
			zzt.typeList[i].CODEID = i;
		zzt.typeList[i].LocPUSHBEHAVIOR =
			interp.findLabel(interp.codeBlocks[zzt.typeList[i].CODEID], "$PUSHBEHAVIOR");
		zzt.typeList[i].LocWALKBEHAVIOR =
			interp.findLabel(interp.codeBlocks[zzt.typeList[i].CODEID], "$WALKBEHAVIOR");
		zzt.typeList[i].LocCUSTOMDRAW =
			interp.findLabel(interp.codeBlocks[zzt.typeList[i].CODEID], "$CUSTOMDRAW");
	}
};

static markUpCodeQuotes(codeStr) {
	var resultStr = "";
	var i = 0;
	do {
		var loc = codeStr.indexOf("\"", i);
		if (loc == -1)
		{
			resultStr += codeStr.substring(i);
			i = codeStr.length;
		}
		else
		{
			resultStr += codeStr.substring(i, loc) + "\\\"";
			i = loc + 1;
		}
	} while (i < codeStr.length);

	return resultStr;
};

static compileCustomCode(eInfo, customCode, delim="\n", matchIP=0) {
	// Queue up the custom code block
	oop.setOOPType(zzt.loadedOOPType);
	var codeLines = customCode.split(delim);

	// Create new code block, copying type's code as a basis
	var myCodeBlock = interp.codeBlocks[eInfo.CODEID].concat();

	// Compile code lines
	oop.lastAssignedName = "";
	oop.virtualIP = 0;
	oop.zeroTypeLabelAction = 0;
	var runningIP = 0;
	for (var i = 0; i < codeLines.length; i++) {
		var line = codeLines[i];

		// Capture offset into original text for comment and label.
		oop.lineStartIP = runningIP;

		// See if original text-based IP matches start of line.
		oop.checkMiddleOffset = -1;
		if (matchIP > 0 && oop.virtualIP == 0)
		{
			if (matchIP == runningIP || matchIP == runningIP - 1)
			{
				// Exact match to start of line.
				oop.virtualIP = myCodeBlock.length;
				matchIP = -1;
			}
			else if (matchIP - runningIP < line.length + 1)
			{
				// Match in middle of line, probably for a direction.
				oop.checkMiddleOffset = matchIP - runningIP;
			}
		}
		runningIP += line.length + 1;

		// Strip trailing CR, if present
		if (line.charCodeAt(line.length-1) == 13)
		{
			line = line.substr(0, line.length-1);
			codeLines[i] = line;
		}

		// If line continuation code present, concatenate the next line.
		if (line.length > 0 && zzt.loadedOOPType == -3)
		{
			if (line.charAt(line.length-1) == '\\')
			{
				codeLines[i+1] = line.substr(0, line.length-1) + codeLines[i+1];
				codeLines[i] = "'";
				continue;
			}
		}

		var resultArr = oop.parseLine(myCodeBlock, codeLines[i]);
		if (resultArr == null)
		{
			zzt.Toast(oop.errorText);
			return -1;
		}
	}

	// Add to code blocks
	var myCodeId = interp.codeBlocks.length;
	interp.codeBlocks.push(myCodeBlock);

	// Return new code ID, which will be used in status element
	return myCodeId;
};

static oneLineExecCommand(line) {
	// Create a quasi-unique temporary type
	var eInfo = new ElementInfo("###TEMP###");
	eInfo.CYCLE = 1;
	zzt.typeList.push(eInfo);
	oop.setOOPType();

	var resultArr = null;
	var myCodeBlock = [];
	try {
		// Compile a one-line program statement
		resultArr = oop.parseLine(myCodeBlock, line);
		if (resultArr == null)
			zzt.Toast(oop.errorText);
	}
	catch (e) {
		zzt.Toast("ERROR:  " + e);
	}

	if (resultArr != null)
	{
		// Add temporary code block
		oop.parseLine(myCodeBlock, "#END");
		eInfo.CODEID = interp.codeBlocks.length;
		interp.codeBlocks.push(myCodeBlock);

		// Dispatch message
		var tempSE = new SE(zzt.typeList.length - 1, 0, 0, 0, true);
		try {
			interp.briefDispatch(0, interp.thisSE, tempSE);
		}
		catch (e) {
			zzt.Toast("ERROR:  " + e);
		}

		// Remove temporary code block
		interp.codeBlocks.pop();
	}

	// Remove temporary type
	zzt.typeList.pop();
	oop.setOOPType(zzt.loadedOOPType);
};

static resetGuis() {
	for (var k in zzt.origGuiStorage) {
		zzt.guiStorage[k] = zzt.origGuiStorage[k];
	}
};

static establishGui(guiName) {
	// Fetch GUI by specific name
	if (!zzt.guiStorage.hasOwnProperty(guiName))
		return false;
	zzt.thisGui = zzt.guiStorage[guiName];

	// Cancel click-to-move
	input.c2MDestX = -1;
	input.c2MDestY = -1;

	// Get top-level GUI variables
	zzt.Use40Column = utils.int(utils.ciLookup(zzt.thisGui, "Use40Column"));
	zzt.OverallSizeX = utils.int(utils.ciLookup(zzt.thisGui, "OverallSizeX"));
	zzt.OverallSizeY = utils.int(utils.ciLookup(zzt.thisGui, "OverallSizeY"));
	zzt.GuiLocX = utils.int(utils.ciLookup(zzt.thisGui, "GuiLocX"));
	zzt.GuiLocY = utils.int(utils.ciLookup(zzt.thisGui, "GuiLocY"));
	zzt.GuiWidth = utils.int(utils.ciLookup(zzt.thisGui, "GuiWidth"));
	zzt.GuiHeight = utils.int(utils.ciLookup(zzt.thisGui, "GuiHeight"));
	zzt.Viewport = utils.ciLookup(zzt.thisGui, "Viewport");
	SE.vpX0 = zzt.Viewport[0];
	SE.vpY0 = zzt.Viewport[1];
	SE.vpWidth = zzt.Viewport[2];
	SE.vpHeight = zzt.Viewport[3];
	SE.vpX1 = zzt.Viewport[0] + zzt.Viewport[2] - 1;
	SE.vpY1 = zzt.Viewport[1] + zzt.Viewport[3] - 1;
	if (zzt.Use40Column)
	{
		zzt.cellXDiv = 16;
		zzt.aspectMultiplier = 1;
	}
	else
	{
		zzt.cellXDiv = 8;
		zzt.aspectMultiplier = 2;
	}

	// Get text, color, key inputs, and label info
	zzt.GuiText = utils.ciLookup(zzt.thisGui, "Text");
	zzt.GuiColor = utils.ciLookup(zzt.thisGui, "Color");
	zzt.GuiKeys = utils.ciLookup(zzt.thisGui, "KeyInput");
	zzt.GuiLabels = utils.ciLookup(zzt.thisGui, "Label");

	// If toast labels customized, read them here
	if (zzt.GuiLabels.hasOwnProperty("TOAST1"))
	{
		zzt.toastMsgSize = 1;
		zzt.toastMsgCont[0] = [zzt.GuiLabels["TOAST1"][0], zzt.GuiLabels["TOAST1"][1],
		zzt.GuiLabels["TOAST1"][2], zzt.GuiLabels["TOAST1"][3]];
		zzt.toastMsgCont[0][0] += zzt.GuiLocX - 1;
		zzt.toastMsgCont[0][1] += zzt.GuiLocY - 1;
		if (zzt.GuiLabels.hasOwnProperty("TOAST2"))
		{
			zzt.toastMsgSize = 2;
			zzt.toastMsgCont[1] = [zzt.GuiLabels["TOAST2"][0], zzt.GuiLabels["TOAST2"][1],
			zzt.GuiLabels["TOAST2"][2], zzt.GuiLabels["TOAST2"][3]];
			zzt.toastMsgCont[1][0] += zzt.GuiLocX - 1;
			zzt.toastMsgCont[1][1] += zzt.GuiLocY - 1;
		}
	}

	// If a palette is provided for the GUI, activate it here
	if (utils.ciTest(zzt.thisGui, "PALETTE"))
	{
		var palSeq = utils.ciLookup(zzt.thisGui, "PALETTE");
		palSeq = interp.getFlatSequence(palSeq);
		zzt.mg.setPaletteColors(0, 16, 255, palSeq);
	}

	// If scroll interface box customized, read settings here
	if (utils.ciTest(zzt.thisGui, "SCROLL"))
	{
		var scr = utils.ciLookup(zzt.thisGui, "SCROLL");
		zzt.scrollCenterX = utils.int(scr[0] + zzt.GuiLocX);
		zzt.scrollCenterY = utils.int(scr[1] + zzt.GuiLocY);
		zzt.msgScrollWidth = utils.int(scr[2]);
		zzt.msgScrollHeight = utils.int(scr[3]);
		zzt.scroll40Column = utils.int(scr[4]);
	}
	else
	{
		zzt.scrollCenterX = 30;
		zzt.scrollCenterY = 13;
		zzt.msgScrollWidth = 42;
		zzt.msgScrollHeight = 15;
		zzt.scroll40Column = 0;
	}

	// Text and colors must be reformatted to allow for easy
	// transfers to destination
	zzt.GuiTextLines = [];
	var iCursor = 0;
	var jCursor = 0;
	do {
		// Line must be bounded by a line break, and it must
		// equal or exceed the GUI width spec.
		jCursor = zzt.GuiText.indexOf("\n", iCursor);
		if (jCursor != -1)
		{
			if (jCursor - iCursor >= zzt.GuiWidth)
				zzt.GuiTextLines.push(zzt.GuiText.substring(iCursor, iCursor + zzt.GuiWidth));

			iCursor = ++jCursor;
		}
	} while (jCursor != -1);

	zzt.GuiColorLines = [];
	var thisList = [];
	for (var i = 0; i < zzt.GuiColor.length; i += 2)
	{
		var attr = zzt.GuiColor[i];
		var runLen = zzt.GuiColor[i+1];
		while (runLen--)
			thisList.push(attr);

		if (thisList.length >= zzt.GuiWidth)
		{
			zzt.GuiColorLines.push(thisList);
			thisList = [];
		}
	}

	// Key mapping is stored as a look-up table, not a dictionary
	for (var n = 0; n < 256; n++)
	{
		zzt.GuiKeyMapping[n] = "";
		zzt.GuiKeyMappingShift[n] = "";
		zzt.GuiKeyMappingCtrl[n] = "";
		zzt.GuiKeyMappingShiftCtrl[n] = "";
	}
	for (var s in zzt.GuiKeys)
	{
		var origKey = s;
		var sReq = false;
		var cReq = false;
		if (utils.startswith(s, "SHIFT+"))
		{
			sReq = true;
			s = s.substr(6);
		}
		if (utils.startswith(s, "CTRL+"))
		{
			cReq = true;
			s = s.substr(5);
		}

		var val;
		if (s.charCodeAt(0) >= 48 && s.charCodeAt(0) <= 57)
			val = utils.int(s); // Code-based input
		else
			val = s.charCodeAt(0); // Character-based input
		//console.log (s, val);

		if (sReq && cReq)
			zzt.GuiKeyMappingShiftCtrl[val] = zzt.GuiKeys[origKey];
		else if (sReq)
			zzt.GuiKeyMappingShift[val] = zzt.GuiKeys[origKey];
		else if (cReq)
			zzt.GuiKeyMappingCtrl[val] = zzt.GuiKeys[origKey];
		else
			zzt.GuiKeyMapping[val] = zzt.GuiKeys[origKey];
	}

	// Mouse button mapping is stored as a dictionary
	zzt.curHighlightButton = "";
	zzt.GuiMouseEvents = {};
	if (utils.ciTest(zzt.thisGui, "MouseInput"))
	{
		var mInput = utils.ciLookup(zzt.thisGui, "MouseInput");
		for (s in mInput)
			zzt.GuiMouseEvents[s] = mInput[s];
	}

	// Change double-width spec if needed
	zzt.mg.setDoubled(Boolean(zzt.Use40Column == 1));

	// Account for scanline mode
	var oldSCANLINES = zzt.globalProps["SCANLINES"]
	if (utils.ciTest(zzt.thisGui, "SCANLINES"))
	{
		zzt.globalProps["SCANLINES"] = utils.int(utils.ciLookup(zzt.thisGui, "SCANLINES"));
		zzt.mg.updateScanlineMode(zzt.globalProps["SCANLINES"]);
		zzt.cellYDiv = 16;
	}

	// Account for bit-7 meaning
	if (utils.ciTest(zzt.thisGui, "BIT7ATTR"))
		zzt.globalProps["BIT7ATTR"] = utils.int(utils.ciLookup(zzt.thisGui, "BIT7ATTR"));
	zzt.mg.updateBit7Meaning(zzt.globalProps["BIT7ATTR"]);

	// Set up grid surface abstractions
	if (oldSCANLINES != zzt.globalProps["SCANLINES"])
		zzt.mg.createSurfaces(zzt.OverallSizeX, zzt.OverallSizeY, zzt.Viewport, true);

	SE.uCameraX = -1000;
	SE.uCameraY = -1000;

	zzt.thisGuiName = guiName;
	zzt.globalProps["THISGUI"] = guiName;
	return true;
};

static popGui() {
	// Only works if stack is not at bottom
	if (zzt.guiStack.length > 1)
	{
		zzt.thisGuiName = zzt.guiStack[zzt.guiStack.length - 2];
		if (zzt.establishGui(zzt.thisGuiName))
		{
			zzt.guiStack.pop();
			zzt.mainMode = zzt.MODE_NORM;
			zzt.drawGui();
			zzt.dispatchInputMessage("EVENT_REDRAW");
		}
	}
};

static drawGui() {
	zzt.mg.writeBlock(zzt.GuiLocX-1, zzt.GuiLocY-1, zzt.GuiTextLines, zzt.GuiColorLines);
	zzt.curHighlightButton = "";

	if (zzt.thisGuiName == "DEBUGMENU")
	{
		zzt.drawGuiLabel("CUSTOMTEXT", zzt.featuredWorldName);
		zzt.drawGuiLabel("VERSIONTEXT", zzt.globalProps["VERSION"].toString());
		zzt.drawGuiLabel("BUILDTEXT", "HTML5 Build");
		zzt.drawGuiLabel("SPECIALTEXT", "Prototype");
		//drawGuiLabel("SPECIALTEXT", "NG Special");
		Sounds.distributePlayNotes("U137");
	}

	return true;
};

static drawGuiLabel(labelStr, str, attr=-1) {
	if (zzt.GuiLabels.hasOwnProperty(labelStr))
	{
		// Extract label info
		var guiLabelInfo = zzt.GuiLabels[labelStr];
		var gx = utils.int(guiLabelInfo[0]);
		var gy = utils.int(guiLabelInfo[1]);
		var maxLen = utils.int(guiLabelInfo[2]);
		var defAttr = utils.int(guiLabelInfo[3]);

		// Write text to label location
		gx += zzt.GuiLocX-1;
		gy += zzt.GuiLocY-1;
		if (str.length > maxLen)
			str = str.substr(0, maxLen); // Clip

		if (guiLabelInfo.length >= 5)
		{
			if (utils.int(guiLabelInfo[4]) != 0)
				gx += maxLen - str.length; // Right-justify
		}

		if (attr == -1)
			attr = defAttr; // Default color

		// Draw
		zzt.mg.writeStr(gx-1, gy-1, str, attr);
		return true;
	}

	return false;
};

static eraseGuiLabel(labelStr, attr=-1) {
	if (zzt.GuiLabels.hasOwnProperty(labelStr))
	{
		// Extract label info
		var guiLabelInfo = zzt.GuiLabels[labelStr];
		var gx = utils.int(guiLabelInfo[0]);
		var gy = utils.int(guiLabelInfo[1]);
		var maxLen = utils.int(guiLabelInfo[2]);
		var defAttr = utils.int(guiLabelInfo[3]);

		// Erase at label location
		gx += zzt.GuiLocX-1;
		gy += zzt.GuiLocY-1;
		while (maxLen-- > 0)
			zzt.displayGuiSquare(gx++, gy);
		return true;
	}

	return false;
};

static displayGuiSquare(x, y) {
	if (x >= SE.vpX0 && y >= SE.vpY0 && x <= SE.vpX1 && y <= SE.vpY1)
	{
		// Falls within viewport; write square using SE.
		x -= SE.vpX0 - SE.CameraX;
		y -= SE.vpY0 - SE.CameraY;
		SE.displaySquare(x, y);
	}
	else if (x >= zzt.GuiLocX && y >= zzt.GuiLocY &&
		x < zzt.GuiLocX + zzt.GuiWidth && y < zzt.GuiLocY + zzt.GuiHeight)
	{
		// Ordinary GUI square.  Write GUI character.
		x -= zzt.GuiLocX;
		y -= zzt.GuiLocY;
		zzt.mg.setCell(x+zzt.GuiLocX-1, y+zzt.GuiLocY-1,
			utils.int(zzt.GuiTextLines[y].charCodeAt(x)), utils.int(zzt.GuiColorLines[y][x]));
	}

	// If coordinates fall outside of viewport, we can't display anything.
};

static showEdgeNavArrow(x, y, dir) {
	zzt.lastEdgeNavArrowX = x;
	zzt.lastEdgeNavArrowY = y;
	x += -SE.CameraX + SE.vpX0 - 1;
	y += -SE.CameraY + SE.vpY0 - 1;
	zzt.mg.setCell(x, y, zzt.edgeNavArrowChars[dir], 128 + 31);
};

static drawPen(labelStr, startVal, endVal, actVal, chrCode, attr) {
	if (zzt.GuiLabels.hasOwnProperty(labelStr) && startVal != endVal)
	{
		// Extract label info
		var guiLabelInfo = zzt.GuiLabels[labelStr];
		var gx = utils.int(guiLabelInfo[0]);
		var gy = utils.int(guiLabelInfo[1]);
		var maxLen = utils.int(guiLabelInfo[2]);
		var defAttr = utils.int(guiLabelInfo[3]);

		// Erase at label location
		gx += zzt.GuiLocX-1;
		gy += zzt.GuiLocY-1;
		if (attr == -1)
			attr = defAttr; // Default color
		zzt.mg.writeConst(gx-1, gy-1, maxLen, 1, " ", defAttr);

		// Find pen render disposition
		var frac;
		if (startVal < endVal)
			frac = utils.int((actVal - startVal) * maxLen / (endVal - startVal + 1));
		else
			frac = utils.int((actVal - endVal) * maxLen / (startVal - endVal+ 1));
		if (frac < 0)
			frac = 0;
		else if (frac >= maxLen)
			frac = maxLen - 1;

		// Draw pen
		if (startVal < endVal)
			gx += frac; // Increases left to right
		else
			gx += maxLen - 1 - frac; // Increases right to left
		zzt.mg.setCell(gx-1, gy-1, chrCode, attr);
		return true;
	}

	return false;
};

static selectPen(labelStr, startVal, endVal, actVal, chrCode, attr, doneMsg) {
	// Draw initial pen
	if (zzt.drawPen(labelStr, startVal, endVal, actVal, chrCode, attr))
	{
		// Go into pen selection mode
		zzt.confLabelStr = labelStr;
		zzt.confYesMsg = doneMsg;
		zzt.penStartVal = startVal;
		zzt.penEndVal = endVal;
		zzt.penActVal = actVal;
		zzt.penChrCode = chrCode;
		zzt.penAttr = attr;
		zzt.mainMode = zzt.MODE_SELECTPEN;
		return true;
	}

	return false;
};

static drawBar(labelStr, startVal, endVal, actVal, attr) {
	if (zzt.GuiLabels.hasOwnProperty(labelStr) && startVal != endVal)
	{
		// Extract label info
		var guiLabelInfo = zzt.GuiLabels[labelStr];
		var gx = utils.int(guiLabelInfo[0]);
		var gy = utils.int(guiLabelInfo[1]);
		var maxLen = utils.int(guiLabelInfo[2]);
		var defAttr = utils.int(guiLabelInfo[3]);

		// Erase at label location
		gx += zzt.GuiLocX-1;
		gy += zzt.GuiLocY-1;
		if (attr == -1)
			attr = defAttr; // Default color
		zzt.mg.writeConst(gx-1, gy-1, maxLen, 1, " ", defAttr);

		// Find bar render disposition
		var fracFloat;
		if (startVal < endVal)
			fracFloat = Number((actVal - startVal) * maxLen * 2) / Number(endVal - startVal);
		else
			fracFloat = Number((actVal - endVal) * maxLen * 2) / Number(startVal - endVal);

		var frac = utils.int(fracFloat + 0.5);
		if (frac < 0)
			frac = 0;
		else if (frac > maxLen * 2)
			frac = maxLen * 2;

		// Draw bar
		if (startVal < endVal)
		{
			// Grows rightwards
			while (frac >= 2)
			{
				// Set "full" cell
				zzt.mg.setCell(gx-1, gy-1, 219, attr);
				gx++;
				frac -= 2;
			}

			// Set "half" cell if applicable
			if (frac == 1)
				zzt.mg.setCell(gx-1, gy-1, 221, attr);
		}
		else
		{
			// Grows leftwards
			gx += maxLen - 1;
			while (frac >= 2)
			{
				// Set "full" cell
				zzt.mg.setCell(gx-1, gy-1, 219, attr);
				gx--;
				frac -= 2;
			}

			// Set "half" cell if applicable
			if (frac == 1)
				zzt.mg.setCell(gx-1, gy-1, 222, attr);
		}

		return true;
	}

	return false;
};

static confMessage(labelStr, str, yesMsg, noMsg, cancelMsg="") {
	zzt.confLabelStr = labelStr;
	zzt.confYesMsg = yesMsg;
	zzt.confNoMsg = noMsg;
	zzt.confCancelMsg = cancelMsg;
	zzt.drawGuiLabel(labelStr, str);
	zzt.mainMode = zzt.MODE_CONFMESSAGE;

	var guiLabelInfo = zzt.GuiLabels[labelStr];
	var gx = utils.int(guiLabelInfo[0]);
	var gy = utils.int(guiLabelInfo[1]);
	var maxLen = utils.int(guiLabelInfo[2]);
	if (gy + zzt.GuiLocY - 2 >= 24)
	{
		// Align buttons to right
		zzt.confButtonX = gx + str.length + 1;
		zzt.confButtonY = gy;
	}
	else
	{
		// Align buttons below
		zzt.confButtonX = gx + 3;
		zzt.confButtonY = gy + 1;
	}

	zzt.confButtonSel = 0;
	zzt.confButtonUnderText.length = 0;
	zzt.confButtonUnderColors.length = 0;
	zzt.drawConfButtons();

	return true;
};

static drawConfButtons() {
	// If no under-text established, remember it now.
	if (zzt.confButtonUnderText.length == 0)
	{
		zzt.confButtonUnderBG = zzt.mg.getAttr(zzt.GuiLocX + zzt.confButtonX - 2, zzt.GuiLocY + zzt.confButtonY - 2);
		zzt.confButtonUnderBG = zzt.confButtonUnderBG & (7 << 3);

		for (var i = 0; i < 10; i++)
		{
			zzt.confButtonUnderText.push(
				zzt.mg.getChar(zzt.GuiLocX + zzt.confButtonX + i - 2, zzt.GuiLocY + zzt.confButtonY - 2));
			zzt.confButtonUnderColors.push(
				zzt.mg.getAttr(zzt.GuiLocX + zzt.confButtonX + i - 2, zzt.GuiLocY + zzt.confButtonY - 2));
		}
	}

	// Draw "Yes" button
	var color = (zzt.confButtonSel == 0) ?
		zzt.confButtonColorSelYes : (zzt.confButtonUnderBG | zzt.confButtonColorYes);
	zzt.mg.writeStr(zzt.GuiLocX + zzt.confButtonX - 2, zzt.GuiLocY + zzt.confButtonY - 2, zzt.confButtonTextYes, color);

	// Draw "No" button
	color = (zzt.confButtonSel == 1) ?
		zzt.confButtonColorSelNo : (zzt.confButtonUnderBG | zzt.confButtonColorNo);
	zzt.mg.writeStr(zzt.GuiLocX + zzt.confButtonX + 6 - 2, zzt.GuiLocY + zzt.confButtonY - 2, zzt.confButtonTextNo, color);
};

static unDrawConfButtons() {
	// Replace original text under confirmation buttons.
	for (var i = 0; i < zzt.confButtonUnderText.length; i++)
	{
		zzt.mg.setCell(zzt.GuiLocX + zzt.confButtonX + i - 2, zzt.GuiLocY + zzt.confButtonY - 2,
		zzt.confButtonUnderText[i], zzt.confButtonUnderColors[i]);
	}
};

static textEntry(labelStr, str, maxCharCount, color, yesMsg, noMsg) {
	zzt.confLabelStr = labelStr;
	zzt.confYesMsg = yesMsg;
	zzt.confNoMsg = noMsg;
	zzt.textMaxCharCount = maxCharCount;
	zzt.textChars = str;
	zzt.textCharsColor = color;
	for (var i = zzt.textChars.length; i < zzt.textMaxCharCount; i++)
		str += " ";

	zzt.drawGuiLabel(labelStr, str, color);
	zzt.mainMode = zzt.MODE_TEXTENTRY;
	return true;
};

static setGameSpeed(newSpeed) {
	if (zzt.gameSpeed != newSpeed)
	{
		zzt.gameSpeed = utils.int(utils.clipval(newSpeed, 0, 8));
		if (zzt.gameSpeed == 0)
		{
			var newTick = utils.clipval(zzt.globalProps["FASTESTFPS"], 1.0, 10000.0);
			zzt.speedInits[0] = 30.0 / newTick;
		}

		zzt.gTickInit = zzt.speedInits[zzt.gameSpeed];
		zzt.gTickCurrent = zzt.gTickInit;
	}
};

static addMask(str, maskArray) {
	// Get size.
	var ySize = maskArray.length;
	var xSize = maskArray[0].length;

	// Replace each string with an array.  This is more easily looked up.
	var newCont = [];
	for (var y = 0; y < ySize; y++)
	{
		var newArr = [];
		for (var x = 0; x < xSize; x++)
		{
			// Number characters are converted to actual numbers.
			if (utils.isString(maskArray[y]))
				newArr.push(utils.int(maskArray[y].charCodeAt(x)) - 48);
			else
				newArr.push(utils.int(maskArray[y][x]));
		}

		newCont.push(newArr);
	}

	// Set mask dictionary.
	zzt.masks[str] = newCont;
};

static textLinesToGui(labelStr) {
	if (zzt.GuiLabels.hasOwnProperty(labelStr))
	{
		// Extract label info
		var guiLabelInfo = zzt.GuiLabels[labelStr];
		var gx = utils.int(guiLabelInfo[0]);
		var gy = utils.int(guiLabelInfo[1]);
		var maxLen = utils.int(guiLabelInfo[2]);
		var defAttr = utils.int(guiLabelInfo[3]);

		// Write lines to label location
		gx += zzt.GuiLocX - 2;
		gy += zzt.GuiLocY - 2;

		for (var i = 0; i < zzt.numTextLines; i++) {
			var str = zzt.msgScrollText[i];
			if (str.length > maxLen)
				str = str.substr(0, maxLen); // Clip

			zzt.mg.writeStr(gx, gy, str, defAttr);
			gy++;
		}
	}
};

static textLinesToRegion(regionName, textType) {
	var region = interp.getRegion(regionName);

	// Establish region bounds
	var x0 = 0;
	var y0 = 0;
	var xf = -1;
	var yf = -1;
	if (interp.validCoords(region[0]) && interp.validCoords(region[1]))
	{
		x0 = region[0][0];
		y0 = region[0][1];
		xf = region[1][0];
		yf = region[1][1];
	}

	var i = 0;
	for (var y = y0; y <= yf; y++, i++) {
		if (i >= zzt.numTextLines)
			break; // Done with lines

		var str = zzt.msgScrollText[i];

		var j = 0;
		for (var x = x0; x <= xf; x++, j++) {
			if (j >= str.length)
				break; // End of line

			// Get character
			var c = str.charCodeAt(j);

			// Kill destination
			var relSE = SE.getStatElemAt(x, y);
			if (relSE)
				interp.killSE(x, y);

			// Update grid cell
			SE.setType(x, y, textType);
			SE.setColor(x, y, c, false);
			SE.displaySquare(x, y);
		}
	}
};

// Set toast message box (debug).
static Toast(textmsg, timeOpen=2.5) {
	//console.log(textmsg);

	// Set time left
	zzt.toastTime = utils.int(30 * timeOpen);

	// Generate text lines
	zzt.toastText = [];
	var i = 0;
	while (i < textmsg.length) {
		var j = i + 60;
		if (j >= textmsg.length)
			j = textmsg.length;

		// Break at newline
		var k = textmsg.indexOf("\n", i);
		if (k != -1 && k < j)
			j = k + 1;

		// Add line
		zzt.toastText.push(textmsg.substring(i, j));
		i = j;
	}

	if (zzt.guiPropText.hidden == false)
	{
		zzt.toastTempGridHide = true;
		zzt.guiPropText.hidden = true;
	}

	zzt.drawToastBox();
};

// Draw toast message box (debug).
static drawToastBox() {
	// Fill background
	var ctx = zzt.stage.getContext("2d");
	ctx.beginPath();
	ctx.fillStyle = "#000000";
	ctx.fillRect(10, 270, 620, 130);

	// Write text
	ctx.font = "16px Courier New";
	ctx.fillStyle = "#ffffff";
	ctx.textBaseline = "top";
	ctx.textAlign = "left";

	var y = 270;
	for (var i = 0; i < zzt.toastText.length; i++) {
		var line = zzt.toastText[i];
		ctx.fillText(line, 10, y);
		y += 16;
	}
};

static ToastMsg(timeOpen=0.0) {
	if (zzt.numTextLines <= 0)
		return; // Nothing to display

	zzt.toastMsgText[0] = "";
	zzt.toastMsgText[1] = "";

	// Line 1
	if (zzt.msgScrollFormats[0] == "$")
		zzt.toastMsgText[0] = " $" + zzt.msgScrollText[0] + " ";
	else if (zzt.msgScrollText[0].length == 0)
		zzt.toastMsgText[0] = "";
	else
		zzt.toastMsgText[0] = " " + zzt.msgScrollText[0] + " ";

	// Line 2
	if (zzt.numTextLines > 1)
	{
		if (zzt.msgScrollFormats[1] == "$")
			zzt.toastMsgText[1] = " $" + zzt.msgScrollText[1] + " ";
		else if (zzt.msgScrollText[1].length == 0)
			zzt.toastMsgText[1] = "";
		else
			zzt.toastMsgText[1] = " " + zzt.msgScrollText[1] + " ";
	}

	// If no time open is set, use a sliding scale from 1.25 to 4.0
	// seconds with overall length serving as the basis for time.
	if (timeOpen == 0.0)
	{
		// Zero char min:  1.25 seconds.  60-char max:  4.0 seconds.
		timeOpen = Number(zzt.toastMsgText[0].length) / 60.0 * 2.75 + 1.25;
	}

	zzt.toastMsgTimeLeft = utils.int(30 * timeOpen);
	zzt.toastMsgColor = 9;
	zzt.undisplayToastMsg();
	zzt.displayToastMsg();
};

static undisplayToastMsg() {
	for (var i = 0; i < zzt.toastMsgSize; i++)
	{
		var x = zzt.toastMsgCont[i][0];
		var y = zzt.toastMsgCont[i][1];
		var l = zzt.toastMsgCont[i][2];
		for (var j = 0; j < l; j++)
			zzt.displayGuiSquare(x + j, y);
	}
};

static displayToastMsg() {
	for (var i = 0; i < zzt.toastMsgSize; i++)
	{
		var x = zzt.toastMsgCont[i][0];
		var y = zzt.toastMsgCont[i][1];
		var l = zzt.toastMsgCont[i][2];
		var bgColor = zzt.toastMsgCont[i][3] & 0xF0;

		// If line of text will not fit into length, clip it.
		if (zzt.toastMsgText[i].length > l)
			zzt.toastMsgText[i] = zzt.toastMsgText[i].substr(0, l);

		// Center message and display.
		x += utils.int(l / 2);
		if (zzt.toastMsgText[i].length & 1)
			x -= utils.int(zzt.toastMsgText[i].length / 2);
		else
			x -= utils.int((zzt.toastMsgText[i].length - 1) / 2);
		zzt.mg.writeStr(x-1, y-1, zzt.toastMsgText[i], zzt.toastMsgColor | bgColor);
	}
};

static addMsgLine(fmt, txt) {
	if (txt.length > 0)
		zzt.msgNonBlank = true;
	zzt.msgScrollFormats.push(fmt);
	zzt.msgScrollText.push(txt);
	zzt.numTextLines++;

	if (zzt.numTextLines > zzt.toastMsgSize && interp.textTarget == interp.TEXT_TARGET_NORM)
		zzt.globals["$SCROLLMSG"] = 1;
};

static scrollInterfaceButton() {
	// Done or link follow
	var fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
	if (zzt.inEditor)
	{
		// Editor has many different types of scroll interfaces;
		// delegate the responsibility to editor section.
		editor.scrollInterfaceButton(fmt);
	}
	else if (fmt == "$" || fmt == "")
	{
		// Not scroll button; just close scroll
		zzt.mainMode = zzt.MODE_SCROLLCLOSE; // Done
	}
	else if (zzt.msgScrollFiles)
	{
		// File browser selection
		zzt.globals["$SCROLLMSG"] = 0;

		// Extension determines what we will try to display
		var n = utils.int(fmt);
		var fStr = "";
		if (zzt.fileSystemType == zzt.FST_ZIP)
		{
			// ZIP archive file
			fStr = parse.zipData.fileNames[n];
			parse.fileData = parse.zipData.getFileByName(fStr);
			if (utils.endswith(fStr, ".ZZT"))
			{
				parse.loadingSuccess = true;
				zzt.mainMode = zzt.MODE_LOADZZT;
			}
			else if (utils.endswith(fStr, ".SZT"))
			{
				parse.loadingSuccess = true;
				zzt.mainMode = zzt.MODE_LOADSZT;
			}
			else if (utils.endswith(fStr, ".WAD"))
			{
				parse.loadingSuccess = true;
				zzt.mainMode = zzt.MODE_LOADWAD;
			}
			else if (utils.endswith(fStr, ".HLP"))
			{
				// File link display
				zzt.modeWhenBrowserClosed = zzt.MTRANS_ZIPSCROLL;
				zzt.displayFileLink(fStr);
			}
			else
			{
				// Full-page file browser
				zzt.modeWhenBrowserClosed = zzt.MTRANS_ZIPSCROLL;
				zzt.displayFileBrowser(fStr);
			}
		}
		else if (n < 0)
		{
			zzt.modeChanged = true;
			zzt.mainMode = zzt.MODE_LOADSAVEWAIT;
			zzt.modeWhenBrowserClosed = zzt.MTRANS_NORM;
			zzt.highScoreServer = false;
			switch (n) {
				case -1:
					parse.loadLocalFile("ZZT", zzt.MODE_NATIVELOADZZT, zzt.MODE_NORM);
				break;
				case -2:
					parse.loadLocalFile("SZT", zzt.MODE_NATIVELOADSZT, zzt.MODE_NORM);
				break;
				case -3:
					parse.loadLocalFile("WAD", zzt.MODE_LOADWAD, zzt.MODE_NORM);
				break;
				case -4:
					parse.loadLocalFile("ZIP", zzt.MODE_LOADZIP, zzt.MODE_NORM);
				break;
			}
		}
		else
		{
			// Deployed file in configuration
			zzt.modeWhenBrowserClosed = zzt.MTRANS_NORM;
			zzt.launchDeployedFile(zzt.allDeployedPaths[n]);
		}
	}
	else if (zzt.msgScrollIsRestore)
	{
		// Restoration
		zzt.globals["$SCROLLMSG"] = 0;

		if (fmt == "0")
		{
			// World restore
			zzt.modeChanged = true;
			zzt.mainMode = zzt.MODE_LOADSAVEWAIT;
			zzt.highScoreServer = false;
			parse.loadLocalFile("SAV", zzt.MODE_RESTOREWADFILE, zzt.MODE_NORM);
		}
		else
		{
			// Snapshot restore
			n = utils.int(fmt);
			for (var i = ZZTLoader.saveStates.length - 1; i >= 0; i--) {
				// Get genuine, deliberate save states (not bases or incidentals).
				var sState = ZZTLoader.saveStates[i];
				if (sState.saveType >= 0)
				{
					if (n <= 1)
					{
						ZZTLoader.restoreToState(i);
						interp.dispatchToMainLabel("$ONRESTORESTATE");
						zzt.dissolveViewport(zzt.MODE_NORM, 0.5, -1);
						console.log(zzt.globalProps["BOARD"], zzt.globals["$PLAYERPAUSED"], zzt.globals["$PLAYERMODE"],
							zzt.globalProps["THISGUI"]);
						return;
					}
					n--;
				}
			}

			zzt.mainMode = zzt.MODE_NORM;
		}
	}
	else if (fmt.substr(0, 1) == "!")
	{
		// File link display
		zzt.globals["$SCROLLMSG"] = 0;
		fmt = fmt.substr(1);
		if (fmt.indexOf(".") == -1)
			fmt = fmt + ".HLP";
		zzt.displayFileLink(fmt);
	}
	else
	{
		// Link follow
		interp.linkFollow(fmt);
		if (zzt.mainMode == zzt.MODE_SCROLLOPEN)
			zzt.mainMode = zzt.MODE_SCROLLCHAIN;
		else
			zzt.mainMode = zzt.MODE_SCROLLCLOSE;
	}
};

static ScrollMsg(objName="") {
	zzt.msgScrollObjName = objName;
	zzt.msgScrollIndex = 0;
	zzt.mouseScrollOffset = 0;

	// Erase previous scroll interface text.
	zzt.titleGrid.silentErase(32, zzt.sTextColor);
	zzt.scrollGrid.silentErase(32, zzt.sArrowColor);

	// Set up scroll frame type per configuration.
	if (zzt.globalProps["OVERLAYSCROLL"])
		zzt.setScrollBitmapColors(0);
	else
		zzt.setScrollBitmapColors(1);

	// Set new "final" dimensions and initial scroll message text.
	zzt.curScrollCols = zzt.msgScrollWidth;
	zzt.curScrollRows = zzt.msgScrollHeight;
	zzt.setScrollMsgDims(zzt.curScrollCols, zzt.curScrollRows, false);
	zzt.drawScrollMsgText(true);

	// If we will "scroll" open, start the dimensions small.
	if (zzt.globalProps["IMMEDIATESCROLL"] == 0 && !zzt.inEditor)
	{
		if (zzt.globalProps["ORIGINALSCROLL"] != 0)
		{
			zzt.curScrollRows = 1;
		}
		else
		{
			zzt.curScrollCols = 1;
			zzt.curScrollRows = 1;
		}
		zzt.setScrollMsgDims(zzt.curScrollCols, zzt.curScrollRows, false);
	}

	// Set "open" mode.
	zzt.mg.redrawGrid();
	zzt.mainMode = zzt.MODE_SCROLLOPEN;
	zzt.modeChanged = true;
};

// Adjust scroll bitmap colors.
static setScrollBitmapColors(idx) {
	CellGrid.scrollLegacyMode = idx;
	CellGrid.scrollCache = CellGrid.createScrollCache(CellGrid.bmBankScroll,
		ASCII_Characters.CHAR_WIDTH, ASCII_Characters.CHAR_HEIGHT16,
		zzt.sShadowColor, zzt.sBGColor, zzt.sBorderColor);
};

static setScrollColors(colBorder, colShadow, colBG, colText, colCenterText, colButton, colArrow) {
	// Frame colors
	var idx = colBorder * 3;
	zzt.sBorderColor = zzt.mg.colors16[idx + 0] | zzt.mg.colors16[idx + 1] | zzt.mg.colors16[idx + 2];
	idx = colShadow * 3;
	zzt.sShadowColor = zzt.mg.colors16[idx + 0] | zzt.mg.colors16[idx + 1] | zzt.mg.colors16[idx + 2];
	idx = colBG * 3;
	zzt.sBGColor = zzt.mg.colors16[idx + 0] | zzt.mg.colors16[idx + 1] | zzt.mg.colors16[idx + 2];

	// Cell colors
	zzt.sTextColor = (colText & 15) + (colBG << 4);
	zzt.sCenterTextColor = (colCenterText & 15) + (colBG << 4);
	zzt.sButtonColor = (colButton & 15) + (colBG << 4);
	zzt.sArrowColor = (colArrow & 15) + (colBG << 4);

	// Update properties
	zzt.globalProps["SCRCOLBORDER"] = colBorder;
	zzt.globalProps["SCRCOLSHADOW"] = colShadow;
	zzt.globalProps["SCRCOLBG"] = colBG;
	zzt.globalProps["SCRCOLTEXT"] = colText;
	zzt.globalProps["SCRCOLCENTERTEXT"] = colCenterText;
	zzt.globalProps["SCRCOLBUTTON"] = colButton;
	zzt.globalProps["SCRCOLARROW"] = colArrow;
};

// Reposition scroll interface.
static setScrollMsgDims(cols, rows, doDraw=true) {
	// Actual number of columns needed includes 2 on each side (for frame),
	// plus 2 leading spaces (arrow and margin), plus 1 trailing space (arrow).
	var actualColsNeeded = 2 + 2 + cols + 1 + 2;

	// Actual number of rows needed includes 3-line title+frame, and bottom frame.
	var actualRowsNeeded = 3 + rows + 1;

	// From new dimensions of scroll area, center at chosen spot.
	zzt.scrollArea.x = utils.int(zzt.scrollCenterX - actualColsNeeded / 2);
	zzt.scrollArea.y = utils.int(zzt.scrollCenterY - actualRowsNeeded / 2);

	// Position the corners as needed.
	zzt.scrollTitle.x = zzt.scrollArea.x + 2;
	zzt.scrollTitle.y = zzt.scrollArea.y + 1;
	zzt.scrollBody.x = zzt.scrollArea.x + 2;
	zzt.scrollBody.y = zzt.scrollArea.y + 3;

	// Now set the title grid and scroll grid to the
	// correct locations and dimensions.
	zzt.titleGrid.x = zzt.scrollTitle.x * CellGrid.charWidth;
	zzt.titleGrid.y = zzt.scrollTitle.y * CellGrid.charHeight;
	zzt.titleGrid.adjustVisiblePortion(actualColsNeeded - 4, 1);
	zzt.scrollGrid.x = zzt.scrollBody.x * CellGrid.charWidth;
	zzt.scrollGrid.y = zzt.scrollBody.y * CellGrid.charHeight;
	zzt.scrollGrid.adjustVisiblePortion(actualColsNeeded - 4, rows);

	if (!doDraw)
		return;

	// Draw the scroll frame.
	for (var i = 0; i < CellGrid.scrollFrameInfo.length; i++) {
		var info = CellGrid.scrollFrameInfo[i];
		var charCode = info[0];
		var color = info[1];
		var x = zzt.scrollTitle.x + info[2];
		var y = zzt.scrollTitle.y + info[3];
		var spanX = info[4];
		var spanY = info[5];

		if (CellGrid.scrollLegacyMode == 1)
		{
			// Ignore lowest drop-shadow for legacy mode
			if (i >= CellGrid.scrollFrameInfo.length - 2)
				continue;
		}

		// Adjust for locus
		switch (info[6]) {
			case 1:
				x += cols + 2;
			break;
			case 2:
				y += rows + 1;
			break;
			case 3:
				x += cols + 2;
				y += rows + 1;
			break;
		}

		// Adjust span
		if (spanX == 2)
			spanX = actualColsNeeded - 4;
		if (spanY == 3)
			spanY = rows;

		// Draw character over span.
		for (var sy = 0; sy < spanY; sy++) {
			for (var sx = 0; sx < spanX; sx++) {
				zzt.mg.setCellScrollFrame(x + sx, y + sy, charCode, color);
			}
		}
	}
};

static eraseScrollMsgDims(cols, rows) {
	var actualColsNeeded = 2 + 2 + cols + 1 + 2;
	var actualRowsNeeded = 3 + rows + 1;

	zzt.mg.redrawGrid(zzt.scrollArea.x, zzt.scrollArea.y,
		zzt.scrollArea.x + actualColsNeeded, zzt.scrollArea.y + actualRowsNeeded + 1);
}

static drawScrollMsgText(firstTime=false) {
	// Back up "current" index by half the size of the window.
	var backupLen = utils.int(zzt.msgScrollHeight/2);
	var curIndex = zzt.msgScrollIndex - backupLen;
	var changeTitle = false;

	// Draw each line.
	for (var cy = 0; cy < zzt.msgScrollHeight; cy++)
	{
		if (curIndex < -1 || curIndex > zzt.msgScrollText.length)
		{
			// Out of message boundaries; display blank line.
			zzt.scrollGrid.writeConst(0, cy, zzt.msgScrollWidth + 4, 1, " ", zzt.sTextColor);
		}
		else if (curIndex == -1 || curIndex == zzt.msgScrollText.length)
		{
			// On message boundaries; display dotted line.
			for (var cx = 0; cx < zzt.msgScrollWidth + 4; cx += 5)
			{
				zzt.scrollGrid.writeConst(cx, cy, zzt.msgScrollWidth, 1, " ", zzt.sTextColor);
				zzt.scrollGrid.setCell(cx+4, cy, 7, zzt.sTextColor);
			}
		}
		else
		{
			// Within message.  Check if special formatting is present.
			var fmt = zzt.msgScrollFormats[curIndex];
			var txt = zzt.msgScrollText[curIndex];
			var lineLen = txt.length;
			if (fmt == "")
			{
				// No formatting; display ordinary line.
				zzt.scrollGrid.writeStr(0, cy, "  " + txt, zzt.sTextColor);

				// Erase rest of line
				zzt.scrollGrid.writeConst(2+lineLen, cy,
				zzt.msgScrollWidth-lineLen+1, 1, " ", zzt.sTextColor);
			}
			else if (fmt == "$")
			{
				// Centered text; display white line with leading spaces.
				var leadingSpaces = utils.int((zzt.msgScrollWidth/2) - (lineLen/2));
				while (leadingSpaces-- > 0)
					txt = " " + txt;
				lineLen = txt.length;

				zzt.scrollGrid.writeStr(0, cy, "  " + txt, zzt.sCenterTextColor);

				// Erase rest of line
				zzt.scrollGrid.writeConst(2+lineLen, cy,
				zzt.msgScrollWidth-lineLen+1, 1, " ", zzt.sCenterTextColor);
			}
			else
			{
				// Link; display link button and line.
				zzt.scrollGrid.writeConst(0, cy, 8, 1, " ", zzt.sCenterTextColor);
				zzt.scrollGrid.setCell(2+2, cy, 16, zzt.sButtonColor);
				zzt.scrollGrid.writeStr(2+5, cy, txt, zzt.sCenterTextColor);

				// Erase rest of line
				zzt.scrollGrid.writeConst(2+5+lineLen, cy,
				zzt.msgScrollWidth-lineLen-5+1, 1, " ", zzt.sCenterTextColor);

				// Signal to change title bar if link at cursor
				if (zzt.msgScrollIndex + zzt.mouseScrollOffset == curIndex)
					changeTitle = true;
			}
		}

		curIndex++;
	}

	// Draw cursor arrows (always visible).
	zzt.scrollGrid.writeConst(0, 0, 1, zzt.msgScrollHeight, " ", zzt.sArrowColor);
	zzt.scrollGrid.setCell(0, backupLen + zzt.mouseScrollOffset, 175, zzt.sArrowColor);
	zzt.scrollGrid.setCell(2+zzt.msgScrollWidth, backupLen + zzt.mouseScrollOffset, 174, zzt.sArrowColor);

	// Set title based on context.
	var titleText = "Interaction";
	if (changeTitle) // Link at cursor
		titleText = "<< Press ENTER to select this >>";
	else if (zzt.msgScrollObjName != "") // Object name specified
		titleText = zzt.msgScrollObjName;

	// Erase title line and redraw.
	if (!firstTime)
	{
		zzt.titleGrid.writeConst(0, 0, zzt.msgScrollWidth + 3, 1, " ", zzt.sTextColor);
		cx = utils.int(zzt.msgScrollWidth/2 - titleText.length/2);
		zzt.titleGrid.writeStr(2+cx, 0, titleText, zzt.sTextColor);
	}
};

static snapshotRestoreScroll(allowWorldRestore) {
	zzt.numTextLines = 0;
	zzt.msgScrollFormats = [];
	zzt.msgScrollText = [];
	zzt.msgScrollIsRestore = true;

	// World restore link
	if (allowWorldRestore)
	{
		zzt.addMsgLine("0", "Restore from SAV file");
		zzt.addMsgLine("$", "---------------------");
	}

	// Snapshot restore links
	var n = 1;
	for (var i = ZZTLoader.saveStates.length - 1; i >= 0; i--) {
		// Get genuine, deliberate save states (not bases or incidentals).
		var sState = ZZTLoader.saveStates[i];
		if (sState.saveType >= 0)
		{
			var btnText = ZZTLoader.sStateDesc[sState.saveType] + " : " + sState.saveStamp;
			zzt.addMsgLine(n.toString(), btnText);
			n++;
		}
	}

	// Initiate scroll
	zzt.ScrollMsg("Restore Game");
};

static zipContentsScroll() {
	zzt.numTextLines = 0;
	zzt.msgScrollFormats = [];
	zzt.msgScrollText = [];
	zzt.msgScrollFiles = true;
	zzt.modeWhenBrowserClosed = zzt.MTRANS_NORM;

	// ZIP file links
	var subDirFiles = parse.zipData.fileNames;
	for (var i = 0; i < subDirFiles.length; i++) {
		// Display file link
		var btnText = subDirFiles[i];
		zzt.addMsgLine(i.toString(), btnText);
	}

	// Initiate scroll
	zzt.ScrollMsg("Contents of ZIP file");
};

static wadContentsScroll() {
	zzt.numTextLines = 0;
	zzt.msgScrollFormats = [];
	zzt.msgScrollText = [];
	zzt.msgScrollFiles = true;

	// WAD embedded file links
	var subDirFiles = Lump.getEmbeddedFileNames(parse.lumpData, parse.fileData);
	for (var i = 0; i < subDirFiles.length; i++) {
		// Display file link
		var btnText = subDirFiles[i];
		zzt.addMsgLine(i.toString(), btnText);
	}

	// Initiate scroll
	zzt.ScrollMsg("Contents of WAD");
};

static displayFileLink(fileName) {
	if (!utils.endswith(fileName, ".HLP"))
	{
		// In case file link identified in scroll is not HLP,
		// show the text browser instead.
		if (zzt.fileSystemType == zzt.FST_ZIP)
		{
			parse.fileData = parse.zipData.getFileByName(fileName);
			zzt.displayFileBrowser(fileName);
		}
		else
		{
			zzt.mainMode = zzt.MODE_NORM;
			parse.loadRemoteFile(fileName, zzt.MODE_LOADFILEBROWSER);
		}
	}
	else
	{
		// Compile the file link code, UNLESS it is already being browsed.
		if (zzt.fileLinkName != fileName)
		{
			if (zzt.fileSystemType == zzt.FST_ZIP)
			{
				parse.fileData = parse.zipData.getFileByName(fileName);
				zzt.launchFileLinkScroll(fileName);
			}
			else
				parse.loadRemoteFile(fileName, zzt.MODE_LOADFILELINK);
		}
		else
			zzt.launchFileLinkScroll(fileName);
	}
};

static launchFileLinkScroll(fileName) {
	if (zzt.fileLinkName != fileName)
	{
		// If file link chained from one file to another (an unusual case),
		// remove the old file code.
		if (zzt.fileLinkName != "")
		{
			zzt.fileLinkName = "";
			interp.codeBlocks.pop();
		}

		// File has not been loaded yet; compile custom code.
		var eInfo = zzt.typeList[zzt.fileLinkType];
		var codeStr =
			ZZTLoader.readExtendedASCIIString(parse.fileData, parse.fileData.length);

		var newCodeId = zzt.compileCustomCode(eInfo, codeStr, "\n");
		var numPrefix = eInfo.NUMBER.toString() + "\n";

		interp.fileLinkSE = new SE(zzt.fileLinkType, 0, 0, 0, true);
		interp.fileLinkSE.extra["CODEID"] = newCodeId;
		zzt.fileLinkName = fileName;
	}

	// Scroll is generated by simply dispatching a message to the type.
	zzt.mainMode = zzt.MODE_NORM;
	interp.briefDispatch(0, interp.thisSE, interp.fileLinkSE);
};

static displayFileBrowser(fileName) {
	// Separate file data into text lines
	zzt.mainMode = zzt.MODE_FILEBROWSER;
	var b = parse.fileData;
	var bLimit = b.length;

	var lineLen = 0;
	zzt.textBrowserName = fileName;
	zzt.textBrowserSize = bLimit;
	zzt.textBrowserLines = [];
	for (var i = 0; i < bLimit; i++) {
		lineLen++;

		var val = b[i];
		if (val == 10 || lineLen >= 80 || i == bLimit - 1)
		{
			// Break the line; convert to text.
			b.position = i - lineLen + 1;
			var sLine = ZZTLoader.readExtendedASCIIString(b, lineLen);
			lineLen = 0;

			// Remove breaking characters.
			if (sLine.charCodeAt(sLine.length - 1) == 10)
				sLine = sLine.substr(0, sLine.length - 1);
			if (sLine.charCodeAt(sLine.length - 1) == 13)
				sLine = sLine.substr(0, sLine.length - 1);

			// Replace tab characters.
			sLine = sLine.replace("\t", "    ");

			zzt.textBrowserLines.push(sLine);
		}
	}

	// Show the interface
	zzt.drawFileBrowser();
};

static displayTextBrowser(titleMsg, displayedLines, modeWhenDone) {
	// Separate file data into text lines
	zzt.textBrowserName = titleMsg;
	zzt.textBrowserSize = displayedLines.length;
	zzt.textBrowserLines = displayedLines.split("\n");

	// Show the interface
	zzt.mainMode = zzt.MODE_FILEBROWSER;
	zzt.modeWhenBrowserClosed = modeWhenDone;
	zzt.drawFileBrowser();
};

static drawFileBrowser() {
	var fileLineColor = (4 * 16) + 15;
	var navLineColor = (4 * 16) + 15;
	var bodyLineColor = (1 * 16) + 15;

	// First line is taken up by filename and other information.
	zzt.fbg.writeConst(0, 0, 80, 1, " ", fileLineColor);
	zzt.fbg.writeStr(2, 0, zzt.textBrowserName, fileLineColor);
	zzt.fbg.writeStr(60, 0, "Size:  " + zzt.textBrowserSize.toString(), fileLineColor);

	// Last line is taken up by commands.
	zzt.fbg.writeConst(0, 24, 80, 1, " ", navLineColor);
	zzt.fbg.writeStr(2, 24,
		"Up/Down: Scroll    PgUp/PgDn: Page Scroll    Esc: Exit Browser", navLineColor);

	// Body occupies all other lines.
	zzt.fbg.writeConst(0, 1, 80, 23, " ", bodyLineColor);
	zzt.textBrowserCursor = -100000000;
	zzt.moveFileBrowser(0);
	zzt.fbg.visible = true;
};

static moveFileBrowser(newPos) {
	// Clip new cursor.
	var newBrowserCursor = newPos;
	if (newBrowserCursor >= zzt.textBrowserLines.length)
		newBrowserCursor = zzt.textBrowserLines.length - 1;
	if (newBrowserCursor < 0)
		newBrowserCursor = 0;

	// Shift browser by move delta.
	var y1 = 1;
	var y2 = 23;
	var moveDelta = utils.iabs(newBrowserCursor - zzt.textBrowserCursor);
	if (moveDelta <= 22)
	{
		if (newBrowserCursor > zzt.textBrowserCursor)
		{
			zzt.fbg.moveBlock(0, moveDelta+1, 79, 23, 0, -moveDelta);
			y1 = 24 - moveDelta;
			y2 = 23;
		}
		else if (newBrowserCursor < zzt.textBrowserCursor)
		{
			zzt.fbg.moveBlock(0, 1, 79, 23 - moveDelta, 0, moveDelta);
			y1 = 1;
			y2 = moveDelta;
		}
		else
		{
			y1 = 0;
			y2 = -1;
		}
	}

	// Fill in emptied lines.
	var bodyLineColor = (1 * 16) + 15;
	zzt.textBrowserCursor = newBrowserCursor;
	for (var y = y1; y <= y2; y++) {
		zzt.fbg.writeConst(0, y, 80, 1, " ", bodyLineColor);
		var lCursor = (y - 1) + zzt.textBrowserCursor;
		if (lCursor < zzt.textBrowserLines.length)
			zzt.fbg.writeStr(0, y, zzt.textBrowserLines[lCursor], bodyLineColor);
	}

	zzt.animFrameSelect(zzt.ANIM_FBG);
};

static dissolveViewport(modeWhenDone, time, toColor=-1) {
	zzt.transModeWhenDone = modeWhenDone;
	zzt.transColor = toColor;
	zzt.transProgress = SE.vpWidth * SE.vpHeight;
	zzt.transSquaresPerFrame = utils.int(Number(zzt.transProgress) / (time * 30));
	SE.uCameraX = -1000;
	SE.uCameraY = -1000;

	zzt.transCurFrame = 0;
	zzt.transFrameCount = 1;
	zzt.transBaseRate = zzt.TRANSITION_BASE_RATE;
	zzt.transLogTime = zzt.getTimer();
	zzt.mainMode = zzt.MODE_DISSOLVE;
	zzt.modeChanged = true;
};

static dissolveIter() {
	// Fetch dissolve "random list" array
	var dArray = utils.getDissolveArray(SE.vpWidth, SE.vpHeight);

	// For n squares for this iteration, select and replace.
	for (var i = 0; i < zzt.transSquaresPerFrame && zzt.transProgress > 0; i++)
	{
		var pos = dArray[--zzt.transProgress];
		var x = utils.int(pos % SE.vpWidth);
		var y = utils.int(pos / SE.vpWidth);

		if (zzt.transColor == -1)
			SE.displaySquare(SE.CameraX + x, SE.CameraY + y);
		else
			zzt.mg.setCell(SE.vpX0 + x - 1, SE.vpY0 + y - 1, 219, zzt.transColor);
	}

	if (zzt.transProgress <= 0)
	{
		zzt.mainMode = zzt.transModeWhenDone;
		if (zzt.transColor == -1)
		{
			// Viewport is now completely up-to-date.
			SE.uCameraX = SE.CameraX;
			SE.uCameraY = SE.CameraY;
		}
		return true;
	}

	zzt.animFrameSelect(zzt.ANIM_MG);
	return false;
};

static scrollTransitionViewport(modeWhenDone, time, toDir) {
	zzt.transModeWhenDone = modeWhenDone;
	zzt.transDX = -interp.getStepXFromDir4(toDir);
	zzt.transDY = -interp.getStepYFromDir4(toDir);
	if (zzt.transDX == 0)
		zzt.transExtent = SE.vpHeight;
	else
		zzt.transExtent = SE.vpWidth;
	zzt.transProgress2 = 0;
	zzt.transSquaresPerFrame2 = Number(zzt.transExtent) / (time * 30);
	SE.uCameraX = -1000;
	SE.uCameraY = -1000;

	zzt.transCurFrame = 0;
	zzt.transFrameCount = 1;
	zzt.transBaseRate = zzt.TRANSITION_BASE_RATE;
	zzt.transLogTime = zzt.getTimer();
	zzt.mainMode = zzt.MODE_SCROLLMOVE;
	zzt.modeChanged = true;
};

static scrollTransitionIter() {
	// For n squares for this iteration, copy lines and insert new ones.
	var intTransSquares = utils.int(zzt.transProgress2 + zzt.transSquaresPerFrame2) - utils.int(zzt.transProgress2);
	zzt.transProgress2 += zzt.transSquaresPerFrame2;
	zzt.transProgress = utils.int(zzt.transProgress2);
	var writeX1 = 0;
	var writeY1 = 0;
	var writeX2 = SE.vpWidth - 1;
	var writeY2 = SE.vpHeight - 1;
	var copyX1 = writeX1;
	var copyY1 = writeY1;
	var copyX2 = writeX2;
	var copyY2 = writeY2;
	var copyDX = zzt.transDX * intTransSquares;
	var copyDY = zzt.transDY * intTransSquares;
	var scrollOffsetX = 0;
	var scrollOffsetY = 0;
	var result = false;

	if (zzt.transProgress >= zzt.transExtent)
	{
		// Done.  Update entire viewport; don't move anything.
		copyDX = 0;
		copyDY = 0;
		copyY2 = copyY1 - 1;
		zzt.transProgress = zzt.transExtent;
		zzt.mainMode = zzt.transModeWhenDone;

		// Viewport is now completely up-to-date.
		SE.uCameraX = SE.CameraX;
		SE.uCameraY = SE.CameraY;
		result = true;
	}
	else if (zzt.transDX == 0)
	{
		if (zzt.transDY < 0)
		{
			copyY1 -= copyDY;
			writeY1 = writeY2 + copyDY + 1;
			scrollOffsetY = -(zzt.transExtent - zzt.transProgress);
		}
		else
		{
			copyY2 -= copyDY;
			writeY2 = writeY1 + copyDY - 1;
			scrollOffsetY = (zzt.transExtent - zzt.transProgress);
		}
	}
	else
	{
		if (zzt.transDX < 0)
		{
			copyX1 -= copyDX;
			writeX1 = writeX2 + copyDX + 1;
			scrollOffsetX = -(zzt.transExtent - zzt.transProgress);
		}
		else
		{
			copyX2 -= copyDX;
			writeX2 = writeX1 + copyDX - 1;
			scrollOffsetX = (zzt.transExtent - zzt.transProgress);
		}
	}

	// Conduct move.
	if (zzt.transProgress < zzt.transExtent)
		zzt.mg.moveBlock(copyX1+SE.vpX0-1, copyY1+SE.vpY0-1, copyX2+SE.vpX0-1, copyY2+SE.vpY0-1,
			copyDX, copyDY);

	// Conduct redraw.
	var oldCameraX = SE.CameraX;
	var oldCameraY = SE.CameraY;
	SE.CameraX += scrollOffsetX;
	SE.CameraY += scrollOffsetY;
	for (var y = writeY1; y <= writeY2; y++)
	{
		for (var x = writeX1; x <= writeX2; x++)
		{
			SE.displaySquare(SE.CameraX + x, SE.CameraY + y);
		}
	}
	SE.CameraX = oldCameraX;
	SE.CameraY = oldCameraY;

	zzt.animFrameSelect(zzt.ANIM_MG);
	return result;
};

static fadeToColorSingle(modeWhenDone, time, red, green, blue) {
	var seq = [];
	for (var n = 0; n < 16; n++) {
		seq.push(red);
		seq.push(green);
		seq.push(blue);
	}

	zzt.fadeToColorBlock(modeWhenDone, time, 0, 16, 255, seq);
};

static fadeToColorBlock(modeWhenDone, time, startIdx, numIdx, extent, fadeSeq) {

	// Ensure that extent is out of 255
	zzt.transPaletteFinal = fadeSeq;
	for (var n = 0; n < fadeSeq.length; n++) {
		fadeSeq[n] = utils.int(fadeSeq[n] * 255 / extent);
	}

	// Transition variables
	zzt.transPaletteCur = zzt.mg.getPaletteColors();
	zzt.transPaletteDelta = [];
	for (n = 0; n < fadeSeq.length; n++) {
		zzt.transPaletteCur[n] = Number(zzt.transPaletteCur[n + (startIdx * 3)]);
		zzt.transPaletteDelta.push(
			Number(fadeSeq[n] - zzt.transPaletteCur[n]) / 255.0);
	}

	zzt.transPaletteStartIdx = startIdx;
	zzt.transPaletteNumIdx = numIdx;
	zzt.transModeWhenDone = modeWhenDone;
	zzt.transExtent = 256;
	zzt.transProgress = 0;
	zzt.transSquaresPerFrame = Number(zzt.transExtent) / (time * 30);

	zzt.transCurFrame = 0;
	zzt.transFrameCount = 1;
	zzt.transBaseRate = zzt.TRANSITION_BASE_RATE;
	zzt.transLogTime = zzt.getTimer();
	zzt.mainMode = zzt.MODE_FADETOBLOCK;
	zzt.modeChanged = true;
};

static fadeTransitionIter() {
	zzt.transProgress += zzt.transSquaresPerFrame;
	if (zzt.transProgress >= zzt.transExtent)
	{
		// Palette is now 100% at target.
		zzt.mg.setPaletteColors(zzt.transPaletteStartIdx, zzt.transPaletteNumIdx, 255, zzt.transPaletteFinal);
		zzt.mainMode = zzt.transModeWhenDone;
		return true;
	}

	// Iterate palette entries
	var newSeq = [];
	for (var n = 0; n < zzt.transPaletteCur.length; n++) {
		zzt.transPaletteCur[n] += zzt.transPaletteDelta[n] * Number(zzt.transSquaresPerFrame);
		newSeq.push(utils.int(zzt.transPaletteCur[n]));
	}

	// Update palette
	zzt.mg.setPaletteColors(zzt.transPaletteStartIdx, zzt.transPaletteNumIdx, 255, newSeq);
	zzt.animFrameSelect(zzt.ANIM_MG);
	return false;
};

// Show large TEXTAREA interface.
static showPropTextView(propMode, title, text) {
	// Set text in properties entry view
	zzt.mg.writeStr(0, 0, "  " + title + "      (Esc:  Close)  ", 15);
	zzt.guiPropText.hidden = false;
	zzt.guiPropText.value = text;
	zzt.animFrameSelect(zzt.ANIM_MG);

	// Prepare for property text showing
	zzt.modeForPropText = propMode;
	zzt.mainMode = zzt.MODE_WAITUNTILPROP;
	zzt.propTextDelay = 3;
};

// Hide large TEXTAREA interface.
static hidePropTextView(newMode) {
	zzt.guiPropText.hidden = true;
	zzt.toastTempGridHide = false;

	// Erase top line
	for (var x = 1; x <= zzt.CHARS_WIDTH; x++) {
		zzt.displayGuiSquare(x, 1);
	}

	zzt.mainMode = newMode;
};

static dispatchInputMessage(msg) {
	// Certain GUIs are handled internally.
	if (zzt.inEditor)
	{
		editor.dispatchEditorMenu(msg);
		return;
	}
	else if (msg == "EVENT_EDITOR")
	{
		for (var i = 0; i <= 16; i++)
			Sounds.stopChannel(i);

		zzt.inEditor = true;
		zzt.highScoresLoaded = false;
		zzt.establishGui(zzt.prefEditorGui);
		zzt.activeObjs = false;
		zzt.mainMode = zzt.MODE_NORM;
		ZZTLoader.wipeBoardZero();
		ZZTLoader.updateContFromBoard(0, ZZTLoader.boardData[0]);
		interp.dispatchToMainLabel("SETLINECHARS");
		zzt.globalProps["OVERLAYSCROLL"] = 1;
		if (zzt.globalProps["BOARD"] == -1)
			zzt.globalProps["BOARD"] = 0;
		zzt.globals["$PLAYERMODE"] = 5; // "ZZT editor screen" mode
		SE.CameraX = 1;
		SE.CameraY = 1;
		editor.bgColorCursor = 0;
		editor.hexTextEntry = 0;
		editor.boardWidth = zzt.boardProps["SIZEX"];
		editor.boardHeight = zzt.boardProps["SIZEY"];
		editor.forceCodeStrAll();
		editor.modFlag = false;
		editor.initEditor();
		editor.updateEditorView();
	}

	switch (zzt.thisGuiName) {
		case "DEBUGMENU":
			zzt.dispatchDebugMenu(msg);
		break;
		case "OPTIONSGUI":
			zzt.dispatchOptionsGuiMenu(msg);
		break;
		case "OPTIONSEDITGUI":
			zzt.dispatchOptionsEditGuiMenu(msg);
		break;
		case "CONSOLEGUI":
			zzt.dispatchConsoleGuiMenu(msg);
		break;
		case "EDITGUI":
			editor.dispatchEditGuiMenu(msg);
		break;
		case "EDITGUITEXT":
			editor.dispatchEditGuiTextMenu(msg);
		break;
		default:
			// The main type code receives the message.
			interp.dispatchToMainLabel(msg);
		break;
	}
};

static dispatchDebugMenu(msg) {
	var req;
	switch (msg) {
		case "EVENT_LOADDEP":
			zzt.loadDeployedFile(zzt.MODE_NORM);
		break;
		case "EVENT_LOADZZT":
			zzt.highScoreServer = false;
			parse.loadLocalFile("ZZT", zzt.MODE_NATIVELOADZZT);
		break;
		case "EVENT_LOADSZT":
			zzt.highScoreServer = false;
			parse.loadLocalFile("SZT", zzt.MODE_NATIVELOADSZT);
		break;
		case "EVENT_LOADWAD":
			zzt.highScoreServer = false;
			parse.loadLocalFile("WAD", zzt.MODE_LOADWAD);
		break;
		case "EVENT_LOADZIP":
			zzt.highScoreServer = false;
			parse.loadLocalFile("ZIP", zzt.MODE_LOADZIP);
		break;
		case "EVENT_OPTIONS":
			zzt.establishGui("OPTIONSGUI");
			editor.propText = "{\n}";
			zzt.mainMode = zzt.MODE_NORM;
			zzt.drawGui();
			zzt.drawGuiLabel("CONFIGTYPE", zzt.configTypeNames[zzt.configType]);
			zzt.guiStack.push("OPTIONSGUI");
		break;
		case "EVENT_EDITGUI":
			if (zzt.establishGui("EDITGUI"))
			{
				editor.modFlag = false;
				editor.propText = editor.emptyGuiProperties;
				zzt.mainMode = zzt.MODE_NORM;
				zzt.mg.writeConst(0, 0, zzt.OverallSizeX, zzt.OverallSizeY, " ", 31);
				zzt.drawGui();
				editor.writeColorCursors();
				zzt.guiStack.push("EDITGUI");
			}
		break;
		case "EVENT_LOADFEATURED":
			zzt.launchDeployedFileIfPresent(zzt.featuredWorldFile);
		break;
		case "EVENT_VISITWEBSITE":
			parse.blankPage("");
		break;
		case "EVENT_DOCUMENTATION":
			parse.blankPage("editors.html#editors");
		break;
	}

	interp.dispatchToMainLabel(msg);
};

static setConfigType(cType) {
	zzt.configType = cType;

	ZZTProp.overridePropsGenModern["CONFIGTYPE"] = cType;
	ZZTProp.overridePropsGenClassic["CONFIGTYPE"] = cType;

	if (cType == 0)
		ZZTProp.overridePropsGeneral = ZZTProp.overridePropsGenModern;
	else
		ZZTProp.overridePropsGeneral = ZZTProp.overridePropsGenClassic;
};

static dispatchOptionsGuiMenu(msg) {
	var jObj;
	var k;
	switch (msg) {
		case "OPT_QUIT":
			// Update shared objects
			zzt.saveSharedObjCont("CFGMODERN", ZZTProp.overridePropsGenModern);
			zzt.saveSharedObjCont("CFGCLASSIC", ZZTProp.overridePropsGenClassic);
			zzt.saveSharedObjCont("CFGZZTSPEC", ZZTProp.overridePropsZZT);
			zzt.saveSharedObjCont("CFGSZTSPEC", ZZTProp.overridePropsSZT);

			// Return to main menu
			zzt.mainMode = zzt.MODE_NORM;
			zzt.popGui();
		break;
		case "OPT_RESET":
			ZZTProp.setOverridePropDefaults();
			zzt.setConfigType(zzt.configType);
			zzt.drawGuiLabel("CONFIGTYPE", zzt.configTypeNames[zzt.configType]);
			zzt.Toast("All properties reset to defaults.", 1.0);
		break;
		case "OPT_CONFIG":
			zzt.configType = (zzt.configType + 1) & 1;
			zzt.setConfigType(zzt.configType);
			zzt.drawGuiLabel("CONFIGTYPE", zzt.configTypeNames[zzt.configType]);
		break;
		case "EVENT_ACCEPTPROP":
			// Parse properties text.
			jObj = parse.jsonDecode(zzt.guiPropText.value);
			if (jObj != null)
			{
				if (zzt.generalSubset)
				{
					// Edit subset of general properties
					for (k in jObj)
						ZZTProp.overridePropsGeneral[k] = jObj[k];
				}
				else
				{
					// Get properties text; replace entire dictionary with updates
					for (k in zzt.propDictToUpdate)
						delete zzt.propDictToUpdate[k];
					for (k in jObj)
						zzt.propDictToUpdate[k] = jObj[k];
				}

				// Hide properties editor.
				zzt.hidePropTextView(zzt.MODE_NORM);
				zzt.drawGuiLabel("CONFIGTYPE", zzt.configTypeNames[zzt.configType]);
			}
		break;
		default:
			if (utils.startswith(msg, "OPT_"))
			zzt.showOptionsForDict(msg);
		break;
	}

	interp.dispatchToMainLabel(msg);
};

static showOptionsForDict(msg) {
	var oTitle = "Options";
	var subsetStr;

	zzt.generalSubset = false;
	zzt.propSubset = {};
	zzt.propDictToUpdate = zzt.propSubset;

	switch (msg) {
		case "OPT_GENERAL":
			zzt.propDictToUpdate = ZZTProp.overridePropsGeneral;
			oTitle = "General Options";
			zzt.showPropTextView(zzt.MODE_ENTEROPTIONSPROP, oTitle, 
			parse.jsonToText(zzt.propDictToUpdate, true));
		break;
		case "OPT_ZZT":
			zzt.propDictToUpdate = ZZTProp.overridePropsZZT;
			oTitle = "ZZT-specific Options";
			zzt.showOptionsEditView(oTitle, msg.substr(4));
		break;
		case "OPT_SZT":
			zzt.propDictToUpdate = ZZTProp.overridePropsSZT;
			oTitle = "SZT-specific Options";
			zzt.showOptionsEditView(oTitle, msg.substr(4));
		break;
		default:
			subsetStr = msg.substr(4);
			if (ZZTProp.propSubsets.hasOwnProperty(subsetStr))
			{
				zzt.generalSubset = true;
				for (var i = 0; i < ZZTProp.propSubsets[subsetStr].length; i++) {
					var s = ZZTProp.propSubsets[subsetStr][i];
					zzt.propDictToUpdate[s] = ZZTProp.overridePropsGeneral[s];
				}

				oTitle = ZZTProp.propSubsetNames[subsetStr] + " Options";
				zzt.showOptionsEditView(oTitle, subsetStr);
			}
		break;
	}
};

static showOptionsEditView(title, subsetName) {
	// Set up options edit GUI view
	zzt.establishGui("OPTIONSEDITGUI");
	zzt.mainMode = zzt.MODE_NORM;
	zzt.drawGui();

	// Draw labels
	zzt.drawGuiLabel("CONFIGTYPE", zzt.configTypeNames[zzt.configType]);
	zzt.drawGuiLabel("PROPTITLE", title);

	// Draw property names
	zzt.aSubsetName = subsetName;
	var myPropNames = ZZTProp.propSubsets[zzt.aSubsetName];
	for (var i = 0; i < myPropNames.length; i++)
		zzt.mg.writeStr(36-1, i + 5-1, myPropNames[i], 31);

	// Draw cursor, values, and description
	zzt.optCursor = 1;
	zzt.dispatchOptionsEditGuiMenu("OPT_UP");
};

static dispatchOptionsEditGuiMenu(msg) {
	// Erase cursor
	zzt.mg.writeStr(34-1, zzt.optCursor + 5-1, " ", 31);
	var myPropNames = ZZTProp.propSubsets[zzt.aSubsetName];
	var curPropName = myPropNames[zzt.optCursor];

	switch (msg) {
		case "OPT_QUIT":
			// Go back to OPTIONSGUI
			zzt.establishGui("OPTIONSGUI");
			zzt.mainMode = zzt.MODE_NORM;
			zzt.drawGui();
			zzt.drawGuiLabel("CONFIGTYPE", zzt.configTypeNames[zzt.configType]);
		return;
		case "OPT_UP":
			if (--zzt.optCursor < 0)
			zzt.optCursor = myPropNames.length - 1;
		break;
		case "OPT_DOWN":
			if (++zzt.optCursor >= myPropNames.length)
			zzt.optCursor = 0;
		break;
		case "OPT_EDIT":
			// Bring up single-line property text box.
			zzt.GuiLabels["PROPVALUE1"][0] = 61;
			zzt.GuiLabels["PROPVALUE1"][1] = zzt.optCursor + 5;
			zzt.textEntry("PROPVALUE1", zzt.propDictToUpdate[curPropName].toString(), 20, 14,
				"OPT_TE_ACCEPT", "OPT_TE_REJECT");
		return;
		case "OPT_TE_REJECT":
			// No update; just redraw.
		break;
		case "OPT_TE_ACCEPT":
			// Update property.
			if (utils.isInt(zzt.propDictToUpdate[curPropName]))
				zzt.propDictToUpdate[curPropName] = utils.int0(zzt.globals["$TEXTRESULT"]);
			else
				zzt.propDictToUpdate[curPropName] = zzt.globals["$TEXTRESULT"].toString();

			if (zzt.generalSubset)
				ZZTProp.overridePropsGeneral[curPropName] = zzt.propDictToUpdate[curPropName];
		break;
	}

	// Write cursor
	zzt.mg.setCell(34-1, zzt.optCursor + 5-1, 16, 29);

	// Draw property values
	for (var i = 0; i < myPropNames.length; i++)
		zzt.mg.writeStr(61-1, i + 5-1,
	zzt.propDictToUpdate[myPropNames[i]].toString(), 30);

	// Draw description of current property
	curPropName = myPropNames[zzt.optCursor];
	var propStr = "";
		if (ZZTProp.propDesc.hasOwnProperty(curPropName))
	propStr = ZZTProp.propDesc[curPropName];

	zzt.eraseGuiLabel("PROPDESC");
	zzt.drawGuiLabel("PROPDESC", propStr);

	interp.dispatchToMainLabel(msg);
};

static dispatchConsoleGuiMenu(msg) {
	var jObj;
	var k;
	switch (msg) {
		case "CON_BOARDPROP":
			// Show properties editor.
			if (zzt.CHEATING_DISABLES_PROGRESS)
				zzt.DISABLE_HISCORE = 1;
			zzt.propDictToUpdate = zzt.boardProps;
			zzt.showPropTextView(zzt.MODE_ENTERCONSOLEPROP, "Board Properties",
			parse.jsonToText(zzt.propDictToUpdate, true));
		break;
		case "CON_WORLDPROP":
			// Show properties editor.
			if (zzt.CHEATING_DISABLES_PROGRESS)
				zzt.DISABLE_HISCORE = 1;
			zzt.propDictToUpdate = zzt.globalProps;
			zzt.showPropTextView(zzt.MODE_ENTERCONSOLEPROP, "World Properties",
			parse.jsonToText(zzt.propDictToUpdate, true));
		break;
		case "CON_GLOBALVAR":
			// Show properties editor.
			if (zzt.CHEATING_DISABLES_PROGRESS)
				zzt.DISABLE_HISCORE = 1;
			zzt.propDictToUpdate = zzt.globals;
			zzt.showPropTextView(zzt.MODE_ENTERCONSOLEPROP, "Global Variables",
			parse.jsonToText(zzt.propDictToUpdate, true));
		break;
		case "CON_CHEAT":
			if (zzt.CHEATING_DISABLES_PROGRESS)
				zzt.DISABLE_HISCORE = 1;
			zzt.textEntry("CONFMESSAGE", "", 60, 15, "CHEATACTION", "NOACTION");
		break;
		case "EVENT_ACCEPTPROP":
			// Parse properties text.
			jObj = parse.jsonDecode(zzt.guiPropText.value);
			if (jObj != null)
			{
				// Get properties text; hide properties editor.
				for (k in zzt.propDictToUpdate)
					delete zzt.propDictToUpdate[k];
				for (k in jObj)
					zzt.propDictToUpdate[k] = jObj[k];

				zzt.hidePropTextView(zzt.MODE_NORM);
			}
		break;
	}

	interp.dispatchToMainLabel(msg);
};

static drawLoadingAnimation() {
	if (++zzt.loadAnimColor > 15)
		zzt.loadAnimColor = 9;

	zzt.loadAnimPos = (zzt.loadAnimPos - 1) & 3;
	var loadAnimStr = "";
	switch (zzt.loadAnimPos) {
		case 0:
			loadAnimStr = "*...|";
		break;
		case 1:
			loadAnimStr = ".*..\\";
		break;
		case 2:
			loadAnimStr = "..*.-";
		break;
		case 3:
			loadAnimStr = "...*/";
		break;
	}

	zzt.drawGuiLabel("LOADINGLOC", "Loading");
	zzt.drawGuiLabel("LOADINGANIM", loadAnimStr, zzt.loadAnimColor + 16);
};

// High score storage script processing.
static parseHighScores() {
	var b = parse.fileData;
	var s = b.readUTFBytes(b.length);
	var us = s.toUpperCase();

	var bound1 = us.indexOf("<PRE>");
	var bound2 = us.indexOf("</PRE>");
	if (bound1 != -1 && bound2 != -1)
		s = s.substring(bound1 + 5, bound2); // Inside PRE tag

	var resultLines = [];
	var lines = s.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var ls = lines[i];
		if (utils.endswith(ls, "\r"))
			ls = ls.substr(0, ls.length - 1);

		var l = ls.split(",");
		if (l.length >= 3)
			resultLines.push(l);
	}

	if (resultLines.length > 0)
	{
		zzt.highScores = resultLines;
		zzt.highScoresLoaded = true;
	}
	else
		zzt.highScoresLoaded = false;
};

static processLoadingSuccessModes() {
	var i;

	switch (zzt.mainMode) {
		case zzt.MODE_LOADMAIN:
			// This is executed on successful load of main GUI file.
			zzt.mainMode = zzt.MODE_SETUPMAIN;
			zzt.origGuiStorage = parse.jsonObj;
			zzt.resetGuis();
			if (zzt.establishGui("DEBUGMENU"))
			{
				// GUI successfully established for main menu; set up and draw.
				zzt.mainMode = zzt.MODE_NORM;
				zzt.drawGui();

				// Load main OOP definition file
				parse.loadTextFile(zzt.GUIS_PREFIX + "zzt_objs.txt", zzt.MODE_LOADDEFAULTOOP);
			}
		break;
		case zzt.MODE_LOADDEFAULTOOP:
			// This is executed on successful load of default OOP definition file.
			zzt.mainMode = zzt.MODE_SETUPOOP;
			zzt.defsObj = parse.jsonObj;
			if (zzt.establishOOP())
			{
				// OOP successfully compiled and definitions established.
				zzt.mainMode = zzt.MODE_NORM;

				// Establish that there are no "valid" PWADs at the start.
				ZZTLoader.establishPWAD("n/a");

				// Set up deployment from INI file
				parse.loadTextFile(zzt.GUIS_PREFIX + "zzt_ini.txt", zzt.MODE_LOADINI);
			}
			else
			{
				// OOP compilation unsuccessful.
				zzt.mainMode = zzt.MODE_NORM;
			}
		break;
		case zzt.MODE_LOADINI:
			// This is executed on successful load of INI file.
			if (!zzt.establishINI())
			{
				zzt.mainMode = zzt.MODE_AUTOSTART;
				parse.loadingSuccess = true;
			}
		break;
		case zzt.MODE_LOADINDEXPATHS:
			// Index path was loaded; add resulting paths to deployment.
			if (!zzt.addIndexPaths())
			{
				zzt.mainMode = zzt.MODE_AUTOSTART;
				parse.loadingSuccess = true;
			}
		break;
		case zzt.MODE_AUTOSTART:
			// Auto-start behavior obeys configuration params.
			if (zzt.globalProps["DEP_STARTUPGUI"] != "DEBUGMENU")
			{
				// Replace startup GUI (experts only!)
				zzt.establishGui(zzt.globalProps["DEP_STARTUPGUI"])
				zzt.drawGui();
				zzt.guiStack.pop();
				zzt.guiStack.push(zzt.globalProps["DEP_STARTUPGUI"]);
			}

			// Initiate startup file, if there is one
			if (zzt.globalProps["DEP_STARTUPFILE"] == "")
			{
				zzt.drawGuiLabel("CUSTOMTEXT", zzt.featuredWorldName);
				zzt.mainMode = zzt.MODE_NORM;
			}
			else
			{
				zzt.featuredWorldFile = zzt.globalProps["DEP_STARTUPFILE"];
				zzt.featuredWorldName = utils.namePartOfFile(zzt.featuredWorldFile);
				zzt.drawGuiLabel("CUSTOMTEXT", zzt.featuredWorldName);
				zzt.launchDeployedFile(zzt.featuredWorldFile);
			}
		break;

		case zzt.MODE_PATCHLOADZZT:
		case zzt.MODE_PATCHLOADSZT:
		case zzt.MODE_PATCHLOADWAD:
			if (!ZZTLoader.registerPWADFile(parse.fileData, parse.pwadKey))
			{
				// Failed to load--assume blank.
				ZZTLoader.pwads[parse.pwadKey] = "";
			}

			zzt.mainMode = zzt.MODE_LOADZZT + (zzt.mainMode - zzt.MODE_PATCHLOADZZT);
			parse.fileData = parse.origFileData;
			parse.lastFileName = parse.origLastFileName;
			parse.loadingSuccess = true;
		break;

		case zzt.MODE_NATIVELOADZZT:
			// No file system; just ZZT file.
			zzt.fileSystemType = zzt.FST_NONE;
			zzt.mainMode = zzt.MODE_LOADZZT;
		case zzt.MODE_LOADZZT:
			zzt.mainMode = zzt.MODE_SETUPZZT;
			if (!ZZTLoader.pwadIsLoaded(zzt.pwadIndex, parse.lastFileName) && !zzt.inEditor)
			{
				if (parse.pwadLoad(zzt.pwadIndex, zzt.MODE_PATCHLOADZZT))
					break;
			}

			zzt.highScoresLoaded = false;
			zzt.resetGuis();
			zzt.modeWhenBrowserClosed = zzt.MTRANS_NORM;
			if (ZZTLoader.establishZZTFile(parse.fileData))
			{
				// Successful establishment; load title screen.
				if (!zzt.inEditor)
				{
					// Apply scanline mod if set
					if (CellGrid.scanlineMode != zzt.globalProps["SCANLINES"])
					{
						zzt.mg.updateScanlineMode(zzt.globalProps["SCANLINES"]);
						zzt.cellYDiv = 16;
					}

					zzt.establishGui("ZZTTITLE");
					zzt.drawGui();
					zzt.drawGuiLabel("WORLDNAME", zzt.globalProps["WORLDNAME"]);
					zzt.drawPen("SPEEDCURSOR", 0, 8, zzt.globalProps["GAMESPEED"], 31, 31);
				}

				if (zzt.inEditor)
				{
					ZZTLoader.updateContFromBoard(0, ZZTLoader.boardData[0]);
					zzt.globals["$PLAYERMODE"] = 5; // "Editor" mode
					zzt.globalProps["OVERLAYSCROLL"] = 1;
				}
				else
				{
					ZZTLoader.switchBoard(0);
					zzt.globals["$PLAYERMODE"] = 3; // "ZZT title screen" mode
				}

				zzt.globalProps["EVERPLAYED"] = 0;
				zzt.globals["$ALLPUSH"] = 0;
				zzt.globals["$PLAYERPAUSED"] = 0;
				zzt.globals["$PAUSECYCLE"] = 0;
				zzt.globals["$PASSAGEEMERGE"] = 0;
				zzt.globals["$LASTSAVESECS"] = 0;
				zzt.typeList[zzt.bearType].CHAR = 153;
				zzt.typeList[zzt.bearType].COLOR = 6;
				zzt.pMoveDir = -1;
				zzt.pShootDir = -1;

				if (zzt.inEditor)
				{
					zzt.mainMode = zzt.MODE_NORM;
					editor.modFlag = false;
					editor.boardWidth = zzt.boardProps["SIZEX"];
					editor.boardHeight = zzt.boardProps["SIZEY"];
					editor.editorCursorX = 1;
					editor.editorCursorY = 1;
					editor.forceCodeStrAll();
					interp.dispatchToMainLabel("SETLINECHARS");
					editor.updateEditorView(false);
					zzt.activeObjs = false;
				}
				else
				{
					interp.dispatchToMainLabel("$ONWORLDLOAD");
					zzt.dissolveViewport(zzt.MODE_NORM, 0.5, -1);
					zzt.activeObjs = true;
				}
			}
			else
				zzt.mainMode = zzt.MODE_NORM;
		break;
		case zzt.MODE_NATIVELOADSZT:
			// No file system; just SZT file.
			zzt.fileSystemType = zzt.FST_NONE;
			zzt.mainMode = zzt.MODE_LOADSZT;
		case zzt.MODE_LOADSZT:
			zzt.mainMode = zzt.MODE_SETUPSZT;
			if (!ZZTLoader.pwadIsLoaded(zzt.pwadIndex, parse.lastFileName) && !zzt.inEditor)
			{
				if (parse.pwadLoad(zzt.pwadIndex, zzt.MODE_PATCHLOADSZT))
					break;
			}

			zzt.highScoresLoaded = false;
			zzt.resetGuis();
			zzt.modeWhenBrowserClosed = zzt.MTRANS_NORM;
			if (ZZTLoader.establishZZTFile(parse.fileData))
			{
				// Successful establishment; load intro screen.
				if (!zzt.inEditor)
				{
					// Apply scanline mod if set
					if (CellGrid.scanlineMode != zzt.globalProps["SCANLINES"])
					{
						zzt.mg.updateScanlineMode(zzt.globalProps["SCANLINES"]);
						zzt.cellYDiv = 16;
					}

					if (zzt.globalProps["WORLDNAME"] == "FOREST")
						zzt.establishGui("FOREST");
					else if (zzt.globalProps["WORLDNAME"] == "PROVING")
						zzt.establishGui("PROVING");
					else if (zzt.globalProps["WORLDNAME"] == "MONSTER")
						zzt.establishGui("MONSTER");
					else
						zzt.establishGui("CUSTOMSZT");

					zzt.drawGui();
					if (zzt.thisGuiName == "CUSTOMSZT")
						zzt.drawGuiLabel("CUSTOMTEXT", zzt.globalProps["WORLDNAME"]);
				}

				if (zzt.inEditor)
				{
					ZZTLoader.updateContFromBoard(0, ZZTLoader.boardData[0]);
					zzt.globals["$PLAYERMODE"] = 1; // Normal mode
					zzt.globalProps["OVERLAYSCROLL"] = 1;
				}
				else
				{
					ZZTLoader.switchBoard(0);
					zzt.globals["$PLAYERMODE"] = 4; // "SZT title screen" mode
				}

				zzt.activeObjs = false;

				zzt.globalProps["EVERPLAYED"] = 0;
				zzt.globals["$_SZTTITLEGUI"] = zzt.thisGuiName;
				zzt.globals["$ALLPUSH"] = 0;
				zzt.globals["$PLAYERPAUSED"] = 0;
				zzt.globals["$PAUSECYCLE"] = 0;
				zzt.globals["$PASSAGEEMERGE"] = 0;
				zzt.globals["$LASTSAVESECS"] = 0;
				zzt.typeList[zzt.bearType].CHAR = 235;
				zzt.typeList[zzt.bearType].COLOR = 2;
				zzt.pMoveDir = -1;
				zzt.pShootDir = -1;

				if (zzt.inEditor)
				{
					zzt.mainMode = zzt.MODE_NORM;
					editor.modFlag = false;
					editor.boardWidth = zzt.boardProps["SIZEX"];
					editor.boardHeight = zzt.boardProps["SIZEY"];
					editor.editorCursorX = 1;
					editor.editorCursorY = 1;
					editor.forceCodeStrAll();
					interp.dispatchToMainLabel("SETLINECHARS");
					SE.CameraX = 1;
					SE.CameraY = 1;
					editor.updateEditorView(false);
				}
				else
					interp.dispatchToMainLabel("$ONWORLDLOAD");
			}

			zzt.mainMode = zzt.MODE_NORM;
		break;
		case zzt.MODE_LOADWAD:
			zzt.mainMode = zzt.MODE_SETUPWAD;
			if (!ZZTLoader.pwadIsLoaded(zzt.pwadIndex, parse.lastFileName) && !zzt.inEditor)
			{
				if (parse.pwadLoad(zzt.pwadIndex, zzt.MODE_PATCHLOADWAD))
					break;
			}

			zzt.highScoresLoaded = false;
			zzt.resetGuis();
			zzt.fileSystemType = zzt.FST_WAD;
			zzt.modeWhenBrowserClosed = zzt.MTRANS_NORM;
			oop.setOOPType();
			zzt.loadedOOPType = -3;

			if (ZZTLoader.establishWADFile(parse.fileData))
			{
				// Successful establishment; load current GUI and title screen.
				if (!zzt.inEditor)
				{
					if (zzt.globalProps.hasOwnProperty("WADSTARTUPGUI"))
						zzt.establishGui(zzt.globalProps["WADSTARTUPGUI"]);
					else
						zzt.establishGui("ZZTTITLE");

					zzt.drawGui();
					//drawGuiLabel("WORLDNAME", globalProps["WORLDNAME"]);
					//drawPen("SPEEDCURSOR", 0, 8, globalProps["GAMESPEED"], 31, 31);
				}

				if (zzt.inEditor)
					zzt.globals["$PLAYERMODE"] = 1; // Normal mode
				else
					zzt.globals["$PLAYERMODE"] = 3; // "ZZT title screen" mode

				i = zzt.globalProps["BOARD"];
				zzt.globalProps["BOARD"] = -1;
				zzt.globalProps["EVERPLAYED"] = 0;
				zzt.globals["$ALLPUSH"] = 0;
				zzt.globals["$PLAYERPAUSED"] = 0;
				zzt.globals["$PAUSECYCLE"] = 0;
				zzt.globals["$PASSAGEEMERGE"] = 0;
				zzt.globals["$LASTSAVESECS"] = 0;
				zzt.pMoveDir = -1;
				zzt.pShootDir = -1;

				if (zzt.inEditor)
					ZZTLoader.updateContFromBoard(0, ZZTLoader.boardData[0]);
				else
					ZZTLoader.switchBoard(0);

				zzt.activeObjs = false;

				// Even though we dispatch the world-load handler with the title
				// screen loaded and many important properties and global variables
				// initialized, nothing is actually displayed, and no paused/unpaused
				// state decision is made.  This is because the WAD should define
				// its own behavior for what it should do upon load (usually, a
				// dissolve effect on the board).  The routine should also unpause
				// the action if the title screen is meant to have action.

				if (zzt.inEditor)
				{
					zzt.mainMode = zzt.MODE_NORM;
					editor.modFlag = false;
					editor.boardWidth = zzt.boardProps["SIZEX"];
					editor.boardHeight = zzt.boardProps["SIZEY"];
					editor.editorCursorX = 1;
					editor.editorCursorY = 1;
					editor.forceCodeStrAll();
					interp.dispatchToMainLabel("SETLINECHARS");
					zzt.globalProps["OVERLAYSCROLL"] = 1;
					SE.CameraX = 1;
					SE.CameraY = 1;
					editor.updateEditorView(false);
				}
				else
				{
					interp.dispatchToMainLabel("$ONWORLDLOAD");
					//dissolveViewport(MODE_NORM, 0.5, -1);
				}
			}
			else
				zzt.mainMode = zzt.MODE_NORM;
		break;
		case zzt.MODE_LOADTRANSFERWAD:
			// Result of WAD transfer load has little effect on editor.
			zzt.mainMode = zzt.MODE_SETUPWAD;
			zzt.modeWhenBrowserClosed = zzt.MTRANS_NORM;
			if (ZZTLoader.establishWADFile(parse.fileData, true))
			{
				zzt.globalProps["NUMBOARDS"] += 1;
				editor.updateEditorView(false);
				zzt.mainMode = zzt.MODE_NORM;
				zzt.Toast("Transferred.", 0.25);
			}
			else
			zzt.mainMode = zzt.MODE_NORM;
		break;
		case zzt.MODE_LOADZIP:
			// Collect relevant game files from ZIP archive
			zzt.fileSystemType = zzt.FST_ZIP;
			zzt.modeWhenBrowserClosed = zzt.MTRANS_NORM;
			zzt.arcFileNames = parse.zipData.getFileNamesMatchingExt(".ZZT");
			zzt.arcFileNames = zzt.arcFileNames.concat(parse.zipData.getFileNamesMatchingExt(".SZT"));
			zzt.arcFileNames = zzt.arcFileNames.concat(parse.zipData.getFileNamesMatchingExt(".WAD"));

			if ((parse.zipData.numFiles == 1 && zzt.arcFileNames.length == 1) ||
				(zzt.globalProps["DEP_AUTORUNZIP"] != 0 && zzt.arcFileNames.length == 1))
			{
				// Auto-load first game file in ZIP file.
				parse.loadingSuccess = true;
				parse.fileData = parse.zipData.getFileByName(zzt.arcFileNames[0]);
				if (utils.endswith(zzt.arcFileNames[0], ".ZZT"))
					zzt.mainMode = zzt.MODE_LOADZZT;
				else if (utils.endswith(zzt.arcFileNames[0], ".SZT"))
					zzt.mainMode = zzt.MODE_LOADSZT;
				else
					zzt.mainMode = zzt.MODE_LOADWAD;
			}
			else
			{
				// Show scroll containing ZIP file contents.
				zzt.zipContentsScroll();
			}
		break;
		case zzt.MODE_LOADFILEBROWSER:
			zzt.displayFileBrowser(parse.loadingName);
		break;
		case zzt.MODE_LOADFILELINK:
			zzt.launchFileLinkScroll(parse.loadingName);
		break;
		case zzt.MODE_LOADGUI:
			editor.loadGuiFile();
			zzt.mainMode = zzt.MODE_NORM;
		break;
		case zzt.MODE_LOADEXTRAGUI:
			zzt.mainMode = zzt.MODE_NORM;
			editor.uploadExtraGui();
		break;
		case zzt.MODE_LOADEXTRALUMP:
			zzt.mainMode = zzt.MODE_NORM;
			editor.uploadExtraLump();
		break;
		case zzt.MODE_LOADCHAREDITFILE:
			zzt.mainMode = zzt.MODE_NORM;
			editor.uploadCharEditFile();
		break;
		case zzt.MODE_LOADZZL:
			zzt.mainMode = zzt.MODE_NORM;
			editor.loadZZL();
		break;
		case zzt.MODE_SAVEGUI:
			zzt.Toast("Saved.", 1.0);
			zzt.mainMode = zzt.MODE_NORM;
		break;
		case zzt.MODE_SAVEWAD:
			zzt.Toast("Saved.", 0.25);
			zzt.mainMode = zzt.MODE_NORM;
			if (editor.quitAfterSave)
				editor.dispatchEditorMenu("ED_REALLYQUIT");
		break;
		case zzt.MODE_SAVELEGACY:
			zzt.Toast("Saved.", 0.25);
			zzt.mainMode = zzt.MODE_NORM;
			if (editor.quitAfterSave)
				editor.dispatchEditorMenu("ED_REALLYQUIT");
		break;
		case zzt.MODE_SAVEHLP:
			zzt.Toast("Saved.", 1.0);
			zzt.mainMode = zzt.MODE_NORM;
		break;

		case zzt.MODE_RESTOREWADFILE:
			if (ZZTLoader.establishWADFile(parse.fileData))
			{
				// Successful establishment; load current GUI and board.
				zzt.establishGui(zzt.globalProps["THISGUI"]);
				zzt.drawGui();
				i = zzt.globalProps["BOARD"];
				zzt.globalProps["BOARD"] = -1;
				ZZTLoader.switchBoard(i);
				zzt.dissolveViewport(zzt.MODE_NORM, 0.5, -1);
				interp.dispatchToMainLabel("$ONRESTOREGAME");
			}
			else
				zzt.mainMode = zzt.MODE_NORM;
		break;

		case zzt.MODE_GETHIGHSCORES:
			zzt.mainMode = parse.originalAction;
			zzt.parseHighScores();
			interp.dispatchToMainLabel(zzt.highScoresLoaded ? "$ONGETHS" : "$ONFAILGETHS");
		break;
		case zzt.MODE_POSTHIGHSCORE:
			zzt.mainMode = parse.originalAction;
			zzt.parseHighScores();
			interp.dispatchToMainLabel(zzt.highScoresLoaded ? "$ONPOSTHS" : "$ONFAILPOSTHS");
		break;
	}
};

// Animation frame mode select
static animFrameSelect(animMode) {
	zzt.animUpdateMode = animMode
	window.requestAnimationFrame(zzt.animFrameStep);
}

// Efficient animation frame update function
static animFrameStep(timestamp) {
	switch (zzt.animUpdateMode) {
		case zzt.ANIM_MG:
			zzt.mg.drawSurfaces();
			if (zzt.inCharEdit)
			{
				zzt.csg.drawSurfaces();
				zzt.cpg.drawSurfaces();
			}
		break;
		case zzt.ANIM_FBG:
			zzt.fbg.drawSurfaces();
		break;
		case zzt.ANIM_SCROLLMSGALL:
			zzt.mg.drawSurfaces();
			zzt.drawScrollMsgText();
			zzt.titleGrid.drawSurfaces();
			zzt.scrollGrid.drawSurfaces();
		break;
		case zzt.ANIM_SCROLLMSGTXT:
			zzt.titleGrid.drawSurfaces();
			zzt.scrollGrid.drawSurfaces();
		break;
		case zzt.ANIM_SCROLLMSGEDITOR:
			zzt.mg.drawSurfaces();
			zzt.titleGrid.drawSurfaces();
			zzt.scrollGrid.drawSurfaces();
		break;
	}

	zzt.animUpdateMode = 0;
}

// Equivalent of AS3 getTimer function
static getTimer() {
	return (Date.now());
	//return (zzt.mcount * 1000.0 / 30.0);
}

static mTick() {
	// Master counter
	zzt.mcount++;
	//console.log(zzt.mcount);

	// Initialization.
	if (zzt.mainMode <= zzt.MODE_INIT)
	{
		if (zzt.mainMode == zzt.MODE_INIT && zzt.mcount > 15)
		{
			zzt.mainMode = zzt.MODE_PARTIALINIT;
			zzt.init();
		}
		return;
	}

	// Hide debug toast text if time expired.
	if (zzt.toastTime > 0)
	{
		if (--zzt.toastTime <= 0)
		{
			zzt.mg.redrawGrid();
			if (zzt.toastTempGridHide)
			{
				zzt.guiPropText.hidden = false;
				zzt.toastTempGridHide = false;
			}
		}
		else
			zzt.drawToastBox();
	}

	// "Scroll" interfaces take priority over all other types
	// of action, whether opening, closing, or interacting.
	if (zzt.mainMode >= zzt.MODE_SCROLLOPEN && zzt.mainMode <= zzt.MODE_SCROLLCHAIN)
	{
		if (zzt.mainMode == zzt.MODE_SCROLLOPEN || zzt.mainMode == zzt.MODE_SCROLLCHAIN)
		{
			// Open the scroll interface.
			zzt.eraseScrollMsgDims(zzt.curScrollCols, zzt.curScrollRows);
			zzt.curScrollCols += 8;
			zzt.curScrollRows += 2;

			if (zzt.curScrollCols > zzt.msgScrollWidth || zzt.globalProps["IMMEDIATESCROLL"] != 0 || zzt.inEditor)
				zzt.curScrollCols = zzt.msgScrollWidth;
			if (zzt.curScrollRows > zzt.msgScrollHeight || zzt.globalProps["IMMEDIATESCROLL"] != 0 || zzt.inEditor)
				zzt.curScrollRows = zzt.msgScrollHeight;

			zzt.setScrollMsgDims(zzt.curScrollCols, zzt.curScrollRows);
			//zzt.scrollArea.scaleX = (zzt.scroll40Column + 1);
			//zzt.titleGrid.setDoubled(Boolean(zzt.scroll40Column == 1));
			//zzt.scrollGrid.setDoubled(Boolean(zzt.scroll40Column == 1));

			zzt.animFrameSelect(zzt.ANIM_SCROLLMSGALL);

			if (zzt.curScrollCols >= zzt.msgScrollWidth && zzt.curScrollRows >= zzt.msgScrollHeight)
			{
				// Go to interaction mode.
				zzt.mainMode = zzt.MODE_SCROLLINTERACT;
			}
		}
		else if (zzt.mainMode == zzt.MODE_SCROLLCLOSE)
		{
			// Close the scroll interface.
			zzt.eraseScrollMsgDims(zzt.curScrollCols, zzt.curScrollRows);
			zzt.curScrollRows -= 3;
			if (zzt.curScrollRows < 1 || zzt.globalProps["IMMEDIATESCROLL"] != 0 || zzt.inEditor)
			{
				// Hide scroll interface.
				zzt.globals["$SCROLLMSG"] = 0;

				// If file link is source of scroll text, remove code.
				if (zzt.fileLinkName != "")
				{
					zzt.fileLinkName = "";
					interp.codeBlocks.pop();
				}

				// Go back to normal operations.
				zzt.mainMode = zzt.MODE_NORM;
				if (zzt.modeWhenBrowserClosed == zzt.MTRANS_ZIPSCROLL)
					zzt.zipContentsScroll();
			}
			else
			{
				zzt.setScrollMsgDims(zzt.curScrollCols, zzt.curScrollRows);
				zzt.drawScrollMsgText();
				zzt.animFrameSelect(zzt.ANIM_SCROLLMSGALL);
			}
		}
		else if (zzt.inEditor)
		{
			// Update surfaces if scroll is open (special circumstances apply)
			zzt.animFrameSelect(zzt.ANIM_SCROLLMSGEDITOR);
		}
		else
		{
			zzt.animFrameSelect(zzt.ANIM_SCROLLMSGTXT);
		}

		return;
	}

	// Transition effects are usually over very quickly
	if (zzt.mainMode == zzt.MODE_DISSOLVE || zzt.mainMode == zzt.MODE_SCROLLMOVE ||
		zzt.mainMode == zzt.MODE_FADETOBLOCK)
	{
		if (++zzt.transCurFrame >= zzt.transFrameCount)
		{
			// Transition effects catch whether the CPU might be too slow to render
			// a complex update that hits multiple parts of the screen.  If the
			// actual logged time between transition iterations is more than double
			// the requested rate, shift the strategy in such a way that the
			// transition rate is doubled, but with an actual screen update
			// occurring only half as often.  Flash usually responds well to
			// updates that don't require the screen to be hit every single frame.
			zzt.transCurFrame = 0;

			// Test if transition effect lags too much for CPU.
			var transDeltaTime = zzt.getTimer() - zzt.transLogTime;
			if (Math.floor(transDeltaTime / zzt.transBaseRate) >= 2.0)
			{
				// Unacceptable--increase the base rate and multiplier.
				zzt.transBaseRate *= 2.0;
				zzt.transFrameCount *= 2;
				zzt.transSquaresPerFrame *= 2;
				zzt.transSquaresPerFrame2 *= 2;
				//console.log("INC RATE:  ", transDeltaTime, zzt.transBaseRate, zzt.transSquaresPerFrame, zzt.mainMode);
			}

			zzt.transLogTime = zzt.getTimer();

			if (zzt.mainMode == zzt.MODE_DISSOLVE)
			{
				if (!zzt.dissolveIter())
					return;
			}
			else if (zzt.mainMode == zzt.MODE_SCROLLMOVE)
			{
				if (!zzt.scrollTransitionIter())
					return;
			}
			else if (zzt.mainMode == zzt.MODE_FADETOBLOCK)
			{
				if (!zzt.fadeTransitionIter())
					return;
			}
		}
	}

	// Iterate game-oriented flashing toast text if needed.
	if ((zzt.mcount & 3) == 0 && zzt.toastMsgTimeLeft > 0)
	{
		// The toast text iterates only while the action is progressing (if a "game" GUI)
		// or if GUI does not resemble ZZTGAME, SZTGAME, etc.
		if ((zzt.activeObjs && zzt.mainMode == zzt.MODE_NORM) || zzt.thisGuiName.indexOf("ZTGAME") == -1)
		{
			zzt.toastMsgTimeLeft -= 4;
			if (zzt.toastMsgTimeLeft <= 0)
			{
				// Remove line(s).
				zzt.undisplayToastMsg();
				interp.marqueeText = "";
			}
			else
			{
				// Flash lines.
				if (++zzt.toastMsgColor > 15)
					zzt.toastMsgColor = 9;

				zzt.displayToastMsg();
			}
		}
	}

	// Show loading animation if needed.
	if (zzt.showLoadingAnim)
		zzt.drawLoadingAnimation();

	// Show delayed property text if necessary.
	if (zzt.propTextDelay > 0)
	{
		if (--zzt.propTextDelay <= 0)
		{
			zzt.mainMode = zzt.modeForPropText;
			//zzt.guiProperties.visible = true;
			//zzt.guiPropText.enabled = true;
		}
	}

	// Handle result of loading action.
	if (parse.loadingSuccess)
	{
		parse.loadingSuccess = false;
		zzt.processLoadingSuccessModes();
	}

	// This is the main I/O handling mode.
	if (zzt.mainMode == zzt.MODE_NORM && zzt.activeObjs)
	{
		// Game speed is manifested in terms of the ZZT speed control
		// setting, in which each cycle-1 interval takes up gTickInit
		// frames (usually a fractional value).  The remainder is not
		// discarded after a cycle completes; the result must be
		// time-averaged to give the appearance of resembling the
		// factor-of-18.2 Hz rate used in the original code.
		zzt.gTickCurrent -= 1.0;
		while (zzt.gTickCurrent <= 0.0)
		{
			zzt.gTickCurrent += zzt.gTickInit;

			// If click-to-move active, feed into movement directions.
			if (input.c2MDestX != -1)
			{
				input.lastPlayerX = interp.playerSE.X;
				input.lastPlayerY = interp.playerSE.Y;
				input.moveC2MSquare();
			}

			// Process all status elements.
			zzt.modeChanged = false;
			for (var i = 0; i < zzt.statElem.length; i++)
			{
				zzt.legacyIndex = i;
				interp.execSECode(zzt.statElem[i]);
				if (zzt.modeChanged)
					break; // If scroll or board transition, all remaining SEs wait.
			}

			// Process the "FL_DEAD" flags for status elements, which
			// identifies status elements to remove.
			for (i = 0; i < zzt.statElem.length; i++)
			{
				if ((zzt.statElem[i].FLAGS & interp.FL_DEAD) != 0)
				{
					// Block-closure mechanism maintains original iteration order.
					zzt.statElem.splice(i, 1);
					i--;

					// End-move mechanism maintains has least overhead of list,
					// maintaining most of original iteration order except for last SE.
					//statElem[i] = statElem[statElem.length - 1];
					//statElem.pop();
					//i--;

					// Neither of the above mechanisms seems to be notably
					// superior than the other, in either performance or
					// iteration accuracy.
				}
			}

			// Update legacy tick counter
			if (++zzt.legacyTick > zzt.LEGACY_TICK_SIZE)
				zzt.legacyTick = 1;

			if (oop.hasError)
			{
				oop.hasError = false;
				zzt.Toast(oop.errorText);
			}

			// If click-to-move active, select next direction to move.
			if (input.c2MDestX != -1)
				input.chooseNextC2MDir();
		}

		// If necessary, update game speed and dispatch every-second message.
		zzt.setGameSpeed(utils.int(zzt.globalProps["GAMESPEED"]));
		if (++zzt.scount == 30)
		{
			zzt.scount = 0;
			interp.dispatchToMainLabel("$SECONDINTERVAL");
		}

		// If a run/fire key is being held down,
		// push additional keydowns based on rate, etc.
		var runDelay = utils.int(zzt.globalProps["PLAYERRUNDELAY"]);
		var fireDelay = utils.int(zzt.globalProps["PLAYERFIREDELAY"]);
		if ((zzt.mcount & 1) == 0)
		{
			if (input.keyCodeDowns[16] == 0) // Shift
			{
				// Run
				input.extraKeyDownHandler(37, 0, false, false, runDelay); // Left
				input.extraKeyDownHandler(38, 0, false, false, runDelay); // Up
				input.extraKeyDownHandler(39, 0, false, false, runDelay); // Right
				input.extraKeyDownHandler(40, 0, false, false, runDelay); // Down
				input.extraKeyDownHandler(32, 32, false, false, runDelay); // Space
			}
			else if (input.mDown)
			{
				input.mouseFireHandler(fireDelay); // Mouse fire (button held down)
			}
			else
			{
				// Fire
				input.extraKeyDownHandler(37, 0, true, false, fireDelay); // Left
				input.extraKeyDownHandler(38, 0, true, false, fireDelay); // Up
				input.extraKeyDownHandler(39, 0, true, false, fireDelay); // Right
				input.extraKeyDownHandler(40, 0, true, false, fireDelay); // Down
			}
		}
	}
	else if (zzt.mainMode == zzt.MODE_NORM && !zzt.activeObjs)
	{
		// This is the "paused" or "menu" I/O handling mode.
		if (zzt.inEditor)
		{
			// Editor time-based action has special handling.
			if (editor.cursorActive)
			{
				// Blinking cursor
				if ((zzt.mcount & 3) == 0)
					editor.drawEditorCursor();
			}

			if (zzt.typeAllInfoDelay > 0)
			{
				if (--zzt.typeAllInfoDelay == 0)
					editor.showTypeAllInfo();
			}
		}
		else
		{
			// The PAUSED message is sent to the main object every frame.
			// Additionally, GUI-oriented keyboard commands will still work.
			if (zzt.oopReady)
				interp.dispatchToMainLabel("$PAUSED");
		}
	}

	// Incidental sound update.
	Sounds.playVoice();

	// Handle blink mode updates.
	if (++zzt.bcount == 8)
	{
		// Turn blinking cells OFF.
		if (zzt.mainMode == zzt.MODE_CHARSEL || zzt.mainMode == zzt.MODE_TEXTENTRY)
			; // Do not overwrite blinking characters during some menus
		else if (CellGrid.blinkChanged)
		{
			CellGrid.blinkChanged = false;
			zzt.mg.captureBlinkList(false);
		}
		else
			zzt.mg.blinkToggle(false);
	}
	if (zzt.bcount == 16)
	{
		// Turn blinking cells ON.
		zzt.bcount = 0;

		if (zzt.mainMode == zzt.MODE_CHARSEL || zzt.mainMode == zzt.MODE_TEXTENTRY)
			; // Do not overwrite blinking characters during some menus
		else if (CellGrid.blinkChanged)
		{
			CellGrid.blinkChanged = false;
			zzt.mg.captureBlinkList(true);
		}
		else
			zzt.mg.blinkToggle(true);
	}

	// Update surfaces if needed.
	zzt.animFrameSelect(zzt.ANIM_MG);
};

}

zzt.initClass();
