import { it } from "vitest";
import { deepOmit } from "../src";

it("测试", () => {
  const r = deepOmit({ a: 1, b: 2, c: 3, d: { f: 1, e: { h: 2 } } }, "a", "d.f");
  console.log(r);
});
