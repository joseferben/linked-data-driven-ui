import React from "react";
import { observer } from "mobx-react";

export const LdRenderer = observer(({ data }) => {
  return <div>{JSON.stringify(data, null, 2)}</div>;
});
