---
sidebar_position: 3
keywords: pallet design, intermediate, runtime
theme: codeview
code: code/kitties-tutorial/02-create-kitties.rs
---

# Part II: Create, view and own Kitties
In this part of the tutorial, we'll build the parts of our pallet 
needed to manage the creation, ownership and visualization of our Kitties.

## Learning outcomes

- Writing a struct to store details about our Kitties
- Using the Randomness trait to create unique Kitties
- Creating and using pallet Events
- Writing functions to own and issue a Kitty 
- Viewing owned Kitties
## Overview



## Steps

### 1. Create the Kitty struct

#### Understanding what information to include

Structs are a useful tool to help carry information that corresponds to the same object. 
For our purposes, instead of using separate storage items for each of our Kitty traits, 
we can store this information in a single struct. This comes in handy when trying to optimize
for storage reads and writes. Let's first go over what information a single Kitty carries:

- `id`: a unique hash to identify each Kitty
- `dna`: the hash used to identify the DNA of a Kitty, which corresponds to its unique features.
DNA is also used to breed new Kitties and to keep track of different Kitty generations.
- `price`: this is a balance that corresponds to the amount needed to buy a Kitty and 
determined by its owner
- `gender`: an enum that can be either `Male` or `Female`.

:::note 
You could ofcourse add whichever additional pieces of information you want to your 
Kitty struct. In this tutorial, we're going to keep things simple.
:::

#### Writing out the struct
Now that we know what to include in our Kitty struct, let's recap the basics of declaring a struct.
Any struct has the following format:

```rust
#[derive(Clone, Encode, Decode, Default, PartialEq)]
pub struct SomeStruct<SomeType1, SomeType2> {
    value_1: SomeType1,
    value_2: SomeType2,
```
We use the derive macro to include various helper types for using our struct. 

:::tip Your turn!
Write out the Kitty struct and include all the essential values. 
HINT: it will take `Hash` and `Balance` as its types.
:::
#### Adding the `Hash` dependency
We already know the types of the different items in our struct. There's `Hash`, `Balance` and `Gender`. 

For `Gender`, we'll need to build out our own custom enum and functions. Similarly, `Balance` 
will be something we define in our configuration trait. However, we can import 
the `Hash` types from the `frame_support` library. Write this at the top of your pallet where 
the dependencies are declared:

```rust
	use frame_support::sp_runtime::traits::{Hash};
```

#### Adding the custom `Gender` dependency

`Gender` will have three parts to it:
1. An enum declaration
2. A function to configure a defaut value 

Setting up our `Gender` enum this way allows us to derive a Kitty's gender by the randomness
created by each Kitty's DNA.

#### Enums

Writing enums requires us to use the derive macro which must precede the enum declaration. 

A typical enum would be structured like such:

```rust
	#[derive(Encode, Decode, Debug, Clone, PartialEq)]
	pub enum TypicalEnum {
		One,
		Two,
	}
```

Then, we can write out the default implementation by using Rust's [`Default` trait][default-rustdocs].
This would look something like this:

```rust
	impl Default for TypicalEnum {
		fn default() -> Self {
			TypicalEnum::One
		}
	}
```
It's like saying: we're giving our enum a special trait that allows us to initialize it to a specific value.
Great, we now know how to create a custom struct and specify its default value. But what about providing
a way for a Kitty struct to be assigned a gender value? For that we need to learn one more thing. 
#### Configuring functions for our Kitty struct

Configuring a struct is useful in order to pre-define a value in our struct. For example, if we want to 
set a value according to what another function returns. In our case we have a similar situation where 
we need to configure our Kitty struct in such a way that sets `Gender` according to a Kitty's DNA. We'll
only be using this function when we're creating Kitties but let's learn how to write it now and get it out
of the way.

When you're implementing the configuration trait for a struct inside a FRAME pallet, you're doing the 
same type of thing as implementing some trait for an enum except you're implementing the generic
configuration trait, `Config`. 

Building off our previous example, this would look like:

```rust
impl<T: Config> TypicalEnum {
		pub fn special_function(some_hash: T::Hash) -> TypicalEnum {
			if some_hash.as_ref()[0] % 2 == 0 {
				TypicalEnum::One
			} else {
				TypicalEnum::Two
			}
		}
	}
```
Now whenever `special_function` is called inside our pallet, it will return the enum value associated with
the function's logic.

:::tip Your turn!
Write out the `Gender` enum, trait implementations and `Config` implementation to define the behaviour
of `Gender` for our `Kitties` struct.
:::
### 2. Create and use the Randomness trait

### 3. Create and use pallet Events

### 4. How to own and issue a Kitty NFT

### 5. How to view owned Kitties

## Next steps

[default-rustdocs]: https://doc.rust-lang.org/std/default/trait.Default.html