## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

# dev notes

### performance

**if we get rid of using state as the core, we dont need the pre stuff. the state IS the pre stuff, and we just change against the dom directly**

https://write.as/browserboard-blog/browserboard-update-everything-is-faster

the browser is VERY sensitive to dom nodes - maybe its nested dom nodes?

when each object is like this:

```html
<div>
  <img />
</div>
```

it works MUCH faster than when each object is like this:

```html
<div>
  <img />
  <p>debug info</p>
  <p>debug info</p>
  <p>debug info</p>
  <p>debug info</p>
</div>
```

thats something we should take into account - hiding DOM nodes when
they're effectively too small
