/**
 * 世纪末异邦人 — 转场动画
 */

const Transitions = {

    async crtOff() {
        const el = document.querySelector('.crt-shutdown');
        if (!el) return;
        el.style.opacity = '1';
        el.classList.add('active');
        await Effects.wait(800);
        el.classList.remove('active');
        el.style.opacity = '0';
    },

    async crtOn() {
        await Effects.wait(200);
    },

    async fadeOut(duration = 500) {
        const current = document.querySelector('.screen.active');
        if (current) {
            current.style.transition = `opacity ${duration}ms var(--ease-in-out)`;
            current.style.opacity = '0';
            await Effects.wait(duration);
            current.style.transition = '';
            current.style.opacity = '';
        }
    },

    async fadeIn(duration = 500) {
        await Effects.wait(50);
    },

    // 地点切换（轻量转场）
    async locationChange() {
        const content = document.querySelector('.exploration-content');
        if (!content) return;

        content.style.transition = 'opacity 0.25s';
        content.style.opacity = '0';
        await Effects.wait(280);
        content.style.opacity = '1';
        await Effects.wait(280);
        content.style.transition = '';
    },

    // 死亡重置转场
    async deathReset(deathCount) {
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

        overlay.style.background = 'var(--color-black)';
        overlay.style.opacity = '1';
        overlay.innerHTML = `
            <div style="
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                height: 100%; color: var(--color-red);
                font-family: 'Source Code Pro', monospace;
            ">
                <div style="font-size: 0.7rem; letter-spacing: 0.3em; margin-bottom: 16px; opacity: 0.6;">
                    DEATH COUNT
                </div>
                <div style="font-size: 4rem; font-weight: 300;">
                    ${String(deathCount).padStart(3, '0')}
                </div>
                <div style="font-size: 0.7rem; letter-spacing: 0.2em; margin-top: 24px; opacity: 0.4;">
                    记忆已保存。石头在山脚。
                </div>
            </div>
        `;

        await Effects.wait(2500);
        overlay.style.transition = 'opacity 0.6s';
        overlay.style.opacity = '0';
        await Effects.wait(700);
        overlay.remove();
    }
};
