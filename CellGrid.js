// CellGrid.js:  A grid filled with Cells.
"use strict";

// CellGrid surfaces created include...
// mg (main grid)
// titleGrid, scrollGrid (title and main portion of scroll interface)
// cpg, csg (character editor interface, including 3x3 preview and 32x8 set)
// fbg (file browser grid)
// The scroll interface frame will need to have a special set of bitmaps.

class CellGrid {

static initClass(context, tempCtx, tempCanvas, cellCtx, cellCanvas) {
	// RGB colors
	CellGrid.COLOR_BLACK = 0x000000;
	CellGrid.COLOR_DARKBLUE = 0x0000AA;
	CellGrid.COLOR_DARKGREEN = 0x00AA00;
	CellGrid.COLOR_DARKCYAN = 0x00AAAA;
	CellGrid.COLOR_DARKRED = 0xAA0000;
	CellGrid.COLOR_DARKPURPLE = 0xAA00AA;
	CellGrid.COLOR_BROWN = 0xAA5500;
	CellGrid.COLOR_GREY = 0xAAAAAA;
	CellGrid.COLOR_DARKGREY = 0x555555;
	CellGrid.COLOR_BLUE = 0x5555FF;
	CellGrid.COLOR_GREEN = 0x55FF55;
	CellGrid.COLOR_CYAN = 0x55FFFF;
	CellGrid.COLOR_RED = 0xFF5555;
	CellGrid.COLOR_PURPLE = 0xFF55FF;
	CellGrid.COLOR_YELLOW = 0xFFFF55;
	CellGrid.COLOR_WHITE = 0xFFFFFF;

	// Look-up table of default colors
	CellGrid.defaultColorLookup = [
		CellGrid.COLOR_BLACK, CellGrid.COLOR_DARKBLUE, CellGrid.COLOR_DARKGREEN,
		CellGrid.COLOR_DARKCYAN, CellGrid.COLOR_DARKRED, CellGrid.COLOR_DARKPURPLE,
		CellGrid.COLOR_BROWN, CellGrid.COLOR_GREY, CellGrid.COLOR_DARKGREY,
		CellGrid.COLOR_BLUE, CellGrid.COLOR_GREEN, CellGrid.COLOR_CYAN,
		CellGrid.COLOR_RED, CellGrid.COLOR_PURPLE, CellGrid.COLOR_YELLOW,
		CellGrid.COLOR_WHITE
	];

	// HTML version of colorLookup; used for background fillRects
	CellGrid.defaultBgColors = [
		"#000000", "#0000AA", "#00AA00", "#00AAAA",
		"#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
		"#555555", "#5555FF", "#55FF55", "#55FFFF",
		"#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF"
	];

	CellGrid.setDefaultColors();

	// Scroll frame codes (with drop-shadow)
	CellGrid.SCROLL_BLANK = 256;
	CellGrid.SCROLL_CORNERTIP = 257;
	CellGrid.SCROLL_D1 = 258;
	CellGrid.SCROLL_DL2 = 259;
	CellGrid.SCROLL_DR2 = 260;
	CellGrid.SCROLL_L1 = 261;
	CellGrid.SCROLL_L2 = 262;
	CellGrid.SCROLL_R1 = 263;
	CellGrid.SCROLL_R2 = 264;
	CellGrid.SCROLL_U1 = 265;
	CellGrid.SCROLL_U2 = 266;
	CellGrid.SCROLL_ULDL = 267;
	CellGrid.SCROLL_UL2 = 268;
	CellGrid.SCROLL_URDR = 269;
	CellGrid.SCROLL_UR2 = 270;
	CellGrid.SCROLL_UNUSED = 271;

	// If drop-shadow scroll frame codes are not desired,
	// this table exchanges those codes with the extended ASCII code.
	CellGrid.scrollFrameLegacyCodes = [
		32, 32, 205, 207, 207, 198, 179, 181, 179, 205, 205, 198, 209, 181, 209, 0
	];

	// Scroll interface frame info should be read as follows:
	// [charCode, color, relX, relY, spanX, spanY, locus]
	//
	// relX and relY are offset from the locus point.
	//
	// The locus is interpreted as:
	//   0=UL of title bar
	//   1=UR of title bar
	//   2=DL of body
	//   3=DR of body
	//
	// spanX and spanY codes are:
	//   1=One square span
	//   2=Width of title bar/body
	//   3=Height of body
	CellGrid.scrollFrameInfo = [
		[CellGrid.SCROLL_ULDL,      15, -2, -1, 1, 1, 0],
		[CellGrid.SCROLL_UL2,       15, -1, -1, 1, 1, 0],
		[CellGrid.SCROLL_U1,        15,  0, -1, 2, 1, 0],
		[CellGrid.SCROLL_UR2,       15,  1, -1, 1, 1, 1],
		[CellGrid.SCROLL_URDR,      15,  2, -1, 1, 1, 1],

		[CellGrid.SCROLL_CORNERTIP, 15, -2,  0, 1, 1, 0],
		[CellGrid.SCROLL_L2,        15, -1,  0, 1, 1, 0],
		[CellGrid.SCROLL_R2,        15,  1,  0, 1, 1, 1],
		[CellGrid.SCROLL_CORNERTIP, 15,  2,  0, 1, 1, 1],

		[CellGrid.SCROLL_BLANK,     15, -2,  1, 1, 1, 0],
		[CellGrid.SCROLL_L1,        15, -1,  1, 1, 1, 0],
		[CellGrid.SCROLL_U2,        15,  0,  1, 2, 1, 0],
		[CellGrid.SCROLL_R1,        15,  1,  1, 1, 1, 1],
		[CellGrid.SCROLL_BLANK,     15,  2,  1, 1, 1, 1],

		[CellGrid.SCROLL_L2,        15, -1,  2, 1, 3, 0],
		[CellGrid.SCROLL_BLANK,     15, -2,  2, 1, 3, 0],
		[CellGrid.SCROLL_R2,        15,  1,  2, 1, 3, 1],
		[CellGrid.SCROLL_BLANK,     15,  2,  2, 1, 3, 1],

		[CellGrid.SCROLL_ULDL,      15, -2,  1, 1, 1, 2],
		[CellGrid.SCROLL_DL2,       15, -1,  1, 1, 1, 2],
		[CellGrid.SCROLL_D1,        15,  0,  1, 2, 1, 2],
		[CellGrid.SCROLL_DR2,       15,  1,  1, 1, 1, 3],
		[CellGrid.SCROLL_URDR,      15,  2,  1, 1, 1, 3],
		[CellGrid.SCROLL_CORNERTIP, 15, -2,  2, 1, 1, 2],
		[CellGrid.SCROLL_CORNERTIP, 15,  2,  2, 1, 1, 3]
	];

	// Height mode,		scanlines,	dest char height,	num rows,	pre-stretch,fit-stretch
	CellGrid.modeInfo = [
		// CGA scanlines (200)
		[ 0,				200,			8,				25,			1.0,		2.0],
		[ 0,				200,			8,				25,			7.0/4.0,	2.0],
		[ 0,				200,			8,				25,			2.0,		2.0],

		// EGA scanlines (350)
		[ 0,				350,			8,				43,			1.0,		8.0/7.0],
		[ 1,				350,			14,				25,			1.0,		8.0/7.0],
		[ 1,				350,			14,				25,			8.0/7.0,	8.0/7.0],

		// VGA scanlines (400)
		[ 0,				400,			8,				50,			1.0,		1.0],
		[ 1,				400,			14,				28,			1.0,		1.0],
		[ 2,				400,			16,				25,			1.0,		1.0]
	];

	CellGrid.ALL_UPDATE_THRESHOLD = 750;
	CellGrid.SINGLE_UPDATE_THRESHOLD = 500;

	CellGrid.blinkChanged = false;
	CellGrid.blinkOnVis = false;
	CellGrid.blinkBitUsed = true;
	CellGrid.bgMask = 7;
	CellGrid.context = context;
	CellGrid.tempCtx = tempCtx;
	CellGrid.tempCanvas = tempCanvas;
	CellGrid.cellCtx = cellCtx;
	CellGrid.cellCanvas = cellCanvas;

	CellGrid.scrollLegacyMode = 0;
	CellGrid.bmBankScroll = ASCII_Characters.bmBankScroll;
	CellGrid.scrollCache = CellGrid.createScrollCache(CellGrid.bmBankScroll,
		ASCII_Characters.CHAR_WIDTH, ASCII_Characters.CHAR_HEIGHT16,
		0x000000, 0x0000FF, 0xFFFFFF);

	// Metrics collection for performance purposes
	CellGrid.scCount = 0;
	CellGrid.scfCount = 0;
	CellGrid.cumSCCount = 0;
	CellGrid.lastSurfaceUpdate = Date.now();
	CellGrid.veryFirstUpdate = Date.now();
	CellGrid.updatePeriod = 0;
	CellGrid.sUpdateCount = 0;
};

// Set color lookup (masks and BG colors) to defaults.
static setDefaultColors() {
	CellGrid.colorLookup = CellGrid.defaultColorLookup.concat();
	CellGrid.bgColors = CellGrid.defaultBgColors.concat();
}

constructor(gridWidth, gridHeight, offsetX=0, offsetY=0, master=null) {
	// Set basic attributes
	this.xSize = gridWidth;
	this.ySize = gridHeight;
	this.ixSize = this.xSize;
	this.iySize = 50; // ySize
	CellGrid.charWidth = ASCII_Characters.CHAR_WIDTH;
	CellGrid.charHeight = ASCII_Characters.CHAR_HEIGHT;
	this.totalCount = this.xSize * this.ySize;
	this.doubleFactor = 1;
	CellGrid.charHeightMode = 2; // 16 height
	CellGrid.scanlineMode = 2; // VGA
	CellGrid.overallMode = 8; // VGA, 16 height
	CellGrid.numRows = 25;
	CellGrid.fitStretch = 1.0;
	CellGrid.virtualCellYDiv = 16;
	this.x = 0;
	this.y = 0;
	this.master = master;

	// Create palette info
	this.createPaletteArrays(CellGrid.colorLookup);
	this.defaultBmBanks = [
		ASCII_Characters.bmBank8,    // CGA
		ASCII_Characters.bmBank14,   // EGA
		ASCII_Characters.bmBank16    // VGA
	];
	this.bmHeights = [
		ASCII_Characters.CHAR_HEIGHT8,  // CGA
		ASCII_Characters.CHAR_HEIGHT14, // EGA
		ASCII_Characters.CHAR_HEIGHT16  // VGA
	];

	if (this.master == null)
	{
		CellGrid.spCacheHeight = 0;
		CellGrid.myBitmapBank = ASCII_Characters.bmBank16;
		CellGrid.spCache = CellGrid.createSpriteCache(CellGrid.myBitmapBank,
			ASCII_Characters.CHAR_WIDTH, ASCII_Characters.CHAR_HEIGHT16,
			CellGrid.colorLookup);
	}

	// Set default surface info
	this.numSurfaces = 1;
	this.surfaces = [
		[ 0, 0, this.xSize, this.ySize, null, false, null ],
		[ 0, 0, this.xSize, this.ySize, null, false, null ],
		[ 0, 0, this.xSize, this.ySize, null, false, null ],
		[ 0, 0, this.xSize, this.ySize, null, false, null ],
		[ 0, 0, this.xSize, this.ySize, null, false, null ]
	];

	this.createSurfaces(this.xSize, this.ySize, [1, 1, this.xSize, this.ySize]);

	// Create individuals cells; arrange into grid
	this.chars = new Uint8Array(this.ixSize * this.iySize);
	this.attrs = new Uint8Array(this.ixSize * this.iySize);

	var i = 0;
	for (var cy = 0; cy < this.iySize; cy++)
	{
		for (var cx = 0; cx < this.xSize; cx++)
		{
			this.chars[i] = 0;
			this.attrs[i] = 0;
			i++;
		}
	}

	// Create update tracking variables
	this.blinkList = [];
	this.updateList = [];
	this.updateScrollList = [];
	this.updateCount = 0;
	this.updateX1 = 100000000;
	this.updateX2 = -1;
	this.updateY1 = 100000000;
	this.updateY2 = -1;
};

setDoubled(isDoubled) {
	if (isDoubled)
		this.doubleFactor = 2;
	else
		this.doubleFactor = 1
};

adjustVisiblePortion(visibleWidth, visibleHeight) {
	var oldXSize = this.xSize;
	var oldYSize = this.ySize;
	this.xSize = visibleWidth;
	this.ySize = visibleHeight;
	this.totalCount = this.xSize * this.ySize;

	// Create and initialize new bitmap
	if (oldXSize < this.xSize || oldYSize < this.ySize)
	{
		this.createSurface(this.surfaces[0], 0, 0, this.xSize, this.ySize);
	}
	else
	{
		this.surfaces[0][2] = this.xSize;
		this.surfaces[0][3] = this.ySize;
	}
};

createPaletteArrays(cLookup) {
	// Extract RGB basis for default 16 colors
	this.colors16 = [];
	for (var i = 0; i < 16; i++) {
		var c = cLookup[i];
		var r = c & 16711680;
		var g = c & 65280;
		var b = c & 255;
		this.colors16.push(r);
		this.colors16.push(g);
		this.colors16.push(b);
	}
};

// Set up colored sprite cache.
static createSpriteCache(stockSprites, cw, ch, colorPalette) {

	var spValid = [];
	var curCache = [];
	CellGrid.iData = CellGrid.tempCtx.createImageData(cw, ch);
	var iData = CellGrid.iData;

	if (CellGrid.spCacheHeight != ch)
		CellGrid.spCacheHeight = 0;

	// Iterate for each character
	var total = cw * ch * 4;
	for (var n = 0; n < 256; n++) {
		var sp = stockSprites[n];
		var curCharCache = [];
		var curValid = []

		// Iterate for each foreground color for character
		for (var col = 0; col < 16; col++) {
			var entry = colorPalette[col];
			var R = (entry >> 16) & 0xFF;
			var G = (entry >> 8) & 0xFF;
			var B = entry & 0xFF;

			// Iterate for each pixel of stock sprite
			for (var i = 0; i < total; i += 4) {
				if (sp.data[i+3] == 0)
				{
					// Transparent pixel
					iData.data[i+0] = 0;
					iData.data[i+1] = 0;
					iData.data[i+2] = 0;
					iData.data[i+3] = 0;
				}
				else
				{
					// Opaque pixel--set to color
					iData.data[i+0] = R;
					iData.data[i+1] = G;
					iData.data[i+2] = B;
					iData.data[i+3] = 0xFF;
				}
			}

			// Create canvas; render ImageData pixels to canvas
			if (CellGrid.spCacheHeight != 0)
			{
				var spCanvas = CellGrid.spCache[n][col];
				var spCtx = spCanvas.getContext("2d");
				spCtx.putImageData(iData, 0, 0);
				CellGrid.spValid[n][col] = true;
			}
			else
			{
				var spCanvas = document.createElement('canvas');
				spCanvas.width = cw;
				spCanvas.height = ch;
				var spCtx = spCanvas.getContext("2d");
				spCtx.putImageData(iData, 0, 0);
				curCharCache[col] = spCanvas;
				curValid[col] = true;
			}
		}

		if (CellGrid.spCacheHeight == 0)
		{
			curCache[n] = curCharCache;
			spValid[n] = curValid;
		}

		//console.log("Cache char " + n + " of 255");
	}

	// Return cache
	if (CellGrid.spCacheHeight == 0)
	{
		CellGrid.spCacheHeight = ch;
		CellGrid.spValid = spValid;
		return curCache;
	}
	else
	{
		return CellGrid.spCache;
	}
}

// Updated existing colored sprite cache for a changed palette color.
updateSpriteCache(stockSprites, cw, ch, col, entry) {
	var R = (entry >> 16) & 0xFF;
	var G = (entry >> 8) & 0xFF;
	var B = entry & 0xFF;

	var iData = CellGrid.tempCtx.createImageData(cw, ch);

	// Iterate for each character
	var total = cw * ch * 4;
	for (var n = 0; n < 256; n++) {
		// Iterate for each foreground color for character
		var sp = stockSprites[n];

		// Iterate for each pixel of stock sprite
		for (var i = 0; i < total; i += 4) {
			if (sp.data[i+3] == 0)
			{
				// Transparent pixel
				iData.data[i+0] = 0;
				iData.data[i+1] = 0;
				iData.data[i+2] = 0;
				iData.data[i+3] = 0;
			}
			else
			{
				// Opaque pixel--set to color
				iData.data[i+0] = R;
				iData.data[i+1] = G;
				iData.data[i+2] = B;
				iData.data[i+3] = 0xFF;
			}
		}

		// Update sprite.
		var spCanvas = CellGrid.spCache[n][col];
		var spCtx = spCanvas.getContext("2d");
		spCtx.putImageData(iData, 0, 0);
	}
}

// Ensure updated colored sprite cache is written to the context.
ensureSpriteInCache(n, col) {
	if (CellGrid.spValid[n][col])
		return true;

	// Must update the context to reflect the new character/color combo.
	var iData = CellGrid.iData;
	var stockSprites = CellGrid.myBitmapBank;
	var sp = stockSprites[n];
	var total = CellGrid.charWidth * CellGrid.charHeight * 4;
	var R = (this.colors16[col * 3 + 0] >> 16) & 0xFF;
	var G = (this.colors16[col * 3 + 1] >> 8) & 0xFF;
	var B = (this.colors16[col * 3 + 2]) & 0xFF;

	// Iterate for each pixel of stock sprite
	for (var i = 0; i < total; i += 4) {
		if (sp.data[i+3] == 0)
		{
			// Transparent pixel
			iData.data[i+0] = 0;
			iData.data[i+1] = 0;
			iData.data[i+2] = 0;
			iData.data[i+3] = 0;
		}
		else
		{
			// Opaque pixel--set to color
			iData.data[i+0] = R;
			iData.data[i+1] = G;
			iData.data[i+2] = B;
			iData.data[i+3] = 0xFF;
		}
	}

	// Update sprite.
	var spCanvas = CellGrid.spCache[n][col];
	var spCtx = spCanvas.getContext("2d");
	spCtx.putImageData(iData, 0, 0);
	CellGrid.spValid[n][col] = true;

	return false;
}

// Invalidate the sprite cache for a specific color.
invalidateCacheColor(col) {
	for (var n = 0; n < 256; n++)
		CellGrid.spValid[n][col] = false;
}

// Invalidate the sprite cache for a specific character range.
invalidateCacheChars(chr1, chr2) {
	for (var n = chr1; n <= chr2; n++) {
		for (var col = 0; col < 16; col++)
			CellGrid.spValid[n][col] = false;
	}
}

// Set up colored sprite cache for scroll interface frame characters.
static createScrollCache(stockSprites, cw, ch, shadowColor, bgColor, borderColor) {
	var curCache = [];
	var iData = CellGrid.tempCtx.createImageData(cw, ch);

	var scRed = (shadowColor >> 16) & 255;
	var scGreen = (shadowColor >> 8) & 255;
	var scBlue = (shadowColor) & 255;
	var bgRed = (bgColor >> 16) & 255;
	var bgGreen = (bgColor >> 8) & 255;
	var bgBlue = (bgColor) & 255;
	var bcRed = (borderColor >> 16) & 255;
	var bcGreen = (borderColor >> 8) & 255;
	var bcBlue = (borderColor) & 255;

	// Iterate for each character
	var total = cw * ch * 4;
	for (var n = 0; n < 16; n++) {
		// Iterate for each foreground color for character
		var sp = stockSprites[n];

		// Iterate for each pixel of stock sprite
		for (var i = 0; i < total; i += 4) {
			switch (sp.data[i+0])
			{
				case 0:
					// Transparent pixel
					iData.data[i+0] = 0;
					iData.data[i+1] = 0;
					iData.data[i+2] = 0;
					iData.data[i+3] = 0;
				break;
				case 1:
					// Shadow pixel
					iData.data[i+0] = scRed;
					iData.data[i+1] = scGreen;
					iData.data[i+2] = scBlue;
					iData.data[i+3] = 0xFF;
				break;
				case 2:
					// BG pixel
					iData.data[i+0] = bgRed;
					iData.data[i+1] = bgGreen;
					iData.data[i+2] = bgBlue;
					iData.data[i+3] = 0xFF;
				break;
				case 3:
					// Border pixel
					iData.data[i+0] = bcRed;
					iData.data[i+1] = bcGreen;
					iData.data[i+2] = bcBlue;
					iData.data[i+3] = 0xFF;
				break;
			}
		}

		var spCanvas = document.createElement('canvas');
		spCanvas.width = cw;
		spCanvas.height = ch;
		var spCtx = spCanvas.getContext("2d");
		spCtx.putImageData(iData, 0, 0);

		curCache[n] = spCanvas;
	}

	// Return cache
	return curCache;
}

createSurface(surface, x0, y0, xLen, yLen) {
	surface[0] = x0;
	surface[1] = y0;
	surface[2] = xLen;
	surface[3] = yLen;

	if (this.master == null)
	{
		surface[4] = document.createElement('canvas');
		surface[4].width = CellGrid.charWidth * xLen;
		surface[4].height = CellGrid.charHeight * yLen;
		//TBD:  Additional attributes?
		//canvas.id     = "CursorLayer";
		//canvas.style.zIndex   = 8;
		//canvas.style.position = "absolute";
		//canvas.style.border   = "1px solid";
		surface[6] = surface[4].getContext("2d");
	}
};

createSurfaces(overallSizeX, overallSizeY, viewport, copyFromOld=false) {
	if (this.master != null)
		return;

	// Establish viewport dimensions
	var vpX0 = viewport[0] - 1;
	var vpY0 = viewport[1] - 1;
	var vpXLen = viewport[2];
	var vpYLen = viewport[3];
	var vpX1 = vpX0 + vpXLen;
	var vpY1 = vpY0 + vpYLen;

	// Reset existing surfaces.
	this.surfaces[0][4] = null;
	this.surfaces[1][4] = null;
	this.surfaces[2][4] = null;
	this.surfaces[3][4] = null;
	this.surfaces[4][4] = null;

	// Depending on how the viewport is aligned within or next to the GUI, there can be
	// between one and five surfaces created.  This build assumes only one surface.
	this.createSurface(this.surfaces[0], 0, 0, overallSizeX, overallSizeY);
	this.numSurfaces = 1;

	if (copyFromOld)
	{
		for (var cy = 0; cy < this.ySize; cy++)
		{
			for (var cx = 0; cx < this.xSize; cx++)
			{	
				var locIdx = cy * this.ixSize + cx;
				this.setCell(cx, cy, this.chars[locIdx], this.attrs[locIdx]);
			}
		}
	}
};

silentErase(charCode, attr) {
	for (var cy = 0; cy < this.iySize; cy++)
	{
		for (var cx = 0; cx < this.ixSize; cx++)
		{
			var locIdx = cy * this.ixSize + cx;
			this.chars[locIdx] = charCode;
			this.attrs[locIdx] = attr;
		}
	}

	for (var n = 0; n < this.numSurfaces; n++)
		this.surfaces[n][5] = false;
};

redrawGrid(x1=0, y1=0, x2=0x7FFFFFFF, y2=0x7FFFFFFF) {
	if (x2 > this.xSize)
		x2 = this.xSize;
	if (y2 > this.ySize)
		y2 = this.ySize;

	for (var cy = y1; cy < y2; cy++)
	{
		for (var cx = x1; cx < x2; cx++)
		{
			var locIdx = cy * this.ixSize + cx;
			this.setCell(cx, cy, this.chars[locIdx], this.attrs[locIdx]);
		}
	}
};

getTargetSurface(x, y) {
	for (var i = 0; i < this.numSurfaces; i++) {
		var s = this.surfaces[i];
		if (x >= s[0] && y >= s[1] && x < s[0] + s[2] && y < s[1] + s[3])
			return s;
	}

	// Early-out if coordinates are outside all surfaces
	return null;
};

drawSurfaces(redrawAll=false) {
	if (this.master != null)
	{
		// Borrow the canvas and context from the master
		var sMaster = this.master.surfaces[0];
		var s = this.surfaces[0];
		s[4] = sMaster[4];
		s[6] = sMaster[6];

		this.renderCellsToSurface(s);
		s[5] = false;
		CellGrid.context.beginPath();
		CellGrid.context.drawImage(sMaster[4], 0, 0,
			sMaster[2] * CellGrid.charWidth, sMaster[3] * CellGrid.charHeight,
			sMaster[0] * CellGrid.charWidth + this.master.x,
			sMaster[1] * CellGrid.charHeight + this.master.y,
			sMaster[2] * CellGrid.charWidth * this.master.doubleFactor,
			sMaster[3] * CellGrid.charHeight * CellGrid.fitStretch);

		CellGrid.scCount = 0;
		CellGrid.scfCount = 0;

		s[4] = null;
		s[6] = null;
		return;
	}

	for (var i = 0; i < this.numSurfaces; i++) {
		var s = this.surfaces[i];
		if (s[5] || redrawAll)
		{
			this.renderCellsToSurface(s);

			s[5] = false;
			CellGrid.context.beginPath();
			//CellGrid.context.drawImage(s[4], s[0] * this.charWidth + this.x, s[1] * this.charHeight + this.y);
			CellGrid.context.drawImage(s[4], 0, 0, s[2] * CellGrid.charWidth, s[3] * CellGrid.charHeight,
				s[0] * CellGrid.charWidth + this.x, s[1] * CellGrid.charHeight + this.y,
				s[2] * CellGrid.charWidth * this.doubleFactor, s[3] * CellGrid.charHeight * CellGrid.fitStretch);

			/*CellGrid.sUpdateCount++;
			var d = Date.now();
			var diff = d - CellGrid.lastSurfaceUpdate;
			CellGrid.cumSCCount += CellGrid.scCount;
			if (d - CellGrid.updatePeriod > 10000)
			{
				console.log("Num: ", CellGrid.sUpdateCount, "  Cells: ", CellGrid.cumSCCount, "  MS 1: ", diff, "  MS All: ", d - CellGrid.veryFirstUpdate);
				CellGrid.updatePeriod = d;
			}
			//console.log("ONE:  ", diff, " SC: ", CellGrid.scCount, " SCF: ", CellGrid.scfCount);
			
			CellGrid.lastSurfaceUpdate = d;*/
			CellGrid.scCount = 0;
			CellGrid.scfCount = 0;
		}
	}
};

// Set a cell to a special scroll frame character.  This does not
// modify the record of the underlying character and color.
setCellScrollFrame(x, y, charCode, attr=-1) {
	// Select target surface.  Early-out if coordinates are outside all surfaces.
	var s = this.getTargetSurface(x, y);
	if (!s)
		return;

	if (this.master != null)
	{
		s = this.master.getTargetSurface(x, y);
		if (!s)
			return;
	}

	// If in legacy mode, do not draw overlay codes.
	// We will use normal characters instead.
	if (CellGrid.scrollLegacyMode != 0)
	{
		if (charCode >= 256)
			charCode = CellGrid.scrollFrameLegacyCodes[(charCode - 256) & 15];
	}

	// See if this is a scroll frame character.  If not, call regular setCell.
	s[5] = true;
	if (charCode < 256)
		this.updateScrollList.push(x, y, charCode, attr);
	else
		this.updateScrollList.push(x, y, charCode, -2);
};

// Standard cell-drawing function.
setCell(x, y, charCode, attr=-1) {
	// Select target surface.  Early-out if coordinates are outside all surfaces.
	var s = this.getTargetSurface(x, y);
	if (!s)
		return;

	if (this.master != null)
	{
		s = this.master.getTargetSurface(x, y);
		if (!s)
			return;
	}

	// Use existing attribute if not changed
	var locIdx = y * this.ixSize + x;
	if (attr == -1)
		attr = this.attrs[locIdx];

	// Expand update range.
	if (this.updateX1 > x)
		this.updateX1 = x;
	if (this.updateY1 > y)
		this.updateY1 = y;
	if (this.updateX2 < x)
		this.updateX2 = x;
	if (this.updateY2 < y)
		this.updateY2 = y;

	// Increase update count; if this moves beyond the single update range,
	// stop counting the coordinates individually.
	if (++this.updateCount < CellGrid.SINGLE_UPDATE_THRESHOLD)
		this.updateList.push(x, y);

	// Register an update to blink buffer if blink bit changed.
	if (((attr ^ this.attrs[locIdx]) & 128) != 0 && CellGrid.blinkBitUsed)
		CellGrid.blinkChanged = true;

	// Update backend.
	s[5] = true;
	this.chars[locIdx] = charCode;
	this.attrs[locIdx] = attr;
};

// Queue cell for blink update.
changeBlinkForCell(x, y, setOn) {
	this.setCell(x, y, this.chars[y * this.ixSize + x]);
};

// Draw all cells to surface requiring an update.
renderCellsToSurface(s) {
	// Find out total number of cells that would be updated
	// if we would use the "range-update" mechanism.
	var rangeUpdateCountCalc = 0;
	if (this.updateX2 >= 0)
	{
		rangeUpdateCountCalc =
			(this.updateX2 - this.updateX1 + 1) * (this.updateY2 - this.updateY1 + 1);
	}

	if (this.updateCount < CellGrid.SINGLE_UPDATE_THRESHOLD &&
		this.updateCount < rangeUpdateCountCalc)
	{
		// This loop is a "single-update" requiring only updating each
		// individual cell registered.  These cells can be "scattered"
		// and still update over the entire screen without problems.
		var uListLen = this.updateList.length;
		for (var i = 0; i < uListLen; i += 2) {
			var x = this.updateList[i + 0];
			var y = this.updateList[i + 1];
			this.renderCell(s, x, y);
		}
	}
	else
	{
		// This loop is a "range-update" requiring updating cells within
		// the two-dimensional update range.  If enough cells were updated,
		// the range expands to include the entire surface.
		if (this.updateCount >= CellGrid.ALL_UPDATE_THRESHOLD)
		{
			this.updateX1 = s[0];
			this.updateY1 = s[1];
			this.updateX2 = s[2] - 1;
			this.updateY2 = s[3] - 1;
		}

		for (var y = this.updateY1; y <= this.updateY2; y++) {
			for (var x = this.updateX1; x <= this.updateX2; x++) {
				this.renderCell(s, x, y);
			}
		}
	}

	// This loop handles scroll frame updates.
	uListLen = this.updateScrollList.length;
	for (var i = 0; i < uListLen; i += 4) {
		var x = this.updateScrollList[i + 0];
		var y = this.updateScrollList[i + 1];
		var charCode = this.updateScrollList[i + 2];
		var attr = this.updateScrollList[i + 3];
		this.renderOverCell(s, x, y, charCode, attr);
	}

	// Reset counters and lists
	this.updateCount = 0;
	this.updateX1 = 100000000;
	this.updateX2 = -1;
	this.updateY1 = 100000000;
	this.updateY2 = -1;
	this.updateList = [];
	this.updateScrollList = [];
};

// Draw a cell to a surface at the coordinates.
// The backend should have the necessary information.
renderCell(s, x, y) {
	// Reconcile attribute, shown character, and blink
	var locIdx = y * this.ixSize + x;
	var charCode = this.chars[locIdx];
	var attr = this.attrs[locIdx];

	if (attr == -1)
		attr = this.attrs[locIdx];
	if ((attr & 128) != 0 && CellGrid.blinkBitUsed)
		charCode = CellGrid.blinkOnVis ? charCode : 0;

	// Establish color change
	var fgColor = attr & 15;
	var bgColor = (attr >> 4) & CellGrid.bgMask;

	// Get sprite and background
	this.ensureSpriteInCache(charCode & 255, fgColor);
	var sp = CellGrid.spCache[charCode & 255][fgColor];
	var bg = CellGrid.bgColors[bgColor];

	// Get UL corner
	var destX = (x - s[0]) * CellGrid.charWidth + this.x;
	var destY = (y - s[1]) * CellGrid.charHeight + this.y;

	s[6].beginPath();
	s[6].fillStyle = bg;
	s[6].fillRect(destX, destY, CellGrid.charWidth, CellGrid.charHeight);

	//CellGrid.cellCtx.putImageData(sp, 0, 0);
	s[6].drawImage(sp, 0, 0, CellGrid.charWidth, CellGrid.charHeight,
		destX, destY, CellGrid.charWidth, CellGrid.charHeight);
	CellGrid.scCount++;
};

// Draw a cell to a surface at the coordinates.
// The backend does not provide the information; char and attr are external.
renderOverCell(s, x, y, charCode, attr) {
	// Get UL corner
	var destX = (x - s[0]) * CellGrid.charWidth + this.x;
	var destY = (y - s[1]) * CellGrid.charHeight + this.y;

	if (attr == -2)
	{
		// Get sprite from cell overlay code.
		var sp = CellGrid.scrollCache[(charCode - 256) & 255];

		//CellGrid.cellCtx.putImageData(sp, 0, 0);
		s[6].beginPath();
		s[6].drawImage(sp, 0, 0,
			CellGrid.charWidth, ASCII_Characters.CHAR_HEIGHT16,
			destX, destY, CellGrid.charWidth, CellGrid.charHeight);
		CellGrid.scfCount++;
	}
	else
	{
		// Establish color change
		var fgColor = attr & 15;
		var bgColor = (attr >> 4) & CellGrid.bgMask;

		// Get sprite and background
		this.ensureSpriteInCache(charCode & 255, fgColor);
		var sp = CellGrid.spCache[charCode & 255][fgColor];
		var bg = CellGrid.bgColors[bgColor];

		s[6].beginPath();
		s[6].fillStyle = bg;
		s[6].fillRect(destX, destY, CellGrid.charWidth, CellGrid.charHeight);

		//CellGrid.cellCtx.putImageData(sp, 0, 0);
		s[6].drawImage(sp, 0, 0, CellGrid.charWidth, CellGrid.charHeight,
			destX, destY, CellGrid.charWidth, CellGrid.charHeight);
		CellGrid.scfCount++;
	}
};

getChar(cx, cy) {
	// Clipped out of grid
	if (cx < 0 || cx >= this.xSize || cy < 0 || cy >= this.ySize)
		return 0;

	return this.chars[cy * this.ixSize + cx];
};

getAttr(cx, cy) {
	// Clipped out of grid
	if (cx < 0 || cx >= this.xSize || cy < 0 || cy >= this.ySize)
		return 0;

	// Get color
	return this.attrs[cy * this.ixSize + cx];
};

getFG(cx, cy) {
	return (this.getAttr(cx, cy) & 15);
};

getBG(cx, cy) {
	return ((this.getAttr(cx, cy) >> 4) & CellGrid.bgMask);
};

writeStr(cx, cy, str, attr=-1) {
	// Write multiple cells and possible color
	for (var i = 0; i < str.length; i++)
	{
		this.setCell(cx, cy, utils.int(str.charCodeAt(i)), attr);
		cx++;
	}
};

writeUntilWordEdge(cx, cy, cWidth, str, attr=-1, centered=false) {
	var hasSpaces = false;
	var lastWasSpace = false;
	var safeExtent = 0;
	var nextWord = 0;
	var i;

	// Find how many characters will fit on line.
	for (i = 0; i < str.length && i < cWidth; i++) {
		var c = utils.int(str.charCodeAt(i));
		if (c == 32)
		{
			// Space; will be possible implied break of line.
			if (!lastWasSpace)
			{
				safeExtent = i;
				lastWasSpace = true;
				hasSpaces = true;
			}

			nextWord = i + 1;
		}
		else if (c == 10)
		{
			// Line break; done with line.
			nextWord = i + 1;
			if (!lastWasSpace)
				safeExtent = i;
			break;
		}
		else
		{
			// Non-space.
			lastWasSpace = false;
		}
	}

	if (!hasSpaces && safeExtent == 0)
	{
		// The "safe extent" distance becomes the entire width if
		// there are no spaces on the entire line.
		safeExtent = cWidth;
	}

	// Display the clipped line.
	if (centered)
		this.writeStr(utils.int(cx + cWidth/2 - safeExtent/2), cy,
			str.substr(0, safeExtent), attr);
	else
		this.writeStr(cx, cy, str.substr(0, safeExtent), attr);

	// Return the next point where the line should continue.
	return nextWord;
};

writeMultipleWrapLines(cx, cy, cWidth, cHeight, str, attr=-1, centered=false) {
	// Write partial lines until done with string or cHeight reached.
	do {
		var nextPos =
			this.writeUntilWordEdge(cx, cy, cWidth, str, attr, centered);
		str = str.substr(nextPos);

		cy++;
	} while (str != "" && cy < cHeight);

	// Return number of lines written.
	return cy;
};

writeBlock(cx, cy, strList, attrList=null) {
	// Write block of rows from an array, optionally coloring them as well
	if (attrList == null)
	{
		// No color info; keep color
		for (var dy = 0; dy < strList.length; dy++)
		{
			this.writeStr(cx, cy + dy, strList[dy]);
		}
	}
	else
	{
		// Color info; write characters and colors
		for (dy = 0; dy < strList.length; dy++)
		{
			for (var dx = 0; dx < strList[0].length; dx++)
			{
				this.setCell(cx + dx, cy + dy,
				utils.int(strList[dy].charCodeAt(dx)), utils.int(attrList[dy][dx]));
			}
		}
	}
};

writeConst(cx, cy, xlen, ylen, cChar, attr) {
	// Paint block of rows with constant character and color
	var c = utils.int(cChar.charCodeAt(0));
	for (var dy = 0; dy < ylen; dy++)
	{
		for (var dx = 0; dx < xlen; dx++)
		{
			this.setCell(cx + dx, cy + dy, c, attr);
		}
	}
};

writeXorAttr(cx, cy, xlen, ylen, attr) {
	// XOR the color at the block with the specified color attribute mask
	for (var dy = 0; dy < ylen; dy++)
	{
		for (var dx = 0; dx < xlen; dx++)
		{
			var newAttr = this.getAttr(cx + dx, cy + dy) ^ attr;
			this.setCell(cx + dx, cy + dy, this.getChar(cx + dx, cy + dy), newAttr);
		}
	}
};

moveBlock(cx1, cy1, cx2, cy2, xDiff, yDiff) {
	// Copy a block of existing cells by (xDiff, yDiff).
	var xInc = utils.isgn(xDiff);
	var yInc = utils.isgn(yDiff);
	var xLen = utils.iabs(cx2 - cx1);
	var yLen = utils.iabs(cy2 - cy1);
	var tempVal;
	if (xInc > 0)
	{
		tempVal = cx1;
		cx1 = cx2;
		cx2 = tempVal;
	}
	if (yInc > 0)
	{
		tempVal = cy1;
		cy1 = cy2;
		cy2 = tempVal;
	}
	if (xInc == 0)
		xInc = -1;
	if (yInc == 0)
		yInc = -1;

	for (var dy = cy1; yLen >= 0; dy -= yInc, yLen--)
	{
		var xLen2 = xLen;
		for (var dx = cx1; xLen2 >= 0; dx -= xInc, xLen2--)
		{
			var locIdx = dy * this.ixSize + dx;
			this.setCell(dx + xDiff, dy + yDiff, this.chars[locIdx], this.attrs[locIdx]);
		}
	}
};

updateScanlineMode(mode) {
	// Establish overall mode from updated scanline mode
	var origOverallMode = CellGrid.overallMode;
	CellGrid.scanlineMode = mode;
	CellGrid.overallMode = CellGrid.scanlineMode * 3;

	// Character set is reverted to default set for the scanline size.
	// This can be configured later by selecting a different character
	// set.  If the character set is not the same size as the
	// preferred number of lines per character, can have > 25 rows.
	CellGrid.myBitmapBank = this.defaultBmBanks[CellGrid.scanlineMode];

	if (origOverallMode == CellGrid.overallMode)
	{
		// If nothing substantial changed with the scanline mode,
		// we will not need to rebuild the sprite cache in its entirety.
		// Just invalidate characters to ensure the defaults will be loaded.
		this.invalidateCacheChars(0, 255);
	}
	else
	{
		// Rebuild the sprite cache (it can be a different size).
		CellGrid.spCache = CellGrid.createSpriteCache(CellGrid.myBitmapBank,
			ASCII_Characters.CHAR_WIDTH, this.bmHeights[CellGrid.scanlineMode],
			CellGrid.colorLookup);
	}

	CellGrid.charHeightMode = CellGrid.scanlineMode;
	CellGrid.overallMode += CellGrid.charHeightMode;

	// Establish mode parameters
	var mi = CellGrid.modeInfo[CellGrid.overallMode];
	var oldNumRows = CellGrid.numrows;
	CellGrid.numrows = 25;
	var oldCharHeight = CellGrid.charHeight;
	CellGrid.charHeight = mi[2];
	CellGrid.fitStretch = mi[5];
	CellGrid.virtualCellYDiv = 16;

	// If the number of rows/char height had changed, adjust the visible height.
	if (CellGrid.numrows != oldNumRows || CellGrid.charHeight != oldCharHeight)
	{
		this.ySize = CellGrid.numrows;
		this.totalCount = this.xSize * this.ySize;
	}

	// Will need to re-create surfaces after this call.
};

setDefaultCharacters() {
	var mi = CellGrid.modeInfo[CellGrid.overallMode];
	CellGrid.myBitmapBank = this.defaultBmBanks[mi[0]];

	// Invalidate sprite cache.
	this.invalidateCacheChars(0, 255);

	// Re-create sprite cache.
	//CellGrid.spCache = CellGrid.createSpriteCache(CellGrid.myBitmapBank,
	//	ASCII_Characters.CHAR_WIDTH, CellGrid.charHeight, CellGrid.colorLookup);

	// Will need to re-create surfaces after this call.
};

getCurrentCharacterMask(charNum, xLength=-1) {
	var bmd = CellGrid.myBitmapBank[charNum];
	var cell = [];
	var subCell = [];
	var xCounter = 0;

	for (var y = 0; y < CellGrid.charHeight; y++) {
		if (xLength == -1)
		{
			// No sub-length
			for (var x = 0; x < CellGrid.charWidth; x++) {
				var i = (y * CellGrid.charWidth + x) * 4;
				var val = bmd.data[i+3];
				cell.push((val != 0) ? 1 : 0);
			}
		}
		else
		{
			// Sub-length of xLength
			for (x = 0; x < CellGrid.charWidth; x++) {
				var i = (y * CellGrid.charWidth + x) * 4;
				var val = bmd.data[i+3];
				subCell.push((val != 0) ? 1 : 0);
				if (subCell.length >= xLength)
				{
					cell.push(subCell);
					subCell = [];
				}
			}
		}
	}

	return cell;
};

updateCharacterSet(cellXSize, cellYSize, cellsAcross, cellsDown, startChar, sequence) {
	// Find out what to do based on character cell size.
	var srcHeightOffset = 2;
	var customStretch = false;
	switch (cellYSize) {
		case 8:
			srcHeightOffset = 0;
		break;
		case 14:
			srcHeightOffset = 1;
		break;
		case 16:
			srcHeightOffset = 2;
		break;
		default:
			customStretch = true;
		break;
	}

	// Establish mode parameters
	var oldCharHeight = CellGrid.charHeight;
	var oldDefaultBms = this.defaultBmBanks[srcHeightOffset];

	var origOverallMode = CellGrid.overallMode;
	CellGrid.overallMode = CellGrid.scanlineMode * 3 + srcHeightOffset;
	CellGrid.charHeightMode = srcHeightOffset;

	var mi = CellGrid.modeInfo[CellGrid.overallMode];
	CellGrid.charHeight = mi[2];

	var oldNumRows = CellGrid.numrows;
	CellGrid.numrows = mi[3];

	var preStretch = mi[4];
	CellGrid.virtualCellYDiv = 400.0 / mi[1] * CellGrid.charHeight;

	CellGrid.fitStretch = mi[5];
	if (customStretch)
		preStretch = Number(CellGrid.charHeight) / Number(cellYSize);

	// Figure out sequence iteration parameters
	var endChar = startChar + (cellsAcross * cellsDown);
	var pitch = cellsAcross * cellXSize;
	var newBitmapBank = [];

	// Establish the new character cell bitmaps.
	for (var n = 0; n < 256; n++) {
		var bmd = null;

		if (n < startChar || n >= endChar)
		{
			// Use original character set--our list did not include this character.
			if (CellGrid.charHeight == oldCharHeight)
			{
				bmd = CellGrid.tempCtx.createImageData(
					CellGrid.charWidth, CellGrid.charHeight);
				var origBmd = CellGrid.myBitmapBank[n];

				var total = CellGrid.charWidth * CellGrid.charHeight * 4;
				for (var i = 0; i < total; i++)
					bmd.data[i] = origBmd.data[i];
			}
			else
				bmd = oldDefaultBms[n];
		}
		else
		{
			// Create new bitmap from provided cell data.
			var rowIdx = utils.int((n - startChar) / cellsAcross);
			var colIdx = utils.int((n - startChar) % cellsAcross);
			var seqBase = (rowIdx * pitch * cellYSize) + (colIdx * cellXSize);
			bmd = CellGrid.tempCtx.createImageData(
				CellGrid.charWidth, CellGrid.charHeight);

			var i = 0;
			for (var y = 0; y < CellGrid.charHeight; y++) {
				// The pre-stretch factor is used when we must scale the
				// source data to a target height.
				var seqIdx = utils.int(preStretch * y) * pitch + seqBase;

				for (var x = 0; x < CellGrid.charWidth; x++) {
					var pix = sequence[seqIdx++];
					if (pix != 0)
					{
						bmd.data[i++] = 0xFF;
						bmd.data[i++] = 0xFF;
						bmd.data[i++] = 0xFF;
						bmd.data[i++] = 0xFF;
					}
					else
					{
						bmd.data[i++] = 0;
						bmd.data[i++] = 0;
						bmd.data[i++] = 0;
						bmd.data[i++] = 0;
					}
				}
			}
		}

		// Store new character cell
		newBitmapBank[n] = bmd;
	}

	CellGrid.myBitmapBank = newBitmapBank;

	// If the number of rows/char height had changed, adjust the visible height.
	if (CellGrid.numrows != oldNumRows || CellGrid.charHeight != oldCharHeight)
	{
		this.ySize = CellGrid.numrows;
		this.totalCount = this.xSize * this.ySize;
		//this.bitmapData = new BitmapData(this.xSize * this.charWidth, this.ySize * this.charHeight, false, 0);
	}

	if (origOverallMode == CellGrid.overallMode)
	{
		// If nothing substantial changed with the scanline mode,
		// we will not need to rebuild the sprite cache in its entirety.
		// Just invalidate characters to ensure characters will be reloaded.
		this.invalidateCacheChars(startChar, endChar - 1);
	}
	else
	{
		// Rebuild the sprite cache (it can be a different size).
		CellGrid.spCache = CellGrid.createSpriteCache(CellGrid.myBitmapBank,
			ASCII_Characters.CHAR_WIDTH, CellGrid.charHeight, CellGrid.colorLookup);
	}

	// Adjust window stretch
	//this.scaleY = CellGrid.fitStretch;

	// Will need to re-create surfaces after this call.
};

updateBit7Meaning(useBlink) {
	if (CellGrid.blinkBitUsed == Boolean(useBlink == 1))
		return;

	CellGrid.blinkBitUsed = Boolean(useBlink == 1);
	CellGrid.bgMask = (useBlink == 1) ? 7 : 15;
	this.redrawGrid();
	CellGrid.blinkChanged = true;
};

setPaletteColor(palIdx, red, green, blue) {
	this.setPaletteColors(palIdx, 1, 255, [ red, green, blue ]);
};

setPaletteColors(palIdxStart, palIdxNum, extent, sequence) {
	// Extract RGB basis for default 16 colors
	var seqIdx = 0;
	if (sequence.length < palIdxNum * 3)
		palIdxNum = utils.int(sequence.length / 3);

	var palIdxEnd = palIdxStart + palIdxNum - 1;
	for (var i = palIdxStart; i <= palIdxEnd; i++) {
		var r = (sequence[seqIdx++] * 255 / extent);
		var g = (sequence[seqIdx++] * 255 / extent);
		var b = (sequence[seqIdx++] * 255 / extent);
		var rScale = r << 16;
		var gScale = g << 8;
		var bScale = b;
		this.colors16[i * 3 + 0] = rScale;
		this.colors16[i * 3 + 1] = gScale;
		this.colors16[i * 3 + 2] = bScale;

		this.invalidateCacheColor(i);
		/*this.updateSpriteCache(CellGrid.myBitmapBank,
			ASCII_Characters.CHAR_WIDTH, this.bmHeights[CellGrid.scanlineMode],
			i, rScale + gScale + bScale);*/

		CellGrid.bgColors[i] = "#" + utils.hexcode(r) + utils.hexcode(g) + utils.hexcode(b);
	}

	this.redrawGrid();
};

getPaletteColors() {
	// Extract RGB basis for default 16 colors
	var sequence = [];
	for (var i = 0; i < this.colors16.length; i += 3) {
		sequence.push((this.colors16[i+0] >> 16) & 255);
		sequence.push((this.colors16[i+1] >> 8) & 255);
		sequence.push(this.colors16[i+2] & 255);
	}

	return sequence;
};

getDefaultPaletteColors() {
	var sequence = [];
	for (var i = 0; i < 16; i++) {
		var c = CellGrid.colorLookup[i];
		sequence.push((c >> 16) & 255);
		sequence.push((c >> 8) & 255);
		sequence.push(c & 255);
	}

	return sequence;
};

captureBlinkList(vis) {
	if (!CellGrid.blinkBitUsed)
		return;

	// Go through all cells identified as blinking and set visibility.
	CellGrid.blinkOnVis = vis;
	this.blinkList = [];
	for (var cy = 0; cy < this.ySize; cy++)
	{
		for (var cx = 0; cx < this.xSize; cx++)
		{
			var locIdx = cy * this.ixSize + cx;
			if (this.attrs[locIdx] & 128)
			{
				this.changeBlinkForCell(cx, cy, vis);
				this.blinkList.push(cx);
				this.blinkList.push(cy);
			}
		}
	}
};

blinkToggle(vis) {
	if (!CellGrid.blinkBitUsed)
		return;

	// Go through record of cells, altering FG visibility state.
	CellGrid.blinkOnVis = vis;
	var numBlink = this.blinkList.length;
	for (var i = 0; i < numBlink; i += 2)
	{
		var cx = this.blinkList[i];
		var cy = this.blinkList[i+1];
		this.changeBlinkForCell(cx, cy, vis);
	}
};

}
