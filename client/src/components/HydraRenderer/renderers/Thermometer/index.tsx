import React from "react";
import { RenderableNode } from "../../types";

export class Thermometer extends React.Component<RenderableNode, {}> {
  componentDidMount() {
    this.props.measure();
  }

  render() {
    const obj = this.props;
    let comp = <div>{obj.children}</div>;
    const type = obj.node.data["@type"];
    if (obj.node.name === "https://schema.org/additionalProperty") {
      return <div>{obj.children.props.children}</div>;
    }
    if (
      Array.isArray(type) &&
      type.map(t => t.split("/").includes("Thermometer"))
    ) {
      comp = (
        <div>
          <span>Thermometer ID: {obj.node.id.split("/").pop()}</span>
        </div>
      );
    }
    return comp;
  }
}
