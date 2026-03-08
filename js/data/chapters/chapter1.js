/**
 * 世纪末异邦人 — 第一卷「世纪末的异邦人」
 * 序章：觉醒
 */

const Chapter1 = {

    awakening: [
        {
            speaker: null,
            text: '1999年。7月13日。下午3时42分。',
            atmosphere: '蝉鸣。沥青。37.5℃。'
        },
        {
            speaker: null,
            text: '气温37.5度。蝉在叫。沥青路面扭曲着空气。'
        },
        {
            speaker: null,
            text: '——这是第327次确认自己还活着。'
        },
        {
            speaker: null,
            text: '堤防上。混凝土的灰白色被日光晒得刺眼。远处是海，近处是蝉鸣。除此之外什么都没有。'
        },
        {
            speaker: null,
            text: '收音机在播什么。声音从远处飘来，像是隔着一层水。'
        },
        {
            speaker: '收音机',
            text: '「——今天是法国作家阿尔贝·加缪诞辰86周年。1913年出生于阿尔及利亚的他，代表作《异邦人》——」'
        },
        {
            speaker: null,
            text: '风停了。',
            effect: 'shake'
        },
        {
            speaker: null,
            text: '不，不是风停了。是世界停了一秒。\n然后——从瞳孔深处，有什么东西溢了出来。',
            effect: 'particles'
        },
        {
            speaker: null,
            text: '不是泪水。不是光。\n是一种——无法命名的确信。'
        },
        {
            speaker: null,
            text: '「我们必须想象西西弗是幸福的。」',
            effect: 'flash'
        },
        {
            speaker: null,
            text: '这句话从收音机里传来，又从你的骨头里传来。\n同一句话。同一个瞬间。内外同时崩塌又同时重建。'
        },
        {
            speaker: null,
            text: '你从十二岁开始，就在反复确认自己还活着。\n327次。每一次都记得。'
        },
        {
            speaker: null,
            text: '而现在，你知道了——'
        },
        {
            speaker: null,
            text: '这不是病。\n这是你一直在做的事，终于有了名字。'
        },
        {
            speaker: null,
            text: '推石头。\n然后看着它滚下去。\n然后再推一次。'
        },
        {
            speaker: null,
            text: '…………'
        },
        {
            speaker: null,
            text: '手心出汗。视线模糊了一秒，又清晰了。\n远处的海在晃。或者是你在晃。',
            choices: [
                {
                    text: '站起来。',
                    setFlag: 'stood_up',
                    next: 17
                },
                {
                    text: '继续坐着。',
                    setFlag: 'stayed_seated',
                    next: 19
                },
                {
                    text: '「……也没什么别的事可做。」',
                    setFlag: 'signature_line',
                    next: 21
                }
            ]
        },
        // 17: 站起来
        {
            speaker: null,
            text: '你站了起来。膝盖咯噔响了一声。汗从脊背流下。'
        },
        {
            speaker: null,
            text: '海风吹来——但不凉。37.5度的风，和体温一样。分不清是风还是自己的热。',
            next: 23
        },
        // 19: 继续坐着
        {
            speaker: null,
            text: '坐着也好。石头也没叫你现在就推。'
        },
        {
            speaker: null,
            text: '蝉叫了。又叫了。在地下活了七年，出来叫一个夏天。\n——然后死掉。',
            next: 23
        },
        // 21: 台词
        {
            speaker: '夏目珀',
            text: '「……也没什么别的事可做。」'
        },
        {
            speaker: null,
            text: '没有人听见。也不需要谁听见。\n这句话不是说给别人的。',
            next: 23
        },
        // 23: 汇合
        {
            speaker: null,
            text: '自动贩卖机的光。\n在白天不起眼，但你知道它在那里。'
        },
        {
            speaker: null,
            text: '走过去。投入100日元。按下宝矿力的按钮。'
        },
        {
            speaker: null,
            text: '咕隆。\n瓶子滚出来。冰凉的。在手心留下水珠。'
        },
        {
            speaker: null,
            text: '——深雪也喝这个。'
        },
        {
            speaker: null,
            text: '不。不要想这个。\n今天是7月13日。8月5日还没到。\n还有时间。还有——'
        },
        {
            speaker: null,
            text: '还有什么？'
        },
        {
            speaker: null,
            text: '你低头看了一眼宝矿力。\n瓶身的水珠映出扭曲的天空。\n蝉在叫。',
            choices: [
                {
                    text: '喝一口。',
                    next: 30
                },
                {
                    text: '握着，不喝。',
                    next: 30
                },
                {
                    text: '「深雪。」（小声说）',
                    requiredDeaths: 5,
                    setFlag: 'called_miyuki_early',
                    next: 30
                }
            ]
        },
        // 30: 最终段
        {
            speaker: null,
            text: '…………\n\n夏天才刚开始。'
        },
        {
            speaker: null,
            text: '但你已经在推石头了。\n从很久以前就开始了。'
        },
        {
            speaker: null,
            text: '蝉在叫。太阳不会落。\n至少现在不会。'
        },
    ],
};
