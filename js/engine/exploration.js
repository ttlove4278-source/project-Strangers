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

        // 时段样式
        const screen = document.getElementById('exploration-screen');
        screen.classList.remove('evening', 'night');
        if (this.gameState.timeOfDay === 'evening') screen.classList.add('evening');
        if (this.gameState.timeOfDay === 'night') screen.classList.add('night');

        if (SceneManager.getCurrentId() === 'exploration-screen') {
            await Transitions.locationChange();
        }

        // 地点BGM
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

        // 故事提示
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

            // NEW 标记：该行动是否第一次出现
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
        };

        if (handlers[action.scene]) { await handlers[action.scene](); return; }

        const script = StoryScripts[action.scene];
        if (script) {
            await this.playWithCB(script, () => {
                if (action.setFlag) this.gameState.flags[action.setFlag] = true;
                if (action.logosGain) {
                    this.gameState.player.logos = Math.min(this.gameState.player.maxLogos, this.gameState.player.logos + action.logosGain);
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
            { speaker: null, text: '小学的时候买的吧。一直没换。不是舍不得。是忘了。或者是——不需要换。' },
            { speaker: null, text: '她在看什么？\n——《国家》。柏拉图。翻到了洞穴寓言那一节。' },
            { speaker: null, text: '她抬起头。浅褐色的瞳孔。\n看了你一秒。不是惊讶。也不是戒备。\n是——确认。确认你是真的，不是影子。\n然后又低下头。' },
            {
                speaker: null,
                text: '……\n你应该离开。你和她没有交集。\n二年三组有37个人，你不认识其中的大部分。\n她坐在教室里的时候，你甚至不记得她坐在哪里。',
                choices: [
                    { text: '离开。', next: 15 },
                    { text: '「……在看柏拉图？」', bondChange: { mikuriya: 1 }, next: 7 },
                    { text: '（坐在旁边的书架前，不说话）', bondChange: { mikuriya: 2 }, next: 10 },
                ]
            },
            // 7: 搭话
            { speaker: '御厨光', text: '「…………嗯。」' },
            { speaker: null, text: '她的声音很小。不是害羞。是习惯了不被听见。\n声带在很久以前就把音量校准到了「不打扰任何人」的档位。' },
            {
                speaker: '御厨光', text: '「你也看哲学书吗？」',
                choices: [
                    { text: '「算是吧。加缪。」', bondChange: { mikuriya: 1 }, next: 17 },
                    { text: '「不看。只是路过。」', next: 15 },
                ]
            },
            // 10: 坐下
            { speaker: null, text: '你靠着对面的书架坐下来。地板凉的。空调的风从头顶吹过，带着旧书的气味。' },
            { speaker: null, text: '没有说话。她也没有说话。\n翻页声。空调声。远处有人在走廊里跑步——橡胶鞋底和地板的摩擦声。' },
            { speaker: null, text: '时间过去了。你不确定是五分钟还是半小时。在这种沉默里，时间的尺度会失效。' },
            { speaker: '御厨光', text: '「……你不问我在看什么吗？」' },
            {
                speaker: null, text: '她的声音比你想象的要轻。像是从很远的地方传来。\n——不是距离的远。是层级的远。像隔了一层玻璃。',
                choices: [
                    { text: '「不想看就不看。」', bondChange: { mikuriya: 3 }, setFlag: 'said_dont_look', next: 17 },
                    { text: '「在看柏拉图？」', bondChange: { mikuriya: 1 }, next: 17 },
                ]
            },
            // 15: 离开
            { speaker: null, text: '你转身离开。脚步声在书架之间回响——一声、两声。\n她的视线在你背后停留了一秒。然后，翻页声又响了。' },
            { speaker: null, text: '——你错过了什么。\n但你不知道你错过了什么。\n也许只是一段无关紧要的对话。也许是别的。\n你不会知道了。' },
            // 17: 展开
            { speaker: null, text: '她抬起头，看了你一眼。这一次看得久了一点。\n不是在看你的脸。是在看你脸后面的什么。' },
            { speaker: '御厨光', text: '「柏拉图说——我们看见的一切都是影子。」' },
            { speaker: '御厨光', text: '「火焰在洞穴外面。我们背对火焰。看见的只是墙壁上的投影。」' },
            { speaker: '御厨光', text: '「我从小就觉得……这个世界像投影。走在路上，忽然觉得一切都不太真实。电线杆、红绿灯、便利店的门……像是画上去的。」' },
            { speaker: null, text: '她把书合上。塑料海豚挂件晃了一下。金属环碰撞的细微声音。' },
            { speaker: '御厨光', text: '「小学三年级的时候，我问过妈妈——我们现在说的话，会不会是有人在梦里梦见我们。」' },
            { speaker: '御厨光', text: '「妈妈说，别想奇怪的事。」' },
            { speaker: null, text: '她的嘴角动了一下。不是笑。是「曾经想笑、后来放弃了、现在嘴角还记得那个弧度」的痕迹。' },
            {
                speaker: '御厨光', text: '「你呢？你觉得……这个世界是真的吗？」',
                choices: [
                    { text: '「不知道。但蝉鸣是真的。」', bondChange: { mikuriya: 2 }, next: 27 },
                    { text: '「真不真的，都得活下去。」', bondChange: { mikuriya: 1 }, next: 29 },
                    { text: '「我死过327次了。每一次都很真实。」', requiredDeaths: 5, bondChange: { mikuriya: 5 }, setFlag: 'told_mikuriya_deaths', next: 31 },
                ]
            },
            // 27
            { speaker: null, text: '她愣了一下。\n然后——笑了。不是嘴角的痕迹。是真的在笑。\n很小。很轻。像是怕笑声惊动了书架上的灰尘。' },
            { speaker: '御厨光', text: '「蝉鸣……嗯。蝉鸣是真的。」\n「至少，蝉不会假装在叫。」', next: 34 },
            // 29
            { speaker: null, text: '她没有笑。但她的肩膀放松了一点。像是听到了一个虽然不是答案、但至少不是谎话的东西。' },
            { speaker: '御厨光', text: '「嗯……也是。不管是影子还是真的，肚子饿了都得吃饭。」', next: 34 },
            // 31
            { speaker: null, text: '她的瞳孔微微放大。然后——缩小。像是相机在对焦。\n对焦在你的瞳孔上。', effect: 'particles' },
            { speaker: '御厨光', text: '「…………你也是，论证者？」' },
            { speaker: null, text: '这个词。你第一次听到。但你知道她在说什么。\n——就像你一直知道自己身上有什么不同，只是没人给它起过名字。', next: 34 },
            // 34
            { speaker: null, text: '窗外的蝉叫了。一阵接一阵。叫声从远处涌进来，像潮水，又退回去。\n空调的指示灯在闪。26度。绿色的小灯，一闪一闪，像在呼吸。' },
            { speaker: '御厨光', text: '「我叫御厨光。二年三组。」' },
            { speaker: null, text: '御厨光。你知道这个名字。点名簿上第14号。\n但知道名字和认识一个人是两回事。' },
            {
                speaker: '御厨光', text: '「……你明天还会来图书馆吗？」',
                choices: [
                    { text: '「也没什么别的事可做。」', bondChange: { mikuriya: 2 }, setFlag: 'promised_library' },
                    { text: '「会来的。」', bondChange: { mikuriya: 2 }, setFlag: 'promised_library' },
                    { text: '「明天还活着的话。」', bondChange: { mikuriya: 3 }, setFlag: 'promised_library' },
                ]
            },
            { speaker: null, text: '她点了一下头。动作很小。像是怕点多了就变成期待。\n她不想期待。期待是一种赌注。她不赌。' },
            { speaker: null, text: '低下头。重新打开书。手指翻到刚才的那一页——洞穴寓言。\n但你注意到——她的嘴角，还维持着那个弧度。' },
            { speaker: null, text: '很小。很轻。像是蝉翼上的纹路——你不仔细看就看不到。' },
            { speaker: null, text: '…………' },
            { speaker: null, text: '图书馆的空调声。翻页声。蝉鸣。\n这些是真的。\n——也许。\n也许「也许」就够了。' },
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
