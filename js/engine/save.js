/**
 * 世纪末异邦人 — 存档系统
 * 使用 localStorage 持久化
 */

const SaveManager = {
    SAVE_KEY: 'century_end_strangers_save',

    // 默认存档数据
    defaultData() {
        return {
            // 核心进度
            deathCount: 0,
            currentChapter: 'chapter1',
            currentScene: 'awakening',
            currentDay: '1999-07-13',

            // 角色状态
            player: {
                name: '夏目珀',
                logos: 4.2,
                maxLogos: 10,
                quotes: [], // 引用碎片
            },

            // 辩证反转记录（跨轮回永久）
            dialectics: [],

            // 角色羁绊（跨轮回永久）
            bonds: {
                mikuriya: 0,    // 御厨光
                takashiro: 0,   // 高城黎
                kuga: 0,        // 久我冻夜
                horita: 0,      // 堀田诚
                fujimori: 0,    // 藤森明
            },

            // 事件标记
            flags: {},

            // 死亡记忆（永久保存的死亡场景）
            deathMemories: [],

            // 设定
            settings: {
                textSpeed: 'normal',  // slow / normal / fast
                bgmVolume: 0.5,
                seVolume: 0.7,
            },

            // meta
            totalPlayTime: 0,
            lastSaved: null,
        };
    },

    // 加载存档
    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            return data;
        } catch (e) {
            console.warn('[SaveManager] 读取存档失败:', e);
            return null;
        }
    },

    // 保存
    save(data) {
        try {
            data.lastSaved = Date.now();
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            console.log('[SaveManager] 已保存');
        } catch (e) {
            console.warn('[SaveManager] 保存失败:', e);
        }
    },

    // 新建存档
    createNew() {
        const data = this.defaultData();
        this.save(data);
        return data;
    },

    // 检查是否有存档
    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    // 死亡重置 — 核心肉鸽机制
    deathReset(data, deathMemory) {
        // 保留的数据（跨轮回）
        const preserved = {
            deathCount: data.deathCount + 1,
            dialectics: [...data.dialectics],
            bonds: { ...data.bonds },
            deathMemories: [...data.deathMemories, deathMemory],
            settings: { ...data.settings },
            totalPlayTime: data.totalPlayTime,
        };

        // 重置的数据
        const fresh = this.defaultData();

        // 合并
        const resetData = {
            ...fresh,
            ...preserved,
        };

        this.save(resetData);
        return resetData;
    },

    // 清除存档
    clear() {
        localStorage.removeItem(this.SAVE_KEY);
        console.log('[SaveManager] 存档已清除');
    }
};
