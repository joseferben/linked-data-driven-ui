import React from "react";
import { IHydraResource, HydraResource } from "alcaeus/types/Resources";

export class Temperature extends React.Component<
  { resource: any; renderer: (resource: HydraResource) => JSX.Element },
  {}
> {
  render() {
    const { resource } = this.props;
    const temperature = parseFloat(resource["https://schema.org/value"]);
    const icon =
      temperature > 22.8 ? (
        <i className="sun icon" />
      ) : (
        <i className="snowflake icon" />
      );
    const comp = (
      <div>
        <span>
          Temperature: {resource["https://schema.org/value"]}° {icon}
        </span>
      </div>
    );
    return comp;
  }
}
