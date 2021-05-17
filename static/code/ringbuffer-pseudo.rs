// Pseudo code: use transient storage adapter

// First we define a constructor function, `queue_transient`, 
// so we don't have to specify the types every time we want
// to access the transient. This function constructs a
// ringbuffer transient and returns it as a boxed trait
// object.

// Create the `add_multiple` function shows the 
// actual typical usage of our transient.

// In `add_multiple`, use the `queue_transient` 
// function defined above to get a `queue` object.

// Then, `push` into the queue repeatedly with 
// `commit` happening at the end of the function, 
// upon `drop` of the `queue` object. 
// `pop` works analogously and could also be intermixed 
// with `push`