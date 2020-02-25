---
layout: post
title: 新型冠状病毒肺炎疫情统计
date: 2020-02-01
last_modified_at: 2020-02-26
abstract: 新年伊始，肺炎疫情从武汉蔓延至全国乃至世界各地，形势越发严峻。这里简要罗列一些数据，并且据此给出（未必非常靠谱）的预测。
---

新年伊始，肺炎疫情从武汉蔓延至全国乃至世界各地，形势越发严峻。这里简要罗列一些数据，并且据此给出（未必非常靠谱）的预测。

本文数据见 [2019-nCoV-data.csv](https://github.com/stone-zeng/stone-zeng.github.io/blob/master/src/wuhan-coronavirus/2019-nCoV-data.csv)，来源于[^2019-nCoV-wiki][^2019-nCoV-tg]。绘图及拟合代码见 [2019-nCoV.wl](https://github.com/stone-zeng/stone-zeng.github.io/blob/master/src/wuhan-coronavirus/2019-nCoV.wl)。

[^2019-nCoV-wiki]: [2019 新型冠状病毒中国大陆病例 - 维基百科](https://zh.wikipedia.org/wiki/2019新型冠状病毒中国大陆病例)。由于统计口径差异等原因，新增病例数之和与累计病例数、各省市数据之和与全国数据均略有出入。
[^2019-nCoV-tg]: [2019-nCoV 疫情实时播报](https://t.me/nCoV2019)

说明：

- 统计数据截至 **2020 年 2 月 25 日**
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

和指数模型

$$
\hat{y} = a \, \mathrm{e}^{-k\hat{x} + b} + c
$$

对全国及湖北省以外确诊病例分别进行拟合。为获得更加准确的拟合结果，对前期数据进行了一定调整，相当于从 2020 年 1 月 15 日开始统计。考虑到临床诊断病例的影响，对全国数据进行分段拟合。

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
      <th>最终值</th>
      <th><em>R</em>²</th>
      <th>Adj-<em>R</em>²</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>全国 (I)</td>
      <td>$52464.4 - \dfrac{53000.9}{1 + 0.00307582 \times 1.30876^x}$</td>
      <td>52464.4</td>
      <td>0.999818</td>
      <td>0.999787</td>
    </tr>
    <tr>
      <td>全国 (II)</td>
      <td>$79274.5 - 52.1406 \, \mathrm{e}^{12.3841 - 0.221892 \, x}$</td>
      <td>79274.5</td>
      <td>0.999983</td>
      <td>0.999975</td>
    </tr>
    <tr>
      <td>湖北以外</td>
      <td>$12940.5 - \dfrac{13727.1}{1 + 0.0124509 \times 1.259^x}$</td>
      <td>12940.5</td>
      <td>0.999890</td>
      <td>0.999877</td>
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
      <td>$a$</td><td>-52.1406</td><td>0.00684022</td><td>-7622.64</td><td>5.86032×10⁻³²</td>
    </tr>
    <tr>
      <td>$b$</td><td>12.3841</td><td>0.356653</td><td>34.723</td><td>6.73127×10⁻¹¹</td>
    </tr>
    <tr>
      <td>$c$</td><td>79274.5</td><td>400.948</td><td>197.718</td><td>1.10167×10⁻¹⁷</td>
    </tr>
    <tr>
      <td>$k$</td><td>0.221892</td><td>0.0126074</td><td>17.6001</td><td>2.79477×10⁻⁸</td>
    </tr>
    <tr>
      <td rowspan="4">湖北以外</td>
      <td>$a$</td><td>-13727.1</td><td>100.347</td><td>-136.797</td><td>4.92188×10⁻⁴⁷</td>
    </tr>
    <tr>
      <td>$b$</td><td>0.0124509</td><td>0.000965905</td><td>12.8904</td><td>1.97183×10⁻¹⁴</td>
    </tr>
    <tr>
      <td>$c$</td><td>12940.5</td><td>40.5496</td><td>319.129</td><td>3.64542×10⁻⁵⁹</td>
    </tr>
    <tr>
      <td>$k$</td><td>1.259</td><td>0.00459348</td><td>274.085</td><td>5.5157×10⁻⁵⁷</td>
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
