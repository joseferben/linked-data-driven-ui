import React from "react";
import { RenderableNode } from "../../types";

export class GenericLinkedData extends React.Component<RenderableNode, {}> {
  componentDidMount() {
    this.props.measure();
  }

  render() {
    const obj = this.props;
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
  }
}
