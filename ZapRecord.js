// ZapRecord.as:  A label zap/restore record instance.
"use strict";

class ZapRecord {
	constructor(id, loc, zType, sIndex) {
		this.codeID = id;
		this.labelLoc = loc;
		this.saveIndex = sIndex;
		if (zType == 2)
			this.labelLoc = -this.labelLoc;
	}
}
