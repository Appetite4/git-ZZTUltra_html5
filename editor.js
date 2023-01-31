// editor.js:  The program's editor functions.
"use strict";

class editor {

static initClass() {
	// Constants
	editor.EDSTYLE_ULTRA = 0;
	editor.EDSTYLE_KEVEDIT = 1;
	editor.EDSTYLE_CLASSIC = 2;
	editor.EDSTYLE_SUPERZZT = 3;

	editor.DRAW_OFF = 0;
	editor.DRAW_ON = 1;
	editor.DRAW_ACQFORWARD = 2;
	editor.DRAW_ACQBACK = 3;
	editor.DRAW_TEXT = 4;

	editor.TYPEFILTER_FLOOR = 0;
	editor.TYPEFILTER_BLOCKING = 1;
	editor.TYPEFILTER_STATTYPES = 2;
	editor.TYPEALL_ROWLIMIT = 21;
	editor.TYPEALL_PAGELIMIT = 42;

	editor.SM_STATELEM = 0;
	editor.SM_UNDERCOLOR = 1;
	editor.SM_WORLDTYPECHOICELOAD = 2;
	editor.SM_WORLDTYPECHOICESAVE = 3;
	editor.SM_WORLDINFO = 4;
	editor.SM_BOARDINFO = 5;
	editor.SM_BOARDSWITCH = 6;
	editor.SM_TRANSFER = 7;
	editor.SM_STATINFO = 8;
	editor.SM_STATLIST = 9;
	editor.SM_INVENTORYINFO = 10;
	editor.SM_GLOBALS = 11;
	editor.SM_OBJLIB = 12;
	editor.SM_EXTRAGUI = 13;
	editor.SM_EXTRAWAD = 14;
	editor.SM_CHAREDITLOAD = 15;
	editor.SM_CHAREDITSAVE = 16;
	editor.SM_GUITEXT = 17;

	editor.BSA_SWITCHBOARD = 0;
	editor.BSA_SETBOARDPROP = 1;
	editor.BSA_SETWORLDPROP = 2;
	editor.BSA_SETPASSAGEDEST = 3;

	editor.FILL_PAINT = 0;
	editor.FILL_RANDOMPAINT = 1;
	editor.FILL_SELECTION = 2;

	editor.GRAD_LINEAR = 0;
	editor.GRAD_BILINEAR = 1;
	editor.GRAD_RADIAL = 2;

	editor.MAX_BBUFFER = 64;

	// GUI/Combined editor vars
	editor.modFlag = false;
	editor.fgColorCursor = 15;
	editor.bgColorCursor = 1;
	editor.oldFgColorCursor = 15;
	editor.oldBgColorCursor = 1;
	editor.blinkFlag = false;
	editor.typingTextInGuiEditor = false;
	editor.guiTextEditCursor = 0;
	editor.altCharCursor = 0;
	editor.lastChar = 0;
	editor.editWidth = 20;
	editor.editHeight = 25;

	editor.editorChars = null;
	editor.editorAttrs = null;
	editor.cursorActive = true;

	// World editor vars
	editor.patternBuiltIn = 6;
	editor.patternCursor = 0;
	editor.patternBBCursor = 0;

	editor.oldHlpStr = "";
	editor.hasExistingTypeSpec = false;
	editor.newTypeNameFocus = "";
	editor.newTypeString = "";
	editor.newTypeNum = 0;
	editor.editedPropName = "";
	editor.errorMsgs = "";
	editor.hexTextEntry = 0;
	editor.hexCodeValue = 0;
	editor.text128 = false;
	editor.drawFlag = 0;
	editor.defColorMode = true;
	editor.acquireMode = false;
	editor.bufLockMode = false;
	editor.editorStyle = 0;
	editor.scrollMode = 0;
	editor.boardSelectAction = 0;
	editor.worldSaveType = -3;
	editor.quitAfterSave = false;

	editor.typeAllFilter = 0;
	editor.typeAllPage = 0;
	editor.typeAllCursor = 0;
	editor.typeAllPageCount = 0;
	editor.typeAllTypes = [];

	editor.numStats = 0;
	editor.maxStats = 151;
	editor.editorCursorX = 1;
	editor.editorCursorY = 1;
	editor.boardWidth = 60;
	editor.boardHeight = 25;
	editor.origCameraX = 1;
	editor.origCameraY = 1;

	editor.anchorX = -1;
	editor.anchorY = -1;
	editor.clipX1 = 0;
	editor.clipY1 = 0;
	editor.guiClipWidth = 0;
	editor.guiClipHeight = 0;
	editor.invertGPts = false;
	editor.gradientShape = 0;
	editor.gradientDither = 0.0;

	editor.immType = [32, 15, 0, null];
	editor.actualBBLen = 10;
	editor.bBuffer = null;
	editor.selBuffer = [];
	editor.gradBuffer = [];
	editor.fillBuffer = [];
	editor.clipBuffer = [];
	editor.guiClipBuffer = [];
	editor.objLibraryBuffer = [];
	editor.tempStatProps = null;

	editor.prevStepX = 1;
	editor.prevStepY = 0;
	editor.prevP1 = 0;
	editor.prevP2 = 0;
	editor.prevP3 = 0;

	editor.sBuffer = null;

	editor.charEditorInit = false;
	editor.cePreviewIdent = false;
	editor.ceCharWidth = 8;
	editor.ceCharHeight = 16;
	editor.ceCharHeightMode = 2;
	editor.ceCharCount = 256;
	editor.ceCharNum = 0;
	editor.ceCharX = 0;
	editor.ceCharY = 0;
	editor.ceCharDrawMode = 0;
	editor.ceCharMouseMode = 0;
	editor.ceMaskArray = null;
	editor.ceMaskCBArray = null;
	editor.cePreviewChars = null;
	editor.ceStorage = null;
	editor.savedCEStorage = [ null, null, null ];

editor.playerExtras = {
	"CHAR" : 2
};
editor.playerDeadExtras = {
	"CHAR" : 2,
	"$DEADSMILEY" : 1
};
editor.passageExtras = {
	"P2" : 15
};
editor.scrollExtras = {
	"$CODE" : ""
};
editor.duplicatorExtras = {
	"CHAR" : 250
};
editor.starExtras = {
	"CHAR" : 47
};
editor.spinningGunExtras = {
	"CHAR" : 24
};
editor.objectExtras = {
	"CHAR" : 1,
	"$CODE" : ""
};
editor.transporterExtras = {
	"CHAR" : 62
};
editor.dragonPupExtras = {
	"CHAR" : 148
};
editor.stoneExtras = {
	"CHAR" : 90
};
editor.longBuiltInTypes = [
	[219, 21], [178, 22], [177, 23], [176, 19], [32, 0], [206, 31]];
editor.shortBuiltInTypes = [
	[219, 21], [178, 22], [177, 23], [32, 0], [206, 31]];

editor.editorDefaultGuis = [
	"ED_ULTRA1", "ED_KEVEDIT", "ED_CLASSIC", "ED_SUPERZZT"
];

editor.prettyColorNames = [
	"Black   ", "D. Blue ", "D. Green", "D. Cyan ",
	"D. Red  ", "D.Purple", "Brown   ", "Grey    ",
	"D. Grey ", "Blue    ", "Green   ", "Cyan    ",
	"Red     ", "Purple  ", "Yellow  ", "White   "
];

editor.requiredWorldKeys = [
	"WORLDNAME", "WORLDTYPE", "STARTBOARD", "AMMO", "GEMS", "HEALTH",
	"TORCHES", "SCORE", "TIME", "Z", "TORCHCYCLES", "ENERGIZERCYCLES",
	"KEY0", "KEY1", "KEY2", "KEY3", "KEY4", "KEY5", "KEY6", "KEY7",
	"KEY8", "KEY9", "KEY10", "KEY11", "KEY12", "KEY13", "KEY14", "KEY15"
];

editor.inventoryWorldKeys = [
	"AMMO", "GEMS", "HEALTH", "TORCHES", "SCORE", "TIME", "Z", "TORCHCYCLES",
	"ENERGIZERCYCLES", "KEY8", "KEY9", "KEY10", "KEY11", "KEY12", "KEY13", "KEY14", "KEY15"
];

editor.notIncludedBoardKeys = [
	"BOARDNAME", "SIZEX", "SIZEY", "ISDARK", "RESTARTONZAP",
	"TIMELIMIT", "MAXPLAYERSHOTS", "EXITNORTH", "EXITSOUTH", "EXITEAST", "EXITWEST"
];

editor.nonExtraStatusKeys = [
	"CYCLE", "X", "Y", "STEPX", "STEPY", "FLAGS", "delay",
	"IP", "UNDERID", "UNDERCOLOR", "CODEID", "$CODE"
];

editor.propText = null;
editor.emptyGuiProperties = "{\n"+
"\"Use40Column\":0,\n\"OverallSizeX\":80,\n\"OverallSizeY\":25,\n"+
"\"GuiLocX\":61,\n\"GuiLocY\":1,\n\"GuiWidth\":20,\n\"GuiHeight\":25,\n"+
"\"Viewport\":[1,1,60,25],\n\"KeyInput\":{ },\n\"Label\":{ }\n}";

};

static drawColorBand(labelStr) {
	// Assumed that color band is just below label
	var guiLabelInfo = zzt.GuiLabels[labelStr];
	var gx = (zzt.GuiLocX-1) + utils.int(guiLabelInfo[0]) - 1 + 2;
	var gy = (zzt.GuiLocY-1) + utils.int(guiLabelInfo[1]) + 1 - 1;

	// Write color band
	zzt.mg.setCell(gx++, gy, 223, 8);
	zzt.mg.setCell(gx++, gy, 223, 25);
	zzt.mg.setCell(gx++, gy, 223, 42);
	zzt.mg.setCell(gx++, gy, 223, 59);
	zzt.mg.setCell(gx++, gy, 223, 76);
	zzt.mg.setCell(gx++, gy, 223, 93);
	zzt.mg.setCell(gx++, gy, 223, 110);
	zzt.mg.setCell(gx++, gy, 223, 127);
};

static dispatchEditGuiMenu(msg) {
	var jObj;
	switch (msg) {
		case "EVENT_REDRAW":
			zzt.mainMode = zzt.MODE_NORM;
			editor.writeColorCursors();
		break;
		case "EVENT_TESTDRAWGUI":
			editor.writeGuiTextEdit();
		break;
		case "EVENT_LOADGUI":
			parse.loadLocalFile("ZZTGUI", zzt.MODE_LOADGUI);
		break;
		case "EVENT_SAVEGUI":
			editor.saveGuiFile();
		break;
		case "EVENT_SAVEANDQUIT":
			editor.saveGuiFile();
			zzt.mainMode = zzt.MODE_NORM;
			zzt.popGui();
		break;
		case "EVENT_GUIPROPERTIES":
			// Show properties editor.
			zzt.showPropTextView(zzt.MODE_ENTERGUIPROP, "GUI Properties", editor.propText);
		break;
		case "EVENT_ACCEPTPROP":
			// Parse properties text.
			jObj = parse.jsonDecode(zzt.guiPropText.value, "ALL");
			if (jObj != null)
			{
				// Get properties text; hide properties editor.
				editor.propText = zzt.guiPropText.value;
				zzt.hidePropTextView(zzt.MODE_NORM);

				// From the parsed properties, resize the GUI editing portion, if needed.
				editor.editWidth = utils.int(jObj.GuiWidth);
				editor.editHeight = utils.int(jObj.GuiHeight);
				if (editor.editWidth <= 0 || editor.editWidth > zzt.CHARS_WIDTH)
					editor.editWidth = 20;
				if (editor.editHeight <= 0 || editor.editHeight > zzt.CHARS_HEIGHT)
					editor.editHeight = 25;
				editor.modFlag = true;
				zzt.drawGuiLabel("MODFLAG", "*");
			}
		break;
		case "EVENT_QUITGUIEDITOR":
			if (editor.modFlag)
				zzt.confMessage("CONFMESSAGE", "Save First?",
					"EVENT_SAVEANDQUIT", "EVENT_REALLYQUIT", "EVENT_CANCEL");
			else
				editor.dispatchEditGuiMenu("EVENT_REALLYQUIT");
		break;
		case "EVENT_REALLYQUIT":
			zzt.mainMode = zzt.MODE_NORM;
			zzt.popGui();
		break;
		case "EVENT_CANCEL":
		break;
		case "EVENT_FGCOLOR":
			editor.fgColorCursor += 1;
			editor.fgColorCursor &= 15;
			editor.writeColorCursors();
		break;
		case "EVENT_BGCOLOR":
			editor.bgColorCursor += 1;
			editor.bgColorCursor &= 7;
			editor.writeColorCursors();
		break;
		case "EVENT_TOGGLEBLINK":
			editor.blinkFlag = !editor.blinkFlag;
			editor.writeColorCursors();
		break;
		case "EVENT_EDITTEXT":
			if (zzt.establishGui("EDITGUITEXT"))
			{
				zzt.mainMode = zzt.MODE_NORM;
				zzt.mg.writeConst(0, 0, zzt.CHARS_WIDTH, zzt.CHARS_HEIGHT, " ", 31);
				zzt.drawGui();
				editor.drawFlag = 0;
				editor.typingTextInGuiEditor = true;
				editor.writeGuiTextEdit();
				editor.writeGuiTextEditLabels();
				zzt.guiStack.push("EDITGUITEXT");
			}
		break;
	}
};

static dispatchEditGuiTextMenu(msg) {
	var i;
	var j;
	switch (msg) {
		case "EVENT_RETURNTOEDITGUI":
			editor.typingTextInGuiEditor = false;
			zzt.popGui();
			zzt.drawGuiLabel("MODFLAG", editor.modFlag ? "*" : " ");
		break;
		case "EVENT_BACKSPACE":
		case "EVENT_LEFT":
			editor.guiTextEditCursor -= 1;
			if (editor.guiTextEditCursor < 0)
				editor.guiTextEditCursor = editor.editWidth * editor.editHeight - 1;
			editor.anchorX = editor.guiTextEditCursor;

			if (editor.drawFlag)
				editor.writeKeyToGuiEditor(editor.lastChar, false);
			else
				editor.writeGuiTextEdit();
		break;
		case "EVENT_RIGHT":
			editor.guiTextEditCursor += 1;
			if (editor.guiTextEditCursor >= editor.editWidth * editor.editHeight)
				editor.guiTextEditCursor = 0;
			editor.anchorX = editor.guiTextEditCursor;

			if (editor.drawFlag)
				editor.writeKeyToGuiEditor(editor.lastChar, false);
			else
				editor.writeGuiTextEdit();
		break;
		case "EVENT_UP":
			editor.guiTextEditCursor -= editor.editWidth;
			if (editor.guiTextEditCursor < 0)
				editor.guiTextEditCursor = 0;
			editor.anchorX = editor.guiTextEditCursor;

			if (editor.drawFlag)
				editor.writeKeyToGuiEditor(editor.lastChar, false);
			else
				editor.writeGuiTextEdit();
		break;
		case "EVENT_DOWN":
			editor.guiTextEditCursor += editor.editWidth;
			if (editor.guiTextEditCursor >= editor.editWidth * editor.editHeight)
				editor.guiTextEditCursor = editor.editWidth * editor.editHeight - 1;
			editor.anchorX = editor.guiTextEditCursor;

			if (editor.drawFlag)
				editor.writeKeyToGuiEditor(editor.lastChar, false);
			else
				editor.writeGuiTextEdit();
		break;
		case "EVENT_SELLEFT":
			editor.guiTextEditCursor -= 1;
			if (editor.guiTextEditCursor < 0)
				editor.guiTextEditCursor = editor.editWidth * editor.editHeight - 1;
			editor.writeGuiTextEdit(true);
		break;
		case "EVENT_SELRIGHT":
			editor.guiTextEditCursor += 1;
			if (editor.guiTextEditCursor >= editor.editWidth * editor.editHeight)
				editor.guiTextEditCursor = 0;
			editor.writeGuiTextEdit(true);
		break;
		case "EVENT_SELUP":
			editor.guiTextEditCursor -= editor.editWidth;
			if (editor.guiTextEditCursor < 0)
				editor.guiTextEditCursor = 0;
			editor.writeGuiTextEdit(true);
		break;
		case "EVENT_SELDOWN":
			editor.guiTextEditCursor += editor.editWidth;
			if (editor.guiTextEditCursor >= editor.editWidth * editor.editHeight)
				editor.guiTextEditCursor = editor.editWidth * editor.editHeight - 1;
			editor.writeGuiTextEdit(true);
		break;

		case "EVENT_COLORDIALOG":
			editor.oldFgColorCursor = editor.fgColorCursor;
			editor.oldBgColorCursor = editor.bgColorCursor;
			editor.scrollMode = editor.SM_GUITEXT;
			zzt.inEditor = true;
			zzt.mainMode = zzt.MODE_COLORSEL;
			zzt.establishGui("ED_COLORS");
			for (j = 1; j <= 8; j++) {
				zzt.GuiTextLines[j] = String.fromCharCode(179);
				for (i = 1; i <= 32; i++) {
					zzt.GuiTextLines[j] += String.fromCharCode(254);
				}
				zzt.GuiTextLines[j] += String.fromCharCode(179);
			}
			zzt.drawGui();
			editor.drawKolorCursor(true);
		break;

		case "EVENT_COPY":
			editor.copyGuiTextRange();
			editor.anchorX = editor.guiTextEditCursor;
			editor.writeGuiTextEdit();
		break;
		case "EVENT_PASTE":
			editor.pasteGuiText();
			editor.writeGuiTextEdit();
		break;

		case "EVENT_ALTCHAR":
			editor.altCharCursor += 1;
			if (editor.altCharCursor > 32 && editor.altCharCursor < 127)
				editor.altCharCursor = 127;
			else if (editor.altCharCursor >= 256)
				editor.altCharCursor = 0;

			editor.lastChar = editor.altCharCursor;
			editor.writeGuiTextEditLabels();
		break;
		case "EVENT_ALTCHAR2":
			editor.altCharCursor -= 1;
			if (editor.altCharCursor > 32 && editor.altCharCursor < 127)
				editor.altCharCursor = 32;
			else if (editor.altCharCursor < 0)
				editor.altCharCursor = 255;

			editor.lastChar = editor.altCharCursor;
			editor.writeGuiTextEditLabels();
		break;
		case "EVENT_TOGGLEDRAW":
			editor.drawFlag = editor.drawFlag ^ 1;
			if (editor.drawFlag)
				editor.writeKeyToGuiEditor(editor.lastChar, false);

			editor.writeGuiTextEditLabels();
		break;
		case "EVENT_PLOTLAST":
			editor.writeKeyToGuiEditor(editor.lastChar);
		break;
		case "EVENT_PICKUPCHAR":
			i = utils.int(editor.guiTextEditCursor % editor.editWidth);
			j = utils.int(editor.guiTextEditCursor / editor.editWidth);
			editor.lastChar = editor.editorChars.b[j * zzt.MAX_WIDTH + i];
			editor.altCharCursor = editor.lastChar;
			editor.writeGuiTextEditLabels();
		break;
		case "EVENT_PICKUPALL":
			i = utils.int(editor.guiTextEditCursor % editor.editWidth);
			j = utils.int(editor.guiTextEditCursor / editor.editWidth);
			editor.lastChar = editor.editorChars.b[j * zzt.MAX_WIDTH + i];
			editor.altCharCursor = editor.lastChar;
			editor.fgColorCursor = editor.editorAttrs.b[j * zzt.MAX_WIDTH + i];
			editor.bgColorCursor = (editor.fgColorCursor >> 4) & 7;
			editor.blinkFlag = Boolean((editor.fgColorCursor & 128) != 0);
			editor.fgColorCursor &= 15;
			editor.writeGuiTextEditLabels();
		break;

		case "EVENT_FGCOLOR":
			editor.fgColorCursor += 1;
			editor.fgColorCursor &= 15;
			editor.writeGuiTextEditLabels();
		break;
		case "EVENT_BGCOLOR":
			editor.bgColorCursor += 1;
			editor.bgColorCursor &= 7;
			editor.writeGuiTextEditLabels();
		break;
		case "EVENT_TOGGLEBLINK":
			editor.blinkFlag = !editor.blinkFlag;
			editor.writeGuiTextEditLabels();
		break;

		case "EVENT_SETLABEL":
			i = utils.int(editor.guiTextEditCursor % editor.editWidth);
			j = utils.int(editor.guiTextEditCursor / editor.editWidth);
			editor.typingTextInGuiEditor = false;
			zzt.popGui();
			editor.insertNewGuiLabelAt("Label", "NEWLABEL",
			i + 1, j + 1, 5, editor.editorAttrs.b[j * zzt.MAX_WIDTH + i]);
			zzt.showPropTextView(zzt.MODE_ENTERGUIPROP, "GUI Properties", editor.propText);
		break;
		case "EVENT_SETMOUSEINPUT":
			i = utils.int(editor.guiTextEditCursor % editor.editWidth);
			j = utils.int(editor.guiTextEditCursor / editor.editWidth);
			editor.typingTextInGuiEditor = false;
			zzt.popGui();
			editor.insertNewGuiLabelAt("MouseInput", "NEWEVENT", i + 1, j + 1, 5, 1);
			zzt.showPropTextView(zzt.MODE_ENTERGUIPROP, "GUI Properties", editor.propText);
		break;
	}
};

static insertNewGuiLabelAt(propContainer, labelStr, x, y, xLen, yLen) {
	var newLabel =
		"\n\"" + labelStr + "\":[" + x + "," + y + "," + xLen + "," + yLen + "],\n";

	var contStr = "\"" + propContainer + "\":";
	var idx = editor.propText.indexOf(contStr);
	if (idx == -1)
	{
		editor.propText = editor.propText.substr(0, 1) + contStr + "{\n}," + editor.propText.substr(1);
		idx = 1;
	}

	idx = editor.propText.indexOf("{", idx) + 1;
	editor.propText = editor.propText.substr(0, idx) + newLabel + editor.propText.substr(idx);
};

static writeColorCursors() {
	var fgColorStr = "  ";
	var bgColorStr = "  ";
	var blinkStr = "  No ";

	for (var i = 0; i < 8; i++)
	{
		if (i == editor.fgColorCursor - 8)
			fgColorStr += String.fromCharCode(31);
		else
			fgColorStr += " ";
	}
	for (var j = 0; j < 8; j++)
	{
		if (j == editor.fgColorCursor)
			bgColorStr += String.fromCharCode(30);
		else if (j == editor.bgColorCursor)
			bgColorStr += String.fromCharCode(24);
		else
			bgColorStr += " ";
	}
	if (editor.blinkFlag)
		blinkStr = "  Yes";

	var doOffset = Boolean(zzt.thisGuiName == "EDITGUITEXT");
	editor.drawGuiLabelSmart("COLORCURSOR1", fgColorStr, doOffset);
	editor.drawGuiLabelSmart("COLORCURSOR2", bgColorStr, doOffset);
	editor.drawGuiLabelSmart("BLINKLABEL", blinkStr, doOffset);
	editor.drawColorBand("COLORCURSOR1");
};

static writeGuiTextEditLabels() {
	editor.drawGuiLabelSmart("TOGGLEDRAW", "Tab:  Draw mode " + (editor.drawFlag ? "ON " : "OFF"));
	editor.drawGuiLabelSmart("PLOTLAST", "Space:  Plot last");
	editor.drawGuiLabelSmart("ALTCHAR", "PgUp/PgDn:  Char " + String.fromCharCode(editor.altCharCursor));
	editor.drawGuiLabelSmart("PICKUPCHAR", "Enter:  Get char");
	editor.drawGuiLabelSmart("PICKUPALL", "Shift+Enter: Get all");
	editor.drawGuiLabelSmart("SETLABEL", "F3:  Set GUI label");
	editor.drawGuiLabelSmart("SETMOUSEINPUT", "F4:  Set mouse label");
	editor.drawGuiLabelSmart("RETURNTOEDITGUI", "Esc:  Back to menu");
	editor.drawGuiLabelSmart("COLORDIALOG", "Ctrl+K:  Color dlg.");
	editor.drawGuiLabelSmart("RANGE", "Shift+Arrow:  Select");
	editor.drawGuiLabelSmart("COPY", "Ctrl+C:  Copy");
	editor.drawGuiLabelSmart("PASTE", "Ctrl+V:  Paste");
	editor.writeColorCursors();
};

static drawGuiLabelSmart(lbl, val, doOffset=true) {
	// Kick label to left side of display if cursor would intrude on label area.
	if (doOffset)
	{
		var gx = editor.guiTextEditCursor % editor.editWidth;
		gx = (gx >= 60) ? -79 : -19;
		zzt.GuiLabels[lbl][0] = gx;
	}

	zzt.drawGuiLabel(lbl, val);
};

static writeGuiTextEdit(showSel=false) {
	var gx = utils.orderInts(
		editor.guiTextEditCursor % editor.editWidth, editor.anchorX % editor.editWidth);
	var gy = utils.orderInts(
		utils.int(editor.guiTextEditCursor / editor.editWidth), utils.int(editor.anchorX / editor.editWidth));

	var gtc = 0;
	for (var j = 0; j < editor.editHeight; j++)
	{
		for (var i = 0; i < editor.editWidth; i++)
		{
			var color = editor.editorAttrs.b[j * zzt.MAX_WIDTH + i];
			if (editor.guiTextEditCursor == gtc)
				color = color ^ 127;
			else if (showSel)
			{
				if (i >= gx[0] && i <= gx[1] && j >= gy[0] && j <= gy[1])
					color = color ^ 127;
			}

			gtc++;
			zzt.mg.setCell(i, j, editor.editorChars.b[j * zzt.MAX_WIDTH + i], color);
		}
	}
};

static writeKeyToGuiEditor(c, doAdvance=true) {
	editor.lastChar = utils.int(c);
	var gx = editor.guiTextEditCursor % editor.editWidth;
	var gy = utils.int(editor.guiTextEditCursor / editor.editWidth);
	var color = editor.fgColorCursor + (editor.bgColorCursor * 16) + (editor.blinkFlag ? 128 : 0);
	editor.editorChars.b[gy * zzt.MAX_WIDTH + gx] = editor.lastChar;
	editor.editorAttrs.b[gy * zzt.MAX_WIDTH + gx] = color;

	if (doAdvance)
	{
		editor.guiTextEditCursor += 1;
		if (editor.guiTextEditCursor >= editor.editWidth * editor.editHeight)
			editor.guiTextEditCursor = 0;
	}

	editor.writeGuiTextEdit();
	editor.modFlag = true;
};

static copyGuiTextRange() {
	var gx = utils.orderInts(
		editor.guiTextEditCursor % editor.editWidth, editor.anchorX % editor.editWidth);
	var gy = utils.orderInts(
		utils.int(editor.guiTextEditCursor / editor.editWidth), utils.int(editor.anchorX / editor.editWidth));

	editor.guiClipWidth = gx[1] - gx[0] + 1;
	editor.guiClipHeight = gy[1] - gy[0] + 1;
	editor.guiClipBuffer = [];

	for (var y = gy[0]; y <= gy[1]; y++) {
		for (var x = gx[0]; x <= gx[1]; x++) {
			editor.guiClipBuffer.push(editor.editorChars.b[y * zzt.MAX_WIDTH + x]);
			editor.guiClipBuffer.push(editor.editorAttrs.b[y * zzt.MAX_WIDTH + x]);
		}
	}
};

static pasteGuiText() {
	var gx = editor.guiTextEditCursor % editor.editWidth;
	var gy = utils.int(editor.guiTextEditCursor / editor.editWidth);

	var gtc = 0;
	for (var y = 0; y < editor.guiClipHeight; y++) {
		for (var x = 0; x < editor.guiClipWidth; x++) {
			editor.editorChars.b[(y + gy) * zzt.MAX_WIDTH + (x + gx)] = editor.guiClipBuffer[gtc++];
			editor.editorAttrs.b[(y + gy) * zzt.MAX_WIDTH + (x + gx)] = editor.guiClipBuffer[gtc++];
		}
	}

	editor.modFlag = true;
};

static loadGuiFile() {
	var jObj = parse.jsonDecode(parse.fileData.readUTFBytes(parse.fileData.length), "ALL");
	if (jObj != null)
	{
		// Get interface size
		editor.editWidth = utils.int(jObj.GuiWidth);
		editor.editHeight = utils.int(jObj.GuiHeight);

		// Get text and color info
		var txt = jObj.Text;
		var cols = jObj.Color;

		// Copy text characters
		var sCursor = 0;
		for (var j = 0; j < editor.editHeight; )
		{
			var eCursor = txt.indexOf("\n", sCursor);
			if (eCursor == -1)
			break;

			if (eCursor - sCursor >= editor.editWidth)
			{
				for (var i = 0; i < editor.editWidth; i++)
					editor.editorChars.b[j * zzt.MAX_WIDTH + i] = txt.charCodeAt(sCursor + i);
				j++;
			}

			sCursor = ++eCursor;
		}

		// Copy colors
		sCursor = 0;
		var cColor = cols[sCursor++];
		var cLen = cols[sCursor++];
		for (j = 0; j < editor.editHeight; j++)
		{
			for (i = 0; i < editor.editWidth; i++)
			{
				if (cLen == 0)
				{
					cColor = cols[sCursor++];
					cLen = cols[sCursor++];
				}

				editor.editorAttrs.b[j * zzt.MAX_WIDTH + i] = cColor;
				cLen--;
			}
		}

		// Remove text and colors from properties dictionary
		delete jObj.Text;
		delete jObj.Color;

		// Maintain remaining dataset as text
		editor.propText = parse.jsonToText(jObj, true);

		// Redraw
		zzt.drawGuiLabel("MODFLAG", " ");
		editor.writeGuiTextEdit();
		editor.writeColorCursors();
		editor.modFlag = false;
	}
};

static saveGuiFile() {
	// First, build text record.
	var txt = "\n";
	for (var j = 0; j < editor.editHeight; j++)
	{
		for (var i = 0; i < editor.editWidth; i++)
		{
			var ec = editor.editorChars.b[j * zzt.MAX_WIDTH + i];
			txt += String.fromCharCode(ec);
		}

		txt += "\n";
	}

	// Next, build color record.
	var cols = [];
	var lastCol = 10000;
	var colCount = 0;
	for (j = 0; j < editor.editHeight; j++)
	{
		for (i = 0; i < editor.editWidth; i++)
		{
			var thisCol = editor.editorAttrs.b[j * zzt.MAX_WIDTH + i];
			if (thisCol != lastCol)
			{
				if (colCount > 0)
				{
					cols.push(lastCol);
					cols.push(colCount);
				}

				lastCol = thisCol;
				colCount = 1;
			}
			else
				colCount++;
		}

		if (colCount > 0)
		{
			cols.push(lastCol);
			cols.push(colCount);
			colCount = 0;
		}
	}

	// Create dictionary from properties, text, and colors
	var jObj = parse.jsonDecode(editor.propText, "ALL");
	jObj["Text"] = txt;
	jObj["Color"] = cols;

	// Data is ready; show save dialog.
	var fileName = parse.lastFileName;
	if (!utils.endswith(fileName, ".ZZTGUI"))
		fileName = ".ZZTGUI";

	parse.saveLocalFile(fileName, zzt.MODE_SAVEGUI, zzt.MODE_NORM, parse.jsonToText(jObj));
	editor.modFlag = false;
	zzt.drawGuiLabel("MODFLAG", " ");
};

static initEditor() {
	if (editor.bBuffer == null)
	{
		// First time creation of back buffer creates empties
		editor.bBuffer = [];
		for (var i = 0; i < editor.MAX_BBUFFER; i++)
			editor.bBuffer.push([0, 15, 0, null]);
	}

	// Initialize editor per chosen style
	editor.cursorActive = true;
	editor.quitAfterSave = false;
	editor.blinkFlag = false;
	editor.drawFlag = editor.DRAW_OFF;
	editor.acquireMode = false;
	editor.bufLockMode = false;
	editor.selBuffer = [];
	editor.anchorX = -1;
	zzt.typeList[zzt.invisibleType].CHAR = 176;
	zzt.typeList[zzt.bEdgeType].CHAR = 69;

	switch (editor.editorStyle) {
		case editor.EDSTYLE_ULTRA:
			interp.typeTrans[19] = zzt.waterType;
			zzt.typeList[zzt.bearType].CHAR = 153;
			zzt.typeList[zzt.bearType].COLOR = 6;
			editor.maxStats = 9999;
			editor.patternBuiltIn = 6;
			if (editor.actualBBLen == 1)
				editor.actualBBLen = 10;
		break;
		case editor.EDSTYLE_KEVEDIT:
			interp.typeTrans[19] = zzt.waterType;
			zzt.typeList[zzt.bearType].CHAR = 153;
			zzt.typeList[zzt.bearType].COLOR = 6;
			editor.maxStats = 151;
			editor.patternBuiltIn = 6;
			if (editor.actualBBLen == 1)
				editor.actualBBLen = 10;
		break;
		case editor.EDSTYLE_CLASSIC:
			interp.typeTrans[19] = zzt.waterType;
			zzt.typeList[zzt.bearType].CHAR = 153;
			zzt.typeList[zzt.bearType].COLOR = 6;
			editor.defColorMode = true;
			editor.maxStats = 151;
			editor.patternBuiltIn = 5;
			editor.actualBBLen = 1;
			editor.bgColorCursor = 0;
			editor.patternCursor = 0;
			editor.patternBBCursor = 0;
		break;
		case editor.EDSTYLE_SUPERZZT:
			interp.typeTrans[19] = zzt.lavaType;
			zzt.typeList[zzt.bearType].CHAR = 235;
			zzt.typeList[zzt.bearType].COLOR = 2;
			editor.defColorMode = true;
			editor.maxStats = 129;
			editor.patternBuiltIn = 5;
			editor.actualBBLen = 1;
			editor.patternCursor = 0;
			editor.patternBBCursor = 0;
		break;
	}
};

static getPrettyColorName(color) {
	if (color < 0 && color >= 16)
		return "        ";
	return editor.prettyColorNames[color];
};

static getNamedStep(dx, dy) {
	if (dx == 0)
	{
		if (dy == -1)
			return (String.fromCharCode(24) + " NORTH");
		else if (dy == 1)
			return (String.fromCharCode(25) + " SOUTH");
		else if (dy == 0)
			return (String.fromCharCode(249) + " IDLE");
	}
	else if (dy == 0)
	{
		if (dx == -1)
			return (String.fromCharCode(27) + " WEST");
		else if (dx == 1)
			return (String.fromCharCode(26) + " EAST");
	}

	return "(Nonstandard)";
};

static clipCamera() {
	SE.CameraX = editor.origCameraX;
	SE.CameraY = editor.origCameraY;

	if (SE.CameraX + SE.vpWidth - 1 > editor.boardWidth)
		SE.CameraX = editor.boardWidth - SE.vpWidth + 1;
	if (SE.CameraX < 1)
		SE.CameraX = 1;

	if (SE.CameraY + SE.vpHeight - 1 > editor.boardHeight)
		SE.CameraY = editor.boardHeight - SE.vpHeight + 1;
	if (SE.CameraY < 1)
		SE.CameraY = 1;
};

static newWorldSetup() {
	// World properties
	zzt.globalProps["EVERPLAYED"] = 0;
	zzt.globalProps["WORLDTYPE"] = -3;
	zzt.globalProps["WORLDNAME"] = "Untitled";
	zzt.globalProps["LOCKED"] = 0;
	zzt.globalProps["NUMBOARDS"] = 1;
	zzt.globalProps["NUMBASECODEBLOCKS"] = interp.numBuiltInCodeBlocks;
	zzt.globalProps["NUMCLASSICFLAGS"] = 0;
	zzt.globalProps["CODEDELIMETER"] = "\n";
	zzt.globalProps["STARTBOARD"] = 0;
	zzt.globalProps["BOARD"] = -1;
	zzt.globalProps["AMMO"] = 0;
	zzt.globalProps["GEMS"] = 0;
	zzt.globalProps["HEALTH"] = 100;
	zzt.globalProps["TORCHES"] = 0;
	zzt.globalProps["SCORE"] = 0;
	zzt.globalProps["TIME"] = 0;
	zzt.globalProps["Z"] = 0;
	zzt.globalProps["TORCHCYCLES"] = 0;
	zzt.globalProps["ENERGIZERCYCLES"] = 0;
	zzt.globalProps["KEY8"] = 0;
	zzt.globalProps["KEY9"] = 0;
	zzt.globalProps["KEY10"] = 0;
	zzt.globalProps["KEY11"] = 0;
	zzt.globalProps["KEY12"] = 0;
	zzt.globalProps["KEY13"] = 0;
	zzt.globalProps["KEY14"] = 0;
	zzt.globalProps["KEY15"] = 0;

	// Sounds
	for (var k in ZZTProp.defaultSoundFx)
		zzt.soundFx[k] = ZZTProp.defaultSoundFx[k];

	// Board properties
	editor.boardWidth = 60;
	editor.boardHeight = 25;
	var totalSquares = editor.boardWidth * editor.boardHeight;
	editor.newBoardSetup();

	// Storage
	var thisBoard = new ZZTBoard();
	ZZTLoader.extraMasks = {};
	ZZTLoader.extraSoundFX = {};
	ZZTLoader.boardData = [thisBoard];
	thisBoard.props = zzt.boardProps;
	thisBoard.statElementCount = 0;
	thisBoard.statLessCount = 0;
	thisBoard.statElem = zzt.statElem;
	thisBoard.playerSE = null;
	thisBoard.typeBuffer = new ByteArray(totalSquares);
	thisBoard.colorBuffer = new ByteArray(totalSquares);
	thisBoard.lightBuffer = new ByteArray(totalSquares);
	thisBoard.regions = {};
	zzt.regions = thisBoard.regions;
	thisBoard.saveStamp = "init";
	thisBoard.boardIndex = 0;
	thisBoard.saveIndex = 0;
	thisBoard.saveType = -1;
};

static newBoardSetup(srcboardProps=null) {
	var boardProps = srcboardProps;
	if (boardProps == null)
		boardProps = zzt.boardProps;

	// Board properties
	boardProps["EXITNORTH"] = 0;
	boardProps["EXITSOUTH"] = 0;
	boardProps["EXITWEST"] = 0;
	boardProps["EXITEAST"] = 0;
	boardProps["SIZEX"] = editor.boardWidth;
	boardProps["SIZEY"] = editor.boardHeight;
	boardProps["MESSAGE"] = "";
	boardProps["MAXPLAYERSHOTS"] = 255;
	boardProps["CURPLAYERSHOTS"] = 0;
	boardProps["ISDARK"] = 0;
	boardProps["RESTARTONZAP"] = 0;
	boardProps["BOARDNAME"] = "Title Screen";
	boardProps["FROMPASSAGEHACK"] = 0;
	boardProps["PLAYERCOUNT"] = 0;
	boardProps["PLAYERENTERX"] = 1;
	boardProps["PLAYERENTERY"] = 1;
	boardProps["CAMERAX"] = 1;
	boardProps["CAMERAY"] = 1;
	boardProps["TIMELIMIT"] = 0;

	// Grid
	if (srcboardProps == null)
	{
		ZZTLoader.setUpGrid(editor.boardWidth, editor.boardHeight);
		for (var y = 1; y <= editor.boardHeight; y++) {
			for (var x = 1; x <= editor.boardWidth; x++) {
				SE.setType(x, y, 0);
				SE.setColor(x, y, 15, false);
				SE.setStatElemAt(x, y, null);
			}
		}

		zzt.statElem.splice(0, zzt.statElem.length);
	}
};

static addNewBoard() {
	editor.modFlag = true;
	var thisBoard = new ZZTBoard();
	ZZTLoader.boardData.push(thisBoard);

	thisBoard.props = {};
	editor.newBoardSetup(thisBoard.props);
	thisBoard.props["BOARDNAME"] = "Untitled";

	var totalSquares = editor.boardWidth * editor.boardHeight;
	thisBoard.statElem = [];
	thisBoard.statElementCount = 0;
	thisBoard.statLessCount = 0;
	thisBoard.playerSE = null;
	thisBoard.typeBuffer = new ByteArray(totalSquares);
	thisBoard.colorBuffer = new ByteArray(totalSquares);
	thisBoard.lightBuffer = new ByteArray(totalSquares);
	thisBoard.regions = {};
	thisBoard.saveStamp = "init";
	thisBoard.boardIndex = 0;
	thisBoard.saveIndex = 0;
	thisBoard.saveType = -1;

	for (var i = 0; i < totalSquares; i++) {
		thisBoard.typeBuffer.b[i] = 0;
		thisBoard.colorBuffer.b[i] = 15;
		thisBoard.lightBuffer.b[i] = 0;
	}

	zzt.globalProps["NUMBOARDS"] += 1;
};

static adjustBoardNum(cont, key, delBoardNum) {
	if (cont[key] >= delBoardNum)
		cont[key] -= 1;
};

static deleteBoard(delBoardNum) {
	if (delBoardNum == 0)
		return false; // Can't remove title screen--need at least one board!

	// Save current board info; move current board to before the shift position.
	editor.modFlag = true;
	ZZTLoader.registerBoardState(true);
	if (zzt.globalProps["BOARD"] >= delBoardNum)
		zzt.globalProps["BOARD"] = 0;

	// Get rid of old board.
	ZZTLoader.boardData.splice(delBoardNum, 1);
	zzt.globalProps["NUMBOARDS"] -= 1;

	// Reconcile board links.  This includes start board, edge links, and passage links.
	editor.adjustBoardNum(zzt.globalProps, "STARTBOARD", delBoardNum);

	for (var i = 0; i < zzt.globalProps["NUMBOARDS"]; i++) {
		var bd = ZZTLoader.boardData[i];
		var bp = bd.props;

		editor.adjustBoardNum(bp, "EXITNORTH", delBoardNum);
		editor.adjustBoardNum(bp, "EXITSOUTH", delBoardNum);
		editor.adjustBoardNum(bp, "EXITEAST", delBoardNum);
		editor.adjustBoardNum(bp, "EXITWEST", delBoardNum);

		for (var j = 0; j < bd.statElem.length; j++) {
			var se = bd.statElem[j];
			if (zzt.typeList[se.TYPE].NUMBER == 11)
				editor.adjustBoardNum(se.extra, "P3", delBoardNum);
		}
	}

	// Show current board.
	i = zzt.globalProps["BOARD"];
	ZZTLoader.updateContFromBoard(i, ZZTLoader.boardData[i]);
	SE.IsDark = 0;
	editor.boardWidth = zzt.boardProps["SIZEX"];
	editor.boardHeight = zzt.boardProps["SIZEY"];
	editor.editorCursorX = 1;
	editor.editorCursorY = 1;
	SE.CameraX = 1;
	SE.CameraY = 1;
	zzt.mainMode = zzt.MODE_SCROLLCLOSE;
	zzt.establishGui(zzt.prefEditorGui);
	editor.updateEditorView(false);
	editor.cursorActive = true;

	return true;
};

static dispatchEditorMenu(msg, handleSpecGui=true) {
	if (handleSpecGui)
	{
		switch (zzt.thisGuiName) {
			case "ED_CHAREDIT":
				editor.dispatchCharEditMenu(msg);
			return;
			case "ED_GRADIENT2":
				editor.dispatchGradientMenu(msg);
			return;
			case "ED_TYPEALL":
				editor.dispatchTypeAllMenu(msg);
			return;
			case "ED_F1":
				editor.dispatchF1Menu(msg);
			return;
			case "ED_F2":
				editor.dispatchF2Menu(msg);
			return;
			case "ED_F3":
				editor.dispatchF3Menu(msg);
			return;
			case "ED_F4":
				editor.dispatchF4Menu(msg);
			return;
			case "ED_F5":
				editor.dispatchF5Menu(msg);
			return;
		}
	}

	var x;
	var y;
	var i;
	var relSE;
	var rKey;
	var rObj;
	switch (msg) {
		// High-level
		case "ED_SHOWULTRA1":
			zzt.establishGui("ED_ULTRA1");
			editor.updateEditorView(true);
		break;
		case "ED_SHOWULTRA2":
			zzt.establishGui("ED_ULTRA2");
			editor.updateEditorView(true);
		break;
		case "ED_SHOWULTRA3":
			zzt.establishGui("ED_ULTRA3");
			editor.updateEditorView(true);
		break;
		case "ED_SHOWULTRA4":
			zzt.establishGui("ED_ULTRA4");
			editor.updateEditorView(true);
		break;
		case "ED_SWAPED":
			if (++editor.editorStyle > 3)
				editor.editorStyle = 0;
			zzt.prefEditorGui = editor.editorDefaultGuis[editor.editorStyle];
			editor.initEditor();
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(true);
		break;
		case "ED_NEW":
			zzt.confMessage("CONFMESSAGE", " Make new world?    ",
				"ED_REALLYNEW", "ED_CANCEL", "ED_CANCEL");
		break;
		case "ED_REALLYNEW":
			editor.newWorldSetup();
			editor.updateEditorView(false);
			zzt.globalProps["BOARD"] = 0;
			editor.modFlag = false;
		break;
		case "ED_CLEAR":
			zzt.confMessage("CONFMESSAGE", " Clear board?       ",
			"ED_REALLYCLEAR", "ED_CANCEL", "ED_CANCEL");
		break;
		case "ED_REALLYCLEAR":
			editor.newBoardSetup();
			editor.updateEditorView(false);
			editor.modFlag = true;
		break;
		case "ED_LOAD":
			editor.loadWorldScroll();
		break;
		case "ED_SAVE":
			editor.quitAfterSave = false;
			editor.saveWorldScroll();
		break;
		case "ED_HELP":
			editor.showHelp();
		break;
		case "ED_HELPEDITOR":
			editor.editedPropName = "";
			editor.showCodeInterface(editor.oldHlpStr);
		break;
		case "ED_QUIT":
			if (editor.selBuffer.length > 0)
			{
				editor.anchorX = -1;
				editor.selBuffer = [];
				editor.updateEditorView(false);
			}
			else if (editor.drawFlag == editor.DRAW_TEXT)
			{
				editor.drawFlag = editor.DRAW_OFF;
				editor.drawEditorPatternCursor();
			}
			else if (editor.modFlag)
				zzt.confMessage("CONFMESSAGE", " Save First?        ",
				"ED_SAVEANDQUIT", "ED_REALLYQUIT", "ED_CANCELQUIT");
			else
				editor.dispatchEditorMenu("ED_REALLYQUIT");
		break;
		case "ED_REALLYQUIT":
			SE.vpWidth = 60;
			SE.vpX1 = 60;
			SE.vpHeight = 25;
			SE.vpY1 = 25;
			zzt.typeList[zzt.bEdgeType].CHAR = 32;
			zzt.typeList[zzt.invisibleType].CHAR = 0;
			zzt.mainMode = zzt.MODE_NORM;
			zzt.inEditor = false;
			editor.hexTextEntry = 0;
			zzt.establishGui("DEBUGMENU");
			zzt.drawGui();
		break;
		case "ED_SAVEANDQUIT":
			editor.quitAfterSave = true;
			editor.saveWorldScroll();
		break;
		case "ED_TRANSFER":
			editor.quitAfterSave = false;
			editor.showTransferScroll();
			editor.cursorActive = false;
		break;
		case "ED_RUN":
			/*if (modFlag)
			{
			showEditorScroll(
			["$You must save", "$before performing a quick run."],
			"Save needed", 0);
			}
			else
			{
			// TBD
			parse.loadingSuccess = true;
			set parse.fileData
			}*/
		break;
		case "ED_CHAREDIT":
			editor.cursorActive = false;
			zzt.establishGui("ED_CHAREDIT");
			zzt.inCharEdit = true;
			editor.updateEditorView(true);
			editor.showCharEditor(true);
		break;

		// Cancellation
		case "ED_CANCELQUIT":
			editor.cursorActive = true;
			editor.updateEditorView(true);
		break;
		case "ED_CANCELTYPE":
		case "ED_CANCELALLTYPE":
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(true);
		break;
		case "ED_CANCELGRADIENT":
			editor.selBuffer = [];
			editor.anchorX = -1;
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
		break;

		// Info menus
		case "ED_WORLD":
			editor.cursorActive = false;
			zzt.establishGui("ED_SCROLLEDIT");
			zzt.drawGui();
			editor.showWorldInfo();
		break;
		case "ED_INFO":
			editor.cursorActive = false;
			zzt.establishGui("ED_SCROLLEDIT");
			zzt.drawGui();
			editor.showBoardInfo();
		break;
		case "ED_OBJEDIT":
			parse.loadLocalFile("ZZL", zzt.MODE_LOADZZL);
		break;
		case "ED_STATELEM":
			editor.modFlag = true;
			editor.cursorActive = false;
			zzt.establishGui("ED_STATEDIT");
			zzt.drawGui();
			editor.showStatScroll();
		break;
		case "ED_TILEINFO":
			editor.modFlag = true;
			editor.cursorActive = false;
			SE.displaySquare(editor.editorCursorX, editor.editorCursorY);
			editor.showTileScroll();
		break;
		case "ED_HIDDENOBJ":
			editor.showHiddenObj();
		break;

		// Regions
		case "ED_REGION":
			if (editor.anchorX != -1)
			{
				// Create new region at selection
				editor.modFlag = true;
				editor.editedPropName = "";
				zzt.drawGuiLabel("FILEMESSAGE", " New Region:        ");
				zzt.textEntry("FILEENTRY", "", 20, 15, "ED_NEWREGIONUPDATE", "ED_REGIONCANCEL");
			}
			else
			{
				editor.editedPropName = "";
				for (rKey in zzt.regions) {
					rObj = zzt.regions[rKey];
					if (editor.editorCursorX >= rObj[0][0] && editor.editorCursorX <= rObj[1][0] &&
						editor.editorCursorY >= rObj[0][1] && editor.editorCursorY <= rObj[1][1])
					{
						// Edit existing region
						editor.modFlag = true;
						editor.editedPropName = rKey;
						zzt.drawGuiLabel("FILEMESSAGE", " Region Name:       ");
						zzt.textEntry("FILEENTRY", rKey, 20, 15, "ED_REGIONUPDATE", "ED_REGIONCANCEL");
						break;
					}
				}

				if (editor.editedPropName == "")
				{
					// Show all region selections
					zzt.drawGuiLabel("FILEMESSAGE", " No Regions Defined ", 27);
					for (rKey in zzt.regions) {
						rObj = zzt.regions[rKey];
						zzt.mg.writeXorAttr(rObj[0][0] - SE.CameraX + SE.vpX0 - 1,
						rObj[0][1] - SE.CameraY + SE.vpY0 - 1,
						rObj[1][0] - rObj[0][0] + 1, rObj[1][1] - rObj[0][1] + 1, 127);
						zzt.drawGuiLabel("FILEMESSAGE", " Regions Shown      ", 27);
					}
				}
			}
		break;
		case "ED_NEWREGIONUPDATE":
			editor.modFlag = true;
			if (zzt.textChars != "")
			{
				rObj = [
					[(editor.anchorX < editor.editorCursorX) ? editor.anchorX : editor.editorCursorX,
					(editor.anchorY < editor.editorCursorY) ? editor.anchorY : editor.editorCursorY],
					[(editor.anchorX >= editor.editorCursorX) ? editor.anchorX : editor.editorCursorX,
					(editor.anchorY >= editor.editorCursorY) ? editor.anchorY : editor.editorCursorY],
				];
				zzt.regions[zzt.textChars] = rObj;
			}

			editor.selBuffer = [];
			editor.anchorX = -1;
			editor.updateEditorView(false);
		break;
		case "ED_REGIONUPDATE":
			editor.modFlag = true;
			if (zzt.textChars == "")
				delete zzt.regions[editor.editedPropName];
			else if (zzt.textChars != editor.editedPropName)
			{
				zzt.regions[zzt.textChars] = zzt.regions[editor.editedPropName];
				delete zzt.regions[editor.editedPropName];
			}

			editor.selBuffer = [];
			editor.anchorX = -1;
			editor.updateEditorView(false);
		break;
		case "ED_REGIONCANCEL":
			editor.selBuffer = [];
			editor.anchorX = -1;
			editor.updateEditorView(false);
		break;

		// Board change
		case "ED_BOARD":
			editor.cursorActive = false;
			zzt.establishGui("ED_DELEDIT");
			zzt.drawGui();
			editor.boardSelectAction = editor.BSA_SWITCHBOARD;
			editor.showBoardScroll(zzt.globalProps["BOARD"]);
		break;
		case "ED_BOARDPREV":
			ZZTLoader.registerBoardState(true);
			i = zzt.globalProps["BOARD"] - 1;
			if (i < 0)
				i = zzt.globalProps["NUMBOARDS"] - 1;
			zzt.globalProps["BOARD"] = i;

			x = zzt.boardProps["SIZEX"];
			y = zzt.boardProps["SIZEY"];
			editor.origCameraX = SE.CameraX;
			editor.origCameraY = SE.CameraY;

			ZZTLoader.updateContFromBoard(i, ZZTLoader.boardData[i]);
			SE.IsDark = 0;
			editor.boardWidth = zzt.boardProps["SIZEX"];
			editor.boardHeight = zzt.boardProps["SIZEY"];
			if (editor.boardWidth != x || editor.boardHeight != y)
			{
				editor.editorCursorX = 1;
				editor.editorCursorY = 1;
				SE.CameraX = 1;
				SE.CameraY = 1;
			}

			editor.clipCamera();
			editor.updateEditorView(false);
		break;
		case "ED_BOARDNEXT":
			ZZTLoader.registerBoardState(true);
			i = zzt.globalProps["BOARD"] + 1;
			if (i >= zzt.globalProps["NUMBOARDS"])
				i = 0;
			zzt.globalProps["BOARD"] = i;

			x = zzt.boardProps["SIZEX"];
			y = zzt.boardProps["SIZEY"];
			editor.origCameraX = SE.CameraX;
			editor.origCameraY = SE.CameraY;
			ZZTLoader.updateContFromBoard(i, ZZTLoader.boardData[i]);
			SE.IsDark = 0;
			editor.boardWidth = zzt.boardProps["SIZEX"];
			editor.boardHeight = zzt.boardProps["SIZEY"];
			if (editor.boardWidth != x || editor.boardHeight != y)
			{
				editor.editorCursorX = 1;
				editor.editorCursorY = 1;
				SE.CameraX = 1;
				SE.CameraY = 1;
			}

			editor.clipCamera();
			editor.updateEditorView(false);
		break;

		// Movement and selection
		case "ED_LEFT":
			editor.anchorX = -1;
			editor.eraseEditorCursor();
			if (--editor.editorCursorX <= 0)
				editor.editorCursorX = editor.boardWidth;
			editor.spotPlace(true);
			editor.drawEditorCursor();
		break;
		case "ED_RIGHT":
			editor.anchorX = -1;
			editor.eraseEditorCursor();
			if (++editor.editorCursorX > editor.boardWidth)
				editor.editorCursorX = 1;
			editor.spotPlace(true);
			editor.drawEditorCursor();
		break;
		case "ED_UP":
			editor.anchorX = -1;
			editor.eraseEditorCursor();
			if (--editor.editorCursorY <= 0)
				editor.editorCursorY = editor.boardHeight;
			editor.spotPlace(true);
			editor.drawEditorCursor();
		break;
		case "ED_DOWN":
			editor.anchorX = -1;
			editor.eraseEditorCursor();
			if (++editor.editorCursorY > editor.boardHeight)
				editor.editorCursorY = 1;
			editor.spotPlace(true);
			editor.drawEditorCursor();
		break;
		case "ED_LEFTSUPER":
			editor.anchorX = -1;
			editor.eraseEditorCursor();
			editor.editorCursorX -= 10;
			if (editor.editorCursorX <= 0)
				editor.editorCursorX = 1;
			editor.spotPlace(true);
			editor.drawEditorCursor();
		break;
		case "ED_RIGHTSUPER":
			editor.anchorX = -1;
			editor.eraseEditorCursor();
			editor.editorCursorX += 10;
			if (editor.editorCursorX > editor.boardWidth)
				editor.editorCursorX = editor.boardWidth;
			editor.spotPlace(true);
			editor.drawEditorCursor();
		break;
		case "ED_UPSUPER":
			editor.anchorX = -1;
			editor.eraseEditorCursor();
			editor.editorCursorY -= 10;
			if (editor.editorCursorY <= 0)
				editor.editorCursorY = 1;
			editor.spotPlace(true);
			editor.drawEditorCursor();
		break;
		case "ED_DOWNSUPER":
			editor.anchorX = -1;
			editor.eraseEditorCursor();
			editor.editorCursorY += 10;
			if (editor.editorCursorY > editor.boardHeight)
				editor.editorCursorY = editor.boardHeight;
			editor.spotPlace(true);
			editor.drawEditorCursor();
		break;
		case "ED_SELLEFT":
			if (editor.anchorX == -1)
			{
				editor.anchorX = editor.editorCursorX;
				editor.anchorY = editor.editorCursorY;
			}
			else
				editor.removeRectSel();

			editor.eraseEditorCursor();
			if (--editor.editorCursorX <= 0)
				editor.editorCursorX = editor.boardWidth;
			editor.addToRectSel();
		break;
		case "ED_SELRIGHT":
			if (editor.anchorX == -1)
			{
				editor.anchorX = editor.editorCursorX;
				editor.anchorY = editor.editorCursorY;
			}
			else
				editor.removeRectSel();

			editor.eraseEditorCursor();
			if (++editor.editorCursorX > editor.boardWidth)
				editor.editorCursorX = 1;
			editor.addToRectSel();
		break;
		case "ED_SELUP":
			if (editor.anchorX == -1)
			{
				editor.anchorX = editor.editorCursorX;
				editor.anchorY = editor.editorCursorY;
			}
			else
				editor.removeRectSel();

			editor.eraseEditorCursor();
			if (--editor.editorCursorY <= 0)
				editor.editorCursorY = editor.boardHeight;
			editor.addToRectSel();
		break;
		case "ED_SELDOWN":
			if (editor.anchorX == -1)
			{
				editor.anchorX = editor.editorCursorX;
				editor.anchorY = editor.editorCursorY;
			}
			else
				editor.removeRectSel();

			editor.eraseEditorCursor();
			if (++editor.editorCursorY > editor.boardHeight)
				editor.editorCursorY = 1;
			editor.addToRectSel();
		break;

		// Mode change
		case "ED_DRAWING":
			editor.hexTextEntry = 0;
			if (editor.drawFlag == editor.DRAW_OFF)
			{
				editor.drawFlag = editor.DRAW_ON;
				editor.spotPlace(true);
			}
			else
				editor.drawFlag = editor.DRAW_OFF;

			editor.drawEditorPatternCursor();
		break;
		case "ED_DRAWINGCYCLE":
			editor.hexTextEntry = 0;
			if (editor.drawFlag == editor.DRAW_ACQBACK)
				editor.drawFlag = editor.DRAW_ACQFORWARD;
			else
				editor.drawFlag = editor.DRAW_ACQBACK;

			editor.spotPlace(true);
			editor.drawEditorPatternCursor();
		break;
		case "ED_TEXT":
			editor.hexTextEntry = 0;
			if (editor.drawFlag == editor.DRAW_TEXT)
				editor.drawFlag = editor.DRAW_OFF;
			else
				editor.drawFlag = editor.DRAW_TEXT;

			editor.drawEditorPatternCursor();
		break;
		case "ED_ACQUIRE":
			editor.acquireMode = !editor.acquireMode;
			editor.drawEditorPatternCursor();
		break;
		case "ED_BLINK":
			editor.blinkFlag = !editor.blinkFlag;
			editor.drawEditorPatternCursor();
		break;
		case "ED_DEFAULTCOLOR":
			editor.defColorMode = !editor.defColorMode;
			editor.drawEditorPatternCursor();
		break;
		case "ED_AESTHETIC":
			// TBD
		break;

		// Spot editing
		case "ED_PLACE":
			editor.spotPlace(false);
		break;
		case "ED_DELETE":
			editor.modFlag = true;
			editor.killSE(editor.editorCursorX, editor.editorCursorY);
			SE.setType(editor.editorCursorX, editor.editorCursorY, 0);
			SE.setColor(editor.editorCursorX, editor.editorCursorY, 15, false);
			SE.displaySquare(editor.editorCursorX, editor.editorCursorY);
		break;
		case "ED_PICKUP":
			editor.pickupCursor();
			editor.updateEditorView(true);
			if (editor.immType[3] != null)
			{
				editor.modFlag = true;
				zzt.establishGui("ED_STATEDIT");
				zzt.drawGui();
				editor.editStatElem();
				editor.drawEditorPatternCursor();
				editor.drawEditorColorCursors();
			}
		break;
		case "ED_PICKUPNOEDIT":
			editor.pickupCursor();
			editor.updateEditorView(true);
		break;

		// Color/pattern selection
		case "ED_PATTERN":
			if (editor.patternCursor == -1)
			{
				if (++editor.patternBBCursor >= editor.actualBBLen)
				{
					editor.patternBBCursor = 0;
					editor.patternCursor = 0;
				}
			}
			else
			{
				if (++editor.patternCursor >= editor.patternBuiltIn)
				{
					editor.patternCursor = -1;
					editor.patternBBCursor = 0;
				}
			}

			editor.drawEditorPatternCursor();
		break;
		case "ED_REVPATTERN":
			if (editor.patternCursor == -1)
			{
				if (--editor.patternBBCursor < 0)
				{
					editor.patternBBCursor = 0;
					editor.patternCursor = editor.patternBuiltIn - 1;
				}
			}
			else
			{
				if (--editor.patternCursor < 0)
				{
					editor.patternCursor = -1;
					editor.patternBBCursor = editor.actualBBLen - 1;
				}
			}

			editor.drawEditorPatternCursor();
		break;
		case "ED_COLOR":
			switch (editor.editorStyle) {
				case editor.EDSTYLE_ULTRA:
				case editor.EDSTYLE_KEVEDIT:
				case editor.EDSTYLE_SUPERZZT:
					if (++editor.fgColorCursor >= 16)
					editor.fgColorCursor = 0;
				break;
				case editor.EDSTYLE_CLASSIC:
					if (++editor.fgColorCursor >= 16)
						editor.fgColorCursor = 9;
				break;
			}

			editor.drawEditorColorCursors();
		break;
		case "ED_COLOR2":
			switch (editor.editorStyle) {
				case editor.EDSTYLE_ULTRA:
				case editor.EDSTYLE_KEVEDIT:
				case editor.EDSTYLE_SUPERZZT:
					if (++editor.bgColorCursor >= 8)
						editor.bgColorCursor = 0;
				break;
				case editor.EDSTYLE_CLASSIC:
					if (--editor.fgColorCursor < 9)
						editor.fgColorCursor = 15;
				break;
			}

			editor.drawEditorColorCursors();
		break;
		case "ED_SWITCHCOLOR":
			editor.fgColorCursor = editor.fgColorCursor ^ 8;
			editor.drawEditorColorCursors();
		break;
		case "ED_KOLOR":
			editor.oldFgColorCursor = editor.fgColorCursor;
			editor.oldBgColorCursor = editor.bgColorCursor;
			editor.cursorActive = false;
			zzt.mainMode = zzt.MODE_COLORSEL;
			zzt.establishGui("ED_COLORS");
			for (y = 1; y <= 8; y++) {
				zzt.GuiTextLines[y] = String.fromCharCode(179);
				for (x = 1; x <= 32; x++) {
					zzt.GuiTextLines[y] += String.fromCharCode(254);
				}
				zzt.GuiTextLines[y] += String.fromCharCode(179);
			}
			zzt.drawGui();
			editor.drawKolorCursor(true);
		break;
		case "ED_BIT7TOGGLE":
			zzt.globalProps["BIT7ATTR"] = CellGrid.blinkBitUsed ? 0 : 1;
			zzt.mg.updateBit7Meaning(zzt.globalProps["BIT7ATTR"]);
		break;
		case "ED_TEXTSPECCHAR":
			editor.selectCharDialog();
		break;

		case "ED_HEXTEXT":
			editor.hexTextEntry = 1;
			editor.drawEditorPatternCursor();
		break;
		case "ED_COLORCANCEL":
			editor.fgColorCursor = editor.oldFgColorCursor;
			editor.bgColorCursor = editor.oldBgColorCursor;
		case "ED_COLORSEL":
			if (editor.scrollMode == editor.SM_STATINFO)
			{
				SE.setColor(editor.editorCursorX, editor.editorCursorY,
				editor.fgColorCursor + (editor.bgColorCursor * 16) + (editor.blinkFlag ? 128 : 0), false);
				editor.showTileScroll();
			}
			else if (editor.scrollMode == editor.SM_UNDERCOLOR)
			{
				relSE = SE.getStatElemAt(editor.editorCursorX, editor.editorCursorY);
				relSE.UNDERCOLOR = editor.fgColorCursor + (editor.bgColorCursor * 16) + (editor.blinkFlag ? 128 : 0);
				editor.showTileScroll();
			}
			else if (editor.scrollMode == editor.SM_GUITEXT)
			{
				zzt.inEditor = false;
				zzt.establishGui("EDITGUITEXT");
				zzt.mg.writeConst(0, 0, zzt.CHARS_WIDTH, zzt.CHARS_HEIGHT, " ", 31);
				zzt.drawGui();
				editor.writeColorCursors();
				editor.writeGuiTextEdit();
				editor.writeGuiTextEditLabels();
				zzt.mainMode = zzt.MODE_NORM;
				editor.scrollMode = 0;
			}
			else
			{
				editor.cursorActive = true;
				zzt.establishGui(zzt.prefEditorGui);
				editor.updateEditorView(false);
				zzt.mainMode = zzt.MODE_NORM;
			}
		break;
		case "ED_CHARSEL":
			if (editor.editedPropName == "CHAR")
			{
				relSE = editor.immType[3];
				relSE.extra["CHAR"] = editor.hexCodeValue;
				editor.immType[0] = editor.hexCodeValue;
				editor.spotPlace(false, true);
				editor.add2BBuffer(false);

				zzt.establishGui("ED_STATEDIT");
				editor.updateEditorView(false);
				zzt.drawGui();
				editor.editStatElem();
				editor.drawEditorPatternCursor();
				editor.drawEditorColorCursors();
				break;
			}

			editor.writeTextDrawChar(editor.hexCodeValue);
		case "ED_CHARCANCEL":
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
			zzt.mainMode = zzt.MODE_NORM;
		break;

		// Back buffer
		case "ED_BUF1":
			editor.setCustomPatternCursorPos(0);
		break;
		case "ED_BUF2":
			editor.setCustomPatternCursorPos(1);
		break;
		case "ED_BUF3":
			editor.setCustomPatternCursorPos(2);
		break;
		case "ED_BUF4":
			editor.setCustomPatternCursorPos(3);
		break;
		case "ED_BUF5":
			editor.setCustomPatternCursorPos(4);
		break;
		case "ED_BUF6":
			editor.setCustomPatternCursorPos(5);
		break;
		case "ED_BUF7":
			editor.setCustomPatternCursorPos(6);
		break;
		case "ED_BUF8":
			editor.setCustomPatternCursorPos(7);
		break;
		case "ED_BUF9":
			editor.setCustomPatternCursorPos(8);
		break;
		case "ED_BUFINC":
			if (++editor.actualBBLen > editor.MAX_BBUFFER)
				editor.actualBBLen = editor.MAX_BBUFFER;

			editor.drawEditorPatternCursor();
		break;
		case "ED_BUFDEC":
			if (--editor.actualBBLen < 1)
				editor.actualBBLen = 1;

			editor.drawEditorPatternCursor();
		break;
		case "ED_BUFLOCK":
			editor.bufLockMode = !editor.bufLockMode;
			editor.drawEditorPatternCursor();
		break;
		case "ED_BUFEMPTY":
			switch (editor.editorStyle) {
				case editor.EDSTYLE_ULTRA:
				case editor.EDSTYLE_KEVEDIT:
					editor.patternCursor = 4;
				break;
				case editor.EDSTYLE_CLASSIC:
				case editor.EDSTYLE_SUPERZZT:
					editor.patternCursor = 3;
				break;
			}

			editor.drawEditorPatternCursor();
		break;

		// Type menus
		case "ED_ITEM":
			editor.cursorActive = false;
			zzt.establishGui("ED_F1");
			editor.updateEditorView(true);
		break;
		case "ED_CREATURE":
			editor.cursorActive = false;
			zzt.establishGui("ED_F2");
			editor.updateEditorView(true);
			zzt.drawGuiLabel("BEARCHAR",
			String.fromCharCode(zzt.typeList[zzt.bearType].CHAR),
			zzt.typeList[zzt.bearType].COLOR);
		break;
		case "ED_TERRAIN":
			editor.cursorActive = false;
			zzt.establishGui("ED_F3");
			editor.updateEditorView(true);
			zzt.drawGuiLabel("WATERLAVA",
				(editor.editorStyle == editor.EDSTYLE_SUPERZZT) ? "Lava " : "Water", 31);
			zzt.drawGuiLabel("WATERLAVACHAR",
				String.fromCharCode(zzt.typeList[interp.typeTrans[19]].CHAR),
			zzt.typeList[interp.typeTrans[19]].COLOR);
		break;
		case "ED_UGLIES":
			editor.cursorActive = false;
			zzt.establishGui("ED_F4");
			editor.updateEditorView(true);
		break;
		case "ED_TERRAIN2":
			editor.cursorActive = false;
			zzt.establishGui("ED_F5");
			editor.updateEditorView(true);
		break;
		case "ED_FLOOR":
			editor.cursorActive = false;
			editor.typeAllFilter = editor.TYPEFILTER_FLOOR;
			zzt.establishGui("ED_TYPEALL");
			editor.updateEditorView(true);
			editor.updateTypeAllView(true);
		break;
		case "ED_BLOCKING":
			editor.cursorActive = false;
			editor.typeAllFilter = editor.TYPEFILTER_BLOCKING;
			zzt.establishGui("ED_TYPEALL");
			editor.updateEditorView(true);
			editor.updateTypeAllView(true);
		break;
		case "ED_STATTYPES":
			editor.cursorActive = false;
			editor.typeAllFilter = editor.TYPEFILTER_STATTYPES;
			zzt.establishGui("ED_TYPEALL");
			editor.updateEditorView(true);
			editor.updateTypeAllView(true);
		break;

		// Copy and paste
		case "ED_CUT":
			editor.captureSel(true);
		break;
		case "ED_COPY":
			editor.captureSel(false);
		break;
		case "ED_PASTE":
			if (editor.clipBuffer.length > 0)
			{
				editor.editorCursorX = editor.clipX1;
				editor.editorCursorY = editor.clipY1;
				zzt.establishGui("ED_PASTE");
				editor.updatePasteView();
			}
		break;
		case "ED_REALLYPASTE":
			editor.pasteSel();
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
		break;
		case "ED_CANCELPASTE":
			editor.selBuffer = [];
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
		break;
		case "ED_PASTESELLEFT":
			if (--editor.editorCursorX <= 0)
				editor.editorCursorX = editor.boardWidth;
			editor.updatePasteView();
		break;
		case "ED_PASTESELRIGHT":
			if (++editor.editorCursorX > editor.boardWidth)
				editor.editorCursorX = 1;
			editor.updatePasteView();
		break;
		case "ED_PASTESELUP":
			if (--editor.editorCursorY <= 0)
				editor.editorCursorY = editor.boardHeight;
			editor.updatePasteView();
		break;
		case "ED_PASTESELDOWN":
			if (++editor.editorCursorY > editor.boardHeight)
				editor.editorCursorY = 1;
			editor.updatePasteView();
		break;

		// Fill operations
		case "ED_RANDOMFILL":
			if (editor.selBuffer.length > 0)
				editor.fillAction(editor.FILL_RANDOMPAINT);
			else
				editor.floodFill(editor.editorCursorX, editor.editorCursorY, editor.FILL_RANDOMPAINT);
		break;
		case "ED_FILL":
			if (editor.selBuffer.length > 0)
				editor.fillAction(editor.FILL_PAINT);
			else
				editor.floodFill(editor.editorCursorX, editor.editorCursorY, editor.FILL_PAINT);
		break;
		case "ED_FLOODSEL":
			if (editor.selBuffer.length > 0 && zzt.thisGuiName != "ED_GRADIENT")
				editor.fillAction(editor.FILL_SELECTION);
			else
				editor.floodFill(editor.editorCursorX, editor.editorCursorY, editor.FILL_SELECTION);
		break;
		case "ED_SELSIMILAR":
			editor.pickerSel(editor.editorCursorX, editor.editorCursorY);
		break;
		case "ED_GRADIENT":
			if (editor.selBuffer.length > 0)
				editor.dispatchGradientMenu("ED_GRADIENT2");
			else
			{
				zzt.establishGui("ED_GRADIENT");
				editor.updateEditorView(true);
			}
		break;
		case "ED_GRADIENT2":
			editor.dispatchGradientMenu("ED_GRADIENT2");
		break;

		// Miscellaneous
		case "ED_STATVALUPDATE":
			editor.modFlag = true;
			zzt.drawGuiLabel("FILEMESSAGE", "                    ", 31);
			zzt.drawGuiLabel("FILEENTRY", "                    ", 31);
			editor.updateStatVal();
		break;
		case "ED_STATVALCANCEL":
			zzt.drawGuiLabel("FILEMESSAGE", "                    ", 31);
			zzt.drawGuiLabel("FILEENTRY", "                    ", 31);
			editor.updateStatTypeInScroll();
		break;
		case "ED_BOARDPROPUPDATE":
			editor.modFlag = true;
			zzt.drawGuiLabel("FILEMESSAGE", "                    ", 31);
			zzt.drawGuiLabel("FILEENTRY", "                    ", 31);
			editor.updateBoardProp();
		break;
		case "ED_BOARDPROPCANCEL":
			zzt.drawGuiLabel("FILEMESSAGE", "                    ", 31);
			zzt.drawGuiLabel("FILEENTRY", "                    ", 31);
			editor.updateBoardProp();
		break;
		case "ED_WORLDPROPUPDATE":
			editor.modFlag = true;
			zzt.drawGuiLabel("FILEMESSAGE", "                    ", 31);
			zzt.drawGuiLabel("FILEENTRY", "                    ", 31);
			editor.updateWorldProp();
		break;
		case "ED_WORLDPROPCANCEL":
			zzt.drawGuiLabel("FILEMESSAGE", "                    ", 31);
			zzt.drawGuiLabel("FILEENTRY", "                    ", 31);
			editor.updateWorldProp();
		break;
		case "ED_GLOBALSUPDATE":
			editor.modFlag = true;
			zzt.drawGuiLabel("FILEMESSAGE", "                    ", 31);
			zzt.drawGuiLabel("FILEENTRY", "                    ", 31);
			editor.updateGlobals();
		break;
		case "ED_GLOBALSCANCEL":
			zzt.drawGuiLabel("FILEMESSAGE", "                    ", 31);
			zzt.drawGuiLabel("FILEENTRY", "                    ", 31);
			editor.updateGlobals();
		break;
		case "ED_ACCEPTEDITORPROP":
			editor.parseJSONProps();
		break;
	}
};

static uploadCharEditFile() {
	var ba = parse.fileData;
	if (ba != null)
	{
		var arr = interp.getFlatSequence(ba, true);
		editor.ceCharCount = utils.int(arr.length / (editor.ceCharHeight * 8));
		editor.ceCharNum = 0;
		if (editor.ceCharCount > 256)
			editor.ceCharCount = 256;

		zzt.csg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, editor.ceCharCount, 0, arr);
		zzt.cpg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, editor.ceCharCount, 0, arr);
		editor.showCharEditor(true);
	}
};

static dispatchCharEditMenu(msg) {
	var x;
	var y;
	var c = editor.ceMaskArray[editor.ceCharY * editor.ceCharWidth + editor.ceCharX];
	var a;

	switch (msg) {
		case "CE_EXIT":
			zzt.inCharEdit = false;
			zzt.cpg.visible = false;
			zzt.csg.visible = false;
			editor.cursorActive = true;
			editor.anchorX = -1;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
		break;
		case "CE_LOAD":
			editor.showEditorScroll(
				["!CE_LOADMASK;Mask or Lump", "!CE_LOADFILE;Binary File"],
				"Choose Character Set Source", editor.SM_CHAREDITLOAD);
		break;
		case "CE_LOADMASKYES":
			editor.handleClosedEditorScroll();
			a = interp.getFlatSequence(zzt.textChars, true);
			if (a != null)
			{
				editor.ceCharNum = 0;
				editor.ceCharCount = utils.int(a.length / (8 * editor.ceCharHeight));
				if (editor.ceCharCount > 256)
					editor.ceCharCount = 256;

				zzt.csg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, editor.ceCharCount, 0, a);
				zzt.cpg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, editor.ceCharCount, 0, a);
				editor.showCharEditor(true);
			}
		break;
		case "CE_SAVE":
			editor.ceStorage = [];
			for (c = 0; c < editor.ceCharCount; c++) {
				a = zzt.csg.getCurrentCharacterMask(c, 8);
				for (y = 0; y < a.length; y++)
					editor.ceStorage.push(a[y]);
			}

			editor.showEditorScroll(
				["!CE_SAVEMASK;To Mask", "!CE_SAVELUMP;To Lump", "!CE_SAVEFILE;To Binary File"],
				"Choose Save Destination", editor.SM_CHAREDITSAVE);
		break;
		case "CE_SAVELUMPYES":
			editor.handleClosedEditorScroll();
			parse.lastFileName = zzt.textChars;
			parse.fileData = interp.makeBitSequence(interp.getFlatSequence(editor.ceStorage));
			editor.uploadExtraLump(false);
		break;
		case "CE_SAVEMASKYES":
			editor.handleClosedEditorScroll();
			ZZTLoader.extraMasks[zzt.textChars] = editor.ceStorage;
		break;
		case "CE_LOADSAVECANCEL":
			editor.handleClosedEditorScroll();
		break;
		case "CE_APPLY":
			a = [];
			for (y = 0; y < editor.ceCharCount; y++) {
				a.push(zzt.csg.getCurrentCharacterMask(y));
			}

			zzt.mg.updateScanlineMode(editor.ceCharHeightMode);
			zzt.mg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, editor.ceCharCount, 0,
				interp.getFlatSequence(a));
			zzt.mg.createSurfaces(
				zzt.OverallSizeX, zzt.OverallSizeY, zzt.Viewport, true);
			zzt.cellYDiv = CellGrid.virtualCellYDiv;
			editor.showCharEditor(true);
		break;
		case "CE_RESET":
			zzt.confMessage("CONFMESSAGE", "Reset to default?",
				"CE_REALLYRESET", "CE_CANCEL", "CE_CANCEL");
		break;
		case "CE_REALLYRESET":
			zzt.mg.updateScanlineMode(editor.ceCharHeightMode);
			editor.ceCharCount = 256;
			editor.ceCharNum = 0;
			editor.ceCharX = 0;
			editor.ceCharY = 0;
			editor.dispatchCharEditMenu("CE_CLEAR");
			editor.showCharEditor(true);
		break;
		case "CE_CANCEL":
		break;
		case "CE_STARTMOUSEDRAW":
			editor.ceCharMouseMode = (c != 0) ? 0 : 1;
			// Intentional fallthrough
		case "CE_CONTINUEMOUSEDRAW":
			editor.ceMaskArray[editor.ceCharY * editor.ceCharWidth + editor.ceCharX] = editor.ceCharMouseMode;
			editor.updateCharFromMaskArray();
		break;
		case "CE_TOGGLEBIT":
			editor.ceMaskArray[editor.ceCharY * editor.ceCharWidth + editor.ceCharX] = (c != 0) ? 0 : 1;
			editor.updateCharFromMaskArray();
		break;
		case "CE_DRAWMODEBIT":
			if (editor.ceCharDrawMode != 0)
			{
				editor.ceMaskArray[editor.ceCharY * editor.ceCharWidth + editor.ceCharX] = editor.ceCharDrawMode - 1;
				editor.updateCharFromMaskArray();
			}
		break;
		case "CE_DRAWINGMODE":
			if (editor.ceCharDrawMode == 0)
			{
				editor.ceCharDrawMode = (c != 0) ? 1 : 2;
				zzt.drawGuiLabel("CONFMESSAGE",
					"Draw Mode:  " + ((editor.ceCharDrawMode == 1) ? "CLEAR" : "SET  ").toString());
				editor.dispatchCharEditMenu("CE_TOGGLEBIT");
			}
			else
			{
				editor.ceCharDrawMode = 0;
				zzt.drawGuiLabel("CONFMESSAGE", "Draw Mode:  " + "Off  ");
			}
		break;
		case "CE_COUNT":
			editor.modFlag = true;
			editor.editedPropName = "";
			zzt.textEntry("COUNTENTRY", editor.ceCharCount.toString(), 3, 15,
				"CE_COUNTSET", "CE_CANCEL");
		break;
		case "CE_COUNTSET":
			if (zzt.textChars != "")
			{
				editor.ceCharCount = utils.int0(zzt.textChars);
				if (editor.ceCharCount <= 0 || editor.ceCharCount > 256)
					editor.ceCharCount = 256;
			}
			editor.showCharEditor();
		break;
		case "CE_HEIGHT":
			editor.ceStorage = [];
			for (c = 0; c < 256; c++) {
				a = zzt.csg.getCurrentCharacterMask(c);
				for (y = 0; y < a.length; y++)
					editor.ceStorage.push(a[y]);
			}
			editor.savedCEStorage[editor.ceCharHeightMode] = editor.ceStorage;

			if (++editor.ceCharHeightMode > 2)
				editor.ceCharHeightMode = 0;
			switch (editor.ceCharHeightMode) {
				case 0:
					editor.ceCharHeight = 8;
				break;
				case 1:
					editor.ceCharHeight = 14;
				break;
				case 2:
					editor.ceCharHeight = 16;
				break;
			}

			zzt.mg.updateScanlineMode(editor.ceCharHeightMode);
			SE.mg.createSurfaces(
				zzt.OverallSizeX, zzt.OverallSizeY, zzt.Viewport, true);
			zzt.cellYDiv = 16;
			zzt.virtualCellYDiv = 16;

			if (editor.savedCEStorage[editor.ceCharHeightMode] != null)
			{
				zzt.cpg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, 256, 0,
					editor.savedCEStorage[editor.ceCharHeightMode]);
				zzt.csg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, 256, 0,
					editor.savedCEStorage[editor.ceCharHeightMode]);
			}

			editor.ceCharNum = 0;
			editor.ceCharX = 0;
			editor.ceCharY = 0;
			editor.showCharEditor(true);
			editor.dispatchCharEditMenu("CE_CLEAR");
		break;
		case "CE_ROTATELEFT":
			for (y = 0; y < editor.ceCharHeight; y++) {
				c = editor.ceMaskArray[y * editor.ceCharWidth + 0];
				for (x = 1; x < editor.ceCharWidth; x++) {
					editor.ceMaskArray[y * editor.ceCharWidth + x - 1] = editor.ceMaskArray[y * editor.ceCharWidth + x];
				}
				editor.ceMaskArray[y * editor.ceCharWidth + (editor.ceCharWidth - 1)] = c;
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_ROTATERIGHT":
			for (y = 0; y < editor.ceCharHeight; y++) {
				c = editor.ceMaskArray[y * editor.ceCharWidth + (editor.ceCharWidth - 1)];
				for (x = editor.ceCharWidth - 2; x >= 0; x--) {
					editor.ceMaskArray[y * editor.ceCharWidth + x + 1] = editor.ceMaskArray[y * editor.ceCharWidth + x];
				}
				editor.ceMaskArray[y * editor.ceCharWidth + 0] = c;
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_ROTATEUP":
			for (x = 0; x < editor.ceCharWidth; x++) {
				c = editor.ceMaskArray[(0) * editor.ceCharWidth + x];
				for (y = 1; y < editor.ceCharHeight; y++) {
					editor.ceMaskArray[(y - 1) * editor.ceCharWidth + x] = editor.ceMaskArray[y * editor.ceCharWidth + x];
				}
				editor.ceMaskArray[(editor.ceCharHeight - 1) * editor.ceCharWidth + x] = c;
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_ROTATEDOWN":
			for (x = 0; x < editor.ceCharWidth; x++) {
				c = editor.ceMaskArray[(editor.ceCharHeight - 1) * editor.ceCharWidth + x];
				for (y = editor.ceCharHeight - 2; y >= 0; y--) {
					editor.ceMaskArray[(y + 1) * editor.ceCharWidth + x] = editor.ceMaskArray[y * editor.ceCharWidth + x];
				}
				editor.ceMaskArray[(0) * editor.ceCharWidth + x] = c;
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_LEFT":
			if (--editor.ceCharX < 0)
				editor.ceCharX = editor.ceCharWidth - 1;
			editor.dispatchCharEditMenu("CE_DRAWMODEBIT");
			editor.showCharEditor();
		break;
		case "CE_RIGHT":
			if (++editor.ceCharX >= editor.ceCharWidth)
				editor.ceCharX = 0;
			editor.dispatchCharEditMenu("CE_DRAWMODEBIT");
			editor.showCharEditor();
		break;
		case "CE_UP":
			if (--editor.ceCharY < 0)
				editor.ceCharY = editor.ceCharHeight - 1;
			editor.dispatchCharEditMenu("CE_DRAWMODEBIT");
			editor.showCharEditor();
		break;
		case "CE_DOWN":
			if (++editor.ceCharY >= editor.ceCharHeight)
				editor.ceCharY = 0;
			editor.dispatchCharEditMenu("CE_DRAWMODEBIT");
			editor.showCharEditor();
		break;
		case "CE_CLEAR":
			for (y = 0; y < editor.ceCharHeight; y++) {
				for (x = 0; x < editor.ceCharWidth; x++) {
					editor.ceMaskArray[y * editor.ceCharWidth + x] = 0;
				}
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_NEXTCHAR":
			editor.selectCharFromSet((editor.ceCharNum + 1) & 255);
		break;
		case "CE_PREVCHAR":
			editor.selectCharFromSet((editor.ceCharNum - 1) & 255);
		break;
		case "CE_COPY":
			for (y = 0; y < editor.ceCharHeight; y++) {
				for (x = 0; x < editor.ceCharWidth; x++) {
					editor.ceMaskCBArray[y * editor.ceCharWidth + x] = editor.ceMaskArray[y * editor.ceCharWidth + x];
				}
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_PASTE":
			for (y = 0; y < editor.ceCharHeight; y++) {
				for (x = 0; x < editor.ceCharWidth; x++) {
					editor.ceMaskArray[y * editor.ceCharWidth + x] = editor.ceMaskCBArray[y * editor.ceCharWidth + x];
				}
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_MIRRORHORIZ":
			for (y = 0; y < editor.ceCharHeight; y++) {
				for (x = 0; x < editor.ceCharWidth / 2; x++) {
					c = editor.ceMaskArray[y * editor.ceCharWidth + x];
					editor.ceMaskArray[y * editor.ceCharWidth + x] =
					editor.ceMaskArray[y * editor.ceCharWidth + (editor.ceCharWidth - 1 - x)];
					editor.ceMaskArray[y * editor.ceCharWidth + (editor.ceCharWidth - 1 - x)] = c;
				}
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_MIRRORVERT":
			for (y = 0; y < editor.ceCharHeight / 2; y++) {
				for (x = 0; x < editor.ceCharWidth; x++) {
					c = editor.ceMaskArray[y * editor.ceCharWidth + x];
					editor.ceMaskArray[y * editor.ceCharWidth + x] =
					editor.ceMaskArray[(editor.ceCharHeight - 1 - y) * editor.ceCharWidth + x];
					editor.ceMaskArray[(editor.ceCharHeight - 1 - y) * editor.ceCharWidth + x] = c;
				}
			}
			editor.updateCharFromMaskArray();
		break;
		case "CE_NEGATE":
			for (y = 0; y < editor.ceCharHeight; y++) {
				for (x = 0; x < editor.ceCharWidth; x++) {
					c = editor.ceMaskArray[y * editor.ceCharWidth + x];
					editor.ceMaskArray[y * editor.ceCharWidth + x] = (c != 0) ? 0 : 1;
				}
			}
			editor.updateCharFromMaskArray();
		break;
	}
};

static selectCharFromSet(cNum) {
	editor.ceCharNum = cNum;
	if (editor.cePreviewIdent)
	{
			// Update all characters.
			for (var cy = 0; cy < 3; cy++) {
				for (var cx = 0; cx < 3; cx++) {
					editor.cePreviewChars[cy * 3 + cx] = editor.ceCharNum;
			}
		}

		editor.cePreviewIdent = false;
	}
	else
	{
		// Update only center character.
		editor.cePreviewChars[1 * 3 + 1] = editor.ceCharNum;
	}

	// After new character is picked, update mask with new character.
	editor.ceMaskArray = zzt.csg.getCurrentCharacterMask(editor.ceCharNum);
	editor.showCharEditor();
};

static setCharEditPreview(x, y) {
	if (x == 1 && y == 1)
	{
		// Not much to do here; equivalent to selecting identical bounds in preview.
		editor.cePreviewIdent = true;
		editor.selectCharFromSet(editor.ceCharNum);
	}
	else
	{
		// Identical bounds in preview are turned off.
		editor.cePreviewIdent = false;
		editor.cePreviewChars[y * 3 + x] = editor.ceCharNum;
		editor.showCharEditor();
	}
};

static updateCharFromMaskArray() {
	zzt.csg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, 1, editor.ceCharNum, editor.ceMaskArray);
	zzt.cpg.updateCharacterSet(editor.ceCharWidth, editor.ceCharHeight, 1, 1, editor.ceCharNum, editor.ceMaskArray);
	editor.showCharEditor();
};

static showCharEditor(fullUpdate=false) {
	// Show preview and character cell grids
	if (fullUpdate)
	{
		zzt.cpg.visible = true;
		zzt.csg.visible = true;

		if (!editor.charEditorInit)
		{
			// First-time initialization:  create arrays.
			editor.ceMaskArray = [];
			editor.ceMaskCBArray = [];
			for (var n = 0; n < 16 * 8; n++) {
				editor.ceMaskArray.push(0);
				editor.ceMaskCBArray.push(0);
			}

			editor.cePreviewChars = [];
			for (n = 0; n < 9; n++)
				editor.cePreviewChars.push(0);

			editor.ceCharWidth = CellGrid.charWidth;
			editor.ceCharHeight = CellGrid.charHeight;
			editor.ceCharHeightMode = CellGrid.charHeightMode;
			editor.ceCharCount = 256;
			editor.ceCharNum = 0;
			editor.ceCharX = 0;
			editor.ceCharY = 0;
			editor.cePreviewIdent = false;
			editor.charEditorInit = true;
		}

		// Set up preview grid info
		if (CellGrid.charHeightMode != editor.ceCharHeightMode)
			zzt.mg.updateScanlineMode(editor.ceCharHeightMode);

		//zzt.cpg.adjustVisiblePortion(3, 3);
		zzt.cpg.x = 15 * CellGrid.charWidth;
		zzt.cpg.y = 21 * CellGrid.charHeight;

		// Set up character selection grid update
		if (CellGrid.charHeightMode != editor.ceCharHeightMode)
			zzt.mg.updateScanlineMode(editor.ceCharHeightMode);

		//zzt.csg.adjustVisiblePortion(32, 8);
		zzt.csg.x = 24 * CellGrid.charWidth;
		zzt.csg.y = 16 * CellGrid.charHeight;
	}

	// Number labels
	zzt.eraseGuiLabel("HEIGHTLABEL");
	zzt.drawGuiLabel("HEIGHTLABEL", editor.ceCharHeight.toString());
	zzt.eraseGuiLabel("COUNTLABEL");
	zzt.drawGuiLabel("COUNTLABEL", editor.ceCharCount.toString());
	zzt.eraseGuiLabel("CHARCODELABEL");
	zzt.drawGuiLabel("CHARCODELABEL", editor.ceCharNum.toString());

	// Bit grid update
	var bgX = zzt.GuiLabels["BITGRID"][0] - 1;
	var bgY = zzt.GuiLabels["BITGRID"][1] - 1;
	for (var y = 0; y < 16; y++) {
		for (var x = 0; x < editor.ceCharWidth; x++) {

			var colorXor = (x == editor.ceCharX && y == editor.ceCharY) ? 4 : 0;
			var c = editor.ceMaskArray[y * editor.ceCharWidth + x];
			if (y >= editor.ceCharHeight)
			{
				zzt.mg.setCell(bgX + (x * 2), bgY + y, 32, 31);
				zzt.mg.setCell(bgX + (x * 2) + 1, bgY + y, 32, 31);
			}
			else if (c != 0)
			{
				zzt.mg.setCell(bgX + (x * 2), bgY + y, 219, 15 ^ colorXor);
				zzt.mg.setCell(bgX + (x * 2) + 1, bgY + y, 219, 15 ^ colorXor);
			}
			else
			{
				zzt.mg.setCell(bgX + (x * 2), bgY + y, 46, 8 ^ colorXor);
				zzt.mg.setCell(bgX + (x * 2) + 1, bgY + y, 46, 8 ^ colorXor);
			}
		}
	}

	// Preview grid update
	for (n = 0; n < 9; n++)
		zzt.cpg.setCell(n % 3, utils.int(n / 3), editor.cePreviewChars[n], 15);

	// Character selection grid update
	//zzt.csg.setCell(editor.ceCharNum % 32, utils.int(editor.ceCharNum / 32), editor.ceCharNum, 15);
	for (n = 0; n < 256; n++)
		zzt.csg.setCell(n % 32, utils.int(n / 32), n, 15);
};

static dispatchGradientMenu(msg) {
	var i;
	var x;
	var y;
	switch (msg) {
		case "ED_GRADIENT2":
			if (editor.selBuffer.length != 0)
			{
				editor.gradBuffer = [];
				for (i = 0; i < editor.selBuffer.length; i++)
					editor.gradBuffer.push(new IPoint(editor.selBuffer[i].x, editor.selBuffer[i].y));
				editor.selBuffer = [];

				editor.invertGPts = false;
				editor.gradientShape = editor.GRAD_LINEAR;
				editor.gradientDither = 0.0;
				editor.anchorX = editor.editorCursorX;
				editor.anchorY = editor.editorCursorY;
				zzt.establishGui("ED_GRADIENT2");
				editor.updateGradientView();
			}
		break;
		case "ED_GRADPTLEFT":
			editor.eraseEditorCursor();
			if (--editor.editorCursorX <= 0)
				editor.editorCursorX = editor.boardWidth;
			editor.updateGradientView();
		break;
		case "ED_GRADPTRIGHT":
			editor.eraseEditorCursor();
			if (++editor.editorCursorX > editor.boardWidth)
				editor.editorCursorX = 1;
			editor.updateGradientView();
		break;
		case "ED_GRADPTUP":
			editor.eraseEditorCursor();
			if (--editor.editorCursorY <= 0)
				editor.editorCursorY = editor.boardHeight;
			editor.updateGradientView();
		break;
		case "ED_GRADPTDOWN":
			editor.eraseEditorCursor();
			if (++editor.editorCursorY > editor.boardHeight)
				editor.editorCursorY = 1;
			editor.updateGradientView();
		break;
		case "ED_GRADCHANGEPT":
			editor.invertGPts = !editor.invertGPts;
			x = editor.anchorX;
			y = editor.anchorY;
			editor.anchorX = editor.editorCursorX;
			editor.anchorY = editor.editorCursorY;
			editor.editorCursorX = x;
			editor.editorCursorY = y;
			editor.updateGradientView();
		break;
		case "ED_GRADDITHERMORE":
			editor.gradientDither += 0.025;
			if (editor.gradientDither > 0.75)
				editor.gradientDither = 0.75;
			editor.updateGradientView();
		break;
		case "ED_GRADDITHERLESS":
			editor.gradientDither -= 0.025;
			if (editor.gradientDither < 0.0)
				editor.gradientDither = 0.0;
			editor.updateGradientView();
		break;
		case "ED_GRADLINEAR":
			editor.gradientShape = editor.GRAD_LINEAR;
			editor.updateGradientView();
		break;
		case "ED_GRADBILINEAR":
			editor.gradientShape = editor.GRAD_BILINEAR;
			editor.updateGradientView();
		break;
		case "ED_GRADRADIAL":
			editor.gradientShape = editor.GRAD_RADIAL;
			editor.updateGradientView();
		break;
		case "ED_GRADIENTDONE":
			editor.updateGradientView(true);
			editor.cursorActive = true;
			editor.anchorX = -1;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
			editor.modFlag = true;
		break;
		case "ED_CANCELGRADIENT":
			editor.cursorActive = true;
			editor.anchorX = -1;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
		break;
	}
};

static updateGradientView(writeToGrid=false) {
	if (!writeToGrid)
		editor.updateEditorView(false);

	// Get type extent info
	var numTypes = (editor.patternCursor == -1) ? editor.actualBBLen : 5;
	var typeExtent =
		(editor.gradientShape == editor.GRAD_BILINEAR) ? (numTypes * 2 - 1) : numTypes;
	var halfInterval = 0.5 / typeExtent;
	var adjustedExtent = 1.0 + (halfInterval * 2);
	var radialRatioAdjust = (zzt.Use40Column == 1) ? 1.0 : 4.0; // Need other factor?

	var dx = -SE.CameraX + SE.vpX0 - 1;
	var dy = -SE.CameraY + SE.vpY0 - 1;

	// Calculate foci
	var fociX1 = editor.invertGPts ? editor.editorCursorX : editor.anchorX;
	var fociY1 = editor.invertGPts ? editor.editorCursorY : editor.anchorY;
	var fociX2 = editor.invertGPts ? editor.anchorX : editor.editorCursorX;
	var fociY2 = editor.invertGPts ? editor.anchorY : editor.editorCursorY;
	var fociDist =
		Math.sqrt((fociX1 - fociX2) * (fociX1 - fociX2) + (fociY1 - fociY2) * (fociY1 - fociY2));
	var fociAngle = Math.atan2(fociY2 - fociY1, fociX2 - fociX1);

	if (fociDist <= 0.0)
		return; // NO!!  Foci must be unique.

	for (var i = 0; i < editor.gradBuffer.length; i++) {
		var x = editor.gradBuffer[i].x;
		var y = editor.gradBuffer[i].y;

		// Translate point to gradient space position.
		var gradPos = 0.0;
		if (editor.gradientShape == editor.GRAD_RADIAL)
		{
			var fDist = Math.sqrt((x - fociX1) * (x - fociX1) +
				(y - fociY1) * (y - fociY1) * radialRatioAdjust);
			gradPos = fDist / fociDist;
		}
		else
		{
			var xPrime = (x - fociX1) * Math.cos(-fociAngle)
				- (y - fociY1) * Math.sin(-fociAngle);
			gradPos = xPrime / fociDist;
		}

		// Apply dither.
		gradPos += utils.frange(-editor.gradientDither, editor.gradientDither);

		// Select type index; have index run through "centers" of edges.
		var typeIndex = utils.int(Math.floor((gradPos + halfInterval) / adjustedExtent
			* Number(typeExtent)));
		//var typeIndex = utils.int(Math.floor(gradPos * Number(typeExtent))); // Alt:  outer edges are borders
		if (typeIndex >= typeExtent)
			typeIndex = typeExtent - 1;
		if (typeIndex < 0)
			typeIndex = 0;

		// Pick type info.
		var idx;
		if (editor.gradientShape == editor.GRAD_BILINEAR)
		{
			if (typeIndex >= numTypes)
				idx = typeIndex - numTypes + 1;
			else
				idx = (numTypes - 1) - typeIndex;
		}
		else
			idx = typeIndex;

		var pType;
		if (editor.patternCursor == -1)
		{
			// Back buffer assumes ascending from first position.
			pType = editor.bBuffer[idx];
		}
		else
		{
			// Built-in patterns assume ascending from solid to empty.
			editor.immType[0] = editor.longBuiltInTypes[idx][0];
			editor.immType[1] = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;
			editor.immType[2] = editor.longBuiltInTypes[idx][1];
			editor.immType[3] = null;
			pType = editor.immType;
		}

		// Choose what to do:  just draw, or set.
		var destType = interp.typeTrans[pType[2]];
		var destColor = pType[1];
		if (!editor.defColorMode)
			destColor = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;
		destColor = editor.colorVis2Stored(destType, destColor, pType[0]);

		if (writeToGrid)
		{
			// Set.
			if (pType[3] == null)
			{
				SE.setType(utils.int(x), utils.int(y), destType);
				SE.setColor(utils.int(x), utils.int(y), destColor, false);
			}
			else
				editor.createSECopy(utils.int(x), utils.int(y), destType, destColor, pType[3]);
		}
		else
		{
			// Draw.
			zzt.mg.setCell(utils.int(x) + dx, utils.int(y) + dy, pType[0], destColor);
		}
	}
};

static getPType() {
	if (editor.patternCursor == -1)
	{
		// Back buffer
		var srcPType = editor.bBuffer[editor.patternBBCursor];
		editor.immType[0] = srcPType[0];
		editor.immType[1] = srcPType[1];
		editor.immType[2] = srcPType[2];
		editor.immType[3] = srcPType[3];
		if (!editor.defColorMode)
			editor.immType[1] = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;
	}
	else if (editor.editorStyle == editor.EDSTYLE_ULTRA || editor.editorStyle == editor.EDSTYLE_KEVEDIT)
	{
		// Get type from pattern table and color from color cursors.
		editor.immType[0] = editor.longBuiltInTypes[editor.patternCursor][0];
		editor.immType[1] = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;
		editor.immType[2] = editor.longBuiltInTypes[editor.patternCursor][1];
		editor.immType[3] = null;
	}
	else
	{
		// Earlier editors have simpler pattern table.
		editor.immType[0] = editor.shortBuiltInTypes[editor.patternCursor][0];
		editor.immType[1] = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;
		editor.immType[2] = editor.shortBuiltInTypes[editor.patternCursor][1];
		editor.immType[3] = null;
	}

	return editor.immType;
};

static floodFill(x, y, action) {
	var srcType = SE.getType(x, y);
	var srcColor = SE.getColor(x, y);

	var pType = editor.getPType();
	var destType = interp.typeTrans[pType[2]];
	var destColor = pType[1];

	if (srcType == zzt.bEdgeType)
		return false; // Can't fill this type
	if (destType == SE.getType(x, y) && destColor == SE.getColor(x, y) && action == editor.FILL_PAINT)
		return false; // No need for fill operation

	// Initiate fill objects
	var se = pType[3];
	editor.anchorX = -1;
	editor.selBuffer = [];
	editor.fillBuffer = [];
	editor.fillBuffer.push(new IPoint(x, y));

	// Handle all fill object iterations
	while (editor.fillBuffer.length > 0) {
		for (var i = 0; i < editor.fillBuffer.length; i++) {
			x = editor.fillBuffer[i].x;
			y = editor.fillBuffer[i].y;

			if (SE.getType(x, y) != srcType || SE.getColor(x, y) != srcColor)
			{
				// Doubled-up object; discard.
				editor.fillBuffer.splice(i, 1);
				i--;
				continue;
			}

			// Spread objects to nearest four neighbors
			var dx = x - 1;
			var dy = y;
			if (SE.getType(dx, dy) == srcType && SE.getColor(dx, dy) == srcColor)
				editor.fillBuffer.push(new IPoint(dx, dy));

			dx += 2;
			if (SE.getType(dx, dy) == srcType && SE.getColor(dx, dy) == srcColor)
				editor.fillBuffer.push(new IPoint(dx, dy));

			dx -= 1;
			dy -= 1;
			if (SE.getType(dx, dy) == srcType && SE.getColor(dx, dy) == srcColor)
				editor.fillBuffer.push(new IPoint(dx, dy));

			dy += 2;
			if (SE.getType(dx, dy) == srcType && SE.getColor(dx, dy) == srcColor)
				editor.fillBuffer.push(new IPoint(dx, dy));

			// Remove square from future consideration
			SE.setType(x, y, srcType ^ 128);
			editor.selBuffer.push(editor.fillBuffer[i]);
			editor.fillBuffer.splice(i, 1);
			i--;
		}
	}

	// Revert types back to normal
	for (i = 0; i < editor.selBuffer.length; i++) {
		x = editor.selBuffer[i].x;
		y = editor.selBuffer[i].y;
		SE.setType(x, y, srcType);
	}

	return (editor.fillAction(action));
};

static fillAction(action) {
	if (action == editor.FILL_SELECTION)
	{
		editor.updateEditorView(false);
		return true; // No action; just retain selections
	}

	// From selections, decide what to do from action
	var pType = editor.getPType();
	var destType = interp.typeTrans[pType[2]];
	var destColor = pType[1];
	var se = pType[3];
	destColor = editor.colorVis2Stored(destType, destColor, pType[0]);

	for (var i = 0; i < editor.selBuffer.length; i++) {
		var x = editor.selBuffer[i].x;
		var y = editor.selBuffer[i].y;

		editor.killSE(x, y);
		SE.setType(x, y, 0);
		if (action == editor.FILL_PAINT)
		{
			if (se == null)
			{
				SE.setType(x, y, destType);
				SE.setColor(x, y, destColor, false);
			}
			else
				editor.createSECopy(x, y, destType, destColor, se);
		}
		else if (action == editor.FILL_RANDOMPAINT)
		{
			editor.placeRandomType(x, y);
		}
	}

	editor.modFlag = true;
	editor.selBuffer = [];
	editor.anchorX = -1;
	editor.updateEditorView(false);
	return true;
};

static pickerSel(x, y) {
	var srcType = SE.getType(x, y);
	var srcColor = SE.getColor(x, y);

	editor.selBuffer = [];
	editor.anchorX = -1;
	for (var dy = 1; dy <= editor.boardHeight; dy++) {
		for (var dx = 1; dx <= editor.boardWidth; dx++) {
			if (srcType == SE.getType(dx, dy) && srcColor == SE.getColor(dx, dy))
				editor.selBuffer.push(new IPoint(dx, dy));
		}
	}

	editor.updateEditorView(false);
};

static captureSel(doCut) {
	if (editor.selBuffer.length == 0)
	{
		// Nothing to capture
		editor.clipX1 = 0;
		editor.clipY1 = 0;
		editor.clipBuffer = [];
		return;
	}

	editor.clipBuffer = [];
	editor.clipX1 = 10000000;
	editor.clipY1 = 10000000;
	for (var i = 0; i < editor.selBuffer.length; i++) {
		// Get captured tile; like back buffer except coordinates also stored
		var pt = editor.selBuffer[i];
		var type = SE.getType(pt.x, pt.y);
		var capTile = [ zzt.mg.getChar(pt.x - SE.CameraX + SE.vpX0 - 1,
			pt.y - SE.CameraY + SE.vpY0 - 1), SE.getColor(pt.x, pt.y),
		zzt.typeList[type].NUMBER, null, pt.x, pt.y];

		var oldSE = SE.getStatElemAt(pt.x, pt.y);  
		if (oldSE)
		{
			// Configure stat type as needed.
			var se = new SE(oldSE.TYPE, pt.x, pt.y, capTile[1], true);
			se.CYCLE = oldSE.CYCLE;
			se.STEPX = oldSE.STEPX;
			se.STEPY = oldSE.STEPY;
			se.IP = oldSE.IP;
			se.FLAGS = oldSE.FLAGS;
			se.delay = oldSE.delay;
			for (var s in oldSE.extra)
				se.extra[s] = oldSE.extra[s];

			capTile[3] = se;
		}

		// Store captured tile in clipboard; save upper-left reference point.
		editor.clipBuffer.push(capTile);
		if (editor.clipX1 > pt.x)
			editor.clipX1 = pt.x;
		if (editor.clipY1 > pt.y)
			editor.clipY1 = pt.y;
	}

	// If we are cutting, we must spot-place the selected pattern in the
	// area we just captured.
	if (doCut)
	{
		editor.modFlag = true;
		for (i = 0; i < editor.selBuffer.length; i++) {
			var pType = editor.getPType();
			var destType = interp.typeTrans[pType[2]];
			var destColor = pType[1];
			destColor = editor.colorVis2Stored(destType, destColor, pType[0]);

			se = pType[3];
			var x = editor.selBuffer[i].x;
			var y = editor.selBuffer[i].y;

			editor.killSE(x, y);
			SE.setType(x, y, 0);
			if (se == null)
			{
				SE.setType(x, y, destType);
				SE.setColor(x, y, destColor, false);
			}
			else
				editor.createSECopy(x, y, destType, destColor, se);
		}
	}

	editor.selBuffer = [];
	editor.anchorX = -1;
	editor.updateEditorView(false);
};

static updatePasteView() {
	// Set selection to match clipboard shape
	editor.selBuffer = [];
	editor.anchorX = -1;
	for (var i = 0; i < editor.clipBuffer.length; i++) {
		var x = editor.clipBuffer[i][4] + (editor.editorCursorX - editor.clipX1);
		var y = editor.clipBuffer[i][5] + (editor.editorCursorY - editor.clipY1);
		editor.selBuffer.push(new IPoint(x, y));
	}

	editor.updateEditorView(false);
};

static pasteSel() {
	for (var i = 0; i < editor.clipBuffer.length; i++) {
		// Paste clipboard tile
		var pType = editor.clipBuffer[i];
		var x = pType[4] + (editor.editorCursorX - editor.clipX1);
		var y = pType[5] + (editor.editorCursorY - editor.clipY1);
		if (x >= 1 && y >= 1 && x <= editor.boardWidth && y <= editor.boardHeight)
		{
			var destType = interp.typeTrans[pType[2]];
			var destColor = pType[1];
			var se = pType[3];

			editor.killSE(x, y);
			SE.setType(x, y, 0);
			if (se == null)
			{
				SE.setType(x, y, destType);
				SE.setColor(x, y, destColor, false);
			}
			else
				editor.createSECopy(x, y, destType, destColor, se);
		}
	}

	editor.modFlag = true;
	editor.selBuffer = [];
	editor.updateEditorView(false);
};

static createSECopy(x, y, destType, destColor, oldSE) {
	var se = new SE(destType, x, y, destColor);
	SE.setStatElemAt(x, y, se);
	SE.statElem.push(se);
	editor.modFlag = true;

	se.STEPX = oldSE.STEPX;
	se.STEPY = oldSE.STEPY;
	se.CYCLE = oldSE.CYCLE;
	se.IP = oldSE.IP;
	se.FLAGS = oldSE.FLAGS;
	se.delay = oldSE.delay;
	for (var s in oldSE.extra)
		se.extra[s] = oldSE.extra[s];
};

static placeRandomType(x, y) {
	var pType = null;
	if (editor.patternCursor == -1)
	{
		// Pick from back buffer
		var idx = utils.onethru(editor.actualBBLen) - 1;
		pType = editor.bBuffer[idx];
	}
	else
	{
		// Get type from pattern table and color from color cursors.
		idx = utils.onethru(editor.patternBuiltIn - 1) - 1;
		editor.immType[0] = editor.longBuiltInTypes[idx][0];
		editor.immType[1] = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;
		editor.immType[2] = editor.longBuiltInTypes[idx][1];
		editor.immType[3] = null;
		pType = editor.immType;
	}

	// Place chosen type
	editor.modFlag = true;
	var destType = interp.typeTrans[pType[2]];
	var destColor = pType[1];
	if (!editor.defColorMode)
		destColor = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;
	destColor = editor.colorVis2Stored(destType, destColor, pType[0]);

	if (pType[3] == null)
	{
		SE.setType(x, y, destType);
		SE.setColor(x, y, destColor, false);
	}
	else
		editor.createSECopy(x, y, destType, destColor, pType[3]);
};

static colorPatternMousePick(guiX, guiY, rightSide, downSide) {

	if (zzt.thisGuiName == "ED_CLASSIC" || zzt.thisGuiName == "ED_SUPERZZT")
	{
		if (guiX < 9)
		{
			// Pattern selection
			if (guiX >= 3 && guiX <= 7)
			{
				editor.patternCursor = guiX - 3;
				editor.patternBBCursor = 0;
			}
			else if (guiX == 8)
			{
				editor.patternBBCursor = 0;
				editor.patternCursor = -1;
			}

			editor.drawEditorPatternCursor();
		}
		else if (guiX >= 10 && guiX <= 17)
		{
			// Color selection
			if (guiY == 22 ||
				(guiY == 23 && (downSide == 0 || zzt.thisGuiName == "ED_CLASSIC")))
			{
				// FG selection (top)
				editor.fgColorCursor = guiX - 10 + 8;
			}
			else if (zzt.thisGuiName == "ED_SUPERZZT" && guiY == 23 && downSide == 1)
			{
				// FG selection (bottom)
				editor.fgColorCursor = guiX - 10;
			}
			else if (zzt.thisGuiName == "ED_SUPERZZT" && guiY == 24)
			{
				// BG selection
				editor.bgColorCursor = guiX - 10;
			}

			editor.drawEditorPatternCursor();
			editor.drawEditorColorCursors();
		}
	}
	else
	{
		if (guiY >= 21 && guiY <= 22)
		{
			// Pattern selection
			if (guiX >= 2 && guiX <= 7)
			{
				editor.patternCursor = guiX - 2;
				editor.patternBBCursor = 0;
			}
			else if (guiX == 8)
				editor.bufLockMode = !editor.bufLockMode;
			else if (guiX >= 9 && guiX <= 18)
			{
				editor.patternBBCursor = guiX - 9;
				editor.patternCursor = -1;
			}
			else if (guiX >= 19)
				editor.acquireMode = !editor.acquireMode;

			editor.drawEditorPatternCursor();
		}
		else if (guiY == 23 || (guiY == 24 && downSide == 0))
		{
			// FG selection
			if (guiX >= 2 && guiX <= 17)
				editor.fgColorCursor = guiX - 2;
			else if (guiX >= 19)
				editor.defColorMode = !editor.defColorMode;

			editor.drawEditorPatternCursor();
			editor.drawEditorColorCursors();
		}
		else if (guiY == 25 || (guiY == 24 && downSide == 1))
		{
			// BG selection
			if (guiX >= 2 && guiX <= 9)
				editor.bgColorCursor = 0;
			else if (guiX >= 10 && guiX <= 17)
				editor.bgColorCursor = guiX - 10;
			else if (guiX >= 19)
				editor.defColorMode = !editor.defColorMode;

			editor.drawEditorPatternCursor();
			editor.drawEditorColorCursors();
		}
	}
};

static dispatchF1Menu(msg) {
	var oldDefColorMode = editor.defColorMode;
	var oldFG = editor.fgColorCursor;
	var oldBG = editor.bgColorCursor;
	switch (msg) {
		case "ED_CANCELTYPE":
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(true);
		break;
		case "ED_TYPEPLAYER":
			editor.defColorMode = false;
			editor.fgColorCursor = 15;
			editor.bgColorCursor = 1;
			editor.selectStatType("PLAYER", false, false, false, false, editor.playerExtras);
			editor.fgColorCursor = oldFG;
			editor.bgColorCursor = oldBG;
			editor.defColorMode = oldDefColorMode;
			editor.updateEditorView(true);
		break;
		case "ED_TYPEGEM":
		case "ED_TYPEAMMO":
		case "ED_TYPETORCH":
		case "ED_TYPEENERGIZER":
		case "ED_TYPEKEY":
		case "ED_TYPEDOOR":
			editor.selectNoStatType(msg.substr(7));
		break;
		case "ED_TYPEPASSAGE":
			editor.selectStatType("PASSAGE", false, false, false, true, editor.passageExtras);
		break;
		case "ED_TYPECLOCKWISE":
			editor.selectStatType("CLOCKWISE", false);
		break;
		case "ED_TYPECOUNTER":
			editor.selectStatType("COUNTER", false);
		break;
		case "ED_TYPESCROLL":
			editor.selectStatType("SCROLL", false, false, false, false, editor.scrollExtras);
		break;
		case "ED_TYPEDUPLICATOR":
			editor.selectStatType("DUPLICATOR", true, false, true, false, editor.duplicatorExtras);
		break;
		case "ED_TYPEBOMB":
			editor.selectStatType("BOMB", false, true);
		break;
	}
};

static dispatchF2Menu(msg) {
	switch (msg) {
		case "ED_CANCELTYPE":
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(true);
		break;
		case "ED_TYPESTAR":
			editor.selectStatType("STAR", true, false, false, false, editor.starExtras);
		break;
		case "ED_TYPEBULLET":
			editor.selectStatType("BULLET", true);
		break;
		case "ED_TYPEHEAD":
			editor.selectStatType("HEAD", false, true, true);
		break;
		case "ED_TYPESEGMENT":
			editor.selectStatType("SEGMENT", false);
		break;
		case "ED_TYPERUFFIAN":
			editor.selectStatType("RUFFIAN", false, true, true);
		break;
		case "ED_TYPEBEAR":
			editor.selectStatType("BEAR", false, true);
		break;
		case "ED_TYPESHARK":
			editor.selectStatType("SHARK", false, true);
		break;
		case "ED_TYPELION":
			editor.selectStatType("LION", false, true);
		break;
		case "ED_TYPETIGER":
			editor.selectStatType("TIGER", false, true, true);
		break;
		case "ED_TYPEPUSHER":
			editor.selectStatType("PUSHER", true);
		break;
		case "ED_TYPESLIME":
			editor.selectStatType("SLIME", false, false, true);
		break;
		case "ED_TYPESPINNINGGUN":
			editor.selectStatType("SPINNINGGUN", false, true, true, false, editor.spinningGunExtras);
		break;
		case "ED_TYPEOBJECT":
			editor.selectStatType("OBJECT", false, false, false, false, editor.objectExtras);
		break;
	}
};

static dispatchF3Menu(msg) {
	var oldDefColorMode = editor.defColorMode;
	switch (msg) {
		case "ED_CANCELTYPE":
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(true);
		break;
		case "ED_TYPESOLID":
		case "ED_TYPENORMAL":
		case "ED_TYPEFAKE":
		case "ED_TYPEBREAKABLE":
		case "ED_TYPEINVISIBLE":
		case "ED_TYPEFOREST":
		case "ED_TYPEWATER":
		case "ED_TYPEBOARDEDGE":
		case "ED_TYPERICOCHET":
		case "ED_TYPEBOULDER":
		case "ED_TYPESLIDERNS":
		case "ED_TYPESLIDEREW":
		case "ED_TYPE_BEAMHORIZ":
		case "ED_TYPE_BEAMVERT":
		case "ED_TYPEMONITOR":
			editor.selectNoStatType(msg.substr(7));
		break;
		case "ED_TYPEDEADSMILEY":
			editor.defColorMode = false;
			editor.selectStatType("PLAYER", false, false, false, false, editor.playerDeadExtras);
			editor.defColorMode = oldDefColorMode;
			editor.updateEditorView(true);
		break;
		case "ED_TYPEBLINKWALL":
			editor.selectStatType("BLINKWALL", true, true, true);
		break;
		case "ED_TYPETRANSPORTER":
			if (editor.prevStepX == 1)
				editor.transporterExtras["CHAR"] = 62;
			else if (editor.prevStepX == -1)
				editor.transporterExtras["CHAR"] = 60;
			else if (editor.prevStepY == 1)
				editor.transporterExtras["CHAR"] = 40;
			else if (editor.prevStepY == -1)
				editor.transporterExtras["CHAR"] = 94;
			editor.selectStatType("TRANSPORTER", true, false, false, false, editor.transporterExtras);
		break;
	}
};

static dispatchF4Menu(msg) {
	switch (msg) {
		case "ED_CANCELTYPE":
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(true);
		break;
		case "ED_TYPESPIDER":
			editor.selectStatType("SPIDER", false, true);
		break;
		case "ED_TYPEBDRAGONPUP":
			editor.selectStatType("DRAGONPUP", false, true, true, false, editor.dragonPupExtras);
		break;
		case "ED_TYPEROTON":
		case "ED_TYPEPAIRER":
			editor.selectStatType(msg.substr(7), false, true, true);
		break;
	}
};

static dispatchF5Menu(msg) {
	switch (msg) {
		case "ED_CANCELTYPE":
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(true);
		break;
		case "ED_TYPEFLOOR":
		case "ED_TYPEWATERS":
		case "ED_TYPEWATERN":
		case "ED_TYPEWATERE":
		case "ED_TYPEWATERW":
		case "ED_TYPEWEB":
			editor.selectNoStatType(msg.substr(7));
		break;
		case "ED_TYPESTONE":
			editor.selectStatType("STONE", false, false, false, false, editor.stoneExtras);
		break;
	}
};

static selectNoStatType(tName) {
	// Set immediate type to non-stat type.
	var eInfo = zzt.getTypeFromName(tName);
	editor.immType[0] = eInfo.CHAR;
	editor.immType[1] = eInfo.COLOR;
	editor.immType[2] = eInfo.NUMBER;
	editor.immType[3] = null;
	if (!editor.defColorMode || !eInfo.DominantColor)
		editor.immType[1] = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;

	// Place and modify
	editor.add2BBuffer();
	editor.spotPlace(false, true);

	// Return to editor
	editor.modFlag = true;
	editor.cursorActive = true;
	zzt.establishGui(zzt.prefEditorGui);
	editor.updateEditorView(true);
};

static selectStatType(tName, usePrevDir=false, usePrevP1=false, usePrevP2=false, usePrevP3=false, extras=null) {
	// Set immediate type to stat type.
	var eInfo = zzt.getTypeFromName(tName);
	editor.immType[0] = eInfo.CHAR;
	editor.immType[1] = eInfo.COLOR;
	editor.immType[2] = eInfo.NUMBER;
	if (!editor.defColorMode || !eInfo.DominantColor)
		editor.immType[1] = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;

	// Configure stat type as needed.
	var se = new SE(interp.typeTrans[eInfo.NUMBER],
	editor.editorCursorX, editor.editorCursorY, editor.immType[1], true);
	editor.immType[3] = se;

	if (usePrevDir)
	{
		se.STEPX = editor.prevStepX;
		se.STEPY = editor.prevStepY;
	}
	if (usePrevP1)
		se.extra["P1"] = editor.prevP1;
	if (usePrevP2)
		se.extra["P2"] = editor.prevP2;
	if (usePrevP3)
		se.extra["P3"] = editor.prevP3;

	if (extras != null)
	{
		for (var s in extras)
			se.extra[s] = extras[s];
	}

	// Place and modify
	editor.add2BBuffer();
	editor.spotPlace(false, true);

	// Return to editor
	editor.modFlag = true;
	editor.cursorActive = true;
	zzt.establishGui(zzt.prefEditorGui);
	editor.updateEditorView(true);
};

static pickupCursor() {
	SE.displaySquare(editor.editorCursorX, editor.editorCursorY);
	var type = SE.getType(editor.editorCursorX, editor.editorCursorY);

	editor.immType[0] = zzt.mg.getChar(editor.editorCursorX - SE.CameraX + SE.vpX0 - 1,
		editor.editorCursorY - SE.CameraY + SE.vpY0 - 1);
	editor.immType[1] = zzt.mg.getAttr(editor.editorCursorX - SE.CameraX + SE.vpX0 - 1,
		editor.editorCursorY - SE.CameraY + SE.vpY0 - 1);
	editor.immType[2] = zzt.typeList[type].NUMBER;
	editor.immType[3] = null;
	var oldSE = SE.getStatElemAt(editor.editorCursorX, editor.editorCursorY);

	// Copy SE if needed.
	if (oldSE)
	{
		// Configure stat type as needed.
		var se = new SE(oldSE.TYPE, editor.editorCursorX, editor.editorCursorY, editor.immType[1], true);
		se.CYCLE = oldSE.CYCLE;
		se.STEPX = oldSE.STEPX;
		se.STEPY = oldSE.STEPY;
		se.IP = oldSE.IP;
		se.FLAGS = oldSE.FLAGS;
		se.delay = oldSE.delay;
		se.UNDERID = oldSE.UNDERID;
		se.UNDERCOLOR = oldSE.UNDERCOLOR;
		for (var s in oldSE.extra)
			se.extra[s] = oldSE.extra[s];

		editor.immType[3] = se;
	}

	editor.add2BBuffer();
};

static add2BBuffer(doFeed=true) {
	if (editor.bufLockMode)
		return;

	if (doFeed)
	{
		for (var i = editor.MAX_BBUFFER - 1; i > 0; i--)
		{
			editor.bBuffer[i][0] = editor.bBuffer[i-1][0];
			editor.bBuffer[i][1] = editor.bBuffer[i-1][1];
			editor.bBuffer[i][2] = editor.bBuffer[i-1][2];
			editor.bBuffer[i][3] = editor.bBuffer[i-1][3];
		}
	}

	editor.bBuffer[0][0] = editor.immType[0];
	editor.bBuffer[0][1] = editor.immType[1];
	editor.bBuffer[0][2] = editor.immType[2];
	editor.bBuffer[0][3] = editor.immType[3];

	editor.drawEditorPatternCursor();
};

static writeTextDrawChar(charCode) {
	// If backspace, take back a character
	editor.modFlag = true;
	if (charCode == 8 && zzt.mainMode != zzt.MODE_CHARSEL)
	{
		editor.eraseEditorCursor();
		if (--editor.editorCursorX <= 0)
			editor.editorCursorX = editor.boardWidth;
		editor.dispatchEditorMenu("ED_DELETE");
		editor.drawEditorCursor();
		return;
	}

	var baseColorIdx;
	if (editor.text128)
	{
		// 128-color, full-text mode
		baseColorIdx = 100 + (editor.bgColorCursor * 16 + editor.fgColorCursor);
	}
	else
	{
		// 7-color, limited-text mode
		baseColorIdx = (editor.fgColorCursor & 7) - 1;
		if (baseColorIdx == -1)
			baseColorIdx = 0;
		baseColorIdx += 73; // _TEXTBLUE
	}

	// If entering a hex code character, need two characters.
	if (editor.hexTextEntry > 0)
	{
		var dCode = 0;
		if (charCode >= 48 && charCode <= 57)
			dCode = charCode - 48;
		else if (charCode >= 65 && charCode <= 90)
			dCode = (charCode - 65) + 10;
		else if (charCode >= 97 && charCode <= 122)
			dCode = (charCode - 97) + 10;

		if (editor.hexTextEntry == 1)
		{
			// First digit
			editor.hexCodeValue = dCode;
			editor.hexTextEntry++;
			return;
		}
		else
		{
			// Second digit--use code
			editor.hexCodeValue = editor.hexCodeValue * 16 + dCode;
			charCode = editor.hexCodeValue;
			editor.hexTextEntry = 0;
			editor.drawEditorPatternCursor();
		}
	}

	// Write text character
	editor.immType[0] = charCode;
	editor.immType[1] = charCode;
	editor.immType[2] = baseColorIdx;
	editor.immType[3] = null;
	editor.spotPlace(false, true);

	// Advance cursor
	if (++editor.editorCursorX > editor.boardWidth)
		editor.editorCursorX = 1;
	editor.drawEditorCursor();
};

static getFreeTypeNumber() {
	for (var i = 0; i < 254; i++) {
		var found = true;
		for (var j = 0; j < zzt.typeList.length; j++) {
			var eInfo = zzt.typeList[j];
			if (eInfo.NUMBER == i)
			{
				found = false;
				break;
			}
		}

		if (found)
			return i;
	}

	// This should not happen in theory...every single type is exhausted?
	return 252;
};

static dispatchTypeAllMenu(msg) {
	var eInfo;
	switch (msg) {
		case "ED_CANCELALLTYPE":
			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
		break;
		case "ED_TYPEALLSEL":
			eInfo = zzt.typeList[editor.typeAllTypes[editor.typeAllCursor]];
			if (eInfo.NoStat)
				editor.selectNoStatType(eInfo.NAME);
			else if (eInfo.HasOwnCode)
				editor.selectStatType(eInfo.NAME, false, false, false, false, editor.scrollExtras);
			else
			{
				switch (eInfo.NAME) {
					case "PASSAGE":
						editor.selectStatType(eInfo.NAME, false, false, false, false, editor.passageExtras);
					break;
					case "BLINKWALL":
						editor.selectStatType(eInfo.NAME, true, true, true);
					break;
					case "DUPLICATOR":
						editor.selectStatType(eInfo.NAME, true, false, true, false, editor.duplicatorExtras);
					break;
					case "STAR":
						editor.selectStatType(eInfo.NAME, true, false, false, false, editor.starExtras);
					break;
					case "BULLET":
					case "PUSHER":
						editor.selectStatType(eInfo.NAME, true);
					break;
					case "TRANSPORTER":
						if (editor.prevStepX == 1)
							editor.transporterExtras["CHAR"] = 62;
						else if (editor.prevStepX == -1)
							editor.transporterExtras["CHAR"] = 60;
						else if (editor.prevStepY == 1)
							editor.transporterExtras["CHAR"] = 40;
						else if (editor.prevStepY == -1)
							editor.transporterExtras["CHAR"] = 94;
						editor.selectStatType(eInfo.NAME, true, false, false, false, editor.transporterExtras);
					break;
					default:
						editor.selectStatType(eInfo.NAME, false);
					break;
				}
			}

			editor.cursorActive = true;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
		break;
		case "ED_TYPEALLPREV":
			if (editor.typeAllPage > 0)
			{
				editor.typeAllPage--;
				editor.typeAllCursor -= editor.TYPEALL_PAGELIMIT;
				if (editor.typeAllCursor < 0)
					editor.typeAllCursor = 0;
				editor.updateTypeAllView(true);
			}
		break;
		case "ED_TYPEALLNEXT":
			if (editor.typeAllPage < editor.typeAllPageCount - 1)
			{
				editor.typeAllPage++;
				editor.typeAllCursor += editor.TYPEALL_PAGELIMIT;
				if (editor.typeAllCursor >= editor.typeAllTypes.length)
					editor.typeAllCursor = editor.typeAllTypes.length - 1;
				editor.updateTypeAllView(true);
			}
		break;
		case "ED_TYPEEDITOR":
			eInfo = zzt.typeList[editor.typeAllTypes[editor.typeAllCursor]];
			editor.newTypeNameFocus = eInfo.NAME;
			editor.newTypeString = eInfo.toString();
			if (zzt.extraTypeCode.hasOwnProperty(eInfo.NAME))
			{
				editor.hasExistingTypeSpec = true;
				editor.newTypeString += "\"" + zzt.markUpCodeQuotes(zzt.extraTypeCode[eInfo.NAME]) + "\"\n}";
			}
			else
			{
				editor.hasExistingTypeSpec = false;
				editor.newTypeString += "\"\n#END\n\"\n}";
			}

			zzt.establishGui(zzt.prefEditorGui);
			editor.launchTypeEditor(true);
		break;
		case "ED_TYPENEW":
			editor.newTypeNum++;
			eInfo = new ElementInfo("NEWTYPE" + editor.newTypeNum.toString());
			eInfo.NUMBER = editor.getFreeTypeNumber();
			eInfo.CHAR = 1;
			eInfo.NoStat = Boolean(editor.typeAllFilter != editor.TYPEFILTER_STATTYPES);
			eInfo.BlockObject = Boolean(editor.typeAllFilter != editor.TYPEFILTER_FLOOR);
			eInfo.BlockPlayer = Boolean(editor.typeAllFilter != editor.TYPEFILTER_FLOOR);
			editor.newTypeNameFocus = eInfo.NAME;
			editor.newTypeString = eInfo.toString();
			editor.newTypeString += "\"\n#END\n\"\n}";
			editor.hasExistingTypeSpec = false;

			zzt.establishGui(zzt.prefEditorGui);
			editor.launchTypeEditor(true);
		break;
		case "ED_TYPELEFT":
		case "ED_TYPERIGHT":
			editor.highlightTypeAllCursor();
			if (editor.typeAllCursor - editor.typeAllPage * editor.TYPEALL_PAGELIMIT < editor.TYPEALL_ROWLIMIT)
				editor.typeAllCursor += editor.TYPEALL_ROWLIMIT;
			else
				editor.typeAllCursor -= editor.TYPEALL_ROWLIMIT;
			if (editor.typeAllCursor >= editor.typeAllTypes.length)
				editor.typeAllCursor = editor.typeAllTypes.length - 1;
			editor.updateTypeAllView(false);
		break;
		case "ED_TYPEUP":
			editor.highlightTypeAllCursor();
			editor.typeAllCursor--;
			if (editor.typeAllCursor < 0 || editor.typeAllCursor < editor.typeAllPage * editor.TYPEALL_PAGELIMIT)
				editor.typeAllCursor = (editor.typeAllPage + 1) * editor.TYPEALL_PAGELIMIT - 1;
			if (editor.typeAllCursor >= editor.typeAllTypes.length)
				editor.typeAllCursor = editor.typeAllTypes.length - 1;
			editor.updateTypeAllView(false);
		break;
		case "ED_TYPEDOWN":
			editor.highlightTypeAllCursor();
			editor.typeAllCursor++;
			if (editor.typeAllCursor >= editor.typeAllTypes.length ||
				editor.typeAllCursor - (editor.typeAllPage * editor.TYPEALL_PAGELIMIT) >= editor.TYPEALL_PAGELIMIT)
				editor.typeAllCursor = editor.typeAllPage * editor.TYPEALL_PAGELIMIT;
			editor.updateTypeAllView(false);
		break;
	}
};

static updateTypeAllView(updateTypes=false) {
	// Get dynamic label positions
	var guiLabelInfo = zzt.GuiLabels["TYPE1"];
	var gx1 = utils.int(guiLabelInfo[0]) - 1;
	var gy = utils.int(guiLabelInfo[1]) - 1;
	var guiLabelInfo2 = zzt.GuiLabels["TYPE2"];
	var gx2 = utils.int(guiLabelInfo2[0]) - 1;

	if (updateTypes)
	{
		// Set up type list
		editor.typeAllPageCount = 1;
		editor.typeAllTypes = [];
		var typeAllNameSet = {};
		var typeAllNames = [];
		var typeAllDict = {};

		for (var i = zzt.typeList.length - 1; i >= 0; i--) {
			var eInfo = zzt.typeList[i];
			if (!typeAllNameSet.hasOwnProperty(eInfo.NAME))
			{
				typeAllNameSet[eInfo.NAME] = 1;
				if (editor.typeAllFilter == editor.TYPEFILTER_STATTYPES)
				{
					if (!eInfo.NoStat && eInfo.NUMBER < 254)
					{
						typeAllDict[eInfo.NAME] = i;
						typeAllNames.push(eInfo.NAME);
					}
				}
				else if (editor.typeAllFilter == editor.TYPEFILTER_FLOOR && eInfo.NoStat)
				{
					if (!eInfo.BlockObject && eInfo.NUMBER < 254)
					{
						typeAllDict[eInfo.NAME] = i;
						typeAllNames.push(eInfo.NAME);
					}
				}
				else if (editor.typeAllFilter == editor.TYPEFILTER_BLOCKING && eInfo.NoStat)
				{
					if (eInfo.BlockObject && eInfo.NUMBER < 254)
					{
						typeAllDict[eInfo.NAME] = i;
						typeAllNames.push(eInfo.NAME);
					}
				}
			}
		}

		// Sort types by name
		var sortOrder = typeAllNames;
		sortOrder.sort();

		for (i = 0; i < sortOrder.length; i++) {
			editor.typeAllTypes.push(typeAllDict[sortOrder[i]]);
		}

		// Set cursor and page
		editor.typeAllPageCount = utils.int((editor.typeAllTypes.length - 1) / editor.TYPEALL_PAGELIMIT) + 1;
		if (editor.typeAllCursor >= editor.typeAllTypes.length || editor.typeAllPage >= editor.typeAllPageCount)
		{
			editor.typeAllCursor = 0;
			editor.typeAllPage = 0;
		}
		else
			editor.typeAllPage = utils.int(editor.typeAllCursor / editor.TYPEALL_PAGELIMIT);

		// Write current page of types
		for (i = 0; i < editor.TYPEALL_PAGELIMIT; i++) {
			var csr = editor.typeAllPage * editor.TYPEALL_PAGELIMIT + i;
			var x = gx1;
			var y = gy + i;
			if (csr >= editor.TYPEALL_ROWLIMIT)
			{
				x = gx2;
				y -= editor.TYPEALL_ROWLIMIT;
			}

			var ch = 32;
			var col = 30;
			var fullStr = "";
			if (csr < editor.typeAllTypes.length)
			{
				eInfo = zzt.typeList[editor.typeAllTypes[csr]];
				fullStr = eInfo.NAME;
				ch = eInfo.CHAR;
				col = eInfo.COLOR;
				if (!eInfo.DominantColor)
					col = editor.fgColorCursor + (editor.bgColorCursor * 16) + (editor.blinkFlag ? 128 : 0);
			}

			zzt.mg.writeStr(x, y, "                ", 30);
			zzt.mg.writeStr(x, y, fullStr, 30);
			zzt.mg.setCell(x - 2, y, ch, col);
		}
	}

	// Highlight cursor
	editor.highlightTypeAllCursor();
};

static highlightTypeAllCursor() {
	// Get dynamic label positions
	var guiLabelInfo = zzt.GuiLabels["TYPE1"];
	var gx1 = utils.int(guiLabelInfo[0]) - 1;
	var gy = utils.int(guiLabelInfo[1]) - 1;
	var guiLabelInfo2 = zzt.GuiLabels["TYPE2"];
	var gx2 = utils.int(guiLabelInfo2[0]) - 1;

	// Highlight
	var csr = editor.typeAllCursor - editor.typeAllPage * editor.TYPEALL_PAGELIMIT;
	var x = gx1;
	var y = gy + csr;
	if (csr >= editor.TYPEALL_ROWLIMIT)
	{
		x = gx2;
		csr -= editor.TYPEALL_ROWLIMIT;
		y -= editor.TYPEALL_ROWLIMIT;
	}

	zzt.mg.writeXorAttr(x, y, 16, 1, 127);
	zzt.typeAllInfoDelay = 8;
};

static showTypeAllInfo() {
	if (zzt.thisGuiName != "ED_TYPEALL")
		return;

	var guiLabelInfo3 = zzt.GuiLabels["TYPEINFO"];
	var gx3 = utils.int(guiLabelInfo3[0]) - 1;
	var gy = utils.int(guiLabelInfo3[1]) - 1;

	var x = gx3;
	var y = gy;
	var fullStr = "       ";
	var eInfo = zzt.typeList[editor.typeAllTypes[editor.typeAllCursor]];

	zzt.mg.writeStr(x, y++, eInfo.NUMBER.toString() + fullStr);
	zzt.mg.writeStr(x, y++, eInfo.CYCLE.toString() + fullStr);
	zzt.mg.writeStr(x, y++, eInfo.STEPX.toString() + fullStr);
	zzt.mg.writeStr(x, y++, eInfo.STEPY.toString() + fullStr);
	zzt.mg.writeStr(x, y++, eInfo.CHAR.toString() + fullStr);
	zzt.mg.writeStr(x, y++, eInfo.COLOR.toString() + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.NoStat ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.BlockObject ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.BlockPlayer ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.AlwaysLit ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.DominantColor ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.FullColor ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.TextDraw ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.CustomDraw ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.HasOwnChar ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.HasOwnCode ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, ((eInfo.CustomStart > 0) ? "1" : "0") + fullStr);
	zzt.mg.writeStr(x, y++, eInfo.Pushable.toString() + fullStr);
	zzt.mg.writeStr(x, y++, (eInfo.Squashable ? "1" : "0") + fullStr);

	var extraStr = "";
	for (var k in eInfo.extraVals)
		extraStr += k + "=" + eInfo.extraVals[k].toString() + " ";
	zzt.mg.writeStr(x, y, "                              ");
	zzt.mg.writeStr(x, y, extraStr);
};

static launchTypeEditor(singleFocus) {
	// Reset types; strip out extras from main record
	editor.modFlag = true;
	ZZTLoader.registerBoardState(true);
	ZZTLoader.swapTypeNumbers(true);
	zzt.resetTypes();

	// Ensure extra types are sorted by name.
	var mainKeys = [];
	var newTypeAccountedFor = false;
	var anyExistingTypes = false;
	for (var j = 0; j < zzt.extraTypeList.length; j++) {
		// We will pull out the single-focus type name and put it
		// at the beginning of the order if it was edited explicitly.
		if (editor.newTypeNameFocus == zzt.extraTypeList[j].NAME)
		{
			newTypeAccountedFor = true;
			anyExistingTypes = true;
			mainKeys.push("!!!" + zzt.extraTypeList[j].NAME);
		}
		else
		{
			anyExistingTypes = true;
			mainKeys.push(zzt.extraTypeList[j].NAME);
		}
	}

	var sortOrder = mainKeys;
	sortOrder.sort();

	// Capture all extra types as JSON
	var overallStr = "{\n";
	if (singleFocus && !editor.hasExistingTypeSpec && !newTypeAccountedFor)
	{
		overallStr += editor.newTypeString;
		if (anyExistingTypes)
			overallStr += ",\n\n";
	}

	for (var k = 0; k < sortOrder.length; k++) {
		var i = 0;
		var thisName = sortOrder[k];
		if (utils.startswith(thisName, "!!!"))
			thisName = thisName.substr(3);

		for (var j = 0; j < zzt.extraTypeList.length; j++) {
			if (zzt.extraTypeList[j].NAME == thisName)
			{
				i = j;
				break;
			}
		}

		if (editor.newTypeNameFocus == zzt.extraTypeList[i].NAME)
		{
			overallStr += editor.newTypeString;
		}
		else
		{
			var eInfo = zzt.extraTypeList[i];
			var eStr = eInfo.toString();
			if (zzt.extraTypeCode.hasOwnProperty(eInfo.NAME))
				eStr += "\"" + zzt.markUpCodeQuotes(zzt.extraTypeCode[eInfo.NAME]) + "\"\n}";
			else
				eStr += "\"\n#END\n\"\n}";

			overallStr += eStr;
		}

		if (k < sortOrder.length - 1)
			overallStr += ",\n\n";
	}

	overallStr += "\n}";

	// Show dictionary
	editor.editedPropName = "$JSONTYPES";
	zzt.propDictToUpdate = {};
	zzt.showPropTextView(zzt.MODE_ENTEREDITORPROP, "Customized Types", overallStr);
};

static showWorldInfo() {
	editor.updateEditorView();

	// Write standard stuff
	var wp = zzt.globalProps;
	var title = "Edit World Properties";
	var lines = [];
	lines.push("!WORLDNAME;WORLDNAME:  " + wp["WORLDNAME"]);
	lines.push("!WORLDTYPE;WORLDTYPE:  " + wp["WORLDTYPE"] + " (-3=ZZT Ultra)");
	lines.push("!STARTBOARD;STARTBOARD:  " +
		wp["STARTBOARD"] + " " + ZZTLoader.getBoardName(wp["STARTBOARD"], true));
	lines.push("------------------------------");
	lines.push("!$INVPROP;Inventory properties");
	lines.push("!$JSONWORLDPROP;All properties (JSON)");
	lines.push("------------------------------");
	lines.push("!$GLOBALS;Global variables (common)");
	lines.push("!$JSONGLOBALS;Global variables (all, using JSON)");
	lines.push("------------------------------");
	lines.push("!$JSONTYPES;Edit Types using JSON");
	lines.push("!$JSONMASKS;Edit Masks using JSON");
	lines.push("!$JSONSOUNDFX;Edit Sounds using JSON");
	lines.push("------------------------------");
	lines.push("!$GUIMANAGER;GUI Manager");
	lines.push("!$WADMANAGER;WAD Manager");

	editor.showEditorScroll(lines, title, editor.SM_WORLDINFO);
};

static showInventoryScroll() {
	editor.modFlag = true;
	var lines = [];
	for (var i = 0; i < editor.inventoryWorldKeys.length; i++)
	{
		var s = editor.inventoryWorldKeys[i];
		if (utils.startswith(s, "KEY"))
		{
			var kVal = utils.int(s.substr(3)) & 15;
			lines.push("!" + s + ";" + s + " (" + editor.prettyColorNames[kVal] + "):  " +
				zzt.globalProps[s].toString());
		}
		else
			lines.push("!" + s + ";" + s + ":  " + zzt.globalProps[s].toString());
	}
	editor.showEditorScroll(lines, "Inventory Properties", editor.SM_INVENTORYINFO);
};

static showGlobalsScroll() {
	editor.modFlag = true;
	zzt.establishGui("ED_DELEDIT");
	zzt.drawGui();

	var sortedKeys = [];
	for (var s in zzt.globals)
	{
		if (s.charAt(0) != "$" && !(Array.isArray(zzt.globals[s])))
			sortedKeys.push(s);
	}
	sortedKeys = sortedKeys.sort(Array.CASEINSENSITIVE);

	var lines = [];
	for (var i = 0; i < sortedKeys.length; i++)
	{
		s = sortedKeys[i];
		lines.push("!" + s + ";" + s + ":  " + zzt.globals[s].toString());
	}

	if (sortedKeys.length == 0)
		editor.handleClosedEditorScroll();
	else
		editor.showEditorScroll(lines, "Common Global Variables", editor.SM_GLOBALS);
};

static showBoardInfo() {
	// Write standard stuff
	var bp = zzt.boardProps;
	var title = "Edit Board Properties";
	var lines = [];
	lines.push("!BOARDNAME;BOARDNAME:  " + bp["BOARDNAME"]);
	lines.push("------------------------------");
	lines.push("!SIZEX;SIZEX:  " + bp["SIZEX"]);
	lines.push("!SIZEY;SIZEY:  " + bp["SIZEY"]);
	lines.push("------------------------------");
	lines.push("!ISDARK;ISDARK:  " + bp["ISDARK"]);
	lines.push("!RESTARTONZAP;RESTARTONZAP:  " + bp["RESTARTONZAP"]);
	lines.push("!TIMELIMIT;TIMELIMIT:  " + bp["TIMELIMIT"] + " (0=No limit)");
	lines.push("!MAXPLAYERSHOTS;MAXPLAYERSHOTS:  " + bp["MAXPLAYERSHOTS"]);
	lines.push("------------------------------");
	lines.push("!EXITNORTH;EXITNORTH:  " +
		bp["EXITNORTH"] + " " + ZZTLoader.getBoardName(bp["EXITNORTH"]));
	lines.push("!EXITSOUTH;EXITSOUTH:  " +
		bp["EXITSOUTH"] + " " + ZZTLoader.getBoardName(bp["EXITSOUTH"]));
	lines.push("!EXITEAST;EXITEAST:  " +
		bp["EXITEAST"] + " " + ZZTLoader.getBoardName(bp["EXITEAST"]));
	lines.push("!EXITWEST;EXITWEST:  " +
		bp["EXITWEST"] + " " + ZZTLoader.getBoardName(bp["EXITWEST"]));
	lines.push("------------------------------");

	// Write custom stuff
	var notIncludedKeys = ["BOARDNAME", "SIZEX", "SIZEY", "ISDARK", "RESTARTONZAP",
		"TIMELIMIT", "MAXPLAYERSHOTS", "EXITNORTH", "EXITSOUTH", "EXITEAST", "EXITWEST"];
	var sortedKeys = [];
	for (var s in bp)
	{
		if (notIncludedKeys.indexOf(s) == -1)
			sortedKeys.push(s);
	}
	sortedKeys = sortedKeys.sort(Array.CASEINSENSITIVE);

	for (var i = 0; i < sortedKeys.length; i++)
	{
		s = sortedKeys[i];
		lines.push("!" + s + ";" + s + ":  " + bp[s].toString());
	}

	lines.push("------------------------------");
	lines.push("!$JSONBOARDREGIONS;Edit regions using JSON");
	lines.push("!$JSONBOARDINFO;Edit board properties using JSON");

	editor.showEditorScroll(lines, title, editor.SM_BOARDINFO);
};

static showBoardScroll(point2Board=0) {
	// Write standard stuff
	var title = "Choose Board";
	var lines = [];

	var num = zzt.globalProps["NUMBOARDS"];
	for (var i = 0; i < num; i++) {
		var name =
			ZZTLoader.getBoardName(i, Boolean(editor.boardSelectAction != editor.BSA_SETBOARDPROP));
			lines.push("!" + i.toString() + ";" + i.toString() + ":  " + name);
	}

	lines.push("------------------------------");
	lines.push("!$ADDNEWBOARD;Add new board");

	editor.showEditorScroll(lines, title, editor.SM_BOARDSWITCH);
	zzt.msgScrollIndex = point2Board;
};

static showGuiManagerScroll() {
	// Write standard stuff
	editor.modFlag = true;
	var title = "Extra GUIs specific to world";
	var lines = [];

	for (var k in ZZTLoader.extraGuis) {
		lines.push("!" + k + ";" + k);
	}

	lines.push("------------------------------");
	lines.push("!$ADDNEWGUI;Upload new GUI");

	editor.showEditorScroll(lines, title, editor.SM_EXTRAGUI);
};

static showWADManagerScroll() {
	// Write standard stuff
	editor.modFlag = true;
	var title = "Additional WAD lumps";
	var lines = [];

	for (var i = 0; i < ZZTLoader.extraLumps.length; i++) {
		lines.push("!" + i.toString() + ";" + ZZTLoader.extraLumps[i].name +
			": size=" + ZZTLoader.extraLumps[i].len);
	}

	lines.push("------------------------------");
	lines.push("!$ADDNEWLUMP;Upload new WAD lump");

	editor.showEditorScroll(lines, title, editor.SM_EXTRAWAD);
};

static showCodeInterface(codeStr) {
	editor.modFlag = true;
	zzt.showPropTextView(zzt.MODE_ENTEREDITORPROP,
		(editor.editedPropName == "$CODE") ? "SE Object Code" : ".HLP File Code", codeStr);
};

static showTileScroll() {
	// Write standard stuff
	var title = "Tile at (" + editor.editorCursorX.toString() +
		"," + editor.editorCursorY.toString() + ")";
	var lines = [];

	var t = SE.getType(editor.editorCursorX, editor.editorCursorY);
	var c = SE.getColor(editor.editorCursorX, editor.editorCursorY);
	var se = SE.getStatElemAt(editor.editorCursorX, editor.editorCursorY);
	var eInfo = zzt.typeList[t];
	var fgName = utils.rstrip(editor.getPrettyColorName(c & 15));
	var bgName = utils.rstrip(editor.getPrettyColorName((c >> 4) & 7));
	var blink = Boolean((c & 128) != 0) ? ", Blinking" : "";

	lines.push("     Number: " + eInfo.NUMBER.toString() + "  Name:  " + eInfo.NAME);
	lines.push("!$TC" + c.toString() + ";Color: " + c.toString() +
		" " + fgName + " on " + bgName + blink);
	lines.push("------------------------------");

	if (se == null)
	{
		lines.push("     No status element");
		lines.push("------------------------------");
	}
	else
	{
		lines.push("     Status Element Info");
		lines.push("------------------------------");
		t = se.UNDERID;
		c = se.UNDERCOLOR;
		eInfo = zzt.typeList[t];
		fgName = utils.rstrip(editor.getPrettyColorName(c & 15));
		bgName = utils.rstrip(editor.getPrettyColorName((c >> 4) & 7));
		blink = Boolean((c & 128) != 0) ? ", Blinking" : "";

		lines.push("     UNDERID: " + eInfo.NUMBER.toString() + "  Name:  " + eInfo.NAME);
		lines.push("!$TU" + c.toString() + ";UNDERCOLOR: " + c.toString() +
			" " + fgName + " on " + bgName + blink);
		lines.push("!$EDITSTATELEM;Edit Status Element");
	}

	editor.showEditorScroll(lines, title, editor.SM_STATINFO);
};

static showStatScroll() {
	// Write standard stuff
	var title = "Status Element Ordering";
	var lines = [];

	lines.push("------------------------------");
	for (var i = 0; i < SE.statElem.length; i++) {
		var se = SE.statElem[i];
		var eInfo = zzt.typeList[se.TYPE];
		lines.push("!" + i.toString() +
			";(" + se.X.toString() + "," + se.Y.toString() + ") " + eInfo.NAME);
	}

	lines.push("------------------------------");
	editor.showEditorScroll(lines, title, editor.SM_STATLIST);
};

static forceCodeStr(se) {
	if (!se.extra.hasOwnProperty("$CODE"))
	{
		se.extra["$CODE"] = "";
		if (se.extra.hasOwnProperty("CODEID"))
		{
			var unCompID = se.extra["CODEID"] - interp.numBuiltInCodeBlocksPlus;
			if (unCompID >= 0 && unCompID < interp.unCompCode.length)
			{
				// Inherit code from original source, if present
				se.extra["$CODE"] = utils.cr2lf(
					interp.unCompCode[unCompID].substr(interp.unCompStart[unCompID]));
			}
		}
	}
};

static forceCodeStrAll() {
	var numBoards = zzt.globalProps["NUMBOARDS"];
	for (var i = 0; i < numBoards; i++) {
		var bd = ZZTLoader.boardData[i];
		var bp = bd.props;

		for (var j = 0; j < bd.statElem.length; j++)
		{
			// Ensure $CODE exists.
			var se = bd.statElem[j];
			var eInfo = zzt.typeList[se.TYPE];
			if (eInfo.HasOwnCode)
				editor.forceCodeStr(se);
		}
	}
};

static redoUnCompCode() {
	// Strip out non-built-in code blocks.
	var numBoards = zzt.globalProps["NUMBOARDS"];
	interp.zapRecord = [];
	interp.unCompCode = [];
	interp.unCompStart = [];

	// Rebuild the code blocks.
	var unCompId = interp.numBuiltInCodeBlocksPlus;
	for (var i = 0; i < numBoards; i++) {
		var bd = ZZTLoader.boardData[i];
		var bp = bd.props;
		var foundPlayer = false;

		// Write status elements.
		for (var j = 0; j < bd.statElem.length; j++)
		{
			// Status element representing player is always first.
			var se = bd.statElem[j];
			var eInfo = zzt.typeList[se.TYPE];

			if (se.extra.hasOwnProperty("$CODE"))
			{
				se.extra["CODEID"] = unCompId++;
				var numPrefix = eInfo.NUMBER.toString() + "\n";
				interp.unCompCode.push(numPrefix + se.extra["$CODE"]);
				interp.unCompStart.push(numPrefix.length);
			}

			// Status element representing player is always first.
			if (eInfo.NUMBER == 4)
			{
				// The idea is that any PLAYER with CPY=0 is moved to
				// the first position.  Otherwise, the first player
				// found in the status element vector is moved to the
				// first position, even if CPY=1.  Note that no move
				// of CPY=1 PLAYERs will happen if a player had already
				// been moved there.
				if (se.extra["CPY"] == 0 || !foundPlayer)
				{
					foundPlayer = true;
					bd.statElem[j] = bd.statElem[0];
					bd.statElem[0] = se;
					bd.playerSE = se;
				}
			}
		}

		// The player in the first position (if it exists)
		// is automatically assumed to be CPY=0.
		if (foundPlayer)
			bd.statElem[0].extra["CPY"] = 0;
	}
};

static editStatElem() {
	editor.modFlag = true;
	var se = editor.immType[3];
	var eInfo = zzt.typeList[se.TYPE];

	// Write standard stuff
	var title = "Edit " + eInfo.NAME;
	var lines = [];
	lines.push("!CYCLE;CYCLE:  " + se.CYCLE.toString());

	if (se.extra.hasOwnProperty("$CODE"))
		lines.push("!$CODE;(Edit custom code)");

	lines.push("------------------------------");
	lines.push("!DIR;DIR:    " + editor.getNamedStep(se.STEPX, se.STEPY));
	lines.push("!STEPX;STEPX:  " + se.STEPX.toString());
	lines.push("!STEPY;STEPY:  " + se.STEPY.toString());
	lines.push("------------------------------");

	// Write custom stuff
	var sortedKeys = [];
	for (var s in se.extra)
	{
		if (s != "CODEID" && s != "$CODE")
			sortedKeys.push(s);
	}
	sortedKeys = sortedKeys.sort(Array.CASEINSENSITIVE);

	for (var i = 0; i < sortedKeys.length; i++)
	{
		s = sortedKeys[i];
		var extraDesc = "";
		switch (eInfo.NUMBER) {
			case 4:
				if (s == "CPY")
					extraDesc = " (=1 if player clone)";
				else if (s == "$DEADSMILEY")
					extraDesc = " (Dead if present)";
			break;
			case 11:
				if (s == "P3")
					extraDesc = " (Dest=" + ZZTLoader.getBoardName(se.extra[s], true) + ")";
			break;
			case 12:
				if (s == "P2")
					extraDesc = " (Dup. rate, 0-8)";
			break;
			case 13:
				if (s == "P1")
					extraDesc = " (Countdown; 0=inactive)";
			break;
			case 15:
				if (s == "P1")
					extraDesc = " (From:  0=player; 1=enemy)";
				else if (s == "P2")
					extraDesc = " (Lifetime; 0=max)";
			break;
			case 18:
				if (s == "P1")
					extraDesc = " (From:  0=player; 1=enemy)";
			break;
			case 29:
				if (s == "P1")
					extraDesc = " (Start interval, 0-8)";
				if (s == "P2")
					extraDesc = " (Period, 0-8)";
			break;
			case 34:
				if (s == "P1")
					extraDesc = " (Sensitivity, 0-8)";
			break;
			case 35:
				if (s == "P1")
					extraDesc = " (Intelligence, 0-8)";
				if (s == "P2")
					extraDesc = " (Rest time, 0-8)";
			break;
			case 37:
				if (s == "P2")
					extraDesc = " (Rate, 0-8)";
			break;
			case 38:
			case 41:
			case 62:
				if (s == "P1")
					extraDesc = " (Intelligence, 0-8)";
			break;
			case 39:
			case 42:
				if (s == "P1")
					extraDesc = " (Intelligence, 0-8)";
				if (s == "P2")
					extraDesc = " (Firing rate, 0-8; +128=stars)";
			break;
			case 44:
				if (s == "P1")
					extraDesc = " (Intelligence, 0-8)";
				if (s == "P2")
					extraDesc = " (Deviance, 0-8)";
			break;
			case 59:
			case 60:
			case 61:
				if (s == "P1")
					extraDesc = " (Intelligence, 0-8)";
				if (s == "P2")
					extraDesc = " (Switch Rate, 0-8)";
			break;
			default:
				if (s == "CHAR")
					extraDesc = " (" + String.fromCharCode(se.extra[s]) + ")";
			break;
		}

		lines.push("!" + s + ";" + s + ":  " + se.extra[s].toString() + extraDesc);
	}

	lines.push("------------------------------");
	lines.push("!$JSONSTATELEM;Edit using JSON");

	editor.showEditorScroll(lines, title, editor.SM_STATELEM);
};

static specialScrollKeys(theCode) {
	if (editor.scrollMode == editor.SM_STATELEM)
	{
		if (theCode == 37)
			editor.handleSideScroll(-1);
		else if (theCode == 39)
			editor.handleSideScroll(1);
		else if (theCode == 46)
			editor.handlePropDelete();
	}
	else if (editor.scrollMode == editor.SM_STATLIST)
	{
		if (theCode == 37)
			editor.handleStatShift(-1);
		else if (theCode == 39)
			editor.handleStatShift(1);
		else if (theCode == 46)
			editor.handleStatDelete();
	}
	else if (editor.scrollMode == editor.SM_GLOBALS)
	{
		if (theCode == 46)
		{
			var fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
			if (zzt.globals.hasOwnProperty(fmt))
			{
				delete zzt.globals[fmt];
				editor.showGlobalsScroll();
			}
		}
	}
	else if (editor.scrollMode == editor.SM_BOARDSWITCH)
	{
		if (theCode == 46)
		{
			fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
			editor.deleteBoard(utils.int(fmt));
		}
	}
	else if (editor.scrollMode == editor.SM_EXTRAGUI)
	{
		if (theCode == 46)
		{
			fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
			delete ZZTLoader.extraGuis[fmt];
			editor.showGuiManagerScroll();
		}
	}
	else if (editor.scrollMode == editor.SM_EXTRAWAD)
	{
		if (theCode == 46)
		{
			fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
			ZZTLoader.extraLumps.splice(utils.int(fmt), 1);
			ZZTLoader.extraLumpBinary.splice(utils.int(fmt), 1);
			editor.showWADManagerScroll();
		}
	}

	if (theCode == 27)
		editor.handleClosedEditorScroll();
};

static handleSideScroll(dir) {
	var fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
	if (fmt == "$" || fmt == "")
		return;

	var se = editor.immType[3];
	var d = 0;
	switch (fmt) {
		case "CYCLE":
			se.CYCLE = se.CYCLE + dir;
			if (se.CYCLE < 1)
				se.CYCLE = 1;
		break;
		case "DIR":
			d = interp.getDir4FromSteps(se.STEPX, se.STEPY) + dir;
			if (d < -1)
				d = 3;
			else if (d > 3)
				d = -1;
			if (d == -1)
			{
				se.STEPX = 0;
				se.STEPY = 0;
			}
			else
			{
				se.STEPX = interp.getStepXFromDir4(d);
				se.STEPY = interp.getStepYFromDir4(d);
			}
		break;
		case "STEPX":
			se.STEPX += dir;
		break;
		case "STEPY":
			se.STEPY += dir;
		break;
		case "P1":
		case "P2":
		case "P3":
		case "CHAR":
			se.extra[fmt] = (se.extra[fmt] + dir) & 255;
		break;
	}

	// Update type
	editor.spotPlace(false, true);
	editor.immType[0] = zzt.mg.getChar(editor.editorCursorX - SE.CameraX + SE.vpX0 - 1,
	editor.editorCursorY - SE.CameraY + SE.vpY0 - 1);
	editor.immType[1] = zzt.mg.getAttr(editor.editorCursorX - SE.CameraX + SE.vpX0 - 1,
	editor.editorCursorY - SE.CameraY + SE.vpY0 - 1);
	editor.add2BBuffer(false);
	editor.drawEditorColorCursors();

	// Update scroll
	var oldScrollIdx = zzt.msgScrollIndex;
	editor.editStatElem();
	zzt.msgScrollIndex = oldScrollIdx;
};

static handleStatShift(dir) {
	var fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
	if (fmt == "$" || fmt == "")
		return;

	// Get shift position; exit if unshiftable direction
	var i = utils.int(fmt);
	var se = SE.statElem[i];
	if (i == 0 && dir == -1)
		return;
	if (i == SE.statElem.length - 1 && dir == 1)
		return;

	// Swap the status element ordering
	var otherSE = SE.statElem[i + dir];
	SE.statElem[i] = otherSE;
	SE.statElem[i + dir] = se;

	// Update scroll
	var oldScrollIdx = zzt.msgScrollIndex;
	editor.showStatScroll();
	zzt.msgScrollIndex = oldScrollIdx;
};

static handlePropDelete() {
	var fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
	if (fmt == "$" || fmt == "")
		return;

	var se = editor.immType[3];
	if (fmt == "$CODE" || fmt == "$JSONSTATELEM")
		; // Can't remove interfacial button
	else if (se.extra.hasOwnProperty(fmt))
	{
		var eInfo = zzt.typeList[se.TYPE];
		if (eInfo.extraVals.hasOwnProperty(fmt))
		{
			// Can't remove--just set to zero
			se.extra[fmt] = 0;
		}
		else
		{
			// Remove item
			delete se.extra[fmt];
		}
	}

	editor.updateStatTypeInScroll();
};

static handleStatDelete() {
	var fmt = zzt.msgScrollFormats[zzt.msgScrollIndex + zzt.mouseScrollOffset];
	if (fmt == "$" || fmt == "")
		return;

	// Delete
	var i = utils.int(fmt);
	var se = SE.statElem[i];
	se.FLAGS |= interp.FL_DEAD;
	editor.killSE(se.X, se.Y);

	// Update scroll
	var oldScrollIdx = zzt.msgScrollIndex;
	editor.showStatScroll();
	zzt.msgScrollIndex = oldScrollIdx;
};

static handleClosedEditorScroll() {
	switch (editor.scrollMode) {
		case editor.SM_WORLDINFO:
		case editor.SM_BOARDINFO:
		case editor.SM_STATELEM:
		case editor.SM_INVENTORYINFO:
		case editor.SM_GLOBALS:
		case editor.SM_WORLDTYPECHOICELOAD:
		case editor.SM_EXTRAGUI:
		case editor.SM_EXTRAWAD:
			zzt.mainMode = zzt.MODE_SCROLLCLOSE;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(true);
			editor.cursorActive = true;
		break;
		case editor.SM_CHAREDITLOAD:
		case editor.SM_CHAREDITSAVE:
			zzt.mainMode = zzt.MODE_SCROLLCLOSE;
		break;
		case editor.SM_WORLDTYPECHOICESAVE:
		case editor.SM_TRANSFER:
			zzt.mainMode = zzt.MODE_NORM;
			zzt.titleGrid.visible = false;
			zzt.scrollGrid.visible = false;
			zzt.scrollArea.visible = false;
			editor.cursorActive = true;
		break;
		case editor.SM_BOARDSWITCH:
		case editor.SM_STATINFO:
		case editor.SM_UNDERCOLOR:
		case editor.SM_STATLIST:
		case editor.SM_OBJLIB:
			zzt.mainMode = zzt.MODE_SCROLLCLOSE;
			zzt.establishGui(zzt.prefEditorGui);
			editor.updateEditorView(false);
			editor.cursorActive = true;
		break;
	}

	editor.scrollMode = 0;
};

static showEditorScroll(lines, title, sMode) {
	zzt.numTextLines = 0;
	zzt.msgScrollFormats = [];
	zzt.msgScrollText = [];
	zzt.msgScrollFiles = true;

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.charAt(0) == "!")
		{
			// Button link
			var txtStart = line.indexOf(";");
			var btnText = line.substring(1, txtStart);
			zzt.addMsgLine(btnText, line.substr(txtStart+1));
		}
		else
		{
			// Ordinary text
			zzt.addMsgLine("", line);
		}
	}

	// Initiate scroll
	editor.scrollMode = sMode;
	zzt.ScrollMsg(title);
};

static scrollInterfaceButton(fmt) {
	if (fmt == "$" || fmt == "")
	{
		editor.handleClosedEditorScroll();
		return;
	}

	var se = editor.immType[3];
	var s = "";
	var i = 0;
	var sizeX = zzt.boardProps["SIZEX"];
	var sizeY = zzt.boardProps["SIZEY"];
	switch (editor.scrollMode) {
		case editor.SM_STATELEM:
			if (fmt == "$JSONSTATELEM")
				editor.displayJSONProps(fmt);
			else if (fmt == "$CODE")
			{
				editor.editedPropName = fmt;
				editor.showCodeInterface(se.extra["$CODE"]);
			}
			else if (fmt == "CHAR")
			{
				// Character selection
				zzt.titleGrid.visible = false;
				zzt.scrollGrid.visible = false;
				zzt.scrollArea.visible = false;
				editor.hexCodeValue = utils.int0(se.extra[fmt]);
				editor.selectCharDialog(fmt);
			}
			else if (fmt == "P3" && zzt.typeList[se.TYPE].NUMBER == 11)
			{
				// Passage destination
				editor.boardSelectAction = editor.BSA_SETPASSAGEDEST;
				editor.editedPropName = fmt;
				zzt.establishGui("ED_DELEDIT");
				zzt.drawGui();
				editor.showBoardScroll(se.extra[fmt]);
			}
			else
			{
				switch (fmt) {
					case "DIR":
						s = interp.getDir4FromSteps(se.STEPX, se.STEPY).toString();
					break;
					case "CYCLE":
						s = se.CYCLE.toString();
					break;
					case "STEPX":
						s = se.STEPX.toString();
					break;
					case "STEPY":
						s = se.STEPY.toString();
					break;
					default:
						if (se.extra.hasOwnProperty(fmt))
							s = se.extra[fmt].toString();
					break;
				}

				editor.editedPropName = fmt;
				zzt.drawGuiLabel("FILEMESSAGE", " " + fmt + ":");
				zzt.textEntry("FILEENTRY", s, 20, 15, "ED_STATVALUPDATE", "ED_STATVALCANCEL");
			}
		break;

		case editor.SM_BOARDINFO:
			editor.modFlag = true;
			if (fmt == "$JSONBOARDINFO" || fmt == "$JSONBOARDREGIONS")
				editor.displayJSONProps(fmt);
			else if (fmt == "EXITNORTH" || fmt == "EXITSOUTH" ||
				fmt == "EXITEAST" || fmt == "EXITWEST")
			{
				editor.boardSelectAction = editor.BSA_SETBOARDPROP;
				editor.editedPropName = fmt;
				zzt.establishGui("ED_DELEDIT");
				zzt.drawGui();
				editor.showBoardScroll(zzt.boardProps[fmt]);
			}
			else
			{
				s = zzt.boardProps[fmt].toString();
				editor.editedPropName = fmt;
				zzt.drawGuiLabel("FILEMESSAGE", " " + fmt + ":");
				zzt.textEntry("FILEENTRY", s, 20, 15, "ED_BOARDPROPUPDATE", "ED_BOARDPROPCANCEL");
			}
		break;

		case editor.SM_WORLDINFO:
		case editor.SM_INVENTORYINFO:
			editor.modFlag = true;
			switch (fmt) {
				case "STARTBOARD":
					editor.boardSelectAction = editor.BSA_SETWORLDPROP;
					editor.editedPropName = fmt;
					zzt.establishGui("ED_DELEDIT");
					zzt.drawGui();
					editor.showBoardScroll(zzt.globalProps[fmt]);
				break;
				case "$INVPROP":
					editor.showInventoryScroll();
				break;
				case "$GLOBALS":
					editor.showGlobalsScroll();
				break;
				case "$JSONWORLDPROP":
				case "$JSONGLOBALS":
				case "$JSONTYPES":
				case "$JSONMASKS":
				case "$JSONSOUNDFX":
					editor.displayJSONProps(fmt);
				break;
				case "$GUIMANAGER":
					zzt.establishGui("ED_DELEDIT");
					zzt.drawGui();
					editor.showGuiManagerScroll();
				break;
				case "$WADMANAGER":
					zzt.establishGui("ED_DELEDIT");
					zzt.drawGui();
					editor.showWADManagerScroll();
				break;
				default:
					s = zzt.globalProps[fmt].toString();
					editor.editedPropName = fmt;
					zzt.drawGuiLabel("FILEMESSAGE", " " + fmt + ":");
					zzt.textEntry("FILEENTRY", s, 20, 15, "ED_WORLDPROPUPDATE", "ED_WORLDPROPCANCEL");
				break;
			}
		break;

		case editor.SM_GLOBALS:
			editor.modFlag = true;
			s = zzt.globals[fmt].toString();
			editor.editedPropName = fmt;
			zzt.drawGuiLabel("FILEMESSAGE", " " + fmt + ":");
			zzt.textEntry("FILEENTRY", s, 20, 15, "ED_GLOBALSUPDATE", "ED_GLOBALSCANCEL");
		break;

		case editor.SM_TRANSFER:
			editor.modFlag = true;
			i = utils.int(fmt);
			editor.handleClosedEditorScroll();

			if (i == 0)
				parse.loadLocalFile("WAD", zzt.MODE_LOADTRANSFERWAD);
			else if (i == 1)
			{
				editor.worldSaveType = -3;
				zzt.globalProps["WORLDTYPE"] = -3;
				zzt.globalProps["CODEDELIMETER"] = "\n";
				ZZTLoader.resetSEIDs();
				editor.redoUnCompCode();
				if (ZZTLoader.saveWAD(".WAD", zzt.globalProps["BOARD"]))
					editor.saveWorld("TEMP.WAD");
			}
		break;
		case editor.SM_WORLDTYPECHOICELOAD:
			i = utils.int(fmt);
			if (i == 0)
				parse.loadLocalFile("WAD", zzt.MODE_LOADWAD);
			else if (i == 1)
				parse.loadLocalFile("ZZT", zzt.MODE_NATIVELOADZZT);
			else if (i == 2)
				parse.loadLocalFile("SZT", zzt.MODE_NATIVELOADSZT);

			editor.handleClosedEditorScroll();
		break;
		case editor.SM_WORLDTYPECHOICESAVE:
			i = utils.int(fmt);
			editor.handleClosedEditorScroll();

			if (editor.saveTest(i))
			{
				if (i == 0)
				{
					editor.worldSaveType = -3;
					zzt.globalProps["WORLDTYPE"] = -3;
					zzt.globalProps["CODEDELIMETER"] = "\n";
					ZZTLoader.resetSEIDs();
					editor.redoUnCompCode();
					if (ZZTLoader.saveWAD(".WAD"))
						editor.saveWorld();
				}
				else if (!editor.doSave(i))
					zzt.displayTextBrowser("Save Errors", editor.errorMsgs + "\nUnable to save.",
						zzt.MTRANS_NORM);
				else if (editor.errorMsgs != "")
					zzt.displayTextBrowser("Save Messages", editor.errorMsgs + "\nEnd of Messages.",
						zzt.MTRANS_SAVEWORLD);
				else
					editor.saveWorld();
			}
			else
				zzt.displayTextBrowser("Save Errors", editor.errorMsgs + "\nUnable to save.",
					zzt.MTRANS_NORM);
		break;

		case editor.SM_BOARDSWITCH:
			if (fmt == "$ADDNEWBOARD")
			{
				i = zzt.globalProps["NUMBOARDS"];
				editor.addNewBoard();
			}
			else
				i = utils.int(fmt);

			switch (editor.boardSelectAction) {
				case editor.BSA_SETBOARDPROP:
					zzt.boardProps[editor.editedPropName] = i;
					zzt.establishGui("ED_SCROLLEDIT");
					zzt.drawGui();
					editor.showBoardInfo();
				break;
				case editor.BSA_SETWORLDPROP:
					zzt.globalProps[editor.editedPropName] = i;
					zzt.establishGui("ED_SCROLLEDIT");
					zzt.drawGui();
					editor.showWorldInfo();
				break;
				case editor.BSA_SETPASSAGEDEST:
					se.extra[editor.editedPropName] = i;
					zzt.establishGui("ED_STATEDIT");
					zzt.drawGui();
					editor.updateStatTypeInScroll();
					editor.drawEditorPatternCursor();
					editor.drawEditorColorCursors();
				break;
				case editor.BSA_SWITCHBOARD:
					// Switch board
					ZZTLoader.registerBoardState(true);
					ZZTLoader.updateContFromBoard(i, ZZTLoader.boardData[i]);
					SE.IsDark = 0;
					editor.boardWidth = zzt.boardProps["SIZEX"];
					editor.boardHeight = zzt.boardProps["SIZEY"];
					if (editor.boardWidth != sizeX || editor.boardHeight != sizeY)
					{
						editor.editorCursorX = 1;
						editor.editorCursorY = 1;
						SE.CameraX = 1;
						SE.CameraY = 1;
					}

					editor.handleClosedEditorScroll();
				break;
			};
		break;

		case editor.SM_STATINFO:
		case editor.SM_UNDERCOLOR:
			if (utils.startswith(fmt, "$TC"))
			{
				i = utils.int(fmt.substr(3));
				editor.fgColorCursor = i & 15;
				editor.bgColorCursor = (i >> 4) & 7;
				editor.blinkFlag = Boolean((i & 128) != 0);
				zzt.titleGrid.visible = false;
				zzt.scrollGrid.visible = false;
				zzt.scrollArea.visible = false;
				editor.dispatchEditorMenu("ED_KOLOR");
			}
			else if (utils.startswith(fmt, "$TU"))
			{
				editor.scrollMode = editor.SM_UNDERCOLOR;
				i = utils.int(fmt.substr(3));
				editor.fgColorCursor = i & 15;
				editor.bgColorCursor = (i >> 4) & 7;
				editor.blinkFlag = Boolean((i & 128) != 0);
				zzt.titleGrid.visible = false;
				zzt.scrollGrid.visible = false;
				zzt.scrollArea.visible = false;
				editor.dispatchEditorMenu("ED_KOLOR");
			}
			else if (fmt == "$EDITSTATELEM")
			{
				editor.dispatchEditorMenu("ED_PICKUP");
			}
		break;
		case editor.SM_STATLIST:
			i = utils.int(fmt);
			se = SE.statElem[i];
			editor.editorCursorX = se.X;
			editor.editorCursorY = se.Y;
			editor.dispatchEditorMenu("ED_PICKUP");
		break;

		case editor.SM_OBJLIB:
			editor.modFlag = true;
			if (fmt == "$PLACEALL")
			{
				for (i = 0; i < editor.objLibraryBuffer.length; i++)
					editor.placeObjLibraryAt(1 + i, 1, i);
			}
			else
				editor.placeObjLibraryAt(editor.editorCursorX, editor.editorCursorY, utils.int(fmt));

			editor.handleClosedEditorScroll();
		break;

		case editor.SM_EXTRAGUI:
			editor.modFlag = true;
			if (fmt == "$ADDNEWGUI")
			{
				parse.loadLocalFile("ZZTGUI", zzt.MODE_LOADEXTRAGUI);
				editor.handleClosedEditorScroll();
			}
			else if (ZZTLoader.extraGuis.hasOwnProperty(fmt))
			{
				parse.saveLocalFile(".ZZTGUI", zzt.MODE_NORM, zzt.MODE_NORM,
				parse.jsonToText(ZZTLoader.extraGuis[fmt]));
				editor.handleClosedEditorScroll();
			}
			else
				editor.handleClosedEditorScroll();
		break;

		case editor.SM_EXTRAWAD:
			editor.modFlag = true;
			if (fmt == "$ADDNEWLUMP")
			{
				parse.loadLocalFile("ALL", zzt.MODE_LOADEXTRALUMP);
				editor.handleClosedEditorScroll();
			}
			else if (utils.int(fmt) < ZZTLoader.extraLumps.length)
			{
				parse.saveLocalFile("untitled", zzt.MODE_NORM, zzt.MODE_NORM,
				ZZTLoader.extraLumpBinary[utils.int(fmt)]);
				editor.handleClosedEditorScroll();
			}
			else
				editor.handleClosedEditorScroll();
		break;

		case editor.SM_CHAREDITLOAD:
			if (fmt == "CE_LOADMASK")
			{
				zzt.textEntry("CONFMESSAGE", "", 8, 15, "CE_LOADMASKYES", "CE_LOADSAVECANCEL");
			}
			else if (fmt == "CE_LOADFILE")
			{
				parse.loadLocalFile("ALL", zzt.MODE_LOADCHAREDITFILE);
				editor.handleClosedEditorScroll();
			}
		break;
		case editor.SM_CHAREDITSAVE:
			if (fmt == "CE_SAVEMASK")
			{
				zzt.textEntry("CONFMESSAGE", "", 8, 15, "CE_SAVEMASKYES", "CE_LOADSAVECANCEL");
			}
			else if (fmt == "CE_SAVELUMP")
			{
				zzt.textEntry("CONFMESSAGE", "", 8, 15, "CE_SAVELUMPYES", "CE_LOADSAVECANCEL");
			}
			else if (fmt == "CE_SAVEFILE")
			{
				parse.saveLocalFile("ALL", zzt.MODE_NORM, zzt.MODE_NORM,
				interp.makeBitSequence(interp.getFlatSequence(editor.ceStorage)));
				editor.handleClosedEditorScroll();
			}
		break;
	}
};

static placeObjLibraryAt(x, y, i) {
	// Erase previous
	editor.killSE(x, y);
	SE.setType(x, y, 0);

	// Place new type
	var obj = editor.objLibraryBuffer[i];
	var se = new SE(zzt.objectType, x, y, obj["COLOR"]);

	se.CYCLE = obj["CYCLE"];
	se.STEPX = obj["STEPX"];
	se.STEPY = obj["STEPY"];
	se.extra["CHAR"] = obj["CHAR"];
	se.extra["$CODE"] = obj["$CODE"];

	SE.setStatElemAt(x, y, se);
	SE.statElem.push(se);
};

static selectCharDialog(fmt="") {
	editor.editedPropName = fmt;
	editor.cursorActive = false;
	zzt.mainMode = zzt.MODE_CHARSEL;
	zzt.establishGui("ED_CHARS");

	for (var y = 1; y <= 8; y++) {
		zzt.GuiTextLines[y] = String.fromCharCode(179);
		for (var x = 1; x <= 32; x++) {
			zzt.GuiTextLines[y] += String.fromCharCode((y-1) * 32 + (x-1));
		}
		zzt.GuiTextLines[y] += String.fromCharCode(179);
	}

	zzt.drawGui();
	editor.drawCharCursor(true);
};

static updateStatVal() {
	editor.modFlag = true;
	var fmt = editor.editedPropName;
	var val = zzt.textChars;
	var se = editor.immType[3];

	var testInt;
	switch (fmt) {
		case "DIR":
			se.STEPX = interp.getStepXFromDir4(utils.int0(val));
			se.STEPY = interp.getStepYFromDir4(utils.int0(val));
		break;
		case "CYCLE":
			se.CYCLE = utils.int0(val);
			if (se.CYCLE < 1)
				se.CYCLE = 1;
		break;
		case "STEPX":
			se.STEPX = utils.int0(val);
		break;
		case "STEPY":
			se.STEPY = utils.int0(val);
		break;
		default:
			// Store as integer only if resembles an integer
			testInt = utils.int0(val);
			if (testInt.toString() != val)
				se.extra[fmt] = val;
			else
				se.extra[fmt] = testInt;
		break;
	}

	editor.updateStatTypeInScroll();
};

static updateBoardProp() {
	var fmt = editor.editedPropName;
	var val = zzt.textChars;

	var bd = ZZTLoader.boardData[zzt.globalProps["BOARD"]];
	var oldSizeX = zzt.boardProps["SIZEX"];
	var oldSizeY = zzt.boardProps["SIZEY"];
	var testInt = utils.int0(val);
	switch (fmt) {
		case "SIZEX":
		case "SIZEY":
			// Board size change needs to be realistic; keep cursor valid
			if (testInt < 1)
				testInt = 1;
			editor.editorCursorX = 1;
			editor.editorCursorY = 1;
			zzt.boardProps[fmt] = testInt;
			if (zzt.boardProps["SIZEX"] * zzt.boardProps["SIZEY"] > 65536)
			{
				// Max tile limit reached; clip sizes
				zzt.boardProps["SIZEX"] = 60;
				zzt.boardProps["SIZEY"] = 25;
			}
			editor.boardWidth = zzt.boardProps["SIZEX"];
			editor.boardHeight = zzt.boardProps["SIZEY"];

			// We need to do some buffer size juggling; revert size back to old
			// so that we can write back the current grid to a buffer with a
			// different stride than before.
			bd.typeBuffer.length = editor.boardWidth * editor.boardHeight;
			bd.colorBuffer.length = editor.boardWidth * editor.boardHeight;
			bd.lightBuffer.length = editor.boardWidth * editor.boardHeight;
			zzt.boardProps["SIZEX"] = oldSizeX;
			zzt.boardProps["SIZEY"] = oldSizeY;
			ZZTLoader.ensureGridSpace(editor.boardWidth, editor.boardHeight);
			ZZTLoader.registerBoardState(true, editor.boardWidth, editor.boardHeight);

			// Set new size and reconstitute border
			zzt.boardProps["SIZEX"] = editor.boardWidth;
			zzt.boardProps["SIZEY"] = editor.boardHeight;
			ZZTLoader.updateContFromBoard(zzt.globalProps["BOARD"], bd);
			editor.updateEditorView(false);
		break;
		default:
			// Store as integer only if resembles an integer
			if (testInt.toString() != val)
				zzt.boardProps[fmt] = val;
			else
				zzt.boardProps[fmt] = testInt;
		break;
	}

	// Update scroll
	SE.IsDark = 0;
	var oldScrollIdx = zzt.msgScrollIndex;
	editor.showBoardInfo();
	zzt.msgScrollIndex = oldScrollIdx;
};

static updateWorldProp() {
	var fmt = editor.editedPropName;
	var val = zzt.textChars;

	// Store as integer only if resembles an integer
	var testInt = utils.int0(val);
	if (testInt.toString() != val)
		zzt.globalProps[fmt] = val;
	else
		zzt.globalProps[fmt] = testInt;

	// Update scroll
	var oldScrollIdx = zzt.msgScrollIndex;
	if (editor.scrollMode == editor.SM_INVENTORYINFO)
		editor.showInventoryScroll();
	else
		editor.showWorldInfo();

	zzt.msgScrollIndex = oldScrollIdx;
};

static updateGlobals() {
	var fmt = editor.editedPropName;
	var val = zzt.textChars;

	// Store as integer only if resembles an integer
	var testInt = utils.int0(val);
	if (testInt.toString() != val)
		zzt.globals[fmt] = val;
	else
		zzt.globals[fmt] = testInt;

	// Update scroll
	var oldScrollIdx = zzt.msgScrollIndex;
	editor.showGlobalsScroll();
	zzt.msgScrollIndex = oldScrollIdx;
};

static updateStatTypeInScroll() {
	// Update type
	editor.spotPlace(false, true);
	var se = SE.getStatElemAt(editor.editorCursorX, editor.editorCursorY);
	se.UNDERID = editor.immType[3].UNDERID;
	se.UNDERCOLOR = editor.immType[3].UNDERCOLOR;

	editor.immType[0] = zzt.mg.getChar(editor.editorCursorX - SE.CameraX + SE.vpX0 - 1,
		editor.editorCursorY - SE.CameraY + SE.vpY0 - 1);
	editor.immType[1] = zzt.mg.getAttr(editor.editorCursorX - SE.CameraX + SE.vpX0 - 1,
		editor.editorCursorY - SE.CameraY + SE.vpY0 - 1);
	editor.add2BBuffer(false);
	editor.drawEditorColorCursors();

	// Update scroll
	var oldScrollIdx = zzt.msgScrollIndex;
	editor.editStatElem();
	zzt.msgScrollIndex = oldScrollIdx;
};

static loadZZL() {
	// Get text of file
	var s = parse.fileData.readUTFBytes(parse.fileData.length);
	var lines = s.split("\n");

	// Initialize
	var inDef = false;
	var libName = "";
	var descLines = [];
	var numLines = 0;
	var linesRead = 0;
	var objs = [];
	var curObj = {};

	// Parse lines
	for (var i = 0; i < lines.length; i++) {
		// Trim CR if present
		var line = lines[i];
		if (line.charCodeAt(line.length - 1) == 13)
			line = line.substr(0, line.length - 1);

		if (i == 0)
			libName = line; // Library name
		else if (inDef)
		{
			// Code line of definition
			curObj["$CODE"] += line + "\n";
			if (++linesRead >= numLines)
			{
				// Done with definition
				inDef = false;
				objs.push(curObj);
				curObj = {};
			}
		}
		else if (line.length == 0)
			; // Do nothing
		else if (!inDef && line.charAt(0) == "*")
			descLines.push(line.substr(1)); // Descriptive text
		else
		{
			// Start definition
			inDef = true;
			curObj["OfficialName"] = line;

			var attrs = lines[++i].split(",");
			numLines = utils.int(utils.rstrip(attrs[0]));
			linesRead = 0;

			curObj["CHAR"] = utils.int(attrs[1]);
			var fg = utils.int(attrs[2]) & 15;
			var bg = utils.int(attrs[3]);
			curObj["COLOR"] = fg + bg * 16 + (fg > 15 ? 128 : 0);
			curObj["STEPX"] = utils.int(attrs[4]);
			curObj["STEPY"] = utils.int(attrs[5]);
			curObj["CYCLE"] = utils.int(attrs[6]);
			curObj["$CODE"] = "";
		}
	}

	// Show scroll of all objects.
	var title = "Object Library";
	lines = [];
	lines.push(libName);
	lines.push("------------------------------");
	lines.push("!$PLACEALL;Place all in 1st row");
	lines.push("------------------------------");
	for (i = 0; i < objs.length; i++) {
		lines.push("!" + i.toString() + ";" + objs[i]["OfficialName"]);
	}

	editor.objLibraryBuffer = objs;
	editor.showEditorScroll(lines, title, editor.SM_OBJLIB);
};

static uploadExtraGui() {
	// Upload GUI file into extras.
	var jObj = parse.jsonDecode(parse.fileData.readUTFBytes(parse.fileData.length), "ALL");
	if (jObj != null)
	{
		var k = parse.lastFileName;
		if (utils.endswith(k, ".ZZTGUI"))
			k = k.substr(0, k.length - 7);

		ZZTLoader.extraGuis[k] = jObj;
	}

	editor.showGuiManagerScroll();
};

static uploadExtraLump(backToWADManager=true) {
	// Upload file into extra WAD lumps.
	var ba = parse.fileData;
	if (ba != null)
	{
		// Extra lump name from filename; mold into 8-byte uppercase.
		var lName = parse.lastFileName.toUpperCase();

		// No extension
		var idx = lName.indexOf(".");
		if (idx != -1)
			lName = lName.substr(0, idx);

		// Space-padded at right; 8-byte limit
		lName += "        ";
		if (lName.length > 8)
			lName = lName.substr(0, 8);

		// Cannot match any native lump name
		if (ZZTLoader.isNativeLump(lName))
			lName = lName.substr(0, 7) + "_";

		// Add to extras (offset is meaningless until file write occurs)
		ZZTLoader.extraLumps.push(new Lump(0, ba.length, lName));
		ZZTLoader.extraLumpBinary.push(ba);
	}

	if (backToWADManager)
		editor.showWADManagerScroll();
};

static showTransferScroll() {
	// Show scroll of transfer choices.
	var title = "Transfer board";
	var lines = [];
	lines.push("!0;Import Board from WAD");
	lines.push("!1;Export Board to WAD");

	editor.showEditorScroll(lines, title, editor.SM_TRANSFER);
};

static loadWorldScroll() {
	// Show scroll of world choices.
	var title = "Load World File";
	var lines = [];
	lines.push("!0;WAD (ZZT Ultra)");
	lines.push("!1;ZZT (Original ZZT)");
	lines.push("!2;SZT (Super ZZT)");

	editor.showEditorScroll(lines, title, editor.SM_WORLDTYPECHOICELOAD);
};

static saveWorldScroll() {
	// Show scroll of world choices.
	var title = "Save World File As...";
	var lines = [];
	lines.push("!0;WAD (ZZT Ultra)");
	lines.push("!1;ZZT (Original ZZT)");
	lines.push("!2;SZT (Super ZZT)");

	editor.showEditorScroll(lines, title, editor.SM_WORLDTYPECHOICESAVE);
	if (zzt.globalProps["WORLDTYPE"] == -1)
		zzt.msgScrollIndex = 1;
	else if (zzt.globalProps["WORLDTYPE"] == -2)
		zzt.msgScrollIndex = 2;
};

static regErrorMsg(errStr) {
	editor.errorMsgs += "ERROR:  " + errStr + "\n";
};

static regWarningMsg(errStr) {
	editor.errorMsgs += "Warning:  " + errStr + "\n";
};

static regInfoMsg(errStr) {
	editor.errorMsgs += errStr + "\n";
};

static errorIfOutOfRange(name, val, lower, upper) {
	if (val < lower || val > upper)
		editor.regErrorMsg(name + " is out of the range [" + lower + ", " + upper + "].");
};

static warningIfOutOfRange(name, val, lower, upper) {
	if (val < lower || val > upper)
		editor.regWarningMsg(name + " should be in range [" + lower + ", " + upper + "].");
};

static writePascalString(wBuf, name, val, maxLen) {
	var actualLen = val.length;
	if (actualLen > maxLen)
	{
		actualLen = maxLen;
		editor.regWarningMsg(name + " length is > " + maxLen + " chars; will be clipped.");
	}

	// Write length and string.
	wBuf.writeByte(actualLen);
	wBuf.writeUTFBytes(val.substr(0, actualLen));

	// Blank-fill the padding at the end.
	for (; actualLen < maxLen; actualLen++)
		wBuf.writeByte(32);
};

static writeConstantByte(wBuf, val, len) {
	while (len-- > 0)
		wBuf.writeByte(val);
};

static saveTest(sType) {
	// Register current board state; capture edits.
	editor.errorMsgs = "";
	ZZTLoader.registerBoardState(true);
	if (sType == 0)
		return true; // Native WAD format; always succeeds

	// Get format code and bounding parameters
	var wType = -1;
	var baseSizeX = 60;
	var baseSizeY = 25;
	var baseOffset = 512;
	var flagLimit = 10;
	var statLimit = 151;
	if (sType == 2) {
		wType = -2;
		baseSizeX = 96;
		baseSizeY = 80;
		baseOffset = 1024;
		flagLimit = 16;
		statLimit = 129;
	}

	// Test if global variables will work.
	var varCount = 0;
	for (var k in zzt.globals) {
		if (k.charAt(0) != "$")
			varCount++;
	}

	if (varCount > flagLimit)
		editor.regErrorMsg("Number of flags would be " + varCount + "; max is " + flagLimit);

	// Test if world properties will work.
	var numBoards = zzt.globalProps["NUMBOARDS"];
	editor.errorIfOutOfRange("NUMBOARDS", numBoards, 1, 255);
	editor.errorIfOutOfRange("STARTBOARD", zzt.globalProps["STARTBOARD"], 0, numBoards - 1);
	editor.errorIfOutOfRange("AMMO", zzt.globalProps["AMMO"], 0, 32767);
	editor.errorIfOutOfRange("GEMS", zzt.globalProps["GEMS"], 0, 32767);
	editor.errorIfOutOfRange("TORCHES", zzt.globalProps["TORCHES"], 0, 32767);
	editor.errorIfOutOfRange("HEALTH", zzt.globalProps["HEALTH"], 0, 32767);
	editor.errorIfOutOfRange("SCORE", zzt.globalProps["SCORE"], -32768, 32767);
	editor.errorIfOutOfRange("TIME", zzt.globalProps["TIME"], 0, 32767);
	editor.errorIfOutOfRange("Z", zzt.globalProps["Z"], -32768, 32767);
	editor.errorIfOutOfRange("TORCHCYCLES", zzt.globalProps["TORCHCYCLES"], 0, 32767);
	editor.errorIfOutOfRange("ENERGIZERCYCLES", zzt.globalProps["ENERGIZERCYCLES"], 0, 32767);

	// Test if all board sizes and properties will work.
	for (var i = 0; i < numBoards; i++) {
		var bd = ZZTLoader.boardData[i];
		var bp = bd.props;

		if (bp["SIZEX"] != baseSizeX || bp["SIZEY"] != baseSizeY)
			editor.regErrorMsg("Board " + bp["BOARDNAME"] + " has invalid dimensions.");

		editor.errorIfOutOfRange("MAXPLAYERSHOTS", bp["MAXPLAYERSHOTS"], 0, 255);
		editor.errorIfOutOfRange("CURPLAYERSHOTS", bp["CURPLAYERSHOTS"], 0, 255);
		editor.errorIfOutOfRange("ISDARK", bp["ISDARK"], 0, 1);
		editor.errorIfOutOfRange("EXITNORTH", bp["EXITNORTH"], 0, numBoards - 1);
		editor.errorIfOutOfRange("EXITSOUTH", bp["EXITSOUTH"], 0, numBoards - 1);
		editor.errorIfOutOfRange("EXITWEST", bp["EXITWEST"], 0, numBoards - 1);
		editor.errorIfOutOfRange("EXITEAST", bp["EXITEAST"], 0, numBoards - 1);
		editor.errorIfOutOfRange("RESTARTONZAP", bp["RESTARTONZAP"], 0, 1);
		editor.errorIfOutOfRange("TIMELIMIT", bp["TIMELIMIT"], 0, 65535);

		if (bd.statElem.length > statLimit)
			editor.regErrorMsg("Status element count is " + bd.statElem.length +
				"; max is " + statLimit);

		// Search status elements
		var hasPlayer = false;
		for (var j = 0; j < bd.statElem.length; j++) {
			var se = bd.statElem[j];

			if (se.X <= 0 || se.Y <= 0 || se.X > baseSizeX || se.Y > baseSizeY)
				editor.regErrorMsg("Off-grid status element:  " + se.X + "," + se.Y);

			if (zzt.typeList[se.TYPE].NUMBER == 4)
				hasPlayer = true;
		}

		if (!hasPlayer)
			editor.regErrorMsg("Board " + bp["BOARDNAME"] + " has no PLAYER.");
	}

	return Boolean(editor.errorMsgs == "");
};

static getStatElemAtCursor(statElem, csr, baseSizeX) {
	var x = csr % baseSizeX;
	var y = utils.int((csr - x) / baseSizeX);

	for (var i = 0; i < statElem.length; i++) {
		if (statElem[i].X == x + 1 && statElem[i].Y == y + 1)
		return statElem[i];
	}

	// Should not happen in theory...unless passage SE is missing.
	return null;
};

static doSave(sType) {
	editor.errorMsgs = "";
	editor.sBuffer = new ByteArray();

	// Get format code and bounding parameters
	var wType = -3;
	var baseSizeX = 60;
	var baseSizeY = 25;
	var baseOffset = 512;
	var flagLimit = 10;
	if (sType == 1)
		wType = -1;
	else if (sType == 2)
	{
		wType = -2;
		baseSizeX = 96;
		baseSizeY = 80;
		baseOffset = 1024;
		flagLimit = 16;
	}

	// World header and properties
	editor.sBuffer.writeShort(wType);
	var numBoards = zzt.globalProps["NUMBOARDS"];
	editor.sBuffer.writeShort(numBoards - 1);
	editor.sBuffer.writeShort(zzt.globalProps["AMMO"]);
	editor.sBuffer.writeShort(zzt.globalProps["GEMS"]);

	for (var i = 0; i < 7; i++) {
		var keyStr = "KEY" + (i + 9);
		editor.sBuffer.writeByte(zzt.globalProps[keyStr]);
		editor.warningIfOutOfRange(keyStr, zzt.globalProps[keyStr], 0, 1);
	}

	editor.sBuffer.writeShort(zzt.globalProps["HEALTH"]);
	if (zzt.globalProps["HEALTH"] <= 0)
		editor.regWarningMsg("HEALTH is <= 0; player will start 'dead.'");
	editor.sBuffer.writeShort(zzt.globalProps["STARTBOARD"]);

	if (wType == -1)
	{
		editor.sBuffer.writeShort(zzt.globalProps["TORCHES"]);
		editor.sBuffer.writeShort(zzt.globalProps["TORCHCYCLES"]);
		editor.sBuffer.writeShort(zzt.globalProps["ENERGIZERCYCLES"]);
		editor.sBuffer.writeShort(0); // Unused
		editor.sBuffer.writeShort(zzt.globalProps["SCORE"]);
	}
	else
	{
		editor.sBuffer.writeShort(0); // Unused
		editor.sBuffer.writeShort(zzt.globalProps["SCORE"]);
		editor.sBuffer.writeShort(0); // Unused
		editor.sBuffer.writeShort(zzt.globalProps["ENERGIZERCYCLES"]);
	}

	editor.writePascalString(editor.sBuffer, "WORLDNAME", zzt.globalProps["WORLDNAME"], 20);

	// Global variables (flags)
	var secretLoc = -1;
	var flagsWritten = 0;
	i = 0;
	for (var k in zzt.globals) {
		if (k.charAt(0) != "$")
		{
			if (k == "SECRET" && zzt.globals[k] != 0)
			{
				editor.regInfoMsg("SECRET flag detected; will be moved to position 0.");
				secretLoc = i;
			}
			i++;
		}
	}

	if (secretLoc != -1)
	{
		editor.writePascalString(editor.sBuffer, "SECRET", "SECRET", 20);
		flagsWritten++;
	}

	for (k in zzt.globals) {
		if (k.charAt(0) != "$" && k != "SECRET" && zzt.globals[k] != 0)
		{
			if (zzt.globals[k] != 1)
				editor.regWarningMsg(k + " flag is not 1; results may be undefined.");
			editor.writePascalString(editor.sBuffer, k, k, 20);
			flagsWritten++;
		}
	}

	while (flagsWritten < flagLimit)
	{
		editor.writePascalString(editor.sBuffer, "", "", 20);
		flagsWritten++;
	}

	// Remaining world properties
	if (wType == -1)
	{
		editor.sBuffer.writeShort(zzt.globalProps["TIME"]);
		editor.sBuffer.writeShort(0); // "Player data"
		editor.sBuffer.writeByte(zzt.globalProps["LOCKED"]);
	}
	else
	{
		editor.sBuffer.writeShort(zzt.globalProps["TIME"]);
		editor.sBuffer.writeShort(0); // "Player data"
		editor.sBuffer.writeByte(zzt.globalProps["LOCKED"]);
		editor.sBuffer.writeShort(zzt.globalProps["Z"]);
	}

	// Pad to base offset
	editor.writeConstantByte(editor.sBuffer, 0, baseOffset - editor.sBuffer.length);

	// Handle individual boards.
	var se;
	for (i = 0; i < numBoards; i++) {
		var bd = ZZTLoader.boardData[i];
		var bp = bd.props;

		var bBuffer = new ByteArray();
		bBuffer.writeShort(0); // Size will need to be updated later.
		editor.writePascalString(bBuffer, "BOARDNAME", bp["BOARDNAME"], (wType == -1) ? 50 : 60);

		// Pack RLE data.
		var totalSquares = baseSizeX * baseSizeY;
		for (var c = 0; c < totalSquares;)
		{
			var count = 1;
			var typ = bd.typeBuffer.b[c];
			var col = bd.colorBuffer.b[c];
			while (++c < totalSquares) {
				if (typ == bd.typeBuffer.b[c] && col == bd.colorBuffer.b[c])
				{
					if (++count >= 255)
					{
						c++;
						break;
					}
				}
				else
					break;
			}

			var num = zzt.typeList[typ].NUMBER;
			switch (num) {
				// Special messages
				case 2:
				case 3:
					editor.regWarningMsg("Type " + zzt.typeList[typ].NAME +
						" is uncommon; risky to use.");
				break;
				case 6:
				case 38:
					if (wType == -2)
						editor.regWarningMsg("Type " + zzt.typeList[typ].NAME +
							" is undefined in SZT format.");
				break;
				case 47:
				case 48:
				case 49:
				case 50:
				case 51:
				case 59:
				case 60:
				case 61:
				case 62:
				case 63:
				case 64:
					if (wType == -1)
						editor.regWarningMsg("Type " + zzt.typeList[typ].NAME +
							" is undefined in ZZT format.");
				break;

				// Type translation
				case 15:
					if (wType == -2)
						num = 72;
				break;
				case 18:
					if (wType == -2)
						num = 69;
				break;
				case 33:
					if (wType == -2)
						num = 70;
				break;
				case 43:
					if (wType == -2)
						num = 71;
				break;
				case 73:
				case 74:
				case 75:
				case 76:
				case 77:
				case 78:
				case 79:
					if (wType == -1)
						num = num + (47 - 73);
				break;

				// Color translation
				case 9:
					// Invert door FG and BG
					col = ((col >> 4) & 15) + (((col ^ 8) << 4) & 240);
				break;
				case 11:
					// Process passage colors
					se = editor.getStatElemAtCursor(bd.statElem, c - 1, baseSizeX);
					if (se.extra["P2"] & 15 == 15)
						col = (col & 7) * 16 + 15;
					else
						col = se.extra["P2"];
				break;

				// Unmappable types
				default:
					if (typ >= interp.numBuiltInTypes)
						editor.regWarningMsg("Type " + zzt.typeList[typ].NAME +
							" is undefined outside of ZZT Ultra.");
				break;
			}

			bBuffer.writeByte(count & 255);
			bBuffer.writeByte(num);
			bBuffer.writeByte(col);
		}

		// Status element accounting.
		var playerPos = -1;
		var sCoords = [];

		for (var j = 0; j < bd.statElem.length; j++)
		{
			se = bd.statElem[j];
			var eInfo = zzt.typeList[se.TYPE];

			for (var ci = 0; ci < sCoords.length; ci++)
			{
				if (sCoords[ci].x == se.X && sCoords[ci].y == se.Y)
					editor.regWarningMsg("Double status element at (" + se.X + ", " + se.Y + ").");
			}
			sCoords.push(new IPoint(se.X, se.Y));

			if (eInfo.NUMBER == 4)
			{
				// Establish which player is the "real" player.
				if (playerPos != -1 || se.extra["CPY"] == 0)
				{
					bp["PLAYERENTERX"] = se.X;
					bp["PLAYERENTERY"] = se.Y;
					playerPos = j;
				}
			}
		}

		// Board properties.
		bBuffer.writeByte(bp["MAXPLAYERSHOTS"]);
		if (wType == -1)
			bBuffer.writeByte(bp["ISDARK"]);
		bBuffer.writeByte(bp["EXITNORTH"]);
		bBuffer.writeByte(bp["EXITSOUTH"]);
		bBuffer.writeByte(bp["EXITWEST"]);
		bBuffer.writeByte(bp["EXITEAST"]);
		bBuffer.writeByte(bp["RESTARTONZAP"]);

		if (wType == -1)
			editor.writePascalString(bBuffer, "MESSAGE", bp["MESSAGE"], 58);

		bBuffer.writeByte(bp["PLAYERENTERX"]);
		bBuffer.writeByte(bp["PLAYERENTERY"]);

		if (wType == -2)
		{
			bBuffer.writeShort(bp["CAMERAX"]);
			bBuffer.writeShort(bp["CAMERAY"]);
		}

		bBuffer.writeShort(bp["TIMELIMIT"]);

		if (wType == -1)
			editor.writeConstantByte(bBuffer, 0, 16);
		else
			editor.writeConstantByte(bBuffer, 0, 14);

		var seLenPos = bBuffer.length;
		var seLen = bd.statElem.length - 1;
		bBuffer.writeShort(seLen);

		// Write status elements.
		for (j = 0; j < bd.statElem.length; j++)
		{
			// Status element representing player is always first.
			se = bd.statElem[j];
			if (j == 0 && playerPos != -1)
				se = bd.statElem[playerPos];
			else if (j == playerPos)
				se = bd.statElem[0];

			eInfo = zzt.typeList[se.TYPE];

			// Skip "dead" smileys; these do not have status elements.
			if (eInfo.NUMBER == 4 && se.extra.hasOwnProperty("$DEADSMILEY"))
			{
				editor.regInfoMsg("A 'dead smiley' was saved in " + bp["BOARDNAME"]);
				seLen--;
				continue;
			}

			// Write coordinates and SE fields
			bBuffer.writeByte(se.X);
			bBuffer.writeByte(se.Y);
			bBuffer.writeShort(se.STEPX);
			bBuffer.writeShort(se.STEPY);
			bBuffer.writeShort(se.CYCLE);

			var P1 = se.extra.hasOwnProperty("P1") ? se.extra["P1"] : 0;
			var P2 = se.extra.hasOwnProperty("P2") ? se.extra["P2"] : 0;
			var P3 = se.extra.hasOwnProperty("P3") ? se.extra["P3"] : 0;

			var FOLLOWER = se.extra.hasOwnProperty("FOLLOWER") ? se.extra["FOLLOWER"] : 0;
			var LEADER = se.extra.hasOwnProperty("LEADER") ? se.extra["LEADER"] : 0;
			if (FOLLOWER >= 65536 || FOLLOWER < 0)
				FOLLOWER = 65535;
			if (LEADER >= 65536 || LEADER < 0)
				LEADER = 65535;

			if (eInfo.NUMBER == 36)
			{
				P1 = se.extra["CHAR"];
				P2 = (se.FLAGS & interp.FL_LOCKED) ? 1 : 0;
			}

			bBuffer.writeByte(P1);
			bBuffer.writeByte(P2);
			bBuffer.writeByte(P3);
			bBuffer.writeShort(FOLLOWER);
			bBuffer.writeShort(LEADER);
			bBuffer.writeByte(zzt.typeList[se.UNDERID].NUMBER);
			bBuffer.writeByte(se.UNDERCOLOR);
			bBuffer.writeInt(0); // Ptr
			bBuffer.writeShort(0); // IP

			var codeStr = "";
			if (eInfo.NUMBER == 10 || eInfo.NUMBER == 36)
			{
				//forceCodeStr(se);
				codeStr = se.extra["$CODE"];
			}

			bBuffer.writeShort(codeStr.length);
			if (wType == -1)
				editor.writeConstantByte(bBuffer, 0, 8);

			if (codeStr.length > 0)
			{
				for (var si = 0; si < codeStr.length; si++)
				{
					var b = codeStr.charCodeAt(si);
					bBuffer.writeByte((b == 10) ? 13 : b);
				}
			}
		}

		// Size and concatenate the board buffer to the whole buffer.
		var bSize = bBuffer.length;
		if (bSize >= 32768)
		{
			editor.regErrorMsg("Board " + bp["BOARDNAME"] + " is >= 32 KB; too large.");
			return false;
		}
		else if (bSize > 20480)
			editor.regWarningMsg("Board " + bp["BOARDNAME"] + " is > 20 KB; carries risks.");

		bBuffer.position = 0;
		bBuffer.writeShort(bBuffer.length - 2);
		bBuffer.position = seLenPos;
		bBuffer.writeShort(seLen);
		bBuffer.position = bBuffer.length;
		editor.sBuffer.writeBytes(bBuffer, 0, bBuffer.length);
	}

	editor.worldSaveType = wType;
	return true;
};

static saveWorld(useFileName="") {
	var fileName = parse.lastFileName;
	if (useFileName != "")
		fileName = useFileName;

	if (utils.endswith(fileName, ".WAD") || utils.endswith(fileName, ".ZZT") ||
		utils.endswith(fileName, ".SZT"))
		fileName = fileName.substr(0, fileName.length - 4);
	else
		fileName = "";

	switch (editor.worldSaveType) {
		case -1:
			editor.modFlag = false;
			fileName = fileName + ".ZZT";
			parse.saveLocalFile(fileName, zzt.MODE_SAVELEGACY, zzt.MODE_NORM, editor.sBuffer);
		break;
		case -2:
			editor.modFlag = false;
			fileName = fileName + ".SZT";
			parse.saveLocalFile(fileName, zzt.MODE_SAVELEGACY, zzt.MODE_NORM, editor.sBuffer);
		break;
		case -3:
			if (useFileName == "")
				editor.modFlag = false;
			fileName = fileName + ".WAD";
			parse.saveLocalFile(fileName, zzt.MODE_SAVEWAD, zzt.MODE_NORM, ZZTLoader.file);
		break;
	}
};

static displayJSONProps(msg) {
	var se;
	var i;
	var k;
	var s;
	var textStr;
	var titleStr;

	switch (msg) {
		case "$JSONBOARDINFO":
			zzt.propDictToUpdate = zzt.boardProps;
			titleStr = "Board Properties";
			textStr = parse.jsonToText(zzt.propDictToUpdate, true);
		break;
		case "$JSONBOARDREGIONS":
			zzt.propDictToUpdate = zzt.regions;
			titleStr = "Board Regions";
			textStr = parse.jsonToText(zzt.propDictToUpdate, true);
		break;
		case "$JSONWORLDPROP":
			zzt.propDictToUpdate = zzt.globalProps;
			titleStr = "World Properties";
			textStr = parse.jsonToText(zzt.propDictToUpdate, true, "DEP_");
		break;
		case "$JSONGLOBALS":
			zzt.propDictToUpdate = zzt.globals;
			titleStr = "Global Variables";
			textStr = parse.jsonToText(zzt.propDictToUpdate, true);
		break;
		case "$JSONMASKS":
			zzt.propDictToUpdate = ZZTLoader.extraMasks;
			titleStr = "Masks";
			s = parse.jsonToText(zzt.propDictToUpdate, true);
			textStr = editor.formatMaskStr(s);
		break;
		case "$JSONSOUNDFX":
			zzt.propDictToUpdate = ZZTLoader.extraSoundFX;
			titleStr = "Sound FX";
			textStr = parse.jsonToText(zzt.propDictToUpdate, true);
		break;
		case "$JSONSTATELEM":
			editor.tempStatProps = {};
			se = editor.immType[3];
			editor.tempStatProps["CYCLE"] = se.CYCLE;
			editor.tempStatProps["X"] = se.X;
			editor.tempStatProps["Y"] = se.Y;
			editor.tempStatProps["STEPX"] = se.STEPX;
			editor.tempStatProps["STEPY"] = se.STEPY;
			editor.tempStatProps["FLAGS"] = se.FLAGS;
			editor.tempStatProps["delay"] = se.delay;
			editor.tempStatProps["IP"] = se.IP;
			editor.tempStatProps["UNDERID"] = se.UNDERID;
			editor.tempStatProps["UNDERCOLOR"] = se.UNDERCOLOR;
			for (k in se.extra)
				editor.tempStatProps[k] = se.extra[k];

			zzt.propDictToUpdate = editor.tempStatProps;
			titleStr = "Status Element";
			textStr = parse.jsonToText(zzt.propDictToUpdate, true);
		break;

		case "$JSONTYPES":
			editor.hasExistingTypeSpec = true;
			editor.newTypeString = "";
			editor.newTypeNameFocus = "";
			editor.launchTypeEditor(false);
		return;
	}

	editor.editedPropName = msg;
	zzt.showPropTextView(zzt.MODE_ENTEREDITORPROP, titleStr, textStr);
};

static parseJSONProps() {
	var msg = editor.editedPropName;
	var srcStr = utils.cr2lf(zzt.guiPropText.value);
	var i;
	var k;
	var se;

	editor.modFlag = true;
	if (msg == "$CODE" || msg == "")
	{
		// Object code is not stored in JSON format; just take it as-is.
		zzt.hidePropTextView(zzt.MODE_NORM);
		if (msg == "$CODE")
		{
			se = editor.immType[3];
			se.extra["$CODE"] = srcStr;
			editor.updateStatTypeInScroll();
		}
		else
		{
			// Open dialog to save as savegame
			editor.oldHlpStr = srcStr;
			parse.saveLocalFile("UNTITLED.HLP", zzt.MODE_SAVEHLP, zzt.MODE_NORM, srcStr);
		}
		return;
	}

	var jObj = parse.jsonDecode(srcStr, "ALL");
	if (jObj == null)
		return;

	zzt.hidePropTextView(zzt.MODE_NORM);
	switch (msg) {
		case "$JSONBOARDINFO":
			for (k in zzt.propDictToUpdate)
				delete zzt.propDictToUpdate[k];
			for (k in jObj)
				zzt.propDictToUpdate[k] = jObj[k];

			editor.showBoardInfo();
		break;
		case "$JSONBOARDREGIONS":
			for (k in zzt.propDictToUpdate)
				delete zzt.propDictToUpdate[k];
			for (k in jObj)
				zzt.propDictToUpdate[k] = jObj[k];

			editor.showBoardInfo();
		break;

		case "$JSONWORLDPROP":
			for (k in zzt.propDictToUpdate)
			{
				if (!utils.startswith(k, "DEP_"))
					delete zzt.propDictToUpdate[k];
			}
			for (k in jObj)
				zzt.propDictToUpdate[k] = jObj[k];

			editor.showWorldInfo();
		break;
		case "$JSONGLOBALS":
		case "$JSONSOUNDFX":
			for (k in zzt.propDictToUpdate)
				delete zzt.propDictToUpdate[k];
			for (k in jObj)
				zzt.propDictToUpdate[k] = jObj[k];

			editor.showWorldInfo();
		break;
		case "$JSONMASKS":
			for (k in zzt.propDictToUpdate)
				delete zzt.propDictToUpdate[k];
			for (k in jObj)
			{
				zzt.propDictToUpdate[k] = jObj[k];
				zzt.addMask(k, jObj[k]);
			}

			editor.showWorldInfo();
		break;

		case "$JSONSTATELEM":
			se = editor.immType[3];
			se.CYCLE = jObj["CYCLE"];
			se.X = jObj["X"];
			se.Y = jObj["Y"];
			se.STEPX = jObj["STEPX"];
			se.STEPY = jObj["STEPY"];
			se.FLAGS = jObj["FLAGS"];
			se.delay = jObj["delay"];
			se.IP = jObj["IP"];
			se.UNDERID = jObj["UNDERID"];
			se.UNDERCOLOR = jObj["UNDERCOLOR"];

			for (k in se.extra)
			{
				if (editor.nonExtraStatusKeys.indexOf(k) == -1)
					delete se.extra[k];
			}
			for (k in jObj)
			{
				if (editor.nonExtraStatusKeys.indexOf(k) == -1)
					se.extra[k] = jObj[k];
			}

			editor.updateStatTypeInScroll();
		break;

		case "$JSONTYPES":
			// When we establish the extra types, we must temporarily swap the
			// types within the gridded data with numbers, so that we don't end
			// up with type indexes pointing nowhere.
			zzt.establishExtraTypes(jObj);
			ZZTLoader.swapTypeNumbers(false);
			i = zzt.globalProps["BOARD"];
			ZZTLoader.updateContFromBoard(i, ZZTLoader.boardData[i]);
			SE.IsDark = 0;

			if (editor.newTypeNameFocus == "")
				editor.showWorldInfo();
			else
			{
				editor.cursorActive = true;
				editor.updateEditorView(false);
			}
		break;
	}
};

static formatMaskStr(s) {
	s = (s.split("[\"").join("[\n\""));
	s = (s.split("],").join("]\n,"));
	s = (s.split(",\"").join(",\n\""));

	return s;
};

static setCustomPatternCursorPos(newPos) {
	if (newPos >= editor.actualBBLen)
		newPos = editor.actualBBLen - 1;
	if (newPos < 0)
		newPos = 0;

	editor.patternCursor = -1;
	editor.patternBBCursor = newPos;
	editor.drawEditorPatternCursor();
};

static colorVis2Stored(type, color, actualChar) {
	var num = zzt.typeList[type].NUMBER;
	if (num == 11 || num == 9)
	{
		// Passages and doors should have FG and BG swapped.
		return (((color >> 4) & 15) ^ 8) + ((color << 4) & 240);
	}
	else if (zzt.typeList[type].TextDraw)
	{
		// Text drawing uses character as color.
		return actualChar;
	}

	return color;
};

static spotPlace(fromDrawingMode, useImmType=false) {
	var pType = editor.immType;
	if (fromDrawingMode)
	{
		if (editor.acquireMode)
		{
			// Instead of placing content, acquire the tile.
			editor.pickupCursor();
			editor.updateEditorView(true);
			return;
		}

		// Don't place if simple movement would not draw anything.
		if (editor.drawFlag == editor.DRAW_OFF || editor.drawFlag == editor.DRAW_TEXT)
			return;
	}

	editor.modFlag = true;
	if (!useImmType)
	{
		pType = editor.getPType();

		// If pulling from back buffer or pattern table...
		if (editor.patternCursor == -1)
		{
			// Back buffer iteration
			if (editor.drawFlag == editor.DRAW_ACQFORWARD)
			{
				if (++editor.patternBBCursor >= editor.actualBBLen)
					editor.patternBBCursor = 0;
				editor.drawEditorPatternCursor();
			}
			else if (editor.drawFlag == editor.DRAW_ACQBACK)
			{
				if (--editor.patternBBCursor < 0)
					editor.patternBBCursor = editor.actualBBLen - 1;
				editor.drawEditorPatternCursor();
			}
		}
		else if (editor.editorStyle == editor.EDSTYLE_ULTRA || editor.editorStyle == editor.EDSTYLE_KEVEDIT)
		{
			// Built-in table iteration
			if (editor.drawFlag == editor.DRAW_ACQFORWARD)
			{
				if (++editor.patternCursor >= editor.patternBuiltIn - 1)
					editor.patternCursor = 0;
				editor.drawEditorPatternCursor();
			}
			else if (editor.drawFlag == editor.DRAW_ACQBACK)
			{
				if (--editor.patternCursor < 0)
					editor.patternCursor = editor.patternBuiltIn - 2;
				editor.drawEditorPatternCursor();
			}
		}
	}

	// Determine shown color.
	var useColor = pType[1];
	if (!editor.defColorMode)
		useColor = (editor.blinkFlag ? 128 : 0) + (editor.bgColorCursor * 16) + editor.fgColorCursor;

	// Get type; tweak color if type has special rendering.
	var eType = interp.typeTrans[pType[2]];
	var eInfo = zzt.typeList[eType];
	var visColor = useColor;
	useColor = editor.colorVis2Stored(eType, useColor, pType[0]);

	editor.killSE(editor.editorCursorX, editor.editorCursorY);
	if (pType[3] == null)
	{
		// No-stat
		SE.setType(editor.editorCursorX, editor.editorCursorY, eType);
		SE.setColor(editor.editorCursorX, editor.editorCursorY, useColor, false);
	}
	else
	{
		// Stat
		var se = new SE(eType, editor.editorCursorX, editor.editorCursorY, useColor);
		SE.setStatElemAt(editor.editorCursorX, editor.editorCursorY, se);
		SE.statElem.push(se);

		var oldSE = pType[3];
		se.STEPX = oldSE.STEPX;
		se.STEPY = oldSE.STEPY;
		se.CYCLE = oldSE.CYCLE;
		se.IP = oldSE.IP;
		se.FLAGS = oldSE.FLAGS;
		se.delay = oldSE.delay;

		for (var s in oldSE.extra)
			se.extra[s] = oldSE.extra[s];

		// Passages have P2 set to visual color.
		if (eInfo.NUMBER == 11)
			se.extra["P2"] = visColor;
	}

	// Show updated square at cursor
	editor.eraseEditorCursor();
};

static killSE(x, y) {
	editor.modFlag = true;
	var relSE = SE.getStatElemAt(x, y);
	if (relSE != null)
	{
		// Kill status element at destination
		relSE.FLAGS |= interp.FL_DEAD;
		relSE.eraseSelfSquare(false);
		editor.removeDead();
	}
};

static removeDead() {
	for (var i = 0; i < zzt.statElem.length; i++)
	{
		if ((zzt.statElem[i].FLAGS & interp.FL_DEAD) != 0)
		{
			zzt.statElem.splice(i, 1);
			i--;
		}
	}
};

static warpEditorCursor(spotX, spotY, shiftStatus=false) {
	if (spotX < 1 || spotY < 1 || spotX > editor.boardWidth || spotY > editor.boardHeight)
		return;

	if (shiftStatus)
	{
		if (editor.anchorX == -1)
		{
			editor.anchorX = editor.editorCursorX;
			editor.anchorY = editor.editorCursorY;
		}
		else
			editor.removeRectSel();

		editor.eraseEditorCursor();
		editor.editorCursorX = spotX;
		editor.editorCursorY = spotY;
		editor.addToRectSel();
	}
	else
	{
		editor.anchorX = -1;
		editor.eraseEditorCursor();
		editor.editorCursorX = spotX;
		editor.editorCursorY = spotY;
		editor.spotPlace(true);
		editor.drawEditorCursor();
	}
};

static updateEditorView(guiOnly=false) {
	// Draw GUI-oriented fields
	zzt.drawGui();
	editor.drawEditorColorCursors();
	editor.drawEditorPatternCursor();
	if (guiOnly)
		return;

	// If updating board, draw it in its entirety
	editor.reCenterEditorCursor();
	SE.uCameraX = -1000;
	SE.uCameraY = -1000;

	// Tweak the viewport if the board size would constrain what can be edited
	var sizeX = zzt.boardProps["SIZEX"];
	var sizeY = zzt.boardProps["SIZEY"];
	if (sizeX < 60)
	{
		SE.vpWidth = sizeX;
		SE.vpX1 = sizeX;
	}
	else
	{
		SE.vpWidth = 60;
		SE.vpX1 = 60;
	}
	if (sizeY < 25)
	{
		SE.vpHeight = sizeY;
		SE.vpY1 = sizeY;
	}
	else
	{
		SE.vpHeight = 25;
		SE.vpY1 = 25;
	}

	interp.smartUpdateViewport();

	// We will need to trim around the "outer rim" if not using the entire area
	for (var y = 1; y <= 25; y++)
	{
		for (var x = sizeX + 1; x <= 60; x++)
			zzt.mg.setCell(x-1, y-1, 69, 14);
	}
	for (y = sizeY + 1; y <= 25; y++)
	{
		for (x = 1; x <= 60; x++)
			zzt.mg.setCell(x-1, y-1, 69, 14);
	}

	// Draw editor cursor and selection info
	editor.drawSelBuffer();
	editor.drawEditorCursor();
};

static drawSelBuffer() {
	var dx = -SE.CameraX + SE.vpX0 - 1;
	var dy = -SE.CameraY + SE.vpY0 - 1;

	for (var i = 0; i < editor.selBuffer.length; i++) {
		var selRange = editor.selBuffer[i];
		zzt.mg.writeXorAttr(selRange.x + dx, selRange.y + dy, 1, 1, 127);
	}
};

static addToRectSel() {
	var y1 = (editor.anchorY < editor.editorCursorY) ? editor.anchorY : editor.editorCursorY;
	var y2 = (editor.anchorY >= editor.editorCursorY) ? editor.anchorY : editor.editorCursorY;
	var x1 = (editor.anchorX < editor.editorCursorX) ? editor.anchorX : editor.editorCursorX;
	var x2 = (editor.anchorX >= editor.editorCursorX) ? editor.anchorX : editor.editorCursorX;

	for (var y = y1; y <= y2; y++) {
		for (var x = x1; x <= x2; x++) {
			var already = false;
			for (var i = 0; i < editor.selBuffer.length; i++) {
				var selRange = editor.selBuffer[i];
				if (x == selRange.x && y == selRange.y)
				{
					already = true;
					break;
				}
			}

			if (!already)
				editor.selBuffer.push(new IPoint(x, y));
		}
	}

	editor.updateEditorView(false);
};

static removeRectSel() {
	if (editor.anchorX == -1)
		return;

	var y1 = (editor.anchorY < editor.editorCursorY) ? editor.anchorY : editor.editorCursorY;
	var y2 = (editor.anchorY >= editor.editorCursorY) ? editor.anchorY : editor.editorCursorY;
	var x1 = (editor.anchorX < editor.editorCursorX) ? editor.anchorX : editor.editorCursorX;
	var x2 = (editor.anchorX >= editor.editorCursorX) ? editor.anchorX : editor.editorCursorX;

	for (var i = 0; i < editor.selBuffer.length; i++) {
		var selRange = editor.selBuffer[i];
		if (selRange.x >= x1 && selRange.x <= x2 && selRange.y >= y1 && selRange.y <= y2)
		{
			editor.selBuffer.splice(i, 1);
			i--;
		}
	}
};

static drawKolorCursor(isOn) {
	var boxCol = editor.fgColorCursor + (editor.blinkFlag ? 16 : 0);
	var boxRow = editor.bgColorCursor;

	if (isOn)
		zzt.mg.setCell(boxCol + zzt.GuiLocX, boxRow + zzt.GuiLocY,
			254, 127 + (editor.blinkFlag ? 0 : 128));
	else
		zzt.displayGuiSquare(boxCol + zzt.GuiLocX + 1, boxRow + zzt.GuiLocY + 1);
};

static drawCharCursor(isOn) {
	var boxCol = editor.hexCodeValue & 31;
	var boxRow = (editor.hexCodeValue >> 5) & 7;

	zzt.mg.setCell(boxCol + zzt.GuiLocX, boxRow + zzt.GuiLocY,
	editor.hexCodeValue, isOn ? 112 : 15);
};

static reCenterEditorCursor() {
	var oldX = SE.CameraX;
	var oldY = SE.CameraY;
	var relX = editor.editorCursorX - SE.CameraX + 1;
	var relY = editor.editorCursorY - SE.CameraY + 1;
	var sizeX = zzt.boardProps["SIZEX"];
	var sizeY = zzt.boardProps["SIZEY"];

	if (relX < SE.vpX0 || relX > SE.vpX1)
	{
		SE.CameraX = editor.editorCursorX - utils.int(SE.vpWidth / 2);
		if (SE.CameraX + SE.vpWidth - 1 > sizeX)
			SE.CameraX = sizeX - SE.vpWidth + 1;
		if (SE.CameraX < 1)
			SE.CameraX = 1;
	}
	if (relY < SE.vpY0 || relY > SE.vpY1)
	{
		SE.CameraY = editor.editorCursorY - utils.int(SE.vpHeight / 2);
		if (SE.CameraY + SE.vpHeight - 1 > sizeY)
			SE.CameraY = sizeY - SE.vpHeight + 1;
		if (SE.CameraY < 1)
			SE.CameraY = 1;
	}

	return Boolean(SE.CameraX != oldX || SE.CameraY != oldY);
};

static eraseEditorCursor() {
	SE.displaySquare(editor.editorCursorX, editor.editorCursorY);
};

static drawEditorCursor() {
	if (editor.reCenterEditorCursor())
		editor.updateEditorView(false);

	if ((zzt.mcount & 31) >= 6)
	{
		zzt.mg.setCell(editor.editorCursorX - SE.CameraX + SE.vpX0 - 1,
		editor.editorCursorY - SE.CameraY + SE.vpY0 - 1, 197, 15);
	}
	else
		editor.eraseEditorCursor();

	editor.drawEditorStatsCoords();
};

static drawEditorColorCursors() {
	var fgMin = 0;
	var fgMax = 15;
	var bgMin = 0;
	var bgMax = 7;
	var fgSplit = false;
	var hasBg = true;

	switch (zzt.thisGuiName) {
		case "ED_CLASSIC":
			fgMin = 9;
			fgMax = 15;
			hasBg = false;
			zzt.drawGuiLabel("COLORNAME", editor.getPrettyColorName(editor.fgColorCursor));
		break;
		case "ED_SUPERZZT":
			fgSplit = true;
			zzt.drawGuiLabel("COLORNAME", editor.getPrettyColorName(editor.fgColorCursor));
		break;
	}

	var fgColorStr = "";
	var bgColorStr = "";
	var fgCols = fgSplit ? 8 : (fgMax - fgMin + 1);
	var bgCols = hasBg ? (bgMax - bgMin + 1) : 0;
	for (var i = 0; i < fgCols; i++)
	{
		if (fgSplit)
		{
			if (i + 8 == editor.fgColorCursor)
				fgColorStr += String.fromCharCode(31);
			else
				fgColorStr += " ";
		}
		else if (i + fgMin == editor.fgColorCursor)
			fgColorStr += String.fromCharCode(31);
		else
			fgColorStr += " ";
	}
	for (var j = 0; j < bgCols; j++)
	{
		if (fgSplit && j + fgMin == editor.fgColorCursor)
			bgColorStr += String.fromCharCode(30);
		else if (j + bgMin == editor.bgColorCursor)
			bgColorStr += String.fromCharCode(24);
		else
			bgColorStr += " ";
	}

	zzt.drawGuiLabel("COLORCURSOR1", fgColorStr);
	if (hasBg)
		zzt.drawGuiLabel("COLORCURSOR2", bgColorStr);
};

static drawEditorPatternCursor() {
	if (!zzt.GuiLabels.hasOwnProperty("PATTERNCURSOR"))
		return;

	var pCursor = 0;
	if (zzt.thisGuiName == "ED_CLASSIC" || zzt.thisGuiName == "ED_SUPERZZT")
	{
		// Back buffer of only one
		editor.actualBBLen = 1;
		if (editor.patternCursor == -1)
			pCursor = 5;
		else
			pCursor = editor.patternCursor;
	}
	else
	{
		// Full back buffer
		if (editor.patternCursor == -1)
			pCursor = 7 + editor.patternBBCursor;
		else
			pCursor = editor.patternCursor;
	}

	// Create pattern cursor string; write to label
	var pLen = zzt.GuiLabels["PATTERNCURSOR"][2];
	var pCursorStr = "";
	for (var j = 0; j < pLen; j++)
	{
		if (j == pCursor)
			pCursorStr += String.fromCharCode(31);
		else
			pCursorStr += " ";
	}

	zzt.drawGuiLabel("PATTERNCURSOR", pCursorStr);

	// Fill drawing-associated flags
	if (zzt.thisGuiName == "ED_CLASSIC" || zzt.thisGuiName == "ED_SUPERZZT")
	{
		if (editor.hexTextEntry > 0)
			zzt.drawGuiLabel("DRAWING", "ASCII Char ", 26);
		else if (editor.drawFlag == editor.DRAW_ON)
			zzt.drawGuiLabel("DRAWING", "Drawing On ", 30);
		else if (editor.drawFlag == editor.DRAW_TEXT)
			zzt.drawGuiLabel("DRAWING", "Text Entry ", 78);
		else
			zzt.drawGuiLabel("DRAWING", "Drawing Off", 31);
	}
	else
	{
		zzt.drawGuiLabel("ENTERTEXT", "Enter Text", (editor.drawFlag == editor.DRAW_TEXT) ? 78 : 31);
		zzt.drawGuiLabel("BLINK", (editor.blinkFlag ? "Blink On " : "Blink Off"),
			(editor.blinkFlag ? 30 : 31));

		if (editor.hexTextEntry > 0)
			zzt.drawGuiLabel("DRAW", "ASCII Char", 26);
		else if (editor.drawFlag == editor.DRAW_ON)
			zzt.drawGuiLabel("DRAW", "Draw On   ", 30);
		else if (editor.drawFlag == editor.DRAW_ACQFORWARD)
			zzt.drawGuiLabel("DRAW", "Draw Rot +", 28);
		else if (editor.drawFlag == editor.DRAW_ACQBACK)
			zzt.drawGuiLabel("DRAW", "Draw Rot -", 29);
		else
			zzt.drawGuiLabel("DRAW", "Draw Off  ", 31);

		zzt.drawGuiLabel("DEFCOLORMODE", (editor.defColorMode ? "D" : "d"), (editor.defColorMode ? 30 : 24));
		zzt.drawGuiLabel("ACQUIREMODE", (editor.acquireMode ? "A" : "a"), (editor.acquireMode ? 30 : 24));
		zzt.drawGuiLabel("BUFLOCK", (editor.bufLockMode ? "/" : String.fromCharCode(179)),
			(editor.bufLockMode ? 12 : 1));
	}

	// Show back buffer contents
	var guiLabelInfo = zzt.GuiLabels["BBUFFER"];
	var gx = utils.int(guiLabelInfo[0]);
	var gy = utils.int(guiLabelInfo[1]);
	var bLen = utils.int(guiLabelInfo[2]);
	gx += zzt.GuiLocX - 2;
	gy += zzt.GuiLocY - 2;

	for (var i = 0; i < bLen; i++)
	{
		if (i >= editor.actualBBLen)
			zzt.mg.setCell(gx + i, gy, 32, 31);
		else
			zzt.mg.setCell(gx + i, gy, editor.bBuffer[i][0], editor.bBuffer[i][1]);
	}
};

static drawEditorStatsCoords() {
	var statStr = zzt.statElem.length.toString() + "/" + editor.maxStats.toString();
	var coordStr = "(" + editor.editorCursorX.toString() + "," + editor.editorCursorY.toString() + ") ";
	zzt.drawGuiLabel("STATS", statStr);
	zzt.drawGuiLabel("COORDS", coordStr);
	zzt.drawGuiLabel("MODFLAG", editor.modFlag ? "*" : " ");
};

static showHiddenObj() {
	for (var y = SE.vpY0; y <= SE.vpY1; y++) {
		for (var x = SE.vpX0; x <= SE.vpX1; x++) {
			var dx = x - SE.vpX0 + SE.CameraX;
			var dy = y - SE.vpY0 + SE.CameraY;

			var se = SE.getStatElemAt(dx, dy);
			if (se)
			{
				var color = SE.getColor(dx, dy);
				if ((color & 15) == ((color >> 4) & 7))
					zzt.mg.setCell(x-1, y-1, 1, 15);
				else
				{
					var char = zzt.mg.getChar(x-1, y-1);
					switch (char) {
						case 0:
						case 32:
						case 255:
						case 219:
						case 176:
						case 177:
						case 178:
							zzt.mg.setCell(x-1, y-1, 1, color);
						break;
					}
				}
			}
		}
	}
};

static showHelp () {
	parse.blankPage("editors.html#worldeditor");
};

}

editor.initClass();
