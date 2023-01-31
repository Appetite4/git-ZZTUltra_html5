// ByteArray.js:  Partial port of AS3 ByteArray class.
"use strict";

// Memory is managed internally as a contiguous ArrayBuffer.
// When a write operation would force a size expansion, the
// ArrayBuffer is replaced by a larger one.

// The ByteArray.m_sizePicks list identifies the internal sizes used,
// as well as the triggers for expansion.

// Truncation will only reduce the size of the ArrayBuffer if the
// size would be reduced on a fundamental level (original capacity / 4).

class ByteArray {

// Constructor
constructor(size=0) {
	this.m_endian = ByteArray.LITTLE_ENDIAN;
	this.clear();
	if (size > 0)
		this.m_addConstBytes(size);
}

clear() {
	// Reset buffer size.
	this.m_position = 0;
	this.m_length = 0;
	this.m_capacity = ByteArray.m_sizePicks[0];
	this.m_buffer = new ArrayBuffer(this.m_capacity);
	this.m_uint8 = new Uint8Array(this.m_buffer);
	this.m_dataView = new DataView(this.m_buffer, 0);
}

static fromArrayBuffer(ab) {
	// Create a ByteArray from an existing ArrayBuffer.
	var newB = new ByteArray();
	newB.m_capacity = ab.byteLength;
	newB.m_length = ab.byteLength;
	newB.m_buffer = ab;
	newB.m_uint8 = new Uint8Array(newB.m_buffer);
	newB.m_dataView = new DataView(newB.m_buffer, 0);

	return newB;
}

// Accessors

get bytesAvailable() {
	return (this.m_length - this.m_position);
}

get endian() {
	return this.m_endian;
}
set endian(prop) {
	this.m_endian = prop;
}

get length() {
	return this.m_length;
}
set length(prop) {
	if (prop < this.m_length)
		this.m_truncateTo(prop);
	else
		this.m_addConstBytes(prop - this.m_length);
}

get position() {
	return this.m_position;
}
set position(prop) {
	if (prop < 0)
		prop = 0;
	else if (prop > this.m_length)
		prop = this.m_length;

	this.m_position = prop;
}

// "Bracket" notation
// Unfortunately can't overload [] in class at this time
// myByteArray.b[n] will have to do
get b() {
	return this.m_uint8;
}

// Internal functions

m_getNewSize(sizeHint) {
	// Find a better buffer size to deal with suggested size.
	for (var i = 0; i < ByteArray.m_sizePicks.length; i++) {
		var useSize = ByteArray.m_sizePicks[i];
		if (useSize >= sizeHint)
			return useSize;
	}

	// Any buffer larger than 1 MB will double in capacity each iteration.
	useSize = this.m_capacity;
	while (useSize < sizeHint)
		useSize *= 2;

	return useSize;
}

m_ensureBuffer(sizeHint) {
	// If current size is too small, reallocate buffer.
	var useSize = this.m_getNewSize(sizeHint);
	var newBuffer = new ArrayBuffer(useSize);

	// Transfer old buffer to new buffer.
	var xfer1 = this.m_uint8;
	var xfer2 = new Uint8Array(newBuffer);
	xfer2.set(xfer1);

	// Create data viewer for new buffer.
	this.m_buffer = newBuffer;
	this.m_uint8 = xfer2;
	this.m_dataView = new DataView(this.m_buffer, 0);
	this.m_capacity = useSize;
}

m_truncateTo(targetSize) {
	// We only want to reallocate the buffer if the capacity would be reduced significantly.
	// Otherwise, just reducing the stated size is all that is needed.
	var justifiedSize = Math.trunc(this.m_capacity / 4);
	if (targetSize > justifiedSize)
	{
		this.m_length = targetSize;
		return;
	}

	// Transfer old buffer to new buffer.
	var newBuffer = new ArrayBuffer(targetSize);
	var xfer1 = this.m_uint8;
	var xfer2 = new Uint8Array(newBuffer);
	xfer2.set(xfer1.slice(0, targetSize));

	// Establish subset array buffer.
	this.m_buffer = newBuffer;
	this.m_uint8 = xfer2;
	this.m_dataView = new DataView(this.m_buffer, 0);
	this.m_length = targetSize;
	this.m_capacity = targetSize;

	if (this.m_position >= this.m_length)
		this.m_position = this.m_length;
}

m_addConstBytes(addSize) {
	// Add to stated buffer size.
	var newSize = this.m_length + addSize;
	if (newSize > this.m_capacity)
	{
		// Resize buffer.
		this.m_ensureBuffer(newSize);
	}

	this.m_length = newSize;
}

// Slice function

slice(start=0, end=0) {
	var newB = new ByteArray();
	newB.writeBytes(this, start, end - start);
	newB.m_position = 0;

	return newB;
}

// Read functions

readBoolean() {
	var val = Boolean(this.m_dataView.getUint8(this.m_position));
	this.m_position += 1;
	return val;
}
readUnsignedByte() {
	var val = this.m_dataView.getUint8(this.m_position);
	this.m_position += 1;
	return val;
}
readByte() {
	var val = this.m_dataView.getInt8(this.m_position);
	this.m_position += 1;
	return val;
}

readUnsignedShort() {
	var val = this.m_dataView.getUint16(this.m_position, this.m_endian);
	this.m_position += 2;
	return val;
}
readShort() {
	var val = this.m_dataView.getInt16(this.m_position, this.m_endian);
	this.m_position += 2;
	return val;
}

readUnsignedInt() {
	var val = this.m_dataView.getUint32(this.m_position, this.m_endian);
	this.m_position += 4;
	return val;
}
readInt() {
	var val = this.m_dataView.getInt32(this.m_position, this.m_endian);
	this.m_position += 4;
	return val;
}

readFloat() {
	var val = this.m_dataView.getFloat32(this.m_position, this.m_endian);
	this.m_position += 4;
	return val;
}

readDouble() {
	var val = this.m_dataView.getFloat64(this.m_position, this.m_endian);
	this.m_position += 8;
	return val;
}

readBytes(destByteArray, offset=0, length=0) {
	// Calculate transfer length.
	if (length <= 0)
		length = this.m_length - this.m_position;
	else if (this.m_position + length > this.m_length)
		length = this.m_length - this.m_position;

	// Expand target if needed.
	if (offset + length > destByteArray.length)
		destByteArray.m_addConstBytes(offset + length - destByteArray.length);

	// Transfer.
	var xfer1 = new Uint8Array(destByteArray.m_buffer, offset, length);
	var xfer2 = new Uint8Array(this.m_buffer, this.m_position, length);
	xfer1.set(xfer2);

	this.m_position += length;
}

// Processes UTF-8 multibyte codes.
readUTFBytes(length) {
	// Calculate transfer length.
	if (this.m_position + length > this.m_length)
		length = this.m_length - this.m_position;

	var xfer = this.m_uint8.slice(this.m_position, this.m_position + length);
	return (ByteArray.tDecoder.decode(xfer.buffer));
}

// Does not process UTF-8 multibyte codes; treats it as CP-437.
readASCIIBytes(length) {
	// Calculate transfer length.
	if (this.m_position + length > this.m_length)
		length = this.m_length - this.m_position;

	// Get string.
	var s = "";
	var xfer = new Uint8Array(this.m_buffer);
	while (length-- > 0) {
		s += String.fromCharCode(xfer[this.m_position++]);
	}

	return s;
}

// Standard to-string conversion
toString() {
	var xfer = new Uint8Array(this.m_buffer);
	return xfer.slice(0, this.m_length).toString();
}

// Write functions

writeBoolean(val) {
	var newPos = this.m_position + 1;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setUint8(this.m_position, Number(val));
	this.m_position = newPos;
}
writeUnsignedByte(val) {
	var newPos = this.m_position + 1;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setUint8(this.m_position, val);
	this.m_position = newPos;
}
writeByte(val) {
	var newPos = this.m_position + 1;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setInt8(this.m_position, val);
	this.m_position = newPos;
}

writeUnsignedShort(val) {
	var newPos = this.m_position + 2;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setUint16(this.m_position, val, this.m_endian);
	this.m_position = newPos;
}
writeShort(val) {
	var newPos = this.m_position + 2;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setInt16(this.m_position, val, this.m_endian);
	this.m_position = newPos;
}

writeUnsignedInt(val) {
	var newPos = this.m_position + 4;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setUint32(this.m_position, val, this.m_endian);
	this.m_position = newPos;
}
writeInt(val) {
	var newPos = this.m_position + 4;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setInt32(this.m_position, val, this.m_endian);
	this.m_position = newPos;
}

writeFloat(val) {
	var newPos = this.m_position + 4;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setFloat32(this.m_position, val, this.m_endian);
	this.m_position = newPos;
}

writeDouble(val) {
	var newPos = this.m_position + 8;
	if (newPos > this.m_length)
		this.m_addConstBytes(newPos - this.m_length);

	this.m_dataView.setFloat64(this.m_position, val, this.m_endian);
	this.m_position = newPos;
}

writeBytes(srcByteArray, offset=0, length=0) {
	// Calculate transfer length.
	if (length <= 0)
		length = srcByteArray.m_length - offset;
	else if (offset + length > srcByteArray.m_length)
		length = srcByteArray.m_length - offset;

	// Expand target if needed.
	if (this.m_position + length > this.m_length)
		this.m_addConstBytes(this.m_position + length - this.m_length);

	// Transfer.
	var xfer1 = new Uint8Array(srcByteArray.m_buffer, offset, length);
	var xfer2 = new Uint8Array(this.m_buffer, this.m_position, length);
	xfer2.set(xfer1);

	this.m_position += length;
}

// Processes UTF-8 multibyte codes.
writeUTFBytes(val) {
	var xfer1 = ByteArray.tEncoder.encode(val);

	// Expand target if needed.
	if (this.m_position + xfer1.length > this.m_length)
		this.m_addConstBytes(this.m_position + xfer1.length - this.m_length);

	// Transfer
	var xfer2 = new Uint8Array(this.m_buffer, this.m_position, xfer1.length);
	xfer2.set(xfer1);

	this.m_position += xfer1.length;
}

// Does not process UTF-8 multibyte code; treats it as CP-437.
writeASCIIBytes(val) {
	// Expand target if needed.
	if (this.m_position + val.length > this.m_length)
		this.m_addConstBytes(this.m_position + val.length - this.m_length);

	// Write string.
	var xfer = new Uint8Array(this.m_buffer);
	for (var i = 0; i < val.length; i++) {
		xfer[this.m_position++] = val.charCodeAt(i);
	}
}

}

// If different internal buffer intervals are desired, change them below.
ByteArray.m_sizePicks = [ 256, 2048, 16834, 65536, 1048576 ];

// Endian-order constants are similar to those in AS3 Endian class, but tailored to DataView.
ByteArray.BIG_ENDIAN = false;
ByteArray.LITTLE_ENDIAN = true;

// Encoding/Decoding objects for UTF-8 conversion
ByteArray.tDecoder = new TextDecoder("utf-8");
ByteArray.tEncoder = new TextEncoder("utf-8");
