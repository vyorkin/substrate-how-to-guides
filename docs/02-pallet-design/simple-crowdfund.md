---
sidebar_position: 4
keywords: pallet design, intermediate, runtime
---

# Simple crowdfund
_WIP_

_How to get the core functionality of a crowdfunding application in a single pallet._
## Goal

Build a pallet that controls multiple token accounts, storing data in child storage.


## Use cases

A simple on-chain crowdfunding app for participants to pool funds towards a common goal.
## Overview

Use one trie for each active crowdfund.

Any user can start a crowdfund by specifying a goal amount for the crowdfund, an end time, and a beneficiary who will 
receive the pooled funds if the goal is reached by the end time. If the fund is not successful, it enters into a 
retirement period when contributors can reclaim their pledged funds. Finally, an unsuccessful fund can be dissolved, 
sending any remaining tokens to the user who dissolves it.


## Steps

### 1. Declaring your pallet's configuration traits
In addition to the ubiquitous `Event` type, this pallet requires a `Currency` trait as well as:
- `SubmissionDeposit` - the amount to be held on deposit by the owner of a crowdfund
- `MinContribution` - the minimum amount that may be contributed into a crowdfund.
- `RetirementPeriod` - the period of time (in blocks) after an unsuccessful crowdfund ending during which contributors are able to withdraw their funds.

```rust
/// The pallet's configuration trait
pub trait Config: frame_system::Config {
    type Event: From<Event<Self>> + Into<<Self as frame_system::Config>::Event>;
    type Currency: ReservableCurrency<Self::AccountId>;
    type SubmissionDeposit: Get<BalanceOf<Self>>;
    type MinContribution: Get<BalanceOf<Self>>;
    type RetirementPeriod: Get<Self::BlockNumber>;
}
```
### 2. Create a custom metadata struct

Keep track of the constants in your pallet by creating a struct that stores metadata about each fund:

```rust
#[derive(Encode, Decode, Default, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct FundInfo<AccountId, Balance, BlockNumber> {
    /// The account that will recieve the funds if the campaign is successful.
    beneficiary: AccountId,
    /// The amount of deposit placed.
    deposit: Balance,
    /// The total amount raised.
    raised: Balance,
    /// Block number after which funding must have succeeded.
    end: BlockNumber,
    /// Upper bound on `raised`.
    goal: Balance,
}
```
### 3. Declare your storage items

Create one storage item to track the number of funds and a second to map that index to `FundInfo`. This will also store data about
which users have contributed and how many funds they contributed: 

```rust
#[pallet:storage]
#[pallet::getter(fn funds)]
pub(super) type Funds<T: Config> as ChildTrie = StorageMap<
		_, 
		Blake2_128Concat, 
		T::AccountId, 
		T::Balance,
		ValueQuery
		>;

#[pallet:storgae]
#[pallet::getter(fn fund_count)]
pub type FundCount<T> as ChildTrie = StorageValue<_, u32>;
```
> Note: The use of the child trie provides two advantages over using standard storage. First, it allows for removing the entirety 
of the trie is a single storage write when the fund is dispensed or dissolved. Second, it allows any contributor to prove that 
they contributed using a Merkle Proof.

### 4. Implement the Child Trie API

Write the following helper functions in a `impl<T: Config> Module<T>` block:
- pub fn contribution_put(...) - Record a contribution in the associated child trie.
- pub fn contribution_get(...) - Lookup a contribution in the associated child trie.
- pub fn contribution_kill(...) - Remove a contribution from an associated child trie.
- pub fn crowdfund_kill(...) - Remove the entire record of contributions in the associated child trie in a single storage write.

Generate unique ChildInfo IDs:

```rust
pub fn id_from_index(index: FundIndex) -> child::ChildInfo {
    let mut buf = Vec::new();
    buf.extend_from_slice(b"crowdfnd");
    buf.extend_from_slice(&index.to_le_bytes()[..]);

    child::ChildInfo::new_default(T::Hashing::hash(&buf[..]).as_ref())
}
```

### 5. Write dispatchable functions

- fn create(...) - Create a new fund.
    - use `T::Currency::withdraw(...)` to create imbalance variable.
    - update the `Funds` storage item
    - deposit a `Created` event 
    
- fn contribute(...) - Contribute funds to an existing fund.
    - perform preliminary safety checks using `ensure!(...)`
    - add the contribution to the fund
    - deposit a `Contributed` event

- fn withdraw - (...) - Withdraw full balance of a contributor to a fund.
    - perform preliminary safety checks using `ensure!(...)`
    - use the `T::Currency::resolve_into_existing(...)` to return funds
    - calculate new balances and update storage `T::Currency::resolve_into_existing(...)`
    - deposit `Withdrew` event

- fn dissolve(...) - Dissolve an entire crowdfund after its retirement period has expired.
    - perform preliminary safety checks using `ensure!(...)`
    - use `T::Currency::resolve_creating(...)` for dissolver to collect funds
    - deposit `Dissolved` event


- fn dispense(...) - Dispense a payment to the beneficiary of a successful crowdfund.
    - use `T::Currency::resolve_creating(...)` for beneficiary and caller (separately) to collect funds
    - remove the fund from storage using `<Funds<T>>::remove(index);` and `Self::crowdfund_kill(index);` to remove all contributors from storage in a single write

## Examples
- `pallet_simple_crowdfund` 
## Resources

- Currency [Imbalance trait](https://substrate.dev/rustdocs/v3.0.0/frame_support/traits/trait.Imbalance.html) 