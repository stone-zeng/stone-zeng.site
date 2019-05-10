---
layout: post
title: 带圈数字
date: 2019-02-09
last_modified_at: 2019-05-10
categories: Symbols
---

众所周知，LaTeX 提供了 `\textcircled` 命令用以给字符加圈，但效果却不怎么好：

<figure>
  <img src="/images/textcircled.png" alt="\textcircled">
</figure>

实际上，加圈并不是一个平凡的变换，它会涉及到圈内字符形状的微调，而这是几乎无法在 TeX 宏层面解决的。因此，要得到比较好的效果，最好能使用预先设计的字符形（glyph）。

## 传统方案

`pifont` 宏包提供了一系列[杂锦符号](https://en.wikipedia.org/wiki/Dingbat)（dingbats），其中就有带圈数字。`pifont` 属于 `psnfss` 宏集，它封装了一系列 PostScript 字体，包含著名的 Helvetica、Times、Courier 等。`pifont` 使用的是 [Zapf Dingbats](https://en.wikipedia.org/wiki/Zapf_Dingbats) 字体。

使用 `\ding{<number>}` 可以很方便地使用带圈数字（共有四种），当然也有其他符号。具体数字可参见下图：

<figure>
  <img src="/images/pifont.png" alt="pifont">
</figure>

在主流的 TeX 引擎下，`pifont` 宏包都可以使用。

## Unicode

数字 0&ndash;50 的带圈版本都分配了对应的 Unicode 码位，因而在现代 TeX 引擎（XeTeX 和 LuaTeX，若无特殊说明以下仅讨论这两者）中，配合合适的字体，理论上可以直接输入这些符号。具体见下表：<span id="fnref-font" class="footnote">[[1]](#fn-font)</span>

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>⓪</td>
      <td>①</td>
      <td>②</td>
      <td>③</td>
      <td>④</td>
      <td>⑤</td>
      <td>⑥</td>
      <td>⑦</td>
      <td>⑧</td>
      <td>⑨</td>
      <td>⑩</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>24EA</td>
      <td>2460</td>
      <td>2461</td>
      <td>2462</td>
      <td>2463</td>
      <td>2464</td>
      <td>2465</td>
      <td>2466</td>
      <td>2467</td>
      <td>2468</td>
      <td>2469</td>
    </tr>
    <tr class="circled-number-glyph">
      <td></td>
      <td>⑪</td>
      <td>⑫</td>
      <td>⑬</td>
      <td>⑭</td>
      <td>⑮</td>
      <td>⑯</td>
      <td>⑰</td>
      <td>⑱</td>
      <td>⑲</td>
      <td>⑳</td>
    </tr>
    <tr class="circled-number-encoding">
      <td></td>
      <td>246A</td>
      <td>246B</td>
      <td>246C</td>
      <td>246D</td>
      <td>246E</td>
      <td>246F</td>
      <td>2470</td>
      <td>2471</td>
      <td>2472</td>
      <td>2473</td>
    </tr>
    <tr class="circled-number-glyph">
      <td></td>
      <td>㉑</td>
      <td>㉒</td>
      <td>㉓</td>
      <td>㉔</td>
      <td>㉕</td>
      <td>㉖</td>
      <td>㉗</td>
      <td>㉘</td>
      <td>㉙</td>
      <td>㉚</td>
    </tr>
    <tr class="circled-number-encoding">
      <td></td>
      <td>3251</td>
      <td>3252</td>
      <td>3253</td>
      <td>3254</td>
      <td>3255</td>
      <td>3256</td>
      <td>3257</td>
      <td>3258</td>
      <td>3259</td>
      <td>325A</td>
    </tr>
    <tr class="circled-number-glyph">
      <td></td>
      <td>㉛</td>
      <td>㉜</td>
      <td>㉝</td>
      <td>㉞</td>
      <td>㉟</td>
      <td>㊱</td>
      <td>㊲</td>
      <td>㊳</td>
      <td>㊴</td>
      <td>㊵</td>
    </tr>
    <tr class="circled-number-encoding">
      <td></td>
      <td>325B</td>
      <td>325C</td>
      <td>325D</td>
      <td>325E</td>
      <td>325F</td>
      <td>32B1</td>
      <td>32B2</td>
      <td>32B3</td>
      <td>32B4</td>
      <td>32B5</td>
    </tr>
    <tr class="circled-number-glyph">
      <td></td>
      <td>㊶</td>
      <td>㊷</td>
      <td>㊸</td>
      <td>㊹</td>
      <td>㊺</td>
      <td>㊻</td>
      <td>㊼</td>
      <td>㊽</td>
      <td>㊾</td>
      <td>㊿</td>
    </tr>
    <tr class="circled-number-encoding">
      <td></td>
      <td>32B6</td>
      <td>32B7</td>
      <td>32B8</td>
      <td>32B9</td>
      <td>32BA</td>
      <td>32BB</td>
      <td>32BC</td>
      <td>32BD</td>
      <td>32BE</td>
      <td>32BF</td>
    </tr>
  </table>
</div>

Zapf Dingbats 中的其他几种样式也分配有码位：

- 反白（negative circled digits）

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>⓿</td>
      <td>❶</td>
      <td>❷</td>
      <td>❸</td>
      <td>❹</td>
      <td>❺</td>
      <td>❻</td>
      <td>❼</td>
      <td>❽</td>
      <td>❾</td>
      <td>❿</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>24FF</td>
      <td>2776</td>
      <td>2777</td>
      <td>2778</td>
      <td>2779</td>
      <td>277A</td>
      <td>277B</td>
      <td>277C</td>
      <td>277D</td>
      <td>277E</td>
      <td>277F</td>
    </tr>
    <tr class="circled-number-glyph">
      <td></td>
      <td>⓫</td>
      <td>⓬</td>
      <td>⓭</td>
      <td>⓮</td>
      <td>⓯</td>
      <td>⓰</td>
      <td>⓱</td>
      <td>⓲</td>
      <td>⓳</td>
      <td>⓴</td>
    </tr>
    <tr class="circled-number-encoding">
      <td></td>
      <td>24EB</td>
      <td>24EC</td>
      <td>24ED</td>
      <td>24EE</td>
      <td>24EF</td>
      <td>24F0</td>
      <td>24F1</td>
      <td>24F2</td>
      <td>24F3</td>
      <td>24F4</td>
    </tr>
  </table>
</div>

- 无衬线（circled sans-serif digits）

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>🄋</td>
      <td>➀</td>
      <td>➁</td>
      <td>➂</td>
      <td>➃</td>
      <td>➄</td>
      <td>➅</td>
      <td>➆</td>
      <td>➇</td>
      <td>➈</td>
      <td>➉</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>1F10B</td>
      <td>2780</td>
      <td>2781</td>
      <td>2782</td>
      <td>2783</td>
      <td>2784</td>
      <td>2785</td>
      <td>2786</td>
      <td>2787</td>
      <td>2788</td>
      <td>2789</td>
    </tr>
  </table>
</div>

- 无衬线反白（negative circled sans-serif digits）

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>🄌</td>
      <td>➊</td>
      <td>➋</td>
      <td>➌</td>
      <td>➍</td>
      <td>➎</td>
      <td>➏</td>
      <td>➐</td>
      <td>➑</td>
      <td>➒</td>
      <td>➓</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>1F10C</td>
      <td>278A</td>
      <td>278B</td>
      <td>278C</td>
      <td>278D</td>
      <td>278E</td>
      <td>278F</td>
      <td>2790</td>
      <td>2791</td>
      <td>2792</td>
      <td>2793</td>
    </tr>
  </table>
</div>

此外，还额外增加了一些样式：

- 双线（double circled digits）

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>⓵</td>
      <td>⓶</td>
      <td>⓷</td>
      <td>⓸</td>
      <td>⓹</td>
      <td>⓺</td>
      <td>⓻</td>
      <td>⓼</td>
      <td>⓽</td>
      <td>⓾</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>24F5</td>
      <td>24F6</td>
      <td>24F7</td>
      <td>24F8</td>
      <td>24F9</td>
      <td>24FA</td>
      <td>24FB</td>
      <td>24FC</td>
      <td>24FD</td>
      <td>24FE</td>
    </tr>
  </table>
</div>

- 加框（circled numbers on black square）

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>㉈</td>
      <td>㉉</td>
      <td>㉊</td>
      <td>㉋</td>
      <td>㉌</td>
      <td>㉍</td>
      <td>㉎</td>
      <td>㉏</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>3248</td>
      <td>3249</td>
      <td>324A</td>
      <td>324B</td>
      <td>324C</td>
      <td>324D</td>
      <td>324E</td>
      <td>324F</td>
    </tr>
  </table>
</div>

- 带圆括号（parenthesized digits）

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>⑴</td>
      <td>⑵</td>
      <td>⑶</td>
      <td>⑷</td>
      <td>⑸</td>
      <td>⑹</td>
      <td>⑺</td>
      <td>⑻</td>
      <td>⑼</td>
      <td>⑽</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>2474</td>
      <td>2475</td>
      <td>2476</td>
      <td>2477</td>
      <td>2478</td>
      <td>2479</td>
      <td>247A</td>
      <td>247B</td>
      <td>247C</td>
      <td>247D</td>
    </tr>
    <tr class="circled-number-glyph">
      <td>⑾</td>
      <td>⑿</td>
      <td>⒀</td>
      <td>⒁</td>
      <td>⒂</td>
      <td>⒃</td>
      <td>⒄</td>
      <td>⒅</td>
      <td>⒆</td>
      <td>⒇</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>247E</td>
      <td>247F</td>
      <td>2480</td>
      <td>2481</td>
      <td>2482</td>
      <td>2483</td>
      <td>2484</td>
      <td>2485</td>
      <td>2486</td>
      <td>2487</td>
    </tr>
  </table>
</div>

- 带点（digits with full stop）

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>🄀</td>
      <td>⒈</td>
      <td>⒉</td>
      <td>⒊</td>
      <td>⒋</td>
      <td>⒌</td>
      <td>⒍</td>
      <td>⒎</td>
      <td>⒏</td>
      <td>⒐</td>
      <td>⒑</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>1F100</td>
      <td>2488</td>
      <td>2489</td>
      <td>248A</td>
      <td>248B</td>
      <td>248C</td>
      <td>248D</td>
      <td>248E</td>
      <td>248F</td>
      <td>2490</td>
      <td>2491</td>
    </tr>
    <tr class="circled-number-glyph">
      <td></td>
      <td>⒒</td>
      <td>⒓</td>
      <td>⒔</td>
      <td>⒕</td>
      <td>⒖</td>
      <td>⒗</td>
      <td>⒘</td>
      <td>⒙</td>
      <td>⒚</td>
      <td>⒛</td>
    </tr>
    <tr class="circled-number-encoding">
      <td></td>
      <td>2492</td>
      <td>2493</td>
      <td>2494</td>
      <td>2495</td>
      <td>2496</td>
      <td>2497</td>
      <td>2498</td>
      <td>2499</td>
      <td>249A</td>
      <td>249B</td>
    </tr>
  </table>
</div>

- 带逗号（digits with comma）

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>🄁</td>
      <td>🄂</td>
      <td>🄃</td>
      <td>🄄</td>
      <td>🄅</td>
      <td>🄆</td>
      <td>🄇</td>
      <td>🄈</td>
      <td>🄉</td>
      <td>🄊</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>1F101</td>
      <td>1F102</td>
      <td>1F103</td>
      <td>1F104</td>
      <td>1F105</td>
      <td>1F106</td>
      <td>1F107</td>
      <td>1F108</td>
      <td>1F109</td>
      <td>1F10A</td>
    </tr>
  </table>
</div>

这些姑且也算上吧：

<div class="circled-number">
  <table>
    <tr class="circled-number-glyph">
      <td>㈠</td>
      <td>㈡</td>
      <td>㈢</td>
      <td>㈣</td>
      <td>㈤</td>
      <td>㈥</td>
      <td>㈦</td>
      <td>㈧</td>
      <td>㈨</td>
      <td>㈩</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>3220</td>
      <td>3221</td>
      <td>3222</td>
      <td>3223</td>
      <td>3224</td>
      <td>3225</td>
      <td>3226</td>
      <td>3227</td>
      <td>3228</td>
      <td>3229</td>
    </tr>
    <tr class="circled-number-glyph">
      <td>㊀</td>
      <td>㊁</td>
      <td>㊂</td>
      <td>㊃</td>
      <td>㊄</td>
      <td>㊅</td>
      <td>㊆</td>
      <td>㊇</td>
      <td>㊈</td>
      <td>㊉</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>3280</td>
      <td>3281</td>
      <td>3282</td>
      <td>3283</td>
      <td>3284</td>
      <td>3285</td>
      <td>3286</td>
      <td>3287</td>
      <td>3288</td>
      <td>3289</td>
    </tr>
    <tr class="circled-number-glyph">
      <td>🈩</td>
      <td>🈔</td>
      <td>🈪</td>
    </tr>
    <tr class="circled-number-encoding">
      <td>1F229</td>
      <td>1F214</td>
      <td>1F22A</td>
    </tr>
    <tr class="circled-number-glyph">
      <td></td>
      <td>🉂</td>
      <td>🉁</td>
    </tr>
    <tr class="circled-number-encoding">
      <td></td>
      <td>1F242</td>
      <td>1F241</td>
    </tr>
  </table>
</div>

这些符号分散在以下几个 Unicode 区块（block）中：

- Enclosed Alphanumerics (`U+2460`&ndash;`U+24FF`)
  - 带圈 0&ndash;20（以及 a&ndash;z、A&ndash;Z）
  - 反白 0、11&ndash;20
  - 双线 1&ndash;10
  - 带圆括号 1&ndash;20
  - 带点 1&ndash;20
- Dingbats (`U+2700`&ndash;`U+27BF`)
  - 反白 1&ndash;10
  - 无衬线 1&ndash;10
  - 无衬线反白 1&ndash;10
- Enclosed CJK Letters and Months (`U+3200`&ndash;`U+32FF`)
  - 带圈 21&ndash;50
  - 加框 10&ndash;80（仅限整十）
  - 带圈 `一`～`十`
  - 带圆括号 `一`～`十`
- Enclosed Alphanumeric Supplement (`U+1F100`&ndash;`U+1F1FF`)
  - 带逗号 0&ndash;9
  - 无衬线、无衬线反白以及带点的 0
- Enclosed Ideographic Supplement (`U+1F200`&ndash;`U+1F2FF`)
  - 带方框 `一`、`二`、`三`
  - 带六角括号 `二`、`三`

直接输入，或者利用码位，都能在 LaTeX 中使用以上这些带圈数字（注意不同方法对大小写的要求有差异）：

```latex
\documentclass{article}
\usepackage{fontspec}
\setmainfont{Source Han Serif SC}

\begin{document}
① ② ③ ④ ⑤
\symbol{"2776} \symbol{"2777} \symbol{"2778} \symbol{"2779} \symbol{"277A}
\char"3248\    \char"3249\    \char"324A\    \char"324B\    \char"324C\
^^^^3280       ^^^^3281       ^^^^3282       ^^^^3283       ^^^^3284
^^^^^1f229     ^^^^^1f214     ^^^^^1f22a
\end{document}
```

使用 XeLaTeX 或 LuaLaTeX 编译，效果如下：

<figure>
  <img src="/images/textcircled-fontspec.png" alt="textcircled-fontspec">
</figure>

## `xunicode-addon` 宏包

在实际使用中，无论是依靠码位，还是借由输入法直接录入这些特殊字符，都不是很方便。在 `xunicode-addon` 宏包（从属于 `xeCJK`）中，`\textcircled` 等一系列命令被重新定义，从而能够显示 Unicode 所分配的带圈数字（和字母等）。举例如下：

```latex
\documentclass{article}
\usepackage{fontspec,xunicode-addon}
\setmainfont{Source Han Serif SC}

\begin{document}
\textcircled{1}
\textcircled{25}
\textcircled{a}
\textcircled{Z}
\end{document}
```

利用 LaTeX3 语法也可以迅速写出如下循环而不伤身体：

```latex
\ExplSyntaxOn
\cs_set:Npn \TESTi
  {
    \int_step_inline:nnn {  0 } { 25 } { \textcircled{##1} ~ } \par
    \int_step_inline:nnn { 26 } { 50 } { \textcircled{##1} ~ } \par
  }
\cs_set:Npn \TESTii
  { \tl_map_inline:nn { abcdefghijklmnopqrstuvwxyz } { \textcircled{##1} ~ } \par }
\cs_set:Npn \TESTiii
  { \tl_map_inline:nn { ABCDEFGHIJKLMNOPQRSTUVWXYZ } { \textcircled{##1} ~ } \par }
\ExplSyntaxOff

\TESTi
\TESTii
\TESTiii
```

<figure>
  <img src="/images/textcircled-xunicode-addon.png" alt="textcircled-xunicode-addon">
</figure>

当然，其他样式的带圈数字并没有提供快捷的输入方式。

## 在 `ctex` 宏集中使用

以上的案例都是在标准文档类 `article` 中搭配 `fontspec` 宏包完成的。如果切换成 `ctex` 宏集，则需要额外做一些调整。

对于中文文档，我们通常需要为中西文（「西文」主要指 Latin script）分别设置字体。上面已经提到过，带圈数字分散在了几个 Unicode 区块中。`xeCJK` 将其中的 Enclosed CJK Letters and Months 和 Enclosed Ideographic Supplement 设置为了 CJK 字符类，使用中文字体；其余则为 Default 字符类，使用西文字体。

LuaTeX 下的情况类似，但稍显复杂。首先是 `luatexja` 作出了 ALchar 和 JAchar 的划分，大致相当于西文和日文（AL=**AL**phabetic，JA=**JA**panese）；同时又预定义了一些字符范围。默认设置中，上文所列的所有带圈数字均会使用日文字体。其后，`ctex` 宏集为了适应中文排版的需求又做了一些修改。结果是，Enclosed Alphanumerics 被设置为了 ALchar，即使用西文字体。

总而言之，在 `ctex` 宏集的默认配置下：

| Unicode 区块                    | XeLaTeX | LuaLaTeX |
|:-------------------------------:|:-------:|:--------:|
| Enclosed Alphanumerics          | 西文    | 西文     |
| Dingbats                        | 西文    | 西文     |
| Enclosed CJK Letters and Months | 中文    | 中文     |
| Enclosed Alphanumeric Supplement| 西文    | 西文     |
| Enclosed Ideographic Supplement | 中文    | 西文     |

在 XeLaTeX 下，可以做如下修改：

```latex
{% raw %}% 使用中文字体
\xeCJKDeclareCharClass{CJK}{%
  "24EA,        % ⓪
  "2460->"2473, % ①–⑳
  "3251->"32BF, % ㉑–㊿
  "24FF,        % ⓿
  "2776->"277F, % ❶–❿
  "24EB->"24F4  % ⓫–⓴
}
\setCJKmainfont{Source Han Serif SC}

% 或使用西文字体
% \xeCJKDeclareCharClass{Default}{%
%   "24EA, "2460->"2473, "3251->"32BF,
%   "24FF, "2776->"277F, "24EB->"24F4}
% \setmainfont{Garamond-Math.otf}{% endraw %}
```

在 LuaLaTeX 下，也完全类似：

```latex
{% raw %}% 使用中文字体
\ltjdefcharrange{6}{%
  "24EA, "2460-"2473, "3251-"32BF,
  "24FF, "2776-"277F, "24EB-"24F4}
\setCJKmainfont{Source Han Serif SC}

% 或使用西文字体
% \ltjdefcharrange{3}{%
%   "24EA, "2460-"2473, "3251-"32BF,
%   "24FF, "2776-"277F, "24EB-"24F4}
% \setmainfont{Garamond-Math.otf}{% endraw %}
```

这里的 `6` 和 `3` 原先分别对应日文字符和西文标点、符号。还需注意范围的写法与 `xeCJK` 中不同。

配合 `xunicode-addon` 宏包，在 `ctex` 宏集中也同样可以使用 `\textcircled` 命令输入预定义的带圈数字。但需注意，`\textcircled` 会预先检查字符是否存在，且仅在西文字体中进行。所以如需使用中文字体进行显示，就要「指鹿为马」：<span id="fnref-textcircled-ctex" class="footnote">[[2]](#fn-textcircled-ctex)</span>

```latex
% XeLaTeX 下需要把全体带圈数字都设置成 Default 类
% LuaLaTeX 下无须额外设置
\xeCJKDeclareCharClass{Default}{"24EA, "2460->"2473, "3251->"32BF}

% 将中文字体声明为（西文）字体族
\newfontfamily\EnclosedNumbers{Source Han Serif SC}

% 放置钩子，只让带圈字符才需更换字体
\AtBeginUTFCommand[\textcircled]{\begingroup\EnclosedNumbers}
\AtEndUTFCommand[\textcircled]{\endgroup}
```

对于字体中没有的带圈数字，`\textcircled` 也能够自动生成（由圆圈和相应的数字拼合）。选择合适的字体之后，便可做一些比较暴力的尝试：

<!--
```latex
\documentclass{standalone}
\usepackage{ctex,xunicode-addon}
\xeCJKDeclareCharClass{Default}{"24EA, "2460->"2473, "3251->"32BF}
\newfontfamily\EnclosedNumbers{Source Han Serif SC}
\AtBeginUTFCommand[\textcircled]{\begingroup\EnclosedNumbers}
\AtEndUTFCommand[\textcircled]{\endgroup}
\makeatletter
\ExplSyntaxOn
\int_const:Nn \c_@@_col_int { 50 }
\int_const:Nn \c_@@_row_int { 20 }
\cs_set:Npn \TEST
  {
    \exp_args:Nnx \begin{tabular}{ * { \int_use:N \c_@@_col_int } { @{} c } @{} }
      \int_step_inline:nnn {0} { \c_@@_row_int - 2 }
        { \@@_row:x { \int_eval:n { ##1 * \c_@@_col_int } } \\ }
      \@@_row:x { \int_eval:n { (\c_@@_row_int - 1) * \c_@@_col_int } }
    \end{tabular}
  }
\cs_set:Npn \@@_row:n #1
  {
    \int_step_inline:nnn {#1} { #1 + \c_@@_col_int - 2 } { \textcircled {##1} & }
    \exp_args:Nx \textcircled { \int_eval:n { #1 + \c_@@_col_int - 1 } }
  }
\cs_generate_variant:Nn \@@_row:n { x }
\ExplSyntaxOff
\makeatother

\begin{document}
\TEST
\end{document}
```
-->

<figure>
  <img src="/images/textcircled-matrix.png" alt="textcircled-matrix">
</figure>

即使是三位数，效果也尚能接受。

## OpenType 的 `nalt` 特性

在 OpenType 中，有一项名为 [`nalt`](https://docs.microsoft.com/typography/opentype/spec/features_ko#nalt)（Alternate Annotation Forms）的 GSUB 特性，它的作用是把特定的字符形替换成符号标注形式（notational forms）。不少日文字体都包含这一特性，我们可以利用 `fontspec` 宏包提供的相关选项调用。举例如下：

```latex
\documentclass{article}
\usepackage{fontspec}
\setmainfont{ipaexm.ttf}  % IPAex 明朝，TeX Live 自带

\begin{document}
{\addfontfeature{Annotation=0}123456789}
{\addfontfeature{Annotation=1}123456789}
{\addfontfeature{Annotation=2}123456789}
\end{document}
```

<figure>
  <img src="/images/textcircled-nalt.png" alt="textcircled-nalt">
</figure>

需要注意的是，`Annotation=X` 中的某个 `X` 具体对应何种样式，这是由字体设计者决定的。此外，在一些字体中，部分假名、汉字也有类似的标注形式，可以用相同方法使用：

```latex
\documentclass{ctexart}
\setCJKmainfont{Hiragino Mincho Pro W3}

\begin{document}
{\addCJKfontfeature{Annotation=0}あア}
{\addCJKfontfeature{Annotation=1}かカ}
{\addCJKfontfeature{Annotation=2}さサ}
{\addCJKfontfeature{Annotation=3}たタ}
{\addCJKfontfeature{Annotation=4}なナ}
{\addCJKfontfeature{Annotation=5}はハ}
{\addCJKfontfeature{Annotation=6}まマ}
\end{document}
```

<figure>
  <img src="/images/textcircled-nalt-kana.png" alt="textcircled-nalt-kana">
</figure>

这里我们用 `\addCJKfontfeature` 代替了 `\addfontfeature`。此处作为演示的字体是 macOS 自带的<span lang="ja">ヒラギノ明朝</span>，在 Windows/Linux 上可换用其他字体。

## Adobe-Japan1-7

[Adobe-Japan1-7 字符集](https://github.com/adobe-type-tools/Adobe-Japan1)定义了更多的带圈数字，很多样式都支持 0&ndash;100 的数字范围。但由于 Unicode 没有为它们分配码位，我们必须用 CID（**C**haracter **ID**entifier）来指定。<span id="fnref-cid" class="footnote">[[3]](#fn-cid)</span>

由于 CID 到具体字符的映照比较复杂，因而这里我们提供了一个宏包 [`textcircle-cid`](https://github.com/stone-zeng/latex-showcase/blob/master/textcircle-cid/textcircle-cid.sty)，用来通过 CID 调用带圈数字。`textcircle-cid` 宏包提供了下面一组命令：

- `\CIDtextcircled`
- `\CIDtextblackcircled`
- `\CIDtextboxed`
- `\CIDtextblackboxed`
- `\CIDtextrboxed`
- `\CIDtextblackrboxed`

支持的数字范围是 0&ndash;100 和 00&ndash;09。XeTeX、LuaTeX 和 upTeX 这三种 Unicode 引擎均可使用，但需要配合其他宏包及命令以实现正确的字体调用：

- XeLaTeX 下需要通过 `\setmainfont` 等命令设置字体
- LuaLaTeX 下需要通过 `\setmainjfont` 等命令设置（日文）字体
- upLaTeX 下需要调用 `pxchfon` 宏包，并且使用 `\setminchofont` 等命令设置字体，具体可以参考以下示例：

  ```latex
  {% raw %}% test-uptex.tex
  \documentclass{ujarticle}
  \usepackage{pxchfon,textcircle-cid}
  \setminchofont{KozMinPr6N-Regular.otf}
  \setgothicfont{KozGoPr6N-Regular.otf}

  \def\TEST{%
    \CIDtextcircled{0}
    \CIDtextblackcircled{1}
    \CIDtextboxed{00}
    \CIDtextblackboxed{10}
    \CIDtextrboxed{50}
    \CIDtextblackrboxed{100}}

  \begin{document}
  \textmc{\TEST} \par
  \textgt{\TEST}
  \end{document}{% endraw %}
  ```

  <figure>
    <img src="/images/textcircled-cid-uptex.png" alt="textcircled-cid-uptex">
  </figure>

  注意 upTeX 不直接生成 PDF，因此编译时可采取如下方式：

  ```sh
  uplatex test-uptex && dvipdfmx test-uptex
  ```

  在上面的示例中，我们使用的字体是 Adobe 的<span lang="ja">小塚明朝</span>和<span lang="ja">小塚ゴシック</span>。事实上，只有遵从 Adobe-Japan1 的字体，才能利用 CID 正确地调用相应的字符。

## 字体的选择

上文我们多次提及，带圈数字的具体使用与字体密切相关。下面我们整理了 TeX Live 自带的、可使用带圈数字的字体，以及对应的数字范围：

<div class="circled-number-fonts">
  <table>
    <thead>
      <tr>
        <th>字体</th>
        <th>带圈</th>
        <th>反白</th>
        <th>无衬线</th>
        <th>无衬线反白</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="circled-number-fonts-name">Baekmuk Batang/Dotum/Gulim/Headline</td>
        <td>1&ndash;15</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">Carlito</td>
        <td>0&ndash;20</td>
        <td>0&ndash;20</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">DejaVuSans</td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">FreeMono, FreeSans</td>
        <td>1&ndash;10</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">FreeSerif</td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">Garamond Math</td>
        <td>0&ndash;50</td>
        <td>0&ndash;20</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">IPAGothic, IPAMincho</td>
        <td>1&ndash;50</td>
        <td>1&ndash;20</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">Junicode</td>
        <td>0&ndash;20</td>
        <td>0&ndash;20</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">Lato</td>
        <td>0&ndash;20</td>
        <td>0&ndash;20</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">Libertinus Serif/Sans/Math, Linux Libertine, Linux Biolinum</td>
        <td>0&ndash;20</td>
        <td>0&ndash;20</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">Libertinus Keyboard, Linux Biolinum Keyboard</td>
        <td></td>
        <td>1&ndash;10</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">STIX, STIX Math</td>
        <td>0&ndash;9</td>
        <td></td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">STIX Two Math</td>
        <td>0&ndash;20</td>
        <td>0&ndash;20</td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">UnBatang, UnDinaru, UnDotum, UnGraphic, UnGungseo, UnJamoBatang, UnJamoDotum, UnJamoNovel, UnJamoSora, UnPen, UnPenheulim, UnPilgi, UnPilgia, UnShinmun, UnVada, UnYetgul</td>
        <td>0&ndash;20</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">XITS, XITS Math</td>
        <td>0&ndash;9</td>
        <td></td>
        <td>1&ndash;10</td>
        <td>1&ndash;10</td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">文鼎ＰＬ简报宋、文鼎ＰＬ简中楷</td>
        <td>1&ndash;10</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

以下是其他一些常见中、日文字体，其中很多是操作系统自带的：

<div class="circled-number-fonts">
  <table>
    <thead>
      <tr>
        <th>字体</th>
        <th>带圈</th>
        <th>反白</th>
        <th>无衬线</th>
        <th>无衬线反白</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="circled-number-fonts-name">思源宋体、思源黑体</td>
        <td>0&ndash;50</td>
        <td>0&ndash;20</td>
        <td>0&ndash;10</td>
        <td>0&ndash;10</td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">微软雅黑、微软正黑</td>
        <td>1&ndash;10</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">苹方</td>
        <td>0&ndash;50</td>
        <td>0&ndash;20</td>
        <td>0&ndash;10</td>
        <td>1&ndash;10</td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">方正书宋、方正黑体、方正楷体、方正仿宋、等线</td>
        <td>1&ndash;10</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">宋体、黑体、楷体、仿宋（中易）</td>
        <td>1&ndash;10</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name">更纱黑体 (Sarasa Gothic)</td>
        <td>0&ndash;50</td>
        <td>0&ndash;20</td>
        <td>0&ndash;10</td>
        <td>0&ndash;10</td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name"><span lang="ja">小塚明朝</span> (Kozuka Mincho)、<span lang="ja">小塚ゴシック</span> (Kozuka Gothic)</td>
        <td>0&ndash;100</td>
        <td>0&ndash;100</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name"><span lang="ja">游明朝</span> (Yu Mincho)、<span lang="ja">游ゴシック</span> (Yu Gothic)</td>
        <td>0&ndash;100</td>
        <td>0&ndash;100</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td class="circled-number-fonts-name"><span lang="ja">メイリオ</span> (Meiryo)</td>
        <td>0&ndash;50</td>
        <td>1&ndash;20</td>
        <td>0&ndash;10</td>
        <td>1&ndash;10</td>
      </tr>
    </tbody>
  </table>
</div>

这里我们用了 Python 脚本 [`check-circled-number.py`](https://github.com/stone-zeng/latex-showcase/blob/master/textcircle-cid/check-circled-number.py) 来读取字体信息，它还依赖 [FontForge](https://fontforge.github.io/)。注意由于字体版本不同，不保证表中所列结果与实际情况完全一致。

## 注释

1. <span class="backref" id="fnref-font"><a href="#fnref-font">^</a></span>
   在本页面的 CSS 中，带圈数字将优先使用思源宋体（Source Han Serif）显示，但具体结果仍然取决于字体的安装情况以及浏览器的渲染方式。
1. <span class="backref" id="fnref-textcircled-ctex"><a href="#fnref-textcircled-ctex">^</a></span>
   感谢 [@qinglee](https://github.com/qinglee) 的指导！见 CTeX-org/ctex-kit [#399](https://github.com/CTeX-org/ctex-kit/issues/399)。
1. <span class="backref" id="fnref-cid"><a href="#fnref-cid">^</a></span>
   感谢 [@clerkma](https://github.com/clerkma) 的指导！见 CTeX-org/forum [#20](https://github.com/CTeX-org/forum/issues/20)。
