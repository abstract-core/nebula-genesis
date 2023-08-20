import { Client } from "@notionhq/client";
import { argsReception } from "./src/argsReception/argsReception";
import { createFolder } from "./src/createFolder/createFolder";
import { getCacheMetadata } from "./src/getCacheMetadata/getCacheMetadata";
import { getDatabasePages } from "./src/getDatabasePages/getDatabasePages";
import { writeFile } from "fs/promises";
import { mergeCachedUpdatedPages } from "./src/mergeCachedUpdatedPages/mergeCachedUpdatedPages";
import { getPageBlocks } from "./src/getPageBlocks/getPageBlocks";
import { downloadImage } from "./src/downloadImage/downloadImage";
import {
  ImageBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { downloadFiles } from "./src/downloadFiles/downloadFiles";

async function run() {
  const {
    notionToken,
    databaseId,
    filters,
    siteFolderPath,
    cacheFolderName,
    onOrAfter,
    reinitCache,
  } = argsReception();

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
  await createFolder(`${siteFolderPath}/static`);

  Promise.all(
    updatedPages.map(async (page) => {
      const { blocks, images } = await getPageBlocks(notionClient, page.id);

      await createFolder(`${cachePath}/pages/${page.id}`);

      await downloadFiles(page, `${siteFolderPath}/static`);

      await Promise.all(
        images.map(async ({ block, index }) => {
          console.log(`Downloading ${block.id} from ${page.id}`);

          const filename = await downloadImage(
            `${siteFolderPath}/static`,
            block
          );

          (
            (blocks[index] as ImageBlockObjectResponse).image as {
              type: "file";
              file: {
                url: string;
                expiry_time: string;
              };
              caption: Array<RichTextItemResponse>;
            }
          ).file.url = `./${filename}`;
        })
      );

      await writeFile(
        `${cachePath}/pages/${page.id}/page.json`,
        JSON.stringify(blocks),
        "utf-8"
      );
    })
  );
}

run();
