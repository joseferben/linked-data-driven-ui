export type Node = {
  id: string;
  name: string;
  data: { [index: string]: any };
  state: { expanded: boolean };
  children: Node[];
};

export type RenderableNode = {
  onChange: Function;
  measure: Function;
  node: {
    id: string;
    name: string;
    data: { [index: string]: number | string | boolean };
  };
  children: [];
};
