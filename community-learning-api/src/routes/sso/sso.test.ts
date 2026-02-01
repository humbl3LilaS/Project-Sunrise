import { createTestApp } from "@utils/create-app";
import env from "@utils/env";
import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";
import ssoRouter from "./sso.index";

if (env.ENV !== "test") {
  throw new Error("ENV must be 'test'");
}

const client = testClient(createTestApp(ssoRouter));

describe("sso Routes Testing", () => {
  it("happy Path:/sso/sign-in with valid arguement", async () => {
    const res = await client.sso["sign-in"].$post({
      json: {
        email: "sabishinekobebe@gmail.com",
        password: "P@ssword123!",
      },
    });
    expect(res.status).toBe(200);
    if (res.status === 200) {
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.token).toBeTypeOf("string");
    }
  });
});
