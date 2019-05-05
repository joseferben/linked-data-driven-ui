export type Renderer = {
  id: string;
  name: string;
  comp: any;
  type: string;
};

export type Operation = {
  method: string;
  description: string;
  expects: any;
  requiresInput: boolean;
  returns: any;
  title: string;
  invoke: (data?: any) => Promise<any>;
};
