import { parseArguments } from "./parseArguments";

describe("parseArguments", () => {
  describe("Undefined required arguments should throw", () => {
    it("should throw an error if NOTION_TOKEN is not defined", () => {
      expect(() => parseArguments([])).toThrow("NOTION_TOKEN is not defined");
    });
    it("should throw an error if DATABASE_ID is not defined", () => {
      expect(() => parseArguments(["NOTION_TOKEN=abab"])).toThrow(
        "DATABASE_ID is not defined"
      );
    });
  });
});
