import React, { Component } from "react";

import { PreProcessedData } from "../../jsonld";

const Thing = ({ data }: { data: any }) => {
  const keys = Object.keys(data);
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

const Collection = ({ data }: { data: any }) => {
  const keys = Object.keys(data).filter(k => k !== "member");
  return (
    <div>
      {keys.map(k => (
        <div key={k}>
          <span>{k}</span> <span>{JSON.stringify(data[k])}</span>
        </div>
      ))}
      <div>{data.member.map((m: any) => render(m))}</div>
    </div>
  );
};

const coreRendererConfig = {
  PartialCollectionView: Collection,
  Thing: Thing
};

const render = (config: any) => (data: any): JSX.Element => {
  if (!data.type) {
    console.warn("No type found");
    return <div />;
  }
  const Result: ({ data: any }: { data: any }) => JSX.Element =
    config[data.type];

  return Result ? <Result data={data} /> : <Thing data={data} />;
};
export const LdRenderer = ({ data }: { data: PreProcessedData }) => {
  return (
    <div>
      {data ? render(coreRendererConfig)(data["@graph"][0]) : "Loading..."}
    </div>
  );
};
