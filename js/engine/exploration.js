const ExplorationEngine = {
    gameState: null,
    currentLocation: null,
    completedActionsThisVisit: [],
    shownActionsEver: {},

    init(gs) {
        this.gameState = gs;
        this.shownActionsEver = gs.flags._shownActions || {};
    },

    async enter(locId) {
        locId = locId || this.gameState.currentLocation || 'teibow';
        this.completedActionsThisVisit = [];
        if (SceneManager.getCurrentId() !== 'exploration-screen') {
            await SceneManager.switchTo('exploration-screen', 'fade');
            await Effects.wait(200);
        }
        this.loadLocation(locId);
    },

    async loadLocation(locId) {
        const loc = LocationData[locId];
        if (!loc) return;
        this.currentLocation = loc;
        this.gameState.currentLocation = locId;
        this.completedActionsThisVisit = [];

        const screen = document.getElementById('exploration-screen');
        screen.classList.remove('evening', 'night');
        if (this.gameState.timeOfDay === 'evening') screen.classList.add('evening');
        if (this.gameState.timeOfDay === 'night') screen.classList.add('night');

        if (SceneManager.getCurrentId() === 'exploration-screen') {
            await Transitions.locationChange();
        }

        AudioManager.playLocationBGM(locId, this.gameState.timeOfDay);

        this.updateHeader(loc);
        this.updateNarrative(loc);
        this.updateActions(loc);
        this.updateNavigation(loc);
        this.updateBottomBar();
        this.updateCountdownDisplay();
        this.updateAmbientText(loc);

        if (!this.gameState.visitedLocations.includes(locId)) {
            this.gameState.visitedLocations.push(locId);
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

    updateAmbientText(loc) {
        let at = document.querySelector('.ambient-text');
        if (!at) {
            at = document.createElement('div');
            at.className = 'ambient-text';
            document.querySelector('.exploration-content').appendChild(at);
        }
        const texts = {
            teibow: '海', vendingMachine: '光', school: '夏',
            library: '真', stationPlaza: '人', bridge: '沈',
            shrine: '神', convenience: '夜',
        };
        at.textContent = texts[loc.id] || '世';
    },

    updateNarrative(loc) {
        const area = document.getElementById('narrative-area');
        area.innerHTML = '';

        let ev = null;
        if (loc.events) {
            for (const [k, e] of Object.entries(loc.events)) {
                if (k === 'idle') continue;
                if (e.condition && e.condition(this.gameState)) {
                    ev = e;
                    if (e.onComplete) e.onComplete(this.gameState);
                    break;
                }
            }
        }
        if (!ev && loc.events?.idle) ev = loc.events.idle;

        if (ev?.narrative) {
            ev.narrative.forEach((text, i) => {
                const p = document.createElement('p');
                p.className = 'narrative-paragraph narrative-text';
                p.textContent = text;
                p.style.animationDelay = (i * 0.12) + 's';
                area.appendChild(p);
            });
        }

        const hint = this.getStoryHint();
        if (hint) {
            const h = document.createElement('div');
            h.className = 'story-hint';
            h.textContent = hint;
            area.appendChild(h);
        }
    },

    getStoryHint() {
        const s = this.gameState;
        if (!s.flags.teibow_explored) return null;
        if (!s.flags.school_visited) return '——也许该去学校看看。暑假的校舍里，还有人在。';
        if (!s.flags.library_visited && s.unlockedLocations.includes('library'))
            return '——图书馆已经开了。空调26度。凉快。';
        if (s.flags.library_visited && !s.flags.met_mikuriya)
            return '——图书馆的角落似乎有人。';
        if (s.flags.met_mikuriya && !s.flags.talked_mikuriya)
            return '——那个女生……也许可以过去说句话。';
        if (s.flags.talked_mikuriya && !s.flags.station_visited && s.unlockedLocations.includes('stationPlaza'))
            return '——站前广场。有人在发报纸。';
        if (s.flags.talked_mikuriya && !s.flags.bridge_visited && s.unlockedLocations.includes('bridge'))
            return '——旧港高架桥下。有人住在那里。';
        if (s.flags.met_takashiro && !s.flags.talked_takashiro_school)
            return '——高城黎。金发。不可接近。但他看了你一眼。';
        if (s.flags.talked_takashiro_school && !s.flags.shrine_visited && s.unlockedLocations.includes('shrine'))
            return '——「去旧神社看看。」高城黎说。';
        if (s.flags.mikuriya_day2_talk_trigger && !s.flags.mikuriya_day2_talked)
            return '——她在图书馆。和昨天一样的位置。也许该坐过去。';
        if (s.flags.bentham_encounter_ready && !s.flags.bentham_confronted)
            return '——旧神社的石阶上，有人在喃喃自语。空气在扭曲。';
        if (s.flags.bentham_confronted && s.flags.nine_contact && !s.flags.battle_bentham_weak_won && s.dayIndex >= 3)
            return '——旧神社。那个男人还在那里。这次——你要阻止他。';
        if (s.flags.battle_bentham_weak_won && s.dayIndex >= 5 && !s.flags.battle_cultist_scout_won)
            return '——站前广场出现了穿白袍的人。不是好兆头。';
        if (s.flags.battle_bentham_weak_won && s.dayIndex >= 7 && !s.flags.battle_bentham_strong_won)
            return '——旧神社。空气又在扭曲了。比上次更严重。';
        if (s.flags.promised_library && s.timeOfDay === 'evening' && !s.flags.evening_mikuriya_teibow && s.dayIndex >= 1)
            return '——傍晚了。堤防上也许……有人在等。';
        return null;
    },

    updateActions(loc) {
        const area = document.getElementById('choices-area');
        area.innerHTML = '';
        if (!loc.actions) return;

        const label = document.createElement('div');
        label.className = 'choices-label';
        label.textContent = 'ACTIONS';
        area.appendChild(label);

        let idx = 0;
        loc.actions.forEach(action => {
            if (action.condition && !action.condition(this.gameState)) return;
            if (this.completedActionsThisVisit.includes(action.id)) return;

            const btn = document.createElement('button');
            btn.className = 'action-btn';
            if (action.important) btn.classList.add('important');
            btn.textContent = action.text;

            const actionKey = `${loc.id}_${action.id}`;
            if (!this.shownActionsEver[actionKey]) {
                const tag = document.createElement('span');
                tag.className = 'action-new';
                tag.textContent = 'NEW';
                btn.appendChild(tag);
                this.shownActionsEver[actionKey] = true;
                this.gameState.flags._shownActions = this.shownActionsEver;
            }

            btn.style.animationDelay = (idx * 0.06) + 's';
            btn.classList.add('fade-in-up');
            btn.addEventListener('click', () => {
                AudioManager.playClick();
                this.executeAction(action);
            });
            area.appendChild(btn);
            idx++;
        });
    },

    async executeAction(action) {
        this.completedActionsThisVisit.push(action.id);

        const handlers = {
            'talk_mikuriya_first': () => this.triggerMikuriyaMeeting(),
            'talk_mikuriya_day2': () => this.playWithCB(StoryScripts.talk_mikuriya_day2, () => {
                this.gameState.flags.mikuriya_day2_talked = true;
                this.gameState.flags.mikuriya_revealed_truth = true;
                this.unlock(['shrine', 'convenience']);
                Effects.notify('真相の一端に触れた', 2000);
            }),
            'approach_bentham': () => this.playWithCB(StoryScripts.approach_bentham, () => {
                this.gameState.flags.bentham_confronted = true;
                this.gameState.flags.nine_contact = true;
                Effects.notify('九課と接触した', 2000);
            }),
            'follow_takashiro': () => this.playWithCB(StoryScripts.follow_takashiro, () => {
                this.gameState.flags.talked_takashiro_school = true;
                this.unlock(['shrine']);
                Effects.notify('高城黎を記録した', 2000);
            }),
            'teibow_evening_mikuriya': () => this.playWithCB(StoryScripts.teibow_evening_mikuriya, () => {
                this.gameState.flags.evening_mikuriya_teibow = true;
                Effects.notify('距離が近づいた', 2000);
            }),
            'thursday_kids': () => this.playWithCB(StoryScripts.thursday_kids, () => {
                this.gameState.flags.saw_thursday_kids = true;
            }),
            'horita_deep_talk': () => this.playWithCB(StoryScripts.horita_deep_talk, () => {
                this.gameState.flags.horita_deep_done = true;
                Effects.notify('堀田诚の「枷锁」を知った', 2500);
            }),
            'battle_bentham': () => this.triggerBattle('bentham_weak'),
            'battle_bentham_boss': () => this.triggerBattle('bentham_strong'),
            'battle_cultist': () => this.triggerBattle('cultist_scout'),
        };

        if (handlers[action.scene]) { await handlers[action.scene](); return; }

        const script = StoryScripts[action.scene];
        if (script) {
            await this.playWithCB(script, () => {
                if (action.setFlag) this.gameState.flags[action.setFlag] = true;
                if (action.logosGain) {
                    this.gameState.player.logos = Math.min(
                        this.gameState.player.maxLogos,
                        this.gameState.player.logos + action.logosGain
                    );
                }
            });
        }
    },

    async playWithCB(script, cb) {
        await DialogueEngine.play(script, () => {
            if (cb) cb();
            SaveManager.save(this.gameState);
            this.enter(this.gameState.currentLocation);
        });
    },

    async triggerBattle(enemyId) {
        const enemy = EnemyData[enemyId];
        if (!enemy) return;

        BattleEngine.init(this.gameState);
        await BattleEngine.startBattle(enemy, async (result) => {
            if (result === 'win') {
                this.gameState.flags[`battle_${enemyId}_won`] = true;

                if (enemyId === 'bentham_weak') {
                    this.gameState.player.quotes.push(
                        { source: 'BENTHAM', name: '功利反转', effect: '造成2赫伤害', cost: 1.0 }
                    );
                    Effects.notify('引用碎片を獲得：BENTHAM·功利反转', 3000);
                } else if (enemyId === 'bentham_strong') {
                    this.gameState.player.maxLogos += 2;
                    this.gameState.player.logos = this.gameState.player.maxLogos;
                    Effects.notify('逻各斯上限+2　命題が深まった', 3000);
                } else if (enemyId === 'cultist_scout') {
                    this.gameState.player.quotes.push(
                        { source: 'AUGUSTINE', name: '当下', effect: '造成1.5赫伤害', cost: 0.8 }
                    );
                    Effects.notify('引用碎片を獲得：AUGUSTINE·当下', 3000);
                }

                SaveManager.save(this.gameState);
                await Effects.wait(500);
                await this.enter(this.gameState.currentLocation);
            } else {
                await Game.handleDeath(`在与${enemy.name}的战斗中被命题吞噬`);
            }
        });
    },

    updateNavigation(loc) {
        const area = document.getElementById('nav-area');
        area.innerHTML = '';
        if (!loc.connections) return;

        const hint = document.createElement('div');
        hint.className = 'location-event-hint';
        hint.textContent = 'MOVE';
        area.appendChild(hint);

        loc.connections.forEach(cid => {
            if (!this.gameState.unlockedLocations.includes(cid)) return;
            const cl = LocationData[cid];
            if (!cl) return;
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            if (this.hasNewEvent(cid)) btn.classList.add('has-event');
            if (!this.gameState.visitedLocations.includes(cid)) btn.classList.add('new');
            btn.innerHTML = `<span class="nav-icon">→</span> ${cl.name}`;
            btn.addEventListener('click', () => {
                AudioManager.playPageTurn();
                this.advanceTime();
                this.loadLocation(cid);
            });
            area.appendChild(btn);
        });
    },

    hasNewEvent(lid) {
        const loc = LocationData[lid];
        if (!loc?.events) return false;
        for (const [k, e] of Object.entries(loc.events)) {
            if (k === 'idle') continue;
            if (e.condition?.(this.gameState)) return true;
        }
        return false;
    },

    updateBottomBar() {
        Effects.updateLogos(this.gameState.player.logos, this.gameState.player.maxLogos);
        document.getElementById('death-count-display').textContent = this.gameState.deathCount;
    },

    updateCountdownDisplay() {
        if (this.gameState.flags.met_mikuriya) {
            const rem = Math.max(0, 42 - 33 - (this.gameState.dayIndex || 0));
            Effects.updateCountdown(rem);
        } else {
            Effects.updateCountdown(null);
        }
    },

    unlock(ids) {
        ids.forEach(id => {
            if (!this.gameState.unlockedLocations.includes(id)) this.gameState.unlockedLocations.push(id);
        });
    },

    advanceTime() {
        let [h, m] = this.gameState.currentTime.split(':').map(Number);
        m += 20;
        if (m >= 60) { m -= 60; h++; }
        if (h >= 23) { h = 8; this.advanceDay(); }
        this.gameState.currentTime = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;

        if (h >= 6 && h < 16) this.gameState.timeOfDay = 'day';
        else if (h >= 16 && h < 19) this.gameState.timeOfDay = 'evening';
        else this.gameState.timeOfDay = 'night';

        const tempMap = { day: [36.5, 2], evening: [32, 2], night: [26, 3] };
        const [base, range] = tempMap[this.gameState.timeOfDay];
        this.gameState.currentTemp = Math.round((base + Math.random() * range) * 10) / 10;

        this.gameState.player.logos = Math.min(this.gameState.player.maxLogos, this.gameState.player.logos + 0.1);
    },

    async advanceDay() {
        this.gameState.dayIndex = (this.gameState.dayIndex || 0) + 1;
        const base = new Date('1999-07-13');
        base.setDate(base.getDate() + this.gameState.dayIndex);
        const y = base.getFullYear();
        const mo = String(base.getMonth() + 1).padStart(2, '0');
        const d = String(base.getDate()).padStart(2, '0');
        this.gameState.currentDay = `${y}-${mo}-${d}`;

        const days = ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'];
        let rem = null;
        if (this.gameState.flags.met_mikuriya) {
            rem = `御厨光の予後 — 残り ${Math.max(0, 42 - 33 - this.gameState.dayIndex)} 日`;
        }
        await Effects.showDateCard(`${y}.${mo}.${d}`, days[base.getDay()],
            Math.round((36 + Math.random() * 2.5) * 10) / 10, rem);
    },

    formatDate(ds) {
        const days = ['日','月','火','水','木','金','土'];
        const d = new Date(ds);
        return ds.replace(/-/g, '.') + ` (${days[d.getDay()]})`;
    },

    async triggerMikuriyaMeeting() {
        await Effects.showCharacterCard('御厨 光', 'Mikuriya Hikaru', '柏拉图 —「世界是投影。」');

        const script = [
            { speaker: null, text: '图书馆的角落。最里面的书架旁边。', atmosphere: '空调声。翻页声。很远的蝉鸣。' },
            { speaker: null, text: '一个女生坐在地上，靠着书架。膝盖上放着一本打开的书。' },
            { speaker: null, text: '黑发齐肩，低马尾。碎发很多。校服裙子的褶皱在膝盖那里展开。书包上挂着一个塑料海豚——磨损很严重，漆都掉了，只剩模糊的蓝色轮廓。' },
            { speaker: null, text: '她在看什么？\n——《国家》。柏拉图。翻到了洞穴寓言那一节。' },
            { speaker: null, text: '她抬起头。浅褐色的瞳孔。\n看了你一秒。不是惊讶。也不是戒备。\n是——确认。确认你是真的，不是影子。\n然后又低下头。' },
            {
                speaker: null,
                text: '……\n你应该离开。你和她没有交集。\n二年三组有37个人，你不认识其中的大部分。',
                choices: [
                    { text: '离开。', next: 13 },
                    { text: '「……在看柏拉图？」', bondChange: { mikuriya: 1 }, next: 7 },
                    { text: '（坐在旁边的书架前，不说话）', bondChange: { mikuriya: 2 }, next: 10 },
                ]
            },
            // 7
            { speaker: '御厨光', text: '「…………嗯。」' },
            { speaker: null, text: '她的声音很小。不是害羞。是习惯了不被听见。' },
            {
                speaker: '御厨光', text: '「你也看哲学书吗？」',
                choices: [
                    { text: '「算是吧。加缪。」', bondChange: { mikuriya: 1 }, next: 15 },
                    { text: '「不看。只是路过。」', next: 13 },
                ]
            },
            // 10
            { speaker: null, text: '你靠着对面的书架坐下来。地板凉的。空调的风从头顶吹过。' },
            { speaker: null, text: '没有说话。她也没有说话。时间过去了——也许五分钟，也许半小时。' },
            { speaker: '御厨光', text: '「……你不问我在看什么吗？」' },
            {
                speaker: null, text: '她的声音比你想象的要轻。',
                choices: [
                    { text: '「不想看就不看。」', bondChange: { mikuriya: 3 }, setFlag: 'said_dont_look', next: 15 },
                    { text: '「在看柏拉图？」', bondChange: { mikuriya: 1 }, next: 15 },
                ]
            },
            // 13
            { speaker: null, text: '你转身离开。她的视线在你背后停留了一秒。然后，翻页声又响了。' },
            { speaker: null, text: '——你错过了什么。但你不知道你错过了什么。' },
            // 15
            { speaker: null, text: '她抬起头，看了你一眼。这一次看得久了一点。' },
            { speaker: '御厨光', text: '「柏拉图说——我们看见的一切都是影子。」' },
            { speaker: '御厨光', text: '「我从小就觉得……这个世界像投影。走在路上，忽然觉得一切都不太真实。」' },
            { speaker: null, text: '她把书合上。塑料海豚挂件晃了一下。' },
            {
                speaker: '御厨光', text: '「你呢？你觉得……这个世界是真的吗？」',
                choices: [
                    { text: '「不知道。但蝉鸣是真的。」', bondChange: { mikuriya: 2 }, next: 20 },
                    { text: '「真不真的，都得活下去。」', bondChange: { mikuriya: 1 }, next: 22 },
                    { text: '「我死过327次了。每一次都很真实。」', requiredDeaths: 5, bondChange: { mikuriya: 5 }, setFlag: 'told_mikuriya_deaths', next: 24 },
                ]
            },
            // 20
            { speaker: null, text: '她愣了一下。然后——笑了。很小的笑。嘴角微微抬起。' },
            { speaker: '御厨光', text: '「蝉鸣……嗯。蝉鸣是真的。」', next: 27 },
            // 22
            { speaker: null, text: '她没有笑，但点了一下头。' },
            { speaker: '御厨光', text: '「嗯……也是。」', next: 27 },
            // 24
            { speaker: null, text: '她的瞳孔微微放大。然后——缩小。', effect: 'particles' },
            { speaker: '御厨光', text: '「…………你也是，论证者？」' },
            { speaker: null, text: '这个词。你第一次听到。但你知道她在说什么。', next: 27 },
            // 27
            { speaker: null, text: '窗外的蝉叫了。空调的指示灯在闪。26度。' },
            { speaker: '御厨光', text: '「我叫御厨光。二年三组。」' },
            {
                speaker: '御厨光', text: '「……你明天还会来图书馆吗？」',
                choices: [
                    { text: '「也没什么别的事可做。」', bondChange: { mikuriya: 2 }, setFlag: 'promised_library' },
                    { text: '「会来的。」', bondChange: { mikuriya: 2 }, setFlag: 'promised_library' },
                    { text: '「明天还活着的话。」', bondChange: { mikuriya: 3 }, setFlag: 'promised_library' },
                ]
            },
            { speaker: null, text: '她点了一下头。低下头，重新打开书。' },
            { speaker: null, text: '但这一次——她的嘴角，还维持着那个很小的弧度。' },
            { speaker: null, text: '…………' },
            { speaker: null, text: '图书馆的空调声。翻页声。蝉鸣。\n这些是真的。\n——也许。' },
        ];

        await DialogueEngine.play(script, () => {
            this.gameState.flags.talked_mikuriya = true;
            this.gameState.flags.met_mikuriya = true;
            this.unlock(['stationPlaza', 'bridge']);
            Effects.notify('御厨光を記録した', 2000);
            SaveManager.save(this.gameState);
            this.enter(this.gameState.currentLocation);
        });
    }
};
