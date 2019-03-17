type UseCase = { title: string, data: object };
export type AppState = { content: any, selectedUseCase: string, useCases: { [key: string]: UseCase } }
