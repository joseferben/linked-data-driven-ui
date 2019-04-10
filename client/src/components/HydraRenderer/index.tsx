import React from "react";
import { Hydra as client } from "alcaeus";

import { GenericLinkedData } from "./renderers/GenericLinkedData";
import { Temperature } from "./renderers/Temperature";
import { Thermometer } from "./renderers/Thermometer";

const renderer = (resource: any) => {
  if (
    resource.types &&
    resource.types.includes("https://schema.org/PropertyValue")
  ) {
    return <Temperature renderer={renderer} resource={resource} />;
  } else if (
    resource.types &&
    resource.types.includes("http://localhost:3000/iot/apartments/Thermometer")
  ) {
    return <Thermometer renderer={renderer} resource={resource} />;
  }
  {
    return <GenericLinkedData renderer={renderer} resource={resource} />;
  }
};

class HydraRenderer extends React.Component {
  state = {
    selectedRenderers: [GenericLinkedData],
    availableRenderers: [Temperature, Thermometer],
    resource: null
  };

  componentDidMount() {
    client.loadResource("http://localhost:3000/iot/apartments/0").then(res => {
      this.setState({ resource: res.root });
    });
  }
  render() {
    const { resource } = this.state;
    let comp = <div>Loading...</div>;
    if (resource) {
      comp = renderer(resource);
    }
    return comp;
  }
}

export default HydraRenderer;
