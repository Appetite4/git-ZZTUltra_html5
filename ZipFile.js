// ZipFile.js:  An object representing an unpacked ZIP file archive.
"use strict";

// This class is currently crippled in HTML 5 because there is no
// direct support for the INFLATE format.  Archives can be viewed,
// but not unpacked.
class ZipFile {

constructor(srcBytes) {
	this.b = srcBytes;
	this.b.endian = Endian.LITTLE_ENDIAN;
	this.b.position = 0;

	this.numFiles = 0;
	this.fileNames = [];
	this.fileOffsets = [];
	this.fileSizes = [];
	this.fileContents = [];
	this.fileComps = [];
	this.hasError = false;

	var offset = 0;
	while (this.b.position < this.b.length) {
		if (this.b.readInt() != 0x04034b50)
		  break; // Not PK34 identifier

		// Get critical position and length info
		this.b.position = offset + 8;
		this.compression = this.b.readShort();
		this.b.position = offset + 26;
		this.fileNameLength = this.b.readShort();
		this.extraFieldLength = this.b.readShort();
		var fileOffset = offset + 30 + this.fileNameLength + this.extraFieldLength;

		// Store relevant info for file
		this.b.position = offset + 30;
		this.fileNames.push(this.b.readUTFBytes(this.fileNameLength));
		this.b.position = offset + 18;
		this.compSize = this.b.readInt();
		this.unCompSize = this.b.readInt();
		this.fileSizes.push(this.compSize);
		this.fileOffsets.push(fileOffset);
		this.fileComps.push(this.compression);

		// Go beyond file to start of next file
		offset = fileOffset + this.compSize;
		this.b.position = offset;
		this.numFiles++;
	}

	// Unpack and store all files
	for (var i = 0; i < this.numFiles; i++) {
		var newB = new Uint8Array();
		this.b.position = this.fileOffsets[i];

		if (this.fileComps[i] == 0)
		{
		  // STORED
		  this.b.readBytes(newB, 0, this.fileSizes[i]);
		}
		else if (this.fileComps[i] == 8)
		{
		  // DEFLATE
		  this.b.readBytes(newB, 0, this.fileSizes[i]);
		  //newB.inflate(); // CAN'T INFLATE IN JS NATIVELY!!
		  this.hasError = true;
		}
		else
		{
		  // Unsupported compression algorithm; leave empty
		  this.hasError = true;
		}

		this.fileContents.push(newB);
	}
};

getFileByName(fName) {
	var s = fName.toUpperCase();

	for (var i = 0; i < this.numFiles; i++) {
	if (this.fileNames[i].toUpperCase() == s)
	  return this.fileContents[i]; // Match
	}

	// No match
	return null;
};

getFileNamesMatchingExt(fExt) {
	var sLen = fExt.length;
	var nArray = [];

	for (var i = 0; i < this.numFiles; i++) {
		if (this.fileNames[i].length >= sLen)
		{
			if (utils.endswith(this.fileNames[i], fExt))
				nArray.push(this.fileNames[i]);
		}
	}

	// Return matches
	return nArray;
}

}
