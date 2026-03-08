/**
 * 世纪末异邦人 — 地点数据
 */

const LocationData = {

    teibow: {
        id: 'teibow',
        name: '堤防',
        desc: '蝉鸣不止。海风带着盐和沥青的气味。混凝土被晒得发白。',
        connections: ['vendingMachine', 'school', 'bridge'],
        events: {
            // 初次到达
            firstVisit: {
                condition: (state) => !state.flags.teibow_visited,
                narrative: [
                    '这里是堤防。你常来的地方。',
                    '远处是海。近处是蝉鸣。',
                    '太阳把一切晒得发白，包括你的影子。',
                ],
                onComplete: (state) => { state.flags.teibow_visited = true; }
            },
            // 默认描述
            idle: {
                narrative: [
                    '海风吹来。37.5度的风，和体温一样。',
                    '蝉在叫。它们不在乎世纪末。',
                ],
            }
        },
        actions: [
            {
                id: 'sit_teibow',
                text: '坐在堤防上',
                condition: (state) => true,
                script: [
                    { speaker: null, text: '坐下来。混凝土的余温从裤子渗进皮肤。' },
                    { speaker: null, text: '远处有渔船。近处有蝉。你哪里都不想去。' },
                    { speaker: null, text: '——这样也好。', },
                ],
                effect: (state) => {
                    state.player.logos = Math.min(state.player.maxLogos, state.player.logos + 0.3);
                }
            },
            {
                id: 'look_sea',
                text: '看海',
                condition: (state) => true,
                script: [
                    { speaker: null, text: '海面反射着午后的光。看久了，光斑会在视网膜上留下残影。' },
                    { speaker: null, text: '父亲的父亲，坐船从大陆回来的时候，看到的是同一片海吗？' },
                    { speaker: null, text: '……想不起来了。那本书里好像写过什么。' },
                ],
            },
            {
                id: 'remember_miyuki',
                text: '想起深雪',
                important: true,
                condition: (state) => state.flags.teibow_visited && !state.flags.remembered_miyuki_teibow,
                script: [
                    { speaker: null, text: '宝矿力。深雪也喝这个。' },
                    { speaker: null, text: '不——她喝的是水蜜桃味的。你总是买错。' },
                    { speaker: null, text: '后来你就只买原味了。因为原味不会提醒你买错了。' },
                    { speaker: null, text: '……' },
                    { speaker: null, text: '床下的纸箱。五年了。', },
                ],
                effect: (state) => {
                    state.flags.remembered_miyuki_teibow = true;
                    state.bonds.mikuriya += 0; // 此时还没遇见她
                }
            }
        ]
    },

    vendingMachine: {
        id: 'vendingMachine',
        name: '自动贩卖机前',
        desc: '嗡嗡作响的白色光。投币口被太阳晒得发烫。',
        connections: ['teibow', 'school', 'stationPlaza'],
        events: {
            firstVisit: {
                condition: (state) => !state.flags.vending_visited,
                narrative: [
                    '自动贩卖机。白天不起眼，但你知道它在那里。',
                    '投币口泛着铜锈。有人在旁边贴了「今年是1999年！」的贴纸。',
                    '右下角还有一张更小的：「千年虫对策完了！请放心购入。」',
                ],
                onComplete: (state) => { state.flags.vending_visited = true; }
            },
            idle: {
                narrative: [
                    '自动贩卖机嗡嗡地响。',
                    '宝矿力100日元。BOSS咖啡120日元。',
                ],
            }
        },
        actions: [
            {
                id: 'buy_pocari',
                text: '买宝矿力（100円）',
                condition: (state) => true,
                script: [
                    { speaker: null, text: '投入100日元。咕隆。瓶子滚出来。' },
                    { speaker: null, text: '冰凉的。在手心留下水珠。' },
                    { speaker: null, text: '喝了一口。甜的。什么味道都没有的甜。' },
                ],
                effect: (state) => {
                    state.player.logos = Math.min(state.player.maxLogos, state.player.logos + 0.1);
                }
            },
            {
                id: 'buy_boss',
                text: '买BOSS咖啡（120円）',
                condition: (state) => true,
                script: [
                    { speaker: null, text: '投入120日元。咕隆。罐装咖啡。' },
                    { speaker: null, text: '苦的。罐底印着「SINCE 1992」。' },
                    { speaker: null, text: '七年了。和蝉的地下生活一样长。' },
                ],
                effect: (state) => {
                    state.player.logos = Math.min(state.player.maxLogos, state.player.logos + 0.2);
                }
            }
        ]
    },

    school: {
        id: 'school',
        name: '櫂町高校',
        desc: '暑假中的校舍。走廊的日光灯有一盏在闪。空调声从教员室传来。',
        connections: ['vendingMachine', 'library'],
        events: {
            firstVisit: {
                condition: (state) => !state.flags.school_visited,
                narrative: [
                    '暑假的学校。空旷的走廊里，运动鞋的声音很远。',
                    '补习的人不多。二年三组的教室锁着。',
                    '告示板上贴着：「夏休特别企画：读书感想文大赛」。',
                    '没有人注意到你来了。也没有人注意到你离开。',
                ],
                onComplete: (state) => {
                    state.flags.school_visited = true;
                    // 解锁图书馆
                    if (!state.unlockedLocations.includes('library')) {
                        state.unlockedLocations.push('library');
                    }
                }
            },
            idle: {
                narrative: [
                    '暑假的校舍。蝉鸣从窗外涌进来。',
                    '有人在体育馆练棒球。铝棒击球的声音。',
                ],
            }
        },
        actions: [
            {
                id: 'check_bulletin',
                text: '看告示板',
                condition: (state) => state.flags.school_visited,
                script: [
                    { speaker: null, text: '告示板。各种通知用图钉订着。' },
                    { speaker: null, text: '「暑期补习时间表」「文化祭准备委员会招募」「保健室开放时间变更」' },
                    { speaker: null, text: '最下面有一张手写的纸条，被人撕掉了一半。' },
                    { speaker: null, text: '残留的文字是：「如果有人也觉得活着很——」' },
                    { speaker: null, text: '下半句被撕掉了。' },
                ],
            }
        ]
    },

    library: {
        id: 'library',
        name: '图书馆',
        desc: '空调运转的低鸣。书架之间的灰尘在光柱里跳舞。',
        connections: ['school'],
        events: {
            firstVisit: {
                condition: (state) => !state.flags.library_visited,
                narrative: [
                    '学校图书馆。暑假开放，但几乎没有人。',
                    '窗帘半拉着。空调设定在26度，比外面凉了十几度。',
                    '一进来，汗就冷了。',
                ],
                onComplete: (state) => { state.flags.library_visited = true; }
            },
            // 御厨光相遇事件
            meetMikuriya: {
                condition: (state) => state.flags.library_visited && !state.flags.met_mikuriya,
                narrative: [
                    '图书馆的角落。',
                    '有一个人坐在那里。',
                ],
                onComplete: (state) => {
                    // 触发对话
                    state.flags.met_mikuriya_trigger = true;
                }
            },
            idle: {
                narrative: [
                    '图书馆。凉爽而安静。',
                    '书架上有人还没还的《挪威的森林》，借出日期是6月。',
                ],
            }
        },
        actions: [
            {
                id: 'browse_philosophy',
                text: '翻看哲学书架',
                condition: (state) => state.flags.library_visited,
                script: [
                    { speaker: null, text: '哲学·思想·宗教。913.6。' },
                    { speaker: null, text: '《存在与虚无》《纯粹理性批判》《查拉图斯特拉如是说》……' },
                    { speaker: null, text: '你的手指停在一本泛黄的文库本上。' },
                    { speaker: null, text: '《西西弗神话》。岩波文库。和祖父留下的是同一个版本。' },
                    { speaker: null, text: '你没有拿起来。' },
                ],
            },
            {
                id: 'talk_mikuriya',
                text: '和那个女生说话',
                important: true,
                condition: (state) => state.flags.met_mikuriya_trigger && !state.flags.talked_mikuriya,
            }
        ]
    },

    stationPlaza: {
        id: 'stationPlaza',
        name: '站前广场',
        desc: '通勤人群。免费报纸。破旧的喷水池已经停了。',
        connections: ['vendingMachine', 'bridge'],
        events: {
            firstVisit: {
                condition: (state) => !state.flags.station_visited,
                narrative: [
                    '站前广场。櫂町唯一的电车站。',
                    '有人在发免费报纸，穿着荧光绿的背心。',
                    '喷水池坏了。水面上浮着一枚5日元硬币。',
                    '有人许过愿。不知道实现了没有。',
                ],
                onComplete: (state) => {
                    state.flags.station_visited = true;
                }
            },
            idle: {
                narrative: [
                    '站前广场。人来人往。',
                    '广播在说明天的天气。晴。最高气温38度。',
                ],
            }
        },
        actions: [
            {
                id: 'talk_horita',
                text: '和发报纸的人说话',
                condition: (state) => state.flags.station_visited,
                script: [
                    { speaker: null, text: '穿荧光绿背心的男人。晒成小麦色的皮肤。圆脸。很年轻，但眼神不年轻。' },
                    { speaker: '堀田诚', text: '「报纸要吗？免费的。今天有星座运势。」' },
                    { speaker: null, text: '他笑着。牛仔裤右膝内侧有字，但看不清。' },
                    {
                        speaker: null,
                        text: '……',
                        choices: [
                            {
                                text: '「给我一份。」',
                                setFlag: 'took_newspaper',
                                bondChange: { horita: 1 },
                            },
                            {
                                text: '「不用了。」',
                            },
                            {
                                text: '「你牛仔裤上写了什么？」',
                                requiredDeaths: 3,
                                setFlag: 'asked_horita_jeans',
                                bondChange: { horita: 2 },
                            }
                        ]
                    },
                ],
            }
        ]
    },

    bridge: {
        id: 'bridge',
        name: '旧港高架桥下',
        desc: '阴影。潮湿的混凝土气味。有人住在这里。',
        connections: ['teibow', 'stationPlaza'],
        events: {
            firstVisit: {
                condition: (state) => !state.flags.bridge_visited,
                narrative: [
                    '高架桥下。阳光照不到的地方。',
                    '有折叠椅。有帕斯卡的《思想录》。有空的咖啡罐。',
                    '有一个人。背对海，面对桥墩。头发全白。',
                    '他没有看你。你不确定他知道你来了。',
                ],
                onComplete: (state) => {
                    state.flags.bridge_visited = true;
                }
            },
            idle: {
                narrative: [
                    '高架桥下。那个男人还在那里。',
                    '折叠椅。白发。《思想录》翻开在同一页。',
                ],
            }
        },
        actions: [
            {
                id: 'leave_pocari',
                text: '把宝矿力放在旁边',
                condition: (state) => state.flags.bridge_visited,
                script: [
                    { speaker: null, text: '你把宝矿力放在折叠椅旁。' },
                    { speaker: null, text: '他没有动。但你看到他的手指微微动了一下。' },
                    { speaker: null, text: '你离开了。' },
                    { speaker: null, text: '——在你走后三十分钟，他拿起了那瓶宝矿力。' },
                ],
                effect: (state) => {
                    state.bonds.fujimori += 1;
                    state.flags.left_pocari_bridge = true;
                }
            }
        ]
    }
};
