/**
 * 世纪末异邦人 — UI特效（完整版）
 */

const Effects = {

    typewriterAbort: false,

    async typeText(element, text, speed = 'normal') {
        const speeds = { slow: 55, normal: 30, fast: 12, instant: 0 };
        const delay = speeds[speed] || speeds.normal;
        this.typewriterAbort = false;
        element.textContent = '';

        if (delay === 0) { element.textContent = text; return; }

        for (let i = 0; i < text.length; i++) {
            if (this.typewriterAbort) { element.textContent = text; return; }
            element.textContent += text[i];
            const c = text[i];
            let p = delay;
            if ('。！？'.includes(c)) p = delay * 5;
            else if ('、；：'.includes(c)) p = delay * 2.5;
            else if ('…'.includes(c)) p = delay * 3;
            else if ('—'.includes(c)) p = delay * 3;
            else if ('「」『』'.includes(c)) p = delay * 1.5;
            else if (c === '\n') p = delay * 4;
            await this.wait(p);
        }
    },

    skipTypewriter() { this.typewriterAbort = true; },

    setDeathCounter(count) {
        const str = String(count).padStart(3, '0');
        for (let i = 0; i < 3; i++) {
            const d = document.getElementById(`digit-${i}`);
            if (d) d.textContent = str[i];
        }
    },

    updateLogos(current, max) {
        const fill = document.getElementById('logos-fill');
        const value = document.getElementById('logos-value');
        if (fill) fill.style.width = `${(current / max) * 100}%`;
        if (value) value.textContent = `${current.toFixed(1)} 赫`;
    },

    updateStatusBar(date, time, temp) {
        const d = document.getElementById('current-date');
        const t = document.getElementById('current-time');
        const tp = document.getElementById('current-temp');
        if (d) d.textContent = date;
        if (t) t.textContent = time;
        if (tp) tp.textContent = temp + '℃';
    },

    shake(el = document.body) {
        el.classList.add('screen-shake');
        AudioManager.playImpact();
        setTimeout(() => el.classList.remove('screen-shake'), 300);
    },

    flash() {
        const el = document.getElementById('screen-flash');
        if (!el) return;
        el.classList.remove('active');
        void el.offsetWidth;
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 600);
    },

    async notify(text, duration = 2500) {
        const el = document.getElementById('notification');
        if (!el) return;
        el.textContent = text;
        el.classList.add('show');
        AudioManager.playClick();
        await this.wait(duration);
        el.classList.remove('show');
    },

    spawnLogosParticles(x, y, count = 5) {
        const chars = '存在虚无意义荒谬自由命题逻各斯深渊超人理性洞穴真理西西弗';
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

    spawnCicadaRipple() {
        const r = document.createElement('div');
        r.className = 'cicada-ripple';
        r.style.left = (Math.random() * window.innerWidth) + 'px';
        r.style.top = (Math.random() * window.innerHeight) + 'px';
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 3000);
    },

    // ===== 演出系统 =====

    async showChapterCard(number, title, subtitle) {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.innerHTML = `
            <div class="chapter-number">${number}</div>
            <div class="chapter-line"></div>
            <div class="chapter-title">${title}</div>
            <div class="chapter-subtitle">${subtitle || ''}</div>
        `;
        document.body.appendChild(card);

        await this.wait(50);
        card.classList.add('visible');
        AudioManager.playPageTurn();
        await this.wait(3500);
        card.classList.remove('visible');
        await this.wait(800);
        card.remove();
    },

    async showCharacterCard(nameJp, nameEn, source) {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <div class="character-card-inner">
                <div class="char-name-jp">${nameJp}</div>
                <div class="char-line"></div>
                <div class="char-name-en">${nameEn}</div>
                <div class="char-source">${source}</div>
            </div>
        `;
        document.body.appendChild(card);

        await this.wait(50);
        card.classList.add('visible');
        AudioManager.playClick();
        await this.wait(2500);
        card.classList.remove('visible');
        await this.wait(600);
        card.remove();
    },

    async showFullscreenText(text, duration = 3000) {
        const el = document.createElement('div');
        el.className = 'fullscreen-text';
        el.innerHTML = `<p>${text}</p>`;
        document.body.appendChild(el);

        await this.wait(50);
        el.classList.add('visible');
        await this.wait(duration);
        el.classList.remove('visible');
        await this.wait(600);
        el.remove();
    },

    async showDateCard(dateStr, dayOfWeek, temp, remaining) {
        const card = document.createElement('div');
        card.className = 'date-card';
        card.innerHTML = `
            <div class="date-main">${dateStr}</div>
            <div class="date-day">${dayOfWeek}</div>
            <div class="date-temp-display">${temp}℃</div>
            ${remaining ? `<div class="date-remaining">${remaining}</div>` : ''}
        `;
        document.body.appendChild(card);

        await this.wait(50);
        card.classList.add('visible');
        await this.wait(2800);
        card.classList.remove('visible');
        await this.wait(600);
        card.remove();
    },

    updateCountdown(mikuriyaDays) {
        let badge = document.getElementById('countdown-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'countdown-badge';
            badge.id = 'countdown-badge';
            document.body.appendChild(badge);
        }
        if (mikuriyaDays !== null && mikuriyaDays !== undefined) {
            badge.innerHTML = `御厨光 — 残り <span class="countdown-num">${mikuriyaDays}</span> 日`;
            badge.classList.add('visible');
        } else {
            badge.classList.remove('visible');
        }
    },

    wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};

// 定期蝉鸣波纹
setInterval(() => {
    const active = document.querySelector('#exploration-screen.active') || document.querySelector('#title-screen.active');
    if (active) Effects.spawnCicadaRipple();
}, 4000 + Math.random() * 6000);
