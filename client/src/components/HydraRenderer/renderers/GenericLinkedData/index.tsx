import React from "react";
import { IHydraResource, HydraResource } from "alcaeus/types/Resources";

export class GenericLinkedData extends React.Component<
  { resource: any; renderer: (resource: HydraResource) => JSX.Element },
  {}
> {
  render() {
    const { resource, renderer } = this.props;
    const keys = Object.keys(resource || {});

    const comp = keys.map(k => {
      const value = resource[k];
      if (typeof value === "object" && Array.isArray(value) && k !== "@type") {
        return value.map(child => (
          <div key={child.id}>
            <span style={{ color: "blue" }}>{k}:</span>
            {renderer(child)}
          </div>
        ));
      } else if (typeof value === "object" && k !== "@type") {
        return (
          <div key={k}>
            <span style={{ color: "blue" }}>{k}:</span>
            {renderer(value)}
          </div>
        );
      } else {
        return (
          <div key={k}>
            <span style={{ color: "red" }}>{k}:</span>
            <span>{value}</span>
          </div>
        );
      }
    });

    return <div style={{ marginLeft: "20px" }}>{comp}</div>;
  }
}
