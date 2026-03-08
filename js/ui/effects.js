/**
 * 世纪末异邦人 — UI特效
 */

const Effects = {

    // 打字机效果
    async typeText(element, text, speed = 'normal') {
        const speeds = {
            slow: 60,
            normal: 35,
            fast: 15,
            instant: 0,
        };

        const delay = speeds[speed] || speeds.normal;

        element.textContent = '';

        if (delay === 0) {
            element.textContent = text;
            return;
        }

        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];

            // 标点符号额外停顿
            const char = text[i];
            let pause = delay;
            if ('。、！？—…'.includes(char)) {
                pause = delay * 4;
            } else if ('，；：'.includes(char)) {
                pause = delay * 2;
            } else if (char === '「' || char === '」') {
                pause = delay * 2;
            }

            await this.wait(pause);
        }
    },

    // 设置死亡计数器显示
    setDeathCounter(count) {
        const str = String(count).padStart(3, '0');
        for (let i = 0; i < 3; i++) {
            const digit = document.getElementById(`digit-${i}`);
            if (digit) {
                digit.textContent = str[i];
            }
        }
    },

    // 逻各斯条更新
    updateLogos(current, max) {
        const fill = document.getElementById('logos-fill');
        const value = document.getElementById('logos-value');
        if (fill) {
            fill.style.width = `${(current / max) * 100}%`;
        }
        if (value) {
            value.textContent = `${current.toFixed(1)} 赫`;
        }
    },

    // 画面震动
    shake(element = document.body) {
        element.classList.add('screen-shake');
        setTimeout(() => element.classList.remove('screen-shake'), 300);
    },

    // 逻各斯粒子
    spawnLogosParticles(x, y, count = 5) {
        const chars = '存在虚无意义荒谬自由命题逻各斯深渊超人理性洞穴';

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('span');
            particle.className = 'logos-particle';
            particle.textContent = chars[Math.floor(Math.random() * chars.length)];
            particle.style.left = (x + (Math.random() - 0.5) * 60) + 'px';
            particle.style.top = (y + (Math.random() - 0.5) * 30) + 'px';
            particle.style.animationDelay = (Math.random() * 0.5) + 's';

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 2500);
        }
    },

    // 通用等待
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
