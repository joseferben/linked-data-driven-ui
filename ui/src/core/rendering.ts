import { Maybe } from "tsmonad"
import { Renderer } from "./types";
import coreRenderer from "./renderers/core"

const applicableRenderer = (
  renderer: Renderer,
  types: string[]
) => {
  return Maybe
    .maybe(renderer.componentRenderers
      .find(renderer => types.includes(renderer["@type"])))
    .valueOr(coreRenderer.componentRenderers[0]);
}

export const render = (
  data: object[],
  renderer: Renderer
) => {
  const toRender: any = data[0];
  const dataTypes = toRender["@type"] || []
  const componentRenderer = applicableRenderer(renderer, dataTypes);
  return componentRenderer.fn({ data: toRender });
}
