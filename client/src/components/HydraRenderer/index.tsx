import React from "react";
import "react-virtualized/styles.css";
import "react-virtualized-tree/lib/main.css";
import "material-icons/css/material-icons.css";
import { Hydra as client, Resource } from "alcaeus";

import Tree, { renderers } from "react-virtualized-tree";
import { Nodes } from "./sampleTree";

const HydraNodeRenderer = (obj: { node: { name: string }; children: [] }) => {
  return <span>{obj.node.name}</span>;
};

const NodeNameRenderer = ({
  node: { name },
  children
}: {
  node: { name: string };
  children: [];
}) => (
  <span>
    {name}
    {children}
  </span>
);

class HydraRenderer extends React.Component {
  state = {
    nodes: Nodes,
    selectedRenderers: [HydraNodeRenderer]
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

  render() {
    return (
      <div style={{ height: 200 }}>
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
