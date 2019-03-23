import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Maybe } from "tsmonad";

import { JsonEditor } from "../JsonEditor";
import { render } from "../../../core/rendering";
import { state, toRender, selectedRenderer } from "../../db";
import { frame, expand } from "../../../core/jsonld";
import { Renderer } from "../../../core/types";

const DataExplorer = observer(() => {
  const handleChange = (evt: any) => {
    const {
      target: { value }
    } = evt;
    state.selectedUseCase = value;
    toRender.data = state.useCases.find(useCase => useCase.name === value);
  };
  return (
    <div>
      <h3>Data explorer</h3>
      <div style={{ marginBottom: "0.5em" }}>
        <label htmlFor="data-select">
          Choose compacted server response data:{" "}
        </label>
        <select id="data-select" onChange={handleChange}>
          {state.useCases.map(useCase => {
            return (
              <option value={useCase.name} key={useCase.name}>
                {useCase.title}
              </option>
            );
          })}
        </select>
        <JsonEditor
          content={
            (
              state.useCases.find(
                useCase => useCase.name === state.selectedUseCase
              ) || { compacted: "Not found" }
            ).compacted
          }
          compacted={toRender}
        />
      </div>
    </div>
  );
});

const RendererSelector = observer(() => {
  const handleChange = (evt: any) => {
    const {
      target: { value }
    } = evt;
    state.selectedRenderer = value;
  };
  return (
    <div>
      <h3>Renderer selection</h3>
      <div style={{ marginBottom: "0.5em" }}>
        <label htmlFor="data-select">Choose renderer: </label>
        <select id="data-select" onChange={handleChange}>
          {state.renderers.map(r => {
            return (
              <option value={r.name} key={r.name}>
                {r.name}
              </option>
            );
          })}
        </select>
        <textarea
          style={{ height: "600px", width: "100%" }}
          readOnly
          value={JSON.stringify(
            state.renderers.find(
              renderer => renderer.name === state.selectedRenderer
            ),
            null,
            2
          )}
        />
      </div>
    </div>
  );
});

const FramedData = ({ data }: { data: any }) => {
  const [framed, setState] = useState({});

  useEffect(() => {
    frame(data).then(res => {
      setState(res);
    });
  }, [data]);

  return (
    <div>
      <h3>Framed data</h3>
      <textarea
        style={{ height: "600px", width: "100%" }}
        readOnly
        value={JSON.stringify(framed, null, 2)}
      />
    </div>
  );
};

const Canvas = ({
  data,
  renderer
}: {
  data: any;
  renderer: Maybe<Renderer>;
}) => {
  const [expanded, setState] = useState([{}]);

  useEffect(() => {
    expand(data).then(res => {
      setState(res);
    });
  }, [data, renderer]);

  return renderer.caseOf({
    just: r => render(expanded, r),
    nothing: () => null
  });
};

export const PlayGround = observer(() => {
  const renderer = selectedRenderer(state);
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "33%", padding: "0.5em", minHeight: "600px" }}>
          <DataExplorer />
        </div>
        <div style={{ width: "33%", padding: "0.5em", minHeight: "600px" }}>
          <RendererSelector />
        </div>
        <div style={{ width: "33%", padding: "0.5em", minHeight: "600px" }}>
          <FramedData data={toRender.data} />
        </div>
      </div>
      <div>
        <div style={{ width: "100%", padding: "0.5em" }}>
          <Canvas data={toRender.data} renderer={renderer} />
        </div>
      </div>
    </div>
  );
});
