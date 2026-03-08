/**
 * 世纪末异邦人
 * 1999 · 夏 · 推石头的人们
 */

const Game = {
    state: null,

    async init() {
        console.log('=== 世紀末異邦人 ===');
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
        const btn = document.getElementById('btn-continue');
        if (btn) btn.disabled = !this.state.flags.awakening_complete;
    },

    bindMenuEvents() {
        document.querySelectorAll('.menu-item').forEach(btn => {
            btn.addEventListener('click', async () => {
                AudioManager.playClick();
                switch (btn.dataset.action) {
                    case 'new-game': await this.startNewGame(); break;
                    case 'continue': await this.continueGame(); break;
                    case 'death-memory': this.showDeathMemories(); break;
                    case 'settings': Effects.notify('设定 — 开发中', 1500); break;
                }
            });
        });
    },

    bindFirstClick() {
        const handler = () => {
            AudioManager.init();
            AudioManager.playCicada();
            AudioManager.playCRTHum();
            AudioManager.playWind();
            AudioManager.playTitleBGM();
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

        // 章节标题卡
        await Effects.showChapterCard(
            'CHAPTER 01',
            '世紀末の異邦人',
            '1999.7.13 — 蝉在叫。石头在山脚。'
        );

        await DialogueEngine.play(Chapter1.awakening, () => {
            this.onAwakeningComplete();
        });
    },

    async continueGame() {
        if (!this.state || !this.state.flags.awakening_complete) {
            await this.startNewGame();
            return;
        }
        DialogueEngine.gameState = this.state;
        ExplorationEngine.gameState = this.state;
        await ExplorationEngine.enter(this.state.currentLocation);
    },

    async onAwakeningComplete() {
        this.state.flags.awakening_complete = true;
        this.state.currentScene = 'exploration';
        this.state.timeOfDay = 'day';
        this.state.dayIndex = 0;
        this.state.unlockedLocations = ['teibow', 'vendingMachine', 'school'];
        SaveManager.save(this.state);

        await Effects.showFullscreenText(
            '蝉在叫。太阳不会落。<br>你开始推石头。',
            2500
        );

        await ExplorationEngine.enter('teibow');
    },

    showDeathMemories() {
        if (!this.state.deathMemories || !this.state.deathMemories.length) {
            Effects.notify('死亡记忆为空', 2000);
            return;
        }
        Effects.notify(`死亡记忆: ${this.state.deathMemories.length} 件`, 2000);
    },

    async handleDeath(memory = '未记录') {
        this.state = SaveManager.deathReset(this.state, {
            scene: this.state.currentScene,
            location: this.state.currentLocation,
            memory, timestamp: Date.now()
        });
        DialogueEngine.gameState = this.state;
        ExplorationEngine.gameState = this.state;
        await Transitions.deathReset(this.state.deathCount);
        this.updateTitleScreen();
        await SceneManager.switchTo('title-screen', 'fade');
    }
};

document.addEventListener('DOMContentLoaded', () => Game.init());
