const AudioManager = {
    ctx: null, masterGain: null, bgmGain: null, seGain: null, ambientGain: null,
    activeSources: [], currentBGM: null, bgmTimeout: null, initialized: false,
    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain(); this.masterGain.gain.value = 0.4; this.masterGain.connect(this.ctx.destination);
            this.bgmGain = this.ctx.createGain(); this.bgmGain.gain.value = 0.25; this.bgmGain.connect(this.masterGain);
            this.seGain = this.ctx.createGain(); this.seGain.gain.value = 0.5; this.seGain.connect(this.masterGain);
            this.ambientGain = this.ctx.createGain(); this.ambientGain.gain.value = 0.3; this.ambientGain.connect(this.masterGain);
            this.initialized = true;
        } catch(e){}
    },
    _makeBuf(dur, fn) {
        const b = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
        const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = fn(i, d.length);
        return b;
    },
    playCicada() {
        if (!this.initialized) return;
        const buf = this._makeBuf(2, () => (Math.random() * 2 - 1) * 0.1);
        const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const flt = this.ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.value = 4500; flt.Q.value = 12;
        const lfo = this.ctx.createOscillator(); const lg = this.ctx.createGain();
        lfo.frequency.value = 0.2; lg.gain.value = 0.05; lfo.connect(lg);
        const g = this.ctx.createGain(); g.gain.value = 0.04; lg.connect(g.gain);
        src.connect(flt); flt.connect(g); g.connect(this.ambientGain); lfo.start(); src.start();
        this.activeSources.push({ id: 'cicada', source: src, lfo, gainNode: g });
    },
    playCRTHum() {
        if (!this.initialized) return;
        const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
        o.type = 'sine'; o.frequency.value = 60; g.gain.value = 0.005;
        o.connect(g); g.connect(this.ambientGain); o.start();
        this.activeSources.push({ id: 'crt', source: o, gainNode: g });
    },
    playWind() {
        if (!this.initialized) return;
        const buf = this._makeBuf(3, () => (Math.random() * 2 - 1) * 0.06);
        const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const flt = this.ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 350;
        const lfo = this.ctx.createOscillator(); const lg = this.ctx.createGain();
        lfo.frequency.value = 0.08; lg.gain.value = 150; lfo.connect(lg); lg.connect(flt.frequency);
        const g = this.ctx.createGain(); g.gain.value = 0.03;
        src.connect(flt); flt.connect(g); g.connect(this.ambientGain); lfo.start(); src.start();
        this.activeSources.push({ id: 'wind', source: src, lfo, gainNode: g });
    },
    playNote(freq, time, dur, type = 'sine', vol = 0.06, dest) {
        if (!this.initialized) return;
        dest = dest || this.bgmGain;
        const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vol, time + Math.min(0.08, dur * 0.1));
        g.gain.setValueAtTime(vol, time + dur * 0.7);
        g.gain.linearRampToValueAtTime(0, time + dur);
        o.connect(g); g.connect(dest); o.start(time); o.stop(time + dur);
    },
    stopBGM() {
        this.currentBGM = null;
        if (this.bgmTimeout) { clearTimeout(this.bgmTimeout); this.bgmTimeout = null; }
        this.activeSources = this.activeSources.filter(s => {
            if (s.id && s.id.startsWith('bgm-')) { try { s.source.stop(); } catch(e){} return false; }
            return true;
        });
    },
    _bgmLoop(id, fn, interval) {
        if (this.currentBGM !== id) return;
        fn();
        this.bgmTimeout = setTimeout(() => this._bgmLoop(id, fn, interval), interval);
    },
    playTitleBGM() {
        if (this.currentBGM === 'title') return; this.stopBGM(); this.currentBGM = 'title';
        this._bgmLoop('title', () => {
            const t = this.ctx.currentTime;
            [[440,0,2],[392,2.5,1.8],[349.23,4.5,2],[329.63,6.8,3],[659.25,1.2,.8],[587.33,3.5,.6],[523.25,5.5,.8]]
                .forEach(([f,s,d]) => this.playNote(f, t+s, d, 'sine', 0.05));
        }, 10000);
    },
    playLocationBGM(locId, tod) {
        if (tod === 'night') { this._playBGMSet('night', [220,261.63,293.66,329.63,392,440], 10000, 1, .02); return; }
        const configs = {
            teibow:       { scale: [261.63,329.63,392,523.25,659.25], int: 8000,  cnt: 3, vol: .03 },
            vendingMachine:{ scale: [261.63,329.63,392,523.25,659.25], int: 8000,  cnt: 3, vol: .03 },
            library:      { scale: [493.88,659.25], int: 10000, cnt: 1, vol: .02 },
            school:       { scale: [349.23,392,440,493.88,523.25], int: 6000, cnt: 4, vol: .02 },
            stationPlaza: { scale: [349.23,392,440,493.88,523.25], int: 6000, cnt: 4, vol: .02 },
            bridge:       { scale: [110,164.81,220], int: 8000, cnt: 2, vol: .03 },
            shrine:       { scale: [110,164.81,220], int: 8000, cnt: 2, vol: .03 },
            convenience:  { scale: [220,261.63,293.66,329.63,392,440], int: 10000, cnt: 1, vol: .02 },
        };
        const c = configs[locId] || configs.teibow;
        this._playBGMSet(locId, c.scale, c.int, c.cnt, c.vol);
    },
    _playBGMSet(id, scale, interval, count, vol) {
        if (this.currentBGM === id) return; this.stopBGM(); this.currentBGM = id;
        this._bgmLoop(id, () => {
            const t = this.ctx.currentTime;
            for (let i = 0; i < count; i++) {
                const f = scale[Math.floor(Math.random() * scale.length)];
                this.playNote(f, t + Math.random() * (interval / 1000), 2 + Math.random() * 2, 'sine', vol);
            }
        }, interval);
    },
    playDialogueBGM() {
        this._playBGMSet('dialogue', [329.63,440,523.25,659.25], 12000, 1, .02);
    },
    playTenseBGM() {
        if (this.currentBGM === 'tense') return; this.stopBGM(); this.currentBGM = 'tense';
        const drone = this.ctx.createOscillator(); const dg = this.ctx.createGain();
        drone.type = 'sawtooth'; drone.frequency.value = 55; dg.gain.value = 0.015;
        drone.connect(dg); dg.connect(this.bgmGain); drone.start();
        this.activeSources.push({ id: 'bgm-drone', source: drone, gainNode: dg });
        this._bgmLoop('tense', () => {
            const dis = [116.54,123.47,233.08,246.94];
            this.playNote(dis[Math.floor(Math.random() * dis.length)], this.ctx.currentTime, 1.5, 'triangle', .03);
        }, 4000);
    },
    playClick() { if (!this.initialized) return; const t = this.ctx.currentTime; this.playNote(800, t, .04, 'square', .025, this.seGain); this.playNote(600, t+.025, .03, 'square', .015, this.seGain); },
    playPageTurn() {
        if (!this.initialized) return;
        const buf = this._makeBuf(0.12, (i, len) => (Math.random() * 2 - 1) * 0.2 * (1 - i / len));
        const src = this.ctx.createBufferSource(); src.buffer = buf;
        const flt = this.ctx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.value = 2500;
        const g = this.ctx.createGain(); g.gain.value = 0.05;
        src.connect(flt); flt.connect(g); g.connect(this.seGain); src.start();
    },
    playImpact() {
        if (!this.initialized) return; const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(30, t+.3);
        g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t+.4);
        o.connect(g); g.connect(this.seGain); o.start(t); o.stop(t+.4);
    },
    stopAll() {
        this.stopBGM();
        this.activeSources.forEach(s => { try { if (s.source) s.source.stop(); if (s.lfo) s.lfo.stop(); } catch(e){} });
        this.activeSources = [];
    },
    setMasterVolume(v) { if (this.masterGain) this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1); }
};
