---
layout: post
title: Notes on modular tensor category
date: 2020-08-28
lang: en-US
math: true
description: TODO
published: false
---

$$
\gdef\id{\mathrm{id}}
\gdef\1{\Cat{1}}
\gdef\cat#1{\mathcal{#1}}
\gdef\Cat#1{\mathbf{#1}}
$$

## Basic knowledge of categories

### Category

A **category** $\cat{C}$ consists of

- **Objects**: $x\in\cat{C}$
- **Morphisms**: $f\colon x\to y$ or more precisely $f\in\hom(x,y)$. We call $\hom_{\cat{C}}(x,y)$ the *hom-set* and $x$ and $y$ *domain* and *codomain* respectively
- If we have two morphisms $f\colon x\to y$ and $g\colon y\to z$, then there exists the **composition** of morphisms $g\circ f\colon x\to z$

and the following axioms should hold:

- **Associativity**: for $f\colon x\to y$, $g\colon y\to z$ and $h\colon z\to w$, their composition should satisfy

  $$ (h\circ g)\circ f = h\circ(g\circ f) $$

- **Identity**: $\forall x\in\cat{C}$, there exists an identity morphism $\id_x\colon x\to x$ such that

  $$ f\circ \id_x = \id_y\circ f = f, \quad \forall f\colon x\to y$$

In a pictorical representation (*string diagram*), the morphism in a category can be visualized as a "black box":

![morphism](/images/category-theory/morphism.svg){:.invert}{:style="max-width: 210px;"}

For identity morphism $\id_x$, the box can be omitted:

![id-morphism](/images/category-theory/id-morphism.svg){:.invert}{:style="max-width: 160px;"}

For the composition of two morphisms $f$ and $g$, we use two consecutive boxes:

![composition](/images/category-theory/composition.svg){:.invert}{:style="max-width: 180px;"}

There are some special cases of morphisms:

- $f\colon x\to y$ is an **isomorphism** if there exists $g\colon y\to x$ such that $g\circ f=\id_x$ and $f\circ g=\id_y$. $g$ is called the **inverse** of $f$, or $g=f^{-1}$
- If the domain and codomain of $f$ conincide, i.e. $f\in\hom_{\cat{C}}(x,x)$, then $f$ is an **endomorphism**
- If $f$ is both an endomorphism and an isomorphism, then it's called an **automorphism**

<!--
Clearly, the composition of two endomorphisms is still an endomorphism. So the set of all endomorphisms of $x$ form a *monoid* $\operatorname{End}_{\cat{C}}(x)$:
  - $\id_x$ corresponds to the identity element in the monoid
  - Composition of corresponds to the multiplication in the monoid with the associativity axiom
-->

To better understand the abstract idea of category, objects and morphisms, we give some concrete examples:

| Category     | Objects            | Morphisms           |
|:------------:|:------------------:|:-------------------:|
| $\Cat{Set}$  | sets               | functions           |
| $\Cat{Grp}$  | groups             | group homomorphisms |
| $\Cat{Top}$  | topological spaces | continuous maps     |
| $\Cat{Vec}$  | vector spaces      | linear maps         |
| $\Cat{Hask}$ | Haskell types      | pure functions      |

### Functor

A **functor** $F\colon \cat{C}\to\cat{D}$ is a map between two categories such that

- Object $x\in\cat{C}$ maps to object $F(x)\in\cat{D}$
- Morphism $f\in\hom_{\cat{C}}(x,y)$ maps to $F(f)\in\hom_{\cat{D}}(F(x),F(y))$

where $F$ preserves

- Identity:

  $$ F(\id_x) = \id_{F(x)} \in \cat{D}, \quad \forall x\in\cat{C} $$

- Composition:

  $$ F(g\circ f) = F(g)\circ F(f) \in \hom_{\cat{D}}(F(x),F(z)), \quad \forall f\in\hom_{\cat{C}}(x,y), \, g\in\hom_{\cat{C}}(y,z) $$

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

Then we have the `List` (or `[]`) functor, which maps the $\Cat{Hask}$ category to $\Cat{Lst}$ (a subcategory of $\Cat{Hask}$ that contains all the list types):

```haskell
instance Functor [] where
    fmap = ...
```

Therefore `fmap show` is a function (i.e. morphism) in $\Cat{Lst}$ that converts a list of integers to a list of strings.

### Natural transformation

Given two functors $F\colon \cat{C}\to\cat{D}$ and $G\colon \cat{C}\to\cat{D}$, a **natural transformation** (aka. functorial morphism) $\tau\colon F\Rightarrow G$ is defined with its *component* $\tau_x$ (a morphism in $\cat{D}$):

$$ \tau_x\colon F(x)\to G(x), \quad \forall x\in\cat{C} $$

such that

$$ \tau_y\circ F(f) = G(f)\circ\tau_x, \quad \forall f\in\hom_{\cat{C}}(x,y) $$

In a diagrammatic language, that is to say the following diagram is *commutative*, i.e. the two paths from $F(x)$ to $G(y)$ are equivalent:

![natural-transformation](/images/category-theory/natural-transformation.svg){:.invert}{:.tikz-cd}{:style="max-width: 270px;"}

A natural transformation $\tau$ with every component $\tau_x$ invertible is called a **natural isomorphism**. In such case, we can automatically define the natural transformation $\tau^{-1}$ with components $\tau^{-1}_x\colon G(x)\to F(x)$ such that

$$ \tau^{-1}_x\circ\tau_x = \id_{F(x)}, \quad \tau_x\circ\tau^{-1}_x = \id_{G(x)} $$

In Haskell, natural transformation is given by parametric polymorphic functions. TODO:

## Monoidal category

Roughly speaking, a monoidal category (or tensor category) is a category with a "tensor product". A basic example is the vector space (or the category $\Cat{Vec}$), where tensor product is defined to combine two vector spaces, as well as the linear maps.

The formal definition requires some other concepts:

- For categories $\cat{C}$ and $\cat{C}^\prime$, their **Cartesian product** $\cat{C}\times\cat{C}^\prime$ is also a category where
  - Object is a pair $(x,x^\prime)$
  - Morphism is $(f,f^\prime)\colon(x,x^\prime)\to(y,y^\prime)$
  - Identity is $\id_{(x,x^\prime)}\coloneqq(\id_x,\id_{x^\prime})\colon(x,x^\prime)\to(x,x^\prime)$
  - Composition is $(g,g^\prime)\circ(f,f^\prime)\coloneqq(g\circ f,g^\prime\circ f^\prime)$
- A **bifunctor** $F\colon\cat{C}\times\cat{C}^\prime\to\cat{D}$ is a map such that
  - Object $(x,x^\prime)\in\cat{C}\times\cat{C}^\prime$ maps to object $F(x,x^\prime)\in\cat{D}$
  - Morphism $(f,f^\prime)\in\hom_{\cat{C}\times\cat{C}^\prime}((x,x^\prime),(y,y^\prime))$ maps to $F(f,f^\prime)\in\hom_{\cat{D}}(F(x,x^\prime),F(y,y^\prime))$
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

The name "tensor category" is very intuitive, as we have just equipped the category with tensor structure. The other name "monoidal category" is not so straight forward, but it indicates an important fact: a strict monoidal category is actually a *monoid* (i.e. a "group" without invertibility):

- Tensor product $\otimes$ corresponds to the multiplication in the monoid with the associativity axiom
- Unit object $\1$ corresponds to the identity element in the monoid

## Braided monoidal category

In physics, we use "exchange" to describe the process of moving two systems around each other, such as the exchange of two fermions/bosons. In category theory, we call it "braiding".

A **braided monoidal category** (or braided tensor category, BTC) $\cat{C}$ is a monoidal category with a natural isomorphism

$$ \sigma_{x,y} \colon x\otimes y \overset\sim\to y\otimes x, \quad \forall x,y \in \cat{C} $$

such that the following diagrams (hexagon equations) commute:

![hexagon-equation](/images/category-theory/hexagon-equation.svg){:.invert}{:.tikz-cd}{:style="max-width: 540px;"}

In the string diagram, $\sigma$ and its inverse can be visualized as

![sigma](/images/category-theory/sigma.svg){:.invert}{:style="max-width: 480px;"}

Then it can be easily shown that $\sigma_{x,y}^{-1}\circ\sigma_{x,y}=\sigma_{y,x}\circ\sigma_{y,x}^{-1}=\id_{x\otimes y}$, as they are *topologically* equivalent:

![sigma-composition](/images/category-theory/sigma-composition.svg){:.invert}{:style="max-width: 300px;"}

The hexagon equations become apparent as well:

![hexagon-equation-string](/images/category-theory/hexagon-equation-string.svg){:.invert}{:style="max-width: 560px;"}

Furthermore, we can give the following important identities via the string diagrams:

- $\sigma_{x^\prime,y^\prime}\circ(f\otimes g) = (g\otimes f)\circ\sigma_{x,y}, \quad \forall f\in\hom_{\cat{C}}(x,x^\prime), \, g\in\hom_{\cat{C}}(y,y^\prime)$

  ![btc-identity](/images/category-theory/btc-identity.svg){:.invert}{:style="max-width: 250px;"}

- Yang--Baxter equation

  ![yang-baxter-equation](/images/category-theory/yang-baxter-equation.svg){:.invert}{:style="max-width: 270px;"}

A braided monoidal category is called **symmetric**, if $\sigma_{y,x}\circ\sigma_{x,y}=\id_{x\otimes y}$, or equivalently $\sigma_{x,y}=\sigma_{y,x}^{-1}$, just as the following diagram:

![symmetric-category](/images/category-theory/symmetric-category.svg){:.invert}{:style="max-width: 480px;"}

## Rigid monoidal category

We first introduce the concept of **dual** in monoidal category. This is a generalization of the dual vector space: for a vector space $V$ over field $F$, its dual space $V^*$ is defined as the set of all linear maps: $\phi\colon V\to F$.

The **right dual** of an object $x\in\cat{C}$ is an object $x^*$ with two morphisms:

$$ e_x\colon x^*\otimes x\to\1, \quad i_x\colon\1\to x\otimes x^* $$

such that the composition $(\id_x\otimes e_x)\circ(i_x\otimes\id_x)=\id_x$:

$$
x \xrightarrow{i_x\otimes\id_x} (x\otimes x^*)\otimes x = x\otimes(x^*\otimes x)
  \xrightarrow{\id_x\otimes e_x} x\otimes\1 = x
$$

and $(e_x\otimes\id_{x^\*})\circ(\id_{x^\*}\otimes i_x)=\id_{x^\*}$:

$$
x^* \xrightarrow{\id_{x^*}\otimes i_x} x^*\otimes(x\otimes x^*) = (x^*\otimes x)\otimes x^*
    \xrightarrow{e_x\otimes\id_{x^*}} \1\otimes x^* = x^*
$$

The above conditions are called **rigidity axioms**.

Similarly, we can define the **left dual** with the following morphisms:

$$ e'_x \colon x\otimes {}^*\!x\to\1, \quad i_x\colon \1\to{}^*\!x\otimes x $$

and similar rigidity axioms.

<!-- TODO: pictorical representation -->

It can be easily shown that $\hom_{\cat{C}}(x,y)$ is isomorphic to $\hom_{\cat{C}}(y^\*,x^\*)$, therefore for every morphism $f\in\hom_{\cat{C}}(x,y)$, we can define the dual as its image $f^\*\in\hom_{\cat{C}}(y^\*,x^\*)$.

Now we can give the following definitions:

- A monoidal category $\cat{C}$ is called **rigid** if every object $x\in\cat{C}$ has left and right duals
- A **ribbon category** (aka. tortile category or balanced rigid braided monoidal category) is a rigid braided monoidal category with a natural isomorphism

  $$ \delta_x \colon x \overset\sim\to x^{**}, \quad \forall x\in\cat{C} $$

  such that

  $$ \delta_{x\otimes y} = \delta_x\otimes\delta_y, \quad \delta_\1 = \id_\1, \quad \delta_{x^*} = (\delta_x^*)^{-1} $$

## References

- Mac Lane S. *Categories for the Working Mathematician*
- Milewski B. [*Category Theory for Programmers*](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)
- Baez J C, Stay M. *Physics, Topology, Logic and Computation: A Rosetta Stone*, [arXiv:0903.0340](https://arxiv.org/abs/0903.0340)
- Bakalov B, Kirillov A. [*Lectures on Tensor Categories and Modular Frunctor*](https://www.math.stonybrook.edu/~kirillov/tensor/tensor.html)
- Müger M. *Tensor categories: A selective guided tour*, [arXiv:0804.3587](https://arxiv.org/abs/0804.3587)
- Turaev V G. *Quantum Invariants of Knots and 3-Manifolds*
