---
layout: post
title: TeX 性能评测
date: 2019-07-24
categories: Engines
---

众所周知 $XeTeX$ 和 $LuaTeX$ 比起 $pdfTeX$ 性能比较成问题，这也成了不少人抱着 `CJK` 不放手的原因。口说无凭，我们来做些评测看一看各种引擎的性能到底如何。

## 测试平台

使用的机器是 MacBook Pro 2017（13 英寸），具体参数：[^macbook]

[^macbook]: 来源：<https://support.apple.com/kb/SP754>。

- 2.3&thinsp;GHz 双核 Intel Core i5 处理器
- 16&thinsp;GB 2133&thinsp;MHz LPDDR3 主板集成内存
- 256&thinsp;GB 主板集成 PCIe 固态硬盘

发行版是 $TeX$ Live/$MacTeX$ 2019，所有宏包更至最新。各引擎的具体版本号：

- $pdfTeX$: 3.14159265-2.6-1.40.20 (TeX Live 2019)
- $XeTeX$: 3.14159265-2.6-0.999991 (TeX Live 2019)
- $LuaTeX$: Version 1.10.0 (TeX Live 2019)
- $upTeX$: 3.14159265-p3.8.2-u1.25 (utf8.uptex) (TeX Live 2019)
- $ApTeX$: Version 3.14159265 (compiled time: 2019 Jul 22 02:48:20 with Darwin/Clang)
- dvipdfmx: 20190503

这里的 3.14159265 是 Knuth $TeX$ 的版本号，2.6 是 $eTeX$ 的版本号。

## 测试过程

是否生成 PDF 对运行速度有很大的影响。所以我们分两组来做，分别是生成 DVI/XDV 和 PDF。

第一组包含以下几个命令：

- `latex <jobname>.tex`
- `pdflatex -output-format=dvi <jobname>.tex`
- `xelatex -no-pdf <jobname>.tex`
- `dvilualatex <jobname>.tex`
- `uplatex <jobname>.tex`

第二组则包含下面这些：

- `latex <jobname>.tex && dvipdfmx <jobname>.dvi`
- `pdflatex <jobname>.tex`
- `xelatex <jobname>.tex`
- `xelatex -no-pdf <jobname>.tex && xdvipdfmx <jobname>.xdv`（后面测试中标记为 `XeLaTeX*`）
- `lualatex <jobname>.tex`
- `uplatex <jobname>.tex && dvipdfmx <jobname>.dvi`
- `platex-ng <jobname>.tex`

几点说明：

- `latex` 实际上就是 DVI 模式的 `pdflatex`
- `dvilualatex` 是 DVI 模式的 `lualatex`
- `xelatex` 默认也会使用 `xdvipdfmx` 生成 PDF，而后者是 `dvipdfmx` 的一个扩展版本
- $ApTeX$（即 $pTeX$-ng）会同时生成 PDF 和 DVI，所以只放在了第二组

实际测试使用一个 Python 脚本进行。输出重定向至 `/dev/null`，计时使用 Python 自带的 `time.time()` 函数。每组运行 10 次，并计算平均值（`statistics.mean`）和标准差（`statistics.stdev`）。

具体的测试文本见下文。

### Minimal

最简单的一份 $LaTeX$ 文档。

```latex
\documentclass{minimal}
\begin{document}
Hello, world!
\end{document}
```

### Ti*k*Z

使用 `tikz` 和 `pgfplots` 宏包作图。

```latex
\documentclass{article}
\usepackage{tikz,pgfplots}
\pgfplotsset{width=7cm, compat=1.16}
\begin{document}
\begin{tikzpicture}
  \begin{axis}
    \addplot [red, domain=-3e-3:3e-3, samples=801]
      {exp(-x^2 / (2e-3^2)) / (1e-3 * sqrt(2*pi))};
  \end{axis}
\end{tikzpicture}
\end{document}
```

### Sort

使用 $LaTeX3$ 提供的接口，生成 1&ndash;65536 之间的 2048 个随机整数并排序。$ApTeX$ 没有实现相关原语因此该项目没有包含。

```latex
\documentclass{article}
\usepackage{expl3}
\begin{document}
\ExplSyntaxOn
\int_step_inline:nn { 2048 }
  { \seq_push:Nx \l_tmpa_seq { \int_rand:n { 65536 } } }
\seq_sort:Nn \l_tmpa_seq
  {
    \int_compare:nNnTF {#1} > {#2}
      { \sort_return_swapped: }
      { \sort_return_same:    }
  }
\seq_use:Nn \l_tmpa_seq { ,~ }
\ExplSyntaxOff
\end{document}
```

### `lipsum`

长文本测试，使用 `lipsum` 宏包提供的假文。

```latex
\documentclass{article}
\usepackage{lipsum}
\begin{document}
\lipsum[1-150]\par
\lipsum[1-150]\par
\lipsum[1-150]\par
\lipsum*[1-150]\par
\lipsum*[1-150]\par
\lipsum*[1-150]
\end{document}
```

### `zhlipsum`

中文长文本测试，使用 `zhlipsum` 宏包提供的假文。$pdfTeX$ 在 PDF 模式下不能使用 OpenType 字体，因此该项目没有包含。

```latex
\documentclass[UTF8, fontset=fandol]{ctexart}
\usepackage{zhlipsum}
\begin{document}
\zhlipsum[-]
\zhlipsum[-][name=zhufu]
\zhlipsum*[-][name=trad]
\zhlipsum*[-][name=xiangyu]
\zhlipsum*[-][name=aspirin]
\end{document}
```

### Source Han

调用思源宋体和思源黑体。同上，该项目也没有包含 PDF 模式下的 $pdfTeX$。各引擎调用字体的方式不同，具体如下：

- $XeTeX$ 和 $LuaTeX$ 可使用 `fontspec` 直接调用（`xeCJK`、`luatexja` 和 `ctex` 又提供了更高层的接口）
- $ApTeX$ 通过自带的 `\font` 原语调用[^aptex-font]
- $upTeX$ 通过 `\special` 命令以 pdf mapline 的方式使用 dvipdfmx 调用
- $pdfTeX$ 下使用 [zhmCJK 宏包](https://ctan.org/pkg/zhmcjk)

[^aptex-font]: 参考：[在 $ApTeX$ 中使用 OpenType](https://zhuanlan.zhihu.com/p/21383329)。

```latex
\documentclass[UTF8, zhmap=zhmCJK, fontset=none]{ctexart}
\usepackage{zhlipsum}

\ExplSyntaxOn
\bool_lazy_or:nnTF { \sys_if_engine_xetex_p: } { \sys_if_engine_luatex_p: }
  {
    \setCJKmainfont { Source~ Han~ Serif~ SC }
    \setCJKsansfont { Source~ Han~ Sans~  SC }
  }
  {
    \cs_if_exist:NTF \ngostype
      {
        \DeclareFontFamily { JY2 } { rm } { }
        \DeclareFontFamily { JY2 } { sf } { }
        \DeclareFontShape  { JY2 } { rm } { m  } { n } { <-> ot: SourceHanSerif-Regular.ttc [2]: upserif-h } { }
        \DeclareFontShape  { JY2 } { sf } { m  } { n } { <-> ot: SourceHanSans-Regular.ttc  [2]: upsans-h  } { }
        \DeclareFontShape  { JY2 } { sf } { bx } { n } { <-> ot: SourceHanSans-Bold.ttc     [2]: upsans-h  } { }
        \cs_set_eq:NN \oldrmfamily \rmfamily
        \cs_set_eq:NN \oldsffamily \sffamily
        \cs_set_protected_nopar:Npn \rmfamily { \oldrmfamily \kanjifamily { rm } \selectfont }
        \cs_set_protected_nopar:Npn \sffamily { \oldsffamily \kanjifamily { sf } \selectfont }
      }
      {
        \sys_if_engine_uptex:TF
          {
            \special { pdf:mapline~ upserif-h~ unicode~ :2:SourceHanSerif-Regular.ttc }
            \special { pdf:mapline~ upsans-h~  unicode~ :2:SourceHanSans-Regular.ttc  }
            \special { pdf:mapline~ upsansb-h~ unicode~ :2:SourceHanSans-Bold.ttc     }
          }
          {
            \setCJKmainfont { :2:SourceHanSerif-Regular.ttc }
            \setCJKsansfont { :2:SourceHanSans-Regular.ttc } [ BoldFont=:2:SourceHanSans-Bold.ttc ]
            \ctex_punct_set:n { fandol }
            \ctex_punct_map_family:nn { \CJKrmdefault } { zhsong }
            \ctex_punct_map_family:nn { \CJKsfdefault } { zhhei  }
          }
      }
  }
\ExplSyntaxOff

\begin{document}
\rmfamily
\zhlipsum[1,2]
\begingroup
  \sffamily
  \zhlipsum[1,2][name=zhufu]
\endgroup
\zhlipsum*[1,2][name=trad]
\begingroup
  \sffamily
  \zhlipsum*[1,2][name=xiangyu]
  \bfseries
  \zhlipsum*[1,2][name=aspirin]
\endgroup
\end{document}
```

## 测试结果

按引擎分组：

<figure>
  <img src="/images/tex-benchmark/dvi-by-engines.svg" alt="dvi-by-engines">
  <img src="/images/tex-benchmark/pdf-by-engines.svg" alt="pdf-by-engines">
</figure>

按测试项目分组：

<figure>
  <img src="/images/tex-benchmark/dvi-by-tasks.svg" alt="dvi-by-tasks">
  <img src="/images/tex-benchmark/pdf-by-tasks.svg" alt="pdf-by-tasks">
</figure>

以上纵轴单位均为秒。

从图中可以观察到：

- 总的来说 $pdfTeX$ 性能最好，但不支持 OpenType 是一个重大不足
- $XeTeX$ 比较平庸，而 `zhlipsum` 测试中表现比较糟糕
- $LuaTeX$ 在 Ti*k*Z 和 `zhlipsum` 测试中的表现都比较好，大概是利用 Lua 进行了优化；但在 Source Han 测试中调用字体花费了过多的时间，这还是在之前已经做好字体的前提下进行的测试
- $upTeX$ 和类似的 $ApTeX$ 在汉字处理上的性能格外出色

有两点比较出乎我的意料：

- $LuaTeX$ 也没有那么烂，大概是平时都会用 `fontspec` 调很多字体的缘故吧
- $ApTeX$ 总体性能其实并没有比 $pdfTeX$ 好很多，只有汉字处理方面有质的飞跃

## 汉字处理的时间复杂度

注意到 $XeTeX$ 在 `zhlipsum` 测试中的表现与其他引擎差距很大，其实之前也注意到过这个问题。因此干脆就再跑一个 benchmark。代码见下：

```latex
\documentclass[UTF8, fontset=fandol]{ctexart}
\usepackage{zhlipsum,l3benchmark}
\begin{document}
\zhlipsum[1]
\clearpage
\ExplSyntaxOn
\int_step_inline:nn {50}
  {
    \typeout {#1}
    \benchmark_once:n { \zhlipsum * [ 1 - #1 ] }
    \clearpage
  }
\ExplSyntaxOff
\end{document}
```

原理就是利用 `zhlipsum` 生成长度正比于 *N* 的文本，并用 `l3benchmark` 提供的函数测量时间。结果如下（横轴为文本长度，纵轴为时间/s；右侧使用对数标记）：

<figure>
  <img src="/images/tex-benchmark/zh-benchmark.svg" alt="zh-benchmark">
</figure>

对以上数据使用多项式拟合，可以得到：

| 引擎     | 拟合结果                                             | *R*²     |
|:--------:|:----------------------------------------------------:|:--------:|
| $pdfTeX$ | 8167.02 + 7551.00&thinsp;*N* +   2.68841&thinsp;*N*² | 0.999571 |
| $XeTeX$  | 4153.96 + 394.331&thinsp;*N* +   851.092&thinsp;*N*² | 0.999982 |
| $LuaTeX$ | 324.892 + 29.6847&thinsp;*N* +  0.209515&thinsp;*N*² | 0.996993 |
| $upTeX$  | 311.188 + 24.9441&thinsp;*N* + 0.0965613&thinsp;*N*² | 0.997172 |

对于 $XeTeX$，大致有时间复杂度 ~*O*(*N*²)，其他引擎则是 ~*O*(*N*)，这也验证了 $XeTeX$ 在长段落下表现不佳的猜测，不知道和 `xeCJK` 的实现是否有关呢？另外，就系数而言，$LuaTeX$ 和 $upTeX$ 要比同一时间复杂度的 $pdfTeX$ 还要好上很多，想必是日本那边专门做过优化的。

## 注释

<div id="footnotes"></div>
