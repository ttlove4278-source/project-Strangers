/**
 * 世纪末异邦人 — 对话引擎
 */

const DialogueEngine = {
    currentScript: null,
    currentIndex: 0,
    isTyping: false,
    onComplete: null,
    gameState: null,

    // 初始化
    init(gameState) {
        this.gameState = gameState;

        // 点击/空格继续
        const screen = document.getElementById('dialogue-screen');
        if (screen) {
            screen.addEventListener('click', (e) => {
                // 如果点击的是选项，不处理
                if (e.target.classList.contains('dialogue-choice')) return;
                this.advance();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                if (SceneManager.getCurrentId() === 'dialogue-screen') {
                    e.preventDefault();
                    this.advance();
                }
            }
        });
    },

    // 开始播放脚本
    async play(script, onComplete) {
        this.currentScript = script;
        this.currentIndex = 0;
        this.onComplete = onComplete;

        await SceneManager.switchTo('dialogue-screen', 'fade');
        this.showCurrent();
    },

    // 显示当前节点
    async showCurrent() {
        if (this.currentIndex >= this.currentScript.length) {
            // 脚本结束
            if (this.onComplete) this.onComplete();
            return;
        }

        const node = this.currentScript[this.currentIndex];

        const speakerEl = document.getElementById('dialogue-speaker');
        const textEl = document.getElementById('dialogue-text');
        const choicesEl = document.getElementById('dialogue-choices');
        const continueEl = document.getElementById('dialogue-continue');

        // 清空
        choicesEl.innerHTML = '';
        continueEl.classList.remove('visible');

        // 设置说话者
        if (node.speaker) {
            speakerEl.textContent = node.speaker;
            speakerEl.classList.add('visible');
        } else {
            speakerEl.textContent = '';
            speakerEl.classList.remove('visible');
        }

        // 打字效果
        this.isTyping = true;
        const speed = this.gameState?.settings?.textSpeed || 'normal';
        await Effects.typeText(textEl, node.text, speed);
        this.isTyping = false;

        // 显示选项或继续提示
        if (node.choices && node.choices.length > 0) {
            this.showChoices(node.choices);
        } else {
            continueEl.classList.add('visible');
        }
    },

    // 显示选项
    showChoices(choices) {
        const choicesEl = document.getElementById('dialogue-choices');
        choicesEl.innerHTML = '';

        choices.forEach((choice, index) => {
            const btn = document.createElement('div');
            btn.className = 'dialogue-choice';

            // 检查解锁条件
            if (choice.requiredDeaths && this.gameState.deathCount < choice.requiredDeaths) {
                btn.classList.add('locked');
                btn.setAttribute('data-lock-hint', `[需死亡 ${choice.requiredDeaths} 次]`);
                btn.textContent = choice.text;
            } else {
                btn.textContent = choice.text;
                btn.addEventListener('click', () => {
                    this.selectChoice(choice);
                });
            }

            // 延迟显示（逐个出现）
            btn.style.opacity = '0';
            btn.style.transform = 'translateX(-10px)';
            choicesEl.appendChild(btn);

            setTimeout(() => {
                btn.style.transition = 'all 0.3s var(--ease-out-expo)';
                btn.style.opacity = '';
                btn.style.transform = '';
            }, 200 + index * 100);
        });
    },

    // 选择选项
    selectChoice(choice) {
        // 设置标记
        if (choice.setFlag) {
            this.gameState.flags[choice.setFlag] = true;
        }

        // 修改羁绊
        if (choice.bondChange) {
            for (const [key, val] of Object.entries(choice.bondChange)) {
                if (this.gameState.bonds[key] !== undefined) {
                    this.gameState.bonds[key] += val;
                }
            }
        }

        // 跳转
        if (choice.next !== undefined) {
            this.currentIndex = choice.next;
        } else {
            this.currentIndex++;
        }

        this.showCurrent();
    },

    // 推进（点击/空格）
    advance() {
        if (this.isTyping) {
            // 跳过打字效果
            this.isTyping = false;
            const textEl = document.getElementById('dialogue-text');
            const node = this.currentScript[this.currentIndex];
            if (node && textEl) {
                textEl.textContent = node.text;
            }
            // 显示选项或继续
            if (node.choices && node.choices.length > 0) {
                this.showChoices(node.choices);
            } else {
                document.getElementById('dialogue-continue').classList.add('visible');
            }
            return;
        }

        const node = this.currentScript[this.currentIndex];
        if (node && node.choices && node.choices.length > 0) {
            // 有选项时不自动推进
            return;
        }

        // 下一条
        this.currentIndex++;
        this.showCurrent();
    }
};
