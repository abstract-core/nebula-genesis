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
import { parseToMarkdown } from "./parseToMarkdown/parseToMarkdown";
import { PageSummary } from "../_types/PageSummary";

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
  >,
  pageSummary: { [id: string]: PageSummary }
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
    const { Name: name } = page.properties;
    const title =
      name.type === "title" ? name.title[0].plain_text : "Sans titre";
    await writeFile(
      astroCollectionName
        ? `${siteFolderPath}/src/data/${astroCollectionName}/${page.id}.md`
        : /** @todo Add an `astroFolderPath` script arg */
          `${cachePath}/pages/${page.id}.md`,
      parseToMarkdown(title, page.properties, blocks, pageSummary),
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
