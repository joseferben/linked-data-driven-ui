import React from "react";

export const Thing = ({ data }: { data: any }) => {
  const keys = Object.keys(data || {});
  return (
    <div>
      {keys.map(k => (
        <div key={k}>
          <span>{k}</span> <span>{JSON.stringify(data[k])}</span>
        </div>
      ))}
    </div>
  );
};
