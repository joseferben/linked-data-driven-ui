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

export const render = (data: object[], renderer: Renderer) => {
  const res = data.map((o: any) => {
    const keys = Object.keys(o).filter(k => k !== "@type");
    return keys.map(k => {
      return (
        <div key={k}>
          <span>{k}</span>
          <span>{o[k]}</span>
        </div>
      );
    });
  });
  return <div>{res}</div>;
  /* const toRender: any = data[0];
   * const dataTypes = toRender["@type"] || [];
   * const componentRenderer = applicableRenderer(renderer, dataTypes);
   * return componentRenderer.fn({ data: toRender }); */
};
