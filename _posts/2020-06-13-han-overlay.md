---
layout: post
title: 把所有汉字叠写起来会怎么样呢？
date: 2020-06-13
last_modified_at: 2020-06-14
description: 「把所有汉字叠写起来会怎么样呢？」这个问题源于知乎网友 @闭眼唱歌 脑洞大开的起名方式。虽然看起来非常无厘头，但对理解中文字体设计是有一些帮助的。
---

## 背景介绍

「把所有汉字叠写起来会怎么样呢？」这个问题源于知乎网友 [@闭眼唱歌](https://www.zhihu.com/people/tong-jia-hong) 脑洞大开的起名方式：

<figure>
  <img src="/images/han-overlay/name-1.jpg" alt="name-1" class="invert" style="height: 90px; width: auto;">
  <img src="/images/han-overlay/name-2.jpg" alt="name-2" class="invert" style="height: 90px; width: auto;">
  <figcaption markdown="span">来源：[怎样看待 papi 酱因为孩子随父姓被某些网友辱骂？](https://www.zhihu.com/question/394004713/answer/1215083944)</figcaption>
</figure>

虽然看起来非常无厘头，但对理解中文字体设计是有一些帮助的。

首先介绍中文字体设计中的两个概念：**字身框**和**字面框**。字身框是汉字字形最外侧的方框，在金属活字时代指的是铅字铅块的尺寸，在数字化时代指的是汉字字符形最外面的边界框，其默认高度与字号相同。字面框是一个字体中汉字笔画实际可以覆盖到的空间，在相同字号下，能够间接观察出整套字体每个字的视觉大小和默认字间距。然而在数字化时代，有的中文字体仅将字面框作为一种边界参考线，不少尖锐的笔画往往会突破设计师设定的字面框，有时候甚至会突破字身框。[^han-metrics]

[^han-metrics]: 厉致谦. [汉字设计中的度量标准（一）](https://zhuanlan.zhihu.com/p/99504885)

<figure>
  <img src="/images/han-overlay/ideo-body.png" alt="ideo-body" class="invert" style="max-width: 300px;">
  <figcaption markdown="span">来源：[justfont - 字型設計自己來——中文字型設計的第一課](https://blog.justfont.com/2012/12/hanzi-type-design-1/)</figcaption>
</figure>

一般来说，把所有汉字叠加起来，即使字面框有可能会被填满，但字身框内无论如何都还会留有一点空间，否则排版时所有的汉字都有可能会连在一起，没有「呼吸的感觉」（笑）。

## 整体叠加

中文字库常用的 GB2312 字符集一共有 6763 个汉字，而 Unicode 13.0 里面的汉字已经积累到了 92856 个[^han-number]，全部拿来叠加比较麻烦且意义不大。经过实验，使用几千个汉字和几百个汉字来叠加效果差别并不大（只要控制好透明度什么的）。所以，下面的实验我们都是从 GB2312 中随机挑选一个子集来叠加，实际使用的字数我们标注在了括号里。

[^han-number]: Dr. Ken Lunde. [2019 "State of the Unification" Report](https://ccjktype.fonts.adobe.com/2019/07/2019-sotu.html)

首先从最基本的宋体和黑体开始。为了突出对比，我们各选择了两种风格的字体：筑紫明朝和华文黑体字面较小、结构紧凑；而报宋和微软雅黑字面较大、结构宽松。前者代表了比较传统的汉字审美，可以使文本更有精气神。后者则主要出于使用场景的考量，无论是为了报纸印刷设计的报宋，还是为了屏幕显示设计的雅黑，较为夸张的字面可以大幅提升易读性。

![basic](/images/han-overlay/basic.png){:.invert}

接着我们来看思源系列的情况。思源宋体和黑体是 Adobe 和 Google 联合推出的一款泛中日韩现代字体。它们各有 7 个字重，因此也可以有更多发现。此外，思源字体本身就提供了字面大小的信息（OpenType `BASE` 表中的 `icft` 和 `icfb` 条目）[^baseline]，我们这里也标记了出来。下图红色为宋体，黑色为黑体。很明显，从细到粗，字面率逐渐增大，到了 Heavy 字重几乎与字面框只留下了一条缝隙，可以想象排版结果将有强烈的视觉冲击力。这种随着字重的增加，不断扩大的文字的方式，也颇似西文字体中，同一套字体家族随着字重增加而加大 x 高度的做法。另一方面，如果纵向对比，可以看到相同字重的宋体和黑体有着几乎一致的字面框大小，而这正是中文字体设计中跨越字体风格（宋 / 黑）时需要考虑的要点之一。

[^baseline]: [Baseline tags](https://docs.microsoft.com/typography/opentype/otspec160/baselinetags)

![source-han](/images/han-overlay/source-han.png){:.black}

除了分析字面率，叠加实验还可以帮助我们理解笔画的分布。上面的几张图都不是一片均匀的黑色，而是有浓淡分布的。显然，黑色较深的地方对应着笔画的集中分布。我们可以看出来，大多数字体中左侧都有明显的一竖，右侧下面则有一横，而且右下角有一处格外明显的黑色区域；有些字体的右侧还有一些横竖笔画构成的「格子纹样」。加上根据 6763 个汉字的数据统计，我们由此可以得出以下几个结论：

- 左右（左中右）结构在汉字中占据绝对统治地位
- 左侧的形旁大多以一竖作为主笔（如：亻彳犭扌忄礻衤钅饣讠丬）
- 半包围、全包围结构的字也较多，且笔画大都位于接近字面框四个边缘的位置
- 汉字的笔画中，横和竖比例较高，造成了字面框中部的「格子」纹理

我们还能看到，方正筑紫明朝、微软雅黑和思源宋体、黑体都有较为明显的笔画界线，而汉仪报宋和华文黑体的整体笔画分布规律则相对模糊。后面这两个历史比较久远的字体都是在前数字化时代设计出来的，没办法很方便地「Ctrl+C、Ctrl+V」，只能依靠多位设计师手工绘制出所有字形，即使相同部件也存在一定的差别，相对数字化字体来说，整体笔画分布的规律性便显得较弱了。当然，这样也赋予了每个字形不尽相同的特质，有着区别于数字化时代字体的独特风味，反而得到一些人的青睐。

中文常用的排版字体还有仿宋和楷体。下图测试了方正的基础四款字体，尽管我们常常将「宋黑仿楷」并称，然而光从字面率来看它们未必能很好地搭配起来。如果要设计一款跨越宋、黑、仿、楷的超级中文字体家族，显然在字面率的统一上还要多做一些研究和基础设定。另外从形状来看，图中的宋体和黑体的叠加结果基本呈现为一个正方形，而仿宋的叠加结果则是长方形，而楷体是一个不规则的多边形，说明测试的仿宋和楷体的真实字面框并不是方的。

![fundamental](/images/han-overlay/fundamental.png){:.black}

实际上，这一规律早在七十年代就被日本的字体研究者<span lang="ja">佐藤敬之輔</span>发现了。他对宋体和楷体也做了一些叠加的实验，和我们的叠加图类似，宋体叠加后是一个方框，而楷体则是一个类似 🍙 的不规则形状。

<figure>
  <img src="/images/han-overlay/kanji-514.png" alt="kanji-514" class="invert" style="max-width: 360px;">
  <figcaption>来源：<span lang="ja">佐藤敬之輔《文字のデザインシリーズ 6：漢字（下）》</span>，第 13 页图 514</figcaption>
</figure>

楷体脱胎于书法，带有强烈的手写感。这个像 Q 的小尾巴一样的突出部分，也正是源于传统书法美学中捺要舒展的要求。便于雕刻的仿宋有接近楷体的笔画特征和类似的笔画倾角，不过整体字面已经变得方正起来。再往后，宋体和黑体伴随着现代字体技术的成熟逐渐成为主流，笔形规整统一、字面较大的特征一直延续到了今天。

![block-printed.png](/images/han-overlay/block-printed.png){:.black}

这里，我们把几款流行的刻本字体叠加起来，便可以清晰地看出上文所述印刷字体的演变史。

## 更多的探索

汉字根据结构大致可以分为上下、左右、包围、独体。据此，我们还分别对这四种结构的汉字进行了单独的叠加，有一些有趣的发现：

- 草字头（艹）、木字旁（木）、三点水（氵）、走之底（⻌）这几个偏旁部首可谓是独占鳌头，因为字数的优势，在结果中一眼就能分辨出来；
- 对于上下、左右、包围结构的字，形旁和声旁应当控制一定的距离，并且在整个字体里面保持统一。这也印证了谢培元和徐学成等前辈提出的第二中心线理论[^second-medial-area]；
- 独体字和上下结构的字中，都能明显看到一条笔直的中轴线。这或许与汉字的竖排传统和对称审美有关[^calligraphy]。

[^second-medial-area]: 厉致谦. [汉字设计中的度量标准（二）](https://zhuanlan.zhihu.com/p/101183974)
[^calligraphy]: 蒋勋. 《漢字書法之美：舞動行草》，[第 235 页](https://books.google.com.sg/books?id=8Rq9AAAAQBAJ&pg=PA235)

![structure](/images/han-overlay/structure.png){:.black}

接下来看看最近特别流行的书法字体。总体来说书法字体的实际字面率都较低。隶书字形较扁，楷书比较端正，草书、行书则充满了曲线的味道。而作为创意字体的尚巍手书，叠加起来看也出现我们上面提到过的「Q」形状，可见中文字体即使看起来充满创意，也得遵循一定的规律。

![calligraphic](/images/han-overlay/calligraphic.png){:.black}

汉字还有相当数量的衍生文字，在中国少数民族地区和泛东亚文化圈都被广泛使用。包括日文平假名、片假名（网友评论：平假名像个球 2333）：

![kana](/images/han-overlay/kana.png){:.black}

谚文音节、注音符号（可以看出思源宋体的设计[明显有问题](https://github.com/adobe-fonts/source-han-serif/issues/7)）：

![hangul-bopomofo](/images/han-overlay/hangul-bopomofo.png){:.black}

以及西夏文、契丹小字和女书：

![historic](/images/han-overlay//historic.png){:.black}

这些文字总体上保留了汉字的一些特征，但又有所不同。比如女书整体造型呈橄榄形，完全不同于汉字的方块造型[^nushu]。西夏文和汉字类似，存在大量肉眼可见的左右结构的字，但和汉字相比，左右部分的大小基本相同，结构更加对称，变化也不如汉字丰富（不过 Noto 这个西夏文字体被喷得很惨[^tangut]）。

[^nushu]: [Noto Sans Nüshu](https://github.com/LisaHuang2017/noto-sans-nushu)
[^tangut]: @BabelStone 的[推文](https://twitter.com/BabelStone/status/1106903314690686986)

最后，知乎网友 [@韓泳思](https://www.zhihu.com/people/hei-li-shi) 提到了点阵字体的问题，所以我们也来玩一玩：

![bitmap](/images/han-overlay/bitmap.png){:.invert}

以上三个字体分别是 16×15 像素的 [GNU Unifont](https://unifoundry.com/unifont/index.html) 和 9×9、7×7 的[丁卯点阵体](https://3type.cn/fonts/dinkie_bitmap/)。由于点阵字体本身的限制，它们在整个字身框中都故意留出了一像素的缝隙，以防止密排时文字连在一起。可以看到，在 Unifont 中左上角和右上角仍留有一些空白；而在「小至极限」的丁卯点阵点里面，设计师就不得不充分利用除了预留空间外每一个能用的像素，因而最终叠加出了一个几乎实心的黑块。

<small>
本文基于对此话题的[知乎回答](https://www.zhihu.com/question/394175264/answer/1221223455)补充而成，另发布在 [3type 公众号](https://mp.weixin.qq.com/s/3xxRY5g2PzCvc44cDZde9Q)。感谢杜希尧、李晨、厉致谦、刘育黎对本文的帮助。绘图所用代码可在 [stone-zeng/toys](https://github.com/stone-zeng/toys/tree/main/wolfram/hanzi-superimposing) 中找到。
</small>

## 参考文献

<div id="footnotes"></div>
