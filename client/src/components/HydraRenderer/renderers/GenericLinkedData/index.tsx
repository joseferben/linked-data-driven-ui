import React from "react";
import { IHydraResource } from "alcaeus/types/Resources";

export class GenericLinkedData extends React.Component<{ resource: any }, {}> {
  render() {
    const { resource } = this.props;
    const keys = Object.keys(resource || {});

    const comp = keys.map(k => {
      const value = resource[k];
      if (typeof value === "object" && Array.isArray(value) && k !== "@type") {
        return value.map(child => (
          <div key={child.id}>
            <span style={{ color: "blue" }}>{k}:</span>
            <div style={{ marginLeft: "20px" }}>
              <GenericLinkedData resource={child} />
            </div>
          </div>
        ));
      } else if (typeof value === "object" && k !== "@type") {
        return (
          <div key={k}>
            <span style={{ color: "blue" }}>{k}:</span>
            <div style={{ marginLeft: "20px" }}>
              <GenericLinkedData resource={value} />
            </div>
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

    return <div>{comp}</div>;
  }
}
