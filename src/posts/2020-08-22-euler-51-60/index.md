---
title: Project Euler (51--60)
date: 2020-08-22
excerpt: 欧拉计划 51--60 题。
---

## 51. Prime digit replacements

> By replacing the 1<sup>st</sup> digit of the 2-digit number *3, it turns out that six of the nine possible values: 13, 23, 43, 53, 73, and 83, are all prime.
>
> By replacing the 3<sup>rd</sup> and 4<sup>th</sup> digits of 56**3 with the same digit, this 5-digit number is the first example having seven primes among the ten generated numbers, yielding the family: 56003, 56113, 56333, 56443, 56663, 56773, and 56993. Consequently 56003, being the first member of this family, is the smallest prime with this property.
>
> Find the smallest prime which, by replacing part of the number (not necessarily adjacent digits) with the same digit, is part of an eight prime value family.

思路是列出所有的素数以及所有可能的 pattern，然后分组、统计列表长度。这里的 pattern 也就是替换规则，3 位数的话有

```wl
{{x_, _, _}, {_, x_, _}, {x_, x_, _}}
```

其中 `x_` 表示允许被换成其他数字的位置。`getPatterns` 函数除了给出上面的 patterns，还包括了剩余数字的位置，以便 `GatherBy` 进行分组。例如 `getPatterns[3]` 给出

```wl
{{{x_, _, _}, {2, 3}}, {{_, x_, _}, {1, 3}}, {{x_, x_, _}, {3}}}
```

一开始写错了规则，搜到了 9 位数还是没有结果，作了一点小弊搜别人的答案发现只有 6 位数，好吧。

```wl
length = 8;
getPatterns[n_] := {ReplacePart[Table[_, n], Thread[# -> x_]], Complement[Range[n], #]} & /@
  Subsets[Range[n - 1], {1, n - 1}]
getDigits[n_] := IntegerDigits @ Prime @ Range[PrimePi[10^(n - 1)] + 1, PrimePi[10^n]]
FromDigits /@ Catch @ Do[
  With[{digits = getDigits[n]}, Do[
    With[{pattern = First @ p, pos = Last @ p},
      If[Length[#] == length, Throw[#]] & /@
        GatherBy[Cases[digits, pattern], #[[pos]] &]],
    {p, getPatterns[n]}]],
  {n, 2, 8}]
(* {121313, 222323, 323333, 424343, 525353, 626363, 828383, 929393} *)
```

## 52. Permuted multiples

> It can be seen that the number, 125874, and its double, 251748, contain exactly the same digits, but in a different order.
>
> Find the smallest positive integer, *x*, such that 2*x*, 3*x*, 4*x*, 5*x*, and 6*x*, contain the same digits.

现在发现 `Do` 循环还挺好用的嘛。题目依然是 `IntegerDigits` 的常规套路，不过这个答案 142857，[很熟悉啊](https://www.zhihu.com/question/19761522/answer/197503061)。

```wl
Catch @ Do[If[Equal @@ Sort /@ IntegerDigits[j * {2, 3, 4, 5, 6}], Throw[j]],
  {i, PowerRange[1*^5]}, {j, i, 5i / 3}]
(* 142857 *)
```

## 53. Combinatoric selections

> There are exactly ten ways of selecting three from five, 12345:
>
> 123, 124, 125, 134, 135, 145, 234, 235, 245, and 345
> {.problem-example}
>
> In combinatorics, we use the notation, $\binom53$ = 10.
>
> In general, $\binom nr = \frac{n!}{r!(n-r)!}$, where *r* ≤ *n*, *n*! = *n* × (*n*-1) × … × 3 × 2 × 1, and 0! = 1.
>
> It is not until *n* = 23, that a value exceeds one-million: $\binom{23}{10}$ = 1144066.
>
> How many, not necessarily distinct, values of $\binom nr$ for 1 ≤ *n* ≤ 100, are greater than one-million?

直接打表 + 计数：

```wl
Count[Flatten @ Table[Binomial[i, j], {i, 100}, {j, i}], _?(# > 1*^6 &)]
(* 4075 *)
```

## 54. Poker hands

> In the card game poker, a hand consists of five cards and are ranked, from lowest to highest, in the following way:
>
> - **High Card**: Highest value card.
> - **One Pair**: Two cards of the same value.
> - **Two Pairs**: Two different pairs.
> - **Three of a Kind**: Three cards of the same value.
> - **Straight**: All cards are consecutive values.
> - **Flush**: All cards of the same suit.
> - **Full House**: Three of a kind and a pair.
> - **Four of a Kind**: Four cards of the same value.
> - **Straight Flush**: All cards are consecutive values of same suit.
> - **Royal Flush**: Ten, Jack, Queen, King, Ace, in same suit.
>
> The cards are valued in the order:
>
> 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace.
> {.problem-example}
>
> If two players have the same ranked hands then the rank made up of the highest value wins; for example, a pair of eights beats a pair of fives (see example 1 below). But if two ranks tie, for example, both players have a pair of queens, then highest cards in each hand are compared (see example 4 below); if the highest cards tie then the next highest cards are compared, and so on.
>
> Consider the following five hands dealt to two players:
>
> | Hand | Player 1          | Player 2            | Winner   |
> |:----:|:-----------------:|:-------------------:|:--------:|
> | 1    | 5H 5C 6S 7S KD    | 2C 3S 8S 8D TD      | Player 2 | \
> |      | Pair of Fives     | Pair of Eights      |          |
> | 2    | 5D 8C 9S JS AC    | 2C 5C 7D 8S QH      | Player 1 | \
> |      | Highest card Ace  | Highest card Queen  |          |
> | 3    | 2D 9C AS AH AC    | 3D 6D 7D TD QD      | Player 2 | \
> |      | Three Aces        | Flush with Diamonds |          |
> | 4    | 4D 6S 9H QH QC    | 3D 6D 7H QD QS      | Player 1 | \
> |      | Pair of Queens    | Pair of Queens      |          | \
> |      | Highest card Nine | Highest card Seven  |          |
> | 5    | 2H 2D 4C 4D 4S    | 3C 3D 3S 9S 9D      | Player 1 | \
> |      | Full House        | Full House          |          | \
> |      | With Three Fours  | with Three Threes   |          |
>
> The file, [**poker.txt**](https://projecteuler.net/project/resources/p054_poker.txt), contains one-thousand random hands dealt to two players. Each line of the file contains ten cards (separated by a single space): the first five are Player 1's cards and the last five are Player 2's cards. You can assume that all hands are valid (no invalid characters or repeated cards), each player's hand is in no specific order, and in each hand there is a clear winner.
>
> How many hands does Player 1 win?

看到题目这么长就不想做了，虽然明明是很好玩的一题。

最直接的思路就是根据输入匹配到对应的牌型，再计算出牌值。本题一共给出了 10 种牌型，可以利用模式匹配的方法逐一检测：

```wl
pokerValue[list_] := Flatten[$pokerValue @@ Sort[list /. rules]]
rules = Join @@ Thread /@
  {CharacterRange["2", "9"] -> Range[2, 9], {"T", "J", "Q", "K", "A"} -> Range[10, 14]};
(* Royal Flush *)
$pokerValue[{10, s_}, {11, s_}, {12, s_}, {13, s_}, {14, s_}] := {9}
(* Straight Flush *)
$pokerValue[{a_, s_}, {b_, s_}, {c_, s_}, {d_, s_}, {e_, s_}] :=
  {8, {e, d, c, b, a}} /; {a, b, c, d, e} == a + Range[0, 4]
(* Four of a Kind *)
$pokerValue[{a_, _}, {b_, _}, {c_, _}, {d_, _}, {e_, _}] :=
  {7, Keys @ ReverseSort @ Counts[{a, b, c, d, e}]} /;
    Values @ Sort @ Counts[{a, b, c, d, e}] == {1, 4}
(* Full House *)
$pokerValue[{a_, _}, {b_, _}, {c_, _}, {d_, _}, {e_, _}] :=
  {6, Keys @ ReverseSort @ Counts[{a, b, c, d, e}]} /;
    Values @ Sort @ Counts[{a, b, c, d, e}] == {2, 3}
(* Flush *)
$pokerValue[{a_, s_}, {b_, s_}, {c_, s_}, {d_, s_}, {e_, s_}] :=
  {5, {e, d, c, b, a}}
(* Straight *)
$pokerValue[{a_, _}, {b_, _}, {c_, _}, {d_, _}, {e_, _}] :=
  {4, {e, d, c, b, a}} /; {a, b, c, d, e} == a + Range[0, 4]
$pokerValue[{a_, _}, {b_, _}, {c_, _}, {d_, _}, {e_, _}] := With[
  {counts = ReverseSort @ Counts[{a, b, c, d, e}]},
  Switch[Values[counts],
    (* Three of a Kind *)
    {3, 1, 1},       {3, First[#], ReverseSort @ Rest[#]},
    (* Two Pairs *)
    {2, 2, 1},       {2, ReverseSort @ Most[#], Last[#]},
    (* One Pair *)
    {2, 1, 1, 1},    {1, First[#], ReverseSort @ Rest[#]},
    (* High Card *)
    {1, 1, 1, 1, 1}, {0, {e, d, c, b, a}}
  ] & @ Keys[counts]
]
```

输入 5 组手牌，每组包括牌面（数字 2--14）和花色（字符 C、D、H、S），返回一个牌型和对应手牌的列表，注意匹配的时候要从牌值较高的模式开始。开始拿到的输入是字符列表，要预先处理成需要的格式。输出时最后压平列表，便于后面比较。举例如下：

```wl
pokerValue[{{"5", "H"}, {"5", "C"}, {"6", "S"}, {"7", "S"}, {"K", "D"}}]
(* {1, 5, 13, 7, 6} *)
```

它表示这组牌包含一个 5 的对子，剩下三张牌从大到小依次为 13、7 和 6。

接下来要比较玩家 1 和玩家 2 的手牌，只要对 `pokerValue` 返回的列表逐一进行比较即可。题目已说明必有获胜者，因此忽略平局。

```wl
playerOneWinQ[list1_, list2_] := FirstCase[
  Subtract @@ PadRight[pokerValue /@ {list1, list2}], Except[0]] > 0
```

最后下载数据，分组之后喂给上面的函数处理：

```wl
data = Partition[Characters /@ #, 5] & /@
  Import["https://projecteuler.net/project/resources/p054_poker.txt", "Table"];
Count[playerOneWinQ @@@ data, True]
(* 376 *)
```

## 55. Lychrel numbers

> If we take 47, reverse and add, 47 + 74 = 121, which is palindromic.
>
> Not all numbers produce palindromes so quickly. For example,
>
> 349 + 943 = 1292
> 1292 + 2921 = 4213
> 4213 + 3124 = 7337
> {.problem-example}
>
> That is, 349 took three iterations to arrive at a palindrome.
>
> Although no one has proved it yet, it is thought that some numbers, like 196, never produce a palindrome. A number that never forms a palindrome through the reverse and add process is called a Lychrel number. Due to the theoretical nature of these numbers, and for the purpose of this problem, we shall assume that a number is Lychrel until proven otherwise. In addition you are given that for every number below ten-thousand, it will either (i) become a palindrome in less than fifty iterations, or, (ii) no one, with all the computing power that exists, has managed so far to map it to a palindrome. In fact, 10677 is the first number to be shown to require over fifty iterations before producing a palindrome: 4668731596684224866951378664 (53 iterations, 28-digits).
>
> Surprisingly, there are palindromic numbers that are themselves Lychrel numbers; the first example is 4994.
>
> How many Lychrel numbers are there below ten-thousand?
>
> NOTE: Wording was modified slightly on 24 April 2007 to emphasise the theoretical nature of Lychrel numbers.

每个数最多迭代 50 次，毫无压力。不过迭代的时候要别忘了把起始值扔掉：

```wl
With[{f = # + IntegerReverse[#] &},
  Length @ Select[GreaterThan[50]] @
    Table[Length @ NestWhileList[f, f[n], Not @* PalindromeQ, 1, 50], {n, 10000}]]
(* 249 *)
```

## 56. Powerful digit sum

> A googol (10¹⁰⁰) is a massive number: one followed by one-hundred zeros; 100¹⁰⁰ is almost unimaginably large: one followed by two-hundred zeros. Despite their size, the sum of the digits in each number is only 1.
>
> Considering natural numbers of the form, *a<sup>b</sup>*, where *a*, *b* < 100, what is the maximum digital sum?

又是一道送分题……

```wl
Max[Total /@ IntegerDigits @ Flatten @ Array[Power, {100, 100}]]
(* 972 *)
```

## 57. Square root convergents

> It is possible to show that the square root of two can be expressed as an infinite continued fraction.
>
> $$ \sqrt2 = 1+\cfrac{1}{2+\cfrac{1}{2+\cfrac{1}{2+\cdots}}} $$
>
> By expanding this for the first four iterations, we get:
>
> $1+\frac12 = \frac32 = 1.5$
> $1+\frac{1}{2+\frac12} = \frac75 = 1.4$
> $1+\frac{1}{2+\frac{1}{2+\frac12}} = \frac{17}{12} = 1.41666\cdots$
> $1+\frac{1}{2+\frac{1}{2+\frac{1}{2+\frac12}}} = \frac{41}{29} = 1.41379\cdots$
> {.problem-example}
>
> The next three expansions are $\frac{99}{70}$, $\frac{239}{169}$ and $\frac{577}{408}$, but the eighth expansion, $\frac{1393}{985}$, is the first example where the number of digits in the numerator exceeds the number of digits in the denominator.
>
> In the first one-thousand expansions, how many fractions contain a numerator with more digits than the denominator?

连分数展开和重建都有内置函数，之后再检查一下分子分母。不过 `FromContinuedFraction` 似乎不是很快，之前看成前 10000 项居然算了半分钟。

```wl
With[{n = 1000 + 1}, Length @ DeleteCases[{x_, x_}] @ Map[
  IntegerLength @* NumeratorDenominator,
  FromContinuedFraction[Take[ContinuedFraction[Sqrt[2], n], #]] & /@ Range[2, n]]]
(* 153 *)
```

## 58. Spiral primes

> Starting with 1 and spiralling anticlockwise in the following way, a square spiral with side length 7 is formed.
>
> **37**{.problem-highlight} 36 35 34 33 32 **31**{.problem-highlight}
> 38 **17**{.problem-highlight} 16 15 14 **13**{.problem-highlight} 30
> 39 18 &nbsp;**5**{.problem-highlight} &nbsp;4 &nbsp;**3**{.problem-highlight} 12 29
> 40 19 &nbsp;6 &nbsp;1 &nbsp;2 11 28
> 41 20 &nbsp;**7**{.problem-highlight} &nbsp;8 &nbsp;9 10 27
> 42 21 22 23 24 25 26
> **43**{.problem-highlight} 44 45 46 47 48 49
> {.problem-input}
>
> It is interesting to note that the odd squares lie along the bottom right diagonal, but what is more interesting is that 8 out of the 13 numbers lying along both diagonals are prime; that is, a ratio of 8/13 ≈ 62%.
>
> If one complete new layer is wrapped around the spiral above, a square spiral with side length 9 will be formed. If this process is continued, what is the side length of the square spiral for which the ratio of primes along both diagonals first falls below 10%?

和[第 28 题](./2020-08-08-euler-21-30#28-number-spiral-diagonals)完全一样的公式，只是要注意一下边界：

```wl
First @ NestWhile[
  Apply[{#1 + 2, #2 + Count[(#1 + 2)^2 - {0,1,2,3} * (#1 + 1), _?PrimeQ]} &],
  {3, 3},
  Apply[#2 / (2#1 - 1) > 0.1 &]]
(* 26241 *)
```

## 59. XOR decryption

> Each character on a computer is assigned a unique code and the preferred standard is ASCII (American Standard Code for Information Interchange). For example, uppercase A = 65, asterisk (*) = 42, and lowercase k = 107.
>
> A modern encryption method is to take a text file, convert the bytes to ASCII, then XOR each byte with a given value, taken from a secret key. The advantage with the XOR function is that using the same encryption key on the cipher text, restores the plain text; for example, 65 XOR 42 = 107, then 107 XOR 42 = 65.
>
> For unbreakable encryption, the key is the same length as the plain text message, and the key is made up of random bytes. The user would keep the encrypted message and the encryption key in different locations, and without both "halves", it is impossible to decrypt the message.
>
> Unfortunately, this method is impractical for most users, so the modified method is to use a password as a key. If the password is shorter than the message, which is likely, the key is repeated cyclically throughout the message. The balance for this method is using a sufficiently long password key for security, but short enough to be memorable.
>
> Your task has been made easy, as the encryption key consists of three lower case characters. Using [**p059_cipher.txt**](https://projecteuler.net/project/resources/p059_cipher.txt) (right click and 'Save Link/Target As...'), a file containing the encrypted ASCII codes, and the knowledge that the plain text must contain common English words, decrypt the message and find the sum of the ASCII values in the original text.

解密本身并没有什么难度，先列出所有的 key，再用 [`BitXor`](https://reference.wolfram.com/language/ref/BitXor.html) 按位异或。问题在于 “common English words” 实在是没法给出精确定义啊，差一点都想上机器学习了。

好在 Mathematica 自带了词典，可以用 [`TextWords`](https://reference.wolfram.com/language/ref/TextWords.html) 切分出单词之后再利用 [`DictionaryWordQ`](https://reference.wolfram.com/language/ref/DictionaryWordQ.html) 检查。这里只取了前 20 个字符，太多的话，反而因为原来的文本里面有些拉丁语单词没法识别。

```wl
data = First @ Import["https://projecteuler.net/project/resources/p059_cipher.txt", "CSV"];
tuples = Tuples[Flatten @ ToCharacterCode @ CharacterRange["a", "z"], 3];
xorSequence[ker_, list_] := MapThread[BitXor, {PadRight[ker, Length[list], ker], list}]
AbsoluteTiming[text = With[{list = data[[;;20]]},
  Association @ Table[
    FromCharacterCode[k] -> TextWords @ FromCharacterCode @ xorSequence[k, list], {k, tuples}]];]
(* {61.324286, Null} *)

Select[text, AllTrue[DictionaryWordQ]]
(* <|"exp" -> {"An", "extract", "taken", "fro"}|> *)

Total @ xorSequence[ToCharacterCode["exp"], data]
(* 129448 *)
```

解密后的明文如下：

```wl
FromCharacterCode @ xorSequence[ToCharacterCode["exp"], data]
(*
An extract taken from the introduction of one of Euler's most celebrated papers, "De summis
serierum reciprocarum" [On the sums of series of reciprocals]: I have recently found, quite
unexpectedly, an elegant expression for the entire sum of this series 1 + 1/4 + 1/9 + 1/16 +
etc., which depends on the quadrature of the circle, so that if the true sum of this series is
obtained, from it at once the quadrature of the circle follows. Namely, I have found that the sum
of this series is a sixth part of the square of the perimeter of the circle whose diameter is 1;
or by putting the sum of this series equal to s, it has the ratio sqrt(6) multiplied by s to 1 of
the perimeter to the diameter. I will soon show that the sum of this series to be approximately
1.644934066842264364; and from multiplying this number by six, and then taking the square root, the
number 3.141592653589793238 is indeed produced, which expresses the perimeter of a circle whose
diameter is 1. Following again the same steps by which I had arrived at this sum, I have
discovered that the sum of the series 1 + 1/16 + 1/81 + 1/256 + 1/625 + etc. also depends on the
quadrature of the circle. Namely, the sum of this multiplied by 90 gives the biquadrate (fourth
power) of the circumference of the perimeter of a circle whose diameter is 1. And by similar
reasoning I have likewise been able to determine the sums of the subsequent series in which the
exponents are even numbers.
*)
```

## 60. Prime pair sets

> The primes 3, 7, 109, and 673, are quite remarkable. By taking any two primes and concatenating them in any order the result will always be prime. For example, taking 7 and 109, both 7109 and 1097 are prime. The sum of these four primes, 792, represents the lowest sum for a set of four primes with this property.
>
> Find the lowest sum for a set of five primes for which any two primes concatenate to produce another prime.

长度为 5 的素数对其中任意 4 个必然也是满足要求的。因此倒过来考虑：先筛出长度为 2 的素数对，再求子集、筛出长度为 3 的素数对……直到找出长度为 5 的素数对。不过这个子集有点夸张啊。不管这么多，直接扔服务器上面跑，内存大概要占到 20GB。改成 `Do` 循环应该可以避开内存分配，不过会稍慢。

```wl
pairPrimesQ[list_] := AllTrue[Permutations[list, {2}], $pairPrimesQ]
$pairPrimesQ[{a_, b_}] := PrimeQ[a * 10^IntegerLength[b] + b]

Print["time(x1) = ", First  @ AbsoluteTiming[x1 = Prime @ Range[2, PrimePi @ 1000]]]
Print["len(x1)  = ", Length @ x1]
Print["time(x2) = ", First  @ AbsoluteTiming[x2 = Select[Subsets[x1, {2}], pairPrimesQ]]]
Print["len(x2)  = ", Length @ x2];
Print["time(x3) = ", First  @ AbsoluteTiming[x3 = Union[Union @@@ Subsets[x2, {2}]]]]
Print["len(x3)  = ", Length @ x3];
Print["time(x4) = ", First  @ AbsoluteTiming[x4 = Select[x3, Length[#] == 3 && pairPrimesQ[#] &]]]
Print["len(x4)  = ", Length @ x4];
Print["time(x5) = ", First  @ AbsoluteTiming[x5 = Union[Union @@@ Subsets[x4, {2}]]]]
Print["len(x5)  = ", Length @ x5];
Print["time(x6) = ", First  @ AbsoluteTiming[x6 = Select[x5, Length[#] == 4 && pairPrimesQ[#] &]]]
Print["len(x6)  = ", Length @ x6];
Print["time(x7) = ", First  @ AbsoluteTiming[x7 = Union[Union @@@ Subsets[x6, {2}]]]]
Print["len(x7)  = ", Length @ x7];

Print["x8 = ", x8 = Select[x7, Length[#] == 5 && pairPrimesQ[#] &];];
Total @ First[x8]

(* 26033 *)
```

中间输出如下：

```wl
time(x1) = 0.000826
len(x1)  = 1228
time(x2) = 3.457
len(x2)  = 18176
time(x3) = 224.041
len(x3)  = 164916830
time(x4) = 142.298
len(x4)  = 9904
time(x5) = 76.4542
len(x5)  = 49030466
time(x6) = 41.6975
len(x6)  = 294
time(x7) = 0.0596
len(x7)  = 43057
x8 = {{13, 5197, 5701, 6733, 8389}}
```

这个时间不太行呀。照例[跟酱紫君对答案](https://euler.ea.chat/Lv0-炼气/51-60.html#p60-素数对的集合)：

> 我们可以先写个朴素的判定：
>
> ```wl
> foo[{a_,b_}]:=FromDigits[IntegerDigits@a~Join~IntegerDigits@b];
> fooQ=PrimeQ[foo@#]&&PrimeQ[foo@Reverse@#]&;
> ```
>
> 一个素数二元组正反连起来还是个素数。然后我们可以试一个范围比如一万以下的质数。
>
> 炫酷的事情来了，我们把这些个二元组组成一个无向图，于是有关系的点就会成团，我们只要找正好含有 5 个点的团就行了！
>
> ```wl
> data=Select[Prime@Range@PrimePi@1*^4~Subsets~{2},fooQ];
> Plus@@@FindClique[Graph[UndirectedEdge@@@data],{5}]
> ```

这是什么神仙操作……
