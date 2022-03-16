---
title: LaTeX3 教程（三）——从一个例子说起
date: 2019-11-20
last_modified_at: 2021-09-04
categories: LaTeX3
excerpt: 学习一门编程语言，如果只了解语法，必然十分枯燥而且并没有什么用。所以，我们准备从一个基本的例子讲起，尽可能地覆盖 $\LaTeX3$ 的重要知识。
---

前文链接：

- [$\LaTeX3$ 教程（一）——背景知识](./2019-02-24-l3tutorial-background)
- [$\LaTeX3$ 教程（二）——语法概要](./2019-02-26-l3tutorial-syntax)

## 确定目标

学习一门编程语言，如果只了解语法，必然十分枯燥而且并没有什么用。所以，我们准备从一个基本的例子讲起，尽可能地覆盖 $\LaTeX3$ 的重要知识。

这里的例子，是一个中文测试文字（乱数假文）宏包。假文的目的是生成大段没有实际含义的文字，常用来测试排版效果。对于西文，$\TeX$ 发行版中已经自带了几个宏包，包括 `lipsum`、`kantlipsum` 和 `blindtext` 等；而对于中文，则由我本人编写了 `zhlipsum`。我们的目标，就是在这几篇教程中，让大家完成一个类似 `zhlipsum` 的宏包。看过刘海洋《$\LaTeX$ 入门》一书的读者就会发现，这实际上正是书中的练习 8.6。

要编写中文测试文字宏包，首先要做一下整体规划与设计：

- 最简单的实现，只要定义一些含有大量文字的命令，并且能使用户方便使用。
- 接下来，为了能够改变假文片段的长度，我们就需要用到计数、循环等功能，同时还会引入一些基本的数据结构。
- 之后，因为面向的是中文测试，我们的宏包还要能够支持多种字符集和编码，这需要通过类别码机制来处理。
- 最后，作为一个完整的宏包，还需有一套良好的接口和完善的错误提示，以方便用户使用。

当然，如果可能，我们还会考虑介绍一些高级功能，比如：

- 利用伪随机数生成真正的「乱数」假文。
- 通过 `DocStrip` 和 `doc` 宏包进行文学编程。
- 构建覆盖面足够的测试，完成宏包发布。

## 准备

### 开发环境配置

考虑到 $\LaTeX3$ 仍处于活跃开发状态，建议使用最新的 $\TeX$ 发行版。另一方面，开发 $\LaTeX$ 宏包与日常写作文档稍有区别，很多时候我们需要通过命令行输出进行调试，而不仅仅是编译 $\TeX$ 文档以生成 PDF。所以，建议使用命令行直接编译。为使用 $\TeX$ 写作开发的编辑器，如 WinEdt、TeXstudio 等，反而可能不太适用于此。我们的项目会涉及到汉字处理，因此要保证编辑器对多种编码均有良好支持。

我本人使用的是 [TeX Live 2019](https://www.tug.org/texlive/) + [Visual Studio Code](https://code.visualstudio.com)。

此外，如果要开始一个正式的项目 / 工程，强烈建议建立一个 Git 仓库来管理。具体做法可参阅[廖雪峰的 Git 教程](https://www.liaoxuefeng.com/wiki/896043488029600)。

### 目录结构

我们打算把这个宏包取名为 `zhdummy`。名字当然可以任意取，但确定之前请务必在网上检索一下是否有冲突。在 $\TeX$ 发行版中，不可以出现名字相同的文件；类似的，宏包名也不可以有重复。

$\LaTeX$ 宏包的后缀名是 `.sty`，因此文件名即为 `zhdummy.sty`。宏包本身一般不能直接编译。因此，为了检查其正确性，还需要加入一些测试文件。我们暂时仅使用一个简单的 `test.tex`。这两个文件目前需要放在同一目录（不妨设为 `zhdummy`）下：

```
zhdummy/
  ├─zhdummy.sty
  └─test.tex
```

下面我们开始编写宏包：

```tex
% zhdummy.sty
\NeedsTeXFormat{LaTeX2e}
\RequirePackage{expl3}
\ProvidesExplPackage{zhdummy}{2019/11/20}{0.1}{Chinese dummy text (demo)}

\def\mypkgname{zhdummy}
```

`\NeedsTeXFormat{LaTeX2e}` 表明宏包要求 $\>LaTeXe$ 格式，而不接受 plain $\TeX$ 和 $\>ConTeXt$ 格式。其后的语句之前都介绍过，此处不再赘述。

测试文件则可以这样写：

```tex
% test.tex
\documentclass{ctexart}
\usepackage{zhdummy}

\begin{document}
你好，\mypkgname{}！
\end{document}
```

使用 $\>XeLaTeX$ 编译（以后没有特殊说明，我们将总是使用 $\>XeLaTeX$）`test.tex`，结果应如下所示：

> 你好，zhdummy！

此外，在日志文件 `test.log` 中，应当能找到以下信息：

```tex
(./zhdummy.sty
Package: zhdummy 2019/11/20 v0.1 Chinese dummy text (demo)
)
```

这里 `./zhdummy.sty` 表示读入当前目录（即 `./`）中的 `zhdummy.sty` 文件，外面的括号会把读取过程中产生的所有信息（比如这里的宏包版本）包装起来。如果读入的文件又调用了新的文件，则会层层嵌套。我们的宏包虽然也调用了 `expl3.sty`，但之前的 `ctexart` 文档类实际上已进行了一次调用，因而宏包中的 `\RequirePackage{expl3}` 就被忽略了。这与 C/C++ 语言的头文件调用非常相似。

经过一次编译，现在的目录结构将变为这样：

```
zhdummy/
  ├─zhdummy.sty    宏包
  ├─test.tex       测试文件
  ├─test.aux       编译辅助文件
  ├─test.log       编译日志
  └─test.pdf       生成的 PDF
```

至此，我们就已经写好了一个最简单的宏包。当然，它除了打印自己的名字以外，什么功能都没有。

## 加入假文

我们的宏包现在其实只有一行是有实际作用的：

```tex
\def\mypkgname{zhdummy}
```

它定义了一个名为 `\mypkgname` 的宏，并且可以展开为 `zhdummy`。实际上，所谓「假文」也无非是这样一些可展开为文本的宏，只不过文本要更长一点。

在 $\LaTeX3$ 中，常规文本很适合用一种称为**记号列表**的类型（token lists）存储。相关函数的前缀是 `tl`。

记号列表，顾名思义由一系列的**记号**（token，也称为字元）组成。而记号，要么是指一个附带有类别码的字符（character），要么是一个控制序列。比如，在标准情况下，`{\hskip 36 pt}` 就是下面的一组记号（下标表示类别码，`␣` 表示空格，注意 `\hskip` 后的空格是被忽略掉的）：

<p markdown="1" style="text-align: center">
  `{`<sub>1</sub>
  `\hskip`<sub>控制序列</sub>
  `3`<sub>12</sub>
  `6`<sub>12</sub>
  `␣`<sub>10</sub>
  `p`<sub>11</sub>
  `t`<sub>11</sub>
  `}`<sub>2</sub>
</p>

不过，就目前来说，我们可以先忽略这些技术细节。毕竟假文中几乎只含有汉字、标点和一些字母、数字，它们都是比较「正常」的东西，不需要特殊处理。

利用记号列表，我们可以把之前的宏定义改写为如下形式：

```tex
\tl_const:Nn \c_zhdummy_text_i { 天地玄黄，宇宙洪荒。 }
```

`\tl_const:Nn` 表示创建一个 `tl` 常量，并用第二个参数作为其内容。这里还有几点需要注意：

1. 常量以 `c` 开头
2. 我们把模块名起做 `zhdummy`，通常它应该与宏包名称一致
3. 暂时把这一常量设置为公有（以 `c_` 而非 `c__` 开头）
4. 空格在 LaTeX3 语法中是被忽略掉的
5. 这里用[《千字文》](https://zh.wikisource.org/zh/千字文)仅仅是做一个示范，实际使用的假文会长很多

类似地，我们可以加入更多的假文：

```tex
\tl_const:Nn \c_zhdummy_text_i     { 天地玄黄，宇宙洪荒。 }
\tl_const:Nn \c_zhdummy_text_ii    { 日月盈昃，辰宿列张。 }
\tl_const:Nn \c_zhdummy_text_iii   { 寒来暑往，秋收冬藏。 }
\tl_const:Nn \c_zhdummy_text_iv    { 闰馀成岁，律吕调阳。 }
\tl_const:Nn \c_zhdummy_text_v     { 云腾致雨，露结为霜。 }
\tl_const:Nn \c_zhdummy_text_vi    { 金生丽水，玉出昆冈。 }
\tl_const:Nn \c_zhdummy_text_vii   { 剑号巨阙，珠称夜光。 }
\tl_const:Nn \c_zhdummy_text_viii  { 果珍李柰，菜重芥姜。 }
\tl_const:Nn \c_zhdummy_text_ix    { 海咸河淡，鳞潜羽翔。 }
\tl_const:Nn \c_zhdummy_text_x     { 龙师火帝，鸟官人皇。 }
\tl_const:Nn \c_zhdummy_text_xi    { 始制文字，乃服衣裳。 }
\tl_const:Nn \c_zhdummy_text_xii   { 推位让国，有虞陶唐。 }
\tl_const:Nn \c_zhdummy_text_xiii  { 吊民伐罪，周发殷汤。 }
\tl_const:Nn \c_zhdummy_text_xiv   { 坐朝问道，垂拱平章。 }
\tl_const:Nn \c_zhdummy_text_xv    { 爱育黎首，臣伏戎羌。 }
\tl_const:Nn \c_zhdummy_text_xvi   { 遐迩壹体，率宾归王。 }
\tl_const:Nn \c_zhdummy_text_xvii  { 鸣凤在树，白驹食场。 }
\tl_const:Nn \c_zhdummy_text_xviii { 化被草木，赖及万方。 }
```

使用时，可以直接使用，也可以采用 `\tl_use:N` 命令：

```tex
% test.tex
\documentclass{ctexart}
\usepackage{zhdummy}

\begin{document}
\ExplSyntaxOn
\c_zhdummy_text_i
\tl_use:N \c_zhdummy_text_ii
\ExplSyntaxOff
\end{document}
```

> 天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。

这样的定义方式显然过于冗长和低效。然而，更严重的问题还在于，这样定义的 `tl` 变量只能用在 $\LaTeX3$ 环境中，直接使用会导致错误：

```tex
% test.tex
\documentclass{ctexart}
\usepackage{zhdummy}

\begin{document}
\tl_use:N \c_zhdummy_text_i
\end{document}
```

编译后得到（中断时可按 return 键继续）

```
! Undefined control sequence.
l.6 \tl
  _use:N \c_zhdummy_text_i
?
! Missing $ inserted.
<inserted text>
              $
l.6 \tl_
      use:N \c_zhdummy_text_i
?

LaTeX Warning: Command \c invalid in math mode on input line 6.

! Missing $ inserted.
<inserted text>
              $
l.7 \end{document}
?
```

`_` 在常规的类别码设置下代表下标，必须用在数学环境中，所以用 `_` 和 `:` 所定义的命令不能被 $\LaTeX$ 接受。这会给用户造成了极大的麻烦，显然有悖于我们编写宏包的初衷。因此，接下来我们要创建一些**用户层**（或**文档层**）命令，以区分于**编程层**。

## 用户接口

我们分析一下上面定义的假文命令，可以发现它们都有一些共同点：

- 前面都是统一的 `\c_zhdummy_text_`
- 后面则是小写罗马数字，如 `i`、`ii`

由此，可以让用户输入所需要的段落号，据此选择需要的假文。当然，大多数情况下用户所需要的很可能只是一个简单的命令。这可以通过默认参数来实现。

我们把 `\zhdummy` 作为用户层命令。规定它的用法如下：

```tex
\zhdummy
\zhdummy[<序号>]
```

不带参数时，输出前四段假文；带参数时，输出指定 `<序号>` 的假文，其中 `<序号>` 以阿拉伯数字表示。

实现这一用户层命令，需要解决以下问题：

- 阿拉伯数字转换为（小写）罗马数字
- 拼合命令（控制序列）
- 以较为可靠方式定义用户层命令

从头开始做这些工作并不容易。所幸，$\LaTeX3$ 给我们提供了比较良好而易用的框架。以下我们将依次进行介绍。

### 数字转换

`expl3` 所提供的转换函数是 `\int_to_roman:n`。顾名思义，这个函数接受一个整型参数，再把它转换为小写的罗马数字。另有 `\int_to_Roman:n`，很容易就可以猜出它的意思。

我们可以做一些实验（`~` 在 $\LaTeX3$ 中表示空格）：

```tex
\int_to_roman:n { 1 } ~
\int_to_roman:n { 5 } ~
\int_to_roman:n { 4999 } ~
\int_to_Roman:n { 1 } ~
\int_to_Roman:n { 5 } ~
\int_to_Roman:n { 4999 }
```

结果应当为：

> i v mmmmcmxcix I V MMMMCMXCIX

### 拼合命令

类似于 C 语言的 [`##` 宏](https://en.cppreference.com/w/c/preprocessor/replace)、Python 中的 [`eval`](https://docs.python.org/3/library/functions.html#eval) 和 Mathematica 中的 [`Symbol`](https://reference.wolfram.com/language/ref/Symbol.html)，`expl3` 也提供了将「字符串」转换为命令的手段。

为此，我们先回顾一下之前所讲过的**参数指定**。它位于一个函数的 `:` 后面，描述了该函数的参数结构。基本的参数指定包括 `n`、`N`、`p` 等。例如 `\tl_use:N`，就表示接受一个 token（如一个控制序列）作为参数。

现在介绍一种新的参数指定 `c`，它表示将参数处理为一个控制序列的名称。例如，以下几种写法是等价的：

```tex
\tl_use:N \c_zhdummy_text_i
\tl_use:c { c_zhdummy_text_i }
\tl_use:c { c _ zhdummy _ text _ i }  % 注意空格是忽略掉的
```

### `xparse` 宏包简介

正所谓「临门一脚」，我们上面的所有工作最终都要面向用户。$\LaTeX3$ 提供的方案是 `xparse` 宏包，它可以很方便地声明用户层（文档层）命令。

在代码底层，程序员应当控制合适的粒度，使得绝大多数函数都只完成单一的工作。因而，底层函数的参数应当是确定的。但在用户层，需求可以千变万化，但接口应当尽可能保持统一，这就要求参数形式具有一定的多样性。这与 C++ 中依靠[函数重载](https://en.cppreference.com/w/cpp/language/overload_resolution)实现的所谓 [*ad hoc* 多态](https://en.wikipedia.org/wiki/Ad_hoc_polymorphism)有异曲同工之处。

`xparse` 宏包提供了 `\NewDocumentCommand` 函数，其语法如下：

```
\NewDocumentCommand <func> {<arg-spec>} {<code>}
```

- `<func>` 即为我们最终提供给用户的命令，一般来说它应只包含字母，而不含 `_`、`:`、`@` 等特殊符号
- `<arg-spec>` 是参数指定（注意与之前 $\LaTeX3$ 函数的参数指定相区分），可以是：
  - `m`：表示标准必选（**m**andatory）参数，可以是单个 token，或者花括号 `{...}` 包围的一组 tokens
  - `o`：表示标准可选（**o**ptional）参数，需用方括号 `[...]` 包围；若未给出，则返回一个特殊的 `-NoValue-` 标记
  - `O{<default>}`：同样为可选参数，但在未给出时则返回默认值 `<default>`
  - 其他更为复杂的参数指定，以及一些特殊情况，我们将在之后进行介绍
  - 示例如下：

    | 参数指定       | 输入值       | `#1`        | `#2`        | `#3`  |
    |:--------------:|:------------:|:-----------:|:-----------:|:-----:|
    | `m m`          | `{foo}{bar}` | `foo`       | `bar`       |       |
    | `o m`          | `{foo}`      | `-NoValue-` | `foo`       |       |
    | `o o m`        | `[foo]{bar}` | `foo`       | `-NoValue-` | `bar` |
    | `m O{default}` | `{foo}`      | `foo`       | `default`   |       |
    | `m O{default}` | `{foo}[bar]` | `foo`       | `bar`       |       |
    | `m O{default}` | `[bar]`      | 报错        |             |       |

- `<code>` 为具体的实现代码，可以使用 `#1`、`#2` 这样的参数，这和传统 $\TeX$ 编程是一致的
- 除此之外，`xparse` 还提供了几个函数，它们的用法和 `\NewDocumentCommand` 相同，但含义稍有区别：

  | 函数                      | `<func>` 已定义 | `<func>` 未定义 |
  |:-------------------------:|:---------------:|:---------------:|
  | `\NewDocumentCommand`     | 报错            | 给出定义        |
  | `\RenewDocumentCommand`   | 重新定义        | 报错            |
  | `\ProvideDocumentCommand` | 什么也不做      | 给出定义        |
  | `\DeclareDocumentCommand` | 重新定义        | 给出定义        |

上面我们提到，输入为空时，`o` 型参数会返回一个特殊的 `-NoValue-` 标记。这一标记不是简单的 token list，它必须通过 `\IfNoValue(TF)` 函数进行判断：

```tex
\IfNoValueTF {<arg>} {<true code>} {<false code>}
\IfNoValueT  {<arg>} {<true code>}
\IfNoValueF  {<arg>} {<false code>}
```

根据参数 `<arg>` 是否为 `-NoValue-`，`\IfNoValue(TF)` 会决定执行 `<true code>` 还是 `<false code>`。

### 代码实现

最后，我们把以上分析综合起来，可以写出如下的代码：

```tex
% 定义命令 `\zhdummy`，允许带一个可选参数
\NewDocumentCommand \zhdummy { o }
  {
    % 根据参数 `#1` 是否为 `-NoValue-` 分别进行处理
    \IfNoValueTF {#1}
      {
        % `#1` = `-NoValue-`，即不带参数
        % 直接使用假文命令
        \tl_use:N \c_zhdummy_text_i
        \tl_use:N \c_zhdummy_text_ii
        \tl_use:N \c_zhdummy_text_iii
        \tl_use:N \c_zhdummy_text_iv
        \tl_use:N \c_zhdummy_text_v
      }
      {
        % `#1` ≠ `-NoValue-`，即带有可选参数
        % 把 `#1` 转换为小写罗马数字，再拼合成假文命令
        \tl_use:c { c_zhdummy_text_ \int_to_roman:n {#1} }
      }
  }
```

此时，在 `test.tex` 中即可按照比较常规的方式来使用假文了：

```tex
% test.tex
\documentclass{ctexart}
\usepackage{zhdummy}

\begin{document}
\zhdummy

\zhdummy[1]
\zhdummy[2]
\zhdummy[18]
\end{document}
```

编译后得到

> 天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。寒来暑往，秋收冬藏。闰馀成岁，律吕调阳。云腾致雨，露结为霜。
>
> 天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。化被草木，赖及万方。

## 参考

- [zhlipsum: 中文乱数假文(Lorem ipsum)](https://mirrors.ctan.org/macros/latex/contrib/zhlipsum/zhlipsum.pdf) - `texdoc zhlipsum.pdf`
- [The $\LaTeX3$ Interfaces](https://mirrors.ctan.org/macros/latex/contrib/l3kernel/interface3.pdf) - `texdoc interface3`
  - Part VI - The `l3tl` package: Token lists
  - Part XI - The `l3int` package: Integers
- [The `xparse` package: Document command parser](https://mirrors.ctan.org/macros/latex/contrib/l3packages/xparse.pdf) - `texdoc xparse`
