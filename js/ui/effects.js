/**
 * 世纪末异邦人 — UI特效
 */

const Effects = {

    // 打字机效果
    typewriterAbort: false,

    async typeText(element, text, speed = 'normal') {
        const speeds = { slow: 55, normal: 30, fast: 12, instant: 0 };
        const delay = speeds[speed] || speeds.normal;

        this.typewriterAbort = false;
        element.textContent = '';

        if (delay === 0) {
            element.textContent = text;
            return;
        }

        for (let i = 0; i < text.length; i++) {
            if (this.typewriterAbort) {
                element.textContent = text;
                return;
            }

            element.textContent += text[i];

            const char = text[i];
            let pause = delay;
            if ('。！？'.includes(char))        pause = delay * 5;
            else if ('、；：'.includes(char))    pause = delay * 2.5;
            else if ('…'.includes(char))         pause = delay * 3;
            else if ('—'.includes(char))         pause = delay * 3;
            else if ('「」『』'.includes(char))   pause = delay * 1.5;
            else if (char === '\n')              pause = delay * 4;

            await this.wait(pause);
        }
    },

    skipTypewriter() {
        this.typewriterAbort = true;
    },

    // 死亡计数器
    setDeathCounter(count) {
        const str = String(count).padStart(3, '0');
        for (let i = 0; i < 3; i++) {
            const digit = document.getElementById(`digit-${i}`);
            if (digit) digit.textContent = str[i];
        }
    },

    // 逻各斯条
    updateLogos(current, max) {
        const fill = document.getElementById('logos-fill');
        const value = document.getElementById('logos-value');
        if (fill) fill.style.width = `${(current / max) * 100}%`;
        if (value) value.textContent = `${current.toFixed(1)} 赫`;
    },

    // 状态栏更新
    updateStatusBar(date, time, temp) {
        const d = document.getElementById('current-date');
        const t = document.getElementById('current-time');
        const tp = document.getElementById('current-temp');
        if (d) d.textContent = date;
        if (t) t.textContent = time;
        if (tp) tp.textContent = temp + '℃';
    },

    // 画面震动
    shake(element = document.body) {
        element.classList.add('screen-shake');
        setTimeout(() => element.classList.remove('screen-shake'), 300);
    },

    // 闪光
    flash() {
        const el = document.getElementById('screen-flash');
        if (!el) return;
        el.classList.remove('active');
        void el.offsetWidth;
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 600);
    },

    // 通知
    async notify(text, duration = 2500) {
        const el = document.getElementById('notification');
        if (!el) return;
        el.textContent = text;
        el.classList.add('show');
        await this.wait(duration);
        el.classList.remove('show');
    },

    // 逻各斯粒子
    spawnLogosParticles(x, y, count = 5) {
        const chars = '存在虚无意义荒谬自由命题逻各斯深渊超人理性洞穴真理';
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'logos-particle';
            p.textContent = chars[Math.floor(Math.random() * chars.length)];
            p.style.left = (x + (Math.random() - 0.5) * 80) + 'px';
            p.style.top = (y + (Math.random() - 0.5) * 40) + 'px';
            p.style.animationDelay = (Math.random() * 0.3) + 's';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 2500);
        }
    },

    // 蝉鸣波纹
    spawnCicadaRipple() {
        const ripple = document.createElement('div');
        ripple.className = 'cicada-ripple';
        ripple.style.left = (Math.random() * window.innerWidth) + 'px';
        ripple.style.top = (Math.random() * window.innerHeight) + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 3000);
    },

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// 定期蝉鸣波纹
setInterval(() => {
    if (document.querySelector('#exploration-screen.active') ||
        document.querySelector('#title-screen.active')) {
        Effects.spawnCicadaRipple();
    }
}, 5000 + Math.random() * 5000);
