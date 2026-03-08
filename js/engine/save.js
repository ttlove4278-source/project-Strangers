/**
 * 世纪末异邦人 — 存档系统
 */

const SaveManager = {
    SAVE_KEY: 'century_end_strangers_save',

    defaultData() {
        return {
            deathCount: 0,
            currentChapter: 'chapter1',
            currentScene: 'awakening',
            currentLocation: 'teibow',
            currentDay: '1999-07-13',
            currentTime: '15:42',
            currentTemp: 37.5,

            player: {
                name: '夏目珀',
                logos: 4.2,
                maxLogos: 10,
                quotes: [],
            },

            dialectics: [],

            bonds: {
                mikuriya: 0,
                takashiro: 0,
                kuga: 0,
                horita: 0,
                fujimori: 0,
            },

            flags: {},
            visitedLocations: ['teibow'],
            unlockedLocations: ['teibow', 'school', 'vendingMachine'],
            completedEvents: [],

            deathMemories: [],

            settings: {
                textSpeed: 'normal',
                bgmVolume: 0.5,
                seVolume: 0.7,
            },

            totalPlayTime: 0,
            lastSaved: null,
        };
    },

    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('[SaveManager] 读取失败:', e);
            return null;
        }
    },

    save(data) {
        try {
            data.lastSaved = Date.now();
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('[SaveManager] 保存失败:', e);
        }
    },

    createNew() {
        const data = this.defaultData();
        this.save(data);
        return data;
    },

    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    deathReset(data, deathMemory) {
        const preserved = {
            deathCount: data.deathCount + 1,
            dialectics: [...data.dialectics],
            bonds: { ...data.bonds },
            deathMemories: [...data.deathMemories, deathMemory],
            settings: { ...data.settings },
            totalPlayTime: data.totalPlayTime,
            completedEvents: [...data.completedEvents],
            visitedLocations: [...data.visitedLocations],
        };

        const fresh = this.defaultData();
        return { ...fresh, ...preserved };
    },

    clear() {
        localStorage.removeItem(this.SAVE_KEY);
    }
};
