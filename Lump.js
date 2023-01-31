// Lump.js:  A WAD lump directory entry.
"use strict";

class Lump {

static initClass() {
	Lump.lastSearchIdx = -1;
}

// Constructor
constructor(lOff, lLen, lName) {
	this.offset = lOff;
	this.len = lLen;
	this.name = lName;
}

// Fetch string representation of lump (no special characters)
getLumpStr(file) {
	file.position = this.offset;
	return (file.readUTFBytes(this.len));
}

// Fetch string representation of lump (special characters)
getLumpExtendedASCIIStr(file) {
	var position = this.offset;
	var tempB = file.slice(position, position + this.len);

	var s = "";
	for (var i = 0; i < this.len; i++)
		s += String.fromCharCode(tempB.b[i] & 255);

	return s;
}

// Fetch binary representation of lump
getLumpBytes(file) {
	var position = this.offset;
	return file.slice(position, position + this.len);
}

// Search for specific lump
static search(srcList, searchName, startIdx=-1) {
	// If start index is -1, search beyond the last found lump.
	if (startIdx == -1)
		startIdx = Lump.lastSearchIdx + 1;

	for (var i = startIdx; i < srcList.length; i++)
	{
		if (srcList[i].name == searchName)
		{
			// Found.
			Lump.lastSearchIdx = i;
			return (srcList[i]);
		}
	}

	// Not found; reset last found lump.
	Lump.lastSearchIdx = -1;
	return null;
}

// Reset search
static resetSearch() {
	Lump.lastSearchIdx = -1;
}

static getExtendedASCIIStr(file, sOffset, sLen) {
	var tempB = file.slice(sOffset, sOffset + sLen);

	var s = "";
	for (var i = 0; i < sLen; i++)
		s += String.fromCharCode(tempB[i] & 255);

	return s;
}

// Search for embedded files; return list of names
static getEmbeddedFileNames(srcList, file) {
	var fNameArray = [];
	for (var i = 0; i < srcList.length; i++)
	{
		if (srcList[i].name == "FILE    ")
		{
			// File.  Get filename, which is an ASCIIZ string.
			var fileLen = 256;
			if (srcList[i].len < fileLen)
				fileLen = srcList[i].len;

			var s = Lump.getExtendedASCIIStr(file, srcList[i].offset, fileLen);

			// Establish filename as first part of lump data.
			var nullTerm = s.indexOf("\x00");
			if (nullTerm != -1)
				s = s.substr(0, nullTerm);

			fNameArray.push(s);
		}
	}

	// Return list of filenames.
	return fNameArray;
}

// Retrieve embedded file contents
static getEmbeddedFile(srcList, file, fileName) {

	for (var i = 0; i < srcList.length; i++)
	{
		if (srcList[i].name == "FILE    ")
		{
			// File.  Get filename, which is an ASCIIZ string.
			var fileLen = 256;
			if (srcList[i].len < fileLen)
				fileLen = srcList[i].len;

			var s = Lump.getExtendedASCIIStr(file, srcList[i].offset, fileLen);

			// Establish filename as first part of lump data.
			var nullTerm = s.indexOf("\x00");
			if (nullTerm != -1)
				s = s.substr(0, nullTerm);
			else
				nullTerm = 255;

			if (s.toUpperCase() == fileName.toUpperCase())
			{
				// Found.  Extract portion of binary contents after filename.
				var position = srcList[i].offset + nullTerm + 1;
				return file.slice(position, position + srcList[i].len - (nullTerm + 1));
			}
		}
	}

	// Should not get here in theory; should only try to retrieve
	// a file that had been found using getEmbeddedFileNames.
	return null;
};

}

Lump.initClass();
