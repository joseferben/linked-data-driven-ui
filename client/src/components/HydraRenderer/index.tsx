import React from "react";
import "react-virtualized/styles.css";
import "react-virtualized-tree/lib/main.css";
import "material-icons/css/material-icons.css";
import { Hydra as client, Resource } from "alcaeus";

import Tree, { renderers } from "react-virtualized-tree";
import { Nodes } from "./sampleTree";

type Node = {
  id: string;
  name: string;
  data: { [index: string]: any };
  state: { expanded: boolean };
  children: Node[];
};

const HydraNodeRenderer = (obj: {
  onChange: Function;
  node: { name: string; data: any };
  children: [];
}) => {
  const properties = Object.keys(obj.node.data || {}).map(k => (
    <div key={k}>
      <span style={{ color: "red" }}>{k}</span>
      <span>{JSON.stringify(obj.node.data[k])}</span>
    </div>
  ));
  return (
    <div>
      <div>{obj.node.name}</div>
      {properties}
    </div>
  );
};

const resourceToTree = (resource: any): Node => {
  const keys = Object.keys(resource || {});
  return keys.reduce(
    (acc, k) => {
      if (typeof resource[k] === "object" && Array.isArray(resource[k])) {
        acc.children = [
          ...resource[k].map((r: any) => resourceToTree(r)),
          ...acc.children
        ];
      } else if (typeof resource[k] === "object") {
        acc.children = [resourceToTree(resource[k]), ...acc.children];
      } else {
        acc.data[k] = resource[k];
      }
      return acc;
    },
    {
      id: resource.id,
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
    selectedRenderers: [HydraNodeRenderer],
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
      <div style={{ height: 2000 }}>
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
