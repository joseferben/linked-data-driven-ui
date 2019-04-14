import React from "react";

export class Thermometer extends React.Component<
  { resource: any; renderer: (resource: any) => JSX.Element },
  {}
> {
  render() {
    const { resource, renderer } = this.props;
    const data = resource["https://schema.org/additionalProperty"];
    return (
      <div style={{ marginLeft: "20px" }}>
        <div>
          <a href={resource["@id"]}>
            Thermometer ID: {resource["@id"].split("/").pop()}
          </a>
          <div style={{ marginLeft: "20px" }}>
            <span>{renderer(data)}</span>
          </div>
        </div>
      </div>
    );
  }
}
