import { describe, it } from "vitest";
import { pick } from "./../src/pick";

describe("pick", () => {
  it("first test", async () => {
    console.log(pick({ a: 1, b: 2, c: 3 }, ["a", "b"]));
  });
});
