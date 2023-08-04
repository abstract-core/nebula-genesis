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
  return {
    notionToken,
    databaseId,
    cachePath: args["CACHE_PATH"] || "./cache",
    onOrAfter: args["ON_OR_AFTER"] || undefined,
  };
}
