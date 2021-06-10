---
sidebar_position: 4
keywords: pallet design, intermediate, runtime
---

# Part III: Interacting with your Kitties
_This is tutorial steps you through building a fully functional dapp for managing Substrate Kitties._

## Goal

Build function's to interact with a Kitty NFT.
## Overview

In this first part, you will break things down into components which you will need to build throughout the tutorial.
In doing so, you will learn the basics of setting up a pallet and including basic storage items to run your Substrate node.

Before jumping into the next section, let's have a look at what we'll be doing.

The Kitties tutorial is a step by step guide to build a decentralized application that enables the creation and ownership management
of NFT Kitties. In this implementation, to keep things simple, Kitties really can only do the following things:
- be created either by some original source or by being bred by existing Kitties.
- be sold at a price set by their owner
- be transferred from one owner to another

## Steps

### 1. Set a price for each Kitty

### 2. Transfer a Kitty 

### 3. Buy a Kitty

In the previous step, we've added the functions necessary to transfer the ownership of our
Kitty NFTs. But there's no actual specification over a 
currency transfer that would happen if the Kitty was bought or sold. In this step we'll learn how to use FRAME's Currency trait to adjust account balances 
using its associated [`transfer` method][transfer-currency-rustdocs]. 

It's useful to understand how the `transfer` function can be accessed, and why
it's important to use it in our case. The reason we'll be using it is to ensure our runtime has the same understanding of currency throughout the pallets
it interacts with. The way that we ensure this is to use the `Currency` trait
from [`frame_support`][frame-balances-rustdocs]. Conveniently, it handles a 
`Balance` type, making it compatible with `pallet_balances` which we've been 
using from our pallet's configuration trait. Here's how the `transfer` 
function we'll be using is structured:
```rust
fn transfer(
    source: &AccountId,
    dest: &AccountId,
    value: Self::Balance,
    existence_requirement: ExistenceRequirement
) -> DispatchResult
```

In order to use this function, we'll need to import `Currency` and `ExistenceRequirement` from `frame_support`. 

Now that we've went over the things that makes this extrinsic unqique,
you have everything you need to know to put it together! A brief overview 
may help you ensure you've included all the right pieces:

- Declare your extrinsic with an appropriate weight (100 will do for our purposes)
- It will take 3 arguments: `origin`, `kitty_id` and `max_price`
- It will check that kitty_id corresponds to a Kitty in storage
- It will check that the Kitty has an owner
- It will check that the account buying the Kitty doesn't already own it
- It will check that the price of the Kitty is not zero. If it is, it will throw an error
- It will check that the Kitty price is not greater than `ask_price`
- It will use the `transfer` function from the `Currency` trait to update
account balances (as described above)
- It will use our pallet's `transfer_from` function to change the ownership
of the Kitty from `owner` to `sender`
- It will update the price of the Kitty to the price it was sold at




### 4. How to breed new Kitties

## Examples

## Resources
#### How-to guides

#### Rust docs

[transfer-currency-rustdocs]: https://crates.parity.io/frame_support/traits/tokens/currency/trait.Currency.html#tymethod.transfer
[frame-balances-rustdocs]: https://crates.parity.io/frame_support/traits/tokens/currency/trait.Currency.html