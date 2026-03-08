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
            timeOfDay: 'day',
            dayIndex: 0,
            player: { name: '夏目珀', logos: 4.2, maxLogos: 10, quotes: [] },
            dialectics: [],
            bonds: { mikuriya: 0, takashiro: 0, kuga: 0, horita: 0, fujimori: 0 },
            flags: {},
            visitedLocations: ['teibow'],
            unlockedLocations: ['teibow', 'school', 'vendingMachine'],
            completedEvents: [],
            deathMemories: [],
            settings: { textSpeed: 'normal', bgmVolume: 0.5, seVolume: 0.7 },
            totalPlayTime: 0,
            lastSaved: null,
        };
    },
    load() {
        try { const r = localStorage.getItem(this.SAVE_KEY); return r ? JSON.parse(r) : null; }
        catch(e) { return null; }
    },
    save(data) {
        try { data.lastSaved = Date.now(); localStorage.setItem(this.SAVE_KEY, JSON.stringify(data)); }
        catch(e) {}
    },
    createNew() { const d = this.defaultData(); this.save(d); return d; },
    hasSave() { return localStorage.getItem(this.SAVE_KEY) !== null; },
    deathReset(data, mem) {
        const p = {
            deathCount: data.deathCount + 1,
            dialectics: [...data.dialectics],
            bonds: { ...data.bonds },
            deathMemories: [...data.deathMemories, mem],
            settings: { ...data.settings },
            totalPlayTime: data.totalPlayTime,
            completedEvents: [...(data.completedEvents || [])],
            visitedLocations: [...(data.visitedLocations || [])],
        };
        return { ...this.defaultData(), ...p };
    },
    clear() { localStorage.removeItem(this.SAVE_KEY); }
};
