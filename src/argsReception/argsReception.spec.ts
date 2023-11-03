import { argsReception } from "./argsReception";

describe("argsReception", () => {
  describe("Undefined required arguments should throw", () => {
    it("should throw an error if NOTION_TOKEN is not defined", () => {
      expect(() => argsReception([])).toThrow("NOTION_TOKEN is not defined");
    });
    it("should throw an error if DATABASE_ID is not defined", () => {
      expect(() => argsReception(["NOTION_TOKEN=abab"])).toThrow(
        "DATABASE_ID is not defined"
      );
    });
  });
});
