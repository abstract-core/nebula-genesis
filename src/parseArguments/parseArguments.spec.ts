import { PropertyFilter } from "../_types/PropertyFilter";
import { parseArguments } from "./parseArguments";

describe("parseArguments", () => {
  const NOTION_TOKEN = "9za87f8z7efa9z8a7z98f";
  const DATABASE_ID = "6vz8aev98z7v98z7ev89az7";
  describe("Undefined required arguments should throw", () => {
    it("should throw an error if NOTION_TOKEN is not defined", () => {
      expect(() => parseArguments([])).toThrow("NOTION_TOKEN is not defined");
    });
    it("should throw an error if DATABASE_ID is not defined", () => {
      expect(() => parseArguments([`NOTION_TOKEN=${NOTION_TOKEN}`])).toThrow(
        "DATABASE_ID is not defined"
      );
    });
  });
  describe("Given arguments resolution", () => {
    const ARGV: NodeJS.Process["argv"] = [
      `NOTION_TOKEN=${NOTION_TOKEN}`,
      `DATABASE_ID=${DATABASE_ID}`,
    ];
    beforeAll(() => {
      jest.spyOn(console, "log").mockImplementation(() => {});
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    it("should return given required arguments", () => {
      const { notionToken, databaseId } = parseArguments(ARGV);
      expect(notionToken).toBe(NOTION_TOKEN);
      expect(databaseId).toBe(DATABASE_ID);
    });
    describe("FILTERS arg behavior", () => {
      it("should return undefined if FILTERS is not defined", () => {
        const { filters } = parseArguments(ARGV);
        expect(filters).toBeUndefined();
      });
      it("should return given FILTERS if defined", () => {
        const FILTERS: PropertyFilter[] = [
          {
            title: {
              starts_with: "Étude",
            },
            property: "Name",
          },
          {
            status: {
              equals: "Publié",
            },
            property: "Statut",
          },
        ];
        const STRING_FILTERS = JSON.stringify(FILTERS, null, 2);
        const { filters } = parseArguments([
          ...ARGV,
          `FILTERS=${STRING_FILTERS}`,
        ]);
        expect(filters).toEqual(FILTERS);
        expect(console.log).toHaveBeenCalledWith(
          `Filters enabled : ${STRING_FILTERS}`
        );
      });
    });
    describe("SITE_FOLDER_PATH arg behavior", () => {
      it('siteFolderPath should be "." if SITE_FOLDER_PATH is not defined', () => {
        const { siteFolderPath } = parseArguments(ARGV);
        expect(siteFolderPath).toBe(".");
      });
      it("should return given SITE_FOLDER_PATH if defined", () => {
        const SITE_FOLDER_PATH = "../site-project";
        const { siteFolderPath } = parseArguments([
          ...ARGV,
          `SITE_FOLDER_PATH=${SITE_FOLDER_PATH}`,
        ]);
        expect(siteFolderPath).toBe(SITE_FOLDER_PATH);
        expect(console.log).toHaveBeenCalledWith(
          `Site folder path override : ${SITE_FOLDER_PATH}`
        );
      });
    });
    describe("CACHE_FOLDER_NAME arg behavior", () => {
      it("should return undefined if CACHE_FOLDER_NAME is not defined", () => {
        const { cacheFolderName } = parseArguments(ARGV);
        expect(cacheFolderName).toBeUndefined();
      });
      it("should return given CACHE_FOLDER_NAME if defined", () => {
        const CACHE_FOLDER_NAME = "cache";
        const { cacheFolderName } = parseArguments([
          ...ARGV,
          `CACHE_FOLDER_NAME=${CACHE_FOLDER_NAME}`,
        ]);
        expect(cacheFolderName).toBe(CACHE_FOLDER_NAME);
        expect(console.log).toHaveBeenCalledWith(
          `Cache folder name override : ${CACHE_FOLDER_NAME}`
        );
      });
    });
    describe("ON_OR_AFTER arg behavior", () => {
      it("should return undefined if ON_OR_AFTER is not given", () => {
        const { onOrAfter } = parseArguments(ARGV);
        expect(onOrAfter).toBeUndefined();
      });
      it("should return given ON_OR_AFTER if defined", () => {
        const ON_OR_AFTER = "2021-01-01";
        const { onOrAfter } = parseArguments([
          ...ARGV,
          `ON_OR_AFTER=${ON_OR_AFTER}`,
        ]);
        expect(onOrAfter).toBe(ON_OR_AFTER);
        expect(console.log).toHaveBeenCalledWith(
          `Querying override : ${ON_OR_AFTER}`
        );
      });
    });
    describe("REINIT_CACHE arg behavior", () => {
      it("should return undefined if REINIT_CACHE is not given", () => {
        const { reinitCache } = parseArguments(ARGV);
        expect(reinitCache).toBeUndefined();
      });
      it("should return true if REINIT_CACHE is defined", () => {
        const { reinitCache } = parseArguments([...ARGV, "REINIT_CACHE=true"]);
        expect(reinitCache).toBe(true);
        expect(console.log).toHaveBeenCalledWith("Cache reinitialization");
      });
    });
  });
});
