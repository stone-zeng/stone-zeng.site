---
title: CJK 宏包中，中文字体的奥秘
author: 王越
date: 2019-07-14
tags:
  - Fonts
  - CJK
excerpt: 嗯，此为一连载。背景是，我们希望 ctex-kit 最终提交到 $\TeX$ Live 或者 CTAN 的时候，可以带上所有中文字体的 TFM、MAP 和 ENC，来让用户差不多是零配置地使用 `CJK` 中文，因此我们需要产生这些文件。
---

> 本文原作者为王越，2009 年 5 月发表在 $\>CTeX$ 论坛上（[原始网址](http://bbs.ctex.org/viewthread.php?tid=50078)，已失效）。由于 $\>CTeX$ 论坛目前已关闭，这里将其整理后重新发布。[^newsmth]
>
> 本文实际上是 [`zhmetrics` 包](https://ctan.org/pkg/zhmetrics)的实现思路。该包由王越和吴凌云发布，并且一直被 $\>CTeX$ 宏集所使用至今。在此基础上，刘海洋又开发了 [`zhmCJK` 包](https://ctan.org/pkg/zhmcjk)，允许动态设置 CJK 字体，并且提供了尽可能简单的用户界面。

[^newsmth]: 在水木社区 $\TeX$ 版还保留有[原文](https://www.newsmth.net/bbsanc.php?path=%2Fgroups%2Fcomp.faq%2FTeX%2Fchinese%2FM.1243072730.10)。

嗯，此为一连载。背景是，我们希望 [ctex-kit](https://github.com/CTeX-org/ctex-kit) 最终提交到 $\TeX$ Live 或者 CTAN 的时候，可以带上所有中文字体的 TFM、MAP 和 ENC，来让用户差不多是零配置地使用 `CJK` 中文，因此我们需要产生这些文件。而产生过程中可能会用到中文字体进行转换，故可能有版权问题，而且可能产生的 TFM 文件存在不通用的情况（尤其是只覆盖一部分 GBK 区域的字体产生的文件），所以我们考虑如何不依赖中文字体来产生这些文件。这就需要我们对 $\TeX$ 的字体原理有一定的掌握，然后就能够从原理出发，直接写脚本产生不依赖字体的字体配置文件。本文的目的就是为了 ctex-kit 能够写出一个很好很强大的东东来，实现自动凭空产生中文字体的 TFM、ENC 以及 MAP 文件。

既然是探秘，俗话说，源代码背后没有秘密可言，因此，本文在阐述的过程中，旁征博引目前 $\TeX$ 相关的多个软件的源代码。文中所有的代码，指的是当前 $\TeX$ Live 的代码版本（当前 SVN 版本为 13423）[^tl-version]。文中的开发者，特指完成上述任务（也就是写脚本生成字体无关配置文件）的开发者。

[^tl-version]: 目前，$\TeX$ Live 源代码同时通过 [SVN](https://www.tug.org/svn/texlive/trunk/) 和 [Git](https://github.com/TeX-Live/texlive-source) 两种方式进行版本管理。

由于我对 $\TeX$ 的 [WEB](https://www.ctan.org/pkg/web) 源代码比较熟悉，对于 [ttf2pk](https://github.com/TeX-Live/texlive-source/tree/trunk/texk/ttf2pk2)、[DVIPDFMx](https://ctan.org/pkg/dvipdfmx)、以及 $\>pdfTeX$ 的代码也略通一二，因此写这篇文章采用了比较宏观和触类旁通的笔法。文章中对于 $\TeX$ 的字体相关的诸多概念和数据结构进行了扼要的阐述，每讲到一知识点，我就尽量引用 `tex.web`、`tftopl.web`、`ttf2tfm.c` 等代码[^tl-source]来阐明背后的原理，此外还在多处引申开来讲述了一些 $\TeX$ 的算法原理。因此这篇文章不仅仅是给上述所说的开发者看的，任何对 $\TeX$ 的字体原理感兴趣的读者，都能从中获得你想了解的东西。

[^tl-source]:

当然，笔误难免，况且我只是一个建筑系的本科生，而不是学计算机的，肯定会犯下一些错误，希望版面上的老师们指正。

## 连载一

首先看一下 UTF8 字体下的 TFM 字体的奥秘。大家都知道，一般来说 CJK 中采用 subfonts 的概念，来让 $\TeX$ 能够吞下大字符集。而 UTF8 字体，会分成 256 个 subfonts。这些字符的字体名可以设为：

```
<fontname><num><num>.tfm
```

其中，`<fontname>` 是一个字符串，代表字体名，比如 `song`、`hei`、`kai` 等。而 `num` 的概念其实就是一个十六进制的数字，可以从 `0`--`9`，以及 `a`--`f`（注意是小写）中任意选一个（CJK 不使用 `00`，退回到英文字体代替）。当然很多情况下 `fontname` 以 `uni` 开头。

GBK 的 TFM 字体信息采用了相类似的 subfonts 方案，只不过文件名为

```
<fontname><num-num>.tfm
```

其中，`<num-num>` 可是十进制的两位数字，从 `00`--`94`，共 95 个字体（其中 `00` 不使用）。很多情况下为了区分，`fontname` 以 `gbk` 开头。

$\TeX$ 的 TFM 字体为了节约空间（要知道 $\TeX$ 开发的时代计算机设备是很土的），采用二进制进行编码，因此采用普通的文本编辑器是看不到任何肉眼能读懂的信息的。但是事实上看 `tex.web` 的代码就知道，TFM 代表的就是一串普通的数组，这串数组分为两个部分，前一部分包括了给 $\TeX$ 自己检查 TFM 完整性的信息，主要的就是接下来的各个表格会包含多少的数组，后一部分就是完整的字体的长宽高以及 liga/kern 等 table 的信息了。定义相对来说是非常清晰易懂的，有兴趣的可以看 [$\TeX$ 源代码的第 30 章](https://github.com/TeX-Live/texlive-source/blob/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c/tex.web#L10399)。

中文字体有个很好的地方，就是

- 不包含英文字体，也就是 `00` 这个字体在 CJK 环境中是不被读取的。
- 由于上一条，因此不存在任何英文字体特有的功能，也就是说，不包含 ligature/kern、kerning 以及 italic correction 的表格。

所以，整个 TFM 虽然很多，但结构是非常简单的。

TFM 的可读性不好，即使是把二进制信息转换成数字，也难让人直接阅读，因为它是按照 table 本身排序的，比如先叙述所有的 glyph 的宽度，再叙述所有字符的高度，再叙述深度，再叙述斜体修正……而不是按照字符本身排序。因此 Knuth 老爷爷写了两个程序，叫做 TFtoPL 和 PLtoTF，实现 TFM 和 PL 文件的相互转化。而 PL 文件是按照字符本身的顺序排列的。因此人类读起来就非常方便。

所以想要揭开 TFM 字体的神秘面纱，TFtoPL 就是第一步需要干的事情。TFtoPL 的使用方法很容易，从任何的 $\TeX$ 发行版中拷贝出来就可以使用，执行方法为：

```bash
tftopl foobar.tfm foobar.pl
```

这样就会从 `foobar.tfm` 这个文件产生一个叫做 `foobar.pl` 的文件，然后你就可以拿着你喜爱的编辑器用肉眼轻松阅读这个文件了。

## 连载二

接下去的事情就很自然了，我们只要给出中文字体的 PL 文件结构，那开发者就能够用程序凭空产生一系列的 PL 文档，然后就能接着产生一套完整的 TFM 字体。这样的事情，不需要实际字体参与，因此没有任何版权问题。

为了展示这个强大的 PL 文件，我们选取方正仿宋字体转换出来的 `unifs5c.pl` 为例子。这个字体是三四年前用 ttf2tfm 制作的，当时的 ttf2tfm 和目前的 ttf2tfm 代码已经有一些区别，所以 `FAMILY`，`CODINGSCHEME` 和目前的命名方法不一样，而且新版的 ttf2tfm 还增加了其他一些变量，比较复杂，所以我还是从老版的开始讲起，再在后面提一下 ttf2tfm 目前的一些改动。在我的机器中，这个文件开头部分如下：

```clojure
(FAMILY FANGSONG-5C)
(CODINGSCHEME FONTSPECIFIC)
(DESIGNSIZE R 10.0)
(COMMENT DESIGNSIZE IS IN POINTS)
(COMMENT OTHER SIZES ARE MULTIPLES OF DESIGNSIZE)
(CHECKSUM O 12045601744)
```

以上的这些信息，都对应于 $\TeX$ 中一个叫 `header[]` 的数组。`header` 数组是 TFM 中的一个重要数据结构，$\TeX$ 中规定，`header` 至少是一个长度为 2 的数组，即 `header[0]` 和 `header[1]`（详细见 [$\TeX$ 源代码 542 小节](https://github.com/TeX-Live/texlive-source/blob/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c/tex.web#L10466-L10508)），下面就来逐行说明这个开头部分。

`header[0]` 是一个 32 位的 check sum，用来直接灌入 DVI 文件的，用来检查目标系统（比如在另一台机器打印 DVI，或者使用 DVIPDFMx 转换 DVI 为 PDF）所包含的 TFM 字体是否和灌入 DVI 的那套 TFM 是同一个。在这里，check sum 就是上面列出的 `12045601744`。这个数值是设计字体时所定下的，和字体本身没有任何关系。

那中文的 TFM 信息是如何计算的呢？这个是因程序而异的。如果使用的是 ttf2tfm 来转换的 TFM 字体，那应该是使用 encoding 信息来转换的。见 [`texk/ttf2pk/tfmaux.c` 文件的 368 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L368-L370)：

```c
header = (long *)mymalloc(40000L);
cksum = checksum(fnt->inencptrs);
header[0] = cksum;
```

这里的 `checksum` 是一个函数，实现起来并不困难，见[同文件 245 行的定义](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L244-L265)：

```c
static long
checksum(ttfinfo **array)
{
  int i;
  unsigned long s1 = 0, s2 = 0;
  char *p;
  ttfinfo *ti;


  for (i = 0; i < 256; i++)
    if (NULL != (ti = array[i]))
    {
      s1 = ((s1 << 1) ^ (s1 >> 31)) ^ ti->width; /* cyclic left shift */
      s1 &= 0xFFFFFFFF;         /* in case we're on a 64-bit machine */

      for (p = ti->adobename; *p; p++)
        s2 = (s2 * 3) + *p;
    }

  s1 = (s1 << 1) ^ s2;
  return s1;
}
```

而 `inencptrs` 就是一个简单的 TTF 的 CMAP 中前 256 个字节的 mapping 信息。

但有没有办法不干 check sum 这件事情呢？$\TeX$ 中并没有对 check sum 有任何的规定，因为它是 DVI driver 负责的事情。而 $\TeX$ 中暗示，如果把 `checksum` 设为 0，那么 DVI 的驱动应该默认不检查 check sum。[$\TeX$ 源代码的 542 小节](https://github.com/TeX-Live/texlive-source/blob/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c/tex.web#L10485-L10486)明确写道：

> However, if the check sum is zero in either the font file or the `TFM` file, no check is made.

因此，最简单的办法就是把它设为 0。

`header[1]` 对应的就是上面所谓的 design size，至少为 1。比如 design size 为 10，那这个字体就是默认为十磅因大小的。比如用户写

```tex
\font\myfont=cmr10 at 12pt
```

由于 `cmr10` 的 design size 为 10，那接下来 $\TeX$ 干的事情就是，把字体中所有的参数乘上 `12pt`，再除以 `10pt`，就得到了字体在 $\TeX$ 中的真实长宽深等参数。因此可见，design size 是非常重要、必不可少的。

在 `ttf2tfm` 中，design size 在 [`texk/ttf2pk/tfmaux.c` 文件](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L371)中是被定义成这样的：

```c
header[1] = 0xA00000;                     /* 10pt design size */
```

因此，开发者请注意，将你们 TFM 的 design size，设成 10。

## 连载三

$\TeX$ 源代码中只定义了 `header[0]` 和 `header[1]`，并且这个是每个 TFM 字体所必须的。而其他的 `header[]` 则是用户可以随便定义的。

当然 Knuth 还是在其他文件中定义了一些默认 `header` 该做的行为，那就是 `texk/web2c/tftopl.web`，TFtoPL 的源文件。

我们继续往下讲：`header[2]`--`header[11]` 这个数组指代的是字体的 coding scheme。比如 `TEXT`、`ASCII` 或者 `UNSPECIFIED`。

`header[12]`--`header[16]` 是字体标识名，对应 PL 文件中的 `FAMILY`，可以指定实际的字体名字，比如 `CMR`。在 ttf2tfm 的源代码中（[`texk/ttf2pk/tfmaux.c` 文件 373 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L373-L374)），写入 tfm 的实际信息为：

```c
(void)makebcpl(header + 2, fnt->codingscheme, 39);
(void)makebcpl(header + 12, fnt->fullname, 19);
```

那 `fnt` 中的那些参量是怎么来的呢？首先来看字体名，在 [`ttf2tfm.h` 头文件的 138 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/ttf2tfm.h#L138-L141)中，我们看到这样的定义：

```c
char *outname;            /* only namestem without extension */
char *subfont_name;       /* NULL if not used */
char *outname_postfix;    /* NULL if not used */
char *fullname;           /* outname + subfont_name + outname_postfix */
```

可以看到 `fullname` 是由三部分合并起来的。具体的合并部分是在 `filesrch.c` 中的 `get_tfm_fullname` 这个函数中体现的，而这个函数是在 `ttf2tfm.c` 的 `main` 函数中一开始就调用的。具体的 `get_tfm_fullname` 的合并部分，见 [`filesrch.c` 的 609 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/filesrch.c#L609-L614)：

```c
if (fnt->outname)
  strcat(fnt->fullname, fnt->outname);
if (fnt->subfont_name)
  strcat(fnt->fullname, fnt->subfont_name);
if (fnt->outname_postfix)
  strcat(fnt->fullname, fnt->outname_postfix);
```

至于 `outname` 和 `codingscheme`，前者目前版本的 ttf2tfm 是直接由用户给定的，而后者是使用的用户制定的 SFD 文件的文件名。当然我这里给出的字体并非由当前版本产生，因此和源代码描述会有所一定区别，我们会在第五次连载给出一个当前版本 ttf2tfm 产生的 GBK 的 TFM 来进行说明。不过一般来说，中文开发者不需要严格遵守上面的规定，因为 DVIPDFMx 和 $\>pdfTeX$ 并不在字体嵌入的时候检查这两项。

最后遗留的是两行 `COMMENT`。这个不是 TFM 信息中留下的，而是 TFtoPL 程序中指定的。在 TFtoPL 程序输出 `DESIGNSIZE` 的时候，就默认会产生这两行 `COMMENT`。见 [`tftopl.web` 的代码](https://github.com/TeX-Live/texlive-source/blob/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c/tftopl.web#L872-L881)：

```pascal
@ @<Output the design size@>=
left; out('DESIGNSIZE');
if tfm[design_size]>127 then bad_design('negative')
else if (tfm[design_size]=0)and(tfm[design_size+1]<16) then
  bad_design('too small')
else out_fix(design_size);
right;
out('(COMMENT DESIGNSIZE IS IN POINTS)'); out_ln;
out('(COMMENT OTHER SIZES ARE MULTIPLES OF DESIGNSIZE)'); out_ln
@.DESIGNSIZE IS IN POINTS@>
```

到这里为止，上面所列出的所有变量都已经解释完了，往下看我们会发现一些新的定义：

```clojure
(FONTDIMEN
   (SLANT R 0.0)
   (SPACE R 1.0)
   (STRETCH R 0.3)
   (SHRINK R 0.1)
   (XHEIGHT R 0.4)
   (QUAD R 1.0)
   )
```

想知道这些参数代表什么，它们在 $\TeX$ 代码、TFtoPL 代码以及 ttf2tfm 代码中是如何定义的，请继续阅读连载四。

## 连载四

看上去 `FONTDIMEN` 直接出现在上面的 `header[]` 参数后，但事实上在实际的 TFM 中，这组信息出现在 TFM 的末尾，在 $\TeX$ 中表述这组信息也有一组变量，叫做 `param[]` 数组。`param` 数组在 $\TeX$ 中非常重要，是控制排版的主要依据。为了讲述 `FONTDIMEN` 表的各个参数，我们不得不回到 $\TeX$ 的源代码 `tex.web` 中，来一一点数这些参数的功能。

值得注意的是，$\TeX$ 的 Pascal WEB 代码中 `param` 数组是从 1 开始的，而 ttf2tfm 的 C 代码中 `tparam` 数组是从 0 开始的，希望读者注意区别，也就是例如 `tparam[3]` 这个变量实际对应的是 `param[4]`，请不要混淆。

`SLANT` 参数对应着 `param[1]`。这个参数指定意大利字体的斜率，这个数值在给拉丁字母标注重音符号（accent）的时候会变得很有用，因为这样就能够直接根据斜率计算重音符号的位置。对于中文字体一没有意大利体之说，二没有重音符号之说，所以显然为 0。但是用户可以在执行 ttf2tfm 的时候指定这个数值。不过不管如何，开发者可以直接把它设置成 0。

`SPACE` 参数对应着 `param[2]`，这个数值是分割单词的空格的长度。ttf2tfm 中这个很好搞定，因为 TTF 字体有空格这个字符，所以直接读入空格这个 glyph 的宽度就好了。具体的代码就在 [`texk/ttf2pk/ttf2tfm.c` 文件 866 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/ttf2tfm.c#L866-L871)：

```c
if (NULL != (ti = findadobe("space", font.charlist)))
  font.fontspace = ti->width;
else if (NULL != (ti = findadobe(".c0x20", font.charlist)))
  font.fontspace = ti->width;
else
  font.fontspace = transform(500, 0, font.efactor, font.slant);
```

得到了 `fontspace` 后，就在 [`texk/ttf2pk/tfmaux.c` 的 523 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L523)定义了这个 `param` 数组：

```c
tparam[1] = scale((long)fnt->fontspace);
```

对于中文字体，直接设置成 1 即可。

有了 space 的概念，那就是个 glue 的概念，我们知道，$\TeX$ 中的 glue 是可伸缩的，比如某个 glue 可以被定义成 `5pt plus 3pt minus 2pt`。因此其实 $\TeX$ 中的空格长度是可伸缩的，而且可以根据伸缩的长度确定 badness，最后，使用最短路径算法最优计算 badness 最低的情况，这个就是为什么 $\TeX$ 的断行非常漂亮的原因。因此，`param[3]` 和 `param[4]` 被定义出来，分别对应 `STRETCH` 和 `SHRINK` 两个变量。这两个变量在 [`texk/ttf2pk/tfmaux.c`](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L524-L525) 中是如此定义的：

```c
tparam[2] = (fnt->fixedpitch ? 0 : scale((long)(300 * fnt->efactor + 0.5)));
tparam[3] = (fnt->fixedpitch ? 0 : scale((long)(100 * fnt->efactor + 0.5)));
```

而 `fixedpitch` 这个变量也是在 [`web2c/ttf2pk/ttfaux.c` 文件的 261 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/ttfaux.c#L261)[^ttfaux]定义的：

[^ttfaux]: 该文件实际路径为 `texk/ttf2pk/ttfaux.c`。

```c
fnt->fixedpitch = properties.postscript->isFixedPitch;
```

也就是通过 FreeType 读取 TTF 字体的 PostScript 信息中的 `isFixedPitch` 项，来确定字体是不是等宽的。对于中文来说，目前局势下虽说新的中文字体的英文部分已经有很大改善，但是在 CJK 中我们是不使用英文部分的，而中文部分又一定是等宽的，因此这个变量不存在太大的意义。只需要把  `STRETCH` 定义为默认值 0.3，把 `SHRINK` 定义为 0.1 即可。这部分不影响中文排版，因为中文排版不使用这个信息。

`XHEIGHT` 参数是通过 `param[5]` 定义的，这个变量告诉 $\TeX$ 字体的 x-height，差不多就是字体 x 字母的高度（在 $\TeX$ 中如此，CM 的 x height 和 x 字母高度相同，而在现代的字体中未必如此），因此可以看作是小写的 a、e、o 等字母的高度，所以这个变量就能告诉 $\TeX$ 放置重音符号时是否挤压了重音符号下的 a、e、o 等字母本身，来决定是否需要升高或者降低重音符号。通过 [`texk/ttf2pk/tfmaux.c` 的 526 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L526)定义：

```c
tparam[4] = scale((long)fnt->xheight);
```

在 ttf2tfm 代码中，默认的 `XHEIGHT` 为 0.4，这个是在 [`texk/ttf2pk/newobj.c` 的 324 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/newobj.c#L324)中设定好的：

```c
fnt->xheight = 400;
```

因此开发者直接将它设置为 0.4 即可。

`QUAD` 这个变量对应 `param[6]`，这个表示字体的全方（em）宽度。em 宽度可以在排版中设定 glue 或者 box 的相对于字体的长度，因此可以方便地做到字体无关性，是非常方便的一个单位（关于距离的字体无关性，我举个例子，比如我想让两个字符间空上 `2em plus 1em minus 1em` 的距离，就可以直接这么写，如果没有这个单位就需要换算到 `pt`，这样万一我调整了字体的大小，空格宽度和字符大小比例就会失衡了）。在 $\TeX$ 时代或者经典排版理论中，全方长度就是 M 字母的宽度，因为 M 字母一般设计得是最宽的。而半方（en）就是字母 n 的宽度，当然在现代字体中，事情往往并非如此。在 ttf2tfm 中，这个数值是设死的，见 [`texk/ttf2pk/tfmaux.c` 的 527 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L527)定义：

```c
tparam[5] = scale((long)(1000 * fnt->efactor + 0.5));
```

因此开发者直接将此设置为 1 即可。

其实对于正常字体，`param[7]` 也是存在的，名为 `EXTRASPACE`，对应的就是标点符号后的空格的附加长度，也就是说，出现在句号后的空格需要空上 `param[2]`+`param[7]` 长度的距离。在 [$\TeX$ 的源代码的 1044 小节](https://github.com/TeX-Live/texlive-source/blob/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c/tex.web#L20351-L20354)中，对于空格后的代码就会有如下的定义：

```pascal
@ @<Modify the glue specification in |main_p| according to the space factor@>=
if space_factor>=2000 then width(main_p):=width(main_p)+extra_space(cur_font);
stretch(main_p):=xn_over_d(stretch(main_p),space_factor,1000);
shrink(main_p):=xn_over_d(shrink(main_p),1000,space_factor)
```

也就是默认情况下（非 french spacing），一般设定 `space_factor` 后，就会该标点符号后的长度 width 就会增加 `extra_space`（也就是 `param[7]`）的长度。而该空格长度的伸缩距离，是通过 `space_factor` 来计算的。不过对于中文排版没有用，因此开发者不必关注。

讲完了上面这么多，可以轻松一下。所以我顺便说一个问题，也就是为什么普通的字体拿到 $\TeX$ 中，是不能被用来排公式的。很多 $\TeX$ 用户问这个问题，尤其是 $\>XeTeX$ 出来后，可以用系统字体了，甚至还有一个 $\LaTeX$ 宏包专门指定数学字体（`unicode-math`），不过排出来的公式却效果非常糟糕。我就简单解释一下。普通的 $\TeX$ 字体，一般都有上面 7 个全局变量，而数学公式中，需要考虑的位置关系就多得多，比如排分数，分子分母之间会不会重合啊，分子分母和分数线之间会不会重合啊，等等等等，因此为了充分考虑这些关系，$\TeX$ 给出了全面的算法，而为了贯彻这个算法，更多的变量就被设计出来了。一个普通的数学字体会带有 22 个全局变量，他们的变量名可以从下面这段从 [`tftopl.web` 中截取的程序](https://github.com/TeX-Live/texlive-source/blob/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c/tftopl.web#L994-L1009)看出：

```pascal
@ @<Output the name...@>=
if i<=7 then case i of
  2:out('SPACE');@+3:out('STRETCH');@+4:out('SHRINK');
  5:out('XHEIGHT');@+6:out('QUAD');@+7:out('EXTRASPACE')@+end
else if (i<=22)and(font_type=mathsy) then case i of
  8:out('NUM1');@+9:out('NUM2');@+10:out('NUM3');
  11:out('DENOM1');@+12:out('DENOM2');
  13:out('SUP1');@+14:out('SUP2');@+15:out('SUP3');
  16:out('SUB1');@+17:out('SUB2');
  18:out('SUPDROP');@+19:out('SUBDROP');
  20:out('DELIM1');@+21:out('DELIM2');
  22:out('AXISHEIGHT')@+end
else if (i<=13)and(font_type=mathex) then
  if i=8 then out('DEFAULTRULETHICKNESS')
  else out('BIGOPSPACING',i-8:1)
else out('PARAMETER D ',i:1)
```

而普通的系统字体也好，$\TeX$ 中一般的文本字体也好，不会定义这些变量，而且除去上面这些全局变量外，每个字符也有额外的数学相关的变量（比如连接大符号需要的 `top`、`mid`、`bot`、`rep` 变量）。为了能够让 TTF/OTF 字体支持这些扩展，OpenType MATH Table 被 Microsoft 设计出来，成为 $\TeX$ 公式排版算法和数学字体变量的超集。

## 连载五

上面的我们已经完整地分析了 `unifs5c.tfm` 的头部的 `header[]` 数组和尾部的 `param` 数组，因此，`unifs5c.pl` 的开头如何编写，各位开发者应该是轻车熟路了。GBK 字体的 TFM 造法和 Unicode 字体基本相同，我就不多叙述。在这个连载中，我们看看 TFM 还能包括哪些数据，因此我们拿出一个不同版本 ttf2tfm 产生的 GBK 字体来做分析。

选取 $\>CTeX$ 发行版中的 `gbkhei44.tfm` 文件，这个 TFM 是采用当前版本的 ttf2tfm 产生的。我们使用 TFtoPL 转换成我们需要的 PL 格式，用编辑器打开，看到头部比我们想象得来得复杂（这也是我把它放到连载五中讲述的原因）：

```clojure
(FAMILY GBKHEI44)
(FACE F MRR)
(HEADER D 18 O 13220671145)
(HEADER D 19 O 14135062544)
(HEADER D 20 O 4030474440)
(HEADER D 21 O 14030635134)
(HEADER D 22 O 14335062570)
(HEADER D 23 O 5534667565)
(HEADER D 24 O 16230662534)
(HEADER D 25 O 16431274155)
(HEADER D 26 O 14627066551)
(HEADER D 27 O 15335062570)
(HEADER D 28 O 13430464556)
(HEADER D 29 O 13435072146)
(HEADER D 30 O 6235063155)
(HEADER D 31 O 4030635134)
(HEADER D 32 O 16732267156)
(HEADER D 33 O 16427063157)
(HEADER D 34 O 15635071534)
(HEADER D 35 O 16332266550)
(HEADER D 36 O 14532220055)
(HEADER D 37 O 16110063542)
(HEADER D 38 O 15332062551)
(HEADER D 39 O 10025243502)
(HEADER D 40 O 11320023400)
(CODINGSCHEME CJK-UGBK)
(DESIGNSIZE R 10.0)
(COMMENT DESIGNSIZE IS IN POINTS)
(COMMENT OTHER SIZES ARE MULTIPLES OF DESIGNSIZE)
(CHECKSUM O 14713677235)
```

其中，两行 `COMMENT`、`DESIGNSIZE` 是都相同的；`CHECKSUM` 已经讲述过，是按照 `fnt->inencptrs` 计算的一个数，开发者可以不予以理会；`CODINGSCHEME` 和 `FAMILY` 是字体的编码和名字，可以任意设置。而其他的几项则是读者非常陌生的，它们代表着什么？让我慢慢道来。

首先 `CODINGSCHEME` 在 ttf2pk 程序中，[`texk/ttf2pk/ttf2tfm.c` 文件的 859 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/ttf2tfm.c#L859)，可以看到，对于一个非默认编码的 CJK 字体来讲，是由 `CJK-%s` 的形式来定义其 `CODINGSCHEME` 的：

```c
sprintf(font.codingscheme, "CJK-%s", temp + start);
```

而这里的 `%s`，需要退回到之前的代码（[`texk/ttf2pk/ttf2tfm.c` 文件的 834 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/ttf2tfm.c#L834-L856)）：

```c
/*
 *   Extract base name of sfd file.
 */

temp = newstring(font.sfdname);
len = strlen(temp);

start = 0;
for (i = len - 1; i >= 0; i--)
  if (temp[i] == '/' || temp[i] == ':' || temp[i] == '\\')
  {
    start = i + 1;
    break;
  }

end = len;
for (i = len - 1; i >= 0; i--)
  if (temp[i] == '.')
  {
    end = i;
    break;
  }
temp[end] = '\0';
```

也就是说，这个是根据字体生成的时候的 SFD 文件名而产生的。产生 GBK 字体我们用到的 SFD 名字为 `UGBK.sfd`，因此，自然这腾出来的 `CODINGSCHEME` 就成了 `CJK-UGBK`。不过对于开发者来说，这个名字并不重要，当然为了求规范，不妨设为 `CJK-UGBK`。当前的版本的 ttf2tfm 产生的 Unicode 字体的 `CODINGSCHEME` 为 `CJK-UNICODE`，而 GBK 字体为 `CJK-UGBK`。而之所以前面给出的 `unifs5c.tfm` 产生的是 `FONTSPECIFIC`，是由于用老版本的 ttf2tfm 产生的缘故。我写这篇文章时，分析的是 $\TeX$ Live 中的新 ttf2pk 代码，目前的 $\TeX$ Live 的 SVN 版本号为 13423。这个版本给出的 `CODINGSCHEME` 都符合这个格式。

这个文件有个巨长的 `HEADER` 表。在 [`tftopl.web` 的源代码](https://github.com/TeX-Live/texlive-source/blob/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c/tftopl.web#L256-L257)中，有如下的解释：

```pascal
\yskip\hang|header[18..@twhatever@>]| might also be present; the individual
words are simply called |header[18]|, |header[19]|, etc., at the moment.
```

也就是说，事实上 `header[18]` 以后的是可以想设置多长就多长，因此事实上上面这个 `HEADER`，就是一串从 `header[18]` 开始的数组罢了，所以很明确可以从上面的信息看到，这个串从 18 开始，到 40 结束。那这串数组是什么意思呢？[`texk/ttf2pk/tfmaux.c` 的 378 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L378-L382)告诉我们：

```c
buffer[0] = '\0';
strncat(buffer, "Created by `", 12);
strncat(buffer, fnt->titlebuf, 255 - 12 - 1);
strncat(buffer, "'", 1);
charinfo = makebcpl(header + 18, buffer, 255);
```

所以事情就很明确了，那么长的 `HEADER` 表，无非告诉我们一个长字符串。18--40 这串字符串（注意，`header` 数组是一个 `word` 的数组，也就是说，单但一个 `header[18]`，就占了一个 `word`，也就是 32 位）告诉我们这个无聊的信息：

```
Created by `c:\ctex-source\texmf\miktex\bin\ttf2tfm c:\winnt\fonts\simhei -q gbkhei@UGBK@'
```

有趣的是，DVIPDFMx 和 $\>pdfTeX$ 一样忽略这串 `header` 数组，因此开发者不必考虑如何添加一个漂亮的 `header`。有读者可能会问，为何先前展示的 Unicode 字体中并没有这行 `header` 呢？我只能回答，它们用的是不同版本的 ttf2tfm 产生的。至少当前版本的 ttf2tfm 都会产生这个 `header`。

最后一个大家不熟悉的变量就是 `FACE` 了。`FACE` 变量其实就是一个用来识别字体款式的一个特征标记，DVIPDFMx 和 $\>pdfTeX$ 一样不追究这个标记。它实际上是 `header[17]` 的最后一个字节（也就是第四个字节），转换成标记后就变成三个字母，也就是大家看到的 `MRR` 这样的表示方法。其中，第一个字母表示 Medium，可选的还有 `B` 和 `L`，表示 Bold 和 Light。第二个 `R` 表示的是 Roman，可选的还有 Italic。第三个表示 Regular，可选的还有 Condensed 和 Extended。对于开发者来讲，这一行可以省略。

在我自己生成的一个 GBK 字体 `gbksimkai44.tfm` 中，有时候还会有一行

```clojure
(SEVENBITSAFEFLAG TRUE)
```

这个是 `header[17]` 的第一个字节，表示这个 TFM 可以在 7 位的 $\TeX$ 中依然可以使用（$\TeX$ 是八十年代末才变成 8 位的）。而这个无论对 $\TeX$ 还是对 DVI 驱动来说都不重要，开发者一样可以省略。

刚才所说的那个 `unifs5c.tfm` 字体的 `param` 变量如下：

```clojure
(FONTDIMEN
   (SLANT R 0.0)
   (SPACE R 1.0)
   (STRETCH R 0.3)
   (SHRINK R 0.1)
   (XHEIGHT R 0.4)
   (QUAD R 1.0)
   )
```

和先前列出的 UTF-8 字体一模一样。当然有时候采用其他的中文字体产生的 TFM 会略有变化，比如我手头的 `gbksimkai44.tfm`，会有如下的设置：

```clojure
(FONTDIMEN
   (SLANT R 0.0)
   (SPACE R 0.5)
   (STRETCH R 0.0)
   (SHRINK R 0.0)
   (XHEIGHT R 0.4)
   (QUAD R 1.0)
   )
```

这些区别完全是由于中文字体的等宽属性设成是或者否而造成的，不同的中文字体，如果等宽属性设置得不一样，造成的结果就不一样。但是我前面讲过，`SPACE`、`STRETCH` 和 `SHRINK` 对于中文排版是没有影响的，因此开发者可以采用上面任何一组变量设置。

所以，这里讲述了新版本的 ttf2tfm，会产生不太一样的 `FAMILY` 和 `CODINGSCHEME`，同时还会新增 `FACE` 和 `HEADER` 等变量，但不管如何，这些变量的改变或者新增都不会影响 $\TeX$ 的编译，和 DVI 驱动的转换，开发者完全可以对这里讲述的一些改变不予理会。

## 连载六

下面就进入最为激动人心的部分了，也就是 TFM 的第二部分，和每个字符相关的参数。继续以 `unifs5c.tfm` 为例，下面出现了 256 组数据，由于太长，不在这里列出，不过这组数据的开头如下：

```clojure
(CHARACTER O 0
   (CHARWD R 1.0)
   (CHARHT R 0.82)
   (CHARDP R 0.105)
   )
(CHARACTER O 1
   (CHARWD R 1.0)
   (CHARHT R 0.824)
   (CHARDP R 0.094)
   )
(CHARACTER O 2
   (CHARWD R 1.0)
   (CHARHT R 0.82)
   (CHARDP R 0.105)
   )
```

结尾如下：

```clojure
(CHARACTER O 376
   (CHARWD R 1.0)
   (CHARHT R 0.816)
   (CHARDP R 0.084)
   )
(CHARACTER O 377
   (CHARWD R 1.0)
   (CHARHT R 0.824)
   (CHARDP R 0.102)
   )
```

仔细观察，每组数据只有两种形式：

```clojure
(CHARACTER O <num>
   (CHARWD R <num1>)
   (CHARHT R <num2>)
   (CHARDP R <num3>)
   )
```

以及

```clojure
(CHARACTER C <char>
   (CHARWD R <num1>)
   (CHARHT R <num2>)
   (CHARDP R <num3>)
   )
```

其中，`<num1>`、`<num2>`、`<num3>` 是三个浮点数，`<num>` 是一个八进位数，在 0--399 之间，而 `<char>` 是一个字符，例如 `k`、`i`、`M` 等等。

开发者并不需注意按照 TFtoPL 结果的写法来写自己的 PL 文件，因为 TFtoPL 程序产生 TFM 字体时，可以接受任何一种输入方式，比如你想用 `k`、`i`、`M` 这样的 ASCII 字母，就使用 `C` 这个前缀，如果用十进制，就采用 `D` 前缀，十六进制就用 `H` 前缀，八进制就用 `O` 前缀。详见 `pltotf.web` 中对于 `CHARACTER` 的说明。

在 PL 文件中，这张表的排列顺序是按照字符顺序来的，而在 $\TeX$ 内部的数据结构和 TFM 实际的文件中，则是按照数据本身排列的，比如从前往后依次放置所有字符的宽度信息，所有字符的高度信息等等，PL 文件只是为了让人容易看懂，对这个数组按照字符顺序重新整理了一下。

$\TeX$ 的源代码 [`tex.web` 的第 541 小节](https://github.com/TeX-Live/texlive-source/blob/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c/tex.web#L10444-L10464)中，定义了 `width[]`、`height[]`、`depth[]`、`italic[]`、`lig_kern[]`、`kern[]`、`exten[]` 这些和每个字符有关的变量，分别对应 PL 文件的 `CHARWD`、`CHARHT`、`CHARDP`、`CHARIC`、`LIGTABLE`、`KERN`、`EXTENSIBLE` 这几个变量。对于中文字体，只存在 `width`、`height` 以及 `depth` 三项，其他的几个都是给英文字体用的。每个变量望文生义，不用多解释。`EXTENSIBLE` 是包含了组成大符号（比如大括号）所需要的几个设置（`top`、`mid`、`bot`、`rep`），和中文字体无关，我也不多说明了，有兴趣的可以去看 $\TeX$ 源代码的实现。

对于中文字体，由于都是等宽的，`CHARWD` 没什么好多说，一律设置为 `1.0`。具体的代码就在 [`texk/ttf2pk/ttfaux.c` 的 591 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/ttfaux.c#L591-L592)：

```c
ti->width = transform(metrics.horiAdvance * 1000 / fnt->units_per_em,
                      0, fnt->efactor, fnt->slant);
```

而其中的 `horiAdvance` 是 TTF 字体中每个字体排版时所应该有的横向宽度。中文字体中这个宽度都是相同的（一个全方），因此写到 TFM 中的数据都是 `1.0`。

`CHARHT` 和 `CHARDP` 如果仔细观察，每个字符都不相同。这两个数值，如果追溯源 ttf2tfm 的代码，就可以发现其奥秘了。

仔细看代码，发现 `height` 和 `depth` 分别是在 [`texk/ttf2pk/tfmaux.c` 的 434 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L434)

```c
for (j = 0; height[j] != ti->ury; j++)
```

以及 [409 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/tfmaux.c#L409)

```c
depth[nd] = -ti->lly;
```

定义的。而 `lly` 和 `ury` 是在 [`texk/ttf2pk/ttfaux.c` 的 639 行](https://github.com/TeX-Live/texlive-source/blob/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk/ttfaux.c#L639-L642)定义的：

```c
ti->llx = bbox.xMin * 1000 / fnt->units_per_em;
ti->lly = bbox.yMin * 1000 / fnt->units_per_em;
ti->urx = bbox.xMax * 1000 / fnt->units_per_em;
ti->ury = bbox.yMax * 1000 / fnt->units_per_em;
```

所以，很容易可以发现这两个数值和 TrueType 字体本身提供的 bouding box 信息相关（注意，TTF 字体每个 glyph 是带有 bounding box 的，而 OTF 字体的 bounding box 是需要额外计算的。bounding box 就是框住字符的最小的矩形盒子）。

由于描绘每个中文字的曲线都不一样，每个中文字的大小也有差别，这就会造成 bounding box 的不同。写到这里，开发者们似乎会问，那这就说明我们必须根据具体的字体来定义每个字符的 `height` 和 `depth` 了，因此我们就没有办法凭空产生一个通用的 TFM 文件，所以结果就是我们前面所有的分析都是白费功夫。

先不要着急，我们仔细思考一下，字体的 `height` 和 `depth` 到底在 $\TeX$ 中有什么作用呢？仔细看 $\TeX$ 源代码就会发现，$\TeX$ 靠 TFM 的 `height` 和 `depth` 产生一个 box，然后把一个个 box 并起来组成一个水平的长行，经过断行分割后组成一个垂直的 box 来方便组页，而 `height` 和 `depth` 的实际作用就是为了检测组页的时候采用一定的行距，是不是上下两行有可能盒子之间互相重叠了。而如果重叠了，$\TeX$ 就额外分配给这行更多的垂直间距离，使得上面一行不会有字的下部分和下面一行的字的上部分重叠在一起。想通了这一点，我们就豁然开朗了：**对于中文排版，由于都是方块字，只要中文部分的行距大于字体本身的宽度，那就不可能出现英文排版中两行重叠的情况，因此我们大可以把所有的字符的 bounding box 设置成一样的即可**。

鉴于 `CHARHT` 和 `CHARDP` 的实际数值为 `0.8` 和 `0.1` 左右，因此，开发者只需要把高度设置为 `0.8`，深度设置为 `0.1`，就万事大吉。

## 连载七

TFM 的部分析完了，做个总结。由于中文开发者希望用程序能够自动产生字体的 TFM 文件，在这里给出一个模板，让开发者参考：

文件头为：

```clojure
(FAMILY <NAME><digit1><digit2>)
(CODINGSCHEME CJK-<ENC>)
(DESIGNSIZE R 10.0)
(CHECKSUM O 0)
(FONTDIMEN
   (SLANT R 0.0)
   (SPACE R 1.0)
   (STRETCH R 0.3)
   (SHRINK R 0.1)
   (XHEIGHT R 0.4)
   (QUAD R 1.0)
   )
```

其中，`<NAME>` 为字体名，比如 `gbksimhei`；`<digit1>` 和 `<digit2>` 分别为两个十六进制的数字，和文件名相同。比如你需要产生一个 `gbksimhei2e`，那 `FAMILY` 就设置成 `GBKSIMHEI2E` 即可。`<ENC>` 是使用的 sfd 文件，如果你需要使用 GBK 编码，就使用 `CJK-UGBK`，如果使用的是 Unicode 编码，那就用 `CJK-UNICODE`。

然后写下一个循环来产生 256 个这样的结构：

```clojure
(CHARACTER D <num4>
   (CHARWD R 1.0
   (CHARHT R 0.8)
   (CHARDP R 0.1)
   )
```

`<num4>` 是你的循环次数，从 0 到 255。用脚本产生所有的这样的 PL 文件，然后再将所有的 PL 文件用 PLtoTF 编译为 TFM 文件，大功就告成了。

好了，本连载 TFM 部分的讲解就到此结束了，现在起你可以写上一个脚本，轻松地产生一系列的中文字体的 PL 文件，继而用 PLtoTF 编译成 TFM 文件，而不需要任何中文字体的介入。而事实上产生 TFM 字体只是 subfonts 的开始，如果希望洞悉 VF 虚拟字体和 ENC 编码文件，以及 MAP 文件的奥秘，请继续关注本连载后续的内容。

## 回复

### 不规则字体

- #7 (by milksea)

  我有一个问题。就是事实上现在的汉字字体也不全是那么规整的。像仿宋、隶书，本来长扁不一，不过似乎字体公司参数都设得一样，所以还不会出问题。但较晚近的字体也都有比较准确的参数设定了，这种方法就可能出问题。

  举例而言，方正兰亭特黑有长扁字型，使用统一的 tfm 肯定要出问题。微软雅黑的参数设置也比较齐全，可能也会有不准。

  当然，只是对付一下 `CTeX` 宏包里面定义的常见的几个字体，这样应该就可以了。

- #11 (by yulewang)

  ttf2tfm 就可以啊。命令是 `ttf2tfm foobar.ttf foobar@Unicode@`，然后随便打开个用 tftopl 转（比如 `tftopl foobar44.tfm foobar44.pl`），然后看参数。

- #12 (by milksea)

  哦，不用 tftopl 了，ttf2tfm 中间就会输出信息了。字宽不一样，扁的是 1000（tftopl 是 1.0），长的是 750（tftopl 是 0.75）。而且高度和深度也差很远。
- #13 (by aloft)

  对于这些特殊字体确实不好用统一的 TFM

- #14 (by yulewang)

  以前不输出信息是因为你们都用 `-q` 选项……

  恩，这种情况就彻底没办法了用上面的方法了。$\TeX$ 提供在 runtime 修改字体的全局参数，但是不能修改字符内的参数。因此到时候需要用户自己产生 tfm（我们可以提供 lua 脚本）。

  不过我写这个其实也只是为了让用户直接能用系统中有的常见中文字体，加上给大家提供一些有用的信息，一般用户不会用这些稀奇古怪的字体的，呵呵。

- #15 (by milksea)

  我知道能输出。

  所以这个方法能用的主要原因是过去中文字体厂商比较土，不仔细设置参数，直到近来才悔悟过来。对付着放在 CTAN 上能运行 ctex-kit 大概是没问题了。

### 虚拟字体

- #20 (by zoho)

  经过搜索，目前知道了这些：如果有了 `gbksong04.tfm`，想要通过虚拟字体将 `gbkhei04.vpl` 映射到 `gbksong04.tfm`，是不是就这么写 vpl 文件：

  ```clojure
  (FAMILY gbkhei04)
  (CODINGSCHEME CJK-UGBK)
  (DESIGNSIZE R 10.0)
  (CHECKSUM O 0)
  (FONTDIMEN
      (SLANT R 0.0)
      (SPACE R 1.0)
      (STRETCH R 0.3)
      (SHRINK R 0.1)
      (XHEIGHT R 0.4)
      (QUAD R 1.0)
      )
  (MAPFONT D 0
    (FONTNAME gbksong04)
    (FONTDSIZE R 10.0)
    )
  (CHARACTER D 0
      (CHARWD R 1.0)
      (CHARHT R 0.8)
      (CHARDP R 0.1)
      (MAP
          (SELECTFONT D 0)
          (SETCHAR D 0)))
      )
  ......
  (CHARACTER D 255
      (CHARWD R 1.0)
      (CHARHT R 0.8)
      (CHARDP R 0.1)
      (MAP
          (SELECTFONT D 0)
          (SETCHAR D 0)))
      )
  ```

  然后运行 `vptovf gbkhei04.vpl` 得到 `gbkhei04.tfm` 和 `gbkhei04.vf`。

  但是这样弄不是比直接弄 tfm 还麻烦么？为何一定要用虚拟字体呢？

- #23 (by yulewang)

  你好，虚拟字体机制是为了解决当时字体占用磁盘的问题而给出的。

  在古代，很多引擎没有办法使用 TTF 字体，因此我们其实给出了字体转换后的 Type1 格式的 subfonts，结果我们因为编码不同则需要提供很多套相同字体不同编码的 subfonts，非常占用磁盘空间。而使用 subfonts 可以把 GBK 编码的TFM 给 map 到 UTF8 的 TFM 上转而使用 UTF8 字体的 Type1 格式的 subfonts，因此达到节省一半磁盘空间的不可告人的目的。

- #25 (by zoho)

  看来前面我对虚拟字体的理解是错误的。但是现在几个中文字体的 tfm 信息是一样的，不能通过 vf 也共用 tfm 文件么？

- #30 (by milksea)

  很赞。不过没想到生成这个东西还是挺慢的。

  ——不过不是说只生成一套 tfm（或是一个编码一套），然后不同字体都映到相同的 tfm 上比较好么？

- #31 (by aloft)

  可以这样做吗？好像每个字体都要有自己的 tfm，即使用了虚拟字体技术。

- #32 (by yulewang)

  milksea 的说法忽略了一个事实，那就是 virtual font 和 $\TeX$ 没有丝毫的关系。Virtual font 是给 driver 用的，$\TeX$ 自身不支持，去 `tex.web` 看一看就会发现三万行代码没有一行提到 vf。事实上 $\TeX$ 自己只认识 tfm。因此即使搞 vf，也需要两套 tfm，$\TeX$ 才能用.

  而个人不推荐这样的做法，不带来好处，反而容易引起问题。例如 vf 字体的复制粘贴问题到现在也没有宏包有好的解决方案（理论上可以做，实际上没人做）。

### 斜体与 TTC

- #19 - 写了个 dos 脚本生成 gbksong 的 tfm (by zoho)

  按照 yulewang 的指南，写了个 dos 脚本，生成了 `gbksong` 的 tfm 文件，替换 $\>CTeX$ 2.7 中的 tfm 文件，然后编译一个简单例子：

  ```tex
  % !TEX encoding = System

  \documentclass{article}
  \usepackage{CJK}

  \begin{document}
  \begin{CJK}{GBK}{song}

  这是自制 tfm 里的宋体！

  \end{CJK}
  \end{document}
  ```

  完全成功，太好了。dos 脚本和 pl 及 tfm 文件见附件。

  现在还缺少倾斜的 tfm 文件和 enc 文件（map 文件似乎不需要了）。

- #22 (by yulewang)

  感谢您的测试（我电脑上没有 $\TeX$，自己写这篇文章还问别人拷了个 tftopl 用，字体还是 milksea 发给我的，代码什么都上 TUG 的 svn 上看，其实写这篇文章自己都没自己测试过……），看来您的测试证实了我文中的观点，谢谢。

  不要制作斜体字体，我们希望改掉用户用斜体的坏习惯。（其实制作起来也容易，但我有意不介绍斜体字体的 tfm 结构）。

- #26 (by zoho)

  我的好奇心驱使我打开一个斜体的 tfm 文件看了看，发现与正体的区别在于如下一行

  ```clojure
  (SLANT R 0.167)
  ```

  呵呵，确实也不复杂。map 文件里的 `.167` 原来是从这里抄来的啊。

- #27 (by aloft)

  呵呵，倒了，这里的 `167` 是 ttf2tfm 时指定的。

- #33 (by milksea)

  好吧呀，那现在这个就蛮好了。只要再添几行 map 就完了。

  另：donated，那个 $\>pdfTeX$ 的 map 使用单行 TTC 字体，怎么写？如何支持斜体？

- #34 (by aloft)

  ```
  gbksong@UGBK@   <simsun.ttf  PidEid=3,1
  unisong@Unicode@   <simsun.ttf  PidEid=3,1
  ```

  不支持斜体

- #37 (by instanton)

  不支持斜体的话，现在 ctex 的那些 fd 文件好像有问题。

- #38 (by yulewang)

  不会。写 `gbksongsl@UGBK@   <simsun.ttf  PidEid=3,1` 之类的就好。

  另外我不太建议弄斜体，这个很 dirty 的。

- #39 (by milksea)

  TTC 呢？

- #40 (by yulewang)

  ttc 更名为 ttf 可以直接用。但最好让 hth[^hth] 改一下，把 ttc 直接当作 ttf 处理。

- #4 (by yulewang)

  已发邮件建议 hth 修改 $\>pdfTeX$。

[^hth]: 即 [Hàn Thế Thành](https://de.wikipedia.org/wiki/H%C3%A0n_Th%E1%BA%BF_Th%C3%A0nh)，$\>pdfTeX$ 作者。

### Typo

- #18 (by zoho)

  > 其中，`<NAME>` 为字体名，比如 `gbksimhei`；`<digit1>` 和 `<digit2>` 分别为两个十六进制的数字，和文件名相同。比如你需要产生一个 `gbksimhei2e`，那 `FAMILY` 就设置成 `GBKSIMHEI2E` 即可。`<ENC>` 是使用的 sfd 文件，如果你需要使用 GBK 编码，就使用 `CJK-UGBK`，如果使用的是 Unicode 编码，那就用 `CJK-UNICODE`。
  >
  > 然后写下一个循环来产生 256 个这样的结构：

  我有个疑问，我看了 $\>CTeX$ 2.7 里面的 `gbksong` 目录，发现文件名是从 `gbksong00.tfm` 到 `gbksong94.tfm`，而且看来文件名的后两位不是十六进制而是十进制，因为没有看到任何一个 `a`--`f` 的字母。

  更新：发现你前面已经说了 GBK 编码确实是从 `00`--`94` 的十进制，看来是你后面不小心写错了。

- #21 (by yulewang)

  您说的没错，那天熬夜写完的。写到后面自己稀里糊涂了。

## 注释

<div id="footnotes">
  <ol>
    <li id="fn:tl-source">原文章写于 2006 年，在这之后本文所引述的一些代码均有所修改，主要有：
      <ul>
        <li markdown="1">ttf2pk 基于 FreeType2 重构，因此文件路径更改为 `texk/ttf2pk2`</li>
        <li>2014 年 Knuth 对 $\TeX$、TFtoPL 等进行了一些修订</li>
      </ul>
      文中列出的代码片段，ttf2pk 相关部分来自<a href="https://github.com/TeX-Live/texlive-source/tree/5ead665c0ceef937dc9aa7d52c39745de244597c/texk/ttf2pk">提交 5ead665c0c</a>（重构之前），而 web2c 部分来自<a href="https://github.com/TeX-Live/texlive-source/tree/e0e5ba1ea9868ab6d3da91d2a5de26a5bbce9f63/texk/web2c">提交 e0e5ba1ea9</a>（Knuth 修订后，所列代码实际没有改动）。
    </li>
  </ol>
</div>
