import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import * as jsonld from "jsonld";

import { JsonEditor } from "../JsonEditor";
import { LdRenderer } from "../../../core/components/LdRenderer";
import { useCases, compacted } from "../../db";

const LeftSplit = observer(() => {
  const handleChange = (evt: any) => {
    const {
      target: { value }
    } = evt;
    useCases.selectedUseCase = value;
    compacted.data = useCases.data[value].data;
  };
  return (
    <div>
      <h3>Data explorer</h3>
      <div style={{ marginBottom: "0.5em" }}>
        <label htmlFor="data-select">Choose data set: </label>
        <select id="data-select" onChange={handleChange}>
          {Object.keys(useCases.data).map(key => {
            return (
              <option value={key} key={key}>
                {key}
              </option>
            );
          })}
        </select>
        <JsonEditor
          content={useCases.data[useCases.selectedUseCase].data}
          compacted={compacted}
        />
      </div>
    </div>
  );
});

const Renderer = (compacted: any) => {
  const [expandedData, setState] = useState({});

  useEffect(() => {
    jsonld
      .expand(compacted.data)
      .then((expanded: any) => {
        setState(expanded);
      })
      .catch((err: any) => {
        console.error("Failed to expand data: " + err.message);
      });
  }, [compacted]);

  return <LdRenderer data={expandedData} />;
};

const RightSplit = observer(() => {
  return (
    <div>
      <h3>Data renderer</h3>
      <Renderer data={compacted.data} />
    </div>
  );
});

export const PlayGround = () => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%", padding: "0.5em", minHeight: "1000px" }}>
        <LeftSplit />
      </div>
      <div style={{ width: "50%", padding: "0.5em", minHeight: "1000px" }}>
        <RightSplit />
      </div>
    </div>
  );
};
