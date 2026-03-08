/**
 * 世纪末异邦人 — 地点数据（完整版·含全部战斗触发）
 */

const LocationData = {

    teibow: {
        id: 'teibow',
        name: '堤防',
        desc: '蝉鸣不止。海风带着盐和沥青的气味。混凝土被晒得发白。',
        descEvening: '夕阳把海面染成橙色。堤防的混凝土还在散发白天的余热。',
        descNight: '月光映在海面上。蝉鸣消失了。取而代之的是远处港口的汽笛声。',
        connections: ['vendingMachine', 'school', 'bridge'],
        events: {
            firstVisit: {
                condition: (s) => !s.flags.teibow_explored,
                narrative: [
                    '这里是堤防。你常来的地方。',
                    '远处是海。近处是蝉鸣。',
                    '太阳把一切晒得发白，包括你的影子。',
                    '堤防的混凝土上有人用油性笔写过字，被晒得几乎看不清了。',
                    '「1999——」后面的字消失了。是誓言？是遗言？还是单纯的涂鸦？',
                ],
                onComplete: (s) => { s.flags.teibow_explored = true; }
            },
            eveningReturn: {
                condition: (s) => s.flags.teibow_explored && s.timeOfDay === 'evening' && !s.flags.teibow_evening,
                narrative: [
                    '傍晚的堤防。',
                    '太阳沉到海平面的边缘。天空从蓝变成橙，又从橙变成紫。',
                    '一个瞬间——整个世界都是红色的。',
                    '然后就暗了。',
                    '蝉还在叫。但声音变了，像是换了一批。白天那群已经死了也说不定。',
                ],
                onComplete: (s) => { s.flags.teibow_evening = true; }
            },
            nightAlone: {
                condition: (s) => s.timeOfDay === 'night' && !s.flags.teibow_night,
                narrative: [
                    '夜晚的堤防。',
                    '月亮出来了。海面变成了一面黑色的镜子，碎银洒在上面。',
                    '白天的燥热终于退去。风凉了。体温和空气有了区别。',
                    '你终于能分清哪些是自己的热，哪些是世界的热。',
                ],
                onComplete: (s) => { s.flags.teibow_night = true; }
            },
            day2Morning: {
                condition: (s) => s.dayIndex >= 1 && !s.flags.teibow_day2,
                narrative: [
                    '7月14日。',
                    '新的一天。但堤防没有变。海没有变。蝉鸣没有变。',
                    '变了的只有日期。',
                    '——还有你。也许。也许你也没有变。',
                ],
                onComplete: (s) => { s.flags.teibow_day2 = true; }
            },
            idle: {
                narrative: [
                    '海风吹来。和体温一样的温度。',
                    '蝉在叫。它们不在乎世纪末。',
                ],
            }
        },
        actions: [
            {
                id: 'sit_teibow',
                text: '坐在堤防上',
                condition: (s) => true,
                scene: 'sit_teibow',
                logosGain: 0.3
            },
            {
                id: 'look_sea',
                text: '看海',
                condition: (s) => true,
                scene: 'look_sea'
            },
            {
                id: 'remember_miyuki',
                text: '想起深雪',
                important: true,
                condition: (s) => s.flags.teibow_explored && !s.flags.remembered_miyuki_teibow,
                scene: 'remember_miyuki',
                setFlag: 'remembered_miyuki_teibow'
            },
            {
                id: 'remember_miyuki_deep',
                text: '……打开那个纸箱',
                important: true,
                condition: (s) => s.flags.remembered_miyuki_teibow && s.dayIndex >= 4 && !s.flags.miyuki_deep_done,
                scene: 'remember_miyuki_deep',
                setFlag: 'miyuki_deep_done'
            },
            {
                id: 'teibow_night_think',
                text: '想一些不该想的事',
                condition: (s) => s.timeOfDay === 'night',
                scene: 'teibow_night_think'
            },
            {
                id: 'teibow_count',
                text: '数——（确认自己还活着）',
                condition: (s) => s.flags.teibow_explored,
                scene: 'teibow_count',
                logosGain: 0.2
            },
            {
                id: 'teibow_evening_mikuriya',
                text: '等一个人',
                important: true,
                condition: (s) => s.flags.promised_library && s.timeOfDay === 'evening' && !s.flags.evening_mikuriya_teibow && s.dayIndex >= 1,
                scene: 'teibow_evening_mikuriya'
            }
        ]
    },

    vendingMachine: {
        id: 'vendingMachine',
        name: '自动贩卖机前',
        desc: '嗡嗡作响的白色光。投币口被太阳晒得发烫。',
        descNight: '自动贩卖机的光。深夜唯一的光源。虫子围着灯管飞。',
        connections: ['teibow', 'school', 'stationPlaza'],
        events: {
            firstVisit: {
                condition: (s) => !s.flags.vending_visited,
                narrative: [
                    '自动贩卖机。白天不起眼，但你知道它在那里。',
                    '投币口泛着铜锈。有人在旁边贴了「今年是1999年！」的贴纸。',
                    '右下角还有一张更小的：「千年虫对策完了！请放心购入。」',
                    '宝矿力100日元。BOSS咖啡120日元。午后的红茶130日元。',
                    '价格和去年一样。至少贩卖机不在乎世纪末。',
                ],
                onComplete: (s) => { s.flags.vending_visited = true; }
            },
            nightVending: {
                condition: (s) => s.timeOfDay === 'night' && !s.flags.vending_night,
                narrative: [
                    '深夜的自动贩卖机。',
                    '全世界只剩这一盏灯似的。白色的光，嗡嗡的声。',
                    '飞蛾撞在灯管上，发出微弱的啪嗒声。撞了又撞。',
                    '你坐在贩卖机旁边。背靠着温热的金属外壳。',
                    '——这里是你的位置。不是家。不是学校。是一台会发光的机器旁边。',
                ],
                onComplete: (s) => { s.flags.vending_night = true; }
            },
            idle: {
                narrative: [
                    '自动贩卖机嗡嗡地响。',
                    '宝矿力。BOSS咖啡。午后的红茶。',
                    '世界可以用饮料的种类来丈量。',
                ],
            }
        },
        actions: [
            {
                id: 'buy_pocari',
                text: '买宝矿力（100円）',
                condition: (s) => true,
                scene: 'buy_pocari',
                logosGain: 0.1
            },
            {
                id: 'buy_boss',
                text: '买BOSS咖啡（120円）',
                condition: (s) => true,
                scene: 'buy_boss',
                logosGain: 0.2
            },
            {
                id: 'sit_vending',
                text: '靠着贩卖机坐下',
                condition: (s) => s.timeOfDay === 'night',
                scene: 'sit_vending_night',
                logosGain: 0.3
            },
            {
                id: 'vending_deep_night',
                text: '数贩卖机里剩下的饮料',
                condition: (s) => s.timeOfDay === 'night' && s.flags.vending_night,
                scene: 'vending_count'
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
                condition: (s) => !s.flags.school_visited,
                narrative: [
                    '暑假的学校。空旷的走廊里，运动鞋的声音很远。',
                    '补习的人不多。二年三组的教室锁着。',
                    '告示板上贴着：「夏休特别企画：读书感想文大赛」。',
                    '旁边是一张打印的海报：「千年虫研修会·参加者募集中」。',
                    '没有人注意到你来了。也没有人注意到你离开。',
                ],
                onComplete: (s) => {
                    s.flags.school_visited = true;
                    if (!s.unlockedLocations.includes('library')) {
                        s.unlockedLocations.push('library');
                    }
                }
            },
            takashiroAppear: {
                condition: (s) => s.flags.school_visited && !s.flags.met_takashiro && s.dayIndex >= 1,
                narrative: [
                    '走廊尽头。',
                    '有人在走过来。',
                    '金发。制服穿得极其端正。181厘米。',
                    '学生会会长——高城黎。三年四组。',
                    '你知道他。所有人都知道他。',
                    '他走过你身边。没有看你。',
                    '——不对。他看了。',
                    '只是一瞬间。像是在确认什么。',
                ],
                onComplete: (s) => { s.flags.met_takashiro = true; }
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
                condition: (s) => s.flags.school_visited,
                scene: 'check_bulletin'
            },
            {
                id: 'check_classroom',
                text: '去二年三组的教室',
                condition: (s) => s.flags.school_visited,
                scene: 'check_classroom'
            },
            {
                id: 'follow_takashiro',
                text: '跟上高城黎',
                important: true,
                condition: (s) => s.flags.met_takashiro && !s.flags.talked_takashiro_school,
                scene: 'follow_takashiro'
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
                condition: (s) => !s.flags.library_visited,
                narrative: [
                    '学校图书馆。暑假开放，但几乎没有人。',
                    '窗帘半拉着。空调设定在26度，比外面凉了十几度。',
                    '一进来，汗就冷了。',
                    '柜台后面的老师在打瞌睡。桌上放着看了一半的《GTO》单行本。',
                ],
                onComplete: (s) => { s.flags.library_visited = true; }
            },
            meetMikuriya: {
                condition: (s) => s.flags.library_visited && !s.flags.met_mikuriya,
                narrative: [
                    '图书馆的角落。',
                    '最里面的书架旁边——有一个人坐在那里。',
                ],
                onComplete: (s) => {
                    s.flags.met_mikuriya_trigger = true;
                }
            },
            postMeetMikuriya: {
                condition: (s) => s.flags.met_mikuriya && !s.flags.library_day2_mikuriya && s.dayIndex >= 1,
                narrative: [
                    '图书馆。空调声。翻页声。',
                    '她在那里。和昨天一样的位置。',
                    '低马尾。碎发。塑料海豚。',
                    '她在看另一本书了——《斐多》。还是柏拉图。',
                    '看到你来了。她抬起头。点了一下头。',
                    '——嘴角有一个很小的弧度。',
                ],
                onComplete: (s) => {
                    s.flags.library_day2_mikuriya = true;
                    s.flags.mikuriya_day2_talk_trigger = true;
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
                condition: (s) => s.flags.library_visited,
                scene: 'browse_philosophy'
            },
            {
                id: 'talk_mikuriya_first',
                text: '和那个女生说话',
                important: true,
                condition: (s) => s.flags.met_mikuriya_trigger && !s.flags.talked_mikuriya,
                scene: 'talk_mikuriya_first'
            },
            {
                id: 'talk_mikuriya_day2',
                text: '坐到她旁边',
                important: true,
                condition: (s) => s.flags.mikuriya_day2_talk_trigger && !s.flags.mikuriya_day2_talked,
                scene: 'talk_mikuriya_day2'
            },
            {
                id: 'read_sisyphus',
                text: '拿起《西西弗神话》',
                condition: (s) => s.flags.library_visited && !s.flags.read_sisyphus_library,
                scene: 'read_sisyphus',
                setFlag: 'read_sisyphus_library'
            },
            {
                id: 'library_nap',
                text: '趴在桌上睡一会',
                condition: (s) => s.flags.library_visited,
                scene: 'library_nap',
                logosGain: 0.5
            }
        ]
    },

    stationPlaza: {
        id: 'stationPlaza',
        name: '站前广场',
        desc: '通勤人群。免费报纸。破旧的喷水池已经停了。',
        descEvening: '下班人群涌出电车站。报纸发完了。喷水池边坐着等人的老人。',
        connections: ['vendingMachine', 'bridge'],
        events: {
            firstVisit: {
                condition: (s) => !s.flags.station_visited,
                narrative: [
                    '站前广场。櫂町唯一的电车站。',
                    '有人在发免费报纸，穿着荧光绿的背心。',
                    '喷水池坏了。水面上浮着一枚5日元硬币和几片枯叶。',
                    '有人许过愿。不知道实现了没有。',
                    '电车时刻表贴在柱子上。下一班——16:23。往东京方向。',
                    '很多人离开了櫂町。但你没有。',
                ],
                onComplete: (s) => {
                    s.flags.station_visited = true;
                }
            },
            horitaEvent: {
                condition: (s) => s.flags.station_visited && !s.flags.noticed_horita && s.timeOfDay !== 'night',
                narrative: [
                    '穿荧光绿背心的男人还在发报纸。',
                    '晒成小麦色的皮肤。微卷的短发。圆脸。',
                    '笑着对每一个路过的人说：「报纸要吗？免费的。」',
                    '大多数人走过去。不接。不看。不回应。',
                    '但他没有停。一直在笑。一直在说。',
                ],
                onComplete: (s) => { s.flags.noticed_horita = true; }
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
                condition: (s) => s.flags.noticed_horita && !s.flags.talked_horita,
                important: true,
                scene: 'talk_horita',
                setFlag: 'talked_horita'
            },
            {
                id: 'talk_horita_again',
                text: '再去找堀田',
                condition: (s) => s.flags.talked_horita && s.timeOfDay !== 'night' && !s.flags.horita_again_done,
                scene: 'talk_horita_again',
                setFlag: 'horita_again_done'
            },
            {
                id: 'horita_deep',
                text: '堀田好像有心事',
                important: true,
                condition: (s) => s.flags.talked_horita && s.dayIndex >= 2 && !s.flags.horita_deep_done,
                scene: 'horita_deep_talk'
            },
            {
                id: 'watch_crowd',
                text: '看人群',
                condition: (s) => s.flags.station_visited,
                scene: 'watch_crowd'
            },
            {
                id: 'check_timetable',
                text: '看电车时刻表',
                condition: (s) => s.flags.station_visited,
                scene: 'check_timetable'
            },
            {
                id: 'thursday_kids',
                text: '注意到角落里的孩子们',
                condition: (s) => s.flags.talked_horita && s.dayIndex >= 2 && !s.flags.saw_thursday_kids,
                important: true,
                scene: 'thursday_kids'
            },
            {
                id: 'battle_cultist_1',
                text: '白袍的人在接近——',
                important: true,
                condition: (s) => s.flags.battle_bentham_weak_won && s.dayIndex >= 5 && !s.flags.battle_cultist_scout_won,
                scene: 'battle_cultist'
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
                condition: (s) => !s.flags.bridge_visited,
                narrative: [
                    '高架桥下。阳光照不到的地方。',
                    '有折叠椅。有帕斯卡的《思想录》。有空的咖啡罐。',
                    '有一个人。背对海，面对桥墩。头发全白。',
                    '他没有看你。你不确定他知道你来了。',
                    '——他看起来像50岁。但如果仔细看，脸上的皱纹不多。也许35。也许更年轻。',
                    '头发是一夜之间变白的那种白。不是自然老去的白。',
                ],
                onComplete: (s) => {
                    s.flags.bridge_visited = true;
                }
            },
            bridgeReturn: {
                condition: (s) => s.flags.left_pocari_bridge && !s.flags.bridge_return && s.dayIndex >= 1,
                narrative: [
                    '高架桥下。',
                    '昨天留下的宝矿力瓶子——空了。',
                    '放在折叠椅旁边。瓶盖拧得很整齐。',
                    '他还是坐在那里。面对桥墩。背对海。',
                    '但《思想录》翻到了不同的页数——也许。你不确定。',
                ],
                onComplete: (s) => { s.flags.bridge_return = true; }
            },
            idle: {
                narrative: [
                    '高架桥下。那个男人还在那里。',
                    '折叠椅。白发。《思想录》翻开在同一页。',
                    '潮湿的混凝土气味。远处海浪的声音。',
                ],
            }
        },
        actions: [
            {
                id: 'leave_pocari',
                text: '把宝矿力放在旁边',
                condition: (s) => s.flags.bridge_visited && !s.flags.left_pocari_bridge,
                scene: 'leave_pocari',
                setFlag: 'left_pocari_bridge'
            },
            {
                id: 'leave_coffee',
                text: '带罗多伦咖啡来',
                condition: (s) => s.flags.bridge_return && !s.flags.left_coffee_bridge,
                scene: 'leave_coffee',
                setFlag: 'left_coffee_bridge'
            },
            {
                id: 'try_talk_fujimori',
                text: '试着说话',
                condition: (s) => s.flags.bridge_return && !s.flags.fujimori_talked,
                scene: 'try_talk_fujimori',
                setFlag: 'fujimori_talked'
            },
            {
                id: 'sit_bridge',
                text: '坐在旁边，不说话',
                condition: (s) => s.flags.bridge_visited,
                scene: 'sit_bridge',
                logosGain: 0.2
            }
        ]
    },

    shrine: {
        id: 'shrine',
        name: '旧神社',
        desc: '石阶上长满了青苔。绘马褪色了。蝉鸣在这里格外响。',
        connections: ['school', 'teibow'],
        events: {
            firstVisit: {
                condition: (s) => !s.flags.shrine_visited,
                narrative: [
                    '旧神社。',
                    '石阶。褪色的鸟居褪成了灰粉色。绘马上的字被雨水冲掉了大半。',
                    '蝉鸣在这里特别响。也许是因为树多。也许是因为安静。',
                    '赛钱箱里有几枚1日元硬币。没有人来参拜。',
                    '——或者说，来参拜的人不想被看到。',
                ],
                onComplete: (s) => { s.flags.shrine_visited = true; }
            },
            benthamAppear: {
                condition: (s) => s.flags.shrine_visited && s.dayIndex >= 2 && !s.flags.bentham_event,
                narrative: [
                    '神社的石阶上。有人。',
                    '一个男人。30岁左右。西装革履，但领带松了。',
                    '他蹲在石阶上，双手捂着头。',
                    '身上散发着一种奇怪的气息——像是空气在他周围扭曲了。',
                    '你见过这种扭曲。在镜子里。在自己的瞳孔里。',
                    '——哲学症。',
                ],
                onComplete: (s) => {
                    s.flags.bentham_event = true;
                    s.flags.bentham_encounter_ready = true;
                }
            },
            idle: {
                narrative: [
                    '旧神社。石阶。蝉鸣。',
                    '绘马在风中轻轻晃动。上面写着看不清的愿望。',
                ],
            }
        },
        actions: [
            {
                id: 'read_ema',
                text: '看绘马',
                condition: (s) => s.flags.shrine_visited,
                scene: 'read_ema'
            },
            {
                id: 'approach_bentham',
                text: '走近那个男人',
                important: true,
                condition: (s) => s.flags.bentham_encounter_ready && !s.flags.bentham_confronted,
                scene: 'approach_bentham'
            },
            {
                id: 'battle_bentham_1',
                text: '阻止他——用你的方式',
                important: true,
                condition: (s) => s.flags.bentham_confronted && s.flags.nine_contact && !s.flags.battle_bentham_weak_won && s.dayIndex >= 3,
                scene: 'battle_bentham'
            },
            {
                id: 'battle_bentham_boss',
                text: '他又回来了——这次不一样',
                important: true,
                condition: (s) => s.flags.battle_bentham_weak_won && s.dayIndex >= 7 && !s.flags.battle_bentham_strong_won,
                scene: 'battle_bentham_boss'
            }
        ]
    },

    convenience: {
        id: 'convenience',
        name: '深夜便利店',
        desc: '白色日光灯。关东煮的气味。店员在看漫画。',
        connections: ['vendingMachine', 'stationPlaza'],
        events: {
            firstVisit: {
                condition: (s) => !s.flags.convenience_visited,
                narrative: [
                    '便利店。24小时营业。',
                    '推开门。冷气和关东煮的气味一起扑过来。',
                    '店员是个大学生模样的男人，在看《周刊少年JUMP》。',
                    '杂志架上：「ノストラダムスの大予言——1999年7の月、恐怖の大王降りてくる」',
                    '旁边是：「Windows 98 完全攻略」「特集：千年虫とは何か」',
                    '收音机在放宇多田ヒカル的《Automatic》。',
                ],
                onComplete: (s) => { s.flags.convenience_visited = true; }
            },
            idle: {
                narrative: [
                    '便利店。日光灯嗡嗡响。',
                    '关东煮的气味。收银台旁的烟灰缸。',
                    '时间在这里像是停止了——但其实只是重复。',
                ],
            }
        },
        actions: [
            {
                id: 'browse_magazine',
                text: '翻杂志',
                condition: (s) => s.flags.convenience_visited,
                scene: 'browse_magazine'
            },
            {
                id: 'buy_onigiri',
                text: '买饭团（110円）',
                condition: (s) => true,
                scene: 'buy_onigiri',
                logosGain: 0.1
            },
            {
                id: 'talk_clerk',
                text: '和店员说话',
                condition: (s) => s.flags.convenience_visited && s.timeOfDay === 'night',
                scene: 'talk_clerk'
            },
            {
                id: 'convenience_late',
                text: '在凌晨的便利店待着',
                condition: (s) => s.timeOfDay === 'night' && s.flags.convenience_visited && !s.flags.convenience_late_done,
                scene: 'convenience_late_night',
                setFlag: 'convenience_late_done'
            }
        ]
    }
};
