// FxEnvelope.js:  Sound effects envelope information.
"use strict";

class FxEnvelope {

static initClass() {
	FxEnvelope.FX_DORMANT = 0;
	FxEnvelope.FX_NEXTNOTE = 1;
	FxEnvelope.FX_ENVELOPE = 2;
	FxEnvelope.FX_PERCUSSION = 3;
	FxEnvelope.FX_SWEEP = 4;
	FxEnvelope.FX_REST = 5;
	FxEnvelope.FX_ECHO_ENVELOPE = 6;
	FxEnvelope.FX_ECHO_PERCUSSION = 7;
	FxEnvelope.FX_ECHO_SWEEP = 8;

	FxEnvelope.adjustSR(44100);

//  0         1       2      3     4     5     6     7
FxEnvelope.octave_table = [
	0.0625,   0.125,  0.25,  0.5,  1.0,  2.0,  4.0,  8.0
];

//  B           C           C#          D           D#          E           F
//  F#          G           G#          A           A#          B           C
FxEnvelope.frequency_table = [
	246.941651, 261.625565, 277.182631, 293.664768, 311.126984, 329.627557, 349.228231,
	369.994423, 391.995436, 415.304698, 440.000000, 466.163762, 493.883301, 523.251131
];

// Volume multiplier is calculated as 2^(-(50 - idx) / 5)
// At 50, volume is at max (not attenuated).
// At 0, everything is muted.
FxEnvelope.volume_table = [
0.0,
0.0011217757,
0.0012885819,
0.001480192,
0.0017002941,
0.001953125,
0.0022435515,
0.0025771639,
0.0029603839,
0.0034005881,
0.00390625,
0.0044871029,
0.0051543278,
0.0059207678,
0.0068011763,
0.0078125,
0.0089742059,
0.0103086556,
0.0118415357,
0.0136023526,
0.015625,
0.0179484118,
0.0206173111,
0.0236830714,
0.0272047051,
0.03125,
0.0358968236,
0.0412346222,
0.0473661427,
0.0544094102,
0.0625,
0.0717936472,
0.0824692444,
0.0947322854,
0.1088188204,
0.125,
0.1435872944,
0.1649384888,
0.1894645708,
0.2176376408,
0.25,
0.2871745887,
0.3298769777,
0.3789291416,
0.4352752816,
0.5,
0.5743491775,
0.6597539554,
0.7578582833,
0.8705505633,
1.0
];

	// Format is:
	// 0:  initialized, 1:  index, 2:  equivalent frequency, 3:  stored cycles,
	// 4:  mono sample Number vector, 5:  number of samples in ByteArray,
	// 6:  filename, 7:  sampling rate.
	FxEnvelope.allSoundInfo = null;
	FxEnvelope.tempoPos = 137;
	FxEnvelope.tempoBaseMultiplier = 1.0;
};

// Adjust the sampling rate to the specific target.
static adjustSR(sr) {
	FxEnvelope.SR = sr;
	FxEnvelope.SR_PREF_RATIO = 44100.0 / sr;
	FxEnvelope.ASSUMED_TEMPO = 137.142857143;
	FxEnvelope.ATTACK_RATE = 0.025 * FxEnvelope.SR_PREF_RATIO;
	FxEnvelope.ATTACK_DUR = 1 / FxEnvelope.ATTACK_RATE;
	FxEnvelope.RELEASE_RATE = 0.005 * FxEnvelope.SR_PREF_RATIO;
	FxEnvelope.RELEASE_DUR = 1 / FxEnvelope.RELEASE_RATE;
	FxEnvelope.SWEEP_RELEASE_RATE = 0.025 * FxEnvelope.SR_PREF_RATIO;
	FxEnvelope.SWEEP_RELEASE_DUR = 1 / FxEnvelope.SWEEP_RELEASE_RATE;

	//  Calculation of Q1-duration based on tempo:
	//  1 min              60 sec   samples per second
	//  ---------------- * ------ * ------------------
	//  1 tempo constant   1 min    1 sec
	FxEnvelope.Q1_DURATION = 1.0 / FxEnvelope.ASSUMED_TEMPO * 60.0 * FxEnvelope.SR;
	FxEnvelope.H1_DURATION = FxEnvelope.Q1_DURATION * 2.0;
	FxEnvelope.W1_DURATION = FxEnvelope.Q1_DURATION * 4.0;
	FxEnvelope.I1_DURATION = FxEnvelope.Q1_DURATION / 2.0;
	FxEnvelope.S1_DURATION = FxEnvelope.Q1_DURATION / 4.0;
	FxEnvelope.T1_DURATION = FxEnvelope.Q1_DURATION / 8.0;
	FxEnvelope.T64_DURATION = FxEnvelope.Q1_DURATION / 16.0;
};

constructor(myChannel) {
	this.curSoundInfo = null;
	this.channel = myChannel;
	this.priority = -1;
	this.eState = FxEnvelope.FX_DORMANT;
	this.queuePos = 0;
	this.queue = "";
	this.freq = 1.0;
	this.lastSample = 0.0;
	this.lastSample2 = 0.0;
	this.samplePos = 0.0;
	this.curDuration = FxEnvelope.T1_DURATION;
	this.advMultiplier = 1.0;
	this.baseVolPos = 40;
	this.baseVolMultiplier = 0.25;
	this.envelopeMultiplier = 0.0;
	this.echoMultiplier = 0.0;
	this.echoDelay = 0.0;
	this.tempoMultiplier = FxEnvelope.tempoBaseMultiplier;
	this.masterVolPos = 50;
	this.masterVolMultiplier = 1.0;
	this.curOctave = 4;
	this.samplesLeft = 0;
	this.echoTrigger = -1;
	this.repeatName = "";
	this.repeatActive = false;
	this.midRepeat = false;
	this.repeatCursorLoc = 0;
	this.tick64Count = 0;
	this.tick64CountSize = 2;
};

echoExisting(srcEnvelope) {
	this.eState = srcEnvelope.eState + (FxEnvelope.FX_ECHO_ENVELOPE - FxEnvelope.FX_ENVELOPE);
	this.queuePos = 0;
	this.queue = "";
	this.freq = srcEnvelope.freq;
	this.curSoundInfo = srcEnvelope.curSoundInfo;
	this.samplePos = 0;
	this.curDuration = srcEnvelope.curDuration;
	this.advMultiplier = srcEnvelope.advMultiplier;
	this.baseVolMultiplier = srcEnvelope.baseVolMultiplier * srcEnvelope.echoMultiplier;
	this.echoMultiplier = srcEnvelope.echoMultiplier;
	this.envelopeMultiplier = 0.0;
	this.curOctave = srcEnvelope.curOctave;
	this.samplesLeft = utils.int(this.curDuration);
	this.attackTrigger = this.samplesLeft - utils.int(FxEnvelope.ATTACK_DUR);
	this.releaseTrigger = utils.int(FxEnvelope.RELEASE_DUR);
	this.echoTrigger = utils.int(FxEnvelope.SR * srcEnvelope.echoDelay);
};

intFrom2D(s, start, defInt=0) {
	return utils.intMaybe(s.substr(start, 2), defInt);
};

intFrom3D(s, start, defInt=0) {
	return utils.intMaybe(s.substr(start, 3), defInt);
};

add2Queue(newAddition) {
	if (newAddition == "")
	{
		// Nothing to play...
		return false;
	}
	else if (newAddition.charAt(0) == "P")
	{
		// Priority-based playback.
		var newPriority = 0;
		if (newAddition.length >= 3)
		newPriority = this.intFrom2D(newAddition, 1);

		if (newPriority > this.priority || this.eState == FxEnvelope.FX_DORMANT)
		{
			// Overridden priority; cancel previous queue.
			this.priority = newPriority;
			this.queue = newAddition;
			this.queuePos = 0;
			this.tick64Count = 0;
			this.eState = FxEnvelope.FX_NEXTNOTE;
			return true;
		}
		else if (newPriority < this.priority)
		{
			// Lesser priority; discard addition to queue.
			return false;
		}
		else
		{
			if (newAddition.length >= 4)
			{
				if (newAddition.charAt(3) == ":")
				{
					// Same priority but "self-overridden."
					this.queue = newAddition;
					this.queuePos = 0;
					this.tick64Count = 0;
					this.eState = FxEnvelope.FX_NEXTNOTE;
					return true;
				}
			}

			// Same priority; append to queue.
			this.queue = this.queue + newAddition;
			return true;
		}
	}
	else if (this.eState == FxEnvelope.FX_DORMANT)
	{
		// Voice needs to be woken up to play a brand-new queue.
		this.priority = 0;
		this.queue = newAddition;
		this.queuePos = 0;
		this.tick64Count = 0;
		this.eState = FxEnvelope.FX_NEXTNOTE;
		return true;
	}
	else
	{
		// Assume same priority; append to queue.
		this.queue = this.queue + newAddition;
		return true;
	}

	return false;
};

economizeQueue() {
	if (this.queuePos > 0 && this.queuePos <= this.queue.length)
	{
		// Economize string, to prevent strings from growing
		// too large as queue is digested.
		this.queue = this.queue.substr(this.queuePos);
		this.queuePos = 0;
	}
};

eraseQueueForRepeat() {
	// Effectively, start the queue over at nothing.  Flag for mid-buffer repeat.
	this.queue = "";
	this.queuePos = 0;
	this.eState = FxEnvelope.FX_DORMANT;
	this.midRepeat = true;
};

writeFromQueue(mixBuf, mixLimit, sampleWriteSize, startCursor=0) {
	this.writeCursor = startCursor;
	this.writeSizeLeft = sampleWriteSize - this.writeCursor;
	this.writeLimit = mixLimit;

	while (this.writeSizeLeft > 0) {
		switch (this.eState) {
			case FxEnvelope.FX_DORMANT:
				return this.writeLimit;

			case FxEnvelope.FX_NEXTNOTE:
				if (this.queuePos >= this.queue.length)
				{
					if (!this.playSyncExtended())
					{
						this.queue = "";
						this.eState = FxEnvelope.FX_DORMANT;
						this.priority = -1;
						return this.writeLimit;
					}
				}
				else if (!this.prepNextNote(mixBuf))
				{
					this.queue = "";
					this.eState = FxEnvelope.FX_DORMANT;
					this.priority = -1;
					return this.writeLimit;
				}
			break;

			case FxEnvelope.FX_ECHO_ENVELOPE:
				while (this.writeSizeLeft > 0 && this.echoTrigger > 0) {
					this.writeSizeLeft--;
					this.echoTrigger--;
					this.mixFloat(mixBuf, 0.0);
				}

				if (this.echoTrigger <= 0)
					this.eState = FxEnvelope.FX_ENVELOPE;
			break;

			case FxEnvelope.FX_ENVELOPE:
				this.writeEnvelopeRegion(mixBuf);
			break;

			case FxEnvelope.FX_REST:
				this.writeRestRegion(mixBuf);
			break;

			case FxEnvelope.FX_ECHO_PERCUSSION:
				while (this.writeSizeLeft > 0 && this.echoTrigger > 0) {
					this.writeSizeLeft--;
					this.echoTrigger--;
					this.mixFloat(mixBuf, 0.0);
				}

				if (this.echoTrigger <= 0)
					this.eState = FxEnvelope.FX_PERCUSSION;
			break;

			case FxEnvelope.FX_PERCUSSION:
				this.writePercussionRegion(mixBuf);
			break;

			case FxEnvelope.FX_ECHO_SWEEP:
				while (this.writeSizeLeft > 0 && this.echoTrigger > 0) {
					this.writeSizeLeft--;
					this.echoTrigger--;
					this.mixFloat(mixBuf, 0.0);
				}

				if (this.echoTrigger <= 0)
					this.eState = FxEnvelope.FX_SWEEP;
			break;

			case FxEnvelope.FX_SWEEP:
				this.writeSweepRegion(mixBuf);
			break;
		}
	}

	return this.writeLimit;
};

writeEnvelopeRegion(mixBuf) {
	while (this.writeSizeLeft > 0) {
		var sInt = utils.int(this.samplePos);
		var s1;
		var s2;
		if (sInt < this.curSoundInfo[5] - 1)
		{
			s1 = this.curSoundInfo[4][sInt];
			s2 = this.curSoundInfo[4][sInt + 1];
		}
		else if (sInt == this.curSoundInfo[5] - 1)
		{
			s1 = this.curSoundInfo[4][sInt];
			s2 = this.curSoundInfo[4][0];
		}
		else
		{
			this.samplePos -= this.curSoundInfo[5];
			sInt = utils.int(this.samplePos);
			s1 = this.curSoundInfo[4][sInt];
			s2 = this.curSoundInfo[4][sInt + 1];
		}

		// Linear interpolation
		s1 = (s2 - s1) * (this.samplePos - sInt) + s1;
		this.samplePos += this.advMultiplier;
		this.samplesLeft--;
		this.writeSizeLeft--;

		if (this.samplesLeft <= 0)
		{
			this.lastSample = 0.0;
			this.lastSample2 = 0.0;
			this.mixFloat(mixBuf, 0.0);
			if (this.echoTrigger == -1)
				this.eState = FxEnvelope.FX_NEXTNOTE;
			else
			{
				this.eState = FxEnvelope.FX_DORMANT;
				this.priority = -1;
			}
			return true;
		}
		else if (this.samplesLeft > this.attackTrigger && this.envelopeMultiplier < 1.0)
			this.envelopeMultiplier += FxEnvelope.ATTACK_RATE;
		else if (this.samplesLeft > this.releaseTrigger)
			this.envelopeMultiplier = 1.0;
		else if (this.envelopeMultiplier > 0.0)
			this.envelopeMultiplier -= FxEnvelope.RELEASE_RATE;
		else
		{
			this.mixFloat(mixBuf, 0.0);
			if (this.echoTrigger == -1)
				this.eState = FxEnvelope.FX_NEXTNOTE;
			else
			{
				this.eState = FxEnvelope.FX_DORMANT;
				this.priority = -1;
			}
			return true;
		}

		// Filtered:  output time-averages over 3 samples, filtering to about
		// 1/3 of Nyquist frequency in theory.  In actuality, there will still
		// be frequencies in the spectrum up to about 13000 Hz, but this is
		// reasonable in terms of preventing annoying high harmonics.
		this.mixFloat(mixBuf, (s1 + this.lastSample + this.lastSample2) * 0.3333333333 *
		this.envelopeMultiplier * this.baseVolMultiplier);
		this.lastSample2 = this.lastSample;
		this.lastSample = s1;

		// Original:  unfiltered output resulted in high harmonics.
		//mixFloat(mixBuf, s1 * envelopeMultiplier * baseVolMultiplier);
	}

	return false;
};

writeRestRegion(mixBuf) {
	while (this.writeSizeLeft > 0) {
		this.samplesLeft--;
		this.writeSizeLeft--;

		if (this.samplesLeft <= 0)
		{
			// Change state to next note
			this.eState = FxEnvelope.FX_NEXTNOTE;
			this.mixFloat(mixBuf, 0.0);
			return true;
		}

		this.mixFloat(mixBuf, 0.0);
	}

	return false;
};

writePercussionRegion(mixBuf) {
	while (this.writeSizeLeft > 0) {
		var sample;
		if (utils.int(this.samplePos) < this.curSoundInfo[5])
			sample = this.curSoundInfo[4][utils.int(this.samplePos)] * this.baseVolMultiplier;
		else
			sample = 0.0;
		this.samplePos += this.advMultiplier;
		this.samplesLeft--;
		this.writeSizeLeft--;

		if (this.samplesLeft <= 0)
		{
			// Change state to next note
			this.mixFloat(mixBuf, 0.0);
			if (this.echoTrigger == -1)
				this.eState = FxEnvelope.FX_NEXTNOTE;
			else
			{
				this.eState = FxEnvelope.FX_DORMANT;
				this.priority = -1;
			}

			return true;
		}

		this.mixFloat(mixBuf, sample);
	}

	return false;
};

writeSweepRegion(mixBuf) {
	while (this.writeSizeLeft > 0 && this.freqLeft >= 0.0)
	{
		if (this.samplesLeft <= 0)
		{
			// Initiate a new frequency stub
			this.samplesLeft = utils.int(this.curDuration);
			this.attackTrigger = this.samplesLeft - utils.int(FxEnvelope.ATTACK_DUR);
			this.releaseTrigger = utils.int(FxEnvelope.SWEEP_RELEASE_DUR);
			this.samplePos = 0;
			this.envelopeMultiplier = 0.0;

			// Select base sample from iterated frequency
			this.curSoundInfo = FxEnvelope.allSoundInfo[Sounds.B7_X8];
			for (var f = Sounds.G0_X1; f >= Sounds.B7_X8; f--)
			{
				if (!FxEnvelope.allSoundInfo[f][0])
					continue; // If not yet initialized, skip

				if (this.freq < FxEnvelope.allSoundInfo[f][2])
				{
					this.curSoundInfo = FxEnvelope.allSoundInfo[f + 1];
					break;
				}
			}

			if (!this.curSoundInfo[0])
			{
				this.eState = FxEnvelope.FX_NEXTNOTE;
				return true;
			}

			// Determine advancement multiplier (usually between 1 and 2)
			this.advMultiplier = this.freq / this.curSoundInfo[2];
			this.echoTrigger = -1;
		}

		while (this.writeSizeLeft > 0) {
			var sInt = utils.int(this.samplePos);
			var s1;
			var s2;
			if (sInt < this.curSoundInfo[5] - 1)
			{
				s1 = this.curSoundInfo[4][sInt];
				s2 = this.curSoundInfo[4][sInt + 1];
			}
			else if (sInt == this.curSoundInfo[5] - 1)
			{
				s1 = this.curSoundInfo[4][sInt];
				s2 = this.curSoundInfo[4][0];
			}
			else
			{
				this.samplePos -= this.curSoundInfo[5];
				sInt = utils.int(this.samplePos);
				s1 = this.curSoundInfo[4][sInt];
				s2 = this.curSoundInfo[4][sInt + 1];
			}

			// Linear interpolation
			s1 = (s2 - s1) * (this.samplePos - sInt) + s1;
			this.samplePos += this.advMultiplier;
			this.samplesLeft--;
			this.writeSizeLeft--;

			if (this.samplesLeft <= 0)
			{
				// Iterate frequency forward
				this.mixFloat(mixBuf, 0.0);
				this.freq += this.freqInc;
				this.freqLeft -= Math.abs(this.freqInc);
				if (this.freqLeft < 0.0)
				{
					this.eState = FxEnvelope.FX_NEXTNOTE;
					return true;
				}
				break;
			}
			else if (this.samplesLeft > this.attackTrigger && this.envelopeMultiplier < 1.0)
				this.envelopeMultiplier += FxEnvelope.ATTACK_RATE;
			else if (this.samplesLeft > this.releaseTrigger)
				this.envelopeMultiplier = 1.0;
			else if (this.envelopeMultiplier > 0.0)
				this.envelopeMultiplier -= FxEnvelope.RELEASE_RATE;
			else
			{
				// Iterate frequency forward
				this.mixFloat(mixBuf, 0.0);
				this.freq += this.freqInc;
				this.freqLeft -= Math.abs(this.freqInc);
				if (this.freqLeft < 0.0)
				{
					this.eState = FxEnvelope.FX_NEXTNOTE;
					return true;
				}
				break;
			}

			this.mixFloat(mixBuf, s1 * this.envelopeMultiplier * this.baseVolMultiplier);
		}
	}

	return false;
};

mixFloat(mixBuf, sample) {
	if (this.writeCursor < this.writeLimit)
	{
		// Write mixed output
		mixBuf[this.writeCursor] += sample;
		this.writeCursor++;
	}
	else
	{
		// Set output
		mixBuf[this.writeCursor++] = sample;
		this.writeLimit++;
	}
};

prepNextNote(outBuf) {
	var b = this.queue.charAt(this.queuePos++);
	//trace(b, queuePos);
	switch (b) {
		case "W":
			this.tick64CountSize = 64;
			this.curDuration = FxEnvelope.W1_DURATION * this.tempoMultiplier;
		break;
		case "H":
			this.tick64CountSize = 32;
			this.curDuration = FxEnvelope.H1_DURATION * this.tempoMultiplier;
		break;
		case "Q":
			this.tick64CountSize = 16;
			this.curDuration = FxEnvelope.Q1_DURATION * this.tempoMultiplier;
		break;
		case "I":
			this.tick64CountSize = 8;
			this.curDuration = FxEnvelope.I1_DURATION * this.tempoMultiplier;
		break;
		case "S":
			this.tick64CountSize = 4;
			this.curDuration = FxEnvelope.S1_DURATION * this.tempoMultiplier;
		break;
		case "T":
			this.tick64CountSize = 2;
			this.curDuration = FxEnvelope.T1_DURATION * this.tempoMultiplier;
		break;
		case ".":
			this.curDuration *= 1.5;
		break;
		case "3":
			this.curDuration *= 0.3333333333;
		break;
		case "+":
			if (++this.curOctave > 7)
				this.curOctave = 7;
		break;
		case "-":
			if (--this.curOctave < 2)
				this.curOctave = 2;
		break;
		case "X":
			this.eState = FxEnvelope.FX_REST;
			this.tick64Count += this.tick64CountSize;
			this.samplesLeft = utils.int(this.curDuration);
			//trace(samplesLeft, writeSizeLeft);
		break;
		case "C":
			this.letteredNote(1);
		break;
		case "D":
			this.letteredNote(3);
		break;
		case "E":
			this.letteredNote(5);
		break;
		case "F":
			this.letteredNote(6);
		break;
		case "G":
			this.letteredNote(8);
		break;
		case "A":
			this.letteredNote(10);
		break;
		case "B":
			this.letteredNote(12);
		break;
		case "0":
			this.percussionNote(Sounds.PERC_0);
		break;
		case "1":
			this.percussionNote(Sounds.PERC_1);
		break;
		case "2":
			this.percussionNote(Sounds.PERC_2);
		break;
		case "4":
			this.percussionNote(Sounds.PERC_4);
		break;
		case "5":
			this.percussionNote(Sounds.PERC_5);
		break;
		case "6":
			this.percussionNote(Sounds.PERC_6);
		break;
		case "7":
			this.percussionNote(Sounds.PERC_7);
		break;
		case "8":
			this.percussionNote(Sounds.PERC_8);
		break;
		case "9":
			this.percussionNote(Sounds.PERC_9);
		break;

		// EXPANDED PLAY SYNTAX
		case "V":
			if (this.queuePos + 2 <= this.queue.length)
			{
				var idx = this.intFrom2D(this.queue, this.queuePos, -1);
				if (idx == 0 && this.queue.charAt(this.queuePos) != "0")
					idx = -1;

				if (idx >= 0 && idx <= 50)
				{
					this.queuePos += 2;
					this.baseVolPos = idx;
					this.baseVolMultiplier = FxEnvelope.volume_table[idx] * this.masterVolMultiplier;
				}
			}
		break;
		case "J":
			this.tick64CountSize = 1;
			this.curDuration = FxEnvelope.T64_DURATION * this.tempoMultiplier;
		break;
		case "K":
			if (this.queuePos + 5 <= this.queue.length)
			{
				idx = this.intFrom2D(this.queue, this.queuePos, -1);
				if (idx == 0 && this.queue.charAt(this.queuePos) != "0")
					idx = -1;

				if (idx >= 0 && idx <= 50)
				{
					this.echoMultiplier = FxEnvelope.volume_table[idx];
					this.queuePos += 3;

					idx = this.queue.indexOf(":", this.queuePos);
					if (idx != -1)
					{
						this.echoDelay = utils.float0(this.queue.substr(this.queuePos, idx - this.queuePos));
						this.queuePos = idx + 1;
					}
				}
			}
		break;
		case "U":
			if (this.queuePos + 3 <= this.queue.length)
			{
				FxEnvelope.tempoPos = this.intFrom3D(this.queue, this.queuePos, -1);
				if (FxEnvelope.tempoPos > 0)
				{
					this.queuePos += 3;
					this.tempoMultiplier = FxEnvelope.ASSUMED_TEMPO / FxEnvelope.tempoPos;

					// If colon present at end, only current channel tempo is affected.
					if (this.queuePos >= this.queue.length)
						Sounds.updateAllTempo(this.tempoMultiplier);
					else if (this.queue.charAt(this.queuePos) != ":")
						Sounds.updateAllTempo(this.tempoMultiplier);
					else
						this.queuePos++;
				}
			}
		break;
		case "P":
			if (this.queuePos + 2 <= this.queue.length)
			{
				// We already processed priority; skip over.
				idx = this.intFrom2D(this.queue, this.queuePos, -1);
				if (idx >= 0 && idx <= 99)
					this.queuePos += 2;
			}
		break;
		case "R":
			idx = this.queue.indexOf(":", this.queuePos);
			if (idx != -1)
			{
				this.repeatName = this.queue.substr(this.queuePos, idx - this.queuePos);
				this.queuePos = idx + 1;
				if (this.repeatName != "")
				{
					this.repeatActive = true;
					this.repeatCursorLoc = this.writeCursor;
				}
			}
		break;
		case "@":
			this.curOctave = 4;
			this.curDuration = FxEnvelope.T1_DURATION * this.tempoMultiplier;
			this.tick64CountSize = 2;
		break;
		case "O":
		if (this.queuePos + 2 <= this.queue.length)
		{
			// Set octave.
			idx = this.intFrom2D(this.queue, this.queuePos, -1);
			if (idx >= 0 && idx <= 7)
			{
				this.curOctave = idx;
				this.queuePos += 2;
			}
		}
		break;
		case "%":
			if (this.queuePos + 5 <= this.queue.length)
			{
				// Get 4 values:  startFreq, endFreq, freqInc, singleDuration
				idx = this.queue.indexOf(":", this.queuePos);
				if (idx == -1)
					idx = this.queue.length - 1;

				this.freq = utils.float0(this.queue.substr(this.queuePos, idx - this.queuePos));
				this.queuePos = idx + 1;
				idx = this.queue.indexOf(":", this.queuePos);
				if (idx == -1)
					idx = this.queue.length - 1;

				this.freqLeft = utils.float0(this.queue.substr(this.queuePos, idx - this.queuePos));
				this.queuePos = idx + 1;
				idx = this.queue.indexOf(":", this.queuePos);
				if (idx == -1)
					idx = this.queue.length - 1;

				this.freqInc = utils.float0(this.queue.substr(this.queuePos, idx - this.queuePos));
				this.queuePos = idx + 1;
				idx = this.queue.indexOf(":", this.queuePos);
				if (idx == -1)
					idx = this.queue.length - 1;

				this.curDuration = utils.float0(this.queue.substr(this.queuePos, idx - this.queuePos)) * FxEnvelope.SR;
				this.queuePos = idx + 1;

				this.eState = FxEnvelope.FX_SWEEP;
				this.envelopeMultiplier = 0.0;
				this.samplesLeft = 0;
				this.freqInc = utils.sgn(this.freqLeft - this.freq) * Math.abs(this.freqInc);
				this.freqLeft = Math.abs(this.freqLeft - this.freq);
			}
		break;
	}

	return true;
};

letteredNote(idx) {
	// Add to logged ticks
	this.tick64Count += this.tick64CountSize;

	// Check if sharp or flat follows
	if (this.queuePos < this.queue.length)
	{
		if (this.queue.charAt(this.queuePos) == "#")
		{
			idx++;
			this.queuePos++;
		}
		else if (this.queue.charAt(this.queuePos) == "!")
		{
			idx--;
			this.queuePos++;
		}
	}

	// Change to attack state
	this.eState = FxEnvelope.FX_ENVELOPE;
	this.samplesLeft = utils.int(this.curDuration);
	this.attackTrigger = this.samplesLeft - utils.int(FxEnvelope.ATTACK_DUR);
	this.releaseTrigger = utils.int(FxEnvelope.RELEASE_DUR);
	this.samplePos = 0;
	this.envelopeMultiplier = 0.0;
	this.lastSample = 0.0;
	this.lastSample2 = 0.0;

	// Select base sample from frequency
	this.freq = FxEnvelope.frequency_table[idx] * FxEnvelope.octave_table[this.curOctave];
	this.curSoundInfo = FxEnvelope.allSoundInfo[Sounds.B7_X8];
	for (var f = Sounds.G0_X1; f >= Sounds.B7_X8; f--)
	{
		if (!FxEnvelope.allSoundInfo[f][0])
			continue; // If not yet initialized, skip

		if (this.freq < FxEnvelope.allSoundInfo[f][2])
		{
			//trace(f+1);
			this.curSoundInfo = FxEnvelope.allSoundInfo[f + 1];
			break;
		}
	}

	if (!this.curSoundInfo[0])
		return; // If not yet initialized, can't play

	// Determine advancement multiplier (usually between 1 and 2)
	this.advMultiplier = this.freq / this.curSoundInfo[2];
	this.echoTrigger = -1;
	//trace(advMultiplier, freq, curSoundInfo[2], curSoundInfo[5]);

	// If echo present, set echo trace
	if (this.echoDelay > 0.0 && this.echoMultiplier > 0.0)
		Sounds.startEchoTrace(this.channel);
};

percussionNote(idx) {
	// Add to logged ticks
	this.tick64Count += this.tick64CountSize;

	// Change to percussion state
	this.curSoundInfo = FxEnvelope.allSoundInfo[idx];
	if (!this.curSoundInfo[0])
		return; // If not yet initialized, can't play

	this.eState = FxEnvelope.FX_PERCUSSION;
	this.samplesLeft = utils.int(this.curDuration);
	this.samplePos = 0;
	this.advMultiplier = 1.0;
	this.echoTrigger = -1;

	// If echo present, set echo trace
	if (this.echoDelay > 0.0 && this.echoMultiplier > 0.0)
		Sounds.startEchoTrace(this.channel);
};

playSyncExtended() {
	// Only extend channel 1, and only if sync location identified.
	if (Sounds.playSyncCallback == null || this.channel != 1 || this.tick64Count < 64)
		return false;

	if (Sounds.playSyncCallback())
		return true;
	else
	{
		Sounds.playSyncCallback = null;
		return false;
	}
};

}

FxEnvelope.initClass();
