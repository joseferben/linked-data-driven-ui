import { Renderer } from "../types";

const renderer: Renderer = {
  name: "core",
  frame: (context: any) => ({ "@context": context, "@type": "Thing" }),
  componentRenderers: []
};
export default renderer;
