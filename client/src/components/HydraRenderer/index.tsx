import React from "react";
import "react-virtualized/styles.css";
import "react-virtualized-tree/lib/main.css";
import "material-icons/css/material-icons.css";
import { Hydra as client } from "alcaeus";

import Tree, { renderers } from "react-virtualized-tree";
import { Node } from "./types";
import { GenericLinkedData } from "./renderers/GenericLinkedData";
import { Temperature } from "./renderers/Temperature";

const resourceToTree = (resource: any): Node => {
  const keys = Object.keys(resource || {});
  return keys.reduce(
    (acc, k) => {
      const value = resource[k];
      if (typeof value === "object" && Array.isArray(value)) {
        const relationNode = {
          id: `${resource.id || resource["@id"]}/${k}`,
          name: k,
          data: {},
          state: { expanded: true },
          children: value.map((r: any) => resourceToTree(r))
        };
        acc.children = [relationNode, ...acc.children];
      } else if (typeof value === "object") {
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
    selectedRenderers: [Temperature, GenericLinkedData, renderers.Expandable],
    resource: null
  };

  renderNodeDisplay = (display: any, props: any, children = []) =>
    React.createElement(display, props, children);

  createNodeRenderer = (nodeDisplay: any, props: any): any => {
    const [nextNode, ...remainingNodes] = nodeDisplay;

    if (remainingNodes.length === 0) {
      return this.renderNodeDisplay(nextNode, props);
    }

    return this.renderNodeDisplay(
      nextNode,
      props,
      this.createNodeRenderer(remainingNodes, props)
    );
  };

  handleChange = (nodes: any) => {
    this.setState({ nodes });
  };

  componentDidMount() {
    client.loadResource("http://localhost:3000/iot/apartments/0").then(res => {
      this.setState({ nodes: [resourceToTree(res.root)] });
    });
  }

  render() {
    return (
      <div style={{ height: 800 }}>
        <Tree nodes={this.state.nodes} onChange={this.handleChange}>
          {({ style, ...p }) => (
            <div style={style}>
              {this.createNodeRenderer(this.state.selectedRenderers, p)}
            </div>
          )}
        </Tree>
      </div>
    );
  }
}

export default HydraRenderer;
