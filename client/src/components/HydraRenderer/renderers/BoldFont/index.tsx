import React from "react";

export class BoldFont extends React.Component<
  { resource: any; renderer: (resource: any) => JSX.Element },
  {}
> {
  render() {
    const { resource, renderer } = this.props;
    return (
      <div className="bold-font" style={{ fontWeight: "bold" }}>
        {renderer(resource)}
      </div>
    );
  }
}
