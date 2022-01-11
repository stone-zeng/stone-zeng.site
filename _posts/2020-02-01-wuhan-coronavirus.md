---
layout: post
title: 新型冠状病毒肺炎疫情统计
date: 2020-02-01
last_modified_at: 2020-03-01
math: true
description: 新年伊始，肺炎疫情从武汉蔓延至全国乃至世界各地，形势越发严峻。这里简要罗列一些数据，并且据此给出（未必非常靠谱）的预测。
---

新年伊始，肺炎疫情从武汉蔓延至全国乃至世界各地，形势越发严峻。这里简要罗列一些数据，并且据此给出（未必非常靠谱）的预测。

本文数据见 [2019-nCoV-data.csv](https://github.com/stone-zeng/stone-zeng.github.io/blob/master/src/wuhan-coronavirus/2019-nCoV-data.csv)，来源于[^2019-nCoV-wiki][^2019-nCoV-tg]。绘图及拟合代码见 [2019-nCoV.wl](https://github.com/stone-zeng/stone-zeng.github.io/blob/master/src/wuhan-coronavirus/2019-nCoV.wl)。

[^2019-nCoV-wiki]: [2019 新型冠状病毒中国大陆病例 - 维基百科](https://zh.wikipedia.org/wiki/2019新型冠状病毒中国大陆病例)。由于统计口径差异等原因，新增病例数之和与累计病例数、各省市数据之和与全国数据均略有出入。
[^2019-nCoV-tg]: [2019-nCoV 疫情实时播报](https://t.me/nCoV2019)

说明：

- 统计数据截至 **2020 年 2 月 29 日**
- 2 月 13 日，湖北省将临床诊断病例数纳入确诊病例数进行公布[^hubei-02-13]

[^hubei-02-13]: 湖北省卫生健康委员会. [2020 年 2 月 12 日湖北省新冠肺炎疫情情况](https://wjw.hubei.gov.cn/bmdt/ztzl/fkxxgzbdgrfyyq/xxfb/202002/t20200213_2025580.shtml)

## 时间序列分析

深色曲线为实际数据，浅色曲线为预测数据，阴影部分为 95% 置信区间。

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-new.svg" alt="2019-nCoV-new" style="width: 54%;" class="invert">
  <img src="/images/wuhan-coronavirus/2019-nCoV-new-log.svg" alt="2019-nCoV-new-log" style="width: 44%;" class="invert">
  <figcaption>新增确诊病例统计（左：线性坐标，右：对数坐标，下同）</figcaption>
</figure>

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-total.svg" alt="2019-nCoV-total" style="width: 49%;" class="invert">
  <img src="/images/wuhan-coronavirus/2019-nCoV-total-log.svg" alt="2019-nCoV-total-log" style="width: 49%;" class="invert">
  <figcaption>累计确诊病例统计</figcaption>
</figure>

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-new-death-recovered.svg" alt="2019-nCoV-new-death-recovered" style="width: 49%;" class="invert">
  <img src="/images/wuhan-coronavirus/2019-nCoV-new-death-recovered-log.svg" alt="2019-nCoV-new-death-recovered-log" style="width: 49%;" class="invert">
  <figcaption>新增感染、死亡、治愈病例统计</figcaption>
</figure>

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-death-recovered.svg" alt="2019-nCoV-death-recovered" style="width: 49%;" class="invert">
  <img src="/images/wuhan-coronavirus/2019-nCoV-death-recovered-log.svg" alt="2019-nCoV-death-recovered-log" style="width: 49%;" class="invert">
  <figcaption>累计感染、死亡、治愈病例统计</figcaption>
</figure>

## 回归分析

使用 Logistic 模型

$$
\hat{y} = \frac{a}{1 + b \cdot k^{\hat{x}}} + c
$$

和指数模型

$$
\hat{y} = a \, \mathrm{e}^{-k\hat{x} + b} + c
$$

对全国及湖北省以外确诊病例分别进行拟合。为获得更加准确的拟合结果，对前期数据进行了一定调整，相当于从 2020 年 1 月 15 日开始统计。考虑到临床诊断病例的影响，对全国数据进行分段拟合。

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-regression.svg" alt="2019-nCoV-regression" style="width: 49%;" class="invert">
  <img src="/images/wuhan-coronavirus/2019-nCoV-regression-log.svg" alt="2019-nCoV-regression-log" style="width: 49%;" class="invert">
  <figcaption>累计确诊病例拟合</figcaption>
</figure>

拟合结果及有关参数见以下表格：

{:style="width: 100%;"}
|           | 拟合结果                                                     | 最终值  | *R*²     | Adj-*R*² |
|:---------:|:------------------------------------------------------------:|:-------:|:--------:|:--------:|
| 全国 (I)  | $52464.4 - \dfrac{53000.9}{1 + 0.00307582 \times 1.30876^x}$ | -       | 0.999818 | 0.999787 |
| 全国 (II) | $79884. - 89.6499 \, \mathrm{e}^{11.4149 - 0.206377 \, x}$   | 79884.  | 0.999982 | 0.999977 |
| 湖北以外  | $12958.6 - \dfrac{13757.6}{1 + 0.0126747 \times 1.25774^x}$  | 12958.6 | 0.999909 | 0.999899 |

<table style="width: 100%; text-align: center;">
  <thead>
    <tr>
      <th></th><th>参数</th><th>估计值</th><th>标准误差</th><th><em>t</em> 统计量</th><th><em>P</em> 值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4">全国 (I)</td>
      <td>$a$</td><td>-53000.9</td><td>751.854</td><td>-70.4936</td><td>2.45531×10⁻²⁹</td>
    </tr>
    <tr>
      <td>$b$</td><td>0.00307582</td><td>0.000278589</td><td>11.0407</td><td>6.87192×10⁻¹¹</td>
    </tr>
    <tr>
      <td>$c$</td><td>52464.4</td><td>679.862</td><td>77.1692</td><td>2.82508×10⁻³⁰</td>
    </tr>
    <tr>
      <td>$k$</td><td>1.30876</td><td>0.00687273</td><td>190.428</td><td>1.12974×10⁻³⁹</td>
    </tr>
    <tr>
      <td rowspan="4">全国 (II)</td>
      <td>$a$</td><td>-89.6499</td><td>0.0028307</td><td>-31670.6</td><td>1.17147×10⁻⁵²</td>
    </tr>
    <tr>
      <td>$b$</td><td>11.4149</td><td>0.253772</td><td>44.9809</td><td>1.17765×10⁻¹⁵</td>
    </tr>
    <tr>
      <td>$c$</td><td>79884.</td><td>260.342</td><td>306.842</td><td>1.76602×10⁻²⁶</td>
    </tr>
    <tr>
      <td>$k$</td><td>0.206377</td><td>0.00881982</td><td>23.3993</td><td>5.19751×10⁻¹²</td>
    </tr>
    <tr>
      <td rowspan="4">湖北以外</td>
      <td>$a$</td><td>-13757.6</td><td>87.5021</td><td>-157.226</td><td>6.97436×10⁻⁵⁴</td>
    </tr>
    <tr>
      <td>$b$</td><td>0.0126747</td><td>0.000886563</td><td>14.2964</td><td>1.20379×10⁻¹⁶</td>
    </tr>
    <tr>
      <td>$c$</td><td>12958.6</td><td>31.0383</td><td>417.504</td><td>1.44724×10⁻⁶⁹</td>
    </tr>
    <tr>
      <td>$k$</td><td>1.25774</td><td>0.00403817</td><td>311.463</td><td>7.37249×10⁻⁶⁵</td>
    </tr>
  </tbody>
</table>

<!-- x⁰ x¹ x² x³ x⁴ x⁵ x⁶ x⁷ x⁸ x⁹ x⁺ x⁻ x⁼ x⁽ x⁾ xⁿ -->

## 总结

引用世界卫生组织总干事 Tedros Adhanom 的一句话：[^who-twitter]

[^who-twitter]: @WHO 的[推文](https://twitter.com/WHO/status/1222969618505093121)。

<p style="text-align: center">
<strong>We must remember that these are people, not numbers.</strong>
</p>

## 注释与参考

<div id="footnotes"></div>
