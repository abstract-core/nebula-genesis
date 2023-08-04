import { Client } from "@notionhq/client";
import { argsReception } from "./src/argsReception/argsReception";
import { createFolder } from "./src/createFolder/createFolder";
import { getCacheMetadata } from "./src/getCacheMetadata/getCacheMetadata";
import { getDatabasePages } from "./src/getDatabasePages/getDatabasePages";
import { writeFile } from "fs/promises";
import { mergeCachedUpdatedPages } from "./src/mergeCachedUpdatedPages/mergeCachedUpdatedPages";
import { getPageBlocks } from "./src/getPageBlocks/getPageBlocks";
import { downloadImage } from "./src/downloadImage/downloadImage";

async function run() {
  const { notionToken, databaseId, cachePath, onOrAfter } = argsReception();

  await createFolder(cachePath);

  const { LAST_RUN } = await getCacheMetadata(cachePath, onOrAfter);

  const notionClient = new Client({ auth: notionToken });

  const updatedPages = await getDatabasePages(
    notionClient,
    databaseId,
    LAST_RUN
  );

  const pages = await mergeCachedUpdatedPages(cachePath, updatedPages);

  await writeFile(`${cachePath}/pages.json`, JSON.stringify(pages), "utf-8");

  await createFolder(`${cachePath}/pages`);

  Promise.all(
    updatedPages.map(async (page) => {
      const { blocks, images } = await getPageBlocks(notionClient, page.id);

      await createFolder(`${cachePath}/pages/${page.id}`);

      await writeFile(
        `${cachePath}/pages/${page.id}/page.json`,
        JSON.stringify(blocks),
        "utf-8"
      );

      Promise.all(
        images.map(async (image) => {
          console.log(`Downloading ${image.id} from ${page.id}`);

          await downloadImage(cachePath, page.id, image);
        })
      );
    })
  );
}

run();
