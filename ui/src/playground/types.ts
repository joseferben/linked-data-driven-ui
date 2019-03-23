import { Renderer } from "../core/types";

export type UseCase = {
  readonly name: string,
  readonly title: string, compacted: object
};

export type AppState = {
  selectedUseCase: string,
  readonly useCases: UseCase[],
  selectedRenderer: string,
  readonly renderers: Renderer[]
}
