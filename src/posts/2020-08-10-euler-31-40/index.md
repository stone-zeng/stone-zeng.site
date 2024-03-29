---
title: Project Euler (31--40)
date: 2020-08-10
excerpt: 欧拉计划 31--40 题。
---

## 31. Coin sums

> In the United Kingdom the currency is made up of pound (£) and pence (p). There are eight coins in general circulation:
>
> 1p, 2p, 5p, 10p, 20p, 50p, £1 (100p), and £2 (200p).
> {.problem-example}
>
> It is possible to make £2 in the following way:
>
> 1×£1 + 1×50p + 2×20p + 1×5p + 1×2p + 3×1p
> {.problem-example}
>
> How many different ways can £2 be made using any number of coins?

可以用 [`IntegerPartitions`](https://reference.wolfram.com/language/ref/IntegerPartitions.html) 计算整数的划分，也可以用 [`FrobeniusSolve`](https://reference.wolfram.com/language/ref/FrobeniusSolve.html) 计算系数。

```wl
IntegerPartitions[200, All, {1, 2, 5, 10, 20, 50, 100, 200}] // Length
(* 73682 *)
FrobeniusSolve[{1, 2, 5, 10, 20, 50, 100, 200}, 200] // Length
(* 73682 *)
```

## 32. Pandigital products

> We shall say that an *n*-digit number is pandigital if it makes use of all the digits 1 to *n* exactly once; for example, the 5-digit number, 15234, is 1 through 5 pandigital.
>
> The product 7254 is unusual, as the identity, 39 × 186 = 7254, containing multiplicand, multiplier, and product is 1 through 9 pandigital.
>
> Find the sum of all products whose multiplicand/multiplier/product identity can be written as a 1 through 9 pandigital.
>
> HINT: Some products can be obtained in more than one way so be sure to only include it once in your sum.

`pandigitalQ` 函数用来检查列表是否等于 `Range[9]`（那为什么不直接 `Union[#] == Range[9] &` 呢？）。之后分两部分讨论：`_ × ____ = ____` 和 `__ × ___ = ____`{.font-feature-calt-off}。都是先枚举出允许的值然后 `Select`。

```wl
pandigitalQ[list_] := DuplicateFreeQ[list] && FreeQ[list, 0]
Join[
  Select[pandigitalQ @ Flatten @ IntegerDigits @ # &] @
    Catenate @ Outer[{#1, #2, #1 * #2} &, {2, 3, 4}, FromDigits /@ Permutations[Range[9], {4}]],
  With[{iRange = Select[pandigitalQ @ IntegerDigits @ # &] @ Range[12, 99],
        jRange = Select[pandigitalQ @ IntegerDigits @ # &] @ Range[102, 999]},
    Select[Apply[1000 <= #3 <= 9999 &&
           pandigitalQ @ Flatten @ IntegerDigits[{##}] &]] @
      Catenate @ Table[{i, j, i * j}, {i, iRange}, {j, jRange}]]
] /. {_, _, p_} -> p // Union // Total
(* 45228 *)
```

对照[酱紫君的答案](https://euler.ea.chat/Lv0-炼气/31-40.html#p32-全数字的乘积)，虽然思路类似，但我写得太啰嗦了啊。

## 33. Digit cancelling fractions

> The fraction <span class="font-feature-frac">49/98</span> is a curious fraction, as an inexperienced mathematician in attempting to simplify it may incorrectly believe that <span class="font-feature-frac">49/98 = 4/8</span>, which is correct, is obtained by cancelling the 9s.
>
> We shall consider fractions like, 30/50 = 3/5, to be trivial examples.
> {.font-feature-frac}
>
> There are exactly four non-trivial examples of this type of fraction, less than one in value, and containing two digits in the numerator and denominator.
>
> If the product of these four fractions is given in its lowest common terms, find the value of the denominator.

1. 生成分子、分母列表，移除 10 和 11 的倍数（10 的倍数要么是 trivial 的，要么会变成 0；11 的倍数不能只消去一个数）
2. 用 `IntegerDigits` 变成各位数，取 `Union` 后长度为 3 的即可发生一次消去
3. 用 `cancel` 消去重复的数字，若仍和原数字相等，则保留

按照「函数式」的写法，代码要从下往上看。

```wl
cancel[a_, b_] := First[Divide @@ (Complement[#, Intersection[a, b]] & /@ {a, b})]
Denominator[Times @@ Divide @@@ Echo[#]] & @
  Select[cancel @@ IntegerDigits[#] == Divide @@ # &] @
    Select[Length[Union @@ IntegerDigits[#]] == 3 &] @
      DeleteCases[_?(Or @@ Flatten @ Outer[Divisible, #, {10, 11}] &)] @
        Catenate @ Table[{i, j}, {j, 10, 99}, {i, 10, j - 1}]
(* 100 *)
```

满足要求的四组分数为 16/64、26/65、19/95 和 49/98。
{.font-feature-frac}

## 34. Digit factorials

> 145 is a curious number, as 1! + 4! + 5! = 1 + 24 + 120 = 145.
>
> Find the sum of all numbers which are equal to the sum of the factorial of their digits.
>
> Note: As 1! = 1 and 2! = 2 are not sums they are not included.

先找出上界然后暴力枚举。大约要跑十几秒钟，就不继续优化了。

```wl
With[{n = n /. First @ NSolve[{10^n - 1 == 9! * n, n > 0}, n]},
  Total @ Select[Range[3, Ceiling[10^n]], # == Total[IntegerDigits[#]!] &]]
(* 40730 *)
```

## 35. Circular primes

> The number, 197, is called a circular prime because all rotations of the digits: 197, 971, and 719, are themselves prime.
>
> There are thirteen such primes below 100: 2, 3, 5, 7, 11, 13, 17, 31, 37, 71, 73, 79, and 97.
>
> How many circular primes are there below one million?

`circularPrimeQ` 用来判断一个素数是不是循环素数：找出所有轮换后依次检查。然后遍历范围内所有素数即可。

```wl
circularPrimeQ[n_] := And @@ PrimeQ[
  FromDigits @ RotateLeft[IntegerDigits[n], #] & /@ Range[IntegerLength[n] - 1]]
Length @ Select[Prime @ Range @ PrimePi[1*^6], circularPrimeQ]
(* 55 *)
```

## 36. Double-base palindromes

> The decimal number, 585 = 1001001001<sub>2</sub> (binary), is palindromic in both bases.
>
> Find the sum of all numbers, less than one million, which are palindromic in base 10 and base 2.
>
> (Please note that the palindromic number, in either base, may not include leading zeros.)

[第 4 题](./2020-08-07-euler-1-10#4-largest-palindrome-product)已经用过了 `PalindromeQ`。它同样可以处理字符串，因此对二进制先用 `IntegerString` 转换一下再检查。

```wl
Total @ Select[Range[1*^6], PalindromeQ[#] && PalindromeQ @ IntegerString[#, 2] &]
(* 872187 *)
```

## 37. Truncatable primes

> The number 3797 has an interesting property. Being prime itself, it is possible to continuously remove digits from left to right, and remain prime at each stage: 3797, 797, 97, and 7. Similarly we can work from right to left: 3797, 379, 37, and 3.
>
> Find the sum of the only eleven primes that are both truncatable from left to right and right to left.
>
> NOTE: 2, 3, 5, and 7 are not considered to be truncatable primes.

`truncatablePrimeQ` 函数用一系列 `IntegerDigits` 和 `[[...]]` 得到左右截断后的数字，再逐个判断是否仍为素数。

接下来循环，初始值为 `{11, {}}`，第一项为素数（小于 11 的按题意忽略），第二项为满足 `truncatablePrimeQ = True` 的列表。列表长度达到 11 时停止循环。

```wl
truncatablePrimeQ[n_] := With[{digits = IntegerDigits[n]},
  And @@ PrimeQ[
    FromDigits /@ Catenate[{digits[[;;#]], digits[[#;;]]} & /@ Range[Length @ digits]]]
]
Total @ Last @ NestWhile[
  Apply[{NextPrime[#1], If[truncatablePrimeQ[#1], Append[#2, #1], #2]} &],
  {11, {}},
  Apply[Length[#2] < 11 &]
]
(* 748317 *)
```

## 38. Pandigital multiples

> Take the number 192 and multiply it by each of 1, 2, and 3:
>
> 192 × 1 = 192
> 192 × 2 = 384
> 192 × 3 = 576
> {.problem-example}
>
> By concatenating each product we get the 1 to 9 pandigital, 192384576. We will call 192384576 the concatenated product of 192 and (1,2,3)
>
> The same can be achieved by starting with 9 and multiplying by 1, 2, 3, 4, and 5, giving the pandigital, 918273645, which is the concatenated product of 9 and (1,2,3,4,5).
>
> What is the largest 1 to 9 pandigital 9-digit number that can be formed as the concatenated product of an integer with (1,2, ... , *n*) where *n* > 1?

所谓 concatenated product 显然只能有 `_|_|_|_|_|_|_|_|_`{.font-feature-calt-off}、`__|__|__|___`{.font-feature-calt-off}、`___|___|___`、`____|_____` 这么几种。手动先把第一个数字的范围算出来：9、25--33、100--333、5000--9999，然后和 1、2… 相乘。为了「简化」代码，这里用 [`CurryApplied`](https://reference.wolfram.com/language/ref/CurryApplied.html) 实施了柯里化操作。接着就是拆分数字、查找无重复项（用 [32 题](#32-pandigital-products)的 `pandigitalQ`）、合并数字、找最大值，都是套路，不再赘述。

```wl
With[{f = #2 -> Catenate[IntegerDigits[#2 * Range[#1]]] &},
  FromDigits /@ Select[DuplicateFreeQ[#] && FreeQ[#, 0] &] @ Association @ Flatten @
    {
      9 -> {9, 1, 8, 2, 7, 3, 6, 4, 5},
      MapThread[CurryApplied[f, 2][#1] /@ Range @@ #2 &] @
        Transpose @ {{4, {25, 33}}, {3, {100, 333}}, {2, {5000, 9999}}}
    }
] // TakeLargest[1]
(* <|9327 -> 932718654|> *)
```

不过可以发现，既然只要最大的数字，那开头必定为 9。题目列出来的 918273645 想想也知道不可能。因而上面的代码可以大大简化：

```wl
FromDigits /@ Select[DuplicateFreeQ[#] && FreeQ[#, 0] &] @ Association[
  # -> Catenate[IntegerDigits[# * {1, 2}]] & /@ Range[9123, 9876]] // TakeLargest[1]
(* <|9327 -> 932718654|> *)
```

注意因为无重复数字的要求，范围 5000--9999 也可以缩小为 9123--9876。

## 39. Integer right triangles

> If *p* is the perimeter of a right angle triangle with integral length sides, {a,b,c}, there are exactly three solutions for *p* = 120.
>
> \{20,48,52\}, \{24,45,51\}, \{30,40,50\}
> {.problem-example}
>
> For which value of *p* ≤ 1000, is the number of solutions maximised?

硬解丢番图方程也不是不行：

```wl
a + b + c /. TakeLargestBy[
  Solve[{a^2 + b^2 == c^2, a + b + c == #, 0 < a < b < c}, {a, b, c}, Integers] & /@ Range[1000],
  Length, 1][[1, 1]] // AbsoluteTiming
(* {25.1451, 840} *)
```

不过勾股数可以用[公式](https://zh.wikipedia.org/wiki/勾股数)生成：{*a* = *m*² - *n*², *b* = 2*mn*, *c* = *m*² + *n*²}。但如果要保证互素，还要对 *m*、*n* 做一些要求。我们先忽略这些，直接生成足够多的勾股数，然后再选出互素的 tuples；求和之后缩放，保证覆盖到 1--1000 的区间；最后排序、计数、求最大值。

```wl
With[{pyTriples = Select[Apply[CoprimeQ]] @ Catenate @
    Table[Sort[{m^2-n^2, 2m*n, m^2+n^2}], {m, 20}, {n, m-1}]},
  TakeLargestBy[#, Last, 1][[1, 1]] & @ Tally @ Sort @ Select[# < 1000 &] @
    Flatten[(Total /@ pyTriples) * # & /@ Range[83]]]
(* 840 *)
```

## 40. Champernowne's constant

> An irrational decimal fraction is created by concatenating the positive integers:
>
> 0.12345678910**1**{.problem-highlight}112131415161718192021...
> {.problem-example}
>
> It can be seen that the 12<sup>th</sup> digit of the fractional part is 1.
>
> If *d<sub>n</sub>* represents the *n*<sup>th</sup> digit of the fractional part, find the value of the following expression.
>
> *d*<sub>1</sub> × *d*<sub>10</sub> × *d*<sub>100</sub> × *d*<sub>1000</sub> × *d*<sub>10000</sub> × *d*<sub>100000</sub> × *d*<sub>1000000</sub>
> {.problem-example}
> <!-- HACK: fix markdown-it-attrs ambiguity -->

[ChampernowneNumber](https://reference.wolfram.com/language/ref/CurryApplied.html) 也是内置函数。注意用 `With` 避免重复计算。

```wl
Times @@ With[{n = RealDigits[N[ChampernowneNumber[], 1*^6]]}, n[[1, #]] & /@ PowerRange[1*^6]]
(* 210 *)
```
