"use strict";
class ZZTBoard {

constructor() {
	this.typeBuffer = null; // Uint8Array
	this.colorBuffer = null; // Uint8Array
	this.lightBuffer = null; // Uint8Array
	this.props = null;
	this.regions = null;
	this.statElementCount = 0;
	this.statLessCount = 0;
	this.statElem = null;
	this.playerSE = null;
	this.saveStamp = null;
	this.boardIndex = 0;
	this.saveIndex = 0;
	this.saveType = 0;
	this.worldProps = null;
	this.worldVars = null;
}

}
