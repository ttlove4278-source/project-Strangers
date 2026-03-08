const EnemyData = {
    bentham_weak: {
        name: '边沁系论证者', source: 'BENTHAM', logos: 6, maxLogos: 6,
        declaration: '最大多数的最大幸福。',
        weakness: '功利计算无法包含自身——计算者被排除在幸福之外。',
        openingText: '男人站在你面前。瞳孔里「J.Bentham」的签名在燃烧。\n\n空气扭曲了。数字在他周围浮动——你的头上显示着：4.2。\n\n他说：「如果牺牲你能让更多人幸福——」',
        defeatText: '数字消失了。他跪在地上，大口喘气。\n\n「我的数字……不是0.3吗……」\n\n他哭了。久我冻夜的人会来接他。',
        playerDefeatText: '数字淹没了你。你的存在被压缩成0。',
        actions: [
            { type:'attack', damage:1.2, variance:0.5, dialogue:'你的幸福值只有4.2——牺牲你是最优解！', description:'功利计算——他把你的存在换算成数字。' },
            { type:'attack', damage:1.8, variance:0.3, dialogue:'最大多数！最大幸福！这是数学！', description:'数字的洪流涌向你。' },
            { type:'monologue', dialogue:'我妻子的幸福值是67……女儿的是82……为什么我只有0.3……', description:'他的声音在颤抖。命题在动摇。' },
            { type:'heal', amount:1.5, dialogue:'不——计算是正确的！', description:'他强化了自己的信念。' },
        ]
    },
    bentham_strong: {
        name: '边沁系论证者（重症）', source: 'BENTHAM', logos: 12, maxLogos: 12,
        declaration: '存在本身就是可以被计算的。',
        weakness: '幸福不能由旁人替你定义——即使是最精确的计算。',
        openingText: '他回来了。不是那个狼狈的男人。是——别的东西。\n\n瞳孔完全被签名覆盖。嘴里发出的不是人声——是数字。\n\n「1, 1, 2, 3, 5, 8, 13, 21——」\n\n空气在被计算。你的存在也有了编号。',
        defeatText: '数字碎了。他倒在地上。\n\n「……你凭什么说幸福不能计算……」\n\n你蹲下来。「也许你不需要知道。」\n\n他闭上了眼睛。——他没有结晶化。今天不会。',
        playerDefeatText: '你被编了号。0001-1999-0701。幸福值：0.0。',
        actions: [
            { type:'attack', damage:2.0, variance:0.8, dialogue:'你的存在价值等于——', description:'计算风暴。' },
            { type:'attack', damage:2.5, variance:0.5, dialogue:'世界是方程式！情感是误差！', description:'命题展开——「功利主义·最优化」。' },
            { type:'attack', damage:1.5, variance:0.3, dialogue:'1, 1, 2, 3, 5, 8——多美。', description:'斐波那契攻击。' },
            { type:'heal', amount:2.5, dialogue:'我的计算不会错。不会错。不会——', description:'自我强化。但声音在颤抖。' },
            { type:'monologue', dialogue:'女儿……今年3岁了……她的幸福值是——我不想算了……', description:'命题在裂缝里漏水。' },
        ]
    },
    cultist_scout: {
        name: '千年虫信徒（斥候）', source: 'AUGUSTINE', logos: 5, maxLogos: 5,
        declaration: '世界将在1999年进位。',
        weakness: '进位的恐惧源于对当下的否定——而你只活在当下。',
        openingText: '站前广场。一个穿白袍的人。\n\n「世纪末的使者。你——将在进位中被格式化。」\n\n瞳孔里有签名。「St.Augustine」。空气变冷了。',
        defeatText: '白袍倒在地上。面罩滑落。是个年轻人。\n\n「主……说过……进位之后……就不用再害怕了……」',
        actions: [
            { type:'attack', damage:1.0, variance:0.5, dialogue:'进位！0变成1！1变成0！', description:'时间攻击。' },
            { type:'attack', damage:1.5, variance:0.3, dialogue:'主说——不信的人将化为虚无！', description:'信仰冲击。' },
            { type:'monologue', dialogue:'我不想消失……所以我选择了被格式化……', description:'他在恐惧中祈祷。命题在动摇。' },
        ]
    }
};
