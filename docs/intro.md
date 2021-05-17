---
sidebar_position: 0
---

# Welcome

_This is work in progress and is not an official ressource. The purpose of this is to get feedback on the structure of this guidebook and to create new content to replace Recipes. Read the Guidelines below to better understand the general approach._

## Content structure

The structure aims to group HTGs into categories by tagging each guide. For example:

> **Simple crowdfund.** 
> tags: runtime, intermediate, pallet design


The current groupings are to help organize the repository of HTG content. They reflect the different
areas of development within Substrate:

- **Basics**. Where the really simple guides live, those that can be referenced by more complex ones.
- **Pallet design**. Everything to do with building custom pallets with or without FRAME.
- **Weights**. Any content that covers configuring weights for specific use cases.
- **Testing**. A collection of guides for testing.
- **Storage migrations**. Anything to do with storage migrations.
- **Consensus**. Client stuff, bridging, node configurations.
- **Parachains.** _WIP_

### Tags

_basics, beginner, intermediate, advanced, FRAME v1, runtime, pallet design, weights, fees, currency, testing, 
storage migration, node, client, consensus, proof-of-work_ 

## Guidelines

Each guide contains various links to [Knowledgebase](https://substrate.dev/docs/en/) key terms and other [Developer hub](https://substrate.dev/en/) ressources. Most beginner guides link to other intermediate or advanced guides that use the foundations from the more basic guides they build on. In this way, this book aims to become a modular and extensible framework that:

- Can expand overtime, by virtue of the ease for contributors to integrate new content that follows these linking guidelines and structure.
- Provides an indispensible collection of guides for developers of all levels building with Substrate.
- Connects related resources from the developer hub, including documentation and knowledgebase article.

The following points touch on the approach for building content for the Substrate How-to Guides ressource.

- :black_medium_square: **Modularity**. This means that devhub ressources need to be linked in a way that they can adapt to change: each piece needs to be a standalone guide that has a well-defined and useful focus. Last, they need to be able to handle changes to Substrate in a way that offers a path of least resistance when implementing those changes.
- :link: **Linking**. _TBD how exactly each "link type" is differentiated from one another._ What matters is where ever there's a link, it's clear where it will take the reader, whether colors or marked, for e.g. "this link (Knowledgebase)".
- ⏯️ **Examples**. Here's the part for "examples on how to actually put this guide to use". Each example links to the "Substrate How-to Guide" codebase hosted in Playground, which contains a collection of pallets and runtimes showing eacg guides' implemention in practise.
- :satellite: **References.** At the end of each recipe, developers can see a list of related ressources. Here is where all related Knowledgebase links go; Rust docs; as well as links to any other related guides.
- ⏹️ **Avoid repetition.** If there's something that needs to be included in one guide and can be abstracted to a completely separate guide, abstract it and link to it instead of repeating that content. This ties into the modularity aspect too.

## FAQ

**What is the difference between a "how-to guide" and a tutorial?**

A **how-to guide** is an in-depth guide intended for someone who is assumed to have prior Substrate knowledge on how to achieve a specific goal. Information inside a guide is only pertinent to achieving that goal. Anything else is irrelevant.

A **tutorial** is a lesson to teach someone how to achieve something assuming they have no prior knowledge on the subject. They contain more details on the subject; cover breadth (vs. how-to guides which cover depth); and can repeat information across other tutorials.
