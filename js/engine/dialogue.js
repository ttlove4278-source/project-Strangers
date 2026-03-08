/**
 * 世纪末异邦人 — 对话引擎
 */

const DialogueEngine = {
    currentScript: null,
    currentIndex: 0,
    isTyping: false,
    isWaitingChoice: false,
    onComplete: null,
    gameState: null,
    _bound: false,

    init(gameState) {
        this.gameState = gameState;
        if (this._bound) return;
        this._bound = true;

        document.getElementById('dialogue-screen').addEventListener('click', (e) => {
            if (e.target.closest('.dialogue-choice')) return;
            this.advance();
        });

        document.addEventListener('keydown', (e) => {
            if (SceneManager.getCurrentId() !== 'dialogue-screen') return;
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.advance();
            }
        });
    },

    async play(script, onComplete) {
        this.currentScript = script;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.isWaitingChoice = false;

        await SceneManager.switchTo('dialogue-screen', 'fade');
        await Effects.wait(300);
        this.showCurrent();
    },

    async showCurrent() {
        if (this.currentIndex >= this.currentScript.length) {
            if (this.onComplete) this.onComplete();
            return;
        }

        const node = this.currentScript[this.currentIndex];

        const speakerEl = document.getElementById('dialogue-speaker');
        const textEl = document.getElementById('dialogue-text');
        const choicesEl = document.getElementById('dialogue-choices');
        const continueEl = document.getElementById('dialogue-continue');
        const atmosphereEl = document.getElementById('dialogue-atmosphere');

        choicesEl.innerHTML = '';
        continueEl.classList.remove('visible');
        this.isWaitingChoice = false;

        // 氛围文字
        if (node.atmosphere) {
            atmosphereEl.textContent = node.atmosphere;
        }

        // 说话者
        if (node.speaker) {
            speakerEl.textContent = node.speaker;
            speakerEl.className = 'dialogue-speaker visible';
        } else {
            speakerEl.textContent = '';
            speakerEl.className = 'dialogue-speaker';
        }

        // 特效
        if (node.effect === 'shake') Effects.shake();
        if (node.effect === 'flash') Effects.flash();
        if (node.effect === 'particles') {
            Effects.spawnLogosParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
        }

        // 打字
        this.isTyping = true;
        const speed = this.gameState?.settings?.textSpeed || 'normal';
        await Effects.typeText(textEl, node.text, speed);
        this.isTyping = false;

        // 选项或继续
        if (node.choices && node.choices.length > 0) {
            this.isWaitingChoice = true;
            this.showChoices(node.choices);
        } else {
            continueEl.classList.add('visible');
        }
    },

    showChoices(choices) {
        const choicesEl = document.getElementById('dialogue-choices');
        choicesEl.innerHTML = '';

        choices.forEach((choice, index) => {
            const btn = document.createElement('div');
            btn.className = 'dialogue-choice';

            if (choice.requiredDeaths && this.gameState.deathCount < choice.requiredDeaths) {
                btn.classList.add('locked');
                btn.setAttribute('data-lock-hint', `[需死亡 ${choice.requiredDeaths} 次]`);
                btn.textContent = choice.text;
            } else if (choice.requiredFlag && !this.gameState.flags[choice.requiredFlag]) {
                btn.classList.add('locked');
                btn.setAttribute('data-lock-hint', `[未解锁]`);
                btn.textContent = choice.text;
            } else {
                btn.textContent = choice.text;
                btn.addEventListener('click', () => this.selectChoice(choice));
            }

            btn.style.opacity = '0';
            btn.style.transform = 'translateX(-10px)';
            choicesEl.appendChild(btn);

            setTimeout(() => {
                btn.style.transition = 'all 0.35s var(--ease-out-expo)';
                btn.style.opacity = '';
                btn.style.transform = '';
            }, 150 + index * 80);
        });
    },

    selectChoice(choice) {
        this.isWaitingChoice = false;

        if (choice.setFlag) {
            this.gameState.flags[choice.setFlag] = true;
        }

        if (choice.bondChange) {
            for (const [key, val] of Object.entries(choice.bondChange)) {
                if (this.gameState.bonds[key] !== undefined) {
                    this.gameState.bonds[key] += val;
                }
            }
        }

        if (choice.effect === 'shake') Effects.shake();
        if (choice.effect === 'flash') Effects.flash();

        if (choice.next !== undefined) {
            this.currentIndex = choice.next;
        } else {
            this.currentIndex++;
        }

        this.showCurrent();
    },

    advance() {
        if (this.isTyping) {
            Effects.skipTypewriter();

            setTimeout(() => {
                const node = this.currentScript[this.currentIndex];
                if (node && node.choices && node.choices.length > 0) {
                    this.isWaitingChoice = true;
                    this.showChoices(node.choices);
                } else {
                    document.getElementById('dialogue-continue').classList.add('visible');
                }
                this.isTyping = false;
            }, 50);
            return;
        }

        if (this.isWaitingChoice) return;

        this.currentIndex++;
        this.showCurrent();
    }
};
