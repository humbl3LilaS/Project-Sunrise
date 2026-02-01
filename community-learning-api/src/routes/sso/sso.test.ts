import { createTestApp } from "@utils/create-app";
import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";
import ssoRouter from "./sso.index";

const client = testClient(createTestApp(ssoRouter));

describe("sso Routes Testing", () => {
  it("happy Path:/sso/sign-in with valid arguement", async () => {
    const res = await client.sso["sign-in"].$post({
      json: {
        email: "sabishinekobebe@gmail.com",
        password: "S@nlinn1892001",
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
