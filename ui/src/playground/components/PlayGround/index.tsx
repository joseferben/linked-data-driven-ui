import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import * as jsonld from "jsonld";

import { JsonEditor } from "../JsonEditor";
import { LdRenderer } from "../../../core/components/LdRenderer";
import { useCases, compacted } from "../../db";

const DataExplorer = observer(() => {
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

const Expander = (compacted: any) => {
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

  return (
    <textarea
      style={{ height: "600px", width: "100%" }}
      readOnly
      value={JSON.stringify(expandedData, null, 2)}
    />
  );
};

const ExpandedData = observer(() => {
  return (
    <div>
      <h3>Expanded data</h3>
      <Expander data={compacted.data} />
    </div>
  );
});

const RenderedData = observer(() => {
  return (
    <div>
      <h3>Renderer</h3>
      <Renderer data={compacted.data} />
    </div>
  );
});

export const PlayGround = () => {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", padding: "0.5em", minHeight: "600px" }}>
          <DataExplorer />
        </div>
        <div style={{ width: "50%", padding: "0.5em", minHeight: "600px" }}>
          <ExpandedData />
        </div>
      </div>
      <div>
        <div style={{ width: "100%", padding: "0.5em" }}>
          <RenderedData />
        </div>
      </div>
    </div>
  );
};
