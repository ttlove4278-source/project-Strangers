/**
 * 世纪末异邦人 — 音频管理
 * 使用 Web Audio API 生成环境音
 */

const AudioManager = {
    ctx: null,
    masterGain: null,
    activeSources: [],
    initialized: false,

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
            console.log('[AudioManager] 初始化成功');
        } catch (e) {
            console.warn('[AudioManager] Web Audio API 不可用');
        }
    },

    // 生成蝉鸣（简化版）
    playCicada() {
        if (!this.initialized) return;

        const now = this.ctx.currentTime;

        // 白噪声模拟蝉鸣
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.15;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // 带通滤波 → 蝉鸣频率
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4500;
        filter.Q.value = 8;

        // 幅度调制 → 蝉鸣节奏
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.3;
        lfoGain.gain.value = 0.08;
        lfo.connect(lfoGain);

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = 0.06;
        lfoGain.connect(gainNode.gain);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        lfo.start(now);
        source.start(now);

        this.activeSources.push({ source, lfo, gainNode });
        return { source, lfo, gainNode };
    },

    // CRT 嗡鸣
    playCRTHum() {
        if (!this.initialized) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 60; // 电源频率
        gain.gain.value = 0.008;

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();

        this.activeSources.push({ source: osc, gainNode: gain });
        return { source: osc, gainNode: gain };
    },

    // 停止所有
    stopAll() {
        this.activeSources.forEach(s => {
            try {
                if (s.source) s.source.stop();
                if (s.lfo) s.lfo.stop();
            } catch (e) { /* 已停止 */ }
        });
        this.activeSources = [];
    },

    // 设置音量
    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.1);
        }
    }
};
