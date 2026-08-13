import { safeIdeaUrl, toggleWishlistLike } from "./WishlistPage";

describe("wishlist likes", () => {
  test("adds and removes a member's like", () => {
    const ideas = [{ id: "idea-1", likedByIds: [] }];
    const liked = toggleWishlistLike(ideas, "idea-1", "maya");
    expect(liked[0].likedByIds).toEqual(["maya"]);
    expect(toggleWishlistLike(liked, "idea-1", "maya")[0].likedByIds).toEqual([]);
  });

  test("does not change likes without a member identity", () => {
    const ideas = [{ id: "idea-1", likedByIds: [] }];
    expect(toggleWishlistLike(ideas, "idea-1", "")).toBe(ideas);
  });
});

describe("wishlist links", () => {
  test("accepts web links and rejects invalid links", () => {
    expect(safeIdeaUrl("example.com/tour")).toBe("https://example.com/tour");
    expect(safeIdeaUrl("https://example.com/stay")).toBe("https://example.com/stay");
    expect(safeIdeaUrl("https://")).toBe("");
  });
});
