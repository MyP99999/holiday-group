import { nativeAuthRedirect, nativeAuthResult } from "./nativeApp";

describe("native app auth links", () => {
  test("creates a callback that preserves the requested room destination", () => {
    const redirect = nativeAuthRedirect("/online/lobby?room=ABC123", "oauth");
    const parsed = new URL(redirect);

    expect(parsed.protocol).toBe("com.holidaysplits.app:");
    expect(parsed.host).toBe("auth");
    expect(parsed.pathname).toBe("/callback");
    expect(parsed.searchParams.get("returnPath")).toBe("/online/lobby?room=ABC123");
    expect(parsed.searchParams.get("mode")).toBe("oauth");
  });

  test("reads Supabase tokens from the callback fragment", () => {
    const result = nativeAuthResult(
      "com.holidaysplits.app://auth/callback?returnPath=%2Fonline%2Flobby&mode=oauth"
        + "#access_token=access-token&refresh_token=refresh-token"
    );

    expect(result).toMatchObject({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      mode: "oauth",
      returnPath: "/online/lobby",
      error: "",
    });
  });

  test("rejects an external return path", () => {
    const result = nativeAuthResult(
      "com.holidaysplits.app://auth/callback?returnPath=%2F%2Fevil.example#code=test"
    );

    expect(result.returnPath).toBe("/online/lobby");
  });
});
