const DialogueEngine = {
    currentScript: null, currentIndex: 0, isTyping: false, isWaitingChoice: false,
    onComplete: null, gameState: null, _bound: false,
    init(gs) {
        this.gameState = gs;
        if (this._bound) return; this._bound = true;
        document.getElementById('dialogue-screen').addEventListener('click', (e) => {
            if (e.target.closest('.dialogue-choice')) return; this.advance();
        });
        document.addEventListener('keydown', (e) => {
            if (SceneManager.getCurrentId() !== 'dialogue-screen') return;
            if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); this.advance(); }
        });
    },
    async play(script, onComplete) {
        this.currentScript = script; this.currentIndex = 0;
        this.onComplete = onComplete; this.isWaitingChoice = false;
        await SceneManager.switchTo('dialogue-screen', 'fade');
        await Effects.wait(300); this.showCurrent();
    },
    async showCurrent() {
        if (this.currentIndex >= this.currentScript.length) { if (this.onComplete) this.onComplete(); return; }
        const node = this.currentScript[this.currentIndex];
        if (!node) { if (this.onComplete) this.onComplete(); return; }

        const speakerEl = document.getElementById('dialogue-speaker');
        const textEl = document.getElementById('dialogue-text');
        const choicesEl = document.getElementById('dialogue-choices');
        const continueEl = document.getElementById('dialogue-continue');
        const atmosphereEl = document.getElementById('dialogue-atmosphere');

        choicesEl.innerHTML = ''; continueEl.classList.remove('visible'); this.isWaitingChoice = false;
        if (node.atmosphere) atmosphereEl.textContent = node.atmosphere;
        if (node.speaker) { speakerEl.textContent = node.speaker; speakerEl.className = 'dialogue-speaker visible'; }
        else { speakerEl.textContent = ''; speakerEl.className = 'dialogue-speaker'; }

        if (node.effect === 'shake') Effects.shake();
        if (node.effect === 'flash') Effects.flash();
        if (node.effect === 'particles') Effects.spawnLogosParticles(window.innerWidth/2, window.innerHeight/2, 8);
        if (node.characterCard) await Effects.showCharacterCard(node.characterCard.name, node.characterCard.nameEn, node.characterCard.source);
        if (node.fullscreen) await Effects.showFullscreenText(node.fullscreen, node.fullscreenDuration || 3000);
        if (node.sound === 'impact') AudioManager.playImpact();
        if (node.bgm === 'tense') AudioManager.playTenseBGM();
        if (node.bgm === 'dialogue') AudioManager.playDialogueBGM();

        this.isTyping = true;
        const speed = this.gameState?.settings?.textSpeed || 'normal';
        await Effects.typeText(textEl, node.text, speed);
        this.isTyping = false;

        if (node.choices && node.choices.length > 0) { this.isWaitingChoice = true; this.showChoices(node.choices); }
        else { continueEl.classList.add('visible'); }
    },
    showChoices(choices) {
        const el = document.getElementById('dialogue-choices'); el.innerHTML = '';
        choices.forEach((ch, i) => {
            const btn = document.createElement('div'); btn.className = 'dialogue-choice';
            const locked = (ch.requiredDeaths && this.gameState.deathCount < ch.requiredDeaths) || (ch.requiredFlag && !this.gameState.flags[ch.requiredFlag]);
            if (locked) {
                btn.classList.add('locked');
                btn.setAttribute('data-lock-hint', ch.requiredDeaths ? `[需死亡 ${ch.requiredDeaths} 次]` : '[未解锁]');
                btn.textContent = ch.text;
            } else {
                btn.textContent = ch.text;
                btn.addEventListener('click', () => { AudioManager.playClick(); this.selectChoice(ch); });
            }
            btn.style.opacity = '0'; btn.style.transform = 'translateX(-10px)'; el.appendChild(btn);
            setTimeout(() => { btn.style.transition = 'all 0.35s var(--ease-out-expo)'; btn.style.opacity = ''; btn.style.transform = ''; }, 150 + i * 80);
        });
    },
    selectChoice(ch) {
        this.isWaitingChoice = false;
        if (ch.setFlag) this.gameState.flags[ch.setFlag] = true;
        if (ch.bondChange) { for (const [k,v] of Object.entries(ch.bondChange)) { if (this.gameState.bonds[k] !== undefined) this.gameState.bonds[k] += v; } }
        if (ch.effect === 'shake') Effects.shake();
        if (ch.effect === 'flash') Effects.flash();
        this.currentIndex = (ch.next !== undefined) ? ch.next : this.currentIndex + 1;
        this.showCurrent();
    },
    advance() {
        if (this.isTyping) {
            Effects.skipTypewriter();
            setTimeout(() => {
                const node = this.currentScript[this.currentIndex];
                if (!node) return;
                if (node.choices && node.choices.length > 0) { this.isWaitingChoice = true; this.showChoices(node.choices); }
                else { document.getElementById('dialogue-continue').classList.add('visible'); }
                this.isTyping = false;
            }, 50);
            return;
        }
        if (this.isWaitingChoice) return;
        const node = this.currentScript[this.currentIndex];
        if (node && node.next !== undefined && !(node.choices && node.choices.length > 0)) {
            this.currentIndex = node.next;
        } else {
            this.currentIndex++;
        }
        this.showCurrent();
    }
};
