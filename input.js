// input.js:  The program's input-handling functions.
"use strict";

class input {

static initClass() {
	// Constants
	input.MOUSE_WHEEL_COUNT_THRESHOLD = 4;
	input.MOUSE_WHEEL_TIME_THRESHOLD = 3;
	input.MOUSE_WHEEL_MULTIPLIER = 3;

	input.C2M_MODE_TOWARDS = 1;
	input.C2M_MODE_CCW = 2;
	input.C2M_MODE_CW = 3;
	input.C2M_MODE_EXTEND = 4;

	input.C2M_GIVEUP_THRESHOLD = 1500;

	// Keyboard and mouse info
	input.keyCodeDowns = null;
	input.keyCharDowns = null;
	input.lastWheelMCount = 0;
	input.progWheelCount = 0;
	input.mDownCount = 0;
	input.mDown = false;
	input.mouseXGridPos = 0;
	input.mouseYGridPos = 0;

	// Mouse click-to-move location info
	input.c2MMode = input.C2M_MODE_TOWARDS;
	input.c2MCount = 0;
	input.c2MDestX = -1;
	input.c2MDestY = -1;
	input.c2MDir = 0;
	input.c2MBeatDist = 0;
	input.lastPlayerX = -1;
	input.lastPlayerY = -1;
	input.c2MCircleDestX = -1;
	input.c2MCircleDestY = -1;
	input.c2MExtendDestX = -1;
	input.c2MExtendDestY = -1;
	input.c2MExtendDir = 0;
	input.c2MMoveCountLowest = 0;

	input.initKeyLookups();
};

// Create keyboard lookup tables.
// We have to do this to maintain a common set of key codes and
// character codes across different browsers.
static initKeyLookups() {
	// Default relationship is 1-to-1
	input.keyCode2CharCode = [];
	input.charCode2KeyCode = [];
	for (var i = 0; i < 256; i++) {
		input.keyCode2CharCode.push(i);
		input.charCode2KeyCode.push(i);
	}

	// Alpha case conversion
	for (i = 97; i <= 122; i++)
		input.charCode2KeyCode[i] = i - 32;

	// No equivalent for keyCode-to-charCode
	input.keyCode2CharCode[91] = 0; // Windows
	input.keyCode2CharCode[92] = 0; // Windows
	input.keyCode2CharCode[93] = 0; // Context menu
	input.keyCode2CharCode[16] = 0; // Shift
	input.keyCode2CharCode[17] = 0; // Control
	input.keyCode2CharCode[20] = 0; // Caps lock
	input.keyCode2CharCode[145] = 0; // Scroll lock
	input.keyCode2CharCode[19] = 0; // Pause/Break
	input.keyCode2CharCode[37] = 0; // Left
	input.keyCode2CharCode[38] = 0; // Up
	input.keyCode2CharCode[39] = 0; // Right
	input.keyCode2CharCode[40] = 0; // Down
	input.keyCode2CharCode[45] = 0; // Insert
	input.keyCode2CharCode[46] = 0; // Delete
	input.keyCode2CharCode[36] = 0; // Home
	input.keyCode2CharCode[35] = 0; // End
	input.keyCode2CharCode[33] = 0; // Page Up
	input.keyCode2CharCode[34] = 0; // Page Down
	input.keyCode2CharCode[144] = 0; // Num lock
	for (var j = 0; j < 12; j++)
		input.keyCode2CharCode[112 + j] = 0; // Function keys

	// Single equivalent for keyCode-to-charCode
	input.keyCode2CharCode[11] = 47; // Numpad slash
	input.keyCode2CharCode[106] = 42; // Numpad asterisk
	input.keyCode2CharCode[109] = 45; // Numpad minus
	input.keyCode2CharCode[107] = 43; // Numpad plus

	// Num lock-triggered alternates
	input.keyCode2CharCode[110] = 46; // Numpad period/delete (with num lock)
	input.keyCode2CharCode[12] = 0; // Numpad 5 (no num lock)
	input.keyCode2CharCode[96] = 48; // Numpad 0 (with num lock)
	input.keyCode2CharCode[97] = 49; // Numpad 1 (with num lock)
	input.keyCode2CharCode[98] = 50; // Numpad 2 (with num lock)
	input.keyCode2CharCode[99] = 51; // Numpad 3 (with num lock)
	input.keyCode2CharCode[100] = 52; // Numpad 4 (with num lock)
	input.keyCode2CharCode[101] = 53; // Numpad 5 (with num lock)
	input.keyCode2CharCode[102] = 54; // Numpad 6 (with num lock)
	input.keyCode2CharCode[103] = 55; // Numpad 7 (with num lock)
	input.keyCode2CharCode[104] = 56; // Numpad 8 (with num lock)
	input.keyCode2CharCode[105] = 57; // Numpad 9 (with num lock)

	// Shift-oriented differences
	input.keyCode2CharCodeShift = [];
	for (var k = 0; k < 256; k++)
		input.keyCode2CharCodeShift.push(input.keyCode2CharCode[k]);

	// Alpha case conversion
	for (i = 97; i <= 122; i++)
		input.keyCode2CharCodeShift[i - 32] = i;

	input.keyCode2CharCode[192] = 96; // Back single quote
	input.keyCode2CharCodeShift[192] = 126; // Tilde
	input.keyCode2CharCode[189] = 45; // Minus
	input.keyCode2CharCodeShift[189] = 95; // Underscore
	input.keyCode2CharCode[173] = 45; // Minus, FF
	input.keyCode2CharCodeShift[173] = 95; // Underscore, FF
	input.keyCode2CharCode[187] = 61; // Equals
	input.keyCode2CharCodeShift[187] = 43; // Plus
	input.keyCode2CharCode[61] = 61; // Equals, FF
	input.keyCode2CharCodeShift[61] = 43; // Plus, FF
	input.keyCode2CharCode[219] = 91; // Open bracket
	input.keyCode2CharCodeShift[219] = 123; // Open brace
	input.keyCode2CharCode[221] = 93; // Close bracket
	input.keyCode2CharCodeShift[221] = 125; // Close brace
	input.keyCode2CharCode[220] = 92; // Backslash
	input.keyCode2CharCodeShift[220] = 124; // Pipe
	input.keyCode2CharCode[186] = 59; // Semicolon
	input.keyCode2CharCodeShift[186] = 58; // Colon
	input.keyCode2CharCode[59] = 59; // Semicolon, FF
	input.keyCode2CharCodeShift[59] = 58; // Colon, FF
	input.keyCode2CharCode[222] = 39; // Single quote
	input.keyCode2CharCodeShift[222] = 34; // Double quote
	input.keyCode2CharCode[188] = 44; // Comma
	input.keyCode2CharCodeShift[188] = 60; // Less than
	input.keyCode2CharCode[190] = 46; // Period
	input.keyCode2CharCodeShift[190] = 62; // Greater than
	input.keyCode2CharCode[191] = 47; // Forward slash
	input.keyCode2CharCodeShift[191] = 63; // Question mark

	// Special nonconforming character-code-to-key-code combinations
	input.charCode2KeyCode[126] = 192;
	input.charCode2KeyCode[96] = 192;
	input.charCode2KeyCode[45] = 189;
	input.charCode2KeyCode[95] = 189;
	input.charCode2KeyCode[61] = 187;
	input.charCode2KeyCode[43] = 187;
	input.charCode2KeyCode[91] = 219;
	input.charCode2KeyCode[123] = 219;
	input.charCode2KeyCode[93] = 221;
	input.charCode2KeyCode[125] = 221;
	input.charCode2KeyCode[92] = 220;
	input.charCode2KeyCode[124] = 220;
	input.charCode2KeyCode[59] = 186;
	input.charCode2KeyCode[58] = 186;
	input.charCode2KeyCode[39] = 222;
	input.charCode2KeyCode[34] = 222;
	input.charCode2KeyCode[44] = 188;
	input.charCode2KeyCode[60] = 188;
	input.charCode2KeyCode[46] = 190;
	input.charCode2KeyCode[62] = 190;
	input.charCode2KeyCode[47] = 191;
	input.charCode2KeyCode[63] = 191;
};

static keyDownFiltered(event, keyCode) {
	var shiftStatus = event.shiftKey;
	var ctrlStatus = event.ctrlKey;
	var charCode = input.keyCode2CharCode[keyCode & 255];
	if (!ctrlStatus && shiftStatus)
		charCode = input.keyCode2CharCodeShift[keyCode & 255];

	if (input.keyCodeDowns[keyCode & 255] == 0)
	{
		input.keyCodeDowns[keyCode & 255] = zzt.mcount;
		if (ctrlStatus)
			input.keyCharDowns[charCode & 255] = zzt.mcount;
	}

	if (ctrlStatus || charCode == 0)
	{
		// Physically pressing a key instantly cancels click-to-move.
		input.c2MDestX = -1;
		input.c2MDestY = -1;
		input.keyDownHandler(keyCode, charCode & 255, shiftStatus, ctrlStatus);
	}
}

static keyPressFiltered(event, charCode) {
	var shiftStatus = event.shiftKey;
	var ctrlStatus = event.ctrlKey;
	var keyCode = input.charCode2KeyCode[charCode & 255];

	if (charCode >= 127 || ctrlStatus)
		return;
	if (charCode < 32)
	{
		if (charCode != 8 && charCode != 9 && charCode != 13 && charCode != 27)
			return;
	}

	input.keyCharDowns[charCode & 255] = zzt.mcount;

	// Physically pressing a key instantly cancels click-to-move.
	input.c2MDestX = -1;
	input.c2MDestY = -1;
	input.keyDownHandler(keyCode, charCode & 255, shiftStatus, ctrlStatus);
}

static keyUpFiltered(event, keyCode) {
	var shiftStatus = event.shiftKey;
	var ctrlStatus = event.ctrlKey;
	var charCode = input.keyCode2CharCode[keyCode & 255];
	if (!ctrlStatus && shiftStatus)
		charCode = input.keyCode2CharCodeShift[keyCode & 255];

	input.keyCodeDowns[keyCode & 255] = 0;
	input.keyCharDowns[charCode & 255] = 0;
}

// This is an "externally written" key-down handler, posted from other input contexts
static extraKeyDownHandler(keyCode, keyChar, shiftStatus, ctrlStatus, minDelay) {
	if (input.keyCodeDowns[keyCode] != 0)
	{
		if (zzt.mcount - input.keyCodeDowns[keyCode] >= minDelay)
		{
			input.keyDownHandler(keyCode, keyChar, shiftStatus, ctrlStatus);
		}
	}
};

// Common key-down handler, regardless of input origin
static keyDownHandler(theCode, charCode, shiftStatus, ctrlStatus) {
	//console.log(theCode, charCode, shiftStatus, ctrlStatus);
	var mappingIdx = (shiftStatus ? 1 : 0) + (ctrlStatus ? 2 : 0);
	var guiKeyMappingArray = zzt.GuiKeyMappingAll[mappingIdx];

	switch (zzt.mainMode) {
		case zzt.MODE_NORM:
			if (theCode < 0 || theCode >= 256)
				break;

			if (zzt.activeObjs)
			{
				// Handle gameplay-oriented move and shoot code setting
				switch (theCode) {
					case 37: // Left
						if (shiftStatus)
							zzt.pShootDir = 2;
						else
							zzt.pMoveDir = 2;
					break;
					case 38: // Up
						if (shiftStatus)
							zzt.pShootDir = 3;
						else
							zzt.pMoveDir = 3;
					break;
					case 39: // Right
						if (shiftStatus)
							zzt.pShootDir = 0;
						else
							zzt.pMoveDir = 0;
					break;
					case 40: // Down
						if (shiftStatus)
							zzt.pShootDir = 1;
						else
							zzt.pMoveDir = 1;
					break;
				}
			}

			// Handle key code based on GUI's defined handling.
			if (zzt.inEditor && (editor.drawFlag == editor.DRAW_TEXT || editor.hexTextEntry > 0))
			{
				// Type key to text-drawing feature of world editor.
				if (theCode >= 37 && theCode <= 40 || theCode == 27)
				{
					// Cursor direction keys and ESC are dispatched.
					if (guiKeyMappingArray[theCode] != "")
						zzt.dispatchInputMessage(guiKeyMappingArray[theCode]);
				}
				else if ((charCode >= 32 && charCode < 127 || charCode == 8) && !ctrlStatus)
					editor.writeTextDrawChar(charCode);
				else if (guiKeyMappingArray[theCode] != "")
					zzt.dispatchInputMessage(guiKeyMappingArray[theCode]);
			}
			else if (guiKeyMappingArray[theCode] != "")
			{
				// Normal dispatch
				zzt.dispatchInputMessage(guiKeyMappingArray[theCode]);
			}
			else if (editor.typingTextInGuiEditor && theCode != 16 && theCode != 17)
			{
				// Type key to GUI editor.
				editor.writeKeyToGuiEditor(charCode & 255);
				editor.lastChar = 32;
			}
		break;

		case zzt.MODE_CONFMESSAGE:
			if (theCode == 37 || theCode == 39 || theCode == 9) // Left or right or tab
			{
				// Change selected confirmation button
				zzt.confButtonSel = zzt.confButtonSel + 1 & 1;
				zzt.drawConfButtons();
			}
			else if (theCode == 27 && zzt.confCancelMsg != "")
			{
				// Cancel, if allowed
				zzt.unDrawConfButtons();
				zzt.eraseGuiLabel(zzt.confLabelStr);
				zzt.mainMode = zzt.MODE_NORM;
				zzt.dispatchInputMessage(zzt.confCancelMsg);
			}
			else if (theCode == 78)
			{
				// No
				zzt.unDrawConfButtons();
				zzt.eraseGuiLabel(zzt.confLabelStr);
				zzt.mainMode = zzt.MODE_NORM;
				zzt.dispatchInputMessage(zzt.confNoMsg);
			}
			else if (theCode == 89)
			{
				// Yes
				zzt.unDrawConfButtons();
				zzt.eraseGuiLabel(zzt.confLabelStr);
				zzt.mainMode = zzt.MODE_NORM;
				zzt.dispatchInputMessage(zzt.confYesMsg);
			}
			else if (theCode == 13)
			{
				// Choose selected confirmation button
				zzt.unDrawConfButtons();
				zzt.eraseGuiLabel(zzt.confLabelStr);
				zzt.mainMode = zzt.MODE_NORM;
				zzt.dispatchInputMessage(
					(zzt.confButtonSel == 0) ? zzt.confYesMsg : zzt.confNoMsg);
			}
		break;

		case zzt.MODE_TEXTENTRY:
			if (theCode == 13)
			{
				// Yes
				zzt.eraseGuiLabel(zzt.confLabelStr);
				zzt.mainMode = zzt.MODE_NORM;
				zzt.globals["$TEXTRESULT"] = zzt.textChars;
				zzt.dispatchInputMessage(zzt.confYesMsg);
			}
			else if (theCode == 27)
			{
				// No
				zzt.eraseGuiLabel(zzt.confLabelStr);
				zzt.mainMode = zzt.MODE_NORM;
				zzt.dispatchInputMessage(zzt.confNoMsg);
			}
			else if (theCode == 8 || theCode == 37)
			{
				if (zzt.textChars.length > 0)
					zzt.textChars = zzt.textChars.substring(0, zzt.textChars.length - 1);
				zzt.drawGuiLabel(zzt.confLabelStr, zzt.textChars + " ", zzt.textCharsColor);
			}
			else if (zzt.textChars.length < zzt.textMaxCharCount &&
				charCode >= 32 && charCode < 127)
			{
				zzt.textChars += String.fromCharCode(charCode);
				zzt.drawGuiLabel(zzt.confLabelStr, zzt.textChars, zzt.textCharsColor);
			}
		break;

		case zzt.MODE_SELECTPEN:
			if (theCode == 37) // Left
			{
				if (zzt.penStartVal < zzt.penEndVal)
				{
					if (--zzt.penActVal < zzt.penStartVal)
						zzt.penActVal = zzt.penStartVal;
				}
				else
				{
					if (++zzt.penActVal > zzt.penStartVal)
						zzt.penActVal = zzt.penStartVal;
				}

				zzt.drawPen(zzt.confLabelStr, zzt.penStartVal, zzt.penEndVal, zzt.penActVal,
				zzt.penChrCode, zzt.penAttr);
			}
			else if (theCode == 39) // Right
			{
				if (zzt.penStartVal < zzt.penEndVal)
				{
					if (++zzt.penActVal > zzt.penEndVal)
						zzt.penActVal = zzt.penEndVal;
				}
				else
				{
					if (--zzt.penActVal < zzt.penEndVal)
						zzt.penActVal = zzt.penEndVal;
				}

				zzt.drawPen(zzt.confLabelStr, zzt.penStartVal, zzt.penEndVal, zzt.penActVal,
				zzt.penChrCode, zzt.penAttr);
			}
			else if (theCode == 13 || theCode == 27) // Done
			{
				zzt.drawPen(zzt.confLabelStr, zzt.penStartVal, zzt.penEndVal, zzt.penActVal,
				zzt.penChrCode, -1);
				zzt.mainMode = zzt.MODE_NORM;
				zzt.globals["$PENRESULT"] = zzt.penActVal;
				zzt.dispatchInputMessage(zzt.confYesMsg);
			}
		break;

		case zzt.MODE_SCROLLINTERACT:
			if (theCode == 38)
			{
				zzt.mouseScrollOffset = 0;
				zzt.msgScrollIndex--; // Up
			}
			else if (theCode == 40)
			{
				zzt.mouseScrollOffset = 0;
				zzt.msgScrollIndex++; // Down
			}
			else if (theCode == 33)
			{
				zzt.mouseScrollOffset = 0;
				zzt.msgScrollIndex -= zzt.msgScrollHeight; // Page Up
			}
			else if (theCode == 34)
			{
				zzt.mouseScrollOffset = 0;
				zzt.msgScrollIndex += zzt.msgScrollHeight; // Page Down
			}
			else if (theCode == 36)
			{
				zzt.mouseScrollOffset = 0;
				zzt.msgScrollIndex = 0; // Home
			}
			else if (theCode == 35)
			{
				zzt.mouseScrollOffset = 0;
				zzt.msgScrollIndex = zzt.msgScrollText.length - 1; // End
			}
			else if (theCode == 13)
				zzt.scrollInterfaceButton();
			else if (zzt.inEditor)
				editor.specialScrollKeys(theCode);
			else if (theCode == 27)
				zzt.mainMode = zzt.MODE_SCROLLCLOSE; // Done

			if (zzt.msgScrollIndex < 0)
				zzt.msgScrollIndex = 0;
			if (zzt.msgScrollIndex >= zzt.msgScrollText.length)
				zzt.msgScrollIndex = zzt.msgScrollText.length - 1;

			zzt.drawScrollMsgText();
		break;

		case zzt.MODE_FILEBROWSER:
			if (theCode == 27)
			{
				// Done; return to archive or normal mode
				zzt.fbg.visible = false;
				zzt.mg.redrawGrid();

				if (zzt.modeWhenBrowserClosed == zzt.MTRANS_ZIPSCROLL)
					zzt.zipContentsScroll();
				else if (zzt.modeWhenBrowserClosed == zzt.MTRANS_SAVEWORLD)
				{
					zzt.mainMode = zzt.MODE_NORM;
					editor.saveWorld();
				}
				else
					zzt.mainMode = zzt.MODE_NORM;
			}
			else if (theCode == 38)
				zzt.moveFileBrowser(zzt.textBrowserCursor - 1); // Up
			else if (theCode == 40)
				zzt.moveFileBrowser(zzt.textBrowserCursor + 1); // Down
			else if (theCode == 33)
				zzt.moveFileBrowser(zzt.textBrowserCursor - 22); // Page Up
			else if (theCode == 34)
				zzt.moveFileBrowser(zzt.textBrowserCursor + 22); // Page Down
			else if (theCode == 36)
				zzt.moveFileBrowser(0); // Home
			else if (theCode == 35)
				zzt.moveFileBrowser(zzt.textBrowserLines.length - 22); // End
		break;

		case zzt.MODE_COLORSEL:
			editor.drawKolorCursor(false);
			switch (theCode) {
				case 37: // Left
					editor.fgColorCursor = (editor.fgColorCursor - 1) & 15;
					if (editor.fgColorCursor == 15)
						editor.blinkFlag = !editor.blinkFlag;
					editor.drawKolorCursor(true);
				break;
				case 39: // Right
					editor.fgColorCursor = (editor.fgColorCursor + 1) & 15;
					if (editor.fgColorCursor == 0)
						editor.blinkFlag = !editor.blinkFlag;
					editor.drawKolorCursor(true);
				break;
				case 38: // Up
					editor.bgColorCursor = (editor.bgColorCursor - 1) & 7;
					editor.drawKolorCursor(true);
				break;
				case 40: // Down
					editor.bgColorCursor = (editor.bgColorCursor + 1) & 7;
					editor.drawKolorCursor(true);
				break;
				default:
					zzt.dispatchInputMessage(guiKeyMappingArray[theCode]);
				break;
			}
		break;
		case zzt.MODE_CHARSEL:
			editor.drawCharCursor(false);
			switch (theCode) {
				case 37: // Left
					editor.hexCodeValue = (editor.hexCodeValue - 1) & 255;
					editor.drawCharCursor(true);
				break;
				case 39: // Right
					editor.hexCodeValue = (editor.hexCodeValue + 1) & 255;
					editor.drawCharCursor(true);
				break;
				case 38: // Up
					editor.hexCodeValue = (editor.hexCodeValue - 32) & 255;
					editor.drawCharCursor(true);
				break;
				case 40: // Down
					editor.hexCodeValue = (editor.hexCodeValue + 32) & 255;
					editor.drawCharCursor(true);
				break;
				default:
					zzt.dispatchInputMessage(guiKeyMappingArray[theCode]);
				break;
			}
		break;

		case zzt.MODE_ENTERGUIPROP:
			if (theCode == 27)
				zzt.dispatchInputMessage("EVENT_ACCEPTPROP");
		break;
		case zzt.MODE_ENTEROPTIONSPROP:
			if (theCode == 27)
				zzt.dispatchInputMessage("EVENT_ACCEPTPROP");
		break;
		case zzt.MODE_ENTERCONSOLEPROP:
			if (theCode == 27)
				zzt.dispatchInputMessage("EVENT_ACCEPTPROP");
		break;
		case zzt.MODE_ENTEREDITORPROP:
			if (theCode == 27)
				zzt.dispatchInputMessage("ED_ACCEPTEDITORPROP");
		break;
	}
};

static mousePressed(event, stageX, stageY) {
	// Mouse tracking info
	input.mouseXGridPos = utils.int(stageX / zzt.cellXDiv);
	input.mouseYGridPos = utils.int(stageY / zzt.virtualCellYDiv);
	input.mDown = true;
	input.mDownCount = zzt.mcount;

	// Register click location relative to GUI.
	var guiX = input.mouseXGridPos - zzt.GuiLocX + 2;
	var guiY = input.mouseYGridPos - zzt.GuiLocY + 2;
	var rightSide = (stageX % zzt.cellXDiv >= zzt.cellXDiv / 2) ? 1 : 0;
	var downSide = (stageY % zzt.virtualCellYDiv >= zzt.virtualCellYDiv / 2) ? 1 : 0;

	if (zzt.mainMode == zzt.MODE_SCROLLINTERACT)
	{
		zzt.scrollInterfaceButton();
	}
	else if (zzt.mainMode == zzt.MODE_SELECTPEN)
	{
		zzt.drawPen(zzt.confLabelStr, zzt.penStartVal, zzt.penEndVal, zzt.penActVal,
		zzt.penChrCode, -1);
		zzt.mainMode = zzt.MODE_NORM;
		zzt.globals["$PENRESULT"] = zzt.penActVal;
		zzt.dispatchInputMessage(zzt.confYesMsg);
	}
	else if (zzt.mainMode == zzt.MODE_CONFMESSAGE)
	{
		if (guiY == zzt.confButtonY && guiX >= zzt.confButtonX && guiX < zzt.confButtonX + 10)
		{
			zzt.confButtonSel = (guiX - zzt.confButtonX < 5) ? 0 : 1;

			// Choose selected confirmation button
			zzt.unDrawConfButtons();
			zzt.eraseGuiLabel(zzt.confLabelStr);
			zzt.mainMode = zzt.MODE_NORM;
			zzt.dispatchInputMessage((zzt.confButtonSel == 0) ? zzt.confYesMsg : zzt.confNoMsg);
		}
	}
	else if (zzt.mainMode == zzt.MODE_NORM)
	{
		// GUI event handling.
		for (var s in zzt.GuiMouseEvents) {
			var o = zzt.GuiMouseEvents[s];

			if (guiX >= o[0] && guiY >= o[1] && guiX < o[0] + o[2] && guiY < o[1] + o[3])
			{
				zzt.dispatchInputMessage(s);
				return;
			}
		}

		if (zzt.inEditor)
		{
			// If within the editor, special GUIs will cause mouse-down events.
			var shiftStatus = event.shiftKey;
			switch (zzt.thisGuiName) {
				case "ED_TYPEALL":
					guiY -= 3;
					if (guiX < 42 && guiY >= 0 && guiY < 21)
						editor.dispatchEditorMenu("ED_TYPEALLSEL");
				break;
				case "ED_ULTRA1":
				case "ED_ULTRA2":
				case "ED_ULTRA3":
				case "ED_ULTRA4":
				case "ED_CLASSIC":
				case "ED_SUPERZZT":
				case "ED_KEVEDIT":
					guiX += zzt.GuiLocX - 1;
					guiY += zzt.GuiLocY - 1;
					if (guiX >= SE.vpX0 && guiY >= SE.vpY0 && guiX <= SE.vpX1 && guiY <= SE.vpY1)
					{
						// If cursor within viewport, place type at hotspot.
						if (shiftStatus)
						{
							editor.dispatchEditorMenu("ED_SELLEFT");
							editor.dispatchEditorMenu("ED_SELRIGHT");
						}
						else
						{
							editor.dispatchEditorMenu("ED_PLACE");
							editor.drawFlag = editor.DRAW_ON;
						}
					}
					else if (guiX >= 61 && guiY >= 21)
					{
						// If cursor in color/pattern selection area, select position.
						guiX -= zzt.GuiLocX - 1;
						guiY -= zzt.GuiLocY - 1;
						editor.colorPatternMousePick(guiX, guiY, rightSide, downSide);
					}
				break;
				case "ED_CHAREDIT":
					guiX += zzt.GuiLocX - 1;
					guiY += zzt.GuiLocY - 1;
					if (guiX >= 4 && guiY >= 3 && guiX < 4 + 16 && guiY < 3 + 16)
					{
						editor.ceCharX = (guiX - 4) >> 1;
						editor.ceCharY = guiY - 3;
						editor.dispatchEditorMenu("CE_STARTMOUSEDRAW");
					}
					else if (guiX >= 16 && guiY >= 22 && guiX < 16 + 3 && guiY < 22 + 3)
						editor.setCharEditPreview(guiX - 16, guiY - 22);
					else if (guiX >= 25 && guiY >= 17 && guiX < 25 + 32 && guiY < 17 + 8)
						editor.selectCharFromSet((guiY - 17) * 32 + guiX - 25);
				break;
			}
		}
		else if (editor.typingTextInGuiEditor)
		{
			editor.guiTextEditCursor = (input.mouseYGridPos * editor.editWidth) + input.mouseXGridPos;
			if (editor.guiTextEditCursor >= editor.editWidth * editor.editHeight)
				editor.guiTextEditCursor = 0;

			editor.writeGuiTextEdit();
		}
		else if (zzt.globalProps["MOUSEBEHAVIOR"] != 0)
		{
			// If click location within viewport, trigger click-to-move
			// if mouse behavior would allow that kind of movement.
			guiX += zzt.GuiLocX - 1;
			guiY += zzt.GuiLocY - 1;
			if (guiX >= SE.vpX0 && guiY >= SE.vpY0 &&
				guiX <= SE.vpX1 && guiY <= SE.vpY1)
			{
				guiX -= SE.vpX0 - SE.CameraX;
				guiY -= SE.vpY0 - SE.CameraY;
				input.clickToMoveSquare(guiX, guiY, rightSide, downSide);
			}
		}
		else
		{
			// Dispatch to custom mouse routine.
			interp.briefDispatch(interp.onMousePos, interp.blankSE, interp.blankSE);
		}
	}
	else if (zzt.mainMode == zzt.MODE_COLORSEL)
		editor.dispatchEditorMenu("ED_COLORSEL");
	else if (zzt.mainMode == zzt.MODE_CHARSEL)
		editor.dispatchEditorMenu("ED_CHARSEL");
};

static mouseReleased(event, stageX, stageY) {
	// Mouse tracking info
	input.mouseXGridPos = utils.int(stageX / zzt.cellXDiv);
	input.mouseYGridPos = utils.int(stageY / zzt.virtualCellYDiv);
	input.mDown = false;

	if (zzt.inEditor)
	{
		var guiX = input.mouseXGridPos - zzt.GuiLocX + 2;
		var guiY = input.mouseYGridPos - zzt.GuiLocY + 2;

		// If within the editor, special GUIs will cause mouse-down events.
		switch (zzt.thisGuiName) {
			case "ED_ULTRA1":
			case "ED_ULTRA2":
			case "ED_ULTRA3":
			case "ED_ULTRA4":
			case "ED_CLASSIC":
			case "ED_SUPERZZT":
			case "ED_KEVEDIT":
				// If cursor within viewport, turn drawing off.
				guiX += zzt.GuiLocX - 1;
				guiY += zzt.GuiLocY - 1;
				if (guiX >= SE.vpX0 && guiY >= SE.vpY0 && guiX <= SE.vpX1 && guiY <= SE.vpY1)
					editor.drawFlag = editor.DRAW_OFF;
			break;
		}
	}
	else if (zzt.globalProps["MOUSEBEHAVIOR"] == 0)
	{
		// Dispatch to custom mouse routine.
		interp.briefDispatch(interp.onMousePos, interp.blankSE, interp.blankSE);
	}
};

static mouseDrag(event, stageX, stageY) {
	// Mouse tracking info
	input.mouseXGridPos = utils.int(stageX / zzt.cellXDiv);
	input.mouseYGridPos = utils.int(stageY / zzt.virtualCellYDiv);

	// Highlight GUI as needed.
	var guiX = input.mouseXGridPos - zzt.GuiLocX + 2;
	var guiY = input.mouseYGridPos - zzt.GuiLocY + 2;
	var rightSide = (stageX % zzt.cellXDiv >= zzt.cellXDiv / 2) ? 1 : 0;
	var downSide = (stageY % zzt.virtualCellYDiv >= zzt.virtualCellYDiv / 2) ? 1 : 0;
	var shiftStatus = event.shiftKey;

	if (zzt.mainMode == zzt.MODE_CONFMESSAGE)
	{
		if (guiY == zzt.confButtonY && guiX >= zzt.confButtonX && guiX < zzt.confButtonX + 10)
		{
			zzt.confButtonSel = (guiX - zzt.confButtonX < 5) ? 0 : 1;
			zzt.drawConfButtons();
		}
	}
	else if (zzt.mainMode == zzt.MODE_SCROLLINTERACT)
	{
		guiX = utils.int((stageX - zzt.scrollGrid.x) / zzt.cellXDiv);
		guiY = utils.int((stageY - zzt.scrollGrid.y * zzt.virtualCellYDiv / CellGrid.charHeight)
			/ zzt.virtualCellYDiv);
		var backupLen = utils.int(zzt.msgScrollHeight/2);
		var oldScroll = zzt.mouseScrollOffset;
		zzt.mouseScrollOffset = 0;

		if (guiX >= 0 && guiY >= 0 &&
			guiX < zzt.msgScrollWidth && guiY < zzt.msgScrollHeight)
		{
			// Within boundaries of scroll.  Evaluate cursor offset.
			zzt.mouseScrollOffset = guiY - backupLen;

			var curIndex = zzt.msgScrollIndex + zzt.mouseScrollOffset;
			if (curIndex <= -1)
				zzt.mouseScrollOffset = 0;
			else if (curIndex >= zzt.msgScrollText.length)
				zzt.mouseScrollOffset = 0;
		}

		// Update arrows only if different.
		if (oldScroll != zzt.mouseScrollOffset)
			zzt.drawScrollMsgText();
	}
	else if (zzt.mainMode == zzt.MODE_NORM)
	{
		var newS = "";
		for (var s in zzt.GuiMouseEvents) {
			var o = zzt.GuiMouseEvents[s];
			if (guiX >= o[0] && guiY >= o[1] && guiX < o[0] + o[2] && guiY < o[1] + o[3])
			{
				newS = s;
				break;
			}
		}

		if (newS != zzt.curHighlightButton)
		{
			if (zzt.curHighlightButton != "")
			{
				o = zzt.GuiMouseEvents[zzt.curHighlightButton];
				zzt.mg.writeXorAttr(zzt.GuiLocX + o[0] - 2, zzt.GuiLocY + o[1] - 2, o[2], o[3], 127);
			}

			zzt.curHighlightButton = newS;
			if (zzt.curHighlightButton != "")
			{
				o = zzt.GuiMouseEvents[zzt.curHighlightButton];
				zzt.mg.writeXorAttr(zzt.GuiLocX + o[0] - 2, zzt.GuiLocY + o[1] - 2, o[2], o[3], 127);
			}
		}

		if (zzt.inEditor)
		{
			// If within the editor, special GUIs will cause mouse-over events
			// to move the cursor.
			switch (zzt.thisGuiName) {
				case "ED_TYPEALL":
					guiY -= 3;
					if (guiX < 42 && guiY >= 0 && guiY < 21)
					{
						editor.highlightTypeAllCursor();
						editor.typeAllCursor = editor.typeAllPage + guiY;
						if (guiX >= 21)
							editor.typeAllCursor += editor.TYPEALL_ROWLIMIT;
						if (editor.typeAllCursor >= editor.typeAllTypes.length)
							editor.typeAllCursor = editor.typeAllTypes.length - 1;

						editor.updateTypeAllView(false);
					}
				break;
				case "ED_ULTRA1":
				case "ED_ULTRA2":
				case "ED_ULTRA3":
				case "ED_ULTRA4":
				case "ED_CLASSIC":
				case "ED_SUPERZZT":
				case "ED_KEVEDIT":
					// If cursor within viewport, move cursor to hotspot.
					guiX += zzt.GuiLocX - 1;
					guiY += zzt.GuiLocY - 1;
					if (guiX >= SE.vpX0 && guiY >= SE.vpY0 && guiX <= SE.vpX1 && guiY <= SE.vpY1)
					{
						guiX -= SE.vpX0 - SE.CameraX;
						guiY -= SE.vpY0 - SE.CameraY;
						editor.warpEditorCursor(guiX, guiY, shiftStatus);
					}
				break;
				case "ED_CHAREDIT":
					guiX += zzt.GuiLocX - 1;
					guiY += zzt.GuiLocY - 1;
					if (guiX >= 4 && guiY >= 3 && guiX < 4 + 16 && guiY < 3 + 16 && input.mDown)
					{
						editor.ceCharX = (guiX - 4) >> 1;
						editor.ceCharY = guiY - 3;
						editor.dispatchEditorMenu("CE_CONTINUEMOUSEDRAW");
					}
				break;
			}
		}
		else if (zzt.globalProps["MOUSEBEHAVIOR"] != 0 &&
			zzt.globalProps["MOUSEEDGEPOINTER"] != 0 &&
			zzt.globalProps["MOUSEEDGENAV"] != 0)
		{
			// If cursor within viewport, trigger edge-nav arrows if
			// mouse behavior would allow that kind of movement.
			guiX += zzt.GuiLocX - 1;
			guiY += zzt.GuiLocY - 1;
			if (guiX >= SE.vpX0 && guiY >= SE.vpY0 && guiX <= SE.vpX1 && guiY <= SE.vpY1)
			{
				guiX -= SE.vpX0 - SE.CameraX;
				guiY -= SE.vpY0 - SE.CameraY;

				// Restore tile under last edge-nav arrow.
				if (zzt.lastEdgeNavArrowX != -1)
					SE.displaySquare(zzt.lastEdgeNavArrowX, zzt.lastEdgeNavArrowY);
				zzt.lastEdgeNavArrowX = -1;
				zzt.lastEdgeNavArrowY = -1;
				var meNav = zzt.globalProps["MOUSEEDGENAV"];

				// Draw new edge-nav arrow if mouse cursor flush with board edge.
				if (guiX == 1 && (rightSide == 0 || meNav == 2) &&
					zzt.boardProps["EXITWEST"] != 0)
					zzt.showEdgeNavArrow(guiX, guiY, 2);
				else if (guiY == 1 && (downSide == 0 || meNav == 2) &&
					zzt.boardProps["EXITNORTH"] != 0)
					zzt.showEdgeNavArrow(guiX, guiY, 3);
				else if (guiX == zzt.boardProps["SIZEX"] && (rightSide == 1 || meNav == 2) &&
					zzt.boardProps["EXITEAST"] != 0)
					zzt.showEdgeNavArrow(guiX, guiY, 0);
				else if (guiY == zzt.boardProps["SIZEY"] && (downSide == 1 || meNav == 2) &&
					zzt.boardProps["EXITSOUTH"] != 0)
					zzt.showEdgeNavArrow(guiX, guiY, 1);
			}
		}
	}
	else if (zzt.mainMode == zzt.MODE_COLORSEL)
	{
		guiX -= 2;
		guiY -= 2;
		if (guiX >= 0 && guiY >= 0 && guiX < 32 && guiY < 8)
		{
			editor.drawKolorCursor(false);
			editor.fgColorCursor = guiX & 15;
			editor.bgColorCursor = guiY;
			editor.blinkFlag = Boolean(guiX >= 16);
			editor.drawKolorCursor(true);
		}
	}
	else if (zzt.mainMode == zzt.MODE_CHARSEL)
	{
		guiX -= 2;
		guiY -= 2;
		if (guiX >= 0 && guiY >= 0 && guiX < 32 && guiY < 8)
		{
			editor.drawCharCursor(false);
			editor.hexCodeValue = guiY * 32 + guiX;
			editor.drawCharCursor(true);
		}
	}
};

static mouseWheel(delta) {
	var lineDelta = utils.isgn(delta);
	if (zzt.mainMode == zzt.MODE_SCROLLINTERACT)
	{
		if (utils.isgn(input.progWheelCount) == lineDelta)
			input.progWheelCount += lineDelta;
		else
			input.progWheelCount = lineDelta;

		// Boost scroll rate for faster wheel rotation.
		if (zzt.mcount - input.lastWheelMCount < input.MOUSE_WHEEL_TIME_THRESHOLD &&
			utils.iabs(input.progWheelCount) >= input.MOUSE_WHEEL_COUNT_THRESHOLD)

		lineDelta *= input.MOUSE_WHEEL_MULTIPLIER;

		input.lastWheelMCount = zzt.mcount;
		zzt.msgScrollIndex += lineDelta;

		if (zzt.msgScrollIndex < 0)
			zzt.msgScrollIndex = 0;
		if (zzt.msgScrollIndex >= zzt.msgScrollText.length)
			zzt.msgScrollIndex = zzt.msgScrollText.length - 1;

		zzt.drawScrollMsgText();
	}
	else if (zzt.mainMode == zzt.MODE_FILEBROWSER)
	{
		zzt.moveFileBrowser(zzt.textBrowserCursor + lineDelta * 5);
	}
	else if (zzt.mainMode == zzt.MODE_SELECTPEN)
	{
		if (lineDelta < 0) // Left
		{
			if (zzt.penStartVal < zzt.penEndVal)
			{
				if (--zzt.penActVal < zzt.penStartVal)
					zzt.penActVal = zzt.penStartVal;
			}
			else
			{
				if (++zzt.penActVal > zzt.penStartVal)
				zzt.penActVal = zzt.penStartVal;
			}

			zzt.drawPen(zzt.confLabelStr, zzt.penStartVal, zzt.penEndVal, zzt.penActVal,
			zzt.penChrCode, zzt.penAttr);
		}
		else if (lineDelta > 0) // Right
		{
			if (zzt.penStartVal < zzt.penEndVal)
			{
				if (++zzt.penActVal > zzt.penEndVal)
					zzt.penActVal = zzt.penEndVal;
			}
			else
			{
				if (--zzt.penActVal < zzt.penEndVal)
					zzt.penActVal = zzt.penEndVal;
			}

			zzt.drawPen(zzt.confLabelStr, zzt.penStartVal, zzt.penEndVal, zzt.penActVal,
				zzt.penChrCode, zzt.penAttr);
		}
	}
};

static mouseFireHandler(minDelay) {
	if (zzt.mcount - input.mDownCount >= minDelay)
	{
		switch (input.c2MDir) {
			case 0:
				input.keyDownHandler(39, 0, true, false); // Right
			break;
			case 1:
				input.keyDownHandler(40, 0, true, false); // Down
			break;
			case 2:
				input.keyDownHandler(37, 0, true, false); // Left
			break;
			case 3:
				input.keyDownHandler(38, 0, true, false); // Up
			break;
		}
	}
};

static clickToMoveSquare(x, y, rightSide, downSide) {
	// Reset timer and pick next direction.
	input.c2MDestX = x;
	input.c2MDestY = y;
	input.c2MMode = input.C2M_MODE_TOWARDS;

	// If edge-nav is possible, bump destination further by one.
	var meNav = zzt.globalProps["MOUSEEDGENAV"];
	if (meNav != 0)
	{
		if (x == 1 && (rightSide == 0 || meNav == 2) &&
			zzt.boardProps["EXITWEST"] != 0)
			input.c2MDestX--;
		else if (y == 1 && (downSide == 0 || meNav == 2) &&
			zzt.boardProps["EXITNORTH"] != 0)
			input.c2MDestY--;
		else if (x == zzt.boardProps["SIZEX"] && (rightSide == 1 || meNav == 2) &&
			zzt.boardProps["EXITEAST"] != 0)
			input.c2MDestX++;
		else if (y == zzt.boardProps["SIZEY"] && (downSide == 1 || meNav == 2) &&
			zzt.boardProps["EXITSOUTH"] != 0)
			input.c2MDestY++;
	}

	if (input.pickC2MSquare())
	{
		if (input.keyCodeDowns[16] != 0) // Shift
		{
			// Firing handler
			input.mouseFireHandler(0);
			input.c2MDestX = -1;
			input.c2MDestY = -1;
			return;
		}
		else if (zzt.globals["$PLAYERMODE"] == 1 && zzt.globals["$PLAYERPAUSED"] == 1)
		{
			// Initial movement handler (when game paused)
			input.moveC2MSquare();
		}
	}
};

static pickC2MSquare() {
	// If player not present, can't evaluate.
	if (!interp.playerSE)
	{
		input.c2MDestX = -1;
		input.c2MDestY = -1;
		return false;
	}

	// Check if player is at current square.  If so, veto movement.
	var px = interp.playerSE.X;
	var py = interp.playerSE.Y;
	if (input.c2MDestX == px && input.c2MDestY == py)
	{
		input.c2MDestX = -1;
		input.c2MDestY = -1;
		return false;
	}

	// Set initial direction.
	var xDiff = input.c2MDestX - px;
	var yDiff = input.c2MDestY - py;
	input.c2MDir = interp.getDir4FromSteps(utils.isgn(xDiff), utils.isgn(yDiff));
	if (px != input.c2MDestX && py != input.c2MDestY)
	{
		// There is no straight vector to destination.  From ratios of
		// distances, pick ideal choice (vertical or horizontal).

		// Y difference counts for twice as much as X difference in 80-column mode.
		//yDiff *= aspectMultiplier;

		// For MOUSEBEHAVIOR of 1, the vector chosen will pick the minor nav first.
		// For MOUSEBEHAVIOR of 2, the vector chosen will pick the major nav first.
		var xDom = Boolean(utils.iabs(xDiff) >= utils.iabs(yDiff));
		if (zzt.globalProps["MOUSEBEHAVIOR"] == 1)
			xDom = !xDom;

		// Try preferred nav direction.  Preference is ignored if the preferred
		// nav direction is blocked.
		if (xDom)
		{
			input.c2MDir = interp.getDir4FromSteps(utils.isgn(xDiff), 0);
			if (!input.canMoveTowards(px, py, input.c2MDir))
				input.c2MDir = interp.getDir4FromSteps(0, utils.isgn(yDiff));
		}
		else
		{
			input.c2MDir = interp.getDir4FromSteps(0, utils.isgn(yDiff));
			if (!input.canMoveTowards(px, py, input.c2MDir))
				input.c2MDir = interp.getDir4FromSteps(utils.isgn(xDiff), 0);
		}
	}

	// Direction chosen.
	return true;
};

static chooseNextC2MDir() {
	// Decide strategy for selecting next movement location.
	var x = interp.playerSE.X;
	var y = interp.playerSE.Y;

	if (input.c2MMode == input.C2M_MODE_EXTEND)
	{
		if ((input.lastPlayerX == x && input.lastPlayerY == y) ||
			(x == input.c2MExtendDestX && y == input.c2MExtendDestY))
		{
			// If we arrive at destination, or we didn't move, reorient towards the player.
			input.c2MMode = input.C2M_MODE_TOWARDS;
			input.pickC2MSquare();
		}
		else
		{
			// Go towards extended location.
			input.c2MCount = zzt.mcount;
			input.c2MDir = input.c2MExtendDir;
		}
	}
	else if (input.c2MMode == input.C2M_MODE_TOWARDS)
	{
		// Change in player position indicates that move towards destination is working.
		if (input.lastPlayerX != x || input.lastPlayerY != y)
		{
			if (zzt.globalProps["MOUSEBEHAVIOR"] == 3)
			{
				// This behavior will constantly re-evaluate the distance to
				// the destination and pick an "as the crow flies" vector.
				// This is very similar to the TOWARDS direction.
				if (utils.iabs(input.c2MDestX - x) >= utils.iabs(input.c2MDestY - y))
					input.c2MDir = interp.getDir4FromSteps(utils.isgn(input.c2MDestX - x), 0);
				else
					input.c2MDir = interp.getDir4FromSteps(0, utils.isgn(input.c2MDestY - y));
			}

			// If not using MOUSEBEHAVIOR==3, pick the same movement direction
			// as before if that direction would get us closer to the target.
			input.c2MCount = zzt.mcount;
			var nextX = x + interp.getStepXFromDir4(input.c2MDir);
			var nextY = y + interp.getStepYFromDir4(input.c2MDir);

			if (utils.iabs(nextX - input.c2MDestX) + utils.iabs(nextY - input.c2MDestY) >=
				utils.iabs(x - input.c2MDestX) + utils.iabs(y - input.c2MDestY))
			{
				// Same movement direction wouldn't get us closer.
				// Reorient towards the player.
				input.pickC2MSquare();
			}
		}
		else
		{
			// We didn't or couldn't move towards destination.
			// Plan paths around obstacles to see if circling would
			// get us closer.
			input.getIdealCircularPath();
		}
	}
	else if (zzt.mcount - input.c2MCount >= input.C2M_GIVEUP_THRESHOLD)
	{
		// Too many iterations have passed without getting
		// close to destination.  Give up.
		input.c2MDestX = -1;
		input.c2MDestY = -1;
	}
	else if (input.c2MMode == input.C2M_MODE_CW)
	{
		// Clockwise circling attempts to get closer by turning in a
		// positive direction when blocked.
		input.c2MDir = (input.c2MDir - 1) & 3;
		if (!input.canMoveTowards(x, y, input.c2MDir))
		{
			input.c2MDir = (input.c2MDir + 1) & 3;
			if (!input.canMoveTowards(x, y, input.c2MDir))
			{
				input.c2MDir = (input.c2MDir + 1) & 3;
				if (!input.canMoveTowards(x, y, input.c2MDir))
				{
					input.c2MDir = (input.c2MDir + 1) & 3;
					if (!input.canMoveTowards(x, y, input.c2MDir))
					{
						input.c2MDir = (input.c2MDir + 1) & 3;
						if (!input.canMoveTowards(x, y, input.c2MDir))
						{
							// Trapped!  Give up.
							input.c2MDestX = -1;
							input.c2MDestY = -1;
						}
					}
				}
			}
		}

		// Switch mode if we had arrived at "closest" destination.
		if (x == input.c2MCircleDestX && y == input.c2MCircleDestY)
		{
			input.c2MCount = zzt.mcount;
			input.c2MMode = input.C2M_MODE_EXTEND;
		}
	}
	else
	{
		// Counter-clockwise circling attempts to get closer by
		// turning in a negative direction when blocked.
		input.c2MDir = (input.c2MDir + 1) & 3;
		if (!input.canMoveTowards(x, y, input.c2MDir))
		{
			input.c2MDir = (input.c2MDir - 1) & 3;
			if (!input.canMoveTowards(x, y, input.c2MDir))
			{
				input.c2MDir = (input.c2MDir - 1) & 3;
				if (!input.canMoveTowards(x, y, input.c2MDir))
				{
					input.c2MDir = (input.c2MDir - 1) & 3;
					if (!input.canMoveTowards(x, y, input.c2MDir))
					{
						input.c2MDir = (input.c2MDir - 1) & 3;
						if (!input.canMoveTowards(x, y, input.c2MDir))
						{
							// Trapped!  Give up.
							input.c2MDestX = -1;
							input.c2MDestY = -1;
						}
					}
				}
			}
		}

		// Switch mode if we had arrived at "closest" destination.
		if (x == input.c2MCircleDestX && y == input.c2MCircleDestY)
		{
			input.c2MCount = zzt.mcount;
			input.c2MMode = input.C2M_MODE_EXTEND;
		}
	}
};

static canMoveTowards(x, y, toDir) {
	// Test if destination square is nonblocking.
	x += interp.getStepXFromDir4(toDir);
	y += interp.getStepYFromDir4(toDir);
	return Boolean(!zzt.typeList[SE.getType(x, y)].BlockPlayer ||
		(x == interp.playerSE.X && y == interp.playerSE.Y));
};

static testExtendedMoveTowards(x, y, toDir) {
	var moveCount = 0;
	var distLowest = utils.iabs(x - input.c2MDestX) + utils.iabs(y - input.c2MDestY);
	input.c2MExtendDestX = x;
	input.c2MExtendDestY = y;
	input.c2MMoveCountLowest = 0;

	while (moveCount < 200) {
		if (!input.canMoveTowards(x, y, toDir))
			break; // Done moving.

		// Advance to next square.
		x += interp.getStepXFromDir4(toDir);
		y += interp.getStepYFromDir4(toDir);
		moveCount++;

		// Calculate distance from target.
		var distCurrent = utils.iabs(x - input.c2MDestX) + utils.iabs(y - input.c2MDestY);
		if (distCurrent < distLowest)
		{
			// This beats previous distance.  Choose this distance and count.
			input.c2MExtendDestX = x;
			input.c2MExtendDestY = y;
			input.c2MMoveCountLowest = moveCount;
			distLowest = distCurrent;
		}
	}

	// Report how far away from target we would get.
	return distLowest;
};

static testExtendedMoveAll(x, y) {
	var distCurrent = input.testExtendedMoveTowards(x, y, 0);
	var distLowest = distCurrent;
	var moveCountLowest = input.c2MMoveCountLowest;
	input.c2MExtendDir = 0;

	distCurrent = input.testExtendedMoveTowards(x, y, 1);
	if (distLowest > distCurrent)
	{
		distLowest = distCurrent;
		moveCountLowest = input.c2MMoveCountLowest;
		input.c2MExtendDir = 1;
	}

	distCurrent = input.testExtendedMoveTowards(x, y, 2);
	if (distLowest > distCurrent)
	{
		distLowest = distCurrent;
		moveCountLowest = input.c2MMoveCountLowest;
		input.c2MExtendDir = 2;
	}

	distCurrent = input.testExtendedMoveTowards(x, y, 3);
	if (distLowest > distCurrent)
	{
		distLowest = distCurrent;
		moveCountLowest = input.c2MMoveCountLowest;
		input.c2MExtendDir = 3;
	}

	// Return objective lowest distance count, and remember lowest move count.
	input.c2MMoveCountLowest = moveCountLowest;
	return distLowest;
};

static getIdealCircularPath() {
	var x = interp.playerSE.X;
	var y = interp.playerSE.Y;
	var baseDir = input.c2MDir;
	input.c2MBeatDist = utils.iabs(x - input.c2MDestX) + utils.iabs(y - input.c2MDestY);

	// First, clockwise.
	input.c2MDir = (baseDir + 1) & 3;
	var cwMinDist = 100000000;
	var cwIdealX = -1;
	var cwIdealY = -1;
	var cwMoves = 0;
	var cwMinMoves = 100000000;
	while (cwMoves++ < 60) {
		input.c2MDir = (input.c2MDir - 1) & 3;
		if (!input.canMoveTowards(x, y, input.c2MDir))
		{
			input.c2MDir = (input.c2MDir + 1) & 3;
			if (!input.canMoveTowards(x, y, input.c2MDir))
			{
				input.c2MDir = (input.c2MDir + 1) & 3;
				if (!input.canMoveTowards(x, y, input.c2MDir))
				{
					input.c2MDir = (input.c2MDir + 1) & 3;
					if (!input.canMoveTowards(x, y, input.c2MDir))
					{
						input.c2MDir = (input.c2MDir + 1) & 3;
						if (!input.canMoveTowards(x, y, input.c2MDir))
						{
							// Trapped!
							break;
						}
					}
				}
			}
		}

		// Advance to next square.
		x += interp.getStepXFromDir4(input.c2MDir);
		y += interp.getStepYFromDir4(input.c2MDir);

		// Record distance.
		var thisDist = input.testExtendedMoveAll(x, y);
		if (cwMinDist > thisDist)
		{
			// This square would improve proximity.
			cwMinMoves = cwMoves + input.c2MMoveCountLowest;
			cwMinDist = thisDist;
			cwIdealX = x;
			cwIdealY = y;
		}
		else if (cwMinDist == thisDist)
		{
			// This square would not improve proximity, but we might prefer to
			// pick it anyway as an extension point if it would result in fewer
			// moves than our last favorite.
			if (cwMinMoves > cwMoves + input.c2MMoveCountLowest)
			{
				cwMinMoves = cwMoves + input.c2MMoveCountLowest;
				cwMinDist = thisDist;
				cwIdealX = x;
				cwIdealY = y;
			}
		}
	}

	// Next, counter-clockwise.
	x = interp.playerSE.X;
	y = interp.playerSE.Y;
	input.c2MDir = (baseDir - 1) & 3;
	var ccwMinDist = 100000000;
	var ccwIdealX = -1;
	var ccwIdealY = -1;
	var ccwMoves = 0;
	var ccwMinMoves = 100000000;
	while (ccwMoves++ < 60) {
		input.c2MDir = (input.c2MDir + 1) & 3;
		if (!input.canMoveTowards(x, y, input.c2MDir))
		{
			input.c2MDir = (input.c2MDir - 1) & 3;
			if (!input.canMoveTowards(x, y, input.c2MDir))
			{
				input.c2MDir = (input.c2MDir - 1) & 3;
				if (!input.canMoveTowards(x, y, input.c2MDir))
				{
					input.c2MDir = (input.c2MDir - 1) & 3;
					if (!input.canMoveTowards(x, y, input.c2MDir))
					{
						input.c2MDir = (input.c2MDir - 1) & 3;
						if (!input.canMoveTowards(x, y, input.c2MDir))
						{
							// Trapped!
							break;
						}
					}
				}
			}
		}

		// Advance to next square.
		x += interp.getStepXFromDir4(input.c2MDir);
		y += interp.getStepYFromDir4(input.c2MDir);

		// Record distance.
		//thisDist = utils.iabs(x - c2MDestX) + utils.iabs(y - c2MDestY);
		thisDist = input.testExtendedMoveAll(x, y);
		if (ccwMinDist > thisDist)
		{
			// This square would improve proximity.
			ccwMinMoves = ccwMoves + input.c2MMoveCountLowest;
			ccwMinDist = thisDist;
			ccwIdealX = x;
			ccwIdealY = y;
		}
		else if (ccwMinDist == thisDist)
		{
			// This square would not improve proximity, but we might prefer to
			// pick it anyway as an extension point if it would result in fewer
			// moves than our last favorite.
			if (ccwMinMoves > ccwMoves + input.c2MMoveCountLowest)
			{
				ccwMinMoves = ccwMoves + input.c2MMoveCountLowest;
				ccwMinDist = thisDist;
				ccwIdealX = x;
				ccwIdealY = y;
			}
		}
	}

	// Pick circling mode based on proximity performance.
	if (cwMinDist == ccwMinDist && cwMinDist < input.c2MBeatDist && ccwMinDist < input.c2MBeatDist)
	{
		// Both clockwise and counter-clockwise would reach equally well.
		// Judge using different criteria:  least number of moves.
		if (cwMinMoves <= ccwMinMoves)
		{
			// Clockwise performance is better.
			input.c2MMode = input.C2M_MODE_CW;
			input.c2MDir = (baseDir + 1) & 3;
			input.c2MCircleDestX = cwIdealX;
			input.c2MCircleDestY = cwIdealY;
			input.testExtendedMoveAll(input.c2MCircleDestX, input.c2MCircleDestY);
			input.testExtendedMoveTowards(input.c2MCircleDestX, input.c2MCircleDestY, input.c2MExtendDir);
		}
		else
		{
			// Counter-clockwise performance is better.
			input.c2MMode = input.C2M_MODE_CCW;
			input.c2MDir = (baseDir - 1) & 3;
			input.c2MCircleDestX = ccwIdealX;
			input.c2MCircleDestY = ccwIdealY;
			input.testExtendedMoveAll(input.c2MCircleDestX, input.c2MCircleDestY);
			input.testExtendedMoveTowards(input.c2MCircleDestX, input.c2MCircleDestY, input.c2MExtendDir);
		}
	}
	else if (cwMinDist < ccwMinDist && cwMinDist < input.c2MBeatDist)
	{
		// Clockwise performance is better.
		input.c2MMode = input.C2M_MODE_CW;
		input.c2MDir = (baseDir + 1) & 3;
		input.c2MCircleDestX = cwIdealX;
		input.c2MCircleDestY = cwIdealY;
		input.testExtendedMoveAll(input.c2MCircleDestX, input.c2MCircleDestY);
		input.testExtendedMoveTowards(input.c2MCircleDestX, input.c2MCircleDestY, input.c2MExtendDir);
	}
	else if (ccwMinDist < cwMinDist && ccwMinDist < input.c2MBeatDist)
	{
		// Counter-clockwise performance is better.
		input.c2MMode = input.C2M_MODE_CCW;
		input.c2MDir = (baseDir - 1) & 3;
		input.c2MCircleDestX = ccwIdealX;
		input.c2MCircleDestY = ccwIdealY;
		input.testExtendedMoveAll(input.c2MCircleDestX, input.c2MCircleDestY);
		input.testExtendedMoveTowards(input.c2MCircleDestX, input.c2MCircleDestY, input.c2MExtendDir);
	}
	else
	{
		// If neither circling modes would get us closer, give up.
		input.c2MDestX = -1;
		input.c2MDestY = -1;
	}
};

static moveC2MSquare() {
	// If within touching distance of destination, this is the last time
	// we will try to move towards destination.
	if (utils.iabs(interp.playerSE.X - input.c2MDestX) +
		utils.iabs(interp.playerSE.Y - input.c2MDestY) <= 1)
	{
		input.c2MDestX = -1;
		input.c2MDestY = -1;
	}

	// Feed player input from direction
	switch (input.c2MDir) {
		case 0:
			input.keyDownHandler(39, 0, false, false); // Right
		break;
		case 1:
			input.keyDownHandler(40, 0, false, false); // Down
		break;
		case 2:
			input.keyDownHandler(37, 0, false, false); // Left
		break;
		case 3:
			input.keyDownHandler(38, 0, false, false); // Up
		break;
	}
};

}

input.initClass();
