---
layout: post
title: Notes on modular tensor category (1)
date: 2020-12-17
lang: en-US
math: true
description: Category theory formalizes many mathematical structures, especially the mapping between objects. A modular tensor category is a category with some extra structures, and is an excellent tool to describe some physical concepts, especially the topological orders.
---

$$
\gdef\id{\mathrm{id}}
\gdef\tr{\operatorname{tr}}
\gdef\Hom{\operatorname{Hom}}
\gdef\End{\operatorname{End}}
\gdef\1{\mathbf{1}}
\gdef\cat#1{\mathcal{#1}}
\gdef\Cat#1{\textsf{\textbf{#1}}}
$$

Category theory formalizes many mathematical structures, especially the mapping between objects. A modular tensor category is a category with some extra structures, and is an excellent tool to describe some physical concepts, especially the topological orders.

In part 1, we will begin with the basic ideas of category theory, as a foundation of the following things.

## Basic knowledge of categories

### Category

A **category** $\cat{C}$ consists of

- **Objects**: $x\in\cat{C}$
- **Morphisms**: $f\colon x\to y$ or more precisely $f\in\Hom_{\cat{C}}(x,y)$. We call $\Hom_{\cat{C}}(x,y)$ the *hom-set* and $x$ and $y$ *domain* and *codomain* respectively
- If we have two morphisms $f\colon x\to y$ and $g\colon y\to z$, then there exists the **composition** of morphisms $g\circ f\colon x\to z$

and the following axioms should hold:

- **Associativity**: for $f\colon x\to y$, $g\colon y\to z$ and $h\colon z\to w$, their composition should satisfy

  $$ (h\circ g)\circ f = h\circ(g\circ f) $$

- **Identity**: $\forall x\in\cat{C}$, there exists an identity morphism $\id_x\colon x\to x$ such that

  $$ f\circ \id_x = \id_y\circ f = f, \quad \forall f\colon x\to y$$

In a pictorical representation, the morphism in a category can be visualized as a "black box":

![morphism](/images/category-theory/morphism.svg){:.invert}{:style="max-width: 210px;"}

For identity morphism $\id_x$, the box can be omitted:

![id-morphism](/images/category-theory/id-morphism.svg){:.invert}{:style="max-width: 160px;"}

For the composition of two morphisms $f$ and $g$, we use two consecutive boxes:

![composition](/images/category-theory/composition.svg){:.invert}{:style="max-width: 180px;"}

Note that in our convention, these diagrams should be read *from top to bottom*, as the arrows indicate. The direction will be significant when we meet the dual of objects (see below).

There are some special cases of morphisms. Let $f\colon x\to y$, then

- $f$ is a **monomorphism** if for all morphisms $g_1, g_2\colon w\to x$, $f\circ g_1=f\circ g_2\implies g_1=g_2$ (left cancellable)
- $f$ is a **epimorphism** if for all morphisms $h_1, h_2\colon y\to z$, $h_1\circ f=h_2\circ f\implies h_1=h_2$ (right cancellable)
- $f$ is an **isomorphism** if there exists $f^{-1}\colon y\to x$ such that $f^{-1}\circ f=\id_x$ and $f\circ f^{-1}=\id_y$. Here, $f^{-1}$ is called the **inverse** of $f$
- If the domain and codomain of $f$ conincide, i.e. $f\in\Hom_{\cat{C}}(x,x)\coloneqq\End_{\cat{C}}(x)$, then $f$ is an **endomorphism**
- If $f$ is both an endomorphism and an isomorphism, then it's called an **automorphism**

<!--
Clearly, the composition of two endomorphisms is still an endomorphism. So the set of all endomorphisms of $x$ form a *monoid* $\operatorname{End}_{\cat{C}}(x)$:
  - $\id_x$ corresponds to the identity element in the monoid
  - Composition of corresponds to the multiplication in the monoid with the associativity axiom
-->

To better understand the abstract idea of category, objects and morphisms, we give some concrete examples:

| Categories | Objects            | Morphisms           |
|:----------:|:------------------:|:-------------------:|
| **Set**    | sets               | functions           |
| **Grp**    | groups             | group homomorphisms |
| **Top**    | topological spaces | continuous maps     |
| **Vec**    | vector spaces      | linear maps         |
| **Hask**   | Haskell types      | pure functions      |

### Functor

A **functor** $F\colon \cat{C}\to\cat{D}$ is a map between two categories such that

- Object $x\in\cat{C}$ maps to object $F(x)\in\cat{D}$
- Morphism $f\in\Hom_{\cat{C}}(x,y)$ maps to $F(f)\in\Hom_{\cat{D}}(F(x),F(y))$

where $F$ preserves

- Identity:

  $$ F(\id_x) = \id_{F(x)} \in \cat{D}, \quad \forall x\in\cat{C} $$

- Composition:

  $$ F(g\circ f) = F(g)\circ F(f) \in \Hom_{\cat{D}}(F(x),F(z)), \quad \forall f\in\Hom_{\cat{C}}(x,y), \, g\in\Hom_{\cat{C}}(y,z) $$

In Haskell, functor is defined as a **type class**:

```haskell
class Functor f where
    fmap :: (a -> b) -> f a -> f b
```

The two laws that a functor should obey are then:

```haskell
fmap id      == id               -- Preserve identities
fmap (f . g) == fmap f . fmap g  -- Preserve composition
```

Let's see an example. First we have a function that convert an integer to string:

```haskell
show :: Int -> String
```

Then we have the `List` (or `[]`) functor, which maps the **Hask** category to **Lst** (a subcategory of **Hask** that contains all the list types):

```haskell
instance Functor [] where
    fmap = ...
```

Therefore `fmap show` is a function (i.e. morphism) in **Lst** that converts a list of integers to a list of strings.

### Natural transformation

Given two functors $F\colon \cat{C}\to\cat{D}$ and $G\colon \cat{C}\to\cat{D}$, a **natural transformation** (aka. functorial morphism) $\tau\colon F\Rightarrow G$ is defined with its *component* $\tau_x$ (a morphism in $\cat{D}$):

$$ \tau_x\colon F(x)\to G(x), \quad \forall x\in\cat{C} $$

such that

$$ \tau_y\circ F(f) = G(f)\circ\tau_x, \quad \forall f\in\Hom_{\cat{C}}(x,y) $$

In a diagrammatic language, that is to say the following diagram is *commutative*, i.e. the two paths from $F(x)$ to $G(y)$ are equivalent:

![natural-transformation](/images/category-theory/natural-transformation.svg){:.invert}{:.tikz-cd}{:style="max-width: 270px;"}

or more complicated:

TODO: triangle -> prism [maclane p.16]

A natural transformation $\tau$ with every component $\tau_x$ invertible is called a **natural isomorphism**. In such case, we can automatically define the natural transformation $\tau^{-1}$ with components $\tau^{-1}_x\colon G(x)\to F(x)$ such that

$$ \tau^{-1}_x\circ\tau_x = \id_{F(x)}, \quad \tau_x\circ\tau^{-1}_x = \id_{G(x)} $$

In Haskell, natural transformation is given by **parametric polymorphic functions**, such as

```haskell
natTrans :: forall a . F a -> G a
```

where `a` is the type parameter, while `F` and `G` are two functors (i.e. type classes which are instances of `Functor`).

To give a concrete example, we will implement a "safe" version of `head`. In Haskell Prelude, `head` is a function that returns the first item of a list:

```haskell
head :: [a] -> a
head (x:xs) = x
```

So clearly `head [1,2,3]` gives `1`. But it will throw an exception when applied on an empty list:

```haskell
> head []
*** Exception: Prelude.head: empty list
```

We can use `Maybe` (similar to `std::option<T>` in C++ and `Option<T>` in Rust) as a wrapper to avoid such exception:

```haskell
safeHead :: [a] -> Maybe a
safeHead []     = Nothing
safeHead (x:xs) = Just x
```

Here `safeHead` is a polymorphic function, or natural transformation in category theory's language, that maps from `[]` functor to `Maybe` functor. Note that, however, the `safeHead` function may [break the free theorem for `fmap`](https://stackoverflow.com/a/6364990/).

## Monoidal category

Roughly speaking, a monoidal category (or tensor category) is a category with a "tensor product". A basic example is the vector space (or the category **Vec**), where tensor product is defined as the combination of two vector spaces, as well as the linear maps over them.

The formal definition requires some other concepts:

- For categories $\cat{C}$ and $\cat{C}^\prime$, their **Cartesian product** $\cat{C}\times\cat{C}^\prime$ is also a category where
  - Object is a pair $(x,x^\prime)$
  - Morphism is $(f,f^\prime)\colon(x,x^\prime)\to(y,y^\prime)$
  - Identity is $\id_{(x,x^\prime)}\coloneqq(\id_x,\id_{x^\prime})\colon(x,x^\prime)\to(x,x^\prime)$
  - Composition is $(g,g^\prime)\circ(f,f^\prime)\coloneqq(g\circ f,g^\prime\circ f^\prime)$
- A **bifunctor** $F\colon\cat{C}\times\cat{C}^\prime\to\cat{D}$ is a map such that
  - Object $(x,x^\prime)\in\cat{C}\times\cat{C}^\prime$ maps to object $F(x,x^\prime)\in\cat{D}$
  - Morphism $(f,f^\prime)\in\Hom_{\cat{C}\times\cat{C}^\prime}((x,x^\prime),(y,y^\prime))$ maps to $F(f,f^\prime)\in\Hom_{\cat{D}}(F(x,x^\prime),F(y,y^\prime))$
  - The identity and composition are preserved just as in a normal functor

Now we are able to define the **monoidal category** $\cat{C}$ with

- **Tensor product**, which is a bifunctor $\otimes\colon\cat{C}\times\cat{C}\to\cat{C}$
- A **unit object** $\1\in\cat{C}$
- **Associator** $\alpha$, which is a natural isomorphism:

  $$ \alpha_{x,y,z} \colon (x\otimes y)\otimes z \overset\sim\to x\otimes(y\otimes z), \quad \forall x,y,z \in \cat{C} $$

- **Left unitor** $\lambda$ and **right unitor** $\rho$, which are natural isomorphisms with

  $$ \lambda_x \colon \1\otimes x \overset\sim\to x, \quad \rho_x \colon x\otimes\1 \overset\sim\to x, \quad \forall x \in \cat{C} $$

such that the following two diagrams commute:

- Triangle equation:

  ![triangle-equation](/images/category-theory/triangle-equation.svg){:.invert}{:.tikz-cd}{:style="max-width: 360px;"}

- Pentagon equation:

  ![pentagon-equation](/images/category-theory/pentagon-equation.svg){:.invert}{:.tikz-cd}{:style="max-width: 560px;"}

In the above definition, we use "$\overset\sim\to$" to denote the natural isomorphism. If "$\overset\sim\to$" becomes "$=$", then we call the monoidal category **strict**. In such case, $\alpha_x$, $\lambda_x$ and $\rho_x$ become identity isomorphisms.

MacLane gives the following important result:

> **Coherence theorem:**\\
> *Every monoidal category is equivalent to a strict one.*

The name "tensor category" is very intuitive, as we have just equipped the category with tensor structure. The alternate name "monoidal category" is not so straight forward, but it indicates an important fact: a strict monoidal category is actually a *monoid* (i.e. a "group" without invertibility):

- Tensor product $\otimes$ corresponds to the multiplication in the monoid with the associativity axiom
- Unit object $\1$ corresponds to the identity element in the monoid

## Braided monoidal category

In physics, we use "exchange" to describe the process of moving two systems around each other, such as the exchange of two fermions/bosons. In category theory, we call it "braiding".

A **braided monoidal category** (or braided tensor category, BTC) $\cat{C}$ is a monoidal category with a natural isomorphism

$$ \sigma_{x,y} \colon x\otimes y \overset\sim\to y\otimes x, \quad \forall x,y \in \cat{C} $$

such that the following diagrams (hexagon equations) commute:

![hexagon-equation](/images/category-theory/hexagon-equation.svg){:.invert}{:.tikz-cd}{:style="max-width: 540px;"}

In the graphical notation, $\sigma$ and its inverse can be visualized as

![sigma](/images/category-theory/sigma.svg){:.invert}{:style="max-width: 480px;"}

Then it can be easily shown that $\sigma_{x,y}^{-1}\circ\sigma_{x,y}=\sigma_{y,x}\circ\sigma_{y,x}^{-1}=\id_{x\otimes y}$, as they are *topologically* equivalent:

![sigma-composition](/images/category-theory/sigma-composition.svg){:.invert}{:style="max-width: 300px;"}

The hexagon equations become apparent as well:

![hexagon-equation-string](/images/category-theory/hexagon-equation-string.svg){:.invert}{:style="max-width: 560px;"}

Furthermore, we can find the following important identities via the graphical calculus:

- $\sigma_{x^\prime,y^\prime}\circ(f\otimes g) = (g\otimes f)\circ\sigma_{x,y}, \quad \forall f\in\Hom_{\cat{C}}(x,x^\prime), \, g\in\Hom_{\cat{C}}(y,y^\prime)$

  ![btc-identity](/images/category-theory/btc-identity.svg){:.invert}{:style="max-width: 250px;"}

- $(\sigma_{y,z}\otimes\id_x) \circ (\id_y\otimes\sigma_{x,z}) \circ (\sigma_{x,y}\otimes\id_z) = (\id_z\otimes\sigma_{x,y}) \circ (\sigma_{x,z}\otimes\id_y) \circ (\id_x\otimes\sigma_{y,z})$, which is called the *Yang--Baxter equation*

  ![yang-baxter-equation](/images/category-theory/yang-baxter-equation.svg){:.invert}{:style="max-width: 270px;"}

A braided monoidal category is called **symmetric**, if $\sigma_{y,x}\circ\sigma_{x,y}=\id_{x\otimes y}$, or equivalently $\sigma_{x,y}=\sigma_{y,x}^{-1}$, just as the following diagram:

![symmetric-category](/images/category-theory/symmetric-category.svg){:.invert}{:style="max-width: 480px;"}

## Ribbon category

### Dual

We first introduce the concept of **dual** in monoidal category. This is a generalization of the dual vector space: given a vector space $V$ over field $F$, its dual space $V^\vee$ is defined as the set of all linear maps $\phi\colon V\to F$.

The **right dual** of an object $x\in\cat{C}$ is an object $x^\vee$ with two morphisms:

$$ e_x\colon x^\vee\otimes x\to\1, \quad i_x\colon\1\to x\otimes x^\vee $$

such that the composition $(\id_x\otimes e_x)\circ(i_x\otimes\id_x)=\id_x$:

$$
x \xrightarrow{i_x\otimes\id_x} (x\otimes x^\vee)\otimes x = x\otimes(x^\vee\otimes x)
  \xrightarrow{\id_x\otimes e_x} x\otimes\1 = x
$$

and $(e_x\otimes\id_{x^\vee})\circ(\id_{x^\vee}\otimes i_x)=\id_{x^\vee}$:

$$
x^\vee \xrightarrow{\id_{x^\vee}\otimes i_x} x^\vee\otimes(x\otimes x^\vee) = (x^\vee\otimes x)\otimes x^\vee
    \xrightarrow{e_x\otimes\id_{x^\vee}} \1\otimes x^\vee = x^\vee
$$

The above conditions are called **rigidity axioms**. In some sense, $e_x$ and $i_x$ are called *annihilation* and *creation* morphisms, as they can annihilate/create objects to/from "vaccum", just as the $\hat{a}$ and $\hat{a}^\dagger$ operators in quantum mechanics.

Similarly, we can define the **left dual** with the following morphisms:

$$ e'_x \colon x\otimes {}^\vee\!x\to\1, \quad i'_x\colon \1\to{}^\vee\!x\otimes x $$

and similar rigidity axioms. By definition, if $x$ is the right dual of $y$, then $y$ is the left dual of $x$, and vice versa. For a monoidal category $\cat{C}$, if every object $x\in\cat{C}$ has left and right duals, then $\cat{C}$ is called **rigid** (or autonomous).

In the graphical notation, the dual of an object is represented by simply reversing the arrow. In addition, the unit object $\1$, or "vaccum", can be neglected. So $e_x$ and $i_x$ correspond to the following diagrams:

![dual](/images/category-theory/dual.svg){:.invert}{:style="max-width: 680px;"}

Then the rigidity axioms (for right dual) become

![rigidity-axioms](/images/category-theory/rigidity-axioms.svg){:.invert}{:style="max-width: 400px;"}

It can be shown that $\Hom_{\cat{C}}(x,y)$ is isomorphic to $\Hom_{\cat{C}}(y^\vee,x^\vee)$, therefore for every morphism $f\in\Hom_{\cat{C}}(x,y)$, we can define the dual as its image $f^\vee\in\Hom_{\cat{C}}(y^\vee,x^\vee)$:

$$ f^\vee \coloneqq (e_y\otimes\id_x) \circ (\id_{y^\vee}\otimes f\otimes\id_{x^\vee}) \circ (\id_{y^\vee}\otimes i_x) $$

or in the graphical notation:

![f-dual](/images/category-theory/f-dual.svg){:.invert}{:style="max-width: 360px;"}

If combine the dual with monoidal and braiding structures, we can then immediately find some important identities:

- $(x\otimes y)^\vee = y^\vee\otimes x^\vee$

  ![dual-and-monoidal](/images/category-theory/dual-and-monoidal.svg){:.invert}{:style="max-width: 300px;"}

- $(e_y\otimes\id_x)\circ\sigma_{x,y^\vee\otimes y} = \sigma_{x,\1}\circ(\id_x\otimes e_y)$

  ![lemma-e-sigma](/images/category-theory/lemma-e-sigma.svg){:.invert}{:style="max-width: 270px;"}

- $e_{x\otimes y} = (e_x\otimes e_y)\circ(\sigma_{y^\vee,x^\vee\otimes x}\otimes\id_y)$

  ![e-and-braiding](/images/category-theory/e-and-braiding.svg){:.invert}{:style="max-width: 300px;"}

- $i_{x\otimes y} = (\id_x\otimes\sigma_{x^\vee,y^\vee\otimes y})\circ(i_x\otimes i_y)$

  ![i-and-braiding](/images/category-theory/i-and-braiding.svg){:.invert}{:style="max-width: 300px;"}

- $\sigma_{x,y}^\vee = \sigma_{x^\vee,y^\vee}$

  ![dual-and-braiding](/images/category-theory/dual-and-braiding.svg){:.invert}

where $\sigma$ can be replaced by $\sigma^{-1}$ in the last two equations.

TODO: tensor functor [Kirillov p.18]

### Ribbon

A **ribbon category** (aka. tortile category or balanced rigid braided monoidal category) is a rigid braided monoidal category with a natural isomorphism

$$ \delta_x \colon x \overset\sim\to x^{\vee\vee}, \quad \forall x\in\cat{C} $$

such that

$$
\delta_{x\otimes y} = \delta_x\otimes\delta_y, \quad
\delta_\1 = \id_\1, \quad
\delta_{x^\vee} = (\delta_x^\vee)^{-1}
$$

In a rigid braided monoidal category $\cat{C}$, we can construct the following natural isomorphism

$$
\psi_x \colon x^{\vee\vee} \overset\sim\to x, \quad
\psi_x \coloneqq (\id_x\otimes e_{x^\vee}) \circ (\id_x\otimes\sigma_{x^{\vee\vee},x^\vee}^{-1}) \circ (i_x\otimes\id_{x^{\vee\vee}}), \quad
\forall x\in\cat{C}
$$

which satisfies:

$$
\psi_{x\otimes y} = \sigma_{y,x} \circ \sigma_{x,y} \circ (\psi_x\otimes\psi_y), \quad
\psi_\1 = \id_\1, \quad
\psi_{x^\vee} = \delta_x^\vee \circ \psi_x^\vee \circ \delta_x^\vee \enspace \text{(if $\cat{C}$ is ribbon)}
$$

Then we can define the following natural isomorphism in a ribbon category $\cat{C}$:

$$ \theta_x \colon x \overset\sim\to x, \quad \theta_x \coloneqq \psi_x \circ \delta_x, \quad \forall x\in\cat{C} $$

which is called **twist** (or balancing isomorphism). It satisfies the **balancing axioms**:

$$
\theta_{x\otimes y} = \sigma_{y,x} \circ \sigma_{x,y} \circ (\theta_x\otimes\theta_y), \quad
\theta_\1 = \id_\1, \quad
\theta_{x^\vee} = \theta_x^\vee
$$

A family of twists can uniquely determine a family of $\psi$, hence we can define the ribbon category using $\theta$ equivalently.

The graphical notation of $\theta$ can be deduced from the definition of $\psi$, once we identify $x$ and $x^{\vee\vee}$ (i.e. simply ignore $\delta$):

![twist](/images/category-theory/twist.svg){:.invert}{:style="max-width: 250px;"}

However, if we imagine the above thing as a 1D line or string in $\R^3$, then we man think that $\theta=\id$, which is not true generally. Therefore, we may turn to using a 2D object, or a "ribbon", to correctly represent $\theta$:

TODO:
<!-- ![twist-ribbon](/images/category-theory/twist-ribbon.svg){:.invert} -->

When we try to straighten it, we will get a ribbon with a "twist", and clearly it's not the same as a flat one. With such "ribbon" representation, the identity $\theta_{x\otimes y}=\sigma_{y,x}\circ\sigma_{x,y}\circ(\theta_x\otimes\theta_y)$ can be visualized as:

TODO:
<!-- ![twist-identity](/images/category-theory/twist-identity.svg){:.invert} -->

For an endomorphism $f\in\End_{\cat{C}}(x)$, where $\cat{C}$ is a ribbon category, we can define the **trace** $\tr f\in\End_{\cat{C}}(\1)$ as the following composition:

$$
\tr f \colon \1 \xrightarrow{i_x} x\otimes x^\vee
                \xrightarrow{f\otimes\id_{x^\vee}} x\otimes x^\vee
                \xrightarrow{\delta_x\otimes\id_{x^\vee}} x^{\vee\vee}\otimes x^\vee
                \xrightarrow{e_{x^\vee}} \1
$$

In particular, when $f=\id_x$, we can define the **dimension** of $x\in\cat{C}$ as $\dim x\coloneqq\tr\id_x$. The graphical representation of trace and dimension are the following:

![trace-dimension](/images/category-theory/trace-dimension.svg){:.invert}{:style="max-width: 400px;"}

## References

- Mac Lane S. *Categories for the Working Mathematician*
- Milewski B. [*Category Theory for Programmers*](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)
- Baez J C, Stay M. *Physics, Topology, Logic and Computation: A Rosetta Stone*, [arXiv:0903.0340](https://arxiv.org/abs/0903.0340)
- Bakalov B, Kirillov A. [*Lectures on Tensor Categories and Modular Frunctor*](https://www.math.stonybrook.edu/~kirillov/tensor/tensor.html)
- Müger M. *Tensor categories: A selective guided tour*, [arXiv:0804.3587](https://arxiv.org/abs/0804.3587)
- Turaev V G. *Quantum Invariants of Knots and 3-Manifolds*
- Lou J, Shen C, Chen C, Hung L Y. *A (Dummy's) Guide to Working with Gapped Boundaries via (Fermion) Condensation*, [arXiv:2007.10562](https://arxiv.org/abs/2007.10562)
- 张智浩. [日常的数学和物理问题](https://zhuanlan.zhihu.com/c_123465504)
