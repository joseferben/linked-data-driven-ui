import React from "react";
import { Hydra as client } from "alcaeus";

import { Renderer } from "./types";
import { GenericLinkedData } from "./renderers/GenericLinkedData";
import { Temperature } from "./renderers/Temperature";
import { Thermometer } from "./renderers/Thermometer";

const doRender = (availableRenderers: Renderer[]) => (
  resource: any
): JSX.Element => {
  if (resource.types) {
    const renderer = availableRenderers.find(r =>
      resource.types.includes(r.type)
    );
    if (renderer) {
      const Comp = renderer.comp;
      return (
        <Comp renderer={doRender(availableRenderers)} resource={resource} />
      );
    }
  }
  return (
    <GenericLinkedData
      renderer={doRender(availableRenderers)}
      resource={resource}
    />
  );
};

class HydraRenderer extends React.Component<
  { selectedRenderers: Renderer[]; resource: any },
  {}
> {
  render() {
    const { selectedRenderers, resource } = this.props;
    let comp = <div>Loading...</div>;
    if (resource) {
      comp = doRender(selectedRenderers)(resource);
    }
    return comp;
  }
}

export default HydraRenderer;
