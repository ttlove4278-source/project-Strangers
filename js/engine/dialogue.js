/**
 * 世纪末异邦人 — 对话引擎（完整版）
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

        // 处理 next 跳转
        if (node.next !== undefined && !node.choices && !node.text) {
            this.currentIndex = node.next;
            this.showCurrent();
            return;
        }

        const speakerEl = document.getElementById('dialogue-speaker');
        const textEl = document.getElementById('dialogue-text');
        const choicesEl = document.getElementById('dialogue-choices');
        const continueEl = document.getElementById('dialogue-continue');
        const atmosphereEl = document.getElementById('dialogue-atmosphere');

        choicesEl.innerHTML = '';
        continueEl.classList.remove('visible');
        this.isWaitingChoice = false;

        if (node.atmosphere) atmosphereEl.textContent = node.atmosphere;

        // 说话者
        if (node.speaker) {
            speakerEl.textContent = node.speaker;
            speakerEl.className = 'dialogue-speaker visible';
        } else {
            speakerEl.textContent = '';
            speakerEl.className = 'dialogue-speaker';
        }

        // 演出指令
        if (node.effect === 'shake') Effects.shake();
        if (node.effect === 'flash') Effects.flash();
        if (node.effect === 'particles') {
            Effects.spawnLogosParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
        }

        // 角色登场卡
        if (node.characterCard) {
            await Effects.showCharacterCard(
                node.characterCard.name,
                node.characterCard.nameEn,
                node.characterCard.source
            );
        }

        // 全屏文字
        if (node.fullscreen) {
            await Effects.showFullscreenText(node.fullscreen, node.fullscreenDuration || 3000);
        }

        // 音效
        if (node.sound === 'impact') AudioManager.playImpact();
        if (node.sound === 'click') AudioManager.playClick();
        if (node.bgm === 'tense') AudioManager.playTenseBGM();
        if (node.bgm === 'dialogue') AudioManager.playDialogueBGM();
        if (node.bgm === 'explore') AudioManager.playExplorationBGM();

        // 打字
        this.isTyping = true;
        const speed = this.gameState?.settings?.textSpeed || 'normal';
        await Effects.typeText(textEl, node.text, speed);
        this.isTyping = false;

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

            const locked = (choice.requiredDeaths && this.gameState.deathCount < choice.requiredDeaths)
                || (choice.requiredFlag && !this.gameState.flags[choice.requiredFlag]);

            if (locked) {
                btn.classList.add('locked');
                const hint = choice.requiredDeaths
                    ? `[需死亡 ${choice.requiredDeaths} 次]`
                    : `[未解锁]`;
                btn.setAttribute('data-lock-hint', hint);
                btn.textContent = choice.text;
            } else {
                btn.textContent = choice.text;
                btn.addEventListener('click', () => {
                    AudioManager.playClick();
                    this.selectChoice(choice);
                });
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
        if (choice.setFlag) this.gameState.flags[choice.setFlag] = true;
        if (choice.bondChange) {
            for (const [k, v] of Object.entries(choice.bondChange)) {
                if (this.gameState.bonds[k] !== undefined) this.gameState.bonds[k] += v;
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

        const node = this.currentScript[this.currentIndex];
        // 检查 next 跳转
        if (node && node.next !== undefined && !node.choices) {
            this.currentIndex = node.next;
        } else {
            this.currentIndex++;
        }
        this.showCurrent();
    }
};
