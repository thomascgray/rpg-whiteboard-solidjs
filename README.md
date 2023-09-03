# Barnabus VTT

Like Miro or Google Jamboard or Microsoft Whiteboard, but for tabletop RPGs.

## Technology Stack

- [SolidJS](https://www.solidjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

# dev notes

- everything is controlled by SolidJS state, see `src\store.ts`
- when the user does something "real time", e.g dragging objects around, resizing objects, panning the camera we:

  - on mouse down, collect relevant state
  - on mouse move, directly modify CSS styles
  - on mouse up, grab the newly modified CSS styles and put them back into state

So in plain terms: when you let go of the mouse, nothing changes _visually_, but under the hood everything takes a split second to re-render because we update the state; but because we were directly changing CSS on the mouse move, from the users POV nothing changes.

General app architecture

- `src\App.tsx` loads everything in and sets up global event handlers
- all the objects get rendered with `src\objectComponents\BaseObject.tsx`
- various ephemeral UI components (the selection box, the resize handles, etc.) are in `src\uiComponents`
- various on clicks on objects and from App are handled in `src\event-handlers.ts` and determine what should happen based on what buttons a user is pressing, if they already have selected objects, etc.
- the actual specific interactions that should take place are then handled in `src/interaction-handlers.ts`; moving objects, resizing objects, etc.

there is then a bunch of utils to do maths, to interact with the DOM, etc.

# TODO features

- locking objects
  - done very quick prototype, super broke, fix this up
- grouping objects
- map markers?

### ideas/thoughts/roadmap

things that all objects can do that need to be in context menus, toolbars, etc.

- send to back
- bring to front
- borders
- opacity
- rounding/cropping

### performance

**if we get rid of using state as the core, we dont need the pre stuff. the state IS the pre stuff, and we just change against the dom directly**

https://write.as/browserboard-blog/browserboard-update-everything-is-faster

https://stackoverflow.com/questions/25910500/1000-dom-elements-on-a-single-page

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

---

average BitD charactr is 60 to 100 objects - the main sheet, then a bunch of dots, etc.

by the end of the bitd campaign, the entire board was 1588 objects, including all characters, etc.

---

https://github.com/wilsonpage/fastdom

---

maybe we should start doing mad shit like keeping all selected object dom nodes on the window so we don't have to recompute, etc.

### Things to Do/Refactor

- The resize utils code has got pretty gross, with a ton of duplication.
- we do a ton of calculating how big, and the position, of the object selection box. because that is used to then work out the position of _other_ stuff. at this point, we should honestly just refactor so that everytime you select a new object, we work it out once and then store the state.
  - off the top of my head, we calculate it in the objection selection box component, the selected objects toolbar component, the resize handlers component AND effectively in the resize tools and stuff too
- stop firing global key events when focused on a text box, all sorts of bugs to do with hitting delete and stuff

# motion effects

- https://codepen.io/agoodwin/pen/NMJoER
  the clouds and twinkling, very sick
  https://codepen.io/mikegolus/pen/Jegvym
  fireflys, change colour, weird magic?
