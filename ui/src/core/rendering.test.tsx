import React from "react";
import { render } from "react-testing-library";
import "jest-dom/extend-expect";

import { render as r } from "./rendering";
import coreRenderer from "./renderers/core";

const renderHtml = (jsx: JSX.Element): string =>
  render(jsx).container.innerHTML;

describe("render with coreRenderer", () => {
  it("empty data", () => {
    const actual = renderHtml(r([], coreRenderer));
    const expected = renderHtml(<div />);
    expect(actual).toEqual(expected);
  });
});
