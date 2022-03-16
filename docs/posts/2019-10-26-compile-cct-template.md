---
title: 编译 CCT 模板
date: 2019-10-26
categories: CCT
excerpt: 正如 Liam Huang 所言，「国内有不少期刊依旧在使用过时的 CCT 方式来支持中文」，《中国科学：信息科学》也不例外。我们的目的是把它移植到现代 $\TeX$ 发行版中，使之可以正常编译。
---

正如 Liam Huang 所言，「国内有不少期刊依旧在使用过时的 CCT 方式来支持中文」[^liam-cct]，《中国科学：信息科学》[^ssi]也不例外。我们的目的是把它移植到现代 $\TeX$ 发行版中，使之可以正常编译。

[^liam-cct]: [【LaTeX Tips】国内期刊 CCT 模板编译经验](https://liam.page/2013/10/15/LaTeX-CCT-template/)
[^ssi]: [快速了解中国科学信息科学](http://scis.scichina.com/)

## 编译前检查

期刊网站给出了模板的下载链接。打开后，可以看到其中包含三个文件：

- `SCIS2019cn.cls`
- `sciscn.tex`
- `sciscn.pdf`

两个文本文件都是 GB 编码的；而打开 PDF，则可以看到是用 dvips + Ghostscript 的老办法生成的。模板名字都带了 2019，工具却还停留在上个世纪，叹气。

## 编译尝试

打开那个 `SCIS2019cn.cls` 文件，可以看到这样的代码：

```tex
\let\CCTCJKfonts=1
\LoadClass[twoside,CJK]{cctart}
```

CCT 有关的东西显然不可能在 $\TeX$ Live 上面编译，更不用说非 Windows 的环境。那么我们就伪造一个 `cctart` 文档类：

```tex
% 保存在 cctart.cls 文件中
\ProvidesClass{cctart}
\PassOptionsToClass{\CurrentOption}{ctexart}
\LoadClass[fontset=fandol]{ctexart}
```

这里就是简单调一下 $\>CTeX$ 文档类，同时使用 Fandol 字体以避免兼容问题。这样碰巧还有一个好处，就是可以和原来的效果比较接近。

为避免麻烦，我们首先使用 $\>pdfTeX$ 引擎尝试：

```bash
latex sciscn.tex
```

这里的 `latex` 命令大致相当于不生成 PDF 的 `pdflatex`[^pdflatex]。不出所料果然是会报错的：

[^pdflatex]: 不使用 `pdflatex` 编译的原因是它不支持 OpenType 字体（Fandol），所以我们先要生成 DVI 文件再转为 PDF。

```
! LaTeX Error: File `picins.sty' not found.

Type X to quit or <RETURN> to proceed,
or enter new name. (Default extension: sty)

Enter file name:
```

提示找不到 `picins.sty`。简单搜索就能在 CTAN 上找到 [picins](https://www.ctan.org/pkg/picins) 这个包。适用于 $\LaTeX$ 2.09，还使用了禁止分发的许可证，总而言之主流发行版都没有带。那么就要自己解决一下：

```bash
curl https://mirrors.tuna.tsinghua.edu.cn/CTAN/macros/latex209/contrib/picins/picins.sty -o picins.sty
```

当然不用命令行也完全可以。这里我们也简单起见，就把宏包扔在工作目录。

继续编译，还是有报错：

```
! Undefined control sequence.
<argument> \headerps@out
                         {/burl@stx null def /BU.S { /burl@stx null def } de...
l.311 }

?
```

搜索之后，可以知道错误这是因为 `breakurl` 宏包只有在 `dvips` 模式下才需要，其他驱动都可以正常处理 URL 的断行问题[^breakurl]。解决办法是禁止调用这一宏包：

[^breakurl]: [breakurl doesn't work with xelatex](https://tex.stackexchange.com/q/218196)

```tex
\@namedef{ver@breakurl.sty}{9999/99/99}
```

意思是把版本号设在「无穷远点」，使 $\LaTeX$ 不再调用。这时编译文档，便可以无错误地结束了。使用 latexmk 可以简化一些流程：

```bash
latexmk sciscn.tex && dvipdfmx sciscn.dvi
```

## 使用其他引擎

众所周知，$\>pdfTeX$ + `CJK` 的方案处理中文早已是过时的了，因此接下面我们换用 $\>XeTeX$ 和 $\>LuaTeX$ 进行编译。首先需要把编码转换为 UTF-8：

```bash
iconv -f gbk -t utf8  sciscn.tex     > sciscn.tex.tmp     && mv -f sciscn.tex.tmp     sciscn.tex
iconv -f gbk -t utf8  SCIS2019cn.cls > SCIS2019cn.cls.tmp && mv -f SCIS2019cn.cls.tmp SCIS2019cn.cls
```

这时用 `xelatex` 或 `lualatex` 编译，还是有报错：

```
! LaTeX Error: Command \C already defined.
               Or name \end... illegal, see p.192 of the manual.

See the LaTeX manual or LaTeX Companion for explanation.
Type  H <return>  for immediate help.
 ...

l.591 ...command{\C}[1]{\ensuremath{\mathcal{#1}}}
                                                  %
?
```

这是由于 `hyperref` 已经定义了 `\C` 命令，用于处理某些西里尔字母。一般来说没有必要用，可以直接取消定义：

```tex
\csname ctex_at_end_package:nn\endcsname
  {hyperref}{\let\C\undefined}
```

此时编译即可顺利通过：

```bash
latexmk -xelatex sciscn
# 或者 latexmk -lualatex sciscn
```

## 小结

CCT 在历史上也是发挥过重要作用的，然而现在来看基本已经成为了阻碍。某种程度上，期刊的学术水平从排版质量上也可以窥见一斑。《中国科学：信息科学》的模板写得可以说是一言难尽，不过总还是有办法绕过这些泥潭。

最后给出完整的（修改版）`cctart.cls` 以供参考：

```tex
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{cctart}
\PassOptionsToClass{\CurrentOption}{ctexart}
\LoadClass[fontset=fandol]{ctexart}
\@namedef{ver@breakurl.sty}{9999/99/99}
\csname ctex_at_end_package:nn\endcsname
  {hyperref}{\let\C\undefined}
\endinput
```

## 注释

<div id="footnotes"></div>
