import { describe, expect, it } from "vitest";
import { createClientId } from "./clientId";

describe("createClientId", () => {
  it("creates an id when crypto.randomUUID is unavailable", () => {
    const id = createClientId({ crypto: {} } as Window);

    expect(id).toMatch(/^client-/);
  });
});
