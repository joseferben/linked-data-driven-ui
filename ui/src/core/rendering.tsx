import React from "react";
import { Maybe } from "tsmonad";
import { Renderer } from "./types";
import coreRenderer from "./renderers/core";

/* export const applicableRenderer = (renderer: Renderer, types: string[]) => {
 *   return Maybe.maybe(
 *     renderer.componentRenderers.find(renderer =>
 *       types.includes(renderer["@type"])
 *     )
 *   ).valueOr(coreRenderer.componentRenderers[0]);
 * };
 *  */
const renderTree = (data: object[]) => {
  return data.map((o: any) => {
    const isLeaf = !Object.keys(o).some(k => Array.isArray(o[k]));
    if (isLeaf) {
      const items = Object.keys(o).map(k => (
        <div>
          <span>k</span> <span>o[k]</span>
        </div>
      ));
      return <div style={{ borderColor: "red" }}> {items} </div>;
    } else {
      return Object.keys(o).map(k => {
        const itemVal = Array.isArray(o[k]) ? renderTree(o[k]) : o[k];
        return (
          <div>
            <span>k</span> <span>{itemVal}</span>
          </div>
        );
      });
    }
  });
};

const leaf = (k: string | number, v: any, key?: string | number) => {
  return (
    <div key={key} style={{ border: "1px solid red" }}>
      <span>{k}</span>
      <span> {v}</span>
    </div>
  );
};

const node = (
  k: string | number,
  obj: any[],
  renderer: Renderer,
  key?: string | number
) => {
  return (
    <div
      key={key}
      style={{ border: "1px solid blue", padding: "5px 0 5px 10px" }}
    >
      <span>{k}</span>
      {render(obj, renderer, k)}
    </div>
  );
};

export const render = (
  data: object[],
  renderer: Renderer,
  key?: string | number
) => {
  const res = data.map((o: any) => {
    const keys = Object.keys(o).filter(k => k !== "@type");
    return keys.map((k: string, idx: number) => {
      if (Array.isArray(o[k])) {
        return node(k, o[k], renderer, idx);
      } else if (k === "@value" || k === "@id") {
        return leaf(k, o[k], key);
      } else {
        console.error(k);
        console.error(o[k]);
        throw new Error("Unexpected key value pair encountered");
      }
    });
  });
  return <div key={key}>{res}</div>;
};
