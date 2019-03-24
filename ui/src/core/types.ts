export type ComponentRenderer = {
  readonly "@type": string | string[];
  readonly fn: (data: any) => JSX.Element;
};
export type Renderer = {
  readonly name: string;
  readonly frame: object;
  readonly componentRenderers: ComponentRenderer[];
};
export type PreProcessedData = {
  readonly "@context": object | object[];
  readonly "@graph": object[];
};
