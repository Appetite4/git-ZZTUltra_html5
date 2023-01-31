"use strict";
class ElementInfo {

constructor(toName) {
	this.NUMBER = 0;
	this.NAME = toName;
	this.CYCLE = 3;
	this.STEPX = 0;
	this.STEPY = 0;
	this.CHAR = 0;
	this.COLOR = 15;
	this.NoStat = false;
	this.BlockObject = false;
	this.BlockPlayer = false;
	this.AlwaysLit = false;
	this.DominantColor = false;
	this.FullColor = false;
	this.TextDraw = false;
	this.CustomDraw = false;
	this.HasOwnChar = false;
	this.HasOwnCode = false;
	this.CustomStart = 0;
	this.Pushable = 0;
	this.Squashable = false;
	this.CODEID = 0;
	this.LocPUSHBEHAVIOR = -1;
	this.LocWALKBEHAVIOR = -1;
	this.LocCUSTOMDRAW = -1;
	this.extraVals = {};
}

copyFrom(eInfo) {
	this.NUMBER = eInfo.NUMBER;
	this.NAME = eInfo.NAME;
	this.CYCLE = eInfo.CYCLE;
	this.STEPX = eInfo.STEPX;
	this.STEPY = eInfo.STEPY;
	this.CHAR = eInfo.CHAR;
	this.COLOR = eInfo.COLOR;
	this.NoStat = eInfo.NoStat;
	this.BlockObject = eInfo.BlockObject;
	this.BlockPlayer = eInfo.BlockPlayer;
	this.AlwaysLit = eInfo.AlwaysLit;
	this.DominantColor = eInfo.DominantColor;
	this.FullColor = eInfo.FullColor;
	this.TextDraw = eInfo.TextDraw;
	this.CustomDraw = eInfo.CustomDraw;
	this.HasOwnChar = eInfo.HasOwnChar;
	this.HasOwnCode = eInfo.HasOwnCode;
	this.CustomStart = eInfo.CustomStart;
	this.Pushable = eInfo.Pushable;
	this.Squashable = eInfo.Squashable;
	this.CODEID = eInfo.CODEID;
	this.LocPUSHBEHAVIOR = eInfo.LocPUSHBEHAVIOR;
	this.LocWALKBEHAVIOR = eInfo.LocWALKBEHAVIOR;
	this.LocCUSTOMDRAW = eInfo.LocCUSTOMDRAW;
	this.extraVals = {}
	for (var k in eInfo.extraVals) {
	  this.extraVals[k] = eInfo.extraVals[k];
	}
};

toString() {
	var s = "\"" + this.NAME + "\":{\n";
	s += "\"NUMBER\": " + this.NUMBER.toString();
	s += ",\n\"CYCLE\": " + this.CYCLE.toString();
	if (this.STEPX != 0)
	  s += ",\n\"STEPX\": " + this.STEPX.toString();
	if (this.STEPY != 0)
	  s += ",\n\"STEPY\": " + this.STEPY.toString();
	s += ",\n\"CHAR\": " + this.CHAR.toString();
	s += ",\n\"COLOR\": " + this.COLOR.toString();
	if (this.NoStat)
	  s += ",\n\"NOSTAT\": 1";
	if (this.BlockObject)
	  s += ",\n\"BLOCKOBJECT\": 1";
	if (this.BlockPlayer)
	  s += ",\n\"BLOCKPLAYER\": 1";
	if (this.AlwaysLit)
	  s += ",\n\"ALWAYSLIT\": 1";
	if (this.DominantColor)
	  s += ",\n\"DOMINANTCOLOR\": 1";
	if (this.FullColor)
	  s += ",\n\"FULLCOLOR\": 1";
	if (this.TextDraw)
	  s += ",\n\"TEXTDRAW\": 1";
	if (this.CustomDraw)
	  s += ",\n\"CUSTOMDRAW\": 1";
	if (this.HasOwnChar)
	  s += ",\n\"HASOWNCHAR\": 1";
	if (this.HasOwnCode)
	  s += ",\n\"HASOWNCODE\": 1";
	if (this.CustomStart != 0)
	  s += ",\n\"CUSTOMSTART\": " + this.CustomStart.toString();
	if (this.Pushable != 0)
	  s += ",\n\"PUSHABLE\": " + this.Pushable.toString();
	if (this.Squashable)
	  s += ",\n\"SQUASHABLE\": 1";

	for (var k in this.extraVals) {
	  var val = this.extraVals[k].toString();
	  var testInt = utils.int0(val);
	  if (testInt.toString() != val)
		val = "\"" + val + "\"";

	  s += ",\n\"" + k + "\": " + val;
	}

	// Code block will need to be closed separately.
	s += ",\n\"CODE\": ";
	return s;
};

readProperty(s) {
	switch (s.toUpperCase()) {
	  case "NUMBER":
		return this.NUMBER;
	  case "NAME":
		return this.NAME;
	  case "CYCLE":
		return this.CYCLE;
	  case "STEPX":
		return this.STEPX;
	  case "STEPY":
		return this.STEPY;
	  case "CHAR":
		return this.CHAR;
	  case "COLOR":
		return this.COLOR;
	  case "NOSTAT":
		return (this.NoStat ? 1 : 0);
	  case "BLOCKOBJECT":
		return (this.BlockObject ? 1 : 0);
	  case "BLOCKPLAYER":
		return (this.BlockPlayer ? 1 : 0);
	  case "ALWAYSLIT":
		return (this.AlwaysLit ? 1 : 0);
	  case "DOMINANTCOLOR":
		return (this.DominantColor ? 1 : 0);
	  case "FULLCOLOR":
		return (this.FullColor ? 1 : 0);
	  case "TEXTDRAW":
		return (this.TextDraw ? 1 : 0);
	  case "CUSTOMDRAW":
		return (this.CustomDraw ? 1 : 0);
	  case "HASOWNCHAR":
		return (this.HasOwnChar ? 1 : 0);
	  case "HASOWNCODE":
		return (this.HasOwnCode ? 1 : 0);
	  case "CUSTOMSTART":
		return ((this.CustomDraw > 0) ? 1 : 0);
	  case "PUSHABLE":
		return this.Pushable;
	  case "SQUASHABLE":
		return (this.Squashable ? 1 : 0);
	  default:
		if (this.extraVals.hasOwnProperty(s))
		  return this.extraVals[s];
	}

	return 0;
};

writeProperty(s, val) {
	switch (s.toUpperCase()) {
	  case "NUMBER":
		return false;
	  case "NAME":
		return false;
	  case "CYCLE":
		this.CYCLE = utils.int0(val.toString());
		break;
	  case "STEPX":
		this.STEPX = utils.int0(val.toString());
		break;
	  case "STEPY":
		this.STEPY = utils.int0(val.toString());
		break;
	  case "CHAR":
		if (typeof val == "string")
		  this.CHAR = val.charCodeAt(0);
		else
		  this.CHAR = utils.int0(val.toString());
		break;
	  case "COLOR":
		this.COLOR = utils.int0(val.toString());
		break;
	  case "NOSTAT":
		return false;
	  case "BLOCKOBJECT":
		this.BlockObject = Boolean(val);
		break;
	  case "BLOCKPLAYER":
		this.BlockPlayer = Boolean(val);
		break;
	  case "ALWAYSLIT":
		this.AlwaysLit = Boolean(val);
		break;
	  case "DOMINANTCOLOR":
		this.DominantColor = Boolean(val);
		break;
	  case "FULLCOLOR":
		this.FullColor = Boolean(val);
		break;
	  case "TEXTDRAW":
		this.TextDraw = Boolean(val);
		break;
	  case "CUSTOMDRAW":
		return false;
	  case "HASOWNCHAR":
		return false;
	  case "HASOWNCODE":
		return false;
	  case "CUSTOMSTART":
		return false;
	  case "PUSHABLE":
		this.Pushable = utils.int0(val.toString());
		break;
	  case "SQUASHABLE":
		this.Squashable = Boolean(val);
		break;
	  default:
		this.extraVals[s] = val;
	}

	return true;
}

}
