/**
 * 世纪末异邦人 — 全部行动/事件对话脚本
 */

const StoryScripts = {

    // ========== 堤防 ==========

    sit_teibow: [
        { speaker: null, text: '坐下来。混凝土的余温从裤子渗进皮肤。' },
        { speaker: null, text: '远处有渔船。近处有蝉。你哪里都不想去。' },
        { speaker: null, text: '太阳把影子压得很短。你的影子刚好够你坐进去。' },
        { speaker: null, text: '——这样也好。不需要理由。不需要意义。' },
        { speaker: null, text: '坐着就是坐着。' },
    ],

    look_sea: [
        { speaker: null, text: '海面反射着午后的光。看久了，光斑会在视网膜上留下残影。' },
        { speaker: null, text: '有渔船。有海鸥。有消波块。' },
        { speaker: null, text: '祖父从大陆回来的时候，看到的是同一片海吗？' },
        { speaker: null, text: '他带回了一本岩波文库版的《西西弗神话》。1951年初版。' },
        { speaker: null, text: '扉页上有他的名字。墨水已经褪色了。' },
        { speaker: null, text: '那本书现在在你房间的书架上。和妹妹的遗物放在一起。' },
        { speaker: null, text: '不——不是放在一起。是「在旁边」。' },
        { speaker: null, text: '……看海看到想起这些。不好。转移注意力。' },
    ],

    remember_miyuki: [
        { speaker: null, text: '宝矿力。深雪也喝这个。' },
        { speaker: null, text: '不——她喝的是水蜜桃味的。你总是买错。' },
        { speaker: null, text: '每次买错她都会鼓起腮帮子。但还是会喝。' },
        { speaker: null, text: '后来你就只买原味了。因为原味不会提醒你买错了。' },
        { speaker: null, text: '……' },
        { speaker: null, text: '1994年。平成6年。她11岁。你14岁。' },
        { speaker: null, text: '3月发病。急性白血病。' },
        { speaker: null, text: '8月5日——16时32分。' },
        { speaker: null, text: '那天的天气和今天一样。37度。蝉在叫。' },
        { speaker: null, text: '她最后说了什么来着——不对。她最后是什么表情来着——' },
        { speaker: null, text: '想不起来了。不是忘了。是不敢想起来。' },
        { speaker: null, text: '床下的纸箱。五年了。' },
        { speaker: null, text: '每月15日取出来。放回去。不打开。' },
        { speaker: null, text: '——为什么是15日。为什么不是5日。为什么不是每天。' },
        { speaker: null, text: '因为每天的话就太像在意了。' },
        { speaker: null, text: '你不能在意。你已经决定了——' },
        { speaker: null, text: '推石头。不回头。\n不回头。' },
    ],

    teibow_night_think: [
        { speaker: null, text: '夜晚的堤防。月光。海风。' },
        { speaker: null, text: '如果从这里跳下去——' },
        { speaker: null, text: '不。不是在想那个。你已经过了想那个的年纪。' },
        { speaker: null, text: '你只是在想——如果掉下去，水有多深。' },
        { speaker: null, text: '大概两米。不够。低潮时露出消波块，会撞到混凝土。' },
        { speaker: null, text: '加缪说：「真正严肃的哲学问题只有一个——自杀。」' },
        { speaker: null, text: '他还说：「判断人生值不值得活，就是回答哲学的根本问题。」' },
        { speaker: null, text: '然后他选择了活着。' },
        { speaker: null, text: '然后他在46岁死于车祸。' },
        { speaker: null, text: '……' },
        { speaker: null, text: '推石头吧。明天继续。' },
    ],

    teibow_count: [
        { speaker: null, text: '确认。' },
        { speaker: null, text: '呼吸——有。心跳——有。手指能动。脚趾能动。' },
        { speaker: null, text: '看得见海。听得见蝉。闻得到沥青和盐。' },
        { speaker: null, text: '活着。' },
        { speaker: null, text: '第——多少次了？327？328？' },
        { speaker: null, text: '记不清了。以前记得很清楚。用正字记在笔记本上。' },
        { speaker: null, text: '后来笔记本写满了。换了新的。新的也快写满了。' },
        { speaker: null, text: '——确认完毕。还活着。今天也是。' },
    ],

    teibow_evening_mikuriya: [
        { speaker: null, text: '傍晚的堤防。你在等人。' },
        { speaker: null, text: '你说不上为什么要等。也没约好。只是——' },
        { speaker: null, text: '「也没什么别的事可做。」' },
        { speaker: null, text: '……十分钟。二十分钟。' },
        { speaker: null, text: '远处有人走过来。矮个子。低马尾。书包上挂着海豚。' },
        { speaker: '御厨光', text: '「…………你在这里。」' },
        { speaker: null, text: '她的声音比昨天稍微大了一点点。也许是错觉。' },
        { speaker: '夏目珀', text: '「嗯。」' },
        { speaker: null, text: '她在你旁边坐下来。隔了一个人的距离。' },
        { speaker: null, text: '海风吹来。傍晚的风终于凉了一点。' },
        {
            speaker: '御厨光',
            text: '「……我今天看了一整天柏拉图。」',
            choices: [
                { text: '「感想呢？」', bondChange: { mikuriya: 1 } },
                { text: '「累不累？」', bondChange: { mikuriya: 2 } },
                { text: '（沉默）', bondChange: { mikuriya: 1 } },
            ]
        },
        { speaker: '御厨光', text: '「柏拉图说，灵魂在出生之前见过真理。活着只是在回忆。」' },
        { speaker: '御厨光', text: '「如果是这样的话——我们已经知道答案了。只是忘了。」' },
        { speaker: null, text: '她把膝盖抱起来。下巴搁在膝盖上。' },
        { speaker: '御厨光', text: '「你觉得呢？你觉得……你已经知道答案了吗？」' },
        {
            speaker: null,
            text: '夕阳正好沉下去一半。海面被切成明暗两块。',
            choices: [
                {
                    text: '「不知道。但我在找。」',
                    bondChange: { mikuriya: 2 },
                },
                {
                    text: '「就算知道了也没什么区别吧。」',
                    bondChange: { mikuriya: 1 },
                },
                {
                    text: '「深雪知道。但她没来得及告诉我。」',
                    requiredDeaths: 3,
                    bondChange: { mikuriya: 4 },
                    setFlag: 'told_mikuriya_about_miyuki',
                },
            ]
        },
        { speaker: null, text: '她没有回答。但她没有站起来。' },
        { speaker: null, text: '你们就这样坐着。堤防。海风。蝉鸣渐息。' },
        { speaker: null, text: '直到路灯亮起来。' },
        { speaker: '御厨光', text: '「……明天见。」' },
        {
            speaker: null,
            text: '她站起来。拍了拍裙子。',
            choices: [
                { text: '「明天见。」', bondChange: { mikuriya: 1 } },
                { text: '「明天还活着的话。」', bondChange: { mikuriya: 2 } },
            ]
        },
        { speaker: null, text: '她走了。书包上的海豚在暮色中晃动。' },
        { speaker: null, text: '你又坐了一会儿。路灯嗡嗡响。蝉换了班。' },
        { speaker: null, text: '……明天见。' },
    ],

    // ========== 自动贩卖机 ==========

    buy_pocari: [
        { speaker: null, text: '投入100日元。咕隆。瓶子滚出来。' },
        { speaker: null, text: '冰凉的。在手心留下水珠。' },
        { speaker: null, text: '喝了一口。甜的。什么味道都没有的甜。' },
        { speaker: null, text: '深雪喜欢水蜜桃味。你喜欢原味。也许你不是喜欢原味。只是——' },
        { speaker: null, text: '算了。喝就是了。' },
    ],

    buy_boss: [
        { speaker: null, text: '投入120日元。咕隆。罐装咖啡。' },
        { speaker: null, text: '苦的。罐底印着「SINCE 1992」。' },
        { speaker: null, text: '七年了。和蝉的地下生活一样长。' },
        { speaker: null, text: '你不喜欢咖啡。但你需要苦味。甜的会让你想起不该想的事。' },
    ],

    sit_vending_night: [
        { speaker: null, text: '靠着贩卖机坐下来。金属外壳温热的。嗡嗡的振动传进后背。' },
        { speaker: null, text: '飞蛾在灯管旁边跳舞。影子在地上画圈。' },
        { speaker: null, text: '这里是你的特等席。不是电影院，不是咖啡厅。是一台贩卖机旁边。' },
        { speaker: null, text: '但这里有光。有声音。有冰凉的饮料。' },
        { speaker: null, text: '够了。' },
        { speaker: null, text: '深夜的世界很安静。白天堆积的意义散去了。温度下降。噪音减少。' },
        { speaker: null, text: '呼吸变得容易了一点。' },
    ],

    vending_count: [
        { speaker: null, text: '闲得慌。数贩卖机里的饮料。' },
        { speaker: null, text: '宝矿力——还剩7瓶。BOSS咖啡——4瓶。午后的红茶——9瓶。' },
        { speaker: null, text: '可尔必思——3瓶。三矢苏打——6瓶。乌龙茶——满的。' },
        { speaker: null, text: '没有人买乌龙茶。可能因为不甜也不苦。存在感太低了。' },
        { speaker: null, text: '……你有点同情乌龙茶。' },
    ],

    // ========== 学校 ==========

    check_bulletin: [
        { speaker: null, text: '告示板。各种通知用图钉订着。' },
        { speaker: null, text: '「暑期补习时间表」「文化祭准备委员会招募」「保健室开放时间变更」' },
        { speaker: null, text: '「图书馆暑期特别推荐书单」——里面有《西西弗神话》。旁边有人用铅笔写了个小小的「！」。' },
        { speaker: null, text: '最下面有一张手写的纸条，被人撕掉了一半。' },
        { speaker: null, text: '残留的文字是：「如果有人也觉得活着很——」' },
        { speaker: null, text: '下半句被撕掉了。' },
        { speaker: null, text: '是谁写的。写的什么。「很辛苦」？「很无聊」？「很奇怪」？' },
        { speaker: null, text: '……你在告示板前站了很久。' },
    ],

    check_classroom: [
        { speaker: null, text: '二年三组。教室门锁着。从窗户往里看。' },
        { speaker: null, text: '课桌排得整整齐齐。黑板擦得干净。粉笔灰在阳光里飘。' },
        { speaker: null, text: '你的座位在窗边最后一排。旁边是——' },
        { speaker: null, text: '旁边是御厨光的座位。' },
        { speaker: null, text: '你从来没注意过。坐了一年半，没有说过一句话。' },
        { speaker: null, text: '她的桌面很干净。没有贴纸。没有刻字。只有一个橡皮擦的痕迹。' },
        { speaker: null, text: '……暑假结束后，你还会坐在这里吗。' },
        { speaker: null, text: '她还会坐在旁边吗。' },
    ],

    follow_takashiro: [
        { speaker: null, text: '你跟上了高城黎。' },
        { speaker: null, text: '他走得很快。制服的后摆几乎不动——像是连风都不敢碰他。' },
        { speaker: null, text: '他在学生会室门前停下来。掏出钥匙。' },
        { speaker: null, text: '然后——转身。' },
        { speaker: '高城黎', text: '「跟了我三十秒。不出声。呼吸控制得不错。」' },
        { speaker: null, text: '金发。高眉骨。瞳孔深处——有什么在闪。' },
        { speaker: null, text: '不是光。是签名。你看不清写了什么，但你知道那是——' },
        { speaker: null, text: '和你一样的东西。' },
        {
            speaker: '高城黎',
            text: '「你是——二年三组的？」',
            choices: [
                { text: '「夏目珀。」', next: 10 },
                { text: '「……你也是吗。」', bondChange: { takashiro: 1 }, next: 10 },
                { text: '（沉默）', next: 13 },
            ]
        },
        // 10
        { speaker: null, text: '他看着你。像在称量什么。' },
        { speaker: '高城黎', text: '「夏目珀。——你的眼睛里有东西。」' },
        {
            speaker: '高城黎',
            text: '「不是感情。是签名。你知道那是什么吗？」',
            choices: [
                { text: '「加缪。」', bondChange: { takashiro: 2 }, next: 15 },
                { text: '「不知道。」', next: 14 },
            ]
        },
        // 13
        { speaker: '高城黎', text: '「不说话也行。你的沉默已经说了。」' },
        // 14
        { speaker: '高城黎', text: '「迟早会知道的。——不，你已经知道了。只是还没承认。」' },
        // 15
        { speaker: null, text: '他看了你三秒。然后转身打开学生会室的门。' },
        { speaker: '高城黎', text: '「有空的话——去旧神社看看。那里有你该看的东西。」' },
        { speaker: null, text: '门关了。' },
        { speaker: null, text: '走廊里只剩蝉鸣和空调声。' },
        { speaker: null, text: '——旧神社？' },
    ],

    // ========== 图书馆 ==========

    browse_philosophy: [
        { speaker: null, text: '哲学·思想·宗教。913.6。' },
        { speaker: null, text: '《存在与虚无》《纯粹理性批判》《查拉图斯特拉如是说》……' },
        { speaker: null, text: '你的手指停在一本泛黄的文库本上。' },
        { speaker: null, text: '《西西弗神话》。岩波文库。和祖父留下的是同一个版本。' },
        { speaker: null, text: '翻开。纸张泛黄。有人在页边写过铅笔笔记。' },
        { speaker: null, text: '第43页——「我们必须想象西西弗是幸福的」——有人画了线。' },
        { speaker: null, text: '你的指尖触到铅笔痕迹。' },
        { speaker: null, text: '……然后你放回去了。' },
    ],

    read_sisyphus: [
        { speaker: null, text: '你拿起了《西西弗神话》。' },
        { speaker: null, text: '坐在窗边。翻开。' },
        { speaker: null, text: '——「荒谬并不在人，也不在世界，而在两者的共存。」' },
        { speaker: null, text: '你知道这句话。祖父的版本里也有。' },
        { speaker: null, text: '但在图书馆的冷气里读，和在堤防上听收音机说，感觉不一样。' },
        { speaker: null, text: '图书馆的冷气把世界缩小了。缩小到一本书和一个人。' },
        { speaker: null, text: '这种缩小让荒谬变得——可以忍受。' },
        { speaker: null, text: '你读了半小时。然后合上书。' },
        { speaker: null, text: '窗外的蝉还在叫。它们不读加缪。' },
    ],

    library_nap: [
        { speaker: null, text: '趴在桌上。闭上眼。' },
        { speaker: null, text: '空调声变成了白噪音。翻页声变远了。' },
        { speaker: null, text: '你做了一个很短的梦。' },
        { speaker: null, text: '梦里有人在推石头。不是你。是一个——看不清脸的人。' },
        { speaker: null, text: '石头滚下去了。那个人站在山脚。转身——' },
        { speaker: null, text: '醒了。' },
        { speaker: null, text: '不知道过了多久。手臂上有课桌的印痕。' },
        { speaker: null, text: '窗外的光变了。也许过了一个小时。' },
    ],

    talk_mikuriya_day2: [
        { speaker: null, text: '你坐到她旁边。和昨天一样的位置。对面的书架前。' },
        { speaker: null, text: '她没有抬头。但翻页的速度变慢了。' },
        { speaker: null, text: '三分钟。五分钟。' },
        { speaker: '御厨光', text: '「……《斐多》。苏格拉底临死前说的话。」' },
        { speaker: null, text: '她主动开口了。声音比昨天稍微大一点。' },
        { speaker: '御厨光', text: '「他说灵魂不灭。说哲学家一生都在练习死亡。」' },
        { speaker: '御厨光', text: '「——你觉得，人死了之后，还剩什么？」' },
        {
            speaker: null,
            text: '她的手指在书页边缘。指甲剪得很短。',
            choices: [
                {
                    text: '「什么都不剩。但活着的人会记得。」',
                    bondChange: { mikuriya: 2 },
                },
                {
                    text: '「剩一瓶没喝完的宝矿力。」',
                    bondChange: { mikuriya: 3 },
                    setFlag: 'mikuriya_laughed',
                },
                {
                    text: '「…………」（说不出来）',
                    bondChange: { mikuriya: 1 },
                },
            ]
        },
        { speaker: null, text: '她看着你。那双浅褐色的瞳孔——' },
        { speaker: null, text: '你忽然觉得，她看到的不是你的脸。是更深处的什么。' },
        { speaker: '御厨光', text: '「……你失去过人吧。」' },
        { speaker: null, text: '不是疑问句。是确认。' },
        { speaker: null, text: '你没有回答。但你也没有站起来。' },
        { speaker: '御厨光', text: '「我也是。不是人。是——世界。」' },
        { speaker: '御厨光', text: '「从小就觉得，这个世界不太对。像投影。像梦。」' },
        { speaker: '御厨光', text: '「6月28日，我终于确定了。」' },
        { speaker: null, text: '她把左手翻过来。手心向上。' },
        { speaker: null, text: '——手心有微弱的光。不是反射。是从皮肤里透出来的。' },
        { speaker: null, text: '你见过这种光。在自己的瞳孔里。',
            effect: 'particles'
        },
        { speaker: '御厨光', text: '「你也有吧。」' },
        { speaker: null, text: '……' },
        { speaker: null, text: '窗外的蝉换了一个调子。空调滴了一滴水。' },
        {
            speaker: '御厨光',
            text: '「他们说——我还能活42天。今天是第33天。」',
            effect: 'shake'
        },
        { speaker: null, text: '她说这句话的时候，表情没有变。' },
        { speaker: null, text: '就像在说明天的天气预报一样。' },
        {
            speaker: null,
            text: '你——',
            choices: [
                {
                    text: '「谁说的。」',
                    bondChange: { mikuriya: 1 },
                },
                {
                    text: '「42天……从什么时候开始算？」',
                    bondChange: { mikuriya: 2 },
                },
                {
                    text: '「你不怕吗。」',
                    bondChange: { mikuriya: 3 },
                },
            ]
        },
        { speaker: '御厨光', text: '「厚生省。第九课。他们管我们叫——论证者。」' },
        { speaker: '御厨光', text: '「发了病的人。能力觉醒的人。活不长的人。」' },
        { speaker: null, text: '她合上书。站起来。' },
        { speaker: '御厨光', text: '「我不怕死。我怕的是——到最后都不知道自己看见的是不是真的。」' },
        { speaker: null, text: '她把书塞进书包。海豚挂件晃了一下。' },
        { speaker: '御厨光', text: '「……如果明天你还来。我就告诉你更多的事。」' },
        { speaker: '御厨光', text: '「关于我。关于九课。关于——哲学症。」' },
        { speaker: null, text: '她走了。' },
        { speaker: null, text: '图书馆的空调声忽然变得很响。像是要填补她走后的空白。' },
        { speaker: null, text: '你坐在那里。手心——也在发微弱的光。' },
        { speaker: null, text: '你一直都知道。只是不想承认。' },
    ],

    // ========== 站前广场 ==========

    talk_horita: [
        { speaker: null, text: '穿荧光绿背心的男人。晒成小麦色的皮肤。圆脸。微卷短发。' },
        { speaker: null, text: '你走过去。他立刻笑了。' },
        { speaker: '堀田诚', text: '「报纸要吗？免费的。今天有星座运势。」' },
        { speaker: null, text: '他的笑容——你说不上来。不是假的。也不是无忧无虑。' },
        { speaker: null, text: '是那种「已经想过不笑了、但还是决定笑」的笑。' },
        {
            speaker: null,
            text: '……',
            choices: [
                { text: '「给我一份。」', setFlag: 'took_newspaper', bondChange: { horita: 1 } },
                { text: '「不用了。」' },
                {
                    text: '「你牛仔裤上写了什么？」',
                    requiredDeaths: 3,
                    setFlag: 'asked_horita_jeans',
                    bondChange: { horita: 2 },
                }
            ]
        },
        { speaker: '堀田诚', text: '「谢谢！——其实很少有人接。」' },
        { speaker: null, text: '他挠了挠后脑。' },
        { speaker: '堀田诚', text: '「我叫堀田诚。在这里发报纸。嗯——就是这样。每天。」' },
        { speaker: '堀田诚', text: '「你呢？学生？暑假了还到处走？」' },
        {
            speaker: null,
            text: '……',
            choices: [
                { text: '「也没什么别的事可做。」', bondChange: { horita: 1 } },
                { text: '「散步。」', bondChange: { horita: 0 } },
                { text: '「在推石头。」', bondChange: { horita: 2 }, setFlag: 'told_horita_stone' },
            ]
        },
        { speaker: '堀田诚', text: '「推石头……西西弗吗？加缪？」' },
        { speaker: null, text: '——他知道。' },
        { speaker: '堀田诚', text: '「大学时读过。教育学部——虽然中退了。」' },
        { speaker: null, text: '他的笑容维持着。但眼睛不笑了。只是嘴在笑。' },
        { speaker: '堀田诚', text: '「卢梭、洛克、杜威……读了一堆。然后——」' },
        { speaker: null, text: '他停了一下。看了一眼远处。' },
        { speaker: '堀田诚', text: '「然后发现，读再多也不知道怎么帮一个被欺负的孩子。」' },
        { speaker: null, text: '他又笑了。这次眼睛也在笑了。但笑的方向不对——是在笑自己。' },
        { speaker: '堀田诚', text: '「总之——报纸有问题找我。每天都在。星期四还会给附近的孩子们读漫画。」' },
        { speaker: null, text: '他转身继续发报纸。背影在阳光下晃动。' },
        { speaker: null, text: '牛仔裤右膝内侧——果然有字。' },
        { speaker: null, text: '「人是生而自由的，却无往不在枷锁之中。」' },
        { speaker: null, text: '卢梭。' },
    ],

    talk_horita_again: [
        { speaker: '堀田诚', text: '「哟！又来了。」' },
        { speaker: null, text: '他递给你一份报纸。不等你说要不要。' },
        { speaker: '堀田诚', text: '「今天的头条——「千年虫对策：政府保证万全」。」' },
        { speaker: '堀田诚', text: '「万全。万全啊。这种话信一次就够了。」' },
        { speaker: null, text: '他一边说一边继续发报纸。有人接了。大多数人没接。' },
        { speaker: '堀田诚', text: '「你知道吗？今年夏天——櫂町变奇怪了。」' },
        { speaker: '堀田诚', text: '「不是千年虫。是人。有些人——突然就不一样了。」' },
        { speaker: '堀田诚', text: '「前几天神社那边，有个上班族在石阶上坐了三天。」' },
        { speaker: '堀田诚', text: '「不吃不喝。嘴里一直在说什么——什么「最大多数的最大幸福」。」' },
        { speaker: null, text: '你的后背冷了一下。' },
        { speaker: null, text: '边沁。' },
        { speaker: '堀田诚', text: '「后来被人送医院了。但听说——出院后又回去了。」' },
        { speaker: null, text: '……旧神社。高城黎也提过那里。' },
    ],

    watch_crowd: [
        { speaker: null, text: '人群。上班族。学生。主妇。老人。' },
        { speaker: null, text: '每个人都在走。都在去某个地方。' },
        { speaker: null, text: '你站在人群中间。像河流中的石头。' },
        { speaker: null, text: '——不对。石头不是站在河里的。是被放在那里的。' },
        { speaker: null, text: '你也是被放在这里的吗？还是自己走到这里的？' },
        { speaker: null, text: '区别重要吗？' },
        { speaker: null, text: '一个女人拉着小孩走过。小孩回头看了你一眼。你们对视了半秒。' },
        { speaker: null, text: '然后她被拉走了。世界继续流动。' },
    ],

    check_timetable: [
        { speaker: null, text: '电车时刻表。' },
        { speaker: null, text: '往东京方向——每小时一班。末班21:15。' },
        { speaker: null, text: '往�的反方向——�的各站停车。每小时两班。' },
        { speaker: null, text: '从这里到东京。2小时37分。' },
        { speaker: null, text: '你从来没有去过东京。' },
        { speaker: null, text: '——不。去过一次。父亲还在的时候。你五岁。深雪三岁。' },
        { speaker: null, text: '去了动物园。深雪看到大象哭了。不是害怕。是太大了。她说「太大了」。' },
        { speaker: null, text: '……电车来了。门开了。没有人下车。门关了。' },
        { speaker: null, text: '你没有上车。' },
    ],

    thursday_kids: [
        { speaker: null, text: '广场角落。旧喷水池旁边。' },
        { speaker: null, text: '堀田在那里。蹲着。周围坐了四五个孩子。' },
        { speaker: null, text: '他手里拿着一本《七龙珠》单行本。在读给他们听。' },
        { speaker: '堀田诚', text: '「——悟空说：「还可以变得更强！」然后头发就——噗——变金了！」' },
        { speaker: null, text: '孩子们笑了。一个小女孩说：' },
        { speaker: '小女孩', text: '「堀田哥哥的头发也变金好了！」' },
        { speaker: '堀田诚', text: '「哈哈，那我得先学会放龟派气功才行！」' },
        { speaker: null, text: '他做了一个放气功的姿势。孩子们笑成一团。' },
        { speaker: null, text: '你站在远处看着。他没有注意到你。' },
        { speaker: null, text: '——不对。他注意到了。在笑的间隙看了你一眼。' },
        { speaker: null, text: '但他没有停。继续在笑。继续在读。' },
        { speaker: null, text: '读完之后，小女孩拉着他的手说：' },
        { speaker: '小女孩', text: '「堀田哥哥，你下周还来吗？」' },
        { speaker: '堀田诚', text: '「……嗯。来的。」' },
        { speaker: null, text: '他的声音——和平时不一样。平时的笑容有力气。这一句——没有力气。' },
        { speaker: null, text: '但他还是在笑。' },
    ],

    // ========== 高架桥 ==========

    leave_pocari: [
        { speaker: null, text: '你把宝矿力放在折叠椅旁。' },
        { speaker: null, text: '轻轻地。不想打扰他。' },
        { speaker: null, text: '他没有动。' },
        { speaker: null, text: '你离开了。' },
        { speaker: null, text: '走到桥柱拐角的时候回头看了一眼。' },
        { speaker: null, text: '——他的手指微微动了一下。' },
        { speaker: null, text: '你继续走。' },
        { speaker: null, text: '（在你走后三十分钟，他拿起了那瓶宝矿力。）' },
        { speaker: null, text: '（他看了很久瓶身上的商标。然后喝了一口。）' },
        { speaker: null, text: '（咸的。因为手上有汗。）' },
    ],

    leave_coffee: [
        { speaker: null, text: '罗多伦咖啡。罐装。你从便利店买的。' },
        { speaker: null, text: '放在昨天放宝矿力的同一个位置。' },
        { speaker: null, text: '他——' },
        { speaker: null, text: '他轻轻转了一下头。' },
        { speaker: null, text: '没有看你。但转了。' },
        { speaker: '藤森明', text: '「……」' },
        { speaker: null, text: '一个很轻的呼吸。可能是叹气。也可能只是在呼吸。' },
        { speaker: null, text: '你放下咖啡。离开了。' },
    ],

    try_talk_fujimori: [
        { speaker: null, text: '你站在他旁边。' },
        { speaker: null, text: '「…………」' },
        { speaker: null, text: '说什么？你好？你还好吗？你在这里多久了？' },
        { speaker: null, text: '都不对。每一句话都不对。' },
        { speaker: null, text: '你张了嘴。又合上。' },
        { speaker: null, text: '他没有看你。但——' },
        { speaker: '藤森明', text: '「……不用说。」' },
        { speaker: null, text: '声音沙哑。像是很久没说过话。' },
        { speaker: '藤森明', text: '「坐就好。」' },
        { speaker: null, text: '你坐下来。在折叠椅旁边的地上。' },
        { speaker: null, text: '五分钟。十分钟。' },
        { speaker: null, text: '他翻了一页《思想录》。第一次——你看到他翻页。' },
        { speaker: '藤森明', text: '「……帕斯卡说。」' },
        { speaker: '藤森明', text: '「这些无穷空间的永恒沉默使我恐惧。」' },
        { speaker: null, text: '然后他不说话了。' },
        { speaker: null, text: '海浪声。桥上汽车经过的声音。远处的汽笛。' },
        { speaker: null, text: '你什么都没说。但你没有站起来。' },
        { speaker: null, text: '——也许这就够了。' },
    ],

    sit_bridge: [
        { speaker: null, text: '你坐在折叠椅旁边的地上。不说话。' },
        { speaker: null, text: '他也不说话。' },
        { speaker: null, text: '潮湿的混凝土。远处的海浪。桥上偶尔有车经过。' },
        { speaker: null, text: '你们之间的沉默不是尴尬的。是——两个不需要说话的人的沉默。' },
        { speaker: null, text: '像是各自在翻不同的书。但坐在同一张桌子旁。' },
    ],

    // ========== 旧神社 ==========

    read_ema: [
        { speaker: null, text: '绘马。五六块。褪色的木板。' },
        { speaker: null, text: '「合格祈愿」——字迹工整。高中生的字。' },
        { speaker: null, text: '「家内安全」——已经看不清是谁写的了。' },
        { speaker: null, text: '「世界和平」——字很大。用力过猛。木板上有刻痕。' },
        { speaker: null, text: '「让一切都不要变」——' },
        { speaker: null, text: '这一块比较新。墨色还没褪。' },
        { speaker: null, text: '翻过来看背面——有一个日期：「1999.6.28」。' },
        { speaker: null, text: '6月28日。' },
        { speaker: null, text: '——御厨光觉醒的日期。' },
        { speaker: null, text: '……是她写的吗？' },
    ],

    approach_bentham: [
        { speaker: null, text: '你走向石阶上的男人。' },
        { speaker: null, text: '近了。更近了。空气在他周围——扭曲着。像热浪。但不是热。' },
        { speaker: null, text: '他的嘴在动。一直在动。',
            effect: 'shake'
        },
        { speaker: '边沁系论证者', text: '「——最大多数的最大幸福。最大多数的——最大——」' },
        { speaker: null, text: '他抬起头。眼睛——' },
        { speaker: null, text: '瞳孔里有签名。你看得清清楚楚——「J.Bentham」。',
            effect: 'particles'
        },
        { speaker: '边沁系论证者', text: '「你——你能看见吗？你能看见数字吗？」' },
        { speaker: null, text: '他的声音在颤抖。不是害怕。是——过载。' },
        { speaker: '边沁系论证者', text: '「每个人头上都有数字。幸福的量化值。我能看见——」' },
        { speaker: '边沁系论证者', text: '「老婆婆的是37。小孩的是82。路过的上班族是15。」' },
        { speaker: '边沁系论证者', text: '「我自己的是——」' },
        { speaker: null, text: '他低头看了看自己的手。手在发抖。' },
        { speaker: '边沁系论证者', text: '「——0.3。」' },
        { speaker: null, text: '他站起来了。不稳。像醉了一样。' },
        { speaker: '边沁系论证者', text: '「如果我的幸福值是0.3——那牺牲我——提高其他人的——」' },
        { speaker: null, text: '他向你走来。——不对。他在向你的方向走。但不是走向你。' },
        { speaker: null, text: '他在向马路走。',
            effect: 'shake'
        },
        {
            speaker: null,
            text: '——他要走到车道上去。',
            choices: [
                {
                    text: '拦住他。',
                    setFlag: 'stopped_bentham',
                    next: 18
                },
                {
                    text: '「你的数字错了。」',
                    setFlag: 'corrected_bentham',
                    bondChange: { kuga: 1 },
                    next: 21
                },
            ]
        },
        // 18
        { speaker: null, text: '你伸手拉住他的手臂。' },
        { speaker: null, text: '接触的瞬间——你的瞳孔里有什么在燃烧。',
            effect: 'flash'
        },
        { speaker: null, text: '加缪的签名。从瞳孔深处浮现。' },
        { speaker: null, text: '——这是你第一次，真正使用了这个力量。',
            next: 24
        },
        // 21
        { speaker: null, text: '你的声音——平静得不像自己。' },
        { speaker: '夏目珀', text: '「你的数字错了。不是0.3。」' },
        { speaker: '夏目珀', text: '「——幸福不能量化。加缪说过。荒谬的世界里没有数字。」',
            effect: 'particles'
        },
        // 24
        { speaker: null, text: '男人停下了。他看着你的眼睛。' },
        { speaker: '边沁系论证者', text: '「你的眼睛——也有签名……」' },
        { speaker: null, text: '他的身体在颤抖。空气中的扭曲——加剧了。' },
        { speaker: null, text: '远处——有脚步声。很多。很整齐。' },
        { speaker: '？？？', text: '「厚生省第九课。请不要动。」' },
        { speaker: null, text: '藏青西装。公文包。短发。鬓角有白。' },
        { speaker: null, text: '——那个男人走过来。边沁系论证者瞬间安静了。' },
        { speaker: null, text: '像是被规则压住了一样。' },
        { speaker: '久我冻夜', text: '「C-1999-0709。边沁系论证者。四等。」' },
        { speaker: '久我冻夜', text: '「移交处理。——你们两个，把他带走。」' },
        { speaker: null, text: '两个穿制服的人把男人架了起来。他没有反抗。嘴还在动——但没有声音了。' },
        { speaker: null, text: '然后——藏青西装转身看你。' },
        { speaker: '久我冻夜', text: '「……你。夏目珀。」' },
        { speaker: null, text: '他知道你的名字。' },
        { speaker: '久我冻夜', text: '「櫂町高校二年三组。7月13日觉醒。思想源流——加缪。」' },
        { speaker: '久我冻夜', text: '「我叫久我冻夜。厚生省第九课现场指挥官。」' },
        { speaker: '久我冻夜', text: '「我们需要谈谈。」' },
        {
            speaker: null,
            text: '蝉在叫。太阳在晒。神社的石阶上只剩你和他。',
            choices: [
                {
                    text: '「……谈什么。」',
                    bondChange: { kuga: 1 },
                },
                {
                    text: '「你们要把他怎么样。」',
                    bondChange: { kuga: 2 },
                    setFlag: 'asked_about_bentham',
                },
                {
                    text: '「你也是——论证者吗。」',
                    bondChange: { kuga: 2 },
                    setFlag: 'asked_kuga_identity',
                },
            ]
        },
        { speaker: '久我冻夜', text: '「谈你的病。你的能力。还有——你能做什么。」' },
        { speaker: '久我冻夜', text: '「九课需要协助者。能控制能力的论证者。」' },
        { speaker: '久我冻夜', text: '「櫂町的哲学症病例在增加。今年夏天已经有12人结晶化。」' },
        { speaker: '久我冻夜', text: '「你可以选择不帮我们。但那个男人——」' },
        { speaker: null, text: '他顿了一下。' },
        { speaker: '久我冻夜', text: '「他三天前还是银行职员。有妻子。有女儿。今年3岁。」' },
        { speaker: '久我冻夜', text: '「现在他的女儿正在托儿所等爸爸来接。」' },
        { speaker: null, text: '……' },
        { speaker: '久我冻夜', text: '「——你愿意帮忙吗。夏目。」' },
        {
            speaker: null,
            text: '蝉鸣。石阶。褪色的鸟居。',
            choices: [
                {
                    text: '「……也没什么别的事可做。」',
                    setFlag: 'joined_nine',
                    bondChange: { kuga: 3 },
                },
                {
                    text: '「让我想想。」',
                    setFlag: 'delayed_nine',
                    bondChange: { kuga: 1 },
                },
            ]
        },
        { speaker: null, text: '他点了一下头。从公文包里拿出一张名片。' },
        { speaker: null, text: '「厚生省附属特殊疫病对策室 第九课 久我冻夜」' },
        { speaker: null, text: '名片的纸质很普通。政府机关的标准格式。没有什么特别的。' },
        { speaker: null, text: '就像这整件事应该是普通的一样。' },
        { speaker: '久我冻夜', text: '「有事联系我。——还有。」' },
        { speaker: '久我冻夜', text: '「别在堤防上坐太久。晒伤了没人管你。」' },
        { speaker: null, text: '他走了。藏青西装消失在石阶下面。' },
        { speaker: null, text: '你手里捏着名片。纸在发烫——是太阳晒的。' },
        { speaker: null, text: '……\n\n九课。论证者。哲学症。' },
        { speaker: null, text: '1999年的夏天——好像比你想的要长。' },
    ],

    // ========== 便利店 ==========

    browse_magazine: [
        { speaker: null, text: '杂志架。' },
        { speaker: null, text: '《周刊少年JUMP》——最新一期封面是《ONE PIECE》。' },
        { speaker: null, text: '《SPA!》——特集「1999年世界末日最终倒计时」。' },
        { speaker: null, text: '《ダ・ヴィンチ》——「今月の推薦図書」里有村上春树的新作。' },
        { speaker: null, text: '你翻了几页末日特集。诺查丹玛斯。千年虫。太阳风暴。小行星。' },
        { speaker: null, text: '——哲学症不在里面。当然不在。官方否认。媒体不报道。' },
        { speaker: null, text: '但你知道。你身边就有。你自己就是。' },
        { speaker: null, text: '合上杂志。放回去。位置和拿起来时一模一样。' },
        { speaker: null, text: '你擅长把东西放回原位。放回去就当没拿过。' },
    ],

    buy_onigiri: [
        { speaker: null, text: '饭团。�的�的梅子味。110日元。' },
        { speaker: null, text: '塑料包装上印着「赏味期限1999.07.15」。还有两天。' },
        { speaker: null, text: '撕开包装。咬了一口。咸的。梅子的酸味在口腔里散开。' },
        { speaker: null, text: '——吃东西的时候不需要思考。这是活着的好处之一。' },
        { speaker: null, text: '嚼。咽。再咬一口。' },
        { speaker: null, text: '身体是简单的。饿了就吃。渴了就喝。困了就睡。' },
        { speaker: null, text: '复杂的是脑子。脑子不肯停。' },
    ],

    talk_clerk: [
        { speaker: null, text: '深夜。只有你和店员。' },
        { speaker: null, text: '店员在看漫画。抬起头看了你一眼。又低下去。' },
        { speaker: null, text: '你站在收银台前。' },
        { speaker: '店员', text: '「……要什么？」' },
        { speaker: null, text: '他大概22、23岁。大学生的样子。黑眼圈很重。' },
        {
            speaker: null,
            text: '……',
            choices: [
                { text: '「你相信千年虫吗。」' },
                { text: '「你觉得世界会在今年结束吗。」' },
                { text: '「没事。」' },
            ]
        },
        { speaker: '店员', text: '「……你是第三个今晚问我这种问题的人了。」' },
        { speaker: '店员', text: '「第一个是喝醉的大叔。第二个是穿制服的高中女生。」' },
        { speaker: '店员', text: '「世界会不会结束我不知道。但我的班到早上六点。」' },
        { speaker: '店员', text: '「所以至少在六点之前，世界最好不要结束。」' },
        { speaker: null, text: '……你笑了。很小声。自己都没注意到。' },
        { speaker: null, text: '「至少在六点之前」。这个回答——比任何哲学家都诚实。' },
    ],

};
