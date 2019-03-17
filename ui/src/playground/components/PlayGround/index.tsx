import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import { JsonEditor } from "../JsonEditor";
import { LdRenderer } from "../../../core/components/LdRenderer";
import { useCases, compacted } from "../../db";
import { frame } from "../../../core/jsonld";

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

const PreprocessedData = ({ data }: { data: any }) => {
  const [framed, setState] = useState({ "@context": {}, "@graph": [{}] });

  useEffect(() => {
    frame(data).then(res => {
      setState(res);
    });
  }, [data]);

  return (
    <div>
      <h3>Preprocessed data</h3>
      <textarea
        style={{ height: "600px", width: "100%" }}
        readOnly
        value={JSON.stringify(framed, null, 2)}
      />
    </div>
  );
};

const RenderedData = ({ data }: { data: any }) => {
  const [framed, setState] = useState({ "@context": {}, "@graph": [{}] });

  useEffect(() => {
    frame(data).then(res => setState(res));
  }, [data]);

  return <LdRenderer data={framed} />;
};

export const PlayGround = observer(() => {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", padding: "0.5em", minHeight: "600px" }}>
          <DataExplorer />
        </div>
        <div style={{ width: "50%", padding: "0.5em", minHeight: "600px" }}>
          <PreprocessedData data={compacted.data} />
        </div>
      </div>
      <div>
        <div style={{ width: "100%", padding: "0.5em" }}>
          <RenderedData data={compacted.data} />
        </div>
      </div>
    </div>
  );
});
