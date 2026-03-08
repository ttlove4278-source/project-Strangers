const Effects = {
    typewriterAbort: false,
    async typeText(el, text, speed = 'normal') {
        const sp = { slow: 55, normal: 30, fast: 12, instant: 0 };
        const d = sp[speed] || sp.normal;
        this.typewriterAbort = false;
        el.textContent = '';
        if (d === 0) { el.textContent = text; return; }
        for (let i = 0; i < text.length; i++) {
            if (this.typewriterAbort) { el.textContent = text; return; }
            el.textContent += text[i];
            const c = text[i];
            let p = d;
            if ('。！？'.includes(c)) p = d * 5;
            else if ('、；：'.includes(c)) p = d * 2.5;
            else if ('…—'.includes(c)) p = d * 3;
            else if ('「」『』'.includes(c)) p = d * 1.5;
            else if (c === '\n') p = d * 4;
            await this.wait(p);
        }
    },
    skipTypewriter() { this.typewriterAbort = true; },
    setDeathCounter(count) {
        const s = String(count).padStart(3, '0');
        for (let i = 0; i < 3; i++) { const d = document.getElementById(`digit-${i}`); if (d) d.textContent = s[i]; }
    },
    updateLogos(cur, max) {
        const f = document.getElementById('logos-fill');
        const v = document.getElementById('logos-value');
        if (f) f.style.width = `${(cur / max) * 100}%`;
        if (v) v.textContent = `${cur.toFixed(1)} 赫`;
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
        if (typeof AudioManager !== 'undefined') AudioManager.playImpact();
        setTimeout(() => el.classList.remove('screen-shake'), 300);
    },
    flash() {
        const el = document.getElementById('screen-flash');
        if (!el) return;
        el.classList.remove('active'); void el.offsetWidth; el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 600);
    },
    async notify(text, dur = 2500) {
        const el = document.getElementById('notification');
        if (!el) return;
        el.textContent = text; el.classList.add('show');
        if (typeof AudioManager !== 'undefined') AudioManager.playClick();
        await this.wait(dur); el.classList.remove('show');
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
        const scr = SceneManager.getCurrentId();
        if (scr === 'battle-screen') return;
        const r = document.createElement('div');
        r.className = 'cicada-ripple';
        r.style.left = (Math.random() * window.innerWidth) + 'px';
        r.style.top = (Math.random() * window.innerHeight) + 'px';
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 3000);
    },
    async showChapterCard(number, title, subtitle) {
        const c = document.createElement('div');
        c.className = 'chapter-card';
        c.innerHTML = `<div class="chapter-number">${number}</div><div class="chapter-line"></div><div class="chapter-title">${title}</div><div class="chapter-subtitle">${subtitle || ''}</div>`;
        document.body.appendChild(c);
        await this.wait(50); c.classList.add('visible');
        if (typeof AudioManager !== 'undefined') AudioManager.playPageTurn();
        await this.wait(3500); c.classList.remove('visible');
        await this.wait(800); c.remove();
    },
    async showCharacterCard(nameJp, nameEn, source) {
        const c = document.createElement('div');
        c.className = 'character-card';
        c.innerHTML = `<div><div class="char-name-jp">${nameJp}</div><div class="char-line"></div><div class="char-name-en">${nameEn}</div><div class="char-source">${source}</div></div>`;
        document.body.appendChild(c);
        await this.wait(50); c.classList.add('visible');
        if (typeof AudioManager !== 'undefined') AudioManager.playClick();
        await this.wait(2500); c.classList.remove('visible');
        await this.wait(600); c.remove();
    },
    async showFullscreenText(text, dur = 3000) {
        const el = document.createElement('div');
        el.className = 'fullscreen-text';
        el.innerHTML = `<p>${text}</p>`;
        document.body.appendChild(el);
        await this.wait(50); el.classList.add('visible');
        await this.wait(dur); el.classList.remove('visible');
        await this.wait(600); el.remove();
    },
    async showDateCard(dateStr, dayOfWeek, temp, remaining) {
        const c = document.createElement('div');
        c.className = 'date-card';
        c.innerHTML = `<div class="date-main">${dateStr}</div><div class="date-day">${dayOfWeek}</div><div class="date-temp-display">${temp}℃</div>${remaining ? `<div class="date-remaining">${remaining}</div>` : ''}`;
        document.body.appendChild(c);
        await this.wait(50); c.classList.add('visible');
        await this.wait(2800); c.classList.remove('visible');
        await this.wait(600); c.remove();
    },
    updateCountdown(days) {
        let b = document.getElementById('countdown-badge');
        if (!b) { b = document.createElement('div'); b.className = 'countdown-badge'; b.id = 'countdown-badge'; document.body.appendChild(b); }
        if (days !== null && days !== undefined) {
            b.innerHTML = `御厨光 — 残り <span class="countdown-num">${days}</span> 日`;
            b.classList.add('visible');
        } else { b.classList.remove('visible'); }
    },
    wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};
setInterval(() => { Effects.spawnCicadaRipple(); }, 5000 + Math.random() * 5000);
