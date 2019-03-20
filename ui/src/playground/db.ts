import { observable } from "mobx";
import { AppState } from "./types";
import IotData from "./use-case-iot-compacted.json";
import CoreRenderer from "../core/renderers/core";

export const state: AppState = observable({
  selectedUseCase: "iot-home-automation",
  selectedRenderer: "core",
  useCases: [{ name: "iot-home-automation", title: "Home automation IOT", compacted: IotData }],
  renderers: [CoreRenderer]
});

export const toRender = observable({
  data: <any>IotData
});
