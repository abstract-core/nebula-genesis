import { ArgsOptions } from "../_types/ArgsOptions";
import { PropertyFilter } from "../_types/PropertyFilter";

export function parseArguments(argv: NodeJS.Process["argv"]): ArgsOptions {
  const args = argv.reduce((acc, cur) => {
    const [key, value] = cur.split("=");
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });

  const notionToken = args["NOTION_TOKEN"];
  if (!notionToken) throw new Error("NOTION_TOKEN is not defined");

  const databaseId = args["DATABASE_ID"];
  if (!databaseId) throw new Error("DATABASE_ID is not defined");

  const filters = args["FILTERS"]
    ? (JSON.parse(args["FILTERS"]) as PropertyFilter[])
    : undefined;
  if (filters) {
    console.log(`Filters enabled : ${JSON.stringify(filters, null, 2)}`);
  }

  const siteFolderPath = args["SITE_FOLDER_PATH"] || ".";
  if (siteFolderPath !== ".")
    console.log(`Site folder path override : ${siteFolderPath}`);

  const cacheFolderName = args["CACHE_FOLDER_NAME"] || undefined;
  if (cacheFolderName)
    console.log(`Cache folder name override : ${cacheFolderName}`);

  const onOrAfter = args["ON_OR_AFTER"] || undefined;
  if (onOrAfter) console.log(`Querying override : ${onOrAfter}`);

  const reinitCache = args["REINIT_CACHE"] ? true : undefined;
  if (onOrAfter) console.log("Cache reinitialization");

  const outputFormat = (args["OUTPUT_FORMAT"] as "md" | "json") || "md";
  console.log(`Output format : ${outputFormat}`);

  const astroCollectionName = args["ASTRO_COLLECTION_NAME"] || undefined;
  if (astroCollectionName)
    console.log(`Astro collection name : ${astroCollectionName}`);

  const containerWidth = args["CONTAINER_WIDTH"]
    ? parseInt(args["CONTAINER_WIDTH"])
    : 600;

  return {
    notionToken,
    databaseId,
    filters,
    siteFolderPath,
    cacheFolderName,
    onOrAfter,
    reinitCache,
    outputFormat,
    astroCollectionName,
    containerWidth,
  };
}
