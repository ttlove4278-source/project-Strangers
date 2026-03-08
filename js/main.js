/**
 * 世纪末异邦人
 * STRANGERS AT THE END OF THE CENTURY
 * 1999 · 夏 · 推石头的人们
 *
 * main.js — 游戏入口
 */

const Game = {
    state: null,

    async init() {
        console.log('=== 世纪末异邦人 ===');
        console.log('1999.7.13 — 蝉在叫。');

        // 初始化场景管理器
        SceneManager.init();

        // 加载或创建存档
        this.state = SaveManager.load() || SaveManager.defaultData();

        // 初始化对话引擎
        DialogueEngine.init(this.state);

        // 更新标题画面
        this.updateTitleScreen();

        // 激活标题画面
        document.getElementById('title-screen').classList.add('active');
        SceneManager.currentScreen = document.getElementById('title-screen');

        // 绑定菜单事件
        this.bindMenuEvents();

        // 首次点击初始化音频
        this.bindFirstClick();

        console.log('[Game] 初始化完成');
    },

    updateTitleScreen() {
        // 更新死亡计数器
        Effects.setDeathCounter(this.state.deathCount);

        // 更新继续按钮状态
        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn) {
            continueBtn.disabled = !SaveManager.hasSave() || this.state.deathCount === 0;
        }
    },

    bindMenuEvents() {
        document.querySelectorAll('.menu-item').forEach(btn => {
            btn.addEventListener('click', async (e) => {
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
                        // Phase 后续开发
                        console.log('[Game] 设定画面 - 待开发');
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
        // 新建存档
        this.state = SaveManager.createNew();

        // 播放开场
        await DialogueEngine.play(Chapter1.awakening, () => {
            this.onChapterComplete('awakening');
        });
    },

    async continueGame() {
        if (!this.state) return;

        // 从存档点继续
        const scene = this.state.currentScene;
        const chapter = Chapter1[scene];

        if (chapter) {
            await DialogueEngine.play(chapter, () => {
                this.onChapterComplete(scene);
            });
        }
    },

    onChapterComplete(sceneName) {
        console.log(`[Game] 场景完成: ${sceneName}`);

        // 保存进度
        this.state.currentScene = 'post_' + sceneName;
        SaveManager.save(this.state);

        // 切换到探索界面
        SceneManager.switchTo('exploration-screen', 'fade');
    },

    showDeathMemories() {
        if (this.state.deathMemories.length === 0) {
            console.log('[Game] 没有死亡记忆');
            return;
        }
        // Phase 后续开发
        console.log('[Game] 死亡记忆:', this.state.deathMemories);
    },

    // 死亡处理
    async handleDeath(memory = '未记录') {
        this.state = SaveManager.deathReset(this.state, {
            scene: this.state.currentScene,
            memory: memory,
            timestamp: Date.now()
        });

        await Transitions.deathReset(this.state.deathCount);

        // 返回标题或重新开始
        this.updateTitleScreen();
        await SceneManager.switchTo('title-screen', 'fade');
    }
};

// 启动
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
