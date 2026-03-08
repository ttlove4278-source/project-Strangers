/**
 * 世纪末异邦人 — 敌方论证者数据
 */

const EnemyData = {

    bentham_weak: {
        name: '边沁系论证者',
        source: 'BENTHAM',
        logos: 6,
        maxLogos: 6,
        declaration: '最大多数的最大幸福。',
        weakness: '功利计算无法包含自身——计算者被排除在幸福之外。',
        openingText: '男人站在你面前。瞳孔里「J.Bentham」的签名在燃烧。\n\n空气扭曲了。数字在他周围浮动——每个人头上都有数字。\n你的头上显示着：4.2。\n\n他说：「如果牺牲你能让更多人幸福——」',
        defeatText: '数字消失了。\n\n他跪在地上，大口喘气。瞳孔里的签名变淡了。\n\n「我的数字……不是0.3吗……为什么你不让我……」\n\n他哭了。你没有回答。\n\n久我冻夜的人会来接他。他还能回家。\n女儿在托儿所等他。今年3岁。',
        playerDefeatText: '数字淹没了你。\n\n幸福被量化。痛苦被量化。\n你的存在被压缩成一个小数点后一位的数字。\n\n——0。',
        actions: [
            {
                type: 'attack', damage: 1.2, variance: 0.5,
                dialogue: '你的幸福值只有4.2——牺牲你是最优解！',
                description: '功利计算——他把你的存在换算成数字，然后试图减去。'
            },
            {
                type: 'attack', damage: 1.8, variance: 0.3,
                dialogue: '最大多数！最大幸福！这是数学！不是情感！',
                description: '命题强化——数字的洪流涌向你，每一个都在试图量化你的价值。'
            },
            {
                type: 'monologue',
                dialogue: '我妻子的幸福值是67……女儿的是82……为什么我只有0.3……',
                description: '他的声音在颤抖。命题在动摇。'
            },
            {
                type: 'heal', amount: 1.5,
                dialogue: '不——计算是正确的！我必须相信计算！',
                description: '他强化了自己的信念。逻各斯回复。'
            }
        ]
    },

    bentham_strong: {
        name: '边沁系论证者（重症）',
        source: 'BENTHAM',
        logos: 12,
        maxLogos: 12,
        declaration: '存在本身就是可以被计算的。',
        weakness: '幸福不能由旁人替你定义——即使是最精确的计算。',
        openingText: '他回来了。\n\n不是旧神社上的那个狼狈的男人。是——别的东西。\n\n瞳孔完全被签名覆盖。嘴唇在动，但发出的不是人声——是数字。\n\n「1, 1, 2, 3, 5, 8, 13, 21——」\n\n斐波那契数列。他在用数学的韵律重写现实。\n\n空气不再扭曲——空气在被计算。每一个分子都被赋予了数值。\n温度37.5——编号。湿度68%——编号。蝉鸣频率4500Hz——编号。\n\n你的存在也有了编号。\n\n——0001-1999-0701。夏目珀。幸福值：正在计算中。',
        defeatText: '数字碎了。像玻璃一样。\n\n他倒在地上。瞳孔里的签名在褪色——但没有完全消失。\n\n「……你凭什么说幸福不能计算……」\n「……如果不能计算……我怎么知道我做的是对的……」\n\n你蹲下来。\n\n「也许你不需要知道。」\n\n他闭上了眼睛。呼吸平稳了。签名变成了一条很淡的线。\n\n——他没有结晶化。\n今天不会。',
        playerDefeatText: '你被编了号。\n\n0001-1999-0701。\n幸福值：0.0。\n\n存在价值：可被牺牲。\n\n你消失在数字的洪流里。',
        actions: [
            {
                type: 'attack', damage: 2.0, variance: 0.8,
                dialogue: '你的存在价值等于——让我算算——',
                description: '计算风暴。数字像弹幕一样射向你。每一个都在否定你的不可量化。'
            },
            {
                type: 'attack', damage: 2.5, variance: 0.5,
                dialogue: '世界是方程式！情感是误差！你是——噪音！',
                description: '命题展开——「功利主义·最优化」。空间被网格覆盖，每一个格子里都有一个数字。'
            },
            {
                type: 'attack', damage: 1.5, variance: 0.3,
                dialogue: '1, 1, 2, 3, 5, 8——你看，多美。数字不会说谎。',
                description: '斐波那契攻击。数字的螺旋向你收缩。'
            },
            {
                type: 'heal', amount: 2.5,
                dialogue: '我的计算不会错。我的计算不会错。我的计算不会——',
                description: '自我强化。但声音在颤抖。'
            },
            {
                type: 'monologue',
                dialogue: '女儿……今年3岁了……她的幸福值是——是——我不想算了……',
                description: '他的命题在裂缝里漏水。这是你的机会。'
            }
        ]
    },

    cultist_scout: {
        name: '千年虫信徒（斥候）',
        source: 'AUGUSTINE',
        logos: 5,
        maxLogos: 5,
        declaration: '世界将在1999年进位。',
        weakness: '进位的恐惧源于对当下的否定——而你只活在当下。',
        openingText: '站前广场。\n\n一个穿白袍的人。面罩遮住了脸。\n\n「主的仆人。世纪末的使者。你——将在进位中被格式化。」\n\n他的瞳孔里有十字架的倒影。不——不是倒影。是签名。\n「St.Augustine」。\n\n空气变冷了。从37.5度降到了——0度？不。是感觉。\n是「永恒当下」的前兆。',
        defeatText: '白袍倒在地上。面罩滑落。\n\n是个年轻人。二十出头。眼神空洞。\n\n「主……说过……进位之后……就不用再害怕了……」\n\n他睡着了。或者说——被从永恒当下释放了。',
        actions: [
            {
                type: 'attack', damage: 1.0, variance: 0.5,
                dialogue: '进位！进位！0变成1！1变成0！',
                description: '时间攻击。你感觉自己老了一秒——不，是记忆被抽走了一秒。'
            },
            {
                type: 'attack', damage: 1.5, variance: 0.3,
                dialogue: '主说——不信的人将化为虚无！',
                description: '信仰冲击。他的恐惧变成了武器。'
            },
            {
                type: 'monologue',
                dialogue: '我不想消失……我不想在1999年消失……所以我选择了被格式化……至少格式化是有意义的……',
                description: '他在恐惧中祈祷。命题在动摇。'
            }
        ]
    }
};
