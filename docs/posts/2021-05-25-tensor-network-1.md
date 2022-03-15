---
layout: post
title: Introduction to tensor network (1)
date: 2021-05-25
last_modified_at: 2021-05-26
lang: en-US
math: true
description: Tensor networks provide a general framework to describe many interesting and important concepts in condensed matter physics and quantum information theory, such as topological orders, entanglement, and even holographic duality.
---

$$
\gdef\tr{\operatorname{tr}}
$$
{:.katex-def}

Tensor networks provide a general framework to describe many interesting and important concepts in condensed matter physics and quantum information theory, such as topological orders, entanglement, and even holographic duality. In this article, we will introduce the basic building blocks of tensor networks and will show how to play with them in Python.

## Tensors

What is a **tensor**? In the [most general definition](https://en.wikipedia.org/wiki/Monoidal_category), tensors describe the structure that you can put two or more objects together, such that some certain coherence conditions can be satisfied.

To be more concrete, we will mainly focus on linear algebra in the following discussion. A tensor can then be defined as a **multilinear map** over some linear spaces. When we select a set of basis, the tensor can be determined by its components, which is a **multi-dimensional array**. This can be considered as a practical definition of a tensor as well.

The dimension of the components array is called the **rank** (some people call it degree or order) of the tensor. The size of each component is often called **dimension**.

In such context, a 1-dimensional tensor (with $D$ components) is just a vector:

$$
\bm{V} = \sum_{i=1}^D V_i \bm{e}_i
$$

For a given set of basis, we can simply ignore $\bm{e}_i$ and use the components to represent the tensor itself (abstract index notation):

$$
\bm{V} \eqqcolon V_i
$$

Tensor with higher ranks can be described similarly:

$$
\bm{M} = \sum_{i,j=1}^D M_{ij} \bm{e}_i\otimes\bm{e}_j \eqqcolon M_{ij}, \quad
\bm{T} = \sum_{i,j,k=1}^D T_{ijk} \bm{e}_i\otimes\bm{e}_j\otimes\bm{e}_k \eqqcolon T_{ijk}
$$

Here, $\otimes$ is the **tensor product**, while $\bm{e}_i\otimes\bm{e}_j$ and $\bm{e}_i\otimes\bm{e}_j\otimes \bm{e}_k$ are bases.

## Diagram notations

A convenient way to describe tensors is the diagram notation. Like ball-and-stick models of molecules, we use solid shapes ("balls") for tensors, bonds ("legs") for indices. A tensor with $n$ indices should have $n$ legs on the diagram.

![tensors](/images/tensor-network/tensors.svg){:.invert}{:style="max-width: 480px;"}

## Tensor contraction

As vectors and matrices, we can define addition and scalar-multiplication for general tensors, as long as their shapes match. However, there is another important and non-trivial operation, i.e. the **contraction** between two tensors. Tensor contraction is the generalization of inner product and matrix product. For example, this is the contraction between a rank-3 and a rank-2 tensor:

$$ C_{abc} = \sum_k A_{abk} B_{kc} \eqqcolon A_{abk} B_{kc} $$

The result is a rank-3 tensor, as the repeated index $k$ is summed over (3 = 3 + 2 - 2). Note that we have omitted the summation symbol here, which is called the **Einstein notation**.

We can contract more than one indices as well:

$$ C_{abc} = \sum_{ij} A_{abij} B_{ijc} \eqqcolon A_{abij} B_{ijc} $$

If all the indices of a tensor are contracted, the result will become a scalar. For matrix, it just gives the **trace**:

$$ \tr(\bm{M}) = \sum_i M_{ii} \eqqcolon M_{ii} $$

With diagram notation, the above contractions can be visualized as

![contraction](/images/tensor-network/contraction.svg){:.invert}{:style="max-width: 630px;"}

## Tensor programming

There are [many packages and software](https://en.wikipedia.org/wiki/Tensor_software) that support tensor calculation. We will mainly use Python + [NumPy](https://numpy.org/) in the following. Tensors in NumPy are given by `np.ndarray`. To create a tensor or an `np.ndarray`, we can use `np.array`:

```py
>>> import numpy as np
>>> np.array([1, 2, 3])
array([1, 2, 3])
```

Use `dtype` option to specify data type:

```py
>>> np.array([[1, 2], [4, 8]], dtype=float)
array([[1., 2.],
       [4., 8.]])
```

Tensors filled with random numbers are very useful for initialization:

```py
>>> np.random.randn(2, 3, 3)  # Standard normal distribution
array([[[-1.05948079, -1.85973976, -0.09898211],
        [ 0.31903517,  0.02717906, -2.22427428],
        [ 0.5140368 ,  0.74745636,  0.82800877]],

       [[-0.02000526, -0.45713714, -0.24404891],
        [ 1.14713123,  1.02173156,  0.85716018],
        [ 1.10425449, -0.01448847, -0.89763956]]])
```

The shape of a tensor can be obtained by `np.shape`, or the `shape` property:

```py
>>> t = np.ones((2, 3, 4))
>>> np.shape(t)
(2, 3, 4)
>>> t.shape
(2, 3, 4)
>>> t
array([[[1., 1., 1., 1.],
        [1., 1., 1., 1.],
        [1., 1., 1., 1.]],

       [[1., 1., 1., 1.],
        [1., 1., 1., 1.],
        [1., 1., 1., 1.]]])
```

Here, `np.ones` gives a 1-filled tensor. Similarly, `np.zeros` gives a 0-filled tensor.

### Contraction

Although there are functions for special cases such as `np.matmul` and `np.trace`, the general contraction function `np.einsum` is still the most useful one for us. Its basic syntax is the following:

```py
numpy.einsum(subscripts, *operands)
```

where `subscripts` is a string specifying contraction order and `operands` are the arrays for the operation. Different from some other tensor packages such as [ITensor](https://itensor.org/), there is no index object and hence everytime we perform a contraction, the order should be explicitly given.

Let's begin with some examples. The contraction $C_{abc} = A_{abk}B_{kc}$ can be written as

```py
>>> a, b, c, k = 2, 3, 4, 5
>>> A = np.random.randn(a, b, k)
>>> B = np.random.randn(k, c)
>>> C = np.einsum('abk, kc -> abc', A, B)
>>> C.shape
(2, 3, 4)
```

If the ordering of output indices is the same as input indices (without repeated ones), the output can be ignored:

```py
>>> C = np.einsum('abk, kc', A, B)
>>> C.shape
(2, 3, 4)
```

Trace is similar:

```py
>>> M = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
>>> np.einsum('ii', M)  # No output indices
15
>>> np.trace(M)
15
```

It can be used for complicated transpose of tensors:

```py
>>> T = np.random.randn(3, 1, 4, 2, 5, 7)
>>> T_trans = np.einsum('abcdef -> bcafed', T)
>>> T_trans.shape
(1, 4, 3, 7, 5, 2)
>>> T.transpose([1, 2, 0, 5, 4, 3]).shape
(1, 4, 3, 7, 5, 2)
```

Also for trivial contraction (i.e. tensor product):

```py
>>> A = np.random.randn(2, 3)
>>> B = np.random.randn(4)
>>> C = np.einsum('ab, c', A, B)  # C = A ⊗ B
>>> C.shape
(2, 3, 4)
```

In some cases we need to keep the repeated indices, for example:

$$ C_{abcj} = \sum_i A_{abij} B_{cij} $$

where $i$ is summed over but $j$ is not. Translate into Python, we have:

```py
>>> A = np.random.randn(10, 20, 4, 5)
>>> B = np.random.randn(30, 4, 5)
>>> C = np.einsum('abij, cij -> abcj', A, B)
>>> C.shape
(10, 20, 30, 5)
```

For complex or large contractions, we can add `optimize='optimal'` to speed them up:

```py
# IPython
In [1]: A = np.random.randn(8, 8, 8, 8, 4, 4, 4, 4, 4, 4)
   ...: B = np.random.randn(8, 8, 8, 8, 4, 4)

In [2]: %time np.einsum('ABcDeFghij, ABCDEF', A, B).shape
CPU times: user 526 ms, sys: 3.04 ms, total: 529 ms
Wall time: 531 ms
Out[2]: (8, 4, 8, 4, 4, 4, 4, 4)

In [3]: %time np.einsum('ABcDeFghij, ABCDEF', A, B, optimize='optimal').shape
CPU times: user 73.5 ms, sys: 12.5 ms, total: 86 ms
Wall time: 56.6 ms
Out[3]: (8, 4, 8, 4, 4, 4, 4, 4)
```

### Reshape

We often need to reshape the tensors so that they are suitable for some specific routines. For instance, we want to find the "eigenstate" $\bm{v}$ of a four-leg tensor $\bm{M}$, such that

$$ M_{abcd} v_{cd} = \lambda v_{ab} $$

In the diagram notation, it's shown as

![eigenvalue-equation](/images/tensor-network/eigenvalue-equation.svg){:.invert}{:style="max-width: 280px;"}

Most eigensolvers only accept matrix, or tensor with two indices, as their input parameter, but $\bm{M}$ has four indices. So we need to reshape it into a matrix: combine two legs on each side as a single one, just as the following diagram:

![reshape](/images/tensor-network/reshape.svg){:.invert}{:style="max-width: 390px;"}

In NumPy, we have

```py
>>> M = np.array([[[[3, 3, 8], [3, 4, 1]], [[4, 1, 8], [7, 1, 3]], [[3, 4, 2], [4, 3, 6]]],
...               [[[4, 1, 1], [7, 1, 2]], [[3, 3, 5], [9, 4, 7]], [[5, 1, 5], [6, 2, 4]]]])
>>> M.shape
(2, 3, 2, 3)
>>> M_reshaped = M.reshape(M.shape[0] * M.shape[1], M.shape[2] * M.shape[3])
>>> M_reshaped.shape
(6, 6)
```

The eigenvectors can be calculated as usual:

```py
>>> ls, vs = np.linalg.eig(M_reshaped)
>>> vs = [v.reshape(M.shape[0], M.shape[1]) for v in vs.T]
```

The second `vs` is a list of eigenstates $v_{ab}$ that we need. We can check its correctness:

```py
>>> for l, v in zip(ls, vs):
...     print(np.allclose(np.einsum('abcd, cd', M, v), l * v))
True
True
True
True
True
True
```

## Tensor networks

A **tensor network** is, as its name indicates, a network of tensor units. Tensor networks can have different dimensions and shapes, such as a 1D chain (called MPS) or a 2D graph (called PEPS).

There is no magic to build from a simple tensor to a complex network, except for numerous contraction operations. However, it captures the most important feature: *entanglement*. For a quantum-many body system, the dimension of Hilbert space $\mathcal{H}$ grows exponentially with the system size, which is the fundamental difficulty to simulate such system. But we should note that most of the Hilbert space is unreachable, and the "real world" wave functions can only take up a very small subspace of $\mathcal{H}$. Luckily, due to the tensor structure, a tensor network will just reveal the entanglement feature of the system, and therefore can be used as a powerful tool to represent the wave functions.

In the future posts, we will focus on some specific tensor network algorithms and will try to understand their entanglement or correlation structures.

## References

- R Orús. *A Practical Introduction to Tensor Networks: Matrix Product States and Projected Entangled Pair States*, [arXiv:1306.2164](https://arxiv.org/abs/1306.2164)
- J C Bridgeman, C T Chubb. *Hand-waving and Interpretive Dance: An Introductory Course on Tensor Networks*, [arXiv:1603.03039](https://arxiv.org/abs/1603.03039)
- [Tensor Network](https://tensornetwork.org/)
- [Tensors.net](https://www.tensors.net/)
