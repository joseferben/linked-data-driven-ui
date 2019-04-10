import React from "react";
import "react-virtualized/styles.css";
import "react-virtualized-tree/lib/main.css";
import "material-icons/css/material-icons.css";
import { Hydra as client } from "alcaeus";
import { IHydraResource } from "alcaeus/types/Resources";

import Tree, { renderers } from "react-virtualized-tree";
import { Node } from "./types";
import { GenericLinkedData } from "./renderers/GenericLinkedData";
import { Temperature } from "./renderers/Temperature";
import { Thermometer } from "./renderers/Thermometer";

const resourceToTree = (resource: any): Node => {
  const keys = Object.keys(resource || {});
  return keys.reduce(
    (acc, k) => {
      const value = resource[k];
      if (typeof value === "object" && Array.isArray(value) && k !== "@type") {
        const relationNode = {
          id: `${resource.id || resource["@id"]}/${k}`,
          name: k,
          data: {},
          state: { expanded: true },
          children: value.map((r: any) => resourceToTree(r))
        };
        acc.children = [relationNode, ...acc.children];
      } else if (typeof value === "object" && k !== "@type") {
        const relationNode = {
          id: `${resource.id || resource["@id"]}/${k}`,
          name: k,
          data: {},
          state: { expanded: true },
          children: [resourceToTree(value)]
        };
        acc.children = [relationNode, ...acc.children];
      } else {
        acc.data[k] = value;
      }
      return acc;
    },
    {
      id: resource.id || resource["@id"],
      name: resource.id,
      data: {},
      state: { expanded: true },
      children: []
    } as Node
  );
};

class HydraRenderer extends React.Component {
  state = {
    nodes: [],
    selectedRenderers: [GenericLinkedData],
    availableRenderers: [Temperature, Thermometer],
    resource: null
  };

  componentDidMount() {
    client.loadResource("http://localhost:3000/iot/apartments/0").then(res => {
      this.setState({ nodes: [resourceToTree(res.root)], resource: res.root });
    });
  }

  render() {
    return <GenericLinkedData resource={this.state.resource} />;
  }
}

export default HydraRenderer;
