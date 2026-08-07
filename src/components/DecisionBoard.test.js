jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }), { virtual: true });

import { applyPollVote } from "./DecisionBoard";

function poll(status = "open") {
  return {
    id: "poll-1",
    status,
    options: [
      { id: "option-a", voterIds: [] },
      { id: "option-b", voterIds: [] },
    ],
  };
}

describe("group decision voting", () => {
  test("casts one vote", () => {
    const [result] = applyPollVote([poll()], "poll-1", "option-a", "person-1");
    expect(result.options[0].voterIds).toEqual(["person-1"]);
    expect(result.options[1].voterIds).toEqual([]);
  });

  test("moves a person's vote to another option", () => {
    let state = applyPollVote([poll()], "poll-1", "option-a", "person-1");
    state = applyPollVote(state, "poll-1", "option-b", "person-1");
    expect(state[0].options[0].voterIds).toEqual([]);
    expect(state[0].options[1].voterIds).toEqual(["person-1"]);
  });

  test("removes a vote when the selected option is tapped again", () => {
    let state = applyPollVote([poll()], "poll-1", "option-a", "person-1");
    state = applyPollVote(state, "poll-1", "option-a", "person-1");
    expect(state[0].options.every((option) => option.voterIds.length === 0)).toBe(true);
  });

  test("does not change a closed vote", () => {
    const original = [poll("closed")];
    const result = applyPollVote(original, "poll-1", "option-a", "person-1");
    expect(result).toEqual(original);
  });
});
