/**
 * 世纪末异邦人 — 探索系统
 */

const ExplorationEngine = {
    gameState: null,
    currentLocation: null,

    init(gameState) {
        this.gameState = gameState;
    },

    // 进入探索模式
    async enter(locationId) {
        locationId = locationId || this.gameState.currentLocation || 'teibow';

        await SceneManager.switchTo('exploration-screen', 'fade');
        await Effects.wait(200);

        this.loadLocation(locationId);
    },

    // 加载地点
    async loadLocation(locationId) {
        const loc = LocationData[locationId];
        if (!loc) {
            console.warn('[Exploration] 未找到地点:', locationId);
            return;
        }

        this.currentLocation = loc;
        this.gameState.currentLocation = locationId;

        // 轻量转场
        if (SceneManager.getCurrentId() === 'exploration-screen') {
            await Transitions.locationChange();
        }

        // 更新UI
        this.updateHeader(loc);
        this.updateNarrative(loc);
        this.updateActions(loc);
        this.updateNavigation(loc);
        this.updateBottomBar();

        // 记录访问
        if (!this.gameState.visitedLocations.includes(locationId)) {
            this.gameState.visitedLocations.push(locationId);
        }

        // 保存
        SaveManager.save(this.gameState);
    },

    // 更新头部
    updateHeader(loc) {
        document.getElementById('location-name').textContent = loc.name;
        document.getElementById('location-desc').textContent = loc.desc;

        Effects.updateStatusBar(
            this.formatDate(this.gameState.currentDay),
            this.gameState.currentTime,
            this.gameState.currentTemp
        );
    },

    // 更新叙述区
    updateNarrative(loc) {
        const area = document.getElementById('narrative-area');
        area.innerHTML = '';

        // 查找当前应该触发的事件
        let eventNarrative = null;
        if (loc.events) {
            for (const [key, event] of Object.entries(loc.events)) {
                if (key === 'idle') continue;
                if (event.condition && event.condition(this.gameState)) {
                    eventNarrative = event;
                    if (event.onComplete) {
                        event.onComplete(this.gameState);
                    }
                    break;
                }
            }
        }

        // 没有特殊事件时用 idle
        if (!eventNarrative && loc.events && loc.events.idle) {
            eventNarrative = loc.events.idle;
        }

        if (eventNarrative && eventNarrative.narrative) {
            eventNarrative.narrative.forEach((text, i) => {
                const p = document.createElement('p');
                p.className = 'narrative-paragraph narrative-text';
                p.textContent = text;
                p.style.animationDelay = (i * 0.15) + 's';
                area.appendChild(p);
            });
        }

        // 检查是否需要触发对话
        if (this.gameState.flags.met_mikuriya_trigger && !this.gameState.flags.talked_mikuriya) {
            this.checkDialogueTriggers();
        }
    },

    // 更新行动选项
    updateActions(loc) {
        const area = document.getElementById('choices-area');
        area.innerHTML = '';

        if (!loc.actions) return;

        loc.actions.forEach((action, i) => {
            // 检查条件
            if (action.condition && !action.condition(this.gameState)) return;

            // 特殊处理：对话触发型行动
            if (action.id === 'talk_mikuriya' && this.gameState.flags.met_mikuriya_trigger) {
                const btn = this.createActionButton(action, i);
                btn.addEventListener('click', () => this.triggerMikuriyaMeeting());
                area.appendChild(btn);
                return;
            }

            const btn = this.createActionButton(action, i);
            btn.addEventListener('click', () => this.executeAction(action));
            area.appendChild(btn);
        });
    },

    createActionButton(action, index) {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        if (action.important) btn.classList.add('important');
        btn.textContent = action.text;
        btn.style.animationDelay = (index * 0.08) + 's';
        btn.classList.add('fade-in-up');
        return btn;
    },

    // 执行行动
    async executeAction(action) {
        if (!action.script) return;

        // 播放行动对话
        await DialogueEngine.play(action.script, () => {
            // 对话结束后回到探索
            if (action.effect) {
                action.effect(this.gameState);
            }
            if (action.setFlag) {
                this.gameState.flags[action.setFlag] = true;
            }

            SaveManager.save(this.gameState);

            // 回到当前地点
            this.enter(this.gameState.currentLocation);
        });
    },

    // 更新导航
    updateNavigation(loc) {
        const area = document.getElementById('nav-area');
        area.innerHTML = '';

        if (!loc.connections) return;

        // 标题
        const hint = document.createElement('div');
        hint.className = 'location-event-hint';
        hint.textContent = '移动';
        area.appendChild(hint);

        loc.connections.forEach((connId, i) => {
            // 检查是否解锁
            if (!this.gameState.unlockedLocations.includes(connId)) return;

            const connLoc = LocationData[connId];
            if (!connLoc) return;

            const btn = document.createElement('button');
            btn.className = 'nav-btn';

            // 检查是否有未触发事件
            if (this.hasNewEvent(connId)) {
                btn.classList.add('has-event');
            }

            // 检查是否首次访问
            if (!this.gameState.visitedLocations.includes(connId)) {
                btn.classList.add('new');
            }

            btn.innerHTML = `<span class="nav-icon">→</span> ${connLoc.name}`;

            btn.addEventListener('click', () => {
                this.advanceTime();
                this.loadLocation(connId);
            });

            area.appendChild(btn);
        });
    },

    // 检查地点是否有新事件
    hasNewEvent(locationId) {
        const loc = LocationData[locationId];
        if (!loc || !loc.events) return false;

        for (const [key, event] of Object.entries(loc.events)) {
            if (key === 'idle') continue;
            if (event.condition && event.condition(this.gameState)) {
                return true;
            }
        }
        return false;
    },

    // 更新底部栏
    updateBottomBar() {
        Effects.updateLogos(this.gameState.player.logos, this.gameState.player.maxLogos);
        document.getElementById('death-count-display').textContent = this.gameState.deathCount;
    },

    // 时间推进
    advanceTime() {
        // 简单的时间推进：每次移动+15分钟
        let [h, m] = this.gameState.currentTime.split(':').map(Number);
        m += 15;
        if (m >= 60) { m -= 60; h += 1; }
        if (h >= 24) { h = 0; } // 简化处理
        this.gameState.currentTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

        // 温度微变
        this.gameState.currentTemp = Math.round((37 + Math.random() * 1.5) * 10) / 10;
    },

    // 格式化日期
    formatDate(dateStr) {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const d = new Date(dateStr);
        const dayName = days[d.getDay()];
        return dateStr.replace(/-/g, '.') + ` (${dayName})`;
    },

    // 检查对话触发
    checkDialogueTriggers() {
        // 御厨光遭遇在图书馆的action中处理
    },

    // 触发御厨光相遇（特殊事件）
    async triggerMikuriyaMeeting() {
        const script = [
            {
                speaker: null,
                text: '图书馆的角落。最里面的书架旁边。',
                atmosphere: '空调声。翻页声。很远的蝉鸣。'
            },
            {
                speaker: null,
                text: '一个女生坐在地上，靠着书架。膝盖上放着一本打开的书。'
            },
            {
                speaker: null,
                text: '黑发齐肩，低马尾。碎发很多。书包上挂着一个塑料海豚。'
            },
            {
                speaker: null,
                text: '她在看什么？\n——《国家》。柏拉图。'
            },
            {
                speaker: null,
                text: '她抬起头。浅褐色的瞳孔。\n看了你一秒。又低下头。'
            },
            {
                speaker: null,
                text: '……\n你应该离开。你和她没有交集。\n二年三组有很多人，你不认识大部分。',
                choices: [
                    {
                        text: '离开。',
                        next: 13
                    },
                    {
                        text: '「……在看柏拉图？」',
                        bondChange: { mikuriya: 1 },
                        next: 6
                    },
                    {
                        text: '（坐在旁边的书架前，不说话）',
                        bondChange: { mikuriya: 2 },
                        next: 9
                    }
                ]
            },
            // 选择2：搭话
            {
                speaker: '御厨光',
                text: '「…………嗯。」'
            },
            {
                speaker: null,
                text: '她的声音很小。像是不习惯被人搭话。\n或者说——不期待被人搭话。'
            },
            {
                speaker: '御厨光',
                text: '「你也看哲学书吗？」',
                choices: [
                    {
                        text: '「算是吧。加缪。」',
                        bondChange: { mikuriya: 1 },
                        next: 15
                    },
                    {
                        text: '「不看。只是路过。」',
                        next: 13
                    },
                ]
            },
            // 选择3：坐在旁边
            {
                speaker: null,
                text: '你靠着对面的书架坐下来。\n没有说话。她也没有说话。'
            },
            {
                speaker: null,
                text: '空调声。翻页声。\n时间过去了——也许五分钟，也许半小时。'
            },
            {
                speaker: '御厨光',
                text: '「……你不问我在看什么吗？」'
            },
            {
                speaker: null,
                text: '她的声音比你想象的要轻。像是在确认你真的在那里。',
                choices: [
                    {
                        text: '「不想看就不看。」',
                        bondChange: { mikuriya: 3 },
                        setFlag: 'said_dont_look',
                        next: 15
                    },
                    {
                        text: '「在看柏拉图？」',
                        bondChange: { mikuriya: 1 },
                        next: 15
                    },
                ]
            },
            // 离开路线
            {
                speaker: null,
                text: '你转身离开。\n她的视线在你背后停留了一秒。\n然后，翻页声又响了。'
            },
            {
                speaker: null,
                text: '——你错过了什么。\n但你不知道你错过了什么。'
            },
            // 汇合：对话展开
            {
                speaker: null,
                text: '她抬起头，看了你一眼。\n这一次看得久了一点。',
            },
            {
                speaker: '御厨光',
                text: '「柏拉图说——我们看见的一切都是影子。」'
            },
            {
                speaker: '御厨光',
                text: '「我从小就觉得……这个世界像投影。有时候，走在路上，忽然觉得一切都不太真实。」'
            },
            {
                speaker: null,
                text: '她把书合上。塑料海豚挂件晃了一下。'
            },
            {
                speaker: '御厨光',
                text: '「你呢？你觉得……这个世界是真的吗？」',
                choices: [
                    {
                        text: '「不知道。但蝉鸣是真的。」',
                        bondChange: { mikuriya: 2 },
                        next: 20
                    },
                    {
                        text: '「真不真的，都得活下去。」',
                        bondChange: { mikuriya: 1 },
                        next: 22
                    },
                    {
                        text: '「我死过327次了。每一次都很真实。」',
                        requiredDeaths: 5,
                        bondChange: { mikuriya: 5 },
                        setFlag: 'told_mikuriya_deaths',
                        next: 24
                    }
                ]
            },
            // 选择1
            {
                speaker: null,
                text: '她愣了一下。然后——笑了。\n很小的笑。嘴角微微抬起。'
            },
            {
                speaker: '御厨光',
                text: '「蝉鸣……嗯。蝉鸣是真的。」',
                next: 27
            },
            // 选择2
            {
                speaker: null,
                text: '她没有笑，但点了一下头。'
            },
            {
                speaker: '御厨光',
                text: '「嗯……也是。」',
                next: 27
            },
            // 选择3（死亡次数解锁）
            {
                speaker: null,
                text: '她的瞳孔微微放大。\n然后——缩小。像是在确认什么。'
            },
            {
                speaker: '御厨光',
                text: '「…………你也是，论证者？」'
            },
            {
                speaker: null,
                text: '这个词。你第一次听到。\n但你知道她在说什么。',
                next: 27
            },
            // 最终汇合
            {
                speaker: null,
                text: '窗外的蝉叫了。叫声从远处涌进来，又退回去。\n空调的指示灯在闪。26度。'
            },
            {
                speaker: '御厨光',
                text: '「我叫御厨光。二年三组。」'
            },
            {
                speaker: '御厨光',
                text: '「……你明天还会来图书馆吗？」',
                choices: [
                    {
                        text: '「也没什么别的事可做。」',
                        bondChange: { mikuriya: 2 },
                        setFlag: 'promised_library',
                    },
                    {
                        text: '「会来的。」',
                        bondChange: { mikuriya: 2 },
                        setFlag: 'promised_library',
                    },
                    {
                        text: '「明天还活着的话。」',
                        bondChange: { mikuriya: 3 },
                        setFlag: 'promised_library',
                    },
                ]
            },
            {
                speaker: null,
                text: '她点了一下头。\n低下头，重新打开书。'
            },
            {
                speaker: null,
                text: '但这一次——你注意到——\n她的嘴角，还维持着刚才那个很小的弧度。'
            },
            {
                speaker: null,
                text: '…………'
            },
            {
                speaker: null,
                text: '图书馆的空调声。翻页声。蝉鸣。\n这些是真的。\n——也许。',
            }
        ];

        await DialogueEngine.play(script, () => {
            this.gameState.flags.talked_mikuriya = true;
            this.gameState.flags.met_mikuriya = true;

            // 解锁站前广场
            if (!this.gameState.unlockedLocations.includes('stationPlaza')) {
                this.gameState.unlockedLocations.push('stationPlaza');
            }
            // 解锁高架桥
            if (!this.gameState.unlockedLocations.includes('bridge')) {
                this.gameState.unlockedLocations.push('bridge');
            }

            Effects.notify('御厨光を記録した。', 2000);

            SaveManager.save(this.gameState);
            this.enter(this.gameState.currentLocation);
        });
    }
};
