type UseCase = { title: string, data: object };
export type AppState = { selectedUseCase: string, data: { [key: string]: UseCase } }
