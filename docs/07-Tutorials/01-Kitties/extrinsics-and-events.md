---
sidebar_position: 4
keywords: pallet design, intermediate, runtime
---

# Part III: Extrinsics and Events
_Write the first extrinsic that creates a Kitty and emits its associated Event._

## Learning outcomes

- Write an extrinsic that updates storage items using a help function
- Write and use pallet Events

## Overview
In the previous section of this tutorial, we laid down the foundations to manage the ownership of our Kitties &mdash; when they
come to existance! In this part of the tutorial, we'll be putting these foundations to use 
by creating a Kitty on-chain, along with some error checking. This part can be broken down in the following way:
- **writing `create_kitty`**: this is the extrinsic or callable function allowing an account to mint a Kitty.
- **writing `mint()`**: a helper function that updates our pallet's storage items and performs error checks.
- **including `Events`**: using FRAME's `#[pallet::events]` macro to declare events

At the end of this section, we'll check that everything compiles without error and call our `create_kitty` extrinsic using the PolkadotJS Apps UI.

## Steps

### 1. The `create_kitty` architecture

Before we dive right in, it's important to understand the design decisions we'll make around minting and managing the ownership 
capabilities of our Kitties.

As developers, we want to make sure the code we write is efficient and elegant. Often, optimizing for one optimizes for the other.
The way we're going to set our pallet up to achieve elegance and efficiency will be to break the "heavy lifting" dispatchable 
functions or extrinsics into private helper functions. This improves code readability and reusability too. We'll be using this design approach in the next section but for our immediate purposes, this entails using the public `create_kitty` dispatchable to:
- check the origin is signed
- generate a random hash with the signing account 
- create a new Kitty object using the random hash
- call a private `mint()` function
- increment the nonce using `increment_nonce()` from the previous part

In turn, we'll need to create the `mint` function to:
- check that the Kitty doesn't already exist
- update storage with the new Kitty ID (for all Kitties and for the owner's account)
- update the new total Kitty count for storage and the new owner's account
- deposit an Event to signal that a Kitty has succesfully been created

### 2. `create_kitty` dispatchable 

A dispatchable in FRAME always follows the same structure. All pallet dispatchables live under the `#[pallet::call]` macro which requires declaring the dispatchables section with `    impl<T: Config> Pallet<T> {}`. Read the 
documentation on these FRAME macros to learn how they work. All we need to know here is that they're a useful feature of FRAME that minimizes the code required to write for pallets to be properly integrated in a Substrate chain's runtime.

As per the requirement for `#[pallet::call]` described in the [its documentation][frame-macros-kb], every dispatchable function must have an associated weight to it. Weights are
an important part of developing with Substrate as they provide safe-guards around the amount of computation to fit in a block at execution time. 
[Substrate's weighting system][weights-kb] forces developers to think about the computational complexity each extrinsic carries before it is called so that 
a node will account for it's worst case, avoiding a lagging the network with extrinsics that take longer than a single block time. Also, weights are intimately linked to the fee system for a signed extrinsic. Learn more about this [here][txn-fees-kb].

:::tip
Your turn! Use the template code for this section to
help you write the `create_kitty` dispatchable. 
No need to worry about the `mint` function, we'll be going over that in the next section.
:::

Assuming you've correctly declared the macros required for the dispatchable, you should be able
to prove to yourself that everything is working correctly by running:

```bash
cargo build -p pallet-kitties
```

### 3. Updating storage items using the private `mint()` function

As seen when we wrote `create_kitty` in the previous section, `mint` will be responsible for 
writing our new unique Kitty object to the various  storage items declared in part II of this workshop.

Let's recap what these are:
- `<Kitties<T>`
- `<KittyOwner<T>`
- `<AllKittiesArray<T>`
- `<AllKittiesCount<T>`
- `<AllKittiesIndex<T>`

- `<OwnedKittiesArray<T>`
- `<OwnedKittiesCount<T>`
- `<OwnedKittiesIndex<T>`






- check that the Kitty doesn't already exist
- update storage with the new Kitty ID (for all Kitties and for the owner's account)
- update the new total Kitty count for storage and the new owner's account
- deposit an Event to signal that a Kitty has succesfully been created




### . Create and use pallet Events

Now that we have set up all these new storage items, we will need to also update our `create_kitty()` function to provide an Event whenever an update to our pallet's storage items are made.

[TODO: provide info and links on how Events work and why we need them]

We'll need 4 different event types:
- Created
- PriceSet
- Transferred
- Bought

:::tip Your turn!
Declare your events using `#[pallet::event]`, making sure to include the types that each 
event returns.
:::


## Examples

## Resources
#### How-to guides

#### Rust docs

#### Knowledgebase
[frame-macros-kb]: https://substrate.dev/docs/en/knowledgebase/runtime/macros#palletcall
[txn-fees-kb]: https://substrate.dev/docs/en/knowledgebase/runtime/fees
[weights-kb]: https://substrate.dev/docs/en/knowledgebase/learn-substrate/weight