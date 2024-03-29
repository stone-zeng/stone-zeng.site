---
title: Ising model (1)
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

## Definition

We define the so called **classical Ising model** abstractly as a set of binary spins arranged on a lattice. Here,

- The spins are described by some numbers (that's why we call it *classical*). *Binary* means that the spin can only take 2 values, namely ↑ or ↓. We can use +1 and -1 to represent them.
- The lattice can be 1D, 2D, 3D or higher dimension. It may also have different shapes, such as square, rectangular and hexagonal etc. But we will mainly focus on the square lattice.

Generally, any two spins in Ising model can have interaction with each other. In addition, we can put the whole system in a magnetic field. Therefore, the most general Hamiltonian for Ising model is given by:

$$
H(\\{\sigma_i\\}) = -\sum_{i,j} J_{ij} \sigma_i\sigma_j - \mu\sum_i B_i \sigma_i.
% \tag{eq:ising-hamiltonian-general}
$$

Here, $J_{ij}$ is the interaction between spin $\sigma_i$ and spin $\sigma_j$, $B_i$ is the magnetic field at postion $i$, $\mu$ is the magnetic moment which is a constant. The summation goes over all the spins in the lattice (we assume that there are finite number of spins).

We use $\\{\sigma_i\\}$ to denote some configuration of spins like ↑↓↑↑↓↓↑↓ in 1D. Clearly, the Hamiltonian is a function of the spin configuration (rather than a single spin).

The most general case can be simplified if we introduce some assumptions:

- Only interactions between *adjacent* spins are considered:

  $$
  \sum_{i,j} J_{ij} \sigma_i\sigma_j \implies \sum_{\ev{ij}} J_{ij} \sigma_i\sigma_j.
  $$

- Interaction and magnetic field are both independent of position:

  $$
  J_{ij} \implies J, \quad B_i \implies B.
  $$

Now the Hamiltonian becomes:

$$
H(\\{\sigma_i\\}) = -J \sum_{\ev{ij}} \sigma_i\sigma_j - \mu B \sum_i \sigma_i,
% \tag{eq:ising-hamiltonian}
$$

where $J$, $\mu$ and $B$ are all constants and $\sigma_i$ can be either +1 or -1.

## Mean field theory

For an arbitrary model, the most important task is to find its **partition function**. Then other physical quantities should be easily extracted from it. For Ising model, however, the partition function is not so easy to find, as there exists interaction between spins. So we want to eliminate the interaction and then solve the model, by introducing the **mean field approximation**.

Notice that

$$
\sum_{\ev{ij}} \sigma_i\sigma_j = \frac12 \sum_i \left( \sigma_i \sump{j} \sigma_j \right),
$$

where $\sum^\prime_i$ means the summation over the nearest spins of $\sigma_i$, and the factor $1/2$ is included to avoid duplication when counting the nearest spin pairs.

Then the Hamiltonian becomes

$$
\begin{aligned}
   H(\\{\sigma_i\\})
&= -\frac12 J \sum_i \left( \sigma_i \sump{j} \sigma_j \right) - \mu B \sum_i \sigma_i \\
&= -\mu \sum_i \sigma_i \left(  \frac{J}{2\mu} \sump{j} \sigma_j + B \right)
 = -\mu \sum_i \sigma_i B_{\text{eff},i}
\end{aligned}
$$

where $B_{\text{eff},i}$ is the effective magnetic field that considering the contribution of the neighboring spins.

Until now, our calculation is still exact. We will then introduce some approximation:

$$
\sump{j} \sigma_j \approx \sump{j} \bar{\sigma}_j = \bar{\sigma} \sump{j} 1 = \gamma\bar{\sigma}.
$$

This is the core procedure in the mean field theory, where we replace the raw spin $\sigma_j$ by its mean value $\bar{\sigma}_j=\bar{\sigma}$. The *coordination number* $\gamma$ is the number of nearest neighbors, see the following figure.

<figure>
  TODO: figure
  <img src="" alt="">
  <figcaption>Coordination number</figcaption>
</figure>

The magnetization $\bar{M}$ can be evaluated from either the partition function or average spin (by definition $\bar{M}=N\mu\bar{\sigma}$, where $N$ is the total number of spins), so we can find a *self-consistency relation* for $\bar{\sigma}$.

The Hamiltonian under mean field approximation is

$$
  H_\text{MF}(\\{\sigma_i\\})
= -\mu \sum_i \sigma_i B_{\text{eff},i}
= -\left( \frac12 \gamma J\bar{\sigma} + \mu B \right) \sum_i \sigma_i.
$$

So the partition function is then

$$
\begin{aligned}
   Z_\text{MF}
&= \sum_{\\{\sigma_i\\}} \ee^{-\beta H_\text{MF}(\\{\sigma_i\\})} \\
&= \sum_{\\{\sigma_i\\}} \exp\left[ \left( \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right) \sum_i \sigma_i \right] \\
&= \sum_{\\{\sigma_i\\}} \prod_i \exp\left[ \left( \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right) \sigma_i \right].
\end{aligned}
$$

We should always remember that $\sum_{\\\{\sigma_i\\\}}$ is over all the possible *configurations*, while $\sum_i$ and $\prod_i$ are over all the *spins*. Note that

$$
\begin{aligned}
   \sum_{\\{\sigma_i\\}} \prod_i f(\sigma_i)
&= \sum_{\\{\sigma_i\\}} f(\sigma_1) f(\sigma_2) \cdots f(\sigma_N) \\
&= \underbrace{
      \Bigl[ f(\uparrow)f(\uparrow)\cdots f(\uparrow) \Bigr]
    + \Bigl[ f(\uparrow)f(\uparrow)\cdots f(\downarrow) \Bigr]
    + \cdots
    + \Bigl[ f(\downarrow)f(\downarrow)\cdots f(\downarrow) \Bigr]}_{2^N \text{ terms}} \\
&= \underbrace{\Bigl[ f(\uparrow)+f(\downarrow) \Bigr]_1
      \Bigl[ f(\uparrow)+f(\downarrow) \Bigr]_2 \cdots
      \Bigl[ f(\uparrow)+f(\downarrow) \Bigr]_N}_{N \text{ terms}} \\
&= \prod_i \Bigl[ f(\uparrow)+f(\downarrow) \Bigr]_i \\
&= \prod_i \sum_{\sigma_i} f(\sigma_i).
\end{aligned}
$$

Pay attention that the last summation is over the two values of $\sigma_i$. Then

$$
\begin{aligned}
   Z_\text{MF}
&= \sum_{\\{\sigma_i\\}} \prod_i \exp\left[ \left( \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right) \sigma_i \right] \\
&= \prod_i \left[ \exp\left(  \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right)
                + \exp\left( -\frac12 \beta\gamma J\bar{\sigma} - \beta\mu B \right) \right] \\
&= \prod_i \left[ 2 \cosh\left( \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right) \right] \\
&= \left[ 2 \cosh\left( \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right) \right]^N.
\end{aligned}
$$

From thermodynamics, we know that the free energy is

$$
  F_\text{MF}
= -\frac{\ln Z_\text{MF}}{\beta}
= -\frac{N\ln2}{\beta} - \frac{N}{\beta} \ln\cosh \left( \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right).
$$

Total magnetization is

$$
  \bar{M}_\text{MF}
= -\frac{\partial F_\text{MF}}{\partial B}
= N\mu\tanh\left( \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right).
$$

By definition, we also have $\bar{M}=N\mu\bar{\sigma}$. So

$$
\bar{\sigma} = \tanh\left( \frac12 \beta\gamma J\bar{\sigma} + \beta\mu B \right).
$$

This is the self-consistency relation.

TODO: analysis

## Transfer matrix method

To find the exact solution of Ising model, we need a more powerful tool: the **transfer matrix** method. The basic idea, as its name implied, is to rewrite the partition function as a product of transfer matrices. We can then evaluate the partition function by diagonalizing these matrices.

Now let's consider the 1D situation. We choose the **periodic boundary condition** such that $\sigma_{N+1} = \sigma_1$. The Hamiltonian can be written as

$$
\begin{aligned}
   H(\\{\sigma_i\\})
&= -J \sum_{i=1}^N \sigma_i\sigma_{i+1} - \mu B \sum_{i=1}^N \sigma_i \\
&= -J \sum_{i=1}^N \sigma_i\sigma_{i+1} - \frac12 \mu B \sum_{i=1}^N \left( \sigma_i + \sigma_{i+1} \right) \\
&= -\sum_{i=1}^N \left[ J\sigma_i\sigma_{i+1} + \frac12 \mu B \left( \sigma_i + \sigma_{i+1} \right) \right].
\end{aligned}
$$

The partition function is

$$
\begin{aligned}
Z &= \sum_{\\{\sigma_i\\}} \ee^{-\beta H(\\{\sigma_i\\})} \\
  &= \sum_{\\{\sigma_i\\}} \exp\left\\{ \beta \sum_{i=1}^N
        \left[ J\sigma_i\sigma_{i+1} + \frac12 \mu B \left( \sigma_i + \sigma_{i+1} \right) \right] \right\\} \\
  &= \sum_{\\{\sigma_i\\}} \prod_i \exp\left[
        \beta J\sigma_i\sigma_{i+1} + \frac12 \beta\mu B \left( \sigma_i + \sigma_{i+1} \right) \right].
\end{aligned}
$$

We can introduce a matrix element for $\exp[\cdots]$ (with the usual bra-ket notation in quantum mechanics):

$$
  \mel{\sigma_i}{\bm{P}}{\sigma_{i+1}}
= \exp\left[ \beta J\sigma_i\sigma_{i+1} + \frac12 \beta\mu B \left( \sigma_i + \sigma_{i+1} \right) \right].
$$

As $\sigma_i$ can only take +1 or -1, the explicit 2×2 matrix representation for $\bm{P}$ is:

$$
\bm{P} \coloneqq
\begin{bmatrix}
  \mel{+1}{\bm{P}}{+1} & \mel{+1}{\bm{P}}{-1} \\[1ex]
  \mel{-1}{\bm{P}}{+1} & \mel{-1}{\bm{P}}{-1}
\end{bmatrix}
=
\begin{bmatrix}
  \ee^{\beta(J+\mu B)} & \ee^{-\beta J} \\[1ex]
  \ee^{-\beta J} & \ee^{\beta(J-\mu B)}
\end{bmatrix}.
$$

Its eigenvalues are

$$
\lambda_\pm = \ee^{\beta J} \left( \cosh\beta\mu B \pm \sqrt{\ee^{-4\mu J} + \sinh^2\beta\mu B} \right).
$$

Now the partition function becomes

$$
\begin{aligned}
Z &= \sum_{\\{\sigma_i\\}}
     \mel{\sigma_1}{\bm{P}}{\sigma_2} \mel{\sigma_2}{\bm{P}}{\sigma_3} \cdots \mel{\sigma_N}{\bm{P}}{\sigma_{N+1}} \\
  &= \sum_{\sigma_1} \bra{\sigma_1}
     \bm{P} \left( \sum_{\sigma_2} \ket{\sigma_2}\bra{\sigma_2} \right)
     \bm{P} \left( \sum_{\sigma_3} \ket{\sigma_3}\bra{\sigma_3} \right) \cdots
     \bm{P} \left( \sum_{\sigma_N} \ket{\sigma_N}\bra{\sigma_N} \right)
     \bm{P} \ket{\sigma_1} \\
  &= \sum_{\sigma_1} \mel{\sigma_1}{\bm{P}^N}{\sigma_1} = \tr\bm{P}^N.
\end{aligned}
$$

Here we have used the boundary condition $\sigma_{N+1} = \sigma_1$ and the completeness relation $\sum_{\sigma_i} \ket{\sigma_i}\bra{\sigma_i}=\bm{1}$. The trace can be further evaluated by using the eigenvalues:

$$
Z = \tr\bm{P}^N
  = \tr\bigl( \bm{S}\bm{\varLambda} \bm{S}^\dagger \bigr)^N
  = \tr\bigl( \bm{S}\bm{\varLambda}^N \bm{S}^\dagger \bigr)
  = \tr\bm{\varLambda}^N
  = \lambda_+^N + \lambda_-^N,
$$

where $\bm{S}$ satisfied $\bm{S}\bm{S}^\dagger=\bm{1}$ and $\bm{\varLambda}=\operatorname{diag}\\\{\lambda_+, \lambda_-\\\}$.
