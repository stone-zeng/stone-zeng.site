import { describe, test, expect } from 'vitest'
import MarkdownIt from 'markdown-it'

import MarkdownItCjkKern from '@/lib/markdown-it-cjk-kern'

const md = new MarkdownIt()
md.use(MarkdownItCjkKern)

describe('Punctuations', () => {
  test('Single', () => {
    expect(
      md.render(
        `
- 字。字．字，字、字；字：字？字！
- 点、点，点。点、点，点。点、点，点。点、点，点。点、点，点。点、点，点。点、点，点。点、点，点。点、点，点。点、点，点。点、点，点。
`,
      ),
    ).toMatchSnapshot()
  })

  test('Multiple', () => {
    expect(
      md.render(
        `
- 这么多不认识的文件？？比 Visual Studio 还多！！
- 这么多不认识的文件！？比 Visual Studio 还多？！
- 这么多不认识的文件？？？比 Visual Studio 还多！！！
`,
      ),
    ).toMatchSnapshot()
  })

  test('Pairs (1)', () => {
    expect(
      md.render(
        `
- 「何谓『标点挤压』？」
- 何谓「标点『挤压』」呢？
- 让我来告诉你何谓「『标点』挤压」。
- 让我来告诉你何谓「『标点』挤压。」
- 「内『内容』容」‘内“内容”容’
- 《書名》〈篇名〉（内容）
`,
      ),
    ).toMatchSnapshot()
  })

  test('Pairs (2)', () => {
    expect(
      md.render(`
- 「『好』·不好」「『好』／不好」「『好』、不好」
- 「好·『不好』」「好、『不好』」
- 《书名》〈篇名〉（内容）
- 《书名》〈篇名〉（内容）「『好』、不好」
- 内容《書名》〈篇名〉（内容）「好、『不好』」
- 内容《書名》〈篇名〉（内容）『好』、「不好」
- 《书名》、「文字」、『重点』。
- 《書名》、*「強調」*、**『重點』**。
- 《書名》、**「關鍵字」**、*『重點』*。
`),
    ).toMatchSnapshot()
  })

  test('Pairs (3)', () => {
    expect(
      md.render(`
- 「标」、「『标』」，《标》、〈标〉。「标」、「『标』」，《标》、〈标〉。「标」、「『标』」，《标》、〈标〉。「标」、「『标』」，《标》、〈标〉。「标」、「『标』」，《标》、〈标〉。「标」、「『标』」，《标》、〈标〉。
- 「标」点、「『标』」点，《标》点、（标）点。「标」点、「『标』」点，《标》点、（标）点。「标」点、「『标』」点，《标》点、（标）点。「标」点、「『标』」点，《标》点、（标）点。「标」点、「『标』」点，《标》点、（标）点。
- 「就这样，我、『那个人』和他们战斗了数个钟头，（最后）没输没赢……『那个人』逃之夭夭。」
`),
    ).toMatchSnapshot()
  })

  test('Dashes', () => {
    expect(
      md.render(`
- 啊——什麼内容……丹·布朗
- He — who wants to achieve the goal — denied about the fact that…
- 1991－1999年　他／她
- 轻声叨念道——「好的……」
- 轻声（叨念道）……「好的」——
`),
    ).toMatchSnapshot()
  })
})

//

//

test('Links', () => {
  expect(
    md.renderInline(
      '标点符号[（谷歌）](https://google.com)，参考[《维基百科》](https://en.wikipedia.org)（[中文版](https://zh.wikipedia.org)）。',
    ),
  ).toMatchSnapshot()
})

test('Code', () => {
  expect(
    md.render(`
\`\`\`js
console.log('Hello, world!');
console.log('你好，世界！');
\`\`\`
`),
  ).toMatchSnapshot()
})

test('Complex text (1)', () => {
  expect(
    md.renderInline(
      '中国文字的标点符号很不完备。最古只有「离经辨志」的方法（见《学记》。郑玄注，离经句绝也）。大概把每句离开一二字写，如宋版《史记》的《索隐述赞》的写法。汉儒讲究章句，始用「句读」（何休《公羊传》序云：「援引他经，失其句读」。《周礼》注：「郑司农读『火』绝之」。读字徐邈音豆，见《经典释文》），又称「句投」（马融《长笛赋》），又称「句度」（皇甫湜《与李生书》）。大概语意已完的叫做句，语气未完而须停顿的叫做读。但是汉、唐人所用的符号已不可考见。只有《说文》有「乚」字，说是钩识用的，又有「丶」字，说是绝止用的，不知是否当时的句读符号。唐末五代以后，有了刻版书，但是大概没有标点符号。到了宋朝，馆阁校书的始用旁加圈点的符号。宋岳珂《九经三传沿革例》说：「监蜀诸本皆无句读，惟建本始仿馆阁校书式从旁加圈点，开卷了然，于学者为便，然亦但句读经文而已。惟蜀中字本与兴国本并点注文，益为周尽」。《增韵》也说：「今秘省校书式，凡句绝则点于字之旁，读分则微点于字之中间。」这两条说宋代用句读符号最明白。现在所传的宋相台岳氏本《五经》，即是用这种符号的。佛经刻本也多用此法。后来的文人用浓圈密点来表示心里所赏识的句子，于是把从前文法的符号变成了赏鉴的符号，就连古代句读的分别都埋没了。现在有些报纸书籍，无论什么样的文章都是密圈圈到底，不但不讲文法的区别，连赏鉴的意思都没有了。这种圈点和没有圈点有什么分别？',
    ),
  ).toMatchSnapshot()
})

test('Complex text (2)', () => {
  expect(
    md.render(`
「新浪微博™」有7人在讨论“关于‘税收/毛利’还能这样搞？”一个词条。根据《发改委®〈定点清除〉的通知》（财税字#6号*¹）及现【相关规定*²】执行〖法克·好撒马利亚人税〗，对象：体温37℃|98℉的一般纳税人——也就是你。生产、劳务部分的〔新增价值〕或商品的｛附加值｝居然也要依法征收50%！参看124页税率说明\附表—；后面「其实『整个东西』都没意义」的部分也要看……For example, 此商品成本£4售价€50元，那么税率977‰印花税$61，最后毛利¢8。征税对象除了洛阳铲［luòyángchǎn］还包括音律书［yīnlǜshū］、备胎［bèitāi］等无关产品©~

征税值计算公式{T±a}=H×b-[U÷(Q/g³)+V], 至于T<a还是T>a甚至T和a是什么都不重要，所以就不用管了。练习一下，31×62-[8÷(59/4³)+70]=? 不会做就@哼&哈二将。

现在插播新闻：在博柏利的 "been dumb since 1980?" 庆典活动上，模特JOURDAN Dunn, CHARLIE France等一众Super Big Retarded A-holes共同参加了 'It won't be easy!' 时装秀。Burberry Acoustic乐队之一的英国基音乐队(Keane, aka. homo-chorus) 在中国首演。基音乐队还在长城上发表了“I have a dream that one day this nation will rise up, live up to the true meaning of its creed; We hold these truths to be self-evident: that all men are created equal.”的山寨演讲。
`),
  ).toMatchSnapshot()
})
