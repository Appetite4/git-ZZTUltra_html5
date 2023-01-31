// oop.js:  The program's OOP compiling functions.
"use strict";

class oop {

static initClass() {

// Command constants (non-#)
oop.CMD_ERROR = 0;
oop.CMD_NAME = 255;
oop.CMD_LABEL = 254;
oop.CMD_COMMENT = 253;
oop.CMD_TEXT = 252;
oop.CMD_TEXTCENTER = 251;
oop.CMD_TEXTLINK = 250;
oop.CMD_TEXTLINKFILE = 249;
oop.CMD_TRYSIMPLE = 248;
oop.CMD_SENDTONAME = 247;
oop.CMD_FORITER = 246;
oop.CMD_NOP = 245;
oop.CMD_ZAPTARGET = 244;
oop.CMD_RESTORETARGET = 243;
oop.CMD_FALSEJUMP = 242;

// Original ZZT-OOP command constants (#)
oop.CMD_GO = 1;
oop.CMD_TRY = 2;
oop.CMD_WALK = 3;
oop.CMD_DIE = 4;
oop.CMD_ENDGAME = 5;
oop.CMD_SEND = 6;
oop.CMD_RESTART = 7;
oop.CMD_END = 8;
oop.CMD_BIND = 9;
oop.CMD_BECOME = 10;
oop.CMD_CHANGE = 11;
oop.CMD_PUT = 12;
oop.CMD_CHAR = 13;
oop.CMD_CYCLE = 14;
oop.CMD_CLEAR = 15;
oop.CMD_SET = 16;
oop.CMD_GIVE = 17;
oop.CMD_TAKE = 18;
oop.CMD_IF = 19;
oop.CMD_LOCK = 20;
oop.CMD_UNLOCK = 21;
oop.CMD_ZAP = 22;
oop.CMD_RESTORE = 23;
oop.CMD_SHOOT = 24;
oop.CMD_THROWSTAR = 25;
oop.CMD_PLAY = 26;
oop.CMD_IDLE = 27;

// "New" ZZT-OOP command constants as follows

// Flow control and messaging command constants
oop.CMD_PAUSE = 30;
oop.CMD_UNPAUSE = 31;
oop.CMD_EXTRATURNS = 32;
oop.CMD_DONEDISPATCH = 33;
oop.CMD_DISPATCH = 34;
oop.CMD_SENDTO = 35;
oop.CMD_DISPATCHTO = 36;
oop.CMD_SWITCHTYPE = 37;
oop.CMD_SWITCHVALUE = 38;
oop.CMD_EXECCOMMAND = 39;

// Region manipulation command constants
oop.CMD_SETREGION = 40;
oop.CMD_CLEARREGION = 41;

// Character/Color update command constants
oop.CMD_CHAR4DIR = 50;
oop.CMD_COLOR = 51;
oop.CMD_COLORALL = 52;
oop.CMD_DRAWCHAR = 53;
oop.CMD_ERASECHAR = 54;
oop.CMD_GHOST = 55;
oop.CMD_KILLPOS = 56;

// Movement/Pushing command constants
oop.CMD_SETPOS = 60;
oop.CMD_FORCEGO = 61;
oop.CMD_PUSHATPOS = 62;

oop.CMD_GROUPSETPOS = 63;
oop.CMD_GROUPGO = 64;
oop.CMD_GROUPTRY = 65;
oop.CMD_GROUPTRYNOPUSH = 66;

// Dynamic text and link command constants
oop.CMD_DYNTEXT = 70;
oop.CMD_DYNLINK = 71;
oop.CMD_DYNTEXTVAR = 72;
oop.CMD_DUMPSE = 73;
oop.CMD_DUMPSEAT = 74;
oop.CMD_TEXTTOGUI = 75;
oop.CMD_TEXTTOGRID = 76;
oop.CMD_SCROLLSTR = 77;
oop.CMD_SCROLLCOLOR = 78;

// Set/Get special command constants
oop.CMD_SETPLAYER = 80;
oop.CMD_SETPROPERTY = 81;
oop.CMD_GETPROPERTY = 82;
oop.CMD_PLAYERINPUT = 83;
oop.CMD_TYPEAT = 84;
oop.CMD_COLORAT = 85;
oop.CMD_OBJAT = 86;
oop.CMD_LITAT = 87;
oop.CMD_RANDOM = 88;
oop.CMD_DIR2UVECT8 = 89;
oop.CMD_OFFSETBYDIR = 90;
oop.CMD_SUBSTR = 91;
oop.CMD_INT = 92;
oop.CMD_ATAN2 = 93;
oop.CMD_SMOOTHTEST = 94;
oop.CMD_SMOOTHMOVE = 95;
oop.CMD_READKEY = 96;
oop.CMD_READMOUSE = 97;
oop.CMD_SETTYPEINFO = 98;
oop.CMD_GETTYPEINFO = 99;

// Placement command constants
oop.CMD_SPAWN = 100;
oop.CMD_SPAWNGHOST = 101;
oop.CMD_CHANGEREGION = 102;
oop.CMD_CLONE = 103;

// Loop iteration command constants
oop.CMD_FOREACH = 110;
oop.CMD_FORMASK = 111;
oop.CMD_FORNEXT = 112;
oop.CMD_FORREGION = 113;

// Viewport update command constants
oop.CMD_UPDATEVIEWPORT = 120;
oop.CMD_ERASEVIEWPORT = 121;
oop.CMD_DISSOLVEVIEWPORT = 122;
oop.CMD_SCROLLTOVISUALS = 123;
oop.CMD_CAMERAFOCUS = 124;
oop.CMD_LIGHTEN = 125;
oop.CMD_DARKEN = 126;
oop.CMD_UPDATELIT = 127;
oop.CMD_SUSPENDDISPLAY = 128;

// GUI update command constants
oop.CMD_USEGUI = 130;
oop.CMD_SETGUILABEL = 131;
oop.CMD_SELECTPEN = 132;
oop.CMD_DRAWPEN = 133;
oop.CMD_DRAWBAR = 134;
oop.CMD_CONFMESSAGE = 135;
oop.CMD_TEXTENTRY = 136;
oop.CMD_DRAWGUICHAR = 137;
oop.CMD_ERASEGUICHAR = 138;
oop.CMD_MODGUILABEL = 139;

// Game world/board management command constants
oop.CMD_SAVEBOARD = 140;
oop.CMD_CHANGEBOARD = 141;
oop.CMD_SAVEWORLD = 142;
oop.CMD_LOADWORLD = 143;
oop.CMD_RESTOREGAME = 144;

// Sound command constants
oop.CMD_PLAYSOUND = 150;
oop.CMD_GETSOUND = 151;
oop.CMD_STOPSOUND = 152;
oop.CMD_MASTERVOLUME = 153;

// Array command constants
oop.CMD_PUSHARRAY = 160;
oop.CMD_POPARRAY = 161;
oop.CMD_SETARRAY = 162;
oop.CMD_LEN = 163;

// Config vars command constants
oop.CMD_SETCONFIGVAR = 170;
oop.CMD_GETCONFIGVAR = 171;
oop.CMD_DELCONFIGVAR = 172;
oop.CMD_DELCONFIGHIVE = 173;
oop.CMD_SYSTEMACTION = 174;

// Palette and character editing command constants
oop.CMD_SCANLINES = 180;
oop.CMD_BIT7ATTR = 181;
oop.CMD_PALETTECOLOR = 182;
oop.CMD_PALETTEBLOCK = 183;
oop.CMD_FADETOCOLOR = 184;
oop.CMD_FADETOBLOCK = 185;
oop.CMD_CHARSELECT = 186;

// High score and other server-side storage command constants
oop.CMD_POSTHS = 190;
oop.CMD_GETHS = 191;
oop.CMD_GETHSENTRY = 192;

// Flag evaluation constants
oop.FLAG_ANY = 1;
oop.FLAG_ALLIGNED = 2;
oop.FLAG_CONTACT = 3;
oop.FLAG_BLOCKED = 4;
oop.FLAG_ENERGIZED = 5;

// "New" flag evaluation constants
oop.FLAG_ALIGNED = 6;
oop.FLAG_ANYTO = 7;
oop.FLAG_ANYIN = 8;
oop.FLAG_SELFIN = 9;
oop.FLAG_TYPEIS = 10;
oop.FLAG_BLOCKEDAT = 11;
oop.FLAG_CANPUSH = 12;
oop.FLAG_SAFEPUSH = 13;
oop.FLAG_SAFEPUSH1 = 14;
oop.FLAG_HASMESSAGE = 15;
oop.FLAG_TEST = 16;
oop.FLAG_VALID = 17;

// Generic "flag" evaluation constant
oop.FLAG_GENERIC = 100;
oop.FLAG_ALWAYSTRUE = 101;

// Base direction constants
oop.DIR_E = 1;
oop.DIR_S = 3;
oop.DIR_W = 5;
oop.DIR_N = 7;
oop.DIR_I = 9;

// direction constants
oop.DIR_SEEK = 11;
oop.DIR_FLOW = 12;
oop.DIR_RNDNS = 13;
oop.DIR_RNDNE = 14;
oop.DIR_RND = 15;

// Prefixes
oop.DIR_CW = 16;
oop.DIR_CCW = 17;
oop.DIR_RNDP = 18;
oop.DIR_OPP = 19;
oop.DIR_RNDSQ = 20;

oop.DIR_TOWARDS = 21;
oop.DIR_MAJOR = 22;
oop.DIR_MINOR = 23;
oop.DIR_UNDER = 24;
oop.DIR_OVER = 25;

// Inventory constants
oop.INV_NONE = 0;
oop.INV_AMMO = 1;
oop.INV_TORCHES = 2;
oop.INV_GEMS = 3;
oop.INV_HEALTH = 4;
oop.INV_SCORE = 5;
oop.INV_TIME = 6;
oop.INV_Z = 7;
oop.INV_KEY = 8;
oop.INV_EXTRA = 9;

// Color constants
oop.COLOR_BLACK = 0;
oop.COLOR_DARKBLUE = 1;
oop.COLOR_DARKGREEN = 2;
oop.COLOR_DARKCYAN = 3;
oop.COLOR_DARKRED = 4;
oop.COLOR_DARKPURPLE = 5;
oop.COLOR_DARKYELLOW = 6;
oop.COLOR_BROWN = 6;
oop.COLOR_GREY = 7;
oop.COLOR_DARKGREY = 8;
oop.COLOR_BLUE = 9;
oop.COLOR_GREEN = 10;
oop.COLOR_CYAN = 11;
oop.COLOR_RED = 12;
oop.COLOR_PURPLE = 13;
oop.COLOR_YELLOW = 14;
oop.COLOR_WHITE = 15;

// Misc. keyword constants
oop.MISC_NOT = 1;
oop.MISC_SELF = 2;
oop.MISC_ALL = 3;
oop.MISC_OTHERS = 4;
oop.MISC_THEN = 5;
oop.MISC_CLONE = 6;
oop.MISC_SILENT = 7;
oop.MISC_UNDER = 8;
oop.MISC_OVER = 9;

// "Keyword arg" constants
oop.KWARG_TYPE = 1;
oop.KWARG_X = 2;
oop.KWARG_Y = 3;
oop.KWARG_STEPX = 4;
oop.KWARG_STEPY = 5;
oop.KWARG_CYCLE = 6;
oop.KWARG_P1 = 7;
oop.KWARG_P2 = 8;
oop.KWARG_P3 = 9;
oop.KWARG_FOLLOWER = 10;
oop.KWARG_LEADER = 11;
oop.KWARG_UNDERID = 12;
oop.KWARG_UNDERCOLOR = 13;

oop.KWARG_CHAR = 14;
oop.KWARG_COLOR = 15;
oop.KWARG_COLORALL = 16;
oop.KWARG_DIR = 17;
oop.KWARG_ONAME = 18;
oop.KWARG_BIND = 19;

oop.KWARG_INTELLIGENCE = 20;
oop.KWARG_SENSITIVITY = 21;
oop.KWARG_PHASE = 22;
oop.KWARG_PERIOD = 23;
oop.KWARG_RESTINGTIME = 24;
oop.KWARG_DEVIANCE = 25;
oop.KWARG_RATE = 26;
oop.KWARG_DESTINATION = 27;

// Expression operator constants
oop.OP_ADD = 1;
oop.OP_SUB = 2;
oop.OP_MUL = 3;
oop.OP_DIV = 4;
oop.OP_EQU = 5;
oop.OP_NEQ = 6;
oop.OP_GRE = 7;
oop.OP_LES = 8;
oop.OP_AND = 9;
oop.OP_OR = 10;
oop.OP_XOR = 11;
oop.OP_DOT = 12;
oop.OP_ARR = 13;
oop.OP_GOE = 14;
oop.OP_LOE = 15;

// Special internal constants
oop.SPEC_SILENT = 0;
oop.SPEC_NOTSILENT = 1;
oop.SPEC_BOOLEAN = -2;
oop.SPEC_NOT = -3;
oop.SPEC_NORM = -4;
oop.SPEC_ALL = -5;
oop.SPEC_NOCOLOR = -6;
oop.SPEC_POLAR = -7;
oop.SPEC_ADD = -8;
oop.SPEC_SUB = -9;
oop.SPEC_ABS = -10;
oop.SPEC_KINDNORM = -2;
oop.SPEC_KINDEXPR = -3;
oop.SPEC_KINDMISC = -4;
oop.SPEC_KWARGEND = -5;
oop.SPEC_EXPRPRESENT = -1;
oop.SPEC_EXPREND = -11;
oop.SPEC_NUMCONST = 1;
oop.SPEC_STRCONST = 2;
oop.SPEC_LOCALVAR = 3;
oop.SPEC_PROPERTY = 4;
oop.SPEC_GLOBALVAR = 5;
oop.SPEC_DIRCONST = 6;
oop.SPEC_KINDCONST = 7;
oop.SPEC_SELF = 8;

// Prefix characters, identifying type of ZZT-OOP action
oop.prefixChars = "@/?:'$!#";

// Characters used in expression operators
oop.opChars = "+-*/=!><&|^.[";
oop.opLookupStr = [
	"+", "-", "*", "/", "==", "!=", "<", ">", "&", "|", "^", ".", "[", ">=", "<="
];

// Characters used in coordinate and expression ellipsis
oop.ellipsisChars = "()[]+-,";

// Characters used in PLAY statements
oop.musicChars_1 = null;
oop.musicChars = "TSIQHW3.+-XABCDEFG012456789[]";
oop.musicChars_x = "TSIQHW3.+-XABCDEFG012456789[]ZVYPR";

// ZZT-OOP commands
oop.nonSpelledCommandStr = [
	"",
	"RESTORE",
	"ZAP",
	"",
	"FORITER",
	"SEND",
	"?",
	"!-",
	"!",
	"$",
	"",
	"'",
	":",
	"@"
];

oop.commands_1 = null;
oop.commands = [
	"GO", "TRY", "WALK",        // Movement
	"DIE", "ENDGAME",           // Object or game destruction
	"SEND", "RESTART", "END",   // Program flow
	"BIND",                     // Behavior reassign
	"BECOME", "CHANGE", "PUT",  // Kind modification
	"CHAR", "CYCLE",            // Self-status modification
	"CLEAR", "SET",             // Flag handling
	"GIVE", "TAKE",             // Inventory modification
	"IF",                       // Conditional execution
	"LOCK", "UNLOCK",           // Message blocking
	"ZAP", "RESTORE",           // Message label modification
	"SHOOT", "THROWSTAR",       // Projectile firing
	"PLAY",                     // Play music/SFX
	"IDLE"						// Equivalent to /i
];

oop.commands_x = [
	"GO", "TRY", "WALK",
	"DIE", "ENDGAME",
	"SEND", "RESTART", "END",
	"BIND",
	"BECOME", "CHANGE", "PUT",
	"CHAR", "CYCLE",
	"CLEAR", "SET",
	"GIVE", "TAKE",
	"IF",
	"LOCK", "UNLOCK",
	"ZAP", "RESTORE",
	"SHOOT", "THROWSTAR",
	"PLAY",
	"IDLE",
	"\x1F","\x1F",

	"PAUSE",					// Suspend object execution; send main a PAUSED message each frame
	"UNPAUSE",					// Resume object execution.
	"EXTRATURNS",               // Allow object to take multiple turns per iteration
	"DONEDISPATCH",             // Clears dispatch flag; object affected as if
								// no longer dispatched message
	"DISPATCH",					// Dispatch message to main (immediate).
	"SENDTO",					// Send message to specific target.
	"DISPATCHTO",				// Dispatch message to specific target (immediate).
	"SWITCHTYPE",				// Go to message based on type at coordinates.
	"SWITCHVALUE",				// Go to message based on expression value.
	"EXECCOMMAND",				// Execute command in variable string.

	"SETREGION",                // Set named region
	"CLEARREGION",              // Clear named region
	"\x1F","\x1F","\x1F","\x1F","\x1F","\x1F","\x1F","\x1F",

	"CHAR4DIR",                 // Set object's character based on direction
	"COLOR",                    // Set object's color (usually FG only)
	"COLORALL",                 // Set object's FG and BG color
	"DRAWCHAR",					// Draw a character to the grid (nonpermanent)
	"ERASECHAR",				// Erase a (nonpermanent) character from the grid
	"GHOST",					// Change object's ghost flag status and appearance
	"KILLPOS",					// Kill an object at the specified coordinates.
	"\x1F","\x1F","\x1F",

	"SETPOS",                   // Sets X and Y of status element; no movement messages
	"FORCEGO",                  // "Nuclear" version of GO; does not push and will overwrite
	"PUSHATPOS",				// Push objects at a specific position.
	"GROUPSETPOS",				// "Grouped" version of SETPOS
	"GROUPGO",					// "Grouped" version of GO
	"GROUPTRY",					// "Grouped" version of TRY
	"GROUPTRYNOPUSH",			// "Grouped" version of non-pushing TRY (e.g. ZZT WALK)
	"\x1F","\x1F","\x1F",

	"DYNTEXT",                  // Display dynamic text
	"DYNLINK",                  // Display a scroll label with dynamic text
	"DYNTEXTVAR",				// Set global variable to dynamic string.
	"DUMPSE",					// Dump a status element as scroll text
	"DUMPSEAT",					// Dump a status element as scroll text at coordinates
	"TEXTTOGUI",				// Re-route text to a GUI label
	"TEXTTOGRID",				// Re-route text to a region in the grid
	"SCROLLSTR",				// "Scroll" a string into a toast message label
	"SCROLLCOLOR",				// Modify scroll interface color scheme
	"\x1F",

	"SETPLAYER",				// Set the player's object.
	"SETPROPERTY",              // Set world or board property
	"GETPROPERTY",              // Retrieve world or board property
	"PLAYERINPUT",              // Get player's input
	"TYPEAT",                   // Extract kind code
	"COLORAT",                  // Extract color
	"OBJAT",                    // Extract object pointer
	"LITAT",					// Extract lit cell flag
	"RANDOM",                   // Get random number between n and p
	"DIR2UVECT8",               // Get x and y offsets from 8-directional constant
	"OFFSETBYDIR",				// Offset coordinates by a magnitude and direction.
	"SUBSTR",               	// Get substring equivalent of expression.
	"INT",						// Get integer equivalent of expression.
	"ATAN2",					// Get specific-resolution arctangent of step values.
	"SMOOTHTEST",				// Prepare an object pointer for a directional "smooth move"
	"SMOOTHMOVE",				// Take the move identified from SMOOTHTEST
	"READKEY",					// Read keydown status for a keyboard key
	"READMOUSE",				// Read mouse button and cursor status
	"SETTYPEINFO",				// Set type property information
	"GETTYPEINFO",				// Get type property information

	"SPAWN",                    // Put new object at specific coordinates
	"SPAWNGHOST",               // Put new object at specific coordinates, with ghosted status
	"CHANGEREGION",             // "Region" version of CHANGE
	"CLONE",                    // Set CLONE object type
	"\x1F","\x1F","\x1F","\x1F","\x1F","\x1F",

	"FOREACH",                  // Enumerate status elements in a region
	"FORMASK",                  // Enumerate coordinates associated with a mask
	"FORNEXT",					// Iterate to last FOREACH or FORMASK or FORREGION
	"FORREGION",				// Enumerate coordinates at region
	"\x1F","\x1F","\x1F","\x1F","\x1F","\x1F",

	"UPDATEVIEWPORT",           // Update viewport with game contents
	"ERASEVIEWPORT",            // Erase viewport
	"DISSOLVEVIEWPORT",         // Dissolve viewport (in or out)
	"SCROLLTOVISUALS",          // Scroll between boards
	"CAMERAFOCUS",				// Change CAMERAX and CAMERAY to focus on coordinates
	"LIGHTEN",					// Set lit cell flag
	"DARKEN",					// Clear lit cell flag
	"UPDATELIT",				// Draw the area updated most recently by LIGHTEN and DARKEN
	"SUSPENDDISPLAY",			// Impose or lift a temporary suspension of grid display
	"\x1F",

	"USEGUI",                   // Use a named GUI
	"SETGUILABEL",              // Write text to a GUI label
	"SELECTPEN",				// Go into pen-selection mode, letting user pick setting.
	"DRAWPEN",					// Draw a pen at a GUI label.
	"DRAWBAR",					// Draw a bar at a GUI label.
	"CONFMESSAGE",				// Display a confirmation message at the CONFMESSAGE label.
	"TEXTENTRY",				// Display a text entry message at the FILEMESSAGE label, with
								// entry at the FILEENTRY label.
	"DRAWGUICHAR",				// Draw a character to the GUI (nonpermanent)
	"ERASEGUICHAR",				// Erase a (nonpermanent) character from the GUI
	"MODGUILABEL",				// Modify a GUI label to active GUI (or add a new label)

	"SAVEBOARD",				// Save board information for later archive
	"CHANGEBOARD",				// Change board to another in archive
	"SAVEWORLD",				// Bring up interface to save world
	"LOADWORLD",				// Load world archive.
	"RESTOREGAME",				// Bring up interface for restoring game.
	"\x1F","\x1F","\x1F","\x1F","\x1F",

	"PLAYSOUND",                // Play content from a SOUND_FX lump, which contains PLAY
								// statements.  If RS and RE exist within these play
								// statements, looping is automatic for these effects until
								// STOPSOUND is used.
	"GETSOUND",                 // Get sound effect playing.
	"STOPSOUND",                // Stop one or more voices.
	"MASTERVOLUME",             // Change master volume for one or more channels.
	"\x1F","\x1F","\x1F","\x1F","\x1F","\x1F",

	"PUSHARRAY",				// Push expression to end of array.
	"POPARRAY",					// Get expression from top of array; pop from top.
	"SETARRAY",					// Set array to specific size.
	"LEN",						// Get length of an array or string.
	"\x1F","\x1F","\x1F","\x1F","\x1F","\x1F",

	"SETCONFIGVAR",				// Set persistent configuration variable.
	"GETCONFIGVAR",				// Get persistent configuration variable.
	"DELCONFIGVAR",				// Delete persistent configuration variable.
	"DELCONFIGHIVE",			// Delete persistent configuration variable hive.
	"SYSTEMACTION",				// Perform special system-exclusive action.
	"\x1F","\x1F","\x1F","\x1F","\x1F",

	"SCANLINES",				// Set number of scanlines per character.
	"BIT7ATTR",					// Set meaning of bit 7 of color attribute.
	"PALETTECOLOR",				// Change a single color palette DAC entry.
	"PALETTEBLOCK",				// Change a block of color palette DAC entries.
	"FADETOCOLOR",				// Fade all colors to a single color palette DAC entry.
	"FADETOBLOCK",				// Fade a block of colors palette DAC entries to specific targets.
	"CHARSELECT",				// Character selection interface (modify ASCII character set).
	"\x1F","\x1F","\x1F",

	"POSTHS",					// Post a high score line.
	"GETHS",					// Get high scores.
	"GETHSENTRY"				// Get a high score field entry.
];

// Flags used in IF statements
oop.flagEvals_1 = null;
oop.flagEvals = [
	"ANY", "ALLIGNED", "CONTACT", "BLOCKED", "ENERGIZED"
];

oop.flagEvals_x = [
	"ANY", "ALLIGNED", "CONTACT", "BLOCKED", "ENERGIZED",

	"ALIGNED",                  // Alternate (correct) spelling of ALLIGNED.
	"ANYTO",                    // If a kind is immediately to a specific direction.
	"ANYIN",                    // If a kind is within a specific named region.
	"SELFIN",                   // If self is within a specific named region.
	"TYPEIS",                   // If a kind is at a specific coordinate.
	"BLOCKEDAT",				// If blocking flag set for type at a specific coordinate.
	"CANPUSH",                  // If can push towards a specific direction.
								// This is not the same as BLOCKED, which detects if
								// anything other than EMPTY, FLOOR, or FAKE is present.
	"SAFEPUSH",                 // Variation on CANPUSH; will fail if squash would occur.
	"SAFEPUSH1",                // Variation on CANPUSH; will fail if 100% squash would occur.
	"HASMESSAGE",				// Checks if object at pointer has a valid message label.
	"TEST",                     // Checks if an expression is zero or nonzero;
								// expression must be a number.
	"VALID"                     // Checks if an object pointer is valid.
];

// Game-generated messages
oop.specialMessages_1 = null;
oop.specialMessages = [
	"TOUCH", "SHOT", "BOMBED", "THUD", "ENERGIZE", "HINT"
];

oop.specialMessages_x = [
	"TOUCH", "SHOT", "BOMBED", "THUD", "ENERGIZE", "HINT",

	"BLOCKBEHAVIOR",            // Sent when something crashes into it (GO, TRY).
	"CRASHBEHAVIOR",            // Sent when object crashes into something (GO, TRY).
	"DIEBEHAVIOR",              // Sent when object is about to die (no matter how).
	"PUSHBEHAVIOR",             // Sent when a push attempt is coming from a direction.
	"WALKBEHAVIOR",             // Sent when making an object walk.
	"ONENTERBOARD",             // Sent when player enters the board.
	"ONLEAVEBOARD"              // Sent when player leaves the board.
];

// Directions and directional mod prefixes
oop.directions_1 = null;
oop.directions = [
	"E", "EAST",
	"S", "SOUTH",
	"W", "WEST",
	"N", "NORTH",
	"I", "IDLE",
	"SEEK", "FLOW",             // Looked-up direction
	"RNDNS", "RNDNE", "RND",    // Random direction
	"CW", "CCW", "RNDP", "OPP"  // Directional mod prefix
];

oop.directions_x = [
	"E", "EAST",
	"S", "SOUTH",
	"W", "WEST",
	"N", "NORTH",
	"I", "IDLE",
	"SEEK", "FLOW",
	"RNDNS", "RNDNE", "RND",
	"CW", "CCW", "RNDP", "OPP",

	"RNDSQ",                    // Genuinely random direction, with all 4 directions
								// picked with equal probability.
	"TOWARDS",                  // Equivalent of SEEK but with any coordinate pair dest.
	"MAJOR",                    // Picks dominant direction if destination is diagonal.
	"MINOR",                    // Picks non-dominant direction if destination is diagonal.
];

// Inventory names used in GIVE and TAKE statements
oop.inventory_1 = null;
oop.inventory = [
	"AMMO", "TORCHES", "GEMS", "HEALTH", "SCORE", "TIME", "Z"
];

oop.inventory_x = [
	"AMMO", "TORCHES", "GEMS", "HEALTH", "SCORE", "TIME", "Z",

	"KEY"                       // Can adjust keys in inventory (color required).
];

// Colors used when qualifying kinds
oop.colors_1 = null;
oop.colors = [
	"BLUE", "GREEN", "CYAN", "RED", "PURPLE", "YELLOW", "WHITE"
];

oop.colors_x = [
	// New
	"BLACK", "DARKBLUE", "DARKGREEN", "DARKCYAN", "DARKRED",
	"DARKPURPLE", "BROWN", "GREY", "DARKGREY",

	// Old
	"BLUE", "GREEN", "CYAN", "RED", "PURPLE", "YELLOW", "WHITE"
];

// Kinds used when referring to terrain and object types in the game
oop.kinds = [
	"EMPTY",
	"BOARDEDGE",
	"MESSENGER",
	"MONITOR",
	"PLAYER",
	"AMMO",
	"TORCH",
	"GEM",
	"KEY",
	"DOOR",
	"SCROLL",
	"PASSAGE",
	"DUPLICATOR",
	"BOMB",
	"ENERGIZER",
	"STAR",
	"CLOCKWISE",
	"COUNTER",
	"BULLET",
	"WATER",
	"LAVA",
	"FOREST",
	"SOLID",
	"NORMAL",
	"BREAKABLE",
	"BOULDER",
	"SLIDERNS",
	"SLIDEREW",
	"FAKE",
	"INVISIBLE",
	"BLINKWALL",
	"TRANSPORTER",
	"LINE",
	"RICOCHET",
	"_BEAMHORIZ",
	"BEAR",
	"RUFFIAN",
	"OBJECT",
	"SLIME",
	"SHARK",
	"SPINNINGGUN",
	"PUSHER",
	"LION",
	"TIGER",
	"_BEAMVERT",
	"HEAD",
	"SEGMENT",
	"FLOOR",
	"WATERN",
	"WATERS",
	"WATERW",
	"WATERE",
	"ROTON",
	"DRAGONPUP",
	"PAIRER",
	"SPIDER",
	"WEB",
	"STONE",
	"_TEXTBLUE",
	"_TEXTGREEN",
	"_TEXTCYAN",
	"_TEXTRED",
	"_TEXTPURPLE",
	"_TEXTBROWN",
	"_TEXTWHITE",
	"_WINDTUNNEL"
];

// Miscellaneous keywords
oop.miscKeywords_1 = null;
oop.miscKeywords = [
	"NOT",
	"SELF",
	"ALL",
	"OTHERS",
	"THEN"
];

oop.miscKeywords_x = [
	"NOT",
	"SELF",
	"ALL",
	"OTHERS",
	"THEN",

	"CLONE",                    // Kind established from last CLONE command
	"SILENT",                   // Inhibits sound for some actions
	"UNDER",					// Modifies placement of new objects
	"OVER",						// Modifies placement of new objects
];

// Keywords used with KIND or dot operator
oop.keywordArgs = [
	"TYPE",                     // Type code
	"X",                        // X-coordinate; 1-based
	"Y",                        // Y-coordinate; 1-based
	"STEPX",                    // X-step
	"STEPY",                    // Y-step
	"CYCLE",                    // Number
	"P1",                       // Number
	"P2",                       // Number
	"P3",                       // Number
	"FOLLOWER",                 // Object pointer
	"LEADER",                   // Object pointer
	"UNDERID",                  // Kind code "under" object
	"UNDERCOLOR",               // Color code "under" object

	"CHAR",                     // Character code of the object; alias of P1 for OBJECT type
	"COLOR",                    // Color code of the object
	"COLORALL",                 // Color code of the object, FG and BG together
	"DIR",                      // Flow direction (calculated from STEPX and STEPY)
	"ONAME",                    // ONAME to which to bind on the board
	"BIND",                     // Kind-specific; alias of ONAME
	"INTELLIGENCE",             // Kind-specific; alias of P1
	"SENSITIVITY",              // Kind-specific; alias of P1
	"PHASE",             		// Kind-specific; alias of P1
	"PERIOD",                   // Kind-specific; alias of P2
	"RESTINGTIME",              // Kind-specific; alias of P2
	"DEVIANCE",                 // Kind-specific; alias of P2
	"RATE",                     // Kind-specific; alias of P2
	"DESTINATION",              // Kind-specific; alias of P3
];

// "Traceback" dictionary look-up
oop.negTracebackLookup = [
	"EXPRPRESENT", "KINDNORM/BOOLEAN", "KINDEXPR/NOT", "KINDMISC/NORM",
	"ALL/KWARGEND", "NOCOLOR", "COORD_POLAR", "COORD_ADD", "COORD_SUB", "COORD_ABS",
	"EXPREND"
];

// "Traceback" dictionary look-up
oop.posTracebackLookup = [
	"ERROR/INVNONE/SILENT",
	"GO/ANY/E/INVAMMO/NOT/+/NOTSILENT/NUMCONST",
	"TRY/ALLIGNED/INVTORCHES/SELF/-/STRCONST",
	"CONTACT/WALK/S/INVGEMS/ALL/*/LOCALVAR",
	"DIE/BLOCKED/INVHEALTH/OTHERS///PROPERTY",
	"ENERGIZED/W/INVSCORE/THEN/=/GLOBALVAR",
	"SEND/ALIGNED/INVTIME/CLONE/!/DIRCONST",
	"ANYTO/N/INVZ/SILENT/>=/KINDCONST",
	"END/ANYIN/INVKEY/</SELF",
	"SELFIN/I/&",
	"TYPEIS/|",
	"BLOCKEDAT/SEEK/^",
	"FLOW/CANPUSH/.",
	"SAFEPUSH/RNDNS/[]",
	"SAFEPUSH1/RNDNE/>=",
	"TEST/RND/<=",
	"VALID/CW",
	"CCW",
	"RNDP",
	"OPP",
	"RNDSQ",
	"TOWARDS",
	"MAJOR",
	"MINOR"
];

// Strings parsed in the past
oop.pStrings = [];

// Error condition
oop.errorText = "";
oop.hasError = false;

oop.oopType = -3;
oop.lastAssignedName = "";
oop.lastDirType = 0;
oop.virtualIP = 0;
oop.lineStartIP = 0;
oop.checkMiddleOffset = 0;
oop.zeroTypeLabelAction = 0;
oop.zeroTypeLabelLocs = [];
};

static setOOPType(type=-3) {
	if (type != -3)
	{
		// Use classic ZZT-OOP namespace
		oop.musicChars_1 = oop.musicChars;
		oop.commands_1 = oop.commands;
		oop.flagEvals_1 = oop.flagEvals;
		oop.specialMessages_1 = oop.specialMessages;
		oop.directions_1 = oop.directions;
		oop.inventory_1 = oop.inventory;
		oop.colors_1 = oop.colors;
		oop.miscKeywords_1 = oop.miscKeywords;
	}
	else
	{
		// Use extended ZZTUltra-OOP namespace
		oop.musicChars_1 = oop.musicChars_x;
		oop.commands_1 = oop.commands_x;
		oop.flagEvals_1 = oop.flagEvals_x;
		oop.specialMessages_1 = oop.specialMessages_x;
		oop.directions_1 = oop.directions_x;
		oop.inventory_1 = oop.inventory_x;
		oop.colors_1 = oop.colors_x;
		oop.miscKeywords_1 = oop.miscKeywords_x;
	}

	// Banana Quest hacked executable keywords
	if (zzt.globalProps["BQUESTHACK"])
	{
		oop.commands_1[oop.CMD_END - 1] = "STP";
		oop.commands_1[oop.CMD_CYCLE - 1] = "SPEED";
		oop.commands_1[oop.CMD_PLAY - 1] = "MUZK";
		oop.commands_1[oop.CMD_ENDGAME - 1] = "OHHDREA";
	}
	else
	{
		oop.commands_1[oop.CMD_END - 1] = "END";
		oop.commands_1[oop.CMD_CYCLE - 1] = "CYCLE";
		oop.commands_1[oop.CMD_PLAY - 1] = "PLAY";
		oop.commands_1[oop.CMD_ENDGAME - 1] = "ENDGAME";
	}

	oop.oopType = type;
	oop.errorText = "";
	oop.hasError = false;
};

static errorMsg(str) {
	oop.hasError = true;
	oop.errorText = str;
};

static warningMsg(str) {
	zzt.Toast(str);
};

static postErrorMsg(b, str, popCount=0) {
	while (popCount--)
		b.pop();
	b.push(oop.CMD_ERROR);
	b.push(oop.addCString(str));
};

static findMatching(str, cont) {
	var strLen = oop.findNonKW(str, 0);
	str = str.substr(0, strLen).toUpperCase();

	return cont.indexOf(str);
};

static findNonWS(str, idx) {
	for (var i = idx; i < str.length; i++) {
		if (str.charCodeAt(i) != 32)
			return i; // Found
	}

	return str.length; // EOL
};

static findNonWSComma(str, idx) {
	for (var i = idx; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if (c != 32 && c != 44)
			return i; // Found
	}

	return str.length; // EOL
};

static findNonKW(str, idx) {
	for (var i = idx; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if ((c >= 65 && c <= 90) || (c >= 48 && c <= 57) ||
			(c >= 97 && c <= 122) || c == 95)
		{
			// Continue
		}
		else
		{
			return i; // Found
		}
	}

	return str.length; // EOL
};

static findNonKWDynamic(str, idx) {
	for (var i = idx; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if ((c >= 65 && c <= 90) || (c >= 48 && c <= 57) ||
			(c >= 97 && c <= 122) || c == 95 || c == 36)
		{
			// Continue
		}
		else
		{
			return i; // Found
		}
	}

	return str.length; // EOL
};

static isNumeric(str, idx) {
	var c = str.charCodeAt(idx);
	if (c >= 48 && c <= 57)
		return true;
	else
		return false;
};

static isAlpha(str, idx) {
	var c = str.charCodeAt(idx);
	if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c == 95)
		return true;
	else
		return false;
};

static isAlphaNum(str, idx) {
	var c = str.charCodeAt(idx);
	if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122) ||
		(c >= 48 && c <= 57) || c == 95)
		return true;
	else
		return false;
};

static addString(str) {
	var l = oop.pStrings.length;
	oop.pStrings.push(str.toUpperCase());
	return l;
};

static addCString(str) {
	var l = oop.pStrings.length;
	oop.pStrings.push(str);
	return l;
};

static pushOldZeroTypeLabel(labelStr) {
	var code = interp.codeBlocks[0];
	for (var i = 0; i < oop.zeroTypeLabelLocs.length; i++) {
		var pos = oop.zeroTypeLabelLocs[i];
		if (oop.pStrings[code[pos + 1]] == labelStr)
		{
			code[pos] = oop.CMD_COMMENT;
			break;
		}
	}
};

static restoreOldZeroTypeLabels() {
	var code = interp.codeBlocks[0];
	for (var i = 0; i < oop.zeroTypeLabelLocs.length; i++) {
		var pos = oop.zeroTypeLabelLocs[i];
		code[pos] = oop.CMD_LABEL;
	}
};

static parseLine(b, line) {
	// Empty line counts as text
	if (line.length == 0)
	{
		b.push(oop.CMD_TEXT);
		b.push(oop.addString(""));
		return b;
	}

	// Text counts as any line not adorned by a prefix character.
	var op = oop.prefixChars.indexOf(line.charAt(0));
	if (op == -1)
	{
		b.push(oop.CMD_TEXT);
		b.push(oop.addCString(line));
	}
	else
	{
		oop.parseCommand(b, line, 0);
	}

	if (oop.hasError)
		return null;
	else
		return b;
};

static parseGo(b, line, idx=0) {
	while (idx < line.length) {
		// Detect middle-of-line virtual IP position.
		if (oop.checkMiddleOffset == idx)
			oop.virtualIP = b.length;

		var s = line.charAt(idx);
		if (++idx > line.length)
		{
			oop.postErrorMsg(b, "Bad " + s);
			return;
		}

		var goStart = b.length;
		if (s == "/")
			b.push(oop.CMD_GO);
		else
			b.push(oop.CMD_TRYSIMPLE);

		idx = oop.parseDirection(b, line, idx);
		if (idx == -1)
		{
			oop.postErrorMsg(b, "Bad direction", 1);
			return;
		}
		var goEnd = b.length;

		var testIdx = oop.findNonWS(line, idx);
		if (testIdx < line.length)
		{
			if (oop.isNumeric(line, testIdx) && oop.oopType != -1)
			{
				idx = testIdx;
				testIdx = -1;
				var eLoc = oop.findNonKW(line, idx);
				var repCount = utils.int(line.substring(idx, eLoc));
				idx = oop.findNonWS(line, eLoc);

				// Repeat last operation.
				while (--repCount > 0)
				{
					var unitSlice = b.slice(goStart, goEnd);
					for (var i = 0; i < unitSlice.length; i++)
						b.push(unitSlice[i]);
				}

				return;
			}
		}

		// Unusual syntax to see command here, but still valid
		if (idx < line.length)
		{
			var op = oop.prefixChars.indexOf(line.charAt(idx));
			if (op == -1)
			{
				b.push(oop.CMD_TEXT);
				b.push(oop.addCString(line.substring(idx)));
				idx = line.length;
			}
			else if (line.charAt(idx) != "/" && line.charAt(idx) != "?")
			{
				oop.parseCommand(b, line, idx);
				idx = line.length;
			}
		}
	}
};

static parseCommand(b, line, idx) {
	while (idx < line.length)
	{
		// Multiple '#' characters permitted
		// Dumb parsing rule but still valid
		if (line.charAt(idx) == "#")
			idx++;
		else
			break;
	}
	if (idx >= line.length)
	{
		// Empty text
		b.push(oop.CMD_TEXT);
		b.push(oop.addCString(""));
		return line.length;
	}

	// Ignore leading spaces.
	var c1 = line.charAt(idx);
	while (idx < line.length)
	{
		if (c1 == " ")
			c1 = line.charAt(++idx);
		else
			break;
	}

	if (c1 == "@")
	{
		// Name assignment
		oop.lastAssignedName = line.substr(idx+1);
		b.push(oop.CMD_NAME);
		b.push(oop.addCString(oop.lastAssignedName));

		return line.length;
	}
	else if (c1 == ":")
	{
		// Message Label
		c1 = utils.rstrip(line.substr(idx+1));
		b.push(oop.CMD_LABEL);
		b.push(oop.addString(c1));
		b.push(oop.lineStartIP);

		if (oop.zeroTypeLabelAction == 1)
			oop.zeroTypeLabelLocs.push(b.length - 3);
		else if (oop.zeroTypeLabelAction == 2)
			oop.pushOldZeroTypeLabel(c1);

		return line.length;
	}
	else if (c1 == "'")
	{
		// Comment
		b.push(oop.CMD_COMMENT);
		b.push(oop.addString(utils.rstrip(line.substr(idx+1))));
		b.push(oop.lineStartIP);

		return line.length;
	}
	else if (c1 == "/" || c1 == "?")
	{
		// Movement
		oop.parseGo(b, line, idx);
		return line.length;
	}
	else if (c1 == "$")
	{
		// Centered text
		b.push(oop.CMD_TEXTCENTER);
		b.push(oop.addCString(line.substr(idx+1)));
		return line.length;
	}
	else if (c1 == "!")
	{
		// Button link
		var sepLoc = line.indexOf(";", idx+1);
		if (sepLoc == -1)
		{
			oop.postErrorMsg(b, "Bad link");
		}
		else if (line.charAt(idx+1) == "-")
		{
			b.push(oop.CMD_TEXTLINKFILE);
			b.push(oop.addString(line.substring(idx+2, sepLoc)));
			b.push(oop.addCString(line.substring(sepLoc+1)));
		}
		else
		{
			b.push(oop.CMD_TEXTLINK);
			b.push(oop.addString(line.substring(idx+1, sepLoc)));
			b.push(oop.addCString(line.substring(sepLoc+1)));
		}

		return line.length;
	}
	else if (!oop.isAlpha(line, idx))
	{
		// This counts as text; strange parsing rule
		b.push(oop.CMD_TEXT);
		b.push(oop.addCString(line.substr(idx)));
		return line.length;
	}

	// Parse # command
	line = line.substr(idx);
	idx = 0;
	var str = line;
	var cmdType = oop.findMatching(str, oop.commands_1);
	var otherType;
	var nextIdx;
	var falseJumpLoc;

	// Will count as #SEND command if...
	// 1) #SEND Target
	// 2) #SEND Target:Label
	// 3) #Target (Target cannot be command)
	// 4) #Target:Label (Target CAN be command, but without spaces between Target and colon)
	var colonLoc = line.indexOf(":", idx);
	var spaceLoc = line.indexOf(" ", idx);
	if (cmdType == -1 || (colonLoc != -1 && (spaceLoc == -1 || spaceLoc > colonLoc)))
	{
		// SEND equivalent
		if (colonLoc == -1)
		{
			// Self-SEND
			b.push(oop.CMD_SEND);
			nextIdx = oop.findNonKWDynamic(line, idx);
			b.push(oop.addString(utils.rstrip(line.substring(idx, nextIdx))));
		}
		else
		{
			str = line.substring(idx, colonLoc).toUpperCase();
			if (str == "SELF")
			{
				// Self-SEND
				b.push(oop.CMD_SEND);
				nextIdx = oop.findNonKWDynamic(line, colonLoc+1);
				b.push(oop.addString(utils.rstrip(line.substring(colonLoc+1, nextIdx))));
			}
			else
			{
				// SENDTONAME
				b.push(oop.CMD_SENDTONAME);
				nextIdx = oop.findNonKWDynamic(line, colonLoc+1);
				b.push(oop.addString(str));
				b.push(oop.addString(utils.rstrip(line.substring(colonLoc+1, nextIdx))));
			}
		}

		idx = oop.findNonWS(line, idx);
	}
	else
	{
		// Ordinary command.
		idx = oop.findNonKW(line, idx);
		idx = oop.findNonWS(line, idx);
		b.push(cmdType + 1);
		switch (cmdType + 1) {
			case oop.CMD_GO:
				idx = oop.parseDirAndLength(b, line, idx);
				if (oop.lastDirType == oop.DIR_I)
				{
					// Special:  #GO IDLE should block indefinitely.
					b.push(oop.CMD_END);
				}
			break;
			case oop.CMD_FORCEGO:
				idx = oop.parseDirAndLength(b, line, idx);
			break;
			case oop.CMD_TRY:
				idx = oop.parseDirAndAction(b, line, idx);
			break;
			case oop.CMD_WALK:
				idx = oop.parseDirection(b, line, idx);
			break;
			case oop.CMD_IDLE:
				b[b.length - 1] = oop.CMD_GO;
				b.push(oop.DIR_I);
			break;
			case oop.CMD_SHOOT:
			case oop.CMD_THROWSTAR:
				if (oop.findMatching(line.substr(idx), oop.miscKeywords_1) == oop.MISC_SILENT-1)
				{
					idx = oop.findNonKW(line, idx);
					idx = oop.findNonWS(line, idx);
					b.push(oop.SPEC_SILENT); // SILENT
				}
				else
					b.push(oop.SPEC_NOTSILENT); // NOT SILENT

				idx = oop.parseDirection(b, line, idx);
				if (idx == -1)
				{
					oop.postErrorMsg(b, "Bad direction", 2);
				}
			break;
			case oop.CMD_DIE:
			case oop.CMD_ENDGAME:
			case oop.CMD_END:
			case oop.CMD_RESTART:
			case oop.CMD_LOCK:
			case oop.CMD_UNLOCK:
			case oop.CMD_DONEDISPATCH:
			case oop.CMD_UPDATEVIEWPORT:
			case oop.CMD_ERASEVIEWPORT:
			case oop.CMD_UPDATELIT:
			case oop.CMD_PAUSE:
			case oop.CMD_UNPAUSE:
			break;
			case oop.CMD_FORNEXT:
				b.push(oop.CMD_LABEL);
				b.push(oop.addString(":#PASTFORNEXT"));
				b.push(oop.lineStartIP);
			break;

			case oop.CMD_SEND:
				colonLoc = line.indexOf(":", idx);
				if (colonLoc == -1)
				{
					// Self-SEND
					nextIdx = oop.findNonKWDynamic(line, idx);
					b.push(oop.addString(line.substring(idx, nextIdx)));
				}
				else
				{
					str = line.substring(idx, colonLoc).toUpperCase();
					if (str == "SELF")
					{
						// Self-SEND
						b[b.length-1] = oop.CMD_SEND;
						nextIdx = oop.findNonKWDynamic(line, colonLoc+1);
						b.push(oop.addString(line.substring(colonLoc+1, nextIdx)));
					}
					else
					{
						// SENDTONAME
						b[b.length-1] = oop.CMD_SENDTONAME;
						nextIdx = oop.findNonKWDynamic(line, colonLoc+1);
						b.push(oop.addString(str));
						b.push(oop.addString(line.substring(colonLoc+1, nextIdx)));
					}
				}
			break;
			case oop.CMD_DISPATCH:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx)));
			break;
			case oop.CMD_SENDTO:
			case oop.CMD_DISPATCHTO:
				colonLoc = line.indexOf(":", idx);
				if (colonLoc != -1)
				{
					nextIdx = oop.findNonKWDynamic(line, colonLoc+1);
					idx = oop.parseExpr(b, line, idx);
					b.push(oop.addString(line.substring(colonLoc+1, nextIdx)));
				}
				else
					oop.postErrorMsg(b, "Expected:  colon", 1);
			break;
			case oop.CMD_BIND:
				nextIdx = oop.findNonKW(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx)));
				nextIdx = line.length;
			break;
			case oop.CMD_ZAP:
				colonLoc = line.indexOf(":", idx);
				if (colonLoc != -1)
				{
					b[b.length-1] = oop.CMD_ZAPTARGET;
					b.push(oop.addString(line.substring(idx, colonLoc)));
					nextIdx = oop.findNonKWDynamic(line, colonLoc+1);
					b.push(oop.addString(line.substring(colonLoc+1, nextIdx)));
					idx = nextIdx;
				}
				else
				{
					nextIdx = oop.findNonKWDynamic(line, idx);
					b.push(oop.addString(line.substring(idx, nextIdx)));
					idx = nextIdx;
				}
			break;
			case oop.CMD_RESTORE:
				colonLoc = line.indexOf(":", idx);
				if (colonLoc != -1)
				{
					b[b.length-1] = oop.CMD_RESTORETARGET;
					b.push(oop.addString(line.substring(idx, colonLoc)));
					nextIdx = oop.findNonKWDynamic(line, colonLoc+1);
					b.push(oop.addString(line.substring(colonLoc+1, nextIdx)));
					idx = nextIdx;
				}
				else
				{
					nextIdx = oop.findNonKWDynamic(line, idx);
					b.push(oop.addString(line.substring(idx, nextIdx)));
					idx = nextIdx;
				}
			break;
			case oop.CMD_CHAR:
			case oop.CMD_CYCLE:
				if (idx >= line.length)
				{
					// Kludge:  enter a NOP if expression missing
					b[b.length-1] = oop.CMD_NOP;
				}
				else
					idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_COLOR:
			case oop.CMD_COLORALL:
			case oop.CMD_EXTRATURNS:
			case oop.CMD_SUSPENDDISPLAY:
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_PLAY:
			case oop.CMD_PLAYSOUND:
			case oop.CMD_USEGUI:
				b.push(oop.addString(line.substr(idx)));
			break;
			case oop.CMD_BECOME:
				idx = oop.parseKind(b, line, idx);
			break;
			case oop.CMD_CHANGE:
				idx = oop.parseKind(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseKind(b, line, idx);
			break;
			case oop.CMD_PUT:
				otherType = oop.findMatching(line.substr(idx), oop.miscKeywords_1);
				if (otherType == oop.MISC_UNDER-1 || otherType == oop.MISC_OVER-1)
				{
					idx = oop.findNonKW(line, idx);
					idx = oop.findNonWS(line, idx);
					b.push(oop.DIR_UNDER + otherType - (oop.MISC_UNDER-1));
				}
				else
				{
					idx = oop.parseDirection(b, line, idx);
					if (idx == -1)
					{
						oop.postErrorMsg(b, "Bad direction", 1);
						return idx;
					}
				}

				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseKind(b, line, idx);
			break;
			case oop.CMD_CLEAR:
				idx = oop.parseExpr(b, line, idx, true);
			break;
			case oop.CMD_DISSOLVEVIEWPORT:
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_RANDOM:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_SET:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWS(line, idx);
				if (idx == line.length || oop.oopType != -3)
				{
					b.push(oop.SPEC_BOOLEAN); // Boolean value:  1
					b.push(1);
				}
				else
				{
					if (line.charAt(idx) == '=')
						idx = oop.findNonWS(line, ++idx);

					idx = oop.parseExpr(b, line, idx);
				}
			break;
			case oop.CMD_GIVE:
			case oop.CMD_TAKE:
				otherType = oop.findMatching(line.substr(idx), oop.colors_1);
				if (otherType != -1 && oop.oopType == -3)
				{
					// Colored key inventory
					b.push(oop.INV_KEY);
					b.push(otherType);

					idx = oop.findNonKW(line, idx);
					idx = oop.findNonWS(line, idx);
					if (oop.findMatching(line.substr(idx), oop.inventory_1) != oop.INV_KEY-1)
						oop.warningMsg("Inventory syntax:  [COLOR] KEY");
				}
				else
				{
					// Conventional inventory
					otherType = oop.findMatching(line.substr(idx), oop.inventory_1);
					if (otherType >= oop.INV_KEY-1 || otherType < 0)
					{
						if (oop.oopType == -3)
						{
							// ZZT Ultra mode lets any property work as inventory
							b.push(oop.INV_EXTRA);
							otherType = oop.INV_EXTRA + 1;
							nextIdx = oop.findNonKW(line, idx);
							b.push(oop.addString(line.substring(idx, nextIdx)));
						}
						else
						{
							// Inventory needs to work even if wrong
							b.push(oop.INV_NONE);
							otherType = -1;
						}
					}
					else
						b.push(otherType+1);
				}

				// Amount to give/take
				if (otherType == -1)
				{
					// Erroneous inventory; set amount to zero
					b.push(oop.SPEC_NUMCONST);
					b.push(0);
				}
				else
				{
					idx = oop.findNonKW(line, idx);
					idx = oop.findNonWSComma(line, idx);
					if (idx >= line.length)
					{
						// No inventory count; set amount to zero
						b.push(oop.SPEC_NUMCONST);
						b.push(0);
					}
					else
						idx = oop.parseExpr(b, line, idx);
				}

				// TAKE can execute command if out of inventory
				if (cmdType + 1 == oop.CMD_TAKE)
				{
					// False condition jump-over
					b.push(oop.CMD_FALSEJUMP);
					falseJumpLoc = b.length;
					b.push(0);

					idx = oop.findNonWSComma(line, idx);
					if (idx < line.length)
						idx = oop.parseCommand(b, line, idx);
					else
						b.push(oop.CMD_NOP);

					// Set the false jump-over location.
					b[falseJumpLoc] = b.length;
				}
			break;
			case oop.CMD_IF:
				if (oop.findMatching(line.substr(idx), oop.miscKeywords_1) == oop.MISC_NOT-1)
				{
					idx = oop.findNonKW(line, idx);
					idx = oop.findNonWS(line, idx);
					b.push(oop.SPEC_NOT);
				}
				else
					b.push(oop.SPEC_NORM);

				otherType = oop.findMatching(line.substr(idx), oop.flagEvals_1);
				if (otherType == -1)
				{
					// Miscellaneous flag test
					nextIdx = oop.findNonKW(line, idx);
					str = line.substring(idx, nextIdx);
					otherType = oop.FLAG_GENERIC - 1;

					if (str == "")
					{
						// Special:  if no clause at all, set "always true" flag.
						otherType = oop.FLAG_ALWAYSTRUE - 1;
					}
					else if (oop.isNumeric(str, 0))
					{
						// Special:  if numeric field, set "always true" flag,
						// and DO NOT ADVANCE beyond the number.
						otherType = oop.FLAG_ALWAYSTRUE - 1;
						nextIdx = idx;
					}
				}

				otherType++;
				b.push(otherType);
				idx = oop.findNonKW(line, idx);
				idx = oop.findNonWS(line, idx);

				switch (otherType) {
					case oop.FLAG_ALWAYSTRUE:
						idx = nextIdx;
					break;
					case oop.FLAG_GENERIC:
						b.push(oop.addString(str));
					break;
					case oop.FLAG_ANY:
						idx = oop.parseKind(b, line, idx);
					break;
					case oop.FLAG_ALLIGNED:
					case oop.FLAG_ALIGNED:
					case oop.FLAG_CONTACT:
						idx = oop.findNonWS(line, idx);
						if (oop.oopType != -3)
							b.push(oop.SPEC_ALL); // ALL
						else
						{
							nextIdx = oop.parseDirection(b, line, idx);
							if (nextIdx == -1)
								b.push(oop.SPEC_ALL); // ALL
							else
								idx = nextIdx;
						}
					break;
					case oop.FLAG_BLOCKED:
						idx = oop.findNonWS(line, idx);
						nextIdx = oop.parseDirection(b, line, idx);
						if (nextIdx == -1)
						{
							oop.postErrorMsg(b, "Bad direction", 3);
							return idx;
						}
						else
							idx = nextIdx;
					break;
					case oop.FLAG_CANPUSH:
					case oop.FLAG_SAFEPUSH:
					case oop.FLAG_SAFEPUSH1:
						idx = oop.findNonWS(line, idx);
						idx = oop.parseCoords(b, line, idx);
						idx = oop.findNonWSComma(line, idx);
						nextIdx = oop.parseDirection(b, line, idx);
						if (nextIdx == -1)
						{
							b.push(oop.DIR_I);
							oop.postErrorMsg(b, "Bad direction");
							return idx;
						}
						else
							idx = nextIdx;
					break;
					case oop.FLAG_ENERGIZED:
					break;
					case oop.FLAG_ANYTO:
						nextIdx = oop.parseDirection(b, line, idx);
						if (nextIdx == -1)
						{
							oop.postErrorMsg(b, "Bad direction", 3);
							return idx;
						}
						idx = oop.findNonWSComma(line, idx);
						idx = oop.parseKind(b, line, idx);
					break;
					case oop.FLAG_ANYIN:
						idx = oop.parseExpr(b, line, idx);
						idx = oop.findNonWSComma(line, idx);
						idx = oop.parseKind(b, line, idx);
					break;
					case oop.FLAG_SELFIN:
						idx = oop.parseExpr(b, line, idx);
					break;
					case oop.FLAG_TYPEIS:
						idx = oop.parseCoords(b, line, idx);
						idx = oop.findNonWSComma(line, idx);
						idx = oop.parseKind(b, line, idx);
					break;
					case oop.FLAG_BLOCKEDAT:
						idx = oop.parseCoords(b, line, idx);
						idx = oop.findNonWS(line, idx);
					break;
					case oop.FLAG_HASMESSAGE:
						idx = oop.parseExpr(b, line, idx);
						idx = oop.findNonWSComma(line, idx);
						nextIdx = oop.findNonKW(line, idx);
						b.push(oop.addString(line.substring(idx, nextIdx)));
						idx = nextIdx;
					break;
					case oop.FLAG_TEST:
					case oop.FLAG_VALID:
						idx = oop.parseExpr(b, line, idx);
					break;
				}

				idx = oop.findNonWS(line, idx);
				if (oop.findMatching(line.substr(idx), oop.miscKeywords_1) == oop.MISC_THEN-1)
				{
					idx = oop.findNonKW(line, idx);
					idx = oop.findNonWS(line, idx);
				}

				// False condition jump-over
				b.push(oop.CMD_FALSEJUMP);
				falseJumpLoc = b.length;
				b.push(0);

				// A wide variety of possible statements can come after #IF.
				// Based on the next character, decide.
				if (idx >= line.length)
					oop.postErrorMsg(b, "No statement at end of #IF");
				else
					idx = oop.parseCommand(b, line, idx);

				// Set the false jump-over location.
				b[falseJumpLoc] = b.length;

				return line.length;
			break;
			case oop.CMD_CHAR4DIR:
				nextIdx = oop.parseDirection(b, line, idx);
				if (nextIdx == -1)
				{
					oop.postErrorMsg(b, "Bad direction", 1);
					return idx;
				}
				else
					idx = nextIdx;

				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_DIR2UVECT8:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_OFFSETBYDIR:
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_SPAWN:
				otherType = oop.findMatching(line.substr(idx), oop.miscKeywords_1);
				if (otherType == oop.MISC_UNDER-1 || otherType == oop.MISC_OVER-1)
				{
					idx = oop.findNonKW(line, idx);
					idx = oop.findNonWS(line, idx);
					b.push(oop.DIR_UNDER + otherType - (oop.MISC_UNDER-1));
				}
				else
					b.push(0);

				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseKind(b, line, idx);
			break;
			case oop.CMD_SPAWNGHOST:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseKind(b, line, idx);
			break;
			case oop.CMD_CAMERAFOCUS:
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_SETPOS:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);

				otherType = oop.findMatching(line.substr(idx), oop.miscKeywords_1);
				if (otherType == oop.MISC_UNDER-1 || otherType == oop.MISC_OVER-1)
				{
					idx = oop.findNonKW(line, idx);
					idx = oop.findNonWS(line, idx);
					b.push(oop.DIR_UNDER + otherType - (oop.MISC_UNDER-1));
				}
				else
					b.push(0);

				idx = oop.parseCoords(b, line, idx);
			break;
			case oop.CMD_TYPEAT:
			case oop.CMD_COLORAT:
			case oop.CMD_OBJAT:
			case oop.CMD_LITAT:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseCoords(b, line, idx);
			break;
			case oop.CMD_PUSHATPOS:
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				nextIdx = oop.parseDirection(b, line, idx);
				if (nextIdx == -1)
				{
					b.push(oop.DIR_I);
					oop.postErrorMsg(b, "Bad direction");
					return idx;
				}
			break;
			case oop.CMD_CHANGEBOARD:
			case oop.CMD_SAVEBOARD:
			case oop.CMD_LOADWORLD:
			case oop.CMD_SAVEWORLD:
			case oop.CMD_RESTOREGAME:
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_LIGHTEN:
			case oop.CMD_DARKEN:
			case oop.CMD_KILLPOS:
				idx = oop.parseCoords(b, line, idx);
			break;
			case oop.CMD_CHANGEREGION:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseKind(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseKind(b, line, idx);
			break;
			case oop.CMD_CLONE:
				idx = oop.parseCoords(b, line, idx);
			break;
			case oop.CMD_SETREGION:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseCoords(b, line, idx);
			break;
			case oop.CMD_CLEARREGION:
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_SETPROPERTY:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx)));

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_GETPROPERTY:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx)));

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx, true);
			break;
			case oop.CMD_SETTYPEINFO:
				idx = oop.parseKind(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_GETTYPEINFO:
				idx = oop.parseKind(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
			break;
			case oop.CMD_SUBSTR:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_PLAYERINPUT:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
			break;
			case oop.CMD_GETSOUND:
			case oop.CMD_READKEY:
			case oop.CMD_INT:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_STOPSOUND:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_MASTERVOLUME:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;

			case oop.CMD_DYNTEXT:
				b.push(oop.addCString(line.substring(idx)));
			break;
			case oop.CMD_DYNLINK:
				sepLoc = line.indexOf(";", idx);
				if (sepLoc == -1)
				{
					oop.postErrorMsg(b, "Bad link", 1);
					return idx;
				}

				b.push(oop.addString(line.substring(idx, sepLoc)));
				b.push(oop.addCString(line.substring(sepLoc+1)));
			break;
			case oop.CMD_DYNTEXTVAR:
				sepLoc = line.indexOf(";", idx);
				if (sepLoc == -1)
				{
					oop.postErrorMsg(b, "Bad variable name", 1);
					return idx;
				}

				b.push(oop.addString(line.substring(idx, sepLoc)));
				b.push(oop.addCString(line.substring(sepLoc+1)));
			break;
			case oop.CMD_SCROLLSTR:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
				b.push(oop.addCString(line.substring(idx)));
			break;
			case oop.CMD_SCROLLCOLOR:
				idx = oop.parseExpr(b, line, idx); // Border
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Shadow
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Background
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Text
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Center Text
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Button
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Arrow
			break;
			case oop.CMD_DUMPSE:
			case oop.CMD_SETPLAYER:
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_DUMPSEAT:
				idx = oop.parseCoords(b, line, idx);
			break;
			case oop.CMD_TEXTTOGUI:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx)));
			break;
			case oop.CMD_TEXTTOGRID:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;

			case oop.CMD_MODGUILABEL:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // GUI label

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx); // Column
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Row
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Max length
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Color
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Right-justify flag
			break;
			case oop.CMD_SETGUILABEL:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // GUI label

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx); // Expression to display
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Color
			break;
			case oop.CMD_CONFMESSAGE:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // GUI label

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx); // Expression to display

				idx = oop.findNonWSComma(line, idx);
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // "Yes" dispatch message
				idx = oop.findNonWSComma(line, nextIdx);
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // "No" dispatch message
			break;
			case oop.CMD_TEXTENTRY:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // GUI label

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx); // Label init value
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Max char count
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Color

				idx = oop.findNonWSComma(line, idx);
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // "Enter" dispatch message
				idx = oop.findNonWSComma(line, nextIdx);
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // "Cancel" dispatch message
			break;
			case oop.CMD_DRAWPEN:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // GUI label

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx); // Low value extent
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // High value extent
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Actual value
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Character to show as pen
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Color of pen (-1==label color)
			break;
			case oop.CMD_SELECTPEN:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // GUI label

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx); // Low value extent
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // High value extent
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Actual value
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Character to show as pen
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Color of pen (-1==label color)
				idx = oop.findNonWSComma(line, idx);

				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // "done" Dispatch message
			break;
			case oop.CMD_DRAWBAR:
				nextIdx = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx))); // GUI label

				idx = oop.findNonWSComma(line, nextIdx);
				idx = oop.parseExpr(b, line, idx); // Low value extent
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // High value extent
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Actual value
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Color of bar (-1==label color)
			break;

			case oop.CMD_SCROLLTOVISUALS:
				idx = oop.parseExpr(b, line, idx); // Milliseconds
				idx = oop.findNonWSComma(line, idx);
				nextIdx = oop.parseDirection(b, line, idx);
				if (nextIdx == -1)
				{
					oop.postErrorMsg(b, "Bad direction", 1);
					return idx;
				}
				else
					idx = nextIdx;
			break;
			case oop.CMD_FOREACH:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_FORMASK:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);

				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				nextIdx = oop.findNonKW(line, idx);
				b.push(oop.addString(line.substring(idx, nextIdx)));
				idx = nextIdx;
			break;
			case oop.CMD_FORREGION:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;

			case oop.CMD_PUSHARRAY:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_POPARRAY:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_SETARRAY:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_LEN:
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;

			case oop.CMD_SWITCHTYPE:
				// Awkward malformed line continuations are removed
				line = utils.replaceAll(line, "\\n", "");

				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);

				sepLoc = b.length;
				b.push(0); // Label count
				while (idx < line.length)
				{
					idx = oop.parseKind(b, line, idx); // Kind
					idx = oop.findNonWSComma(line, idx);
					nextIdx = oop.findNonKW(line, idx);
					if (nextIdx <= idx)
					{
						//oop.postErrorMsg(b, "Bad SWITCHTYPE label", 1);
						//break;
						b.push(oop.addString("Bad SWITCHTYPE label"));
					}
					else
						b.push(oop.addString(line.substring(idx, nextIdx))); // Label

					idx = oop.findNonWSComma(line, nextIdx);
					b[sepLoc] = b[sepLoc] + 1;
				}
			break;
			case oop.CMD_SWITCHVALUE:
				// Awkward malformed line continuations are removed
				line = utils.replaceAll(line, "\\n", "");

				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);

				sepLoc = b.length;
				b.push(0); // Label count
				while (idx < line.length)
				{
					idx = oop.parseExprValue(b, line, idx); // Expression value
					idx = oop.findNonWSComma(line, idx);
					nextIdx = oop.findNonKW(line, idx);
					if (nextIdx <= idx)
					{
						//oop.postErrorMsg(b, "Bad SWITCHVALUE label", 1);
						//break;
						b.push(oop.addString("Bad SWITCHVALUE label"));
					}
					else
						b.push(oop.addString(line.substring(idx, nextIdx))); // Label

					idx = oop.findNonWSComma(line, nextIdx);
					b[sepLoc] = b[sepLoc] + 1;
				}
			break;
			case oop.CMD_EXECCOMMAND:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;

			case oop.CMD_DRAWCHAR:
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_ERASECHAR:
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_DRAWGUICHAR:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_ERASEGUICHAR:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_GHOST:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;

			case oop.CMD_GROUPSETPOS:
			case oop.CMD_GROUPGO:
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_GROUPTRY:
			case oop.CMD_GROUPTRYNOPUSH:
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);

				// False condition jump-over
				b.push(oop.CMD_FALSEJUMP);
				falseJumpLoc = b.length;
				b.push(0);

				idx = oop.findNonWSComma(line, idx);
				if (idx < line.length)
					idx = oop.parseCommand(b, line, idx);
				else
					b.push(oop.CMD_NOP);

				// Set the successful move jump-over location.
				b[falseJumpLoc] = b.length;
			break;

			case oop.CMD_ATAN2:
				idx = oop.parseCoords(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
			break;
			case oop.CMD_SMOOTHTEST:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_SMOOTHMOVE:
				idx = oop.parseExpr(b, line, idx);
			break;

			case oop.CMD_READMOUSE:
			break;

			case oop.CMD_SETCONFIGVAR:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_GETCONFIGVAR:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx, true);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_DELCONFIGVAR:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_DELCONFIGHIVE:
				idx = oop.parseExpr(b, line, idx);
				idx = oop.findNonWS(line, idx);
			break;
			case oop.CMD_SYSTEMACTION:
				if (idx == line.length)
				{
					b[b.length - 1] = oop.CMD_SEND;
					b.push(oop.addString("SYSTEMACTION"));
				}
				else
					idx = oop.parseExpr(b, line, idx);
			break;

			case oop.CMD_SCANLINES:
			case oop.CMD_BIT7ATTR:
				idx = oop.parseExpr(b, line, idx);
			break;
			case oop.CMD_FADETOCOLOR:
			case oop.CMD_PALETTECOLOR:
				idx = oop.parseExpr(b, line, idx); // Palette Index / Milliseconds
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Red
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Green
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Blue
			break;
			case oop.CMD_PALETTEBLOCK:
				idx = oop.parseExpr(b, line, idx); // Start index
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Number of indexes
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Extent
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Mask/Lump string or array name
			break;
			case oop.CMD_FADETOBLOCK:
				idx = oop.parseExpr(b, line, idx); // Milliseconds
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Start index
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Number of indexes
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Extent
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Mask/Lump string or array name
			break;
			case oop.CMD_CHARSELECT:
				idx = oop.parseExpr(b, line, idx); // Mask/Lump string or array name
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Cell X Size
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Cell Y Size
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Cells Across
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Cells Down
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Starting character index
			break;

			case oop.CMD_POSTHS:
				idx = oop.parseExpr(b, line, idx); // Text line expression
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Filename expression
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Sort key expression
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Sort order expression
			break;
			case oop.CMD_GETHS:
				idx = oop.parseExpr(b, line, idx); // Filename expression
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Sort key expression
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Sort order expression
			break;
			case oop.CMD_GETHSENTRY:
				idx = oop.parseExpr(b, line, idx, true); // LValue that receives entry
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Line number expression
				idx = oop.findNonWSComma(line, idx);
				idx = oop.parseExpr(b, line, idx); // Index number expression
			break;
		}
	}

	return idx;
};

static parseCoords(b, line, idx) {
	var c1 = line.charAt(idx);
	if (c1 == "[")
	{
		// "Polar" relative coordinates
		b.push(oop.SPEC_POLAR);
		idx = oop.parseExpr(b, line, ++idx);

		idx = oop.findNonWS(line, idx);
		if (line.charAt(idx) == ",")
		{
			idx = oop.findNonWS(line, ++idx);
			//postErrorMsg(b, "Expected:  comma (for polar coordinates)");
			//return idx;
		}

		idx = oop.parseExpr(b, line, idx);
		idx = oop.findNonWS(line, idx);
		if (line.charAt(idx) == "]")
		{
			idx++;
			//postErrorMsg(b, "Expected:  ]");
			//return idx;
		}

		return idx;
	}
	else if (c1 == "+" || c1 == "-")
	{
		// Relative coordinates
		if (c1 == "+")
			b.push(oop.SPEC_ADD);
		else
			b.push(oop.SPEC_SUB);

		idx = oop.parseExpr(b, line, ++idx);
		idx = oop.findNonWS(line, idx);
		if (line.charAt(idx) == ",")
		{
			idx = oop.findNonWS(line, ++idx);
			//postErrorMsg(b, "Expected:  comma (for relative coordinates)");
			//return idx;
		}

		c1 = line.charAt(idx++);
		if (c1 == "+")
			b.push(oop.SPEC_ADD);
		else if (c1 == "-")
			b.push(oop.SPEC_SUB);
		else
		{
			b.push(oop.SPEC_ADD);
			idx--;
			//postErrorMsg(b, "Expected:  +/-");
			//return idx;
		}

		idx = oop.findNonWS(line, idx);
		idx = oop.parseExpr(b, line, idx);

		return idx;
	}
	else
	{
		// Absolute coordinates
		b.push(oop.SPEC_ABS);
		idx = oop.parseExpr(b, line, idx);
		idx = oop.findNonWS(line, idx);
		if (line.charAt(idx) == ",")
		{
			idx = oop.findNonWS(line, ++idx);
			//postErrorMsg(b, "Expected:  comma (for absolute coordinates)");
			//return idx;
		}

		idx = oop.parseExpr(b, line, idx);
		return idx;
	}
};

static parseKind(b, line, idx) {
	if (idx >= line.length)
	{
		// Strange parsing case causes lack of kind to translate into BOARDEDGE.
		b.push(oop.SPEC_KINDNORM);
		b.push(1);
		b.push(oop.SPEC_KWARGEND);
		return idx;
	}

	// Skip '#' if present
	if (line.charAt(idx) == '#')
		idx++;

	// Check if kind is a special representation
	var sType = oop.findMatching(line.substr(idx), oop.miscKeywords_1);
	if (sType+1 == oop.MISC_ALL || sType+1 == oop.MISC_CLONE)
	{
		// Enter:  special representation
		b.push(oop.SPEC_KINDMISC);
		b.push(sType+1);

		idx = oop.findNonKW(line, idx);
		return idx;
	}

	// Find color qualifier, if one exists
	var cType = oop.findMatching(line.substr(idx), oop.colors_1);
	if (cType != -1)
	{
		if (oop.oopType != -3)
			cType += 9;
		idx = oop.findNonKW(line, idx);
		idx = oop.findNonWS(line, idx);
	}

	// Check if kind is present
	var kType = oop.findMatching(line.substr(idx), oop.kinds);
	if (kType != -1)
	{
		// Kind is a well-known type.
		if (kType > 19)
			kType--; // LAVA type is same as WATER type
		if (kType >= 46)
			kType++; // Skip over missing type before FLOOR
		if (kType >= 52)
			kType += 7; // Skip over missing types before ROTON
		if (kType >= 65)
			kType += 8; // Skip over missing types before _TEXTBLUE
		if (kType == 80)
			kType = 253; // This is the _WINDTUNNEL type

		// Enter:  normal kind
		b.push(oop.SPEC_KINDNORM);
		b.push(kType);
		idx = oop.findNonKW(line, idx);
	}
	else
	{
		kType = oop.findMatching(line.substr(idx), zzt.extraKindNames);
		if (kType != -1)
		{
			// Enter:  normal kind
			b.push(oop.SPEC_KINDNORM);
			b.push(zzt.extraKindNumbers[kType]);
			idx = oop.findNonKW(line, idx);
		}
		else if (idx >= line.length)
		{
			// Strange "color only" parsing case causes lack of kind to translate
			// into colored BOARDEDGE.
			b.push(oop.SPEC_KINDNORM);
			b.push(1);
		}
		else
		{
			// Enter:  expression-based type
			b.push(oop.SPEC_KINDEXPR);
			idx = oop.parseExpr(b, line, idx);
		}
	}

	// If color qualifier present, immediately enter as a kwarg
	if (cType != -1 && !(oop.oopType != -3 && kType == 0))
	{
		b.push(oop.KWARG_COLOR);
		b.push(oop.SPEC_NUMCONST); // Numeric constant
		b.push(cType);
	}

	// Handle remaining kwargs, if any
	idx = oop.findNonWS(line, idx);
	do {
		// No (more) kwargs; done
		if (idx == line.length)
			break;
		if (line.charAt(idx) != ";")
			break;

		// Identify kwarg
		var kwType = oop.findMatching(line.substr(++idx), oop.keywordArgs);
		if (kwType == -1)
		{
			b.push(oop.KWARG_X);
			oop.postErrorMsg(b, "Bad KIND keyword argument:  " + line.substr(idx-1));
			return idx;
		}

		// Handle aliases for P1, P2, and P3
		kwType++;
		if (kwType == oop.KWARG_INTELLIGENCE || kwType == oop.KWARG_SENSITIVITY ||
			kwType == oop.KWARG_PHASE)
			kwType = oop.KWARG_P1;
		else if (kwType == oop.KWARG_PERIOD || kwType == oop.KWARG_RESTINGTIME ||
			kwType == oop.KWARG_DEVIANCE || kwType == oop.KWARG_RATE)
			kwType = oop.KWARG_P2;
		else if (kwType == oop.KWARG_DESTINATION)
			kwType = oop.KWARG_P3;
		else if (kwType == oop.KWARG_BIND)
			kwType = oop.KWARG_ONAME;

		b.push(kwType);

		idx = oop.findNonKW(line, idx);
		idx = oop.findNonWS(line, idx);
		if (line.charAt(idx) != "=")
		{
			oop.postErrorMsg(b, "Expected:  =", 1);
			return idx;
		}

		// Identify kwarg value
		idx = oop.parseExpr(b, line, ++idx);
	} while (idx < line.length);

	// End of kwargs
	b.push(oop.SPEC_KWARGEND);
	return idx;
};

static parseDirection(b, line, idx, allowExpr=true) {
	// Find direction keyword
	var dType;
	var expectCoords = false;
	oop.lastDirType = -1;

	do {
		dType = oop.findMatching(line.substr(idx), oop.directions_1);
		if (dType != -1)
		{
			// Direction keyword found
			dType++;
			if (dType <= 10 && (dType & 1) == 0)
				dType--; // NORTH -> N, SOUTH -> S, etc.
			b.push(dType);
			oop.lastDirType = dType;

			idx = oop.findNonKW(line, idx);
			if (dType > oop.DIR_RND)
				idx = oop.findNonWS(line, idx);

			if (dType == oop.DIR_TOWARDS)
				expectCoords = true;
		}
		else if (!allowExpr)
		{
			// Already checked expression types; take ONLY direction keywords.
			return -1;
		}
		else if (line.charAt(idx) == "." || line.charAt(idx) == '(')
		{
			// See if this is a local var or expression
			b.push(oop.SPEC_EXPRPRESENT);
			idx = oop.parseExpr(b, line, idx);
		}
		else
		{
			// Did not find anything conforming to a direction.
			// This is not actually considered an error, because
			// where a direction might exist, it could be optional.
			return -1;
		}

		// If direction was a prefix, we need to read another.
	} while ((dType >= oop.DIR_CW && dType <= oop.DIR_OPP) || dType >= oop.DIR_MAJOR)

	if (expectCoords)
		return (oop.parseCoords(b, line, idx));

	return idx;
};

static parseDirAndLength(b, line, idx) {
	// Direction must be present.
	var goStart = b.length - 1;
	idx = oop.parseDirection(b, line, idx);
	if (idx == -1)
	{
		oop.postErrorMsg(b, "Bad direction", 1);
		return idx;
	}
	var goEnd = b.length;

	idx = oop.findNonWS(line, idx);
	if (idx < line.length)
	{
		if (oop.isNumeric(line, idx) && oop.oopType != -1)
		{
			var eLoc = oop.findNonKW(line, idx);
			var repCount = utils.int(line.substring(idx, eLoc));
			idx = oop.findNonWS(line, eLoc);

			// Repeat last operation.
			while (--repCount > 0)
			{
				var unitSlice = b.slice(goStart, goEnd);
				for (var i = 0; i < unitSlice.length; i++)
					b.push(unitSlice[i]);
			}
		}
	}

	return idx;
};

static parseDirAndAction(b, line, idx) {
	// Direction must be present.
	idx = oop.parseDirection(b, line, idx);
	if (idx == -1)
	{
		oop.postErrorMsg(b, "Bad direction", 1);
		return idx;
	}

	// Successful move condition jump-over
	b.push(oop.CMD_FALSEJUMP);
	var falseJumpLoc = b.length;
	b.push(0);

	idx = oop.findNonWS(line, idx);
	if (idx < line.length)
	{
		idx = oop.parseCommand(b, line, idx);
	}
	else
	{
		b.push(oop.CMD_NOP);
	}

	// Set the successful move jump-over location.
	b[falseJumpLoc] = b.length;

	return idx;
};

static parseExpr(b, line, idx, lValue=false) {
	// Error if rest of line is empty
	if (idx >= line.length)
	{
		oop.postErrorMsg(b, "Expected:  Expression");
		return idx;
	}

	// See if expression operator present
	if (line.charAt(idx) != "(")
		return (oop.parseExprValue(b, line, idx, lValue)); // No expression; just one value

	// Parse expression values
	idx++;
	var moreVals = true;
	b.push(oop.SPEC_EXPRPRESENT); // Expression present
	while (moreVals) {
		// Value
		idx = oop.findNonWS(line, idx);
		idx = oop.parseExprValue(b, line, idx);
		if (idx == -1)
			return -1; // Error

		// Operator
		idx = oop.findNonWS(line, idx);
		var c = line.charAt(idx);
		if (c == ']')
		{
			idx = oop.findNonWS(line, idx+1);
			c = line.charAt(idx);
		}
		if (c == ')')
		{
			b.push(oop.SPEC_EXPREND);
			moreVals = false;
		}
		else
		{
			var op = oop.opChars.indexOf(c);
			if (op == -1)
			{
				b.push(oop.OP_ADD);
				oop.postErrorMsg(b, "Expected:  operator or ')'");
				return idx;
			}
			else
			{
				op++;
				if ((op == oop.OP_GRE || op == oop.OP_LES) && idx + 1 < line.length)
				{
					if (line.charAt(idx+1) == '=')
					{
						op += (oop.OP_GOE - oop.OP_GRE);
						idx++;
					}
				}
				else if ((op == oop.OP_NEQ || op == oop.OP_EQU) && idx + 1 < line.length)
				{
					if (line.charAt(idx+1) == '=')
						idx++;
				}

				b.push(op);
			}
		}

		idx = oop.findNonWS(line, ++idx);
	}

	return idx;
};

static parseExprValue(b, line, idx, lValue=false) {
	// An expression value can be one of the following:
	// 1) Numeric constant
	// 2) String constant
	// 3) Local variable name
	// 4) Global variable name
	// 5) Kind (numeric constant)
	// 6) Color (numeric constant)
	// 7) Direction

	var eLoc;
	if (line.length == idx)
	{
		oop.postErrorMsg(b, "Expected:  value");
		return idx;
	}
	else if (oop.isNumeric(line, idx) || line.charAt(idx) == '-')
	{
		if (lValue)
		{
			oop.postErrorMsg(b, "LValue required");
			return line.length;
		}

		// Numeric constant
		if (line.charAt(idx) == '-')
			eLoc = oop.findNonKW(line, idx+1);
		else
			eLoc = oop.findNonKW(line, idx);

		b.push(oop.SPEC_NUMCONST);
		b.push(utils.int(line.substring(idx, eLoc)));
		idx = oop.findNonWS(line, eLoc);
	}
	else if (oop.oopType != -3)
	{
		// ZZT or Super ZZT expression henceforth can only be global variable name
		eLoc = oop.findNonKWDynamic(line, idx);
		b.push(oop.SPEC_GLOBALVAR);
		b.push(oop.addString(line.substring(idx, eLoc)));
		idx = oop.findNonWS(line, eLoc);
	}
	else if (line.charAt(idx) == "\"")
	{
		if (lValue)
		{
			postErrorMsg(b, "LValue required");
			return line.length;
		}

		// String constant
		eLoc = line.indexOf("\"", idx+1)
		if (!eLoc)
			oop.postErrorMsg(b, "Bad string constant");
		else
		{
			b.push(oop.SPEC_STRCONST);
			b.push(oop.addCString(line.substring(idx+1, eLoc)));
			idx = oop.findNonWS(line, eLoc+1);
		}
	}
	else if (line.charAt(idx) == ".")
	{
		// Local variable
		eLoc = oop.findNonKW(line, idx+1);
		b.push(oop.SPEC_LOCALVAR);
		b.push(oop.addString(line.substring(idx+1, eLoc)));
		idx = oop.findNonWS(line, eLoc);
	}
	else if (line.charAt(idx) == "~")
	{
		// Property
		eLoc = oop.findNonKW(line, idx+1);
		b.push(oop.SPEC_PROPERTY);
		b.push(oop.addString(line.substring(idx+1, eLoc)));
		idx = oop.findNonWS(line, eLoc);
	}
	else if (lValue)
	{
		// Word can only be L-Value by this point (global variable name)
		eLoc = oop.findNonKWDynamic(line, idx);
		b.push(oop.SPEC_GLOBALVAR);
		b.push(oop.addString(line.substring(idx, eLoc)));
		idx = oop.findNonWS(line, eLoc);
	}
	else if (oop.findMatching(line.substr(idx), ["SELF"]) != -1 && oop.oopType == -3)
	{
		if (lValue)
		{
			oop.postErrorMsg(b, "Expected:  LValue");
			return line.length;
		}

		// "Self" object pointer
		b.push(oop.SPEC_SELF);
		b.push(0);
		idx = oop.findNonWS(line, idx + 4);
	}
	else
	{
		// Check if kind is present
		var kType = oop.findMatching(line.substr(idx), oop.kinds);
		var cType = oop.findMatching(line.substr(idx), oop.colors_1);
		var kType2 = oop.findMatching(line.substr(idx), zzt.extraKindNames);
		if (kType != -1)
		{
			// Kind is a well-known type.
			if (kType > 19)
				kType--; // LAVA type is same as WATER type
			if (kType >= 46)
				kType++; // Skip over missing type before FLOOR
			if (kType >= 52)
				kType += 7; // Skip over missing types before ROTON
			if (kType >= 65)
				kType += 8; // Skip over missing types before _TEXTBLUE
			if (kType == 80)
				kType = 253; // This is the _WINDTUNNEL type

			// Acts as a numeric constant; translation needed later
			b.push(oop.SPEC_KINDCONST);
			b.push(kType);
			idx = oop.findNonKW(line, idx);
			idx = oop.findNonWS(line, idx);
		}
		else if (kType2 != -1)
		{
			// Enter:  extra kind
			b.push(oop.SPEC_KINDCONST);
			b.push(zzt.extraKindNumbers[kType2]);
			idx = oop.findNonKW(line, idx);
			idx = oop.findNonWS(line, idx);
		}
		else if (cType != -1)
		{
			// Acts as a numeric constant
			b.push(oop.SPEC_NUMCONST);
			b.push(cType);
			idx = oop.findNonKW(line, idx);
			idx = oop.findNonWS(line, idx);
		}
		else
		{
			// Direction?
			b.push(oop.SPEC_DIRCONST);
			var dIdx = oop.parseDirection(b, line, idx, false);
			if (dIdx == -1)
			{
				// Global variable name or miscellaneous member
				b[b.length-1] = oop.SPEC_GLOBALVAR;
				eLoc = oop.findNonKWDynamic(line, idx);
				b.push(oop.addString(line.substring(idx, eLoc)));
				idx = oop.findNonWS(line, eLoc);
			}
			else
			{
				// Direction:  Yes
				idx = oop.findNonWS(line, dIdx);
			}
		}
	}

	return idx;
};

static getCommandStr(cByte) {
	// Reverse-engineer the compiled command opcode.
	if (cByte == 0)
		return "ERROR: ";

	if (cByte >= oop.CMD_FALSEJUMP && cByte <= oop.CMD_NAME)
		return (oop.nonSpelledCommandStr[cByte - oop.CMD_FALSEJUMP]);

	if (cByte > 0 && cByte <= oop.commands_x.length)
		return (oop.commands_x[cByte]);

	return "Unknown: " + cByte.toString();
};

static getColorStr(cByte) {
	// Reverse-engineer color constants.
	if (cByte < 0 || cByte >= 16)
		return cByte.toString();

	return oop.colors_x[cByte];
};

static getInventoryStr(cByte) {
	// Reverse-engineer inventory constants.
	if (cByte <= 0 || cByte > oop.inventory_x.length)
		return "NONE";

	return oop.inventory_x[cByte-1];
};

static getConditionStr(cByte) {
	// Reverse-engineer condition constants.
	if (cByte > 0 && cByte <= oop.flagEvals_x.length)
		return oop.flagEvals_x[cByte-1];

	return "";
};

static getDirStr(cByte) {
	// Reverse-engineer direction constants.
	if (cByte > 0 && cByte <= oop.directions_x.length)
		return oop.directions_x[cByte-1];

	return "";
};

static getKwargTypeStr(cByte) {
	// Reverse-engineer keyword argument constants.
	if (cByte > 0 && cByte <= oop.keywordArgs.length)
		return oop.keywordArgs[cByte-1];

	return "";
};

static getOpStr(cByte) {
	// Reverse-engineer keyword argument constants.
	if (cByte > 0 && cByte <= oop.opLookupStr.length)
		return oop.opLookupStr[cByte-1];

	if (cByte == oop.SPEC_EXPREND)
		return ")";

	return "";
};

}

oop.initClass();
