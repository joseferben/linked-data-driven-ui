import React from "react";

export const LdRenderer = ({ data }: { data: any }) => {
  return <div style={{ color: "red" }}>{JSON.stringify(data, null, 2)}</div>;
};
