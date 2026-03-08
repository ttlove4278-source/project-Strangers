const AudioManager = {
    ctx: null,
    masterGain: null,
    bgmGain: null,
    seGain: null,
    ambientGain: null,
    activeSources: [],
    currentBGM: null,
    bgmTimeout: null,
    initialized: false,

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.4;
            this.masterGain.connect(this.ctx.destination);

            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = 0.25;
            this.bgmGain.connect(this.masterGain);

            this.seGain = this.ctx.createGain();
            this.seGain.gain.value = 0.5;
            this.seGain.connect(this.masterGain);

            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.value = 0.3;
            this.ambientGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {}
    },

    // 环境音
    playCicada() {
        if (!this.initialized) return;
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.1;

        const src = this.ctx.createBufferSource();
        src.buffer = buf; src.loop = true;
        const flt = this.ctx.createBiquadFilter();
        flt.type = 'bandpass'; flt.frequency.value = 4500; flt.Q.value = 12;
        const lfo = this.ctx.createOscillator();
        const lg = this.ctx.createGain();
        lfo.frequency.value = 0.2; lg.gain.value = 0.05;
        lfo.connect(lg);
        const g = this.ctx.createGain(); g.gain.value = 0.04;
        lg.connect(g.gain);
        src.connect(flt); flt.connect(g); g.connect(this.ambientGain);
        lfo.start(); src.start();
        this.activeSources.push({ id: 'cicada', source: src, lfo, gainNode: g });
    },

    playCRTHum() {
        if (!this.initialized) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine'; o.frequency.value = 60; g.gain.value = 0.005;
        o.connect(g); g.connect(this.ambientGain); o.start();
        this.activeSources.push({ id: 'crt', source: o, gainNode: g });
    },

    playWind() {
        if (!this.initialized) return;
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 3, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.06;
        const src = this.ctx.createBufferSource();
        src.buffer = buf; src.loop = true;
        const flt = this.ctx.createBiquadFilter();
        flt.type = 'lowpass'; flt.frequency.value = 350;
        const lfo = this.ctx.createOscillator();
        const lg = this.ctx.createGain();
        lfo.frequency.value = 0.08; lg.gain.value = 150;
        lfo.connect(lg); lg.connect(flt.frequency);
        const g = this.ctx.createGain(); g.gain.value = 0.03;
        src.connect(flt); flt.connect(g); g.connect(this.ambientGain);
        lfo.start(); src.start();
        this.activeSources.push({ id: 'wind', source: src, lfo, gainNode: g });
    },

    // 音符
    playNote(freq, time, dur, type = 'sine', vol = 0.06, dest = null) {
        if (!this.initialized) return;
        dest = dest || this.bgmGain;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(vol, time + Math.min(0.08, dur * 0.1));
        g.gain.setValueAtTime(vol, time + dur * 0.7);
        g.gain.linearRampToValueAtTime(0, time + dur);
        o.connect(g); g.connect(dest);
        o.start(time); o.stop(time + dur);
        return o;
    },

    // 和弦
    playChord(freqs, time, dur, vol = 0.04) {
        freqs.forEach(f => this.playNote(f, time, dur, 'sine', vol / freqs.length));
    },

    // BGM生成
    _bgmLoop(id, fn, interval) {
        if (this.currentBGM !== id) return;
        fn();
        this.bgmTimeout = setTimeout(() => this._bgmLoop(id, fn, interval), interval);
    },

    stopBGM() {
        this.currentBGM = null;
        if (this.bgmTimeout) { clearTimeout(this.bgmTimeout); this.bgmTimeout = null; }
        this.activeSources = this.activeSources.filter(s => {
            if (s.id && s.id.startsWith('bgm-')) {
                try { s.source.stop(); } catch(e) {}
                return false;
            }
            return true;
        });
    },

    // 标题：A小调下行 + 高音回声
    playTitleBGM() {
        if (this.currentBGM === 'title') return;
        this.stopBGM(); this.currentBGM = 'title';
        this._bgmLoop('title', () => {
            const t = this.ctx.currentTime;
            const melody = [
                [440, 0, 2], [392, 2.5, 1.8], [349.23, 4.5, 2], [329.63, 6.8, 3],
                [659.25, 1.2, 0.8], [587.33, 3.5, 0.6], [523.25, 5.5, 0.8],
            ];
            melody.forEach(([f, s, d]) => this.playNote(f, t + s, d, 'sine', 0.05));
        }, 10000);
    },

    // 探索·堤防：海風感。C大调的開放5度
    playTeibowBGM() {
        if (this.currentBGM === 'teibow') return;
        this.stopBGM(); this.currentBGM = 'teibow';
        this._bgmLoop('teibow', () => {
            const t = this.ctx.currentTime;
            const pool = [261.63, 329.63, 392, 523.25, 659.25];
            for (let i = 0; i < 3; i++) {
                const f = pool[Math.floor(Math.random() * pool.length)];
                const s = Math.random() * 7;
                this.playNote(f, t + s, 2 + Math.random() * 2, 'sine', 0.03);
            }
        }, 8000);
    },

    // 探索·图书馆：静谧。高音E + 空间感
    playLibraryBGM() {
        if (this.currentBGM === 'library') return;
        this.stopBGM(); this.currentBGM = 'library';
        this._bgmLoop('library', () => {
            const t = this.ctx.currentTime;
            this.playNote(659.25, t + Math.random() * 5, 3, 'sine', 0.02);
            if (Math.random() > 0.5) {
                this.playNote(493.88, t + 3 + Math.random() * 3, 2, 'sine', 0.015);
            }
        }, 10000);
    },

    // 探索·站前：人声杂感。短促音
    playStationBGM() {
        if (this.currentBGM === 'station') return;
        this.stopBGM(); this.currentBGM = 'station';
        this._bgmLoop('station', () => {
            const t = this.ctx.currentTime;
            const notes = [349.23, 392, 440, 493.88, 523.25];
            for (let i = 0; i < 4; i++) {
                const f = notes[Math.floor(Math.random() * notes.length)];
                this.playNote(f, t + Math.random() * 5, 0.3 + Math.random() * 0.5, 'triangle', 0.02);
            }
        }, 6000);
    },

    // 探索·高架桥：沉重。低音持续
    playBridgeBGM() {
        if (this.currentBGM === 'bridge') return;
        this.stopBGM(); this.currentBGM = 'bridge';
        this._bgmLoop('bridge', () => {
            const t = this.ctx.currentTime;
            this.playNote(110, t, 5, 'sine', 0.03);
            this.playNote(164.81, t + 2, 3, 'sine', 0.02);
            if (Math.random() > 0.6) {
                this.playNote(220, t + 4, 2, 'triangle', 0.015);
            }
        }, 8000);
    },

    // 探索·夜晚：全地点共通夜曲
    playNightBGM() {
        if (this.currentBGM === 'night') return;
        this.stopBGM(); this.currentBGM = 'night';
        this._bgmLoop('night', () => {
            const t = this.ctx.currentTime;
            const scale = [220, 261.63, 293.66, 329.63, 392, 440];
            const f = scale[Math.floor(Math.random() * scale.length)];
            this.playNote(f, t + Math.random() * 8, 3 + Math.random() * 3, 'sine', 0.02);
        }, 10000);
    },

    // 对话：极简
    playDialogueBGM() {
        if (this.currentBGM === 'dialogue') return;
        this.stopBGM(); this.currentBGM = 'dialogue';
        this._bgmLoop('dialogue', () => {
            const t = this.ctx.currentTime;
            const notes = [329.63, 440, 523.25, 659.25];
            const f = notes[Math.floor(Math.random() * notes.length)];
            this.playNote(f, t + Math.random() * 3, 2 + Math.random() * 2, 'sine', 0.02);
        }, 12000);
    },

    // 紧张：低音drone + 不协和
    playTenseBGM() {
        if (this.currentBGM === 'tense') return;
        this.stopBGM(); this.currentBGM = 'tense';

        const drone = this.ctx.createOscillator();
        const dg = this.ctx.createGain();
        drone.type = 'sawtooth'; drone.frequency.value = 55; dg.gain.value = 0.015;
        drone.connect(dg); dg.connect(this.bgmGain); drone.start();
        this.activeSources.push({ id: 'bgm-drone', source: drone, gainNode: dg });

        this._bgmLoop('tense', () => {
            const t = this.ctx.currentTime;
            const dis = [116.54, 123.47, 233.08, 246.94];
            this.playNote(dis[Math.floor(Math.random() * dis.length)], t, 1.5, 'triangle', 0.03);
        }, 4000);
    },

    // 音效
    playClick() {
        if (!this.initialized) return;
        const t = this.ctx.currentTime;
        this.playNote(800, t, 0.04, 'square', 0.025, this.seGain);
        this.playNote(600, t + 0.025, 0.03, 'square', 0.015, this.seGain);
    },

    playPageTurn() {
        if (!this.initialized) return;
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.12, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.2 * (1 - i / d.length);
        const src = this.ctx.createBufferSource(); src.buffer = buf;
        const flt = this.ctx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.value = 2500;
        const g = this.ctx.createGain(); g.gain.value = 0.05;
        src.connect(flt); flt.connect(g); g.connect(this.seGain); src.start();
    },

    playImpact() {
        if (!this.initialized) return;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(30, t + 0.3);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        o.connect(g); g.connect(this.seGain); o.start(t); o.stop(t + 0.4);
    },

    // 根据地点自动选BGM
    playLocationBGM(locationId, timeOfDay) {
        if (timeOfDay === 'night') { this.playNightBGM(); return; }
        const map = {
            teibow: 'playTeibowBGM',
            vendingMachine: 'playTeibowBGM',
            school: 'playStationBGM',
            library: 'playLibraryBGM',
            stationPlaza: 'playStationBGM',
            bridge: 'playBridgeBGM',
            shrine: 'playBridgeBGM',
            convenience: 'playNightBGM',
        };
        const fn = map[locationId];
        if (fn && this[fn]) this[fn]();
        else this.playTeibowBGM();
    },

    stopAll() {
        this.stopBGM();
        this.activeSources.forEach(s => {
            try { if (s.source) s.source.stop(); if (s.lfo) s.lfo.stop(); } catch(e) {}
        });
        this.activeSources = [];
    },

    setMasterVolume(v) {
        if (this.masterGain) this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
    }
};
