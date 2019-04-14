import React from "react";
import { Segment } from "semantic-ui-react";

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
        <Segment>
          <span>{renderer({ Room: name })}</span>
          {(toRender || []).map((t: any) => (
            <span key={t["@id"]}>{renderer(t)}</span>
          ))}
        </Segment>
      </div>
    );
  }
}
