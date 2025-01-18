#!/usr/bin/env node
import { Client } from "@notionhq/client";
import { parseArguments } from "./src/parseArguments/parseArguments";
import { createFolder } from "./src/processPage/createFolder/createFolder";
import { getCacheMetadata } from "./src/getCacheMetadata/getCacheMetadata";
import { getDatabasePages } from "./src/getDatabasePages/getDatabasePages";
import { writeFile } from "fs/promises";
import { mergeCachedUpdatedPages } from "./src/mergeCachedUpdatedPages/mergeCachedUpdatedPages";
import { processPage } from "./src/processPage/processPage";

async function run() {
  const {
    notionToken,
    databaseId,
    filters,
    siteFolderPath,
    cacheFolderName,
    onOrAfter,
    reinitCache,
    outputFormat,
    astroCollectionName,
  } = parseArguments(process.argv);

  const cachePath = `${siteFolderPath}/cache${
    cacheFolderName ? `/${cacheFolderName}` : ""
  }`;

  await createFolder(cachePath);

  const { LAST_RUN } = await getCacheMetadata(cachePath, onOrAfter);

  const notionClient = new Client({ auth: notionToken });

  const updatedPages = await getDatabasePages(
    notionClient,
    databaseId,
    reinitCache ? undefined : LAST_RUN,
    filters
  );

  const pages = reinitCache
    ? updatedPages
    : await mergeCachedUpdatedPages(cachePath, updatedPages);

  await writeFile(`${cachePath}/pages.json`, JSON.stringify(pages), "utf-8");

  await createFolder(`${cachePath}/pages`);
  if (astroCollectionName)
    await createFolder(`${siteFolderPath}/src/data/${astroCollectionName}`);
  else await createFolder(`${siteFolderPath}/static`);

  await Promise.all(
    updatedPages.map((page) =>
      processPage(notionClient, page, {
        cachePath,
        siteFolderPath,
        outputFormat,
        astroCollectionName,
      })
    )
  );

  console.log("Done!");
}

run();
