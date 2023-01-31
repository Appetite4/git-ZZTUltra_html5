"use strict";
class ZZTProp {

static initClass() {
ZZTProp.overridePropsZZT = null;
ZZTProp.overridePropsSZT = null;
ZZTProp.overridePropsGeneral = null;
ZZTProp.overridePropsGenModern = null;
ZZTProp.overridePropsGenClassic = null;

ZZTProp.defaultPropsZZT = {
	"GEMHEALTH" : 1,
	"MAXSTATELEMENTCOUNT" : 151,
	"CLASSICFLAGLIMIT" : 10,
	"NOPUTBOTTOMROW" : 1,
	"BECOMESAMECOLOR" : 0,
	"LIBERALCOLORCHANGE" : 0,
	"LEGACYTICK" : 1,
	"LEGACYCAMERA" : 0,
	"FREESCOLLING" : 0,
	"SENDALLENTER" : 0
};
ZZTProp.defaultPropsSZT = {
	"GEMHEALTH" : 10,
	"MAXSTATELEMENTCOUNT" : 129,
	"CLASSICFLAGLIMIT" : 16,
	"NOPUTBOTTOMROW" : 0,
	"BECOMESAMECOLOR" : 1,
	"LIBERALCOLORCHANGE" : 1,
	"LEGACYTICK" : 1,
	"LEGACYCAMERA" : 1,
	"FREESCOLLING" : 1,
	"SENDALLENTER" : 1
};
ZZTProp.defaultPropsWAD = {
	"GEMHEALTH" : 10,
	"MAXSTATELEMENTCOUNT" : 9999,
	"CLASSICFLAGLIMIT" : 100000,
	"NOPUTBOTTOMROW" : 0,
	"BECOMESAMECOLOR" : 0,
	"LIBERALCOLORCHANGE" : 0,
	"LEGACYTICK" : 0,
	"LEGACYCAMERA" : 0,
	"FREESCOLLING" : 0,
	"SENDALLENTER" : 0,
	"KEY0" : 0, "KEY1" : 0, "KEY2" : 0, "KEY3" : 0,
	"KEY4" : 0, "KEY5" : 0, "KEY6" : 0, "KEY7" : 0,
	"KEY8" : 0, "KEY9" : 0, "KEY10" : 0, "KEY11" : 0,
	"KEY12" : 0, "KEY13" : 0, "KEY14" : 0, "KEY15" : 0
};
ZZTProp.defaultPropsGeneral = {
	"CONFIGTYPE" : 0,
	"GAMESPEED" : 4,
	"FASTESTFPS" : 30,
	"PLAYERDAMAGE" : 10,
	"SOUNDOFF" : 0,
	"IMMEDIATESCROLL" : 0,
	"ORIGINALSCROLL" : 0,
	"OVERLAYSCROLL" : 1,
	"SCRCOLBORDER" : 15,
	"SCRCOLSHADOW" : 0,
	"SCRCOLBG" : 1,
	"SCRCOLTEXT" : 14,
	"SCRCOLCENTERTEXT" : 15,
	"SCRCOLBUTTON" : 13,
	"SCRCOLARROW" : 12,
	"KEYLIMIT" : 1,
	"KEYSBLOCKPLAYER" : 1,
	"POINTBLANKFIRING" : 1,
	"BLINKWALLBUMP" : 0,
	"TELOBJECT" : 0,
	"DETECTSCRIPTDEADLOCK" : 1,
	"OBJMAGICNUMBER" : 32,
	"PLAYRETENTION" : 1,
	"PLAYREVERB" : 1,
	"PLAYSYNC" : 1,
	"PLAYERRUNDELAY" : 8,
	"PLAYERFIREDELAY" : 8,
	"BLACKKEYGEMS" : 0,
	"BLACKDOORGEMS" : 0,
	"ALLCOLORKEYS" : 0,
	"MOUSEBEHAVIOR" : 3,
	"OBJECTDIEEMPTY" : 1,
	"REENTRYMOVESTYPE" : 0,
	"SCORELIMIT" : 2000000000,
	"BIT7ATTR" : 1,
	"SCANLINES" : 2,
	"BQUESTHACK" : 0,
	"ZSTONELABEL" : "Stone",
	"OLDTORCHBAR" : 0,
	"HIGHSCOREACTIVE" : 1,
	"HIGHSCOREMIN" : 100,
	"HIGHSCOREPROMPT" : 1,
	"MASTERVOLUME" : 50,
	"PLAYERCHARNORM" : 2,
	"PLAYERCOLORNORM" : 31,
	"PLAYERCHARHURT" : 1,
	"PLAYERCOLORHURT" : 127,
	"PAUSEANIMATED" : 1,
	"SITELOADCHOICE" : 3,
	"WATERSOUND" : 1,
	"WATERMSG" : 1,
	"INVISIBLESOUND" : 1,
	"INVISIBLEMSG" : 1,
	"FORESTSOUND" : 1,
	"FORESTMSG" : 1,
	"DUPSOUNDDIST" : 1000,
	"FAKEMSG" : 1,
	"MOUSEEDGENAV" : 1,
	"MOUSEEDGEPOINTER" : 1,
	"BOARDEDGETRANS" : 1,
	"ALLOWINGAMERESTORE" : 1,
	"ALLOWINGAMECONSOLE" : 1,
	"ALLOWINGAMECHEAT" : 1,
	"FASTCHEATFLAG" : 0,
	"INVENTORYFLAG" : "I",
	"EXTRAINVTIMEOUT" : 45,
	"ZZTGAMEGUI" : "ZZTGAME",
	"SZTGAMEGUI" : "SZTGAME",

	"VERSION" : "1.3",

	"AUTOSAVESECS" : 60,
	"BOARDCHANGESAVESECS" : 20,
	"REENTRYZAPSAVESECS" : 10,
	"MAXSAVESTATES" : 30,

	"DEP_INDEXPATH" : "",
	"DEP_RECURSIVELEVEL" : 0,
	"DEP_INDEXRESOURCE" : "",
	"DEP_AUTORUNZIP" : 0,
	"DEP_STARTUPFILE" : "",
	"DEP_STARTUPGUI" : "DEBUGMENU",
	"DEP_EXTRAFILTER" : "",

	"PUTREMOVESTILE" : 1
};

ZZTProp.classicPropChanges = {
	"ORIGINALSCROLL" : 1,
	"OVERLAYSCROLL" : 0,
	"PLAYRETENTION" : 0,
	"PLAYREVERB" : 0,
	"BLACKKEYGEMS" : 1,
	"BLACKDOORGEMS" : 1,
	"REENTRYMOVESTYPE" : 1,
	"SCORELIMIT" : 32767,
	"OLDTORCHBAR" : 1,
	"BOARDEDGETRANS" : 2,
	"ALLOWINGAMERESTORE" : 1,
	"ALLOWINGAMECONSOLE" : 0,
	"ZZTGAMEGUI" : "CLASSICZZTGAME",
	"SZTGAMEGUI" : "CLASSICSZTGAME"
};
ZZTProp.propDesc = {
	"GEMHEALTH" : "Health received per gem pickup.",
	"MAXSTATELEMENTCOUNT" : "Max number of status element objects per board.",
	"CLASSICFLAGLIMIT" : "Global flag count limit for legacy worlds.",
	"NOPUTBOTTOMROW" : "Whether #PUT is clipped against row 25.",
	"BECOMESAMECOLOR" : "Whether #BECOME-to-UNDERID-type should match object's color.",
	"LIBERALCOLORCHANGE" : "Whether #CHANGE checks first 3 bits of color, or all 4.",
	"LEGACYTICK" : "Whether legacy master tick modulo of 420 used to queue SE cycle times.",
	"LEGACYCAMERA" : "Whether legacy Super ZZT edge scrolling bounds are used.",
	"OBJMAGICNUMBER" : "Max number of 'own-code' legacy commands per turn.",
	"FREESCOLLING" : "Re-centers player within viewport after each move.",
	"SENDALLENTER" : "Invokes #SEND ALL:ENTER whenever the board is changed.",

	"CONFIGTYPE" : "Configuration type:  0=Modern, 1=Classic.",
	"GAMESPEED" : "Game speed setting:  0=Fastest, 4=Default, 8=Slowest.",
	"FASTESTFPS" : "Virtual Hz for fastest game speed.",
	"PLAYERDAMAGE" : "Base player damage per hit.",
	"SOUNDOFF" : "Sound on/off setting.",
	"IMMEDIATESCROLL" : "If 1, scroll interface shown immediately without open delay.",
	"ORIGINALSCROLL" : "If 1, scroll interface opens only vertically.",
	"OVERLAYSCROLL" : "If 1, modern scroll overlay with drop-shadow used.",
	"SCRCOLBORDER" : "Scroll interface border color (see #SCROLLCOLOR).",
	"SCRCOLSHADOW" : "Scroll interface shadow color (see #SCROLLCOLOR).",
	"SCRCOLBG" : "Scroll interface background color (see #SCROLLCOLOR).",
	"SCRCOLTEXT" : "Scroll interface main text color (see #SCROLLCOLOR).",
	"SCRCOLCENTERTEXT" : "Scroll interface center text color (see #SCROLLCOLOR).",
	"SCRCOLBUTTON" : "Scroll interface button color (see #SCROLLCOLOR).",
	"SCRCOLARROW" : "Scroll interface arrow color (see #SCROLLCOLOR).",
	"KEYLIMIT" : "Max keys player can carry for any one key color.",
	"KEYSBLOCKPLAYER" : "Whether keys stop player from moving if can't pick up.",
	"POINTBLANKFIRING" : "If 1, SHOT messages work at point-blank range of OBJECT.",
	"BLINKWALLBUMP" : "If 1, legacy instant-death blink wall bump behavior used.",
	"TELOBJECT" : "If 1, allows OBJECT -> TRANSPORTER interaction with move commands.",
	"DETECTSCRIPTDEADLOCK" : "Catches script infinite loop condition.",
	"PLAYRETENTION" : "If 1, prepends 'Z01@' to #PLAY strings.",
	"PLAYREVERB" : "If 1, prepends 'K40:0.3:' to #PLAY strings.",
	"PLAYSYNC" : "If 1, prevents #PLAY gaps for an OBJECT dedicated to #PLAY.",
	"PLAYERRUNDELAY" : "Frame time delay before held-key rapid run is logged.",
	"PLAYERFIREDELAY" : "Frame time delay before held-key rapid fire is logged.",
	"BLACKKEYGEMS" : "If 1, gives 256 gems upon black key pickup.",
	"BLACKDOORGEMS" : "If 1, takes 256 gems upon black door open.",
	"ALLCOLORKEYS" : "If 1, treats all 16 key colors as unique key inventory slots.",
	"MOUSEBEHAVIOR" : "0=Custom mouse handler, 1-3=Click-to-move mouse handlers.",
	"OBJECTDIEEMPTY" : "If 1, OBJECT leaves behind WHITE EMPTY after #DIE.",
	"REENTRYMOVESTYPE" : "If 1, buggy floor pickup occurs with passage navigation.",
	"SCORELIMIT" : "Highest possible score.",
	"BIT7ATTR" : "Setting from #BIT7ATTR command.",
	"SCANLINES" : "Setting from #SCANLINES command.",
	"BQUESTHACK" : "If 1, Banana Quest hack rules apply.",
	"ZSTONELABEL" : "Super ZZT text used to identify the Z inventory property.",
	"OLDTORCHBAR" : "If 1, legacy torch progress bar used.",
	"HIGHSCOREACTIVE" : "If 1, high scores are postable for the world.",
	"HIGHSCOREMIN" : "Only post a high score when SCORE is at least this high.",
	"HIGHSCOREPROMPT" : "High score prompt:  0=Never, 1=Any end, 2=Game over.",
	"MASTERVOLUME" : "Starting volume for all sound channels.",
	"PLAYERCHARNORM" : "Player's normal character.",
	"PLAYERCOLORNORM" : "Player's normal color.",
	"PLAYERCHARHURT" : "Player's hurt character.",
	"PLAYERCOLORHURT" : "Player's hurt color.",
	"PAUSEANIMATED" : "If 1, PLAYER will flash during a paused state.",
	"SITELOADCHOICE" : "World data source load options for #LOADWORLD 0.",
	"WATERSOUND" : "Whether water contact sound is played.",
	"WATERMSG" : "Whether water contact message is shown.",
	"INVISIBLESOUND" : "Whether invisible wall contact sound is played.",
	"INVISIBLEMSG" : "Whether invisible wall contact message is shown.",
	"FORESTSOUND" : "Whether forest contact sound is played.",
	"FORESTMSG" : "Whether forest contact message is shown.",
	"DUPSOUNDDIST" : "Max squares away from DUPLICATOR sounds can be heard.",
	"FAKEMSG" : "Whether fake wall contact message is shown.",
	"MOUSEEDGENAV" : "Click-to-move edge fraction:  0=None, 1=Half, 2=All.",
	"MOUSEEDGEPOINTER" : "Whether click-to-move mouse-over edge arrow is shown.",
	"BOARDEDGETRANS" : "BOARDEDGE transition:  0=Scroll, 1=Edge Scroll, 2=Dissolve.",
	"ALLOWINGAMERESTORE" : "If 1, in-game savegame restoration available.",
	"ALLOWINGAMECONSOLE" : "If 1, in-game console available.",
	"ALLOWINGAMECHEAT" : "If 1, in-game cheat box available.",
	"FASTCHEATFLAG" : "If 1, cheat box flag set possible without '+' prefix.",
	"INVENTORYFLAG" : "Flag name set when 'I' key pressed in game.",
	"EXTRAINVTIMEOUT" : "Tick timeout for 'extra' inventory label.",
	"ZZTGAMEGUI" : "Main game GUI for ZZT files.",
	"SZTGAMEGUI" : "Main game GUI for SZT files.",

	"VERSION" : "Current version of ZZT Ultra.",

	"AUTOSAVESECS" : "Number of seconds between time-based autosaves.",
	"BOARDCHANGESAVESECS" : "Number of seconds between board-change-based autosaves.",
	"REENTRYZAPSAVESECS" : "Number of seconds between zapped-restart autosaves.",
	"MAXSAVESTATES" : "Max number of save states remembered per game session.",

	"DEP_AUTORUNZIP" : "If 1, simple ZIP files start play immediately.",
	"DEP_EXTRAFILTER" : "File filter pattern for #LOADWORLD 0."
};

ZZTProp.propSubsets = {
	"DISPLAY" : ["BIT7ATTR", "SCANLINES", "SZTGAMEGUI", "ZZTGAMEGUI", "OLDTORCHBAR",
		"PLAYERCHARNORM", "PLAYERCOLORNORM", "PLAYERCHARHURT", "PLAYERCOLORHURT",
		"PAUSEANIMATED", "SITELOADCHOICE", "ZSTONELABEL"],
	"GAMEPLAY" : ["ALLOWINGAMECHEAT", "ALLOWINGAMECONSOLE", "ALLOWINGAMERESTORE",
		"BLINKWALLBUMP", "FASTCHEATFLAG", "INVENTORYFLAG",
		"PLAYERDAMAGE", "POINTBLANKFIRING", "SCORELIMIT",
		"OBJECTDIEEMPTY", "HIGHSCOREACTIVE", "HIGHSCOREMIN", "HIGHSCOREPROMPT",
		"TELOBJECT", "BQUESTHACK"],
	"KEY" : ["ALLCOLORKEYS", "BLACKDOORGEMS", "BLACKKEYGEMS", "KEYLIMIT", "KEYSBLOCKPLAYER"],
	"MOVE" : ["BOARDEDGETRANS", "MOUSEBEHAVIOR", "MOUSEEDGENAV", "MOUSEEDGEPOINTER",
		"PLAYERFIREDELAY", "PLAYERRUNDELAY", "REENTRYMOVESTYPE"],
	"TIMING" : ["GAMESPEED", "FASTESTFPS", "OBJMAGICNUMBER", "DETECTSCRIPTDEADLOCK",
		"EXTRAINVTIMEOUT", "AUTOSAVESECS", "BOARDCHANGESAVESECS", "REENTRYZAPSAVESECS",
		"MAXSAVESTATES"],
	"SOUND" : ["PLAYRETENTION", "PLAYREVERB", "PLAYSYNC", "SOUNDOFF",
		"FAKEMSG", "DUPSOUNDDIST", "INVISIBLEMSG", "INVISIBLESOUND", "WATERMSG", "WATERSOUND",
		"FORESTMSG", "FORESTSOUND", "MASTERVOLUME"],
	"SCROLL" : ["IMMEDIATESCROLL", "ORIGINALSCROLL", "OVERLAYSCROLL",
		"SCRCOLBORDER", "SCRCOLSHADOW", "SCRCOLBG",
		"SCRCOLTEXT", "SCRCOLCENTERTEXT", "SCRCOLBUTTON", "SCRCOLARROW"],

	"ZZT" : ["GEMHEALTH", "MAXSTATELEMENTCOUNT", "CLASSICFLAGLIMIT", "NOPUTBOTTOMROW",
		"BECOMESAMECOLOR", "LIBERALCOLORCHANGE", "LEGACYTICK", "LEGACYCAMERA",
		"FREESCOLLING", "SENDALLENTER"
	],
	"SZT" : ["GEMHEALTH", "MAXSTATELEMENTCOUNT", "CLASSICFLAGLIMIT", "NOPUTBOTTOMROW",
		"BECOMESAMECOLOR", "LIBERALCOLORCHANGE", "LEGACYTICK", "LEGACYCAMERA",
		"FREESCOLLING", "SENDALLENTER"
	]
};

ZZTProp.propSubsetNames = {
	"DISPLAY" : "Display",
	"GAMEPLAY" : "Gameplay",
	"KEY" : "Key Usage",
	"MOVE" : "Movement",
	"TIMING" : "Timing",
	"SOUND" : "Sound/Msg",
	"SCROLL" : "Scrolls"
};

ZZTProp.defaultSoundFx = {
	"PLAYERMOVE":		"Z00P01:@V40K0:0: T0",
	"FOREST":			"Z00P02:@V40K0:0: TA",
	"FORESTSZT0":		"Z00P03:@V40K0:0: T+F",
	"FORESTSZT1":		"Z00P03:@V40K0:0: T+C",
	"FORESTSZT2":		"Z00P03:@V40K0:0: T+G",
	"FORESTSZT3":		"Z00P03:@V40K0:0: T++C",
	"FORESTSZT4":		"Z00P03:@V40K0:0: T+F#",
	"FORESTSZT5":		"Z00P03:@V40K0:0: T+C#",
	"FORESTSZT6":		"Z00P03:@V40K0:0: T+G#",
	"FORESTSZT7":		"Z00P03:@V40K0:0: T++C#",
	"COLLECTGEM":		"Z00P04:@V40K0:0: T+C-GEC",
	"COLLECTAMMO":		"Z00P05:@V40K0:0: TCC#D",
	"COLLECTTORCH":		"Z00P06:@V40K0:0: TCASE",
	"PUSHER":			"Z00P08:@V40K0:0: T--F",
	"BREAKABLEHIT":		"Z00P09:@V40K0:0: -TC",
	"ALREADYHAVEKEY":	"Z00P10:@V40K0:0: SC-C",
	"READSCROLL":		"Z00P11:@V40K0:0: TC-C+D-D+E-E+F-F+G-G",
	"COLLECTKEY":		"Z00P12:@V40K0:0: +TCEGCEGCEGS+C",
	"OPENDOOR":			"Z00P13:@V40K0:0: TCGBCGBI+C",
	"DOORLOCKED":		"Z00P14:@V40K0:0: --TGC",
	"INVISIBLEWALL":	"Z00P15:@V40K0:0: T--DC",
	"WATERBLOCK":		"Z00P16:@V40K0:0: T+C+C",
	"DUPLICATE":		"Z00P20:@V40K0:0: SCDEFG",
	"DUPFAIL":			"Z00P21:@V40K0:0: --TG#F#",
	"BOMBTICK1":		"Z00P22:@V40K0:0: T8",
	"BOMBTICK2":		"Z00P23:@V40K0:0: T5",
	"BOMBACTIVATE":		"Z00P24:@V40K0:0: TCF+CF+C",
	"BOMBEXPLODE":		"Z00P25:@V40K0:0: T+++C-C-C-C-C-C",
	"TORCHOUT":			"Z00P26:@V40K0:0: TC-C-C",
	"PLAYERSHOOT":		"Z00P31:@V40K0:0: T+C-C-C",
	"OBJECTSHOOT":		"Z00P32:@V40K0:0: TC-F#",
	"RICOCHET":			"Z00P33:@V40K0:0: T9",
	"ENEMYDIE":			"Z00P34:@V40K0:0: TC--C++++C--C",
	"PLAYERHURT":		"Z00P35:@V40K0:0: T--C+C-C+D#",
	"TIMELOW":			"Z00P42:@V40K0:0: I.+CFC-F+CFQ.C",
	"ENERGIZER":		"Z00P43:@V40K0:0: S.-CD#EF+F-FD#C+C-CD#E+F-FD#C+C-CD#E+F-FD#C+C-CD#E+F-FD#C\
	+C-CD#E+F-FD#C+C-CD#E+F-FD#C+C-CD#E+F-FD#C+C-CD#E+F-FD#C",
	"ENERGIZEREND":		"Z00P44:@V40K0:0: S.-C-A#GF#FD#C", // interrupts ENERGIZER
	"TRANSPORTER":		"Z00P46:@V40K0:0: TC+D-E+F#-G#+A#C+D",
	"PASSAGEMOVE":		"Z00P47:@V40K0:0: TCEGC#FG#DF#AD#GA#EG#+C",
	"OOPERROR":			"Z00P48:@V40K0:0: Q.++C",
	"DOSERROR":			"Z00P49:@V40K0:0: --S22I1S44I1S00", // guess; not easy to reproduce
	"GAMEOVER":			"Z00P50:@V40K0:0: S.-CD#G+C-GA#+DGFG#+CF---HC"
};
}

// Extract overrides from core property defaults
static setOverridePropDefaults() {
	// ZZT-specific defaults
	var k;
	ZZTProp.overridePropsZZT = new Object();
	for (k in ZZTProp.defaultPropsZZT)
		ZZTProp.overridePropsZZT[k] = ZZTProp.defaultPropsZZT[k];

	// SZT-specific defaults
	ZZTProp.overridePropsSZT = new Object();
	for (k in ZZTProp.defaultPropsSZT)
		ZZTProp.overridePropsSZT[k] = ZZTProp.defaultPropsSZT[k];

	// Modern and classic general defaults
	ZZTProp.overridePropsGenModern = new Object();
	ZZTProp.overridePropsGenClassic = new Object();
	for (k in ZZTProp.defaultPropsGeneral) {
		ZZTProp.overridePropsGenModern[k] = ZZTProp.defaultPropsGeneral[k];
		ZZTProp.overridePropsGenClassic[k] = ZZTProp.defaultPropsGeneral[k];
	}

	// General defaults picked when property theme changed to classic
	for (k in ZZTProp.classicPropChanges) {
		ZZTProp.overridePropsGenClassic[k] = ZZTProp.classicPropChanges[k];
	}
}

}

ZZTProp.initClass();
