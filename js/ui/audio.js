/**
 * 世纪末异邦人 — 音频系统（完整版）
 * Web Audio API 合成环境音 + BGM
 */

const AudioManager = {
    ctx: null,
    masterGain: null,
    bgmGain: null,
    seGain: null,
    ambientGain: null,
    activeSources: [],
    currentBGM: null,
    initialized: false,

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.4;
            this.masterGain.connect(this.ctx.destination);

            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = 0.3;
            this.bgmGain.connect(this.masterGain);

            this.seGain = this.ctx.createGain();
            this.seGain.gain.value = 0.5;
            this.seGain.connect(this.masterGain);

            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.value = 0.35;
            this.ambientGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {
            console.warn('[Audio] Web Audio API 不可用');
        }
    },

    // ===== 环境音 =====

    playCicada() {
        if (!this.initialized) return;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.12;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4500;
        filter.Q.value = 10;

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.25;
        lfoGain.gain.value = 0.06;
        lfo.connect(lfoGain);

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = 0.05;
        lfoGain.connect(gainNode.gain);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ambientGain);
        lfo.start();
        source.start();

        this.activeSources.push({ id: 'cicada', source, lfo, gainNode });
    },

    playCRTHum() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 60;
        gain.gain.value = 0.006;
        osc.connect(gain);
        gain.connect(this.ambientGain);
        osc.start();
        this.activeSources.push({ id: 'crt', source: osc, gainNode: gain });
    },

    playWind() {
        if (!this.initialized) return;
        const bufferSize = this.ctx.sampleRate * 3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.08;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        filter.Q.value = 1;

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = 0.04;

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ambientGain);
        lfo.start();
        source.start();

        this.activeSources.push({ id: 'wind', source, lfo, gainNode });
    },

    // ===== BGM合成 =====

    playNote(freq, startTime, duration, type = 'sine', volume = 0.08) {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
        gain.gain.setValueAtTime(volume, startTime + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(startTime);
        osc.stop(startTime + duration);

        return osc;
    },

    // 标题BGM：极简钢琴，加缪式忧郁
    playTitleBGM() {
        if (!this.initialized || this.currentBGM === 'title') return;
        this.stopBGM();
        this.currentBGM = 'title';

        const loop = () => {
            if (this.currentBGM !== 'title') return;
            const now = this.ctx.currentTime;

            // A小调下行：A4 - G4 - F4 - E4
            const notes = [
                { freq: 440.00, time: 0,   dur: 1.8 },  // A4
                { freq: 392.00, time: 2.2, dur: 1.5 },  // G4
                { freq: 349.23, time: 4.0, dur: 1.8 },  // F4
                { freq: 329.63, time: 6.0, dur: 2.5 },  // E4
                // 高音呼应
                { freq: 659.25, time: 1.0, dur: 0.8 },  // E5
                { freq: 587.33, time: 3.2, dur: 0.6 },  // D5
                { freq: 523.25, time: 5.0, dur: 0.8 },  // C5
            ];

            notes.forEach(n => {
                this.playNote(n.freq, now + n.time, n.dur, 'sine', 0.06);
            });

            setTimeout(loop, 9000);
        };
        loop();
    },

    // 探索BGM：环境音 + 稀疏的音符
    playExplorationBGM() {
        if (!this.initialized || this.currentBGM === 'explore') return;
        this.stopBGM();
        this.currentBGM = 'explore';

        const loop = () => {
            if (this.currentBGM !== 'explore') return;
            const now = this.ctx.currentTime;

            // 随机选取几个音
            const scale = [329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33];
            const count = 2 + Math.floor(Math.random() * 3);

            for (let i = 0; i < count; i++) {
                const freq = scale[Math.floor(Math.random() * scale.length)];
                const time = Math.random() * 6;
                const dur = 1 + Math.random() * 2;
                this.playNote(freq, now + time, dur, 'sine', 0.03 + Math.random() * 0.03);
            }

            setTimeout(loop, 7000 + Math.random() * 5000);
        };

        setTimeout(loop, 2000);
    },

    // 对话BGM：更安静，偶尔一个音
    playDialogueBGM() {
        if (!this.initialized || this.currentBGM === 'dialogue') return;
        this.stopBGM();
        this.currentBGM = 'dialogue';

        const loop = () => {
            if (this.currentBGM !== 'dialogue') return;
            const now = this.ctx.currentTime;

            const notes = [329.63, 440.00, 523.25, 659.25];
            const freq = notes[Math.floor(Math.random() * notes.length)];
            this.playNote(freq, now + Math.random() * 2, 2 + Math.random() * 2, 'sine', 0.025);

            setTimeout(loop, 8000 + Math.random() * 8000);
        };

        setTimeout(loop, 3000);
    },

    // 紧张BGM：低音持续 + 不协和音
    playTenseBGM() {
        if (!this.initialized || this.currentBGM === 'tense') return;
        this.stopBGM();
        this.currentBGM = 'tense';

        // 低音持续drone
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'sawtooth';
        drone.frequency.value = 55; // A1
        droneGain.gain.value = 0.02;
        drone.connect(droneGain);
        droneGain.connect(this.bgmGain);
        drone.start();
        this.activeSources.push({ id: 'tense-drone', source: drone, gainNode: droneGain });

        const loop = () => {
            if (this.currentBGM !== 'tense') return;
            const now = this.ctx.currentTime;

            // 不协和音程
            const dissonant = [116.54, 123.47, 233.08, 246.94]; // Bb2, B2, Bb3, B3
            const freq = dissonant[Math.floor(Math.random() * dissonant.length)];
            this.playNote(freq, now, 1.5, 'triangle', 0.04);

            setTimeout(loop, 3000 + Math.random() * 4000);
        };

        setTimeout(loop, 1000);
    },

    stopBGM() {
        this.currentBGM = null;
        // 停止BGM相关源
        this.activeSources = this.activeSources.filter(s => {
            if (s.id && s.id.startsWith('tense')) {
                try { s.source.stop(); } catch(e) {}
                return false;
            }
            return true;
        });
    },

    // ===== 音效 =====

    playClick() {
        if (!this.initialized) return;
        const now = this.ctx.currentTime;
        this.playNote(800, now, 0.05, 'square', 0.03);
        this.playNote(600, now + 0.03, 0.04, 'square', 0.02);
    },

    playPageTurn() {
        if (!this.initialized) return;
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize;
            data[i] = (Math.random() * 2 - 1) * 0.3 * (1 - t);
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.06;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.seGain);
        source.start();
    },

    playImpact() {
        if (!this.initialized) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.seGain);
        osc.start(now);
        osc.stop(now + 0.4);
    },

    // ===== 控制 =====

    stopAll() {
        this.currentBGM = null;
        this.activeSources.forEach(s => {
            try { if (s.source) s.source.stop(); if (s.lfo) s.lfo.stop(); } catch(e) {}
        });
        this.activeSources = [];
    },

    stopAmbient() {
        this.activeSources = this.activeSources.filter(s => {
            if (s.id === 'cicada' || s.id === 'wind' || s.id === 'crt') {
                try { s.source.stop(); if (s.lfo) s.lfo.stop(); } catch(e) {}
                return false;
            }
            return true;
        });
    },

    setMasterVolume(v) {
        if (this.masterGain) this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
    },

    setBGMVolume(v) {
        if (this.bgmGain) this.bgmGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
    }
};
