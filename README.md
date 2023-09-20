# Barnabus VTT

Barnabus VTT is like [Miro](https://miro.com/app/dashboard/) or [Google Jamboard](https://jamboard.google.com/) or [Microsoft Whiteboard](https://www.microsoft.com/en-gb/microsoft-365/microsoft-whiteboard/digital-whiteboard-app), but for **tabletop RPGs**.

## Technology Stack

Barnabus VTT is built with:

- [SolidJS](https://www.solidjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## General Architecture Notes

- `src\app.tsx` loads everything in and sets up global event handlers
- all the objects get rendered with `src\components\board-objects\base.tsx`
- various ephemeral UI components (the selection box, the resize handles, etc.) are in `src\components\in-camera-ui`
- various on clicks on objects and from App are handled in `src\event-handlers.ts` and determine what should happen based on what buttons a user is pressing, if they already have selected objects, etc.
- the actual specific interactions that should take place are then handled in `src/interaction-handlers.ts`; moving objects, resizing objects, etc.

So a typical interaction flow is;

- clicking on an object -> triggering the `onObjectMouseDown` and `onWindowMouseDown` event handlers
- moving the mouse around -> triggering the `onWindowMouseMove` and in turn, an interaction handler such as `interactionMoveObjects`
- letting go of the mouse -> triggering the `onWindowMouseUp`, which may trigger further interaction handlers

And all of those event and interaction handlers read and write state, read and write DOM nodes, etc.

## "Easily Forgotten" Features TODO

- locking objects
  - done very quick prototype, super broke, fix this up
  - its a bit better?
- grouping objects
- map markers?

- dynamic lighting examples/inspo
  https://codepen.io/loktar00/pen/kYVbPz
  https://www.npmjs.com/package/visibility-polygon

- send to back
- bring to front
- borders
- opacity
  - for objects, probably?
  - for the sketching pen, maybe just make a highlighter tool
- rounding/cropping

- when you're dragging an object mark it as dragging, so we DONT show its toolbar

- when the selected toolbar goes offscreen, maybe it should stay on screen? like right click menus in other apps

## Refactor TODO

- The resize utils code has become extremely gross, refactor the shit out of this.
- the text box objects _kinda_ work, _mostly_. but things get super fucky when you resize them, could do with going back to this at some point.
- stop firing global key events when focused on a text box, all sorts of bugs to do with hitting delete and stuff.
- the dynamic lighting needs to take into account only the tokens and walls inside the image thats relevant
- sometimes deleting walls doesn't delete wall anchors correctly, and vice versa
- when something is invisible we need it so that drag select doesn't select it

## Motion Effects Notes

- https://codepen.io/agoodwin/pen/NMJoER
  the clouds and twinkling, very sick
- https://codepen.io/mikegolus/pen/Jegvym
  fireflys, change colour, weird magic?
- https://webdesign.tutsplus.com/21-ridiculously-impressive-html5-canvas-experiments--net-14210a

### Performance Notes

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

https://github.com/wilsonpage/fastdom ???

---

maybe we should start doing mad shit like keeping all selected object dom nodes on the window so we don't have to recompute, etc.
update: we did this, it works great, may god have mercy on our souls
