// Sounds.js:  Sound effects processing.
"use strict";

class Sounds {

static initAllSounds(builtInSoundFx=null, builtInGlobalProps=null) {
	// General constants
	Sounds.NUM_CHANNELS = 16;
	Sounds.EXTENDED_SILENCE_SIZE = 131072;
	Sounds.SAMPLE_WRITE_SIZE = 4096;
	Sounds.RELOAD_CHECK_FREQUENCY = 20;
	Sounds.CC_STOP_PREVIOUS = 0;
	Sounds.CC_WAIT_FOR_PREVIOUS = 1;
	Sounds.CC_MULTIPLE = 2;
	Sounds.CC_ONCE_ONLY = 1;
	Sounds.CC_INFINITE_LOOP = 100000;
	Sounds.EXPECTED_SR = 44100;

	// Sound constants
	Sounds.NONE = 0;
	Sounds.B7_X8 = 1;
	Sounds.G7_X13 = 2;
	Sounds.C7_X2 = 3;
	Sounds.G6_X3 = 4;
	Sounds.C6_X1 = 5;
	Sounds.G5_X3 = 6;
	Sounds.C5_X1 = 7;
	Sounds.G4_X1 = 8;
	Sounds.C4_X1 = 9;
	Sounds.G3_X1 = 10;
	Sounds.C3_X1 = 11;
	Sounds.G2_X1 = 12;
	Sounds.E2_X1 = 13;
	Sounds.C2_X1 = 14;
	Sounds.G1_X1 = 15;
	Sounds.C1_X1 = 16;
	Sounds.G0_X1 = 17;
	Sounds.C0_X1 = 18;
	Sounds.PERC_0 = 19;
	Sounds.PERC_1 = 20;
	Sounds.PERC_2 = 21;
	Sounds.PERC_3 = 0;
	Sounds.PERC_4 = 23;
	Sounds.PERC_5 = 24;
	Sounds.PERC_6 = 25;
	Sounds.PERC_7 = 26;
	Sounds.PERC_8 = 27;
	Sounds.PERC_9 = 28;

	// Sound storage array.  Format is:
	// 0:  initialized, 1:  index, 2:  equivalent frequency, 3:  stored cycles,
	// 4:  mono sample Number vector, 5:  number of samples in ByteArray,
	// 6:  filename, 7:  sampling rate.
	Sounds.sound_info = [
		[ true,  Sounds.NONE, 0.0, 1, null, null, "null.wav", 44100 ],
		[ false, Sounds.B7_X8, 3876.92307692308, 8, null, null, "b7_3951_07_x8.wav", 44100 ],
		[ false, Sounds.G7_X13, 3132.7868852459, 13, null, null, "g7_3132_79_x13.wav", 44100 ],
		[ false, Sounds.C7_X2, 2100.00, 2, null, null, "c7_2093_00_x2.wav", 44100 ],
		[ false, Sounds.G6_X3, 1575.00, 3, null, null, "g6_1575_00_x3.wav", 44100 ],
		[ false, Sounds.C6_X1, 1050.00, 2, null, null, "c6_1046_50.wav", 44100 ],
		[ false, Sounds.G5_X3, 782.84023668639, 3, null, null, "g5_782_84_x3.wav", 44100 ],
		[ false, Sounds.C5_X1, 525.00, 1, null, null, "c5_523_25.wav", 44100 ],
		[ false, Sounds.G4_X1, 390.26548672566, 1, null, null, "g4_390_27.wav", 44100 ],
		[ false, Sounds.C4_X1, 260.94674556213, 1, null, null, "c4_261_63.wav", 44100 ],
		[ false, Sounds.G3_X1, 196.00, 1, null, null, "g3_196_00.wav", 44100 ],
		[ false, Sounds.C3_X1, 130.860534124629, 1, null, null, "c3_130_81.wav", 44100 ],
		[ false, Sounds.G2_X1, 98.00, 1, null, null, "g2_98_00.wav", 44100 ],
		[ false, Sounds.E2_X1, 82.276119402985, 1, null, null, "e2_82_41.wav", 44100 ],
		[ false, Sounds.C2_X1, 65.43026706231454, 1, null, null, "c2_65_41.wav", 44100 ],
		[ false, Sounds.G1_X1, 49.00, 1, null, null, "g1_49_00.wav", 44100 ],
		[ false, Sounds.C1_X1, 32.71513353115727, 1, null, null, "c1_32_72.wav", 44100 ],
		[ false, Sounds.G0_X1, 24.5, 1, null, null, "g0_24_50.wav", 44100 ],
		[ false, Sounds.C0_X1, 16.357566765578635, 1, null, null, "c0_16_36.wav", 44100 ],
		[ false, Sounds.PERC_0, 0.0, 1, null, null, "perc_0.wav", 44100 ],
		[ false, Sounds.PERC_1, 0.0, 1, null, null, "perc_1.wav", 44100 ],
		[ false, Sounds.PERC_2, 0.0, 1, null, null, "perc_2.wav", 44100 ],
		[ true,  Sounds.PERC_3, 0.0, 1, null, null, "null.wav", 44100 ],
		[ false, Sounds.PERC_4, 0.0, 1, null, null, "perc_4.wav", 44100 ],
		[ false, Sounds.PERC_5, 0.0, 1, null, null, "perc_5.wav", 44100 ],
		[ false, Sounds.PERC_6, 0.0, 1, null, null, "perc_6.wav", 44100 ],
		[ false, Sounds.PERC_7, 0.0, 1, null, null, "perc_7.wav", 44100 ],
		[ false, Sounds.PERC_8, 0.0, 1, null, null, "perc_8.wav", 44100 ],
		[ false, Sounds.PERC_9, 0.0, 1, null, null, "perc_9.wav", 44100 ]
	];

	// Play queue and envelope management
	Sounds.fxEnvelopes = null;
	Sounds.mixBuffer = null;
	Sounds.mixLimit = 0;
	Sounds.silenceRemaining = 0;

	// Other vars
	Sounds.isInit = false;
	Sounds.reloadQueueCount = 0;
	Sounds.lastSelVoice = 0;
	Sounds.playPending = false;
	Sounds.soundFx = null;
	Sounds.globalProps = null;
	Sounds.playSyncCallback = null;
	Sounds.playEverStarted = false;

	// Establish effects containers and global properties, if provided
	if (builtInSoundFx == null)
		Sounds.soundFx = {};
	else
		Sounds.soundFx = builtInSoundFx;

	if (builtInGlobalProps == null)
	{
		Sounds.globalProps = {};
		Sounds.globalProps["PLAYRETENTION"] = 0;
		Sounds.globalProps["PLAYSYNC"] = 0;
		Sounds.globalProps["SOUNDOFF"] = 0;
	}
	else
		Sounds.globalProps = builtInGlobalProps;

	// Create sound interface
	Sounds.channels = [null];
	Sounds.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	Sounds.ctxSR = Sounds.audioCtx.sampleRate;
	FxEnvelope.adjustSR(Sounds.ctxSR);
	Sounds.gainNode = Sounds.audioCtx.createGain();
	Sounds.gainNode.gain.value = 1.0;
	Sounds.scriptNode = Sounds.audioCtx.createScriptProcessor(Sounds.SAMPLE_WRITE_SIZE, 0, 1);

	// Set up output sound channels
	Sounds.fxEnvelopes = [];
	FxEnvelope.allSoundInfo = Sounds.sound_info;
	for (var i = 0; i < Sounds.NUM_CHANNELS; i++)
		Sounds.fxEnvelopes.push(new FxEnvelope(i));

	// Create mix buffer
	Sounds.mixBuffer = [];
	for (i = 0; i < Sounds.SAMPLE_WRITE_SIZE; i++)
	{
		Sounds.mixBuffer.push(0.0);
	}

	// Hook up sound processing components
	Sounds.scriptNode.onaudioprocess = Sounds.processSound;
	Sounds.scriptNode.connect(Sounds.gainNode);
	Sounds.gainNode.connect(Sounds.audioCtx.destination);

	// Load sound sample data
	Sounds.loadRemoteFile(1);

	return true;
};

// Load file over HTTP
static loadRemoteFile(idx) {
	Sounds.loadIdx = idx;
	if (idx >= Sounds.sound_info.length)
	{
		// No more samples to load.
		Sounds.isInit = true;
		return;
	}

	var info = Sounds.sound_info[idx];
	if (info[0])
	{
		// Already loaded; load next.
		Sounds.loadRemoteFile(idx + 1);
		return;
	}

	Sounds.loadingName = info[6];
	Sounds.loadingSuccess = false;

	try {
		Sounds.myLoader = new XMLHttpRequest();

		// Formulate HTTP GET request URL
		var url = "sound/" + Sounds.loadingName;
		//console.log(url);

		Sounds.myLoader.open('GET', url);
		Sounds.myLoader.overrideMimeType("application/octet-stream"); // Force browser to treat file as binary
		Sounds.myLoader.responseType = "arraybuffer";
		Sounds.myLoader.onreadystatechange = Sounds.bLoaderStateChange;
		Sounds.myLoader.send();
	}
	catch (e)
	{
		zzt.Toast("Sounds ERROR:  " + e);
		return;
	}
};

static bLoaderStateChange() {
	// We are only interested in treating the response as complete
	// for state 4 (request complete; response ready).
	//console.log(Sounds.myLoader.readyState, Sounds.myLoader.status, Sounds.myLoader.statusText);
	if (Sounds.myLoader.readyState == 4)
	{
		// 200 = Complete code.
		//   0 = Apparently an acceptable completion code in Chrome.
		if (Sounds.myLoader.status == 200 || Sounds.myLoader.status == 0)
			Sounds.bCompleteHandler();
		else
			Sounds.errorHandler();
	}
};

// Error handler for file loading attempt.
static errorHandler() {
	console.log("Sounds IO ERROR:  ", Sounds.myLoader.readyState, Sounds.myLoader.status, Sounds.myLoader.statusText);
};

// File load complete handler.
static bCompleteHandler() {
	// Parse the WAV file.
	var myLoadedFile = Sounds.myLoader.response;
	var sampleData = Sounds.parseWAV(myLoadedFile);
	var info = Sounds.sound_info[Sounds.loadIdx];

	if (Sounds.lastSR != Sounds.ctxSR)
	{
		// Resample the data to match context sampling rate.
		var rsRatio = Sounds.lastSR / Sounds.ctxSR;
		var oldSampleLen = sampleData.length;
		var newSampleLen = sampleData.length / rsRatio;
		var newSampleLenInt = newSampleLen | 0;
		var fineAdjustment = newSampleLen / newSampleLenInt;
		rsRatio *= fineAdjustment;
		var newSampleData = [];

		for (var i = 0; i < newSampleLenInt; i++) {
			var idx = i * rsRatio;
			var lowIdx = idx | 0;
			if (lowIdx >= oldSampleLen - 1)
				lowIdx = oldSampleLen - 2;

			var slope = (sampleData[lowIdx + 1] - sampleData[lowIdx]); // / 1.0;
			var newVal = slope * (idx - lowIdx) + sampleData[lowIdx];
			newSampleData.push(newVal);
		}

		// Set new sample data; make fine adjustment to stored frequency
		sampleData = newSampleData;
		info[2] = info[2] * fineAdjustment;
	}

	// Update the stored sample data.
	info[0] = true;
	info[4] = sampleData;
	info[5] = sampleData.length;
	info[7] = Sounds.lastSR;

	// Initiate loading of the next sample.
	Sounds.loadRemoteFile(Sounds.loadIdx + 1);
	return true;
};

// Parse the bytes of a WAV file; return an array of sample data.
// Result is always single-channel floating-point between -1.0 and +1.0.
// Can read multiple channels, but will only use the first channel.
// Can read either 8-bit or 16-bit samples, but 16-bit samples are expected.
// Can read any sampling rate; but 44100 Hz is expected.
// Does not handle compression.
static parseWAV(aBuffer) {
	if (!aBuffer)
		return [ 0.0, 0.0, 0.0, 0.0 ];
	if (aBuffer.byteLength <= 0)
		return [ 0.0, 0.0, 0.0, 0.0 ];

	// RIFF header
	var dv = new DataView(aBuffer, 0);
	var riffChunkTag = dv.getUint32(0, true); // "RIFF"
	var riffChunkSize = dv.getUint32(4, true);
	var riffWaveTag = dv.getUint32(8, true); // "WAVE"

	// Fmt block
	var wavFmtTag = dv.getUint32(12, true); // "fmt "
	var wavPCMSize = dv.getUint32(16, true); // 16
	var wavFormat = dv.getUint16(20, true); // 1
	var wavNumChannels = dv.getUint16(22, true); // 1
	var wavSR = dv.getUint32(24, true); // 44100
	var wavBR = dv.getUint32(28, true); // 44100 * 1 * 2
	var wavBlockAlign = dv.getUint16(32, true); // 1 * 2
	var wavBPS = dv.getUint16(34, true); // 16

	// Data block
	var wavDataTag = dv.getUint32(36, true); // "data"
	var wavDataBS = dv.getUint32(40, true); // N * wavNumChannels * 2

	// Sample data
	var fSampleBuf = [];
	var sample;
	var n = 44;
	var endP = n + wavDataBS;

	for (n = 44; n < endP; n += wavBlockAlign) {
		if (wavBPS == 8)
			sample = (dv.getUint8(n) - 128) << 8;
		else if (wavBPS == 16)
			sample = dv.getInt16(n, true);
		else
			sample = 0; // 32-bit samples?

		fSampleBuf.push(sample / 32768.0);
	}

	//console.log(wavPCMSize, wavFormat, wavNumChannels, wavSR, wavBR, wavBlockAlign, wavBPS, wavDataBS);

	Sounds.lastSR = wavSR;
	return fSampleBuf;
}

static processSound(audioProcessingEvent) {
	var outBuf = audioProcessingEvent.outputBuffer;

	// Main mixing section
	Sounds.mixLimit = 0;
	for (var i = 0; i < Sounds.NUM_CHANNELS; i++)
		Sounds.mixLimit = Sounds.fxEnvelopes[i].writeFromQueue(Sounds.mixBuffer, Sounds.mixLimit, Sounds.SAMPLE_WRITE_SIZE);

	// Extend a silence block later if anything mixed
	if (Sounds.mixLimit != 0)
		Sounds.silenceRemaining = Sounds.EXTENDED_SILENCE_SIZE;

	// Economize the queue periodically to prevent infinitely large strings
	if (++Sounds.reloadQueueCount >= Sounds.RELOAD_CHECK_FREQUENCY)
	{
		Sounds.reloadQueueCount = 0;
		for (i = 0; i < Sounds.NUM_CHANNELS; i++)
			Sounds.fxEnvelopes[i].economizeQueue();
	}

	// Check for repeat; dispatch updated queue.
	var repeatCursorLoc = 0;
	for (i = 0; i < Sounds.NUM_CHANNELS; i++) {
		if (Sounds.fxEnvelopes[i].repeatActive)
		{
			repeatCursorLoc = Sounds.fxEnvelopes[i].repeatCursorLoc;
			Sounds.fxEnvelopes[i].repeatActive = false;
			Sounds.soundDispatch(Sounds.fxEnvelopes[i].repeatName, true);
		}
	}

	// If updated queue from repeated section, mix the new queue content
	// a second time from within the MIDDLE of the section.
	for (i = 0; i < Sounds.NUM_CHANNELS; i++) {
		if (Sounds.fxEnvelopes[i].midRepeat)
		{
			Sounds.fxEnvelopes[i].midRepeat = false;
			Sounds.mixLimit = Sounds.fxEnvelopes[i].writeFromQueue(
				Sounds.mixBuffer, Sounds.mixLimit, Sounds.SAMPLE_WRITE_SIZE, repeatCursorLoc);
		}
	}

	// Get output buffer of output channel.
	// All channels are given the same mono sample mix data.
	for (var channel = 0; channel < outBuf.numberOfChannels; channel++) {
		var outputData = outBuf.getChannelData(channel);

		// Transfer mix buffer contents to output buffer.
		for (i = 0; i < Sounds.mixLimit; i++)
			outputData[i] = Sounds.mixBuffer[i];

		// If the mix buffer is less than the output buffer size,
		// pad it out with silence.
		for (i = Sounds.mixLimit; i < Sounds.SAMPLE_WRITE_SIZE; i++)
			outputData[i] = 0.0;
	}

	if (Sounds.mixLimit <= 0)
		Sounds.soundPlayComplete();

	// Might not use Sounds.silenceRemaining?

	/*
	if (Sounds.mixLimit == 0 && Sounds.silenceRemaining > 0)
	{
		// Extended silence is used to prevent interstitial skipping.
		Sounds.silenceRemaining -= Sounds.SAMPLE_WRITE_SIZE;
		for (i = 0; i < Sounds.SAMPLE_WRITE_SIZE; i++)
		{
			outBuf.writeFloat(0);
			outBuf.writeFloat(0);
		}
	}
	else if (Sounds.mixLimit > 0 && Sounds.mixLimit <= Sounds.SAMPLE_WRITE_SIZE)
	{
		// Just in case the mix buffer would be greater than zero,
		// but less than the minimum threshold for sound cutoff,
		// pad the buffer out to extend play a bit further.
		// This prevents unexpected "jumps" from the AS3 sound system
		// "stopping" and "restarting."
		for (i = Sounds.mixLimit; i < Sounds.SAMPLE_WRITE_SIZE; i++)
		{
			outBuf.writeFloat(0);
			outBuf.writeFloat(0);
		}
	}

	event.data.writeBytes(outBuf);*/
};

static startEchoTrace(srcVoice) {
	for (var i = Sounds.NUM_CHANNELS - 1; i >= 0; i--)
	{
		if (Sounds.fxEnvelopes[i].eState == FxEnvelope.FX_DORMANT)
		{
			Sounds.fxEnvelopes[i].echoExisting(Sounds.fxEnvelopes[srcVoice]);
			break;
		}
	}
};

static distributePlayNotes(playStr, syncFromRepeat=false) {
	if (!Sounds.playEverStarted)
	{
		Sounds.playEverStarted = true;
		Sounds.audioCtx.resume();
	}

	var curVoice = Sounds.lastSelVoice;
	var curStr = playStr.toUpperCase();

	while (curStr.length > 0) {
		var nextVoiceLoc = curStr.indexOf("Z");
		if (nextVoiceLoc == -1 || nextVoiceLoc + 3 > curStr.length)
		{
			// If we are repeating a sequence, ensure queue empty.
			if (syncFromRepeat)
				Sounds.fxEnvelopes[curVoice].eraseQueueForRepeat();

			// No more voice specs; send remainder of string to current voice.
			Sounds.add2Queue(curVoice, curStr);
			break;
		}
		else
		{
			// If we are repeating a sequence, ensure queue empty.
			if (syncFromRepeat)
				Sounds.fxEnvelopes[curVoice].eraseQueueForRepeat();

			// Send queue up until voice change to current voice.
			Sounds.add2Queue(curVoice, curStr.substr(0, nextVoiceLoc));

			// Select new voice and resume string later.
			curVoice = utils.int(curStr.substr(nextVoiceLoc + 1, 2));
			curStr = curStr.substr(nextVoiceLoc + 3);
		}
	}

	Sounds.lastSelVoice = curVoice;
};

static add2Queue(curVoice, curStr) {
	if (Sounds.fxEnvelopes[curVoice].add2Queue(curStr))
	{
		// If sound is not playing, it must be "woken" up.
		if (Sounds.channels[0] == null)
			Sounds.playPending = true;
	}
};

static soundPlayComplete() {
	// Erase record of active channel
	Sounds.channels[0] = null;
	var doPlayVoice = false;

	for (var i = 0; i < Sounds.NUM_CHANNELS; i++)
	{
		// If queue managed to fill up during this time, play again.
		if (Sounds.fxEnvelopes[i].queue.length > 0)
			doPlayVoice = true;
	}

	if (doPlayVoice)
	{
		Sounds.playPending = true;
		Sounds.playVoice();
	}
};

static getChannelPlaying(curVoice) {
	if (Sounds.channels[0] != null && curVoice >= 0 && curVoice < Sounds.NUM_CHANNELS)
	{
		if (Sounds.fxEnvelopes[curVoice].eState != FxEnvelope.FX_DORMANT)
			return 1;
	}

	return 0;
};

static isAnyChannelPlaying() {
	for (var i = 0; i < Sounds.NUM_CHANNELS; i++)
	{
		if (Sounds.getChannelPlaying(i) != 0)
			return true;
	}

	return false;
};

static stopChannel(curVoice) {
	if (Sounds.channels[0] != null && curVoice >= 0 && curVoice < Sounds.NUM_CHANNELS)
	{
		Sounds.fxEnvelopes[curVoice].eState = FxEnvelope.FX_DORMANT;
		Sounds.fxEnvelopes[curVoice].queue = "";
		Sounds.fxEnvelopes[curVoice].priority = -1;
		return true;
	}

	return false;
};

static stopAllChannels() {
	for (var i = 0; i <= Sounds.NUM_CHANNELS; i++)
		Sounds.stopChannel(i);

	return true;
};

static playVoice() {
	if (Sounds.playPending)
	{
		Sounds.playPending = false;
		Sounds.channels[0] = 1;
	}
};

static getQueueComposite() {
	// Save tempo
	var allStr = "U" + utils.threegrouping(FxEnvelope.tempoPos);

	for (var i = 0; i < Sounds.NUM_CHANNELS; i++)
	{
		// Each channel is examined for potentially looping tracks.
		var fx = Sounds.fxEnvelopes[i];
		if (fx.queuePos <= fx.queue.length && fx.echoTrigger == -1 && fx.repeatName != "")
		{
			// If a looping track is found, save the channel number, priority,
			// volume, and repeat name.  When the world is reloaded, we can start
			// the repeated portion of these channels from the beginning.
			var qStr = "Z" + utils.twogrouping(i);
			if (fx.priority > 0)
				qStr += "P" + utils.twogrouping(fx.priority);

			qStr += "V" + utils.twogrouping(fx.baseVolPos);
			qStr += "R" + fx.repeatName + ":";

			// Add to overall composite string
			allStr += qStr;
		}
	}

	return allStr;
};

static soundDispatch(sName, syncFromRepeat=false) {
	if (Sounds.soundFx.hasOwnProperty(sName))
	{
		if (Sounds.globalProps["SOUNDOFF"] != 1)
			Sounds.distributePlayNotes(Sounds.soundFx[sName], syncFromRepeat);
		return true;
	}

	// Not found
	return false;
};

static updateAllTempo(tempoMultiplier) {
	FxEnvelope.tempoBaseMultiplier = tempoMultiplier;

	for (var i = 0; i < Sounds.NUM_CHANNELS; i++)
	{
		var fx = Sounds.fxEnvelopes[i];
		fx.tempoMultiplier = tempoMultiplier;
	}
};

static setMasterVolume(idx, channelStart=0, channelEnd=256) {
	if (idx < 0 || idx > 50)
		return;

	for (var i = channelStart; i <= channelEnd && i >= 0 && i < Sounds.NUM_CHANNELS; i++)
	{
		var fx = Sounds.fxEnvelopes[i];
		var prevMultiplier = fx.masterVolMultiplier;
		fx.masterVolPos = idx;
		fx.masterVolMultiplier = FxEnvelope.volume_table[idx];

		// Modify the base volume level of currently playing sound.
		if (prevMultiplier > 0.0)
			fx.baseVolMultiplier *= (fx.masterVolMultiplier / prevMultiplier);
		else
			fx.baseVolMultiplier = fx.masterVolMultiplier;
	}
};

static testPlay() {
	// "Standard" echo effect
	//distributePlayNotes("K40:0.3:");
	Sounds.playVoice();
};

}
