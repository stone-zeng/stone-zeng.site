---
layout: post
title: 新型冠状病毒肺炎疫情统计
date: 2020-02-01
last_modified_at: 2020-02-22
abstract: 新年伊始，肺炎疫情从武汉蔓延至全国乃至世界各地，形势越发严峻。这里简要罗列一些数据，并且据此给出（未必非常靠谱）的预测。
---

新年伊始，肺炎疫情从武汉蔓延至全国乃至世界各地，形势越发严峻。这里简要罗列一些数据，并且据此给出（未必非常靠谱）的预测。

本文数据见 [2019-nCoV-data.csv](https://github.com/stone-zeng/stone-zeng.github.io/blob/master/src/wuhan-coronavirus/2019-nCoV-data.csv)，来源于[^2019-nCoV-wiki][^2019-nCoV-tg]。绘图及拟合代码见 [2019-nCoV.wl](https://github.com/stone-zeng/stone-zeng.github.io/blob/master/src/wuhan-coronavirus/2019-nCoV.wl)。

[^2019-nCoV-wiki]: [2019 新型冠状病毒中国大陆病例 - 维基百科](https://zh.wikipedia.org/wiki/2019新型冠状病毒中国大陆病例)。由于统计口径差异等原因，新增病例数之和与累计病例数、各省市数据之和与全国数据均略有出入。
[^2019-nCoV-tg]: [2019-nCoV 疫情实时播报](https://t.me/nCoV2019)

说明：

- 统计数据截至 **2020 年 2 月 22 日**
- 2 月 13 日，湖北省将临床诊断病例数纳入确诊病例数进行公布[^hubei-02-13]

[^hubei-02-13]: 湖北省卫生健康委员会. [2020年2月12日湖北省新冠肺炎疫情情况](http://wjw.hubei.gov.cn/fbjd/dtyw/202002/t20200213_2025581.shtml)

## 时间序列分析

深色曲线为实际数据，浅色曲线为预测数据，阴影部分为 95% 置信区间。

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-new.svg" alt="2019-nCoV-new" style="width: 54%;">
  <img src="/images/wuhan-coronavirus/2019-nCoV-new-log.svg" alt="2019-nCoV-new-log" style="width: 44.5%;">
  <figcaption>新增确诊病例统计（左：线性坐标，右：对数坐标，下同）</figcaption>
</figure>

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-total.svg" alt="2019-nCoV-total" style="width: 49%;">
  <img src="/images/wuhan-coronavirus/2019-nCoV-total-log.svg" alt="2019-nCoV-total-log" style="width: 49%;">
  <figcaption>累计确诊病例统计</figcaption>
</figure>

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-new-death-recovered.svg" alt="2019-nCoV-new-death-recovered" style="width: 49%;">
  <img src="/images/wuhan-coronavirus/2019-nCoV-new-death-recovered-log.svg" alt="2019-nCoV-new-death-recovered-log" style="width: 49%;">
  <figcaption>新增感染、死亡、治愈病例统计</figcaption>
</figure>

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-death-recovered.svg" alt="2019-nCoV-death-recovered" style="width: 49%;">
  <img src="/images/wuhan-coronavirus/2019-nCoV-death-recovered-log.svg" alt="2019-nCoV-death-recovered-log" style="width: 49%;">
  <figcaption>累计感染、死亡、治愈病例统计</figcaption>
</figure>

## 回归分析

使用 Logistic 模型

$$
\hat{y} = \frac{a}{1 + b \cdot k^{\hat{x}}} + c
$$

对全国及湖北省以外确诊病例分别进行拟合。为获得更加准确的拟合结果，对前期数据进行了一定调整，相当于从 2020 年 1 月 15 日开始统计。

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-regression.svg" alt="2019-nCoV-regression" style="width: 49%;">
  <img src="/images/wuhan-coronavirus/2019-nCoV-regression-log.svg" alt="2019-nCoV-regression-log" style="width: 49%;">
  <figcaption>累计确诊病例拟合</figcaption>
</figure>

拟合结果及有关参数见以下表格：

<table style="width: 100%; text-align: center;">
  <thead>
    <tr>
      <th></th>
      <th>拟合结果</th>
      <th>极限值</th>
      <th><em>R</em>²</th>
      <th>Adj-<em>R</em>²</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>全国</td>
      <td>$\dfrac{-86443.7}{1 + 0.00519339 \times 1.22657^x} + 85318.6$</td>
      <td>85318.6</td>
      <td>0.997525</td>
      <td>0.997233</td>
    </tr>
    <tr>
      <td>湖北以外</td>
      <td>$\dfrac{-13245.5}{1 + 0.00900856 \times 1.27741^x} + 12815.6$</td>
      <td>12815.6</td>
      <td>0.999717</td>
      <td>0.999684</td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; text-align: center;">
  <thead>
    <tr>
      <th></th><th>参数</th><th>估计值</th><th>标准误差</th><th><em>t</em> 统计量</th><th><em>P</em> 值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4">全国</td>
      <td>$a$</td><td>-86443.7</td><td>2921.45</td><td>-29.5893</td><td>7.518×10⁻²⁶</td>
    </tr>
    <tr>
      <td>$b$</td><td>0.00519339</td><td>0.00146162</td><td>3.55317</td><td>0.00114081</td>
    </tr>
    <tr>
      <td>$c$</td><td>85318.6</td><td>2413.25</td><td>35.3543</td><td>2.13048×10⁻²⁸</td>
    </tr>
    <tr>
      <td>$k$</td><td>1.22657</td><td>0.0152246</td><td>80.5648</td><td>2.09748×10⁻⁴⁰</td>
    </tr>
    <tr>
      <td rowspan="4">湖北以外</td>
      <td>$a$</td><td>-13245.5</td><td>111.438</td><td>-118.859</td><td>3.97873×10⁻⁴⁶</td>
    </tr>
    <tr>
      <td>$b$</td><td>0.00900856</td><td>0.000922096</td><td>9.76966</td><td>2.11152×10⁻¹¹</td>
    </tr>
    <tr>
      <td>$c$</td><td>12815.6</td><td>66.0265</td><td>194.098</td><td>2.33854×10⁻⁵³</td>
    </tr>
    <tr>
      <td>$k$</td><td>1.27741</td><td>0.00661546</td><td>193.094</td><td>2.78898×10⁻⁵³</td>
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
