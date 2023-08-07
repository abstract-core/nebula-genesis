export function argsReception() {
  const args = process.argv.reduce((acc, cur) => {
    const [key, value] = cur.split("=");
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });

  const notionToken = args["NOTION_TOKEN"];
  if (!notionToken) throw new Error("NOTION_TOKEN is not defined");

  const databaseId = args["DATABASE_ID"];
  if (!databaseId) throw new Error("DATABASE_ID is not defined");

  const siteFolderPath = args["SITE_FOLDER_PATH"] || ".";
  if (siteFolderPath)
    console.log(`Site folder path override : ${siteFolderPath}`);

  const cacheFolderName = args["CACHE_FOLDER_NAME"] || undefined;
  if (cacheFolderName)
    console.log(`Cache folder name override : ${cacheFolderName}`);

  const onOrAfter = args["ON_OR_AFTER"] || undefined;
  if (onOrAfter) console.log(`Querying override : ${onOrAfter}`);

  return {
    notionToken,
    databaseId,
    siteFolderPath,
    cacheFolderName,
    onOrAfter,
  };
}
