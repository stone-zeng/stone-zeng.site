---
layout: post
title: 在 TeX 中使用 OpenType 可变字体
date: 2019-01-13
last_modified_at: 2019-07-15
categories: Fonts
---

在 2016 年，随着 [OpenType 标准 1.8 版](https://docs.microsoft.com/typography/opentype/spec)的出台，字体界迎来了一次重大变革，即可变字体（OpenType Variable Fonts）的诞生。

可变字体的源头是 Knuth 在创造 $\TeX$ 时「顺便」实现的 [METAFONT](https://en.wikipedia.org/wiki/Metafont)。时间过去了近 40 年，$\TeX$ 依然大受欢迎，而 METAFONT 却几乎仅限于极客们的玩具，高质量的商业字体几乎没有采用这套流程进行开发。然而 Knuth 高瞻远瞩的理念在最近终于被从故纸堆中翻了出来，参数化字体设计伴着可变字体的火热又重回人们的视线。

废话不多说。截至目前（2019 年初），可变字体的支持仍然相当受限。目前已知的有：

- 主要浏览器端[^can-i-use-vf]
  - Chrome 66+
  - FireFox 62+
  - Edge 17+
  - Safari 11+
  - Opera 53+
- Adobe 软件套装[^wiki-vf]
  - Photoshop CC 2018+
  - Illustrator CC 2018+
- [$\ConTeXt$](https://wiki.contextgarden.net) beta 版（2017-04 之后）[^hans-context]

[^can-i-use-vf]: [Can I use... Support tables for HTML5, CSS3, etc - Variable fonts](https://caniuse.com/#feat=variable-fonts)
[^wiki-vf]: Wikipedia. [Variable fonts](https://en.wikipedia.org/wiki/Variable_fonts)
[^hans-context]: Hans Hagen. [[NTG-context] beta](https://mailman.ntg.nl/pipermail/ntg-context/2017/088343.html)

在 $\TeX$ 界，目前尝试可变字体的唯一选择便是使用这个 beta 版的 $\ConTeXt$。$\LaTeX$ 方面至今还没有实现。

## 使用方法

### Bahnschrift

我们参考邮件列表中的介绍[^hans-context]，以及 Hans Hagen 在 $\ConTeXt$ 2017 年会上的[报告](https://meeting.contextgarden.net/2017/talks/2017-09-12-hans-variable-fonts/variable-fonts.pdf)和随后在 *TUGboat* 上发表的[文章](https://tug.org/TUGboat/tb38-2/tb119hagen-variable.pdf)，便可以如愿使用 OpenType 可变字体。

相比 $\LaTeX$，$\ConTeXt$ 的内核设计得比较庞大，通过 Lua 又可以玩各式花样，所以不再需要调用大堆宏包，而是可以直接用原生命令定义各种样式。

首先要在导言区声明字体 feature 和相应的命令：

```tex
% 声明字体 feature
\definefontfeature
    [<样式名>]
    [default]
    [axis={<轴名称>:<值>}]

% 声明字体
\definefont
    [<字体命令>]
    [<name:字体名/file:字体文件名>*<样式名>]
```

之后，即可在正文用定义过的 `<字体命令>` 调用相应的字体。

下面给一个完整的示例，所用字体是 Windows 系统自带的 Bahnschrift，它是一套类似 DIN 的「德国风」字体。

如上所述，可变字体的「轴」要通过 `axis` 选项指定。Bahnschrift 只有一个字重轴（weight），取值范围是 300--700。注意超过允许的范围之后便会无效。我们用到了 5 个实例（即 5 个不同字重），那只好定义 5 个 features 以及相对应的命令，毕竟 $\TeX$ 里面没办法（很容易地）做个滑块出来。

```tex
\definefontfeature[w300][default][axis={weight:300}]
\definefontfeature[w400][default][axis={weight:400}]
\definefontfeature[w500][default][axis={weight:500}]
\definefontfeature[w600][default][axis={weight:600}]
\definefontfeature[w700][default][axis={weight:700}]

\definefont[Bahnschrift@300][file:bahnschrift.ttf*w300]
\definefont[Bahnschrift@400][file:bahnschrift.ttf*w400]
\definefont[Bahnschrift@500][file:bahnschrift.ttf*w500]
\definefont[Bahnschrift@600][file:bahnschrift.ttf*w600]
\definefont[Bahnschrift@700][file:bahnschrift.ttf*w700]

\starttext

\csname Bahnschrift@300\endcsname Bahnschrift, weight=300\par
\csname Bahnschrift@400\endcsname Bahnschrift, weight=400\par
\csname Bahnschrift@500\endcsname Bahnschrift, weight=500\par
\csname Bahnschrift@600\endcsname Bahnschrift, weight=600\par
\csname Bahnschrift@700\endcsname Bahnschrift, weight=700\par

\stoptext
```

编译方式与 $\LaTeX$ 类似。在命令行执行 `context <file name>`，它会自动确定编译次数，直至生成最终的 PDF。第一次使用时，$\ConTeXt$ 可能会花费较长时间生成字体缓存（每个实例都要生成），需要耐心等待。之后再进行编译，相对而言速度还可以接受。

<figure>
  <img src="/images/variable-fonts/bahnschrift.png" alt="vf-bahnschrift">
</figure>

### Adobe VF Prototype

换成 [Adobe Variable Font Prototype](https://github.com/adobe-fonts/adobe-variable-font-prototype)，还可在字重轴之外使用对比度轴（contrast）。用法仍然是相同的，只需额外加上 `contrast` 的声明：

```tex
\definefontfeature[w200c0][default][axis={weight:200,contrast:0}]
```

<figure>
  <img src="/images/variable-fonts/adobe-vf-protype.png" alt="vf-adobe-vf-protype">
</figure>

可以看到 `fi` 连字发挥正常，但 `i`、`F`、`P` 等出现了一些畸变，暂时还不清楚其中的原因。

利用 $\ConTeXt$ 内置 [MetaFun](https://wiki.contextgarden.net/MetaFun) 的特性，可以施加些许魔法，展示出字体的轮廓：

```tex
\starttext

\startMPcode
  draw outlinetext.b ("\definedfont
    [name:adobevariablefontprototypeextralight]%
    foo@bar+FipP")
  (withcolor "gray")
  (withcolor red withpen pencircle scaled 1/10)
  xsized .45TextWidth ;
\stopMPcode
\startMPcode
  draw outlinetext.b ("\definedfont
    [name:adobevariablefontprototypelight]%
    foo@bar+FipP")
  (withcolor "gray")
  (withcolor red withpen pencircle scaled 1/10)
  xsized .45TextWidth ;
\stopMPcode
\startMPcode
  draw outlinetext.b ("\definedfont
    [name:adobevariablefontprototypebold]%
    foo@bar+FipP")
  (withcolor "gray")
  (withcolor red withpen pencircle scaled 1/10)
  xsized .45TextWidth ;
\stopMPcode
\startMPcode
  draw outlinetext.b
  ("\definefontfeature[whatever]%
  [axis={weight:350}]%
    \definedfont
      [name:adobevariablefontprototype*whatever]%
      foo@bar+FipP")
    (withcolor "gray")
    (withcolor red withpen pencircle scaled 1/10)
    xsized .45TextWidth ;
\stopMPcode

\stoptext
```

<figure>
  <img src="/images/variable-fonts/adobe-vf-protype-mf.png" alt="vf-adobe-vf-protype-mf">
</figure>

图中可以看到大量笔画的重叠，这可以保证轮廓在连续变化时不会走样。与上文类似，仍然出现了不明原因的畸变。当然，字体本身是没有问题的。

## 注释

<div id="footnotes"></div>

## 参考

- 谭沛然. [参数化设计与字体战争：从 OpenType 1.8 说起](https://thetype.com/2016/09/10968)
- @dpk. [TeX (LuaTeX, XeTeX, fontspec) support for OpenType variable fonts](https://tex.stackexchange.com/q/355104)
