import React, { useState, useEffect } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as jsonld from "jsonld";

import { JsonEditor } from "../JsonEditor";
import { LdRenderer } from "../../../core/components/LdRenderer";
import { AppState } from "../../types";
import useCases from "../../use-cases.json";

const LeftSplit = observer(({ state }: { state: AppState }) => {
  const handleChange = (evt: any) => {
    const {
      target: { value }
    } = evt;
    state.selectedUseCase = value;
  };
  return (
    <div>
      <h3>Data explorer</h3>
      <div style={{ marginBottom: "0.5em" }}>
        <label htmlFor="data-select">Choose data set: </label>
        <select id="data-select" onChange={handleChange}>
          {Object.keys(state.useCases).map(key => {
            return (
              <option value={key} key={key}>
                {key}
              </option>
            );
          })}
        </select>
        <JsonEditor content={state.useCases[state.selectedUseCase].data} />
      </div>
    </div>
  );
});

const RightSplit = ({ state }: { state: AppState }) => {
  const [expandedData, setState] = useState({});
  useEffect(() => {
    jsonld.expand(state.content).then((expanded: any) => setState(expanded));
  }, [state]);
  return (
    <div>
      <h3>Data renderer</h3>
      <LdRenderer linkedData={expandedData} />
    </div>
  );
};

const appState: AppState = observable({
  content: {},
  selectedUseCase: "home-automation",
  useCases: useCases
});

export const PlayGround = () => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%", padding: "0.5em", minHeight: "1000px" }}>
        <LeftSplit state={appState} />
      </div>
      <div style={{ width: "50%", padding: "0.5em", minHeight: "1000px" }}>
        <RightSplit state={appState} />
      </div>
    </div>
  );
};
