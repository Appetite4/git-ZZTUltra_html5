// ASCII_Characters.js:  The source for the ASCII character pixel data.
"use strict";

class ASCII_Characters {

// Set up sprite list from a stock-image character set
static createFromStockCharSet(context, charSets, charSetIdx, w, h, cw, ch) {
	var charSet = charSets[charSetIdx];

	context.fillStyle = "#000000";
	context.fillRect(0, 0, w, h);
	context.drawImage(charSet, 0, 0);
	var d = context.getImageData(0, 0, w, h);
	var curSprites = [];

	var n = 0;
	for (var y = 0; y < h; y += ch) {
		for (var x = 0; x < w; x += cw) {
			// Create sprite image data
			var iData = context.createImageData(cw, ch);

			// Set sprite character data
			var i = 0;
			for (var dy = 0; dy < ch; dy++) {
				for (var dx = 0; dx < cw; dx++) {

					// Set sprite to uniform all-FF or all-00 boolean mask profile
					var offset = ((y + dy) * w + (x + dx)) * 4;
					var val = d.data[offset];
					iData.data[i+0] = val;
					iData.data[i+1] = val;
					iData.data[i+2] = val;
					iData.data[i+3] = val;
					i += 4;
				}
			}

			// Next character
			curSprites[n] = iData;
			n++;
		}
	}

	// Return set of image data sprites
	return curSprites;
}

// Set up scroll edge sprite list from a stock-image character set
static createScrollSet(context, charSets, charSetIdx, w, h, cw, ch) {
	var charSet = charSets[charSetIdx];

	context.fillStyle = "#000000";
	context.fillRect(0, 0, w, h);
	context.drawImage(charSet, 0, 0);
	var d = context.getImageData(0, 0, w, h);
	var curSprites = [];

	var n = 0;
	for (var y = 0; y < h; y += ch) {
		for (var x = 0; x < w; x += cw) {
			// Create sprite image data
			var iData = context.createImageData(cw, ch);

			// Set sprite character data
			var i = 0;
			for (var dy = 0; dy < ch; dy++) {
				for (var dx = 0; dx < cw; dx++) {

					// Set sprite to uniform special quad-function mask profile
					var offset = ((y + dy) * w + (x + dx)) * 4;
					var R = d.data[offset+0];
					var G = d.data[offset+1];
					var B = d.data[offset+2];
					var A = d.data[offset+3];

					iData.data[i+1] = 0;
					iData.data[i+2] = 0;
					iData.data[i+3] = 0;

					if (R == 255 && G == 255 && B == 255)
						iData.data[i+0] = 3; // Frame color
					else if (R == 0 && G == 0)
					{
						if (B == 0)
							iData.data[i+0] = 1; // Drop-shadow color
						else
							iData.data[i+0] = 2; // Background color
					}
					else
						iData.data[i+0] = 0; // Transparent
/*
					if (A == 0)
						iData.data[i+0] = 0; // Transparent
					else if (G == 0 && B == 0)
					{
						if (R == 0)
							iData.data[i+0] = 1; // Drop-shadow color
						else
							iData.data[i+0] = 2; // Background color
					}
					else
						iData.data[i+0] = 3; // Frame color
*/
					i += 4;
				}
			}

			// Next character
			curSprites[n] = iData;
			n++;
		}
	}
	
	// Return set of image data sprites
	return curSprites;
}

// Initialize class
static Separate_ASCII_Characters(context, charSets) {
	ASCII_Characters.CHAR_WIDTH = 8;
	ASCII_Characters.CHAR_HEIGHT = 16;
	ASCII_Characters.CHAR_HEIGHT16 = 16;
	ASCII_Characters.CHAR_HEIGHT14 = 14;
	ASCII_Characters.CHAR_HEIGHT8 = 8;
	ASCII_Characters.bmBank8 = ASCII_Characters.createFromStockCharSet(
		context, charSets, 0, 256, 64, 8, 8);
	ASCII_Characters.bmBank14 = ASCII_Characters.createFromStockCharSet(
		context, charSets, 1, 256, 112, 8, 14);
	ASCII_Characters.bmBank16 = ASCII_Characters.createFromStockCharSet(
		context, charSets, 2, 256, 128, 8, 16);
	ASCII_Characters.bmBankScroll = ASCII_Characters.createScrollSet(
		context, charSets, 3, 128, 16, 8, 16);
	ASCII_Characters.bg = null;
}

}
