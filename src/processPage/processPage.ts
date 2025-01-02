import { Client } from "@notionhq/client";
import { writeFile } from "fs/promises";
import {
  ImageBlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getPageBlocks } from "./getPageBlocks/getPageBlocks";
import { createFolder } from "./createFolder/createFolder";
import { downloadFiles } from "./downloadFiles/downloadFiles";
import { downloadImage } from "./downloadImage/downloadImage";
import { ArgsOptions } from "../_types/ArgsOptions";
import { parseToMarkdown } from "./blocksToMarkdown/blocksToMarkdown";

export async function processPage(
  notionClient: Client,
  page: PageObjectResponse,
  {
    cachePath,
    siteFolderPath,
    outputFormat,
    astroCollectionName,
  }: { cachePath: string } & Pick<
    ArgsOptions,
    "siteFolderPath" | "outputFormat" | "astroCollectionName"
  >
) {
  const { blocks, images } = await getPageBlocks(notionClient, page.id);

  await createFolder(`${cachePath}/pages/${page.id}`);

  await downloadFiles(
    page,
    `${siteFolderPath}/${astroCollectionName ? "public" : "static"}`
  );

  await Promise.all(
    images.map(async ({ block, index }) => {
      console.log(`Downloading ${block.id} from ${page.id}`);

      const filename = await downloadImage(
        `${siteFolderPath}/${astroCollectionName ? "public" : "static"}`,
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
      ).file.url = `/${filename}`;
    })
  );

  if (outputFormat === "md") {
    const title =
      page.properties["Name"].type === "title"
        ? page.properties["Name"].title[0].plain_text
        : "Sans titre";
    await writeFile(
      astroCollectionName
        ? `${siteFolderPath}/src/pages/${astroCollectionName}/${
            title
              ?.toLowerCase()
              .replace("à", "a")
              .replace("é", "e")
              .replace("è", "e")
              .replace("ê", "e")
              .replace("ï", "i")
              .replace("ô", "o")
              .replace("û", "u")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || page.id
          }.md`
        : `${cachePath}/pages/${page.id}.md`,
      parseToMarkdown(title, blocks),
      "utf-8"
    );
  } else {
    await writeFile(
      `${cachePath}/pages/${page.id}/page.json`,
      JSON.stringify(blocks),
      "utf-8"
    );
  }
}
