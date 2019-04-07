import React from "react";
import { RenderableNode } from "../../types";

export class Temperature extends React.Component<RenderableNode, {}> {
  componentDidMount() {
    this.props.measure();
  }

  render() {
    const obj = this.props;
    let comp = <div>{obj.children}</div>;
    if (obj.node.data["@type"] === "https://schema.org/PropertyValue") {
      const temperature = parseFloat(obj.node.data["https://schema.org/value"]);
      const icon =
        temperature > 22.8 ? (
          <i className="sun icon" />
        ) : (
          <i className="snowflake icon" />
        );
      comp = (
        <div>
          <span>
            Temperature: {obj.node.data["https://schema.org/value"]}° {icon}
          </span>
        </div>
      );
    }
    return comp;
  }
}
