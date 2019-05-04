import React from "react";

import { Renderer } from "./types";
import { GenericLinkedData } from "./renderers/GenericLinkedData";

let appliedRenderers: { [index: string]: any } = {};

const wasRendererApplied = (
  renderer: Renderer | undefined,
  appliedRenderers: any,
  resource: any
) => {
  if (renderer === undefined) {
    return false;
  }
  return Array.isArray(appliedRenderers[resource["@id"]])
    ? appliedRenderers[resource["@id"]].includes(renderer.id)
    : false;
};

const rememberAppliedRenderer = (resource: any, renderer: any) => {
  if (Array.isArray(appliedRenderers[resource["@id"]])) {
    appliedRenderers[resource["@id"]] = [
      renderer.id,
      ...appliedRenderers[resource["@id"]]
    ];
  } else {
    appliedRenderers[resource["@id"]] = [renderer.id];
  }
};

const doRender = (availableRenderers: Renderer[]) => (
  resource: any
): JSX.Element => {
  const rendererToApply = availableRenderers.find(r => {
    const canApplyRenderer =
      !wasRendererApplied(r, appliedRenderers, resource) &&
      ((resource.types && resource.types.includes(r.type)) || r.type === "*");
    return canApplyRenderer;
  });
  if (rendererToApply) {
    rememberAppliedRenderer(resource, rendererToApply);
    const Comp = rendererToApply.comp;
    return <Comp renderer={doRender(availableRenderers)} resource={resource} />;
  } else {
    return (
      <GenericLinkedData
        renderer={doRender(availableRenderers)}
        resource={resource}
      />
    );
  }
};

class HydraRenderer extends React.Component<
  { selectedRenderers: Renderer[]; resource: any; baseRenderer: any },
  any
> {
  render() {
    const { selectedRenderers, resource } = this.props;
    appliedRenderers = [];
    let comp = <div>Select a Hydra resource to start.</div>;
    if (resource) {
      comp = doRender(selectedRenderers)(resource);
    }
    return comp;
  }
}

export default HydraRenderer;
