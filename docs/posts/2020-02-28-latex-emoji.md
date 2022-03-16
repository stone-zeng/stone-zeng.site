---
title: 在 LaTeX 中使用 Emoji ✌️
date: 2020-02-28
last_modified_at: 2020-02-29
categories: Fonts
excerpt: Emoji（<span lang="ja">絵文字</span>）是聊天软件和社交平台的常客，也几乎成为了一种新的「世界语」。虽然 $\LaTeX$ 以排版严肃的学术类文章见长，但偶尔卖个萌也不为过。
---

Emoji（<span lang="ja"><ruby>絵<rt>え</rt></ruby><ruby>文<rt>も</rt></ruby><ruby>字<rt>じ</rt></ruby></span>）是聊天软件和社交平台的常客，也几乎成为了一种新的「世界语」。虽然 $\LaTeX$ 以排版严肃的学术类文章见长，但偶尔卖个萌也不为过。

## 背景

Emoji 其实是文字的一种，换句话说它们是对应有 Unicode 码位的。而微信、QQ 等聊天工具，为了抹平平台差异以防出现歧义，实际上是用了自己的一套东西，复制出去就会原形毕露，得到 `[奸笑]`、`[旺柴]` 这样的字符串。

在之前引擎没有支持的时候，也有人在 $\LaTeX$ 中实现过类似的想法，即先把 emoji 导出为图片，再通过一些命令插入，比如：

- [`coloremoji`](https://ctan.org/pkg/coloremoji)（$\>MiKTeX$ 已收录）
- <https://github.com/doraTeX/coloremoji>
- <https://github.com/henningpohl/latex-emoji>

这样的机制虽然简单可靠，但毕竟插图不是文字，过多的图片不便于下载和交换（完整的支持至少需要近千个图片文件，这恐怕也是 $\TeX$ Live 不收录的原因），也不能自由地切换样式（字体）。不过，$\>LuaTeX$ 最近加入了一些功能，使得我们现在也可以在 $\LaTeX$ 中以字体的形式直接使用 emoji。

## 基本方法

2019 年，Luigi Scarso 等人为 $\>LuaTeX$ 添加了 HarfBuzz 库支持，构建了另一个分支 $\>LuaHBTeX$。随后，$\LaTeX$ 的开发版本就改用它代替原来的 $\>LuaTeX$；在 $\TeX$ Live 2020 中 $\>LuaHBTeX$ 也将成为默认的 $\>LuaTeX$ 引擎。因此，为了使用 emoji 字体，我们需要改用 `lualatex-dev` 命令编译。

另一方面，显示 emoji 还需有字体的支持。主流操作系统都配有设计精良的字体：

- Windows 中是 Segoe UI Emoji
- macOS 中是 Apple Color Emoji
- Ubuntu 等 Linux 系统大多配有开源的 Noto Color Emoji

在最新版的 $\TeX$ Live 中，则包含有 Twemoji Mozilla 和 Noto Color Emoji，它们均是开源免费的。

与普通字体类似，我们可以使用 `fontspec` 提供的命令来声明字体，但注意需要加上选项 `Renderer=HarfBuzz`[^twemoji]。在文档中直接输入想要的表情，就可以使用了：

[^twemoji]: 本文为了生成 SVG 图片，需要使用 `COLR`/`CPAL` 格式的 emoij 字体，比如这里所用的 Twemoji Mozilla。

```tex
\documentclass{article}
\usepackage{fontspec}
\newfontface\EmojiFont{Twemoji Mozilla}[Renderer=HarfBuzz]
\begin{document}
The cat eats apple:  {\EmojiFont 🐱🍎}. \par
The dog drinks beer: {\EmojiFont 🐶🍺}. \par
The monkey gets the moon: {\EmojiFont 🙈🌛}.
\end{document}
```

使用 `lualatex-dev` 编译，得到：

![emoji-basic](../images/latex-emoji/emoji-basic.svg)

## `emoji` 宏包

使用 [`emoji`](https://ctan.org/pkg/emoji) 宏包可以更方便地在 $\LaTeX$ 中使用 emoji。这一宏包可以根据系统自动选择字体，并且提供了别名用来输入：

```tex
\documentclass{article}
\usepackage{amsmath,emoji}
\setemojifont{Twemoji Mozilla}  % 可选
\begin{document}
\emoji{eyeglasses} \emoji{nerd-face} \emoji{+1}
$
  \displaystyle
    \int_{\partial\text{\emoji{hourglass}}} \text{\emoji{frog}}
  = \int_\text{\emoji{hourglass}} \mathrm{d}\text{\emoji{frog}}
$
\end{document}
```

![emoji-package](../images/latex-emoji/emoji-package.svg)

`\emoji` 命令的参数来自 GitHub 的 emoji 短名，可以参考宏包文档或 [Complete list of github markdown emoji markup](https://gist.github.com/rxaviers/7360908)（可能不完整）。

需要注意的是，`emoji` 宏包目前仍处于测试阶段，可能会遇到一些 bug，未来也可能会有较大改动。如果遇到问题，欢迎联系作者。

## 一些技术说明

Emoji 背后的技术比较复杂，值得额外谈谈。

### Unicode

作为一种「文字」，emoji 也有对应的 Unicode 规范[^unicode-tr51]。相当一部分 emoji 与字母或汉字类似，只占据一个码位（code point），此时称为 emoji 字符。例如：[^font]

[^unicode-tr51]: Unicode&reg; Technical Standard #51. [Unicode Emoji](https://www.unicode.org/reports/tr51/)
[^font]: 以下内容的正确显示取决于操作系统和浏览器环境。

```bash
1F600  # 😀 Grinning face
1F4A9  # 💩 Pile of poo
1F51F  # 🔟 Keycap: 10
```

另外的一些可以有文本和 emoji 两种形式。加上 `U+FE0E` variation selector-15 (VS-15) 后可以指定为文本形式，而加上 `U+FE0F` variation selector-16 (VS-16) 则可以指定为 emoji 形式：

```bash
263A FE0F  # ☺️ Smiling face
263A       # ☺ Smiling face
2708 FE0F  # ✈️ Airplane
2708       # ✈ Airplane
2709 FE0F  # ✉️ Envelope
2709       # ✉ Envelope
```

有些 emoji 是由几个部分组合而成的，之间用 `U+200D` zero width joiner (ZWJ) 连接：

```bash
1F9D1 200D 1F393       # 🧑‍🎓 Student      = 🧑 + <ZWJ> + 🎓
1F3F3 FE0F 200D 1F308  # 🏳️‍🌈 Rainbow flag = 🏳️ + <ZWJ> + 🌈
```

为了追求性别、肤色、发型的平等，这种精神被大大发扬：

```bash
1F468 200D 2764 FE0F 200D 1F48B 200D 1F468  #   👨‍❤️‍💋‍👨 Kiss: man, man
                                            # = 👨 + <ZWJ> + ❤️ + <ZWJ> + 💋 + <ZWJ> + 👨
1F469 200D 1F469 200D 1F467 200D 1F466      #   👩‍👩‍👧‍👦 Family: woman, woman, girl, boy
                                            # = 👩 + <ZWJ> + 👩 + <ZWJ> + 👧 + <ZWJ> + 👦
1F937 1F3FE 200D 2642 FE0F                  #   🤷🏾‍♂️ Man shrugging: medium-dark skin tone
                                            # = 🤷 + 🏾 + <ZWJ> + ♂️
1F469 1F3FB 200D 1F9B2                      #   👩🏻‍🦲 Woman: light skin tone, bald
                                            # = 👩 + 🏻 + <ZWJ> + 🦲
```

国家和地区的旗帜则由两个地区标识符或者一组 tag 序列组成：

```bash
1F1E8 1F1F3                                #   🇨🇳 Flag: China          = 🇨 + 🇳
1F1E6 1F1F6                                #   🇦🇶 Flag: Antarctica     = 🇦 + 🇶
1F1FA 1F1F3                                #   🇺🇳 Flag: United Nations = 🇺 + 🇳
1F3F4 E0067 E0062 E0065 E006E E0067 E007F  #   🏴󠁧󠁢󠁥󠁮󠁧󠁿 Flag: England
                                           # = 🏴 + <g> + <b> + <e> + <n> + <g> + <END>
```

在 $\LaTeX$ 中也可以通过直接输入码位的方式来插入 emoji：

```tex
\documentclass{article}
\usepackage{fontspec}
\newfontface\EmojiFont{Twemoji Mozilla}[Renderer=HarfBuzz]
\begin{document}
\EmojiFont
^^^^^^01f235
^^^^^^01f91f^^^^^^01f3fd
^^^^^^01f469^^^^^^01f3ff^^^^200d^^^^^^01f91d^^^^200d^^^^^^01f468^^^^^^01f3fb
^^^^^^01f1f2^^^^^^01f1f4
\end{document}
```

![emoji-unicode](../images/latex-emoji/emoji-unicode.svg)

这也是 `emoji` 宏包内部使用的方法。

### 字体

Emoji 通常会使用彩色字体来获得比较好的显示效果。在 OpenType 规范中，彩色字体有四种允许的格式：[^opentype-color-font]

[^opentype-color-font]: Microsoft Typography. [Tables Related to Color Fonts](https://docs.microsoft.com/typography/opentype/spec/otff#tables-related-to-color-fonts)

| 格式            | 类型   | 字体举例          | $\>LuaTeX$ 是否支持 |
|:---------------:|:------:|:-----------------:|:--------------------:|
| `sbix`          | 位图   | Apple Color Emoji | ✅ |
| `COLR` / `CPAL` | 矢量图 | Segoe UI Emoji    | ✅ |
| `CBDT` / `CBLC` | 位图   | Noto Color Emoji  | ✅ |
| `SVG`           | 矢量图 | EmojiOne          | 🚫 |

在使用位图格式的彩色字体时，$\>LuaTeX$ 会有大量临时文件的读写操作。当插入的 emoji 数量很大时，会有显著的性能开销，导致编译变慢。

$\LaTeX$ 之外的另一种格式 $\>ConTeXt$ 同样支持插入 emoji[^context-emoji]。对 `COLR` / `CPAL` 格式的字体，$\>ConTeXt$ 还允许重新着色；而通过调用 [Inkscape](https://inkscape.org/)，它还能够调用 `SVG` 字体，尽管性能比较成问题。

[^context-emoji]: Hans Hagen. [Picture Fonts](https://meeting.contextgarden.net/2017/talks/2017-09-12-hans-color-fonts/picture-fonts.pdf)

## 注释与参考

<div id="footnotes"></div>
