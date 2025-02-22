---
title: Creating Custom Components
sidebar_position: 2
keywords: polkadotjs api, frontend
---

## Overview

In this section, we are going to build the custom components of our Kitty application's front-end.

To recap, these are:

- **the `Kitties.js` component:** this renders KittyCards.js 
- **the `KittyAvatar.js` component:** this handles the logic that creates an avatar for a Kitty in storage
- **the `KittyCards.js` component:** this creates a React  `<Card/>` component to hold Kitty ID, gender, DNA, owner and price

## Learning outcomes

:arrow_right: Use PolkadotJS API to create custom React components.

## Steps

### 1. Create the `Kitties.js` component

This is the component that will get rendered by Apps.js. So it does the heavy lifting, with the help of KittyAvatar.js and KittCards.js.

Start by creating a file called `Kitties.js` and paste the following imports:

```js
import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';
```

The way our custom components will make use of PolkadotJS API is by using `substrate-lib`, which is a wrapper around [Polkadot JS API instance](https://polkadot.js.org/docs/api/start/create/) and allows us to retrieve the API from the [PolkadotJS keyring](https://polkadot.js.org/docs/api/start/keyring). This is why we use `useSubstrate` which is exported by `src/substrate-lib/SubstrateContext.js` and used to create the wrapper.

Then, there's a couple things to set up:

- we'll need a function to help construct the Kitty ID from a storage key
- we'll need a function to hold a Kitty object 
- we'll rely on `useEffect` from `import React, { useEffect, useState } from 'react';` to listen for changes in our node's storage using React hooks

Proceed by pasting in the following code snippet:

```js
// Construct a Kitty ID from storage key
const convertToKittyHash = entry =>
  `0x${entry[0].toJSON().slice(-64)}`;

// Construct a Kitty object 
const constructKitty = (hash, { dna, price, gender, owner }) => ({
  id: hash,
  dna,
  price: price.toJSON(),
  gender: gender.toJSON(),
  owner: owner.toJSON()
});

// Use React hooks
export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyHashes, setKittyHashes] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');
// snip
```
There are two things our app needs to listen for: changes in the amount of Kitties and changes in the Kitty object. To do this we'll create a subscription function for each.

The way we're going to listen for a change in the amount of Kitties is by querying our node using `api.query.kitties.kittyCnt`, which
queries `KittyCnt` from our Kitties pallet storage item. Then, we'll use the `entries()` method from PolkadotJS API to construct a Kitty
ID using the `convertToKittyHash` function.

Paste the following snippet:

```js
// Subscription function for setting Kitty IDs
  const subscribeKittyCnt = () => {
    let unsub = null;

    const asyncFetch = async () => {
        // Query KittyCnt from runtime
      unsub = await api.query.kitties.kittyCnt(async cnt => {
        // Fetch all Kitty objects using entries()
        const entries = await api.query.kitties.kitties.entries();
        // Retrieve only the Kitty ID and set to state
        const hashes = entries.map(convertToKittyHash);
        setKittyHashes(hashes);
      });
    };

    asyncFetch();

    // return the unsubscription cleanup function
    return () => {
      unsub && unsub();
    };
  };
```

:::tip Further Learning 
`entries()` is a Polkadot JS API function that gives us the entire storage map. If there's nothing in storage, it passes in `None` which acts
as a _promise_ to React hooks. With `entries()` we get a key and a kitty object.

You can see this in action if you go to the console of your browser running a node Front-end and entering `entries`. Or get the first Kitty object in storage by doing: `entries[0][1].toJSON()`. 
:::


Similarly for `subscribeKitties`, paste the following code snippet:

```js
  // Subscription function to construct a Kitty object
  const subscribeKitties = () => {
    let unsub = null;

    const asyncFetch = async () => {
        // Get Kitty objects from storage 
      unsub = await api.query.kitties.kitties.multi(kittyHashes, kitties => {
        // Create an array of Kitty objects from `constructKitty`
        const kittyArr = kitties
          .map((kitty, ind) => constructKitty(kittyHashes[ind], kitty.value));
        // Set the array of Kitty objects to state
        setKitties(kittyArr);
      });
    };

    asyncFetch();

    // return the unsubscription cleanup function
    return () => {
      unsub && unsub();
    };
  };
```

#### Understanding how we retrieve the Kitty Hash

The PolkadotJS API uses the pallet name and storgae item for the first 64 bits and the unique storage item hash for the remaining 64 bits. We want to get rid of those and only keep the remaining bits which will be our kitty Hash, which is why we use:

```js
const convertToKittyHash = entry =>
  `0x${entry[0].toJSON().slice(-64)}`;
```

And then we use it in the subscription function to get all Kitty IDs:

```js
   const asyncFetch = async () => {
      unsub = await api.query.kitties.kittyCnt(async cnt => {
        // Fetch all kitty keys
        const entries = await api.query.kitties.kitties.entries();
        const hashes = entries.map(convertToKittyHash);
        setKittyHashes(hashes);
      });
    };
```

#### Clean up functions

In `asyncFetch` we're constantly listening to the Kitties storage. This is in relation to using Effects with Cleanup (see [React docs])https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup)). When the component is teared down, it will make sure that all remaining subscription functions are cleaned up:

```js
  // return the unsubscription cleanup function
    return () => {
      unsub && unsub();
    };
  };
```
Now all that's left to do for our component to listen for changes in our node's runtime storgae is to pass in `subscribeKittyCnt` and 
`subscribeKitties` to React's `useEffect` function. Hence: 

```js
  useEffect(subscribeKittyCnt, [api, keyring]);
  useEffect(subscribeKitties, [api, kittyHashes]);
```

Learn more about how "Effect Hooks" work in [React's documentation](https://reactjs.org/docs/hooks-effect.html).

Congratulations! What we've done up until here prepares how the Kitty object and other storage items will be accessible to our React components.

### 2. Create the `KittyAvatar.js` component

In this component, all we're doing is mapping a library of PNG images to the bytes of our Kitty DNA. Since it's mostly all Javascript, 
we won't be going into much detail. 

Create a file in `src/` called `KittyAvatar.js` and paste in the following code:

```js
import React from 'react';

// Generate an array [start, start + 1, ..., end] inclusively
const genArray = (start, end) =>
  Array.from(Array(end - start + 1).keys()).map(v => v + start);

const IMAGES = {
  accessory: genArray(1, 20).map(n =>
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/accessorie_${n}.png`),
  body: genArray(1, 15).map(n =>
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/body_${n}.png`),
  eyes: genArray(1, 15).map(n =>
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/eyes_${n}.png`),
  mouth: genArray(1, 10).map(n =>
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/mouth_${n}.png`),
  fur: genArray(1, 10).map(n =>
    `${process.env.PUBLIC_URL}/assets/KittyAvatar/fur_${n}.png`)
};

const dnaToAttributes = dna => {
  const attribute = (index, type) => IMAGES[type][dna[index] % IMAGES[type].length];

  return {
    body: attribute(0, 'body'),
    eyes: attribute(1, 'eyes'),
    accessory: attribute(2, 'accessory'),
    fur: attribute(3, 'fur'),
    mouth: attribute(4, 'mouth')
  };
};

const KittyAvatar = props => {
  const outerStyle = { height: '160px', position: 'relative', width: '50%' };
  const innerStyle = { height: '150px', position: 'absolute', top: '3%', left: '50%' };
  const { dna } = props;

  if (!dna) return null;

  const cat = dnaToAttributes(dna);
  return <div style={outerStyle}>
    <img alt='body' src={cat.body} style={innerStyle} />
    <img alt='fur' src={cat.fur} style={innerStyle} />
    <img alt='mouth' src={cat.mouth} style={innerStyle} />
    <img alt='eyes' src={cat.eyes} style={innerStyle} />
    <img alt='accessory' src={cat.accessory} style={innerStyle} />
  </div>;
};

export default KittyAvatar;
```

Notice that the only properties being passed is `dna`, which will be passed in from `KittyCards.js`.
The logic in this component is based on a specific ["cat avatar generator" library](https://framagit.org/Deevad/cat-avatar-generator/-/tree/master/avatars/cat) by David Revoy. Download it and paste its contents inside a new folder called
"KittyAvatar" in `public/assets/KittyAvatar`.

### 3. Create the `TransferModal` in `KittyCards.js`

Our `KittyCards.js` component will have three sections to it:

i. `TransferModal`: a modal that uses the `TxButton` component. 

ii. `KittyCard`: a card that renders the Kitty avatar using the `KittyAvatar.js` component as well as all other Kitty information (id, dna, owner, gender and price).

iii. `KittyCards`: a component that renders a grid for `KittyCard` (yes, singular!) described above. 

As a preliminary step, create a new file called `KittyCards.js` and add the following imports:

```js
import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';

import KittyAvatar from './KittyAvatar'; 
import { TxButton } from './substrate-lib/components';
```

#### i. Outlining the TransferModal

Let's outline what the `TransferModal` will do. Conveniently, the Substrate Front-end Template comes with a component called `TxButton` which is a useful way to include a transfer button 
that interacts with a node. This component will allow us to make an RPC call
into our node and trigger a signed extrinsic for the Kitties pallet. 

The way it is built can be broken down into the following pieces:

- A "transfer" button exists, which upon being clicked opens up a modal
- This modal, we'll call "Kitty Transfer" is a `Form` containing (1) the Kitty ID and (2) an input field for a receiving adress
- It also contains a "transfer" and "cancel" button 

See the screenshot taken below for reference: 

![Kitty Transfer](kitty-transfer-shot.png)

#### ii. Setting up React hooks

The first thing we'll do is pass in the properties (or "props") we need from `kitty`, `accountPair` and `setStatus` using React hooks. Do this by pasting in the following code snippet:

```js
const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = key => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };
```
And now, close the React hook subscription function:

```js
  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };
```

#### iii. Composing the modal

To recap: our Kitty Card has a "transfer" button that opens up a 
modal where a user can choose an address to send their Kitty to. That modal will have:
- a Title
- an input field for a Kitty ID
- an input field for an Account ID

In addition, it will have:
- a "cancel" button which closes the Transfer modal
- the `TxButton` React component to trigger the transaction

Here's what this looks like in code &mdash; paste this in to complete `TransferModal` and read the comments to follow what each
chunk of code is doing:

```js
return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>Transfer</Button>}>

    // The title of the modal
    <Modal.Header>Kitty Transfer</Modal.Header>

    <Modal.Content><Form>
    // The modal's inputs fields
      <Form.Input fluid label='Kitty ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='Receiver' placeholder='Receiver Address' onChange={formChange('target')}/>
    </Form></Modal.Content>

    <Modal.Actions>
      // The cancel button
      <Button basic color='grey' onClick={() => setOpen(false)}>Cancel</Button>
      // The TxButton component
      <TxButton
        accountPair={accountPair} label='Transfer' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'kitties',
          callable: 'transfer',
          inputParams: [formValue.target, kitty.id],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
```

The next part of our `KittyCards.js` component is to create the part that renders the `KittyAvatar.js` component and the data passed in from the `kitties` props in `Kitty.js`.

### 4. Create the `KittyCard` in `KittyCards.js`

We'll use React's `Card` component to create a card that render the Kitty avatar as well as the Kitty ID, DNA, gender, owner and price.

As you might have guessed, we'll use React props to pass in data to our KittyCard. Paste the following code snippet, reading through the comments to understand each code snippet:

```js
// Use props
const KittyCard = props => {
  const { kitty, accountPair, setStatus } = props;
  const { id = null, dna = null, owner = null, gender = null, price = null } = kitty;
  const displayDna = dna && dna.toJSON();
  const isSelf = accountPair.address === kitty.owner;
```

Now let's make use of the previously imported `Card` component:

```js
return <Card>
    { isSelf && <Label as='a' floating color='teal'>Mine</Label> }
    // Render the Kitty Avatar
    <KittyAvatar dna={dna.toU8a()} />
    <Card.Content>
    // Display the Kitty ID
      <Card.Header style={{ fontSize: '1em', overflowWrap: 'break-word' }}>
        ID: {id}
      </Card.Header>
      // Display the Kitty DNA
      <Card.Meta style={{ fontSize: '.9em', overflowWrap: 'break-word' }}>
        DNA: {displayDna}
      </Card.Meta>
      // Display the Kitty ID, Gender, Owner and Price
      <Card.Description>
        <p style={{ overflowWrap: 'break-word' }}>
          Gender: {gender}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          Owner: {owner}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          Price: {price}
        </p>
      </Card.Description>
    </Card.Content>
```

Before closing the `<Card/>` component we want to render the `TransferModal` we privously built &mdash; **only if the Kitty is transferrable by the acitve user account**. Paste this code snippet to handle this functionality:

```js
    // Render the transfer button using TransferModal
    <Card.Content extra style={{ textAlign: 'center' }}>{ owner === accountPair.address
      ? <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
      : ''
    }</Card.Content>
  </Card>;
```

#### Rendering the card

It's time to put all the pieces we've built together. In this function, we'll: 
- Check whether there's any Kitties to render and render a _"No Kitty found here... Create one now!"_ message if there aren't any
- If there are, render them in a 3 column grid

Have a look at the comments to understand the parts of this code snippet:

```js
const KittyCards = props => {
  const { kitties, accountPair, setStatus } = props;

// Check the number of Kitties
  if (kitties.length === 0) {
    return <Message info>
      <Message.Header>No Kitty found here... Create one now!&nbsp;
        <span role='img' aria-label='point-down'>👇</span>
      </Message.Header>
    </Message>;
  }
// Render Kitties using Kitty Card in a grid
  return <Grid columns={3}>{kitties.map((kitty, i) =>
    <Grid.Column key={`kitty-${i}`}>
      <KittyCard kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
    </Grid.Column>
  )}</Grid>;
};
```

And complete the component with:

```js
export default KittyCards;
```

### 5. Complete `Kitties.js`

Now that we've built all the bits for our front-end application, we can piece everything together.

Go back to the incompleted `Kitties.js` file and paste this code snippet to render the `KittyCard.js` component inside a `<Grid/>`:

```js
return <Grid.Column width={16}>
    <h1>Kitties</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
```

Now we'll use the `<Form/>` component to render our application's `TxButton` component: 

```js
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='Create Kitty' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kitties',
            callable: 'createKitty',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
```

### 6. Update App.js

In order to render Kitties.js, we need to as a row item to the `<Container/>` in App.js:

```js
<Grid.Row>
    <Kitties accountPair={accountPair} />
</Grid.Row>
```

Congratulations! You've finsished the front-end turorial! Now run `yarn start`, refresh your browser and you should be able to start interacting with your node.

## Next steps 

- Explore the Polkadot JS API [cookbook](https://polkadot.js.org/docs/api/cookbook) 
