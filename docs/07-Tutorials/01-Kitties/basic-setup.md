---
sidebar_position: 2
keywords: pallet design, intermediate, runtime
theme: codeview
code: code/kitties-tutorial/01-basic-setup.rs
---

# Part I: Basic set-up 

:::note
This tutorial assumes that you have successfully installed all of the prerequisites for building with Substrate on your machine.
If you haven't already, head over to our [installation guide][installation].
:::

## Learning outcomes

Learn common patterns for Substrate runtime development.

## Overview

To get started with building our Substrate Kitties dApp we'll use Substrate's [Node Template][substrate-node-template] 
and customize it. Specifically, we'll learn how to create a pallet with some storage items and ensure our pallet compiles.

## Steps

### 1. Create a pallet and integrate it to your runtime

#### Getting starting with the node template

The Substrate node template provides us with an "out-of-the-box" blockchain node. Our biggest advantage
is that the networking and consensus layers are already built and all we need to focus on is building out 
our runtime logic. Start by cloning the node template:

```bash
git clone git@github.com:substrate-developer-hub/substrate-node-template.git
```

Using your IDE, go ahead and rename the template node by modifying the details in the `/node/Cargo.toml` file. 
For our purposes, what's important is to:
- rename `node-template` to `substratekitties` (lines 8 and 12)
- rename `node-template-runtime` to `kitties-runtime` 

:::tip Use the side panel as a scratch pad! 
Each part will have incomplete code with comments to guide you on completing it. Make sure to only use it as a scratch-pad 
and copy it to your IDE &mdash; it doesn't save your work!
:::

Since we've renamed our packages in `/node/Cargo.toml`, we must also update our `runtime/Cargo.toml` file accordingly:
- rename `node-template-runtime` to `kitties-runtime`  (line 6)

#### Creating and integrating `pallet_kitties` 

Now that we've set up the foundations for our dApp using the Substrate node template we can proceed to creating our pallet.

Pallets in Substrate are used to define runtime logic. In our case, we'll be creating a single pallet that manages all of the
logic of our Kitties dApp. The node template already comes with a template pallet and folder structure that we can re-use:

```bash
substratekitties
|
+-- node
|
+-- pallets
|   |
|   +-- template           <-- Rename to `kitties`
|       |
|       +-- Cargo.toml     <-- *Modify* this file
|       |
|       +-- src
|           |
|           +-- lib.rs     <-- *Remove* contents
|           |
|           +-- mock.rs    <-- *Remove* contents
|           |
|           +-- tests.rs   <-- *Remove* contents
```

Go ahead and remove all the contents of `lib.rs` as well as `mock.rs` and `tests.rs`. All of our pallet's logic will live inside `lib.rs`. We'll 
be using `mock.rs` and `tests.rs` towards to end of this tutorial when we write unit tests for our dApp.

At this point, we're in a good place to lay out the basic structure of our pallet, after which we can check if our node builds without error. By structure, we're talking about outlining what parts the `lib.rs` file of our pallet will have.

Every FRAME pallet has:
- a set of `frame_support` and `frame_system` dependencies 
- required [attribute macros][macros-kb] (i.e. configuration traits, storage items, hooks and function calls).

:::note
We'll be updating the dependencies as needed by the code we'll be writing.
::: 

In its most bare-bones version, a pallet looks like this:

```rust
pub use pallet::*;
#[frame_support::pallet]
pub mod pallet {
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;

	#[pallet::pallet]
    #[pallet::generate_store(trait Store)]
    pub struct Pallet<T>(_);

    #[pallet::config]

    #[pallet::hooks]

    #[pallet::call]
    impl<T: Config> Pallet<T> {}
}
```

:::info 
Refer to [this guide](./01-basics/basic-pallet-integration) to learn the basic pattern for integrating a new pallet to your runtime and 
read more about pallets in this [knowledgebase article][pallets-kb].  
::: 

Now that we have a pallet called `pallet_kitties` we must implement it for our runtime. Since we have not yet
defined anything in our pallet, our `Config` implementation is pretty simple. In `runtime/lib.rs` include this
line after the other trait implementations:

```rust
impl pallet_kitties::Config for Runtime {}
```
With all of that done, we're geared up to test whether everything works.

Run the following command to build and launch our chain. This can take a little while depending on your machine:
```bash
cargo build --release
```

Assuming everything compiled without error, we can launch our chain and check that it is producing blocks:

```bash
./target/release/substratekitties --dev
```

:::tip 
Get into the habit of using `./target/release/substratekitties purge-chain --dev` when you're starting a new chain to clean up your node before starting it up again.
:::

Congratulations if you've made it here! We don't need to keep our node running, that was just a way to check our pallet and runtime are 
properly configured. In the next steps we will start writing the storage items our Kitty dApp will require.

### 2. Include your pallet's storage items

Let's add the most simple logic we can to our runtime: a function which stores a variable.

To do this we'll use [`StorageValue`][storagevalue-rustdocs] from Substrate's [storage API][storage-api-rustdocs]. This trait depends 
on the storage macro. All that means for our purposes is that for any storage item we want to declare, we must include `#[pallet::storage]` beforehand. Using `StorageValue` as an example, this would look like this:

```rust
#[pallet::storage]
#[pallet::getter(fn get_storage_value)]
pub(super) type SomeStorageValue <T: Config> StorageValue <
    _,
    u64,
    ValueQuery,
>
```
With that declared, we can use the various functions from Substrate's storage API to read and write to 
storage. For example (using `get()` and `put()`):

```rust
    // Get value in storage using the getter function.
    let storage_value = Self::get_storage_value();

    // Another way to get the value.
    let storage_value = <SomeStorageValue<T>>::get();

    // Write to storage.
	<SomeStorageValue<T>>::put(0u64);
``` 

:::tip Your turn!
 Our Kitties dApp will need to keep track of a number of things. The first will be the number of Kitties. 
 Write a storage item to keep track of all Kitties, call it `AllKittiesCount`.
:::

### 3. Build and check your pallet

From the previous step, your pallet should contain a storage item called `AllKittiesCount` which keeps track of a
single `u64` value. As part of the basic setup, we're doing great! As mentioned in the [overview of this tutorial](overview),
we'll be needing a total of 9 storage items which we'll discover as we write out our logic in the next section.

Before we move on, let's make sure everything compiles. We don't need to rebuild our entire node each time we update our pallet.
Instead we can use a command to just build our pallet. From inside your pallet directory, run this command in your terminal:

```bash
cargo build -p pallet_kitties
```
It should compile without and error. If not, go back and check that all the macros are in place and that you've included the
FRAME dependencies.

:::note
Congratulations on finishing the first part of this tutorial! At this stage, we've learnt:
- the basic pattern for customizing the Substrate node template and including a custom pallet
- the different patterns for building our chain and checking that a single pallet compiles
- how to declare and use a `u64` storage item
:::
## Next steps

- Using the Randomness trait to create unique Kitties
- Writing a struct to store details about our Kitties
- Creating and using pallet Events
- Writing functions to own and issue a Kitty NFT
- Viewing owned Kitties

[installation]: https://substrate.dev/docs/en/knowledgebase/getting-started/
[substrate-node-template]: https://github.com/substrate-developer-hub/substrate-node-template
[pallets-kb]: https://substrate.dev/docs/en/knowledgebase/runtime/pallets
[macros-kb]: https://substrate.dev/docs/en/knowledgebase/runtime/macros#frame-v2-macros-and-attributes
[storagevalue-rustdocs]: https://substrate.dev/rustdocs/v3.0.0/frame_support/storage/trait.StorageValue.html
[storage-api-rustdocs]: https://substrate.dev/rustdocs/v3.0.0/frame_support/storage/index.html