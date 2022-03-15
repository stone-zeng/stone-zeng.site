---
layout: post
title: LaTeX3 教程（二）——语法概要
date: 2019-02-26
last_modified_at: 2020-01-16
categories: LaTeX3
description: 从这次的内容开始，我们就将正式进入 $\LaTeX3$ 的世界了。上次我们已经介绍过，$\LaTeX3$ 的主要成果都凝结在了 `expl3` 之中。实际上，$\LaTeX3$ 是一套非常庞大的框架，集编程和排版为一体。根据我们之前的介绍，$\LaTeX3$ 为此做出了一个层次划分。
---

从这次的内容开始，我们就将正式进入 $\LaTeX3$ 的世界了。

## 架构 / 层次设计

上次我们已经介绍过，$\LaTeX3$ 的主要成果都凝结在了 `expl3` 之中。实际上，$\LaTeX3$ 是一套非常庞大的框架，集编程和排版为一体。根据我们之前的介绍，$\LaTeX3$ 为此做出了一个层次划分：

- 文本标记层。这一层主要提供给文章作者使用。显然，考虑到历史兼容性，这一层次与我们至今仍在使用的 $\LaTeXe$ 并没有显著的差异。对于 $\LaTeX$ 的一般用户而言，从 $\LaTeXe$ 转换到 $\LaTeX3$ 的学习成本可以说几乎为零；甚至由于一些新接口、新语法的使用，使用 $\LaTeX$ 将变得更加方便。

- 设计接口。传统的 $\LaTeXe$ 并没有提供这一个层次。也就是说，用户要么使用 $\LaTeX$ 本身或者宏包提供的功能，要么就必须通过底层编程来进行控制，不存在这样一个所谓「设计模板」的存在。编写模板的人，我们暂且可以称之为是「设计师」，他们只需要利用编程框架设计模板，而无需考虑用户（即文章作者）究竟用模板写了怎样的内容。

- 编程接口。这一层次实际上就是 `expl3`，它的实现基于 $\TeX$ 的原语，提供了丰富的编程工具，也是上面两个层次的实现手段。

这三个层次是紧密联系在一起的。如前所述，`expl3` 宏包提供了编程接口；`xtemplate` 宏包给出了实现「文档原型」的方法，也就是提供了上面所说的「设计接口」；最后，`xparse` 宏包用来定义文档层的命令和环境，即所谓「文本标记」。

## $\LaTeX3$ 相关宏包

对于具体的用户来说，无论是文章作者、设计师还是程序员，使用 $\LaTeX3$ 在目前阶段仍需要通过调用一系列宏包来完成。

目前，在 CTAN 中与 $\LaTeX3$ 相关的有五个软件包[^package]：

[^package]: 这里的「软件包」是指一系列宏包、文档等的集合，可以通过 `tlmgr` 一类的包管理器进行安装、更新、备份等操作。注意与 $\LaTeX$ 语境下的「宏包」相区分，它是后缀名为 `.sty` 的 $\TeX$ 文件，通过 `\usepackage` 调用。

- [`l3kernel`](https://ctan.org/pkg/l3kernel)：包含了 `expl3` 宏包的各个部分。
- [`l3packages`](https://ctan.org/pkg/l3packages)：提供较高层次的接口（设计层和文本标记层），这些宏包的语法接口都较为稳定。主要包括：
  - `l3keys2e`
  - `xfp`
  - `xfrac`
  - `xparse`
  - `xtemplate`
- [`l3experimental`](https://ctan.org/pkg/l3experimental)：一些实验性的尝试，同样用来构建较高层次的语法接口，但不如 `l3packages` 稳定。目前主要有：
  - `l3benchmark`
  - `l3color`
  - `l3draw`
  - `l3graphics`
  - `l3pdf`
  - `l3str`
  - `l3sys-shell`
  - `xcoffins`
  - `xgalley`
- [`l3backend`](https://ctan.org/pkg/l3backend)：提供与后端（底层驱动）相交互的代码，处理颜色、绘图、PDF 特性等功能，目前主要支持以下几种驱动：[^l3backend]
  - `dvipdfmx`
  - `dvips`
  - `dvisvgm`
  - `luatex`
  - `pdftex`
  - `xetex`
- [`l3build`](https://ctan.org/pkg/l3build)：$\LaTeX3$ 的构建系统，用来进行单元测试、文档排版、自动化发布等。它利用一系列 Lua 脚本来实现跨平台的功能。

[^l3backend]: 2019 年 7 月 `l3backend` 的代码从 `l3kernel` 中独立出来，以便采取不同的更新策略。

这就是当前 $\LaTeX3$ 的主要组成。除此以外，在 $\LaTeX3$ 的 [GitHub 存储库](https://github.com/latex3/latex3)中，还包含了一些高度实验性的功能以及弃用的模块。对于普通用户和开发者来说，它们不应该直接使用。

## 命名规范

前面铺垫了很多，现在我们终于可以开始尝试 $\LaTeX3$ 了。

和我们熟知的 $\LaTeXe$ 不同，$\LaTeX3$ 对**函数**和**变量**做出了区分。函数可以吃掉一些参数，并进行相应的操作；函数要么是可被展开的，要么就是可被执行的，以后讲到展开控制的时候我们还会详细介绍。变量用来存储数据，它会被函数所调用。一些具有相关功能的函数和命令可以构成一个**模块**。

$\LaTeX3$ 中的命令，无论是函数还是变量，仍然都是以反斜杠 `\` 开头。所不同的是，我们可以在命令中使用下划线 `_`，用以区分不同单词。

### 函数

按照规范，$\LaTeX3$ 中的函数名包括三部分：模块名（`module`）、描述（`description`）以及参数指定（`arg-spec`），形如

```
\<module>_<description>:<arg-spec>
```

注意参数指定需要放在冒号 `:` 后面。不必奇怪，冒号也是命令的一部分。

#### 参数指定

模块名与描述的含义都是显而易见的。「参数指定」，指的是这一函数要吃掉怎样的一些参数，它由一串字母组成（区分大小写）。最基本的参数指定包括：

- `n`：普通（**n**ormal）参数，表示一组由大括号 `{...}` 包围的 token（记号，或者叫字元）列表，这其实就是TeX 中的标准宏参数
- `N`：表示单个 token，比如一个控制序列（由 `\` 开头的命令），或者一个单独的字符
- `p`：原始 $\TeX$ 的形参（**p**arameter）指定。具体来说，就是我们在用 `\def` 定义新命令时所用的 `#1`、`#1#2` 等
- `T`, `F`：这两个是 `n` 的特殊情况，用来给出条件分支（**T**rue、**F**alse）

还有两个特殊的参数指定：

- `D`：表示不要使用（**D**o not use）。由 `D` 开头的命令是原语的直接拷贝，在 `l3kernel` 之外尽量不要直接使用（当然有时候不可避免）
- `w`：奇异型（**w**eird）参数，表示不遵循标准参数指定的一些特例

参数指定在 $\LaTeX3$ 中发挥着至关重要的作用。$\LaTeX3$ 的展开控制机制将会引入更多类型的参数指定，以后我们会详细介绍。

#### 函数的例子

- `\cs_new:Npn`：这一函数属于 `cs` 模块（控制序列，**c**ontrol **s**equence）。顾名思义，它用来创建新的函数。三个参数分别是：
  - `N`：函数名称，由于是 `\` 开头的控制序列，因而总是单个 token
  - `p`：新创建的函数的形参指定
  - `n`：具体的函数定义

  这一函数的行为类似于 `\def`：[^cs-new]

  ```tex
  % LaTeX2ε
  \def\myfunc#1{Hello #1}
  % LaTeX3
  \cs_new:Npn \my_func:n #1 { Hello~ #1 }
  ```

  注意到开启 $\LaTeX3$ 语法后，单词间的空格是不起任何作用的（catcode=9，即可忽略字符）。确实要使用空格时，则用 `~` 代替。至于需要使用 `~` 的原来意思，即不可断开的空格（俗称「带子」）时，可以用原来的宏 `\nobreakspace`。

  [^cs-new]: 与 `\def` 不同的是，`\cs_new:Npn` 会做重复定义检查，如果命令已经定义则会报错；此外还加上了 `\long`，即允许在参数中使用 `\par`。因而 `\cs_new:Npn` 的实际效果其实更接近 $\LaTeXe$ 中的 `\newcommand`，只是参数形式更加灵活（`\newcommand` 只能定义不带参数，或者参数形如 `[<可选参数>]{<必选参数 1>}...` 的命令）。

- `\int_if_even:nTF`：它属于 `int` 模块，用于处理整数。这一函数的作用是判断一个数字（由 `n` 参数接受）是不是偶数，若是，则执行 `T` 分支，否则执行 `F` 分支。

  ```tex
  \int_if_even:nTF { 12 }
    { <true code>  }
    { <false code> }
  ```

  显然以上这段代码会执行 `<true code>`。

  一般来说，这种条件判断函数在定义时会同时创建多种分支结构，比如 `\int_if_even:nT` 和 `\int_if_even:nF` 也可以使用。`\int_if_even:nT` 表示数字为偶数则执行 `T` 分支，否则什么也不做；`\int_if_even:nF` 也是类似的。

### 变量

$\LaTeX3$ 中，变量的名称包括四个部分：作用域（`scope`）、模块名（`module`）、描述（`description`）以及变量类型（`type`），形如

```
\<scope>_<module>_<description>_<type>
```

通常来说，变量名中只包含字母和下划线（`_`）。

#### 作用域

变量的作用域有三种：

- `c`：表示常数（**c**onstant），即一旦创建，就不应该改变它的值
- `g`：全局变量（**g**lobal），它的值是全局有效的，也就是分组（`{...}`）对其无效。常见的例子比如某些计数器变量
- `l`：局部变量（**l**ocal），顾名思义，它们的值只在局部有效。在大多数情况下，我们使用的都是 `l` 型变量

全局变量和局部变量的修改需要通过不同的函数来进行。比如把一个 `int` 变量设为零，我们有两个函数：`\int_zero:N` 和 `\int_gzero:N`。前者是局部有效的，应当作用于 `l` 型变量；而后者是全局有效的，作用于 `g` 型变量。

具体到应用，我们来看一个例子：

```tex
% 声明变量
\int_new:N \l_my_variable_int
\int_new:N \g_my_variable_int
% 查看变量的值
\int_show:N \l_my_variable_int % => 0
\int_show:N \g_my_variable_int % => 0
% 开启一个分组
{
  % 赋值
  \int_set:Nn  \l_my_variable_int { 1 }
  \int_gset:Nn \g_my_variable_int { 1 }
  % 查看变量的值
  \int_show:N \l_my_variable_int % => 1
  \int_show:N \g_my_variable_int % => 1
}
\int_show:N \l_my_variable_int % => 0
\int_show:N \g_my_variable_int % => 1
```

`\int_new:N` 表示**全局地**创建一个 `int` 型变量，并且赋初值为 0。在分组中，我们分别把 `l` 型和 `g` 型变量的值修改为 1；但离开分组，可以看到 `l` 型变量的值仍为 0，而 `g` 型变量的值则同分组中的一样，被修改为了 1。

需要指出的是，$\TeX$ 实际上并不会在乎究竟把变量的名字起做什么，所以这种作用域的划分，更多的是一种惯例（convention）或者风格（style），而非硬性的语法规定。不过出于可读性的考虑，一般情况下仍然要求遵循这一规范。

#### 变量类型

我们知道，C 语言里面有 `int`、`double`、`char` 这样的数据类型。$\TeX$ 中也有类似的概念，称为寄存器（register）。寄存器共有 6 种：

- `count`：计数器，相当于整型变量
- `toks`：记号变量（**tok**en**s**）
- `box`：盒子变量
- `dimen`：刚性长度（**dimen**sion）
- `skip`：弹性长度
- `muskip`：数学弹性长度（**skip** in **m**ath **u**nit）

$\LaTeX3$ 在 $\TeX$ 的基础上做了很大的扩充，新定义了一些新的变量类型。

以下这几种直接继承了前面所说的寄存器类型：

- `box`
- `int` <-- `count` (**int**eger)
- `dim` <-- `dimen`
- `skip`
- `muskip`

以下是 $\LaTeX3$ 新定义的变量类型，它们大多只是一些特殊的宏：

- 数据结构：
  - `tl`：记号列表（**t**oken **l**ist）
  - `str`：字符串（**str**ing），它与 `tl` 的区别在于忽略了类别码（除空格外全部设为其他类 12，空格仍为 10）
  - `seq`：序列（**seq**uence），栈
  - `clist`：逗号分隔列表（**c**omma **list**）
  - `prop`：属性列表（**prop**erty list），即关联列表
  - `fp`：浮点数（**f**loating **p**oints）
  - `intarray`、`fparray`：整型、浮点型数组（**int**eger/**f**loating **p**oint **array**）
- 盒子的推广：
  - `coffin`：带「把手」的盒子
- 其他：
  - `bool`：布尔型变量
  - `token`：记号
  - `ior`、`iow`：输入、输出流（**I/O** **r**ead/**w**rite）
  - `regex`：正则表达式（**reg**ular **ex**pression）

还有几种比较特殊的变量，它们不遵循通常的命名规则：

- `quark`：「夸克」，是展开到自身的宏
- `mark`：扫描标记

在某些地方，比如 $\LaTeX3$ 的内部实现中，这两种变量会发挥重要的作用。

#### 变量的例子

- `\c_pi_fp`：常数圆周率
- `\l_tmpa_tl`、`\g_tmpa_tl`：临时 token list 变量，注意这里做了局部与全局的区分
- `\q_stop`：这是一个「夸克」，常用来作为某些参数列表的分界符

以上这几个变量属于 `l3kernel` 的编程接口，所以没有指定模块名。

$\LaTeX3$ 中的变量与相关函数组成了一个个模块。之后我们就将分模块逐一介绍 $\LaTeX3$ 的各种功能。

### 私有函数与变量

按照 $\LaTeX3$ 的规范，所有的公开函数及变量都需要给出注释或说明。除此之外，在编程的时候或多或少会引入一些私有的函数与变量，而我们并不希望普通用户以及其他宏包的作者使用它们。

私有函数以两个下划线开头，如 `\__my_function:nn`；私有变量则在作用域标记之后跟着两个下划线，如 `\l__my_variable_tl`。

事实上，$\LaTeX3$ 提供了 `l3docstrip` 宏包，它在文学编程宏包 `docstrip` 的基础上引入了名字空间的手法。下面我们来给出一个例子：

```tex
% 进入名字空间 `myi`
%<@@=myi>
\cs_new:Npn \myi_function:n #1
  { \@@_function:nn {#1} { \@@_foo_int } }
\int_new:N \@@_foo_int
\cs_new:Npn \@@_function:nn #1#2
  { ... }
% 进入名字空间 `myii`
%<@@=myii>
\cs_new:Npn \myii_function:n #1
  { \@@_function:nn {#1} { \myi_function:n {#1} } }
\cs_new:Npn \@@_function:nn #1#2
  { ... }
% 关闭名字空间
%<@@=>
```

此处，我们看似定义了两个 `\@@_function:nn` 函数。但实际上，它们分别是 `\__myi_function:nn` 和 `\__myii_function:nn`，所以并不会发生冲突。

更重要的是，在模块 `myii` 中，我们不能用 `@@` 的简写形式来调用 `myi` 中的私有成员，而应该尽量使用 `myi` 模块提供的公开接口（即 `\myi_function:n`）。因此，即使某一宏包（模块）的内部发生了变化，只要接口不变，使用它的其他模块就不会感受到这种变化。这正是封装的作用。

直接调用其他模块中的私有成员（比如 `\__myi_function:nn`）也并非不可以，有的时候还必须如此。不过一旦原来模块发生了变动，调用的地方也需要相应做出改变。

## 代码风格

我们知道，Google 为 C++ 和 Python 等提供了[格式指南](https://google.github.io/styleguide/)（style guide），但传统上 $\TeX$ 和 $\LaTeX$ 这样的宏语言却并没有类似的代码规范，因此很多时候可读性实在不敢恭维。

通过修改空格、下划线等字符的类别码，$\LaTeX3$ 大大提供的代码的可读性。这样，我们也可以相应地给出一些格式规范：

- 每行不超过 80 个字符
- 各元素之间添加空格以增加可读性，除了少数使用简单参数的情况，如 `{#1}`、`#1#2` 等
- 每一层语义应当独占一行，比如 true 和 false 分支就应至少占据两行
- 对不同层次的代码合理使用缩进。缩进可以使用两个空格，但不要用 `tab`
- 左花括号单独占据一行，并且也需要缩进

以下是一个示例：

```tex
\cs_new:Npn \my_foo:nn #1#2
  {
    \tl_if_empty:nTF {#1}
      { \my_foo_aux:n { X #2 } }
      {
        \my_foo_aux:nn {#1} {#2}
        \my_foo_aux:n { #1 #2 }
      }
  }
```

当然，没有一种规范是可以放之四海而皆准，特殊的地方总还是免不了特殊对待。

## 编程环境

之前我们就已经提到过，$\LaTeX3$ 目前为止还没有成为一个独立的格式。使用 $\LaTeX3$，仍然需要在 $\LaTeXe$ 中调用 `expl3` 宏包。

如果只在一个 `.tex` 文件中使用，可以这样做：

```tex
\documentclass{article}
\usepackage{expl3}

\ExplSyntaxOn   % 开启 LaTeX3 编程环境
...
\ExplSyntaxOff  % 关闭 LaTeX3 编程环境
```

如果是要编写宏包或文档类，标准做法与在 $\LaTeXe$ 中类似：

```tex
\RequirePackage{expl3}

% 宏包使用 \ProvidesExplPackage
% 文档类使用 \ProvidesExplClass
% 其他文件使用 \ProvidesExplFile
\ProvidesExplPackage{<package>}{<data>}{<version>}{<description>}

% 之后开启 LaTeX3 语法，文件末尾处则会自动关闭
```

第二种方法继承并扩展了 $\LaTeXe$ 中 `\ProvidesPackage`、`\ProvidesClass` 和 `\ProvidesFile` 的功能，大致相当于

```tex
% Package info

% 文件开头
\makeatletter
\ExplSyntaxOn
...
% 文件结尾
\ExplSyntaxOff
\makeatother
```

因此在编写宏包或文档类时，`@` 符号可以被当成字母使用。

## 注释

<div id="footnotes"></div>

## 参考

- [The `expl3` package and $\LaTeX3$ programming](https://mirrors.ctan.org/macros/latex/contrib/l3kernel/expl3.pdf) - `texdoc expl3`
- [The $\LaTeX3$ kernel: style guide for code authors](https://mirrors.ctan.org/macros/latex/contrib/l3kernel/l3styleguide.pdf) - `texdoc l3styleguide`
- [The $\LaTeX3$ Interfaces](https://mirrors.ctan.org/macros/latex/contrib/l3kernel/interface3.pdf) - `texdoc interface3`
- [The $\LaTeX3$ Sources](https://mirrors.ctan.org/macros/latex/contrib/l3kernel/source3.pdf) - `texdoc source3`
- Joseph Wright. [Programming LaTeX3: The programming environment](https://www.texdev.net/2011/12/11/programming-latex3-the-programming-environment/)
