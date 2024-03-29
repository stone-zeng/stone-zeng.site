---
title: Project Euler (21--30)
date: 2020-08-08
updated: 2020-08-10
excerpt: 欧拉计划 21--30 题。
---

## 21. Amicable numbers

> Let *d*(*n*) be defined as the sum of proper divisors of *n* (numbers less than *n* which divide evenly into *n*).
>
> If *d*(*a*) = *b* and *d*(*b*) = *a*, where *a* ≠ *b*, then *a* and *b* are an amicable pair and each of *a* and *b* are called amicable numbers.
>
> For example, the proper divisors of 220 are 1, 2, 4, 5, 10, 11, 20, 22, 44, 55 and 110; therefore *d*(220) = 284. The proper divisors of 284 are 1, 2, 4, 71 and 142; so *d*(284) = 220.
>
> Evaluate the sum of all the amicable numbers under 10000.

本题要寻找 10000 一下所有「[相亲数](https://en.wikipedia.org/wiki/Amicable_numbers)」之和。可以用 [`DivisorSigma`](https://reference.wolfram.com/language/ref/DivisorSigma.html) 计算所有因数的和。这里用了 *O*(*N*²) 的方法，比较笨，虽然编译到 C 以尽可能地加速但还是要跑两分钟：

```wl
(* Too slow! *)
findAmicablePairs = Compile[{{n, _Integer}},
  Module[{sum = 0, x},
    Do[
      x = i + j; If[DivisorSigma[1, i] == x && DivisorSigma[1, j] == x, sum += x],
      {j, n}, {i, j - 1}
    ];
    sum],
  CompilationTarget -> "C"];
findAmicablePairs[10000] // AbsoluteTiming
(* {119.510203, 31626} *)
```

实际上明明就有 [*O*(*N*) 的解法](https://euler.ea.chat/Lv0-炼气/21-30.html#p21-亲和数)，果然是我失了智了：

```wl
With[{f = DivisorSigma[1, #] - # &},
  Total @ DeleteCases[Select[Range[10000], f[f[#]] == # &], _?PerfectNumberQ]]
(* 31626 *)
```

## 22. Names scores

> Using [**names.txt**](https://projecteuler.net/project/resources/p022_names.txt) (right click and 'Save Link/Target As...'), a 46K text file containing over five-thousand first names, begin by sorting it into alphabetical order. Then working out the alphabetical value for each name, multiply this value by its alphabetical position in the list to obtain a name score.
>
> For example, when the list is sorted into alphabetical order, COLIN, which is worth 3 + 15 + 12 + 9 + 14 = 53, is the 938th name in the list. So, COLIN would obtain a score of 938 × 53 = 49714.
>
> What is the total of all the name scores in the file?

数据拿到之后先清洗一下（没事加 `"` 干什么……），切成单词用 [`ToCharacterCode`](https://reference.wolfram.com/language/ref/ToCharacterCode.html) 转成 ASCII 码，再减掉 `64`（`A` 是 65）得到字母顺序值。[`MapIndexed`](https://reference.wolfram.com/language/ref/MapIndexed.html) 类似 Python 的 [`enumerate`](https://docs.python.org/3/library/functions.html#enumerate)，可以同时作用在值和下标上。

```wl
With[{data = Import["https://projecteuler.net/project/resources/p022_names.txt", "String"]},
  Total @ Flatten @ MapIndexed[Total[ToCharacterCode[#1] - 64] * #2 &] @
    Sort @ StringSplit[StringDelete[data, "\""], ","]]
(* 871198282 *)
```

## 23. Non-abundant sums

> A perfect number is a number for which the sum of its proper divisors is exactly equal to the number. For example, the sum of the proper divisors of 28 would be 1 + 2 + 4 + 7 + 14 = 28, which means that 28 is a perfect number.
>
> A number *n* is called deficient if the sum of its proper divisors is less than *n* and it is called abundant if this sum exceeds *n*.
>
> As 12 is the smallest abundant number, 1 + 2 + 3 + 4 + 6 = 16, the smallest number that can be written as the sum of two abundant numbers is 24. By mathematical analysis, it can be shown that all integers greater than 28123 can be written as the sum of two abundant numbers. However, this upper limit cannot be reduced any further by analysis even though it is known that the greatest number that cannot be expressed as the sum of two abundant numbers is less than this limit.
>
> Find the sum of all the positive integers which cannot be written as the sum of two abundant numbers.

「[过剩数](https://en.wikipedia.org/wiki/Abundant_number)」同样用 `DivisorSigma` 函数检查。找到过剩数的列表生成出全部可能的和，再做一下补集运算：

```wl
With[{n = 28123},
  Total @ Complement[Range[n], Union[Total /@ Subsets[#, {2}], 2#]] & @
    Select[Range[n], DivisorSigma[1, #] > 2# &]]
(* 4179871 *)
```

## 24. Lexicographic permutations

> A permutation is an ordered arrangement of objects. For example, 3124 is one possible permutation of the digits 1, 2, 3 and 4. If all of the permutations are listed numerically or alphabetically, we call it lexicographic order. The lexicographic permutations of 0, 1 and 2 are:
>
> 012&emsp;021&emsp;102&emsp;120&emsp;201&emsp;210
> {.problem-example}
>
> What is the millionth lexicographic permutation of the digits 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9?

默认的 [`Permutations`](https://reference.wolfram.com/language/ref/Permutations.html) 其实就是按字典序产生的（虽然文档没说，但试几下就可以确定了）。

```wl
FromDigits @ Part[Permutations[Range[0, 9]], 1*^6]
(* 2783915460 *)
```

## 25. 1000-digit Fibonacci number

> The Fibonacci sequence is defined by the recurrence relation:
>
> *F*<sub>*n*</sub> = *F*<sub>*n*-1</sub> + *F*<sub>*n*-2</sub>,&emsp;where *F*<sub>1</sub> = 1 and *F*<sub>2</sub> = 1.
> {.problem-example}
>
> Hence the first 12 terms will be:
>
> *F*<sub>1</sub>  = 1
> *F*<sub>2</sub>  = 1
> *F*<sub>3</sub>  = 2
> *F*<sub>4</sub>  = 3
> *F*<sub>5</sub>  = 5
> *F*<sub>6</sub>  = 8
> *F*<sub>7</sub>  = 13
> *F*<sub>8</sub>  = 21
> *F*<sub>9</sub>  = 34
> *F*<sub>10</sub> = 55
> *F*<sub>11</sub> = 89
> *F*<sub>12</sub> = 144
> {.problem-example}
>
> The 12th term, *F*<sub>12</sub>, is the first term to contain three digits.
>
> What is the index of the first term in the Fibonacci sequence to contain 1000 digits?

Fibonacci 序列和数字位数都有默认函数。不定长的循环可以用 [`NestWhile`](https://reference.wolfram.com/language/ref/NestWhile.html) 实现。

```wl
NestWhile[# + 1 &, 1, IntegerLength[Fibonacci[#]] < 1000 &]
(* 4782 *)
```

## 26. Reciprocal cycles

> A unit fraction contains 1 in the numerator. The decimal representation of the unit fractions with denominators 2 to 10 are given:
>
> <span class="font-feature-frac">1/2</span>  = 0.5
> <span class="font-feature-frac">1/3</span>  = 0.(3)
> <span class="font-feature-frac">1/4</span>  = 0.25
> <span class="font-feature-frac">1/5</span>  = 0.2
> <span class="font-feature-frac">1/6</span>  = 0.1(6)
> <span class="font-feature-frac">1/7</span>  = 0.(142857)
> <span class="font-feature-frac">1/8</span>  = 0.125
> <span class="font-feature-frac">1/9</span>  = 0.(1)
> <span class="font-feature-frac">1/10</span> = 0.1
> {.problem-example}
>
> Where 0.1(6) means 0.166666..., and has a 1-digit recurring cycle. It can be seen that <span class="font-feature-frac">1/7</span> has a 6-digit recurring cycle.
>
> Find the value of *d* < 1000 for which 1/*d* contains the longest recurring cycle in its decimal fraction part.

[`RealDigits`](https://reference.wolfram.com/language/ref/RealDigits.html) 中包含了循环节的信息。有限小数不包含这个循环节的列表，长度为 0，因此可以统一处理。

```wl
First @ MaximalBy[Range[1000], Length @ RealDigits[1 / #][[1, 1]] &]
(* 983 *)
```

## 27. Quadratic primes

> Euler discovered the remarkable quadratic formula:
>
> *n*² + *n* + 41
> {.problem-example}
>
> It turns out that the formula will produce 40 primes for the consecutive integer values 0 ≤ *n* ≤ 39. However, when *n* = 40, 40² + 40 + 41 = 40&nbsp;(40 + 1) is divisible by 41, and certainly when *n* = 41, 41² + 41 + 41 is clearly divisible by 41.
>
> The incredible formula *n*² &minus; 79*n* + 1601 was discovered, which produces 80 primes for the consecutive values 0 ≤ *n* ≤ 79. The product of the coefficients, &minus;79 and 1601, is &minus;126479.
>
> Considering quadratics of the form:
>
> *n*² + *an* + *b*, where |*a*| < 1000 and |*b*| ≤ 1000
> {.problem-example}
>
> where |*n*| is the modulus/absolute value of *n*. e.g. |11| = 11 and |&minus;4| = 4
>
> Find the product of the coefficients, *a* and *b*, for the quadratic expression that produces the maximum number of primes for consecutive values of *n*, starting with *n* = 0.

给定 `a`、`b` 之后，`qPrimesCount` 函数给出对应二次函数所能生成的最大素数。剩下来的事情便是枚举了。若要 *n* = 0 时为素数，必然要求 `b` 为素数。稍微检查一下即可知道 2 不可能，因此 `b` 为奇素数。继而又可以推出 `a` 也为奇数。这样枚举范围就可以大大缩小。

```wl
qPrimesCount[a_, b_] := NestWhile[# + 1 &, 0, PrimeQ[#^2 + a # + b] &]
Times @@ First @ MaximalBy[Apply[qPrimesCount]] @ Catenate @
  Table[{a, b}, {a, Range[-999, 999, 2]}, {b, Prime @ Range[2, PrimePi[1000]]}]
(* -59231 *)
```

## 28. Number spiral diagonals

> Starting with the number 1 and moving to the right in a clockwise direction a 5 by 5 spiral is formed as follows:
>
> **21**{.problem-highlight} 22 23 24 **25**{.problem-highlight}
> 20 &nbsp;**7**{.problem-highlight} &nbsp;8 &nbsp;**9**{.problem-highlight} 10
> 19 &nbsp;6 &nbsp;**1**{.problem-highlight} &nbsp;2 11
> 18 &nbsp;**5**{.problem-highlight} &nbsp;4 &nbsp;**3**{.problem-highlight} 12
> **17**{.problem-highlight} 16 15 14 **13**{.problem-highlight}
> {.problem-input}
>
> It can be verified that the sum of the numbers on the diagonals is 101.
>
> What is the sum of the numbers on the diagonals in a 1001 by 1001 spiral formed in the same way?

易见右上角的数字为 *n*²，进而可以推出四个角对应的公式。代值计算，最后补上中心位置的 1 即可。

```wl
Total[Total[n^2 - (n-1) * Range[0, 3]] /. n -> Range[3, 1001, 2]] + 1
(* 669171001 *)
```

## 29. Distinct powers

> Consider all integer combinations of *ab* for 2 ≤ *a* ≤ 5 and 2 ≤ *b* ≤ 5:
>
> 2² = 4,  2³ = 8,   2⁴ = 16,  2⁵ = 32
> 3² = 9,  3³ = 27,  3⁴ = 81,  3⁵ = 243
> 4² = 16, 4³ = 64,  4⁴ = 256, 4⁵ = 1024
> 5² = 25, 5³ = 125, 5⁴ = 625, 5⁵ = 3125
> {.problem-example}
>
> If they are then placed in numerical order, with any repeats removed, we get the following sequence of 15 distinct terms:
>
> 4, 8, 9, 16, 25, 27, 32, 64, 81, 125, 243, 256, 625, 1024, 3125
> {.problem-example}
>
> How many distinct terms are in the sequence generated by ab for 2 ≤ a ≤ 100 and 2 ≤ b ≤ 100?

直接打表计算，用 `Union` 移除重复项。

```wl
Union @@ Table[a^b, {a, 2, 100}, {b, 2, 100}] // Length
(* 9183 *)
```

## 30. Digit fifth powers

> Surprisingly there are only three numbers that can be written as the sum of fourth powers of their digits:
>
> 1634 = 1⁴ + 6⁴ + 3⁴ + 4⁴
> 8208 = 8⁴ + 2⁴ + 0⁴ + 8⁴
> 9474 = 9⁴ + 4⁴ + 7⁴ + 4⁴
> {.problem-example}
>
> As 1 = 1⁴ is not a sum it is not included.
>
> The sum of these numbers is 1634 + 8208 + 9474 = 19316.
>
> Find the sum of all the numbers that can be written as the sum of fifth powers of their digits.

先用 `IntegerDigits` 得到各位数字（它和上面的 `FromDigits` 互逆），算 5 次方求和再和原数字相比较。别忘了最后扔掉 1。乘方这样的基本操作都是可以直接作用在列表上的，不需要额外用 `/@`。

这里选择的上界 `2*^5` 是盲猜的，但其实也[很容易找到比较确切的值](https://euler.ea.chat/Lv0-炼气/21-30.html#p30-各位数字的五次幂)。

```wl
Total @ Select[{#, Total[IntegerDigits[#]^5]} & /@ Range[2*^5], Apply[#1 == #2 &]][[2;;, 1]]
(* 443839 *)
```
