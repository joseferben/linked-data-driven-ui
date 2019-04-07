import React from "react";
import "react-virtualized/styles.css";
import "react-virtualized-tree/lib/main.css";
import "material-icons/css/material-icons.css";
import { Hydra as client } from "alcaeus";

import Tree, { renderers } from "react-virtualized-tree";
import { Nodes } from "./sampleTree";

type Node = {
  id: string;
  name: string;
  data: { [index: string]: any };
  state: { expanded: boolean };
  children: Node[];
};

type RenderableNode = {
  onChange: Function;
  node: { name: string; data: { [index: string]: number | string | boolean } };
  children: [];
};

const GenericLinkedDataRenderer = (obj: RenderableNode) => {
  const properties = Object.keys(obj.node.data || {})
    .filter(k => k !== "relation")
    .map(k => (
      <div key={k}>
        <span style={{ color: "red" }}>{k}</span>
        <span>{obj.node.data[k]}</span>
      </div>
    ));
  return (
    <div>
      <div>
        <span style={{ color: "blue" }}>{obj.node.data.relation}</span>
      </div>
      <div>{obj.node.name}</div>
      {properties}
      {obj.children}
    </div>
  );
};

const resourceToTree = (resource: any): Node => {
  const keys = Object.keys(resource || {});
  return keys.reduce(
    (acc, k) => {
      const value = resource[k];
      if (typeof value === "object" && Array.isArray(resource[k])) {
        acc.children = [
          ...value.map((r: any) => resourceToTree({ relation: k, ...r })),
          ...acc.children
        ];
      } else if (typeof value === "object") {
        acc.children = [
          resourceToTree({ relation: k, ...value }),
          ...acc.children
        ];
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
    selectedRenderers: [GenericLinkedDataRenderer, renderers.Expandable],
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
      console.log(this.state.nodes);
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
