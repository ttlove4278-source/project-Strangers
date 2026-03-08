/**
 * 世纪末异邦人 — 探索系统（完整版）
 */

const ExplorationEngine = {
    gameState: null,
    currentLocation: null,

    init(gameState) {
        this.gameState = gameState;
    },

    async enter(locationId) {
        locationId = locationId || this.gameState.currentLocation || 'teibow';
        if (SceneManager.getCurrentId() !== 'exploration-screen') {
            await SceneManager.switchTo('exploration-screen', 'fade');
            await Effects.wait(200);
        }
        this.loadLocation(locationId);
    },

    async loadLocation(locationId) {
        const loc = LocationData[locationId];
        if (!loc) return;

        this.currentLocation = loc;
        this.gameState.currentLocation = locationId;

        if (SceneManager.getCurrentId() === 'exploration-screen') {
            await Transitions.locationChange();
        }

        this.updateHeader(loc);
        this.updateNarrative(loc);
        this.updateActions(loc);
        this.updateNavigation(loc);
        this.updateBottomBar();

        if (!this.gameState.visitedLocations.includes(locationId)) {
            this.gameState.visitedLocations.push(locationId);
        }

        SaveManager.save(this.gameState);
    },

    updateHeader(loc) {
        const tod = this.gameState.timeOfDay;
        let desc = loc.desc;
        if (tod === 'evening' && loc.descEvening) desc = loc.descEvening;
        if (tod === 'night' && loc.descNight) desc = loc.descNight;

        document.getElementById('location-name').textContent = loc.name;
        document.getElementById('location-desc').textContent = desc;

        Effects.updateStatusBar(
            this.formatDate(this.gameState.currentDay),
            this.gameState.currentTime,
            this.gameState.currentTemp
        );
    },

    updateNarrative(loc) {
        const area = document.getElementById('narrative-area');
        area.innerHTML = '';

        let eventNarrative = null;
        if (loc.events) {
            for (const [key, event] of Object.entries(loc.events)) {
                if (key === 'idle') continue;
                if (event.condition && event.condition(this.gameState)) {
                    eventNarrative = event;
                    if (event.onComplete) event.onComplete(this.gameState);
                    break;
                }
            }
        }

        if (!eventNarrative && loc.events && loc.events.idle) {
            eventNarrative = loc.events.idle;
        }

        if (eventNarrative && eventNarrative.narrative) {
            eventNarrative.narrative.forEach((text, i) => {
                const p = document.createElement('p');
                p.className = 'narrative-paragraph narrative-text';
                p.textContent = text;
                p.style.animationDelay = (i * 0.12) + 's';
                area.appendChild(p);
            });
        }
    },

    updateActions(loc) {
        const area = document.getElementById('choices-area');
        area.innerHTML = '';
        if (!loc.actions) return;

        let index = 0;
        loc.actions.forEach((action) => {
            if (action.condition && !action.condition(this.gameState)) return;

            const btn = document.createElement('button');
            btn.className = 'action-btn';
            if (action.important) btn.classList.add('important');
            btn.textContent = action.text;
            btn.style.animationDelay = (index * 0.06) + 's';
            btn.classList.add('fade-in-up');

            btn.addEventListener('click', () => this.executeAction(action));
            area.appendChild(btn);
            index++;
        });
    },

    async executeAction(action) {
        // 特殊场景：御厨光初次相遇
        if (action.scene === 'talk_mikuriya_first') {
            await this.triggerMikuriyaMeeting();
            return;
        }

        // 特殊场景：御厨光第二天深谈
        if (action.scene === 'talk_mikuriya_day2') {
            await this.playScript(StoryScripts.talk_mikuriya_day2, () => {
                this.gameState.flags.mikuriya_day2_talked = true;
                this.gameState.flags.mikuriya_revealed_truth = true;
                // 解锁神社和便利店
                if (!this.gameState.unlockedLocations.includes('shrine')) {
                    this.gameState.unlockedLocations.push('shrine');
                }
                if (!this.gameState.unlockedLocations.includes('convenience')) {
                    this.gameState.unlockedLocations.push('convenience');
                }
                Effects.notify('真相の一端に触れた', 2000);
            });
            return;
        }

        // 特殊场景：边沁遭遇
        if (action.scene === 'approach_bentham') {
            await this.playScript(StoryScripts.approach_bentham, () => {
                this.gameState.flags.bentham_confronted = true;
                this.gameState.flags.nine_contact = true;
                Effects.notify('九課と接触した', 2000);
            });
            return;
        }

        // 特殊场景：跟随高城黎
        if (action.scene === 'follow_takashiro') {
            await this.playScript(StoryScripts.follow_takashiro, () => {
                this.gameState.flags.talked_takashiro_school = true;
                // 解锁神社
                if (!this.gameState.unlockedLocations.includes('shrine')) {
                    this.gameState.unlockedLocations.push('shrine');
                }
                Effects.notify('高城黎を記録した', 2000);
            });
            return;
        }

        // 特殊场景：堤防傍晚御厨光
        if (action.scene === 'teibow_evening_mikuriya') {
            await this.playScript(StoryScripts.teibow_evening_mikuriya, () => {
                this.gameState.flags.evening_mikuriya_teibow = true;
                Effects.notify('距離が近づいた', 2000);
            });
            return;
        }

        // 特殊场景：星期四孩子们
        if (action.scene === 'thursday_kids') {
            await this.playScript(StoryScripts.thursday_kids, () => {
                this.gameState.flags.saw_thursday_kids = true;
            });
            return;
        }

        // 通用脚本
        const script = StoryScripts[action.scene];
        if (script) {
            await this.playScript(script, () => {
                if (action.effect) action.effect(this.gameState);
                if (action.setFlag) this.gameState.flags[action.setFlag] = true;
            });
        }
    },

    async playScript(script, onComplete) {
        await DialogueEngine.play(script, () => {
            if (onComplete) onComplete();
            SaveManager.save(this.gameState);
            this.enter(this.gameState.currentLocation);
        });
    },

    updateNavigation(loc) {
        const area = document.getElementById('nav-area');
        area.innerHTML = '';
        if (!loc.connections) return;

        const hint = document.createElement('div');
        hint.className = 'location-event-hint';
        hint.textContent = '移动';
        area.appendChild(hint);

        loc.connections.forEach((connId) => {
            if (!this.gameState.unlockedLocations.includes(connId)) return;
            const connLoc = LocationData[connId];
            if (!connLoc) return;

            const btn = document.createElement('button');
            btn.className = 'nav-btn';

            if (this.hasNewEvent(connId)) btn.classList.add('has-event');
            if (!this.gameState.visitedLocations.includes(connId)) btn.classList.add('new');

            btn.innerHTML = `<span class="nav-icon">→</span> ${connLoc.name}`;
            btn.addEventListener('click', () => {
                this.advanceTime();
                this.loadLocation(connId);
            });
            area.appendChild(btn);
        });
    },

    hasNewEvent(locationId) {
        const loc = LocationData[locationId];
        if (!loc || !loc.events) return false;
        for (const [key, event] of Object.entries(loc.events)) {
            if (key === 'idle') continue;
            if (event.condition && event.condition(this.gameState)) return true;
        }
        return false;
    },

    updateBottomBar() {
        Effects.updateLogos(this.gameState.player.logos, this.gameState.player.maxLogos);
        document.getElementById('death-count-display').textContent = this.gameState.deathCount;
    },

    advanceTime() {
        let [h, m] = this.gameState.currentTime.split(':').map(Number);
        m += 20;
        if (m >= 60) { m -= 60; h += 1; }

        // 日期推进
        if (h >= 24) {
            h = 8;
            this.advanceDay();
        }

        this.gameState.currentTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

        // 时段判断
        if (h >= 6 && h < 16) this.gameState.timeOfDay = 'day';
        else if (h >= 16 && h < 19) this.gameState.timeOfDay = 'evening';
        else this.gameState.timeOfDay = 'night';

        // 温度变化
        if (this.gameState.timeOfDay === 'day') {
            this.gameState.currentTemp = Math.round((36.5 + Math.random() * 2) * 10) / 10;
        } else if (this.gameState.timeOfDay === 'evening') {
            this.gameState.currentTemp = Math.round((32 + Math.random() * 2) * 10) / 10;
        } else {
            this.gameState.currentTemp = Math.round((26 + Math.random() * 3) * 10) / 10;
        }
    },

    advanceDay() {
        this.gameState.dayIndex = (this.gameState.dayIndex || 0) + 1;
        const base = new Date('1999-07-13');
        base.setDate(base.getDate() + this.gameState.dayIndex);
        const y = base.getFullYear();
        const mo = String(base.getMonth() + 1).padStart(2, '0');
        const d = String(base.getDate()).padStart(2, '0');
        this.gameState.currentDay = `${y}-${mo}-${d}`;

        Effects.notify(`${y}.${mo}.${d} — 新的一天`, 2500);
    },

    formatDate(dateStr) {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const d = new Date(dateStr);
        const dayName = days[d.getDay()];
        return dateStr.replace(/-/g, '.') + ` (${dayName})`;
    },

    // 御厨光初次相遇
    async triggerMikuriyaMeeting() {
        const script = [
            { speaker: null, text: '图书馆的角落。最里面的书架旁边。', atmosphere: '空调声。翻页声。很远的蝉鸣。' },
            { speaker: null, text: '一个女生坐在地上，靠着书架。膝盖上放着一本打开的书。' },
            { speaker: null, text: '黑发齐肩，低马尾。碎发很多。书包上挂着一个塑料海豚——磨损很严重，漆都掉了。' },
            { speaker: null, text: '她在看什么？\n——《国家》。柏拉图。' },
            { speaker: null, text: '她抬起头。浅褐色的瞳孔。\n看了你一秒。又低下头。' },
            {
                speaker: null,
                text: '……\n你应该离开。你和她没有交集。\n二年三组有很多人，你不认识大部分。',
                choices: [
                    { text: '离开。', next: 13 },
                    { text: '「……在看柏拉图？」', bondChange: { mikuriya: 1 }, next: 6 },
                    { text: '（坐在旁边的书架前，不说话）', bondChange: { mikuriya: 2 }, next: 9 },
                ]
            },
            // 6: 搭话
            { speaker: '御厨光', text: '「…………嗯。」' },
            { speaker: null, text: '她的声音很小。像是不习惯被人搭话。' },
            {
                speaker: '御厨光',
                text: '「你也看哲学书吗？」',
                choices: [
                    { text: '「算是吧。加缪。」', bondChange: { mikuriya: 1 }, next: 15 },
                    { text: '「不看。只是路过。」', next: 13 },
                ]
            },
            // 9: 坐在旁边
            { speaker: null, text: '你靠着对面的书架坐下来。\n没有说话。她也没有说话。' },
            { speaker: null, text: '空调声。翻页声。\n时间过去了——也许五分钟，也许半小时。' },
            { speaker: '御厨光', text: '「……你不问我在看什么吗？」' },
            {
                speaker: null,
                text: '她的声音比你想象的要轻。像是在确认你真的在那里。',
                choices: [
                    { text: '「不想看就不看。」', bondChange: { mikuriya: 3 }, setFlag: 'said_dont_look', next: 15 },
                    { text: '「在看柏拉图？」', bondChange: { mikuriya: 1 }, next: 15 },
                ]
            },
            // 13: 离开
            { speaker: null, text: '你转身离开。\n她的视线在你背后停留了一秒。\n然后，翻页声又响了。' },
            {
                speaker: null,
                text: '——你错过了什么。\n但你不知道你错过了什么。'
            },
            // 15: 对话展开
            { speaker: null, text: '她抬起头，看了你一眼。\n这一次看得久了一点。' },
            { speaker: '御厨光', text: '「柏拉图说——我们看见的一切都是影子。」' },
            { speaker: '御厨光', text: '「我从小就觉得……这个世界像投影。走在路上，忽然觉得一切都不太真实。」' },
            { speaker: null, text: '她把书合上。塑料海豚挂件晃了一下。' },
            {
                speaker: '御厨光',
                text: '「你呢？你觉得……这个世界是真的吗？」',
                choices: [
                    { text: '「不知道。但蝉鸣是真的。」', bondChange: { mikuriya: 2 }, next: 20 },
                    { text: '「真不真的，都得活下去。」', bondChange: { mikuriya: 1 }, next: 22 },
                    { text: '「我死过327次了。每一次都很真实。」', requiredDeaths: 5, bondChange: { mikuriya: 5 }, setFlag: 'told_mikuriya_deaths', next: 24 },
                ]
            },
            // 20
            { speaker: null, text: '她愣了一下。然后——笑了。\n很小的笑。嘴角微微抬起。' },
            { speaker: '御厨光', text: '「蝉鸣……嗯。蝉鸣是真的。」', next: 27 },
            // 22
            { speaker: null, text: '她没有笑，但点了一下头。' },
            { speaker: '御厨光', text: '「嗯……也是。」', next: 27 },
            // 24
            { speaker: null, text: '她的瞳孔微微放大。\n然后——缩小。像是在确认什么。', effect: 'particles' },
            { speaker: '御厨光', text: '「…………你也是，论证者？」' },
            { speaker: null, text: '这个词。你第一次听到。\n但你知道她在说什么。', next: 27 },
            // 27: 汇合
            { speaker: null, text: '窗外的蝉叫了。叫声从远处涌进来，又退回去。\n空调的指示灯在闪。26度。' },
            { speaker: '御厨光', text: '「我叫御厨光。二年三组。」' },
            {
                speaker: '御厨光',
                text: '「……你明天还会来图书馆吗？」',
                choices: [
                    { text: '「也没什么别的事可做。」', bondChange: { mikuriya: 2 }, setFlag: 'promised_library' },
                    { text: '「会来的。」', bondChange: { mikuriya: 2 }, setFlag: 'promised_library' },
                    { text: '「明天还活着的话。」', bondChange: { mikuriya: 3 }, setFlag: 'promised_library' },
                ]
            },
            { speaker: null, text: '她点了一下头。\n低下头，重新打开书。' },
            { speaker: null, text: '但这一次——你注意到——\n她的嘴角，还维持着刚才那个很小的弧度。' },
            { speaker: null, text: '…………' },
            { speaker: null, text: '图书馆的空调声。翻页声。蝉鸣。\n这些是真的。\n——也许。' },
        ];

        await DialogueEngine.play(script, () => {
            this.gameState.flags.talked_mikuriya = true;
            this.gameState.flags.met_mikuriya = true;

            if (!this.gameState.unlockedLocations.includes('stationPlaza')) {
                this.gameState.unlockedLocations.push('stationPlaza');
            }
            if (!this.gameState.unlockedLocations.includes('bridge')) {
                this.gameState.unlockedLocations.push('bridge');
            }

            Effects.notify('御厨光を記録した', 2000);
            SaveManager.save(this.gameState);
            this.enter(this.gameState.currentLocation);
        });
    }
};
