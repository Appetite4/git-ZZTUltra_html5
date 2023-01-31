"use strict";
class utils {

static initClass() {
utils.curXSize = 0;
utils.curYSize = 0;
utils.curAllSize = 0;
utils.curDissolveArr = null;
utils.strictIntPattern = new RegExp("^[-+]?[0-9]+$");
};

static trace(s) {
	console.log(s);
};

static int(val) {
  return (parseInt(val))
}
static strictInt(val) {
  if (utils.strictIntPattern.test(val))
    return (parseInt(val));
  return NaN;
}
static isInt(val) {
  return (typeof val == "number");
}
static isBoolean(val) {
  return (typeof val == "boolean");
}
static isString(val) {
  return (typeof val == "string");
}

static frange(lower, upper) {
  return ((Math.random() * (upper - lower)) + lower);
};
static randrange(lower, upper) {
  return (utils.int(Math.random() * (upper - lower + 1)) + lower);
};
static zerothru(qty) {
  return (utils.int(Math.random() * (qty + 1)));
};
static onethru(qty) {
  return (utils.int(Math.random() * qty) + 1);
};
static eitheror() {
  return (Boolean(Math.random() <= 0.5));
};
static oneoutof(denom) {
  return (Boolean(Math.random() < 1.0 / denom));
};
static noutofn(num, denom) {
  return (Boolean(Math.random() < num / denom));
};
static dir4norm() {
  // All directions equally likely
  return (utils.int(Math.random() * 4));
};
static dir4skewed() {
  // Horizontal directions twice as likely as vertical
  var i = utils.int(Math.random() * 6);
  if (i == 4)
	i = 0;
  else if (i == 5)
	i = 2;
  return i;
};
static orderInts(a, b) {
  if (a < b)
	return [a, b];
  else
	return [b, a];
};

static getDissolveArray(xSize, ySize) {
  if (xSize != utils.curXSize || ySize != utils.curYSize)
	utils.curDissolveArr = utils.createRandomPosArray(xSize, ySize);

  return utils.curDissolveArr;
};
static createRandomPosArray(xSize, ySize) {
  // Save dimensions; create new dissolve array
  utils.curXSize = xSize;
  utils.curYSize = ySize;
  utils.curAllSize = xSize * ySize;
  utils.curDissolveArr = [];

  // Create temporary position array
  var i;
  var posArr = [];
  for (i = 0; i < utils.curAllSize; i++)
	posArr[i] = i;

  // Repeatedly take random list entries from position array until all taken
  for (i = utils.curAllSize - 1; i >= 0; i--)
  {
	var val = utils.zerothru(i);
	utils.curDissolveArr[i] = posArr[val];
	posArr[val] = posArr[i];
  }

  return utils.curDissolveArr;
};
static int0(str) {
  var i;
  try {
	i = utils.int(str);
  }
  catch (e) {
	i = 0;
  }
  return i;
};
static float0(str) {
  var f;
  try {
	f = Number(str);
  }
  catch (e) {
	f = 0.0;
  }
  return f;
};
static intMaybe(str, defInt) {
  var i;
  try {
	i = utils.int(str);
  }
  catch (e) {
	i = defInt;
  }
  return i;
};
static floatMaybe(str, defFloat) {
  var f;
  try {
	f = Number(str);
  }
  catch (e) {
	f = defFloat;
  }
  return f;
};
static avg(n1, n2) {
  return ((n1 + n2) / 2);
};
static isgn(n) {
  if (n < 0) return -1;
  if (n > 0) return 1;
  return 0;
};
static sgn(n) {
  if (n < 0) return -1;
  if (n > 0) return 1;
  return 0;
};
static iabs(n) {
  if (n < 0) return -n;
  return n;
};
static inrange(n, lowest, highest) {
  if (n < lowest || n > highest) return false;
  return true;
};
static clipval(n, lowest, highest) {
  if (n < lowest) n = lowest;
  if (n > highest) n = highest;
  return n;
};
static clipintval(n, lowest, highest) {
  if (n < lowest) n = lowest;
  if (n > highest) n = highest;
  return n;
};
static hexcode(n) {
  var i = n & 15;
  var s;
  if (i <= 9)
	s = String.fromCharCode(48 + i);
  else
	s = String.fromCharCode(65 - 0xA + i);

  i = (n >> 4) & 15;
  if (i <= 9)
	return (String.fromCharCode(48 + i) + s);
  else
	return (String.fromCharCode(65 - 0xA + i) + s);
};
static twogrouping(digits) {
  //A 2-digit grouping will always have 2 characters.
  var str = "";
  if (digits < 10)
	str += "0";

  str += String(digits);
  return str;
};
static threegrouping(digits) {
  //A 3-digit grouping will always have 3 characters.
  var str = "";
  if (digits < 10)
	str += "00";
  else if (digits < 100)
	str += "0";

  str += String(digits);
  return str;
};
static getcommaval(n) {
  var str = "";
  var ival = utils.int(n);

  //Early out if too small for grouping.
  if (ival < 1000)
	return (String(ival));

  //Millions grouping.
  if (ival >= 1000000)
  {
	str += utils.int(ival / 1000000) + ",";
	ival %= 1000000;

	//Thousands grouping.
	str += utils.threegrouping(ival / 1000) + ",";
	ival %= 1000;
  }
  else
  {
	//Thousands grouping.
	str += utils.int(ival / 1000) + ",";
	ival %= 1000;
  }

  //Ones grouping.
  str += utils.threegrouping(ival);

  return str;
};
static getsecondsbreakdown(n) {
  var str = "";

  //Minutes
  str += utils.int(n / 60.0) + ":";
  var secs = utils.int(n % 60.0);

  //Seconds
  if (secs < 10) str += "0";
  str += secs;
  //str += secs + ".";

  //Hundredths of seconds
  var hundredths = int(((n % 60.0) - secs) * 100);
  if (hundredths < 10) str += "0";
  str += hundredths;

  return str;
};
static lstrip(s) {
  var l = s.length;
  var i = 0;
  while (i < l)
  {
	if (s.charCodeAt(i) != 32)
	  break;
	i++;
  }

  return (s.substring(i));
};
static rstrip(s) {
  var i = s.length;
  while (--i >= 0)
  {
	if (s.charCodeAt(i) != 32)
	  break;
  }

  return (s.substring(0, i + 1));
};
static allStrip(s) {
  // Right
  var i = s.length;
  while (--i >= 0)
  {
	if (s.charCodeAt(i) > 32)
	  break;
  }

  s = s.substring(0, i + 1);

  // Left
  var l = s.length;
  i = 0;
  while (i < l)
  {
	if (s.charCodeAt(i) > 32)
	  break;
	i++;
  }

  return (s.substring(i));
};
static scrubPath(s) {
  // Scrub path for unsecure syntax (no .. or web root)
  while (s.indexOf("..") != -1)
	s = s.replace("..", "");

  while (s.charAt(0) == "/" || s.charAt(0) == "\\")
	s = s.substr(1);

  return s;
};
static namePartOfFile(s) {
  // Get name part of file only (no directory portions)
  var idx;
  do {
	idx = s.indexOf("/");
	if (idx != -1)
	  s = s.substr(idx + 1);
  } while (idx != -1);

  do {
	idx = s.indexOf("\\");
	if (idx != -1)
	  s = s.substr(idx + 1);
  } while (idx != -1);

  return s;
};
static cr2lf(s) {
  // Convert CR to LF
  return (s.split("\r").join("\n"));
};
static lf2cr(s) {
  // Convert LF to CR
  return (s.split("\n").join("\r"));
};

static replaceAll(src, find, repl) {
	// Replace all function.
	return (src.split(find).join(repl));
}

static endswith(fName, fExt) {
  // Get case-insensitive "ends with"
  if (fExt.length > fName.length)
	return false;

  return Boolean(
	fName.substr(fName.length - fExt.length).toUpperCase() == fExt.toUpperCase());
};

static startswith(fName, fStart) {
  // Get case-insensitive "starts with"
  if (fStart.length > fName.length)
	return false;

  return Boolean(
	fName.substr(0, fStart.length).toUpperCase() == fStart.toUpperCase());
};

static strReps(s, reps) {
  var totalString = "";
  while (reps-- > 0)
	totalString += s;

  return totalString;
};
static getSortedKeys(o) {
  // Get sort order of main keys.
  var mainKeys = [];
  for (var kObj in o)
	mainKeys.push(kObj.toString());

  mainKeys.sort();
  return mainKeys;
};
static ciTest(o, key) {
  // Case-insensitive test for key.
  key = key.toUpperCase();
  for (var k in o) {
	if (k.toUpperCase() == key)
	  return true;
  }

  return false;
};
static ciLookup(o, key) {
  // Lookup of value from case-insensitive key.
  key = key.toUpperCase();
  for (var k in o) {
	if (k.toUpperCase() == key)
	  return o[k];
  }

  return null;
};

}

utils.initClass();
