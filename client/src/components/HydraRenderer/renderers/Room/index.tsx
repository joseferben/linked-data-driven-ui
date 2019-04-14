import React from "react";

export class Room extends React.Component<
  { resource: any; renderer: (resource: any) => JSX.Element },
  {}
> {
  render() {
    const { resource, renderer } = this.props;
    const { "https://schema.org/amenityFeature": name } = resource;
    const { "https://schema.org/containsPlace": thermometers = [] } = resource;
    const toRender = Array.isArray(thermometers)
      ? thermometers
      : [thermometers];
    return (
      <div>
        <span>{name}</span>
        {(toRender || []).map((t: any) => renderer(t))}
      </div>
    );
  }
}
