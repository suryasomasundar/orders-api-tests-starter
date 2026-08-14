# Orders API tests — starter

A bare template for writing API tests **by hand**, the traditional way. You point
it at the API, write assertions yourself, and run them. Later in the workshop we
connect the OpenAPI spec and let an agent write these same tests for us, so this
is the "before" you compare against.

Zero dependencies. Node 20 or newer, nothing to install.

## Run it

```bash
npm test
```

(That runs `node --test`. One test ships working so you can confirm the setup.)

## The traditional workflow

This is the old-school loop, and the whole point of step 1:

1. **Copy the API URL into the code.** Open `config.js` and set `BASE_URL`. It is
   already pointed at the live server:
   ```
   https://orders-api-workshop.onrender.com
   ```
2. **Write a test by hand.** Open `tests/orders.test.js`. There is one finished
   test and one `TODO` for you to write together: creating an order.
3. **Run it, read the result, fix, repeat.** `npm test`.

## Hit the trap on purpose

When you write the create-order test, try it the way you would naturally guess:

```js
items: [{ menuItemId: 'burrito', quantity: 1, size: 'medium' }],
fulfillment: 'pickup'
```

Run it. You get a **422** with an error body that tells you exactly what is wrong:
`size` must be uppercase (`REGULAR`), and `fulfillment` must be a nested object,
not the string `"pickup"`. Fix those two things and it becomes a **201**.

That read-the-error-and-fix-it loop is exactly what the agent will do on its own
later. Here you are doing it by hand.

## What's next

Once everyone can write and run a test by hand, we connect the OpenAPI spec
(`https://orders-api-workshop.onrender.com/openapi.json`) so the tooling can see
the API, and then bring in an agent to generate the tests for us.
