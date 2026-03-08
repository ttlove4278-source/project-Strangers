/**
 * 世纪末异邦人 — 场景管理器
 */

const SceneManager = {
    currentScreen: null,
    screens: {},
    transitioning: false,

    init() {
        document.querySelectorAll('.screen').forEach(el => {
            this.screens[el.id] = el;
        });
    },

    async switchTo(screenId, transition = 'crt') {
        if (this.transitioning) return;
        const target = this.screens[screenId];
        if (!target || this.currentScreen === target) return;
        this.transitioning = true;

        const fromId = this.currentScreen ? this.currentScreen.id : null;

        if (transition === 'crt' && this.currentScreen) {
            await Transitions.crtOff();
        } else if (transition === 'fade' && this.currentScreen) {
            await Transitions.fadeOut(400);
        }

        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        target.classList.add('active');
        this.currentScreen = target;

        // 音乐过渡
        Transitions.sceneTransition(fromId, screenId);

        await Effects.wait(100);
        if (transition === 'crt') await Transitions.crtOn();

        this.transitioning = false;
    },

    getCurrentId() {
        return this.currentScreen ? this.currentScreen.id : null;
    }
};
