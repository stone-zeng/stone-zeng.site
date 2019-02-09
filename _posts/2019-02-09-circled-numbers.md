---
layout: post
title: 带圈数字
date: 2019-02-09
categories: Symbols
---

众所周知，LaTeX 提供了 `\textcircled` 命令用以给字符加圈，但效果却不怎么好：

![\textcircled](/images/textcircled.png)

实际上，加圈并不是一个平凡的变换，它会涉及到圈内字符形状的微调，而这是无法在宏编程层面解决的。因此，要得到比较好的效果，最好能使用预先设计的字符形。

## 传统方案

`pifont` 宏包提供了一系列 [杂锦符号](https://en.wikipedia.org/wiki/Dingbat)（dingbats），其中就有带圈数字。`pifont` 属于 `psnfss` 宏集，它封装了一系列 PostScript 字体，包含著名的 Helvetica、Times、Courier 等。`pifont` 使用的是 [Zapf Dingbats](https://en.wikipedia.org/wiki/Zapf_Dingbats) 字体。

使用 `\ding{<number>}` 可以很方便地使用带圈数字（共有四种），当然也有其他符号。具体数字可参见下图：

<!-- ![pifont](/images/pifont.png) -->

在主流的 TeX 引擎下，`pifont` 宏包都可以使用。

## Unicode

数字 0&ndash;50 的带圈版本都分配了对应的 Unicode 码位，因而在现代 TeX 引擎（XeTeX 和 LuaTeX）中，配合合适的字体，理论上可以直接输入这些符号。具体见下表：
TODO: 该表的正确显示有赖于计算机上的字体支持

<style type="text/css">
tr.circled-number-glyph {
  text-align: center;
  font-size: 24px;
  border: none;
}
tr.circled-number-encoding {
  text-align: center;
  /* font-size: 8px; */
}
</style>

<center>
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
      <td><code>U+24EA</code></td>
      <td><code>U+2460</code></td>
      <td><code>U+2461</code></td>
      <td><code>U+2462</code></td>
      <td><code>U+2463</code></td>
      <td><code>U+2464</code></td>
      <td><code>U+2465</code></td>
      <td><code>U+2466</code></td>
      <td><code>U+2467</code></td>
      <td><code>U+2468</code></td>
      <td><code>U+2469</code></td>
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
      <td><code>U+246A</code></td>
      <td><code>U+246B</code></td>
      <td><code>U+246C</code></td>
      <td><code>U+246D</code></td>
      <td><code>U+246E</code></td>
      <td><code>U+246F</code></td>
      <td><code>U+2470</code></td>
      <td><code>U+2471</code></td>
      <td><code>U+2472</code></td>
      <td><code>U+2473</code></td>
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
      <td><code>U+3251</code></td>
      <td><code>U+3252</code></td>
      <td><code>U+3253</code></td>
      <td><code>U+3254</code></td>
      <td><code>U+3255</code></td>
      <td><code>U+3256</code></td>
      <td><code>U+3257</code></td>
      <td><code>U+3258</code></td>
      <td><code>U+3259</code></td>
      <td><code>U+325A</code></td>
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
      <td><code>U+325B</code></td>
      <td><code>U+325C</code></td>
      <td><code>U+325D</code></td>
      <td><code>U+325E</code></td>
      <td><code>U+325F</code></td>
      <td><code>U+32B1</code></td>
      <td><code>U+32B2</code></td>
      <td><code>U+32B3</code></td>
      <td><code>U+32B4</code></td>
      <td><code>U+32B5</code></td>
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
      <td><code>U+32B6</code></td>
      <td><code>U+32B7</code></td>
      <td><code>U+32B8</code></td>
      <td><code>U+32B9</code></td>
      <td><code>U+32BA</code></td>
      <td><code>U+32BB</code></td>
      <td><code>U+32BC</code></td>
      <td><code>U+32BD</code></td>
      <td><code>U+32BE</code></td>
      <td><code>U+32BF</code></td>
    </tr>
  </table>
</center>

Zapf Dingbats 中的其他几种样式也分配有码位：

- 反白（negative circled digits）

<center>
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
      <td><code>U+24FF</code></td>
      <td><code>U+2776</code></td>
      <td><code>U+2777</code></td>
      <td><code>U+2778</code></td>
      <td><code>U+2779</code></td>
      <td><code>U+277A</code></td>
      <td><code>U+277B</code></td>
      <td><code>U+277C</code></td>
      <td><code>U+277D</code></td>
      <td><code>U+277E</code></td>
      <td><code>U+277F</code></td>
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
      <td><code>U+2776</code></td>
      <td><code>U+2777</code></td>
      <td><code>U+2778</code></td>
      <td><code>U+2779</code></td>
      <td><code>U+277A</code></td>
      <td><code>U+277B</code></td>
      <td><code>U+277C</code></td>
      <td><code>U+277D</code></td>
      <td><code>U+277E</code></td>
      <td><code>U+277F</code></td>
    </tr>
  </table>
</center>

- 无衬线（circled sans-serif digits）

<center>
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
      <td><code>U+1F10B</code></td>
      <td><code>U+2780</code></td>
      <td><code>U+2781</code></td>
      <td><code>U+2782</code></td>
      <td><code>U+2783</code></td>
      <td><code>U+2784</code></td>
      <td><code>U+2785</code></td>
      <td><code>U+2786</code></td>
      <td><code>U+2787</code></td>
      <td><code>U+2788</code></td>
      <td><code>U+2789</code></td>
    </tr>
  </table>
</center>

- 无衬线反白（negative circled sans-serif digits）

<center>
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
      <td><code>U+1F10C</code></td>
      <td><code>U+278A</code></td>
      <td><code>U+278B</code></td>
      <td><code>U+278C</code></td>
      <td><code>U+278D</code></td>
      <td><code>U+278E</code></td>
      <td><code>U+278F</code></td>
      <td><code>U+2790</code></td>
      <td><code>U+2791</code></td>
      <td><code>U+2792</code></td>
      <td><code>U+2793</code></td>
    </tr>
  </table>
</center>

此外，还额外增加了一些样式：

- 双线（double circled digits）

<center>
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
      <td><code>U+24F5</code></td>
      <td><code>U+24F6</code></td>
      <td><code>U+24F7</code></td>
      <td><code>U+24F8</code></td>
      <td><code>U+24F9</code></td>
      <td><code>U+24FA</code></td>
      <td><code>U+24FB</code></td>
      <td><code>U+24FC</code></td>
      <td><code>U+24FD</code></td>
      <td><code>U+24FE</code></td>
    </tr>
  </table>
</center>

- 加框（circled numbers on black square）

<center>
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
      <td><code>U+3248</code></td>
      <td><code>U+3249</code></td>
      <td><code>U+324A</code></td>
      <td><code>U+324B</code></td>
      <td><code>U+324C</code></td>
      <td><code>U+324D</code></td>
      <td><code>U+324E</code></td>
      <td><code>U+324F</code></td>
    </tr>
  </table>
</center>

- 带圆括号（parenthesized digits）

<center>
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
      <td><code>U+2474</code></td>
      <td><code>U+2475</code></td>
      <td><code>U+2476</code></td>
      <td><code>U+2477</code></td>
      <td><code>U+2478</code></td>
      <td><code>U+2479</code></td>
      <td><code>U+247A</code></td>
      <td><code>U+247B</code></td>
      <td><code>U+247C</code></td>
      <td><code>U+247D</code></td>
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
      <td><code>U+247E</code></td>
      <td><code>U+247F</code></td>
      <td><code>U+2480</code></td>
      <td><code>U+2481</code></td>
      <td><code>U+2482</code></td>
      <td><code>U+2483</code></td>
      <td><code>U+2484</code></td>
      <td><code>U+2485</code></td>
      <td><code>U+2486</code></td>
      <td><code>U+2487</code></td>
    </tr>
  </table>
</center>

- 带点（digits with full stop）

<center>
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
      <td><code>U+1F100</code></td>
      <td><code>U+2488</code></td>
      <td><code>U+2489</code></td>
      <td><code>U+248A</code></td>
      <td><code>U+248B</code></td>
      <td><code>U+248C</code></td>
      <td><code>U+248D</code></td>
      <td><code>U+248E</code></td>
      <td><code>U+248F</code></td>
      <td><code>U+2490</code></td>
      <td><code>U+2491</code></td>
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
      <td><code>U+2492</code></td>
      <td><code>U+2493</code></td>
      <td><code>U+2494</code></td>
      <td><code>U+2495</code></td>
      <td><code>U+2496</code></td>
      <td><code>U+2497</code></td>
      <td><code>U+2498</code></td>
      <td><code>U+2499</code></td>
      <td><code>U+249A</code></td>
      <td><code>U+249B</code></td>
    </tr>
  </table>
</center>

- 带逗号（digits with comma）

<center>
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
      <td><code>U+1F101</code></td>
      <td><code>U+1F102</code></td>
      <td><code>U+1F103</code></td>
      <td><code>U+1F104</code></td>
      <td><code>U+1F105</code></td>
      <td><code>U+1F106</code></td>
      <td><code>U+1F107</code></td>
      <td><code>U+1F108</code></td>
      <td><code>U+1F109</code></td>
      <td><code>U+1F10A</code></td>
    </tr>
  </table>
</center>

这些姑且也算上吧：

<center>
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
      <td><code>U+3220</code></td>
      <td><code>U+3221</code></td>
      <td><code>U+3222</code></td>
      <td><code>U+3223</code></td>
      <td><code>U+3224</code></td>
      <td><code>U+3225</code></td>
      <td><code>U+3226</code></td>
      <td><code>U+3227</code></td>
      <td><code>U+3228</code></td>
      <td><code>U+3229</code></td>
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
      <td><code>U+3280</code></td>
      <td><code>U+3281</code></td>
      <td><code>U+3282</code></td>
      <td><code>U+3283</code></td>
      <td><code>U+3284</code></td>
      <td><code>U+3285</code></td>
      <td><code>U+3286</code></td>
      <td><code>U+3287</code></td>
      <td><code>U+3288</code></td>
      <td><code>U+3289</code></td>
    </tr>
    <tr class="circled-number-glyph">
      <td>🈩</td>
      <td>🈔</td>
      <td>🈪</td>
    </tr>
    <tr class="circled-number-encoding">
      <td><code>U+1F229</code></td>
      <td><code>U+1F214</code></td>
      <td><code>U+1F22A</code></td>
    </tr>
    <tr class="circled-number-glyph">
      <td></td>
      <td>🉂</td>
      <td>🉁</td>
    </tr>
    <tr class="circled-number-encoding">
      <td></td>
      <td><code>U+1F242</code></td>
      <td><code>U+1F241</code></td>
    </tr>
  </table>
</center>
