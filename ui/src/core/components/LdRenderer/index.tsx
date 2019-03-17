import React from "react";

export const LdRenderer = ({ data }: { data: any }) => {
  return <div>{JSON.stringify(data, null, 2)}</div>;
};
