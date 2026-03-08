/**
 * 世纪末异邦人 — 转场动画
 */

const Transitions = {

    // CRT关机效果
    async crtOff() {
        const el = document.querySelector('.crt-shutdown');
        if (!el) return;

        el.style.opacity = '1';
        el.classList.add('active');

        await Effects.wait(800);

        el.classList.remove('active');
        el.style.opacity = '0';
    },

    // CRT开机效果
    async crtOn() {
        // 简单的淡入
        await Effects.wait(200);
    },

    // 淡出
    async fadeOut(duration = 500) {
        const current = document.querySelector('.screen.active');
        if (current) {
            current.style.transition = `opacity ${duration}ms`;
            current.style.opacity = '0';
            await Effects.wait(duration);
        }
    },

    // 淡入
    async fadeIn(duration = 500) {
        const current = document.querySelector('.screen.active');
        if (current) {
            current.style.transition = `opacity ${duration}ms`;
            current.style.opacity = '1';
            await Effects.wait(duration);
        }
    },

    // 死亡重置专用转场
    async deathReset(deathCount) {
        // 画面变红
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--color-red); z-index: 9999;
            opacity: 0; transition: opacity 0.3s;
        `;
        document.body.appendChild(overlay);

        await Effects.wait(50);
        overlay.style.opacity = '0.8';
        Effects.shake();

        await Effects.wait(500);

        // 显示死亡计数
        overlay.style.background = 'var(--color-black)';
        overlay.style.opacity = '1';
        overlay.innerHTML = `
            <div style="
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                height: 100%; color: var(--color-red);
                font-family: var(--font-mono);
            ">
                <div style="font-size: 0.7rem; letter-spacing: 0.3em; margin-bottom: 16px;">
                    DEATH COUNT
                </div>
                <div style="font-size: 4rem; font-weight: 300;">
                    ${String(deathCount).padStart(3, '0')}
                </div>
                <div style="font-size: 0.7rem; letter-spacing: 0.2em; margin-top: 24px; opacity: 0.5;">
                    记忆已保存。石头在山脚。
                </div>
            </div>
        `;

        await Effects.wait(2000);

        // CRT雪花
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.opacity = '0';

        await Effects.wait(600);
        overlay.remove();
    }
};
