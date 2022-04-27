---
title: Notes on modular tensor category (2)
date: 2021-12-31
categories: Physics
lang: en-US
math: true
excerpt: TODO
draft: true
---

$$
\def\id{\mathrm{id}}
\def\tr{\operatorname{tr}}
\def\Hom{\operatorname{Hom}}
\def\End{\operatorname{End}}
\def\1{\mathbf{1}}
\def\cat#1{\mathcal{#1}}
\def\Cat#1{\textsf{\textbf{#1}}}
$$

$$
\gdef\id{\mathrm{id}}
\gdef\tr{\operatorname{tr}}
\gdef\Hom{\operatorname{Hom}}
\gdef\End{\operatorname{End}}
\gdef\1{\mathbf{1}}
\gdef\cat#1{\mathcal{#1}}
\gdef\Cat#1{\textsf{\textbf{#1}}}
$$

## Modular tensor category

From now on, we will mainly focus on the **semi-simple category**, in such a category $\cat{C}$ each object is isomorphic to a direct sum of **simple objects**:

$$ x = \bigoplus_{i\in I} n_{x,i} x_i, \quad \forall x_i \in \cat{C} $$

where $x_i\in\cat{C}$ are simple objects, $I$ is the index set of (the isomorphism class of) non-zero simple objects, and the coefficients $n_{x,i}\in\Z_+$.

To give the formal definition of the above things, basically we need to define additive and abelian category first, but it's beyond our notes (and it's not very important in physical context). So we will skip these mathematical details, and just use some examples to understand it, such as 1D lines in **Vec** (category of vector spaces) and simple groups in **Ab** (category of abelian groups).

Now let's consider the semi-simple category $\cat{C}$ with ribbon structure. We assume that the unit object $\1$ is simple, and denote $x_0=\1$.

- For simple objects $x_i, x_j\in\cat{C}$, we know that $x_i\otimes x_i\in\cat{C}$, according to the definition of tensor category. So

  $$ x_i \otimes x_j = \bigoplus_k N_{ij}^k x_k $$

  This formula is called the **fusion rule** in physics, and $N_{ij}^k$ are **fusion coefficients** with

  $$ N_{ij}^k = N_{ji}^k = N_{ik^\vee}^{j^\vee} = N_{i^\vee j^\vee}^{k^\vee}, \quad N_{ij}^0 = \delta_{ij^\vee} $$

- For simple object $x_i\in\cat{C}$:

  $$ \theta_{x_i} = \theta_i \id_{x_i}, \quad \dim x_i = d_i $$

  where $\theta_i$ and $d_i$ are numbers. $d_i$ is called **quantum dimension** of $x_i$. In a semi-simple ribbon category, $d_i$ of all simple objects are non-zero.

In a semi-simple ribbon category, we can define the numbers

<!-- TODO: s-matrix -->

It can be seen that

$$ \tilde{s}_{ij} = \tilde{s}_{ji} = \tilde{s}_{i^\vee j^\vee} = \tilde{s}_{j^\vee i^\vee}, \quad \tilde{s}_{i0} = d_i = \dim x_i $$

The the **modular tensor category** (MTC) can be defined as a semi-simple ribbon category $\cat{C}$, where

- $\cat{C}$ has only a finite number of simple objects, i.e. $\|I\|<\infty$
- Matrix $\tilde{\bm{s}}=[\tilde{s}_{ij}]$ is invertible

If $\cat{C}$ is symmetric (i.e. $\sigma_{x,y}=\sigma_{x,y}^{-1}$), then $\tilde{s}_{ij}=d_i d_j$. We can see that $\tilde{\bm{s}}$ is invertible so $\cat{C}$ is not modular.

For a modular tensor category, we have some important identities:

TODO:

Now we define

- *s*-matrix: $\tilde{\bm{s}}=\tilde{s}_{ji}$
- *t*-matrix: $\bm{t}=[t_{ij}]$, where $t_{ij}=\delta_{ij}\theta_i$
- *c*-matrix: $\bm{c}=[c_{ij}]$, where $c_{ij}=\delta_{ij^\vee}$ (it's called *charge conjugate matrix* in physics context)

They have the following properties:

- $(\tilde{\bm{s}}\bm{t})^3=p^+\tilde{\bm{s}}^2$
- $(\tilde{\bm{s}}\bm{t}^{-1})^3=p^-\tilde{\bm{s}}^2\bm{c}$
- $\bm{ct}=\bm{tc}$, $\bm{c}\tilde{\bm{s}}=\tilde{\bm{s}}\bm{c}$, $\bm{c}^2=\bm{I}$
- $\tilde{\bm{s}}^2=p^+p^-\bm{c}$

where $\bm{I}$ is the identity matrix. Let's introduce the notations

$$ D \coloneqq \sqrt{p^+p^-}, \quad \zeta \coloneqq \left(\frac{p^+}{p^-}\right)^{\frac16}, \quad \bm{s} \coloneqq \frac{\tilde{\bm{s}}}{D} $$

then the above things can be re-written as

$$ (\bm{st})^3 = \sqrt{\frac{p^+}{p^-}}\bm{s}^2 = \zeta^3s^2, \quad \bm{s}^2 = \bm{c}, \quad \bm{ct}=\bm{tc}, \quad \bm{c}^2=\bm{I} $$

Note that the generators in $\mathit{SL}_2(\Z)$ group are

$$ \bm{s} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}, \quad \bm{t} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} $$

with $(\bm{st})^3=\bm{s}^2$ and $\bm{s}^4=1$, hence the matrices $\bm{s}$ and $\bm{t}$ in a modular tensor category just give a representation of $\mathit{SL}_2(\Z)$.
