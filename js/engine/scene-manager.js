/**
 * 世纪末异邦人 — 场景管理器
 */

const SceneManager = {
    currentScreen: null,
    screens: {},

    init() {
        // 注册所有屏幕
        document.querySelectorAll('.screen').forEach(el => {
            this.screens[el.id] = el;
        });
        console.log('[SceneManager] 已注册屏幕:', Object.keys(this.screens));
    },

    // 切换屏幕
    async switchTo(screenId, transition = 'crt') {
        const target = this.screens[screenId];
        if (!target) {
            console.warn('[SceneManager] 未找到屏幕:', screenId);
            return;
        }

        if (this.currentScreen === target) return;

        // 执行转场
        if (transition === 'crt') {
            await Transitions.crtOff();
        } else if (transition === 'fade') {
            await Transitions.fadeOut();
        }

        // 切换
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        target.classList.add('active');
        this.currentScreen = target;

        // 转场结束
        if (transition === 'crt') {
            await Transitions.crtOn();
        } else if (transition === 'fade') {
            await Transitions.fadeIn();
        }

        console.log('[SceneManager] 切换至:', screenId);
    },

    // 获取当前屏幕ID
    getCurrentId() {
        return this.currentScreen ? this.currentScreen.id : null;
    }
};
