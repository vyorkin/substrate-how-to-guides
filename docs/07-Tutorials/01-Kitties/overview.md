---
sidebar_position: 1
keywords: pallet design, intermediate, runtime
---

# Substrate Kitties Tutorial
_This tutorial steps you through building a fully functional dapp for managing Substrate Kitties._

## Learning outcomes

- Write and integrate a custom FRAME pallet to your runtime
- Use structs in storage and how to create and update storage items
- Write extrinsics and helper functions
- Use PolkadotJS API to connect a Substrate node to custom a front-end

## Overview

In this first part, you will break things down into components which you will need to build throughout the tutorial.
In doing so, you will learn the basics of setting up a pallet and including basic storage items to run your Substrate node.

Before jumping into the next section, let's have a look at what we'll be doing. This section will be useful to come back to 
as you complete the tutorial, just to keep track of the bigger picture.

The Kitties tutorial is a step by step guide to build a decentralized application that enables the creation and ownership management
of NFT Kitties. In this implementation, to keep things simple, Kitties really can only do the following things:

- be created either by some original source or by being bred using existing Kitties.
- be sold at a price set by their owner
- be transferred from one owner to another



Bringing things down to a more granular level, this translates to the following application design:
- we'll need to spin up a Substrate node and create a custom pallet
- we'll need a total of 9 storage items in our pallet to keep track of the amount of Kitties; their index; their owners and their 
owner account IDs
- we'll need a total of 5 dispatchable functions: `create`, `set_price`, `transfer`, `buy_kitty` and `breed_kitty`
- we'll write 2 helper functions to handle randomness: `increment_nonce` and `random_hash`
- we'll write 2 helper functions for our dispatchable functions: `mint` and `transfer_from`
- we'll connect to a React front-end template and create the UI for each dispatchable call

:::tip
Follow each step at your own pace &mdash; the goal is for you to learn and the best way to do that is to try it yourself!
Use the side panel to write your code as you follow along. Before moving on from one section to the next, make sure your pallet
builds without any error.
:::

## Steps

### [1. Basic set-up](basic-setup) 

- Create a pallet and integrate it to your runtime
- Include your pallet's storage items
- Build and check your pallet

### [2. Create, view and own Kitties](create-kitties)

- How to create and use the Randomness trait
- How to create and use pallet Events
- How to own and issue a Kitty NFT
- How to view owned Kitties

### [3. Interacting with your Kitties](interacting-functions)

- How to set a price for each Kitty
- How to transfer a Kitty 
- How to buy a Kitty
- How to breed new Kitties

### [4. Viewing Kitties in a UI](kitties-frontend)

- How to build React components for our functions
- How to connect our node to a front-end (custom types)

