// interp.js:  The program's OOP interpretation functions.
"use strict";

class interp {

static initClass() {

// Constants

// SE flags
interp.FL_IDLE = 1;
interp.FL_LOCKED = 2;
interp.FL_PENDINGDEAD = 4;
interp.FL_DEAD = 8;
interp.FL_GHOST = 16;
interp.FL_NOSTAT = 32;
interp.FL_DISPATCH = 64;
interp.FL_UNDERLAYER = 128;

// Type placement modes
interp.CF_RETAINSE = 1;
interp.CF_RETAINCOLOR = 2;
interp.CF_REMOVEIFBLOCKING = 4;
interp.CF_GHOSTED = 8;
interp.CF_UNDERLAYER = 16;

// Text target locations
interp.TEXT_TARGET_NORM = 0;
interp.TEXT_TARGET_GUI = 1;
interp.TEXT_TARGET_GRID = 2;

interp.SCRIPT_DEADLOCK_THRESHOLD = 65536;

// Variables
interp.step2Dir4 = [ 2, 3, 3, 2, -1, 0, 1, 1, 0 ];
interp.step2Dir8 = [ 5, 6, 7, 4, -1, 0, 3, 2, 1 ];
interp.dir2StepX = [ 1, 1, 0, -1, -1, -1, 0, 1, 1 ];
interp.dir2StepY = [ 0, 1, 1, 1, 0, -1, -1, -1, 0 ];
interp.typeList = null;
interp.typeTrans = null;
interp.codeBlocks = null;
interp.unCompCode = null;
interp.unCompStart = null;
interp.zapRecord = null;
interp.numBuiltInCodeBlocks = 0;
interp.numBuiltInCodeBlocksPlus = 0;
interp.numBuiltInTypes = null;
interp.numOverrideTypes = null;

// SE pointers
interp.blankSE = null;
interp.thisSE = null;
interp.playerSE = null;
interp.cloneSE = null;
interp.customDrawSE = null;
interp.ptr2SetInExpr = null;
interp.linkFollowSE = null;
interp.fileLinkSE = null;
interp.playSyncIdleSE = null;

// Clone info
interp.cloneType = 0;
interp.cloneColor = 0;
interp.lastKindColor = 0;

// Interpreter state
interp.code = null;
interp.turns = null;
interp.onPropPos = -1;
interp.onMousePos = -1;
interp.scriptDeadlockCount = 0;
interp.objComCount = 32;
interp.objComThreshold = 32;
interp.dispatchStack = [];
interp.classicSet = 0;
interp.restoredFirst = false;
interp.restoreEarlyOut = false;
interp.playSyncIdleCode = null;

// Direction, region info, misc. pointers
interp.majorDir = 0;
interp.minorDir = 0;
interp.coords1 = [ 1, 1 ];
interp.coords2 = [ 1, 1 ];
interp.noRegion = [ [ 0, 0 ] , [ 0, 0 ] ];
interp.allRegion = [ [ 1, 1 ] , [ 1, 1 ] ];
interp.litRegion = [ [ 1000000, 1000000 ] , [ -1, -1 ] ];
interp.testRegion = null;
interp.forceRegionLiteral = false;
interp.noMask = [ [ 0 ] ];
interp.modGuiLabel = null;
interp.genericSeq = null;
interp.lastExprType = 0;
interp.kwargPos = 0;
interp.memberIdx = 0;
interp.exprRefSrc1 = null;
interp.exprRefSrc2 = null;
interp.nextObjPtrNum = 65536;
interp.highScoreUID = 1;
interp.wouldSquashX = 0;
interp.wouldSquashY = 0;

// Custom draw info
interp.inCustomDraw = false;
interp.customDrawChar = 0;
interp.customDrawColor = 0;

// "FOR" loop info
interp.forRetLoc = -1;
interp.forType = 0;
interp.forVarType1 = 0;
interp.forVarType2 = 0;
interp.forVarName1 = "!";
interp.forVarName2 = "!";
interp.forMask = [ [ 0, 0 ] , [ 0, 0 ] ];
interp.forMaskXSize = 0;
interp.forMaskYSize = 0;
interp.forCornerX = 1;
interp.forCornerY = 1;
interp.forCursorX = 0;
interp.forCursorY = 0;
interp.forRegion = [ [ 0, 0 ] , [ 0, 0 ] ];

// Group movement info
interp.doGroupMove = false;
interp.checkAllGroup = true;
interp.groupRimStepX = 0;
interp.groupRimStepY = 0;
interp.gArray = [];
interp.groupRimX = [];
interp.groupRimY = [];

// Text display info
interp.doDispText = 0;
interp.textTarget = 0;
interp.textDestType = 73;
interp.textDestLabel = "NONE"; // _TEXTBLUE
interp.marqueeSize = 60;
interp.marqueeDir = -1;
interp.marqueeText = "";

// Special
interp.captchaSrcArray = [];
interp.captchaMainVal = 0;
};

// Translate number to type, but let stand special kinds.
static typeTrans2(k) {
	if (k < 0)
		return k;
	else
		return interp.typeTrans[k & 255];
};

static typeTrans3(k) {
	if (zzt.loadedOOPType == -1 && k >= 47 && k <= 53)
		k += 26; // Type unification:  Text -> SZT

	return interp.typeTrans[k & 255];
};

static getInt() {
	return (interp.code[interp.thisSE.IP++]);
};

static peekInt() {
	return (interp.code[interp.thisSE.IP]);
};

static getString() {
	return (oop.pStrings[interp.code[interp.thisSE.IP++]]);
};

static stringAt(codeBlock, pos) {
	if (pos < 0)
		pos = interp.code[-pos + 1]; // Fast-found label

	return (oop.pStrings[codeBlock[pos]]);
};

static getLabelLoc(myCode) {
	var i = interp.code[interp.thisSE.IP++];
	if (i < 0)
		return -i; // Fast-found label
	else
	{
		// Locate label using search.
		var pos = interp.findLabel(myCode, oop.pStrings[i]);
		if (pos != -1 && !interp.typeList[interp.thisSE.TYPE].HasOwnCode)
			interp.code[interp.thisSE.IP-1] = -pos;

		// If custom code present or the label is not found, we don't optimize.
		return pos;
	}
};

static getStepXFromDir8(dir) {
	return interp.dir2StepX[dir & 7];
};

static getStepYFromDir8(dir) {
	return interp.dir2StepY[dir & 7];
};

static getStepXFromDir4(dir) {
	return interp.dir2StepX[(dir << 1) & 7];
};

static getStepYFromDir4(dir) {
	return interp.dir2StepY[(dir << 1) & 7];
};

static getDir8FromSteps(stepX, stepY) {
	var index = (stepY+1) * 3 + (stepX+1);
	if (index < 0 || index > 8)
		index = 0;
	return interp.step2Dir8[index];
};

static getDir4FromSteps(stepX, stepY) {
	var index = (stepY+1) * 3 + (stepX+1);
	if (index < 0 || index > 8)
		index = 0;
	return interp.step2Dir4[index];
};

static atan2FromSteps(stepX, stepY, resolution) {
	var index = utils.int(Math.atan2(stepY, stepX) * 128 / Math.PI);
	var arc = utils.int(256 / resolution);

	return utils.int(((index + (arc >> 1)) & 255) / arc);
};

static errorMsg(str) {
	interp.thisSE.FLAGS |= interp.FL_IDLE;
	oop.errorMsg(str);
	console.log(str);
};

static assignID(se) {
	if (se)
	{
		if (se.myID <= 0)
			se.myID = ++interp.nextObjPtrNum;
	}
};

static briefDispatch(pos, fromSE, toSE) {
	if (pos == -1)
		return false;

	// Save state
	interp.dispatchStack.push(fromSE.IP);
	interp.dispatchStack.push(fromSE);
	interp.dispatchStack.push(interp.code);

	// Change instruction IP to start of message
	var oldComCount = interp.objComCount;
	var oldFlags = toSE.FLAGS;
	var oldIP = toSE.IP;
	var oldTurns = interp.turns;
	toSE.FLAGS = (toSE.FLAGS & ~interp.FL_IDLE) | interp.FL_DISPATCH;
	toSE.IP = pos;
	interp.thisSE = toSE;

	var eInfo = interp.typeList[toSE.TYPE];
	if (eInfo.HasOwnCode && interp.thisSE.extra.hasOwnProperty("CODEID"))
		interp.code = interp.codeBlocks[interp.thisSE.extra["CODEID"]];
	else
		interp.code = interp.codeBlocks[eInfo.CODEID];

	// Run commands in modified loop
	interp.turns = 0x7FFFFFFF;
	interp.objComCount = 0x70000000;
	while ((interp.thisSE.FLAGS & interp.FL_IDLE) == 0 && interp.turns > 0 && interp.objComCount > 0) {
		if (interp.thisSE.IP >= interp.code.length)
		{
			// Automatic END; end of code.
			interp.thisSE.FLAGS |= interp.FL_IDLE;
			break;
		}

		var cByte = interp.getInt();
		if (!interp.processCommand(cByte))
			break;
	}
	Sounds.playVoice();

	if (interp.doDispText == 2)
	{
		// Display text if any shown from dispatched message.
		// Do not try to display text if it originated from normal object execution.
		interp.doDispText = 0;
		interp.displayText(true);
	}

	// If DONEDISPATCH invoked, flags and new location are kept.
	if (!(interp.thisSE.FLAGS & interp.FL_DISPATCH))
	{
		oldFlags = interp.thisSE.FLAGS;
		oldIP = interp.thisSE.IP;
	}

	// Restore state
	interp.code = interp.dispatchStack[interp.dispatchStack.length-1];
	interp.dispatchStack.pop();
	fromSE = interp.dispatchStack[interp.dispatchStack.length-1];
	interp.dispatchStack.pop();
	fromSE.IP = interp.dispatchStack[interp.dispatchStack.length-1];
	interp.dispatchStack.pop();
	interp.thisSE = fromSE;

	toSE.FLAGS = oldFlags;
	toSE.IP = oldIP;
	interp.turns = oldTurns;
	interp.objComCount = oldComCount;

	return true;
};

static dispatchToMainLabel(labelStr) {
	var retVal = interp.briefDispatch(interp.findLabel(interp.codeBlocks[0], labelStr), interp.blankSE, interp.blankSE);
	return retVal;
};

static dispatchCustomDraw(zType, x, y) {
	interp.customDrawSE.TYPE = zType;
	interp.customDrawSE.X = x;
	interp.customDrawSE.Y = y;

	interp.inCustomDraw = true;
	interp.briefDispatch(interp.typeList[zType].LocCUSTOMDRAW, interp.thisSE, interp.customDrawSE);
	interp.inCustomDraw = false;

	return interp.customDrawChar;
};

static linkFollow(labelStr) {
	if (interp.linkFollowSE == interp.blankSE)
	{
		// Generic link follow after message dispatch.
		return interp.dispatchToMainLabel(labelStr);
	}
	else if (interp.linkFollowSE.TYPE == zzt.fileLinkType)
	{
		// Link follow within HLP file (a file opened from a file link).
		return interp.briefDispatch(interp.findLabel(interp.codeBlocks[interp.codeBlocks.length - 1], labelStr),
			interp.blankSE, interp.linkFollowSE);
	}
	else
	{
		var myCode = interp.codeBlocks[interp.linkFollowSE.TYPE];
		if (interp.linkFollowSE.extra.hasOwnProperty("CODEID"))
			myCode = interp.linkFollowSE.extra["CODEID"];

		var pos = interp.findLabel(interp.codeBlocks[myCode], labelStr);
		if (pos != -1)
		{
			// Acts as a jump, or "GOTO"
			interp.linkFollowSE.IP = pos;
			interp.linkFollowSE.FLAGS &= ~(interp.FL_IDLE | interp.FL_PENDINGDEAD);
			interp.linkFollowSE.delay = 1;
			return true;
		}
	}

	return false;
};

static execSECode(forSE) {
	// Execute code for main iteration.
	var eInfo = interp.typeList[forSE.TYPE];
	var okResult = interp.execElementCode(eInfo, forSE);

	if (okResult && !(forSE.FLAGS & interp.FL_DEAD))
	{
		// Dispatch WALKBEHAVIOR message, if implemented.
		// This occurs even if the status element is idle.
		// It will not occur if the status element is dead.
		okResult = interp.briefDispatch(eInfo.LocWALKBEHAVIOR, interp.blankSE, forSE);
	}

	return okResult;
};

static execElementCode(eInfo, forSE=null) {
	// There are two types of execution environments:  execution based on status
	// element, and execution based on element type alone.  Both of them are
	// very similar, but some functions are only accessible when run by status
	// elements.
	if (forSE == null)
	{
		// Element type.
		interp.thisSE = interp.blankSE;
		interp.blankSE.CYCLE = 1;
		interp.blankSE.FLAGS = 0;
		interp.blankSE.delay = 0;
	}
	else
	{
		// Status element object.
		interp.thisSE = forSE;
	}

	if (zzt.globalProps["LEGACYTICK"])
	{
		// Legacy tick behavior (ZZT and SZT) uses a master delay counter with
		// the delay implied from CYCLE modulos on the master delay and the
		// index within the SE vector.
		if (interp.thisSE.CYCLE > 0)
		{
			if (zzt.legacyTick % interp.thisSE.CYCLE == zzt.legacyIndex % interp.thisSE.CYCLE)
				interp.thisSE.delay = 1;
			else
				interp.thisSE.delay = 10;
		}
		else
			interp.thisSE.delay = 10;
	}

	// Check under-layer flag.
	if (interp.thisSE.FLAGS & interp.FL_UNDERLAYER)
	{
		// Special "under-layer" status forces a status element to remain
		// ghosted until the square at which it resides has no status element
		// present already.
		if (SE.getStatElemAt(interp.thisSE.X, interp.thisSE.Y) == null)
		{
			// Unghost.
			interp.thisSE.FLAGS &= ~(interp.FL_GHOST + interp.FL_UNDERLAYER);

			// Update square.
			interp.thisSE.moveSelfSquare(interp.thisSE.X, interp.thisSE.Y, false);
			SE.setColor(interp.thisSE.X, interp.thisSE.Y, interp.thisSE.extra["!!ULCOLOR"], false);
			delete interp.thisSE.extra["!!ULCOLOR"];
			interp.thisSE.displaySelfSquare();
		}

		return true;
	}

	// Check delay.  Note that we update the delay counter even if the idle flag
	// is set, because WALKBEHAVIOR iterates only as frequently as the cycle would
	// also iterate for the main iteration.
	if (--interp.thisSE.delay > 0)
	{
		// Nothing to do, since cycle delay will do nothing this time around.
		return false;
	}

	// Reset delay to equal cycle.
	interp.thisSE.delay = interp.thisSE.CYCLE;

	// Check idle flag.
	if (interp.thisSE.FLAGS & interp.FL_IDLE)
	{
		// Nothing to do.
		return true;
	}

	// Identify the code portion.  This will also depend on whether a status
	// element is present, because status elements can potentially point to a
	// different code block than the element type.
	if (eInfo.HasOwnCode && interp.thisSE.extra.hasOwnProperty("CODEID"))
	{
		// Custom code (OBJECT, SCROLL).  Subject to limited number of #commands.
		interp.code = interp.codeBlocks[interp.thisSE.extra["CODEID"]];
		interp.objComThreshold = zzt.globalProps["OBJMAGICNUMBER"];
		interp.objComCount = interp.objComThreshold;
	}
	else
	{
		// Normal code.  Not subject to limited number of #commands.
		interp.code = interp.codeBlocks[eInfo.CODEID];
		interp.objComCount = 0x70000000;
	}

	// Now we can repeatedly execute statements in the code portion until we
	// reach a stopping point.
	interp.turns = 1;
	interp.scriptDeadlockCount = 0;
	while ((interp.thisSE.FLAGS & interp.FL_IDLE) == 0 && interp.turns > 0 && interp.objComCount > 0) {
		if (interp.thisSE.IP >= interp.code.length)
		{
			// Automatic END; end of code.
			interp.thisSE.IP = interp.typeList[interp.thisSE.TYPE].CustomStart;
			interp.thisSE.FLAGS |= interp.FL_IDLE;
			//thisSE.delay = thisSE.CYCLE;
			break;
		}

		var cByte = interp.getInt();
		if (!interp.processCommand(cByte))
			return false;
		else if (interp.scriptDeadlockCount > interp.SCRIPT_DEADLOCK_THRESHOLD)
		{
			if (zzt.globalProps["DETECTSCRIPTDEADLOCK"])
			{
				// Deadlock condition causes automatic end of turns.
				return true;
			}
		}
	}

	// Show text if text needs to be displayed.
	if (interp.doDispText)
	{
		interp.doDispText = 0;
		interp.displayText(false);
	}

	return true;
};

static processCommand(cByte) {
	var tx;
	var ty;
	var pos;
	var pos2;
	var obj1;
	var obj2;
	var d;
	var kind1;
	var kind2;
	var dir;

	var relSE;
	var relSE2;

	var s;
	var str;
	var str2;

	switch (cByte) {
		// Name, label, and comments
		case oop.CMD_NOP:
			// Nothing to do
		break;
		case oop.CMD_NAME:
			interp.thisSE.extra["ONAME"] = interp.getString();
		break;
		case oop.CMD_LABEL:
			interp.thisSE.IP += 2; // Label is ignored
		break;
		case oop.CMD_COMMENT:
			interp.thisSE.IP += 2; // Comment is ignored
		break;
		case oop.CMD_ERROR:
			interp.errorMsg("COMMAND ERROR:  " + interp.getString());
			interp.opcodeTraceback(interp.code, interp.thisSE.IP);
		break;

		// Text display (possibly interactive)
		case oop.CMD_TEXT:
		case oop.CMD_TEXTCENTER:
		case oop.CMD_TEXTLINK:
		case oop.CMD_TEXTLINKFILE:
		case oop.CMD_DYNTEXT:
		case oop.CMD_DYNLINK:
		case oop.CMD_SCROLLSTR:
			if (!interp.processText(cByte))
				return false;
		break;
		case oop.CMD_DYNTEXTVAR:
			str = interp.getString();
			str2 = interp.dynFormatString(interp.getString());
			zzt.globals[str] = str2;
		break;
		case oop.CMD_DUMPSE:
			interp.processText(cByte);
			pos = interp.intGetExpr();
			relSE = SE.getStatElem(pos);
			if (relSE)
				interp.dumpSE(relSE);
			else
				zzt.addMsgLine("", "Not a valid status element:  " + pos.toString());
		break;
		case oop.CMD_DUMPSEAT:
			interp.processText(cByte);
			interp.getCoords(interp.coords1);
			tx = interp.coords1[0];
			ty = interp.coords1[1];
			relSE = SE.getStatElemAt(tx, ty);
			if (relSE)
				interp.dumpSE(relSE);
			else
				zzt.addMsgLine("", "Not a valid status element at " + tx + "," + ty);
		break;
		case oop.CMD_TEXTTOGUI:
			str = interp.getString();
			if (str == "NONE")
				interp.textTarget = interp.TEXT_TARGET_NORM;
			else
			{
				interp.textTarget = interp.TEXT_TARGET_GUI;
				interp.textDestLabel = str;
			}
		break;
		case oop.CMD_TEXTTOGRID:
			str = interp.regionGetExpr(); // Region name
			interp.textDestType = interp.intGetExpr();
			if (str == "NONE")
				interp.textTarget = interp.TEXT_TARGET_NORM;
			else
			{
				interp.textTarget = interp.TEXT_TARGET_GRID;
				interp.textDestLabel = str;
			}
		break;
		case oop.CMD_SCROLLCOLOR:
			zzt.setScrollColors(interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr(),
			interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr());
		break;

		// Movement
		case oop.CMD_GO:
			interp.turns--;
			interp.objComCount -= interp.objComThreshold;
			pos = interp.thisSE.IP - 1;
			d = interp.getDir();
			if (d != -1)
			{
				tx = interp.thisSE.X + interp.getStepXFromDir4(d);
				ty = interp.thisSE.Y + interp.getStepYFromDir4(d);
				if (interp.thisSE.FLAGS & interp.FL_GHOST)
				{
					// Ghost movement always succeeds
					interp.thisSE.X = tx;
					interp.thisSE.Y = ty;
				}
				else if (interp.validXY(tx, ty))
				{
					if (!interp.typeList[SE.getType(tx, ty)].BlockObject)
					{
						// Easy move; non-blocking square.
						interp.thisSE.moveSelfSquare(tx, ty);
					}
					else if (interp.thisSE.TYPE == zzt.objectType &&
						SE.getType(tx, ty) == zzt.transporterType &&
						zzt.globalProps["TELOBJECT"] == 0)
					{
						// By default, OBJECTs can't do anything special when
						// interacting with transporters.
						interp.thisSE.IP = pos;
					}
					else if (interp.assessPushability(tx, ty, d, false))
					{
						// Move without squashing.
						interp.pushItems(tx, ty, d, false);
						interp.thisSE.moveSelfSquare(tx, ty);
					}
					else if (interp.assessPushability(tx, ty, d, true))
					{
						if (zzt.globals["$ALLPUSH"] != 1 &&
							interp.wouldSquashX == tx && interp.wouldSquashY == ty)
						{
							// Unable to squash this time because we don't
							// allow point-blank squashing.
							interp.thisSE.IP = pos;
						}
						else
						{
							// Move with squashing.
							interp.pushItems(tx, ty, d, true);
							interp.thisSE.moveSelfSquare(tx, ty);
						}
					}
					else
					{
						// We can't move; wait at this instruction until
						// move is possible.
						interp.thisSE.IP = pos;
					}
				}
				else
				{
					// Board edge; wait indefinitely.
					interp.thisSE.IP = pos;
				}
			}
		break;
		case oop.CMD_FORCEGO:
			interp.turns--;
			interp.objComCount -= interp.objComThreshold;
			d = interp.getDir();
			if (d != -1)
			{
				tx = interp.thisSE.X + interp.getStepXFromDir4(d);
				ty = interp.thisSE.Y + interp.getStepYFromDir4(d);
				if (interp.thisSE.FLAGS & interp.FL_GHOST)
				{
					// Ghost movement always succeeds
					interp.thisSE.X = tx;
					interp.thisSE.Y = ty;
				}
				else if (interp.validXY(tx, ty))
				{
					interp.killSE(tx, ty);
					interp.thisSE.moveSelfSquare(tx, ty);
				}
			}
		break;
		case oop.CMD_TRY:
			interp.turns--;
			interp.objComCount -= interp.objComThreshold;
			d = interp.getDir();
			interp.thisSE.IP++;
			pos2 = interp.getInt(); // Jump-over location
			if (d != -1)
			{
				tx = interp.thisSE.X + interp.getStepXFromDir4(d);
				ty = interp.thisSE.Y + interp.getStepYFromDir4(d);
				if (interp.thisSE.FLAGS & interp.FL_GHOST)
				{
					// Ghost movement always succeeds
					interp.thisSE.X = tx;
					interp.thisSE.Y = ty;
					interp.thisSE.IP = pos2; // Jump over alternate command
				}
				else if (interp.validXY(tx, ty))
				{
					if (!interp.typeList[SE.getType(tx, ty)].BlockObject)
					{
						// Easy move; non-blocking square.
						interp.thisSE.moveSelfSquare(tx, ty);
						interp.thisSE.IP = pos2; // Jump over alternate command
					}
					else if (interp.thisSE.TYPE == zzt.objectType &&
						SE.getType(tx, ty) == zzt.transporterType &&
						zzt.globalProps["TELOBJECT"] == 0)
					{
						// By default, OBJECTs can't do anything special when
						// interacting with transporters.
						interp.turns++;
						interp.objComCount += interp.objComThreshold - 1;
					}
					else if (interp.assessPushability(tx, ty, d, false))
					{
						// Move without squashing.
						interp.pushItems(tx, ty, d, false);
						interp.thisSE.moveSelfSquare(tx, ty);
						interp.thisSE.IP = pos2; // Jump over alternate command
					}
					else if (interp.assessPushability(tx, ty, d, true))
					{
						if (zzt.globals["$ALLPUSH"] != 1 &&
							interp.wouldSquashX == tx && interp.wouldSquashY == ty)
						{
							// Unable to squash this time because we don't
							// allow point-blank squashing.
							interp.turns++;
							interp.objComCount += interp.objComThreshold - 1;
						}
						else
						{
							// Move with squashing.
							interp.pushItems(tx, ty, d, true);
							interp.thisSE.moveSelfSquare(tx, ty);
							interp.thisSE.IP = pos2; // Jump over alternate command
						}
					}
					else
					{
						// We can't move; execute alternate command.
						interp.objComCount += interp.objComThreshold - 1;
						interp.turns++;
					}
				}
				else
				{
					// We can't move; execute alternate command.
					interp.objComCount += interp.objComThreshold - 1;
					interp.turns++;
				}
			}
		break;
		case oop.CMD_TRYSIMPLE:
			interp.turns--;
			interp.objComCount -= interp.objComThreshold;
			d = interp.getDir();
			if (d != -1)
			{
				tx = interp.thisSE.X + interp.getStepXFromDir4(d);
				ty = interp.thisSE.Y + interp.getStepYFromDir4(d);
				if (interp.thisSE.FLAGS & interp.FL_GHOST)
				{
					// Ghost movement always succeeds
					interp.thisSE.X = tx;
					interp.thisSE.Y = ty;
				}
				else if (interp.validXY(tx, ty))
				{
					if (!interp.typeList[SE.getType(tx, ty)].BlockObject)
					{
						// Easy move; non-blocking square.
						interp.thisSE.moveSelfSquare(tx, ty);
					}
					else if (interp.thisSE.TYPE == zzt.objectType &&
						SE.getType(tx, ty) == zzt.transporterType &&
						zzt.globalProps["TELOBJECT"] == 0)
					{
						// By default, OBJECTs can't do anything special when
						// interacting with transporters.
					}
					else if (interp.assessPushability(tx, ty, d, false))
					{
						// Move without squashing.
						interp.pushItems(tx, ty, d, false);
						interp.thisSE.moveSelfSquare(tx, ty);
					}
					else if (interp.assessPushability(tx, ty, d, true))
					{
						if (zzt.globals["$ALLPUSH"] != 1 &&
							interp.wouldSquashX == tx && interp.wouldSquashY == ty)
						{
							// Unable to squash this time because we don't
							// allow point-blank squashing.
						}
						else
						{
							// Move with squashing.
							interp.pushItems(tx, ty, d, true);
							interp.thisSE.moveSelfSquare(tx, ty);
						}
					}
				}
			}
		break;
		case oop.CMD_PUSHATPOS:
			interp.getCoords(interp.coords1);
			d = interp.getDir();
			if (interp.validCoords(interp.coords1))
			{
				tx = interp.coords1[0];
				ty = interp.coords1[1];
				if (interp.typeList[SE.getType(tx, ty)].BlockObject)
				{
					if (interp.assessPushability(tx, ty, d, false))
					{
						// Push without squashing.
						interp.pushItems(tx, ty, d, false);
					}
					else if (interp.assessPushability(tx, ty, d, true))
					{
						// Push with squashing.
						interp.pushItems(tx, ty, d, true);
					}
				}
			}
		break;
		case oop.CMD_WALK:
			d = interp.getDir();
			interp.objComCount--;
			if (d == -1)
			{
				interp.thisSE.STEPX = 0;
				interp.thisSE.STEPY = 0;
			}
			else
			{
				interp.thisSE.STEPX = interp.getStepXFromDir4(d);
				interp.thisSE.STEPY = interp.getStepYFromDir4(d);
			}
		break;

		// Status mods
		case oop.CMD_PAUSE:
			zzt.activeObjs = false;
		break;
		case oop.CMD_UNPAUSE:
			zzt.activeObjs = true;
		break;
		case oop.CMD_ENDGAME:
			interp.objComCount--;
			pos = interp.findLabel(interp.codeBlocks[0], "$ENDGAME");
			interp.briefDispatch(pos, interp.thisSE, interp.blankSE);
		break;
		case oop.CMD_END:
			interp.objComCount--;
			interp.thisSE.IP = interp.typeList[interp.thisSE.TYPE].CustomStart;
			interp.thisSE.FLAGS |= interp.FL_IDLE;
			//if ((thisSE.FLAGS & FL_DISPATCH) == 0)
			//  thisSE.delay = thisSE.CYCLE;
		break;
		case oop.CMD_RESTART:
			interp.thisSE.IP = interp.typeList[interp.thisSE.TYPE].CustomStart;
			if (interp.typeList[interp.thisSE.TYPE].HasOwnCode && interp.thisSE.extra.hasOwnProperty("CODEID"))
				interp.code = interp.codeBlocks[interp.thisSE.extra["CODEID"]];
			else
				interp.code = interp.codeBlocks[interp.typeList[interp.thisSE.TYPE].CODEID];
			interp.scriptDeadlockCount++;
			interp.objComCount--;
		break;
		case oop.CMD_LOCK:
			interp.objComCount--;
			interp.thisSE.FLAGS |= interp.FL_LOCKED;
		break;
		case oop.CMD_UNLOCK:
			interp.objComCount--;
			interp.thisSE.FLAGS &= ~interp.FL_LOCKED;
		break;
		case oop.CMD_EXTRATURNS:
			pos = interp.intGetExpr();
			interp.turns += pos;
			interp.objComCount += pos * interp.objComThreshold;
		break;
		case oop.CMD_SUSPENDDISPLAY:
			SE.suspendDisp = interp.intGetExpr();
		break;
		case oop.CMD_DIE:
			if (interp.doDispText && zzt.numTextLines > zzt.toastMsgSize)
			{
				// Important:  if this happens immediately after display of
				// scroll-interface text, don't die "yet" because of importance
				// of state info.  Instead, just stop short of actual command,
				// which will be executed on the next iteration.
				interp.thisSE.IP--;
				interp.turns = 0;
				interp.thisSE.FLAGS |= interp.FL_PENDINGDEAD;
			}
			else
			{
				if (interp.thisSE.TYPE == zzt.objectType && zzt.globalProps["OBJECTDIEEMPTY"])
				{
					// The OBJECT type leaves behind a white empty when #DIE called.
					interp.thisSE.UNDERID = 0;
					interp.thisSE.UNDERCOLOR = 15;
				}

				interp.thisSE.FLAGS |= interp.FL_IDLE + interp.FL_DEAD;
				interp.thisSE.eraseSelfSquare(true);
			}
		break;
		case oop.CMD_SAVEBOARD:
			// -1=wipe all; 0=manual save; 1=board change save; 2=zap save; 3=auto save
			pos = interp.intGetExpr();
			switch (pos) {
				case -1:
					ZZTLoader.wipeBoardStates();
					ZZTLoader.rewindZapRecord(-1);
					ZZTLoader.resetGlobalProps(ZZTLoader.saveStates[0]);
					zzt.globalProps["GAMESPEED"] = zzt.gameSpeed;
					zzt.pMoveDir = -1;
					zzt.pShootDir = -1;
				break;
				default:
					ZZTLoader.saveBoardState(pos);
				break;
			}
		break;
		case oop.CMD_SAVEWORLD:
			pos = interp.intGetExpr();
			zzt.modeChanged = true;
			zzt.mainMode = zzt.MODE_LOADSAVEWAIT;

			// Pack world and board data into file
			if (pos == 0)
			{
				if (ZZTLoader.saveWAD(".WAD"))
				{
					// Open dialog to save as ordinary WAD
					parse.saveLocalFile(
						".WAD", zzt.MODE_NORM, zzt.MODE_NORM, ZZTLoader.file);
				}
				else
					zzt.mainMode = zzt.MODE_NORM;
			}
			else
			{
				if (ZZTLoader.saveWAD(".SAV"))
				{
					// Open dialog to save as savegame
					parse.saveLocalFile(
						"SAVED.SAV", zzt.MODE_NORM, zzt.MODE_NORM, ZZTLoader.file);
				}
				else
					zzt.mainMode = zzt.MODE_NORM;
			}
		break;
		case oop.CMD_LOADWORLD:
			obj1 = interp.getExpr();
			zzt.modeChanged = true;
			zzt.mainMode = zzt.MODE_LOADSAVEWAIT;

			if (utils.isInt(obj1))
			{
				pos = utils.int(obj1);
				if (pos == -1)
					parse.loadLocalFile("ZZT", zzt.MODE_NATIVELOADZZT, zzt.MODE_NORM);
				else if (pos == -2)
					parse.loadLocalFile("SZT", zzt.MODE_NATIVELOADSZT, zzt.MODE_NORM);
				else if (pos == -3)
					parse.loadLocalFile("WAD", zzt.MODE_LOADWAD, zzt.MODE_NORM);
				else if (pos == -4)
					parse.loadLocalFile("ZIP", zzt.MODE_LOADZIP, zzt.MODE_NORM);
				else if (pos == 1)
					zzt.launchDeployedFileIfPresent(zzt.featuredWorldFile);
				else
					zzt.loadDeployedFile(zzt.MODE_NORM);
			}
			else
			{
				zzt.launchDeployedFileIfPresent(obj1.toString());
			}
		break;
		case oop.CMD_RESTOREGAME:
			pos = interp.intGetExpr();

			// Pack world and board data into file
			if (pos == 2)
			{
				// Open dialog to load SAV file
				zzt.modeChanged = true;
				zzt.mainMode = zzt.MODE_LOADSAVEWAIT;
				parse.loadLocalFile("SAV", zzt.MODE_RESTOREWADFILE, zzt.MODE_NORM);
			}
			else
			{
				// Alternate "scroll" interface for snapshot-based board restore
				zzt.snapshotRestoreScroll(pos == 0);
			}
		break;
		case oop.CMD_UPDATELIT:
			interp.updateLit();
		break;
		case oop.CMD_SETPLAYER:
			pos = interp.intGetExpr(); // Object pointer
			relSE = SE.getStatElem(pos);
			if (relSE)
			{
				interp.playerSE = relSE;
				interp.assignID(interp.playerSE);
				zzt.globals["$PLAYER"] = interp.playerSE.myID;
			}
			else
			{
				interp.playerSE = null;
				zzt.globals["$PLAYER"] = -1;
			}
		break;
		case oop.CMD_BIND:
			str = interp.getString();
			relSE = interp.getSEFromOName(str);
			if (!relSE)
			{
				//errorMsg("Bad #BIND:  " + str);
				return false;
			}

			if (!relSE.extra.hasOwnProperty("CODEID"))
			{
				interp.errorMsg("#BIND can't be used with non-unique code");
				return false;
			}

			// Object now resembles another type:  code is swapped out,
			// object name is removed (and eventually replaced), and
			// instruction pointer reset to start.
			interp.thisSE.extra["CODEID"] = relSE.extra["CODEID"];
			delete interp.thisSE.extra["ONAME"];
			interp.code = interp.codeBlocks[interp.thisSE.extra["CODEID"]];
			interp.thisSE.IP = interp.typeList[interp.thisSE.TYPE].CustomStart;
			//thisSE.delay = thisSE.CYCLE;
			interp.objComCount--;
		break;
		case oop.CMD_BECOME:
			if (interp.doDispText && zzt.numTextLines > zzt.toastMsgSize)
			{
				// Important:  if this happens immediately after display of
				// scroll-interface text, don't die "yet" because of importance
				// of state info.  Instead, just stop short of actual command,
				// which will be executed on the next iteration.
				interp.thisSE.IP--;
				interp.turns = 0;
			}
			else
			{
				kind1 = interp.getKind();
				tx = interp.thisSE.X;
				ty = interp.thisSE.Y;

				// Auto-whiten if all black
				if (SE.getColor(tx, ty) == 0)
					SE.setColor(tx, ty, 15, false);

				relSE = interp.createKind(tx, ty, kind1, interp.CF_RETAINSE);
				if (relSE)
					relSE.displaySelfSquare();
			}
		break;

		// Messages
		case oop.CMD_SEND:
			pos = interp.getLabelLoc(interp.code);
			interp.objComCount--;
			if (pos != -1)
			{
				// Acts as a jump, or "GOTO"
				interp.thisSE.IP = pos;
				interp.thisSE.FLAGS &= ~interp.FL_IDLE;
				interp.scriptDeadlockCount++;
			}
		break;
		case oop.CMD_SENDTONAME:
			interp.objComCount--;
			str2 = interp.getString();
			str = interp.getString();
			relSE = interp.getSEFromOName(str2);
			if (!relSE)
				break; // No destination

			do {
				if (relSE.extra.hasOwnProperty("CODEID"))
					pos = interp.findLabel(interp.codeBlocks[relSE.extra["CODEID"]], str);
				else
					pos = interp.findLabel(interp.codeBlocks[interp.typeList[relSE.TYPE].CODEID], str);

				// Sent messages respect lock status, EXCEPT if the message
				// would reach self (an object never locks "itself" out of messages).
				if ((relSE.FLAGS & (interp.FL_LOCKED | interp.FL_PENDINGDEAD)) == 0 || relSE == interp.thisSE)
				{
					if (pos != -1)
					{
						// Acts as a remote jump, or "GOTO"
						relSE.IP = pos;
						relSE.FLAGS &= ~interp.FL_IDLE;
						//relSE.delay = 1;
						if (interp.thisSE == relSE)
							interp.scriptDeadlockCount++;
					}
					else if (str == "RESTART")
					{
						// Can trigger remote-restart
						relSE.IP = interp.typeList[relSE.TYPE].CustomStart;
						relSE.FLAGS &= ~interp.FL_IDLE;
						//relSE.delay = 1;
						if (interp.thisSE == relSE)
							interp.scriptDeadlockCount++;
					}
				}

				relSE = interp.getSEFromOName(str2, false);
			} while (relSE);
		break;
		case oop.CMD_SENDTO:
			pos = interp.intGetExpr(); // Object pointer
			relSE = SE.getStatElem(pos);
			str = interp.getString();

			if (relSE)
			{
				if (relSE.extra.hasOwnProperty("CODEID"))
					pos = interp.findLabel(interp.codeBlocks[relSE.extra["CODEID"]], str);
				else
					pos = interp.findLabel(interp.codeBlocks[interp.typeList[relSE.TYPE].CODEID], str);

				// Sent messages respect lock status.
				if (pos != -1 && (relSE.FLAGS & (interp.FL_LOCKED | interp.FL_PENDINGDEAD)) == 0)
				{
					// Acts as a remote jump, or "GOTO"
					relSE.IP = pos;
					relSE.FLAGS &= ~interp.FL_IDLE;
					//relSE.delay = 1;
					interp.scriptDeadlockCount++;
				}
			}
		break;
		case oop.CMD_DISPATCH:
			pos = interp.getLabelLoc(interp.codeBlocks[0]);
			interp.briefDispatch(pos, interp.thisSE, interp.blankSE);
		break;
		case oop.CMD_DISPATCHTO:
			pos = interp.intGetExpr(); // Object pointer
			relSE = SE.getStatElem(pos);
			if (relSE)
			{
				// Dispatched messages ignore lock status.
				if (relSE.extra.hasOwnProperty("CODEID"))
					pos = interp.findLabel(interp.codeBlocks[relSE.extra["CODEID"]], interp.getString());
				else
					pos = interp.findLabel(interp.codeBlocks[interp.typeList[relSE.TYPE].CODEID], interp.getString());
				interp.briefDispatch(pos, interp.thisSE, relSE);
			}
			else
				interp.getInt();
		break;

		// Type mods and placement
		case oop.CMD_SPAWN:
			d = interp.getInt();
			interp.getCoords(interp.coords1);
			kind1 = interp.getKind();
			if (!interp.validCoords(interp.coords1))
				interp.errorMsg("#SPAWN:  Invalid coordinates");
			else if (d == oop.DIR_UNDER)
			{
				// Start element in under-layer at current position.
				relSE = interp.createKind(interp.coords1[0], interp.coords1[1], kind1,
				interp.CF_RETAINCOLOR | interp.CF_GHOSTED | interp.CF_UNDERLAYER);
				if (relSE)
				{
					relSE.FLAGS |= interp.FL_UNDERLAYER;
					relSE.extra["!!ULCOLOR"] = interp.lastKindColor;
					interp.assignID(relSE);
				}
			}
			else
			{
				if (d == oop.DIR_OVER)
				{
					// Automatically move existing SE to under-layer.
					relSE = SE.getStatElemAt(interp.coords1[0], interp.coords1[1]);
					if (relSE)
					{
						relSE.extra["!!ULCOLOR"] = SE.getColor(interp.coords1[0], interp.coords1[1]);
						relSE.eraseSelfSquare();
						relSE.FLAGS |= interp.FL_GHOST | interp.FL_UNDERLAYER;
					}
				}

				relSE = interp.createKind(interp.coords1[0], interp.coords1[1], kind1, interp.CF_RETAINCOLOR);
				if (relSE)
					relSE.displaySelfSquare();
			}
		break;
		case oop.CMD_SPAWNGHOST:
			str = interp.getExprRef();
			d = interp.lastExprType;
			interp.getCoords(interp.coords1);
			kind1 = interp.getKind();
			if (!interp.validCoords(interp.coords1))
				interp.errorMsg("#SPAWNGHOST:  Invalid coordinates");
			else
			{
				relSE = interp.createKind(interp.coords1[0], interp.coords1[1], kind1, interp.CF_RETAINCOLOR | interp.CF_GHOSTED);
				if (relSE)
				{
					interp.assignID(relSE);
					interp.setVariableFromRef(d, str, relSE.myID);
				}
			}
		break;
		case oop.CMD_PUT:
			interp.objComCount--;
			d = interp.getDir();
			kind1 = interp.getKind();

			if (d == oop.DIR_UNDER)
			{
				// Start element in under-layer at current position.
				relSE = interp.createKind(interp.thisSE.X, interp.thisSE.Y, kind1,
					interp.CF_RETAINCOLOR | interp.CF_GHOSTED | interp.CF_UNDERLAYER);
				if (relSE)
				{
					relSE.FLAGS |= interp.FL_UNDERLAYER;
					relSE.extra["!!ULCOLOR"] = interp.lastKindColor;
					interp.assignID(relSE);
				}
				break;
			}

			if (d == oop.DIR_OVER)
			{
				// Automatically move self to under-layer.
				if ((interp.thisSE.FLAGS & interp.FL_GHOST) == 0)
				{
					interp.thisSE.extra["!!ULCOLOR"] = SE.getColor(interp.thisSE.X, interp.thisSE.Y);
					interp.thisSE.eraseSelfSquare();
					interp.thisSE.FLAGS |= interp.FL_GHOST | interp.FL_UNDERLAYER;
				}

				tx = interp.thisSE.X;
				ty = interp.thisSE.Y;
			}
			else
			{
				tx = interp.thisSE.X + interp.getStepXFromDir4(d);
				ty = interp.thisSE.Y + interp.getStepYFromDir4(d);
				if (zzt.globalProps["NOPUTBOTTOMROW"])
				{
					if (!interp.validXYM1(tx, ty) || d == -1)
						break;
				}
				else if (!interp.validXY(tx, ty) || d == -1)
				{
					break;
				}

				pos = SE.getType(tx, ty);
				if (interp.typeList[pos].BlockObject && interp.typeList[pos].Pushable != 0)
				{
					if (interp.assessPushability(tx, ty, d, false))
					{
						// Push without squashing.
						interp.pushItems(tx, ty, d, false);
					}
					else if (interp.assessPushability(tx, ty, d, true))
					{
						// Push with squashing, unless point-blank would be squashed.
						if (interp.wouldSquashX != tx || interp.wouldSquashY != ty)
							interp.pushItems(tx, ty, d, true);
					}
					else if (interp.typeList[pos].NUMBER == 4)
					{
						// Can't overwrite player.
						break;
					}
				}
			}

			// Auto-whiten if all black
			if (SE.getColor(tx, ty) == 0)
				SE.setColor(tx, ty, 15, false);

			relSE = interp.createKind(tx, ty, kind1,
				interp.CF_RETAINSE | interp.CF_RETAINCOLOR | interp.CF_REMOVEIFBLOCKING);

			if (relSE)
			{
				relSE.displaySelfSquare();
				if (relSE.TYPE == zzt.playerType)
					zzt.boardProps["PLAYERCOUNT"]++;
			}
		break;
		case oop.CMD_SHOOT:
			interp.objComCount--;
			interp.turns--;
			pos = interp.getInt(); // Silence flag
			d = interp.getDir();
			tx = interp.thisSE.X + interp.getStepXFromDir4(d);
			ty = interp.thisSE.Y + interp.getStepYFromDir4(d);
			if (interp.validXY(tx, ty))
			{
				interp.kwargPos = -1;
				pos2 = SE.getType(tx, ty);

				if (!interp.typeList[pos2].BlockObject || interp.typeList[pos2].NUMBER == 19)
				{
					// Shoot if not blocked point-blank
					relSE = interp.createKind(tx, ty, zzt.bulletType);
					if (relSE)
					{
						relSE.STEPX = interp.getStepXFromDir4(d);
						relSE.STEPY = interp.getStepYFromDir4(d);
						relSE.displaySelfSquare();
					}
					if (pos != 0)
						Sounds.soundDispatch("OBJECTSHOOT");
				}
				else
				{
					// Point-blank behavior
					if (pos2 == zzt.playerType)
					{
						// Hurt player
						relSE = SE.getStatElemAt(tx, ty);
						pos = interp.findLabel(interp.codeBlocks[interp.typeList[pos2].CODEID], "RECVHURT");
						interp.briefDispatch(pos, interp.thisSE, relSE);
					}
					else if (pos2 == zzt.breakableType)
					{
						Sounds.soundDispatch("BREAKABLEHIT");
						SE.setType(tx, ty, 0);
						SE.displaySquare(tx, ty);
					}
					else if (pos2 == zzt.objectType && zzt.globalProps["POINTBLANKFIRING"])
					{
						// Object receives shot message if configured to do so.
						// Original ZZT behavior did not generate SHOT message.
						relSE = SE.getStatElemAt(tx, ty);
						if (relSE.extra.hasOwnProperty("CODEID"))
							pos = interp.findLabel(interp.codeBlocks[relSE.extra["CODEID"]], "SHOT");
						else
							pos = interp.findLabel(interp.codeBlocks[interp.typeList[pos2].CODEID], "SHOT");

						if (pos != -1 && (relSE.FLAGS & (interp.FL_LOCKED | interp.FL_PENDINGDEAD)) == 0)
						{
							// Acts as a remote jump, or "GOTO"
							relSE.IP = pos;
							relSE.FLAGS &= ~interp.FL_IDLE;
							//relSE.delay = 1;
						}
					}
				}
			}
		break;
		case oop.CMD_THROWSTAR:
			interp.objComCount--;
			interp.turns--;
			pos = interp.getInt(); // Silence flag
			d = interp.getDir();
			tx = interp.thisSE.X + interp.getStepXFromDir4(d);
			ty = interp.thisSE.Y + interp.getStepYFromDir4(d);
			if (interp.validXY(tx, ty))
			{
				interp.kwargPos = -1;
				pos2 = SE.getType(tx, ty);

				if (!interp.typeList[pos2].BlockObject || interp.typeList[pos2].NUMBER == 19)
				{
					// Shoot if not blocked point-blank
					relSE = interp.createKind(tx, ty, zzt.starType);
					if (relSE)
					{
						relSE.STEPX = interp.getStepXFromDir4(d);
						relSE.STEPY = interp.getStepYFromDir4(d);
						relSE.extra['P2'] = 50;
						relSE.displaySelfSquare();
					}
				}
				else
				{
					// Point-blank behavior
					if (pos2 == zzt.playerType)
					{
						// Hurt player
						relSE = SE.getStatElemAt(tx, ty);
						pos = interp.findLabel(interp.codeBlocks[interp.typeList[pos2].CODEID], "RECVHURT");
						interp.briefDispatch(pos, interp.thisSE, relSE);
					}
					else if (pos2 == zzt.breakableType)
					{
						Sounds.soundDispatch("ENEMYDIE");
						SE.setType(tx, ty, 0);
						SE.displaySquare(tx, ty);
					}
				}
			}
		break;
		case oop.CMD_CHANGE:
			interp.objComCount--;
			interp.processChange(interp.noRegion);
		break;
		case oop.CMD_CHANGEREGION:
			str = interp.regionGetExpr(); // Region name
			interp.processChange(interp.getRegion(str));
		break;
		case oop.CMD_KILLPOS:
			interp.getCoords(interp.coords1);
			relSE = SE.getStatElemAt(interp.coords1[0], interp.coords1[1]);
			if (relSE)
			{
				interp.killSE(interp.coords1[0], interp.coords1[1]);
				SE.displaySquare(interp.coords1[0], interp.coords1[1]);
			}
		break;
		case oop.CMD_SETPOS:
			pos = interp.intGetExpr(); // Object pointer
			pos2 = interp.getInt(); // DIR_UNDER

			interp.getCoords(interp.coords1);
			relSE2 = SE.getStatElem(pos);

			if (!relSE2)
			{
				// No valid source; can still destroy destination.
				if (interp.validCoords(interp.coords1, true))
				{
					relSE = SE.getStatElemAt(interp.coords1[0], interp.coords1[1]);
					if (relSE)
					{
						interp.killSE(interp.coords1[0], interp.coords1[1]);
						SE.displaySquare(interp.coords1[0], interp.coords1[1]);
					}
				}
			}
			else if (relSE2.FLAGS & interp.FL_GHOST)
			{
				// Ghost movement always succeeds
				relSE2.X = interp.coords1[0];
				relSE2.Y = interp.coords1[1];
			}
			else if (interp.validCoords(interp.coords1, true))
			{
				// Valid source; not ghosted.
				relSE = SE.getStatElemAt(interp.coords1[0], interp.coords1[1]);
				if (relSE != relSE2)
				{
					if (pos2 == oop.DIR_UNDER)
					{
						// Go to under-layer.
						interp.lastKindColor = SE.getColor(relSE2.X, relSE2.Y);
						relSE2.eraseSelfSquare();
						relSE2.FLAGS |= interp.FL_GHOST | interp.FL_UNDERLAYER;
						relSE2.X = interp.coords1[0];
						relSE2.Y = interp.coords1[1];
						relSE2.extra["!!ULCOLOR"] = interp.lastKindColor;
					}
					else if (pos2 == oop.DIR_OVER)
					{
						// Move destination to under-layer, then move source.
						relSE.extra["!!ULCOLOR"] = SE.getColor(interp.coords1[0], interp.coords1[1]);
						relSE.eraseSelfSquare();
						relSE.FLAGS |= interp.FL_GHOST | interp.FL_UNDERLAYER;
						relSE2.moveSelfSquare(interp.coords1[0], interp.coords1[1]);
					}
					else
					{
						// Kill destination, then move source.
						interp.killSE(interp.coords1[0], interp.coords1[1]);
						relSE2.moveSelfSquare(interp.coords1[0], interp.coords1[1]);
					}
				}
				else
				{
					// Move status element
					relSE2.moveSelfSquare(interp.coords1[0], interp.coords1[1]);
				}
			}
		break;

		// Variables
		case oop.CMD_CHAR:
			interp.objComCount--;
			if (interp.inCustomDraw)
				interp.customDrawChar = interp.intGetExpr();
			else
			{
				pos = interp.intGetExpr();
				if (pos >= 0 && pos <= 255)
				{
					interp.thisSE.extra["CHAR"] = pos;
					interp.thisSE.displaySelfSquare();
				}
			}
		break;
		case oop.CMD_CYCLE:
			interp.objComCount--;
			interp.thisSE.CYCLE = utils.clipval(interp.intGetExpr(), 1, 65535);
			interp.thisSE.delay = ((interp.thisSE.delay - 1) % interp.thisSE.CYCLE) + 1;
		break;
		case oop.CMD_COLOR:
			if (interp.inCustomDraw)
				interp.customDrawColor = interp.intGetExpr();
			else
			{
				SE.setColor(interp.thisSE.X, interp.thisSE.Y, interp.intGetExpr());
				interp.thisSE.displaySelfSquare();
			}
		break;
		case oop.CMD_COLORALL:
			if (interp.inCustomDraw)
				interp.customDrawColor = interp.intGetExpr();
			else
			{
				SE.setColor(interp.thisSE.X, interp.thisSE.Y, interp.intGetExpr(), false);
				interp.thisSE.displaySelfSquare();
			}
		break;
		case oop.CMD_TYPEAT:
			str = interp.getExprRef();
			d = interp.lastExprType;
			interp.getCoords(interp.coords1);
			if (interp.validCoords(interp.coords1, true))
			{
				interp.setVariableFromRef(d, str,
				interp.typeList[SE.getType(interp.coords1[0], interp.coords1[1])].NUMBER);
			}
		break;
		case oop.CMD_COLORAT:
			str = interp.getExprRef();
			d = interp.lastExprType;
			interp.getCoords(interp.coords1);
			if (interp.validCoords(interp.coords1, true))
			{
				interp.setVariableFromRef(d, str, SE.getColor(interp.coords1[0], interp.coords1[1]));
			}
		break;
		case oop.CMD_OBJAT:
			str = interp.getExprRef();
			d = interp.lastExprType;
			interp.getCoords(interp.coords1);
			relSE = SE.getStatElemAt(interp.coords1[0], interp.coords1[1]);
			if (relSE == null || !interp.validCoords(interp.coords1))
				interp.setVariableFromRef(d, str, -1);
			else
			{
				interp.assignID(relSE);
				interp.setVariableFromRef(d, str, relSE.myID);
			}
		break;
		case oop.CMD_LITAT:
			str = interp.getExprRef();
			d = interp.lastExprType;
			interp.getCoords(interp.coords1);
			if (interp.validCoords(interp.coords1))
			{
				interp.setVariableFromRef(d, str, SE.getLit(interp.coords1[0], interp.coords1[1]));
			}
		break;
		case oop.CMD_LIGHTEN:
			interp.getCoords(interp.coords1);
			if (interp.validCoords(interp.coords1))
				interp.adjustLit(interp.coords1, 1);
		break;
		case oop.CMD_DARKEN:
			interp.getCoords(interp.coords1);
			if (interp.validCoords(interp.coords1))
				interp.adjustLit(interp.coords1, 0);
		break;
		case oop.CMD_CHANGEBOARD:
			pos = interp.intGetExpr();
			ZZTLoader.switchBoard(pos);
		break;
		case oop.CMD_CHAR4DIR:
			dir = interp.getDir() & 3;
			pos = interp.intGetExpr();
			pos2 = pos;
			//if (dir == 0)
			//pos2 = pos;
			pos = interp.intGetExpr();
			if (dir == 1)
				pos2 = pos;
			pos = interp.intGetExpr();
			if (dir == 2)
				pos2 = pos;
			pos = interp.intGetExpr();
			if (dir == 3)
				pos2 = pos;

			if (interp.inCustomDraw)
				interp.customDrawChar = pos2;
			else
			{
				interp.thisSE.extra["CHAR"] = pos2;
				interp.thisSE.displaySelfSquare();
			}
		break;
		case oop.CMD_DIR2UVECT8:
			dir = interp.intGetExpr();
			str = interp.getExprRef();
			interp.setVariableFromRef(interp.lastExprType, str, interp.getStepXFromDir8(dir));
			str = interp.getExprRef();
			interp.setVariableFromRef(interp.lastExprType, str, interp.getStepYFromDir8(dir));
		break;
		case oop.CMD_OFFSETBYDIR:
			interp.getRelCoords(interp.coords1);
			dir = interp.thisSE.IP;
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			interp.thisSE.IP = dir;
			str = interp.getExprRef();
			interp.setVariableFromRef(interp.lastExprType, str, pos + interp.coords1[0]);
			str = interp.getExprRef();
			interp.setVariableFromRef(interp.lastExprType, str, pos2 + interp.coords1[1]);
		break;
		case oop.CMD_CLONE:
			interp.getCoords(interp.coords1);
			if (interp.validCoords(interp.coords1))
			{
				interp.cloneType = SE.getType(interp.coords1[0], interp.coords1[1]);
				interp.cloneColor = SE.getColor(interp.coords1[0], interp.coords1[1]);
				interp.cloneSE = SE.getStatElemAt(interp.coords1[0], interp.coords1[1]);
			}
		break;
		case oop.CMD_SETREGION:
			str = interp.regionGetExpr(); // Region name
			interp.getCoords(interp.coords1);
			interp.getCoords(interp.coords2);
			if (interp.validCoords(interp.coords1) && interp.validCoords(interp.coords2))
				zzt.regions[str] = [ [ interp.coords1[0], interp.coords1[1] ], [ interp.coords2[0], interp.coords2[1] ] ];
		break;
		case oop.CMD_CLEARREGION:
			str = interp.regionGetExpr(); // Region name
			if (zzt.regions.hasOwnProperty(str))
				delete zzt.regions[str];
		break;
		case oop.CMD_SETPROPERTY:
			str = interp.dynFormatString(interp.getString()); // Property name
			if (zzt.boardProps.hasOwnProperty(str))
			{
				zzt.boardProps[str] = interp.getExpr();
				if (str == "ISDARK")
					SE.IsDark = zzt.boardProps[str];
			}
			else
			{
				zzt.globalProps[str] = interp.getExpr();
			}

			// Set property string and dispatch to ONPROPERTY handler.
			zzt.globals["$PROP"] = str;
			interp.briefDispatch(interp.onPropPos, interp.thisSE, interp.blankSE);
		break;
		case oop.CMD_GETPROPERTY:
			str = interp.dynFormatString(interp.getString()); // Property name
			str2 = interp.getExprRef();
			d = interp.lastExprType;
			if (zzt.boardProps.hasOwnProperty(str))
				interp.setVariableFromRef(d, str2, zzt.boardProps[str]);
			else if (zzt.globalProps.hasOwnProperty(str))
				interp.setVariableFromRef(d, str2, zzt.globalProps[str]);
			else
				interp.errorMsg("No such property:  " + str);
		break;
		case oop.CMD_SETTYPEINFO:
			kind1 = interp.getKind();
			str = interp.strGetExpr();
			interp.typeList[kind1].writeProperty(str, interp.getExpr());
		break;
		case oop.CMD_GETTYPEINFO:
			kind1 = interp.getKind();
			str = interp.strGetExpr();
			obj1 = interp.typeList[kind1].readProperty(str);
			str2 = interp.getExprRef();
			d = interp.lastExprType;
			interp.setVariableFromRef(d, str2, obj1);
		break;
		case oop.CMD_SUBSTR:
			str = interp.getExprRef();
			d = interp.lastExprType;
			str2 = interp.strGetExpr();
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();

			if (pos < 0)
				pos = str2.length - pos;
			if (pos < 0 || pos >= str2.length)
				pos2 = 0;
			if (pos + pos2 > str2.length)
				pos2 = str2.length - pos;

			interp.setVariableFromRef(d, str, str2.substr(pos, pos2));
		break;
		case oop.CMD_INT:
			str = interp.getExprRef();
			d = interp.lastExprType;
			str2 = interp.strGetExpr();
			for (pos = 0; pos < str2.length; pos++)
			{
				if (pos == 0 && str2.charAt(0) == "-")
					continue;
				if (!oop.isNumeric(str2, pos))
					break;
			}

			pos2 = 0;
			if (pos > 0)
				pos2 = utils.int(str2.substr(0, pos));
			interp.setVariableFromRef(d, str, pos2);
		break;
		case oop.CMD_PLAYERINPUT:
			str = interp.getExprRef();
			d = interp.lastExprType;
			interp.setVariableFromRef(d, str, zzt.pMoveDir);
			str = interp.getExprRef();
			d = interp.lastExprType;
			interp.setVariableFromRef(d, str, zzt.pShootDir);
			zzt.pMoveDir = -1;
			zzt.pShootDir = -1;
		break;
		case oop.CMD_RANDOM:
			str = interp.getExprRef();
			d = interp.lastExprType;
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			interp.setVariableFromRef(d, str, utils.randrange(pos, pos2));
		break;
		case oop.CMD_GETSOUND:
			str = interp.getExprRef();
			d = interp.lastExprType;
			pos = interp.intGetExpr();
			interp.setVariableFromRef(d, str, Sounds.getChannelPlaying(pos));
		break;
		case oop.CMD_STOPSOUND:
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			for (; pos <= pos2; pos++)
				Sounds.stopChannel(pos);
		break;
		case oop.CMD_MASTERVOLUME:
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			Sounds.setMasterVolume(interp.intGetExpr(), pos, pos2);
		break;

		case oop.CMD_SET:
			interp.classicSet = 0;
			str = interp.getExprRef();
			d = interp.lastExprType;
			pos = zzt.globalProps.length;
			interp.setVariableFromRef(d, str, interp.getExpr());

			if (interp.classicSet == 2)
			{
				// When using the classic #SET GlobalFlag, we must honor the
				// original ZZT or Super ZZT flag limits.
				interp.objComCount--;
				if (zzt.globalProps["NUMCLASSICFLAGS"] >= zzt.globalProps["CLASSICFLAGLIMIT"])
				{
					// We are at the limit of the "classic" global flags.
					// We must replace the last-set classic flag with the new one.
					delete zzt.globals[zzt.globalProps["LASTCLASSICFLAG"]];
					zzt.globalProps["LASTCLASSICFLAG"] = str;
				}
				else
				{
					// Add a "classic" global flag.
					zzt.globalProps["NUMCLASSICFLAGS"] += 1;
					zzt.globalProps["LASTCLASSICFLAG"] = str;
				}

				// In SZT, Z label is set when a flag starts with Z
				if (zzt.globalProps["WORLDTYPE"] == -2 && str.charAt(0) == "Z")
					zzt.globalProps["ZSTONELABEL"] = str.substr(1);
			}
		break;
		case oop.CMD_CLEAR:
			interp.objComCount--;
			interp.classicSet = 0;
			str = interp.getExprRef();
			if (interp.lastExprType == oop.SPEC_LOCALVAR)
			{
				// Clear local variable.  Only works if part of extras.
				if (interp.thisSE.extra.hasOwnProperty(str))
					delete interp.thisSE.extra[str];
			}
			else
			{
				// Clear global variable.
				if (zzt.globals.hasOwnProperty(str))
				{
					delete zzt.globals[str];
					if (interp.classicSet == 1)
					{
						// Clear "classic" global flag.
						zzt.globalProps["NUMCLASSICFLAGS"] -= 1;
					}
				}
			}
		break;

		// Inventory
		case oop.CMD_GIVE:
			interp.objComCount--;
			pos = interp.getInt();
			if (pos == oop.INV_KEY)
			{
				pos = interp.getInt();
				str = "KEY" + pos;
			}
			else if (pos == oop.INV_EXTRA)
			{
				str = interp.getString();
				zzt.globals["$EXTRAINVNAME"] = str;
			}
			else if (pos == oop.INV_NONE)
			{
				str = "###";
			}
			else
			{
				str = oop.inventory_x[pos - 1];
			}

			if (!zzt.globalProps.hasOwnProperty(str))
				zzt.globalProps[str] = 0;
			zzt.globalProps[str] += interp.intGetExpr();

			// Set property string and dispatch to ONPROPERTY handler.
			zzt.globals["$PROP"] = str;
			interp.briefDispatch(interp.onPropPos, interp.thisSE, interp.blankSE);
		break;
		case oop.CMD_TAKE:
			interp.objComCount--;
			pos = interp.getInt();
			if (pos == oop.INV_KEY)
			{
				pos = interp.getInt();
				str = "KEY" + pos;
			}
			else if (pos == oop.INV_EXTRA)
			{
				str = interp.getString();
				zzt.globals["$EXTRAINVNAME"] = str;
			}
			else if (pos == oop.INV_NONE)
			{
				str = "###";
			}
			else
			{
				str = oop.inventory_x[pos - 1];
			}

			pos2 = interp.intGetExpr();
			if (!zzt.globalProps.hasOwnProperty(str))
				zzt.globalProps[str] = 0;
			if (zzt.globalProps[str] >= pos2)
			{
				// Normal take
				zzt.globalProps[str] -= pos2;

				// Set property string and dispatch to ONPROPERTY handler.
				zzt.globals["$PROP"] = str;
				interp.briefDispatch(interp.onPropPos, interp.thisSE, interp.blankSE);

				interp.thisSE.IP++;
				pos2 = interp.getInt(); // Jump-over location
				interp.thisSE.IP = pos2; // Jump over alternate command
			}
			else // Not enough to take; execute alternate command.
			{
				interp.thisSE.IP++;
				pos2 = interp.getInt(); // Jump-over location
				interp.objComCount++;
				interp.processCommand(interp.getInt());
			}
		break;

		// Flow control
		case oop.CMD_ZAP:
			interp.objComCount--;
			str = interp.getString();
			interp.zapTarget(interp.thisSE, str);
		break;
		case oop.CMD_RESTORE:
			interp.objComCount--;
			str = interp.getString();
			interp.restoreTarget(interp.thisSE, str);
		break;
		case oop.CMD_ZAPTARGET:
			interp.objComCount--;
			str = interp.getString();
			str2 = interp.getString();
			relSE = interp.getSEFromOName(str);
			if (relSE)
			{
				if (!relSE.extra.hasOwnProperty("CODEID"))
				{
					interp.errorMsg("#ZAP Target:Label can't be used with non-unique code");
					return false;
				}
				interp.zapTarget(relSE, str2);
			}
		break;
		case oop.CMD_RESTORETARGET:
			interp.objComCount--;
			str = interp.getString();
			str2 = interp.getString();
			relSE = interp.getSEFromOName(str);
			if (relSE)
			{
				if (!relSE.extra.hasOwnProperty("CODEID"))
				{
					interp.errorMsg("#RESTORE Target:Label can't be used with non-unique code");
					return false;
				}
				interp.restoreTarget(relSE, str2, str);
			}
		break;
		case oop.CMD_IF:
			interp.objComCount--;
			pos2 = interp.getInt();
			pos = interp.getInt();
			switch (pos) {
				case oop.FLAG_ALWAYSTRUE:
					pos = 1;
				break;
				case oop.FLAG_GENERIC:
					pos = utils.int(interp.getGlobalVarValue(interp.getString()));
				break;
				case oop.FLAG_ANY:
					kind1 = interp.getKind();
					pos = 0;
					if (interp.checkTypeWithinRegion(interp.allRegion, kind1, interp.kwargPos))
						pos = 1;
				break;
				case oop.FLAG_ALLIGNED:
				case oop.FLAG_ALIGNED:
					if (interp.peekInt() == oop.SPEC_ALL)
					{
						d = -1;
						interp.thisSE.IP++
					}
					else
						d = interp.getDir();

					pos = 0;
					switch (d) {
						case 0:
							if (interp.thisSE.Y == interp.playerSE.Y && interp.thisSE.X <= interp.playerSE.X)
								pos = 1;
						break;
						case 1:
							if (interp.thisSE.X == interp.playerSE.X && interp.thisSE.Y <= interp.playerSE.Y)
								pos = 1;
						break;
						case 2:
							if (interp.thisSE.Y == interp.playerSE.Y && interp.thisSE.X >= interp.playerSE.X)
								pos = 1;
						break;
						case 3:
							if (interp.thisSE.X == interp.playerSE.X && interp.thisSE.Y >= interp.playerSE.Y)
								pos = 1;
						break;
						default:
							if (interp.thisSE.X == interp.playerSE.X || interp.thisSE.Y == interp.playerSE.Y)
								pos = 1;
						break;
					}
				break;
				case oop.FLAG_CONTACT:
					if (interp.peekInt() == oop.SPEC_ALL)
					{
						d = -1;
						interp.thisSE.IP++
					}
					else
						d = interp.getDir();

					pos = 0;
					switch (d) {
						case 0:
							if (interp.thisSE.Y == interp.playerSE.Y && interp.thisSE.X == interp.playerSE.X - 1)
								pos = 1;
						break;
						case 1:
							if (interp.thisSE.X == interp.playerSE.X && interp.thisSE.Y == interp.playerSE.Y - 1)
								pos = 1;
						break;
						case 2:
							if (interp.thisSE.Y == interp.playerSE.Y && interp.thisSE.X == interp.playerSE.X + 1)
								pos = 1;
						break;
						case 3:
							if (interp.thisSE.X == interp.playerSE.X && interp.thisSE.Y == interp.playerSE.Y + 1)
								pos = 1;
						break;
						default:
							if (utils.iabs(interp.thisSE.X - interp.playerSE.X) +
								utils.iabs(interp.thisSE.Y - interp.playerSE.Y) <= 1)
								pos = 1;
						break;
					}
				break;
				case oop.FLAG_BLOCKED:
					d = interp.getDir();
					interp.coords1[0] = interp.thisSE.X + interp.getStepXFromDir4(d);
					interp.coords1[1] = interp.thisSE.Y + interp.getStepYFromDir4(d);
					pos = 0;
					if (interp.typeList[SE.getType(interp.coords1[0], interp.coords1[1])].BlockObject)
						pos = 1;
				break;
				case oop.FLAG_CANPUSH:
					interp.getCoords(interp.coords1);
					d = interp.getDir();
					pos = interp.assessPushability(interp.coords1[0], interp.coords1[1], d);
				break;
				case oop.FLAG_SAFEPUSH:
					interp.getCoords(interp.coords1);
					d = interp.getDir();
					pos = interp.assessPushability(interp.coords1[0], interp.coords1[1], d, false);
				break;
				case oop.FLAG_SAFEPUSH1:
					interp.getCoords(interp.coords1);
					d = interp.getDir();
					tx = interp.coords1[0];
					ty = interp.coords1[1];
					pos = interp.assessPushability(interp.coords1[0], interp.coords1[1], d, false);
					if (pos == 0)
					{
						pos = interp.assessPushability(tx, ty, d, true);
						if (pos != 0 && interp.wouldSquashX == tx && interp.wouldSquashY == ty)
							pos = 0; // Point-blank squashing not allowed
					}
				break;
				case oop.FLAG_ENERGIZED:
					pos = 0;
					if (zzt.globalProps["ENERGIZERCYCLES"] > 0)
						pos = 1;
				break;
				case oop.FLAG_ANYTO:
					d = interp.getDir();
					kind1 = interp.getKind();
					interp.coords1[0] = interp.thisSE.X + interp.getStepXFromDir4(d);
					interp.coords1[1] = interp.thisSE.Y + interp.getStepYFromDir4(d);
					pos = 0;
					if (interp.validCoords(interp.coords1, true))
					{
						if (interp.checkType(interp.coords1[0], interp.coords1[1], kind1, interp.kwargPos))
							pos = 1;
					}
				break;
				case oop.FLAG_ANYIN:
					str = interp.regionGetExpr(); // Region name
					kind1 = interp.getKind();
					pos = 0;
					if (interp.checkTypeWithinRegion(interp.getRegion(str), kind1, interp.kwargPos))
						pos = 1;
				break;
				case oop.FLAG_SELFIN:
					str = interp.regionGetExpr(); // Region name
					interp.testRegion = interp.getRegion(str);
					pos = 0;
					if (interp.thisSE.X >= interp.testRegion[0][0] && interp.thisSE.Y >= interp.testRegion[0][1] &&
						interp.thisSE.X <= interp.testRegion[1][0] && interp.thisSE.Y <= interp.testRegion[1][1])
					pos = 1;
				break;
				case oop.FLAG_TYPEIS:
					interp.getCoords(interp.coords1);
					kind1 = interp.getKind();
					pos = 0;
					if (interp.validCoords(interp.coords1, true))
					{
						if (interp.checkType(interp.coords1[0], interp.coords1[1], kind1, interp.kwargPos))
							pos = 1;
					}
				break;
				case oop.FLAG_BLOCKEDAT:
					interp.getCoords(interp.coords1);
					pos = 0;
					if (interp.validCoords(interp.coords1, true))
					{
						if (interp.typeList[SE.getType(interp.coords1[0], interp.coords1[1])].BlockObject)
							pos = 1;
					}
				break;
				case oop.FLAG_HASMESSAGE:
					pos = interp.intGetExpr();
					str = interp.getString();
					relSE = SE.getStatElem(pos);
					pos = 0;
					if (relSE)
					{
						if (relSE.extra.hasOwnProperty("CODEID"))
							pos = interp.findLabel(interp.codeBlocks[relSE.extra["CODEID"]], str);
						else
							pos = interp.findLabel(interp.codeBlocks[interp.typeList[relSE.TYPE].CODEID], str);
						if (pos == -1)
							pos = 0;
						else
							pos = 1;
					}
				break;
				case oop.FLAG_TEST:
					pos = interp.intGetExpr();
				break;
				case oop.FLAG_VALID:
					d = interp.intGetExpr();
					if (SE.getStatElem(d) != null)
						pos = 1;
					else
						pos = 0;
				break;
			}

			if ((pos != 0) == (pos2 == oop.SPEC_NORM))
			{
				interp.thisSE.IP += 2; // Skip CMD_FALSEJUMP
				interp.objComCount++;
				interp.processCommand(interp.getInt());
			}
			else
			{
				interp.thisSE.IP++;
				interp.thisSE.IP = interp.getInt(); // ignoreCommand(code, thisSE.IP);
			}
		break;
		case oop.CMD_DONEDISPATCH:
			// Done with dispatched message.  This means the main status
			// of the object will be affected, as if no longer in a
			// dispatched message.
			interp.thisSE.FLAGS &= ~interp.FL_DISPATCH;
			interp.turns = 1;
			if (interp.thisSE.extra.hasOwnProperty("CODEID"))
				interp.objComCount = interp.objComThreshold;
		break;
		case oop.CMD_FOREACH:
			str = interp.getExprRef();
			d = interp.lastExprType;
			if (interp.cueForEach(str, d, interp.regionGetExpr()) == -1)
			{
				// Short-circuit jump past FORNEXT if loop totally empty
				interp.thisSE.IP = interp.findLabel(interp.code, ":#PASTFORNEXT", interp.thisSE.IP, 3);
			}
		break;
		case oop.CMD_FORMASK:
			str = interp.getExprRef();
			d = interp.lastExprType;
			str2 = interp.getExprRef();
			pos = interp.lastExprType;
			interp.getCoords(interp.coords1);
			if (interp.cueForMask(str, d, str2, pos, interp.coords1, interp.getString()) == -1)
			{
				// Short-circuit jump past FORNEXT if loop totally empty
				interp.thisSE.IP = interp.findLabel(interp.code, ":#PASTFORNEXT", interp.thisSE.IP, 3);
			}
		break;
		case oop.CMD_FORREGION:
			str = interp.getExprRef();
			d = interp.lastExprType;
			str2 = interp.getExprRef();
			pos = interp.lastExprType;
			if (interp.cueForRegion(str, d, str2, pos, interp.regionGetExpr()) == -1)
			{
				// Short-circuit jump past FORNEXT if loop totally empty
				interp.thisSE.IP = interp.findLabel(interp.code, ":#PASTFORNEXT", interp.thisSE.IP, 3);
			}
		break;
		case oop.CMD_FORNEXT:
			if (interp.iterateFor() != -1)
				interp.thisSE.IP = interp.forRetLoc;
		break;

		// Sound and music
		case oop.CMD_PLAY:
			interp.objComCount--;
			str = interp.getString();

			// No 64th-note unless in Ultra mode
			if (zzt.globalProps["WORLDTYPE"] != -3)
			{
				while (str.indexOf("J") != -1)
					str = str.replace("J", " ");
			}

			// Play retention
			str = interp.markupPlayString(str);

			// Only play if sound is registered as on
			if (zzt.globalProps["SOUNDOFF"] != 1)
			{
				// If play sync activated, remember code in case advancement needed
				if (zzt.globalProps["PLAYSYNC"] == 1)
				{
					Sounds.playSyncCallback = interp.playSyncCallback;
					interp.playSyncIdleSE = interp.thisSE;
					interp.playSyncIdleCode = interp.code;
				}
				else
				{
					Sounds.playSyncCallback = null;
					interp.playSyncIdleSE = null;
					interp.playSyncIdleCode = null;
				}

				Sounds.distributePlayNotes(str);
			}
		break;
		case oop.CMD_PLAYSOUND:
			Sounds.soundDispatch(interp.dynFormatString(interp.getString()));
		break;

		// GUI and high-level control
		case oop.CMD_USEGUI:
			str = interp.getString();
			if (zzt.establishGui(interp.dynFormatString(str)));
				zzt.drawGui();
		break;
		case oop.CMD_MODGUILABEL:
			str = interp.dynFormatString(interp.getString());
			interp.modGuiLabel = [ interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr() ];
			pos = interp.intGetExpr();
			if (pos == 1)
				interp.modGuiLabel.push(pos);

			zzt.GuiLabels[str] = interp.modGuiLabel;
		break;
		case oop.CMD_SETGUILABEL:
			str = interp.dynFormatString(interp.getString());
			str2 = interp.strGetExpr();
			pos = interp.intGetExpr();
			zzt.eraseGuiLabel(str, pos);
			zzt.drawGuiLabel(str, str2, pos);
		break;
		case oop.CMD_CONFMESSAGE:
			interp.turns = 0;
			zzt.confMessage(interp.getString(), interp.strGetExpr(), interp.getString(), interp.getString());
		break;
		case oop.CMD_TEXTENTRY:
			interp.turns = 0;
			str = interp.getString();
			str2 = interp.strGetExpr();
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			zzt.textEntry(str, str2, pos, pos2, interp.getString(), interp.getString());
		break;
		case oop.CMD_DRAWPEN:
			zzt.drawPen(interp.getString(), interp.intGetExpr(), interp.intGetExpr(),
			interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr());
		break;
		case oop.CMD_SELECTPEN:
			zzt.selectPen(interp.getString(), interp.intGetExpr(), interp.intGetExpr(),
			interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr(), interp.getString());
		break;
		case oop.CMD_DRAWBAR:
			zzt.drawBar(interp.getString(),
			interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr());
		break;
		case oop.CMD_UPDATEVIEWPORT:
			interp.smartUpdateViewport();
		break;
		case oop.CMD_ERASEVIEWPORT:
			SE.mg.writeConst(SE.vpX0 - 1, SE.vpY0 - 1, SE.vpWidth, SE.vpHeight, " ", 0);
			SE.uCameraX = -1000;
			SE.uCameraY = -1000;
		break;
		case oop.CMD_DISSOLVEVIEWPORT:
			pos = interp.intGetExpr(); // Color
			zzt.dissolveViewport(zzt.MODE_NORM, 0.5, pos);
		break;
		case oop.CMD_SCROLLTOVISUALS:
			pos = interp.intGetExpr(); // Milliseconds
			dir = interp.getDir();
			zzt.scrollTransitionViewport(zzt.MODE_NORM, pos / 1000.0, dir);
		break;
		case oop.CMD_CAMERAFOCUS:
			interp.getCoords(interp.coords1);
			interp.cameraAdjust(interp.coords1);
		break;

		case oop.CMD_PUSHARRAY:
			interp.exprRefSrc1 = interp.getExpr();
			interp.exprRefSrc1.push(interp.getExpr());
		break;
		case oop.CMD_POPARRAY:
			interp.exprRefSrc1 = interp.getExpr();
			str = interp.getExprRef();
			d = interp.lastExprType;
			if (interp.exprRefSrc1.length > 0)
			{
				interp.setVariableFromRef(d, str, interp.exprRefSrc1[interp.exprRefSrc1.length - 1]);
				interp.exprRefSrc1.pop();
			}
		break;
		case oop.CMD_SETARRAY:
			str = interp.getExprRef();
			d = interp.lastExprType;
			pos = interp.intGetExpr();
			zzt.globals[str] = [];
			if (pos > 0)
			{
				while (pos-- > 0)
					zzt.globals[str].push(0);
			}
		break;
		case oop.CMD_LEN:
			str = interp.getExprRef();
			d = interp.lastExprType;
			obj1 = interp.getExpr();
			if (Array.isArray(obj1))
				interp.setVariableFromRef(d, str, obj1.length);
			else
				interp.setVariableFromRef(d, str, obj1.toString().length);
		break;

		case oop.CMD_SWITCHTYPE:
			interp.getCoords(interp.coords1);
			kind1 = interp.typeList[SE.getType(interp.coords1[0], interp.coords1[1])].NUMBER;
			pos = interp.getInt();
			while (pos--)
			{
				kind2 = interp.typeList[interp.getKind()].NUMBER;
				pos2 = interp.getLabelLoc(interp.code);
				if ((kind1 == kind2 || (kind1 == 253 && kind2 == 0)) && pos2 != -1)
				{
					// Go to label
					interp.thisSE.IP = pos2;
					interp.scriptDeadlockCount++;
					break;
				}
			}
		break;
		case oop.CMD_SWITCHVALUE:
			obj1 = interp.getExpr();
			pos = interp.getInt();
			while (pos--)
			{
				obj2 = interp.getExprValue(oop.SPEC_NUMCONST);
				pos2 = interp.getLabelLoc(interp.code);
				if (obj1 == obj2 && pos2 != -1)
				{
					// Go to label
					interp.thisSE.IP = pos2;
					interp.scriptDeadlockCount++;
					break;
				}
			}
		break;
		case oop.CMD_EXECCOMMAND:
			zzt.oneLineExecCommand(String(interp.getExpr()));
		break;

		case oop.CMD_DRAWCHAR:
			interp.getCoords(interp.coords1);
			obj1 = interp.getExpr();
			pos2 = interp.intGetExpr();

			if (!SE.suspendDisp)
			{
				tx = interp.coords1[0] - SE.CameraX;
				ty = interp.coords1[1] - SE.CameraY;
				if (tx >= 0 && ty >= 0 && tx < SE.vpWidth && ty < SE.vpHeight)
				{
					tx += SE.vpX0 - 1;
					ty += SE.vpY0 - 1;
					if (utils.isInt(obj1))
						SE.mg.setCell(tx, ty, utils.int(obj1), pos2);
					else
						SE.mg.writeStr(tx, ty, obj1.toString(), pos2);
				}
			}
		break;
		case oop.CMD_ERASECHAR:
			interp.getCoords(interp.coords1);
			if (!SE.suspendDisp)
				SE.displaySquare(interp.coords1[0], interp.coords1[1]);
		break;
		case oop.CMD_DRAWGUICHAR:
			interp.coords1[0] = interp.intGetExpr() + zzt.GuiLocX - 2;
			interp.coords1[1] = interp.intGetExpr() + zzt.GuiLocY - 2;
			obj1 = interp.getExpr();
			pos2 = interp.intGetExpr();

			if (utils.isInt(obj1))
				SE.mg.setCell(interp.coords1[0], interp.coords1[1], utils.int(obj1), pos2);
			else
				SE.mg.writeStr(interp.coords1[0], interp.coords1[1], obj1.toString(), pos2);
		break;
		case oop.CMD_ERASEGUICHAR:
			interp.coords1[0] = interp.intGetExpr() + zzt.GuiLocX - 1;
			interp.coords1[1] = interp.intGetExpr() + zzt.GuiLocY - 1;
			zzt.displayGuiSquare(interp.coords1[0], interp.coords1[1]);
		break;

		case oop.CMD_GHOST:
			pos = interp.intGetExpr(); // Object pointer
			pos2 = interp.intGetExpr();
			relSE = SE.getStatElem(pos);
			if (relSE)
			{
				if (interp.validXY(relSE.X, relSE.Y))
				{
					if ((relSE.FLAGS & interp.FL_GHOST) != 0 && pos2 == 0)
					{
						// Removing "ghost" status
						relSE.FLAGS &= ~interp.FL_GHOST;
						interp.killSE(relSE.X, relSE.Y);
						relSE.moveSelfSquare(relSE.X, relSE.Y, false);
					}
					else if ((relSE.FLAGS & interp.FL_GHOST) == 0 && pos2 != 0)
					{
						// Setting "ghost" status
						relSE.eraseSelfSquare();
						relSE.FLAGS |= interp.FL_GHOST;
					}
				}
			}
		break;

		case oop.CMD_GROUPSETPOS:
			// Update of position destroys anything in the group's path.
			interp.getCoords(interp.coords1);
			interp.exprRefSrc1 = interp.getExpr();
			interp.calcGroupRimInfo(interp.thisSE.X, interp.thisSE.Y, interp.coords1[0], interp.coords1[1], interp.exprRefSrc1);
			if (interp.doGroupMove)
				interp.tryEntireMove(0);
		break;
		case oop.CMD_GROUPGO:
			// Update of position will wait until path is free.
			interp.turns--;
			interp.objComCount -= interp.objComThreshold;
			pos = interp.thisSE.IP - 1;
			interp.getCoords(interp.coords1);
			interp.exprRefSrc1 = interp.getExpr();

			interp.calcGroupRimInfo(interp.thisSE.X, interp.thisSE.Y, interp.coords1[0], interp.coords1[1], interp.exprRefSrc1);
			if (interp.doGroupMove)
			{
				if (!interp.checkAllGroup)
				{
					// Push-movement
					if (interp.tryRimPush(2) == -1)
						interp.thisSE.IP = pos; // No
					else
						interp.tryEntireMove(0); // Yes
				}
				else
				{
					// No-push movement
					if (!interp.tryEntireMove(1))
						interp.thisSE.IP = pos; // No
					else
						interp.tryEntireMove(0); // Yes
				}
			}
		break;

		case oop.CMD_GROUPTRY:
		case oop.CMD_GROUPTRYNOPUSH:
			// Update of position will execute alternate command if blocked.
			interp.getCoords(interp.coords1);
			interp.exprRefSrc1 = interp.getExpr();
			interp.thisSE.IP++;
			pos2 = interp.getInt(); // Jump-over location

			interp.calcGroupRimInfo(interp.thisSE.X, interp.thisSE.Y, interp.coords1[0], interp.coords1[1], interp.exprRefSrc1);
			if (interp.doGroupMove)
			{
				if (!interp.checkAllGroup && cByte == oop.CMD_GROUPTRY)
				{
					// Push-movement
					if (interp.tryRimPush(2) != -1)
					{
						// Yes
						interp.tryEntireMove(0);
						interp.turns--;
						interp.objComCount -= interp.objComThreshold;
						interp.thisSE.IP = pos2; // Jump over
					}
				}
				else
				{
					// No-push movement
					if (interp.tryEntireMove(1))
					{
						// Yes
						interp.tryEntireMove(0);
						interp.turns--;
						interp.objComCount -= interp.objComThreshold;
						interp.thisSE.IP = pos2; // Jump over
					}
				}
			}
		break;

		case oop.CMD_ATAN2:
			interp.getRelCoords(interp.coords1);
			pos = interp.atan2FromSteps(interp.coords1[0], interp.coords1[1], interp.intGetExpr());

			str = interp.getExprRef();
			d = interp.lastExprType;
			interp.setVariableFromRef(d, str, pos);
		break;
		case oop.CMD_SMOOTHTEST:
			pos = interp.intGetExpr(); // Object pointer
			relSE = SE.getStatElem(pos);
			pos = interp.intGetExpr(); // Mag * 256
			pos2 = interp.intGetExpr(); // Dir256
			d = interp.intGetExpr(); // Limit
			if (relSE)
			{
				// Ensure fractional component
				if (!relSE.extra.hasOwnProperty("FX"))
					relSE.extra["FX"] = 128;
				if (!relSE.extra.hasOwnProperty("FY"))
					relSE.extra["FY"] = 128;

				// Calculate vector
				tx = utils.int(pos * Math.cos(pos2 * Math.PI / 128));
				ty = utils.int(pos * Math.sin(pos2 * Math.PI / 128));

				if (utils.iabs(tx) > utils.iabs(ty))
				{
					if (utils.iabs(tx) > d)
					{
						ty = ty * d / utils.iabs(tx);
						tx = d * utils.isgn(tx);
					}
				}
				else if (utils.iabs(ty) > d)
				{
					tx = tx * d / utils.iabs(ty);
					ty = d * utils.isgn(ty);
				}

				// Get resulting coordinates * 256
				tx += (relSE.X << 8) + relSE.extra["FX"];
				ty += (relSE.Y << 8) + relSE.extra["FY"];

				zzt.globals["$DESTX"] = (tx >> 8);
				zzt.globals["$DESTY"] = (ty >> 8);
				zzt.globals["$FRACX"] = (tx & 255);
				zzt.globals["$FRACY"] = (ty & 255);
			}
		break;
		case oop.CMD_SMOOTHMOVE:
			pos = interp.intGetExpr(); // Object pointer
			relSE2 = SE.getStatElem(pos);
			tx = zzt.globals["$DESTX"];
			ty = zzt.globals["$DESTY"];

			if (!relSE2)
			{
				if (interp.validXY(tx, ty, true))
				{
					relSE = SE.getStatElemAt(tx, ty);
					if (relSE)
					{
						interp.killSE(tx, ty);
						SE.displaySquare(tx, ty);
					}
				}
			}
			else if (relSE2.FLAGS & interp.FL_GHOST)
			{
				// Ghost movement always succeeds
				relSE2.X = tx;
				relSE2.Y = ty;
				relSE2.extra["FX"] = zzt.globals["$FRACX"];
				relSE2.extra["FY"] = zzt.globals["$FRACY"];
			}
			else if (interp.validXY(tx, ty, true))
			{
				relSE = SE.getStatElemAt(tx, ty);
				if (relSE != relSE2)
					interp.killSE(tx, ty);

				// Move status element
				relSE2.moveSelfSquare(tx, ty);
				relSE2.extra["FX"] = zzt.globals["$FRACX"];
				relSE2.extra["FY"] = zzt.globals["$FRACY"];
			}
		break;

		case oop.CMD_READKEY:
			str = interp.getExprRef();
			d = interp.lastExprType;
			obj1 = interp.getExpr();
			if (utils.isInt(obj1))
				interp.setVariableFromRef(d, str, input.keyCodeDowns[utils.int(obj1) & 255]);
			else
				interp.setVariableFromRef(d, str,
			input.keyCharDowns[obj1.toString().charCodeAt(0) & 255]);
		break;
		case oop.CMD_READMOUSE:
			zzt.globals["$MOUSEX"] = input.mouseXGridPos - SE.vpX0 + 2;
			zzt.globals["$MOUSEY"] = input.mouseYGridPos - SE.vpY0 + 2;
			zzt.globals["$LMB"] = input.mDown ? 1 : 0;
		break;

		case oop.CMD_SETCONFIGVAR:
			str = interp.strGetExpr();
			str2 = interp.strGetExpr();
			zzt.saveSharedObj(str, str2, interp.getExpr());
		break;
		case oop.CMD_GETCONFIGVAR:
			str = interp.strGetExpr();
			str2 = interp.strGetExpr();
			s = interp.getExprRef();
			d = interp.lastExprType;
			interp.setVariableFromRef(d, s, zzt.loadSharedObj(str, str2));
		break;
		case oop.CMD_DELCONFIGVAR:
			str = interp.strGetExpr();
			str2 = interp.strGetExpr();
			zzt.deleteSharedObjMember(str, str2);
		break;
		case oop.CMD_DELCONFIGHIVE:
			str = interp.strGetExpr();
			zzt.deleteSharedObj(str);
		break;
		case oop.CMD_SYSTEMACTION:
			pos = interp.intGetExpr(); // Action code
			switch (pos) {
				case 56334:
					//interp.establishCaptchaNums();
				break;
				case 56335:
					//interp.captchaSubmit();
				break;
				case 56336:
					//interp.captchaSubmitAdmin();
				break;
				case 76591:
					interp.setMedal();
				break;
				case 76592:
					interp.clearMedal();
				break;
				case 76593:
					interp.resetAllMedals();
				break;
			}
		break;

		case oop.CMD_SCANLINES:
			pos = interp.intGetExpr(); // Scanline count mode
			switch (pos) {
				case 0: // CGA (200)
				case 1: // EGA (350)
				case 2: // VGA (400; default)
					zzt.globalProps["SCANLINES"] = pos;
					SE.mg.updateScanlineMode(pos);
					SE.mg.createSurfaces(
						zzt.OverallSizeX, zzt.OverallSizeY, zzt.Viewport, true);

					zzt.cellYDiv = 16;
					zzt.virtualCellYDiv = 16;
				break;
			}
		break;
		case oop.CMD_BIT7ATTR:
			pos = interp.intGetExpr(); // Bit 7 usage (0=high intensity color; 1=blink)
			zzt.globalProps["BIT7ATTR"] = pos;
			SE.mg.updateBit7Meaning(pos);
		break;
		case oop.CMD_PALETTECOLOR:
			pos = interp.intGetExpr(); // Palette Index
			SE.mg.setPaletteColor(pos, interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr());
		break;
		case oop.CMD_FADETOCOLOR:
			pos = interp.intGetExpr(); // Milliseconds
			zzt.fadeToColorSingle(zzt.MODE_NORM, pos / 1000.0,
			interp.intGetExpr(), interp.intGetExpr(), interp.intGetExpr());
		break;
		case oop.CMD_PALETTEBLOCK:
			pos = interp.intGetExpr(); // Start index
			pos2 = interp.intGetExpr(); // Number of indexes
			tx = interp.intGetExpr(); // Extent
			obj1 = interp.getExpr(); // Mask/Lump string or array name
			interp.genericSeq = interp.getFlatSequence(obj1);
			if (interp.genericSeq == null)
				interp.genericSeq = SE.mg.getDefaultPaletteColors();
			SE.mg.setPaletteColors(pos, pos2, tx, interp.genericSeq);
		break;
		case oop.CMD_FADETOBLOCK:
			pos = interp.intGetExpr(); // Milliseconds
			pos2 = interp.intGetExpr(); // Start index
			tx = interp.intGetExpr(); // Number of indexes
			ty = interp.intGetExpr(); // Extent
			obj1 = interp.getExpr(); // Mask/Lump string or array name
			interp.genericSeq = interp.getFlatSequence(obj1);
			if (interp.genericSeq == null)
				interp.genericSeq = SE.mg.getDefaultPaletteColors();
			zzt.fadeToColorBlock(zzt.MODE_NORM, pos / 1000.0, pos2, tx, ty, interp.genericSeq);
		break;
		case oop.CMD_CHARSELECT:
			obj1 = interp.getExpr(); // Mask/Lump string or array name
			interp.genericSeq = interp.getFlatSequence(obj1, true);
			pos = interp.intGetExpr(); // Cell X Size
			pos2 = interp.intGetExpr(); // Cell Y Size
			tx = interp.intGetExpr(); // Cells Across
			ty = interp.intGetExpr(); // Cells Down
			if (interp.genericSeq == null)
			{
				pos = interp.intGetExpr();
				SE.mg.setDefaultCharacters();
			}
			else
				SE.mg.updateCharacterSet(pos, pos2, tx, ty, interp.intGetExpr(), interp.genericSeq);

			zzt.virtualCellYDiv = CellGrid.virtualCellYDiv;
			SE.mg.createSurfaces(
				zzt.OverallSizeX, zzt.OverallSizeY, zzt.Viewport, true);
		break;

		case oop.CMD_POSTHS:
			str = interp.strGetExpr();
			str2 = interp.strGetExpr();
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			interp.postHighScore(str, str2, pos, pos2);
		break;
		case oop.CMD_GETHS:
			str2 = interp.strGetExpr();
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			interp.getHighScores(str2, pos, pos2);
		break;
		case oop.CMD_GETHSENTRY:
			str = interp.getExprRef();
			d = interp.lastExprType;
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			interp.setVariableFromRef(d, str, interp.getHighScoreField(pos, pos2));
		break;

		default:
			interp.errorMsg("Bad opcode:  " + cByte + " at pos " + interp.thisSE.IP);
			interp.opcodeTraceback(interp.code, interp.thisSE.IP);
		return false;
	}

	return true;
};

static ignoreCommand(codeBlock, pos) {
	var i;
	var cByte = codeBlock[pos++];
	switch (cByte) {
		case oop.CMD_NAME:
		case oop.CMD_BIND:
		case oop.CMD_SEND:
		case oop.CMD_DISPATCH:
		case oop.CMD_ZAP:
		case oop.CMD_RESTORE:
		case oop.CMD_PLAY:
		case oop.CMD_PLAYSOUND:
		case oop.CMD_USEGUI:
		case oop.CMD_ERROR:
		case oop.CMD_FALSEJUMP:
			pos++;
		break;

		case oop.CMD_NOP:
		case oop.CMD_PAUSE:
		case oop.CMD_UNPAUSE:
		case oop.CMD_ENDGAME:
		case oop.CMD_END:
		case oop.CMD_RESTART:
		case oop.CMD_LOCK:
		case oop.CMD_UNLOCK:
		case oop.CMD_DIE:
		case oop.CMD_DONEDISPATCH:
		case oop.CMD_UPDATELIT:
		case oop.CMD_UPDATEVIEWPORT:
		case oop.CMD_ERASEVIEWPORT:
		break;

		case oop.CMD_CHAR:
		case oop.CMD_CYCLE:
		case oop.CMD_COLOR:
		case oop.CMD_COLORALL:
		case oop.CMD_EXTRATURNS:
		case oop.CMD_SUSPENDDISPLAY:
		case oop.CMD_CHANGEBOARD:
		case oop.CMD_DISSOLVEVIEWPORT:
		case oop.CMD_SAVEBOARD:
		case oop.CMD_SAVEWORLD:
		case oop.CMD_LOADWORLD:
		case oop.CMD_RESTOREGAME:
		case oop.CMD_DUMPSE:
		case oop.CMD_SETPLAYER:
		case oop.CMD_CLEARREGION:
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_SCROLLTOVISUALS:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreDir(codeBlock, pos);
		break;

		case oop.CMD_LABEL:
		case oop.CMD_COMMENT:
		case oop.CMD_SENDTONAME:
		case oop.CMD_ZAPTARGET:
		case oop.CMD_RESTORETARGET:
			pos += 2;
		break;
		case oop.CMD_SENDTO:
		case oop.CMD_DISPATCHTO:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos++;
		break;
		case oop.CMD_TEXT:
		case oop.CMD_TEXTCENTER:
		case oop.CMD_TEXTLINK:
		case oop.CMD_TEXTLINKFILE:
		case oop.CMD_DYNTEXT:
		case oop.CMD_DYNLINK:
		case oop.CMD_DYNTEXTVAR:
			pos = interp.ignoreText(codeBlock, pos, cByte);
		break;
		case oop.CMD_SCROLLSTR:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos++;
		break;
		case oop.CMD_SCROLLCOLOR:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_GO:
		case oop.CMD_FORCEGO:
		case oop.CMD_TRYSIMPLE:
		case oop.CMD_WALK:
			pos = interp.ignoreDir(codeBlock, pos);
		break;
		case oop.CMD_TRY:
			pos = interp.ignoreDir(codeBlock, pos);
			pos += 2;
			//pos = ignoreCommand(codeBlock, pos);
		break;
		case oop.CMD_PUSHATPOS:
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreDir(codeBlock, pos);
		break;

		case oop.CMD_BECOME:
			pos = interp.ignoreKind(codeBlock, pos);
		break;

		case oop.CMD_SPAWN:
			pos++;
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreKind(codeBlock, pos);
		break;
		case oop.CMD_SPAWNGHOST:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreKind(codeBlock, pos);
		break;
		case oop.CMD_PUT:
			pos = interp.ignoreDir(codeBlock, pos);
			pos = interp.ignoreKind(codeBlock, pos);
		break;
		case oop.CMD_SHOOT:
		case oop.CMD_THROWSTAR:
			pos++;
			pos = interp.ignoreDir(codeBlock, pos);
		break;
		case oop.CMD_CHANGE:
			pos = interp.ignoreKind(codeBlock, pos);
			pos = interp.ignoreKind(codeBlock, pos);
		break;
		case oop.CMD_CHANGEREGION:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreKind(codeBlock, pos);
			pos = interp.ignoreKind(codeBlock, pos);
		break;
		case oop.CMD_SETPOS:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos++;
			pos = interp.ignoreCoords(codeBlock, pos);
		break;
		case oop.CMD_TYPEAT:
		case oop.CMD_COLORAT:
		case oop.CMD_OBJAT:
		case oop.CMD_LITAT:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreCoords(codeBlock, pos);
		break;

		case oop.CMD_CHAR4DIR:
			pos = interp.ignoreDir(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_DIR2UVECT8:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_OFFSETBYDIR:
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_CLONE:
		case oop.CMD_LIGHTEN:
		case oop.CMD_DARKEN:
		case oop.CMD_DUMPSEAT:
		case oop.CMD_KILLPOS:
			pos = interp.ignoreCoords(codeBlock, pos);
		break;
		case oop.CMD_TEXTTOGUI:
			pos++;
		break;
		case oop.CMD_TEXTTOGRID:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_SETREGION:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreCoords(codeBlock, pos);
		break;
		case oop.CMD_SETPROPERTY:
		case oop.CMD_GETPROPERTY:
			pos++;
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_CLEAR:
		case oop.CMD_EXECCOMMAND:
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_SETTYPEINFO:
		case oop.CMD_GETTYPEINFO:
			pos = interp.ignoreKind(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_SUBSTR:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_INT:
		case oop.CMD_PLAYERINPUT:
		case oop.CMD_GETSOUND:
		case oop.CMD_STOPSOUND:
		case oop.CMD_SET:
		case oop.CMD_PUSHARRAY:
		case oop.CMD_POPARRAY:
		case oop.CMD_SETARRAY:
		case oop.CMD_LEN:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_RANDOM:
		case oop.CMD_MASTERVOLUME:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_SWITCHTYPE:
			pos = interp.ignoreCoords(codeBlock, pos);
			i = codeBlock[pos++];
			while (i--)
			{
				pos = interp.ignoreKind(codeBlock, pos);
				pos++;
			}
		break;
		case oop.CMD_SWITCHVALUE:
			pos = interp.ignoreExpr(codeBlock, pos);
			i = codeBlock[pos++];
			while (i--)
			{
				pos = interp.ignoreExprValue(codeBlock, pos, 0);
				pos++;
			}
		break;

		case oop.CMD_GIVE:
			if (codeBlock[pos] == oop.INV_KEY)
				pos += 2;
			else if (codeBlock[pos] == oop.INV_EXTRA)
				pos += 2;
			else
				pos++;

			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_TAKE:
			if (codeBlock[pos] == oop.INV_KEY)
				pos += 2;
			else if (codeBlock[pos] == oop.INV_EXTRA)
				pos += 2;
			else
				pos++;

			pos = interp.ignoreExpr(codeBlock, pos);
			//pos = ignoreCommand(codeBlock, pos);
		break;

		case oop.CMD_IF:
			pos++;
			i = codeBlock[pos++];
			switch (i) {
				case oop.FLAG_ALWAYSTRUE:
				break;
				case oop.FLAG_GENERIC:
					pos++;
				break;
				case oop.FLAG_ANY:
					pos = interp.ignoreKind(codeBlock, pos);
				break;
				case oop.FLAG_ALLIGNED:
				case oop.FLAG_ALIGNED:
				case oop.FLAG_CONTACT:
					if (codeBlock[pos] == oop.SPEC_ALL)
						pos++;
					else
						pos = interp.ignoreDir(codeBlock, pos);
				break;
				case oop.FLAG_BLOCKED:
					pos = interp.ignoreDir(codeBlock, pos);
				break;
				case oop.FLAG_CANPUSH:
				case oop.FLAG_SAFEPUSH:
				case oop.FLAG_SAFEPUSH1:
					pos = interp.ignoreCoords(codeBlock, pos);
					pos = interp.ignoreDir(codeBlock, pos);
				break;
				case oop.FLAG_ENERGIZED:
				break;
				case oop.FLAG_ANYTO:
					pos = interp.ignoreDir(codeBlock, pos);
					pos = interp.ignoreKind(codeBlock, pos);
				break;
				case oop.FLAG_ANYIN:
					pos = interp.ignoreExpr(codeBlock, pos);
					pos = interp.ignoreKind(codeBlock, pos);
				break;
				case oop.FLAG_SELFIN:
					pos = interp.ignoreExpr(codeBlock, pos);
				break;
				case oop.FLAG_TYPEIS:
					pos = interp.ignoreCoords(codeBlock, pos);
					pos = interp.ignoreKind(codeBlock, pos);
				break;
				case oop.FLAG_BLOCKEDAT:
					pos = interp.ignoreCoords(codeBlock, pos);
				break;
				case oop.FLAG_HASMESSAGE:
					pos = interp.ignoreExpr(codeBlock, pos);
					pos++;
				break;
				case oop.FLAG_TEST:
				case oop.FLAG_VALID:
					pos = interp.ignoreExpr(codeBlock, pos);
				break;
			}

			pos += 2;
			//pos = ignoreCommand(codeBlock, pos);
		break;

		case oop.CMD_FOREACH:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_FORMASK:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreCoords(codeBlock, pos);
			pos++;
		break;
		case oop.CMD_FORREGION:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_FORNEXT:
		break;

		case oop.CMD_MODGUILABEL:
			pos++;
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_SETGUILABEL:
			pos++;
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_CONFMESSAGE:
			pos++;
			pos = interp.ignoreExpr(codeBlock, pos);
			pos += 2;
		break;
		case oop.CMD_TEXTENTRY:
			pos++;
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos += 2;
		break;
		case oop.CMD_DRAWPEN:
			pos++;
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_SELECTPEN:
			pos++;
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos++;
		break;
		case oop.CMD_DRAWBAR:
			pos++;
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_CAMERAFOCUS:
			pos = interp.ignoreCoords(codeBlock, pos);
		break;

		case oop.CMD_DRAWCHAR:
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_ERASECHAR:
			pos = interp.ignoreCoords(codeBlock, pos);
		break;
		case oop.CMD_DRAWGUICHAR:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_ERASEGUICHAR:
		case oop.CMD_GHOST:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_GROUPSETPOS:
		case oop.CMD_GROUPGO:
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_GROUPTRY:
		case oop.CMD_GROUPTRYNOPUSH:
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos += 2;
		break;

		case oop.CMD_ATAN2:
			pos = interp.ignoreCoords(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_SMOOTHTEST:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_SMOOTHMOVE:
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_READKEY:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_READMOUSE:
		break;

		case oop.CMD_SETCONFIGVAR:
		case oop.CMD_GETCONFIGVAR:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_DELCONFIGVAR:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_DELCONFIGHIVE:
		case oop.CMD_SYSTEMACTION:
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		case oop.CMD_SCANLINES:
		case oop.CMD_BIT7ATTR:
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_PALETTECOLOR:
		case oop.CMD_FADETOCOLOR:
		case oop.CMD_PALETTEBLOCK:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_FADETOBLOCK:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_CHARSELECT:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_POSTHS:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;
		case oop.CMD_GETHS:
		case oop.CMD_GETHSENTRY:
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
			pos = interp.ignoreExpr(codeBlock, pos);
		break;

		default:
			interp.opcodeTraceback(codeBlock, pos);
		break;
	}

	return pos;
};

static findLabel(codeBlock, mLabel, pos=0, filter=0) {
	var done = false;
	var i;
	var s;

	while (pos < codeBlock.length) {
		var cByte = codeBlock[pos++];
		switch (cByte) {
			case oop.CMD_LABEL:
				s = oop.pStrings[codeBlock[pos]];
				if (filter != 1)
				{
					if (s == mLabel)
						return (pos-1); // Found
					else if (s.length > mLabel.length)
					{
						// Original label-checking algorithm allowed for
						// "startswith" match, as long as the character
						// immediately following the length of the searched-for
						// label was not alpha or underscore.
						// It's really dumb but that's how it was supposed to work.
						if (s.substr(0, mLabel.length) == mLabel &&
							!oop.isAlpha(s, mLabel.length))
						return (pos-1); // Found
					}
				}

				pos += 2;
			break;
			case oop.CMD_COMMENT:
				s = oop.pStrings[codeBlock[pos]];
				interp.restoreEarlyOut = false;
				if (filter == 1)
				{
					if (s == mLabel)
					{
						if (pos >= codeBlock.length)
						return (pos-1); // Found

						// Restore label-finding exits early if there is
						// alpha text immediately following the label.
						// Bizarre behavior in original ZZT engine.
						if (codeBlock[pos + 2] == oop.CMD_TEXT && interp.restoredFirst)
						{
							s = oop.pStrings[codeBlock[pos + 3]];
							if (s.length > 0)
							{
								if (oop.isAlpha(s, 0))
								{
									// Very specific:  must be text, but not just
									// any text--it must be alpha or underscore.
									interp.restoreEarlyOut = true;
									return -1;
								}
							}
						}

						return (pos-1); // Found
					}
					else if (s.length > mLabel.length)
					{
						// Original label-checking algorithm allowed for
						// "startswith" match, as long as the character
						// immediately following the length of the searched-for
						// label was not alpha or underscore.
						// It's really dumb but that's how it was supposed to work.
						if (s.substr(0, mLabel.length) == mLabel &&
							!oop.isAlpha(s, mLabel.length))
						{
							return (pos-1); // Found
						}
					}
					}
				else if (filter != 0)
				{
					if (s == mLabel)
						return (pos-1); // Found
				}

				pos += 2;
			break;

			case oop.CMD_SEND:
				if (filter == 4)
				{
					// Undo self-referential optimization
					if (codeBlock[pos] < 0)
					{
						i = -codeBlock[pos] + 1;
						codeBlock[pos] = codeBlock[i];
					}
				}
				pos++;
			break;
			case oop.CMD_DISPATCH:
				if (filter == 4)
				{
					// Undo zero-type-referential optimization
					if (codeBlock[pos] < 0)
					{
						i = -codeBlock[pos] + 1;
						codeBlock[pos] = interp.codeBlocks[0][i];
					}
				}
				pos++;
			break;

			case oop.CMD_NAME:
			case oop.CMD_BIND:
			case oop.CMD_ZAP:
			case oop.CMD_RESTORE:
			case oop.CMD_PLAY:
			case oop.CMD_PLAYSOUND:
			case oop.CMD_USEGUI:
			case oop.CMD_ERROR:
			case oop.CMD_FALSEJUMP:
				pos++;
			break;

			case oop.CMD_NOP:
			case oop.CMD_PAUSE:
			case oop.CMD_UNPAUSE:
			case oop.CMD_ENDGAME:
			case oop.CMD_END:
			case oop.CMD_RESTART:
			case oop.CMD_LOCK:
			case oop.CMD_UNLOCK:
			case oop.CMD_DIE:
			case oop.CMD_DONEDISPATCH:
			case oop.CMD_UPDATELIT:
			case oop.CMD_UPDATEVIEWPORT:
			case oop.CMD_ERASEVIEWPORT:
			break;
			case oop.CMD_CHAR:
			case oop.CMD_CYCLE:
			case oop.CMD_COLOR:
			case oop.CMD_COLORALL:
			case oop.CMD_EXTRATURNS:
			case oop.CMD_SUSPENDDISPLAY:
			case oop.CMD_CHANGEBOARD:
			case oop.CMD_DISSOLVEVIEWPORT:
			case oop.CMD_SAVEBOARD:
			case oop.CMD_SAVEWORLD:
			case oop.CMD_LOADWORLD:
			case oop.CMD_RESTOREGAME:
			case oop.CMD_DUMPSE:
			case oop.CMD_SETPLAYER:
			case oop.CMD_CLEARREGION:
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_SCROLLTOVISUALS:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreDir(codeBlock, pos);
			break;
			case oop.CMD_SENDTONAME:
			case oop.CMD_ZAPTARGET:
			case oop.CMD_RESTORETARGET:
				pos += 2;
			break;
			case oop.CMD_SENDTO:
			case oop.CMD_DISPATCHTO:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos++;
			break;
			case oop.CMD_TEXT:
			case oop.CMD_TEXTCENTER:
			case oop.CMD_TEXTLINK:
			case oop.CMD_TEXTLINKFILE:
			case oop.CMD_DYNTEXT:
			case oop.CMD_DYNLINK:
			case oop.CMD_DYNTEXTVAR:
				pos = interp.ignoreText(codeBlock, pos, cByte);
			break;
			case oop.CMD_SCROLLSTR:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos++;
			break;
			case oop.CMD_SCROLLCOLOR:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;

			case oop.CMD_GO:
			case oop.CMD_FORCEGO:
			case oop.CMD_TRYSIMPLE:
			case oop.CMD_WALK:
				pos = interp.ignoreDir(codeBlock, pos);
			break;
			case oop.CMD_TRY:
				pos = interp.ignoreDir(codeBlock, pos);
				pos += 2;
				//pos = ignoreCommand(codeBlock, pos);
			break;
			case oop.CMD_PUSHATPOS:
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreDir(codeBlock, pos);
			break;

			case oop.CMD_BECOME:
				pos = interp.ignoreKind(codeBlock, pos);
			break;

			case oop.CMD_SPAWN:
				pos++;
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreKind(codeBlock, pos);
			break;
			case oop.CMD_SPAWNGHOST:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreKind(codeBlock, pos);
			break;
			case oop.CMD_PUT:
				pos = interp.ignoreDir(codeBlock, pos);
				pos = interp.ignoreKind(codeBlock, pos);
			break;
			case oop.CMD_SHOOT:
			case oop.CMD_THROWSTAR:
				pos++;
				pos = interp.ignoreDir(codeBlock, pos);
			break;
			case oop.CMD_CHANGE:
				pos = interp.ignoreKind(codeBlock, pos);
				pos = interp.ignoreKind(codeBlock, pos);
			break;
			case oop.CMD_CHANGEREGION:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreKind(codeBlock, pos);
				pos = interp.ignoreKind(codeBlock, pos);
			break;
			case oop.CMD_SETPOS:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos++;
				pos = interp.ignoreCoords(codeBlock, pos);
			break;
			case oop.CMD_TYPEAT:
			case oop.CMD_COLORAT:
			case oop.CMD_OBJAT:
			case oop.CMD_LITAT:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreCoords(codeBlock, pos);
			break;

			case oop.CMD_CHAR4DIR:
				pos = interp.ignoreDir(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_DIR2UVECT8:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_OFFSETBYDIR:
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_CLONE:
			case oop.CMD_LIGHTEN:
			case oop.CMD_DARKEN:
			case oop.CMD_DUMPSEAT:
			case oop.CMD_KILLPOS:
				pos = interp.ignoreCoords(codeBlock, pos);
			break;
			case oop.CMD_TEXTTOGUI:
				pos++;
			break;
			case oop.CMD_TEXTTOGRID:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_SETREGION:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreCoords(codeBlock, pos);
			break;
			case oop.CMD_SETPROPERTY:
			case oop.CMD_GETPROPERTY:
				pos++;
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_CLEAR:
			case oop.CMD_EXECCOMMAND:
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_SETTYPEINFO:
			case oop.CMD_GETTYPEINFO:
				pos = interp.ignoreKind(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_SUBSTR:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_INT:
			case oop.CMD_PLAYERINPUT:
			case oop.CMD_GETSOUND:
			case oop.CMD_STOPSOUND:
			case oop.CMD_SET:
			case oop.CMD_PUSHARRAY:
			case oop.CMD_POPARRAY:
			case oop.CMD_SETARRAY:
			case oop.CMD_LEN:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_RANDOM:
			case oop.CMD_MASTERVOLUME:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;

			case oop.CMD_SWITCHTYPE:
				pos = interp.ignoreCoords(codeBlock, pos);
				i = codeBlock[pos++];
				while (i--)
				{
					pos = interp.ignoreKind(codeBlock, pos);
					pos++;
				}
			break;
			case oop.CMD_SWITCHVALUE:
				pos = interp.ignoreExpr(codeBlock, pos);
				i = codeBlock[pos++];
				while (i--)
				{
					pos = interp.ignoreExprValue(codeBlock, pos, 0);
					pos++;
				}
			break;

			case oop.CMD_GIVE:
				if (codeBlock[pos] == oop.INV_KEY)
					pos += 2;
				else if (codeBlock[pos] == oop.INV_EXTRA)
					pos += 2;
				else
					pos++;

				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_TAKE:
				if (codeBlock[pos] == oop.INV_KEY)
					pos += 2;
				else if (codeBlock[pos] == oop.INV_EXTRA)
					pos += 2;
				else
					pos++;

				pos = interp.ignoreExpr(codeBlock, pos);
				//pos = ignoreCommand(codeBlock, pos);
			break;

			case oop.CMD_IF:
				pos++;
				i = codeBlock[pos++];
				switch (i) {
					case oop.FLAG_ALWAYSTRUE:
					break;
					case oop.FLAG_GENERIC:
						pos++;
					break;
					case oop.FLAG_ANY:
						pos = interp.ignoreKind(codeBlock, pos);
					break;
					case oop.FLAG_ALLIGNED:
					case oop.FLAG_ALIGNED:
					case oop.FLAG_CONTACT:
						if (codeBlock[pos] == oop.SPEC_ALL)
							pos++;
						else
							pos = interp.ignoreDir(codeBlock, pos);
					break;
					case oop.FLAG_BLOCKED:
						pos = interp.ignoreDir(codeBlock, pos);
					break;
					case oop.FLAG_CANPUSH:
					case oop.FLAG_SAFEPUSH:
					case oop.FLAG_SAFEPUSH1:
						pos = interp.ignoreCoords(codeBlock, pos);
						pos = interp.ignoreDir(codeBlock, pos);
					break;
					case oop.FLAG_ENERGIZED:
					break;
					case oop.FLAG_ANYTO:
						pos = interp.ignoreDir(codeBlock, pos);
						pos = interp.ignoreKind(codeBlock, pos);
					break;
					case oop.FLAG_ANYIN:
						pos = interp.ignoreExpr(codeBlock, pos);
						pos = interp.ignoreKind(codeBlock, pos);
					break;
					case oop.FLAG_SELFIN:
						pos = interp.ignoreExpr(codeBlock, pos);
					break;
					case oop.FLAG_TYPEIS:
						pos = interp.ignoreCoords(codeBlock, pos);
						pos = interp.ignoreKind(codeBlock, pos);
					break;
					case oop.FLAG_BLOCKEDAT:
						pos = interp.ignoreCoords(codeBlock, pos);
					break;
					case oop.FLAG_HASMESSAGE:
						pos = interp.ignoreExpr(codeBlock, pos);
						pos++;
					break;
					case oop.FLAG_TEST:
					case oop.FLAG_VALID:
						pos = interp.ignoreExpr(codeBlock, pos);
					break;
				}

				pos += 2;
				//pos = ignoreCommand(codeBlock, pos);
			break;

			case oop.CMD_FOREACH:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_FORMASK:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreCoords(codeBlock, pos);
				pos++;
			break;
			case oop.CMD_FORREGION:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_FORNEXT:
				if (filter == 3)
					return pos; // Found
			break;

			case oop.CMD_MODGUILABEL:
				pos++;
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_SETGUILABEL:
				pos++;
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_CONFMESSAGE:
				pos++;
				pos = interp.ignoreExpr(codeBlock, pos);
				pos += 2;
			break;
			case oop.CMD_TEXTENTRY:
				pos++;
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos += 2;
			break;
			case oop.CMD_DRAWPEN:
				pos++;
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_SELECTPEN:
				pos++;
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos++;
			break;
			case oop.CMD_DRAWBAR:
				pos++;
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;

			case oop.CMD_CAMERAFOCUS:
				pos = interp.ignoreCoords(codeBlock, pos);
			break;

			case oop.CMD_DRAWCHAR:
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_ERASECHAR:
				pos = interp.ignoreCoords(codeBlock, pos);
			break;
			case oop.CMD_DRAWGUICHAR:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_ERASEGUICHAR:
			case oop.CMD_GHOST:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;

			case oop.CMD_GROUPSETPOS:
			case oop.CMD_GROUPGO:
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;

			case oop.CMD_GROUPTRY:
			case oop.CMD_GROUPTRYNOPUSH:
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos += 2;
			break;

			case oop.CMD_ATAN2:
				pos = interp.ignoreCoords(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_SMOOTHTEST:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_SMOOTHMOVE:
				pos = interp.ignoreExpr(codeBlock, pos);
			break;

			case oop.CMD_READKEY:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_READMOUSE:
			break;

			case oop.CMD_SETCONFIGVAR:
			case oop.CMD_GETCONFIGVAR:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_DELCONFIGVAR:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_DELCONFIGHIVE:
			case oop.CMD_SYSTEMACTION:
				pos = interp.ignoreExpr(codeBlock, pos);
			break;

			case oop.CMD_SCANLINES:
			case oop.CMD_BIT7ATTR:
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_PALETTECOLOR:
			case oop.CMD_FADETOCOLOR:
			case oop.CMD_PALETTEBLOCK:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_FADETOBLOCK:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_CHARSELECT:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_POSTHS:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;
			case oop.CMD_GETHS:
			case oop.CMD_GETHSENTRY:
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
				pos = interp.ignoreExpr(codeBlock, pos);
			break;

			default:
				interp.errorMsg("(Label scan) Bad opcode:  " + cByte + " for " + mLabel);
				interp.opcodeTraceback(codeBlock, pos);
			return -1;
		}
	}

	return -1;
};

static opcodeTraceback(codeBlock, endPos) {
	var startPos = endPos - 7;
	if (startPos < 0)
		startPos = 0;

	var overallStr = "";
	while (startPos < endPos)
	{
		var b = codeBlock[startPos++];
		if (b > 255 && b < oop.pStrings.length)
			overallStr += oop.pStrings[b];
		else if (b < 0 && -b <= oop.negTracebackLookup.length)
			overallStr += b.toString() + "-" + oop.negTracebackLookup[-b - 1];
		else if (b >= 0 && b < oop.posTracebackLookup.length)
			overallStr += b.toString() + "+" + oop.posTracebackLookup[b];
		else
			overallStr += b.toString();

		overallStr += " ";
	}

	console.log(overallStr);
};

static dumpSE(relSE) {
	// Dump stringified copy of status element
	var str = relSE.toString();
	var dumpSplitter = str.split("\n");
	for (var i = 0; i < dumpSplitter.length; i++)
		zzt.addMsgLine("", dumpSplitter[i]);

	// If custom code exists, dump that code
	if (relSE.extra.hasOwnProperty("CODEID"))
	{
		var codeID = relSE.extra["CODEID"] - interp.numBuiltInCodeBlocksPlus;
		dumpSplitter = interp.unCompCode[codeID].split(zzt.globalProps["CODEDELIMETER"]);

		zzt.addMsgLine("$", "CODE:");
		for (i = 0; i < dumpSplitter.length; i++)
			zzt.addMsgLine("", dumpSplitter[i]);
	}
};

static zapTarget(relSE, mLabel) {
	var codeID = relSE.extra["CODEID"];
	var cBlock = interp.codeBlocks[codeID];
	var pos = interp.findLabel(cBlock, mLabel);
	if (pos != -1)
	{
		// Change code to remark
		cBlock[pos] = oop.CMD_COMMENT;
		interp.zapRecord.push(new ZapRecord(codeID, pos, 1, ZZTLoader.currentBoardSaveIndex));
	}
};

static restoreTarget(relSE, mLabel, overwriteLabel="") {
	var codeID = relSE.extra["CODEID"];
	var cBlock = interp.codeBlocks[codeID];
	var pos = 0;
	interp.restoredFirst = false;

	do
	{
		pos = interp.findLabel(cBlock, mLabel, pos, 1);
		if (pos != -1)
		{
			// Change code to label
			cBlock[pos] = oop.CMD_LABEL;
			interp.zapRecord.push(new ZapRecord(codeID, pos, 2, ZZTLoader.currentBoardSaveIndex));

			pos += 3;
			interp.restoredFirst = true;
		}
	} while (!interp.restoreEarlyOut && pos != -1);
};

static processText(cByte) {
	if (!interp.doDispText)
	{
		// If no text had been queued on this iteration, initiate it.
		zzt.numTextLines = 0;
		zzt.msgNonBlank = false;
		zzt.msgScrollFormats = [];
		zzt.msgScrollText = [];
		zzt.msgScrollIsRestore = false;
		zzt.msgScrollFiles = false;
		if (interp.thisSE.extra.hasOwnProperty("ONAME"))
			zzt.msgScrollObjName = interp.thisSE.extra["ONAME"];
		else
			zzt.msgScrollObjName = "";

		if (interp.thisSE.FLAGS & interp.FL_DISPATCH)
			interp.doDispText = 2; // Displayed from dispatched message specifically
		else
			interp.doDispText = 1; // Displayed from normal object code execution
	}

	var lStr = "";
	var pos = 0;
	var pos2 = 0;

	switch (cByte) {
		case oop.CMD_TEXT:
			zzt.addMsgLine("", interp.getString());
		break;
		case oop.CMD_TEXTCENTER:
			lStr = interp.getString();
			zzt.addMsgLine("$", lStr);
		break;
		case oop.CMD_TEXTLINK:
			lStr = interp.getString();
			zzt.addMsgLine(lStr, interp.getString());
		break;
		case oop.CMD_TEXTLINKFILE:
			lStr = "!" + interp.getString();
			zzt.addMsgLine(lStr, interp.getString());
		break;
		case oop.CMD_DYNTEXT:
			lStr = interp.getString();
			lStr = interp.dynFormatString(lStr);
			zzt.addMsgLine("", lStr);
		break;
		case oop.CMD_DYNLINK:
			lStr = interp.getString();
			zzt.addMsgLine(lStr, interp.dynFormatString(interp.getString()));
		break;
		case oop.CMD_DUMPSE:
		break;
		case oop.CMD_SCROLLSTR:
			pos = interp.intGetExpr();
			pos2 = interp.intGetExpr();
			lStr = interp.dynFormatString(interp.getString());

			if (pos > 0)
				interp.marqueeSize = pos;

			if (pos2 == 0)
			{
				// Queue text; don't scroll.
				if (lStr.length > 0)
					interp.marqueeText = lStr;
				else
					interp.marqueeText = utils.strReps(" ", interp.marqueeSize);
			}
			else if (pos2 < 0)
			{
				// Scroll left.
				pos2 = -pos2;
				interp.marqueeDir = -1;
				interp.marqueeText += lStr + utils.strReps(" ", pos2 - lStr.length);
				interp.marqueeText = interp.marqueeText.substr(pos2);
			}
			else // pos2 > 0
			{
				// Scroll right.
				interp.marqueeDir = 1;
				interp.marqueeText =
				utils.strReps(" ", pos2 - lStr.length) + lStr + interp.marqueeText;
				interp.marqueeText = interp.marqueeText.substr(0, interp.marqueeText.length - pos2);
			}

			// Set output.
			if (interp.marqueeDir == -1)
				zzt.addMsgLine("", interp.marqueeText.substr(0, interp.marqueeSize));
			else
				zzt.addMsgLine("",
			interp.marqueeText.substr(interp.marqueeText.length - interp.marqueeSize, interp.marqueeSize));
		break;
	}

	return true;
};

static displayText(allowSingularBlank) {
	// Compress multiple blank lines into just one blank line.
	if (zzt.numTextLines > 1 && !zzt.msgNonBlank)
		zzt.numTextLines = 1;

	// Singular blank lines only toasted if originating from dispatched message.
	if (!allowSingularBlank && zzt.numTextLines == 1 && !zzt.msgNonBlank)
		return false;

	if (interp.textTarget == interp.TEXT_TARGET_GUI)
	{
		// Text is re-routed to a GUI label.
		zzt.textLinesToGui(interp.textDestLabel);
	}
	else if (interp.textTarget == interp.TEXT_TARGET_GRID)
	{
		// Text is re-routed to a region.
		zzt.textLinesToRegion(interp.textDestLabel, interp.textDestType);
	}
	else if (zzt.numTextLines <= zzt.toastMsgSize)
	{
		// This will be a one- or two-line toast message.
		zzt.ToastMsg();
	}
	else
	{
		// This will be a larger message, shown in a "scroll" interface.
		if (interp.thisSE.extra.hasOwnProperty("ONAME"))
			zzt.ScrollMsg(interp.thisSE.extra["ONAME"]);
		else
			zzt.ScrollMsg(zzt.msgScrollObjName);

		// Remember the object responsible (for link-following purposes).
		interp.linkFollowSE = interp.thisSE;

		// When "scroll" interface must be displayed, turns are inherently over.
		interp.turns = 0;
	}

	return true;
};

static ignoreText(codeBlock, pos, cByte) {
	switch (cByte) {
		case oop.CMD_TEXT:
		case oop.CMD_TEXTCENTER:
		case oop.CMD_DYNTEXT:
			pos++;
		break;
		case oop.CMD_TEXTLINK:
		case oop.CMD_TEXTLINKFILE:
		case oop.CMD_DYNLINK:
		case oop.CMD_DYNTEXTVAR:
			pos += 2;
		break;
	}

	return pos;
};

static dynFormatString(fmtStr) {
	var idx = fmtStr.indexOf("$");
	if (idx == -1)
		return fmtStr;

	var doneStr = "";
	while (idx != -1) {
		doneStr += fmtStr.substring(0, idx);
		idx++;

		var isLocal = false;
		var isProp = false;
		if (idx < fmtStr.length)
		{
			if (fmtStr.charAt(idx) == ".")
			{
				isLocal = true;
				idx++;
			}
			else if (fmtStr.charAt(idx) == "~")
			{
				isProp = true;
				idx++;
			}
		}

		// Fetch variable value; replace in text.
		var nextIdx = oop.findNonKWDynamic(fmtStr, idx);
		var varName = fmtStr.substring(idx, nextIdx);
		var val = "";
		if (isLocal)
		{
			if (varName == "COLOR")
			{
				// Color is stored in grid.
				val = SE.getColor(interp.thisSE.X, interp.thisSE.Y).interp.toString();
			}
			else if (interp.thisSE.extra.hasOwnProperty(varName))
			{
				// Dereference operation retrieves extra value from dictionary
				val = interp.thisSE.extra[varName].toString();
			}
			else if (interp.thisSE.hasOwnProperty(varName))
			{
				// Dereference operation hits main member, not dictionary
				val = interp.thisSE[varName].toString();
			}
		}
		else if (isProp)
		{
			if (zzt.boardProps.hasOwnProperty(varName))
				val = zzt.boardProps[varName].toString();
			else
				val = zzt.globalProps[varName].toString();
		}
		else
			val = interp.getGlobalVarValue(varName).toString();

		// Remove part of string we just "digested."
		doneStr += val;
		fmtStr = fmtStr.substring(nextIdx);

		// Check for more variable names to replace.
		idx = fmtStr.indexOf("$");
	}

	doneStr += fmtStr;
	return doneStr;
};

static getGlobalVarValue(varName) {
	if (zzt.globals.hasOwnProperty(varName))
		return (zzt.globals[varName]);
	else
		return 0;
};

static setVariableFromRef(vType, varName, val) {
	if (vType == oop.SPEC_LOCALVAR)
	{
		// Set local variable.
		if (varName == "COLOR")
		{
			// Color is stored in grid.
			SE.setColor(interp.thisSE.X, interp.thisSE.Y, utils.int(val));
		}
		else if (varName == "COLORALL")
		{
			// Color is stored in grid.
			SE.setColor(interp.thisSE.X, interp.thisSE.Y, utils.int(val), false);
		}
		else if (interp.thisSE.hasOwnProperty(varName))
			interp.thisSE[varName] = val;
		else
			interp.thisSE.extra[varName] = val;
	}
	else if (vType == oop.SPEC_PROPERTY)
	{
		// Set property.
		if (zzt.boardProps.hasOwnProperty(varName))
		{
			zzt.boardProps[varName] = val;
			if (varName == "ISDARK")
				SE.IsDark = zzt.boardProps[varName];
		}
		else
		{
			zzt.globalProps[varName] = val;
		}

		// Set property string and dispatch to ONPROPERTY handler.
		zzt.globals["$PROP"] = varName;
		interp.briefDispatch(interp.onPropPos, interp.thisSE, interp.blankSE);
	}
	else if (vType == oop.SPEC_GLOBALVAR)
	{
		// Set global variable.
		if (zzt.globals.hasOwnProperty(varName))
			interp.classicSet = 0; // Replacement; no danger of hitting classic flag limit.
		zzt.globals[varName] = val;
	}
	else if (vType == oop.OP_ARR)
	{
		// Set array index.
		zzt.globals[varName][interp.memberIdx] = val;
	}
	else
	{
		if (interp.ptr2SetInExpr == null)
			interp.errorMsg("Attempt to set member '" + varName + "' of null object");
		else if (varName == "COLOR")
		{
			// Color is stored in grid.
			SE.setColor(interp.ptr2SetInExpr.X, interp.ptr2SetInExpr.Y, utils.int(val));
		}
		else if (varName == "COLORALL")
		{
			// Color is stored in grid.
			SE.setColor(interp.ptr2SetInExpr.X, interp.ptr2SetInExpr.Y, utils.int(val), false);
		}
		else if (varName == "DIR")
		{
			// Direction is composite of steps.
			interp.ptr2SetInExpr.STEPX = interp.getStepXFromDir4(utils.int(val));
			interp.ptr2SetInExpr.STEPY = interp.getStepYFromDir4(utils.int(val));
		}
		else if (interp.ptr2SetInExpr.extra.hasOwnProperty(varName))
		{
			// Dereference operation retrieves extra value from dictionary
			interp.ptr2SetInExpr.extra[varName] = val;
		}
		else if (interp.ptr2SetInExpr.hasOwnProperty(varName))
		{
			// Dereference operation hits main member, not dictionary
			interp.ptr2SetInExpr[varName] = val;
		}
	}
};

static getRegion(regionName) {
	if (zzt.regions.hasOwnProperty(regionName))
		return (zzt.regions[regionName]);
	else
		return interp.noRegion;
};

static getMask(maskName) {
	if (zzt.masks.hasOwnProperty(maskName))
		return (zzt.masks[maskName]);
	else
		return interp.noMask;
};

static getDir() {
	var dir = 0;
	var adder = 0;
	var qualifier = -1;
	var done = false;
	var coords = [1, 1];

	while (!done) {
		var cByte = interp.getInt();
		switch (cByte) {
			case oop.SPEC_EXPRPRESENT:
				dir = interp.intGetExpr();
				done = true;
			break;
			case oop.DIR_E:
				dir = 0;
				done = true;
			break;
			case oop.DIR_S:
				dir = 1;
				done = true;
			break;
			case oop.DIR_W:
				dir = 2;
				done = true;
			break;
			case oop.DIR_N:
				dir = 3;
				done = true;
			break;
			case oop.DIR_I:
				dir = -1;
				done = true;
			break;
			case oop.DIR_SEEK:
				dir = interp.calcDirTowards(interp.thisSE.X, interp.thisSE.Y, interp.playerSE.X, interp.playerSE.Y,
				zzt.Use40Column);
				if (zzt.globalProps["ENERGIZERCYCLES"] > 0 && dir != -1)
					dir = (dir + 2 & 3); // Invert seek (Pac-Man logic)
				done = true;
			break;
			case oop.DIR_FLOW:
				dir = interp.getDir4FromSteps(interp.thisSE.STEPX, interp.thisSE.STEPY);
				done = true;
			break;
			case oop.DIR_RNDNS:
				dir = utils.zerothru(1) * 2 + 1;
				done = true;
			break;
			case oop.DIR_RNDNE:
				dir = (utils.zerothru(1) - 1) & 3;
				done = true;
			break;
			case oop.DIR_RND:
				if (zzt.Use40Column)
					dir = utils.dir4norm();
				else
					dir = utils.dir4skewed();
				done = true;
			break;
			case oop.DIR_RNDSQ:
				dir = utils.dir4norm();
				done = true;
			break;
			case oop.DIR_CW:
				adder += 1;
			break;
			case oop.DIR_CCW:
				adder += 3;
			break;
			case oop.DIR_RNDP:
				if (utils.eitheror())
					adder += 1;
				else
					adder += 3;
			break;
			case oop.DIR_OPP:
				adder += 2;
			break;
			case oop.DIR_TOWARDS:
				interp.getCoords(coords);
				dir = interp.calcDirTowards(interp.thisSE.X, interp.thisSE.Y, coords[0], coords[1],
				zzt.Use40Column);
				done = true;
			break;
			case oop.DIR_MAJOR:
			case oop.DIR_MINOR:
				qualifier = cByte;
			break;
			case oop.DIR_UNDER:
			case oop.DIR_OVER:
				return cByte;
			break;
		}
	}

	// Apply major/minor qualifier
	if (qualifier == oop.DIR_MAJOR)
		dir = interp.majorDir;
	else if (qualifier == oop.DIR_MINOR)
		dir = interp.minorDir;

	// Clip direction.  Note that idle remains at -1.
	dir += adder;
	if (dir >= 4)
		dir &= 3;

	return dir;
};

static ignoreDir(codeBlock, pos) {
	var done = false;
	while (!done) {
		var cByte = codeBlock[pos++];

		switch (cByte) {
			case oop.DIR_CW:
			case oop.DIR_CCW:
			case oop.DIR_RNDP:
			case oop.DIR_OPP:
			case oop.DIR_MAJOR:
			case oop.DIR_MINOR:
			break;
			case oop.DIR_TOWARDS:
				pos = interp.ignoreCoords(codeBlock, pos);
				done = true;
			break;
			case oop.SPEC_EXPRPRESENT:
				pos = interp.ignoreExpr(codeBlock, pos);
				done = true;
			break;
			default:
				done = true;
			break;
		}
	}

	return pos;
};

static calcDirTowards(origX, origY, destX, destY, perfectSquare) {
	// Get differences
	destX -= origX;
	destY -= origY;
	var magX = utils.iabs(destX);
	var magY = utils.iabs(destY);

	// Figure out which is the dominant direction.
	if (magX == 0 && magY == 0)
	{
		// Origin:  idle.
		interp.majorDir = -1;
		interp.minorDir = -1;
		return -1;
	}

	if (magX >= magY)
	{
		interp.majorDir = interp.getDir4FromSteps(utils.isgn(destX), 0);
		interp.minorDir = interp.getDir4FromSteps(0, utils.isgn(destY));
	}
	else
	{
		interp.majorDir = interp.getDir4FromSteps(0, utils.isgn(destY));
		interp.minorDir = interp.getDir4FromSteps(utils.isgn(destX), 0);
	}

	if (magX == 0 || magY == 0)
		return interp.majorDir;

	if (perfectSquare)
	{
		if (utils.eitheror())
			return interp.getDir4FromSteps(utils.isgn(destX), 0);
		else
			return interp.getDir4FromSteps(0, utils.isgn(destY));
	}
	else
	{
		if (utils.noutofn(2, 3))
			return interp.getDir4FromSteps(utils.isgn(destX), 0);
		else
			return interp.getDir4FromSteps(0, utils.isgn(destY));
	}
};

static getCoords(destCoords) {
	var cByte = interp.getInt();
	if (cByte == oop.SPEC_ABS)
	{
		destCoords[0] = interp.intGetExpr();
		destCoords[1] = interp.intGetExpr();
	}
	else if (cByte == oop.SPEC_POLAR)
	{
		var mag = interp.intGetExpr();
		var dir = interp.intGetExpr() & 3;
		destCoords[0] = interp.thisSE.X + (mag * interp.getStepXFromDir4(dir));
		destCoords[1] = interp.thisSE.Y + (mag * interp.getStepYFromDir4(dir));
	}
	else
	{
		if (cByte == oop.SPEC_ADD)
			destCoords[0] = interp.thisSE.X + interp.intGetExpr();
		else
			destCoords[0] = interp.thisSE.X - interp.intGetExpr();

		cByte = interp.getInt();
		if (cByte == oop.SPEC_ADD)
			destCoords[1] = interp.thisSE.Y + interp.intGetExpr();
		else
			destCoords[1] = interp.thisSE.Y - interp.intGetExpr();
	}
};

static getRelCoords(destCoords) {
	var cByte = interp.getInt();
	if (cByte == oop.SPEC_ABS)
	{
		destCoords[0] = 0;
		destCoords[1] = 0;
	}
	else if (cByte == oop.SPEC_POLAR)
	{
		var mag = interp.intGetExpr();
		var dir = interp.intGetExpr() & 3;
		destCoords[0] = (mag * interp.getStepXFromDir4(dir));
		destCoords[1] = (mag * interp.getStepYFromDir4(dir));
	}
	else
	{
		if (cByte == oop.SPEC_ADD)
			destCoords[0] = interp.intGetExpr();
		else
			destCoords[0] = -interp.intGetExpr();

		cByte = interp.getInt();
		if (cByte == oop.SPEC_ADD)
			destCoords[1] = interp.intGetExpr();
		else
			destCoords[1] = -interp.intGetExpr();
	}
};

static ignoreCoords(codeBlock, pos) {
	var cByte = codeBlock[pos++];
	if (cByte == oop.SPEC_ABS || cByte == oop.SPEC_POLAR)
	{
		pos = interp.ignoreExpr(codeBlock, pos);
		pos = interp.ignoreExpr(codeBlock, pos);
	}
	else
	{
		pos = interp.ignoreExpr(codeBlock, pos);
		pos++;
		pos = interp.ignoreExpr(codeBlock, pos);
	}

	return pos;
};

static getKind(allowAll=false) {
	var cByte = interp.getInt();
	if (cByte == oop.SPEC_KINDMISC)
	{
		// Expression
		interp.kwargPos = -1;
		var kByte = interp.getInt();
		if (!allowAll && kByte == oop.MISC_ALL)
		{
			interp.errorMsg("'ALL' type cannot be used here");
			return 0;
		}

		return -kByte;
	}
	else if (cByte == oop.SPEC_KINDEXPR)
	{
		// Expression determines kind.
		cByte = interp.intGetExpr();
	}
	else
	{
		// Kind is a simple integer.
		cByte = interp.typeTrans2(interp.getInt());
	}

	// Save keyword arg position; we skip past args
	// and will evaluate them later.
	interp.kwargPos = interp.thisSE.IP;
	kByte = interp.getInt();
	while (kByte != oop.SPEC_KWARGEND)
	{
		interp.getExpr();
		kByte = interp.getInt();
	}

	return cByte;
};

static ignoreKind(codeBlock, pos) {
	var cByte = codeBlock[pos++];
	if (cByte == oop.SPEC_KINDMISC)
	{
		return (pos+1);
	}
	if (cByte == oop.SPEC_KINDEXPR)
	{
		pos = interp.ignoreExpr(codeBlock, pos);
	}
	else
	{
		pos++;
	}

	var kByte = codeBlock[pos++];
	while (kByte != oop.SPEC_KWARGEND)
	{
		pos = interp.ignoreExpr(codeBlock, pos);
		kByte = codeBlock[pos++];
	}

	return pos;
};

static getFlatSequence(o, breakOutBits=false) {
	var seq = [];

	if (utils.isString(o))
	{
		// Mask name or WAD lump
		var s = o;
		var maskArray = interp.getMask(s);

		if (s == "NONE")
		{
			// Intentional NONE string usually has special handling.
			return null;
		}
		else if (maskArray == interp.noMask)
		{
			// Take values out of WAD lump.
			for (var i = 0; i < ZZTLoader.extraLumps.length; i++) {
				if (utils.startswith(ZZTLoader.extraLumps[i].name, s))
				{
					var ba = ZZTLoader.extraLumpBinary[i];
					for (var j = 0; j < ba.length; j++)
						seq.push(ba.b[j]);

					break;
				}
			}

			if (seq.length == 0)
			{
				// Requested sequence can't be found.
				return null;
			}
		}
		else
		{
			// Take values out of mask.
			breakOutBits = false;
			var xSize = maskArray[0].length;
			var ySize = maskArray.length;
			for (var y = 0; y < ySize; y++) {
				for (var x = 0; x < xSize; x++) {
					seq.push(maskArray[y][x]);
				}
			}
		}
	}
	else if (o instanceof ByteArray)
	{
		// ByteArray
		ba = o;
		for (j = 0; j < ba.length; j++)
			seq.push(ba.b[j]);
	}
	else
	{
		// Global variable (must be array)
		breakOutBits = false;
		var a = o;
		for (j = 0; j < a.length; j++)
		{
			if (Array.isArray(a[j])) {
				for (var p = 0; p < a[j].length; p++)
					seq.push(a[j][p]);
			}
			else
				seq.push(a[j]);
		}
	}

	// Take sequence verbatim.
	if (!breakOutBits)
		return seq;

	// Sequence is actually bit fields; break into separate bytes.
	var seq2 = [];
	for (var n = 0; n < seq.length; n++) {
		var val = seq[n];
		for (var bf = 0; bf < 8; bf++)
		{
			seq2.push(((val & 0x80) != 0) ? 1 : 0);
			val <<= 1;
		}
	}

	return seq2;
};

static makeBitSequence(a) {
	var ba = new ByteArray();

	// Sequence is actually bit fields; break into separate bytes.
	for (var n = 0; n < a.length;) {
		var bMask = 0x80;
		var val = 0;

		for (var bf = 0; bf < 8 && n < a.length; n++, bf++) {
			if (a[n] != 0)
				val |= bMask;
			bMask >>= 1;
		}

		ba.writeByte(val);
	}

	return ba;
};

static intGetExpr() {
	var o = interp.getExpr();
	if (utils.isInt(o))
		return utils.int(o);
	else if (utils.isBoolean(o))
		return (o ? 1 : 0);
	else
		return 0;
};

static strGetExpr() {
	var o = interp.getExpr();
	if (o == null)
		return "";
	else
		return o.toString();
};

static regionGetExpr() {
	if (interp.peekInt() == oop.SPEC_GLOBALVAR)
	{
		interp.thisSE.IP++;
		var member = interp.getString();
		if (!zzt.globals.hasOwnProperty(member) || interp.forceRegionLiteral)
		{
			// Old-style string represents non-quoted region.
			return member;
		}

		interp.thisSE.IP -= 2;
	}

	// Evaluate expression normally.
	return (interp.strGetExpr());
};

static getExpr() {
	// If expression is simple, we read only a single value.
	var cByte = interp.peekInt();
	if (cByte != oop.SPEC_EXPRPRESENT)
		return interp.getExprValue(cByte);

	// Expression is complex; we read many values.
	interp.thisSE.IP++;
	var rObj = null;
	var refSE;
	while (cByte != oop.SPEC_EXPREND)
	{
		// Get expression and apply last operator.
		var eObj = interp.getExprValue(cByte);
		switch (cByte) {
			case oop.SPEC_EXPRPRESENT:
				// Simple value transfer
				rObj = eObj;
			break;
			case oop.OP_ADD:
				rObj += eObj;
			break;
			case oop.OP_SUB:
				rObj = Number(rObj) - Number(eObj);
			break;
			case oop.OP_MUL:
				rObj = Number(rObj) * Number(eObj);
			break;
			case oop.OP_DIV:
				rObj = utils.int(Number(rObj) / Number(eObj));
			break;
			case oop.OP_EQU:
				rObj = Boolean(rObj == eObj) ? 1 : 0;
			break;
			case oop.OP_NEQ:
				rObj = Boolean(rObj != eObj) ? 1 : 0;
			break;
			case oop.OP_GRE:
				rObj = Boolean(rObj > eObj) ? 1 : 0;
			break;
			case oop.OP_LES:
				rObj = Boolean(rObj < eObj);
			break;
			case oop.OP_GOE:
				rObj = Boolean(rObj >= eObj) ? 1 : 0;
			break;
			case oop.OP_LOE:
				rObj = Boolean(rObj <= eObj) ? 1 : 0;
			break;
			case oop.OP_AND:
				rObj = Number(rObj) & Number(eObj);
			break;
			case oop.OP_OR:
				rObj = Number(rObj) | Number(eObj);
			break;
			case oop.OP_XOR:
				rObj = Number(rObj) ^ Number(eObj);
			break;
			case oop.OP_ARR:
				interp.exprRefSrc2 = rObj;
				rObj = rObj[utils.int(eObj)];
			break;
			case oop.OP_DOT:
				// Indirection
				refSE = SE.getStatElem(utils.int(rObj));
				if (refSE == null)
				{
					interp.errorMsg("Null dereference for member:  " + eObj.toString());
					return 0;
				}
				else if (interp.lastExprType != oop.SPEC_GLOBALVAR)
				{
					interp.errorMsg("Bad indirection:  " + eObj.toString());
					return 0;
				}
				else if (eObj == "COLOR")
				{
					// Dereference operation retrieves color
					rObj = SE.getColor(refSE.X, refSE.Y);
				}
				else if (eObj == "DIR")
				{
					// Dereference operation retrieves direction (composite of steps)
					rObj = interp.getDir4FromSteps(refSE.STEPX, refSE.STEPY);
				}
				else if (refSE.extra.hasOwnProperty(eObj))
				{
					// Dereference operation retrieves extra value from dictionary
					rObj = refSE.extra[eObj];
				}
				else if (refSE.hasOwnProperty(eObj))
				{
					// Dereference operation hits main member, not dictionary
					rObj = refSE[eObj];
				}
				else
				{
					interp.errorMsg("Bad indirection:  " + eObj.toString());
					return 0;
				}
			break;
		}

		cByte = interp.getInt();
	}

	return rObj;
};

static getExprValue(fromOp) {
	var member;
	var cByte = interp.getInt();
	interp.lastExprType = cByte;

	switch (cByte) {
		case oop.CMD_ERROR:
			interp.errorMsg("EXPRESSION ERROR:  " + interp.getString());
			interp.opcodeTraceback(interp.code, interp.thisSE.IP);
			return -1;
		case oop.SPEC_BOOLEAN:
			interp.classicSet += 1; // One half of classic flag limit requirement
			return interp.getInt();
		case oop.SPEC_NUMCONST:
			return interp.getInt();
		case oop.SPEC_KINDCONST:
			return interp.typeTrans2(interp.getInt());
		case oop.SPEC_STRCONST:
			return interp.getString();
		case oop.SPEC_DIRCONST:
			return interp.getDir();
		case oop.SPEC_LOCALVAR:
			member = interp.getString();
			if (member == "COLOR")
			{
				// Color is stored in grid.
				return (SE.getColor(interp.thisSE.X, interp.thisSE.Y));
			}
			else if (member == "DIR")
			{
				// Direction is composite of steps.
				return (interp.getDir4FromSteps(interp.thisSE.STEPX, interp.thisSE.STEPY));
			}
			else if (interp.thisSE.extra.hasOwnProperty(member))
			{
				// Dereference operation retrieves extra value from dictionary
				return interp.thisSE.extra[member];
			}
			else if (interp.thisSE.hasOwnProperty(member))
			{
				// Dereference operation hits main member, not dictionary
				return interp.thisSE[member];
			}

			interp.errorMsg("Bad indirection:  " + member);
			return -1;

		case oop.SPEC_PROPERTY:
			member = interp.getString();
			if (zzt.boardProps.hasOwnProperty(member))
			{
				// Board property
				return zzt.boardProps[member];
			}
			else if (zzt.globalProps.hasOwnProperty(member))
			{
				// World property
				return zzt.globalProps[member];
			}

			interp.errorMsg("No such property:  " + member);
			return -1;

		case oop.SPEC_GLOBALVAR:
			member = interp.getString();
			if (fromOp == oop.OP_DOT)
			{
				// Member; just return string.
				return member;
			}
			else if (zzt.globals.hasOwnProperty(member))
			{
				// Return global variable
				return zzt.globals[member];
			}

			// If global variable does not exist, can't dereference.
			interp.errorMsg("Variable does not exist:  " + member);
			return -1;

		case oop.SPEC_SELF:
			interp.getInt(); // Dummy argument
			interp.assignID(interp.thisSE);
			return interp.thisSE.myID;
	}

	interp.errorMsg("Bad expression value:  " + cByte);
	interp.getInt();
	return -1;
};

static getExprRef() {
	// There are three types of expression references that can be returned:
	// 1) Local object member (string)
	// 2) Global variable (string)
	// 3) Global variable acting as indirected pointer to object member (string.string)
	var member;
	var cByte = interp.getInt();
	var mByte;
	interp.lastExprType = cByte;

	switch (cByte) {
		case oop.CMD_ERROR:
			interp.errorMsg("EXPR REF ERROR:  " + interp.getString());
			interp.opcodeTraceback(interp.code, interp.thisSE.IP);
		return "";
		case oop.SPEC_LOCALVAR:
			member = interp.getString();
		return member;
		case oop.SPEC_PROPERTY:
			member = interp.getString();
		return member;
		case oop.SPEC_GLOBALVAR:
			interp.classicSet += 1; // One half of classic flag limit requirement
			member = interp.getString();
		return member;
		case oop.SPEC_EXPRPRESENT:
			if (interp.getInt() == oop.SPEC_GLOBALVAR)
			{
				member = interp.getString();
				interp.ptr2SetInExpr = SE.getStatElem(zzt.globals[member]);
				mByte = interp.getInt();
				if (mByte == oop.OP_DOT)
				{
					if (interp.getInt() == oop.SPEC_GLOBALVAR)
					{
						member = interp.getString();
						interp.getInt(); // oop.SPEC_EXPREND
						return member;
					}
				}
				else if (mByte == oop.OP_ARR)
				{
					interp.memberIdx = utils.int(interp.getExprValue(oop.OP_ARR));
					interp.getInt(); // oop.SPEC_EXPREND
					interp.lastExprType = oop.OP_ARR;
					return member;
				}
			}
		break;
	}

	interp.errorMsg("L-Value required");
	return "";
};

static ignoreExpr(codeBlock, pos) {
	// If expression is simple, we read only a single value.
	var cByte = codeBlock[pos];
	if (cByte != oop.SPEC_EXPRPRESENT)
		return interp.ignoreExprValue(codeBlock, pos, cByte);

	// Expression is complex; we read many values.
	pos++;
	while (cByte != oop.SPEC_EXPREND)
	{
		pos = interp.ignoreExprValue(codeBlock, pos, cByte);
		cByte = codeBlock[pos++];
		if (pos >= codeBlock.length)
			break;
	}

	return pos;
};

static ignoreExprValue(codeBlock, pos, cByte) {
	if (codeBlock[pos] == oop.SPEC_DIRCONST)
		return interp.ignoreDir(codeBlock, pos + 1);
	else
	{
		// Type + Integer or string
		return (pos + 2);
	}
};

static getSEFromOName(oName, restart=true) {
	if (oName.toUpperCase() == "ALL")
	{
		if (restart)
			return SE.getStatElemOwnCode();
		else
			return SE.getStatElemOwnCode(SE.statIter);
	}
	else if (oName.toUpperCase() == "OTHERS")
	{
		var otherSE;
		if (restart)
			otherSE = SE.getStatElemOwnCode();
		else
			otherSE = SE.getStatElemOwnCode(SE.statIter);

		// Skip over self
		if (otherSE == interp.thisSE)
		otherSE = SE.getStatElemOwnCode(SE.statIter);

		return otherSE;
	}
	else
	{
		if (restart)
			return SE.getONAMEMatching(oName.toUpperCase());
		else
			return SE.getONAMEMatching(oName.toUpperCase(), SE.statIter);
	}
};

static killSE(x, y) {
	var relSE = SE.getStatElemAt(x, y);
	if (relSE)
	{
		if (relSE.TYPE == zzt.bulletType)
		{
			if (relSE.extra["P1"] == 0)
				zzt.boardProps["CURPLAYERSHOTS"] -= 1;
		}

		relSE.FLAGS |= interp.FL_IDLE + interp.FL_DEAD;
		relSE.eraseSelfSquare(false);
	}
	else
	{
		SE.setStatElemAt(x, y, null);
	}
};

static validCoords(coords, allowBoardEdge=false) {
	return interp.validXY(coords[0], coords[1], allowBoardEdge);
};

static validXY(x, y, allowBoardEdge=false) {
	if (allowBoardEdge)
		return Boolean(x >= 0 && y >= 0 && x <= SE.gridWidth + 1 && y <= SE.gridHeight + 1);
	else
		return Boolean(x > 0 && y > 0 && x <= SE.gridWidth && y <= SE.gridHeight);
};

static validXYM1(x, y) {
	return Boolean(x > 0 && y > 0 && x <= SE.gridWidth && y <= SE.gridHeight - 1);
};

static createKind(x, y, newKind, createFlags=0) {
	// Fetch current color info
	var useUnderColor = true;
	var colorToSet = SE.getColor(x, y);
	interp.lastKindColor = colorToSet;

	// If CLONE type used, make a copy of that.
	if (newKind == -oop.MISC_CLONE)
		return interp.createClone(x, y, createFlags);

	// Get kind and status element at location.
	var oldSE = SE.getStatElemAt(x, y);
	var oldKind = SE.getType(x, y);

	// Preserve IP; set to keyword arg position
	var oldIP = interp.thisSE.IP;
	interp.thisSE.IP = interp.kwargPos;

	// If no status element, just show type at square.
	var eInfo = interp.typeList[newKind];
	if (eInfo.NoStat)
	{
		if (oldSE && (createFlags & interp.CF_UNDERLAYER) != 0)
		{
			// Modify type and color under the status element.
			if (interp.kwargPos == -1)
			{
				if (eInfo.DominantColor)
					colorToSet = eInfo.COLOR;
			}
			else
			{
				var kVal = interp.getInt();
				if (eInfo.DominantColor)
					colorToSet = eInfo.COLOR;
				else if (kVal == oop.KWARG_COLOR)
					colorToSet = interp.intGetExpr();
			}

			interp.lastKindColor = colorToSet;
			oldSE.UNDERID = newKind;
			oldSE.UNDERCOLOR = interp.lastKindColor;
			interp.thisSE.IP = oldIP;
			return null;
		}

		// Erase status element.
		if (oldSE)
		{
			// "Natural" color reproduction from PASSAGE takes shown color
			// instead of stored color.
			if (interp.typeList[oldKind].NUMBER == 11)
				colorToSet = oldSE.extra["P2"];

			if (oldSE.UNDERID == newKind)
			{
				if (zzt.globalProps["BECOMESAMECOLOR"])
					oldSE.UNDERCOLOR = colorToSet;
			}
			else if (createFlags & interp.CF_RETAINCOLOR)
				oldSE.UNDERCOLOR = colorToSet;

			if (oldSE.TYPE == zzt.bulletType)
			{
				if (oldSE.extra["P1"] == 0)
					zzt.boardProps["CURPLAYERSHOTS"] -= 1;
			}

			oldSE.FLAGS |= interp.FL_IDLE + interp.FL_DEAD;
			oldSE.eraseSelfSquare(false);
		}

		if (interp.typeList[oldKind].NUMBER == 9)
		{
			// "Natural" color reproduction from DOOR takes shown color
			// instead of stored color.
			colorToSet = (((colorToSet << 4) & 240) ^ 128) + ((colorToSet >> 4) & 15);
			SE.setColor(x, y, colorToSet, false);
		}
		if (interp.typeList[newKind].NUMBER == 9)
		{
			// "Natural" color reproduction to DOOR forces FG to white.
			colorToSet = (colorToSet & 15) | 240;
			SE.setColor(x, y, colorToSet, false);
		}

		// We set type and color.
		SE.setStatElemAt(x, y, null);
		SE.setType(x, y, newKind);
		if (interp.kwargPos == -1)
		{
			if (eInfo.DominantColor)
				colorToSet = eInfo.COLOR;

			// EMPTY target type forces a virtual default color of black-FG-on-light-grey BG.
			if (newKind == 0)
				colorToSet = 112;

			SE.setColor(x, y, colorToSet, false);
		}
		else
		{
			kVal = interp.getInt();
			if (eInfo.DominantColor)
			{
				colorToSet = eInfo.COLOR;
				SE.setColor(x, y, colorToSet, false);
			}
			else if (kVal == oop.KWARG_COLOR)
			{
				// Can take one and only one possible kwarg:  color.
				colorToSet = interp.intGetExpr();

				// "Natural" color reproduction to DOOR forces FG to white.
				if (interp.typeList[newKind].NUMBER == 9)
					colorToSet = colorToSet | 240;

				SE.setColor(x, y, colorToSet, false);
			}
			else
			{
				// EMPTY target type forces a virtual default color of black-FG-on-light-grey BG.
				if (newKind == 0)
				{
					colorToSet = 112;
					SE.setColor(x, y, colorToSet, false);
				}
			}
		}

		// Display type immediately.
		interp.thisSE.IP = oldIP;
		SE.displaySquare(x, y);
		return null;
	}

	// Clip against max stat element count.
	if (SE.statElem.length - SE.statLessCount >= zzt.globalProps["MAXSTATELEMENTCOUNT"])
	{
		//console.log("limit");
		interp.thisSE.IP = oldIP;
		return null;
	}

	var relSE = null;
	if (oldSE != null && (createFlags & (interp.CF_RETAINSE | interp.CF_GHOSTED)) == interp.CF_RETAINSE)
	{
		// "Natural" color reproduction from PASSAGE takes shown color
		// instead of stored color.
		if (interp.typeList[oldKind].NUMBER == 11)
			colorToSet = oldSE.extra["P2"];

		if (newKind == oldSE.TYPE)
		{
			// Special:  if we are retaining SE content at current position,
			// we do not remove the status element if it is an identical type.
			relSE = oldSE;

			if (interp.typeList[oldKind].NUMBER == 11)
				oldSE.extra["P2"] |= 512;
		}
	}

	interp.lastKindColor = colorToSet;
	if (!relSE)
	{
		// Erase status element if one is already present.
		if (createFlags & interp.CF_GHOSTED)
		{
			// No overwrites for pre-ghosted SE.
		}
		else if (oldSE)
		{
			if (oldSE.UNDERID == newKind)
			{
				if (zzt.globalProps["BECOMESAMECOLOR"])
					oldSE.UNDERCOLOR = colorToSet;
			}

			if (oldSE.TYPE == zzt.bulletType)
			{
				if (oldSE.extra["P1"] == 0)
					zzt.boardProps["CURPLAYERSHOTS"] -= 1;
			}

			oldSE.FLAGS |= interp.FL_IDLE + interp.FL_DEAD;
			oldSE.eraseSelfSquare(false);
		}
		else
		{
			if (interp.typeList[oldKind].NUMBER == 9)
			{
				// "Natural" color reproduction from DOOR takes shown color
				// instead of stored color.
				colorToSet = (((colorToSet << 4) & 240) ^ 128) + ((colorToSet >> 4) & 15);
				SE.setColor(x, y, colorToSet, false);
			}

			if (interp.typeList[oldKind].BlockObject && (createFlags & interp.CF_REMOVEIFBLOCKING))
			{
				// Don't make previous tile into "floor."
				SE.setType(x, y, 0);
			}
		}

		// Create new SE.
		if (oldKind == 0)
			SE.setColor(x, y, colorToSet & 0x8F, false);

		if ((createFlags & interp.CF_GHOSTED) == 0)
		{
			relSE = new SE(newKind, x, y);
			SE.setStatElemAt(x, y, relSE);
		}
		else
		{
			relSE = new SE(newKind, x, y, -1000, true);
			relSE.FLAGS = interp.FL_GHOST;
		}

		SE.statElem.push(relSE);
		interp.lastKindColor = eInfo.COLOR;
	}

	if (interp.kwargPos == -1)
	{
		if (!eInfo.DominantColor && (createFlags & interp.CF_GHOSTED) == 0)
		{
			SE.setColor(relSE.X, relSE.Y, colorToSet, useUnderColor);
		}

		interp.thisSE.IP = oldIP;
		return relSE; // No kwargs
	}

	var kByte = interp.getInt();
	while (kByte != oop.SPEC_KWARGEND)
	{
		// The expression is an integer for nearly all kwargs.
		var oVal = interp.getExpr();
		kVal = utils.int0(oVal.toString());

		// The kwarg index determines what we set.
		switch (kByte) {
			case oop.KWARG_TYPE:
				relSE.TYPE = kVal;
			break;
			case oop.KWARG_X:
				relSE.X = kVal;
			break;
			case oop.KWARG_Y:
				relSE.Y = kVal;
			break;
			case oop.KWARG_STEPX:
				relSE.STEPX = kVal;
			break;
			case oop.KWARG_STEPY:
				relSE.STEPY = kVal;
			break;
			case oop.KWARG_CYCLE:
				relSE.CYCLE = kVal;
			break;
			case oop.KWARG_P1:
				relSE.extra["P1"] = kVal;
			break;
			case oop.KWARG_P2:
				relSE.extra["P2"] = kVal;
			break;
			case oop.KWARG_P3:
				relSE.extra["P3"] = kVal;
			break;
			case oop.KWARG_FOLLOWER:
				relSE.extra["FOLLOWER"] = kVal;
			break;
			case oop.KWARG_LEADER:
				relSE.extra["LEADER"] = kVal;
			break;
			case oop.KWARG_UNDERID:
				relSE.UNDERID = kVal;
			break;
			case oop.KWARG_UNDERCOLOR:
				relSE.UNDERCOLOR = kVal;
			break;
			case oop.KWARG_CHAR:
				relSE.extra["CHAR"] = kVal;
			break;
			case oop.KWARG_COLOR:
				colorToSet = kVal;
				interp.lastKindColor = colorToSet;
			break;
			case oop.KWARG_COLORALL:
				colorToSet = kVal;
				interp.lastKindColor = colorToSet;
				useUnderColor = false;
			break;
			case oop.KWARG_DIR:
				relSE.STEPX = interp.getStepXFromDir4(kVal);
				relSE.STEPY = interp.getStepYFromDir4(kVal);
			break;
			case oop.KWARG_ONAME:
				oldSE = interp.getSEFromOName(oVal.toString());
				if (oldSE && eInfo.HasOwnCode)
				{
					relSE.extra["CODEID"] = oldSE.extra["CODEID"];
					relSE.extra["ONAME"] = oVal.toString();
					relSE.IP = eInfo.CustomStart;
				}
			break;
		}

		// Read next keyword argument.
		kByte = interp.getInt();
	}

	if (eInfo.FullColor)
		useUnderColor = false;
	if (!eInfo.DominantColor && (createFlags & interp.CF_GHOSTED) == 0)
		SE.setColor(relSE.X, relSE.Y, colorToSet, useUnderColor);

	// Restore IP and return.
	interp.thisSE.IP = oldIP;
	return relSE;
};

static createClone(x, y, createFlags=0) {
	// Erase status element.
	var oldSE = SE.getStatElemAt(x, y);
	if (oldSE)
	{
		oldSE.FLAGS |= interp.FL_IDLE + interp.FL_DEAD;
		oldSE.eraseSelfSquare(false);
	}

	// If clone does not represent status element, just copy type.
	var eInfo = interp.typeList[interp.cloneType];
	if (eInfo.NoStat)
	{
		// We set type and color from last poll.
		SE.setStatElemAt(x, y, null);
		SE.setType(x, y, interp.cloneType);
		SE.setColor(x, y, interp.cloneColor, false);

		// Display type immediately.
		SE.displaySquare(x, y);
		return null;
	}

	// Clip against max stat element count.
	if (SE.statElem.length - SE.statLessCount >= zzt.globalProps["MAXSTATELEMENTCOUNT"])
	{
		//console.log("limit");
		return null;
	}

	// EMPTY does not transfer BG to clone
	if (SE.getType(x, y) == 0 && (createFlags & interp.CF_GHOSTED) == 0)
		SE.setColor(x, y, interp.cloneColor & 0x8F, false);

	// Create status element of same type as clone
	var relSE;
	if ((createFlags & interp.CF_GHOSTED) == 0)
	{
		relSE = new SE(interp.cloneSE.TYPE, x, y);
		relSE.FLAGS = interp.cloneSE.FLAGS;
		SE.setStatElemAt(x, y, relSE);
	}
	else
	{
		relSE = new SE(interp.cloneSE.TYPE, x, y, -1000, true);
		relSE.FLAGS = interp.cloneSE.FLAGS | interp.FL_GHOST;
	}
	SE.statElem.push(relSE);

	// Update select attributes and color
	relSE.CYCLE = interp.cloneSE.CYCLE;
	relSE.STEPX = interp.cloneSE.STEPX;
	relSE.STEPY = interp.cloneSE.STEPY;
	relSE.myID = ++interp.nextObjPtrNum;
	if ((createFlags & interp.CF_GHOSTED) == 0)
	{
		if (interp.typeList[interp.cloneType].FullColor)
			SE.setColor(x, y, interp.cloneColor, false);
		else
			SE.setColor(x, y, interp.cloneColor & 0x8F);
	}

	// Copy extras
	for (var s in interp.cloneSE.extra) {
		relSE.extra[s] = interp.cloneSE.extra[s];
	}

	// If custom code exists, will need to make a duplicate code block
	// and duplicate zap history.
	if (relSE.extra.hasOwnProperty("CODEID"))
	{
		// Code ID must point to custom code, not built-in code.
		var unCompCodeID = relSE.extra["CODEID"] - interp.numBuiltInCodeBlocksPlus;
		if (unCompCodeID >= 0)
		{
			// Add compiled copy to code blocks.
			var newCodeBlock = interp.codeBlocks[relSE.extra["CODEID"]].concat();
			var newCodeId = interp.codeBlocks.length;
			interp.codeBlocks.push(newCodeBlock);

			// Add uncompiled copy and zap history.
			interp.unCompStart.push(interp.unCompStart[unCompCodeID]);
			interp.unCompCode.push(interp.unCompCode[unCompCodeID]);
			ZZTLoader.cloneZapRecord(relSE.extra["CODEID"], newCodeId);
			relSE.extra["CODEID"] = newCodeId;
		}
	}

	return relSE;
};

static processChange(region) {
	// Get the two kinds
	var kind1 = interp.getKind(true);
	var kwargPos1 = interp.kwargPos;
	var kind2 = interp.getKind();
	var kwargPos2 = interp.kwargPos;

	if (kind1 == zzt.playerType)
		return; // Can't change PLAYER type.

	if (kind1 == -oop.MISC_CLONE)
		kind1 = interp.cloneSE.TYPE;

	// Preserve IP
	var oldIP = interp.thisSE.IP;

	// Establish region of change
	var x0 = 1;
	var y0 = 1;
	var xf = SE.gridWidth;
	var yf = SE.gridHeight;
	if (interp.validCoords(region[0]) && interp.validCoords(region[1]))
	{
		x0 = region[0][0];
		y0 = region[0][1];
		xf = region[1][0];
		yf = region[1][1];
	}

	// Set color filter policy
	var cChangeFilter = 0xF;
	if (zzt.globalProps["LIBERALCOLORCHANGE"])
		cChangeFilter = 0x7;

	// Conduct change
	for (var y = y0; y <= yf; y++) {
		for (var x = x0; x <= xf; x++) {
			// First, check for type match.
			if (!(kind1 == 0 && SE.getType(x, y) == zzt.windTunnelType))
			{
				if (SE.getType(x, y) != kind1 && kind1 != -oop.MISC_ALL)
					continue;
			}

			// Match:  must also examine kwargs.
			interp.thisSE.IP = kwargPos1;
			var match = true;
			var oldColor = SE.getColor(x, y);
			var relSE = SE.getStatElemAt(x, y);

			var kByte = interp.getInt();
			while (kByte != oop.SPEC_KWARGEND && match)
			{
				// The expression is an integer for nearly all kwargs.
				var oVal = interp.getExpr();
				var kVal = utils.int0(oVal.toString());

				if (kByte == oop.KWARG_COLOR)
				{
					// Color check is unique, because status element does
					// not need to exist in order to check it.
					// Specifying a colored EMPTY always fails (weird but needed).
					if ((oldColor & cChangeFilter) != (kVal & cChangeFilter) || kind1 == 0)
						match = false;
				}
				else if (kByte == oop.KWARG_COLORALL)
				{
					// Color check is unique, because status element does
					// not need to exist in order to check it.
					// Specifying a colored EMPTY always fails (weird but needed).
					if (oldColor != kVal || kind1 == 0)
						match = false;
				}
				else if (relSE)
				{
					switch (kByte) {
						case oop.KWARG_TYPE:
							match = Boolean(relSE.TYPE == interp.typeTrans[kVal & 255]);
						break;
						case oop.KWARG_X:
							match = Boolean(relSE.X == kVal);
						break;
						case oop.KWARG_Y:
							match = Boolean(relSE.Y == kVal);
						break;
						case oop.KWARG_STEPX:
							match = Boolean(relSE.STEPX == kVal);
						break;
						case oop.KWARG_STEPY:
							match = Boolean(relSE.STEPY == kVal);
						break;
						case oop.KWARG_CYCLE:
							match = Boolean(relSE.CYCLE == kVal);
						break;
						case oop.KWARG_P1:
							if (!relSE.extra.hasOwnProperty("P1"))
								match = false;
							else
								match = Boolean(relSE.extra["P1"] == kVal);
						break;
						case oop.KWARG_P2:
							if (!relSE.extra.hasOwnProperty("P2"))
								match = false;
							else
								match = Boolean(relSE.extra["P2"] == kVal);
						break;
						case oop.KWARG_P3:
							if (!relSE.extra.hasOwnProperty("P3"))
								match = false;
							else
								match = Boolean(relSE.extra["P3"] == kVal);
						break;
						case oop.KWARG_FOLLOWER:
							if (!relSE.extra.hasOwnProperty("FOLLOWER"))
								match = false;
							else
								match = Boolean(relSE.extra["FOLLOWER"] == kVal);
						break;
						case oop.KWARG_LEADER:
							if (!relSE.extra.hasOwnProperty("LEADER"))
								match = false;
							else
								match = Boolean(relSE.extra["LEADER"] == kVal);
						break;
						case oop.KWARG_UNDERID:
							match = Boolean(relSE.UNDERID == kVal);
						break;
						case oop.KWARG_UNDERCOLOR:
							match = Boolean(relSE.UNDERCOLOR == kVal);
						break;
						case oop.KWARG_CHAR:
							if (!relSE.extra.hasOwnProperty("CHAR"))
								match = false;
							else
								match = Boolean(relSE.extra["CHAR"] == kVal);
						break;
						case oop.KWARG_DIR:
							match = Boolean(interp.getDir4FromSteps(relSE.STEPX, relSE.STEPY) == kVal);
						break;
						case oop.KWARG_ONAME:
							if (!relSE.extra.hasOwnProperty("ONAME"))
								match = false;
							else
								match = Boolean(relSE.extra["ONAME"] == oVal.toString());
						break;
					}
				}

				// Read next keyword argument.
				kByte = interp.getInt();
			}

			if (match)
			{
				// If conditions met, perform the change.
				if (!relSE && interp.typeList[kind1].BlockObject)
					SE.setType(x, y, 0); // Don't make previous tile into "floor."

				interp.kwargPos = kwargPos2;
				relSE = interp.createKind(x, y, kind2,
				interp.CF_RETAINSE | interp.CF_RETAINCOLOR | interp.CF_REMOVEIFBLOCKING);
				if (relSE)
					relSE.displaySelfSquare();
			}
		}
	}

	// Restore IP.
	interp.thisSE.IP = oldIP;
};

static checkType(x, y, k, kp) {
	// First, check for type match.
	if (k == 0 && SE.getType(x, y) == zzt.windTunnelType)
		return true;
	else if (k != SE.getType(x, y) && k != -oop.MISC_ALL)
		return false;

	// Base type matches; must also examine kwargs.
	var oldIP = interp.thisSE.IP;
	interp.thisSE.IP = kp;
	var match = true;
	var color = SE.getColor(x, y);
	var relSE = SE.getStatElemAt(x, y);

	var kByte = interp.getInt();
	while (kByte != oop.SPEC_KWARGEND && match)
	{
		// The expression is an integer for nearly all kwargs.
		var oVal = interp.getExpr();
		var kVal = utils.int0(oVal.toString());
		if (kByte == oop.KWARG_COLOR)
		{
			// Color check is unique, because status element does
			// not need to exist in order to check it.
			if ((color & 0xF) != kVal)
				match = false;
		}
		else if (kByte == oop.KWARG_COLORALL)
		{
			// Color check is unique, because status element does
			// not need to exist in order to check it.
			if (color != kVal)
				match = false;
		}
		else if (relSE)
		{
			switch (kByte) {
				case oop.KWARG_TYPE:
					match = Boolean(relSE.TYPE == interp.typeTrans[kVal & 255]);
				break;
				case oop.KWARG_X:
					match = Boolean(relSE.X == kVal);
				break;
				case oop.KWARG_Y:
					match = Boolean(relSE.Y == kVal);
				break;
				case oop.KWARG_STEPX:
					match = Boolean(relSE.STEPX == kVal);
				break;
				case oop.KWARG_STEPY:
					match = Boolean(relSE.STEPY == kVal);
				break;
				case oop.KWARG_CYCLE:
					match = Boolean(relSE.CYCLE == kVal);
				break;
				case oop.KWARG_P1:
					if (!relSE.hasOwnProperty("P1"))
						match = false;
					else
						match = Boolean(relSE.extra["P1"] == kVal);
				break;
				case oop.KWARG_P2:
					if (!relSE.hasOwnProperty("P2"))
						match = false;
					else
						match = Boolean(relSE.extra["P2"] == kVal);
				break;
				case oop.KWARG_P3:
					if (!relSE.hasOwnProperty("P3"))
						match = false;
					else
						match = Boolean(relSE.extra["P3"] == kVal);
				break;
				case oop.KWARG_FOLLOWER:
					if (!relSE.hasOwnProperty("FOLLOWER"))
						match = false;
					else
						match = Boolean(relSE.extra["FOLLOWER"] == kVal);
				break;
				case oop.KWARG_LEADER:
					if (!relSE.hasOwnProperty("LEADER"))
						match = false;
					else
						match = Boolean(relSE.extra["LEADER"] == kVal);
				break;
				case oop.KWARG_UNDERID:
					match = Boolean(relSE.UNDERID == kVal);
				break;
				case oop.KWARG_UNDERCOLOR:
					match = Boolean(relSE.UNDERCOLOR == kVal);
				break;
				case oop.KWARG_CHAR:
					if (!relSE.hasOwnProperty("CHAR"))
						match = false;
					else
						match = Boolean(relSE.extra["CHAR"] == kVal);
				break;
				case oop.KWARG_DIR:
					match = Boolean(interp.getDir4FromSteps(relSE.STEPX, relSE.STEPY) == kVal);
				break;
				case oop.KWARG_ONAME:
					if (!relSE.extra.hasOwnProperty("ONAME"))
						match = false;
					else
						match = Boolean(relSE.extra["ONAME"] == oVal.toString());
				break;
			}
		}

		// Read next keyword argument.
		kByte = interp.getInt();
	}

	// Restore IP and return result.
	interp.thisSE.IP = oldIP;
	return match;
};

static checkTypeWithinRegion(region, k, kp) {
	if (k != -oop.MISC_ALL)
	{
		if (interp.typeList[k].NUMBER == 4 &&
			(zzt.globals["$PLAYERMODE"] == 3 || zzt.globals["$PLAYERMODE"] == 4))
		{
			// Player isn't treated as physically within the board if one of the
			// "title screen" modes is activated.  Technically, the type is supposed
			// to be a MONITOR, but in ZZT Ultra, it is an unresponsive PLAYER.
			return false;
		}
	}

	for (var y = region[0][1]; y <= region[1][1]; y++) {
		for (var x = region[0][0]; x <= region[1][0]; x++) {
			if (interp.checkType(x, y, k, kp))
				return true; // Found
		}
	}

	return false; // Not found
};

static assessPushability(x, y, d, allowSquash=true) {
	if (d == -1)
		return 0; // Push yourself around?

	interp.wouldSquashX = 0;
	interp.wouldSquashY = 0;
	var prevPushSE = true;
	var iters = 1000;
	do {
		// To assess pushability, we examine the square to see if pushing is possible.
		var t = SE.getType(x, y);
		var eInfo = interp.typeList[t];

		// Squashable types will work unequivocally; square is replaced if push
		// operation would be otherwise braced.  It is possible to do a "preliminary"
		// assessment of whether squashing would occur for a push operation by setting
		// allowSquash to false.  However, the -actual- push operation would not fail.
		if (eInfo.Squashable && allowSquash)
		{
			interp.wouldSquashX = x;
			interp.wouldSquashY = y;
		}

		// If the previous type in the push queue was a status element, we can push
		// to a pushable but non-blocking square.
		if (prevPushSE && eInfo.Pushable == 0 && !eInfo.BlockObject)
			return 1;

		// Non-pushable objects won't work (braced).
		if (eInfo.Pushable == 0)
		{
			if (interp.wouldSquashX == 0)
				return 0;
			else
				return 1; // We can push, because we would squash something.
		}

		// Non-blocking types will work unequivocally; simply replace this square.
		if (!eInfo.BlockObject)
			return 1;

		prevPushSE = Boolean(SE.getStatElemAt(x, y) != null);

		if (eInfo.Pushable == 1)
		{
			// If always pushable, test next square.
			x += interp.getStepXFromDir4(d);
			y += interp.getStepYFromDir4(d);
		}
		else if (eInfo.LocPUSHBEHAVIOR != -1)
		{
			// Custom-behavior pushable objects will use the dispatched
			// message PUSHBEHAVIOR, if it exists.
			var oldType = interp.customDrawSE.TYPE;
			var oldPush = utils.int(interp.getGlobalVarValue("$PUSH"));
			var oldPushDestX = utils.int(interp.getGlobalVarValue("$PUSHDESTX"));
			var oldPushDestY = utils.int(interp.getGlobalVarValue("$PUSHDESTY"));
			var oldPushDir = utils.int(interp.getGlobalVarValue("$PUSHDIR"));

			interp.customDrawSE.TYPE = t;
			interp.customDrawSE.X = x;
			interp.customDrawSE.Y = y;

			// Seed the global "out" values.
			zzt.globals["$PUSH"] = 0;    // Default:  FAIL
			zzt.globals["$PUSHDESTX"] = x;
			zzt.globals["$PUSHDESTY"] = y;
			zzt.globals["$PUSHDIR"] = d;
			interp.briefDispatch(eInfo.LocPUSHBEHAVIOR, interp.thisSE, interp.customDrawSE);

			// Process result.
			var doRet = false;
			var r = utils.int(interp.getGlobalVarValue("$PUSH"));
			if (r == 0)
				doRet = true; // Not pushable
			else if (r == 1)
			{
				// Pushable; test next square.
				x += interp.getStepXFromDir4(d);
				y += interp.getStepYFromDir4(d);
			}
			else if (r == 2)
			{
				// Squashable.
				if (allowSquash)
				{
					interp.wouldSquashX = x;
					interp.wouldSquashY = y;
				}

				x += interp.getStepXFromDir4(d);
				y += interp.getStepYFromDir4(d);
			}
			else
			{
				// Special:  check further at a specific location.  This usually
				// happens when pushing an object through a transporter.
				x = zzt.globals["$PUSHDESTX"];
				y = zzt.globals["$PUSHDESTY"];
				d = zzt.globals["$PUSHDIR"];
			}

			interp.customDrawSE.TYPE = oldType;
			zzt.globals["$PUSH"] = oldPush;
			zzt.globals["$PUSHDESTX"] = oldPushDestX;
			zzt.globals["$PUSHDESTY"] = oldPushDestY;
			zzt.globals["$PUSHDIR"] = oldPushDir;

			if (doRet)
			{
				if (interp.wouldSquashX == 0)
					return r;
				else
					return 1; // We can push, because we would squash something.
			}
		}
		else if (interp.wouldSquashX != 0)
		{
			// With squash assumption, treat as implicitly pushable for now.
			x += interp.getStepXFromDir4(d);
			y += interp.getStepYFromDir4(d);
		}
		else
			return 0; // Assume not pushable
	} while (--iters);

	// Assume not pushable
	return 0;
};

static pushItems(x, y, d, allowSquash=true) {
	// This function chains together movement of pushed objects.
	var posStackX = [];
	var posStackY = [];
	var iters = 1000;

	// We already know that a push would succeed, so it is a simple matter to trace
	// the path that we had already assessed successfully.
	do {
		var t = SE.getType(x, y);
		var eInfo = interp.typeList[t];

		if (eInfo.Squashable && allowSquash)
		{
			// Squash this square.
			var relSE = SE.getStatElemAt(x, y);
			if (relSE)
			{
				// Kill status element
				relSE.FLAGS |= interp.FL_IDLE + interp.FL_DEAD;
				relSE.eraseSelfSquare(false);
			}
			else
			{
				// Set type to empty
				SE.setType(x, y, 0);
				SE.setStatElemAt(x, y, null);
			}

			posStackX.push(x);
			posStackY.push(y);
			break; // Done.
		}
		else if (!eInfo.BlockObject)
		{
			// A non-blocking square will be replaced.
			posStackX.push(x);
			posStackY.push(y);
			break; // Done.
		}
		else if (eInfo.Pushable == 1)
		{
			// If always pushable, add to position stack and continue.
			posStackX.push(x);
			posStackY.push(y);
			x += interp.getStepXFromDir4(d);
			y += interp.getStepYFromDir4(d);
		}
		else if (eInfo.LocPUSHBEHAVIOR != -1)
		{
			// Custom-behavior pushable objects will use the dispatched
			// message PUSHBEHAVIOR, if it exists.
			interp.customDrawSE.TYPE = t;
			interp.customDrawSE.X = x;
			interp.customDrawSE.Y = y;

			// Seed the global "out" values.
			zzt.globals["$PUSH"] = 0;    // Default:  FAIL
			zzt.globals["$PUSHDESTX"] = x;
			zzt.globals["$PUSHDESTY"] = y;
			zzt.globals["$PUSHDIR"] = d;
			interp.briefDispatch(eInfo.LocPUSHBEHAVIOR, interp.thisSE, interp.customDrawSE);

			// Process result.
			var r = utils.int(interp.getGlobalVarValue("$PUSH"));
			if (r == 1 || (r == 2 && !allowSquash))
			{
				// Pushable; add to position stack and continue.
				posStackX.push(x);
				posStackY.push(y);
				x += interp.getStepXFromDir4(d);
				y += interp.getStepYFromDir4(d);
			}
			else if (r == 2)
			{
				// Squash this square.
				relSE = SE.getStatElemAt(x, y);
				if (relSE)
				{
					// Kill status element
					relSE.FLAGS |= interp.FL_IDLE + interp.FL_DEAD;
					relSE.eraseSelfSquare(false);
				}
				else
				{
					// Set type to empty
					SE.setType(x, y, 0);
					SE.setStatElemAt(x, y, null);
				}

				posStackX.push(x);
				posStackY.push(y);
				break; // Done.
			}
			else
			{
				// Special:  update location (no position stack update).
				x = zzt.globals["$PUSHDESTX"];
				y = zzt.globals["$PUSHDESTY"];
				d = zzt.globals["$PUSHDIR"];
			}
		}
	} while (--iters);

	if (iters <= 0)
		return 0; // Error (too many iterations; deadlocked?)

	// Now we move everything according to the position stack.
	// We must move everything starting from the last position and
	// ending with the first position.  Also note that the very
	// last position is not actually moved; it only serves as a final
	// destination.  This means that a stack with a size of 1 will
	// not result in any pushing (although it might have caused squashing).
	for (var i = posStackX.length - 2; i >= 0; i--)
	{
		x = posStackX[i];
		y = posStackY[i];
		var newX = posStackX[i+1];
		var newY = posStackY[i+1];

		// Move previous square forward.
		relSE = SE.getStatElemAt(x, y);
		if (relSE)
		{
			// Move status element
			relSE.moveSelfSquare(newX, newY);
		}
		else
		{
			// Move ordinary grid square
			SE.setType(newX, newY, SE.getType(x, y));
			SE.setColor(newX, newY, SE.getColor(x, y), false);
			SE.setStatElemAt(newX, newY, null);
			SE.displaySquare(newX, newY);
			SE.setType(x, y, 0);
			SE.setStatElemAt(x, y, null);
		}
	}

	// Update first square in the event that the pushing object doesn't
	// actually move to this square for some reason.
	if (posStackX.length >= 1)
		SE.displaySquare(posStackX[0], posStackY[0]);

	return 1; // Assumed success
};

static adjustLit(coords, flag) {
	// Update flag
	SE.setLit(coords[0], coords[1], flag);

	// Expand update region for lighting if needed
	if (interp.litRegion[0][0] > coords[0])
		interp.litRegion[0][0] = coords[0];
	if (interp.litRegion[0][1] > coords[1])
		interp.litRegion[0][1] = coords[1];
	if (interp.litRegion[1][0] < coords[0])
		interp.litRegion[1][0] = coords[0];
	if (interp.litRegion[1][1] < coords[1])
		interp.litRegion[1][1] = coords[1];
};

static updateLit() {
	// Redraw update region
	var x0 = interp.litRegion[0][0];
	var y0 = interp.litRegion[0][1];
	var xf = interp.litRegion[1][0];
	var yf = interp.litRegion[1][1];

	for (var y = y0; y <= yf; y++) {
		for (var x = x0; x <= xf; x++) {
			SE.displaySquare(x, y);
		}
	}

	// Reset update region to empty
	interp.litRegion[0][0] = 1000000;
	interp.litRegion[0][1] = 1000000;
	interp.litRegion[1][0] = -1;
	interp.litRegion[1][1] = -1;
};

static smartUpdateViewport() {
	var copyX1 = 0;
	var copyY1 = 0;
	var copyX2 = SE.vpWidth - 1;
	var copyY2 = SE.vpHeight - 1;

	// When updating the viewport, check if there is overlap from last camera location.
	// Only economizes scrolling if a single axis was changed.
	// If multiple axes changed, we will need to update the entire viewport.
	if (SE.uCameraX == SE.CameraX && SE.uCameraY == SE.CameraY)
	{
		// No update necessary--camera unchanged.
		copyX2 = copyX1 - 1;
		copyY2 = copyY1 - 1;
	}
	else if ((utils.iabs(SE.uCameraX - SE.CameraX) <= 2 && SE.uCameraY == SE.CameraY) ||
		(utils.iabs(SE.uCameraY - SE.CameraY) <= 2 && SE.uCameraX == SE.CameraX))
	{
		// Economize by shifting the contents of the viewport.
		var xInc = SE.uCameraX - SE.CameraX;
		var yInc = SE.uCameraY - SE.CameraY;
		if (xInc < 0)
			copyX1 -= xInc;
		else if (xInc > 0)
			copyX2 -= xInc;
		if (yInc < 0)
			copyY1 -= yInc;
		else if (yInc > 0)
			copyY2 -= yInc;

		// Copy pre-existing content.
		SE.mg.moveBlock(copyX1+SE.vpX0-1, copyY1+SE.vpY0-1, copyX2+SE.vpX0-1, copyY2+SE.vpY0-1,
			xInc, yInc);

		// The update region is now limited to only the area vacated by the move.
		if (xInc < 0)
			copyX1 = copyX2 + xInc + 1;
		else if (xInc > 0)
			copyX2 = copyX1 + xInc - 1;
		if (yInc < 0)
			copyY1 = copyY2 + yInc + 1;
		else if (yInc > 0)
			copyY2 = copyY1 + yInc - 1;
	}

	// Update remaining (or only) portion.
	for (var y = copyY1; y <= copyY2; y++)
	{
		for (var x = copyX1; x <= copyX2; x++)
		{
			SE.displaySquare(SE.CameraX + x, SE.CameraY + y);
		}
	}

	// Viewport is now completely up-to-date.
	SE.uCameraX = SE.CameraX;
	SE.uCameraY = SE.CameraY;
};

static cameraAdjust(coords) {
	var cx = utils.int(coords[0]);
	var cy = utils.int(coords[1]);
	if (zzt.globalProps["LEGACYCAMERA"])
	{
		// Legacy edge bumping, as with Super ZZT
		if (cx - SE.CameraX < 9)
			SE.CameraX = cx - 9;
		if (cy - SE.CameraY < 8)
			SE.CameraY = cy - 8;
		if (SE.CameraX + SE.vpWidth - cx < 11)
			SE.CameraX = 11 + cx - SE.vpWidth;
		if (SE.CameraY + SE.vpHeight - cy < 7)
			SE.CameraY = 7 + cy - SE.vpHeight;

		SE.CameraX = utils.clipintval(SE.CameraX, 1, SE.gridWidth - SE.vpWidth + 1);
		SE.CameraY = utils.clipintval(SE.CameraY, 1, SE.gridHeight - SE.vpHeight + 1);
	}
	else
	{
		// Exact center alignment
		cx = cx - utils.int(SE.vpWidth >> 1);
		cy = cy - utils.int(SE.vpHeight >> 1);
		cx = utils.clipintval(cx, 1, SE.gridWidth - SE.vpWidth + 1);
		cy = utils.clipintval(cy, 1, SE.gridHeight - SE.vpHeight + 1);
		SE.CameraX = cx;
		SE.CameraY = cy;
	}

	zzt.boardProps["CAMERAX"] = SE.CameraX;
	zzt.boardProps["CAMERAY"] = SE.CameraY;
};

static cueForEach(varName, vType, region) {
	// Cue a "FOR" loop that will iterate through each status element of a region
	interp.forType = 0;
	interp.forVarName1 = varName;
	interp.forVarType1 = vType;

	if (region == "" || region == "ALL")
		interp.forRegion = interp.allRegion;
	else
		interp.forRegion = interp.getRegion(region);

	interp.forCursorX = interp.forRegion[0][0];
	interp.forCursorY = interp.forRegion[0][1];
	interp.forRetLoc = interp.thisSE.IP;

	return interp.iterateFor();
};

static cueForMask(varName1, vType1, varName2, vType2, coords, mask) {
	// Cue a "FOR" loop that will iterate through each coordinate in a mask
	interp.forType = 1;
	interp.forVarName1 = varName1;
	interp.forVarType1 = vType1;
	interp.forVarName2 = varName2;
	interp.forVarType2 = vType2;
	interp.forMask = interp.getMask(mask);
	interp.forMaskXSize = interp.forMask[0].length;
	interp.forMaskYSize = interp.forMask.length;
	interp.forCornerX = coords[0] - (interp.forMaskXSize >> 1); // Top left corner
	interp.forCornerY = coords[1] - (interp.forMaskYSize >> 1); // Top left corner
	interp.forCursorX = 0;
	interp.forCursorY = 0;
	interp.forRetLoc = interp.thisSE.IP;

	return interp.iterateFor();
};

static cueForRegion(varName1, vType1, varName2, vType2, region) {
	// Cue a "FOR" loop that will iterate through each coordinate in a region
	interp.forType = 2;
	interp.forVarName1 = varName1;
	interp.forVarType1 = vType1;
	interp.forVarName2 = varName2;
	interp.forVarType2 = vType2;

	if (region == "" || region == "ALL")
		interp.forRegion = interp.allRegion;
	else
		interp.forRegion = interp.getRegion(region);

	interp.forCursorX = interp.forRegion[0][0];
	interp.forCursorY = interp.forRegion[0][1];
	interp.forRetLoc = interp.thisSE.IP;

	return interp.iterateFor();
};

static iterateFor() {
	var relSE;

	if (interp.forType == 0)
	{
		// Step through region, finding status elements
		while (interp.forType != -1) {
			// Ensure cursor is within region
			if (interp.forCursorX > interp.forRegion[1][0])
			{
				interp.forCursorX = interp.forRegion[0][0];
				interp.forCursorY++;
			}

			// If no longer in region, done with FOREACH.
			if (interp.forCursorY > interp.forRegion[1][1])
			{
				interp.forType = -1;
				break;
			}

			relSE = SE.getStatElemAt(interp.forCursorX++, interp.forCursorY);
			if (relSE)
			{
				// Found a status element; set iterator variable to ID.
				interp.assignID(relSE);
				interp.setVariableFromRef(interp.forVarType1, interp.forVarName1, relSE.myID);
				break;
			}
		}
	}
	else if (interp.forType == 1)
	{
		// Step through coordinates, finding status elements
		while (interp.forType != -1) {
			// Ensure cursor is within mask area
			if (interp.forCursorX >= interp.forMaskXSize)
			{
				interp.forCursorX = 0;
				interp.forCursorY++;
			}

			// If no longer in mask area, done with FORMASK.
			if (interp.forCursorY >= interp.forMaskYSize)
			{
				interp.forType = -1;
				break;
			}

			if (interp.forMask[interp.forCursorY][interp.forCursorX++] != 0)
			{
				// Found valid mask location.  Find actual coordinates.
				interp.coords2[0] = interp.forCornerX + interp.forCursorX - 1;
				interp.coords2[1] = interp.forCornerY + interp.forCursorY;

				// The actual coordinates are only reported if they are valid.
				if (interp.validCoords(interp.coords2))
				{
					interp.setVariableFromRef(interp.forVarType1, interp.forVarName1, interp.coords2[0]);
					interp.setVariableFromRef(interp.forVarType2, interp.forVarName2, interp.coords2[1]);
					break;
				}
			}
		}
	}
	else if (interp.forType == 2)
	{
		// Step through region, finding coordinates

		// Ensure cursor is within region
		if (interp.forCursorX > interp.forRegion[1][0])
		{
			interp.forCursorX = interp.forRegion[0][0];
			interp.forCursorY++;
		}

		// If no longer in region, done with FORREGION.
		if (interp.forCursorY > interp.forRegion[1][1])
			interp.forType = -1;
		else
		{
			interp.setVariableFromRef(interp.forVarType1, interp.forVarName1, interp.forCursorX);
			interp.setVariableFromRef(interp.forVarType2, interp.forVarName2, interp.forCursorY);
			interp.forCursorX++;
		}
	}

	return interp.forType;
};

static calcGroupRimInfo(srcX, srcY, destX, destY, groupArray) {

	interp.doGroupMove = true;
	interp.checkAllGroup = false;
	interp.groupRimStepX = destX - srcX;
	interp.groupRimStepY = destY - srcY;
	interp.gArray = groupArray;

	if (utils.iabs(interp.groupRimStepX) >= 2 || utils.iabs(interp.groupRimStepY) >= 2)
		interp.checkAllGroup = true;
	else if (interp.groupRimStepX != 0 && interp.groupRimStepY != 0)
		interp.checkAllGroup = true;
	else if (interp.groupRimStepX == 0 && interp.groupRimStepY == 0)
		interp.doGroupMove = false;
	else if (interp.groupRimStepX == 0)
	{
		// Calculate vertical-movement rim.
		interp.groupRimX = [];
		interp.groupRimY = [];
		for (var i = 0; i < interp.gArray.length; i++)
		{
			var relSE = SE.getStatElem(interp.gArray[i]);
			if (relSE)
			{
				var idx = interp.groupRimX.indexOf(relSE.X);
				if (relSE.FLAGS & interp.FL_GHOST)
				{
					// Ghosted object does not count as rim
				}
				else if (idx == -1)
				{
					idx = interp.groupRimX.length;
					interp.groupRimX.push(relSE.X);
					interp.groupRimY.push(relSE.Y);
				}
				else
				{
					if (interp.groupRimStepY > 0)
					{
						if (interp.groupRimY[idx] < relSE.Y)
							interp.groupRimY[idx] = relSE.Y;
					}
					else
					{
						if (interp.groupRimY[idx] > relSE.Y)
							interp.groupRimY[idx] = relSE.Y;
					}
				}
			}
		}
	}
	else
	{
		// Calculate horizontal-movement rim.
		interp.groupRimX = [];
		interp.groupRimY = [];
		for (i = 0; i < interp.gArray.length; i++)
		{
			relSE = SE.getStatElem(interp.gArray[i]);
			if (relSE)
			{
				idx = interp.groupRimY.indexOf(relSE.Y);
				if (relSE.FLAGS & interp.FL_GHOST)
				{
					// Ghosted object does not count as rim
				}
				else if (idx == -1)
				{
					idx = interp.groupRimY.length;
					interp.groupRimX.push(relSE.X);
					interp.groupRimY.push(relSE.Y);
				}
				else
				{
					if (interp.groupRimStepX > 0)
					{
						if (interp.groupRimX[idx] < relSE.X)
							interp.groupRimX[idx] = relSE.X;
					}
					else
					{
						if (interp.groupRimX[idx] > relSE.X)
							interp.groupRimX[idx] = relSE.X;
					}
				}
			}
		}
	}
};

static tryRimPush(action) {
	if (!interp.doGroupMove || interp.checkAllGroup)
		return -1; // No pushing allowed

	// Get direction
	var d = interp.getDir4FromSteps(utils.isgn(interp.groupRimStepX), utils.isgn(interp.groupRimStepY));
	var actionProfile = 0;

	// Assess push result and allowable push profile.  Allowable actions include...
	// 0:  Movement only; no pushing allowed.
	// 1:  Movement with non-squashing pushing allowed.
	// 2:  Movement with squashing pushing allowed.
	for (var j = 0; j < interp.groupRimX.length; j++)
	{
		var tx = interp.groupRimX[j] + interp.groupRimStepX;
		var ty = interp.groupRimY[j] + interp.groupRimStepY;

		if (!interp.typeList[SE.getType(tx, ty)].BlockObject)
		{
			// Easy move; non-blocking square.
			continue;
		}
		else if (SE.getType(tx, ty) == zzt.transporterType)
		{
			// By default, TRANSPORTER counts as non-movable.
			return -1;
		}
		else if (action < 1)
		{
			// Action does not call for push possibility.  Non-movable.
			return -1;
		}
		else if (interp.assessPushability(tx, ty, d, false))
		{
			// Can move without squashing.
			actionProfile = 1;
		}
		else if (action < 2)
		{
			// Action does not call for squash possibility.  Non-movable.
			return -1;
		}
		else if (interp.assessPushability(tx, ty, d, true))
		{
			// Can move without squashing.
			actionProfile = 2;
		}
		else
		{
			// We can't move.
			return -1;
		}
	}

	// If move is "clean" (no pushing), just return.
	if (actionProfile == 0)
		return 0;

	// Perform pushing and/or squashing as needed.
	for (j = 0; j < interp.groupRimX.length; j++)
	{
		tx = interp.groupRimX[j] + interp.groupRimStepX;
		ty = interp.groupRimY[j] + interp.groupRimStepY;

		if (!interp.typeList[SE.getType(tx, ty)].BlockObject)
			continue;
		else if (interp.assessPushability(tx, ty, d, false))
			interp.pushItems(tx, ty, d, false);
		else if (interp.assessPushability(tx, ty, d, true))
			interp.pushItems(tx, ty, d, true);
	}

	// Move involved pushing and/or squashing.
	return actionProfile;
};

static tryEntireMove(action) {
	// Get direction
	var d = interp.getDir4FromSteps(utils.isgn(interp.groupRimStepX), utils.isgn(interp.groupRimStepY));

	// Re-sort the group array by leaders-first-in-move-direction.
	var ptArrayX = [];
	var ptArrayY = [];
	for (var i = 0; i < interp.gArray.length; i++) {
		var relSE = SE.getStatElem(interp.gArray[i]);
		if (relSE)
		{
			ptArrayX.push(relSE.X);
			ptArrayY.push(relSE.Y);
		}
		else
		{
			ptArrayX.push(0);
			ptArrayY.push(0);
		}
	}

	var sortOrderX = interp.coordSort(ptArrayX);
	var sortOrderY = interp.coordSort(ptArrayY);

	// Move or test the individual units of the group.  We need the objects
	// to be sorted in such a way that we iterate with a "leaders first"
	// algorithm.  This way, the objects in front will be moved or tested
	// first.  We don't want the objects in the rear to be "tripped up" by
	// the objects in the front if the ones in front haven't moved yet.
	switch (d) {
		case 0: // Right movement; iterate by descending X.
			for (i = sortOrderX.length - 1; i >= 0; i--) {
				relSE = SE.getStatElem(interp.gArray[sortOrderX[i]]);
				if (relSE)
				{
					if (!interp.unitMoveAction(relSE, action))
						return false;
				}
			}
		break;
		case 2: // Left movement; iterate by ascending X.
			for (i = 0; i < sortOrderX.length; i++) {
				relSE = SE.getStatElem(interp.gArray[sortOrderX[i]]);
				if (relSE)
				{
					if (!interp.unitMoveAction(relSE, action))
						return false;
				}
			}
		break;
		case 1: // Down movement; iterate by descending Y.
			for (i = sortOrderY.length - 1; i >= 0; i--) {
				relSE = SE.getStatElem(interp.gArray[sortOrderY[i]]);
				if (relSE)
				{
					if (!interp.unitMoveAction(relSE, action))
						return false;
				}
			}
		break;
		case 3: // Up movement; iterate by ascending Y.
			for (i = 0; i < sortOrderY.length; i++) {
				relSE = SE.getStatElem(interp.gArray[sortOrderY[i]]);
				if (relSE)
				{
					if (!interp.unitMoveAction(relSE, action))
						return false;
				}
			}
		break;
	}

	// The movement or test was successful.
	return true;
};

static unitMoveAction(se, action) {
	// Allowable actions include...
	// 0:  Movement is definitely taken, crushing anything in the path.
	// 1:  Movement is tested, but not taken.  If something is in the path,
	//     the movement attempt fails.
	var tx = se.X + interp.groupRimStepX;
	var ty = se.Y + interp.groupRimStepY;

	if (se.FLAGS & interp.FL_GHOST)
	{
		// Ghost movement or test always succeeds.
		if (action == 0)
		{
			// MOVE
			se.X = tx;
			se.Y = ty;
		}

		return true; // OK
	}
	else
	{
		var relSE = SE.getStatElemAt(tx, ty);
		if (relSE)
		{
			// Blocked.
			if (action == 0)
				interp.killSE(tx, ty); // KILL
			else
			{
				// We don't count the destination as blocked if the object
				// belongs to the same group.
				for (var i = 0; i < interp.gArray.length; i++) {
					if (relSE.myID == interp.gArray[i])
						return true; // OK
				}

				return false; // FAIL
			}
		}
		else if (interp.typeList[SE.getType(tx, ty)].BlockObject && action == 1)
		{
			return false; // FAIL
		}

		if (action == 0)
			se.moveSelfSquare(tx, ty); // MOVE

		return true; // OK
	}
};

// Coordinate sort function
static coordSort(coordList) {
	// Get sortable list
	var sList = [];
	for (var i = 0; i < coordList.length; i++) {
		sList.push([i, coordList[i]]);
	}

	// Sort by coordinate
	interp.sortType = 2;
	interp.sortKey = 1;
	interp.sortOrder = 1;
	sList.sort(interp.hsSortFunc);

	// Retrieve numerical index array representing sort order
	var iList = []
	for (i = 0; i < sList.length; i++) {
		iList.push(sList[i][0]);
	}

	return iList;
}

static markupPlayString(str) {
	if (zzt.globalProps["PLAYREVERB"])
		str = "K40:0.3:" + str;
	else
		str = "K40:0:" + str;

	if (zzt.globalProps["PLAYRETENTION"])
		str = "Z01@" + str;
	else
		str = "Z00P99@" + str;

	return str;
};

static playSyncCallback() {
	// Non-active SE can't be synched.
	if (interp.playSyncIdleSE.FLAGS & (interp.FL_IDLE | interp.FL_PENDINGDEAD | interp.FL_DEAD))
		return false;

	// If there is an idle sync location identified, skip past idle
	// move commands and locate another #PLAY command.
	var pos = interp.playSyncIdleSE.IP;
	var destCycle = interp.playSyncIdleSE.CYCLE;
	var i = 0;
	var loopLimit = 256;
	var str;

	while (pos < interp.playSyncIdleCode.length && loopLimit > 0) {

		var cByte = interp.playSyncIdleCode[pos++];
		switch (cByte) {
			case oop.CMD_NOP:
				// Nothing to do
			break;
			case oop.CMD_NAME:
				// Skip name
				pos++;
			break;
			case oop.CMD_LABEL:
			case oop.CMD_COMMENT:
				// Skip comment or label
				pos += 2;
			break;
			case oop.CMD_SEND:
				// Jump to label location
				i = interp.playSyncIdleCode[pos++];
				if (i < 0)
					pos = -i;
				else
				{
					i = interp.findLabel(interp.playSyncIdleCode, oop.pStrings[i]);
					if (i != -1)
						pos = i;
				}
			break;
			case oop.CMD_CYCLE:
				// Capture new cycle, but don't set unless skipped code is definite
				if (interp.playSyncIdleCode[pos] == oop.SPEC_NUMCONST)
				{
					destCycle = interp.playSyncIdleCode[pos + 1];
					pos += 2;
				}
				else
					return false; // Nonconstant cycle; don't try to sync
			break;
			case oop.CMD_ZAP:
				// The presence of #ZAP allows us to continue, but we can't
				// reasonably expect to undo this step.  Commit to this point.
				str = oop.pStrings[interp.playSyncIdleCode[pos++]];
				interp.zapTarget(interp.playSyncIdleSE, str);
				interp.playSyncIdleSE.CYCLE = destCycle;
				interp.playSyncIdleSE.IP = pos;
			break;
			case oop.CMD_RESTORE:
				// The presence of #RESTORE allows us to continue, but we can't
				// reasonably expect to undo this step.  Commit to this point.
				str = oop.pStrings[interp.playSyncIdleCode[pos++]];
				interp.restoreTarget(interp.playSyncIdleSE, str);
				interp.playSyncIdleSE.CYCLE = destCycle;
				interp.playSyncIdleSE.IP = pos;
			break;
			case oop.CMD_GO:
				// Movement.
				if (interp.playSyncIdleCode[pos] == oop.DIR_I)
				{
					// Found idle movement; skip forward.
					pos++;
				}
				else
				{
					// Not an idle movement; no sync will occur.
					return false;
				}
			break;
			case oop.CMD_PLAY:
				// Another #PLAY command.  Bump the IP up to this new location;
				// add to the queue immediately.
				str = oop.pStrings[interp.playSyncIdleCode[pos++]];
				str = interp.markupPlayString(str);

				Sounds.distributePlayNotes(str);
				interp.playSyncIdleSE.CYCLE = destCycle;
				interp.playSyncIdleSE.IP = pos;
			return true;
			default:
				// Not idle movement or #PLAY command; no sync will occur.
			return false;
		}

		loopLimit--;
	}

	// If we got here, we're at the end of the code.  No sync.
	return false;
};

static setMedal() {
};

static clearMedal() {
};

static resetAllMedals() {
};

static postHighScore(hsLine, filename, sortKey, sortOrder) {
	if (zzt.DISABLE_HISCORE || zzt.globalProps["HIGHSCOREACTIVE"] == 0)
	{
		interp.briefDispatch(interp.findLabel(interp.codeBlocks[0], "$ONFAILPOSTHS"), interp.thisSE, interp.blankSE);
		return;
	}

	// Clean line of offending characters.
	hsLine = (hsLine.split(";").join(" "));
	hsLine = (hsLine.split("&").join(" "));

	// Establish action code and timestamp.
	var hsCode = 1;
	var srcTime = new Date();
	var startTime = utils.int(srcTime.time / 1000.0);

	// Create full line in script.
	var fullLine = hsCode.toString() + "," + startTime.toString() + "," +
		filename + "," + sortKey + "," + sortOrder + "," + hsLine;

	// Calculate checksum on line.
	var checkSum = 0;
	for (var i = 0; i < fullLine.length; i++)
		checkSum += fullLine.charCodeAt(i) & 255;
	checkSum ^= 0x5555;

	// Post line and checksum.
	fullLine += "," + checkSum.toString();
	if (zzt.highScoreServer)
	{
		parse.loadRemoteFile("eval_hs.php", zzt.MODE_POSTHIGHSCORE, fullLine);
		zzt.showLoadingAnim = false;
	}
	else
	{
		interp.evalHsLocal(fullLine);
		var pos = interp.findLabel(
		interp.codeBlocks[0], zzt.highScoresLoaded ? "$ONPOSTHS" : "$ONFAILPOSTHS")
		interp.briefDispatch(pos, interp.thisSE, interp.blankSE);
	}
};

static getHighScores(filename, sortKey, sortOrder) {
	if (zzt.DISABLE_HISCORE || zzt.globalProps["HIGHSCOREACTIVE"] == 0)
	{
		interp.briefDispatch(interp.findLabel(interp.codeBlocks[0], "$ONFAILGETHS"), interp.thisSE, interp.blankSE);
		return;
	}

	// Establish action code and timestamp.
	var hsCode = 2;
	var srcTime = new Date();
	var startTime = utils.int(srcTime.time / 1000.0);

	// Send request line to script.
	var fullLine = hsCode.toString() + "," + startTime.toString() + "," +
		filename + "," + sortKey + "," + sortOrder + ",0,0,0";

	if (zzt.highScoreServer)
		parse.loadRemoteFile("eval_hs.php", zzt.MODE_GETHIGHSCORES, fullLine);
	else
	{
		interp.evalHsLocal(fullLine);
		var pos = interp.findLabel(
			interp.codeBlocks[0], zzt.highScoresLoaded ? "$ONGETHS" : "$ONFAILGETHS");
		interp.briefDispatch(pos, interp.thisSE, interp.blankSE);
	}
};

static getHighScoreField(linePos, indexPos) {
	if (zzt.DISABLE_HISCORE || zzt.globalProps["HIGHSCOREACTIVE"] == 0)
		return -1;
	if (!zzt.highScoresLoaded)
		return -1;

	if (linePos < 0 || linePos >= zzt.highScores.length)
		return -1;
	if (indexPos < 0 || indexPos >= zzt.highScores[linePos].length)
		return -1;

	return zzt.highScores[linePos][indexPos];
};

static hsListSorter(lines, sortKey, sortOrder) {
	// Assume numeric
	interp.sortType = 1;
	interp.sortKey = sortKey;
	interp.sortOrder = sortOrder;

	// Get sort keys for existing list
	var sLines = [];
	for (var i = 0; i < lines.length; i++) {
		var l = lines[i];
		if (l.length <= 3)
			continue;

		// Get comma-separated line
		var fields = l.split(",");
		if (interp.highScoreUID < utils.int(fields[0]))
			interp.highScoreUID = utils.int(fields[0]) + 1;

		// Assume string; this is not a number
		var val = fields[sortKey];
		if (utils.int0(val) == 0 && val != "0")
			interp.sortType = 0;

		// Add to sort list
		sLines.push(fields);
	}

	// Rearrange lines in proper sort order
	sLines.sort(interp.hsSortFunc);

	for (i = 0; i < sLines.length; i++) {
		sLines[i] = sLines[i].join(",");
	}

	return sLines;
};

// Compare function used to sort high scores
static hsSortFunc(a, b) {
	var av = a[interp.sortKey];
	var bv = b[interp.sortKey];
	var diff;

	if (interp.sortType == 1)
		diff = parseInt(av) - parseInt(bv);
	else if (interp.sortType == 2)
		diff = av - bv;
	else
		diff = (av < bv) ? -1 : 1;

	if (interp.sortOrder < 0)
		diff = -diff;

	return diff;
}

static evalHsLocal(specStr) {
	// Maximum number of lines storable per file
	var hsMaxLinesPerFile = 100;
	var hsDefaultSortKey = 0;
	var hsDefaultSortOrder = -1;

	// UID used for next post
	interp.highScoreUID = 1;

	// Main script processing
	var specFields = specStr.split(",");
	if (specFields.length <= 6)
		return false;

	// Get request fundamentals
	var actionCode = utils.int(specFields[0]);
	var timeStamp = utils.int(specFields[1]);
	var filename = specFields[2];
	var sortKey = utils.int(specFields[3]);
	var sortOrder = utils.int(specFields[4]);
	if (sortKey == 0)
		sortKey = hsDefaultSortKey;
	if (sortOrder == 0)
		sortOrder = hsDefaultSortOrder;

	// Find converted name (no extension and case-insensitive)
	var convertedName = filename.toUpperCase();
	var periodPos = filename.indexOf(".");
	if (periodPos != -1)
		convertedName = convertedName.substr(0, periodPos);

	// Establish actual storage location; fetch file
	var actualFile = convertedName;

	// TBD:  Adobe AIR file load?
	var allLines = zzt.loadSharedObj("HIGHSCORE", actualFile);
	if (allLines == 0)
		allLines = "";

	var lines = allLines.split("\n");

	// Sort the list
	if (lines.length > 0 && sortOrder != 0 && sortKey >= 0)
		lines = interp.hsListSorter(lines, sortKey, sortOrder);

	// Establish action-specific information
	if (actionCode == 1)
	{
		// Post-to-scores action

		// Synth posted line.  This excludes the action code, filename, and checksum,
		// but includes a primary key, the timestamp, and all other fields.
		var postedLine = interp.highScoreUID.toString() + "," + timeStamp;
		for (var i = 5; i < specFields.length - 1; i += 1) {
			postedLine += "," + specFields[i];
		}

		// Add posted line

		// If maximum number of lines exceeded, remove the last sorted line
		if (lines.length > hsMaxLinesPerFile - 1)
		{
			// We remove the last line because we assume anything at the tail of the sort
			// order is least significant.
			lines[lines.length - 1] = postedLine;
		}
		else
		{
			// Just add the line to the end.
			lines.push(postedLine);
		}

		// Re-sort the list if needed
		if (sortOrder != 0)
			lines = interp.hsListSorter(lines, sortKey, sortOrder);

		// Write list back to file
		allLines = "";
		for (i = 0; i < lines.length; i++)
			allLines += lines[i] + "\n";

		zzt.saveSharedObj("HIGHSCORE", actualFile, allLines);
	}
	else if (actionCode == 2)
	{
		// Fetch-score action
	}
	else
	{
		return false;
	}

	// Register lines
	zzt.highScores = lines;
	for (i = 0; i < lines.length; i++) {
		var l = lines[i].split(",");
		if (l.length >= 3)
			lines[i] = l;
		else
		{
			delete lines[i];
			i--;
		}
	}

	// Flag high score presence
	if (lines.length > 0)
	{
		zzt.highScores = lines;
		zzt.highScoresLoaded = true;
	}
	else
		zzt.highScoresLoaded = false;

	return zzt.highScoresLoaded;
};

}

interp.initClass();
