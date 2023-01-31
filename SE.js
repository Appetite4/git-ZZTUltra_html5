"use strict";
class SE {

static initClass() {
SE.tg = null; // Uint8Array
SE.cg = null; // Uint8Array
SE.lg = null; // Uint8Array
SE.sg = null; // Array
SE.gridWidth = 0;
SE.gridHeight = 0;
SE.fullGridWidth = 0;
SE.fullGridHeight = 0;
SE.vpX0 = 0;
SE.vpY0 = 0;
SE.vpX1 = 60;
SE.vpY1 = 25;
SE.vpWidth = 60;
SE.vpHeight = 25;
SE.CameraX = 1;
SE.CameraY = 1;
SE.uCameraX = -1000;
SE.uCameraY = -1000;
SE.typeList = null; // Array
SE.mg = null; // CellGrid
SE.statElem = null; // Array
SE.statLessCount = 0;
SE.statIter = 0;
SE.suspendDisp = 0;
SE.IsDark = 0;
SE.darkChar = 0;
SE.darkColor = 0;

SE.periodicObjCount = 0;
}

constructor(zType, startX, startY, color=-1000, noPlace=false) {
	/*if (++SE.periodicObjCount % 100 == 0)
	{
		console.log("SE cum count:  ", SE.periodicObjCount);
	}*/

	// Set basic attributes
	this.TYPE = zType;
	this.X = startX;
	this.Y = startY;
	this.clipXY();

	// Set default attributes, if they exist
	var eInfo = SE.typeList[zType];
	this.CYCLE = eInfo.CYCLE;
	this.STEPX = eInfo.STEPX;
	this.STEPY = eInfo.STEPY;
	this.UNDERID = SE.tg[this.Y * SE.fullGridWidth + this.X];
	this.UNDERCOLOR = SE.cg[this.Y * SE.fullGridWidth + this.X];
	this.IP = 0;
	this.FLAGS = 0;
	this.delay = 1;
	this.myID = 0;
	if (color == -1000)
		color = eInfo.COLOR;

	// Set additional default attributes, if they exist
	this.extra = {};
	for (var obj in eInfo.extraVals)
	{
		this.extra[obj] = eInfo.extraVals[obj];
	}

	// Modify grid to reflect updated status element, unless inhibited
	if (!noPlace)
	{
		SE.setType(this.X, this.Y, zType);
		SE.setColor(this.X, this.Y, color);
	}
}

static displaySquare(x, y) {
	// Draw nothing if out of viewport
	if (SE.suspendDisp || x < SE.CameraX || y < SE.CameraY ||
		x-SE.CameraX >= SE.vpWidth || y-SE.CameraY >= SE.vpHeight)
		return;

	// Get standard info
	var zType = SE.tg[y * SE.fullGridWidth + x];
	var eInfo = SE.typeList[zType];
	var color = SE.cg[y * SE.fullGridWidth + x];
	var dispX = x - SE.CameraX + SE.vpX0 - 1;
	var dispY = y - SE.CameraY + SE.vpY0 - 1;
	var mySE = SE.getStatElemAt(x, y);
	if (!eInfo)
	{
		console.log("Type not found:  ", zType, " at ", x, y);
		return;
	}

	// See if we have any special drawing requirements
	if (SE.IsDark && !eInfo.AlwaysLit && !SE.lg[y * SE.fullGridWidth + x])
	{
		// For dark boards, draw darkness.
		SE.mg.setCell(dispX, dispY, SE.darkChar, SE.darkColor);
	}
	else if (eInfo.NUMBER == 0)
	{
		// Empty is short-circuit forced to dark blank space.
		SE.mg.setCell(dispX, dispY, 32, 15);
	}
	else if (eInfo.TextDraw)
	{
		// Text characters are a bit odd, with color associated with the type,
		// and character determined by the color attribute.  Although this
		// is counter-intuitive, it lets the designer use any character as text.
		SE.mg.setCell(dispX, dispY, color, eInfo.COLOR);
	}
	else if (eInfo.CustomDraw)
	{
		// Custom drawing callback is present for some types (LINE, etc.)
		interp.customDrawColor = color;
		if (!eInfo.NoStat)
		{
			if (eInfo.HasOwnChar)
				interp.customDrawChar = mySE.extra["CHAR"];
			else
				interp.customDrawChar = eInfo.CHAR;

			interp.customDrawSE.extra["CHAR"] = interp.customDrawChar;
		}
		else
			interp.customDrawChar = 0;

		interp.dispatchCustomDraw(zType, x, y);
		SE.mg.setCell(dispX, dispY, interp.customDrawChar, interp.customDrawColor);
	}
	else if (eInfo.HasOwnChar)
	{
		// Some objects have a flexible character (spinning guns, objects, etc).
		if (mySE)
		{
			// Use locally-defined character
			SE.mg.setCell(dispX, dispY, mySE.extra["CHAR"], color);
		}
		else
		{
			// This is somewhat anomalous, but still possible:  there is no
			// status element for a type that requires it.  Use type-based
			// character, which might be wrong but better than nothing.
			SE.mg.setCell(dispX, dispY, eInfo.CHAR, color);
		}
	}
	else
	{
		// Normal drawing simply sets the default character for the type.
		SE.mg.setCell(dispX, dispY, eInfo.CHAR, color);
	}
};

static getStatElem(oPtr) {
	if (oPtr <= 0)
		return null; // Invalid

	for (var i = 0; i < SE.statElem.length; i++)
	{
		var mySE = SE.statElem[i];
		if (!(mySE.FLAGS & interp.FL_DEAD) && mySE.myID == oPtr)
		{
			return mySE; // Found
		}
	}

	return null; // Not found
};

static getONAMEMatching(val, startIndex=0) {
	SE.statIter = startIndex;
	var testLen = val.length;
	for (; SE.statIter < SE.statElem.length; SE.statIter++)
	{
		var mySE = SE.statElem[SE.statIter];
		if (mySE.extra.hasOwnProperty("ONAME"))
		{
			var testStr = mySE.extra["ONAME"].toString().toUpperCase();
			if (testLen < testStr.length)
			{
				// Starts-with string test
				if (testStr.substr(0, testLen) == val && !oop.isAlphaNum(testStr, testLen))
				{
					SE.statIter++;
					return mySE; // Found
				}
			}
			else if (testStr == val)
			{
				// Exact-match string test
				SE.statIter++;
				return mySE; // Found
			}
		}
	}

	SE.statIter = 0;
	return null; // Not found
};

static getStatElemOwnCode(startIndex=0) {
	SE.statIter = startIndex;
	for (; SE.statIter < SE.statElem.length; SE.statIter++)
	{
		var mySE = SE.statElem[SE.statIter];
		var eInfo = SE.typeList[mySE.TYPE];
		if (eInfo.HasOwnCode)
		{
			SE.statIter++;
			return mySE; // Found
		}
	}

	SE.statIter = 0;
	return null; // Not found
};

static getStatElemAt(x, y) {
	return SE.sg[y * SE.fullGridWidth + x];
};

static setStatElemAt(x, y, sePtr) {
	SE.sg[y * SE.fullGridWidth + x] = sePtr;
};

static setType(x, y, zType) {
	SE.tg[y * SE.fullGridWidth + x] = zType;
};

static setColor(x, y, color, useUnderColor=true) {
	if (color > 15 || !useUnderColor)
		SE.cg[y * SE.fullGridWidth + x] = color;
	else
		SE.cg[y * SE.fullGridWidth + x] = (SE.cg[y * SE.fullGridWidth + x] & 0x70) + color;
};

static setLit(x, y, flag) {
	SE.lg[y * SE.fullGridWidth + x] = flag;
};

static getType(x, y) {
	return (SE.tg[y * SE.fullGridWidth + x]);
};

static getColor(x, y) {
	return (SE.cg[y * SE.fullGridWidth + x]);
};

static getLit(x, y) {
	return (SE.lg[y * SE.fullGridWidth + x]);
};

toString() {
	var str = "\nTYPE=" + this.TYPE.toString() + ">" + SE.typeList[this.TYPE].NUMBER.toString() +
		"\nCYCLE=" + this.CYCLE.toString() +
		"\nCOORD=" + this.X.toString() + "," + this.Y.toString() +
		"\nSTEP=" + this.STEPX.toString() + "," + this.STEPY.toString() +
		"\nUNDERID=" + this.UNDERID.toString() + " UNDERCOLOR=" + this.UNDERCOLOR.toString() +
		"\nIP=" + this.IP.toString() + " FLAGS=" + this.FLAGS.toString() +
		"\ndelay=" + this.delay.toString() + " ID=" + this.myID.toString() + "\nextra=";

	for (var obj in this.extra)
		str += obj.toString() + "->" + this.extra[obj].toString() + "\n";

	return str;
};

clipXY() {
	if (this.X < 1)
		this.X = 1;
	if (this.Y < 1)
		this.Y = 1;
	if (this.X > SE.gridWidth)
		this.X = SE.gridWidth;
	if (this.Y > SE.gridHeight)
		this.Y = SE.gridHeight;
};

displaySelfSquare() {
	// Draw nothing if out of viewport
	if (SE.suspendDisp || this.X < SE.CameraX || this.Y < SE.CameraY ||
		this.X-SE.CameraX >= SE.vpWidth || this.Y-SE.CameraY >= SE.vpHeight)
		return;

	// Get standard info
	var eInfo = SE.typeList[this.TYPE];
	var color = SE.cg[this.Y * SE.fullGridWidth + this.X];
	var dispX = this.X - SE.CameraX + SE.vpX0 - 1;
	var dispY = this.Y - SE.CameraY + SE.vpY0 - 1;

	if (SE.IsDark && !eInfo.AlwaysLit && !SE.lg[this.Y * SE.fullGridWidth + this.X])
	{
		// For dark boards, draw darkness.
		SE.mg.setCell(dispX, dispY, SE.darkChar, SE.darkColor);
	}
	else if (eInfo.CustomDraw)
	{
		interp.customDrawColor = color;
		if (!eInfo.NoStat)
		{
			if (eInfo.HasOwnChar)
				interp.customDrawChar = this.extra["CHAR"];
			else
				interp.customDrawChar = eInfo.CHAR;

			interp.customDrawSE.extra["CHAR"] = interp.customDrawChar;
		}
		else
			interp.customDrawChar = 0;

		interp.dispatchCustomDraw(this.TYPE, this.X, this.Y);
		SE.mg.setCell(dispX, dispY, interp.customDrawChar, interp.customDrawColor);
	}
	else if (eInfo.HasOwnChar)
	{
		// Use locally-defined character.
		SE.mg.setCell(dispX, dispY, this.extra["CHAR"], color);
	}
	else
	{
		// Normal drawing simply sets the default character for the type.
		SE.mg.setCell(dispX, dispY, eInfo.CHAR, color);
	}
};

eraseSelfSquare(doShow=true) {
	if ((this.FLAGS & interp.FL_GHOST) == 0)
	{
		SE.tg[this.Y * SE.fullGridWidth + this.X] = this.UNDERID;
		SE.cg[this.Y * SE.fullGridWidth + this.X] = this.UNDERCOLOR;
		SE.sg[this.Y * SE.fullGridWidth + this.X] = null;
		if (doShow)
			SE.displaySquare(this.X, this.Y);
	}
};

moveSelfSquare(newX, newY, eraseLast=true) {
	var color = SE.cg[this.Y * SE.fullGridWidth + this.X];
	if (!SE.typeList[this.TYPE].FullColor)
		color &= 0x8F;
	if (eraseLast)
		this.eraseSelfSquare();

	this.X = newX;
	this.Y = newY;
	this.clipXY();
	this.UNDERID = SE.tg[this.Y * SE.fullGridWidth + this.X];
	this.UNDERCOLOR = SE.cg[this.Y * SE.fullGridWidth + this.X];
	SE.setType(this.X, this.Y, this.TYPE);
	SE.setColor(this.X, this.Y, color, Boolean(this.UNDERID != 0));
	SE.setStatElemAt(this.X, this.Y, this);

	this.displaySelfSquare();
};

}

SE.initClass();
