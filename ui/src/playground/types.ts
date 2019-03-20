import { Renderer } from "../core/types";

export type UseCase = { name: string, title: string, compacted: object };
export type AppState = {
  selectedUseCase: string,
  useCases: UseCase[],
  selectedRenderer: string,
  renderers: Renderer[]
}
