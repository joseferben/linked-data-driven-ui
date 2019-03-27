import React from "react";
import { RenderContext } from "./types";

const leaf = (k: string | number, v: any, ctx: RenderContext) => {
  // TODO render @id as link and @value normally
  const style = ctx.debugging
    ? { border: "1px solid red", margin: "3px 3px 3px 3px" }
    : {};
  return (
    <div key={k} style={style}>
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
};

const node = (
  k: string | number,
  obj: any[],
  ctx: RenderContext,
  key?: string | number
) => {
  const style = ctx.debugging
    ? { border: "1px solid blue", padding: "5px 0 5px 10px" }
    : {};
  return (
    <div key={key} style={style}>
      <span>{k}</span>
      {tree(obj, ctx, k)}
    </div>
  );
};

const tree = (data: object[], ctx: RenderContext, key?: string | number) => {
  const res = data.map((o: any) => {
    const keys = Object.keys(o).filter(k => k !== "@type");
    return keys.map((k: string, idx: number) => {
      if (Array.isArray(o[k])) {
        return node(k, o[k], ctx, idx);
        // TODO look ahead and render only foo: bar
        // strip away host from parent key
      } else if (k === "@value" || k === "@id") {
        return leaf(k, o[k], ctx);
      } else {
        console.error(k);
        console.error(o[k]);
        throw new Error("Unexpected key value pair encountered");
      }
    });
  });
  return <div key={key}>{res}</div>;
};

export const render = (
  data: object[],
  ctx: RenderContext,
  key?: string | number
) => {
  return tree(data, ctx, key);
};
