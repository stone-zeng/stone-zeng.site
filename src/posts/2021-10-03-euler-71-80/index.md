---
title: Project Euler (71--80)
date: 2021-10-03
math: true
excerpt: 欧拉计划 71--80 题。
---

## 71. Ordered fractions

> Consider the fraction, *n*/*d*, where *n* and *d* are positive integers. If *n*<*d* and HCF(*n*,*d*)=1, it is called a reduced proper fraction.
>
> If we list the set of reduced proper fractions for *d* ≤ 8 in ascending order of size, we get:
>
> {:.problem-example}
> 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, **2/5**, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
>
> It can be seen that 2/5 is the fraction immediately to the left of 3/7.
>
> By listing the set of reduced proper fractions for *d* ≤ 1,000,000 in ascending order of size, find the numerator of the fraction immediately to the left of 3/7.

这道题看起来是不是最简真分数并不要紧，那么我们不妨直接列出所有单位分数（即 1/*d*），用 3/7 除掉取余数，得到最近的距离，再扣掉即可。

```wl
With[{r = 3/7}, r - Min @ DeleteCases[0] @ Mod[r, 1 / Range[1*^6]]]
(* 428570/999997 *)
```

## 72. Counting fractions

> Consider the fraction, *n*/*d*, where *n* and *d* are positive integers. If *n*<*d* and HCF(*n*,*d*)=1, it is called a reduced proper fraction.
>
> If we list the set of reduced proper fractions for *d* ≤ 8 in ascending order of size, we get:
>
> {:.problem-example}
> 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
>
> It can be seen that there are 21 elements in this set.
>
> How many elements would be contained in the set of reduced proper fractions for *d* ≤ 1,000,000?

最简真分数的个数其实就是与 *d* 互素的正整数的个数，也就是我们熟悉的 `EulerPhi` 函数。

```wl
Total @ EulerPhi @ Range[2, 1*^6]
(* 303963552391 *)
```

## 73. Counting fractions in a range

> Consider the fraction, *n*/*d*, where *n* and *d* are positive integers. If *n*<*d* and HCF(*n*,*d*)=1, it is called a reduced proper fraction.
>
> If we list the set of reduced proper fractions for *d* ≤ 8 in ascending order of size, we get:
>
> {:.problem-example}
> 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, **3/8**, **2/5**, **3/7**, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
>
> It can be seen that there are 3 fractions between 1/3 and 1/2.
>
> How many fractions lie between 1/3 and 1/2 in the sorted set of reduced proper fractions for *d* ≤ 12,000?

直接用死办法枚举 + 筛选，碰巧这个序列是可以用内置函数 [`FareySequence`](https://reference.wolfram.com/language/ref/FareySequence.html) 给出的，虽然还是很慢。

```wl
Count[FareySequence[12000], _?(1/3 < # < 1/2 &)] // AbsoluteTiming
(* {112.195, 7295372} *)
```

## 74. Digit factorial chains

> The number 145 is well known for the property that the sum of the factorial of its digits is equal to 145:
>
> {:.problem-example-left}
> 1! + 4! + 5! = 1 + 24 + 120 = 145
>
> Perhaps less well known is 169, in that it produces the longest chain of numbers that link back to 169; it turns out that there are only three such loops that exist:
>
> {:.problem-example-left}
> 169 → 363601 → 1454 → 169
> 871 → 45361 → 871
> 872 → 45362 → 872
>
> It is not difficult to prove that EVERY starting number will eventually get stuck in a loop. For example,
>
> {:.problem-example-left}
> 69 → 363600 → 1454 → 169 → 363601 (→ 1454)
> 78 → 45360 → 871 → 45361 (→ 871)
> 540 → 145 (→ 145)
>
> Starting with 69 produces a chain of five non-repeating terms, but the longest non-repeating chain with a starting number below one million is sixty terms.
>
> How many chains, with a starting number below one million, contain exactly sixty non-repeating terms?

一步一步来：

- 按定义找到第一轮后继，并分组为 `groups`；其中只有 1716 个不同的后继，这就可以极大压缩后面的计算量
- 从第一轮后继开始迭代，找到循环链 `chains`
- 最后统计一下各循环链的长度，略有繁琐但并不困难

```wl
Module[{max = 1*^6, len = 60, func, mapFunc, groups, chains},
  func = Total @* Factorial @* IntegerDigits;
  groups = GroupBy[func] @ Range[max];
  chains = Association @ ParallelTable[
    i -> NestWhileList[func, i, UnsameQ @@ {##} &, All, Infinity, -1],
    {i, Keys[groups]}
  ];
  Count[len] @ Flatten[
    Function[{n, chain}, Length[chain] + If[MemberQ[chain, #], 0, 1] & /@ n]
      @@@ Values @ Merge[{groups, chains}, Identity]
  ]
]
(* 402 *)
```

## 75. Singular integer right triangles

> It turns out that 12 cm is the smallest length of wire that can be bent to form an integer sided right angle triangle in exactly one way, but there are many more examples.
>
> {:.problem-example-left}
> **12 cm**: (3,4,5)
> **24 cm**: (6,8,10)
> **30 cm**: (5,12,13)
> **36 cm**: (9,12,15)
> **40 cm**: (8,15,17)
> **48 cm**: (12,16,20)
>
> In contrast, some lengths of wire, like 20 cm, cannot be bent to form an integer sided right angle triangle, and other lengths allow more than one solution to be found; for example, using 120 cm it is possible to form exactly three different integer sided right angle triangles.
>
> {:.problem-example-left}
> **120 cm**: (30,40,50), (20,48,52), (24,45,51)
>
> Given that L is the length of the wire, for how many values of L ≤ 1,500,000 can exactly one integer sided right angle triangle be formed?

勾股数（$a^2+b^2=c^2$）可以由下式给出：

$$ a = k\cdot(i^2 - j^2), \quad b = k\cdot 2ij, \quad c = k\cdot(i^2 + j^2) $$

其中 $i$、$j$、$k$ 为正整数，$i>j$，并有 $i$、$j$ 互素且不同为奇数。下面的问题就是找到它们的上界。

注意到 $a+b+c = 2k \cdot i(i+j)$，因此 $i$ 的最大值只能在 $j, k=1$ 时取到，即 $2i_\text{max}(2i_\text{max}+1) \leqslant L_\text{max}$；而 $k$ 的最大值显然应该满足 $2k_\text{max}\cdot i(i+j) \leqslant L_\text{max}$。这样三重循环遍历一共两百多万组，复杂度还是在可接受范围内的。

边界处我们没有很仔细地处理，最后还是要过滤一遍。

```wl
Module[{max = 15*^5, imax, kmax, triples},
  imax = Ceiling @ Max[i /. Solve[2i * (i + 1) == max, i]];
  triples = Union[Sort /@ Flatten[#, 2] & @
    Table[k * {i^2 - j^2, 2i*j, i^2 + j^2},
      {i, imax}, {j, i - 1}, {k, Floor[max / (2i * (i + j))]}]
  ];
  Count[1] @ KeySort @ Counts @ Select[Total /@ triples, # <= max &]
] // AbsoluteTiming
(* {13.2544, 161667} *)
```

## 76. Counting summations

> It is possible to write five as a sum in exactly six different ways:
>
> {:.problem-example-left}
> 4 + 1
> 3 + 2
> 3 + 1 + 1
> 2 + 2 + 1
> 2 + 1 + 1 + 1
> 1 + 1 + 1 + 1 + 1
>
> How many different ways can one hundred be written as a sum of at least two positive integers?

不知道 [`PartitionsP`](https://reference.wolfram.com/language/ref/PartitionsP.html) 的话，复习一下 [Virasoro algebra](https://en.wikipedia.org/wiki/Virasoro_algebra) 吧（逃

```wl
PartitionsP[100] - 1
(* 190569291 *)
```

## 77. Prime summations

> It is possible to write ten as the sum of primes in exactly five different ways:
>
> {:.problem-example-left}
> 7 + 3
> 5 + 5
> 5 + 3 + 2
> 3 + 3 + 2 + 2
> 2 + 2 + 2 + 2 + 2
>
> What is the first value which can be written as the sum of primes in over five thousand different ways?

计算量不大，直接翻译题目，用素数进行整数划分即可。

```wl
primePartitions[n_] :=
  Length @ IntegerPartitions[n, All, Prime @ Range @ PrimePi @ n]
NestWhile[# + 1 &, 1, primePartitions[#] < 5000 &]
(* 71 *)
```

## 78. Coin partitions

> Let p(*n*) represent the number of different ways in which *n* coins can be separated into piles. For example, five coins can be separated into piles in exactly seven different ways, so p(5)=7.
>
> {:.problem-example-left}
> OOOOO
> OOOO O
> OOO OO
> OOO O O
> OO OO O
> OO O O O
> O O O O O
>
> Find the least value of *n* for which p(*n*) is divisible by one million.

也是整数划分的题目，不过计算量差了很多。比较大的数字算 `PartitionsP` 是很慢的，但不想再优化了。Mathematica 因为有系统缓存，所以第二次计算就要快多了。

```wl
NestWhile[# + 1 &, 1, !Divisible[PartitionsP[#], 1*^6] &]
(* 55374 *)
```

## 79. Passcode derivation

> A common security method used for online banking is to ask the user for three random characters from a passcode. For example, if the passcode was 531278, they may ask for the 2nd, 3rd, and 5th characters; the expected reply would be: 317.
>
> The text file, [**keylog.txt**](https://projecteuler.net/project/resources/p079_keylog.txt), contains fifty successful login attempts.
>
> Given that the three characters are always asked for in order, analyse the file so as to determine the shortest possible secret passcode of unknown length.

先下载数据，注意要删掉重复的：

```wl
keys = EchoFunction[Length] @ IntegerDigits @ Union @ Flatten @
  Import["https://projecteuler.net/project/resources/p079_keylog.txt", "Table"]
```

下面的想法是逐步构造可能的密码。以 129 和 160 为例，先把 1 插入 `{1, 2, 9}` 序列里面，可能的插法有：

<!--

```wl
In[1] := insertSingle[{1, 2, 9}, 1]
Out[1] = {{1, 2, 9}, {1, 1, 2, 9}, {1, 1, 2, 9}, {1, 2, 1, 9}, {1, 2, 9, 1}}
```

接下来依次插入 6 和 0，并且要满足顺序：

```wl
In[2] := insertPart[6, {1, 6}] @ % // Short
In[3] := insertPart[0, {1, 6, 0}] @ % // Short
Out[2] = {{1, 6, 2, 9}, {1, 2, 6, 9}, <<15>>, {1, 2, 9, 6, 1}, {1, 2, 9, 1, 6}}
Out[3] = {{1, 6, 0, 2, 9}, {1, 6, 2, 0, 9}, <<43>>, {1, 2, 9, 1, 6, 0}}
```

-->

这两步合并起来用函数 `insert` 包装一下。各函数定义如下：

```wl
insert[code_, {i_, j_, k_}] :=
  insertPart[k, {i, j, k}] @ insertPart[j, {i, j}] @ insertSingle[code, i]

insertPart[x_, s_, code_] :=
  Select[isSubset[#, s] &] @ Catenate[insertSingle[x] /@ code];
insertPart[x_, s_] := OperatorApplied[insertPart, 3][x, s]

insertSingle[code_, x_] := Join[
  If[MemberQ[code, x], {code}, {}],
  Insert[code, x, #] & /@ Range[Length[code] + 1]
]
insertSingle[x_] := OperatorApplied[insertSingle][x]

isSubset[code_, key_] := Module[{pos},
  pos = Flatten @ Position[code, #] & /@ key;
  AnyTrue[OrderedQ] @ Flatten[Outer[List, Sequence @@ pos], Length[key] - 1]
]
```

注意我们用了几次 [OperatorApplied](https://reference.wolfram.com/language/ref/OperatorApplied.html) 来把函数变成「算符」的形式，也就是[柯里化](https://en.wikipedia.org/wiki/Currying)。这样写能省掉不少 `#` 和 `&`，而实际上 Mathematica 在版本 10 之后很多内置函数也增加了[柯里化的形式](https://reference.wolfram.com/language/guide/FunctionCompositionAndOperatorForms.html)。

最后对数据进行一个「折叠」。这里用了贪心法，每次只取最短的序列，嗯，我也不知道为什么行但反正就是行。

```wl
FromDigits @ First @ Fold[
  Function[{code, key}, MinimalBy[Catenate[insert[#, key] & /@ code], Length]],
  MapAt[List, keys, 1]
]
(* 73162890 *)
```

看[酱紫君的答案](https://euler.ea.chat/Lv0-炼气/71-80.html#p79-密码推断)又是花式玩 pattern，学不来学不来。

## 80. Square root digital expansion

> It is well known that if the square root of a natural number is not an integer, then it is irrational. The decimal expansion of such square roots is infinite without any repeating pattern at all.
>
> The square root of two is 1.41421356237309504880..., and the digital sum of the first one hundred decimal digits is 475.
>
> For the first one hundred natural numbers, find the total of the digital sums of the first one hundred decimal digits for all the irrational square roots.

用 [`RealDigits`](https://reference.wolfram.com/language/ref/RealDigits.html) 可以获得小数部分，事就这样成了。

```wl
Total[Total @ First @ RealDigits[#, 10, 100] & /@
  DeleteCases[Sqrt[Range[100]], _Integer]]
(* 40886 *)
```
