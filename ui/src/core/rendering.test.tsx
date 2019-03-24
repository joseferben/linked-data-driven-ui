import React from "react";
import { render } from "react-testing-library";
import "jest-dom/extend-expect";

import { render as r } from "./rendering";
import { Renderer } from "./types";

import IotExpanded from "../playground/use-case-iot-expanded.json";

const testRenderer: Renderer = {
  name: "test",
  frame: (context: any) => ({ "@context": context, "@type": "Thing" }),
  componentRenderers: []
};

const testCtx = { renderer: testRenderer, debugging: false };

const renderHtml = (jsx: JSX.Element) => {
  return render(jsx).container.cloneNode(true);
};

describe("rendering with coreRenderer", () => {
  it("empty data", () => {
    const actual = renderHtml(r([], testCtx));
    const expected = renderHtml(<div />);
    expect(actual).toEqual(expected);
  });

  it("single data without @type", () => {
    const data = [{ "http://example/foo": [{ "@value": "bar" }] }];
    const actual = renderHtml(r(data, testCtx));
    const expected = renderHtml(
      <div>
        <div>
          <span>http://example/foo</span>
          <div>
            <div>
              <span>@value</span>
              <span>bar</span>
            </div>
          </div>
        </div>
      </div>
    );
    expect(actual).toEqual(expected);
  });

  it("data without @type", () => {
    const data = [
      { "http://example/foo": [{ "@value": "bar" }] },
      { "http://example/baz": [{ "@value": 42 }] }
    ];
    const actual = renderHtml(r(data, testCtx));
    const expected = renderHtml(
      <div>
        <div>
          <span>http://example/foo</span>
          <div>
            <div>
              <span>@value</span>
              <span>bar</span>
            </div>
          </div>
        </div>
        <div>
          <span>http://example/baz</span>
          <div>
            <div>
              <span>@value</span>
              <span>42</span>
            </div>
          </div>
        </div>
      </div>
    );
    expect(actual).toEqual(expected);
  });

  it("data with @type Thing", () => {
    const data = [
      {
        "@type": "http://schema.org/Thing",
        "http://example/foo": [{ "@value": "bar" }],
        "http://example/baz": [{ "@value": 42 }]
      }
    ];
    const actual = renderHtml(r(data, testCtx));
    const expected = renderHtml(
      <div>
        <div>
          <span>http://example/foo</span>
          <div>
            <div>
              <span>@value</span>
              <span>bar</span>
            </div>
          </div>
        </div>
        <div>
          <span>http://example/baz</span>
          <div>
            <div>
              <span>@value</span>
              <span>42</span>
            </div>
          </div>
        </div>
      </div>
    );
    expect(actual).toEqual(expected);
  });

  it("data with @type [Thing]", () => {
    const data = [
      {
        "@type": ["http://schema.org/Thing"],
        "http://example/foo": [{ "@value": "bar" }],
        "http://example/baz": [{ "@value": 42 }]
      }
    ];
    const actual = renderHtml(r(data, testCtx));
    const expected = renderHtml(
      <div>
        <div>
          <span>http://example/foo</span>
          <div>
            <div>
              <span>@value</span>
              <span>bar</span>
            </div>
          </div>
        </div>
        <div>
          <span>http://example/baz</span>
          <div>
            <div>
              <span>@value</span>
              <span>42</span>
            </div>
          </div>
        </div>
      </div>
    );
    expect(actual).toEqual(expected);
  });

  it("data representing empty a hydra collection ", () => {
    const data = [
      {
        "@type": "http://www.w3.org/ns/hydra/core#Collection",
        "http://example/foo": [{ "@value": "bar" }],
        "http://example/baz": [{ "@value": 42 }],
        "http://www.w3.org/ns/hydra/core#member": []
      }
    ];
    const actual = renderHtml(r(data, testCtx));
    const expected = renderHtml(
      <div>
        <div>
          <span>http://example/foo</span>
          <div>
            <div>
              <span>@value</span>
              <span>bar</span>
            </div>
          </div>
        </div>
        <div>
          <span>http://example/baz</span>
          <div>
            <div>
              <span>@value</span>
              <span>42</span>
            </div>
          </div>
        </div>
        <div>
          <span>http://www.w3.org/ns/hydra/core#member</span>
          <div />
        </div>
      </div>
    );
    expect(actual).toEqual(expected);
  });

  it("data representing hydra collection ", () => {
    const data = [
      {
        "@type": "http://www.w3.org/ns/hydra/core#Collection",
        "http://example/foo": [{ "@value": "bar" }],
        "http://example/baz": [{ "@value": 42 }],
        "http://www.w3.org/ns/hydra/core#member": [
          { "http://example/hey": [{ "@value": "ho" }] }
        ]
      }
    ];
    const actual = renderHtml(r(data, testCtx));
    const expected = renderHtml(
      <div>
        <div>
          <span>http://example/foo</span>
          <div>
            <div>
              <span>@value</span>
              <span>bar</span>
            </div>
          </div>
        </div>
        <div>
          <span>http://example/baz</span>
          <div>
            <div>
              <span>@value</span>
              <span>42</span>
            </div>
          </div>
        </div>
        <div>
          <span>http://www.w3.org/ns/hydra/core#member</span>
          <div>
            <div>
              <span>http://example/hey</span>
              <div>
                <div>
                  <span>@value</span>
                  <span>ho</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    expect(actual).toEqual(expected);
  });

  it("iot data", () => {
    expect(renderHtml(r(IotExpanded, testCtx))).toBeTruthy();
  });
});
