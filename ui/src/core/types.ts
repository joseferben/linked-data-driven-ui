type ComponentRenderer = { "@type": string, fn: (data: any) => JSX.Element }
export type Renderer = { name: string, frame: object, componentRenderers: ComponentRenderer[] }
export type PreProcessedData = { "@context": object | object[], "@graph": object[] };
