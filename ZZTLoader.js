// ZZTLoader.js:  ZZT/SZT file loading functions.
"use strict";

class ZZTLoader {

static initClass() {
	// World properties
	ZZTLoader.file = null;
	ZZTLoader.worldType = 0;
	ZZTLoader.baseSizeX = 0;
	ZZTLoader.baseSizeY = 0;
	ZZTLoader.baseOffset = 0;
	ZZTLoader.numBoards = 0;
	ZZTLoader.playerAmmo = 0;
	ZZTLoader.playerGems = 0;
	ZZTLoader.playerKeys = null;
	ZZTLoader.playerHealth = 0;
	ZZTLoader.playerBoard = 0;
	ZZTLoader.playerTorches = 0;
	ZZTLoader.torchCycles = 0;
	ZZTLoader.energizerCycles = 0;
	ZZTLoader.playerScore = 0;
	ZZTLoader.worldName = null;
	ZZTLoader.flagNames = null;
	ZZTLoader.timePassed = 0;
	ZZTLoader.locked = 0;
	ZZTLoader.playerData = 0;
	ZZTLoader.playerStones = 0;

	// Board storage
	ZZTLoader.boardData = null;
	ZZTLoader.board = null;
	ZZTLoader.saveStates = [];
	ZZTLoader.currentBoardSaveIndex = 0;
	ZZTLoader.extraGuis = {};
	ZZTLoader.extraMasks = {};
	ZZTLoader.extraSoundFX = {};
	ZZTLoader.customONAME = {};
	ZZTLoader.extraLumps = [];
	ZZTLoader.extraLumpBinary = [];

	// PWAD containers
	ZZTLoader.pwads = {};
	ZZTLoader.pwadTypeMap = null;
	ZZTLoader.pwadDicts = {};
	ZZTLoader.pwadDelDicts = {};
	ZZTLoader.pwadCustCode = [];
	ZZTLoader.pwadBoards = [];
	ZZTLoader.pwadExtraLumps = [];
	ZZTLoader.pwadExtraLumpBinary = [];
	ZZTLoader.pwadBQUESTHACK = 0;

	ZZTLoader.sStateDesc = [ "Quick", "Entry", "Zap", "Auto" ];
};

static establishZZTFile(b) {
	// Reset types back to defaults
	zzt.resetTypes();
	zzt.establishExtraTypes({});
	ZZTLoader.extraGuis = {};
	ZZTLoader.extraLumps = [];
	ZZTLoader.extraLumpBinary = [];

	// Ensure type unification between ZZT and SZT.
	interp.typeTrans[69] = interp.typeTrans[18]; // Bullets -> ZZT
	interp.typeTrans[72] = interp.typeTrans[15]; // Stars -> ZZT
	interp.typeTrans[70] = interp.typeTrans[33]; // Horiz blink wall beam -> ZZT
	interp.typeTrans[71] = interp.typeTrans[43]; // Vert blink wall beam -> ZZT

	// Strip out non-built-in code blocks
	interp.zapRecord = [];
	interp.unCompCode = [];
	interp.unCompStart = [];
	interp.numBuiltInCodeBlocksPlus = interp.numBuiltInCodeBlocks;
	if (interp.codeBlocks.length > interp.numBuiltInCodeBlocks)
		interp.codeBlocks.length = interp.numBuiltInCodeBlocks;

	// If Banana Quest hack is implemented, code compilation is affected.
	zzt.globalProps["BQUESTHACK"] = ZZTLoader.pwadBQUESTHACK;

	// Interpret file contents.
	ZZTLoader.file = b;
	ZZTLoader.file.position = 0;
	//ZZTLoader.file.endian = Endian.LITTLE_ENDIAN;

	// First few fields are common to both ZZT and SZT.
	ZZTLoader.worldType = ZZTLoader.file.readShort();
	zzt.loadedOOPType = ZZTLoader.worldType;
	ZZTLoader.numBoards = ZZTLoader.file.readShort() + 1;
	ZZTLoader.playerAmmo = ZZTLoader.file.readShort();
	ZZTLoader.playerGems = ZZTLoader.file.readShort();
	ZZTLoader.playerKeys = new ByteArray();
	ZZTLoader.file.readBytes(ZZTLoader.playerKeys, 0, 7);
	ZZTLoader.playerHealth = ZZTLoader.file.readShort();
	ZZTLoader.playerBoard = ZZTLoader.file.readShort();

	// Next few fields will depend on format.
	var i;
	if (ZZTLoader.worldType == -1)
	{
		// ZZT
		ZZTLoader.baseSizeX = 60;
		ZZTLoader.baseSizeY = 25;
		ZZTLoader.baseOffset = 512;
		ZZTLoader.playerTorches = ZZTLoader.file.readShort();
		ZZTLoader.torchCycles = ZZTLoader.file.readShort();
		ZZTLoader.energizerCycles = ZZTLoader.file.readShort();
		ZZTLoader.file.readShort(); // Unused
		ZZTLoader.playerScore = ZZTLoader.file.readShort();
		var worldNameLength = ZZTLoader.file.readByte();
		ZZTLoader.worldName = ZZTLoader.readExtendedASCIIString(ZZTLoader.file, worldNameLength);
		ZZTLoader.file.position = ZZTLoader.file.position + (20 - worldNameLength);

		ZZTLoader.flagNames = [];
		for (i = 0; i < 10; i++)
		{
			var flagNameLength = ZZTLoader.file.readByte();
			ZZTLoader.flagNames[i] = ZZTLoader.readExtendedASCIIString(ZZTLoader.file, flagNameLength);
			ZZTLoader.file.position = ZZTLoader.file.position + (20 - flagNameLength);
		}

		ZZTLoader.timePassed = ZZTLoader.file.readShort();
		ZZTLoader.playerData = ZZTLoader.file.readShort();
		ZZTLoader.locked = ZZTLoader.file.readByte();
		ZZTLoader.playerStones = 0;
		interp.typeTrans[19] = zzt.waterType;
	}
	else
	{
		// SZT
		ZZTLoader.baseSizeX = 96;
		ZZTLoader.baseSizeY = 80;
		ZZTLoader.baseOffset = 1024;
		ZZTLoader.file.readShort(); // Unused
		ZZTLoader.playerTorches = 0;
		ZZTLoader.playerScore = ZZTLoader.file.readShort();
		ZZTLoader.torchCycles = 0;
		ZZTLoader.file.readShort(); // Unused
		ZZTLoader.energizerCycles = ZZTLoader.file.readShort();
		worldNameLength = ZZTLoader.file.readByte();
		ZZTLoader.worldName = ZZTLoader.readExtendedASCIIString(ZZTLoader.file, worldNameLength);
		ZZTLoader.file.position = ZZTLoader.file.position + (20 - worldNameLength);

		ZZTLoader.flagNames = [];
		for (i = 0; i < 16; i++)
		{
			flagNameLength = ZZTLoader.file.readByte();
			ZZTLoader.flagNames[i] = ZZTLoader.readExtendedASCIIString(ZZTLoader.file, flagNameLength);
			ZZTLoader.file.position = ZZTLoader.file.position + (20 - flagNameLength);
		}

		ZZTLoader.timePassed = ZZTLoader.file.readShort();
		ZZTLoader.playerData = ZZTLoader.file.readShort();
		ZZTLoader.locked = ZZTLoader.file.readByte();
		ZZTLoader.playerStones = ZZTLoader.file.readShort();
		interp.typeTrans[19] = zzt.lavaType;
	}

	// Set up grid for size
	ZZTLoader.setUpGrid(ZZTLoader.baseSizeX, ZZTLoader.baseSizeY);

	// Remaining data is interpreted board-by-board.
	ZZTLoader.file.position = ZZTLoader.baseOffset;
	ZZTLoader.boardData = [];
	for (i = 0; i < ZZTLoader.numBoards; i++)
	{
		ZZTLoader.boardData[i] = ZZTLoader.establishZZTBoard(i);
		if (ZZTLoader.boardData[i] == null)
			return false;
	}

	// Successfully loaded file.  Set global properties.
	ZZTLoader.setGlobalPropertiesZZT();

	return true;
};

static getBoardName(boardNum, incTitle=false) {
	if (!incTitle && boardNum == 0)
		return "(None)";
	else if (boardNum < 0 || boardNum >= ZZTLoader.boardData.length)
		return "(None)";

	return (ZZTLoader.boardData[boardNum].props["BOARDNAME"]);
};

static establishZZTBoard(boardNum) {
	// Create new board storage object.
	ZZTLoader.board = new ZZTBoard();
	ZZTLoader.board.props = {};
	ZZTLoader.board.regions = {};
	ZZTLoader.board.saveStamp = "init";
	ZZTLoader.board.boardIndex = boardNum;
	ZZTLoader.board.saveIndex = 0;
	ZZTLoader.board.saveType = -1;

	// Get board size.
	if (ZZTLoader.file.position + 1 >= ZZTLoader.file.length)
	{
		console.log("BOARD FORMAT ERROR:  Bad size in " + boardNum);
		ZZTLoader.file.position = ZZTLoader.file.length;
		return ZZTLoader.setBlankBoard(ZZTLoader.board);
	}

	var boardSize = ZZTLoader.file.readShort(ZZTLoader.file);
	var idealNextPos = ZZTLoader.file.position + (boardSize & 65535);

	// Detect possible sizing issues.
	var boardError = false;
	if (boardSize >= -255 && boardSize <= 178)
		boardError = true;
	else if (ZZTLoader.worldType == -2 && boardSize >= 0 && boardSize < 206)
		boardError = true;

	if (idealNextPos > ZZTLoader.file.length)
	{
		idealNextPos = ZZTLoader.file.length;
		boardError = true;
	}

	if (boardError)
	{
		console.log("BOARD FORMAT ERROR:  Bad size in " + boardNum);
		console.log(boardSize, ZZTLoader.worldType, idealNextPos, ZZTLoader.file.length);
		ZZTLoader.file.position = idealNextPos;
		return ZZTLoader.setBlankBoard(ZZTLoader.board);
	}

	var boardNameLength = ZZTLoader.file.readByte(ZZTLoader);
	ZZTLoader.board.props["BOARDNAME"] = ZZTLoader.readExtendedASCIIString(ZZTLoader.file, boardNameLength);
	if (ZZTLoader.worldType == -1)
		ZZTLoader.file.position = ZZTLoader.file.position + (50 - boardNameLength);
	else
		ZZTLoader.file.position = ZZTLoader.file.position + (60 - boardNameLength);

	// Create kind and color buffers.
	var totalSquares = ZZTLoader.baseSizeX * ZZTLoader.baseSizeY;
	ZZTLoader.board.typeBuffer = new ByteArray(totalSquares);
	ZZTLoader.board.colorBuffer = new ByteArray(totalSquares);
	ZZTLoader.board.lightBuffer = new ByteArray(totalSquares);
	ZZTLoader.board.props["SIZEX"] = ZZTLoader.baseSizeX;
	ZZTLoader.board.props["SIZEY"] = ZZTLoader.baseSizeY;

	// Unpack RLE data.
	for (var c = 0; c < totalSquares && ZZTLoader.file.position + 3 <= idealNextPos;)
	{
		var count = (ZZTLoader.file.readByte() - 1) & 255; // 256-count rollover possible
		var num = ZZTLoader.file.readUnsignedByte();
		var type = interp.typeTrans3(num);
		var color = ZZTLoader.file.readUnsignedByte();

		if (num == 9)
		{
			// Switch locations of FG and BG bits for DOOR
			color = (((color >> 4) & 15) ^ 8) + ((color << 4) & 240);
		}

		while (count >= 0)
		{
			ZZTLoader.board.lightBuffer.b[c] = 0;
			ZZTLoader.board.typeBuffer.b[c] = type;
			ZZTLoader.board.colorBuffer.b[c++] = color;
			count--;
		}
	}

	// Detect more sizing issues.
	if (ZZTLoader.file.position + 3 >= idealNextPos)
	{
		console.log("BOARD FORMAT ERROR:  RLE overrun in " + boardNum);
		ZZTLoader.file.position = idealNextPos;
		return ZZTLoader.setBlankBoard(ZZTLoader.board);
	}

	if ((ZZTLoader.file.position + 88 > idealNextPos && ZZTLoader.worldType == -1) ||
		(ZZTLoader.file.position + 30 > idealNextPos && ZZTLoader.worldType == -2))
	{
		console.log("BOARD FORMAT ERROR:  properties overrun in " + boardNum);
		ZZTLoader.file.position = idealNextPos;
		return ZZTLoader.setBlankBoard(ZZTLoader.board);
	}

	// Get board properties.
	ZZTLoader.board.props["MAXPLAYERSHOTS"] = ZZTLoader.file.readUnsignedByte();
	ZZTLoader.board.props["CURPLAYERSHOTS"] = 0;
	if (ZZTLoader.worldType == -1)
		ZZTLoader.board.props["ISDARK"] = ZZTLoader.file.readByte();
	else
		ZZTLoader.board.props["ISDARK"] = 0;

	ZZTLoader.board.props["EXITNORTH"] = ZZTLoader.file.readUnsignedByte();
	ZZTLoader.board.props["EXITSOUTH"] = ZZTLoader.file.readUnsignedByte();
	ZZTLoader.board.props["EXITWEST"] = ZZTLoader.file.readUnsignedByte();
	ZZTLoader.board.props["EXITEAST"] = ZZTLoader.file.readUnsignedByte();
	ZZTLoader.board.props["RESTARTONZAP"] = ZZTLoader.file.readByte();

	if (ZZTLoader.worldType == -1)
	{
		var messageLength = ZZTLoader.file.readByte();
		ZZTLoader.board.props["MESSAGE"] = ZZTLoader.readExtendedASCIIString(ZZTLoader.file, messageLength);
		ZZTLoader.file.position = ZZTLoader.file.position + (58 - messageLength);
	}
	else
		ZZTLoader.board.props["MESSAGE"] = "";

	ZZTLoader.board.props["FROMPASSAGEHACK"] = 0;
	ZZTLoader.board.props["PLAYERCOUNT"] = 0;
	ZZTLoader.board.props["PLAYERENTERX"] = ZZTLoader.file.readByte(); // Unused in SZT?
	ZZTLoader.board.props["PLAYERENTERY"] = ZZTLoader.file.readByte(); // Unused in SZT?
	if (ZZTLoader.worldType == -2)
	{
		ZZTLoader.board.props["CAMERAX"] = ZZTLoader.file.readShort();
		ZZTLoader.board.props["CAMERAY"] = ZZTLoader.file.readShort();
	}
	else
	{
		ZZTLoader.board.props["CAMERAX"] = 1;
		ZZTLoader.board.props["CAMERAY"] = 1;
	}

	ZZTLoader.board.props["TIMELIMIT"] = ZZTLoader.file.readShort();
	if (ZZTLoader.worldType == -1)
		ZZTLoader.file.position = ZZTLoader.file.position + 16;
	else
		ZZTLoader.file.position = ZZTLoader.file.position + 14;

	ZZTLoader.board.statElementCount = ZZTLoader.file.readShort() + 1;
	ZZTLoader.board.statLessCount = 0;

	// Load status elements
	var boardStartCodeID = interp.codeBlocks.length;
	ZZTLoader.board.playerSE = null;
	ZZTLoader.board.statElem = [];
	for (var i = 0; i < ZZTLoader.board.statElementCount; i++)
	{
		if ((ZZTLoader.file.position + 33 > idealNextPos && ZZTLoader.worldType == -1) ||
			(ZZTLoader.file.position + 25 > idealNextPos && ZZTLoader.worldType == -2))
		{
			console.log("BOARD FORMAT ERROR:  SE overrun in " + boardNum);
			ZZTLoader.file.position = idealNextPos;
			return ZZTLoader.setBlankBoard(ZZTLoader.board);
		}

		// Get coordinates
		var statElemX = ZZTLoader.file.readByte();
		var statElemY = ZZTLoader.file.readByte();
		if (statElemX <= 0 || statElemY <= 0)
		{
			// Non-used status element?
			console.log("Off-grid statElem: ", ZZTLoader.board.props["BOARDNAME"], statElemX, statElemY);
			ZZTLoader.file.position = ZZTLoader.file.position + 21;

			var statElemCodeLength = ZZTLoader.file.readShort();
			if (statElemCodeLength > 0)
				ZZTLoader.file.position = ZZTLoader.file.position + statElemCodeLength;

			if (ZZTLoader.worldType == -1)
				ZZTLoader.file.position = ZZTLoader.file.position + 8;

			continue;
		}

		// Establish type/color info at coordinates
		var st = ZZTLoader.board.typeBuffer.b[(statElemY-1) * ZZTLoader.baseSizeX + (statElemX-1)];
		var sc = ZZTLoader.board.colorBuffer.b[(statElemY-1) * ZZTLoader.baseSizeX + (statElemX-1)];

		if (st == 0 && ZZTLoader.worldType == -1)
		{
			// Create an alternate "wind tunnel" type (an odd exploit of ZZT engine)
			ZZTLoader.board.typeBuffer.b[(statElemY-1) * ZZTLoader.baseSizeX + (statElemX-1)] = zzt.windTunnelType;
			ZZTLoader.file.position = ZZTLoader.file.position + 21;

			statElemCodeLength = ZZTLoader.file.readShort();
			if (statElemCodeLength > 0)
				ZZTLoader.file.position += statElemCodeLength;

			if (ZZTLoader.worldType == -1)
				ZZTLoader.file.position = ZZTLoader.file.position + 8;

			continue;
		}

		// Create SE.
		var se = new SE(st, statElemX, statElemY, sc, true);
		var eInfo = SE.typeList[st];
		if (eInfo.NUMBER == 4 && !ZZTLoader.board.playerSE)
		{
			// This is the main player type.
			ZZTLoader.board.playerSE = se;
			ZZTLoader.board.playerSE.extra["CPY"] = 0;
		}

		// Read rest of SE fields
		var statElemStepX = ZZTLoader.file.readShort();
		var statElemStepY = ZZTLoader.file.readShort();
		var statElemCycle = ZZTLoader.file.readShort();
		var statElemP1 = ZZTLoader.file.readUnsignedByte();
		var statElemP2 = ZZTLoader.file.readUnsignedByte();
		var statElemP3 = ZZTLoader.file.readUnsignedByte();
		var statElemFollower = ZZTLoader.file.readShort();
		var statElemLeader = ZZTLoader.file.readShort();
		var statElemUnderKind = interp.typeTrans2(ZZTLoader.file.readUnsignedByte());
		var statElemUnderColor = ZZTLoader.file.readUnsignedByte();
		var ptr = ZZTLoader.file.readInt();
		var statElemIP = ZZTLoader.file.readUnsignedShort();

		statElemCodeLength = ZZTLoader.file.readShort();
		if (ZZTLoader.worldType == -1)
			ZZTLoader.file.position = ZZTLoader.file.position + 8;

		if (!SE.typeList[statElemUnderKind].NoStat)
			statElemUnderKind = 0; // Fix common "same type under itself" error

		var newCodeId = -1;
		if (statElemCodeLength != 0 || eInfo.HasOwnCode)
		{
			if (statElemCodeLength > 0 && ZZTLoader.file.position + statElemCodeLength > idealNextPos)
			{
				console.log("BOARD FORMAT ERROR:  code overrun in " + boardNum);
				ZZTLoader.file.position = idealNextPos;
				return ZZTLoader.setBlankBoard(ZZTLoader.board);
			}

			// ZZT-OOP code uses CR as line break.
			var statElemCode = ZZTLoader.readExtendedASCIIString(ZZTLoader.file, statElemCodeLength);
			if (statElemCode == "")
				statElemCode = ZZTLoader.pwadBQUESTHACK ? "#STP" : "#END";
			if (statElemCode.charAt(statElemCode.length - 1) == "\r")
				statElemCode = statElemCode.substring(0, statElemCode.length - 1);

			if (statElemCodeLength < 0)
			{
				// This is a #BIND'ed OBJECT.  We will need to reference the SE that
				// sponsors the real code.
				newCodeId = ZZTLoader.locateSponsorCodeId(-statElemCodeLength, i);
			}
			else
			{
				// Compile custom code.
				newCodeId = zzt.compileCustomCode(eInfo, statElemCode, "\r", statElemIP);
				if (newCodeId == -1)
					return null;
				var numPrefix = eInfo.NUMBER.toString() + "\r";
				interp.unCompStart.push(numPrefix.length);
				interp.unCompCode.push(numPrefix + statElemCode);
			}

			if (eInfo.NUMBER == 36)
			{
				// Objects change character to P1 and take locked status from P2.
				// We might also need to set the name immediately if defined on line 1.
				se.delay = 2;
				se.extra["CHAR"] = statElemP1;
				if (statElemP2 & 1)
					se.FLAGS |= interp.FL_LOCKED;
				if (statElemIP == 65535)
					se.FLAGS |= interp.FL_IDLE;
				if (oop.lastAssignedName != "")
					se.extra["ONAME"] = oop.lastAssignedName;
				if (statElemIP > 0)
					se.IP = oop.virtualIP;
			}
		}

		// Set SE fields in instance.
		se.myID = ++interp.nextObjPtrNum;
		se.STEPX = statElemStepX;
		se.STEPY = statElemStepY;
		se.CYCLE = statElemCycle;
		se.UNDERID = statElemUnderKind;
		se.UNDERCOLOR = statElemUnderColor;

		// Introduce quasi-random delays to SE to simulate disjointed
		// cycles in original engine, if cycle is not 1.
		if (se.CYCLE > 1)
		{
			se.delay += se.myID % se.CYCLE;
		}

		// The "extra" fields in the SE are included only if they are
		// requisitioned by the type.  No need to include "garbage."
		if (eInfo.extraVals.hasOwnProperty("P1"))
			se.extra["P1"] = statElemP1;
		if (eInfo.extraVals.hasOwnProperty("P2"))
			se.extra["P2"] = statElemP2;
		if (eInfo.extraVals.hasOwnProperty("P3"))
			se.extra["P3"] = statElemP3;
		if (eInfo.extraVals.hasOwnProperty("FOLLOWER"))
			se.extra["FOLLOWER"] = statElemFollower;
		if (eInfo.extraVals.hasOwnProperty("LEADER"))
			se.extra["LEADER"] = statElemLeader;
		if (newCodeId != -1)
			se.extra["CODEID"] = newCodeId;

		if (eInfo.NUMBER == 11)
		{
			// Passages should have color tweaked:  BG->FG slot.
			se.extra["P2"] = sc; // Original color spec
			sc = ((sc >> 4) & 15) ^ 8;
			ZZTLoader.board.colorBuffer.b[(statElemY-1) * ZZTLoader.baseSizeX + (statElemX-1)] = sc;
		}
		else if (eInfo.NUMBER == 4)
		{
			console.log("Board=", ZZTLoader.board.props["BOARDNAME"]);
			ZZTLoader.board.props["PLAYERCOUNT"]++;
		}

		// Add SE to container.
		ZZTLoader.board.statElem.push(se);
	}

	// Here we need to address status element errors.  Sometimes a type requiring
	// SE does not have one defined.  If we don't have one defined, we must create
	// a simple one with default attributes.
	var csr = 0;
	for (var y = 0; y < ZZTLoader.baseSizeY; y++)
	{
		for (var x = 0; x < ZZTLoader.baseSizeX; x++)
		{
			st = ZZTLoader.board.typeBuffer.b[csr++]
			eInfo = SE.typeList[st];
			if (!eInfo.NoStat)
			{
				for (i = 0; i < ZZTLoader.board.statElem.length; i++)
				{
					if (ZZTLoader.board.statElem[i].X == x+1 && ZZTLoader.board.statElem[i].Y == y+1)
					{
						// Found; no problem.
						st = 0;
						break;
					}
				}

				if (st != 0)
				{
					// A "statless" type that needs to be a status element
					// is still given stats in ZZT Ultra.  However, it is put
					// into a special state that does not iterate and does not
					// respond to sent messages.
					sc = ZZTLoader.board.colorBuffer.b[y * ZZTLoader.baseSizeX + x];
					se = new SE(st, x+1, y+1, sc, true);
					ZZTLoader.board.statElem.push(se);
					//console.log ("Repaired statElem error at ", (x+1), ",", (y+1));

					if (eInfo.NUMBER == 4)
					{
						if (ZZTLoader.board.playerSE)
						{
							se.FLAGS |= interp.FL_IDLE | interp.FL_LOCKED | interp.FL_NOSTAT;
							ZZTLoader.board.statLessCount++;
						}
						else
						{
							// Main player type; this saves a last-chance legit player.
							ZZTLoader.board.playerSE = se;
							ZZTLoader.board.playerSE.extra["CPY"] = 0;
						}
					}
					else
					{
						se.FLAGS |= interp.FL_IDLE | interp.FL_LOCKED | interp.FL_NOSTAT;
						ZZTLoader.board.statLessCount++;

						// Passages should have color tweaked:  BG->FG slot.
						if (eInfo.NUMBER == 11)
						{
							se.extra["P2"] = sc; // Original color spec
							sc = ((sc >> 4) & 15) ^ 8;
							ZZTLoader.board.colorBuffer.b[y * ZZTLoader.baseSizeX + x] = sc;
						}
					}
				}
			}
		}
	}

	ZZTLoader.board.statElementCount = ZZTLoader.board.statElem.length;
	if (ZZTLoader.board.statLessCount > 0)
		console.log("Non-stat count:  ", ZZTLoader.board.statLessCount);

	return ZZTLoader.board;
};

static setBlankBoard(zb) {
	// Default grid is all-empty with player in upper-left.
	var totalSquares = ZZTLoader.baseSizeX * ZZTLoader.baseSizeY;
	zb.typeBuffer = new ByteArray(totalSquares);
	zb.colorBuffer = new ByteArray(totalSquares);
	zb.lightBuffer = new ByteArray(totalSquares);

	zb.typeBuffer.b[0] = zzt.playerType;
	zb.colorBuffer.b[0] = 31;
	zb.lightBuffer.b[0] = 0;
	for (var i = 1; i < totalSquares; i++) {
		zb.typeBuffer.b[i] = 0;
		zb.colorBuffer.b[i] = 15;
		zb.lightBuffer.b[i] = 0;
	}

	// Board properties are sensible defaults.
	zb.props["BOARDNAME"] = "ERROR!";
	zb.props["SIZEX"] = ZZTLoader.baseSizeX;
	zb.props["SIZEY"] = ZZTLoader.baseSizeY;
	zb.props["MAXPLAYERSHOTS"] = 255
	zb.props["CURPLAYERSHOTS"] = 0;
	zb.props["ISDARK"] = 0;
	zb.props["EXITNORTH"] = 0;
	zb.props["EXITSOUTH"] = 0;
	zb.props["EXITWEST"] = 0;
	zb.props["EXITEAST"] = 0;
	zb.props["RESTARTONZAP"] = 0;
	zb.props["MESSAGE"] = "";
	zb.props["FROMPASSAGEHACK"] = 0;
	zb.props["PLAYERCOUNT"] = 1;
	zb.props["PLAYERENTERX"] = 1;
	zb.props["PLAYERENTERY"] = 1;
	zb.props["CAMERAX"] = 1;
	zb.props["CAMERAY"] = 1;
	zb.props["TIMELIMIT"] = 0
	zb.statElementCount = 1;
	zb.statLessCount = 0;

	// Status elements include only player.
	zb.statElem = [];
	var se = new SE(zzt.playerType, 1, 1, 31, true);
	se.myID = ++interp.nextObjPtrNum;
	se.UNDERID = 0;
	se.extra["CPY"] = 0;
	zb.playerSE = se;
	zb.statElem.push(se);

	return zb;
};

static locateSponsorCodeId(findIdx, curIdx) {
	if (findIdx < curIdx)
	{
		// This is easy to find:  we already processed the status element
		// and its code.
		var testSE = ZZTLoader.board.statElem[findIdx];
		return (testSE.extra["CODEID"]);
	}

	// Otherwise, the status element is downstream in the parse order.  We will
	// need to locate an object with its own code at the index, and then infer
	// what its code ID will be.
	var nextCodeId = interp.codeBlocks.length;
	var origPos = ZZTLoader.file.position;
	while (++curIdx < ZZTLoader.board.statElementCount)
	{
		// Get location.
		var testX = ZZTLoader.file.readByte();
		var testY = ZZTLoader.file.readByte();

		// Advance to code length.
		ZZTLoader.file.position = ZZTLoader.file.position + 21;
		var testCodeLength = ZZTLoader.file.readShort();
		if (findIdx == curIdx)
		{
			if (testCodeLength >= 0)
			{
				// Found it.
				ZZTLoader.file.position = origPos;
				return nextCodeId;
			}
		}

		// Skip ZZT 8 bytes if needed.
		if (ZZTLoader.worldType == -1)
			ZZTLoader.file.position = ZZTLoader.file.position + 8;

		// Skip code.
		if (testCodeLength >= 0)
		{
			ZZTLoader.file.position = ZZTLoader.file.position + testCodeLength;

			// If this was an OBJECT or SCROLL, we need to
			// advance expected code ID.
			if (testX > 0 && testY > 0)
			{
				var st = ZZTLoader.board.typeBuffer.b[(testY-1) * ZZTLoader.baseSizeX + (testX-1)];
				var eInfo = SE.typeList[st];
				if (eInfo.NUMBER == 10 || eInfo.NUMBER == 36)
				{
					nextCodeId++;
				}
			}
		}
	}

	// It is possible that the #BIND destination got logically corrupted
	// somehow, and does not actually point to valid code.  If this happens,
	// assume the code block is empty and unbound.
	ZZTLoader.file.position = origPos;
	return -1;
};

static setGlobalPropertiesZZT() {
	// -WORLD PROPERTIES-
	zzt.globalProps["WORLDTYPE"] = ZZTLoader.worldType;
	zzt.globalProps["WORLDNAME"] = ZZTLoader.worldName;
	zzt.globalProps["LOCKED"] = ZZTLoader.locked;
	zzt.globalProps["NUMBOARDS"] = ZZTLoader.numBoards;
	zzt.globalProps["NUMBASECODEBLOCKS"] = interp.numBuiltInCodeBlocks;
	zzt.globalProps["NUMCLASSICFLAGS"] = 0;
	zzt.globalProps["CODEDELIMETER"] = "\r";

	// -INVENTORY PROPERTIES-
	zzt.globalProps["STARTBOARD"] = ZZTLoader.playerBoard;
	zzt.globalProps["BOARD"] = -1;
	zzt.globalProps["AMMO"] = ZZTLoader.playerAmmo;
	zzt.globalProps["GEMS"] = ZZTLoader.playerGems;
	zzt.globalProps["HEALTH"] = ZZTLoader.playerHealth;
	zzt.globalProps["TORCHES"] = ZZTLoader.playerTorches;
	zzt.globalProps["SCORE"] = ZZTLoader.playerScore;
	zzt.globalProps["TIME"] = ZZTLoader.timePassed;
	zzt.globalProps["Z"] = ZZTLoader.playerStones;
	zzt.globalProps["TORCHCYCLES"] = ZZTLoader.torchCycles;
	zzt.globalProps["ENERGIZERCYCLES"] = ZZTLoader.energizerCycles;
	for (var i = 0; i < 7; i++)
	{
		var kCount = i + 9; // Starts at BLUE
		zzt.globalProps["KEY" + kCount.toString()] = ZZTLoader.playerKeys.b[i];
	}

	zzt.globalProps["KEY0"] = 0;
	zzt.globalProps["KEY1"] = 0;
	zzt.globalProps["KEY2"] = 0;
	zzt.globalProps["KEY3"] = 0;
	zzt.globalProps["KEY4"] = 0;
	zzt.globalProps["KEY5"] = 0;
	zzt.globalProps["KEY6"] = 0;
	zzt.globalProps["KEY7"] = 0;
	zzt.globalProps["KEY8"] = 0;

	// Property overrides
	var k;
	if (ZZTLoader.worldType == -1)
	{
		for (k in ZZTProp.overridePropsZZT)
			zzt.globalProps[k] = ZZTProp.overridePropsZZT[k];

		// Setting SCORE as a config property is considered cheating.
		if (zzt.CHEATING_DISABLES_PROGRESS && ZZTProp.overridePropsZZT.hasOwnProperty("SCORE"))
			zzt.DISABLE_HISCORE = 1;
	}
	else if (ZZTLoader.worldType == -2)
	{
		for (k in ZZTProp.overridePropsSZT)
			zzt.globalProps[k] = ZZTProp.overridePropsSZT[k];

		// Setting SCORE as a config property is considered cheating.
		if (zzt.CHEATING_DISABLES_PROGRESS && ZZTProp.overridePropsSZT.hasOwnProperty("SCORE"))
			zzt.DISABLE_HISCORE = 1;
	}

	for (k in ZZTProp.overridePropsGeneral)
		zzt.globalProps[k] = ZZTProp.overridePropsGeneral[k];

	// Setting SCORE as a config property is considered cheating.
	if (zzt.CHEATING_DISABLES_PROGRESS && ZZTProp.overridePropsGeneral.hasOwnProperty("SCORE"))
		zzt.DISABLE_HISCORE = 1;

	// Global variables (from flags)
	zzt.globals = {};
	for (i = 0; i < ZZTLoader.flagNames.length; i++)
	{
		if (ZZTLoader.flagNames[i].length > 0)
		{
			// Flags are Boolean; always set to 1
			zzt.globals[ZZTLoader.flagNames[i]] = 1;
			zzt.globalProps["NUMCLASSICFLAGS"] += 1;
			zzt.globalProps["LASTCLASSICFLAG"] = ZZTLoader.flagNames[i];

			// In SZT, Z label is set when a flag starts with Z
			if (ZZTLoader.worldType == -2 && ZZTLoader.flagNames[i].charAt(0) == "Z")
				zzt.globalProps["ZSTONELABEL"] = ZZTLoader.flagNames[i].substr(1);
		}
	}

	// Masks set to standard sizes for ZZT or SZT
	if (ZZTLoader.worldType == -1)
	{
		zzt.addMask("TORCH", zzt.stdTorchMask);
		zzt.addMask("BOMB", zzt.stdBombMask);
	}
	else if (ZZTLoader.worldType == -2)
	{
		zzt.addMask("TORCH", zzt.stdTorchMask);
		zzt.addMask("SZTBOMB", zzt.sztBombMask);
	}

	// Sound effects set to default for ZZT or SZT
	if (ZZTLoader.worldType == -1 || ZZTLoader.worldType == -2)
	{
		for (k in ZZTProp.defaultSoundFx)
			zzt.soundFx[k] = ZZTProp.defaultSoundFx[k];
	}

	// Patch using active PWAD (establishPWAD should have been called already)
	ZZTLoader.pwadPatch();

	// Update master volume.
	Sounds.setMasterVolume(zzt.globalProps["MASTERVOLUME"]);

	// Update scroll interface colors.
	zzt.setScrollColors(zzt.globalProps["SCRCOLBORDER"],
	zzt.globalProps["SCRCOLSHADOW"], zzt.globalProps["SCRCOLBG"],
	zzt.globalProps["SCRCOLTEXT"], zzt.globalProps["SCRCOLCENTERTEXT"],
	zzt.globalProps["SCRCOLBUTTON"], zzt.globalProps["SCRCOLARROW"]);

	// Reset save state container
	ZZTLoader.saveStates = [];
	ZZTLoader.currentBoardSaveIndex = 0;
};

static pwadPatch() {
	// Patch dictionaries
	if (ZZTLoader.pwadDicts.hasOwnProperty("WORLDHDR"))
		ZZTLoader.replaceDict(zzt.globalProps, ZZTLoader.pwadDicts["WORLDHDR"], ZZTLoader.pwadDelDicts["WORLDHDR"]);
	zzt.globalProps["NUMBOARDS"] = ZZTLoader.numBoards;

	if (ZZTLoader.pwadDicts.hasOwnProperty("GLOBALS "))
		ZZTLoader.replaceDict(zzt.globals, ZZTLoader.pwadDicts["GLOBALS "], ZZTLoader.pwadDelDicts["GLOBALS "]);

	if (ZZTLoader.pwadDicts.hasOwnProperty("SOUNDFX "))
		ZZTLoader.replaceDict(zzt.soundFx, ZZTLoader.pwadDicts["SOUNDFX "], ZZTLoader.pwadDelDicts["SOUNDFX "]);

	if (ZZTLoader.pwadDicts.hasOwnProperty("MASKS   "))
	{
		for (var k in ZZTLoader.pwadDicts["MASKS   "])
			zzt.addMask(k, ZZTLoader.pwadDicts["MASKS   "][k]);
	}

	// TBD
	//if (pwadDicts.hasOwnProperty("EXTRATYP"))
	//  replaceDict(zzt.globals, pwadDicts["GLOBALS "], pwadDelDicts["GLOBALS "]);

	// TBD
	//if (pwadDicts.hasOwnProperty("EXTRAGUI"))
	//  replaceDict(zzt.globals, pwadDicts["EXTRAGUI"], pwadDelDicts["EXTRAGUI"]);

	// Append extra PWADs.
	ZZTLoader.extraLumps = ZZTLoader.extraLumps.concat(ZZTLoader.pwadExtraLumps);
	ZZTLoader.extraLumpBinary = ZZTLoader.extraLumpBinary.concat(ZZTLoader.pwadExtraLumpBinary);

	// Compile custom code.
	var iwadHighestCustomCodeID = interp.codeBlocks.length;
	var pwadLowestCustomCodeID = zzt.globalProps["PWADLOWESTCUSTOMCODEID"];
	ZZTLoader.customONAME = {};

	zzt.loadedOOPType = -3;
	for (var i = 0; i < ZZTLoader.pwadCustCode.length; i++) {
		var codeStr = ZZTLoader.pwadCustCode[i];
		if (codeStr == "")
			codeStr = ZZTLoader.pwadBQUESTHACK ? "#STP" : "#END";

		// Add code block.
		interp.unCompCode.push(codeStr);

		var eLoc = codeStr.indexOf("\n");
		var codeSrcType = codeStr.substr(0, eLoc);
		var unCompCodeId = interp.typeTrans2(utils.int(codeSrcType));
		var eInfo = SE.typeList[unCompCodeId];
		codeStr = codeStr.substr(eLoc+1);
		interp.unCompStart.push(eLoc+1);

		// Add to code blocks
		var newCodeId = zzt.compileCustomCode(eInfo, codeStr);
		if (oop.lastAssignedName != "")
			ZZTLoader.customONAME[newCodeId.toString()] = oop.lastAssignedName;
	}
	zzt.loadedOOPType = ZZTLoader.worldType;

	// Patch individual boards
	for (i = 0; i < ZZTLoader.pwadBoards.length; i++) {
		var pwb = ZZTLoader.pwadBoards[i];
		var hdrDict = pwb[0];
		var hdrDelDict = pwb[1];
		var rgnDict = pwb[2];
		var rgnDelDict = pwb[3];
		var seArray = pwb[4];
		var typeBuffer = pwb[5];
		var colorBuffer = pwb[6];
		var lightBuffer = pwb[7];
		var zb = ZZTLoader.boardData[i];

		// Replace dictionaries
		ZZTLoader.replaceDict(zb.props, hdrDict, hdrDelDict);
		ZZTLoader.replaceDict(zb.regions, rgnDict, rgnDelDict);

		// Patch grid data
		var sizeX = zb.props["SIZEX"];
		var sizeY = zb.props["SIZEY"];
		for (var y = 0; y < sizeY; y++) {
			for (var x = 0; x < sizeX; x++) {
				// Check updated type
				var newType = typeBuffer.b[sizeX * y + x];
				if (newType == zzt.patchType)
					continue; // Nothing to patch at this square

				// Patch grid
				var newColor = colorBuffer.b[sizeX * y + x];
				var newLit = lightBuffer.b[sizeX * y + x];
				zb.typeBuffer.b[sizeX * y + x] = newType;
				zb.colorBuffer.b[sizeX * y + x] = newColor;
				zb.lightBuffer.b[sizeX * y + x] = newLit;
			}
		}

		// Added/Modded status elements
		for (var j = 0; j < seArray.length; j++) {
			var o = seArray[j];
			x = o["X"];
			y = o["Y"];

			// Remove old status element copies at identified location
			var insertionLoc = -1;
			for (var s = 0; s < zb.statElem.length; s++) {
				var se = zb.statElem[s];
				if (se.X == x && se.Y == y)
				{
					insertionLoc = s;
					zb.statElem.splice(s, 1);
					s--;
				}
			}

			// The "zero" type cannot be a status element; it indicates removal only.
			if (o["TYPE"] != 0)
			{
				// Nonzero types indicate an added or replaced status element.
				var st = zb.typeBuffer.b[sizeX * (y - 1) + (x - 1)];
				var sc = zb.colorBuffer.b[sizeX * (y - 1) + (x - 1)];
				eInfo = SE.typeList[st];
				se = new SE(st, x, y, sc, true);

				if (o.hasOwnProperty("IP"))
					se.IP = o["IP"];
				if (o.hasOwnProperty("FLAGS"))
					se.FLAGS = o["FLAGS"];
				if (o.hasOwnProperty("delay"))
					se.delay = o["delay"];
				se.myID = ++interp.nextObjPtrNum;

				if (o.hasOwnProperty("UNDERID"))
					se.UNDERID = interp.typeTrans2(o["UNDERID"]);
				else
					se.UNDERID = 0;
				if (o.hasOwnProperty("UNDERCOLOR"))
					se.UNDERCOLOR = o["UNDERCOLOR"];
				else
					se.UNDERCOLOR = 0;
				if (o.hasOwnProperty("CYCLE"))
					se.CYCLE = o["CYCLE"];
				else
					se.CYCLE = eInfo.CYCLE;
				if (o.hasOwnProperty("STEPX"))
					se.STEPX = o["STEPX"];
				else
					se.STEPY = eInfo.STEPY;
				if (o.hasOwnProperty("STEPY"))
					se.STEPY = o["STEPY"];
				else
					se.STEPY = eInfo.STEPY;

				var e;
				for (e in o)
				{
					if (!se.hasOwnProperty(e))
						se.extra[e] = o[e];
				}

				// Adjust CODEID if it is present to point to added custom IDs.
				if (se.extra.hasOwnProperty("CODEID"))
					se.extra["CODEID"] += iwadHighestCustomCodeID - pwadLowestCustomCodeID;

				// If next command is a @name, assign ONAME member.
				if ((se.FLAGS & interp.FL_IDLE) == 0 && eInfo.HasOwnCode)
				{
					if (se.extra.hasOwnProperty("CODEID"))
					{
						var codeIdStr = se.extra["CODEID"].toString();
						if (ZZTLoader.customONAME.hasOwnProperty(codeIdStr))
							se.extra["ONAME"] = ZZTLoader.customONAME[codeIdStr];
					}
				}

				if (insertionLoc == -1)
					zb.statElem.push(se);
				else
					zb.statElem.splice(insertionLoc, 0, se);
			}
		}

		// Player SE might have been moved; reset if needed.
		if (zb.statElem.length > 0)
			zb.playerSE = zb.statElem[0];
		else
			zb.playerSE = null;

		for (j = 0; j < zb.statElem.length; j++)
		{
			if (zb.statElem[j].myID == zb.props["$PLAYER"] && zb.props["$PLAYER"] > 0)
			{
				zb.playerSE = zb.statElem[j];
				break;
			}
		}

		if (zb.playerSE != null)
			zb.props["$PLAYER"] = zb.playerSE.myID;
	}
};

static ensureGridSpace(gridBoundX, gridBoundY) {
	var squares = (gridBoundX + 2) * (gridBoundY + 2);

	if (zzt.tg.length < squares)
		zzt.tg = new Uint8Array(squares);
	if (zzt.cg.length < squares)
		zzt.cg = new Uint8Array(squares);
	if (zzt.lg.length < squares)
		zzt.lg = new Uint8Array(squares);
	if (zzt.sg.length < squares)
		zzt.sg.length = squares;
};

static setUpGrid(gridBoundX, gridBoundY, dimsOnly=false) {
	// Set grid boundaries
	SE.gridWidth = gridBoundX;
	SE.gridHeight = gridBoundY;
	SE.fullGridWidth = gridBoundX + 2;
	SE.fullGridHeight = gridBoundY + 2;
	interp.allRegion[1][0] = gridBoundX;
	interp.allRegion[1][1] = gridBoundY;

	if (dimsOnly)
		return;

	// Place board edge type around grid
	for (var i = 0; i < SE.fullGridWidth; i++)
	{
		SE.setType(i, 0, zzt.bEdgeType);
		SE.setColor(i, 0, 14);
		SE.setType(i, SE.gridHeight + 1, zzt.bEdgeType);
		SE.setColor(i, SE.gridHeight + 1, 14);
	}
	for (i = 0; i < SE.fullGridHeight; i++)
	{
		SE.setType(0, i, zzt.bEdgeType);
		SE.setColor(0, i, 14);
		SE.setType(SE.gridWidth + 1, i, zzt.bEdgeType);
		SE.setColor(SE.gridWidth + 1, i, 14);
	}
};

static wipeBoardStates(lowerIndex=-1) {
	// Note that this function will intentionally "miss"
	// the initial state used to characterize the title screen when
	// it is first loaded.  This is because we need to have a workable
	// "reset" state when the user quits a game and wants to start over.
	for (var j = 1; j < ZZTLoader.saveStates.length; j++)
	{
		if (ZZTLoader.saveStates[j].saveIndex > lowerIndex)
		{
			ZZTLoader.saveStates.splice(j, 1);
			j--;
		}
	}

	// Bump save index back to relevant point.
	ZZTLoader.currentBoardSaveIndex = lowerIndex;
	if (ZZTLoader.currentBoardSaveIndex < 0)
		ZZTLoader.currentBoardSaveIndex = 0;
};

static wipeBoardZero() {
	while (ZZTLoader.saveStates.length > 0)
		ZZTLoader.saveStates.pop();

	ZZTLoader.currentBoardSaveIndex = 0;
};

static rewindZapRecord(lowerIndex) {
	for (var i = interp.zapRecord.length - 1; i >= 0; i--)
	{
		// Get info.
		var zr = interp.zapRecord[i];
		if (zr.saveIndex <= lowerIndex)
			break; // Done.

		var labelLoc = zr.labelLoc;
		var cBlock = interp.codeBlocks[zr.codeID];
		if (labelLoc >= 0)
		{
			// Undo zap
			cBlock[labelLoc] = oop.CMD_LABEL;
		}
		else
		{
			// Undo restore
			cBlock[-labelLoc] = oop.CMD_COMMENT;
		}

		// Remove record instance.
		interp.zapRecord.pop();
	}
};

static applyZapRecord() {
	for (var i = 0; i < interp.zapRecord.length; i++)
	{
		// Get info.
		var zr = interp.zapRecord[i];
		var labelLoc = zr.labelLoc;
		var cBlock = interp.codeBlocks[zr.codeID];
		var unCompID = zr.codeID - interp.numBuiltInCodeBlocksPlus;

		if (labelLoc >= 0)
		{
			// Register zap
			var unCompLoc = cBlock[labelLoc + 2] + interp.unCompStart[unCompID];
			interp.unCompCode[unCompID] = interp.unCompCode[unCompID].substring(0, unCompLoc) +
				"'" + interp.unCompCode[unCompID].substring(unCompLoc + 1);
		}
		else
		{
			// Register restore
			unCompLoc = cBlock[-labelLoc + 2] + interp.unCompStart[unCompID];
			interp.unCompCode[unCompID] = interp.unCompCode[unCompID].substring(0, unCompLoc) +
				":" + interp.unCompCode[unCompID].substring(unCompLoc + 1);
		}
	}
};

static cloneZapRecord(forCodeID, newCodeID) {
	var origLen = interp.zapRecord.length;
	for (var i = 0; i < origLen; i++)
	{
		var zr = interp.zapRecord[i];
		if (zr.codeID == forCodeID)
		interp.zapRecord.push(
			new ZapRecord(newCodeID, zr.labelLoc, 1, ZZTLoader.currentBoardSaveIndex));
	}
};

static resetGlobalProps(bState) {
	zzt.globalProps = {};
	zzt.globals = {};
	Sounds.globalProps = zzt.globalProps;

	for (var k in bState.worldProps)
		zzt.globalProps[k] = bState.worldProps[k];
	for (k in bState.worldVars)
		zzt.globals[k] = bState.worldVars[k];
};

static getBoardState(boardNum, saveIndex) {
	for (var j = 0; j < ZZTLoader.saveStates.length; j++)
	{
		if (ZZTLoader.saveStates[j].boardIndex == boardNum && ZZTLoader.saveStates[j].saveIndex == saveIndex)
			return (ZZTLoader.saveStates[j]);
	}

	return null;
};

static latestBoardState(boardNum, autoReg=false) {
	if (boardNum < 0)
		return null;

	var bState = null;
	for (var j = 0; j < ZZTLoader.saveStates.length; j++)
	{
		if (ZZTLoader.saveStates[j].boardIndex == boardNum)
		{
			// Take latest (or only) state for board.
			if (bState == null)
				bState = ZZTLoader.saveStates[j];
			else if (ZZTLoader.saveStates[j].saveIndex > bState.saveIndex)
				bState = ZZTLoader.saveStates[j];
		}
	}

	// If board matches current, register current board state at same level.
	if (autoReg && boardNum == zzt.globalProps["BOARD"])
	{
		// If the current board had never been registered, choose save index of zero.
		if (bState == null)
		{
			ZZTLoader.registerBoardState();
			bState = ZZTLoader.getBoardState(boardNum, 0);
		}
		else
			ZZTLoader.registerBoardState();
	}

	// If board does not match current, just pull from stored board data if
	// auto-registering unloaded data.
	if (autoReg && bState == null)
		bState = ZZTLoader.boardData[boardNum];

	return bState;
};

static registerBoardState(targetOriginal=false, newX=-1, newY=-1) {
	// Write back current board's type info to the last save state slot.
	// There won't be anything to write back if the world had just been loaded,
	// and no board had been selected.
	var oldBoardNum = zzt.globalProps["BOARD"];
	var oldBoard = null;
	if (targetOriginal)
		oldBoard = ZZTLoader.boardData[oldBoardNum];
	else
		oldBoard = ZZTLoader.latestBoardState(oldBoardNum);

	if (oldBoard != null)
	{
		// Write back data.
		var sizeX = oldBoard.props["SIZEX"];
		var sizeY = oldBoard.props["SIZEY"];

		var padX = 0;
		if (newX != -1)
		{
			if (newX < sizeX)
				sizeX = newX;
			else
				padX = newX - sizeX;
		}
		if (newY != -1)
		{
			if (newY <= sizeY)
				newY = -1;
		}

		// Copy working grid to board grids.
		var csr = 0;
		for (var y = 0; y < sizeY; y++)
		{
			for (var x = 0; x < sizeX; x++)
			{
				oldBoard.typeBuffer.b[csr] = SE.getType(x + 1, y + 1);
				oldBoard.colorBuffer.b[csr] = SE.getColor(x + 1, y + 1);
				oldBoard.lightBuffer.b[csr] = SE.getLit(x + 1, y + 1);
				csr++;
			}

			for (x = 0; x < padX; x++)
			{
				// Empty-fill the right-expanded portion
				oldBoard.typeBuffer.b[csr] = 0;
				oldBoard.colorBuffer.b[csr] = 15;
				oldBoard.lightBuffer.b[csr] = 0;
				csr++;
			}
		}

		csr = sizeY * newX;
		for (y = sizeY; y < newY; y++)
		{
			for (x = 0; x < newX; x++)
			{
				// Empty-fill the down-expanded portion
				oldBoard.typeBuffer.b[csr] = 0;
				oldBoard.colorBuffer.b[csr] = 15;
				oldBoard.lightBuffer.b[csr] = 0;
				csr++;
			}
		}

		// Set timestamp.
		var d = new Date();
		oldBoard.saveStamp = oldBoard.props["BOARDNAME"] + " : " + d.toTimeString();

		// Save snapshot of world properties and global variables.
		// Although not strictly related to the board itself, the
		// snapshot is necessary for restoration purposes.
		oldBoard.worldProps = {};
		oldBoard.worldVars = {};
		for (var k in zzt.globalProps)
			oldBoard.worldProps[k] = zzt.globalProps[k];
		for (k in zzt.globals)
			oldBoard.worldVars[k] = zzt.globals[k];

		return true;
	}

	return false;
};

static switchBoard(boardNum, saveIndex=-1) {
	if (boardNum < 0 && boardNum >= ZZTLoader.boardData.length)
		return false;

	// Ensure movement destination is cancelled.
	input.c2MDestX = -1;
	input.c2MDestY = -1;

	// Register existing board state.
	ZZTLoader.registerBoardState();

	// Locate board in the saved states.
	var newBoard = null;
	if (saveIndex == -1)
	{
		// Fetch latest board.
		newBoard = ZZTLoader.latestBoardState(boardNum);
	}
	else
	{
		// Fetch from specific save index.
		newBoard = ZZTLoader.getBoardState(boardNum, saveIndex);
	}

	if (newBoard == null)
	{
		// If no board present, we hadn't yet tried to switch to that board,
		// and we must make a copy.
		newBoard = ZZTLoader.copyBaseBoard(boardNum);
	}
	else if (newBoard.saveIndex < ZZTLoader.currentBoardSaveIndex && boardNum != 0)
	{
		// If the present board is of a save index further back,
		// we must make a copy to prevent confusion with earlier ones.
		newBoard = ZZTLoader.copyBoardState(newBoard);
		newBoard.saveIndex = ZZTLoader.currentBoardSaveIndex;
		newBoard.saveType = -1;
		ZZTLoader.saveStates.push(newBoard);
	}

	// Update global containers to reflect new board.
	ZZTLoader.updateContFromBoard(boardNum, newBoard);
	return true;
};

static updateContFromBoard(boardNum, newBoard) {
	// Set the global containers to reflect new board.
	zzt.boardProps = newBoard.props;
	zzt.regions = newBoard.regions;
	zzt.statElem = newBoard.statElem;
	SE.statElem = newBoard.statElem;
	SE.statLessCount = newBoard.statLessCount;
	SE.IsDark = newBoard.props["ISDARK"];
	SE.CameraX = newBoard.props["CAMERAX"];
	SE.CameraY = newBoard.props["CAMERAY"];

	zzt.globalProps["BOARD"] = boardNum;
	interp.playerSE = newBoard.playerSE;

	if (newBoard.playerSE)
	{
		interp.assignID(newBoard.playerSE);
		zzt.globals["$PLAYER"] = newBoard.playerSE.myID;
	}

	// "Fence in" the content.
	var sizeX = newBoard.props["SIZEX"];
	var sizeY = newBoard.props["SIZEY"];
	ZZTLoader.setUpGrid(sizeX, sizeY);

	// Copy board grids to working grid.
	var csr = 0;
	for (var y = 0; y < sizeY; y++)
	{
		for (var x = 0; x < sizeX; x++)
		{
			SE.setType(x + 1, y + 1, newBoard.typeBuffer.b[csr]);
			SE.setColor(x + 1, y + 1, newBoard.colorBuffer.b[csr], false);
			SE.setLit(x + 1, y + 1, newBoard.lightBuffer.b[csr]);
			SE.setStatElemAt(x + 1, y + 1, null);
			csr++;
		}
	}

	// Update status element linkages.
	for (var i = 0; i < newBoard.statElem.length; i++)
	{
		var se = newBoard.statElem[i];
		if (se.FLAGS & interp.FL_GHOST)
			continue;

		if (SE.getStatElemAt(se.X, se.Y) != null)
		{
			// This is usually from a bug in the editor.  "Kill" the secondary
			// status element to prevent it from resulting in odd "duplication."
			console.log("WARNING:  Multiple statElem at: ", se.X, se.Y);
			se.FLAGS = interp.FL_IDLE | interp.FL_LOCKED | interp.FL_DEAD;
		}
		else
		{
			SE.setStatElemAt(se.X, se.Y, se);
		}
	}
};

static saveBoardState(saveType) {
	// Get board number.  We can't save the title screen because of
	// continuity constraints; it is forward-only while the world is open.
	// All other boards can be saved.
	var boardNum = zzt.globalProps["BOARD"];
	if (boardNum == 0)
		return;

	// Register existing board state.
	ZZTLoader.registerBoardState();

	// Get latest board; archive this as the "official" save state
	// that shows up in the restore interface.
	var oldBoard = ZZTLoader.latestBoardState(boardNum);
	oldBoard.saveIndex = ZZTLoader.currentBoardSaveIndex;
	oldBoard.saveType = saveType;

	// Make copy and advance save index.
	var newBoard = ZZTLoader.copyBoardState(oldBoard, true);
	newBoard.saveIndex = ++ZZTLoader.currentBoardSaveIndex;
	newBoard.saveType = -1;
	ZZTLoader.saveStates.push(newBoard);

	// Set the global containers to reflect newly copied board state.
	zzt.boardProps = newBoard.props;
	zzt.regions = newBoard.regions;
	zzt.statElem = newBoard.statElem;
	SE.statElem = newBoard.statElem;
	SE.statLessCount = newBoard.statLessCount;
	interp.playerSE = newBoard.playerSE;
	if (newBoard.playerSE)
		zzt.globals["$PLAYER"] = newBoard.playerSE.myID;

	// Purge status element linkages.
	var sizeX = newBoard.props["SIZEX"];
	var sizeY = newBoard.props["SIZEY"];
	for (var y = 0; y < sizeY; y++)
	{
		for (var x = 0; x < sizeX; x++)
			SE.setStatElemAt(x + 1, y + 1, null);
	}

	// Freshen status element linkages for newly copied board state.
	for (var i = 0; i < newBoard.statElem.length; i++)
	{
		var se = newBoard.statElem[i];
		if ((se.FLAGS & (interp.FL_DEAD | interp.FL_GHOST)) == 0)
			SE.setStatElemAt(se.X, se.Y, se);
	}

	//console.log("Saved board:  ", boardNum, saveType, currentBoardSaveIndex);
};

static restoreToState(sIndex) {
	var bState = ZZTLoader.saveStates[sIndex];
	console.log("restore to state:  ", sIndex, bState.saveIndex, bState.boardIndex);

	// Register current state before snapshot restore
	if (zzt.globalProps["BOARD"] == 0)
		ZZTLoader.registerBoardState();
	else
		ZZTLoader.registerBoardState();

	// Wipe the board state information beyond this state.
	ZZTLoader.wipeBoardStates(bState.saveIndex);

	// Rewind zap record to appropriate level.
	ZZTLoader.rewindZapRecord(bState.saveIndex);

	// Set the global variables and world properties to specific state.
	ZZTLoader.resetGlobalProps(bState);

	// Switch to the board represented by the state.
	zzt.globalProps["BOARD"] = -1;
	ZZTLoader.switchBoard(bState.boardIndex);
	ZZTLoader.currentBoardSaveIndex++;
	ZZTLoader.switchBoard(bState.boardIndex);

	for (var i = 0; i < ZZTLoader.saveStates.length; i++) {
		bState = ZZTLoader.saveStates[i];
		console.log("State remaining:  ", bState.saveType, bState.saveIndex, bState.boardIndex);
	}
};

static copyBaseBoard(boardNum) {
	//console.log("base board copy:  " + boardNum);
	var bBoard = ZZTLoader.copyBoardState(ZZTLoader.boardData[boardNum]);
	bBoard.saveIndex = ZZTLoader.currentBoardSaveIndex;
	ZZTLoader.saveStates.push(bBoard);

	return bBoard;
};

static copyBoardState(srcBoard, fromCurrent=false) {
	// Create new board object, which clones the source.
	var b = new ZZTBoard();
	var sizeX = srcBoard.props["SIZEX"];
	var sizeY = srcBoard.props["SIZEY"];

	// Copy working grid to board grids.
	var totalSquares = sizeX * sizeY;
	b.typeBuffer = new ByteArray(totalSquares);
	b.colorBuffer = new ByteArray(totalSquares);
	b.lightBuffer = new ByteArray(totalSquares);
	b.typeBuffer.writeBytes(srcBoard.typeBuffer, 0, sizeX * sizeY);
	b.colorBuffer.writeBytes(srcBoard.colorBuffer, 0, sizeX * sizeY);
	b.lightBuffer.writeBytes(srcBoard.lightBuffer, 0, sizeX * sizeY);

	if (fromCurrent)
	{
		// If copying from real-time snapshot, copy working grid to board grids.
		var csr = 0;
		for (var y = 0; y < sizeY; y++)
		{
			for (var x = 0; x < sizeX; x++)
			{
				b.typeBuffer.b[csr] = SE.getType(x + 1, y + 1);
				b.colorBuffer.b[csr] = SE.getColor(x + 1, y + 1);
				b.lightBuffer.b[csr] = SE.getLit(x + 1, y + 1);
				csr++;
			}
		}
	}

	// Create copies of board properties and regions.
	b.props = {};
	b.regions = {};
	for (var k in srcBoard.props)
		b.props[k] = srcBoard.props[k];
	for (k in srcBoard.regions)
		b.regions[k] = srcBoard.regions[k];

	var oldGridWidth = SE.gridWidth;
	var oldGridHeight = SE.gridHeight;
	ZZTLoader.setUpGrid(srcBoard.props["SIZEX"], srcBoard.props["SIZEY"], true);

	// Remember old player's location
	var oldPlayerSE = fromCurrent ? interp.playerSE : srcBoard.playerSE;

	// Status elements require deep copies.
	srcBoard.statElementCount = srcBoard.statElem.length;
	b.statElem = [];
	var pIdx = -1;
	for (var i = 0; i < srcBoard.statElementCount; i++)
	{
		var oldSE = srcBoard.statElem[i];
		if (oldSE.FLAGS & interp.FL_DEAD)
			continue;

		// Remember new player's index
		if (oldSE == oldPlayerSE)
			pIdx = b.statElem.length;

		var se = new SE(oldSE.TYPE, oldSE.X, oldSE.Y,
			SE.getColor(oldSE.X, oldSE.Y), true);
		se.CYCLE = oldSE.CYCLE;
		se.STEPX = oldSE.STEPX;
		se.STEPY = oldSE.STEPY;
		se.UNDERID = oldSE.UNDERID;
		se.UNDERCOLOR = oldSE.UNDERCOLOR;
		se.IP = oldSE.IP;
		se.FLAGS = oldSE.FLAGS;
		se.delay = oldSE.delay;
		se.myID = oldSE.myID;
		for (k in oldSE.extra)
			se.extra[k] = oldSE.extra[k];

		// Add SE to container.
		b.statElem.push(se);
	}

	ZZTLoader.setUpGrid(oldGridWidth, oldGridHeight, true);
	b.statElementCount = b.statElem.length;
	b.statLessCount = srcBoard.statLessCount;
	b.playerSE = (pIdx == -1) ? null : b.statElem[pIdx];

	// Set timestamp.
	var d = new Date();
	b.saveStamp = srcBoard.props["BOARDNAME"] + " : " + d.toTimeString();
	b.saveIndex = srcBoard.saveIndex;
	b.saveType = -1;
	b.boardIndex = srcBoard.boardIndex;

	// Save snapshot of world properties and global variables.
	// Although not strictly related to the board itself, the
	// snapshot is necessary for restoration purposes.
	b.worldProps = {};
	b.worldVars = {};
	for (k in zzt.globalProps)
		b.worldProps[k] = zzt.globalProps[k];
	for (k in zzt.globals)
		b.worldVars[k] = zzt.globals[k];

	// Return cloned board.
	return b;
};

static readExtendedASCIIString(b, len) {
	return b.readASCIIBytes(len);
};

static writeExtendedASCIIString(s) {
	var ba = new ByteArray();
	ba.writeASCIIBytes(s);
	return ba;
};

static writeUTFString(s) {
	var ba = new ByteArray();
	ba.writeUTFBytes(s);
	return ba;
};

static swapTypeNumbers(toNumbers) {
	for (var i = 0; i < ZZTLoader.boardData.length; i++) {
		var bd = ZZTLoader.boardData[i];

		// Update main grid type IDs.
		for (var j = 0; j < bd.typeBuffer.length; j++) {
			if (toNumbers)
				bd.typeBuffer.b[j] = zzt.typeList[bd.typeBuffer.b[j]].NUMBER;
			else
				bd.typeBuffer.b[j] = interp.typeTrans[bd.typeBuffer.b[j]];
		}

		// Update status element TYPEs and UNDERIDs.
		for (j = 0; j < bd.statElem.length; j++)
		{
			var se = bd.statElem[j];
			if (toNumbers)
			{
				se.TYPE = zzt.typeList[se.TYPE].NUMBER;
				se.UNDERID = zzt.typeList[se.UNDERID].NUMBER;
			}
			else
			{
				se.TYPE = interp.typeTrans[se.TYPE];
				se.UNDERID = interp.typeTrans[se.UNDERID];
			}
		}
	}
};

static resetSEIDs() {
	interp.nextObjPtrNum = 65536;

	for (var i = 0; i < ZZTLoader.boardData.length; i++) {
		var bd = ZZTLoader.boardData[i];

		// Update status element TYPEs and UNDERIDs.
		bd.props["$PLAYER"] = 0;
		for (var j = 0; j < bd.statElem.length; j++)
			bd.statElem[j].myID = 0;
	}
};

static saveWAD(destFile=".WAD", oneLevel=-1, isPwad=false) {
	// See if any extra GUIs, masks, and sound FX present.
	var numExtraGuis = 0;
	for (var key in ZZTLoader.extraGuis)
		numExtraGuis++;

	var numExtraSoundFX = 0;
	for (key in ZZTLoader.extraSoundFX)
		numExtraSoundFX++;

	var numExtraMasks = 0;
	for (key in ZZTLoader.extraMasks)
		numExtraMasks++;

	// Calculate fundamental lengths.
	var totalBoards = (oneLevel == -1) ? zzt.globalProps["NUMBOARDS"] : 1;
	var totalLumps = 4 + interp.unCompCode.length + (totalBoards * 4) +
		(numExtraGuis > 0 ? 1 : 0) + (zzt.extraTypeList.length > 0 ? 1 : 0) +
		(numExtraSoundFX > 0 ? 1 : 0) + (numExtraMasks > 0 ? 1 : 0) + ZZTLoader.extraLumps.length;
	var nextLumpOffset = 12 + (totalLumps * 16);

	// Create file header.
	ZZTLoader.file = new ByteArray();
	//ZZTLoader.file.endian = Endian.LITTLE_ENDIAN;
	ZZTLoader.file.writeUTFBytes(isPwad ? "PWAD" : "IWAD");
	ZZTLoader.file.writeInt(totalLumps);
	ZZTLoader.file.writeInt(12);

	// We keep things simple by always placing the directory at the start of
	// the file (although it could be anywhere).

	// Pre-populate important world properties.
	var isSave = Boolean(
		destFile.substr(destFile.length - 4).toUpperCase() == ".SAV");
	if (!isPwad)
	{
		zzt.globalProps["HIGHESTOBJPTR"] = isSave ? interp.nextObjPtrNum : 65536;
		zzt.globalProps["ISSAVEGAME"] = isSave ? 1 : 0;
	}

	// Get string equivalents of world properties, global vars.
	var worldStr;
	if (isSave)
		worldStr = parse.jsonToText(zzt.globalProps);
	else
		worldStr = parse.jsonToText(zzt.globalProps, true, "DEP_");

	var worldStrBytes = ZZTLoader.writeUTFString(worldStr);
	ZZTLoader.file.writeInt(nextLumpOffset);
	ZZTLoader.file.writeInt(worldStrBytes.length);
	ZZTLoader.file.writeUTFBytes("WORLDHDR");
	nextLumpOffset += worldStrBytes.length;

	var globalStr;
	if (isSave)
		globalStr = parse.jsonToText(zzt.globals);
	else
		globalStr = parse.jsonToText(zzt.globals, true, "$");

	var globalStrBytes = ZZTLoader.writeUTFString(globalStr);
	ZZTLoader.file.writeInt(nextLumpOffset);
	ZZTLoader.file.writeInt(globalStrBytes.length);
	ZZTLoader.file.writeUTFBytes("GLOBALS ");
	nextLumpOffset += globalStrBytes.length;

	// Make a copy of the type map array.
	var typeMapArr = new ByteArray(256);
	for (var ba = 0; ba < 256; ba++)
		typeMapArr.b[ba] = interp.typeTrans[ba];

	ZZTLoader.file.writeInt(nextLumpOffset);
	ZZTLoader.file.writeInt(256);
	ZZTLoader.file.writeUTFBytes("TYPEMAP ");
	nextLumpOffset += 256;

	// Playback string composite is fetched from existing queues.
	var playbackStr = Sounds.getQueueComposite();
	ZZTLoader.file.writeInt(nextLumpOffset);
	ZZTLoader.file.writeInt(playbackStr.length);
	ZZTLoader.file.writeUTFBytes("PLAYBACK");
	nextLumpOffset += playbackStr.length;

	// Account for extra sound FX, if any.
	var extraSoundFXStr = "";
	if (numExtraSoundFX > 0)
	{
		extraSoundFXStr = parse.jsonToText(ZZTLoader.extraSoundFX);
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(extraSoundFXStr.length);
		ZZTLoader.file.writeUTFBytes("SOUNDFX ");
		nextLumpOffset += extraSoundFXStr.length;
	}

	// Account for extra masks, if any.
	var extraMasksStr = "";
	if (numExtraMasks > 0)
	{
		extraMasksStr = parse.jsonToText(ZZTLoader.extraMasks);
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(extraMasksStr.length);
		ZZTLoader.file.writeUTFBytes("MASKS   ");
		nextLumpOffset += extraMasksStr.length;
	}

	// Account for extra GUIs, if any.
	var extraGuiBytes = null;
	if (numExtraGuis > 0)
	{
		var extraGuiStr = parse.jsonToText(ZZTLoader.extraGuis);
		extraGuiBytes = ZZTLoader.writeUTFString(extraGuiStr);
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(extraGuiBytes.length);
		ZZTLoader.file.writeUTFBytes("EXTRAGUI");
		nextLumpOffset += extraGuiBytes.length;
	}

	// Account for extra types, if any.
	var extraTypeListStr = "";
	if (zzt.extraTypeList.length > 0)
	{
		extraTypeListStr = "{\n";
		for (var et = 0; et < zzt.extraTypeList.length; et++) {
			var eInfo = zzt.extraTypeList[et];

			var eStr = eInfo.toString();
			if (zzt.extraTypeCode.hasOwnProperty(eInfo.NAME))
				eStr += "\"" + zzt.markUpCodeQuotes(zzt.extraTypeCode[eInfo.NAME]) + "\"\n}";
			else
				eStr += "\"\n#END\n\"\n}";

			extraTypeListStr += eStr;

			if (et < zzt.extraTypeList.length - 1)
				extraTypeListStr += ",\n";
			else
				extraTypeListStr += "\n}";
		}

		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(extraTypeListStr.length);
		ZZTLoader.file.writeUTFBytes("EXTRATYP");
		nextLumpOffset += extraTypeListStr.length;
	}

	// Before handling uncompiled custom object code,
	// ensure that zap record modifications are logged.
	ZZTLoader.applyZapRecord();

	// Get total size of uncompiled custom object code.
	for (var c = 0; c < interp.unCompCode.length; c++)
	{
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(interp.unCompCode[c].length);
		ZZTLoader.file.writeUTFBytes("CUSTCODE");
		nextLumpOffset += interp.unCompCode[c].length;
	}

	// For each board, collect board properties, board regions,
	// board status elements, and board RLE streams.
	var boardStorage = [];
	for (var i = 0; i < totalBoards; i++)
	{
		var bNum = (oneLevel == -1) ? i : oneLevel;
		var b = ZZTLoader.latestBoardState(bNum, true);

		var sizeX = b.props["SIZEX"];
		var sizeY = b.props["SIZEY"];
		b.props["$PLAYER"] = (b.playerSE == null) ? 0 : b.playerSE.myID;

		// Board properties
		var boardPropStr = parse.jsonToText(b.props);
		var boardPropStrBytes = ZZTLoader.writeUTFString(boardPropStr);
		boardStorage.push(boardPropStrBytes);
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(boardPropStrBytes.length);
		ZZTLoader.file.writeUTFBytes("BOARDHDR");
		nextLumpOffset += boardPropStrBytes.length;

		// Board regions
		var boardRegionStr = parse.jsonToText(b.regions);
		boardStorage.push(boardRegionStr);
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(boardRegionStr.length);
		ZZTLoader.file.writeUTFBytes("BOARDRGN");
		nextLumpOffset += boardRegionStr.length;

		// Board status elements
		var boardStatElem = [];
		for (var j = 0; j < b.statElem.length; j++)
		{
			// SE members are only stored if they are needed, and
			// if they differ from their defaults.
			var s = {};
			var oldS = b.statElem[j];
			eInfo = SE.typeList[oldS.TYPE];

			s["X"] = oldS.X;
			s["Y"] = oldS.Y;
			if (oldS.TYPE == 0)
			{
				// Deleted SE (used with PWADs)
				s["TYPE"] = 0;
			}
			else
			{
				// Normal SE
				s["IP"] = oldS.IP;
				s["FLAGS"] = oldS.FLAGS;
				s["delay"] = oldS.delay;
				if (isSave)
					s["myID"] = oldS.myID;
				if (oldS.UNDERID != 0)
					s["UNDERID"] = SE.typeList[oldS.UNDERID].NUMBER;
				if (oldS.UNDERCOLOR != 0)
					s["UNDERCOLOR"] = oldS.UNDERCOLOR;
				if (eInfo.CYCLE != oldS.CYCLE)
					s["CYCLE"] = oldS.CYCLE;
				if (eInfo.STEPX != oldS.STEPX)
					s["STEPX"] = oldS.STEPX;
				if (eInfo.STEPY != oldS.STEPY)
					s["STEPY"] = oldS.STEPY;

				for (var e in oldS.extra) {
					if (e != "$CODE" || oneLevel != -1)
						s[e] = oldS.extra[e];
				}
			}

			boardStatElem[j] = s;
		}

		var boardStatElemStr = parse.jsonToText(boardStatElem);
		var boardStatElemStrBytes = ZZTLoader.writeUTFString(boardStatElemStr);
		boardStorage.push(boardStatElemStrBytes);
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(boardStatElemStrBytes.length);
		ZZTLoader.file.writeUTFBytes("STATELEM");
		nextLumpOffset += boardStatElemStrBytes.length;

		// Board RLE data
		var totalSquares = sizeX * sizeY;

		// First RLE is type info
		var lastVal = -1;
		var baseLoc = 0;
		var rleData = new ByteArray();
		var count = 0;
		var k = 0;
		while (k < totalSquares)
		{
			var typ = b.typeBuffer.b[k];
			if (k + 4 <= totalSquares)
			{
				// We only use RLE if there is at least a sequence of 4.
				// If 2 or 3, no compression is realized, so it is best ignored.
				if (typ == b.typeBuffer.b[k+1] && typ == b.typeBuffer.b[k+2] &&
					typ == b.typeBuffer.b[k+3])
				{
					// Write previous run
					if (count < 0)
					{
						rleData.writeByte(count);
						rleData.writeBytes(b.typeBuffer, baseLoc, -count);
					}

					// Capture repeated sequence
					count = 4;
					lastVal = typ;
					k += 4;
					while (k < totalSquares && count < 127)
					{
						typ = b.typeBuffer.b[k];
						if (typ != lastVal)
							break;
						k++;
						count++;
					}

					// Set next base location and write repeated sequence
					rleData.writeByte(count);
					rleData.writeByte(lastVal);
					baseLoc = k;
					count = 0;
					continue;
				}
			}

			// Advance beyond run
			k++;
			count--;

			// Write run if at end, or if size is large enough
			if (k >= totalSquares || count <= -128)
			{
				rleData.writeByte(count);
				rleData.writeBytes(b.typeBuffer, baseLoc, -count);
				baseLoc = k;
				count = 0;
			}
		}

		// Next RLE is foreground color
		lastVal = -1;
		k = 0;
		while (k < totalSquares)
		{
			count = 1;
			lastVal = b.colorBuffer.b[k++] & 15;
			while (count < 16 && k < totalSquares)
			{
				var col = b.colorBuffer.b[k] & 15;
				if (col != lastVal)
					break;
				count++;
				k++;
			}

			// Write mixture of color and count
			rleData.writeByte(lastVal | (((count-1) & 15) << 4));
		}

		// Next RLE is background color
		lastVal = -1;
		k = 0;
		while (k < totalSquares)
		{
			count = 1;
			lastVal = b.colorBuffer.b[k++] & 240;
			while (count < 16 && k < totalSquares)
			{
				col = b.colorBuffer.b[k] & 240;
				if (col != lastVal)
					break;
				count++;
				k++;
			}

			// Write mixture of color and count
			rleData.writeByte(((lastVal >> 4) & 15) | (((count-1) & 15) << 4));
		}

		// Next RLE is lighting
		if (!b.props["ISDARK"])
		{
			rleData.writeByte(0);
		}
		else
		{
			rleData.writeByte(1);
			lastVal = -1;
			k = 0;
			while (k < totalSquares)
			{
				count = 0;
				while (count < 255)
				{
					if (b.lightBuffer.b[k])
						break;
					count++;
					k++;
				}
				rleData.writeByte(count);

				count = 0;
				while (count < 255)
				{
					if (!b.lightBuffer.b[k])
						break;
					count++;
					k++;
				}
				rleData.writeByte(count);
			}
		}

		boardStorage.push(rleData);
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(rleData.length);
		ZZTLoader.file.writeUTFBytes("BOARDRLE");
		nextLumpOffset += rleData.length;
	}

	// Write extra lump directory entries.
	for (i = 0; i < ZZTLoader.extraLumps.length; i++) {
		ZZTLoader.file.writeInt(nextLumpOffset);
		ZZTLoader.file.writeInt(ZZTLoader.extraLumps[i].len);
		ZZTLoader.file.writeUTFBytes(ZZTLoader.extraLumps[i].name);
		nextLumpOffset += ZZTLoader.extraLumps[i].len;
	}

	// With all lump directory entries written, proceed to write actual lumps.
	ZZTLoader.file.writeBytes(worldStrBytes);
	ZZTLoader.file.writeBytes(globalStrBytes);
	ZZTLoader.file.writeBytes(typeMapArr);
	ZZTLoader.file.writeUTFBytes(playbackStr);

	if (numExtraSoundFX > 0)
		ZZTLoader.file.writeUTFBytes(extraSoundFXStr);

	if (numExtraMasks > 0)
		ZZTLoader.file.writeUTFBytes(extraMasksStr);

	if (numExtraGuis > 0)
		ZZTLoader.file.writeBytes(extraGuiBytes);

	if (zzt.extraTypeList.length > 0)
		ZZTLoader.file.writeUTFBytes(extraTypeListStr);

	for (c = 0; c < interp.unCompCode.length; c++)
	{
		//file.writeUTFBytes(interp.unCompCode[c]);
		ZZTLoader.file.writeUTFBytes(interp.unCompCode[c]);
	}

	j = 0;
	for (i = 0; i < totalBoards; i++)
	{
		ZZTLoader.file.writeBytes(boardStorage[j++]); // BOARDHDR
		ZZTLoader.file.writeUTFBytes(boardStorage[j++]); // BOARDRGN
		ZZTLoader.file.writeBytes(boardStorage[j++]); // STATELEM
		ZZTLoader.file.writeBytes(boardStorage[j++]); // BOARDRLE
	}

	for (i = 0; i < ZZTLoader.extraLumps.length; i++) {
		ZZTLoader.file.writeBytes(ZZTLoader.extraLumpBinary[i]);
	}

	// Data is ready in "file" static member.
	return true;
};

static isNativeLump(str) {
	if (str == "WORLDHDR" || str == "GLOBALS " || str == "TYPEMAP " || str == "PLAYBACK" ||
		str == "EXTRATYP" || str == "EXTRAGUI" || str == "SOUNDFX " || str == "MASKS   " ||
		str == "CUSTCODE" || str == "BOARDHDR" || str == "BOARDRGN" || str == "BOARDRLE" ||
		str == "STATELEM")
		return true;

	return false;
};

static establishWADFile(b, isImport=false) {
	// If importing a board, loaded code blocks will be stacked on top of current blocks
	var codeIDBase = interp.codeBlocks.length;
	var unCompCodeIDBase = interp.unCompCode.length;

	if (!isImport)
	{
		// Strip out non-built-in code blocks
		interp.unCompCode = [];
		interp.unCompStart = [];
		interp.numBuiltInCodeBlocksPlus = interp.numBuiltInCodeBlocks;
		if (interp.codeBlocks.length > interp.numBuiltInCodeBlocks)
			interp.codeBlocks.length = interp.numBuiltInCodeBlocks;

		// Reset types back to defaults
		zzt.resetTypes();
	}

	// Read file header.
	ZZTLoader.file = b;
	//ZZTLoader.file.endian = Endian.LITTLE_ENDIAN;

	if (ZZTLoader.readExtendedASCIIString(ZZTLoader.file, 4) != "IWAD")
	{
		// This is an error--we can only take an IWAD.
		// PWADs, if used, are handled differently.
		zzt.Toast("File is not an IWAD.");
		return false;
	}
	var totalLumps = ZZTLoader.file.readInt();
	ZZTLoader.position = ZZTLoader.file.readInt();

	// Read directory entries.  ZZT Ultra always writes a WAD with the
	// directory at the start, but we must allow for the possibility of
	// the directory being located anywhere.
	var lumps = [];
	ZZTLoader.extraLumps = [];
	for (var i = 0; i < totalLumps; i++)
	{
		var pos = ZZTLoader.file.readInt(ZZTLoader.file);
		var len = ZZTLoader.file.readInt(ZZTLoader.file);
		var str = ZZTLoader.readExtendedASCIIString(ZZTLoader.file, 8);
		var nLump = new Lump(pos, len, str);
		lumps.push(nLump);

		if (!ZZTLoader.isNativeLump(str))
			ZZTLoader.extraLumps.push(nLump);
	}

	// Read all extra lump binaries.
	for (i = 0; i < ZZTLoader.extraLumps.length; i++) {
		ZZTLoader.extraLumpBinary.push(ZZTLoader.extraLumps[i].getLumpBytes(ZZTLoader.file));
	}

	// Read type map array.
	var lump;
	lump = Lump.search(lumps, "TYPEMAP ", 0);
	if (!lump)
	{
		zzt.Toast("Bad/missing TYPEMAP.");
		return false;
	}
	var typeMapArr = lump.getLumpBytes(ZZTLoader.file);

	if (!isImport)
	{
		// Read world header.
		lump = Lump.search(lumps, "WORLDHDR", 0);
		if (!lump)
		{
			zzt.Toast("Bad/missing WORLDHDR.");
			return false;
		}
		
		zzt.globalProps = parse.jsonDecode(lump.getLumpStr(ZZTLoader.file), "ALL");
		Sounds.globalProps = zzt.globalProps;

		if (zzt.globalProps.hasOwnProperty("HIGHESTOBJPTR"))
			interp.nextObjPtrNum = zzt.globalProps["HIGHESTOBJPTR"];

		// Read global variables.
		lump = Lump.search(lumps, "GLOBALS ", 0);
		if (!lump)
		{
			zzt.Toast("Bad/missing GLOBALS.");
			return false;
		}
		zzt.globals = parse.jsonDecode(lump.getLumpStr(ZZTLoader.file), "ALL");

		// Ensure default properties are present if not defined within WAD.
		for (var k in ZZTProp.defaultPropsWAD) {
			if (!zzt.globalProps.hasOwnProperty(k))
				zzt.globalProps[k] = ZZTProp.defaultPropsWAD[k];
		}

		for (k in ZZTProp.overridePropsGeneral) {
			if (!zzt.globalProps.hasOwnProperty(k))
				zzt.globalProps[k] = ZZTProp.overridePropsGeneral[k];
		}

		// The version number is a forced override.
		interp.forceRegionLiteral = Boolean(utils.float0(zzt.globalProps["VERSION"]) < 1.2);
		zzt.globalProps["VERSION"] = ZZTProp.defaultPropsGeneral["VERSION"];

		// Update master volume.
		Sounds.setMasterVolume(zzt.globalProps["MASTERVOLUME"]);

		// Update scroll interface colors.
		zzt.setScrollColors(zzt.globalProps["SCRCOLBORDER"],
		zzt.globalProps["SCRCOLSHADOW"], zzt.globalProps["SCRCOLBG"],
		zzt.globalProps["SCRCOLTEXT"], zzt.globalProps["SCRCOLCENTERTEXT"],
		zzt.globalProps["SCRCOLBUTTON"], zzt.globalProps["SCRCOLARROW"]);

		// Setting SCORE as a property is a sneaky way to cheat (it doesn't work).
		if (zzt.CHEATING_DISABLES_PROGRESS && ZZTProp.overridePropsGeneral.hasOwnProperty("SCORE"))
			zzt.DISABLE_HISCORE = 1;
	}

	if (!isImport)
	{
		// Read and set up extra types, if present.
		lump = Lump.search(lumps, "EXTRATYP", 0);
		if (lump)
		{
			var extraTypeStr = lump.getLumpStr(ZZTLoader.file);
			var jObj = parse.jsonDecode(extraTypeStr, "ALL");
			zzt.establishExtraTypes(jObj);
		}
		else
			zzt.establishExtraTypes({});
	}

	// Fashion type-to-type translation table.
	var type2TypeMap = new ByteArray(256);
	for (i = 0; i < typeMapArr.length; i++)
	{
		var typeOld = typeMapArr.b[i];
		var typeNew = interp.typeTrans[i];
		if (typeOld == 0)
			typeNew = 0;
		type2TypeMap.b[typeOld] = typeNew;
	}

	if (!isImport)
	{
		// Read playback string composite, if present.
		lump = Lump.search(lumps, "PLAYBACK", 0);
		if (lump)
		{
			var playbackStr = lump.getLumpStr(ZZTLoader.file);
			// TBD:  restart BGM
		}

		// Read sound effects bank, if present.
		lump = Lump.search(lumps, "SOUNDFX ", 0);
		if (lump)
		{
			var soundFxStr = lump.getLumpStr(ZZTLoader.file);
			ZZTLoader.extraSoundFX = parse.jsonDecode(soundFxStr, "ALL");
			for (k in ZZTLoader.extraSoundFX)
				zzt.soundFx[k] = ZZTLoader.extraSoundFX[k];
		}

		// Read extra masks bank, if present.
		lump = Lump.search(lumps, "MASKS   ", 0);
		if (lump)
		{
			var maskStr = lump.getLumpStr(ZZTLoader.file);
			ZZTLoader.extraMasks = parse.jsonDecode(maskStr, "ALL");
			for (k in ZZTLoader.extraMasks)
				zzt.addMask(k, ZZTLoader.extraMasks[k]);
		}

		// Read and set up extra GUIs, if present.
		lump = Lump.search(lumps, "EXTRAGUI", 0);
		if (lump)
		{
			var extraGuiStr = lump.getLumpStr(ZZTLoader.file);
			ZZTLoader.extraGuis = parse.jsonDecode(extraGuiStr, "Text");
			for (k in ZZTLoader.extraGuis)
				zzt.guiStorage[k] = ZZTLoader.extraGuis[k];
		}
	}

	// Get uncompiled custom object code; compile it.
	ZZTLoader.customONAME = {};
	Lump.resetSearch();
	lump = Lump.search(lumps, "CUSTCODE");
	while (lump) {
		var codeStr = lump.getLumpExtendedASCIIStr(ZZTLoader.file);
		interp.unCompCode.push(codeStr);

		var eLoc = codeStr.indexOf(zzt.globalProps["CODEDELIMETER"]);
		var codeSrcType = codeStr.substr(0, eLoc);
		var unCompCodeId = interp.typeTrans2(utils.int(codeSrcType));
		codeStr = codeStr.substr(eLoc+1);
		interp.unCompStart.push(eLoc+1);

		// Compile custom code.
		var newCodeId = zzt.compileCustomCode(
			SE.typeList[unCompCodeId], codeStr, zzt.globalProps["CODEDELIMETER"]);

		if (oop.lastAssignedName != "")
			ZZTLoader.customONAME[newCodeId.toString()] = oop.lastAssignedName;

		// Next code block
		lump = Lump.search(lumps, "CUSTCODE");
	}

	// Establish board lumps.
	var totalBoards = isImport ? 1 : zzt.globalProps["NUMBOARDS"];
	var bHdrLumps = [];
	var bRgnLumps = [];
	var bSELumps = [];
	var bRLELumps = [];

	Lump.resetSearch();
	for (i = 0; i < totalBoards; i++)
	{
		lump = Lump.search(lumps, "BOARDHDR");
		if (!lump)
		{
			zzt.Toast("Bad/missing BOARDHDR at postion " + i.toString());
			return false;
		}
		bHdrLumps.push(lump);
	}
	Lump.resetSearch();
	for (i = 0; i < totalBoards; i++)
	{
		lump = Lump.search(lumps, "BOARDRGN");
		if (!lump)
		{
			zzt.Toast("Bad/missing BOARDRGN at postion " + i.toString());
			return false;
		}
		bRgnLumps.push(lump);
	}
	Lump.resetSearch();
	for (i = 0; i < totalBoards; i++)
	{
		lump = Lump.search(lumps, "STATELEM");
		if (!lump)
		{
			zzt.Toast("Bad/missing STATELEM at postion " + i.toString());
			return false;
		}
		bSELumps.push(lump);
	}
	Lump.resetSearch();
	for (i = 0; i < totalBoards; i++)
	{
		lump = Lump.search(lumps, "BOARDRLE");
		if (!lump)
		{
			zzt.Toast("Bad/missing BOARDRLE at postion " + i.toString());
			return false;
		}
		bRLELumps.push(lump);
	}

	// For each board, reconstitute ZZTBoard instances.
	if (isImport)
		ZZTLoader.boardData.push(null);
	else
		ZZTLoader.boardData = [];

	for (i = 0; i < totalBoards; i++)
	{
		// Create new board storage object.
		ZZTLoader.board = new ZZTBoard();
		ZZTLoader.board.saveStamp = "init";
		ZZTLoader.board.saveIndex = 0;
		ZZTLoader.board.saveType = -1;
		ZZTLoader.board.boardIndex = i;

		// Reinstate board properties and regions.
		ZZTLoader.board.props = parse.jsonDecode(bHdrLumps[i].getLumpStr(ZZTLoader.file));
		ZZTLoader.board.regions = parse.jsonDecode(bRgnLumps[i].getLumpStr(ZZTLoader.file));

		// Load RLE data.
		var rleData = bRLELumps[i].getLumpBytes(ZZTLoader.file);
		var sizeX = ZZTLoader.board.props["SIZEX"];
		var sizeY = ZZTLoader.board.props["SIZEY"];
		var totalSquares = sizeX * sizeY;
		ZZTLoader.ensureGridSpace(sizeX, sizeY);
		ZZTLoader.board.typeBuffer = new ByteArray(totalSquares);
		ZZTLoader.board.colorBuffer = new ByteArray(totalSquares);
		ZZTLoader.board.lightBuffer = new ByteArray(totalSquares);
		ZZTLoader.position = 0;

		// First RLE is type info
		for (var c = 0; c < totalSquares;)
		{
			len = rleData.readByte();
			if (len < 0)
			{
				// Run
				while (len++ < 0)
					ZZTLoader.board.typeBuffer.b[c++] = type2TypeMap.b[rleData.readUnsignedByte()];
			}
			else if (len > 0)
			{
				// Rep
				var repByte = type2TypeMap.b[rleData.readUnsignedByte()];
				while (len-- > 0)
					ZZTLoader.board.typeBuffer.b[c++] = repByte;
			}
			else
			{
				// End
				while (c < totalSquares)
					ZZTLoader.board.typeBuffer.b[c++] = 0;
				break;
			}
		}

		// Next RLE is foreground color
		for (c = 0; c < totalSquares;)
		{
			repByte = rleData.readUnsignedByte();
			len = (repByte >> 4) & 15;
			while (len-- >= 0)
				ZZTLoader.board.colorBuffer.b[c++] = repByte & 15;
		}

		// Next RLE is background color
		for (c = 0; c < totalSquares;)
		{
			repByte = rleData.readUnsignedByte();
			len = (repByte >> 4) & 15;
			while (len-- >= 0)
				ZZTLoader.board.colorBuffer.b[c++] |= (repByte & 15) << 4;
		}

		// Next RLE is lighting
		c = 0;
		repByte = rleData.readUnsignedByte();
		if (repByte != 0)
		{
			// Light buffer is present
			for (; c < totalSquares;)
			{
				// Unlit region
				len = rleData.readUnsignedByte();
				while (len-- > 0)
					ZZTLoader.board.lightBuffer.b[c++] = 0;

				// Lit region
				len = rleData.readUnsignedByte();
				if (len == 0)
				break; // Early-out
				while (len-- > 0)
					ZZTLoader.board.lightBuffer.b[c++] = 1;
			}
		}

		// Remainder of light buffer
		while (c < totalSquares)
			ZZTLoader.board.lightBuffer.b[c++] = 0;

		// Board status elements
		var boardStatElem = parse.jsonDecode(bSELumps[i].getLumpStr(ZZTLoader.file));
		ZZTLoader.board.statElem = [];
		ZZTLoader.board.statElementCount = boardStatElem.length;
		ZZTLoader.board.statLessCount = 0;
		ZZTLoader.setUpGrid(sizeX, sizeY, true);

		for (var j = 0; j < ZZTLoader.board.statElementCount; j++)
		{
			// Get stored JSON object; locate grid position
			var s = boardStatElem[j];
			var statElemX = s["X"];
			var statElemY = s["Y"];
			var st = ZZTLoader.board.typeBuffer.b[(statElemY-1) * sizeX + (statElemX-1)];
			var sc = ZZTLoader.board.colorBuffer.b[(statElemY-1) * sizeX + (statElemX-1)];
			var eInfo = SE.typeList[st];

			// Create and populate SE
			var se = new SE(st, statElemX, statElemY, sc, true);
			se.IP = s["IP"];
			se.FLAGS = s["FLAGS"];
			se.delay = s["delay"];
			if (s.hasOwnProperty("myID"))
				se.myID = s["myID"];
			else
				se.myID = ++interp.nextObjPtrNum;

			if (s.hasOwnProperty("UNDERID"))
				se.UNDERID = interp.typeTrans2(s["UNDERID"]);
			else
				se.UNDERID = 0;

			if (s.hasOwnProperty("UNDERCOLOR"))
				se.UNDERCOLOR = s["UNDERCOLOR"];
			else
				se.UNDERCOLOR = 0;

			if (s.hasOwnProperty("CYCLE"))
				se.CYCLE = s["CYCLE"];
			else
				se.CYCLE = eInfo.CYCLE;

			if (s.hasOwnProperty("STEPX"))
				se.STEPX = s["STEPX"];
			else
				se.STEPX = eInfo.STEPX;

			if (s.hasOwnProperty("STEPY"))
				se.STEPY = s["STEPY"];
			else
				se.STEPY = eInfo.STEPY;

			var e;
			for (e in s)
			{
				if (!se.hasOwnProperty(e))
					se.extra[e] = s[e];
			}

			// If next command is a @name, assign ONAME member.
			if ((se.FLAGS & interp.FL_IDLE) == 0 && eInfo.HasOwnCode)
			{
				if (se.extra.hasOwnProperty("CODEID"))
				{
					var codeIdStr = se.extra["CODEID"].toString();
					if (ZZTLoader.customONAME.hasOwnProperty(codeIdStr))
						se.extra["ONAME"] = ZZTLoader.customONAME[codeIdStr];
				}
			}

			ZZTLoader.board.statElem.push(se);
		}

		// Set player SE.  Defaults to first element if can't distinguish ID
		// for some reason (original ZZT and Super ZZT always set player to
		// position zero, so this is reasonably safe).
		if (ZZTLoader.board.statElem.length > 0)
			ZZTLoader.board.playerSE = ZZTLoader.board.statElem[0];
		else
			ZZTLoader.board.playerSE = null;

		for (j = 0; j < ZZTLoader.board.statElem.length; j++)
		{
			if (ZZTLoader.board.statElem[j].myID == ZZTLoader.board.props["$PLAYER"] && ZZTLoader.board.props["$PLAYER"] > 0)
			{
				ZZTLoader.board.playerSE = ZZTLoader.board.statElem[j];
				break;
			}
		}

		if (ZZTLoader.board.playerSE != null)
			ZZTLoader.board.props["$PLAYER"] = ZZTLoader.board.playerSE.myID;

		if (isImport)
			ZZTLoader.boardData[ZZTLoader.boardData.length - 1] = ZZTLoader.board;
		else
			ZZTLoader.boardData.push(ZZTLoader.board);
	}

	// Reset save state container
	ZZTLoader.saveStates = [];
	interp.zapRecord = [];
	ZZTLoader.currentBoardSaveIndex = 0;

	// Retain record of lumps for future indexing purposes
	parse.lumpData = lumps;

	return true;
};

static createDelDicts(pwadDicts, pwadDelDicts) {
	for (var s in pwadDicts) {
		var d = pwadDicts[s];
		var delDict = {};

		// Find keys to delete
		var numDels = 0;
		for (var k in d) {
			if (d[k] == "delete")
			{
				delDict[k] = 1;
				numDels++;
			}
		}

		// If any deletion keys found, add to deletion list
		if (numDels > 0)
		{
			pwadDelDicts[s] = delDict;
			for (k in delDict)
				delete d[k];
		}
	}
};

static replaceDict(d, dSet, dClear) {
	for (var k in dSet)
		d[k] = dSet[k];

	for (k in dClear)
		delete d[k];
};

static createDeltaDict(dSrc, dDest, textReduction=false) {

	// Compare source and dest.
	var dDelta = {};
	for (var k in dSrc) {
		if (dDest.hasOwnProperty(k)) {
			if (textReduction)
			{
				var sSrc = parse.jsonToText(dSrc[k]);
				var sDest = parse.jsonToText(dDest[k]);
				if (sSrc != sDest)
				{
					// Not equal--include replacement in delta.
					dDelta[k] = dDest[k];
				}
			}
			else if (dSrc[k] != dDest[k])
			{
				// Not equal--include replacement in delta.
				dDelta[k] = dDest[k];
			}
		}
		else
		{
			// Deleted
			dDelta[k] = "delete";
		}
	}

	// Retain keys exclusive to destination.
	for (k in dDest) {
		if (!dSrc.hasOwnProperty(k))
			dDelta[k] = dDest[k];
	}

	return dDelta;
};

static registerPWADFile(b, pwadName) {
	ZZTLoader.pwadDicts = {};
	ZZTLoader.pwadDelDicts = {};
	ZZTLoader.pwadBoards = [];
	ZZTLoader.pwadCustCode = [];

	// Read file header.
	var pFile = b;
	ZZTLoader.position = 0;
	//pFile.endian = Endian.LITTLE_ENDIAN;
	if (ZZTLoader.readExtendedASCIIString(pFile, 4) != "PWAD")
	{
		// This is an error--we can only take a PWAD.
		zzt.Toast("File is not a PWAD.");
		return false;
	}
	var totalLumps = pFile.readInt();
	pFile.position = pFile.readInt();

	// Read directory entries.
	var lumps = [];
	var pExtraLumps = [];
	for (var i = 0; i < totalLumps; i++)
	{
		var pos = pFile.readInt();
		var len = pFile.readInt();
		var str = ZZTLoader.readExtendedASCIIString(pFile, 8);
		var nLump = new Lump(pos, len, str);
		lumps.push(nLump);

		if (!ZZTLoader.isNativeLump(str))
			pExtraLumps.push(nLump);
	}

	// Read all extra lump binaries.
	var pExtraLumpBinary = [];
	for (i = 0; i < pExtraLumps.length; i++) {
		pExtraLumpBinary.push(pExtraLumps[i].getLumpBytes(pFile));
	}

	// Read type map array.
	var lump;
	lump = Lump.search(lumps, "TYPEMAP ", 0);
	if (!lump)
	{
		zzt.Toast("Bad/missing TYPEMAP.");
		return false;
	}
	ZZTLoader.pwadTypeMap = lump.getLumpBytes(pFile);

	// Fashion type-to-type translation table.
	var type2TypeMap = new ByteArray(256);
	for (i = 0; i < ZZTLoader.pwadTypeMap.length; i++)
	{
		var typeOld = ZZTLoader.pwadTypeMap.b[i];
		var typeNew = interp.typeTrans[i];
		if (typeOld == 0)
			typeNew = 0;
		type2TypeMap.b[typeOld] = typeNew;
	}

	// Read world header.
	lump = Lump.search(lumps, "WORLDHDR", 0);
	if (lump)
		ZZTLoader.pwadDicts["WORLDHDR"] = parse.jsonDecode(lump.getLumpStr(pFile), "ALL");

	// Read global variables.
	lump = Lump.search(lumps, "GLOBALS ", 0);
	if (lump)
		ZZTLoader.pwadDicts["GLOBALS "] = parse.jsonDecode(lump.getLumpStr(pFile), "ALL");

	// Read extra types, if present.
	lump = Lump.search(lumps, "EXTRATYP", 0);
	if (lump)
		ZZTLoader.pwadDicts["EXTRATYP"] = parse.jsonDecode(lump.getLumpStr(pFile), "ALL");

	// Read sound effects bank, if present.
	lump = Lump.search(lumps, "SOUNDFX ", 0);
	if (lump)
		ZZTLoader.pwadDicts["SOUNDFX "] = parse.jsonDecode(lump.getLumpStr(pFile), "ALL");

	// Read extra masks bank, if present.
	lump = Lump.search(lumps, "MASKS   ", 0);
	if (lump)
		ZZTLoader.pwadDicts["MASKS   "] = parse.jsonDecode(lump.getLumpStr(pFile), "ALL");

	// Read and set up extra GUIs, if present.
	lump = Lump.search(lumps, "EXTRAGUI", 0);
	if (lump)
		ZZTLoader.pwadDicts["EXTRAGUI"] = parse.jsonDecode(lump.getLumpStr(pFile), "Text");

	ZZTLoader.createDelDicts(ZZTLoader.pwadDicts, ZZTLoader.pwadDelDicts);

	// Get uncompiled custom object code.
	Lump.resetSearch();
	lump = Lump.search(lumps, "CUSTCODE");
	while (lump) {
		var codeStr = lump.getLumpExtendedASCIIStr(pFile);
		ZZTLoader.pwadCustCode.push(codeStr);

		// Next code block
		lump = Lump.search(lumps, "CUSTCODE");
	}

	// Establish board lumps.
	var bHdrLumps = [];
	var bRgnLumps = [];
	var bSELumps = [];
	var bRLELumps = [];

	Lump.resetSearch();
	do {
		lump = Lump.search(lumps, "BOARDHDR");
		if (lump)
			bHdrLumps.push(lump);
	} while (lump);

	Lump.resetSearch();
	do {
		lump = Lump.search(lumps, "BOARDRGN");
		if (lump)
			bRgnLumps.push(lump);
	} while (lump);

	Lump.resetSearch();
	do {
		lump = Lump.search(lumps, "STATELEM");
		if (lump)
			bSELumps.push(lump);
	} while (lump);

	Lump.resetSearch();
	do {
		lump = Lump.search(lumps, "BOARDRLE");
		if (lump)
			bRLELumps.push(lump);
	} while (lump);

	// Patched board total only extends as far as lowest count.
	var totalBoards = bHdrLumps.length;
	if (totalBoards > bRgnLumps.length)
		totalBoards = bRgnLumps.length;
	if (totalBoards > bSELumps.length)
		totalBoards = bSELumps.length;
	if (totalBoards > bRLELumps.length)
		totalBoards = bRLELumps.length;
	if (ZZTLoader.pwadDicts.hasOwnProperty("NUMBOARDS"))
	{
		if (totalBoards < ZZTLoader.pwadDicts["NUMBOARDS"])
			totalBoards = ZZTLoader.pwadDicts["NUMBOARDS"];
		delete ZZTLoader.pwadDicts["NUMBOARDS"];
	}

	// Store board patch info.
	for (i = 0; i < totalBoards; i++)
	{
		// Queue storage
		var hdrDict = {};
		var hdrDelDict = {};
		var rgnDict = {};
		var rgnDelDict = {};
		var seArray = [];

		// Get changed board properties and regions
		if (bHdrLumps[i].len > 0)
		{
			hdrDict = parse.jsonDecode(bHdrLumps[i].getLumpStr(pFile));
			ZZTLoader.createDelDicts(hdrDict, hdrDelDict);
		}
		if (bRgnLumps[i].len > 0)
		{
			rgnDict = parse.jsonDecode(bRgnLumps[i].getLumpStr(pFile));
			ZZTLoader.createDelDicts(rgnDict, rgnDelDict);
		}

		// Get changed status elements
		seArray = parse.jsonDecode(bSELumps[i].getLumpStr(pFile));

		// Get RLE sequences
		var sizeX = hdrDict["SIZEX"];
		var sizeY = hdrDict["SIZEY"];
		var totalSquares = sizeX * sizeY;
		var typeBuffer = new ByteArray(totalSquares);
		var colorBuffer = new ByteArray(totalSquares);
		var lightBuffer = new ByteArray(totalSquares);

		var rleData = bRLELumps[i].getLumpBytes(pFile);
		rleData.position = 0;

		// First RLE is type info
		var v = 0;
		for (var c = 0; c < totalSquares;)
		{
			len = rleData.readByte();
			if (len < 0)
			{
				// Run
				while (len++ < 0) {
					typeBuffer.b[c++] = type2TypeMap.b[rleData.readUnsignedByte()];
				}
			}
			else if (len > 0)
			{
				// Rep
				var repByte = type2TypeMap.b[rleData.readUnsignedByte()];
				while (len-- > 0)
					typeBuffer.b[c++] = repByte;
			}
			else
			{
				// End
				break;
			}
		}

		// Next RLE is foreground color
		for (c = 0; c < totalSquares;)
		{
			repByte = rleData.readUnsignedByte();
			len = (repByte >> 4) & 15;
			while (len-- >= 0)
				colorBuffer.b[c++] = repByte & 15;
		}

		// Next RLE is background color
		for (c = 0; c < totalSquares;)
		{
			repByte = rleData.readUnsignedByte();
			len = (repByte >> 4) & 15;
			while (len-- >= 0)
				colorBuffer.b[c++] |= (repByte & 15) << 4;
		}

		// Next RLE is lighting
		c = 0;
		repByte = rleData.readUnsignedByte();
		if (repByte != 0)
		{
			// Light buffer is present
			for (; c < totalSquares;)
			{
				// Unlit region
				len = rleData.readUnsignedByte();
				while (len-- > 0)
					lightBuffer.b[c++] = 0;

				// Lit region
				len = rleData.readUnsignedByte();
				if (len == 0)
					break; // Early-out
				while (len-- > 0)
					lightBuffer.b[c++] = 1;
			}
		}

		// Remainder of light buffer
		while (c < totalSquares)
			lightBuffer.b[c++] = 0;

		// Store board-patch info
		var pbInfo = [ hdrDict, hdrDelDict, rgnDict, rgnDelDict,
			seArray, typeBuffer, colorBuffer, lightBuffer ];
		ZZTLoader.pwadBoards.push(pbInfo);
	}

	ZZTLoader.pwads[pwadName] = [ZZTLoader.pwadTypeMap, ZZTLoader.pwadDicts, ZZTLoader.pwadDelDicts, ZZTLoader.pwadCustCode,
		ZZTLoader.pwadBoards, pExtraLumps, pExtraLumpBinary];
	return true;
};

static establishPWAD(pwadName) {
	var loadBlank = false;
	if (!ZZTLoader.pwads.hasOwnProperty(pwadName))
		loadBlank = true;
	else if (ZZTLoader.pwads[pwadName] == "")
		loadBlank = true;

	ZZTLoader.pwadBQUESTHACK = 0;
	if (loadBlank)
	{
		// Empty containers; no PWAD info.
		ZZTLoader.pwadTypeMap = new ByteArray();
		for (var i = 0; i < 256; i++)
			ZZTLoader.pwadTypeMap.b[i] = interp.typeTrans[i];

		ZZTLoader.pwadDicts = {};
		ZZTLoader.pwadDelDicts = {};
		ZZTLoader.pwadCustCode = [];
		ZZTLoader.pwadBoards = [];
		ZZTLoader.pwadExtraLumps = [];
		ZZTLoader.pwadExtraLumpBinary = [];
		return false;
	}
	else
	{
		// Take PWAD info from dictionary.
		var pwa = ZZTLoader.pwads[pwadName];
		ZZTLoader.pwadTypeMap = pwa[0];
		ZZTLoader.pwadDicts = pwa[1];
		ZZTLoader.pwadDelDicts = pwa[2];
		ZZTLoader.pwadCustCode = pwa[3];
		ZZTLoader.pwadBoards = pwa[4];
		ZZTLoader.pwadExtraLumps = pwa[5];
		ZZTLoader.pwadExtraLumpBinary = pwa[6];
		if (ZZTLoader.pwadDicts["WORLDHDR"].hasOwnProperty("BQUESTHACK"))
			ZZTLoader.pwadBQUESTHACK = ZZTLoader.pwadDicts["WORLDHDR"]["BQUESTHACK"];
		return true;
	}
};

static pwadIsLoaded(pwadIndex, origName) {
	if (!utils.ciTest(pwadIndex, origName))
	{
		ZZTLoader.establishPWAD("");
		return true; // No such name in index; no load necessary.
	}

	var pwadKey = utils.ciLookup(pwadIndex, origName);
	if (ZZTLoader.pwads.hasOwnProperty(pwadKey))
	{
		ZZTLoader.establishPWAD(pwadKey);
		return true; // Already registered; no load necessary.
	}

	// Not registered; load necessary.
	return false;
};

}

ZZTLoader.initClass();
