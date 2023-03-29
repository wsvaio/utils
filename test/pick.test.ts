import { describe, it } from "vitest";
import { compose } from "../src";

describe("pick", () => {
  it("first test", async () => {
    compose(
      async (ctx) => {
        console.log(ctx);
      },
      async (ctx) => {
        console.log("after");
      },
    )(
      async (ctx) => {
        console.log(ctx);
      },
      async (ctx) => {
        console.log("lsfkjaldjfk");
      },
    )({});
  });
});
