import React from "react";
import { render, prettyDOM } from "react-testing-library";
import "jest-dom/extend-expect";

import { render as r } from "./rendering";
import { Renderer } from "./types";

const thingRenderer = (props: any) => {
  return <span />;
};

const collectionRenderer = (props: any) => {
  return <span />;
};

const thingCollectionRenderer = (props: any) => {
  return <span />;
};

// TODO move to core render config and import
const coreRenderer: Renderer = {
  name: "core",
  frame: (context: any) => ({ "@context": context, "@type": "Thing" }),
  componentRenderers: [
    {
      "@type": [
        "http://schema.org/Thing",
        "http://www.w3.org/ns/hydra/core#Collection"
      ],
      fn: (data: any) => collectionRenderer(data)
    },
    {
      "@type": "http://www.w3.org/ns/hydra/core#Collection",
      fn: (data: any) => collectionRenderer(data)
    },
    {
      "@type": "http://schema.org/Thing",
      fn: (data: any) => thingRenderer(data)
    }
  ]
};

const renderHtml = (jsx: JSX.Element) => {
  return render(jsx).container.cloneNode(true);
};

describe("rendering with coreRenderer", () => {
  it("empty data", () => {
    const actual = renderHtml(r([], coreRenderer));
    const expected = renderHtml(<div />);
    expect(actual).toEqual(expected);
  });

  it("some data without @type", () => {
    const data = [{ foo: "bar", baz: 42 }];
    const actual = renderHtml(r(data, coreRenderer));
    const expected = renderHtml(
      <div>
        <div>
          <span>foo</span>
          <span>bar</span>
        </div>
        <div>
          <span>baz</span>
          <span>42</span>
        </div>
      </div>
    );
    expect(actual).toEqual(expected);
  });

  it("a Thing", () => {
    const data = [{ "@type": "http://schema.org/Thing", foo: "bar", baz: 42 }];
    const actual = renderHtml(r(data, coreRenderer));
    const expected = renderHtml(
      <div>
        <div>
          <span>foo</span>
          <span>bar</span>
        </div>
        <div>
          <span>baz</span>
          <span>42</span>
        </div>
      </div>
    );
    expect(actual).toEqual(expected);
  });
});

describe("get applicable renderer", () => {
  const thingRenderer = () => <div />;
  const collectionRenderer = () => <div />;
  const collectionThingRenderer = () => <div />;

  const renderer: Renderer = {
    name: "core",
    frame: (context: any) => ({ "@context": context, "@type": "Thing" }),
    componentRenderers: [
      {
        "@type": [
          "http://schema.org/Thing",
          "http://www.w3.org/ns/hydra/core#Collection"
        ],
        fn: collectionThingRenderer
      },
      {
        "@type": "http://www.w3.org/ns/hydra/core#Collection",
        fn: collectionRenderer
      },
      {
        "@type": "http://schema.org/Thing",
        fn: thingRenderer
      }
    ]
  };

  it("with no @type", () => {
    //
  });
});
