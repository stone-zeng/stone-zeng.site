---
layout: post
title: LaTeX3 教程（一）——背景知识
date: 2019-02-24
last_modified_at: 2019-02-26
categories: LaTeX3
---

LaTeX3 教程这个系列的文章其实早已动笔（开始于 2017 年），但一直只挖坑而不填土。作为初学者，错误在所难免，恳请各位不吝赐教。

## 历史回顾

众所周知，[Donald E. Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) 在排版他的传世巨著 *The Art of Computer Programming* 时，[忍受不了当时的数字排版技术](https://tex.stackexchange.com/q/367058/)，于是一咬牙，花了近十年开发出了伟大的排版软件 TeX。

然而这个 TeX 本身是为 Knuth 自己服务的，普通人用起来会比较吃力。上世纪 80 年代，同样身为计算机科学家的 [Leslie Lamport](https://en.wikipedia.org/wiki/Leslie_Lamport) 教授开发出了 LaTeX（**La**mport **TeX**），隐藏了一些排版细节，成为了一套结构化的文档语言。Lamport 也是在准备他的著作 *The Great American Concurrency Book* 时发明了 LaTeX；可等有了 LaTeX，这本书却懒得动笔了<span class='zh-punct'>……</span><span id="fnref-lamport-book" class="footnote">[[1]](#fn-lamport-book)</span>

1992 年，LaTeX 2.09 发布，之后 Lamport 便退居二线，开发工作交给由 Frank Mittelbach 领导的 [LaTeX3 团队](https://www.latex-project.org/about/team/)负责。顾名思义，这个团队就是要代表 LaTeX 行业的发展要求，代表 LaTeX 界最新技术的前进方向，代表 LaTeX 最广大用户的根本利益。于是他们埋头苦干了两年，搞了个大新闻——推出了 LaTeX2*ε*。

「LaTeX2*ε*」这个名字，一看就知道来源于微积分里面的 [*ε*-*δ* 语言](https://en.wikipedia.org/wiki/(%CE%B5,_%CE%B4)-definition_of_limit)。「2*ε*」比 2 大，但是作为一个无穷小量，离 3 却还有着十万八千里。因此过了二十多年，LaTeX3 的正式发布依然还是遥遥无期。

## LaTeX2*ε* 的不足

言归正传，我们现在要来聊一聊 LaTeX2*ε* 到底有什么不足，以至于非得另起炉灶，建立一个全新的版本。

### 用户层次

要完成高质量的排版，就需要对格式进行精确地控制。然而，很多时候格式控制却没有提供简单易用的接口，往往需要手动修改内部定义。比如要使脚注中的编号行内居中，就需要这么做<span id="fnref-footnote" class="footnote">[[2]](#fn-footnote)</span>：

```latex
{% raw %}\makeatletter
\renewcommand\@makefntext[1]{%
  \hspace*{-2em}%
  \parindent 0em%
  \noindent
  \hb@xt@ 1.8em{\hss
    \@thefnmark. }%
  #1}
\makeatother{% endraw %}
```

一个简单的例子尚且如此，稍微复杂一些的就需要使用各种补丁、钩子，以及种种肮脏技巧，显得十分不优雅。

另外的办法就是借用别人造好的轮子，调用各种各样的宏包。后果便是，一旦文章写长了，导言区就会成为宏包集锦，一堆 `\usepackage`，外加各种奇技淫巧般的设置。

当然，针对这个问题，解决方案似乎已经有现成的。比如 [`KOMA-Script`](https://ctan.org/pkg/koma-script) 或者 [`memoir`](https://ctan.org/pkg/memoir) 文档类（国内用的人不是很多），它们大致把一些常用功能集中在了一起，用户接口也比较统一。

### 编程层次

另一方面，LaTeX2*ε* 缺乏良好的编程界面，简单的流程控制语句也相当繁琐和低效。更不用提丧心病狂的宏展开<span id="fnref-expandafter" class="footnote">[[3]](#fn-expandafter)</span>：

```latex
{% raw %}\def\CTEX@replacecommand#1#2#3{%
  \expandafter\expandafter\expandafter\let\expandafter
    \csname #1#3\expandafter\endcsname
    \csname #2#3\endcsname
  \expandafter\expandafter\expandafter\def\expandafter
    \csname #2#3\expandafter\endcsname
    {\csname #1#3\endcsname}}{% endraw %}
```

而且，很多时候 LaTeX2*ε* 中的编程是 TeX、带注释的 LaTeX、不带注释的 LaTeX 的混合，还会从奇奇怪怪的宏包里面弄来奇奇怪怪的东西。命名也常常随意且风骚，最后的结果就是可读性与可维护性很差，搞不好还会遇到各种冲突。

### 内容 vs 格式

更加重大的问题还在于，LaTeX2*ε* 并没有很好地实现**内容与格式分离**的原则。

刚才提到，Knuth 十年磨一剑最终推出的 TeX，尽管号称「排版神器」，但作者对字体、字号、对齐，甚至断行分页算法等方方面面都要了解，也只有神人才能驾驭得了。而之后，Lamport 不仅考虑了天才的个人奋斗，而且兼顾了凡人的历史进程。他的 LaTeX 把众多排版细节用「傻瓜式」的命令封装起来，因而一经推出便风靡全球。

所谓「内容与格式分离」，在 LaTeX 的语境中，就是尽量使用带有语义的命令来进行标记，而不是直接规定文本的样式。比如：

- 通过指明 `\documentclass` 是 `article`、`report` 或 `book`，即表明这是篇幅较短的文章、篇幅中等的报告，或篇幅较长的书籍。LaTeX 会据此定义不同的样式（包括章节标题、页眉页脚等），而无需作者操心。
- 用 `\emph` 而非 `\textit` 表示强调，这是因为 `\emph` 就是强调的意思（emphasize），而 `\textit` 则只是一种格式声明，尽管标准文档类中二者效果基本一致（嵌套的话会有差别）。
- 用 `\thanks` 而非 `\footnote` 给出作者的额外信息（常用在 `\author` 中），它会用特殊符号进行标记，以区分于一般的脚注。

这样的好处，一方面使得文章结构明确，条理清晰；另一方面，一旦有修改格式的需求，操作起来也会比较轻松。

然而事情并不总是那么完美的。LaTeX 的内核很小（`latex.ltx` 约 8500 行，`article.cls` 约 600 行，`size10.clo` 约 200 行），要么缺乏相关功能的支持，要么就是格式写死了没法改。总之，除非完全按照八股文的方式，只要你稍微想做一些格式上的更改，就只有 Google 半天再自己写上一长串啰里啰嗦、不知所云的代码。

时代总是在发展的，[Till Tantau](https://fr.wikipedia.org/wiki/Till_Tantau) 教授在准备他的博士论文答辩时，编写了 [`beamer`](https://ctan.org/pkg/beamer) 文档类，用以构建幻灯片（为此，他还编写了绘图包 [`PGF/TikZ`](https://ctan.org/pkg/pgf)，简直令人叹为观止）。就架构而言，`beamer` 的设计是高度创造性的。它划分了 3 个层次：

- 幻灯片作者只需要了解 `frame`、`theorem`、`emph` 这些与演示相关的命令或环境，只需选择相应的主题（theme），就可以完成制作；
- 模板 / 主题设计师，可以用 `\setbeamertemplate`、 `\setbeamercolor`、 `\setbeamerfont` 等命令来设置各成分的格式，但却无需考虑演示文稿的具体内容；
- 高级设计师（或者 TeX 程序员），对于每种语义成分，又可以独立调控，直接操纵具体实现细节。

这种层次化的界面，自然就把用户分成了三类，于是内容编写、格式设计与具体实现就可以彻底分离。

如果熟悉前端技术，会发现这是极其相似的：

- HTML 负责描述网页内容、标记语义元素；
- CSS 定义样式，规定相应的 HTML 元素应如何显示；
- 浏览器端负责网页的最终渲染，即呈现样式。

从某种程度上说，前端技术的爆炸式发展给了 LaTeX3 相当多的经验。在未来，我们完全有理由相信，HTML/CSS 技术和 TeX 技术可以互相兼容。

## LaTeX3 与 `expl3`

总而言之，LaTeX2*ε* 尽管是目前最流行的 TeX 格式，却也有着相当大的局限性，而且这种局限性不是小修小补能够解决的，必须另起炉灶，重新搭建一套新的格式——LaTeX3。

所谓**格式**，就是对 TeX 提供的原语（primitive）进行封装，以方便使用。常见的有 plain TeX、LaTeX 以及 ConTeXt。LaTeX3 就是下一代 LaTeX 格式。当然，鉴于 LaTeX2*ε* 无可撼动的地位，这套格式也不会被放弃，LaTeX3 格式只会作为额外的选择。至于 LaTeX3 什么时候可以真的被做成一个完整的格式文件（`.fmt`），目前仍是一个未知数。

目前，LaTeX3 的主要开发工作集中在 `expl3` 宏包中。`expl3` 提供了丰富的编程接口，我们之后所要介绍的内容，都是围绕这个宏包进行的。`expl3` 不仅可以运行在 LaTeX 中，也可以在 plain TeX 和 ConTeXt 中使用。

`expl3` 是 1992 年推出的，至今已经十多年了。目前，有不少宏包已经开始 `expl3`，也就是使用 LaTeX3 语法了。比如：

- [ctex-kit](https://github.com/CTeX-org/ctex-kit) 中的 `CTeX`、`xeCJK`、`xpinyin`、`zhnumber` 等，当前主要由李清、刘海洋和黄晨成等人开发、维护；
- LaTeX3 团队成员 Will Robertson 维护的 `fontspec`、`unicode-math`，以及 Joseph Wright 维护的 `siunitx`；
- 本人所编写的 `fduthesis` 和 `zhlipsum`。

所有已注册的 LaTeX3 宏包（其实是模块名）及其有关信息可以在 [`l3prefixes`](https://github.com/latex3/latex3/blob/master/l3kernel/l3prefixes.csv) 中找到。

## 个人想法

以下纯属个人观点，不保证其准确、客观。

- 作为**标记语言**，LaTeX 火候刚好：HTML 略显冗余并不适合直接拿来写文章（尽管有 Emmet），Markdown 简洁清楚但标记元素过于贫乏。相比之下，LaTeX 的标记则灵活的多，要长则长，要短则短。
- 作为**编程语言**，(La)TeX 实际上非常繁琐，提供可靠、便捷的核心语法及标准库，大概才是 LaTeX3 当下的主要攻坚目标。
- 其实 LaTeX 相当于 HTML+CSS+JavaScript，既要负责标记，又要管理样式，还要能自由、灵活地实现各种奇幻需求。这种灵活性固然使得「内容与格式分离」的原则得不到彻底贯彻，但试想，所有的格式修改，哪怕只出现一次，也要额外做一个语义标记，又是否确有必要呢？毕竟，排版的 edge cases 实在太多了。
- 众所周知，LaTeX 的流行主要是由于强大的数学公式处理能力，以至于一直有人搞不清 LaTeX 和 MathType、MathJax 等的关系。但就这方面而言，LaTeX3 本身并不能改变多少（倒是 `unicode-math` 很可能成为未来的方向）。
- 相比网页排版有 W3C 和一众厂商的推进，桌面排版也有 Adobe 和微软的巨额投入，TeX 界几乎可以说全凭社区的努力。这显然是杯水车薪的，所以对进度也不必有太多指望。即使 LaTeX3 最后烂尾，目前的成果（`expl3` 编程接口）也不会付诸东流。

## 注释

1. <span class="backref" id="fnref-lamport-book"><a href="#fnref-lamport-book">^</a></span>
   [LaTeX: A Document Preparation System - The Writings of Leslie Lamport](https://lamport.azurewebsites.net/pubs/pubs.html#latex)
1. <span class="backref" id="fnref-footnote"><a href="#fnref-footnote">^</a></span>
   李清. [LaTeX 脚注要怎么在行内垂直居中呢？- 知乎](https://www.zhihu.com/question/26916597/answer/34565213)
1. <span class="backref" id="fnref-expandafter"><a href="#fnref-expandafter">^</a></span>
   2015 年 `CTeX` 宏集进行了较为彻底的重构，这里给出的代码实际上已经不再使用，但仍然保留在[代码库](https://github.com/CTeX-org/ctex-kit/blob/ctex-1.02d/def/ctex-common.def#L44-L50)中。参考：刘海洋. [多个 \expandafter 的展开过程是怎样的？- 知乎](https://www.zhihu.com/question/26916597/answer/34565213)

## 参考

1. [The LaTeX3 Project](https://www.latex-project.org/latex3/)
1. @bryn. [Why is LaTeX3 taking so long to come out?](https://tex.stackexchange.com/q/953)
1. Joseph Wright. Series on programming LaTeX3
  - [Programming LaTeX3: Introduction](https://www.texdev.net/2011/12/06/programming-latex3-introduction/)
  - [Programming LaTeX3: Background](https://www.texdev.net/2011/12/07/programming-latex3-background/)
