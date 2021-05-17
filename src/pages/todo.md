## A list of Recipes to port over to the new "how-to" structure

- [ ] Charity ([https://substrate.dev/recipes/charity.html](https://substrate.dev/recipes/charity.html))
  - [ ] Create a pallet that absorbs imbalances ([https://substrate.dev/recipes/currency-imbalances.html](https://substrate.dev/recipes/currency-imbalances.html))
  - [ ] Create a piggy bank
- [ ] OCW ([https://substrate.dev/recipes/off-chain-workers/index.html](https://substrate.dev/recipes/off-chain-workers/index.html) x3)
- [ ] Collective coin flipping ([https://substrate.dev/recipes/randomness.html](https://substrate.dev/recipes/randomness.html))
- [ ] Create a Custom Runtime API for RPC Calls ([https://substrate.dev/recipes/runtime-api.html](https://substrate.dev/recipes/runtime-api.html))
- [ ] How to use the Kitchen Node ([https://substrate.dev/recipes/kitchen-node.html](https://substrate.dev/recipes/kitchen-node.html))
- [ ] Add 3 Custom RPCs to Interact with the Polkadot JS API ([https://substrate.dev/recipes/custom-rpc.html](https://substrate.dev/recipes/custom-rpc.html))
- [ ] Create Hybrid Consensus for a Substrate Chain ([https://substrate.dev/recipes/hybrid-consensus.html](https://substrate.dev/recipes/hybrid-consensus.html))

- [ ] Efficiently manage a crowdfund using child tries for managing data storage ([https://substrate.dev/recipes/crowdfund.html](https://substrate.dev/recipes/crowdfund.html))
- [x] Require Nodes to Follow A Custom Mining Algorithm ([https://substrate.dev/recipes/basic-pow.html](https://substrate.dev/recipes/basic-pow.html))
- [x] Configurable Constants ([https://substrate.dev/recipes/constants.html](https://substrate.dev/recipes/constants.html))
- [x] Basic instantiable pallets ([https://substrate.dev/recipes/instantiable.html](https://substrate.dev/recipes/instantiable.html))
- [x] Computational ressources and weights ([https://substrate.dev/recipes/weights.html](https://substrate.dev/recipes/weights.html))
- [x] Schedule locking and unlocking with the currency trait ([https://substrate.dev/recipes/currency.html](https://substrate.dev/recipes/currency.html))

## Advanced (based off now existing HTGs)

- [ ] Using Quadratic Conversion to Calculate Fees in the Democracy Pallet
- [ ] Collecting Fees to An Instantiable Treasury Pallet 
- [ ] Use configurable constant to use as static base value for dynamic fee calculation

## Other

### Beginner

- [ ] Error checking
- [ ] How to configure session keys
- [ ] How to create a custom origin
- [ ] Configure Genesis with Multi-sig instead of Sudo
- [ ] Setting up a bi-cameral governance model
- [ ] How to create a proxy account
- [ ] How to configure relay chain validators
- [ ] Interacting with a Pallet using Apps (see [#639](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/639) )

### Intermediate

- [ ] Debugging using `println!` and breakpoints

### Advanced

- [ ] Storage migrations
  - [ ] Schedule a storage migration
  - [ ] Trigger a migration from an extrinsic
  - [ ] Incremental migrations
  - [ ] Migrations with off-chain storage
- [ ] How to configure parachain collators
- [ ] Storage costs best practices
- [ ] benchmarking a single function that returns a weight (like on init)
- [ ] benchmark estimating by putting bounded amount for every loop (see: https://substrate.dev/docs/en/knowledgebase/runtime/benchmarking)
- [ ] event triggers
- [ ] patterns with hooks
- [ ] converting to parachain
- [ ] unbounded on_finale calculations

### Misc

- [ ] Security sanity checks
- [ ] Enforcing origins
- [ ] Understanding commonly used Rust methods in Substrate and others and why (e.g. .into(), clone(), copy(), Ok(), block_number(), on_initialize, saturating_add()..) _likely better suited to emerge out of a KB article_
- [ ] Benchmarking and testing
- [ ] How to compile to native runtime + use cases for it
- [ ] Recipes for building with Substrate Node (using JSON file)
- [ ] Recipes for building with Substrate Core (compiling whatever to WASM)
- [ ] How and where to use hooks _likely more on the KB side_

### Queue
