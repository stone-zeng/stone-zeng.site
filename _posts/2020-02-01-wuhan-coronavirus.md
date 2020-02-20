---
layout: post
title: 新型冠状病毒肺炎疫情统计
date: 2020-02-01
last_modified_at: 2020-02-21
abstract: 新年伊始，肺炎疫情从武汉蔓延至全国乃至世界各地，形势越发严峻。这里简要罗列一些数据，并且据此给出（未必非常靠谱）的预测。
---

新年伊始，肺炎疫情从武汉蔓延至全国乃至世界各地，形势越发严峻。这里简要罗列一些数据，并且据此给出（未必非常靠谱）的预测。

本文数据见 [2019-nCoV-data.csv](https://github.com/stone-zeng/stone-zeng.github.io/blob/master/src/wuhan-coronavirus/2019-nCoV-data.csv)，来源于[^2019-nCoV-wiki][^2019-nCoV-tg]。绘图及拟合代码见 [2019-nCoV.wl](https://github.com/stone-zeng/stone-zeng.github.io/blob/master/src/wuhan-coronavirus/2019-nCoV.wl)。

[^2019-nCoV-wiki]: [2019 新型冠状病毒中国大陆病例 - 维基百科](https://zh.wikipedia.org/wiki/2019新型冠状病毒中国大陆病例)。由于统计口径差异等原因，新增病例数之和与累计病例数、各省市数据之和与全国数据均略有出入。
[^2019-nCoV-tg]: [2019-nCoV 疫情实时播报](https://t.me/nCoV2019)

说明：

- 统计数据截至 **2020 年 2 月 20 日**
- 2 月 13 日，湖北省将临床诊断病例数纳入确诊病例数进行公布[^hubei-02-13]

[^hubei-02-13]: 湖北省卫生健康委员会. [2020年2月12日湖北省新冠肺炎疫情情况](http://wjw.hubei.gov.cn/fbjd/dtyw/202002/t20200213_2025581.shtml)

## 时间序列分析

深色曲线为实际数据，浅色曲线为预测数据，阴影部分为 95% 置信区间。

<figure>
  <img src="/images/wuhan-coronavirus/2019-nCoV-new.svg" alt="2019-nCoV-new" style="width: 49%;">
  <img src="/images/wuhan-coronavirus/2019-nCoV-new-log.svg" alt="2019-nCoV-new-log" style="width: 49%;">
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
      <td>$\dfrac{-90418.8}{1 + 0.0061235 \times 1.21457^x} + 88964.3$</td>
      <td>88964.3</td>
      <td>0.997199</td>
      <td>0.996849</td>
    </tr>
    <tr>
      <td>湖北以外</td>
      <td>$\dfrac{-13129.2}{1 + 0.00845575 \times 1.2826^x} + 12724.2$</td>
      <td>12724.2</td>
      <td>0.999719</td>
      <td>0.999684</td>
    </tr>
  </tbody>
</table>
<!-- 
<td>-90418.8</td><td>4340.81</td><td>-20.8299</td><td>3.55143×10⁻²⁰</td>
<td>0.0061235</td><td>0.00177794</td><td>3.44415</td><td>0.00161914</td>
<td>88964.3</td><td>3779.15</td><td>23.5409</td><td>8.94188×10⁻²²</td>
<td>1.21457</td><td>0.0165636</td><td>73.3278</td><td>3.16054×10⁻³⁷</td>
<td>-13129.2</td><td>115.56</td><td>-113.613</td><td>2.7411×10⁻⁴³</td>
<td>0.00845575</td><td>0.000871742</td><td>9.69983</td><td>4.75319×10⁻¹¹</td>
<td>12724.2</td><td>72.8504</td><td>174.662</td><td>2.95744×10⁻⁴⁹</td>
<td>1.2826</td><td>0.00684222</td><td>187.454</td><td>3.08753×10⁻⁵⁰</td>
 -->

<table style="width: 100%; text-align: center;">
  <thead>
    <tr>
      <th></th><th>参数</th><th>估计值</th><th>标准误差</th><th><em>t</em> 统计量</th><th><em>P</em> 值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4">全国</td>
      <td>$a$</td><td>-90418.8</td><td>4340.81</td><td>-20.8299</td><td>3.55143×10⁻²⁰</td>
    </tr>
    <tr>
      <td>$b$</td><td>0.0061235</td><td>0.00177794</td><td>3.44415</td><td>0.00161914</td>
    </tr>
    <tr>
      <td>$c$</td><td>88964.3</td><td>3779.15</td><td>23.5409</td><td>8.94188×10⁻²²</td>
    </tr>
    <tr>
      <td>$k$</td><td>1.21457</td><td>0.0165636</td><td>73.3278</td><td>3.16054×10⁻³⁷</td>
    </tr>
    <tr>
      <td rowspan="4">湖北以外</td>
      <td>$a$</td><td>-13129.2</td><td>115.56</td><td>-113.613</td><td>2.7411×10⁻⁴³</td>
    </tr>
    <tr>
      <td>$b$</td><td>0.00845575</td><td>0.000871742</td><td>9.69983</td><td>4.75319×10⁻¹¹</td>
    </tr>
    <tr>
      <td>$c$</td><td>12724.2</td><td>72.8504</td><td>174.662</td><td>2.95744×10⁻⁴⁹</td>
    </tr>
    <tr>
      <td>$k$</td><td>1.2826</td><td>0.00684222</td><td>187.454</td><td>3.08753×10⁻⁵⁰</td>
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
