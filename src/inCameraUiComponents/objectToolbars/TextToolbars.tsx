import { Component, createMemo, createEffect, onMount } from "solid-js";
// import { iObject } from "../types";
import * as Store from "../../store";
import { eObjectType, eTextAlign, eTool, iObject } from "../../types";
import * as Icons from "../../components/icons";
import * as Common from "../../components/common-components";
import { reconcile } from "solid-js/store";

export const FontStyleToolbar: Component = (props) => {
  const isAllBold = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.isBold;
    });
  });
  const isAllItalic = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.isItalic;
    });
  });

  return (
    <>
      <Common.SquareToolbarButton
        icon={<Icons.TypeBold />}
        isActive={isAllBold()}
        title="Select tool"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              isBold: isAllBold() ? false : true,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />

      <Common.SquareToolbarButton
        icon={<Icons.TypeItalic />}
        isActive={isAllItalic()}
        title="eraser tool"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              isItalic: isAllItalic() ? false : true,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
    </>
  );
};

export const TextAlignmentToolbar: Component = (props) => {
  const isAllLeft = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;

    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.textAlign === eTextAlign.LEFT;
    });
  });
  const isAllCenter = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.textAlign === eTextAlign.CENTER;
    });
  });
  const isAllRight = createMemo(() => {
    if (Store.selectedObjectIds().length === 0) return false;
    return Store.selectedObjectIds().every((id) => {
      const obj = Store.objects.find((obj) => obj.id === id);
      if (obj === undefined) return false;
      return obj.textAlign === eTextAlign.RIGHT;
    });
  });
  return (
    <>
      <Common.SquareToolbarButton
        icon={<Icons.TextAlignLeft />}
        isActive={isAllLeft()}
        title="Select tool"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              textAlign: eTextAlign.LEFT,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
      <Common.SquareToolbarButton
        icon={<Icons.TextAlignCenter />}
        isActive={isAllCenter()}
        title="eraser tool"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              textAlign: eTextAlign.CENTER,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
      <Common.SquareToolbarButton
        icon={<Icons.TextAlignRight />}
        isActive={isAllRight()}
        title="eraser tool"
        onMouseDown={(e) => {
          e.stopPropagation();
          const objs = [...Store.objects];
          Store.selectedObjectIds().forEach((id) => {
            const obj = Store.objects.find((obj) => obj.id === id);
            if (obj === undefined) return;
            const objIndex = Store.objects.findIndex((obj) => obj.id === id);
            objs[objIndex] = {
              ...obj,
              textAlign: eTextAlign.RIGHT,
            };
          });
          Store.setObjects(reconcile(objs));
        }}
      />
    </>
  );
};
