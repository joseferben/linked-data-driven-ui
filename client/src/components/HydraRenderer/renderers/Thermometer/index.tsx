import React from "react";

export class Thermometer extends React.Component<
  { resource: any; renderer: (resource: any) => JSX.Element },
  {}
> {
  render() {
    const { resource, renderer } = this.props;
    const data = resource["https://schema.org/additionalProperty"];
    const location = resource["https://schema.org/containedInPlace"];
    return (
      <div style={{ marginLeft: "20px" }}>
        <div>
          <span>Thermometer ID:</span>{" "}
          <span>{resource["@id"].split("/").pop()}</span>
        </div>
        <div>
          <span>Location:</span> <a href="#">{location}</a>
        </div>
        <div>
          <span>Measurement Data:</span>
          <div style={{ marginLeft: "20px" }}>
            <span>{renderer(data)}</span>
          </div>
        </div>
      </div>
    );
  }
}
