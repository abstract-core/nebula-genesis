import { Client } from "@notionhq/client";
import { argsReception } from "./src/argsReception/argsReception";
import { createFolder } from "./src/createFolder/createFolder";
import { getCacheMetadata } from "./src/getCacheMetadata/getCacheMetadata";
import { getDatabasePages } from "./src/getDatabasePages/getDatabasePages";
import { writeFile } from "fs/promises";

async function run() {
  const { notionToken, databaseId, cachePath } = argsReception();

  await createFolder(cachePath);

  const { LAST_RUN } = await getCacheMetadata(cachePath);

  const notionClient = new Client({ auth: notionToken });

  const pages = await getDatabasePages(notionClient, databaseId, LAST_RUN);

  await writeFile(`${cachePath}/pages.json`, JSON.stringify(pages), "utf-8");
}

run();
