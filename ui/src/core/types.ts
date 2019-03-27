export type ComponentRenderer = {
  readonly isActive: (obj: any) => boolean;
  readonly fn: (data: any) => JSX.Element;
};
export type Renderer = {
  readonly name: string;
  readonly frame: object;
  readonly componentRenderers: ComponentRenderer[];
};
export type RenderContext = {
  readonly renderer: Renderer;
  readonly debugging: boolean;
};
export type PreProcessedData = {
  readonly "@context": object | object[];
  readonly "@graph": object[];
};
