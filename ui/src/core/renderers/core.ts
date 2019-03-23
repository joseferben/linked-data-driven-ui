import { Thing } from "../components/Thing";
import { Collection } from "../components/Collection";
import { Renderer } from "../types";

const renderer: Renderer = {
  name: "core",
  frame: (context: any) => ({ "@context": context, "@type": "Thing" }),
  componentRenderers: [
    { "@type": "http://schema.org/Thing", fn: (data: any) => Thing(data) },
    { "@type": "http://www.w3.org/ns/hydra/core#Collection", fn: (data: any) => Collection(data) }]
}

export default renderer;
