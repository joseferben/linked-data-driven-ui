import { Maybe } from "tsmonad";

export const g = (o: object & { [key: string]: any }, k: string | number) => {
  const res = o[k];
  return (res === null || res === undefined)
    ? Maybe.nothing()
    : Maybe.just(res);
}
