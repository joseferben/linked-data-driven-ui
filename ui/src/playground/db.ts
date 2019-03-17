import { observable } from "mobx";
import { AppState } from "./types";
import useCasesRaw from "./use-cases.json";

export const useCases: AppState = observable({
  selectedUseCase: "home-automation",
  data: useCasesRaw
});

export const compacted = observable({
  data: <any>useCasesRaw["home-automation"].data
});
