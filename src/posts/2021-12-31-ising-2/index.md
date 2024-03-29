---
title: Ising model (2)
date: 2021-12-31
tags:
  - Lattice models
excerpt: TODO
draft: true
---

$$
\gdef\ee{\mathrm{e}}
\gdef\ii{\mathrm{i}}
\gdef\tr{\operatorname{tr}}
\gdef\bra#1{\langle{#1}\vert}
\gdef\ket#1{\vert{#1}\rangle}
\gdef\ev#1{\langle{#1}\rangle}
\gdef\mel#1#2#3{\langle{#1}\vert{#2}\vert{#3}\rangle}
\gdef\sump#1{\sum_{#1}\vphantom{\sum}'}
$$

In the previous post, we have shown the exact solution for 1D Ising model. When go to 2D, however, this task becomes much more difficulty and requires more detailed analysis.

## Kramers--Wannier duality

In the first step, we will try to find the critical point without solving the partition function. This idea was first proposed by Kramers and Wannier in 1941, which relates the free energy of a 2D Ising lattice at a low temperature to that of another one at a high temperature.

Here, we only consider the zero-field system on an $M\times N$ square lattice:

$$
H(\\{\sigma_i\\}) = -J \sum_{\ev{ij}} \sigma_i\sigma_j,
$$

where $\ev{ij}$ is for the nearest-neighbor. The partition function is as usual:

$$
Z = \sum_{\\{\sigma_i\\}} \ee^{-\beta H(\\{\sigma_i\\})}
  = \sum_{\\{\sigma_i\\}} \exp\left( \beta J \sum_{\ev{ij}} \sigma_i\sigma_j \right)
  = \sum_{\\{\sigma_i\\}} \prod_{\ev{ij}} \ee^{K\sigma_i\sigma_j}.
$$

We introduced a dimensionless parameter $K=\beta J$ for convenience. Note that $\sigma_i\sigma_j$ can be either $+1$ or $-1$, so

$$
\begin{aligned}
   \ee^{K\sigma_i\sigma_j}
&= \cosh(K\sigma_i\sigma_j) + \sinh(K\sigma_i\sigma_j) \\
&= \cosh K + \sigma_i\sigma_j \sinh K
 = \cosh K \left( 1+\sigma_i\sigma_j\tanh K \right).
\end{aligned}
$$

The second equality is due to the "parity" of hyperbolic functions. Then

$$
\begin{aligned}
Z &= \sum_{\\{\sigma_i\\}} \prod_{\ev{ij}} \cosh K \left( 1+\sigma_i\sigma_j\tanh K \right) \\
  &= \cosh^{2MN} K
\end{aligned}
$$
