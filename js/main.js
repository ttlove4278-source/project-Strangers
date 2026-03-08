/**
 * 世纪末异邦人
 * STRANGERS AT THE END OF THE CENTURY
 * 1999 · 夏 · 推石头的人们
 */

const Game = {
    state: null,

    async init() {
        console.log('=== 世紀末異邦人 ===');
        console.log('1999.7.13 — 蝉在叫。');

        SceneManager.init();

        this.state = SaveManager.load() || SaveManager.defaultData();

        DialogueEngine.init(this.state);
        ExplorationEngine.init(this.state);

        this.updateTitleScreen();

        document.getElementById('title-screen').classList.add('active');
        SceneManager.currentScreen = document.getElementById('title-screen');

        this.bindMenuEvents();
        this.bindFirstClick();
    },

    updateTitleScreen() {
        Effects.setDeathCounter(this.state.deathCount);

        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn) {
            const hasProgress = this.state.flags.awakening_complete;
            continueBtn.disabled = !hasProgress;
        }
    },

    bindMenuEvents() {
        document.querySelectorAll('.menu-item').forEach(btn => {
            btn.addEventListener('click', async () => {
                const action = btn.dataset.action;
                switch (action) {
                    case 'new-game':
                        await this.startNewGame();
                        break;
                    case 'continue':
                        await this.continueGame();
                        break;
                    case 'death-memory':
                        this.showDeathMemories();
                        break;
                    case 'settings':
                        Effects.notify('设定功能 — 开发中', 1500);
                        break;
                }
            });
        });
    },

    bindFirstClick() {
        const handler = () => {
            AudioManager.init();
            AudioManager.playCicada();
            AudioManager.playCRTHum();
            document.removeEventListener('click', handler);
            document.removeEventListener('keydown', handler);
        };
        document.addEventListener('click', handler);
        document.addEventListener('keydown', handler);
    },

    async startNewGame() {
        this.state = SaveManager.createNew();
        DialogueEngine.gameState = this.state;
        ExplorationEngine.gameState = this.state;

        await DialogueEngine.play(Chapter1.awakening, () => {
            this.onAwakeningComplete();
        });
    },

    async continueGame() {
        if (!this.state || !this.state.flags.awakening_complete) {
            await this.startNewGame();
            return;
        }

        ExplorationEngine.gameState = this.state;
        DialogueEngine.gameState = this.state;
        await ExplorationEngine.enter(this.state.currentLocation);
    },

    async onAwakeningComplete() {
        this.state.flags.awakening_complete = true;
        this.state.currentScene = 'exploration';

        // 解锁初始地点
        this.state.unlockedLocations = ['teibow', 'vendingMachine', 'school'];

        SaveManager.save(this.state);

        // 通知
        await Effects.wait(300);
        Effects.notify('序章「觉醒」完了', 2000);
        await Effects.wait(800);

        // 进入探索
        await ExplorationEngine.enter('teibow');
    },

    showDeathMemories() {
        if (!this.state.deathMemories || this.state.deathMemories.length === 0) {
            Effects.notify('死亡记忆为空。还没有死过。', 2000);
            return;
        }
        Effects.notify(`死亡记忆: ${this.state.deathMemories.length} 件`, 2000);
    },

    async handleDeath(memory = '未记录') {
        this.state = SaveManager.deathReset(this.state, {
            scene: this.state.currentScene,
            location: this.state.currentLocation,
            memory: memory,
            timestamp: Date.now()
        });

        DialogueEngine.gameState = this.state;
        ExplorationEngine.gameState = this.state;

        await Transitions.deathReset(this.state.deathCount);

        this.updateTitleScreen();
        await SceneManager.switchTo('title-screen', 'fade');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
