import React from "react";

export type Renderer = {
  id: string;
  name: string;
  comp: new () => React.Component<
    { resource: any; renderer: (resource: any) => JSX.Element },
    {}
  >;
  type: string;
};
